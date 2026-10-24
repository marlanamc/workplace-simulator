import { expect, test } from '@playwright/test';

// The API is fully mocked: no accounts or database writes.
test('a failed guest transfer is counted once after reload and acknowledgement', async ({ page }) => {
  const guest = { version: 1, mode: 'guided', attempts: 1, modes: ['guided'], completedAt: '2026-10-24T10:00:00Z' };
  let server = { ...guest, attempts: 2, modes: ['guided', 'guided'] };
  const writes: number[] = [];
  await page.route('**/api/lessons?lesson=account-recovery', async route => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ json: { signedIn: true, owner: 'retry-owner', state: server } });
    } else {
      const body = route.request().postDataJSON();
      writes.push(body.attempt.attempts);
      if (writes.length === 1) {
        server = body.attempt; // The write landed, but its acknowledgement was lost.
        await route.fulfill({ status: 503 });
      }
      else {
        server = body.attempt;
        await route.fulfill({ json: { saved: true } });
      }
    }
  });
  await page.addInitScript(value => {
    if (!sessionStorage.getItem('retry-fixture-seeded')) {
      sessionStorage.setItem('retry-fixture-seeded', '1');
      sessionStorage.setItem('lesson-attempt:account-recovery:transfer', JSON.stringify(value));
      localStorage.setItem('lesson-attempt:account-recovery:guest', JSON.stringify(value));
    }
  }, guest);
  await page.goto('/lessons/account-recovery?transfer=1');
  await expect.poll(() => writes).toEqual([3]);
  await page.reload();
  await expect.poll(() => writes).toEqual([3, 3]);
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('lesson-attempt:account-recovery:transfer'))).toBeNull();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('lesson-attempt:account-recovery:retry-owner'))).toBeNull();
  await page.reload();
  await expect.poll(() => server.attempts).toBe(3);
});

async function finishLesson(page: import('@playwright/test').Page) {
  await page.getByTestId('lesson-intro-start').click();
  await page.getByTestId('practice-email').fill('you@harborsidecafe.com');
  await page.getByPlaceholder('Enter your password').fill('Harbor2026');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.getByTestId('phone-texts').getByRole('button', { name: /^Google/ }).click();
  await page.getByPlaceholder('000000').fill('482915');
  await page.getByRole('button', { name: 'Verify', exact: true }).click();
  await expect(page.getByTestId('lesson-practice-again')).toBeVisible();
}

for (const failure of ['503', 'network'] as const) {
  test(`failed session lookup (${failure}) keeps finishes for account retry`, async ({ page }) => {
    let reads = 0;
    let failing = true;
    const writes: number[] = [];
    await page.route('**/api/lessons?lesson=account-recovery', async route => {
      if (route.request().method() === 'PUT') {
        writes.push(route.request().postDataJSON().attempt.attempts);
        await route.fulfill({ json: { saved: true } });
      } else if (failing) {
        reads++;
        if (failure === 'network') await route.abort();
        else await route.fulfill({ status: 503, json: { signedIn: true, error: true } });
      } else {
        await route.fulfill({ json: { signedIn: true, owner: 'recovered-owner', state: { version: 1, mode: 'guided', modes: ['guided', 'guided'], attempts: 2 } } });
      }
    });
    await page.goto('/lessons/account-recovery');
    await expect.poll(() => reads).toBeGreaterThan(0);
    await finishLesson(page);
    expect(await page.evaluate(() => localStorage.getItem('lesson-attempt:account-recovery:guest'))).toBeNull();
    failing = false;
    await page.getByTestId('lesson-retry-save').click();
    await expect.poll(() => writes).toEqual([3]);
    expect(await page.evaluate(() => sessionStorage.getItem('lesson-attempt:account-recovery:unresolved'))).toBeNull();
  });
}

for (const signedIn of [true, false]) {
  test(`a finish during session lookup survives (${signedIn ? 'account' : 'guest'})`, async ({ page }) => {
    let release!: () => void;
    const held = new Promise<void>(resolve => { release = resolve; });
    const writes: number[] = [];
    const initial = { version: 1, mode: 'guided', modes: ['guided', 'guided'], attempts: 2 };
    if (!signedIn) await page.addInitScript(value => localStorage.setItem('lesson-attempt:account-recovery:guest', JSON.stringify(value)), initial);
    await page.route('**/api/lessons?lesson=account-recovery', async route => {
      if (route.request().method() === 'GET') {
        await held;
        await route.fulfill({ json: signedIn ? { signedIn: true, owner: 'slow-owner', state: initial } : { signedIn: false } });
      } else {
        writes.push(route.request().postDataJSON().attempt.attempts);
        await route.fulfill({ json: { saved: true } });
      }
    });
    await page.goto('/lessons/account-recovery');
    await finishLesson(page);
    expect(writes).toEqual([]);
    release();
    if (signedIn) await expect.poll(() => writes).toEqual([3]);
    else await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('lesson-attempt:account-recovery:guest') || '{}').attempts)).toBe(3);
  });
}

test('two lesson tabs send distinct finish events and retain both contributions', async ({ context }) => {
  const receipts = new Set<string>();
  let count = 2;
  const batches: string[][] = [];
  await context.route('**/api/lessons?lesson=account-recovery', async route => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ json: { signedIn: true, owner: 'shared-owner', state: { version: 1, attempts: count, mode: 'guided', modes: ['guided', 'guided'] } } });
    } else {
      const events = route.request().postDataJSON().events;
      batches.push(events.map((event: { id: string }) => event.id));
      for (const event of events) {
        if (!receipts.has(event.id)) { count += event.attempt.attempts; receipts.add(event.id); }
      }
      await route.fulfill({ json: { saved: true } });
    }
  });
  const first = await context.newPage(), second = await context.newPage();
  await Promise.all([first.goto('/lessons/account-recovery'), second.goto('/lessons/account-recovery')]);
  await Promise.all([finishLesson(first), finishLesson(second)]);
  await expect.poll(() => count).toBe(4);
  expect(batches).toHaveLength(2);
  expect(receipts.size).toBe(2);
});

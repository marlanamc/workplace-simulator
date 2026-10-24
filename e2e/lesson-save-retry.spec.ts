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
      writes.push(body.attempts);
      if (writes.length === 1) await route.fulfill({ status: 503 });
      else {
        server = body;
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

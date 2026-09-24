import { test, expect, type Page } from '@playwright/test';

test.use({ viewport: { width: 1366, height: 768 } });
async function signup(page: Page, lang: 'en' | 'es') {
  await page.goto('/login');
  if (lang === 'es') await page.getByRole('button', { name: 'Español' }).click();
  await page.getByRole('button', { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder('Jordan').fill(`Pointer ${lang} ${Date.now()}`);
  await page.getByPlaceholder('HARBOR-24').fill('TEST-E2E');
  await page.locator('input[placeholder="••••"]').first().fill('1234');
  await page.getByRole('button', { name: /^(Add|Agregar)$/ }).click();
  await page.getByTestId('welcome-continue').click();
  await expect(page.locator('[data-job-card]')).toBeVisible();
}
const practiceName = /Practice clicking and scrolling|Practicar clics y desplazamiento/;
const startName = /Start looking around|Empezar a mirar/;
const skipName = /Skip practice|Omitir práctica/;

for (const lang of ['en', 'es'] as const) {
  test(`optional practice, keyboard, scrolling and reload (${lang})`, async ({ page }) => {
    test.slow();
    await signup(page, lang);
    const card = page.locator('[data-job-card]');
    await card.getByRole('button', { name: practiceName }).click();
    await expect(card).toHaveAttribute('data-practice', 'click');
    // A click in the neutral area does not reset or advance the activity.
    await card.getByRole('status').click();
    await expect(card).toHaveAttribute('data-practice', 'click');
    await page.reload();
    await expect(card.getByRole('button', { name: startName })).toBeVisible();
    await expect(card).toHaveAttribute('data-practice', 'inactive');
    await card.getByRole('button', { name: practiceName }).click();
    await card.getByRole('button', { name: /Open practice notice|Abrir aviso de práctica/ }).focus();
    await page.keyboard.press('Enter');
    const notice = card.locator('[data-practice-notice]');
    const ready = notice.getByRole('button', { name: /^(Ready|Listo)$/ });
    const noticeBox = await notice.boundingBox();
    const readyBox = await ready.boundingBox();
    expect(readyBox!.y).toBeGreaterThan(noticeBox!.y + noticeBox!.height);
    await expect(notice).toBeFocused();
    // Native Tab navigation brings the below-fold target into view.
    await page.keyboard.press('Tab');
    await expect(ready).toBeFocused();
    await page.keyboard.press('Space');
    await expect(card).toHaveAttribute('data-practice', 'complete');
    await card.getByRole('button', { name: startName }).click();
    await expect(card).toContainText(lang === 'en' ? 'These are your bookmarks.' : 'Estos son tus marcadores.');
    await expect(card.getByTestId('job-card-collapse')).toBeFocused();
    // Practice is offered once, at the welcome; it never comes back mid-task.
    await expect(card.getByRole('button', { name: practiceName })).toHaveCount(0);
    const handle = card.getByTestId('job-card-drag-handle');
    await handle.focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowUp');
    await expect(card).toHaveAttribute('data-corner', 'tr');
  });

  test(`skip startup practice goes straight to orientation (${lang})`, async ({ page }) => {
    await signup(page, lang);
    const card = page.locator('[data-job-card]');
    await card.getByRole('button', { name: practiceName }).click();
    await card.getByRole('button', { name: skipName }).click();
    await expect(card).toHaveAttribute('data-practice', 'inactive');
    await expect(card).toContainText(lang === 'en' ? 'These are your bookmarks.' : 'Estos son tus marcadores.');
  });
}

test('practice exit remains reachable at a 200% equivalent Chromebook viewport', async ({ page }) => {
  await signup(page, 'en');
  await page.setViewportSize({ width: 683, height: 384 });
  await page.getByRole('button', { name: 'Continue on this device', exact: true }).click();
  await page.addStyleTag({ content: '[data-job-card] button { font-size: 20px; }' });
  const card = page.locator('[data-job-card]');
  await card.getByRole('button', { name: practiceName }).click();
  const skip = card.getByRole('button', { name: skipName });
  const bounds = await skip.boundingBox();
  expect(bounds!.height).toBeGreaterThanOrEqual(48);
  expect(bounds!.y).toBeGreaterThanOrEqual(0);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(384);
  await page.screenshot({ path: test.info().outputPath('practice-small-viewport.png') });
  await skip.click();
  await expect(card).toHaveAttribute('data-practice', 'inactive');
});


test('drag remains available and Studio fresh start restores the welcome choice', async ({ page }) => {
  await signup(page, 'en');
  const card = page.locator('[data-job-card]');
  const handle = card.getByTestId('job-card-drag-handle');
  await handle.focus();
  await page.keyboard.press('ArrowUp');
  await expect(card).toHaveAttribute('data-corner', 'tl');
  const box = await handle.boundingBox();
  await page.mouse.move(box!.x + 30, box!.y + 20);
  await page.mouse.down();
  await page.mouse.move(1100, 600, { steps: 12 });
  await page.mouse.up();
  await expect(card).toHaveAttribute('data-corner', 'br');
  await expect(card.getByRole('button', { name: startName })).toBeVisible();
  await card.getByRole('button', { name: startName }).click();
  await page.goto('/studio');
  await page.getByRole('button', { name: /Fresh account/ }).click();
  await page.getByTestId('welcome-continue').click();
  await expect(card.getByRole('button', { name: practiceName })).toBeVisible();
});

test.describe('touch input', () => {
  test.use({ hasTouch: true });
  test('practice accepts touch and native touch scrolling', async ({ page }) => {
    await signup(page, 'en');
    const card = page.locator('[data-job-card]');
    await card.getByRole('button', { name: practiceName }).tap();
    await card.getByRole('button', { name: 'Open practice notice', exact: true }).tap();
    const notice = card.locator('[data-practice-notice]');
    const box = await notice.boundingBox();
    const cdp = await page.context().newCDPSession(page);
    const x = box!.x + box!.width / 2;
    for (let swipe = 0; swipe < 6; swipe++) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: box!.y + 125 }] });
      for (let dy = 0; dy < 100; dy += 20) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: box!.y + 125 - dy }] });
      }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    }
    await expect.poll(() => notice.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
    await notice.getByRole('button', { name: 'Ready', exact: true }).tap();
    await expect(card).toHaveAttribute('data-practice', 'complete');
  });
});

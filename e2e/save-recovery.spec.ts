import { test, expect } from '@playwright/test';

test('failed writing stays retryable across reload without claiming success', async ({ page }) => {
  test.slow();
  await page.goto('/login');
  await page.getByRole('button',{name:/Add user|Agregar usuario/}).click();
  await page.getByPlaceholder('Jordan').fill(`Save Retry ${Date.now()}`);
  await page.getByPlaceholder('HARBOR-24').fill('TEST-E2E');
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type('1234');
  await page.getByRole('button',{name:/^(Add|Agregar)$/}).click();
  await page.getByTestId('welcome-continue').click();
  await page.goto('/studio');
  await page.getByRole('button',{name:/The Review/}).click();
  await page.waitForURL(/from=studio/);
  const card = page.locator('[data-job-card]');
  await card.getByRole('button',{name:/^Open /}).click();
  await page.getByTestId('bookmark-performance-review').click();
  // Keyboard parking is a real supported interaction, not a CSS override.
  await card.getByTestId('job-card-drag-handle').focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowUp');
  await page.getByTestId('review-evidence').selectOption('training');
  await page.getByPlaceholder(/Something specific they actually did/).fill('Sam trained two new hires patiently.');
  await page.getByPlaceholder(/What needs to change/).fill('Sam should arrive before opening time.');
  let blocked = false;
  await page.route('**/*', async (route) => {
    const request = route.request();
    if (!blocked && request.method() === 'POST' && request.headers()['next-action'] && request.postData()?.includes('performance-review')) {
      blocked = true;
      await route.abort('failed');
    } else await route.continue();
  });
  await page.getByRole('button',{name:'Submit the review'}).click();
  await expect(card.getByRole('button',{name:'Retry save'})).toBeVisible({timeout:20000});
  await expect(page.getByText('Review submitted',{exact:true})).toHaveCount(0);
  await page.reload();
  await expect(card.getByRole('button',{name:'Retry save'})).toBeVisible({timeout:20000});
  await card.getByRole('button',{name:'Retry save'}).click();
  await expect(card.getByText('Saving your work…',{exact:true})).toBeVisible();
  await expect(card.getByText('Saving your work…',{exact:true})).toHaveCount(0,{timeout:20000});
  await expect(card.getByRole('button',{name:'Retry save'})).toHaveCount(0);
  await page.goto('/?task=performance-review');
  await expect(card.getByText('Review submitted',{exact:true})).toBeVisible({timeout:20000});
});

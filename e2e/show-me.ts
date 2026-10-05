import { expect, type Page } from "@playwright/test";

/** A Show me action must produce a visible pointer, even when nothing scrolls. */
export async function verifyShowMe(page: Page, lang: "en" | "es", targetId?: string) {
  const card = page.locator('[data-job-card]');
  const show = card.getByRole('button', { name: lang === 'en' ? 'Show me' : 'Muéstrame', exact: true });
  await expect(show).toBeVisible();
  await show.click();
  const ring = page.locator('.animate-showme-pulse');
  await expect(ring).toBeVisible();
  await expect(ring).toBeInViewport();
  if (targetId) {
    const target = page.locator(`[data-showme="${targetId}"]:visible`).first();
    await expect(target).toBeInViewport();
    const box = await target.boundingBox();
    const highlight = await ring.boundingBox();
    expect(box).not.toBeNull();
    expect(highlight).not.toBeNull();
    expect(highlight!.x).toBeLessThan(box!.x + box!.width);
    expect(highlight!.x + highlight!.width).toBeGreaterThan(box!.x);
    expect(highlight!.y).toBeLessThan(box!.y + box!.height);
    expect(highlight!.y + highlight!.height).toBeGreaterThan(box!.y);
  }
  // A pointer click on Hide must not re-open the pointer on the same click.
  await card.getByRole('button', { name: lang === 'en' ? 'Hide' : 'Ocultar', exact: true }).click();
  await expect(ring).toHaveCount(0);
  await show.click();
  await expect(ring).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(ring).toHaveCount(0);
}

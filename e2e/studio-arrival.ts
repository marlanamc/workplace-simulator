import { expect, type Page } from "@playwright/test";

/**
 * Studio "Start of Day X" seeds the same arrival card a real learner sees.
 * Click through it so the test can reach the Job Card / task.
 */
export async function continuePastStudioArrival(page: Page, cta: string | RegExp) {
  const modal = page.locator("div.fixed.inset-0.z-\\[80\\]");
  await expect(modal).toBeVisible({ timeout: 20_000 });
  await modal.getByRole("button", { name: cta }).click();
  await expect(modal).toHaveCount(0);
}

/**
 * Same card, when the test does not care which CTA label it is — clicks the
 * keep-going control (not "Clock out for today").
 */
export async function continuePastStudioArrivalIfPresent(page: Page) {
  const modal = page.locator("div.fixed.inset-0.z-\\[80\\]");
  try {
    await modal.waitFor({ state: "visible", timeout: 4_000 });
  } catch {
    return;
  }
  await modal.locator("button:not([type='submit'])").first().click();
  await expect(modal).toHaveCount(0);
}

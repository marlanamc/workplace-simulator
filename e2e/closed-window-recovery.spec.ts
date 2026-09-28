import { test, expect } from "@playwright/test";
import { clickIntoPage, waitForInteractive } from "./interactive";
import { continuePastStudioArrivalIfPresent } from "./studio-arrival";

/**
 * Wave 4, everyday recovery. On Day 13, after the first request, the Job
 * Card asks the learner to close the browser. The second request waits for
 * that. Reopening shows the first request still done, and the day finishes.
 */
test("Day 13: close the browser when asked, reopen, work is still there", async ({ page }) => {
  test.slow();
  await page.goto("/login");
  await waitForInteractive(page);
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(`E2e Close ${Date.now()}`);
  await page.getByPlaceholder("HARBOR-24").fill("TEST-E2E");
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type("1234");
  await page.getByRole("button", { name: /^(Add|Agregar)$/ }).click();
  await page.getByTestId("welcome-continue").click();

  await page.goto("/studio");
  await waitForInteractive(page);
  await clickIntoPage(page, () => page.getByRole("button", { name: /Covering More Ground/ }).click());
  await continuePastStudioArrivalIfPresent(page);
  const card = page.locator("[data-job-card]");

  await card.getByRole("button", { name: /^Open Today/ }).click();
  const today = page.getByTestId("bookmark-triage");
  if (await today.isVisible().catch(() => false)) await today.click();

  // First request: the meeting.
  await page.getByRole("button", { name: "Open Calendar" }).click();
  await page.getByRole("combobox", { name: "New time" }).selectOption("fri10");
  await page.getByRole("button", { name: "Propose a new time" }).click();
  await expect(card).toContainText("Close the browser");

  // The second request waits for the close.
  await page.getByRole("button", { name: "Open Drive" }).click();
  await page.getByRole("button", { name: "Viewer" }).click();
  await page.getByRole("button", { name: "Share", exact: true }).click();
  await expect(card).toContainText("First close the browser");

  await page.getByRole("button", { name: "Close", exact: true }).first().click();
  await expect(card).toContainText("Open the browser from the shelf");

  // Reopen from the shelf, then Today.
  await page.getByRole("button", { name: "Browser" }).click();
  if (await today.isVisible().catch(() => false)) await today.click();
  await expect(card).toContainText("Your work is still here");
  await page.getByRole("button", { name: "Open Drive" }).click();
  await page.getByRole("button", { name: "Viewer" }).click();
  await page.getByRole("button", { name: "Share", exact: true }).click();
  // Day 13 ends Act II, so finishing opens the act's closing card.
  await expect(page.getByRole("dialog", { name: "You finished your time as a Shift Lead." })).toBeVisible();
});

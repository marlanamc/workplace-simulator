import { test, expect, type Page } from "@playwright/test";
import { continuePastStudioArrivalIfPresent } from "./studio-arrival";
import { clickIntoPage, waitForInteractive } from "./interactive";

/**
 * Story Mode Audit #1. On the Office route, Mail ran the Stay-and-lead
 * Reply-All job ("Friday delivery window") for the rest of the game and hid
 * every note from Anita after it. This is the audit's own repro: Act VII,
 * open Mail.
 */

const CLASS_CODE = "TEST-E2E";

function jobCard(page: Page) {
  return page.locator("[data-job-card]");
}

async function signUp(page: Page, name: string) {
  await page.goto("/login");
  await waitForInteractive(page);
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(name);
  await page.getByPlaceholder("HARBOR-24").fill(CLASS_CODE);
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type("1234");
  await page.getByRole("button", { name: /^(Add|Agregar)$/ }).click();
  await expect(page.getByTestId("simulator-welcome")).toBeVisible({ timeout: 20_000 });
  await page.getByTestId("welcome-continue").click();
}

test("an Office learner's inbox holds Anita's notes, not another route's task", async ({ page }) => {
  await signUp(page, `E2e Route Mail ${Date.now()}`);
  await expect(jobCard(page)).toBeVisible({ timeout: 20_000 });

  await page.goto("/studio");
  await waitForInteractive(page);
  await clickIntoPage(page, () => page.getByRole("button", { name: /Run the Meeting/ }).click());
  const actIntro = page.getByTestId("act-intro");
  if (await actIntro.isVisible().catch(() => false)) await page.getByTestId("act-intro-continue").click();
  await continuePastStudioArrivalIfPresent(page);

  await jobCard(page).getByRole("button", { name: /^Open / }).click();
  await page.getByTestId("bookmark-mail").click();

  await expect(page.getByText("Three slides, one real number")).toBeVisible();
  // Act VII is April 2027, and Anita's first-day note has arrived.
  await expect(page.getByText("Your first day as Team Lead")).toBeVisible();
  await expect(page.getByText("Friday delivery window")).toHaveCount(0);
});

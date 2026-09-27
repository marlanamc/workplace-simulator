import { test, expect, type Page } from "@playwright/test";
import { continuePastStudioArrivalIfPresent } from "./studio-arrival";
import { clickIntoPage, waitForInteractive } from "./interactive";

/**
 * Story Mode Audit #4. The confidentiality call passed a reply that gave
 * Maya's time to an unverified caller, and answered an honest refusal with
 * the same line it gives a blank one. This plays the call the way the audit
 * did.
 */
async function openCall(page: Page) {
  await page.goto("/login");
  await waitForInteractive(page);
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(`E2e Privacy ${Date.now()}`);
  await page.getByPlaceholder("HARBOR-24").fill("TEST-E2E");
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type("1234");
  await page.getByRole("button", { name: /^(Add|Agregar)$/ }).click();
  await page.getByTestId("welcome-continue").click();

  await page.goto("/studio");
  await waitForInteractive(page);
  await clickIntoPage(page, () => page.getByRole("button", { name: /Real Answer.*Front desk/ }).click());
  const intro = page.getByTestId("act-intro");
  if (await intro.isVisible()) await page.getByTestId("act-intro-continue").click();
  await continuePastStudioArrivalIfPresent(page);
  const card = page.locator("[data-job-card]");
  await card.getByRole("button", { name: /^Open |^Abre |^Abrir / }).click();
  await page.getByTestId("bookmark-front-desk").click();
  await card.getByTestId("job-card-drag-handle").focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowUp");
}

test("the call refuses a leak and asks only for what is missing", async ({ page }) => {
  await openCall(page);
  const card = page.locator("[data-job-card]");
  const box = page.getByPlaceholder(/Write what you'd say to the caller/);
  const say = page.getByRole("button", { name: /^Say it$/ });

  await box.fill("Maya comes at 11:30 today. I cannot tell you more, but I will have Maya call you back.");
  await say.click();
  await expect(card).toContainText("you cannot confirm a visit");

  await box.fill("I can not give information");
  await say.click();
  await expect(card).toContainText("You did not share anything. Now offer to have Maya call them back.");

  await box.fill("Sorry, I can not give information. Maya will call you.");
  await say.click();
  await expect(box).toHaveCount(0);
});

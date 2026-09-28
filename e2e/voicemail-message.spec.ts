import { test, expect } from "@playwright/test";
import { clickIntoPage, waitForInteractive } from "./interactive";
import { continuePastStudioArrivalIfPresent } from "./studio-arrival";

/**
 * Wave 4, communication beyond email. On Day 14 the cafe phone has a
 * voicemail for Renata. The learner writes her a phone message (caller,
 * reason, call-back number) before opening the crew schedule. The transcript
 * is always on screen, so nothing depends on hearing the audio.
 */
test("Day 14: phone message from a voicemail comes before the schedule", async ({ page }) => {
  test.slow();
  await page.goto("/login");
  await waitForInteractive(page);
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(`E2e Voicemail ${Date.now()}`);
  await page.getByPlaceholder("HARBOR-24").fill("TEST-E2E");
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type("1234");
  await page.getByRole("button", { name: /^(Add|Agregar)$/ }).click();
  await page.getByTestId("welcome-continue").click();

  await page.goto("/studio");
  await waitForInteractive(page);
  await clickIntoPage(page, () => page.getByRole("button", { name: /Scheduling the Team/ }).first().click());
  const intro = page.getByTestId("act-intro-continue");
  if (await intro.isVisible({ timeout: 5_000 }).catch(() => false)) await intro.click();
  await continuePastStudioArrivalIfPresent(page);
  const card = page.locator("[data-job-card]");

  const open = card.getByRole("button", { name: /^Open Sheets/ });
  if (await open.isVisible().catch(() => false)) await open.click();
  const sheets = page.getByTestId("bookmark-team-schedule");
  if (await sheets.isVisible().catch(() => false)) await sheets.click();

  await expect(card).toContainText("voicemail for Renata");
  await expect(page.getByTestId("voicemail-transcript")).toContainText("555, 0137");

  // The schedule waits for the message.
  await page.getByText("Crew Week:").first().click();
  await expect(card).toContainText("First pass on Casey's voicemail");

  const form = page.getByTestId("phone-message");
  await form.getByLabel("Who called").fill("Casey");
  await form.getByLabel("Why they called").fill("Saturday off, call to confirm");
  await form.getByLabel("Call back at").fill("555 0173");
  await page.getByTestId("phone-message-send").click();
  await expect(card).toContainText("Check the call-back number");

  await form.getByLabel("Call back at").fill("555 0137");
  await page.getByTestId("phone-message-send").click();
  await expect(form).toContainText("Phone message sent to Renata.");

  // A reload keeps it sent; then the schedule opens.
  await page.reload();
  await waitForInteractive(page);
  await continuePastStudioArrivalIfPresent(page);
  if (await open.isVisible().catch(() => false)) await open.click();
  if (await sheets.isVisible().catch(() => false)) await sheets.click();
  await expect(page.getByTestId("phone-message")).toContainText("Phone message sent to Renata.");
  await page.getByText("Crew Week:").first().click();
  await expect(page.getByTestId("voicemail-transcript")).toHaveCount(0);
});

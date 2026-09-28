import { test, expect, type Page } from "@playwright/test";
import { continuePastStudioArrivalIfPresent } from "./studio-arrival";
import { clickIntoPage, waitForInteractive } from "./interactive";

/**
 * Wave 4, file confidence. Day 10 opens with Renata's email: download next
 * week's schedule, then upload it to the Schedules folder in Drive. The
 * check is the file and the folder, and a wrong try resets nothing.
 */
async function startDay10(page: Page, lang: "en" | "es") {
  await page.goto("/login");
  await waitForInteractive(page);
  if (lang === "es") await page.getByRole("button", { name: "Español" }).click();
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(`E2e Upload ${lang} ${Date.now()}`);
  await page.getByPlaceholder("HARBOR-24").fill("TEST-E2E");
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type("1234");
  await page.getByRole("button", { name: /^(Add|Agregar)$/ }).click();
  await page.getByTestId("welcome-continue").click();

  await page.goto("/studio");
  await waitForInteractive(page);
  await clickIntoPage(page, () => page.getByRole("button", { name: /Shared Files|Archivos compartidos/ }).first().click());
  await continuePastStudioArrivalIfPresent(page);
}

test("Day 10: download from Mail, upload into Schedules, then the share job", async ({ page }) => {
  test.slow();
  await startDay10(page, "en");
  const card = page.locator("[data-job-card]");
  await expect(card).toContainText("Download next week's schedule");

  await card.getByRole("button", { name: /^Open Mail/ }).click();
  await page.getByTestId("bookmark-mail").click();
  await page.getByRole("button").filter({ hasText: "Next week's schedule" }).first().click();
  await expect(page.getByRole("heading", { name: "Next week's schedule", exact: true })).toBeVisible();
  await page.getByTestId("schedule-download").click();
  await expect(page.getByTestId("schedule-attachment")).toContainText("Saved to Downloads");

  // The download survives a reload.
  await page.reload();
  await waitForInteractive(page);
  await continuePastStudioArrivalIfPresent(page);
  const mailBookmark = page.getByTestId("bookmark-mail");
  if (await mailBookmark.isVisible().catch(() => false)) await mailBookmark.click();
  await page.getByRole("button").filter({ hasText: "Next week's schedule" }).first().click();
  await expect(page.getByTestId("schedule-attachment")).toContainText("Saved to Downloads");
  await page.getByTestId("schedule-open-drive").click();

  // Uploading outside Schedules is corrected, and nothing opens.
  await page.getByRole("button", { name: "New", exact: true }).click();
  await page.getByRole("menuitem", { name: "File upload" }).click();
  await expect(card).toContainText("Renata wants the file in Schedules");
  await expect(page.getByRole("dialog", { name: "Choose a file to upload" })).toHaveCount(0);

  await page.getByRole("button", { name: "Schedules", exact: true }).click();
  await page.getByRole("button", { name: "New", exact: true }).click();
  await page.getByRole("menuitem", { name: "File upload" }).click();
  const picker = page.getByRole("dialog", { name: "Choose a file to upload" });
  await expect(picker).toBeVisible();

  // This week's schedule looks right by name; the page says otherwise.
  await picker.getByRole("button", { name: /sched_91426\.pdf/ }).click();
  await picker.getByRole("button", { name: "Upload", exact: true }).click();
  await expect(card).toContainText("That is this week");
  await expect(picker).toBeVisible();

  await picker.getByRole("button", { name: /sched_92126\.pdf/ }).click();
  await picker.getByRole("button", { name: "Upload", exact: true }).click();
  await expect(page.getByTestId("upload-done-result")).toContainText("sched_92126.pdf");
  await expect(page.getByTestId("upload-done-result")).toContainText("Schedules");

  // Follow the card, as a learner would: reopening Drive moves on to the share
  // job, and the file just uploaded is now in Schedules as a look-alike.
  await card.getByRole("button", { name: /^Next task$/ }).click();
  await card.getByRole("button", { name: /^Open Drive/ }).click();
  await page.getByTestId("bookmark-files").click();
  await expect(page.getByTestId("upload-done-result")).toHaveCount(0);
  await expect(card).toContainText(/Rename this week's schedule/);
  await page.getByRole("button", { name: /Cafe Shared Drive/ }).first().click();
  await expect(page.getByRole("button", { name: /sched_92126\.pdf/ })).toBeVisible();
});

test("Day 10 upload email reads in Spanish", async ({ page }) => {
  test.slow();
  await startDay10(page, "es");
  const card = page.locator("[data-job-card]");
  await expect(card).toContainText("Descarga el horario de la próxima semana");
  await card.getByRole("button", { name: /^Abre Correo/ }).click();
  await page.getByTestId("bookmark-mail").click();
  await page.getByRole("button").filter({ hasText: "Horario de la próxima semana" }).first().click();
  await expect(page.getByTestId("schedule-download")).toHaveText("Descargar");
  await page.getByTestId("schedule-download").click();
  await expect(page.getByTestId("schedule-attachment")).toContainText("Guardado en Descargas");
});

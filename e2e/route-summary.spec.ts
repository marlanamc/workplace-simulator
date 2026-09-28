import { test, expect, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { clickIntoPage, waitForInteractive } from "./interactive";
import { continuePastStudioArrivalIfPresent } from "./studio-arrival";

/**
 * Story Mode Audit #6: every route ending, and Stop here, gives the learner
 * a summary to keep. Reached through Studio's "Everything done" (the /studio
 * gate admits the TEST-E2E class), then a route choice on the Job Card.
 */
const CLASS_CODE = "TEST-E2E";

async function signUp(page: Page, name: string, lang: "en" | "es") {
  await page.goto("/login");
  await waitForInteractive(page);
  if (lang === "es") await page.getByRole("button", { name: "Español" }).click();
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(name);
  await page.getByPlaceholder("HARBOR-24").fill(CLASS_CODE);
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type("1234");
  await page.getByRole("button", { name: /^(Add|Agregar)$/ }).click();
  await page.getByTestId("welcome-continue").click();
}

async function everythingDone(page: Page) {
  await page.goto("/studio");
  await waitForInteractive(page);
  await clickIntoPage(page, () => page.getByRole("button", { name: "Everything done", exact: true }).click());
  await continuePastStudioArrivalIfPresent(page);
}

async function checkSummaryPage(page: Page, name: string, lang: "en" | "es", skill: string) {
  const summary = page.getByTestId("course-summary");
  await expect(summary).toBeVisible();
  await waitForInteractive(page);
  await expect(summary).toContainText(name);
  await expect(summary).toContainText(CLASS_CODE);
  await expect(summary).toContainText(skill);
  await expect(summary).toContainText(
    lang === "en" ? "Simulated workplace practice, not employment history." : "Práctica laboral simulada, no es historial de empleo.",
  );
  // No bare act numbers, no story instructions.
  await expect(summary).not.toContainText(lang === "en" ? "Act I" : "Acto I");

  // A Chromebook that blocks the clipboard still gets a copy: the download.
  await page.evaluate(() =>
    Object.defineProperty(navigator.clipboard, "writeText", {
      configurable: true,
      value: async () => {
        throw new DOMException("Denied", "NotAllowedError");
      },
    }),
  );
  await page.getByRole("button", { name: /Copy summary to share|Copiar resumen para compartir/ }).click();
  await expect(page.getByRole("status")).toContainText(lang === "en" ? "Clipboard access is unavailable" : "No hay acceso al portapapeles");
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: /Download summary|Descargar resumen/ }).click();
  const download = await pending;
  expect(download.suggestedFilename()).toBe(lang === "en" ? "workplace-practice-summary.txt" : "resumen-practica-laboral.txt");
  const text = await readFile((await download.path())!, "utf8");
  expect(text).toContain(name);
  expect(text).toContain(CLASS_CODE);
  expect(text).toContain(skill);
  expect(text).toContain(lang === "en" ? "not employment history" : "no es historial de empleo");
}

test("a finished route and Stop here both offer a summary the learner can keep", async ({ page }) => {
  test.slow();
  const name = `E2e Summary ${Date.now()}`;
  await signUp(page, name, "en");
  await everythingDone(page);
  const card = page.locator("[data-job-card]");

  // Finished routes are labelled and cannot send the learner back into them.
  await expect(card.getByTestId("course-route-lead")).toBeDisabled();
  await expect(card.getByTestId("course-route-lead")).toContainText("Finished");
  await card.getByTestId("course-route-pause").click();
  await card.getByTestId('course-route-confirm').click();
  await expect(card).toContainText("Finished for now");
  await card.getByTestId("see-summary").click();
  await page.waitForURL(/\/summary/);
  await checkSummaryPage(page, name, "en", "I can build a crew schedule.");

  await page.getByRole("link", { name: "Back to my desk" }).click();
  await waitForInteractive(page);
  await card.getByRole("button", { name: "Change direction" }).click();
  await card.getByTestId("course-route-pause").click();
  await card.getByTestId('course-route-confirm').click();
  await expect(card).toContainText("Finished for now");
  await expect(card).toContainText(/You finished \d+ days of work/);
  await card.getByTestId("see-summary").click();
  await page.waitForURL(/\/summary/);
  await expect(page.getByTestId("course-summary")).toContainText("I can read a pay stub.");
});

test("Stop here offers the summary in Spanish", async ({ page }) => {
  test.slow();
  const name = `E2e Resumen ${Date.now()}`;
  await signUp(page, name, "es");
  await everythingDone(page);
  const card = page.locator("[data-job-card]");
  await card.getByTestId("course-route-pause").click();
  await card.getByTestId('course-route-confirm').click();
  await expect(card).toContainText("Terminado por ahora");
  await expect(card.getByTestId("see-summary")).toHaveText("Ver mi resumen");
  await card.getByTestId("see-summary").click();
  await page.waitForURL(/\/summary\?lang=es/);
  await checkSummaryPage(page, name, "es", "Puedo leer un talón de pago.");
});

test("the retired certificate address leads to the summary", async ({ page }) => {
  const name = `E2e Cert ${Date.now()}`;
  await signUp(page, name, "en");
  await page.goto("/certificate/anything");
  await expect(page).toHaveURL(/\/summary$/);
  await expect(page.getByTestId("course-summary")).toContainText(name);
});

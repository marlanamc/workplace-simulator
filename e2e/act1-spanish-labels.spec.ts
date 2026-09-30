import { test, expect, type Page } from "@playwright/test";
import { continuePastStudioArrivalIfPresent } from "./studio-arrival";
import { clickIntoPage, waitForInteractive } from "./interactive";

/**
 * Wave 5 F-11, F-18, F-19, F-24 in Spanish at 150% text (911x512): the Time
 * Clock, the file picker and the PDF Reader speak Spanish around English
 * documents; Help has one name and one close button; the night-before cards
 * do not call it the first day; Maria's Day 3 note says where the aprons are.
 * Set ACT1_ES_SHOTS to a folder to save screenshots.
 */

test.use({ viewport: { width: 911, height: 512 } });

const card = (page: Page) => page.locator("[data-job-card]");
const appWindow = (page: Page) => page.locator("[data-app-window]");
const SHOTS = process.env.ACT1_ES_SHOTS;
/** English month or weekday next to a day number: "Aug 1", "Jul 14", "Tue, ". */
const ENGLISH_DATE = /\b(Jan|Feb|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d|\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun),/;

async function shot(page: Page, name: string) {
  if (!SHOTS) return;
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${SHOTS}/${name}.png` });
}

async function signUp(page: Page) {
  await page.goto("/login");
  await waitForInteractive(page);
  await page.getByRole("button", { name: "Español" }).click();
  await page.getByRole("button", { name: /Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(`E2e Etiquetas es ${Date.now()}`);
  await page.getByPlaceholder("HARBOR-24").fill("TEST-E2E");
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type("1234");
  await page.getByRole("button", { name: /^Agregar$/ }).click();
  await expect(page.getByTestId("welcome-continue")).toBeVisible();
}

async function openTodaysJob(page: Page) {
  for (let press = 0; press < 3 && !(await appWindow(page).isVisible()); press++) {
    await card(page).locator(".job-card-primary").first().click();
    await appWindow(page).waitFor({ state: "visible", timeout: 4_000 }).catch(() => {});
  }
  await expect(appWindow(page)).toBeVisible();
}

/** Jump to a day, then load `/` so the page is a learner's (no Studio bar). */
async function startOf(page: Page, day: RegExp) {
  await page.goto("/studio");
  await waitForInteractive(page);
  await clickIntoPage(page, () => page.getByRole("button", { name: day }).click());
  await page.goto("/");
  await waitForInteractive(page);
  await continuePastStudioArrivalIfPresent(page);
}

test("Spanish: welcome and the night-before card say what is true", async ({ page }) => {
  await signUp(page);
  await expect(page.getByText("Puedes equivocarte, volver a intentarlo y aprender.")).toBeVisible();
  await expect(page.getByText(/Comete errores/)).toHaveCount(0);
  await shot(page, "01-welcome-es");
  await page.getByTestId("welcome-continue").click();
  await expect(card(page)).toContainText("Antes de tu primer turno");
  await expect(card(page)).not.toContainText("Tu primer día");
  await shot(page, "02-intro-card-es");
});

test("Spanish Day 2: the file picker dates are Spanish", async ({ page }) => {
  test.slow();
  await signUp(page);
  await page.getByTestId("welcome-continue").click();
  await startOf(page, /Start of Day 2: /);
  await openTodaysJob(page);
  // Task 1, the swap, then Maria's text.
  await page.locator('[data-showme="swap-button"]').first().click();
  await page.locator('[data-showme="swap-cover"]').selectOption("thu-late");
  await page.locator('[data-showme="submit-button"]').click();
  await page.getByTestId("text-reply").fill("si, el jueves");
  await page.getByTestId("text-send").click();
  await card(page).getByRole("button", { name: /Siguiente tarea/ }).click();
  // Task 2: Maria's email, then Attach file.
  await openTodaysJob(page);
  if (!(await page.locator('[data-showme="reply-button"]').isVisible())) {
    await page.locator('[data-showme="maria-row"]').click();
  }
  await page.locator('[data-showme="reply-button"]').click();
  await page.getByRole("button", { name: "El reporte final de julio, hoy antes de las 3 PM" }).click();
  await page.locator('[data-showme="attach-button"]').click();
  const picker = page.getByRole("dialog");
  await expect(picker).toBeVisible();
  await expect(picker).toContainText("1 ago");
  await expect(picker).toContainText("14 jul");
  expect((await picker.textContent()) ?? "").not.toMatch(ENGLISH_DATE);
  await shot(page, "03-day2-picker-es");
});

test("Spanish Day 3: the Time Clock and its tab share one name, and Help reads the same", async ({ page }) => {
  test.slow();
  await signUp(page);
  await page.getByTestId("welcome-continue").click();
  await startOf(page, /Start of Day 3: /);
  await openTodaysJob(page);
  const win = appWindow(page);
  await expect(win.getByRole("heading", { name: "Reloj marcador" })).toBeVisible();
  // The Portal tab strip carries the same name.
  await expect(win.getByText("Reloj marcador")).toHaveCount(2);
  await expect(win).toContainText("16h 05m esta semana");
  await expect(win).toContainText("Mar, 18 ago");
  await expect(win).toContainText("Mié, 19 ago");
  expect((await win.textContent()) ?? "").not.toMatch(/this week|Reloj de tiempo|Reloj checador/);
  expect((await win.textContent()) ?? "").not.toMatch(ENGLISH_DATE);
  await shot(page, "04-day3-timeclock-es");
  await win.getByText("Mar, 18 ago").scrollIntoViewIfNeeded();
  await shot(page, "04b-day3-timeclock-recent-es");

  // Help: plain name, one close button.
  await card(page).getByTestId("job-card-help").click();
  await expect(card(page)).toContainText("Ayuda rápida");
  await expect(card(page)).not.toContainText("Lección de 2 minutos");
  await expect(card(page).getByRole("button", { name: "Entendido. Volver a mi tarea" })).toBeVisible();
  await shot(page, "05-day3-help-es");
});

test("Spanish Day 4: Maria's Day 3 note in the inbox says where the aprons are", async ({ page }) => {
  test.slow();
  await signUp(page);
  await page.getByTestId("welcome-continue").click();
  await startOf(page, /Start of Day 4: /);
  await openTodaysJob(page);
  // Mail's own header uses the bookmark's name, not "Mail" (F-11).
  await expect(page.getByTestId("mail-app-title")).toHaveText("MCorreo");
  await page.getByRole("button", { name: /Tu nota de horas/ }).click();
  await expect(appWindow(page)).toContainText("Ahora están en el almacén.");
  await appWindow(page).getByText(/Ahora están en el almacén/).scrollIntoViewIfNeeded();
  await shot(page, "06-day4-hours-note-es");
});

test("Spanish Day 6: the PDF Reader's chrome is Spanish; the stub stays English", async ({ page }) => {
  test.slow();
  await signUp(page);
  await page.getByTestId("welcome-continue").click();
  await startOf(page, /Start of Day 6: /);
  await page.getByTestId("shelf-pdf").click();
  const win = appWindow(page).filter({ hasText: "Descargas" });
  await expect(win).toBeVisible();
  await expect(win).toContainText("Página 1 / 1");
  await expect(win).toContainText("1 ago 2026");
  await expect(win.getByRole("button", { name: "Acercar" })).toBeVisible();
  await expect(win.getByRole("button", { name: "Imprimir" })).toBeVisible();
  expect((await win.textContent()) ?? "").not.toMatch(/Downloads|Page 1 \//);
  // The file list is chrome; the documents themselves stay English.
  const rows = await win.locator("button").filter({ hasText: /\.pdf/ }).allTextContents();
  expect(rows.length).toBeGreaterThan(0);
  for (const row of rows) expect(row).not.toMatch(ENGLISH_DATE);
  await shot(page, "07-day6-pdf-reader-es");
});

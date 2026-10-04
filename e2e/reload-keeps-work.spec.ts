import { test, expect, type Page } from "@playwright/test";
import { continuePastStudioArrivalIfPresent } from "./studio-arrival";
import { clickIntoPage, waitForInteractive } from "./interactive";
import { pressNextTask } from "./next-task";

/**
 * Wave 5 F-7 and F-23: a reload mid-task lost the learner's place and words
 * on Days 2, 3, 4, 5 and 6. Each step below reloads in the middle of a job
 * and checks that the same screen comes back with the same text, in English
 * and Spanish, at 150% text (911x512, the docked Job Card).
 */

test.use({ viewport: { width: 911, height: 512 } });

const card = (page: Page) => page.locator("[data-job-card]");
const appWindow = (page: Page) => page.locator("[data-app-window]");

async function signUp(page: Page, lang: "en" | "es") {
  await page.goto("/login");
  await waitForInteractive(page);
  if (lang === "es") await page.getByRole("button", { name: "Español" }).click();
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(`E2e Reload ${lang} ${Date.now()}`);
  await page.getByPlaceholder("HARBOR-24").fill("TEST-E2E");
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type("1234");
  await page.getByRole("button", { name: /^(Add|Agregar)$/ }).click();
  await page.getByTestId("welcome-continue").click();
  await expect(card(page)).toBeVisible();
}

/** Jump to a day, then load `/` so the page is a learner's (no Studio bar). */
async function startOf(page: Page, day: RegExp) {
  await page.goto("/studio");
  await waitForInteractive(page);
  await clickIntoPage(page, () => page.getByRole("button", { name: day }).click());
  await page.goto("/");
  await waitForInteractive(page);
  await continuePastStudioArrivalIfPresent(page);
  await openTodaysJob(page);
}

/** The card's own button, until the day's app is on screen. */
async function openTodaysJob(page: Page) {
  for (let press = 0; press < 3 && !(await appWindow(page).isVisible()); press++) {
    await card(page).locator(".job-card-primary").first().click();
    await appWindow(page).waitFor({ state: "visible", timeout: 4_000 }).catch(() => {});
  }
  await expect(appWindow(page)).toBeVisible();
}

/** A real reload, then back into the day the way a learner would. */
async function reload(page: Page) {
  await page.reload();
  await waitForInteractive(page);
  await continuePastStudioArrivalIfPresent(page);
  await openTodaysJob(page);
}

for (const lang of ["en", "es"] as const) {
  const t = (en: string, es: string) => (lang === "en" ? en : es);

  test(`Days 2 and 3: a reload keeps the step and the words (${lang})`, async ({ page }) => {
    test.slow();
    await signUp(page, lang);

    // Day 2, task 1: the swap form, half filled in.
    await startOf(page, /Start of Day 2: /);
    await page.locator('[data-showme="swap-button"]').first().click();
    const reason = t("My son has a doctor visit.", "Mi hijo tiene cita con el médico.");
    await page.getByRole("combobox").nth(1).selectOption("thu-late");
    await page.getByPlaceholder(/.+/).last().fill(reason);
    await reload(page);
    await expect(page.getByRole("combobox").first()).toHaveValue("thu");
    await expect(page.getByRole("combobox").nth(1)).toHaveValue("thu-late");
    await expect(page.locator(`input[value="${reason}"]`)).toBeVisible();
    await page.locator('[data-showme="submit-button"]').click();
    await page.getByTestId("text-reply").fill(t("yes thursday 2 ok", "si, el jueves"));
    await page.getByTestId("text-send").click();
    await pressNextTask(page);

    // Day 2, task 2: Maria's email answered, the file attached, a few words typed.
    await openTodaysJob(page);
    if (!(await page.locator('[data-showme="reply-button"]').isVisible())) {
      await page.locator('[data-showme="maria-row"]').click();
    }
    await page.locator('[data-showme="reply-button"]').click();
    await page.getByRole("button", { name: t("Your food handler certificate, today by 3 PM", "Tu certificado de manipulador de alimentos, hoy antes de las 3 PM") }).click();
    await page.locator('[data-showme="attach-button"]').click();
    await page.getByRole("button", { name: /food-handler-certificate.pdf/ }).click();
    await page.locator('[data-showme="attach-confirm"]').click();
    const note = t("here is my certificate", "aquí está mi certificado");
    await page.locator('[data-showme="compose-body"]').last().fill(note);
    await reload(page);
    if (!(await page.locator('[data-showme="compose-body"]').last().isVisible())) await page.getByTestId("bookmark-mail").click();
    await expect(page.locator('[data-showme="compose-body"]').last()).toHaveValue(note);
    await expect(appWindow(page)).toContainText("food-handler-certificate.pdf");
    await page.locator('[data-showme="send-button"]').last().click();
    await expect(page.locator("[data-celebration-continue]").or(page.locator('[data-job-card][data-card-tone="green"]')).first()).toBeVisible({ timeout: 20_000 });

    // Day 3, task 1: clocked in survives a reload; the note to Maria survives
    // a trip to another bookmark and a reload.
    await startOf(page, /Start of Day 3: /);
    await page.locator('[data-showme="clockin-button"]').click();
    await reload(page);
    await expect(page.locator('[data-showme="something-off-button"]')).toBeVisible();
    await page.locator('[data-showme="something-off-button"]').click();
    const clock = t("hi maria i come 7. clock say 8:15. sorry", "hola maria llegue a las 7 pero el reloj dice 8:15");
    await appWindow(page).locator("textarea").first().fill(clock);
    await page.getByTestId("bookmark-portal").click();
    await page.getByTestId("bookmark-mail").click();
    await expect(appWindow(page).locator("textarea").first()).toHaveValue(clock);
    await reload(page);
    if (!(await appWindow(page).locator("textarea").first().isVisible())) {
      await page.locator('[data-showme="something-off-button"]').click();
    }
    await expect(appWindow(page).locator("textarea").first()).toHaveValue(clock);
    await page.locator('[data-showme="send-button"]').click();
    await pressNextTask(page);

    // Day 3, task 2: the shift note.
    await openTodaysJob(page);
    const summary = t("it was busy at 11", "a las 11 hubo mucha gente");
    await page.locator('[data-showme="shift-note-box"]').fill(summary);
    await reload(page);
    await expect(page.locator('[data-showme="shift-note-box"]')).toHaveValue(summary);
  });

  test(`Days 4, 5 and 6: a reload keeps the step and the words (${lang})`, async ({ page }) => {
    test.slow();
    await signUp(page, lang);

    // Day 4: the reply to Darnell.
    await startOf(page, /Start of Day 4: /);
    await page.getByRole("button", { name: /Darnell Washington/ }).click();
    await page.getByRole("button", { name: /^(Reply|Responder)$/ }).click();
    const darnell = t("Hi Darnell. The aprons are", "Hola Darnell. Los delantales están");
    await page.locator('[data-showme="compose-body"]').first().fill(darnell);
    await reload(page);
    if (!(await page.locator('[data-showme="compose-body"]').first().isVisible())) await page.getByTestId("bookmark-mail").click();
    await expect(page.locator('[data-showme="compose-body"]').first()).toHaveValue(darnell);
    // Back where they left off: in the reply box, scrolled into view.
    await expect(page.locator('[data-showme="compose-body"]').first()).toBeFocused();
    await expect(page.locator('[data-showme="compose-body"]').first()).toBeInViewport();

    // Day 5: the sick call, written from scratch.
    await startOf(page, /Start of Day 5: /);
    const sick = t("hi maria i am sick. i can't come", "hola maria estoy enferma. no puedo ir hoy");
    await page.locator('[data-showme="compose-body"]').first().fill(sick);
    await reload(page);
    await expect(page.locator('[data-showme="compose-body"]').first()).toHaveValue(sick);

    // Day 6: the first question answered, then a reload before the second.
    await startOf(page, /Start of Day 6: /);
    // The stub opens inline, beside its first question.
    await page.locator('[data-showme="target-stub"]').click();
    await page.getByRole("button", { name: "$571.32", exact: true }).click();
    const hours = t("Which paid hours on the stub match it?", "¿Qué horas pagadas del recibo coinciden?");
    await expect(appWindow(page)).toContainText(hours);
    await reload(page);
    await expect(appWindow(page)).toContainText(hours);
    // The stub reads inline, so it is still beside the question after the reload.
    await expect(page.locator('[data-showme="stub-hours"][data-showme-primary]')).toBeAttached();
  });
}

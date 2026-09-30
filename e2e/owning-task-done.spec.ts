import { test, expect, type Page } from "@playwright/test";
import { continuePastStudioArrivalIfPresent } from "./studio-arrival";
import { clickIntoPage, waitForInteractive } from "./interactive";

/**
 * Wave 5 F-9 and F-22 (and B-4, C5, D-F1 in later acts): opening an app that
 * still holds an old, finished job turned the Job Card green with "Done. One
 * more task for today." or "Start tomorrow", on a day that had not started.
 * Only the job just completed may say Done now; any other done screen leaves
 * the card on today's job, and Mail opens at its inbox.
 */

const card = (page: Page) => page.locator("[data-job-card]");
const FALSE_DONE = /Next task|Start tomorrow|Siguiente tarea|Empezar mañana/;

async function signUp(page: Page, lang: "en" | "es") {
  await page.goto("/login");
  await waitForInteractive(page);
  if (lang === "es") await page.getByRole("button", { name: "Español" }).click();
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(`E2e Owner ${lang} ${Date.now()}`);
  await page.getByPlaceholder("HARBOR-24").fill("TEST-E2E");
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type("1234");
  await page.getByRole("button", { name: /^(Add|Agregar)$/ }).click();
  await page.getByTestId("welcome-continue").click();
  await expect(card(page)).toBeVisible();
}

async function startOf(page: Page, day: RegExp) {
  await page.goto("/studio");
  await waitForInteractive(page);
  await clickIntoPage(page, () => page.getByRole("button", { name: day }).click());
  await continuePastStudioArrivalIfPresent(page);
  await expect(card(page)).toBeVisible();
}

/** The card is still on today's job: blue, no finish buttons. */
async function expectTodaysJob(page: Page, kicker: RegExp) {
  await expect(card(page)).toHaveAttribute("data-card-tone", "blue");
  await expect(card(page)).toContainText(kicker);
  await expect(card(page).getByRole("button", { name: FALSE_DONE })).toHaveCount(0);
}

for (const lang of ["en", "es"] as const) {
  test(`Day 4: opening the Portal does not say Day 2 is done (${lang})`, async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await signUp(page, lang);
    await startOf(page, /Start of Day 4: /);
    const day4 = lang === "en" ? /Day 4 of 6/ : /Día 4 de 6/;
    await expect(page.getByTestId("bookmark-portal")).toBeVisible({ timeout: 20_000 });
    await page.getByTestId("bookmark-portal").click();
    await expectTodaysJob(page, day4);
    // The Shift Swap tab holds Day 2's filed request too.
    await page.getByRole("button", { name: lang === "en" ? "Shift Swap" : "Cambio de turno" }).click();
    await expectTodaysJob(page, day4);
    // A reload on the Portal does not bring it back either.
    await page.reload();
    await waitForInteractive(page);
    await continuePastStudioArrivalIfPresent(page);
    if (await page.getByTestId("bookmark-portal").isVisible()) await page.getByTestId("bookmark-portal").click();
    await expectTodaysJob(page, day4);

    // The real finish still works. Day 4 has one job, so finishing it opens
    // the day's end screen (the card steps aside for it) or a green card.
    await page.getByTestId("bookmark-mail").click();
    await page.getByRole("button", { name: /Darnell Washington/ }).click();
    await page.getByRole("button", { name: /^(Reply|Responder)$/ }).click();
    await page.locator("textarea").first().fill(lang === "en" ? "Hi Darnell. The aprons are in the storage room." : "Hola Darnell. Los delantales están en el almacén.");
    await page.getByRole("button", { name: /^(Send|Enviar)$/ }).click();
    await expect(
      page.locator("[data-celebration-continue]").or(card(page).and(page.locator('[data-card-tone="green"]'))).first(),
    ).toBeVisible({ timeout: 20_000 });
  });
}

test("Day 6 in Spanish at 911: Mail opens at the inbox, not Day 5's finished message", async ({ page }) => {
  await page.setViewportSize({ width: 911, height: 512 });
  await signUp(page, "es");
  await startOf(page, /Start of Day 6: /);
  await expect(page.getByTestId("bookmark-mail")).toBeVisible({ timeout: 20_000 });
  await page.getByTestId("bookmark-mail").click();
  await expect(page.getByTestId("mail-inbox-list")).toBeVisible();
  await expectTodaysJob(page, /Día 6 de 6/);
  // The card's button takes them back to today's job in the Portal.
  await card(page).locator(".job-card-primary").click();
  await expect(page.getByText(/Recibos de pago/).first()).toBeVisible();
  await expectTodaysJob(page, /Día 6 de 6/);
});

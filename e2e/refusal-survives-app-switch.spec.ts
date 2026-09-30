import { test, expect, type Page } from "@playwright/test";
import { continuePastStudioArrivalIfPresent } from "./studio-arrival";
import { clickIntoPage, waitForInteractive } from "./interactive";

/**
 * Phase 3 N-5: on Day 5, after a refused sick call, opening the Portal and
 * coming back showed "Click Send." over the same words, which would only be
 * refused again. The card keeps asking for the fix until the words change,
 * after a trip to another app and after a reload.
 */

type Lang = "en" | "es";
const card = (page: Page) => page.locator("[data-job-card]");
const appWindow = (page: Page) => page.locator("[data-app-window]");

async function signUp(page: Page, lang: Lang) {
  await page.goto("/login");
  await waitForInteractive(page);
  if (lang === "es") await page.getByRole("button", { name: "Español" }).click();
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(`E2e Refused ${lang} ${Date.now() % 1_000_000}`);
  await page.getByPlaceholder("HARBOR-24").fill("TEST-E2E");
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type("1234");
  await page.getByRole("button", { name: /^(Add|Agregar)$/ }).click();
  await page.getByTestId("welcome-continue").click();
  await expect(card(page)).toBeVisible();
}

async function openTodaysJob(page: Page) {
  for (let press = 0; press < 3 && !(await appWindow(page).isVisible()); press++) {
    await card(page).locator(".job-card-primary").first().click();
    await appWindow(page).waitFor({ state: "visible", timeout: 4_000 }).catch(() => {});
  }
  await expect(appWindow(page)).toBeVisible();
}

for (const [lang, size] of [["es", { width: 911, height: 512 }], ["en", { width: 1366, height: 768 }]] as const) {
  test.describe(`${lang} ${size.width}x${size.height}`, () => {
    test.use({ viewport: size });
    const t = (en: string, es: string) => (lang === "en" ? en : es);
    const clickSend = t("Click Send.", "Haz clic en Enviar.");
    const goal = t("Tell Maria you cannot work today's shift.", "Dile a Maria que no puedes trabajar el turno de hoy.");

    test(`Day 5: a refused message is still refused after another app and a reload (${lang})`, async ({ page }) => {
      test.slow();
      await signUp(page, lang);
      await page.goto("/studio");
      await waitForInteractive(page);
      await clickIntoPage(page, () => page.getByRole("button", { name: /Start of Day 5: / }).click());
      await page.goto("/");
      await waitForInteractive(page);
      await continuePastStudioArrivalIfPresent(page);
      await openTodaysJob(page);

      const box = page.locator("textarea").first();
      const wrong = t("hi maria i am sick", "hola maria estoy enferma");
      await box.fill(wrong);
      await page.getByRole("button", { name: /^(Send|Enviar)$/ }).click();
      await expect(card(page)).toContainText(goal);
      await expect(card(page)).not.toContainText(clickSend);

      // Another app and back: the same words, the same ask.
      await page.getByTestId("bookmark-portal").click();
      await page.getByTestId("bookmark-mail").click();
      await expect(box).toHaveValue(wrong);
      await expect(card(page)).toContainText(goal);
      await expect(card(page)).not.toContainText(clickSend);

      // A reload: the same.
      await page.reload();
      await waitForInteractive(page);
      await continuePastStudioArrivalIfPresent(page);
      await openTodaysJob(page);
      await expect(box).toHaveValue(wrong);
      await expect(card(page)).toContainText(goal);
      await expect(card(page)).not.toContainText(clickSend);

      // Changing the words brings "Click Send." back, and the fix goes through.
      await box.fill(t("Hi Maria, I am sick. I can't come in today.", "Hola Maria, estoy enferma. Hoy no puedo ir."));
      await expect(card(page)).toContainText(clickSend);
      await page.getByRole("button", { name: /^(Send|Enviar)$/ }).click();
      await expect(box).toHaveCount(0);
    });
  });
}

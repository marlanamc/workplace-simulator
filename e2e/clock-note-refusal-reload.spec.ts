import { test, expect, type Page } from "@playwright/test";
import { continuePastStudioArrivalIfPresent } from "./studio-arrival";
import { clickIntoPage, waitForInteractive } from "./interactive";

/**
 * Phase 3 N-7: on Day 3, after a refused note to Maria about the clock-in
 * time, a reload and "Something looks wrong" brought the words back but the
 * card said only "Click Send." over them, and they would only be refused
 * again. (N-5 fixed the same thing for Day 5; the clock note kept its words
 * but not its refusal.) The card keeps asking for the fix until the words
 * change, after another app and after a reload.
 */

type Lang = "en" | "es";
const card = (page: Page) => page.locator("[data-job-card]");
const appWindow = (page: Page) => page.locator("[data-app-window]");

async function signUp(page: Page, lang: Lang) {
  await page.goto("/login");
  await waitForInteractive(page);
  if (lang === "es") await page.getByRole("button", { name: "Español" }).click();
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(`E2e Clock note ${lang} ${Date.now() % 1_000_000}`);
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
    const goal = t("Tell Maria you arrived at 7 and clocked in at 8:15.", "Dile a Maria que llegaste a las 7 y marcaste a las 8:15.");

    test(`Day 3: a refused clock note is still refused after another app and a reload (${lang})`, async ({ page }) => {
      test.slow();
      await signUp(page, lang);
      await page.goto("/studio");
      await waitForInteractive(page);
      await clickIntoPage(page, () => page.getByRole("button", { name: /Start of Day 3: / }).click());
      await page.goto("/");
      await waitForInteractive(page);
      await continuePastStudioArrivalIfPresent(page);
      await openTodaysJob(page);

      await page.locator('[data-showme="clockin-button"]').click();
      await page.locator('[data-showme="something-off-button"]').click();
      const box = appWindow(page).locator('[data-showme="compose-body"]').first();
      const wrong = t("hi maria. clock is wrong", "hola maria. el reloj está mal");
      await box.fill(wrong);
      await page.locator('[data-showme="send-button"]').first().click();
      await expect(card(page)).toContainText(goal);
      await expect(card(page)).not.toContainText(clickSend);

      // Another app and back: the same words, the same ask.
      await page.getByTestId("bookmark-portal").click();
      await page.getByTestId("bookmark-mail").click();
      await expect(box).toHaveValue(wrong);
      await expect(card(page)).toContainText(goal);
      await expect(card(page)).not.toContainText(clickSend);

      // A reload, then back into the note the way the replay's learner did.
      await page.reload();
      await waitForInteractive(page);
      await continuePastStudioArrivalIfPresent(page);
      await openTodaysJob(page);
      if (!(await box.isVisible())) await page.locator('[data-showme="something-off-button"]').click();
      await expect(box).toHaveValue(wrong);
      await expect(card(page)).toContainText(goal);
      await expect(card(page)).not.toContainText(clickSend);

      // Changing the words brings "Click Send." back, and the fix goes through.
      await box.fill(t("Hi Maria, I got here at 7, but the clock says 8:15. Sorry.", "Hola Maria, llegué a las 7 pero el reloj dice 8:15. Perdón."));
      await expect(card(page)).toContainText(clickSend);
      await page.locator('[data-showme="send-button"]').first().click();
      await expect(card(page).getByRole("button", { name: /Next task|Siguiente tarea/ })).toBeVisible();
    });
  });
}

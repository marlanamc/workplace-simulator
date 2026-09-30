import { test, expect, type Page } from "@playwright/test";
import { continuePastStudioArrivalIfPresent } from "./studio-arrival";
import { clickIntoPage, waitForInteractive } from "./interactive";

/**
 * Phase 3 N-4: opening Help while writing the first Night Before reply set off
 * a render loop ("Maximum update depth exceeded", 9 to 32 times). Nothing
 * showed on screen, but the page kept re-rendering. Mail builds that Help
 * lesson fresh on every render, and Help re-reported it to the card on every
 * new object. Here Help is opened, read, closed and opened again, with a
 * draft and after a reload, and the console must stay clean.
 */

type Lang = "en" | "es";
const card = (page: Page) => page.locator("[data-job-card]");

async function signUp(page: Page, lang: Lang) {
  await page.goto("/login");
  await waitForInteractive(page);
  if (lang === "es") await page.getByRole("button", { name: "Español" }).click();
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(`E2e Loop ${lang} ${Date.now() % 1_000_000}`);
  await page.getByPlaceholder("HARBOR-24").fill("TEST-E2E");
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type("1234");
  await page.getByRole("button", { name: /^(Add|Agregar)$/ }).click();
  await page.getByTestId("welcome-continue").click();
  await expect(card(page)).toBeVisible();
}

async function toReply(page: Page) {
  const row = page.locator('[data-showme="maria-row"]');
  const openMail = card(page).getByRole("button", { name: /Open Mail|Abrir Correo/ });
  if (await openMail.isVisible().catch(() => false)) await openMail.click();
  await row.click();
  await page.locator('[data-showme="reply-button"]').click();
}

for (const [lang, size] of [["es", { width: 911, height: 512 }], ["en", { width: 1366, height: 768 }]] as const) {
  test.describe(`${lang} ${size.width}x${size.height}`, () => {
    test.use({ viewport: size });

    test(`Night Before: Help over a draft does not loop (${lang})`, async ({ page }) => {
      test.slow();
      const loops: string[] = [];
      page.on("console", (m) => {
        if (m.type() === "error" && m.text().includes("Maximum update depth")) loops.push(m.text());
      });
      await signUp(page, lang);
      await page.goto("/studio");
      await waitForInteractive(page);
      await clickIntoPage(page, () => page.getByRole("button", { name: /Start of The Night Before/ }).click());
      await continuePastStudioArrivalIfPresent(page);
      await card(page).getByRole("button", { name: /^(I understand|Entiendo)$/ }).click();
      await toReply(page);

      const draft = page.getByRole("textbox", { name: /Your reply|Tu respuesta/ });
      await draft.click();
      await page.keyboard.type(lang === "en" ? "Hi Maria, thank you." : "Hola Maria, gracias.", { delay: 15 });
      for (let round = 0; round < 2; round++) {
        await card(page).getByTestId("job-card-help").click();
        await expect(card(page).getByRole("button", { name: /Back to my task|Volver a mi tarea/ })).toBeVisible();
        await page.waitForTimeout(1000);
        await card(page).getByRole("button", { name: /Back to my task|Volver a mi tarea/ }).click();
      }
      expect(loops).toEqual([]);

      await page.reload();
      await waitForInteractive(page);
      await continuePastStudioArrivalIfPresent(page);
      await toReply(page);
      await expect(draft).toHaveValue(lang === "en" ? "Hi Maria, thank you." : "Hola Maria, gracias.");
      await card(page).getByTestId("job-card-help").click();
      await page.waitForTimeout(1000);
      expect(loops).toEqual([]);
    });
  });
}

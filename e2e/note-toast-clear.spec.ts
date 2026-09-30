import { test, expect, type Page } from "@playwright/test";
import { continuePastStudioArrivalIfPresent } from "./studio-arrival";
import { clickIntoPage, waitForInteractive } from "./interactive";

/**
 * Phase 3 N-2: after a finished task, "Maria left a note" showed for about
 * 5.5 seconds just above the shelf. At 911 that is where the next control
 * is: Clock In, the shift note's Submit, Attach file, the picker's Cancel.
 * A learner clicking where Submit was opened Mail instead. The note now sits
 * in the shelf, off the app window, the Job Card and every button.
 */

type Lang = "en" | "es";
const card = (page: Page) => page.locator("[data-job-card]");
const appWindow = (page: Page) => page.locator("[data-app-window]");
const toast = (page: Page) => page.getByRole("button", { name: /^(Maria left a note|Maria dejó una nota)$/ });

async function signUp(page: Page, lang: Lang) {
  await page.goto("/login");
  await waitForInteractive(page);
  if (lang === "es") await page.getByRole("button", { name: "Español" }).click();
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(`E2e Toast ${lang} ${Date.now() % 1_000_000}`);
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

/** Every control (and the card) the note overlaps. Empty means it covers nothing. */
async function coveredByToast(page: Page) {
  return page.evaluate(() => {
    const note = [...document.querySelectorAll("button")].find((b) => /^(Maria left a note|Maria dejó una nota)$/.test(b.textContent?.trim() ?? ""));
    if (!note) return ["(no note)"];
    const t = note.getBoundingClientRect();
    const hit = (r: DOMRect) => r.width > 0 && r.height > 0 && r.left < t.right && r.right > t.left && r.top < t.bottom && r.bottom > t.top;
    const out: string[] = [];
    const cardEl = document.querySelector("[data-job-card]");
    if (cardEl && hit(cardEl.getBoundingClientRect())) out.push("the Job Card");
    for (const win of document.querySelectorAll("[data-app-window]")) if (hit(win.getBoundingClientRect())) out.push("the app window");
    const sel = "button, a[href], input, select, textarea, [role=button], [data-showme]";
    for (const el of document.querySelectorAll<HTMLElement>(sel)) {
      if (el === note || note.contains(el) || cardEl?.contains(el)) continue;
      if (getComputedStyle(el).visibility === "hidden") continue;
      if (hit(el.getBoundingClientRect())) out.push((el.innerText || el.getAttribute("aria-label") || el.tagName).trim().slice(0, 40));
    }
    return out;
  });
}

for (const [lang, size] of [["es", { width: 911, height: 512 }], ["en", { width: 1366, height: 768 }]] as const) {
  test.describe(`${lang} ${size.width}x${size.height}`, () => {
    test.use({ viewport: size });
    const t = (en: string, es: string) => (lang === "en" ? en : es);

    test(`Day 3: Maria's note covers no control and not the card (${lang})`, async ({ page }) => {
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
      await page.locator('[data-showme="compose-body"]').first().fill(t("Hi Maria, I got here at 7 but the clock says 8:15.", "Hola Maria, llegué a las 7 pero el reloj dice 8:15."));
      await page.locator('[data-showme="send-button"]').first().click();

      // The note arrives with the finished task: nothing under it.
      await expect(toast(page)).toBeVisible({ timeout: 20_000 });
      expect(await coveredByToast(page)).toEqual([]);

      // Straight on to the shift note while it is still up: still nothing under it.
      await card(page).getByRole("button", { name: /Next task|Siguiente tarea/ }).click();
      await openTodaysJob(page);
      await expect(page.locator('[data-showme="shift-note-box"]')).toBeVisible();
      await expect(toast(page)).toBeVisible();
      expect(await coveredByToast(page)).toEqual([]);
      await page.screenshot({ path: test.info().outputPath(`note-in-shelf-${lang}.png`) });

      // Clicking it still opens Mail, where the note is.
      await toast(page).click();
      await expect(page.getByText(t("Your hours note", "Tu nota de horas")).first()).toBeVisible();

      // A reload does not bring the note back over the page.
      await page.reload();
      await waitForInteractive(page);
      await continuePastStudioArrivalIfPresent(page);
      await openTodaysJob(page);
      await expect(toast(page)).toHaveCount(0);
    });
  });
}

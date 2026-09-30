import { test, expect, type Page } from "@playwright/test";
import { continuePastStudioArrivalIfPresent } from "./studio-arrival";
import { clickIntoPage, waitForInteractive } from "./interactive";

/**
 * Phase 3 F-3: at 1366 the floating Job Card sat bottom-left on Day 2's
 * schedule, over the Wed–Sat days and times, and after a wrong try it said
 * "Look at Thursday, Aug 27" with Thursday under it. What the step asks the
 * learner to read (the days and times, the phone calendar) is now kept clear
 * like a control. At 911 the card is docked and covers nothing, as before.
 */

type Lang = "en" | "es";
const card = (page: Page) => page.locator("[data-job-card]");
const appWindow = (page: Page) => page.locator("[data-app-window]");

async function signUp(page: Page, lang: Lang) {
  await page.goto("/login");
  await waitForInteractive(page);
  if (lang === "es") await page.getByRole("button", { name: "Español" }).click();
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(`E2e Sched ${lang} ${Date.now() % 1_000_000}`);
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

/** Whatever marked `data-card-read` is on screen with the card over it. */
async function readUnderCard(page: Page, only?: string) {
  return page.evaluate((only) => {
    const c = document.querySelector("[data-job-card]")!.getBoundingClientRect();
    return [...document.querySelectorAll<HTMLElement>(only ?? "[data-card-read]")]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom <= 0 || r.top >= innerHeight) return false;
        return r.left < c.right && r.right > c.left && r.top < c.bottom && r.bottom > c.top;
      })
      .map((el) => el.innerText.replace(/\s+/g, " ").trim().slice(0, 40));
  }, only);
}

/** Thursday's day and time, and the phone calendar: what the correction names. */
const NAMED = '[data-shift-day="thu"] [data-card-read], aside[data-card-read]';

for (const [lang, size] of [["en", { width: 1366, height: 768 }], ["es", { width: 1366, height: 768 }], ["es", { width: 911, height: 512 }]] as const) {
  test.describe(`${lang} ${size.width}x${size.height}`, () => {
    test.use({ viewport: size });
    const t = (en: string, es: string) => (lang === "en" ? en : es);

    test(`Day 2 schedule: Thursday and the phone stay clear of the card (${lang}, ${size.width})`, async ({ page }) => {
      test.slow();
      await signUp(page, lang);
      await page.goto("/studio");
      await waitForInteractive(page);
      await clickIntoPage(page, () => page.getByRole("button", { name: /Start of Day 2: / }).click());
      await page.goto("/");
      await waitForInteractive(page);
      await continuePastStudioArrivalIfPresent(page);
      await openTodaysJob(page);

      await expect(page.locator("[data-card-read]").first()).toBeVisible();
      await expect.poll(() => readUnderCard(page)).toEqual([]);

      // Two wrong days: the card grows with its correction and names Thursday.
      const swaps = page.getByRole("button", { name: /^(Request a swap|Pedir un cambio)$/ });
      await swaps.nth(0).click();
      await swaps.nth(1).click();
      await expect(card(page)).toContainText(t("Look at Thursday, Aug 27.", "Mira el jueves 27 de agosto."));
      // The taller card cannot miss every label at 1366; it must miss the ones
      // it names. In Spanish the tall card sits on Monday instead.
      await expect.poll(() => readUnderCard(page, NAMED)).toEqual([]);
      // The button to press is still clear too, once it is scrolled into
      // view (at 911 Thursday starts below the window, as a learner finds it).
      // Checked at its middle only when on screen: off screen, the point is
      // the shelf, not the card.
      await page.locator('[data-showme="swap-button"]').scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          page.locator('[data-showme="swap-button"]').evaluate((b) => {
            const r = b.getBoundingClientRect();
            if (r.bottom > innerHeight || r.top < 0) return "off screen";
            const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
            return Boolean(hit && !hit.closest("[data-job-card]"));
          }),
        )
        .toBe(true);
      await page.screenshot({ path: test.info().outputPath(`schedule-${lang}-${size.width}.png`) });

      await page.reload();
      await waitForInteractive(page);
      await continuePastStudioArrivalIfPresent(page);
      await openTodaysJob(page);
      await expect.poll(() => readUnderCard(page)).toEqual([]);
    });
  });
}

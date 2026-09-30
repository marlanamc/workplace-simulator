import { test, expect, type Page } from "@playwright/test";
import { continuePastStudioArrivalIfPresent } from "./studio-arrival";
import { clickIntoPage, waitForInteractive } from "./interactive";

/**
 * Phase 3 F-9: the Job Card no longer says Day 2 is done on a later day, but
 * the Portal's Schedule tab still opened on Day 2's green "You noticed the
 * conflict and asked for a swap." on Days 2 (task 2), 4 and 5. Once the swap
 * is filed the tab is the learner's schedule: read-only, Thursday moved to
 * 2 PM – 10 PM as Maria confirmed, and nothing to press.
 */

type Lang = "en" | "es";
const card = (page: Page) => page.locator("[data-job-card]");
const appWindow = (page: Page) => page.locator("[data-app-window]");
const STALE = /You noticed the conflict|Notaste el conflicto/i;

async function signUp(page: Page, lang: Lang) {
  await page.goto("/login");
  await waitForInteractive(page);
  if (lang === "es") await page.getByRole("button", { name: "Español" }).click();
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(`E2e Home ${lang} ${Date.now() % 1_000_000}`);
  await page.getByPlaceholder("HARBOR-24").fill("TEST-E2E");
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type("1234");
  await page.getByRole("button", { name: /^(Add|Agregar)$/ }).click();
  await page.getByTestId("welcome-continue").click();
  await expect(card(page)).toBeVisible();
}

/** Today's job opens the Browser; its Portal bookmark is then a click away. */
async function openTodaysJob(page: Page) {
  for (let press = 0; press < 3 && !(await appWindow(page).isVisible()); press++) {
    await card(page).locator(".job-card-primary").first().click();
    await appWindow(page).waitFor({ state: "visible", timeout: 4_000 }).catch(() => {});
  }
  await expect(appWindow(page)).toBeVisible();
}

async function expectScheduleHome(page: Page, lang: Lang) {
  await openTodaysJob(page);
  await page.getByTestId("bookmark-portal").click();
  await page.getByRole("button", { name: lang === "en" ? "Schedule" : "Horario", exact: true }).click();
  await expect(appWindow(page)).toContainText(lang === "en" ? "Your schedule. Next week" : "Tu horario. Próxima semana");
  await expect(appWindow(page)).not.toContainText(STALE);
  await expect(page.getByRole("button", { name: /^(Request a swap|Pedir un cambio)$/ })).toHaveCount(0);
  const thursday = page.locator('[data-shift-day="thu"]');
  await expect(thursday).toContainText("2:00 PM – 10:00 PM");
  // Nothing here is today's job, so nothing asks the card to move: the
  // Portal's tabs stay clear of it.
  await expect(page.locator("[data-card-read]")).toHaveCount(0);
  for (const tab of await page.locator("[data-app-window] .border-b.bg-white.px-4.pt-2 button").all()) {
    await expect(tab).toBeVisible();
    const hit = await tab.evaluate((b) => {
      const r = b.getBoundingClientRect();
      return Boolean(document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)?.closest("[data-job-card]"));
    });
    expect(hit, `${await tab.innerText()} under the card`).toBe(false);
  }
}

for (const [lang, size] of [["es", { width: 911, height: 512 }], ["en", { width: 1366, height: 768 }]] as const) {
  test.describe(`${lang} ${size.width}x${size.height}`, () => {
    test.use({ viewport: size });

    test(`Day 4: the Schedule tab is the learner's schedule, not Day 2's done screen (${lang})`, async ({ page }) => {
      test.slow();
      await signUp(page, lang);
      await page.goto("/studio");
      await waitForInteractive(page);
      await clickIntoPage(page, () => page.getByRole("button", { name: /Start of Day 4: / }).click());
      await page.goto("/");
      await waitForInteractive(page);
      await continuePastStudioArrivalIfPresent(page);
      await expectScheduleHome(page, lang);
      await expect(card(page)).toContainText(lang === "en" ? "Day 4 of 6" : "Día 4 de 6");

      await page.reload();
      await waitForInteractive(page);
      await continuePastStudioArrivalIfPresent(page);
      await expectScheduleHome(page, lang);
    });
  });
}

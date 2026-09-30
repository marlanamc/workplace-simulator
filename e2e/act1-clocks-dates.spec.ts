import { test, expect, type Page } from "@playwright/test";
import { continuePastStudioArrivalIfPresent } from "./studio-arrival";
import { clickIntoPage, waitForInteractive } from "./interactive";

/**
 * Wave 5 F-13: on Day 2 the desktop, the phone calendar and the phone's
 * Messages showed three different times. F-11/F-12: the Spanish inbox mixed
 * "Yesterday", "Mon" and "Aug 18" with "Lun". Phones now run on the shelf's
 * story clock, and inbox dates come from each email's story day.
 */

const card = (page: Page) => page.locator("[data-job-card]");
const hhmm = (t: string) => t.replace(/\s*(AM|PM|a\.\s?m\.|p\.\s?m\.)$/i, "").trim();

async function day2(page: Page, lang: "en" | "es") {
  await page.goto("/login");
  await waitForInteractive(page);
  if (lang === "es") await page.getByRole("button", { name: "Español" }).click();
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(`E2e Clock ${lang} ${Date.now()}`);
  await page.getByPlaceholder("HARBOR-24").fill("TEST-E2E");
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type("1234");
  await page.getByRole("button", { name: /^(Add|Agregar)$/ }).click();
  await page.getByTestId("welcome-continue").click();
  await expect(card(page)).toBeVisible();
  await page.goto("/studio");
  await waitForInteractive(page);
  await clickIntoPage(page, () => page.getByRole("button", { name: /Start of Day 2: / }).click());
  await continuePastStudioArrivalIfPresent(page);
  if (!(await page.locator("[data-app-window]").isVisible())) await card(page).locator(".job-card-primary").first().click();
}

/** Every phone on screen shows the shelf's time (read together, within a minute tick). */
async function phonesMatchShelf(page: Page) {
  await expect(page.getByTestId("phone-clock").first()).toBeVisible();
  await expect
    .poll(async () => {
      const shelf = hhmm((await page.getByTestId("shelf-clock").textContent()) ?? "");
      const phones = (await page.getByTestId("phone-clock").allTextContents()).map(hhmm);
      return phones.length > 0 && phones.every((p) => p === shelf);
    })
    .toBe(true);
}

for (const [lang, size] of [["en", { width: 1366, height: 768 }], ["es", { width: 911, height: 512 }]] as const) {
  test(`Day 2: the phones and the shelf tell the same time (${lang})`, async ({ page }) => {
    test.slow();
    await page.setViewportSize(size);
    await day2(page, lang);
    await page.getByTestId("phone-clock").first().scrollIntoViewIfNeeded();
    await phonesMatchShelf(page);
    // And still after the story minute turns: a phone that counted from its
    // own first render fell a minute behind the shelf at this point.
    await page.waitForTimeout(62_000 - (Date.now() % 60_000));
    await phonesMatchShelf(page);
    // Maria's text arrives on the other phone: same clock.
    await page.locator('[data-showme="swap-button"]').first().click();
    await page.locator('[data-showme="swap-cover"]').selectOption("thu-late");
    await page.locator('[data-showme="submit-button"]').click();
    await expect(page.getByTestId("text-thread")).toBeVisible();
    await phonesMatchShelf(page);
  });
}

test("Day 2 in Spanish: the inbox dates are Spanish and relative to the story day", async ({ page }) => {
  await page.setViewportSize({ width: 911, height: 512 });
  await day2(page, "es");
  await page.getByTestId("bookmark-mail").click();
  const list = page.getByTestId("mail-inbox-list");
  await expect(list).toBeVisible();
  const text = (await list.textContent()) ?? "";
  expect(text).not.toMatch(/\b(Yesterday|Mon|Tue|Wed|Thu|Fri|Sat|Sun|Aug)\b/);
  // Wednesday the 19th: Maria's welcome (Monday evening) is "Lun", and the
  // account emails from Sunday are "Dom". Before, Mail dated this inbox from
  // the finished Night Before job: "6:02 PM" (today) and "Ayer".
  await expect(list).toContainText("Lun");
  await expect(list).toContainText("Dom");
  expect(text).not.toMatch(/\d:\d\d/);
  expect(text).not.toContain("Ayer");
});

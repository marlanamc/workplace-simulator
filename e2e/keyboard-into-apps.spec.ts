import { test, expect, type Page, type Locator } from "@playwright/test";
import { clickIntoPage, waitForInteractive } from "./interactive";

/**
 * Phase 3 F-14: How this works and the compose boxes kept keyboard focus,
 * but whenever the Portal, Mail or the Time Clock opened, focus went to the
 * page and it took 17 to 25 Tabs to reach the first control. Day 5's
 * sick-call box, opened from "Write to Maria", did not get the cursor.
 * Each day here is entered with Enter on its arrival card, and the next
 * control must be a few Tabs away (never focused for the learner when
 * finding it is the job, like Day 2's Thursday).
 */

type Lang = "en" | "es";
const card = (page: Page) => page.locator("[data-job-card]");
const modal = (page: Page) => page.locator("div.fixed.inset-0.z-\\[80\\]");
const MAX_TABS = 8;

async function signUp(page: Page, lang: Lang) {
  await page.goto("/login");
  await waitForInteractive(page);
  if (lang === "es") await page.getByRole("button", { name: "Español" }).click();
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(`E2e Keys2 ${lang} ${Date.now() % 1_000_000}`);
  await page.getByPlaceholder("HARBOR-24").fill("TEST-E2E");
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type("1234");
  await page.getByRole("button", { name: /^(Add|Agregar)$/ }).click();
  await page.getByTestId("welcome-continue").click();
  await expect(card(page)).toBeVisible();
}

/** Jump to a day, then enter it the way a keyboard learner does: Enter on the arrival card. */
async function enterDay(page: Page, day: RegExp) {
  await page.goto("/studio");
  await waitForInteractive(page);
  await clickIntoPage(page, () => page.getByRole("button", { name: day }).click());
  const go = modal(page).locator("[data-celebration-continue]");
  await expect(go).toBeFocused({ timeout: 20_000 });
  await page.keyboard.press("Enter");
  await expect(modal(page)).toHaveCount(0);
  // Where the card's own button opens the job, that is Enter too.
  const appWindow = page.locator("[data-app-window]");
  for (let i = 0; i < 2 && !(await appWindow.isVisible()); i++) {
    await expect(card(page).locator(".job-card-primary").first()).toBeFocused();
    await page.keyboard.press("Enter");
    await appWindow.waitFor({ state: "visible", timeout: 5_000 }).catch(() => {});
  }
  await expect(appWindow).toBeVisible();
}

/** Focus is not lost, and Tab reaches `target` in a few presses. */
async function tabsTo(page: Page, target: Locator) {
  await target.waitFor({ state: "visible" });
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => document.activeElement === document.body || !document.activeElement), "focus lost to the page").toBe(false);
  for (let tabs = 0; tabs <= MAX_TABS; tabs++) {
    if (await target.evaluate((el) => el === document.activeElement)) return tabs;
    await page.keyboard.press("Tab");
  }
  throw new Error(`more than ${MAX_TABS} Tabs to reach the control`);
}

for (const [lang, size] of [["es", { width: 911, height: 512 }], ["en", { width: 1366, height: 768 }]] as const) {
  test.describe(`${lang} ${size.width}x${size.height}`, () => {
    test.use({ viewport: size });

    test(`Day 5: "Write to Maria", straight after Day 4, puts the cursor in the message (${lang})`, async ({ page }) => {
      test.slow();
      await signUp(page, lang);
      // Finish Day 4 in Mail, so Mail is already open when Day 5 starts: the
      // way a learner plays it, and the case that lost the cursor.
      await enterDay(page, /Start of Day 4: /);
      await page.getByRole("button", { name: /Darnell Washington/ }).first().click();
      await page.getByRole("button", { name: /^(Reply|Responder)$/ }).click();
      await page.locator("textarea").first().fill(lang === "en" ? "Hi Darnell, the extra aprons are in the storage room." : "Hola Darnell, los delantales de más están en el almacén.");
      await page.getByRole("button", { name: /^(Send|Enviar)$/ }).click();
      const go = modal(page).locator("[data-celebration-continue]");
      await expect(go).toBeFocused({ timeout: 20_000 });
      await page.keyboard.press("Enter");
      await expect(modal(page)).toHaveCount(0);
      await expect(page.locator('[data-showme="compose-body"]').first()).toBeFocused();

      // After a reload, the card's button brings the cursor back to the message.
      await page.reload();
      await waitForInteractive(page);
      if (await go.isVisible().catch(() => false)) await page.keyboard.press("Enter");
      if (!(await page.locator("[data-app-window]").isVisible())) {
        await expect(card(page).locator(".job-card-primary").first()).toBeFocused();
        await page.keyboard.press("Enter");
      }
      await expect(page.locator('[data-showme="compose-body"]').first()).toBeFocused();
    });

    test(`Days 2, 3, 4 and 6: the next control is a few Tabs away (${lang})`, async ({ page }) => {
      test.slow();
      await signUp(page, lang);

      // Day 2: the schedule. The first Request a swap, not Thursday's.
      await enterDay(page, /Start of Day 2: /);
      await tabsTo(page, page.getByRole("button", { name: /^(Request a swap|Pedir un cambio)$/ }).first());
      expect(await page.locator('[data-showme="swap-button"]').evaluate((el) => el === document.activeElement)).toBe(false);

      // Day 3: the Time Clock.
      await enterDay(page, /Start of Day 3: /);
      await tabsTo(page, page.locator('[data-showme="clockin-button"]'));
      await page.keyboard.press("Enter");
      await tabsTo(page, page.getByRole("button", { name: /^(Looks right|Se ve bien)$/ }));

      // Day 4: Mail's inbox.
      await enterDay(page, /Start of Day 4: /);
      await tabsTo(page, page.getByRole("button", { name: /Darnell Washington/ }).first());

      // Day 6: the pay stub list, then the questions after the stub.
      await enterDay(page, /Start of Day 6: /);
      await tabsTo(page, page.locator('[data-showme="target-stub"]'));
      await page.keyboard.press("Enter");
      await expect(card(page).locator(".job-card-primary").first()).toBeFocused();
      await page.keyboard.press("Enter");
      await tabsTo(page, page.getByRole("button", { name: "$720.00", exact: true }));
    });
  });
}

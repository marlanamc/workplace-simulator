import { test, expect, type Page } from "@playwright/test";
import { continuePastStudioArrivalIfPresent } from "./studio-arrival";
import { clickIntoPage, waitForInteractive } from "./interactive";

/**
 * Wave 5 F-14: after card actions, keyboard focus was lost (to the page) or
 * landed on the wrong thing (the fold button, where Enter hides the card).
 * It took 13 Tabs to reach Mail and 18 to reach "I understand". Now each
 * step puts focus on the next thing to press, so How this works can be done
 * with Enter alone.
 */

type Lang = "en" | "es";
const card = (page: Page) => page.locator("[data-job-card]");
const primary = (page: Page) => card(page).locator(".job-card-primary");

async function signUp(page: Page, lang: Lang) {
  await page.goto("/login");
  await waitForInteractive(page);
  if (lang === "es") await page.getByRole("button", { name: "Español" }).click();
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(`E2e Keys ${lang} ${Date.now()}`);
  await page.getByPlaceholder("HARBOR-24").fill("TEST-E2E");
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type("1234");
  await page.getByRole("button", { name: /^(Add|Agregar)$/ }).click();
  await page.getByTestId("welcome-continue").click();
  await expect(card(page)).toBeVisible();
}

/**
 * The focused element matches, then Enter. Nothing else is pressed. Then
 * wait for focus to move on (the next step's control), so the next check is
 * about the next step: pressing again in the frame before focus arrives
 * would press nothing, which a person cannot do but a test can.
 */
async function enterOn(page: Page, expected: ReturnType<Page["locator"]>) {
  await expect(expected).toBeFocused();
  await expectFocusSeen(page);
  const pressed = await page.evaluate(() => document.activeElement?.textContent ?? "");
  await page.keyboard.press("Enter");
  await expect
    .poll(() => page.evaluate(() => document.activeElement?.textContent ?? ""), { timeout: 5_000 })
    .not.toBe(pressed)
    .catch(() => {});
}

/**
 * Focus a keyboard learner cannot see is no better than lost focus: at 911
 * Help's close button had focus but sat below the card's fold and the screen.
 * The focused element must be on screen and inside every box that scrolls it.
 */
async function expectFocusSeen(page: Page) {
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const el = document.activeElement;
          if (!(el instanceof HTMLElement) || el === document.body) return "nothing focused";
          const r = el.getBoundingClientRect();
          const clips = [{ top: 0, bottom: innerHeight, left: 0, right: innerWidth, name: "screen" }];
          for (let a = el.parentElement; a; a = a.parentElement) {
            const s = getComputedStyle(a);
            if (/(auto|scroll|hidden)/.test(s.overflowY + s.overflowX)) {
              const b = a.getBoundingClientRect();
              clips.push({ top: b.top, bottom: b.bottom, left: b.left, right: b.right, name: a.className.slice(0, 40) });
            }
          }
          const out = clips.find((c) => r.top < c.top - 1 || r.bottom > c.bottom + 1 || r.left < c.left - 1 || r.right > c.right + 1);
          return out ? `"${el.textContent?.trim().slice(0, 30)}" is outside ${out.name}` : "seen";
        }),
      { timeout: 3_000 },
    )
    .toBe("seen");
}

async function startOf(page: Page, day: RegExp) {
  await page.goto("/studio");
  await waitForInteractive(page);
  await clickIntoPage(page, () => page.getByRole("button", { name: day }).click());
}

for (const [lang, size] of [["en", { width: 1366, height: 768 }], ["es", { width: 911, height: 512 }]] as const) {
  test.describe(`${lang} ${size.width}x${size.height}`, () => {
    test.use({ viewport: size });

    test(`How this works with Enter alone (${lang})`, async ({ page }) => {
      await signUp(page, lang);
      // Welcome beat: "Start looking around".
      await enterOn(page, primary(page));
      // "These are your bookmarks." [Next]
      await expect(card(page)).toContainText(lang === "en" ? "These are your bookmarks." : "Estos son tus marcadores.");
      await enterOn(page, primary(page));
      // "Click Mail." The bookmark itself has focus.
      await enterOn(page, page.getByTestId("bookmark-mail"));
      // "This is your work email." [I understand]
      await expect(page.getByTestId("mail-app-title")).toBeVisible();
      await enterOn(page, primary(page));
      // "Tap the ?": the ? has focus.
      await enterOn(page, card(page).getByTestId("job-card-help"));
      // Help is open: its close button has focus.
      await enterOn(page, primary(page));
      // "You tried Help." [I'm ready for the task]
      await enterOn(page, primary(page));
      // The level card's button, then Day One's list pin beat.
      await enterOn(page, page.locator("[data-celebration-continue]"));
      await enterOn(page, primary(page));
      await expect(card(page)).not.toContainText(lang === "en" ? "orange button" : "botón naranja");
    });

    test(`the message box has the cursor when a message opens ready to write (${lang})`, async ({ page }) => {
      await signUp(page, lang);
      // Day 5: the sick call opens straight into a new message.
      await startOf(page, /Start of Day 5: /);
      await continuePastStudioArrivalIfPresent(page);
      await expect(page.locator('[data-showme="compose-body"]').first()).toBeFocused();
      // Day 3: the note to Maria about the clock-in.
      await startOf(page, /Start of Day 3: /);
      await continuePastStudioArrivalIfPresent(page);
      await page.locator('[data-showme="clockin-button"]').click();
      await page.locator('[data-showme="something-off-button"]').click();
      await expect(page.locator('[data-showme="compose-body"]').first()).toBeFocused();
    });

    test(`the Act II intro starts on its button, in view (${lang})`, async ({ page }) => {
      await signUp(page, lang);
      await startOf(page, /Start of Day 7: /);
      const start = page.getByTestId("act-intro-continue");
      await expect(start).toBeFocused();
      await expect(start).toBeInViewport();
    });
  });
}

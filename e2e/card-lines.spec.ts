import { test, expect, type Page } from "@playwright/test";
import { FORM_STEPS, RIGHT_NOW_STEPS as SWAP_STEPS } from "@/lib/tasks/swap-request/content";
import { RIGHT_NOW_STEPS as NOTE_STEPS } from "@/lib/tasks/shift-review/content";
import { RIGHT_NOW_STEPS as CLOCK_STEPS } from "@/lib/tasks/timeclock/content";
import { MAIL_JOB_CARD_STEPS } from "@/lib/tasks/mail/content";
import { continuePastStudioArrivalIfPresent } from "./studio-arrival";
import { clickIntoPage, waitForInteractive } from "./interactive";
import { pressNextTask } from "./next-task";

/**
 * Wave 5 F-4, F-5, F-10: the Job Card's line and its Show me must name the
 * moment the learner is in.
 * - Day 2 swap form: Show me lit Submit while the line asked for a choice.
 * - Day 3 shift note: the card never said Submit, and Show me lit the box.
 * - Days 3 and 5: after a refused send the line still said "Click Send"
 *   above a correction that asked for something else.
 */

type Lang = "en" | "es";
type Box = { x: number; y: number; width: number; height: number };
const card = (page: Page) => page.locator("[data-job-card]");
const line = (page: Page) => card(page).locator("[data-card-line]");
const intersects = (a: Box, b: Box) =>
  a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

async function signUp(page: Page, lang: Lang) {
  await page.goto("/login");
  await waitForInteractive(page);
  if (lang === "es") await page.getByRole("button", { name: "Español" }).click();
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(`E2e Lines ${lang} ${Date.now()}`);
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
  await page.goto("/");
  await waitForInteractive(page);
  await continuePastStudioArrivalIfPresent(page);
  for (let i = 0; i < 3 && !(await page.locator("[data-app-window]").isVisible()); i++) {
    await card(page).locator(".job-card-primary").first().click();
    await page.locator("[data-app-window]").waitFor({ timeout: 4_000 }).catch(() => {});
  }
}

/** Show me lights this target, and the card is not on top of it. */
async function showMeLights(page: Page, id: string) {
  await card(page).getByRole("button", { name: /^(Show me|Muéstrame)$/ }).click();
  const ring = page.locator(".animate-showme-pulse").first();
  await expect(ring).toBeVisible();
  const target = page.locator(`[data-showme="${id}"]`).first();
  await expect(target).toBeInViewport();
  const [r, t] = [(await ring.boundingBox())!, (await target.boundingBox())!];
  const cx = t.x + t.width / 2;
  const cy = t.y + t.height / 2;
  expect(cx > r.x && cx < r.x + r.width && cy > r.y && cy < r.y + r.height, `Show me is on ${id}`).toBe(true);
  // The card moves off the target (or is docked beside the window).
  await expect.poll(async () => intersects((await card(page).boundingBox())!, (await target.boundingBox())!)).toBe(false);
  await page.keyboard.press("Escape");
}

for (const [lang, size] of [["en", { width: 1366, height: 768 }], ["es", { width: 911, height: 512 }]] as const) {
  test.describe(`${lang} ${size.width}x${size.height}`, () => {
    test.use({ viewport: size });

    test(`Day 2 swap form: the line and Show me follow the empty choice (${lang})`, async ({ page }) => {
      await signUp(page, lang);
      await startOf(page, /Start of Day 2: /);
      await page.locator('[data-showme="swap-button"]').first().click();
      // Thursday came from the schedule; the empty choice is the cover shift.
      await expect(line(page)).toHaveText(SWAP_STEPS[0][lang]);
      await showMeLights(page, "swap-cover");

      // A wrong cover: the card stays on the choice, with the correction.
      await page.locator('[data-showme="swap-cover"]').selectOption("thu-early");
      await expect(line(page)).toHaveText(FORM_STEPS.submit[lang]);
      await page.locator('[data-showme="submit-button"]').click();
      await expect(line(page)).toHaveText(SWAP_STEPS[0][lang]);
      await expect(card(page)).toContainText(lang === "en" ? "still covers 11 AM" : "todavía cubre las 11 AM");

      // The right cover: now, and only now, Submit.
      await page.locator('[data-showme="swap-cover"]').selectOption("thu-late");
      await expect(line(page)).toHaveText(FORM_STEPS.submit[lang]);
      await showMeLights(page, "submit-button");
    });

    test(`Day 3: Submit once the note has words, and no "Click Send" over a correction (${lang})`, async ({ page }) => {
      await signUp(page, lang);
      await startOf(page, /Start of Day 3: /);

      // The note to Maria: a refused note puts the card back on writing.
      await page.locator('[data-showme="clockin-button"]').click();
      await page.locator('[data-showme="something-off-button"]').click();
      const note = page.locator('[data-showme="compose-body"]').first();
      await note.fill(lang === "en" ? "hi maria. clock is wrong" : "hola maria. el reloj está mal");
      await expect(line(page)).toHaveText(MAIL_JOB_CARD_STEPS.send[lang]);
      await page.locator('[data-showme="send-button"]').first().click();
      await expect(line(page)).toHaveText(CLOCK_STEPS[2][lang]);
      await expect(card(page)).toContainText(lang === "en" ? "Tell Maria what time you got here" : "Dile a Maria a qué hora llegaste");
      await note.fill(lang === "en" ? "hi maria. clock is wrong. i come 7" : "hola maria. el reloj está mal. llegué a las 7");
      await expect(line(page)).toHaveText(MAIL_JOB_CARD_STEPS.send[lang]);
      await page.locator('[data-showme="send-button"]').first().click();
      await pressNextTask(page);

      // The shift note, opened from the card the way a learner would.
      for (let i = 0; i < 3 && !(await page.locator('[data-showme="shift-note-box"]').isVisible()); i++) {
        await card(page).locator(".job-card-primary").first().click();
        await page.locator('[data-showme="shift-note-box"]').waitFor({ timeout: 4_000 }).catch(() => {});
      }
      const box = page.locator('[data-showme="shift-note-box"]');
      await expect(line(page)).toHaveText(NOTE_STEPS[0][lang]);
      await box.fill(lang === "en" ? "busy" : "mucha gente");
      await expect(line(page)).toHaveText(NOTE_STEPS[1][lang]);
      await page.locator('[data-showme="shift-note-submit"]').click();
      await expect(line(page)).toHaveText(NOTE_STEPS[0][lang]);
      await box.fill(lang === "en" ? "It got busy at 11am." : "Se puso ocupado a las 11.");
      await expect(line(page)).toHaveText(NOTE_STEPS[1][lang]);
      await showMeLights(page, "shift-note-submit");
    });
  });
}

test("Day 5 in Spanish: a refused sick call puts the card back on writing", async ({ page }) => {
  await page.setViewportSize({ width: 911, height: 512 });
  await signUp(page, "es");
  await startOf(page, /Start of Day 5: /);
  const body = page.locator('[data-showme="compose-body"]').first();
  await body.fill("hola maria estoy enferma");
  await expect(line(page)).toHaveText(MAIL_JOB_CARD_STEPS.send.es);
  await page.locator('[data-showme="send-button"]').first().click();
  await expect(line(page)).not.toHaveText(MAIL_JOB_CARD_STEPS.send.es);
  await expect(card(page)).toContainText("Hoy no puedo ir");
  await body.fill("hola maria estoy enferma. no puedo ir hoy");
  await expect(line(page)).toHaveText(MAIL_JOB_CARD_STEPS.send.es);
});

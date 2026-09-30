import { test, expect, type Page } from "@playwright/test";
import { LEVELS } from "@/lib/tracks-content";
import { dayTitle } from "@/lib/shift-spine";
import { continuePastStudioArrivalIfPresent } from "./studio-arrival";
import { clickIntoPage, waitForInteractive } from "./interactive";

/**
 * Story Mode Audit finding #2: the Job Card sat on top of the button the
 * learner had to press in 20+ tasks, at 100% zoom on a Chromebook-sized
 * window. Show me then pointed underneath the card. At 150% text (911 wide)
 * the card now docks beside the window, so there it must not touch the
 * window at all.
 *
 * For every day, this opens the day's first task and checks that no visible
 * Show me target (`[data-showme]`) is under the card. The card moves to a
 * clear corner on its own (`chooseCorner` in `job-card-placement.ts`); this
 * is that work's acceptance test.
 */

const CLASS_CODE = "TEST-E2E";

const VIEWPORTS = [
  { name: "chromebook 100%", width: 1366, height: 768 },
  { name: "chromebook 150%", width: 911, height: 512 },
];

type Box = { x: number; y: number; width: number; height: number };

const intersects = (a: Box, b: Box) =>
  a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

async function signUp(page: Page, name: string) {
  await page.goto("/login");
  await waitForInteractive(page);
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(name);
  await page.getByPlaceholder("HARBOR-24").fill(CLASS_CODE);
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type("1234");
  await page.getByRole("button", { name: /^(Add|Agregar)$/ }).click();
  await expect(page.getByTestId("simulator-welcome")).toBeVisible({ timeout: 20_000 });
  await page.getByTestId("welcome-continue").click();
}

/**
 * Jump to the start of a day, step past whatever opens it (an act's intro
 * screen, the arrival card), then press the card's hand-off button until the
 * day's first task window is on screen.
 */
async function openDay(page: Page, studioLabel: string) {
  await page.goto("/studio");
  await waitForInteractive(page);
  await clickIntoPage(page, () => page.getByRole("button", { name: studioLabel, exact: true }).click());
  const card = page.locator("[data-job-card]");
  const intro = page.getByTestId("act-intro");
  const arrival = page.locator("div.fixed.inset-0.z-\\[80\\]");
  await expect(card.or(intro).or(arrival).first()).toBeVisible({ timeout: 20_000 });
  if (await intro.isVisible()) await page.getByTestId("act-intro-continue").click();
  await continuePastStudioArrivalIfPresent(page);
  await expect(card).toBeVisible({ timeout: 20_000 });
  const appWindow = page.locator("[data-app-window]");
  // Day One's first sitting asks the learner to look at the list pin before
  // the hand-off, so there can be two card buttons before the task opens.
  for (let press = 0; press < 3 && !(await appWindow.isVisible()); press++) {
    await card.locator(".job-card-primary").first().click();
    await appWindow.waitFor({ state: "visible", timeout: 3_000 }).catch(() => {});
  }
  await expect(appWindow).toBeVisible();
}

/** Every visible Show me target that the card's box overlaps, by its data-showme id. */
async function coveredTargets(page: Page): Promise<string[]> {
  const cardBox = await page.locator("[data-job-card]").boundingBox();
  if (!cardBox) return [];
  const covered: string[] = [];
  for (const target of await page.locator("[data-showme]").all()) {
    if (!(await target.isVisible())) continue;
    const box = await target.boundingBox();
    if (box && intersects(box, cardBox)) covered.push((await target.getAttribute("data-showme")) ?? "?");
  }
  return covered;
}

/** Studio's own button labels, one per day (both Act V paths). */
const STUDIO_DAYS: string[] = LEVELS.slice(1).flatMap((level) => {
  const title = dayTitle(level, "en");
  return level.pathTracks
    ? [`Start of ${title} · College`, `Start of ${title} · Front desk`]
    : [`Start of ${title}`];
});

for (const viewport of VIEWPORTS) {
  test.describe(`Job Card never covers a Show me target (${viewport.name})`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test("every day's first task", async ({ page }) => {
      test.setTimeout(STUDIO_DAYS.length * 30_000);
      await signUp(page, `E2e Overlap ${Date.now()}`);

      const failures: string[] = [];
      for (const day of STUDIO_DAYS) {
        await openDay(page, day);
        // The card glides to a clear corner (a 0.22s move) once the task has
        // laid out; give it a moment before reading what it still covers.
        let covered: string[] = [];
        await expect
          .poll(async () => (covered = await coveredTargets(page)), { timeout: 3_000 })
          .toEqual([])
          .catch(() => {});
        if (covered.length) failures.push(`${day}: ${covered.join(", ")}`);
        // Below 1100px wide the card docks beside the window (Wave 5 F-3):
        // it must not touch the window at all, not just its Show me targets.
        if (viewport.width < 1100) {
          const card = page.locator("[data-job-card]");
          if ((await card.getAttribute("data-corner")) !== "dock") failures.push(`${day}: card not docked`);
          const cardBox = await card.boundingBox();
          const windowBox = await page.locator("[data-app-window]").boundingBox();
          if (cardBox && windowBox && intersects(cardBox, windowBox)) failures.push(`${day}: card overlaps the window`);
        }
      }
      expect(failures, "Show me targets under the Job Card").toEqual([]);
    });
  });
}

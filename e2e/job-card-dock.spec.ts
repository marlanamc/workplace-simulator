import { test, expect, type Page } from "@playwright/test";
import { clickIntoPage, waitForInteractive } from "./interactive";
import { continuePastStudioArrivalIfPresent } from "./studio-arrival";

/**
 * Wave 5 F-2/F-25 (the runaway scroll gutter) and the owner's docked Job Card
 * (F-3, F-16, F-17). Below 1100px wide the card is a fixed strip on the left
 * and the app window narrows beside it; above that it floats. These try to
 * break both: live resizes, a reload, Spanish, a card held in a bottom
 * corner, and the one app (Mail) whose wide layout does not fit beside it.
 */

const CLASS_CODE = "TEST-E2E";
const ZOOMED = { width: 911, height: 512 };
const LAPTOP = { width: 1366, height: 768 };

type Box = { x: number; y: number; width: number; height: number };
const intersects = (a: Box, b: Box) =>
  a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

const card = (page: Page) => page.locator("[data-job-card]");
const appWindow = (page: Page) => page.locator("[data-app-window]");

async function signUp(page: Page, name: string, lang: "en" | "es" = "en") {
  await page.goto("/login");
  await waitForInteractive(page);
  if (lang === "es") await page.getByRole("button", { name: "Español" }).click();
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(name);
  await page.getByPlaceholder("HARBOR-24").fill(CLASS_CODE);
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type("1234");
  await page.getByRole("button", { name: /^(Add|Agregar)$/ }).click();
  await expect(page.getByTestId("simulator-welcome")).toBeVisible({ timeout: 20_000 });
  await page.getByTestId("welcome-continue").click();
  await expect(card(page)).toBeVisible();
}

/** Jump to a day, then reload without `?from=studio`, so the page is laid out
 *  exactly as a learner's is (no Studio bar taking 36px off the top). */
async function openDay(page: Page, studioLabel: string) {
  await page.goto("/studio");
  await waitForInteractive(page);
  await clickIntoPage(page, () => page.getByRole("button", { name: studioLabel, exact: true }).click());
  await page.goto("/");
  await waitForInteractive(page);
  await continuePastStudioArrivalIfPresent(page);
  for (let press = 0; press < 3 && !(await appWindow(page).isVisible()); press++) {
    await card(page).locator(".job-card-primary").first().click();
    await appWindow(page).waitFor({ state: "visible", timeout: 3_000 }).catch(() => {});
  }
  await expect(appWindow(page)).toBeVisible();
}

async function expectDockedBeside(page: Page) {
  await expect(card(page)).toHaveAttribute("data-corner", "dock");
  const cardBox = (await card(page).boundingBox())!;
  const windowBox = (await appWindow(page).boundingBox())!;
  expect(intersects(cardBox, windowBox), "card overlaps the window").toBe(false);
  expect(cardBox.x + cardBox.width).toBeLessThanOrEqual(windowBox.x);
  // Nothing hangs off the right edge (no horizontal page scroll).
  expect(windowBox.x + windowBox.width).toBeLessThanOrEqual(page.viewportSize()!.width);
}

/** Tallest page scroll area in the window, now and a moment later. */
async function scrollAreaGrowth(page: Page): Promise<[number, number]> {
  const read = () =>
    page.evaluate(() =>
      Math.max(0, ...[...document.querySelectorAll("[data-app-window] .overflow-y-auto")].map((e) => e.scrollHeight)),
    );
  const first = await read();
  await page.waitForTimeout(1_500);
  return [first, await read()];
}

for (const lang of ["en", "es"] as const) {
  test(`at 911x512 the card docks beside the window and nothing grows (${lang})`, async ({ page }) => {
    await page.setViewportSize(ZOOMED);
    await signUp(page, `E2e Dock ${lang} ${Date.now()}`, lang);
    await openDay(page, "Start of Day 2: The First Week");
    await expectDockedBeside(page);
    // Docked, there is nothing to drag or fold.
    await expect(card(page).getByTestId("job-card-collapse")).toHaveCount(0);
    await expect(card(page).getByTestId("job-card-drag-handle")).not.toHaveAttribute("role", "button");

    // The audit's runaway gutter grew this page by ~12,500px a second.
    const [before, after] = await scrollAreaGrowth(page);
    expect(after).toBe(before);
    expect(after).toBeLessThan(3_000);

    // Show me lands on a target inside the screen, and the target is clear of the card.
    await card(page).getByRole("button", { name: /Show me|Muéstrame/ }).click();
    const target = page.locator('[data-showme="swap-button"]').first();
    const targetBox = (await target.boundingBox())!;
    expect(targetBox.y + targetBox.height).toBeLessThanOrEqual(ZOOMED.height);
    expect(intersects(targetBox, (await card(page).boundingBox())!)).toBe(false);

    // A reload comes back docked.
    await page.reload();
    await waitForInteractive(page);
    await continuePastStudioArrivalIfPresent(page);
    await expect(card(page)).toHaveAttribute("data-corner", "dock");
  });
}

test("the card docks and floats as the window is resized, without a reload", async ({ page }) => {
  await page.setViewportSize(LAPTOP);
  await signUp(page, `E2e Dock resize ${Date.now()}`);
  await openDay(page, "Start of Day 2: The First Week");
  await expect(card(page)).not.toHaveAttribute("data-corner", "dock");
  await expect(card(page).getByTestId("job-card-collapse")).toBeVisible();

  await page.setViewportSize(ZOOMED);
  await expectDockedBeside(page);

  // Right at the breakpoint on either side.
  await page.setViewportSize({ width: 1099, height: 700 });
  await expectDockedBeside(page);
  await page.setViewportSize({ width: 1100, height: 700 });
  await expect(card(page)).not.toHaveAttribute("data-corner", "dock");
  const windowBox = (await appWindow(page).boundingBox())!;
  expect(windowBox.x).toBeLessThan(20);

  // Folded while floating, then docked: the dock shows the whole card anyway.
  await card(page).getByTestId("job-card-collapse").click();
  await page.setViewportSize(ZOOMED);
  await expect(card(page).locator("[data-card-line]")).toBeVisible();
});

test("a card held in a bottom corner on a short wide screen does not grow the page", async ({ page }) => {
  // Floating (wider than 1100) but short, with the card held where a learner
  // put it: the exact case that sent the gutter into a loop before the fix.
  await page.setViewportSize({ width: 1280, height: 560 });
  await signUp(page, `E2e Gutter ${Date.now()}`);
  await openDay(page, "Start of Day 2: The First Week");
  await page.locator('[data-showme="swap-button"]').first().click();
  await expect(page.locator('[data-showme="submit-button"]')).toBeAttached();
  const handle = card(page).getByTestId("job-card-drag-handle");
  await handle.focus();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowLeft");
  await expect(card(page)).toHaveAttribute("data-corner", "bl");

  const [before, after] = await scrollAreaGrowth(page);
  expect(after).toBe(before);
  expect(after).toBeLessThan(3_000);

  // The gutter still does its job: there is room to scroll the last control
  // (Submit) all the way up to the top of the page, above a bottom card.
  const submit = page.locator('[data-showme="submit-button"]');
  const [submitTop, areaTop] = await submit.evaluate((el) => {
    el.scrollIntoView({ block: "start" });
    const area = el.closest(".overflow-y-auto")!;
    return [el.getBoundingClientRect().top, area.getBoundingClientRect().top];
  });
  expect(submitTop - areaTop).toBeLessThan(40);
});

test("docked, Mail shows one pane and its Send button is reachable (Day 3)", async ({ page }) => {
  await page.setViewportSize(ZOOMED);
  await signUp(page, `E2e Dock mail ${Date.now()}`);
  await openDay(page, "Start of Day 3: Clock-In Fix");
  await page.locator('[data-showme="clockin-button"]').click();
  await page.locator('[data-showme="something-off-button"]').click();
  const send = page.locator('[data-showme="send-button"]');
  await expect(send).toBeVisible();
  await expectDockedBeside(page);
  // One pane: the inbox list is hidden while the message is open.
  await expect(page.getByTestId("mail-inbox-list")).toBeHidden();
  await appWindow(page).locator("textarea").first().fill("hi maria i come 7. clock say 8:15. sorry");
  await send.click();
  await expect(card(page).getByRole("button", { name: "Next task" })).toBeVisible();
});

test("docked, the launcher opens beside the card, not under it", async ({ page }) => {
  await page.setViewportSize(ZOOMED);
  await signUp(page, `E2e Dock launcher ${Date.now()}`);
  await openDay(page, "Start of Day 2: The First Week");
  await page.getByTestId("shelf-start").click();
  const panel = page.getByTestId("launcher-panel");
  await expect(panel).toBeVisible();
  const panelBox = (await panel.boundingBox())!;
  expect(intersects(panelBox, (await card(page).boundingBox())!)).toBe(false);
  expect(panelBox.x + panelBox.width).toBeLessThanOrEqual(ZOOMED.width);
});

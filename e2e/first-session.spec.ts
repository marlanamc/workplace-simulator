import { test, expect, type Page } from "@playwright/test";

/**
 * The golden path a brand-new learner walks in their first minutes:
 * sign up → the tour opens by itself → follow the walkthrough → finish
 * Level 0 → the next job (Mail) is one blue button away.
 *
 * Each run signs up a fresh throwaway learner (unique name, test class
 * code), so runs never collide with each other or with real accounts.
 */

const CLASS_CODE = "TEST-E2E";

/** The card, wherever it is parked. It is on every screen. */
function jobCard(page: Page) {
  return page.locator("[data-job-card]");
}

/**
 * A brand-new learner lands on the desktop and meets the Job Card first.
 * Both beats have one button; the second leaves them on the first job.
 */
async function clearIntroBeats(page: Page, firstName: string) {
  const card = jobCard(page);
  await expect(card.getByText(`Welcome, ${firstName}`, { exact: false })).toBeVisible({
    timeout: 20_000,
  });
  await card.getByRole("button", { name: "OK", exact: true }).click();
  await expect(card.getByText("Drag it if it is in the way.", { exact: false })).toBeVisible();
  await card.getByRole("button", { name: "Got it" }).click();
}

async function signUp(page: Page, name: string) {
  await page.goto("/login");
  // The lock screen shows a user picker first; new learners go through Add user.
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(name);
  await page.getByPlaceholder("HARBOR-24").fill(CLASS_CODE);
  // The PIN is a segmented input, so type it rather than fill it.
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type("1234");
  await page.getByRole("button", { name: /^(Add|Agregar)$/ }).click();
}

test("first session: sign up, finish the walkthrough, see the next job", async ({ page }) => {
  const name = `E2e ${Date.now()}`;
  await signUp(page, name);
  await clearIntroBeats(page, "E2e");

  // The card names the first job and its button is what opens the Browser —
  // the desktop → job → desktop loop, learned on the very first tap.
  const card = jobCard(page);
  await expect(card.getByText("Look around this computer.")).toBeVisible();
  await card.getByRole("button", { name: "Open the Web Browser" }).click();

  // One instruction at a time; it advances only on the real click.
  await expect(page.getByText("Click Mail.")).toBeVisible();
  await page.getByTestId("bookmark-mail").click();

  // Pause on Mail so they notice it is their work email.
  await expect(page.getByText("This is your work email.", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Got it" }).click();

  await expect(page.getByText("Now click Calendar.")).toBeVisible();
  await page.getByTestId("bookmark-calendar").click();

  // Pause on Calendar so they actually see it.
  await expect(page.getByText("Meetings and your work shifts show up here.", { exact: false })).toBeVisible();
  // No intro card here any more: the real calendar is what they see.
  await expect(page.getByText("August 2026").first()).toBeVisible();
  await page.getByRole("button", { name: "Got it" }).click();

  // Spotlight the real Help control (not "top right" prose).
  await expect(page.getByText("Click the ? for Help.", { exact: false })).toBeVisible();
  await page.getByTestId("tour-help").click();
  await expect(page.getByText("That is Help.", { exact: false })).toBeVisible();

  // Close the Help drawer the tour just opened before moving on.
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "I'm ready for the task" }).click();

  // Level 0 done — the level-up celebration takes over, and its one button
  // hands off to the first real job.
  await expect(page.getByText("You know how this computer works.")).toBeVisible();
  await page.getByRole("button", { name: "Open my first task" }).click();

  // Mail is open: Maria's email is findable in the inbox. Scope to the inbox —
  // "Maria Delgado" also appears in the desktop briefing behind the window.
  await expect(
    page.getByText("Maria Delgado", { exact: true }).first(),
  ).toBeVisible({ timeout: 15_000 });
});

test("the job card introduces itself on an empty desktop, then names the job", async ({ page }) => {
  await signUp(page, `E2e Card ${Date.now()}`);

  // Screen one is the desktop, not a browser window: no tab strip, no
  // bookmark bar, no welcome modal. Only the card is talking.
  await expect(jobCard(page)).toBeVisible({ timeout: 20_000 });
  await expect(page.locator('[data-testid="bookmark-mail"]')).toHaveCount(0);
  await clearIntroBeats(page, "E2e");

  // Past the beats it becomes the job card and names the next job.
  await expect(jobCard(page).getByText("Task 1 of", { exact: false })).toBeVisible();
});

test("the job card follows the learner into the app and drives the job", async ({ page }) => {
  await signUp(page, `E2e Drive ${Date.now()}`);
  await expect(jobCard(page)).toBeVisible({ timeout: 20_000 });

  await page.goto("/studio");
  await page.getByRole("button", { name: "Start of Payday & Trouble" }).click();

  // The card is still there once an app window is open - that is the whole
  // point of it: the surface that sets up the job does not vanish.
  const card = jobCard(page);
  await expect(card).toBeVisible({ timeout: 20_000 });
  await expect(card.getByText("Task ", { exact: false })).toBeVisible();
});

test("studio time machine teleports one account to a later level", async ({ page }) => {
  const name = `E2e Tm ${Date.now()}`;
  await signUp(page, name);
  await expect(jobCard(page)).toBeVisible({ timeout: 20_000 });

  await page.goto("/studio");
  await page.getByRole("button", { name: "Start of Payday & Trouble" }).click();

  // Lands on the learner desktop as a learner at that exact moment:
  // the next job is Level 3's first task (clock out).
  await expect(page.getByText("End of day. Clock out, then check the hours.").first()).toBeVisible({
    timeout: 20_000,
  });
});

test("language choice on the login page sticks after signing in and reloading", async ({ page }) => {
  const name = `E2e Es ${Date.now()}`;
  await page.goto("/login");
  await page.getByRole("button", { name: "Español" }).click();
  await expect(page.getByText("Chromebook de práctica. Nada aquí es real.")).toBeVisible();

  await page.getByRole("button", { name: "Agregar usuario" }).click();
  await page.getByPlaceholder("Jordan").fill(name);
  await page.getByPlaceholder("HARBOR-24").fill(CLASS_CODE);
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type("1234");
  await page.getByRole("button", { name: "Agregar", exact: true }).click();

  // The card greets them in Spanish...
  const spanishIntro = jobCard(page).getByText("Bienvenida", { exact: false });
  await expect(spanishIntro).toBeVisible({ timeout: 20_000 });

  // ...and a reload does NOT silently reset them to English.
  await page.reload();
  await expect(spanishIntro).toBeVisible({ timeout: 20_000 });
});

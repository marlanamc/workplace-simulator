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

async function signUp(page: Page, name: string) {
  await page.goto("/login");
  await page.getByPlaceholder("Jordan").fill(name);
  await page.getByPlaceholder("••••").fill("1234");
  await page.getByPlaceholder("HARBOR-24").fill(CLASS_CODE);
  await page.getByRole("button", { name: /Continue|Continuar/ }).click();
}

test("first session: sign up, finish the walkthrough, see the next job", async ({ page }) => {
  const name = `E2e ${Date.now()}`;
  await signUp(page, name);

  // A brand-new learner never sees a bare desktop — the story welcomes them.
  await expect(page.getByRole("heading", { name: new RegExp(`Welcome ${name}`) })).toBeVisible({
    timeout: 20_000,
  });
  await expect(page.getByText("Congrats on your new role at Harborside Cafe!")).toBeVisible();
  await page.getByRole("button", { name: "Show me around" }).click();

  // One instruction at a time; it advances only on the real click.
  await expect(page.getByText("Click Mail.")).toBeVisible();
  await page.getByTestId("bookmark-mail").click();

  // Pause on Mail so they notice it is their work email.
  await expect(page.getByText("This is your work email.", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Got it" }).click();

  await expect(page.getByText("Now click Calendar.")).toBeVisible();
  await page.getByTestId("bookmark-calendar").click();

  // Pause on Calendar so they actually see it.
  await expect(page.getByText("This is your work calendar.", { exact: false })).toBeVisible();
  await expect(page.getByText("Open Calendar").or(page.getByText("Maria put a meeting"))).toBeVisible();
  await page.getByRole("button", { name: "Got it" }).click();

  // Spotlight the real Help control (not "top right" prose).
  await expect(page.getByText("Click the ? for Help.", { exact: false })).toBeVisible();
  await page.getByTestId("tour-help").click();
  await expect(page.getByText("That is Help.", { exact: false })).toBeVisible();

  await page.getByRole("button", { name: "I'm ready for the job" }).click();

  // Level 0 done — the level-up celebration takes over, and its one button
  // hands off to the first real job.
  await expect(page.getByText("You know how this computer works.")).toBeVisible();
  await page.getByRole("button", { name: "Open my first job" }).click();

  // Mail is open: Maria's email is findable in the inbox.
  await expect(page.getByText("Maria Delgado").first()).toBeVisible({ timeout: 15_000 });
});

test("studio time machine teleports one account to a later level", async ({ page }) => {
  const name = `E2e Tm ${Date.now()}`;
  await signUp(page, name);
  await expect(page.getByRole("heading", { name: new RegExp(`Welcome ${name}`) })).toBeVisible({
    timeout: 20_000,
  });

  await page.goto("/studio");
  await page.getByRole("button", { name: "Start of Payday & Trouble" }).click();

  // Lands on the learner desktop as a learner at that exact moment:
  // the next job is Level 3's first task (clock out).
  await expect(page.getByText("End of day. Clock out, then check the hours.").first()).toBeVisible({
    timeout: 20_000,
  });
});

test("language choice on the login page sticks after signing in and reloading", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Español" }).click();
  await expect(page.getByText("Entra para guardar tu progreso")).toBeVisible();

  await page.getByPlaceholder("Jordan").fill(`E2e Es ${Date.now()}`);
  await page.getByPlaceholder("••••").fill("1234");
  await page.getByPlaceholder("HARBOR-24").fill(CLASS_CODE);
  await page.getByRole("button", { name: "Continuar" }).click();

  // The tour greets them in Spanish...
  const spanishIntro = page.getByRole("heading", { name: "Te damos la bienvenida a Harborside Cafe.", exact: true });
  await expect(spanishIntro).toBeVisible({ timeout: 20_000 });

  // ...and a reload does NOT silently reset them to English.
  await page.reload();
  await expect(spanishIntro).toBeVisible({ timeout: 20_000 });
});

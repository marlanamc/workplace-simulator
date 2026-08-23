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
  await signUp(page, `E2e ${Date.now()}`);

  // A brand-new learner never sees a bare desktop — the story welcomes them.
  await expect(
    page.getByRole("heading", { name: "Welcome to Harborside Cafe!", exact: true }),
  ).toBeVisible({ timeout: 20_000 });
  await page.getByRole("button", { name: "Show me around" }).click();

  // One instruction at a time; it advances only on the real click.
  await expect(page.getByText("Click Mail.")).toBeVisible();
  await page.getByTestId("bookmark-mail").click();

  await expect(page.getByText("Now click Calendar.")).toBeVisible();
  await page.getByTestId("bookmark-calendar").click();

  // Help phase: finishing is allowed without opening Help.
  await expect(page.getByText("Now try Help.", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "I'm ready for the job" }).click();

  // Level 0 done — the level-up celebration takes over, and its one button
  // hands off to the first real job.
  await expect(page.getByText("You know how this computer works.")).toBeVisible();
  await page.getByRole("button", { name: "Open my first job" }).click();

  // Mail is open: Maria's email is findable in the inbox.
  await expect(page.getByText("Maria Delgado").first()).toBeVisible({ timeout: 15_000 });
});

test("studio time machine teleports one account to a later level", async ({ page }) => {
  await signUp(page, `E2e Tm ${Date.now()}`);
  await expect(
    page.getByRole("heading", { name: "Welcome to Harborside Cafe!", exact: true }),
  ).toBeVisible({ timeout: 20_000 });

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

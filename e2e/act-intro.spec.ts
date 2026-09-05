import { test, expect, type Page } from "@playwright/test";

/**
 * The orientation screen before each later act (II–VII): a Studio jump into an
 * act's first level lands on it, it names the new role and manager, lists the
 * new skills, supports the language toggle, and stays dismissed on reload.
 */

const CLASS_CODE = "TEST-E2E";

function jobCard(page: Page) {
  return page.locator("[data-job-card]");
}

async function signUp(page: Page, name: string) {
  await page.goto("/login");
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(name);
  await page.getByPlaceholder("HARBOR-24").fill(CLASS_CODE);
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type("1234");
  await page.getByRole("button", { name: /^(Add|Agregar)$/ }).click();
  await expect(page.getByTestId("simulator-welcome")).toBeVisible({ timeout: 20_000 });
  await page.getByTestId("welcome-continue").click();
}

async function jumpTo(page: Page, presetName: RegExp) {
  await page.goto("/studio");
  await page.getByRole("button", { name: presetName }).click();
  await page.waitForURL(/from=studio/, { timeout: 20_000 });
}

test("Act II intro: Shift Lead role, Renata as manager, new skills, stays dismissed", async ({ page }) => {
  await signUp(page, `E2e ActIntro ${Date.now()}`);
  await expect(jobCard(page)).toBeVisible({ timeout: 20_000 });

  await jumpTo(page, /When Something Happens/);

  const intro = page.getByTestId("act-intro");
  await expect(intro).toBeVisible({ timeout: 20_000 });
  await expect(intro).toHaveAttribute("data-act", "act2");
  await expect(intro.getByRole("heading", { level: 1 })).toHaveText("You're a Shift Lead now");
  await expect(intro.getByText("Renata Silva", { exact: false })).toBeVisible();

  const skills = intro.getByRole("listitem");
  const count = await skills.count();
  expect(count).toBeGreaterThanOrEqual(3);
  expect(count).toBeLessThanOrEqual(5);
  await page.screenshot({ path: test.info().outputPath("act2-intro-en.png"), fullPage: true, animations: "disabled" });

  // Language toggle swaps the heading.
  await intro.getByRole("button", { name: "Español", exact: true }).click();
  await expect(intro.getByRole("heading", { level: 1 })).toHaveText("Ahora eres líder de turno");
  await intro.getByRole("button", { name: "English", exact: true }).click();

  await page.getByTestId("act-intro-continue").click();
  await expect(jobCard(page)).toBeVisible({ timeout: 20_000 });
  await expect(page.getByTestId("act-intro")).toHaveCount(0);

  await page.reload();
  await expect(page.getByTestId("act-intro")).toHaveCount(0);
  await expect(jobCard(page)).toBeVisible({ timeout: 20_000 });
});

test("Act VII intro: Team Lead role and Anita as manager", async ({ page }) => {
  await signUp(page, `E2e ActIntro7 ${Date.now()}`);
  await expect(jobCard(page)).toBeVisible({ timeout: 20_000 });

  await jumpTo(page, /Run the Meeting · College/);

  const intro = page.getByTestId("act-intro");
  await expect(intro).toBeVisible({ timeout: 20_000 });
  await expect(intro).toHaveAttribute("data-act", "act7");
  await expect(intro.getByRole("heading", { level: 1 })).toHaveText("You're a Team Lead now");
  await expect(intro.getByText("Anita Raman", { exact: false })).toBeVisible();
});

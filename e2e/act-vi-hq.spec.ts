import { test, expect, type Page } from "@playwright/test";

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
  await expect(page.locator("[data-job-card]")).toHaveCount(0);
  await page.getByTestId("welcome-continue").click();
}

test("after one Act V path the Job Card starts HQ and keeps the other door", async ({ page }) => {
  await signUp(page, `E2e Hq ${Date.now()}`);
  await expect(jobCard(page)).toBeVisible({ timeout: 20_000 });

  await page.goto("/studio");
  await page.getByRole("button", { name: /Welcome to HQ · College/ }).click();
  await page.waitForURL(/from=studio/, { timeout: 20_000 });

  // A Studio jump into an act's first level lands on the full-page act intro.
  const intro = page.getByTestId("act-intro");
  await expect(intro).toBeVisible({ timeout: 20_000 });
  await page.getByTestId("act-intro-continue").click();
  await expect(intro).toHaveCount(0);

  const card = jobCard(page);
  await expect(card.getByTestId("job-card-hq-start")).toBeVisible({ timeout: 20_000 });
  await expect(card.getByTestId("job-card-hq-other")).toBeVisible();
  await expect(card.getByText("Find the current file. Then share it.")).toBeVisible();
});

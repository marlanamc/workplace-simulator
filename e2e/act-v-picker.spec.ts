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
}

test("after Act IV the Job Card offers two equal doors", async ({ page }) => {
  await signUp(page, `E2e Door ${Date.now()}`);
  await expect(jobCard(page)).toBeVisible({ timeout: 20_000 });

  await page.goto("/studio");
  await page.getByRole("button", { name: /pick a door/ }).click();

  const card = jobCard(page);
  await expect(card.getByText("College, or the front desk.")).toBeVisible({ timeout: 20_000 });
  await expect(card.getByTestId("job-card-pick-a")).toBeVisible();
  await expect(card.getByTestId("job-card-pick-b")).toBeVisible();

  await card.getByTestId("job-card-pick-a").click();
  await expect(card.getByText("Find the deadline. Then apply.")).toBeVisible({ timeout: 15_000 });
});

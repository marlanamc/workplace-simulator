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

test("after Act II the learner chooses a route and can change it without losing progress", async ({ page }) => {
  await signUp(page, `E2e Door ${Date.now()}`);
  await page.goto("/studio");
  await page.getByRole("button", { name: /After Act II \(pick a direction\)/ }).click();
  const card = jobCard(page);
  for (const route of ['lead', 'healthcare', 'office', 'college', 'pause']) {
    await expect(card.getByTestId(`course-route-${route}`)).toBeVisible({timeout:20000});
  }
  await card.getByTestId('course-route-office').click();
  await expect(page.getByTestId('act-intro')).toHaveAttribute('data-act', 'act6', {timeout:20000});
  await page.getByTestId('act-intro-continue').click();
  await expect(card.getByText('Read the posting. Do you fit?')).toBeVisible();
  await page.reload();
  await expect(card.getByText('Read the posting. Do you fit?')).toBeVisible({timeout:20000});
  await card.getByRole('button',{name:'Change direction'}).click();
  await card.getByTestId('course-route-healthcare').click();
  await expect(page.getByTestId('act-intro')).toHaveAttribute('data-act','act5',{timeout:20000});
  await page.getByTestId('act-intro-continue').click();
  await card.getByRole('button',{name:'Change direction'}).click();
  await card.getByTestId('course-route-pause').click();
  await expect(card.getByText('Core course complete')).toBeVisible({timeout:20000});
  await page.reload();
  await expect(card.getByText('Core course complete')).toBeVisible({timeout:20000});
});

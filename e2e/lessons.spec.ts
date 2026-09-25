import { test, expect, type Page } from "@playwright/test";

/**
 * Lesson mode: one game task on its own, with no account. The real desktop,
 * browser, and Job Card, and nothing the story adds around them.
 */

function jobCard(page: Page) {
  return page.locator("[data-job-card]");
}

/** Park the card bottom-right. At 1280x720 it sits over this task's left-hand form, as it does in the game. */
async function parkCardRight(page: Page) {
  await jobCard(page).getByTestId("job-card-drag-handle").press("ArrowRight");
  await expect(jobCard(page)).toHaveAttribute("data-corner", "br");
}

async function finishAccountRecovery(page: Page) {
  await parkCardRight(page);
  await page.getByPlaceholder("Enter your password").fill("coffee123");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.getByRole("button", { name: "Check my texts" }).click();
  await page.getByText("Your verification code is 482915").click();
  await page.getByPlaceholder("000000").fill("482915");
  await page.getByRole("button", { name: "Verify" }).click();
}

test("a guest runs the sign-in lesson in guided mode and can practice again", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/lessons/account-recovery");

  // Straight onto the task: no welcome screen, only the lesson's tab.
  await expect(page.getByTestId("simulator-welcome")).toHaveCount(0);
  await expect(page.getByTestId("bookmark-account-recovery")).toBeVisible();
  await expect(page.getByTestId("bookmarks-row").getByRole("button")).toHaveCount(1);
  await expect(page.getByTestId("shelf-my-job")).toHaveCount(0);

  const card = jobCard(page);
  await expect(card).toContainText("Lesson · Sign in with a text code");
  // Guided spells out the step.
  await expect(card).toContainText("Sign in with your work email and password.");

  await finishAccountRecovery(page);
  await expect(card).toContainText("Lesson · Sign in with a text code");
  const again = card.getByTestId("lesson-practice-again");
  await expect(again).toBeVisible();
  await expect(card.getByTestId("lesson-back")).toBeVisible();

  // Practice again remounts the task on its first step.
  await again.click();
  await expect(page.getByPlaceholder("Enter your password")).toBeVisible();
  await expect(card).toContainText("Sign in with your work email and password.");
  expect(errors).toEqual([]);
});

test("independent mode states the goal instead of each click", async ({ page }) => {
  await page.goto("/lessons/account-recovery?mode=independent");
  const card = jobCard(page);
  await expect(card).toContainText("Lesson · Sign in with a text code");
  await expect(card).not.toContainText("Sign in with your work email and password.");
  await expect(card.getByRole("button", { name: "Show me" })).toHaveCount(0);
});

test("a Spanish link opens the lesson in Spanish", async ({ page }) => {
  await page.goto("/lessons/account-recovery?lang=es");
  await expect(jobCard(page)).toContainText("Lección · Iniciar sesión con un código de texto");
});

test("an unknown or non-lesson task is a 404", async ({ page }) => {
  expect((await page.goto("/lessons/not-a-task"))?.status()).toBe(404);
  expect((await page.goto("/lessons/tour"))?.status()).toBe(404);
});

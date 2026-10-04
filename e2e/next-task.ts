import { expect, type Page } from "@playwright/test";

const NEXT_TASK = /^(Next task|Siguiente tarea)$/;

/**
 * A finished task's card: either "Next task", or, for a task with a reading
 * pause (Day 2's text, Day 3's clock note, the pay stub), "Read reply" and
 * then "Continue". Both end the same way: the task window steps aside.
 */
export async function expectTaskFinished(page: Page) {
  const card = page.locator("[data-job-card]");
  await expect(card.getByRole("button", { name: NEXT_TASK }).or(card.getByTestId("read-pause-read")).first()).toBeVisible({ timeout: 20_000 });
}

/** Leave a finished task the way a learner would, whichever card it ends on. */
export async function pressNextTask(page: Page) {
  const card = page.locator("[data-job-card]");
  await expectTaskFinished(page);
  const read = card.getByTestId("read-pause-read");
  if (await read.isVisible()) {
    await read.click();
    await card.getByTestId("read-pause-continue").click();
    return;
  }
  await card.getByRole("button", { name: NEXT_TASK }).click();
}

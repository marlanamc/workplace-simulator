import { test, expect } from "@playwright/test";
import { continuePastStudioArrivalIfPresent } from "./studio-arrival";
import { clickIntoPage, waitForInteractive } from "./interactive";

/**
 * Story Mode Audit #7. After making a copy on Day 12, the Job Card's "Open
 * Sheets from the bookmarks" reopened the finished copy, whose done screen
 * sent the learner back round. Then typing the right total, 61, showed
 * "#ERROR?".
 */
test("Day 12 hands off from the copy to the status report", async ({ page }) => {
  await page.goto("/login");
  await waitForInteractive(page);
  await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
  await page.getByPlaceholder("Jordan").fill(`E2e Day12 ${Date.now()}`);
  await page.getByPlaceholder("HARBOR-24").fill("TEST-E2E");
  await page.locator('input[placeholder="••••"]').first().click();
  await page.keyboard.type("1234");
  await page.getByRole("button", { name: /^(Add|Agregar)$/ }).click();
  await page.getByTestId("welcome-continue").click();

  await page.goto("/studio");
  await waitForInteractive(page);
  await clickIntoPage(page, () => page.getByRole("button", { name: /Reporting In/ }).click());
  await continuePastStudioArrivalIfPresent(page);

  const card = page.locator("[data-job-card]");
  await card.getByRole("button", { name: /^Open Sheets/ }).click();
  await page.getByTestId("bookmark-make-a-copy").click();
  await card.getByTestId("job-card-drag-handle").focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowUp");

  // Make the copy and type in it: that finishes the first task.
  await page.getByText("Weekly Status Template").first().click();
  await page.getByRole("button", { name: "File" }).click();
  await page.getByRole("button", { name: "Make a copy" }).first().click();
  await expect(card).toContainText("status-week-of-sep-14");
  await page.locator("input[autofocus], .rounded-3xl input").first().fill("status-week-of-sep-14");
  await page.getByRole("button", { name: "Make a copy" }).last().click();
  await page.getByPlaceholder("12").fill("12");
  await expect(page.getByText("You have your own copy").first()).toBeVisible();

  // Follow the card, the way the audit did.
  const nextTask = card.getByRole("button", { name: /^Next task$/ });
  if (await nextTask.isVisible().catch(() => false)) await nextTask.click();
  await card.getByRole("button", { name: /^Open Sheets/ }).click();
  await expect(page.getByText("You have your own copy")).toHaveCount(0);
  await expect(card.getByRole("button", { name: /^Next task$/ })).toHaveCount(0);

  // The bookmark now opens the status report.
  await page.getByTestId("bookmark-status-report").click();
  await page.getByText("status-week-of-sep-14").first().click();
  // The card goes back to the bottom-left corner on each task and covers the
  // total cell (audit #2, Stream A). Move it, as a learner would.
  await card.getByTestId("job-card-drag-handle").focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowUp");
  // Wave 4 Undo practice: delete Friday's number on request, then Undo it.
  await expect(card).toContainText("press Delete");
  const friday = page.getByTestId("status-cell-fri");
  await friday.click();
  await page.keyboard.press("Delete");
  await expect(friday).toHaveText("");
  await page.getByRole("button", { name: "File", exact: true }).click();
  await page.getByRole("button", { name: "Email", exact: true }).click();
  await page.getByRole("button", { name: "Email collaborators", exact: true }).click();
  await expect(card).toContainText("A number is missing");
  await page.keyboard.press("Escape");
  await page.keyboard.press("Control+z");
  await expect(friday).toHaveText("15");

  const totalCell = page.getByTestId("status-total-cell");
  await totalCell.click();
  const fx = page.getByPlaceholder("=SUM(");
  await fx.fill("61");
  await expect(totalCell).toHaveText("61");
  await page.getByRole("button", { name: "File", exact: true }).click();
  await page.getByRole("button", { name: "Email", exact: true }).click();
  await page.getByRole("button", { name: "Email collaborators", exact: true }).click();
  await expect(card).toContainText("Right number. Now let the sheet add it");

  await fx.fill("=SUM(B2:B6)");
  await expect(totalCell).toHaveText("61");
});

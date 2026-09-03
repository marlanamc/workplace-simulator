import { test, expect, type Page } from "@playwright/test";

/**
 * Act VII — Team Lead. The office-path capstone: run a meeting, write a
 * review, assemble a weekly report packet, then look back at the whole
 * program. This walks all four levels end to end from the Studio teleport
 * for "Run the Meeting", the way a learner who kept going past HQ would.
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
}

/** Clear whatever celebration modals stack up after a level finishes: the
 *  level-up card (dismissed via its keep-going CTA, never "clock out"), then
 *  a track-trophy card. Polls, because they animate in after the done screen. */
async function passCelebration(page: Page) {
  const deadline = Date.now() + 25_000;
  let cleared = 0;
  while (Date.now() < deadline) {
    const levelUp = page.locator("div.fixed.inset-0.z-\\[80\\]");
    const trophy = page.locator("div.fixed.inset-0.z-\\[70\\]");
    if (await levelUp.first().isVisible().catch(() => false)) {
      // "Keep going" is a plain <button>; "Clock out" is a submit inside a
      // <form>. Click the plain one so the walk never logs itself out.
      const keep = levelUp.locator('button:not([type="submit"])').first();
      await expect(keep).toBeVisible({ timeout: 10_000 });
      await keep.click();
      cleared++;
      await page.waitForTimeout(700);
      continue;
    }
    if (await trophy.first().isVisible().catch(() => false)) {
      await trophy.first().click({ position: { x: 8, y: 8 } });
      cleared++;
      await page.waitForTimeout(700);
      continue;
    }
    if (cleared > 0) return;
    await page.waitForTimeout(500);
  }
}

async function shrinkCard(page: Page) {
  const collapse = jobCard(page).getByTestId("job-card-collapse");
  if (await collapse.isVisible().catch(() => false)) await collapse.click();
}

/** Open the current task: from a finished task's window, press the card's
 *  "Next task" to return to the desktop, then its "Open …" button to bring
 *  up the browser, then click the task's bookmark on the bar. */
async function openTask(page: Page, testid: string) {
  const card = jobCard(page);
  const nextTask = card.getByRole("button", { name: /^(Next task|Siguiente tarea)$/ });
  if (await nextTask.isVisible().catch(() => false)) {
    await nextTask.click();
    await page.waitForTimeout(500);
  }
  const openBtn = card.getByRole("button", { name: /^Open / });
  await expect(openBtn).toBeVisible({ timeout: 20_000 });
  await openBtn.click();
  const bm = page.getByTestId(`bookmark-${testid}`);
  await expect(bm).toBeVisible({ timeout: 20_000 });
  await bm.click();
  await shrinkCard(page);
}

test("Act VII walks from the meeting to the final look-back", async ({ page }) => {
  test.slow();
  await signUp(page, `E2e Tl ${Date.now()}`);
  await expect(jobCard(page)).toBeVisible({ timeout: 20_000 });

  await page.goto("/studio");
  await page.getByRole("button", { name: /Run the Meeting · College/ }).click();
  await page.waitForURL(/from=studio/, { timeout: 20_000 });
  await passCelebration(page);

  // The Job Card re-opens itself on every step change and lives in the
  // bottom-left corner, over where a task parks its buttons. Pin it to the
  // top-right for the walk — a real learner drags or collapses it; here we
  // are testing the tasks, not the card's placement.
  await page.addStyleTag({
    content: `[data-job-card]{left:auto!important;right:8px!important;top:8px!important;bottom:auto!important;max-width:280px!important}`,
  });

  // --- Level 24: meeting-minutes ---
  await openTask(page, "meeting-minutes");
  await expect(page.getByRole("heading", { name: "Run the meeting" })).toBeVisible({ timeout: 20_000 });

  await page.getByRole("button", { name: "Write it" }).click();
  await page.getByPlaceholder(/two or three points/).fill("Saturday close — who covers it\nLate supply order — next step");
  await page.getByRole("button", { name: "Save the agenda" }).click();

  await page.getByRole("button", { name: "Start the meeting" }).click();
  for (let i = 0; i < 8; i++) {
    const next = page.getByRole("button", { name: "Next" });
    if (!(await next.isVisible().catch(() => false))) break;
    await next.click();
  }
  await page.getByPlaceholder(/A few short lines/).fill("Jordan takes Saturday close.\nAlex calls the supplier this morning.");
  await page.getByRole("button", { name: "Save my notes" }).click();

  await page.getByRole("button", { name: "Write the email" }).click();
  await page
    .getByPlaceholder(/One line per action/)
    .fill("Saturday close: Jordan, this Saturday. Supplier call: Alex, by end of day Monday. Training: Riley, Thursday morning.");
  await page.getByRole("button", { name: "Send" }).click();

  await expect(page.getByText("Follow-up sent", { exact: false }).first()).toBeVisible({ timeout: 20_000 });
  await passCelebration(page);

  // --- Level 25: performance-review ---
  await openTask(page, "performance-review");
  await expect(page.getByText("Monthly review — one team member")).toBeVisible({ timeout: 20_000 });
  await page.getByPlaceholder(/Something specific they actually did/).fill("Sam trained two new hires this month and stayed patient with both.");
  await page.getByPlaceholder(/What needs to change/).fill("The morning open needs Sam there by 6. Being on time every day would help the shift start clean.");
  await page.getByRole("button", { name: "Submit the review" }).click();
  await expect(page.getByText("Review submitted", { exact: false }).first()).toBeVisible({ timeout: 20_000 });
  await passCelebration(page);

  // --- Level 26: ops-report-packet ---
  await openTask(page, "ops-report-packet");
  await expect(page.getByRole("heading", { name: "The weekly report" })).toBeVisible({ timeout: 20_000 });

  await page.getByRole("button", { name: "Open Sheets" }).click();
  await page.getByRole("checkbox").first().check();
  await page.getByRole("button", { name: "Done here" }).click();

  await page.getByRole("button", { name: "Open Calendar" }).click();
  await page.getByRole("checkbox").first().check();
  await page.getByRole("button", { name: "Done here" }).click();

  await page.getByRole("button", { name: "Open Docs" }).click();
  await page.getByPlaceholder(/This week's total was/).fill("This week's total was $4,820, up from last week. Coming up: Thursday's morning open still needs someone.");
  await page.getByRole("button", { name: "Save the summary" }).click();

  await page.getByRole("button", { name: "Open Mail" }).click();
  await page.getByPlaceholder(/A line or two/).fill("Hi Maria, here is this week's report. Summary is attached.");
  await page.getByRole("button", { name: "Send" }).click();

  await expect(page.getByText("Packet sent", { exact: false }).first()).toBeVisible({ timeout: 20_000 });
  await passCelebration(page);

  // --- Level 27: portfolio-reflection ---
  await openTask(page, "portfolio-reflection");
  await expect(page.getByRole("heading", { name: "Everything you've done" })).toBeVisible({ timeout: 20_000 });
  // The award list should show earned trophies grouped by act.
  await expect(page.getByText(/New Hire/).first()).toBeVisible();

  await page.getByRole("button", { name: /look back/ }).click();
  const boxes = page.getByPlaceholder("Your answer…");
  await expect(boxes).toHaveCount(4);
  for (let i = 0; i < 4; i++) {
    await boxes.nth(i).fill("This is a real answer with enough words to count.");
  }
  await page.getByRole("button", { name: "See my summary" }).click();

  await expect(page.getByText("Summary ready", { exact: false }).first()).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText("What I can do now")).toBeVisible();
});

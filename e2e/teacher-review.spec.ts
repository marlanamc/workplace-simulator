import { test, expect, type Page } from "@playwright/test";
import { neon } from "@neondatabase/serverless";

/**
 * The teacher-review loop: a learner writes a review, the app saves the text,
 * a teacher leaves a note on it, and the learner sees that note on next login.
 * The teacher step is done straight in the DB — a student session can't reach
 * the teacher dashboard, and seeding the note is how a real class works.
 */

const CLASS_CODE = `REVIEW-${Date.now().toString().slice(-6)}`;
const STUDENT = `Review Ana ${Date.now()}`;
const STRENGTH = "Sam trained two new hires this month and stayed patient with both.";
const AREA = "The morning open needs Sam there by 6. Being on time every day would help the shift start clean.";
const TEACHER_NOTE = "Good specifics on the strength. For the area to grow, add one sentence on how you'll check in with Sam.";

const sql = neon(process.env.DATABASE_URL!);

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

test("a teacher note on a review reaches the learner on next login", async ({ page }) => {
  test.slow();
  await signUp(page, STUDENT);
  await expect(jobCard(page)).toBeVisible({ timeout: 20_000 });

  // Teleport to "The Review" (Act VII, level 25).
  await page.goto("/studio");
  await page.getByRole("button", { name: /The Review · College/ }).click();
  await page.waitForURL(/from=studio/, { timeout: 20_000 });

  const actIntro = page.getByTestId("act-intro");
  if (await actIntro.isVisible().catch(() => false)) {
    await page.getByTestId("act-intro-continue").click();
  }
  await page.addStyleTag({
    content: `[data-job-card]{left:auto!important;right:8px!important;top:8px!important;bottom:auto!important;max-width:260px!important}`,
  });

  // Open the review task from the Job Card + bookmark bar.
  const openBtn = jobCard(page).getByRole("button", { name: /^Open / });
  await expect(openBtn).toBeVisible({ timeout: 20_000 });
  await openBtn.click();
  const bm = page.getByTestId("bookmark-performance-review");
  await expect(bm).toBeVisible({ timeout: 20_000 });
  await bm.click();

  await expect(page.getByText("Monthly review — one team member")).toBeVisible({ timeout: 20_000 });
  await page.getByPlaceholder(/Something specific they actually did/).fill(STRENGTH);
  await page.getByPlaceholder(/What needs to change/).fill(AREA);
  await page.getByRole("button", { name: "Submit the review" }).click();
  await expect(page.getByText("Review submitted", { exact: false }).first()).toBeVisible({ timeout: 20_000 });

  // The app saved what was written.
  const learnerRows = await sql`
    select id from learners where display_name = ${STUDENT} and class_code = ${CLASS_CODE}
  `;
  const learnerId = learnerRows[0].id as string;

  let submission: Record<string, unknown> | undefined;
  for (let i = 0; i < 20 && !submission; i++) {
    const rows = await sql`
      select id, content from submissions
      where learner_id = ${learnerId} and task_key = 'performance-review'
      order by submitted_at desc limit 1
    `;
    submission = rows[0];
    if (!submission) await page.waitForTimeout(500);
  }
  expect(submission, "a submission row was written").toBeTruthy();
  expect(JSON.stringify(submission!.content)).toContain(STRENGTH);

  // The teacher leaves a note.
  await sql`
    update submissions set teacher_note = ${TEACHER_NOTE}, noted_at = now()
    where id = ${submission!.id as string}
  `;

  // Next login: the note is waiting.
  await page.goto("/");
  const toast = page.getByText(/Your teacher left a note/);
  await expect(toast).toBeVisible({ timeout: 20_000 });
  await toast.click();

  await expect(page.getByText("Notes from your teacher")).toBeVisible();
  await expect(page.getByText(TEACHER_NOTE)).toBeVisible();
  await expect(page.getByText(STRENGTH)).toBeVisible();

  await page.getByRole("button", { name: /^(Got it|Entendido)$/ }).click();

  // Opening it marked it read; it does not come back on reload.
  await expect.poll(async () => {
    const rows = await sql`select seen_at from submissions where id = ${submission!.id as string}`;
    return rows[0].seen_at !== null;
  }, { timeout: 10_000 }).toBe(true);

  await page.goto("/");
  await expect(page.getByText(/Your teacher left a note/)).toHaveCount(0);
});

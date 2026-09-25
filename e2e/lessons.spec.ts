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

test("the library filters by skill and opens a lesson and its teacher preview", async ({ page }) => {
  await page.goto("/lessons");
  await page.getByTestId("skill-filter-accounts").click();
  await expect(page).toHaveURL(/skill=accounts/);
  const card = page.getByTestId("lesson-card-account-recovery");
  await expect(card).toBeVisible();
  await expect(page.locator('[data-testid^="lesson-card-"]').filter({ hasNotText: "Accounts" })).toHaveCount(0);

  await card.getByRole("link", { name: /Teacher preview and guide/ }).click();
  await expect(page.getByTestId("teacher-preview")).toBeVisible();
  // The guide is teacher-facing: behind a button, above the computer, never on the Job Card.
  await expect(page.getByTestId("teacher-guide")).toHaveCount(0);
  await page.getByRole("button", { name: "Teacher guide" }).click();
  await expect(page.getByTestId("teacher-guide")).toContainText("Where students get stuck");
  await expect(jobCard(page)).not.toContainText("Where students get stuck");
});

test("the copied student link keeps support and language", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/lessons/account-recovery?preview=1&lang=es");
  await jobCard(page).getByTestId("lesson-mode-independent").click();
  await expect(page).toHaveURL(/mode=independent/);
  await page.getByRole("button", { name: "Copiar enlace para estudiantes" }).click();
  const link = await page.evaluate(() => navigator.clipboard.readText());
  expect(link).toContain("/lessons/account-recovery?");
  expect(link).toContain("mode=independent");
  expect(link).toContain("lang=es");
  expect(link).not.toContain("preview");
});

test("changing support mid-task keeps the student's place", async ({ page }) => {
  await page.goto("/lessons/account-recovery");
  await parkCardRight(page);
  await page.getByPlaceholder("Enter your password").fill("coffee123");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("button", { name: "Check my texts" })).toBeVisible();
  await jobCard(page).getByTestId("lesson-mode-independent").click();
  await expect(page.getByRole("button", { name: "Check my texts" })).toBeVisible();
  await expect(jobCard(page)).not.toContainText("Check your phone for the code");
  await jobCard(page).getByTestId("lesson-mode-guided").click();
  await expect(jobCard(page)).toContainText("Check your phone for the code");
});

test("the library and a lesson fit a phone screen", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 740 });
  for (const url of ["/lessons", "/lessons/account-recovery", "/lessons/account-recovery?preview=1"]) {
    await page.goto(url);
    expect(await page.evaluate(() => document.documentElement.scrollWidth), url).toBeLessThanOrEqual(375);
  }
  await jobCard(page).getByTestId("job-card-collapse").click();
  await expect(jobCard(page).getByTestId("job-card-collapse")).toHaveAttribute("aria-expanded", "false");
});

test.describe("saving", () => {
  const CLASS_CODE = `LESSON-${Date.now().toString().slice(-6)}`;
  const STUDENT = `Lesson Rosa ${Date.now()}`;
  const TEACHER = `Lesson Teacher ${Date.now()}`;

  async function addUser(page: Page, name: string) {
    await page.getByRole("button", { name: /Add user|Agregar usuario/ }).click();
    await page.getByPlaceholder("Jordan").fill(name);
    await page.getByPlaceholder("HARBOR-24").fill(CLASS_CODE);
    await page.locator('input[placeholder="••••"]').first().click();
    await page.keyboard.type("1234");
    await page.getByRole("button", { name: /^(Add|Agregar)$/ }).click();
  }

  test("a guest finishes, signs in, and the teacher sees the attempt", async ({ page, browser }) => {
    test.slow();
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(process.env.DATABASE_URL!);

    // Teacher preview saves nothing, even after finishing.
    await page.goto("/lessons/account-recovery?preview=1");
    await finishAccountRecovery(page);
    await expect(jobCard(page).getByTestId("lesson-practice-again")).toBeVisible();
    await expect(jobCard(page).getByTestId("lesson-sign-in")).toHaveCount(0);
    expect(await page.evaluate(() => localStorage.getItem("lesson-attempt:account-recovery:guest"))).toBeNull();

    // A guest's finish stays in this browser until they sign in.
    await page.goto("/lessons/account-recovery?mode=independent");
    await finishAccountRecovery(page);
    await expect(jobCard(page)).toContainText("This computer remembers it");
    await jobCard(page).getByTestId("lesson-sign-in").click();
    await expect(page).toHaveURL(/\/login\?next=/);
    await addUser(page, STUDENT);
    await expect(page).toHaveURL(/\/lessons\/account-recovery\?.*transfer=1/, { timeout: 20_000 });
    await expect(page.getByTestId("simulator-welcome")).toHaveCount(0);

    const [learner] = await sql`select id from learners where display_name = ${STUDENT} and class_code = ${CLASS_CODE}`;
    let row: Record<string, unknown> | undefined;
    await expect
      .poll(async () => {
        [row] = await sql`select state from practice_attempts where learner_id = ${learner.id} and activity_id = 'account-recovery'`;
        return row ? (row.state as { attempts: number }).attempts : 0;
      })
      .toBe(1);
    expect((row!.state as { mode: string }).mode).toBe("independent");
    // A lesson is not game credit.
    const completions = await sql`select 1 from task_completions where learner_id = ${learner.id}`;
    expect(completions).toHaveLength(0);
    expect(await page.evaluate(() => localStorage.getItem("lesson-attempt:account-recovery:guest"))).toBeNull();

    // A signed-in finish saves straight to the account.
    await finishAccountRecovery(page);
    await expect(jobCard(page)).toContainText("Saved. Your teacher can see it.");

    // The teacher sees it (role set in the DB, as teacher-review.spec.ts does).
    const teacherContext = await browser.newContext();
    const tp = await teacherContext.newPage();
    await tp.goto("/login?next=/teacher");
    await addUser(tp, TEACHER);
    await expect(tp).not.toHaveURL(/\/login/, { timeout: 20_000 });
    await sql`update learners set role = 'teacher' where display_name = ${TEACHER} and class_code = ${CLASS_CODE}`;
    await tp.goto("/teacher");
    const section = tp.getByTestId("teacher-lessons");
    await expect(section).toContainText(STUDENT);
    await expect(section).toContainText("Sign in with a text code");
    await expect(section.getByRole("row").filter({ hasText: STUDENT })).toContainText("2");
    await teacherContext.close();
  });
});

test("old practice links go to lessons", async ({ page }) => {
  await page.goto("/practice/password?lang=es");
  await expect(page).toHaveURL(/\/lessons\/account-recovery\?lang=es/);
  await page.goto("/practice");
  await expect(page).toHaveURL(/\/lessons$/);
});

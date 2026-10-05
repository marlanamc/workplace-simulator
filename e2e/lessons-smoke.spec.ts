import { test, expect } from "@playwright/test";
import { verifyShowMe } from "./show-me";
import { TRACKS } from "@/lib/tracks-content";
import { TASKS } from "@/lib/tasks/registry";
import { draftLessonFor, lessonByKey } from "@/lib/lessons/catalog";

/**
 * Every task the game can reach, opened as a lesson. Tasks without a lesson
 * block yet open through the dev-only `?smoke=1` draft path. A pass means the
 * task starts on its own: the desktop renders, the lesson's tab is the one
 * showing, the Job Card speaks for the lesson, and nothing throws.
 */
const keys = [...new Set(TRACKS.flatMap((t) => t.taskKeys))].filter((k) => TASKS[k]?.built && !TASKS[k].retired);

for (const lang of ["en", "es"] as const) for (const key of keys) {
  test(`${key} opens as a lesson (${lang})`, async ({ page }) => {
    const entry = lessonByKey(key) ?? draftLessonFor(key);
    expect(entry, `${key} has no tab to open on`).toBeTruthy();
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error" && !/Download the React DevTools|favicon/.test(m.text())) errors.push(m.text());
    });

    await page.goto(`/lessons/${key}?smoke=1&lang=${lang}`);
    const card = page.locator("[data-job-card]");
    await expect(card).toContainText(entry!.title[lang]);
    await expect(page.getByTestId(`bookmark-${entry!.tabs[0]}`)).toBeVisible();
    await expect(page.getByTestId("simulator-welcome")).toHaveCount(0);
    // Mid-task, the card is reporting the task's own step, not the desktop's "open it" line.
    await expect(card.getByRole("button", { name: "Open the task" })).toHaveCount(0);
    const show = card.getByRole("button", { name: lang === "en" ? "Show me" : "Muéstrame", exact: true });
    if (await show.isVisible()) await verifyShowMe(page, lang);
    expect(errors).toEqual([]);
  });
}

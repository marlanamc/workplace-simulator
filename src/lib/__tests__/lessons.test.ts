import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { TRACKS, activeTrack, nextTaskInTrack } from "@/lib/tracks-content";
import { TASKS } from "@/lib/tasks/registry";
import { LESSONS, draftLessonFor, lessonByKey, seedForLesson } from "@/lib/lessons/catalog";
import { CAST } from "@/lib/cast";
import { STARTERS as APPT_STARTERS } from "@/lib/tasks/appointment-scheduling/content";
import { STARTERS as COURSEWORK_STARTERS } from "@/lib/tasks/coursework/content";
import { STARTERS as CALENDAR_STARTERS } from "@/lib/tasks/calendar/content";
import { STARTERS as SHEET_STARTERS } from "@/lib/tasks/spreadsheet/content";
import { STARTERS as FORMULA_STARTERS } from "@/lib/tasks/formula-check/content";
import { STARTERS as BUDGET_STARTERS } from "@/lib/tasks/budget-sheet/content";
import { STARTERS as POSTING_STARTERS } from "@/lib/tasks/job-posting/content";
import { STARTERS as APPLICATION_STARTERS } from "@/lib/tasks/job-application/content";
import { LESSON_BULLET_STARTERS, LESSON_SUMMARY_STARTERS } from "@/lib/tasks/resume-build/content";

const reachable = [...new Set(TRACKS.flatMap((t) => t.taskKeys))].filter((k) => TASKS[k]?.built && !TASKS[k].retired);

describe("lesson seeding", () => {
  it.each(reachable)("%s starts as the next job", (taskKey) => {
    const seed = seedForLesson(taskKey);
    expect(seed).not.toBeNull();
    const track = activeTrack(seed!.completedTaskKeys, seed!.bridgePath, seed!.courseRoute);
    expect(track.key).toBe(seed!.track.key);
    expect(nextTaskInTrack(track, seed!.completedTaskKeys)).toBe(taskKey);
  });

  it.each(reachable)("%s has a tab to open on", (taskKey) => {
    expect(draftLessonFor(taskKey)?.tabs[0]).toBeTruthy();
  });

  it("returns null for a key that is not in any track", () => {
    expect(seedForLesson("not-a-task" as never)).toBeNull();
  });
});

describe("lesson catalog", () => {
  it("lists account-recovery on its Sign In tab", () => {
    expect(lessonByKey("account-recovery")?.tabs[0]).toBe("account-recovery");
  });

  it.each(LESSONS.map((l) => [l.taskKey, l] as const))("%s opens on a tab", (_key, lesson) => {
    expect(lesson.tabs.length).toBeGreaterThan(0);
  });
});

/**
 * Lessons run without a learner account, so nothing on the lesson path may
 * reach a server action. Mail used to import one directly; it now goes
 * through `useProgress().saveOpeningReply`, which the lesson provider keeps
 * in memory.
 */
describe("lesson mode never calls the server", () => {
  const root = process.cwd();
  const read = (p: string) => readFileSync(join(root, p), "utf8");
  const taskFiles = [
    ...readdirSync(join(root, "src/app/browser"))
      .filter((f) => f.endsWith(".tsx") && f !== "page.tsx")
      .map((f) => `src/app/browser/${f}`),
    "src/app/mail/MailClient.tsx",
  ];

  it.each(taskFiles)("%s does not import @/app/actions", (file) => {
    expect(read(file)).not.toMatch(/from\s+["']@\/app\/actions["']/);
  });

  it.each([
    "src/app/lessons/LessonProgressProvider.tsx",
    "src/app/lessons/LessonRunner.tsx",
    "src/lib/lesson-context.tsx",
    "src/components/desktop/Desktop.tsx",
  ])("%s does not import @/app/actions", (file) => {
    expect(read(file)).not.toMatch(/@\/app\/actions/);
  });
});

/**
 * A lesson learner never played the story, so the lesson has to say who
 * they are, who the task names, and what is needed, in both languages.
 */
describe("lesson scenes", () => {
  const both = (l: { en: string; es: string }) => l.en.trim().length > 0 && l.es.trim().length > 0;

  it.each(LESSONS.map((l) => [l.taskKey, l] as const))("%s has a scene in both languages", (_key, lesson) => {
    expect(both(lesson.scene.you)).toBe(true);
    expect(both(lesson.scene.need)).toBe(true);
    for (const p of lesson.scene.people) expect(both(p.role), p.name).toBe(true);
    for (const fact of lesson.reference ?? []) {
      expect(both(fact.label)).toBe(true);
      if (typeof fact.value !== "string") expect(both(fact.value), fact.label.en).toBe(true);
    }
  });

  it.each(LESSONS.map((l) => [l.taskKey, l] as const))("%s introduces everyone its Job Card names", (key, lesson) => {
    const task = TASKS[key];
    const lines = [task.jobCardLine?.en, task.dispatch.en].filter(Boolean).join(" ");
    const introduced = lesson.scene.people.map((p) => p.name.split(" ")[0]);
    // People only: team accounts like "Harborside HR" are not someone to introduce.
    for (const member of Object.values(CAST).filter((m) => !m.name.startsWith("Harborside"))) {
      const first = member.name.split(" ")[0];
      if (new RegExp(`\\b${first}\\b`).test(lines)) expect(introduced, `${key} names ${first}`).toContain(first);
    }
  });
});

/**
 * Each language's sentence starters stay in that language. The appointment
 * and coursework lists once mixed an English line into Spanish and back.
 */
describe("sentence starters stay in their language", () => {
  const lists: [string, Record<"en" | "es", string[]>][] = [
    ["appointment", APPT_STARTERS],
    ["coursework", COURSEWORK_STARTERS],
    ["calendar", CALENDAR_STARTERS],
    ["spreadsheet", SHEET_STARTERS],
    ["formula-check", FORMULA_STARTERS],
    ["budget-sheet", BUDGET_STARTERS],
    ["job-posting", POSTING_STARTERS],
    ["job-application", APPLICATION_STARTERS],
    ["resume summary (lesson)", LESSON_SUMMARY_STARTERS],
    ["resume bullets (lesson)", LESSON_BULLET_STARTERS],
  ];
  const englishWords = /\b(the|and|you|your|is|will|can|thank)\b/i;

  it.each(lists)("%s", (_name, starters) => {
    for (const line of starters.es) expect(englishWords.test(line), line).toBe(false);
    for (const line of starters.en) expect(/[ñ¿¡]|\b(el|los|las|gracias|hola)\b/i.test(line), line).toBe(false);
  });
});

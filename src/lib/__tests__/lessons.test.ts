import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { TRACKS, activeTrack, nextTaskInTrack } from "@/lib/tracks-content";
import { TASKS } from "@/lib/tasks/registry";
import { LESSONS, draftLessonFor, lessonByKey, seedForLesson } from "@/lib/lessons/catalog";

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

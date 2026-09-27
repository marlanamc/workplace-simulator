import { describe, expect, it } from "vitest";
import type { TaskKey } from "@/lib/desktop-content";
import { COURSE_ROUTES, routeBridgePath, type CourseRoute } from "@/lib/course-route";
import { activeMailTaskFor, mailTasksReachable } from "@/lib/mail-active-task";
import { storyMailsFor, storyMailsUpTo } from "@/lib/story-beats";
import { courseLevels, taskKeysForLevel } from "@/lib/tracks-content";

/**
 * Story Mode Audit #1. Mail picked its running job from every level in the
 * game, so on the College, Front desk, and Office routes it sat on the
 * Stay-and-lead Reply-All task forever and hid every manager note after it.
 * Mail now only runs a job on the learner's own route, up to today's level.
 */

const ROUTES: (CourseRoute | null)[] = [null, ...COURSE_ROUTES];

/** Everything a learner on this route has finished when a level starts. */
function doneBefore(route: CourseRoute | null, levelIndex: number): TaskKey[] {
  const path = routeBridgePath(route);
  return courseLevels(route)
    .slice(0, levelIndex)
    .flatMap((l) => taskKeysForLevel(l, path));
}

/** What Mail's inbox holds: story mail up to the running job, or all of it once that job is done. */
function inboxStory(done: TaskKey[], route: CourseRoute | null, levelKey: string) {
  const active = activeMailTaskFor(done, route, levelKey);
  return storyMailsUpTo(done.includes(active) ? null : active, done, {});
}

describe("activeMailTaskFor", () => {
  for (const route of ROUTES) {
    const levels = courseLevels(route);

    it(`never runs a mail job from off the ${route ?? "core"} route or from a later day`, () => {
      levels.forEach((level, i) => {
        const done = doneBefore(route, i);
        const active = activeMailTaskFor(done, route, level.key);
        const reachable = mailTasksReachable(route, level.key);
        // Before the first mail job (the tour), Mail opens on the Day One replies.
        expect(reachable.length ? reachable : ["mail-reply"], `${level.key}`).toContain(active);
      });
    });

    it(`shows every manager note already earned on the ${route ?? "core"} route, every day`, () => {
      levels.forEach((level, i) => {
        const done = doneBefore(route, i);
        const shown = inboxStory(done, route, level.key).map((m) => m.key);
        const earned = storyMailsFor(done, {}).map((m) => m.key);
        expect(shown, `start of ${level.key}`).toEqual(earned);
      });
    });

    it(`shows the last note after finishing the ${route ?? "core"} route`, () => {
      const last = levels[levels.length - 1]!;
      const done = doneBefore(route, levels.length);
      const shown = inboxStory(done, route, last.key).map((m) => m.key);
      expect(shown).toEqual(storyMailsFor(done, {}).map((m) => m.key));
      expect(shown.length).toBeGreaterThan(0);
    });
  }

  it("keeps Reply-All on the Stay-and-lead route only", () => {
    for (const route of ROUTES) {
      const last = courseLevels(route).at(-1)!;
      expect(mailTasksReachable(route, last.key).includes("reply-all"), `${route}`).toBe(route === "lead");
    }
  });

  it("does not hand a Day 6 learner Day 10's email to Jordan", () => {
    const levels = courseLevels(null);
    const paystubDay = levels.findIndex((l) => taskKeysForLevel(l).includes("paystub"));
    const done = doneBefore(null, paystubDay);
    expect(activeMailTaskFor(done, null, levels[paystubDay]!.key)).not.toBe("mail-send-link");
  });

  it("still holds the attach job until the schedule is read", () => {
    expect(activeMailTaskFor(["tour", "mail-read", "mail-reply"], null, "level2")).toBe("mail-reply");
  });
});

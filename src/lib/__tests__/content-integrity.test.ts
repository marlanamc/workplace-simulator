import { describe, expect, it } from "vitest";
import { TASK_KEYS, type TaskKey } from "@/lib/desktop-content";
import {
  ACTS,
  LEVELS,
  TRACKS,
  TASK_INFO,
  TASK_LOCATIONS,
  TAB_LEVEL_KEYS,
  taskKeysForLevel,
} from "@/lib/tracks-content";
import { HANDOFF_CTA, SHIFT_MOMENT } from "@/lib/story-beats";
import { BOOKMARK_LABEL } from "@/lib/shift-spine";
import { firstPersonSkill } from "@/lib/skills";
import { TASKS } from "@/lib/tasks/registry";

/**
 * The drift detector. Every task a learner can reach must be fully wired:
 * info, location, CTA, bookmark label, and both languages. A missing entry
 * here is a learner staring at a desktop with no button — the exact class
 * of bug that is invisible in a code review and fatal in an async classroom.
 */

/** Tasks a learner can actually reach by playing (every track's tasks, in order). */
const reachableTaskKeys: TaskKey[] = TRACKS.flatMap((t) => t.taskKeys);

function expectBilingual(value: { en: string; es: string } | undefined, label: string) {
  expect(value, `${label} is missing`).toBeDefined();
  expect(value!.en.trim(), `${label}.en is empty`).not.toBe("");
  expect(value!.es.trim(), `${label}.es is empty`).not.toBe("");
}

describe("the task registry is the single source of truth", () => {
  it("has an entry for every TaskKey, keyed to itself", () => {
    for (const key of TASK_KEYS) {
      expect(TASKS[key], `TASKS[${key}] missing`).toBeDefined();
      expect(TASKS[key].key, `TASKS[${key}].key mismatch`).toBe(key);
    }
  });

  it.each(reachableTaskKeys)("%s (a reachable task) has a complete, bilingual descriptor", (key) => {
    const d = TASKS[key];
    expect(d, `TASKS[${key}]`).toBeDefined();
    expect(d.retired, `${key} is reachable but marked retired`).not.toBe(true);
    expectBilingual(d.label, `TASKS[${key}].label`);
    expectBilingual(d.dispatch, `TASKS[${key}].dispatch`);
    expectBilingual(d.handoffCta, `TASKS[${key}].handoffCta`);
    expectBilingual(d.shiftMoment, `TASKS[${key}].shiftMoment`);
    expect(d.skill.trim(), `TASKS[${key}].skill`).not.toBe("");
    expect(d.bookmarkLabel.trim(), `TASKS[${key}].bookmarkLabel`).not.toBe("");
    if (d.built) {
      expect(d.location, `TASKS[${key}].location — a built task needs a home`).toBeDefined();
    }
  });

  it("retired keys are in no track (they exist only for old DB rows)", () => {
    const reachable = new Set(reachableTaskKeys);
    for (const key of TASK_KEYS) {
      if (TASKS[key].retired) {
        expect(reachable.has(key), `retired task "${key}" is still in a track`).toBe(false);
      }
    }
  });
});

describe("every reachable task is fully wired", () => {
  it.each(reachableTaskKeys)("%s has bilingual TASK_INFO", (key) => {
    const info = TASK_INFO[key];
    expect(info, `TASK_INFO[${key}]`).toBeDefined();
    expectBilingual(info.label, `TASK_INFO[${key}].label`);
    expectBilingual(info.dispatch, `TASK_INFO[${key}].dispatch`);
  });

  it.each(reachableTaskKeys)("%s (if built) has a TASK_LOCATIONS entry so the desktop button exists", (key) => {
    if (!TASK_INFO[key]?.built) return;
    expect(TASK_LOCATIONS[key], `TASK_LOCATIONS[${key}] — without it, nextHandoff() returns null and the learner has no button`).toBeDefined();
  });

  it.each(reachableTaskKeys)("%s has a bilingual HANDOFF_CTA (TaskDoneActions reads it unguarded)", (key) => {
    expectBilingual(HANDOFF_CTA[key], `HANDOFF_CTA[${key}]`);
  });

  it.each(reachableTaskKeys)("%s has a bilingual SHIFT_MOMENT", (key) => {
    expectBilingual(SHIFT_MOMENT[key], `SHIFT_MOMENT[${key}]`);
  });

  it.each(reachableTaskKeys)("%s has a bookmark label and a first-person skill line", (key) => {
    expect(BOOKMARK_LABEL[key], `BOOKMARK_LABEL[${key}]`).toBeTruthy();
    expect(firstPersonSkill(key), `firstPersonSkill(${key})`).toBeTruthy();
  });

  it("every reachable task key is a real TaskKey", () => {
    for (const key of reachableTaskKeys) {
      expect(TASK_KEYS, `track task "${key}" missing from TASK_KEYS`).toContain(key);
    }
  });

  it("no task belongs to two tracks", () => {
    const seen = new Map<string, string>();
    for (const track of TRACKS) {
      for (const key of track.taskKeys) {
        expect(seen.has(key), `task "${key}" is in both "${seen.get(key)}" and "${track.key}"`).toBe(false);
        seen.set(key, track.key);
      }
    }
  });
});

describe("levels and acts stay consistent", () => {
  it("every level's tracks exist, and no track is claimed by two levels", () => {
    const trackKeys = new Set(TRACKS.map((t) => t.key));
    const claimed = new Map<string, string>();
    for (const level of LEVELS) {
      for (const tk of level.trackKeys) {
        expect(trackKeys.has(tk), `level "${level.key}" references unknown track "${tk}"`).toBe(true);
        expect(claimed.has(tk), `track "${tk}" claimed by both "${claimed.get(tk)}" and "${level.key}"`).toBe(false);
        claimed.set(tk, level.key);
      }
    }
  });

  it("every track belongs to some level (orphan tracks are unreachable content)", () => {
    const claimed = new Set(LEVELS.flatMap((l) => l.trackKeys));
    for (const track of TRACKS) {
      expect(claimed.has(track.key), `track "${track.key}" is in no level`).toBe(true);
    }
  });

  it("every level's firstTabKey is a known browser tab", () => {
    const tabKeys = new Set(Object.keys(TAB_LEVEL_KEYS));
    for (const level of LEVELS) {
      expect(tabKeys.has(level.firstTabKey), `level "${level.key}" opens unknown tab "${level.firstTabKey}"`).toBe(true);
    }
  });

  it("every level belongs to exactly one act", () => {
    const claimed = new Map<string, string>();
    for (const act of ACTS) {
      for (const lk of act.levelKeys) {
        expect(LEVELS.some((l) => l.key === lk), `act "${act.key}" references unknown level "${lk}"`).toBe(true);
        expect(claimed.has(lk), `level "${lk}" is in two acts`).toBe(false);
        claimed.set(lk, act.key);
      }
    }
    for (const level of LEVELS) {
      expect(claimed.has(level.key), `level "${level.key}" is in no act`).toBe(true);
    }
  });

  it("every level has 1-4 tasks (the game's cognitive-load ceiling)", () => {
    for (const level of LEVELS) {
      const count = taskKeysForLevel(level).length;
      expect(count, `level "${level.key}" has ${count} tasks`).toBeGreaterThanOrEqual(1);
      expect(count, `level "${level.key}" has ${count} tasks — over the 4-task ceiling`).toBeLessThanOrEqual(4);
    }
  });
});

describe("the story arc has no missing chapters", () => {
  it("every level after the first has a bilingual level-up story card", () => {
    for (const level of LEVELS.slice(1)) {
      const up = level.levelUp;
      expect(up, `level "${level.key}" has no levelUp story card — the arc skips a chapter`).toBeDefined();
      expectBilingual(up!.kicker, `${level.key} levelUp.kicker`);
      expectBilingual(up!.title, `${level.key} levelUp.title`);
      expectBilingual(up!.body, `${level.key} levelUp.body`);
      expectBilingual(up!.cta, `${level.key} levelUp.cta`);
    }
  });
});

/**
 * Globbed rather than imported one by one, so a task added next month is
 * covered without anyone remembering to add it here. These are the lines the
 * Job Card reads out as the learner works - an English string reaching a
 * Spanish-speaking learner mid-task is exactly the silent failure this whole
 * suite exists to prevent.
 */
// import.meta.glob is Vite's, and this repo's tsconfig is Next's - declaring it
// here keeps Vite types out of the app build.
declare global {
  interface ImportMeta {
    glob<T>(pattern: string, options: { eager: true }): Record<string, T>;
  }
}

const taskContentModules = import.meta.glob<Record<string, unknown>>(
  "../tasks/*/content.ts",
  { eager: true },
);

describe("in-task step instructions are bilingual", () => {
  const withSteps = Object.entries(taskContentModules)
    .map(([path, mod]) => [path.match(/tasks\/([^/]+)\//)?.[1] ?? path, mod] as const)
    .filter(([, mod]) => Array.isArray(mod.RIGHT_NOW_STEPS));

  it("found the task content modules to check (the glob still resolves)", () => {
    // Guards against a silent pass if the tasks folder ever moves: an empty
    // glob would otherwise make every check below vacuously true.
    expect(Object.keys(taskContentModules).length).toBeGreaterThan(15);
    expect(withSteps.length).toBeGreaterThan(15);
  });

  it.each(withSteps)("%s RIGHT_NOW_STEPS are bilingual and non-empty", (task, mod) => {
    const steps = mod.RIGHT_NOW_STEPS as { en: string; es: string }[];
    expect(steps.length, `${task} has an empty RIGHT_NOW_STEPS`).toBeGreaterThan(0);
    for (const [i, step] of steps.entries()) {
      expectBilingual(step, `${task} RIGHT_NOW_STEPS[${i}]`);
    }
  });

  it.each(withSteps)("%s RIGHT_NOW_LABEL is bilingual", (task, mod) => {
    expectBilingual(mod.RIGHT_NOW_LABEL as { en: string; es: string }, `${task} RIGHT_NOW_LABEL`);
  });
});

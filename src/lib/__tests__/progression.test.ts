import { describe, expect, it } from "vitest";
import type { TaskKey } from "@/lib/desktop-content";
import {
  LEVELS,
  TRACKS,
  activeTrack,
  taskKeysBeforeLevel,
  trackKeysBeforeLevel,
  allTracksComplete,
  furthestLevelIndex,
  isLevelComplete,
  levelForTrack,
  nextHandoff,
  nextTaskInTrack,
  normalizeCertificateTrackKeys,
  taskKeysForLevel,
  unlockedLevels,
} from "@/lib/tracks-content";

/**
 * The game-loop invariant: from a fresh account, following the blue button
 * must visit every task exactly once and never dead-end. If any future
 * change breaks "there is always a next job," this is the test that fails.
 */
describe("the whole game can be walked start to finish", () => {
  it("nextHandoff always exists until every task is done, with no repeats", () => {
    const done: TaskKey[] = [];
    const totalTasks = TRACKS.reduce((n, t) => n + t.taskKeys.length, 0);

    for (let i = 0; i < totalTasks; i++) {
      const handoff = nextHandoff(done);
      expect(handoff, `dead end after ${done.length} tasks (last: ${done.at(-1)})`).not.toBeNull();
      expect(done, `task ${handoff!.taskKey} handed out twice`).not.toContain(handoff!.taskKey);
      expect(handoff!.location.ctaLabel, `task ${handoff!.taskKey} has no CTA label`).toBeTruthy();
      done.push(handoff!.taskKey);
    }

    expect(done).toHaveLength(totalTasks);
    expect(allTracksComplete(done)).toBe(true);
    expect(nextHandoff(done)).toBeNull();
  });

  it("a brand-new learner starts at the tour", () => {
    expect(activeTrack([]).key).toBe("orientation");
    expect(nextHandoff([])?.taskKey).toBe("tour");
  });

  it("a learner with job progress is never pulled back to Level 0", () => {
    // Historical accounts may have job tasks done but not the tour.
    const midGame: TaskKey[] = ["mail-read", "mail-reply"];
    expect(activeTrack(midGame).key).not.toBe("orientation");
    expect(nextHandoff(midGame)?.taskKey).toBe("mail-attach");
  });
});

describe("progress presets (the Studio time machine)", () => {
  it("teleporting to any level's start hands out exactly that level's first task", () => {
    for (const level of LEVELS) {
      const preset = taskKeysBeforeLevel(level.key);
      const firstTask = taskKeysForLevel(level)[0];
      expect(
        nextHandoff(preset)?.taskKey,
        `preset for "${level.key}" should point at its first task`,
      ).toBe(firstTask);
    }
  });

  it("start-of-first-level is a fresh account; unknown keys are too", () => {
    expect(taskKeysBeforeLevel(LEVELS[0].key)).toEqual([]);
    expect(taskKeysBeforeLevel("no-such-level")).toEqual([]);
    expect(trackKeysBeforeLevel(LEVELS[0].key)).toEqual([]);
  });

  it("the preset's certificates match its completions", () => {
    for (const level of LEVELS) {
      const preset = taskKeysBeforeLevel(level.key);
      for (const trackKey of trackKeysBeforeLevel(level.key)) {
        const track = TRACKS.find((t) => t.key === trackKey)!;
        for (const taskKey of track.taskKeys) {
          expect(preset, `track "${trackKey}" certified but task "${taskKey}" not completed`).toContain(taskKey);
        }
      }
    }
  });
});

describe("level progression", () => {
  it("finishing a level's tasks completes the level and unlocks the next", () => {
    const level1 = LEVELS.find((l) => l.key === "level1")!;
    const level0Tasks = taskKeysForLevel(LEVELS[0]);
    const level1Tasks = taskKeysForLevel(level1);

    const done = [...level0Tasks, ...level1Tasks];
    expect(isLevelComplete(level1, done)).toBe(true);
    expect(isLevelComplete(level1, done.slice(0, -1))).toBe(false);

    const level2Index = LEVELS.findIndex((l) => l.key === "level2");
    expect(furthestLevelIndex(done)).toBeGreaterThanOrEqual(level2Index);
    expect(unlockedLevels(done).map((l) => l.key)).toContain("level2");
  });

  it("levelForTrack falls back to the last level for unknown tracks", () => {
    expect(levelForTrack("no-such-track").key).toBe(LEVELS[LEVELS.length - 1].key);
  });

  it("the old 'growing' certificate splits into the three tracks the learner finished", () => {
    const migrated = normalizeCertificateTrackKeys(["starter", "growing"], ["calendar", "files"]);
    expect(migrated).toContain("starter");
    expect(migrated).toContain("calendar");
    expect(migrated).toContain("files");
    expect(migrated).not.toContain("growing");
    expect(migrated).not.toContain("spreadsheet");
  });

  it("nextTaskInTrack walks a track in order", () => {
    const starter = TRACKS.find((t) => t.key === "starter")!;
    expect(nextTaskInTrack(starter, [])).toBe("mail-read");
    expect(nextTaskInTrack(starter, ["mail-read"])).toBe("mail-reply");
    expect(nextTaskInTrack(starter, [...starter.taskKeys])).toBeNull();
  });
});

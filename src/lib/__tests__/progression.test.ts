import { describe, expect, it } from "vitest";
import type { TaskKey } from "@/lib/desktop-content";
import {
  bridgePathBadge,
  bridgePathFromBadgeKeys,
  needsBridgePicker,
  PATH_A_TASKS,
  PATH_B_TASKS,
  ACT_6_TASKS,
  type BridgePath,
} from "@/lib/bridge-path";
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

function walkUntilPicker(start: TaskKey[] = []): TaskKey[] {
  const done = [...start];
  for (let i = 0; i < 80; i++) {
    const handoff = nextHandoff(done);
    if (!handoff) return done;
    expect(done, `task ${handoff.taskKey} handed out twice`).not.toContain(handoff.taskKey);
    done.push(handoff.taskKey);
  }
  throw new Error("walk did not reach a picker");
}

function walkPath(start: TaskKey[], path: BridgePath): TaskKey[] {
  const done = [...start];
  const expected = path === "a" ? PATH_A_TASKS : PATH_B_TASKS;
  for (const key of expected) {
    if (done.includes(key)) continue;
    const handoff = nextHandoff(done, path);
    expect(handoff, `dead end on path ${path} after ${done.at(-1)}`).not.toBeNull();
    expect(handoff!.taskKey).toBe(key);
    done.push(handoff!.taskKey);
  }
  return done;
}

function walkHq(start: TaskKey[], path: BridgePath): TaskKey[] {
  const done = [...start];
  for (const key of ACT_6_TASKS) {
    if (done.includes(key)) continue;
    const handoff = nextHandoff(done, path);
    expect(handoff, `dead end on HQ after ${done.at(-1)}`).not.toBeNull();
    expect(handoff!.taskKey).toBe(key);
    done.push(handoff!.taskKey);
  }
  return done;
}

/**
 * The game-loop invariant: from a fresh account, following the blue button
 * must visit every task exactly once and never dead-end. If any future
 * change breaks "there is always a next job," this is the test that fails.
 */
describe("the whole game can be walked start to finish", () => {
  it("the trunk walks to the Act V picker, then one path is enough to leave", () => {
    const trunk = walkUntilPicker();
    expect(trunk.at(-1)).toBe("reply-all");
    expect(needsBridgePicker(trunk)).toBe("choose");
    expect(allTracksComplete(trunk)).toBe(false);
    expect(nextHandoff(trunk)).toBeNull();

    const pathA = walkPath(trunk, "a");
    expect(allTracksComplete(pathA)).toBe(false);
    expect(needsBridgePicker(pathA, "a")).toBe("other");
    expect(nextHandoff(pathA, "a")?.taskKey).toBe("office-drive");
    expect(nextHandoff(pathA, "b")?.taskKey).toBe("appointment-scheduling");

    const hq = walkHq(pathA, "a");
    expect(allTracksComplete(hq)).toBe(true);
    expect(needsBridgePicker(hq, "a")).toBeNull();
    expect(nextHandoff(hq, "a")).toBeNull();
    expect(nextHandoff(hq, "b")?.taskKey).toBe("appointment-scheduling");

    const both = walkPath(hq, "b");
    expect(needsBridgePicker(both, "b")).toBeNull();
    expect(nextHandoff(both, "b")).toBeNull();
  });

  it("a Path A-only run never hands off into Path B", () => {
    const trunk = walkUntilPicker();
    const pathA = walkPath(trunk, "a");
    for (const key of PATH_B_TASKS) {
      expect(pathA, `path A picked up ${key}`).not.toContain(key);
    }
    expect(nextHandoff(pathA, "a")?.taskKey).toBe("office-drive");
    expect(pathA).not.toContain("appointment-scheduling");
  });

  it("a Path B-only run never hands off into Path A", () => {
    const trunk = walkUntilPicker();
    const pathB = walkPath(trunk, "b");
    for (const key of PATH_A_TASKS) {
      expect(pathB, `path B picked up ${key}`).not.toContain(key);
    }
    expect(allTracksComplete(pathB)).toBe(false);
    expect(nextHandoff(pathB, "b")?.taskKey).toBe("office-drive");
    expect(nextHandoff(pathB, "a")?.taskKey).toBe("enrollment");
    const hq = walkHq(pathB, "b");
    expect(allTracksComplete(hq)).toBe(true);
    expect(nextHandoff(hq, "b")).toBeNull();
  });

  it("a brand-new learner starts at the tour", () => {
    expect(activeTrack([]).key).toBe("orientation");
    expect(nextHandoff([])?.taskKey).toBe("tour");
  });

  it("a learner with job progress is never pulled back to Level 0", () => {
    // Historical accounts may have job tasks done but not the tour.
    const midGame: TaskKey[] = ["mail-reply"];
    expect(activeTrack(midGame).key).not.toBe("orientation");
    expect(nextHandoff(midGame)?.taskKey).toBe("mail-attach");
  });
});

describe("progress presets (the Studio time machine)", () => {
  it("teleporting to any level's start hands out exactly that level's first task", () => {
    for (const level of LEVELS) {
      if (level.pathTracks) {
        for (const path of ["a", "b"] as const) {
          const preset = taskKeysBeforeLevel(level.key, path);
          const firstTask = taskKeysForLevel(level, path)[0];
          expect(
            nextHandoff(preset, path)?.taskKey,
            `preset for "${level.key}:${path}" should point at ${firstTask}`,
          ).toBe(firstTask);
        }
        continue;
      }
      const isHq = level.trackKeys.some((tk) =>
        TRACKS.find((t) => t.key === tk)?.taskKeys.some((k) => ACT_6_TASKS.includes(k)),
      );
      if (isHq) {
        for (const path of ["a", "b"] as const) {
          const preset = taskKeysBeforeLevel(level.key, path);
          const firstTask = taskKeysForLevel(level, path)[0];
          expect(
            nextHandoff(preset, path)?.taskKey,
            `preset for "${level.key}:${path}" should point at ${firstTask}`,
          ).toBe(firstTask);
        }
        continue;
      }
      const preset = taskKeysBeforeLevel(level.key);
      const firstTask = taskKeysForLevel(level)[0];
      expect(
        nextHandoff(preset)?.taskKey,
        `preset for "${level.key}" should point at its first task`,
      ).toBe(firstTask);
    }
  });

  it("the path badge is how a refresh remembers the chosen door", () => {
    expect(bridgePathFromBadgeKeys([])).toBeNull();
    expect(bridgePathFromBadgeKeys(["track:enrollment", bridgePathBadge("a")])).toBe("a");
    expect(bridgePathFromBadgeKeys([bridgePathBadge("b"), "track:reply-all"])).toBe("b");
  });

  it("start of Act V with no path is the picker, not a path task", () => {
    const preset = taskKeysBeforeLevel("level16");
    expect(nextHandoff(preset)).toBeNull();
    expect(needsBridgePicker(preset)).toBe("choose");
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
    expect(nextTaskInTrack(starter, [])).toBe("mail-reply");
    expect(nextTaskInTrack(starter, ["mail-reply"])).toBe("mail-attach");
    expect(nextTaskInTrack(starter, [...starter.taskKeys])).toBeNull();
  });
});

import { describe, it, expect } from "vitest";
import { readPauseFlagKey, readPauseStage, hasOpenReadPause } from "@/lib/read-pause";
import { READ_PAUSE_TASK_KEYS, TASKS } from "@/lib/tasks/registry";
import { storyFlagKeysForTasks } from "@/lib/story-beats";

/**
 * The Act I onboarding plan's reading pause: after certain tasks, the Job
 * Card holds the next-job handoff and any celebration until the learner has
 * opened the response and pressed Continue. This is data-only (a story
 * flag), so it's tested as pure functions rather than by rendering the card
 * (see job-card-wiring.test.ts for why this repo tests the card that way).
 */

describe("read pause", () => {
  it("configures exactly the five Act I tasks the onboarding plan named", () => {
    expect(new Set(READ_PAUSE_TASK_KEYS)).toEqual(
      new Set(["schedule", "mail-attach", "timeclock", "call-out-sick", "paystub"]),
    );
  });

  it("every configured task has somewhere for Read reply to open", () => {
    for (const key of READ_PAUSE_TASK_KEYS) {
      expect(TASKS[key].readPause?.appKey).toBeTruthy();
    }
  });

  it("defaults to acknowledged for a task that never set the flag", () => {
    expect(readPauseStage({}, "paystub")).toBe("acknowledged");
    expect(hasOpenReadPause({}, READ_PAUSE_TASK_KEYS)).toBe(false);
  });

  it("a learner who finished the task before this shipped is never retroactively gated", () => {
    // No flag was ever written for them — the completion guard in
    // progress-context.tsx only sets "unread" the first time a task
    // completes, so an already-completed task with no flag stays acknowledged.
    const flagsWithoutPause = { "some-other-flag": "true" };
    expect(readPauseStage(flagsWithoutPause, "timeclock")).toBe("acknowledged");
  });

  it("moves unread -> reading -> acknowledged in order", () => {
    let flags: Record<string, string> = { [readPauseFlagKey("timeclock")]: "unread" };
    expect(readPauseStage(flags, "timeclock")).toBe("unread");
    expect(hasOpenReadPause(flags, READ_PAUSE_TASK_KEYS)).toBe(true);

    flags = { ...flags, [readPauseFlagKey("timeclock")]: "reading" };
    expect(readPauseStage(flags, "timeclock")).toBe("reading");
    expect(hasOpenReadPause(flags, READ_PAUSE_TASK_KEYS)).toBe(true);

    // Reload resumes exactly this stage: a fresh read from the same flags
    // object lands on "reading" again, not back at "unread".
    expect(readPauseStage({ ...flags }, "timeclock")).toBe("reading");

    flags = { ...flags, [readPauseFlagKey("timeclock")]: "acknowledged" };
    expect(readPauseStage(flags, "timeclock")).toBe("acknowledged");
    expect(hasOpenReadPause(flags, READ_PAUSE_TASK_KEYS)).toBe(false);
  });

  it("holds celebration while any one of the five is still open, not just the most recent", () => {
    const flags = {
      [readPauseFlagKey("mail-attach")]: "acknowledged",
      [readPauseFlagKey("schedule")]: "unread",
    };
    expect(hasOpenReadPause(flags, READ_PAUSE_TASK_KEYS)).toBe(true);
  });

  it("Studio replay/restart clears every configured task's read-pause flag", () => {
    const cleared = storyFlagKeysForTasks(READ_PAUSE_TASK_KEYS);
    for (const key of READ_PAUSE_TASK_KEYS) {
      expect(cleared).toContain(readPauseFlagKey(key));
    }
  });
});

import type { TaskKey } from "@/lib/desktop-content";
import type { StoryFlags } from "@/lib/story-beats";

/**
 * A deliberate reading pause after certain Act I tasks: the learner's reply
 * saved and the task is done, but the Job Card holds the next-job handoff
 * and any celebration until they have opened the response and pressed
 * Continue. One flag per task, in story flags (device-local, same as every
 * other one-time story beat), so a reload resumes the exact same stage.
 *
 * "unread" is only ever set once, the first time a task with a configured
 * pause completes (see `progress-context.tsx`'s `markComplete`) — a task
 * completed before this shipped never gets the flag, so nothing is replayed
 * retroactively.
 */
export type ReadPauseStage = "unread" | "reading" | "acknowledged";

export const readPauseFlagKey = (taskKey: TaskKey) => `read-pause:${taskKey}`;

export function readPauseStage(flags: StoryFlags, taskKey: TaskKey): ReadPauseStage {
  const v = flags[readPauseFlagKey(taskKey)];
  return v === "unread" || v === "reading" ? v : "acknowledged";
}

/**
 * True while any tracked task's reading pause is still open. Celebrations
 * wait for this exactly like they wait for anything else the Job Card is
 * already showing — one voice on screen at a time.
 */
export function hasOpenReadPause(flags: StoryFlags, taskKeys: readonly TaskKey[]): boolean {
  return taskKeys.some((k) => readPauseStage(flags, k) !== "acknowledged");
}

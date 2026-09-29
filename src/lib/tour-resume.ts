/**
 * Where a reload puts a learner who was part-way through "How this works"
 * (Wave 5 F-7): the same welcome beat, the same practice stage, the same
 * walkthrough step. The values are task drafts (`ws-task-draft:<learner>:tour:*`,
 * see use-task-draft.ts), so Studio jumps and Replay clear them, and lessons
 * keep nothing. Anything stored that no longer fits (an old build, a hand-edited
 * key, a shorter step list) falls back to the start rather than a broken beat.
 */

/** Draft fields under the `tour` task. */
export const TOUR_DRAFT = {
  introBeat: "intro-beat",
  practice: "practice",
  walkthroughStep: "walkthrough-step",
  walkthroughDone: "walkthrough-done",
  helpOpened: "help-opened",
} as const;

export const PRACTICE_STAGES = ["inactive", "click", "scroll", "complete"] as const;
export type PracticeStage = (typeof PRACTICE_STAGES)[number];

export function savedPracticeStage(value: unknown): PracticeStage {
  return PRACTICE_STAGES.find((stage) => stage === value) ?? "inactive";
}

/** A stored intro beat, clamped to `0..beatCount` (beatCount = through them). */
export function savedIntroBeat(value: unknown, beatCount: number): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) return 0;
  return Math.min(value, beatCount);
}

/** A stored walkthrough step, or null when there is none or it no longer exists. */
export function savedTourStep(value: unknown, stepCount: number): number | null {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0 || value >= stepCount) return null;
  return value;
}

/**
 * The tab a resumed walkthrough step expects to be on: the tab the learner
 * last clicked their way to, or null when no earlier step moved them. After a
 * reload the Browser opens on Welcome, so a step that says "This is your work
 * email" has to bring Mail back with it.
 */
export function tourResumeTab(
  steps: readonly { targetTabKey?: string; targetTestId?: string }[],
  stepIndex: number,
): string | null {
  for (let i = Math.min(stepIndex, steps.length) - 1; i >= 0; i--) {
    const step = steps[i];
    if (step.targetTabKey && !step.targetTestId) return step.targetTabKey;
  }
  return null;
}

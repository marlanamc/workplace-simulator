import type { TaskKey } from "@/lib/desktop-content";

/**
 * Whether the Job Card may say "Done" for a finish a done screen reported.
 *
 * A done screen shows whenever an app opens on a job that is already
 * finished, including days later: the Portal on Day 4 still holds Day 2's
 * swap, and Mail on Day 6 still holds Day 5's sick call. Those screens used
 * to turn the card green with "Done. Start tomorrow." on a day that had not
 * started (Wave 5 F-9, F-22; also B-4, C5, D-F1).
 *
 * So the card believes a finish only from the job the learner just
 * completed, and only until they go back to the desktop. `justFinished` is
 * that job, or null once they have left it. It also believes a job the
 * learner deliberately went back to (a teacher's note opens it to revise):
 * `revisiting` says the reporting job is on that tab. A lesson is one job,
 * so any finish in a lesson is its own.
 */
export function ownsFinish({
  reported,
  justFinished,
  inLesson,
  revisiting = false,
}: {
  reported: TaskKey;
  justFinished: TaskKey | null;
  inLesson: boolean;
  revisiting?: boolean;
}): boolean {
  if (inLesson || revisiting) return true;
  return justFinished !== null && reported === justFinished;
}

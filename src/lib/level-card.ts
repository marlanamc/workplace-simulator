/**
 * Which layout the level card uses.
 *
 * - "stop": the end of a sitting, just finished. "Stop for today" is the big
 *   button; carrying on is offered quietly under it.
 * - "welcome-back": the same stop card, shown again after the learner signed
 *   back in (or reloaded). Stopping again makes no sense, and "Next time you
 *   sign in" is now. The day's continue button is the only button (Wave 5
 *   F-6: a returning learner met the stop card again, pressed the big blue
 *   Stop, and was signed straight back out).
 * - "continue": any other level card; continue first, stop quietly under it.
 */
export type LevelCardMode = "stop" | "welcome-back" | "continue";

export function levelCardMode(stoppingPoint: boolean | undefined, returning: boolean): LevelCardMode {
  if (!stoppingPoint) return "continue";
  return returning ? "welcome-back" : "stop";
}

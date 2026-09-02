import type { TaskKey } from "./desktop-content";
import type { Lang } from "./task-types";
import {
  LEVELS,
  TASK_INFO,
  actForLevel,
  nextTaskInTrack,
  taskKeysForLevel,
  type Level,
  type Track,
} from "./tracks-content";
import { TASK_LIST } from "./tasks/registry";

/**
 * The sitting's name on its own — "Payday & Trouble".
 *
 * `Level.title` holds the bare name and no number. Numbering is derived from
 * `LEVELS` order by `dayNumber` instead of being written into the string,
 * because the hand-written sequence had already drifted (a "Level 3" followed
 * by "3b" and "3c") and a title that carries its own number drifts again the
 * next time a level is inserted.
 */
export function sittingTitle(level: Level): string {
  return level.title;
}

/**
 * The learner-facing number for a level: its position in `LEVELS`, counting
 * from Day 1 at the first level after orientation.
 *
 * Deliberately derived from array order rather than parsed out of
 * `level.title`. The titles carry a stale hand-written sequence (Level 3 is
 * followed by 3b and 3c, artifacts of inserting content without renumbering)
 * and a learner reading "Day 3b" in the replay menu reads it as a bug. Order
 * is the only thing that is actually true, so it is the only thing we count.
 *
 * Level 0 is the how-this-works tour, not a day on the job — it gets day 0,
 * and callers show its name alone.
 */
export function dayNumber(level: Level): number {
  return LEVELS.findIndex((l) => l.key === level.key);
}

/** "Day 4: Payday & Trouble" — the level's learner-facing title. */
export function dayTitle(level: Level, lang: Lang): string {
  const n = dayNumber(level);
  const name = sittingTitle(level);
  if (n <= 0) return name;
  return lang === "en" ? `Day ${n}: ${name}` : `Día ${n}: ${name}`;
}

/**
 * Workdays in this level's act: the act's levels that are days on the job
 * (`dayNumber > 0`). Orientation is in the act but is not a workday.
 */
export function workdaysInAct(level: Level): Level[] {
  const act = actForLevel(level);
  if (!act) return [];
  return act.levelKeys
    .map((key) => LEVELS.find((l) => l.key === key))
    .filter((l): l is Level => l != null && dayNumber(l) > 0);
}

/**
 * 1-based index of this level among its act's workdays, or 0 if it is not
 * a workday (orientation, or a level that is not in an act).
 */
export function dayInAct(level: Level): number {
  const idx = workdaysInAct(level).findIndex((l) => l.key === level.key);
  return idx >= 0 ? idx + 1 : 0;
}

/**
 * "Day 3 of 5" on the Job Card kicker — position in this job, not a
 * running total across acts. Orientation keeps its name.
 */
export function dayLabel(level: Level, lang: Lang): string {
  const n = dayInAct(level);
  const total = workdaysInAct(level).length;
  if (n <= 0) return sittingTitle(level);
  if (total > 0) {
    return lang === "en" ? `Day ${n} of ${total}` : `Día ${n} de ${total}`;
  }
  return lang === "en" ? `Day ${n}` : `Día ${n}`;
}

/** Act title without the "Act I:" prefix — the job they hold. */
export function jobTitle(level: Level): string {
  const act = actForLevel(level);
  return act ? act.title.replace(/^Act [IVXL]+:\s*/, "") : sittingTitle(level);
}

/** Built tasks still open in this level. */
export function remainingTasksInLevel(level: Level, completedTaskKeys: TaskKey[]): number {
  return taskKeysForLevel(level).filter((k) => !completedTaskKeys.includes(k) && TASK_INFO[k]?.built).length;
}

export function nextBuiltTask(track: Track, completedTaskKeys: TaskKey[]): TaskKey | null {
  const key = nextTaskInTrack(track, completedTaskKeys);
  if (!key || !TASK_INFO[key]?.built) return null;
  return key;
}

/**
 * Bookmark-bar label for a task's home, derived from the task registry
 * (`src/lib/tasks/registry.ts`). Matches BrowserClient's tab definitions.
 */
export const BOOKMARK_LABEL: Record<TaskKey, string> = Object.fromEntries(
  TASK_LIST.map((d) => [d.key, d.bookmarkLabel]),
) as Record<TaskKey, string>;

export function newTabHint(level: Level, taskKey: TaskKey | null, lang: Lang): string {
  const sitting = sittingTitle(level);
  if (!taskKey) {
    return lang === "en"
      ? `${sitting}. Use the bookmarks bar to open your apps.`
      : `${sitting}. Usa la barra de marcadores para abrir tus apps.`;
  }
  const bookmark = BOOKMARK_LABEL[taskKey];
  return lang === "en"
    ? `${sitting} · open ${bookmark} from the bar`
    : `${sitting} · abre ${bookmark} en la barra`;
}

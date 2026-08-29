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

/** "Day 4" on its own, for tight spots like the Job Card kicker. */
export function dayLabel(level: Level, lang: Lang): string {
  const n = dayNumber(level);
  if (n <= 0) return sittingTitle(level);
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

/** Bookmark bar label for a task's home — matches BrowserClient BASE_TABS. */
export const BOOKMARK_LABEL: Record<TaskKey, string> = {
  tour: "Welcome",
  mail: "Mail",
  "mail-read": "Mail",
  "mail-reply": "Mail",
  "mail-attach": "Mail",
  schedule: "Portal",
  "swap-request": "Portal",
  "call-out-sick": "Mail",
  timeclock: "Portal",
  paystub: "Portal",
  "shift-review": "Portal",
  "account-recovery": "Sign In",
  incident: "Forms",
  handbook: "Docs",
  calendar: "Calendar",
  files: "Drive",
  spreadsheet: "Sheets",
  "make-a-copy": "Sheets",
  "status-report": "Sheets",
  triage: "Today",
  "team-schedule": "Sheets",
  "formula-check": "Sheets",
  "team-meeting": "Huddle",
  "priority-call": "Floor",
};

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

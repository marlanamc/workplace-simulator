import type { TaskKey } from "./desktop-content";
import type { Lang } from "./task-types";
import {
  TASK_INFO,
  actForLevel,
  nextTaskInTrack,
  taskKeysForLevel,
  type Level,
  type Track,
} from "./tracks-content";

/** Level title without the "Level N:" prefix — the sitting's name. */
export function sittingTitle(level: Level): string {
  return level.title.replace(/^Level \d+:\s*/, "");
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
  schedule: "Portal",
  timeclock: "Portal",
  paystub: "Portal",
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

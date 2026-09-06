import type { TaskKey } from "./desktop-content";
import type { Lang } from "./task-types";
import { LEVELS, taskKeysForLevel, type Level } from "./tracks-content";
import { dayNumber } from "./shift-spine";

/**
 * The cafe runs in a frozen August 2026 (the 1st is a Saturday). "Today" on
 * Calendar is not the learner's real date — it is which workday of the story
 * they are on. A hardcoded Friday made a brand-new hire look like they had
 * already worked Mon–Thu.
 *
 * Day One is Tuesday. That is the hire date. Shifts before it do not exist.
 */
export const HIRE_DAY = 18;
export const HUDDLE_DAY = 26;

/**
 * Real start times per shift day, not a repeated "Opening" placeholder.
 * Same two shift blocks Portal's own schedule uses (7–3 open, 10–6 mid,
 * 8–4 Saturday), so a learner who has already read their schedule there
 * recognizes the same shape here.
 *
 * Monday the 17th is deliberately absent: they have not started yet.
 */
export const SHIFT_TIMES: Record<number, string> = {
  18: "7:00 AM",
  19: "10:00 AM",
  20: "10:00 AM",
  21: "7:00 AM",
  22: "8:00 AM",
  24: "7:00 AM",
  25: "7:00 AM",
  27: "10:00 AM",
  28: "10:00 AM",
  29: "8:00 AM",
  31: "7:00 AM",
};

/**
 * August day-of-month for "today", keyed by level. Matches each sitting's
 * shiftMoment weekday (Tuesday first shift, Wednesday schedule, Friday
 * payday, Monday sick call). Later sittings keep the Friday the Calendar
 * task was built around, so the huddle-vs-day-off puzzle still reads.
 */
const TODAY_BY_LEVEL: Partial<Record<string, number>> = {
  level0: HIRE_DAY,
  level1: HIRE_DAY,
  level2: 19,
  level3: 21,
  level3a: 21,
  level3a2: 24,
  level3a3: 28,
};

const FALLBACK_TODAY = 21;

export function storyToday(level: Level): number {
  return TODAY_BY_LEVEL[level.key] ?? FALLBACK_TODAY;
}

/** A shift chip only if they have already been hired. */
export function shiftTimeOn(day: number): string | undefined {
  if (day < HIRE_DAY) return undefined;
  return SHIFT_TIMES[day];
}

/** The lead huddle is Act II. A new hire should not see it on day one. */
export function leadHuddleVisible(level: Level): boolean {
  const calendarLevel = LEVELS.find((l) => l.key === "level4");
  if (!calendarLevel) return false;
  return dayNumber(level) >= dayNumber(calendarLevel);
}

/**
 * Inbox / desktop "today" that never rewinds. Later sittings fall back to the
 * 21st for Calendar's huddle puzzle; mail should keep the latest day already
 * reached so Day 3 notes do not look like they arrived this morning on Day 6.
 */
export function inboxToday(level: Level): number {
  const idx = LEVELS.findIndex((l) => l.key === level.key);
  let latest = HIRE_DAY;
  for (let i = 0; i <= Math.max(idx, 0); i++) {
    latest = Math.max(latest, storyToday(LEVELS[i]));
  }
  return latest;
}

/** August day the task's sitting takes place. */
export function sentOnForTask(taskKey: TaskKey): number {
  const level = LEVELS.find((l) => taskKeysForLevel(l, null).includes(taskKey));
  return level ? storyToday(level) : HIRE_DAY;
}

const WEEKDAY_SHORT: Record<Lang, string[]> = {
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  es: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
};

const WEEKDAY_INDEX: Record<string, number> = {
  sun: 0, sunday: 0, dom: 0, domingo: 0,
  mon: 1, monday: 1, lun: 1, lunes: 1,
  tue: 2, tuesday: 2, mar: 2, martes: 2,
  wed: 3, wednesday: 3, mié: 3, mie: 3, miércoles: 3, miercoles: 3,
  thu: 4, thursday: 4, jue: 4, jueves: 4,
  fri: 5, friday: 5, vie: 5, viernes: 5,
  sat: 6, saturday: 6, sáb: 6, sab: 6, sábado: 6, sabado: 6,
};

function augustDate(day: number): Date {
  return new Date(2026, 7, day);
}

export function clockMinutes(time: string): number {
  const clock = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!clock) return 0;
  let hours = Number(clock[1]);
  const minutes = Number(clock[2]);
  const ap = clock[3].toUpperCase();
  if (ap === "PM" && hours !== 12) hours += 12;
  if (ap === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function augustDayFromLabel(time: string, today: number): number {
  const t = time.trim();
  if (/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.test(t)) return today;
  if (/^(yesterday|ayer)$/i.test(t)) return today - 1;
  const monthDay = t.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})$/i);
  if (monthDay) return Number(monthDay[2]);
  const ago = t.match(/^(\d{1,2})\s+ago$/i);
  if (ago) return Number(ago[1]);
  const weekday = WEEKDAY_INDEX[t.toLowerCase().replace(/\.$/, "")];
  if (weekday != null) {
    const todayDow = augustDate(today).getDay();
    const back = (todayDow - weekday + 7) % 7 || 7;
    return today - back;
  }
  return 0;
}

/** Higher = newer. Uses the story day when present, else the authored label. */
export function inboxSortKey(row: { time: string; sentOn?: number }, today: number): number {
  const day = row.sentOn ?? augustDayFromLabel(row.time, today);
  return day * 10_000 + clockMinutes(row.time);
}

/**
 * Gmail-style stamp relative to story today: clock, Yesterday/Ayer, Tue/Mar,
 * or Aug 18 / 18 ago.
 */
export function formatInboxTime(opts: {
  sentOn: number;
  clock: string;
  today: number;
  lang: Lang;
}): string {
  const { sentOn, clock, today, lang } = opts;
  if (sentOn === today) return clock;
  if (sentOn === today - 1) return lang === "en" ? "Yesterday" : "Ayer";
  if (sentOn < today && today - sentOn < 7) {
    return WEEKDAY_SHORT[lang][augustDate(sentOn).getDay()];
  }
  return lang === "en" ? `Aug ${sentOn}` : `${sentOn} ago`;
}

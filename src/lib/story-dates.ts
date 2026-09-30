import type { Lang, Localized } from "./task-types";

/**
 * The story's calendar, as plain data with no imports from the rest of the
 * game, so any task's content file can read it without an import cycle
 * (tracks-content → registry → content → here).
 *
 * A story day is a day count from August 1, 2026 (a Saturday): Aug 18 is 18,
 * Aug 31 is 31, Sep 1 is 32, Oct 1 is 62, Jan 1, 2027 is 154, Apr 12, 2027
 * is 255. Act I keeps its familiar August numbers, and every later sitting is
 * just a bigger number, so "never goes backwards" is plain `<`. The count
 * runs past New Year: every helper below reads the year from the day, never
 * assumes 2026.
 *
 * These dates are editable story fixtures, not a required course duration.
 * Learning sittings need not be consecutive workdays; chapters may span months
 * or years. Retiming must keep related task documents and deadlines consistent.
 * Forward dates alone do not establish believable career progression.
 *
 * Nothing here reads the wall clock. Every function takes the day it is
 * asked about.
 */

/** The year the story starts in. Day 154 and later fall in 2027; read the year from `storyDate(day)`. */
export const STORY_YEAR = 2026;

/** The evening before the first shift: Monday, August 17. */
export const NIGHT_BEFORE = 17;
/** Day One is Tuesday, August 18. That is the hire date. Shifts before it do not exist. */
export const HIRE_DAY = 18;
/**
 * Renata's Weekly Lead Huddle: Wednesday, September 16, the week after the
 * Calendar sitting (Thursday, September 10). The learner is off that day.
 */
export const HUDDLE_DAY = 47;

/**
 * The day each sitting takes place. Act I is Aug 17–28. Act II starts the
 * week after Labor Day. After Act II the routes split, and each route keeps
 * moving forward on its own. Two routes can use the same date, because a
 * learner only walks one of them. `story-dates.test.ts` walks every route
 * and fails if a date repeats or goes backwards.
 */
export const STORY_DAY_BY_LEVEL: Readonly<Record<string, number>> = {
  // Act I: New Hire
  level0: NIGHT_BEFORE, // Mon Aug 17, evening: the tour, just before the first emails
  level1: NIGHT_BEFORE, // Mon Aug 17, evening: The Night Before
  level2: 19, // Wed Aug 19
  level3: 21, // Fri Aug 21
  level3a: 22, // Sat Aug 22
  level3a2: 24, // Mon Aug 24
  level3a3: 28, // Fri Aug 28: first payday
  // Act II: Shift Lead
  level3b: 39, // Tue Sep 8
  level3c: 40, // Wed Sep 9
  level4: 41, // Thu Sep 10: the huddle is next Wednesday
  level5: 45, // Mon Sep 14: Jordan starts
  level6: 49, // Fri Sep 18
  level7: 52, // Mon Sep 21
  level8: 53, // Tue Sep 22
  // Act III and IV: Stay and lead
  level9: 59, // Mon Sep 28
  level10: 63, // Fri Oct 2
  level11: 67, // Tue Oct 6
  level12: 69, // Thu Oct 8
  level13: 73, // Mon Oct 12
  level14: 75, // Wed Oct 14
  level15: 77, // Fri Oct 16
  // Act V: the front desk door (path B). The College door (path A) runs
  // from fall into the spring term: see COLLEGE_STORY_DAY_BY_LEVEL.
  level16: 59, // Mon Sep 28
  level17: 61, // Wed Sep 30
  level18: 62, // Thu Oct 1
  level19: 63, // Fri Oct 2
  // Act VI: Office. Getting hired happens around cafe shifts.
  level19h1: 55, // Thu Sep 24
  level19h2: 56, // Fri Sep 25
  level19h3: 60, // Tue Sep 29
  level19h4: 61, // Wed Sep 30
  level19h5: 62, // Thu Oct 1: the date on the new-hire forms
  level20: 67, // Tue Oct 6: first day at HQ
  level21: 68, // Wed Oct 7
  level22: 69, // Thu Oct 8
  level23: 70, // Fri Oct 9
  // Act VII: Team Lead. About six months at HQ first: the fall, the winter,
  // and the start of spring. Anita offers the role in April, not the week
  // after the slides (see story-pacing.md, "HQ → Team Lead").
  level24: 255, // Mon Apr 12, 2027
  level25: 256, // Tue Apr 13, 2027
  level26: 258, // Thu Apr 15, 2027
  level27: 259, // Fri Apr 16, 2027
};

// --- The college term ----------------------------------------------------------

// Bunker Hill Community College's Spring 2027 term. The Act IV class offer
// (college-offer) and the College door of Act V both use it: you apply and
// arrange aid in the fall, and the class meets in the spring.
/** The last day to register for spring: Friday, December 11, 2026. */
export const SPRING_TERM_REGISTER_BY = storyDayFor(11, 11, 2026);
/** Martin Luther King Jr. Day, Monday, January 18, 2027. No classes. */
export const SPRING_TERM_NO_CLASS_DAY = storyDayFor(0, 18, 2027);
/** The first day of the Spring 2027 term: Tuesday, January 19, 2027. */
export const SPRING_TERM_START = storyDayFor(0, 19, 2027);

/** The Act V door a level is played on: "a" is College, "b" is the front desk. */
export type StoryPath = "a" | "b";

/**
 * The College door (Act V path A) on its own calendar. Applying and aid
 * happen in the fall, before the term; coursework and research happen during
 * the spring term. The front desk door keeps the shared dates above. A level
 * not listed here uses STORY_DAY_BY_LEVEL on both doors.
 */
export const COLLEGE_STORY_DAY_BY_LEVEL: Readonly<Record<string, number>> = {
  level16: 59, // Mon Sep 28, 2026: apply for the Spring 2027 term
  level17: storyDayFor(10, 18, 2026), // Wed Nov 18, 2026: the award letter arrived
  level18: storyDayFor(1, 11, 2027), // Thu Feb 11, 2027: week 4 of the term
  level19: storyDayFor(2, 5, 2027), // Fri Mar 5, 2027: a source for a paper
};

/**
 * The college application deadline for the spring term: Friday, November 6,
 * 2026. Still ahead of the learner on Getting Ready (Sep 28), before the
 * award letter arrives, and well before the term.
 */
export const ENROLLMENT_DEADLINE_DAY = storyDayFor(10, 6, 2026);

/**
 * The award letter's accept-by date: Friday, December 4, 2026. After the
 * letter arrives (The Paperwork, Nov 18), before registration closes
 * (Dec 11) and before the first class (Jan 19, 2027).
 */
export const AID_ACCEPT_BY_DAY = storyDayFor(11, 4, 2026);

/**
 * The story day a level takes place on. Pass the Act V door when you know it:
 * the College door (`"a"`) has its own dates for Act V. Without a door, or on
 * the front desk door, it is the shared date. Throws on a level with no date,
 * so a new level cannot quietly borrow another's.
 */
export function storyDayOf(levelKey: string, path?: StoryPath | null): number {
  if (path === "a" && COLLEGE_STORY_DAY_BY_LEVEL[levelKey] != null) return COLLEGE_STORY_DAY_BY_LEVEL[levelKey];
  const day = STORY_DAY_BY_LEVEL[levelKey];
  if (day == null) throw new Error(`No story date for ${levelKey}. Add it to STORY_DAY_BY_LEVEL.`);
  return day;
}

/**
 * The clock when each sitting opens, so the desktop clock agrees with the
 * scene ("Thursday, 3:40 PM") instead of showing the learner's real time.
 * A task whose shift moment names its own time overrides this (see
 * `storyClockFor` in story-calendar.ts).
 */
export const STORY_CLOCK_BY_LEVEL: Readonly<Record<string, string>> = {
  level0: "5:50 PM",
  level1: "6:20 PM",
  level2: "9:40 AM",
  level3: "8:15 AM",
  level3a: "9:55 AM",
  level3a2: "6:12 AM",
  level3a3: "5:40 PM",
  level3b: "2:25 PM",
  level3c: "7:40 AM",
  level4: "8:40 AM",
  level5: "7:50 AM",
  level6: "3:30 PM",
  level7: "10:30 AM",
  level8: "9:04 AM",
  level9: "8:30 AM",
  level10: "1:30 PM",
  level11: "9:30 AM",
  level12: "3:40 PM",
  level13: "8:45 AM",
  level14: "10:00 AM",
  level15: "10:10 AM",
  level16: "9:00 AM",
  level17: "9:00 AM",
  level18: "9:00 AM",
  level19: "9:00 AM",
  level19h1: "6:30 PM",
  level19h2: "6:30 PM",
  level19h3: "10:00 AM",
  level19h4: "5:15 PM",
  level19h5: "6:30 PM",
  level20: "9:00 AM",
  level21: "10:00 AM",
  level22: "11:00 AM",
  level23: "10:00 AM",
  level24: "9:00 AM",
  level25: "10:00 AM",
  level26: "11:00 AM",
  level27: "3:00 PM",
};

// --- Dates -------------------------------------------------------------------

/** The calendar date of a story day. Day 32 is September 1. */
export function storyDate(day: number): Date {
  return new Date(STORY_YEAR, 7, day);
}

/** 0 = Sunday … 6 = Saturday. */
export function storyWeekday(day: number): number {
  return storyDate(day).getDay();
}

/** The Monday on or before this day. */
export function mondayOf(day: number): number {
  return day - ((storyWeekday(day) + 6) % 7);
}

/** The calendar year of a story day: 2026 until December 31 (day 153), then 2027. */
export function storyYear(day: number): number {
  return storyDate(day).getFullYear();
}

/** The story day for a calendar month (0 = January) and day of the month, in 2026 unless a year is given. */
export function storyDayFor(month: number, date: number, year: number = STORY_YEAR): number {
  const ms = new Date(year, month, date).getTime() - new Date(STORY_YEAR, 7, 0).getTime();
  return Math.round(ms / 86_400_000);
}

const MONTH_SHORT: Record<Lang, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"],
};

const MONTH_LONG: Record<Lang, string[]> = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  es: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
};

export const WEEKDAY_SHORT: Record<Lang, string[]> = {
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  es: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
};

const WEEKDAY_LONG: Record<Lang, string[]> = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
};

/** "Aug 24" / "24 ago". */
export function shortDate(day: number, lang: Lang): string {
  const d = storyDate(day);
  return lang === "en"
    ? `${MONTH_SHORT.en[d.getMonth()]} ${d.getDate()}`
    : `${d.getDate()} ${MONTH_SHORT.es[d.getMonth()]}`;
}

/** "September 16" / "16 de septiembre". */
export function monthDate(day: number, lang: Lang): string {
  const d = storyDate(day);
  return lang === "en"
    ? `${MONTH_LONG.en[d.getMonth()]} ${d.getDate()}`
    : `${d.getDate()} de ${MONTH_LONG.es[d.getMonth()]}`;
}

/** "October 9, 2026" / "9 de octubre de 2026". */
export function yearDate(day: number, lang: Lang): string {
  const year = storyYear(day);
  return lang === "en" ? `${monthDate(day, "en")}, ${year}` : `${monthDate(day, "es")} de ${year}`;
}

/** "Wednesday, September 16" / "miércoles 16 de septiembre". */
export function longDate(day: number, lang: Lang): string {
  return lang === "en"
    ? `${weekdayName(day, "en")}, ${monthDate(day, "en")}`
    : `${weekdayName(day, "es")} ${monthDate(day, "es")}`;
}

/** "Wed, Sep 16" / "Mié., 16 de septiembre" — the style the invite cards use. */
export function cardDate(day: number, lang: Lang): string {
  return lang === "en"
    ? `${WEEKDAY_SHORT.en[storyWeekday(day)]}, ${shortDate(day, "en")}`
    : `${WEEKDAY_SHORT.es[storyWeekday(day)]}., ${monthDate(day, "es")}`;
}

/** "Wednesday" / "miércoles". */
export function weekdayName(day: number, lang: Lang): string {
  return WEEKDAY_LONG[lang][storyWeekday(day)];
}

/** "September 2026" / "Septiembre de 2026". */
export function monthLabel(day: number, lang: Lang): string {
  const m = storyDate(day).getMonth();
  const year = storyYear(day);
  if (lang === "en") return `${MONTH_LONG.en[m]} ${year}`;
  const name = MONTH_LONG.es[m];
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} de ${year}`;
}

/** "Sep 14 – 20, 2026", or "Aug 31 – Sep 6, 2026" across a month. The line a posted schedule leads with. */
export function weekRange(monday: number): string {
  const start = storyDate(monday);
  const end = storyDate(monday + 6);
  const tail = end.getMonth() === start.getMonth() ? `${end.getDate()}` : shortDate(monday + 6, "en");
  const head = start.getFullYear() === end.getFullYear() ? shortDate(monday, "en") : `${shortDate(monday, "en")}, ${start.getFullYear()}`;
  return `${head} – ${tail}, ${end.getFullYear()}`;
}

/** "9/14/2026". */
export function numericDate(day: number): string {
  const d = storyDate(day);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

/** Both languages at once, for a `Localized` field. */
export function localized(fn: (lang: Lang) => string): Localized {
  return { en: fn("en"), es: fn("es") };
}

// --- Shifts ------------------------------------------------------------------

export type ShiftBlock = { start: string; end: string };

/**
 * The cafe's shift blocks. Every task that names a shift reads it from here:
 * open, mid, the Saturday shift, the late shift a swap moves you to, and
 * close. Close is 4–10 PM everywhere.
 */
export const SHIFT_BLOCKS = {
  open: { start: "7:00 AM", end: "3:00 PM" },
  mid: { start: "10:00 AM", end: "6:00 PM" },
  weekend: { start: "8:00 AM", end: "4:00 PM" },
  late: { start: "2:00 PM", end: "10:00 PM" },
  close: { start: "4:00 PM", end: "10:00 PM" },
} as const satisfies Record<string, ShiftBlock>;

export type ShiftKind = keyof typeof SHIFT_BLOCKS;

const { open, mid, weekend, close } = SHIFT_BLOCKS;

/**
 * The learner's own shifts, by story day, as start times. The Calendar,
 * Portal's schedule, the time clock, and the arrival cards all read these.
 *
 * - Act I: Maria's "10 AM tomorrow" first shift, then the week the learner
 *   studies on Day 2 (Aug 24–30).
 * - Act II: the week of the Calendar sitting and the huddle week after it.
 *   Wednesday the 16th is off: that is the whole Calendar puzzle.
 * - Thursday Sep 24 is the close the Day 13 huddle lands on.
 *
 * Monday the 17th is deliberately absent: they have not started yet.
 */
export const SHIFT_TIMES: Record<number, string> = {
  18: mid.start, // Tue Aug 18: first shift, "10 AM" in Maria's email
  19: mid.start,
  21: open.start,
  22: weekend.start,
  24: open.start, // Mon Aug 24: the sick day
  25: open.start,
  27: mid.start,
  28: mid.start,
  29: weekend.start,
  39: mid.start, // Tue Sep 8
  40: open.start,
  41: mid.start,
  42: mid.start,
  43: weekend.start,
  45: open.start, // Mon Sep 14: Jordan starts
  46: open.start,
  48: mid.start, // Thu Sep 17: Renata's huddle moves here
  49: mid.start,
  50: weekend.start,
  52: open.start,
  53: open.start,
  55: close.start, // Thu Sep 24: close
};

/** The block a start time belongs to. */
export function shiftBlockFor(start: string): ShiftBlock | undefined {
  return Object.values(SHIFT_BLOCKS).find((b) => b.start === start);
}

/** "7" from "7:00 AM", "10:30" from "10:30 AM". */
export function hourOnly(time: string): string {
  return time.replace(/:00(?=\s)/, "").replace(/\s*(AM|PM)$/i, "");
}

/** "7 AM" from "7:00 AM". */
export function hourLabel(time: string): string {
  return time.replace(/:00(?=\s)/, "");
}

/** "7:00 AM – 3:00 PM". */
export function shiftRange(block: ShiftBlock): string {
  return `${block.start} – ${block.end}`;
}

/** "7 AM–3 PM". */
export function shiftSpan(block: ShiftBlock): string {
  return `${hourLabel(block.start)}–${hourLabel(block.end)}`;
}

/** "4–10" — the crew sheet's style. */
export function shiftDash(block: ShiftBlock): string {
  return `${hourOnly(block.start)}–${hourOnly(block.end)}`;
}

/** "4–10 PM" when both ends share AM/PM, else "7 AM–3 PM". */
export function shiftDashPeriod(block: ShiftBlock): string {
  const a = block.start.slice(-2);
  const b = block.end.slice(-2);
  return a === b ? `${shiftDash(block)} ${b}` : shiftSpan(block);
}

/**
 * A month view, Sunday first, with the grayed days from the months on either
 * side: each cell's story day, its day of the month, and whether it belongs
 * to another month.
 */
export function monthGrid(day: number): { day: number; date: number; other: boolean }[] {
  const d = storyDate(day);
  const first = day - (d.getDate() - 1);
  const month = d.getMonth();
  let start = first - storyWeekday(first);
  const cells: { day: number; date: number; other: boolean }[] = [];
  for (;;) {
    for (let i = 0; i < 7; i++, start++) {
      const cd = storyDate(start);
      cells.push({ day: start, date: cd.getDate(), other: cd.getMonth() !== month });
    }
    if (storyDate(start).getMonth() !== month) break;
  }
  return cells;
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

/** "9:05 AM" plus some minutes. Wraps at midnight. */
/**
 * When a story clock starts counting: the top of the real minute it was
 * first shown in. Clocks re-render when the real minute changes, so a story
 * minute that turns at that same moment reads the same on every clock, the
 * shelf, the desktop and a phone opened later (Wave 5 F-13).
 */
export function storyEpochFor(nowMs: number): number {
  return nowMs - (nowMs % 60_000);
}

/** The story's time now, `startsAt` plus the whole minutes since `epochMs`. */
export function storyTimeAt(startsAt: string, epochMs: number, nowMs: number): string {
  return addClockMinutes(startsAt, Math.floor((nowMs - epochMs) / 60_000));
}

export function addClockMinutes(time: string, minutes: number): string {
  const total = (((clockMinutes(time) + minutes) % 1440) + 1440) % 1440;
  const h24 = Math.floor(total / 60);
  const m = total % 60;
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h}:${String(m).padStart(2, "0")} ${h24 < 12 ? "AM" : "PM"}`;
}

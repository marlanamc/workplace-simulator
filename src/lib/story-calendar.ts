import { LEVELS, type Level } from "./tracks-content";
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

import type { TaskKey } from "./desktop-content";
import type { Lang } from "./task-types";
import type { CourseRoute } from "./course-route";
import { LEVELS, courseLevels, levelForTrack, taskKeysForLevel, type Level } from "./tracks-content";
import { dayNumber } from "./shift-spine";
import { TASK_LIST } from "./tasks/registry";
import { pathOfTask } from "./bridge-path";
import {
  HIRE_DAY,
  clockMinutes,
  STORY_CLOCK_BY_LEVEL,
  SHIFT_TIMES,
  WEEKDAY_SHORT,
  shortDate,
  storyDate,
  storyDayFor,
  storyDayOf,
  storyYear,
  STORY_YEAR,
  type StoryPath,
} from "./story-dates";

/**
 * The cafe runs on a fixed calendar that starts in August 2026 (Act VII is
 * April 2027). "Today" on Calendar and in Mail is
 * not the learner's real date — it is which sitting of the story they are
 * on. The dates themselves live in `story-dates.ts` (plain data, no game
 * imports), so task content can read them too.
 *
 * Day One is Tuesday, August 18. That is the hire date. Shifts before it do
 * not exist.
 */
export {
  HIRE_DAY,
  addClockMinutes,
  clockMinutes,
  HUDDLE_DAY,
  NIGHT_BEFORE,
  SHIFT_TIMES,
  COLLEGE_STORY_DAY_BY_LEVEL,
  STORY_DAY_BY_LEVEL,
} from "./story-dates";

/**
 * The story day of this sitting. Every level has its own row in
 * `STORY_DAY_BY_LEVEL`; there is no fallback day, because a fallback is how
 * later acts used to land back in the first week. On the College door of
 * Act V (path "a") the sitting has its own date (`COLLEGE_STORY_DAY_BY_LEVEL`).
 */
export function storyToday(level: Level, path?: StoryPath | null): number {
  return storyDayOf(level.key, path);
}

/** The Act V door a track belongs to, or null for a track outside Act V. */
export function pathOfTrack(level: Level, trackKey: string): StoryPath | null {
  if (level.pathTracks?.a === trackKey) return "a";
  if (level.pathTracks?.b === trackKey) return "b";
  return null;
}

/** The story day of the sitting this track is played in, on its own door. */
export function storyTodayForTrack(trackKey: string): number {
  const level = levelForTrack(trackKey);
  return storyToday(level, pathOfTrack(level, trackKey));
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
 * Inbox / desktop "today". Every level has a date and no route ever goes
 * backwards (`story-dates.test.ts`), so this is the sitting's own day.
 */
export function inboxToday(level: Level, path?: StoryPath | null): number {
  return storyToday(level, path);
}

/** Story day the task's sitting takes place: a College task on the College calendar. */
export function sentOnForTask(taskKey: TaskKey): number {
  const level = LEVELS.find((l) => taskKeysForLevel(l, "a").includes(taskKey) || taskKeysForLevel(l, "b").includes(taskKey));
  return level ? storyToday(level, pathOfTask(taskKey)) : HIRE_DAY;
}

const CLOCK_IN_MOMENT = /\b(\d{1,2})(?::(\d{2}))?\s*(AM|PM)\b/i;

/**
 * The time on the desktop clock when this sitting (or this task) starts.
 * A task whose shift moment names a time ("Thursday, 3:40 PM") uses that
 * time; otherwise the sitting's own start.
 */
export function storyClockFor(level: Level, taskKey?: TaskKey | null): string {
  const moment = taskKey ? TASK_LIST.find((d) => d.key === taskKey)?.shiftMoment.en : undefined;
  const hit = moment?.match(CLOCK_IN_MOMENT);
  if (hit) return `${hit[1]}:${hit[2] ?? "00"} ${hit[3].toUpperCase()}`;
  return STORY_CLOCK_BY_LEVEL[level.key] ?? "9:00 AM";
}

const WEEKDAY_INDEX: Record<string, number> = {
  sun: 0, sunday: 0, dom: 0, domingo: 0,
  mon: 1, monday: 1, lun: 1, lunes: 1,
  tue: 2, tuesday: 2, mar: 2, martes: 2,
  wed: 3, wednesday: 3, mié: 3, mie: 3, miércoles: 3, miercoles: 3,
  thu: 4, thursday: 4, jue: 4, jueves: 4,
  fri: 5, friday: 5, vie: 5, viernes: 5,
  sat: 6, saturday: 6, sáb: 6, sab: 6, sábado: 6, sabado: 6,
};

const MONTH_INDEX: Record<string, number> = {
  jan: 0, ene: 0, feb: 1, mar: 2, apr: 3, abr: 3, may: 4, jun: 5, jul: 6,
  aug: 7, ago: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11, dic: 11,
};

/** A dated label ("Aug 18") names a day already past: this year's, or last year's if this year's is still ahead. */
function pastDayFor(month: number, date: number, today: number): number {
  const year = storyYear(today);
  const day = storyDayFor(month, date, year);
  return day > today && year > STORY_YEAR ? storyDayFor(month, date, year - 1) : day;
}

function storyDayFromLabel(time: string, today: number): number {
  const t = time.trim();
  if (/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.test(t)) return today;
  if (/^(yesterday|ayer)$/i.test(t)) return today - 1;
  const monthDay = t.match(/^([a-z]{3,4})\.?\s+(\d{1,2})$/i);
  if (monthDay && MONTH_INDEX[monthDay[1].toLowerCase()] != null) {
    return pastDayFor(MONTH_INDEX[monthDay[1].toLowerCase()], Number(monthDay[2]), today);
  }
  const dayMonth = t.match(/^(\d{1,2})\s+([a-z]{3,4})\.?$/i);
  if (dayMonth && MONTH_INDEX[dayMonth[2].toLowerCase()] != null) {
    return pastDayFor(MONTH_INDEX[dayMonth[2].toLowerCase()], Number(dayMonth[1]), today);
  }
  const weekday = WEEKDAY_INDEX[t.toLowerCase().replace(/\.$/, "")];
  if (weekday != null) {
    const todayDow = storyDate(today).getDay();
    const back = (todayDow - weekday + 7) % 7 || 7;
    return today - back;
  }
  return 0;
}

/** Higher = newer. Uses the story day when present, else the authored label. */
export function inboxSortKey(row: { time: string; sentOn?: number }, today: number): number {
  const day = row.sentOn ?? storyDayFromLabel(row.time, today);
  return day * 10_000 + clockMinutes(row.time);
}

/**
 * Whether a row has arrived yet at this moment of the story: not on a later
 * day, and not later today than `now` when a clock is given. Rows without a
 * `sentOn` are authored for the day they appear on, so they always count.
 */
export function hasArrived(row: { time: string; sentOn?: number }, today: number, now?: string): boolean {
  if (row.sentOn == null) return true;
  if (row.sentOn !== today) return row.sentOn < today;
  if (!now || !/^\d{1,2}:\d{2}\s*(AM|PM)$/i.test(row.time.trim())) return true;
  return clockMinutes(row.time) <= clockMinutes(now);
}

/**
 * Gmail-style stamp relative to story today: clock, Yesterday/Ayer, Tue/Mar,
 * Aug 18 / 18 ago, or, for mail from an earlier year, 10/9/26 / 9/10/26
 * (so an October 2026 mail read in April 2027 does not look like next fall).
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
    return WEEKDAY_SHORT[lang][storyDate(sentOn).getDay()];
  }
  const sent = storyDate(sentOn);
  if (sent.getFullYear() !== storyDate(today).getFullYear()) {
    const yy = String(sent.getFullYear()).slice(-2);
    const m = sent.getMonth() + 1;
    return lang === "en" ? `${m}/${sent.getDate()}/${yy}` : `${sent.getDate()}/${m}/${yy}`;
  }
  return shortDate(sentOn, lang);
}

/**
 * Whether a learner on this route, sitting at `currentLevelKey`, has reached
 * `levelKey` yet. False when that level is not on their route at all.
 */
export function levelReached(route: CourseRoute | null, currentLevelKey: string, levelKey: string): boolean {
  const levels = courseLevels(route);
  const target = levels.findIndex((l) => l.key === levelKey);
  if (target === -1) return false;
  return levels.findIndex((l) => l.key === currentLevelKey) >= target;
}

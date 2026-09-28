import { describe, expect, it } from "vitest";
import { LEVELS, courseLevels, taskKeysForLevel } from "@/lib/tracks-content";
import { COURSE_ROUTES } from "@/lib/course-route";
import { dayNumber } from "@/lib/shift-spine";
import {
  HUDDLE_DAY,
  SHIFT_BLOCKS,
  SHIFT_TIMES,
  STORY_CLOCK_BY_LEVEL,
  STORY_DAY_BY_LEVEL,
  longDate,
  mondayOf,
  monthGrid,
  shortDate,
  storyDate,
  storyDayOf,
  storyWeekday,
  weekRange,
} from "@/lib/story-dates";
import { SHIFT_MOMENT } from "@/lib/story-beats";
import { CREW, CREW_WEEK_SHEET, CREW_WEEK_START, GAP_SHIFT_LABEL } from "@/lib/tasks/crew-week";
import { FORMULA_CHECK_COPY } from "@/lib/tasks/formula-check/content";
import { TEAM_SCHEDULE_COPY } from "@/lib/tasks/team-schedule/content";
import { BUDGET_SHEET_NAME } from "@/lib/tasks/budget-sheet/content";
import { OPS_COPY, REPORT_WEEK, WEEK_DAYS, CALENDAR_EVENT } from "@/lib/tasks/ops-report-packet/content";
import { FILES_WEEK, FILE_PAGES, RENAME_TARGET } from "@/lib/tasks/files/content";
import { COPY_NAME, STATUS_WEEK } from "@/lib/tasks/status-sheet";
import { MEETING, CALENDAR_COPY, EVENT_INTRO as CAL_INTRO, HUDDLE_WEEK_MONDAY } from "@/lib/tasks/calendar/content";
import { SCHEDULE } from "@/lib/tasks/schedule/content";
import { TIMECLOCK } from "@/lib/tasks/timeclock/content";
import { OFFER_LETTER, DATE_CHOICES, CORRECT_DATE_KEY } from "@/lib/tasks/job-offer/content";
import { OFFER_LETTER as CLASS_OFFER, COLLEGE_OFFER_COPY } from "@/lib/tasks/college-offer/content";
import { TRIAGE_COPY } from "@/lib/tasks/triage/content";
import { PRIORITY_COPY } from "@/lib/tasks/priority-call/content";
import { DEADLINE } from "@/lib/tasks/enrollment/content";
import { ACCEPT_BY } from "@/lib/tasks/financial-aid/content";
import { HQ_FILES } from "@/lib/tasks/office-drive/content";
import { PDF_ARRIVES_WITH, PDF_DOCUMENTS } from "@/lib/pdf-content";
import { OPENING_MESSAGES } from "@/lib/tasks/mail/opening";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const routes = [null, ...COURSE_ROUTES];

describe("every sitting has a date on the story calendar", () => {
  it("gives every level its own row, and only real levels have rows", () => {
    for (const level of LEVELS) expect(STORY_DAY_BY_LEVEL[level.key], level.key).toBeTypeOf("number");
    expect(Object.keys(STORY_DAY_BY_LEVEL).sort()).toEqual(LEVELS.map((l) => l.key).sort());
    expect(() => storyDayOf("level99")).toThrow();
  });

  it("gives every level a start time for the desktop clock", () => {
    expect(Object.keys(STORY_CLOCK_BY_LEVEL).sort()).toEqual(LEVELS.map((l) => l.key).sort());
  });

  it.each(routes)("never goes backwards on the %s route, and no two sittings share a day", (route) => {
    // Orientation (the tour) is not a sitting; it happens the same evening as the Night Before.
    const sittings = courseLevels(route).filter((l) => dayNumber(l) > 0);
    for (let i = 1; i < sittings.length; i++) {
      const prev = sittings[i - 1];
      const here = sittings[i];
      expect(
        STORY_DAY_BY_LEVEL[here.key],
        `${here.key} (${shortDate(STORY_DAY_BY_LEVEL[here.key], "en")}) comes after ${prev.key} (${shortDate(STORY_DAY_BY_LEVEL[prev.key], "en")})`,
      ).toBeGreaterThan(STORY_DAY_BY_LEVEL[prev.key]);
    }
  });

  it("lands each sitting on the weekday its shift moment names", () => {
    for (const level of LEVELS) {
      const day = STORY_DAY_BY_LEVEL[level.key];
      const keys = new Set([...taskKeysForLevel(level, "a"), ...taskKeysForLevel(level, "b")]);
      for (const key of keys) {
        const moment = SHIFT_MOMENT[key].en;
        const named = WEEKDAYS.find((w) => moment.includes(w));
        if (!named) continue;
        expect(WEEKDAYS[storyWeekday(day)], `${level.key} ${key}: "${moment}" on ${longDate(day, "en")}`).toBe(named);
      }
    }
  });
});

describe("labels come from the level's date", () => {
  it("names the crew sheet for the week of Scheduling the Team", () => {
    expect(CREW_WEEK_START).toBe(mondayOf(STORY_DAY_BY_LEVEL.level9));
    expect(CREW_WEEK_SHEET.en).toBe(`Crew Week: ${shortDate(CREW_WEEK_START, "en")}`);
    expect(CREW_WEEK_SHEET.en).toBe("Crew Week: Sep 28");
    expect(CREW_WEEK_SHEET.es).toBe("Semana del equipo: 28 sept");
    expect(TEAM_SCHEDULE_COPY.en.sheetName).toBe(CREW_WEEK_SHEET.en);
    expect(FORMULA_CHECK_COPY.en.sheetName).toBe(CREW_WEEK_SHEET.en);
    // Weekly Numbers is the Friday of that same crew week.
    expect(mondayOf(STORY_DAY_BY_LEVEL.level10)).toBe(CREW_WEEK_START);
  });

  it("names the budget for the week of The Budget", () => {
    expect(BUDGET_SHEET_NAME.en).toBe(`Cafe budget: week of ${shortDate(mondayOf(STORY_DAY_BY_LEVEL.level14), "en")}`);
    expect(BUDGET_SHEET_NAME.en).toBe("Cafe budget: week of Oct 12");
  });

  it("names the ops report for the full week before it is sent", () => {
    expect(REPORT_WEEK).toBe(mondayOf(STORY_DAY_BY_LEVEL.level26) - 7);
    expect(OPS_COPY.en.mailSubjectValue).toBe("Weekly report: week of Oct 5");
    expect(OPS_COPY.en.sheetHeader).toBe("Week of Oct 5: daily sales");
    // The calendar strip is next week, Monday first, and the event is its Thursday.
    expect(WEEK_DAYS.map((d) => d.date)).toEqual([19, 20, 21, 22, 23, 24, 25]);
    expect(CALENDAR_EVENT.detailWhen.en).toMatch(/^Thu, Oct 22/);
    expect(WEEK_DAYS.some((d) => d.today)).toBe(false);
  });

  it("names the Files schedule and the status copy for the right weeks", () => {
    expect(FILES_WEEK).toBe(STORY_DAY_BY_LEVEL.level5);
    expect(RENAME_TARGET).toBe("schedule-week-of-sep-14");
    const doc = FILE_PAGES["sched-aug24"].doc;
    expect(doc.kind === "schedule" && doc.week).toBe(`Week of ${weekRange(FILES_WEEK)}`);
    expect(STATUS_WEEK).toBe(mondayOf(STORY_DAY_BY_LEVEL.level7) - 7);
    expect(COPY_NAME).toBe("status-week-of-sep-14");
  });

  it("puts the huddle on a Wednesday the week after the Calendar sitting", () => {
    expect(storyWeekday(HUDDLE_DAY)).toBe(3);
    expect(mondayOf(HUDDLE_DAY)).toBe(mondayOf(STORY_DAY_BY_LEVEL.level4) + 7);
    expect(HUDDLE_WEEK_MONDAY).toBe(STORY_DAY_BY_LEVEL.level5);
    expect(MEETING.when.en).toBe("Wed, Sep 16 · 9:00 AM – 9:30 AM");
    expect(CAL_INTRO.en.body).toContain(longDate(HUDDLE_DAY, "en"));
    expect(CAL_INTRO.es.body).toContain("miércoles 16 de septiembre");
    expect(CALENDAR_COPY.en.monthLabel).toBe("September 2026");
    const grid = monthGrid(HUDDLE_DAY);
    expect(grid.length % 7).toBe(0);
    expect(grid.find((c) => c.day === HUDDLE_DAY)?.date).toBe(16);
  });

  it("puts every hard-coded later-act date after the sitting that shows it", () => {
    // The job starts on the first day at HQ, and the letter says the right weekday.
    const start = STORY_DAY_BY_LEVEL.level20;
    expect(storyDate(start).getMonth()).toBe(9);
    expect(storyDate(start).getDate()).toBe(6);
    expect(OFFER_LETTER.en[1]).toContain("Tuesday, October 6");
    expect(OFFER_LETTER.es[1]).toContain("martes 6 de octubre");
    expect(DATE_CHOICES.find((d) => d.key === CORRECT_DATE_KEY)?.label.en).toBe("Tuesday, October 6");
    for (const choice of DATE_CHOICES) {
      const [weekday] = choice.label.en.split(",");
      expect(WEEKDAYS, choice.label.en).toContain(weekday);
    }
    expect(start).toBeGreaterThan(STORY_DAY_BY_LEVEL.level19h5);
    // The college class starts after the offer, on a Tuesday.
    expect(CLASS_OFFER.en[1]).toContain("starting October 20");
    expect(storyWeekday(STORY_DAY_BY_LEVEL.level13 + 8)).toBe(2);
    // The enrollment deadline is still ahead on Getting Ready, and before the aid accept-by date.
    expect(DEADLINE.en).toBe("October 9, 2026");
    expect(ACCEPT_BY.en).toBe("October 15, 2026");
    // The final Q3 notes are the newest file on day one at HQ.
    const target = HQ_FILES.find((f) => f.isTarget)!;
    expect(target.date).toBe("Oct 2");
  });
});

describe("shift times have one source", () => {
  it("snapshots the learner's own shifts", () => {
    expect(SHIFT_TIMES).toMatchInlineSnapshot(`
      {
        "18": "10:00 AM",
        "19": "10:00 AM",
        "21": "7:00 AM",
        "22": "8:00 AM",
        "24": "7:00 AM",
        "25": "7:00 AM",
        "27": "10:00 AM",
        "28": "10:00 AM",
        "29": "8:00 AM",
        "39": "10:00 AM",
        "40": "7:00 AM",
        "41": "10:00 AM",
        "42": "10:00 AM",
        "43": "8:00 AM",
        "45": "7:00 AM",
        "46": "7:00 AM",
        "48": "10:00 AM",
        "49": "10:00 AM",
        "50": "8:00 AM",
        "52": "7:00 AM",
        "53": "7:00 AM",
        "55": "4:00 PM",
      }
    `);
  });

  it("matches Maria's '10 AM tomorrow' with the first shift and the first punch", () => {
    expect(OPENING_MESSAGES[1].body.en).toContain("10 AM");
    expect(SHIFT_TIMES[18]).toBe(SHIFT_BLOCKS.mid.start);
    expect(TIMECLOCK.recent[0].in).toBe("9:58 AM");
  });

  it("shows the Day 2 schedule and the Day 3 time clock from SHIFT_TIMES", () => {
    const byDate = SCHEDULE.map((d) => [d.dayNum, d.shift]);
    expect(byDate).toEqual([
      ["24", "7:00 AM – 3:00 PM"],
      ["25", "7:00 AM – 3:00 PM"],
      ["26", null],
      ["27", "10:00 AM – 6:00 PM"],
      ["28", "10:00 AM – 6:00 PM"],
      ["29", "8:00 AM – 4:00 PM"],
      ["30", null],
    ]);
    expect(TIMECLOCK.scheduledStart).toBe(SHIFT_TIMES[21]);
  });

  it("calls close 4–10 everywhere", () => {
    expect(GAP_SHIFT_LABEL).toBe("4–10");
    expect(CREW.find((m) => m.key === "jordan")!.shifts.mon.label).toBe("2–10");
    expect(TRIAGE_COPY.en.meetingNote).toContain("close Thursday 4–10");
    expect(PRIORITY_COPY.en.coverNote).toContain("4–10 PM");
    expect(COLLEGE_OFFER_COPY.en.shiftNote).toBe("You already close Tuesday 4:00–10:00 PM.");
    expect(COLLEGE_OFFER_COPY.es.shiftNote).toBe("Ya cierras el martes de 4:00 a 10:00 PM.");
  });
});

describe("files arrive on their story day", () => {
  it("holds the pay stub for payday and the award letter for the college Paperwork day", () => {
    expect(PDF_ARRIVES_WITH["paystub-first"]).toBe("level3a3");
    expect(PDF_ARRIVES_WITH["award-letter-fall-2026"]).toBe("level17");
    const letter = PDF_DOCUMENTS.find((d) => d.id === "award-letter-fall-2026")!;
    expect(letter.date).toBe("Sep 29, 2026");
  });
});

import { describe, expect, it } from "vitest";
import { LEVELS, courseLevels, levelUpCopyFor, taskKeysForLevel } from "@/lib/tracks-content";
import { COURSE_ROUTES, routeBridgePath } from "@/lib/course-route";
import { pathOfTask } from "@/lib/bridge-path";
import { dayNumber } from "@/lib/shift-spine";
import {
  AID_ACCEPT_BY_DAY,
  COLLEGE_STORY_DAY_BY_LEVEL,
  ENROLLMENT_DEADLINE_DAY,
  HUDDLE_DAY,
  SPRING_TERM_REGISTER_BY,
  SPRING_TERM_START,
  SHIFT_BLOCKS,
  SHIFT_TIMES,
  STORY_CLOCK_BY_LEVEL,
  STORY_DAY_BY_LEVEL,
  longDate,
  mondayOf,
  monthLabel,
  numericDate,
  yearDate,
  monthGrid,
  shortDate,
  storyDate,
  storyDayOf,
  storyWeekday,
  storyYear,
  weekRange,
} from "@/lib/story-dates";
import { SHIFT_MOMENT, storyMailAfter } from "@/lib/story-beats";
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
import { OFFER_LETTER as CLASS_OFFER, REGISTER_BY, TERM_START, shiftLabel } from "@/lib/tasks/college-offer/content";
import { TRIAGE_COPY } from "@/lib/tasks/triage/content";
import { PRIORITY_COPY } from "@/lib/tasks/priority-call/content";
import { DEADLINE, ENROLLMENT_COPY } from "@/lib/tasks/enrollment/content";
import { ACCEPT_BY, DATE_CHECK, FINANCIAL_AID_COPY } from "@/lib/tasks/financial-aid/content";
import { sentOnForTask, storyTodayForTrack } from "@/lib/story-calendar";
import type { TaskKey } from "@/lib/desktop-content";
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
    // The College route walks the College door's own dates.
    const path = routeBridgePath(route);
    const sittings = courseLevels(route).filter((l) => dayNumber(l) > 0);
    for (let i = 1; i < sittings.length; i++) {
      const prev = storyDayOf(sittings[i - 1].key, path);
      const here = storyDayOf(sittings[i].key, path);
      expect(
        here,
        `${sittings[i].key} (${yearDate(here, "en")}) comes after ${sittings[i - 1].key} (${yearDate(prev, "en")})`,
      ).toBeGreaterThan(prev);
    }
  });

  it("lands each sitting on the weekday its shift moment names, on each Act V door", () => {
    for (const level of LEVELS) {
      const keys = new Set([...taskKeysForLevel(level, "a"), ...taskKeysForLevel(level, "b")]);
      for (const key of keys) {
        const day = storyDayOf(level.key, pathOfTask(key));
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
    expect(OPS_COPY.en.mailSubjectValue).toBe("Weekly report: week of Apr 5");
    expect(OPS_COPY.en.sheetHeader).toBe("Week of Apr 5: daily sales");
    expect(OPS_COPY.es.sheetHeader).toBe("Semana del 5 de abril: ventas por día");
    // The calendar strip is next week, Monday first, and the event is its Thursday.
    expect(WEEK_DAYS.map((d) => d.date)).toEqual([19, 20, 21, 22, 23, 24, 25]);
    expect(CALENDAR_EVENT.detailWhen.en).toMatch(/^Thu, Apr 22/);
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
    // The college class is a spring class: register in the fall, start in January, on a Tuesday.
    expect(CLASS_OFFER.en.rules[0]).toBe("Register by Friday, December 11, 2026.");
    expect(CLASS_OFFER.es.rules[0]).toContain("viernes 11 de diciembre de 2026");
    expect(REGISTER_BY).toBeGreaterThan(STORY_DAY_BY_LEVEL.level13);
    expect(TERM_START).toBeGreaterThan(REGISTER_BY);
    expect(storyDate(TERM_START).getFullYear()).toBe(2027);
    expect(storyWeekday(TERM_START)).toBe(2);
    // The College door's deadlines: see "the College door runs from fall into the spring term".
    expect(DEADLINE.en).toBe("November 6, 2026");
    expect(ACCEPT_BY.en).toBe("December 4, 2026");
    // The final Q3 notes are the newest file on day one at HQ.
    const target = HQ_FILES.find((f) => f.isTarget)!;
    expect(target.date).toBe("Oct 2");
  });
});

describe("Act VII comes after months at HQ, not the next week", () => {
  const ACT_VII = ["level24", "level25", "level26", "level27"] as const;

  it("starts the Team Lead chapter at least five months after the first day at HQ", () => {
    const hq = storyDate(STORY_DAY_BY_LEVEL.level20);
    const lead = storyDate(STORY_DAY_BY_LEVEL.level24);
    const months = (lead.getFullYear() - hq.getFullYear()) * 12 + (lead.getMonth() - hq.getMonth());
    expect(months).toBeGreaterThanOrEqual(5);
    expect(STORY_DAY_BY_LEVEL.level24 - STORY_DAY_BY_LEVEL.level23).toBeGreaterThanOrEqual(150);
  });

  it("puts Act VII in April 2027 on Mon, Tue, Thu, Fri of one week", () => {
    expect(ACT_VII.map((k) => longDate(STORY_DAY_BY_LEVEL[k], "en"))).toEqual([
      "Monday, April 12",
      "Tuesday, April 13",
      "Thursday, April 15",
      "Friday, April 16",
    ]);
    for (const k of ACT_VII) expect(storyDate(STORY_DAY_BY_LEVEL[k]).getFullYear(), k).toBe(2027);
    expect(new Set(ACT_VII.map((k) => mondayOf(STORY_DAY_BY_LEVEL[k]))).size).toBe(1);
  });

  it("reads the year from the day, across New Year", () => {
    const lead = STORY_DAY_BY_LEVEL.level24;
    expect(yearDate(lead, "en")).toBe("April 12, 2027");
    expect(yearDate(lead, "es")).toBe("12 de abril de 2027");
    expect(monthLabel(lead, "en")).toBe("April 2027");
    expect(monthLabel(lead, "es")).toBe("Abril de 2027");
    expect(numericDate(lead)).toBe("4/12/2027");
    expect(weekRange(mondayOf(lead))).toBe("Apr 12 – 18, 2027");
    // Dec 28, 2026 is day 150; its week ends in 2027.
    expect(weekRange(150)).toBe("Dec 28, 2026 – Jan 3, 2027");
    expect(yearDate(STORY_DAY_BY_LEVEL.level20, "en")).toBe("October 6, 2026");
  });

  it("names no October date in the Act VII documents", () => {
    const text = JSON.stringify([OPS_COPY, WEEK_DAYS, CALENDAR_EVENT]);
    expect(text).not.toMatch(/\bOct\b|October|octubre|2026/);
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
    expect(shiftLabel("close")).toBe("4–10 PM");
  });
});

describe("files arrive on their story day", () => {
  it("holds the pay stub for payday and the award letter for the college Paperwork day", () => {
    expect(PDF_ARRIVES_WITH["paystub-first"]).toBe("level3a3");
    expect(PDF_ARRIVES_WITH["award-letter-spring-2027"]).toBe("level17");
    const letter = PDF_DOCUMENTS.find((d) => d.id === "award-letter-spring-2027")!;
    // The day before the College Paperwork sitting (Wed Nov 18, 2026).
    expect(letter.date).toBe("Nov 17, 2026");
    expect(letter.kind === "award-letter" && letter.term).toBe("Spring 2027");
    expect(letter.kind === "award-letter" && letter.acceptBy).toBe(ACCEPT_BY.en);
  });
});

describe("the College door runs from fall into the spring term", () => {
  const COLLEGE = ["level16", "level17", "level18", "level19"] as const;
  const college = (k: string) => storyDayOf(k, "a");

  it("dates only Act V levels, and leaves the front desk door on the shared dates", () => {
    const actV = LEVELS.filter((l) => l.pathTracks).map((l) => l.key);
    for (const key of Object.keys(COLLEGE_STORY_DAY_BY_LEVEL)) expect(actV, key).toContain(key);
    expect(COLLEGE.map((k) => longDate(storyDayOf(k, "b"), "en"))).toEqual([
      "Monday, September 28",
      "Wednesday, September 30",
      "Thursday, October 1",
      "Friday, October 2",
    ]);
    for (const k of COLLEGE) {
      expect(storyDayOf(k), k).toBe(STORY_DAY_BY_LEVEL[k]);
      expect(storyDayOf(k, null), k).toBe(STORY_DAY_BY_LEVEL[k]);
    }
    // Outside Act V the door changes nothing.
    expect(storyDayOf("level8", "a")).toBe(STORY_DAY_BY_LEVEL.level8);
  });

  it("puts each College sitting on a weekday, fall to spring", () => {
    expect(COLLEGE.map((k) => `${longDate(college(k), "en")}, ${storyDate(college(k)).getFullYear()}`)).toEqual([
      "Monday, September 28, 2026",
      "Wednesday, November 18, 2026",
      "Thursday, February 11, 2027",
      "Friday, March 5, 2027",
    ]);
    for (const day of [...COLLEGE.map(college), ENROLLMENT_DEADLINE_DAY, AID_ACCEPT_BY_DAY, SPRING_TERM_REGISTER_BY, SPRING_TERM_START]) {
      expect(storyWeekday(day)).toBeGreaterThanOrEqual(1);
      expect(storyWeekday(day)).toBeLessThanOrEqual(5);
    }
  });

  it("applies and arranges aid before the term, and does coursework during it", () => {
    // Getting Ready: the deadline is still ahead.
    expect(ENROLLMENT_DEADLINE_DAY).toBeGreaterThan(college("level16"));
    // The award letter comes after the application deadline, and the accept-by after the letter.
    expect(college("level17")).toBeGreaterThan(ENROLLMENT_DEADLINE_DAY);
    expect(AID_ACCEPT_BY_DAY).toBeGreaterThan(college("level17"));
    // Both deadlines are before registration closes and before the first class.
    expect(AID_ACCEPT_BY_DAY).toBeLessThan(SPRING_TERM_REGISTER_BY);
    expect(SPRING_TERM_REGISTER_BY).toBeLessThan(SPRING_TERM_START);
    // Coursework and research happen during the term, a few weeks in.
    expect(college("level18") - SPRING_TERM_START).toBeGreaterThanOrEqual(14);
    expect(college("level19")).toBeGreaterThan(college("level18"));
    expect(storyYear(college("level19"))).toBe(2027);
    // The Act IV class offer uses the same term.
    expect(REGISTER_BY).toBe(SPRING_TERM_REGISTER_BY);
    expect(TERM_START).toBe(SPRING_TERM_START);
  });

  it("dates College mail and the desktop on the College calendar", () => {
    expect(sentOnForTask("enrollment")).toBe(college("level16"));
    expect(sentOnForTask("financial-aid")).toBe(college("level17"));
    expect(sentOnForTask("coursework")).toBe(college("level18"));
    expect(sentOnForTask("research")).toBe(college("level19"));
    // The front desk door keeps its week.
    expect(sentOnForTask("patient-intake")).toBe(STORY_DAY_BY_LEVEL.level17);
    expect(sentOnForTask("confidentiality-call")).toBe(STORY_DAY_BY_LEVEL.level19);
    expect(storyTodayForTrack("coursework")).toBe(college("level18"));
    expect(storyTodayForTrack("billing-sheet")).toBe(STORY_DAY_BY_LEVEL.level18);
    expect(storyTodayForTrack("team-schedule")).toBe(STORY_DAY_BY_LEVEL.level9);
  });

  it("names the spring term on the College documents, not the fall", () => {
    expect(ENROLLMENT_COPY.en.heading).toBe("Spring 2027 application");
    expect(ENROLLMENT_COPY.es.heading).toBe("Solicitud primavera 2027");
    expect(FINANCIAL_AID_COPY.en.letterName).toBe("Award letter: Spring 2027");
    expect(FINANCIAL_AID_COPY.es.letterName).toBe("Carta de ayuda: primavera 2027");
    const aidMail = storyMailAfter("financial-aid")!;
    expect(aidMail.preview.en).toBe("$2,400. Accept by December 4.");
    expect(aidMail.preview.es).toBe("$2,400. Aceptar antes del 4 de diciembre.");
    const text = JSON.stringify([ENROLLMENT_COPY, FINANCIAL_AID_COPY, DATE_CHECK, PDF_DOCUMENTS.find((d) => d.kind === "award-letter"), ["enrollment", "financial-aid", "coursework", "research"].map((k) => storyMailAfter(k as TaskKey))]);
    expect(text).not.toMatch(/October|octubre|Fall 2026|otoño 2026|Wednesday the award|Thursday, coursework|Friday, find/);
  });

  it("tells the learner that time passed, in both languages", () => {
    const at = (key: string) => levelUpCopyFor(LEVELS.find((l) => l.key === key)!, "a")!.body;
    expect(at("level17").en).toMatch(/^It is November/);
    expect(at("level17").es).toMatch(/^Ya es noviembre/);
    expect(at("level18").en).toMatch(/^It is February\. Your spring class started in January\./);
    expect(at("level18").es).toMatch(/^Ya es febrero\. Tu clase de primavera empezó en enero\./);
    expect(at("level19").en).toMatch(/^It is March/);
    expect(at("level19").es).toMatch(/^Ya es marzo/);
    // The front desk door has no jump: it is the same week.
    const desk = (key: string) => levelUpCopyFor(LEVELS.find((l) => l.key === key)!, "b")!.body;
    for (const k of ["level17", "level18", "level19"]) expect(desk(k).en).not.toMatch(/^It is/);
  });
});

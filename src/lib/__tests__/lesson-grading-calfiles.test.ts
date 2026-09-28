import { describe, expect, it } from "vitest";
import {
  checkHuddleReply,
  huddleReplyHint,
  HUDDLE_WEEK_SHIFTS,
  HUDDLE_WEEK_MONDAY,
  STARTERS as CAL_STARTERS,
  HUDDLE_TIMES,
  RIGHT_NOW_STEPS as CAL_STEPS,
} from "@/lib/tasks/calendar/content";
import {
  MESSY_FILES,
  FILE_PAGES,
  RENAME_HINTS,
  CHECK_OTHER_WEEK,
  fileMatchesQuery,
  renameProblem,
  FILES_WEEK,
  RENAME_TARGET,
} from "@/lib/tasks/files/content";
import { STORY_DAY_BY_LEVEL, storyDayFor, weekRange } from "@/lib/story-dates";
import { SHIFT_TIMES, HUDDLE_DAY, clockMinutes } from "@/lib/story-calendar";

describe("calendar: the reply names a day you work and a time", () => {
  const pass = [
    "Could we do Thursday at 10 AM instead?",
    "Could we do Thursday at 2 PM instead?",
    "Sorry, I don't work Wednesday. Can we meet Thursday at 10?",
    "I am off on Wednesday. Thursday 2pm is good for me.",
    "Hi Renata. Wednesday is my day off. Can we do Thursday at 10:00?",
    "thursday 10am",
    "Can we meet Friday at 11 AM?",
    "Tuesday morning?",
    "Sep 17 at 2 PM",
    "the 17th at 2 PM",
    "I can't come Wednesday, how about Thursday at 3?",
    "Not Wednesday. Friday at 1 pm please",
    "thrusday at 10 am ok?",
    "Thursday at 10 AM instead of Wednesday",
    "I'm not free Wednesday but Thursday at 10 works",
    "Monday 8:30 am",
    "Saturday at noon",
    "Thursday at 10 AM", // what a lesson chip inserts
    "¿Podemos el jueves a las 10?",
    "El miércoles no trabajo. ¿Puede ser el jueves a las 2 de la tarde?",
    "el viernes a las 11 de la mañana",
    "no puedo el miercoles, el jueves a las 10 am?",
  ];
  it.each(pass)("passes %j", (text) => {
    expect(checkHuddleReply(text)).toMatchObject({ ok: true });
  });

  const fail: [string, string][] = [
    ["", "empty"],
    ["   ", "empty"],
    ["Yes, see you Wednesday", "dayOff"],
    ["Yes ok see you wed 9am", "dayOff"],
    ["Sí, nos vemos el miércoles", "dayOff"],
    ["Sunday at 10 AM", "dayOff"],
    ["ok I come tuesday", "noTime"],
    ["ok", "noDay"],
    ["Can we do 10 AM?", "noDay"],
    ["I don't work Wednesday.", "noDay"],
    ["Monday at 5 PM", "outsideShift"],
    ["Thursday at 8 AM", "outsideShift"],
    ["Could we meet on ___ at ___?", "blank"],
    ["Hi Renata, I do not work on ___.", "blank"],
  ];
  it.each(fail)("rejects %j as %s", (text, problem) => {
    expect(checkHuddleReply(text)).toMatchObject({ ok: false, problem });
  });

  it("names the problem in the correction, in both languages", () => {
    expect(huddleReplyHint(checkHuddleReply("Yes, see you Wednesday"), "en")).toBe(
      "Wednesday is your day off. Name a day you work, and a time.",
    );
    expect(huddleReplyHint(checkHuddleReply("Sí, nos vemos el miércoles"), "es")).toMatch(/^El miércoles es tu día libre/);
    expect(huddleReplyHint(checkHuddleReply("ok I come tuesday"), "en")).toMatch(/add a time/i);
    expect(huddleReplyHint(checkHuddleReply("Monday at 5 PM"), "en")).toBe(
      "On Monday you work 7 AM to 3 PM. Pick a time in your shift.",
    );
    expect(huddleReplyHint(checkHuddleReply("Monday at 5 PM"), "es")).toMatch(/^Lunes trabajas de 7 AM a 3 PM/);
    expect(huddleReplyHint(checkHuddleReply(""), "en")).toMatch(/write/i);
  });

  it("the grader's week matches the shifts on the calendar", () => {
    // Sep 14 is a Monday; the huddle is Wednesday the 16th.
    for (let weekday = 1; weekday <= 6; weekday++) {
      const time = SHIFT_TIMES[HUDDLE_WEEK_MONDAY - 1 + weekday];
      const shift = HUDDLE_WEEK_SHIFTS[weekday];
      if (!time) expect(shift, `weekday ${weekday}`).toBeNull();
      else expect(shift?.start).toBe(clockMinutes(time) / 60);
    }
    expect(SHIFT_TIMES[HUDDLE_DAY]).toBeUndefined();
  });

  it("starters are frames, so one click plus Send does not pass", () => {
    for (const lang of ["en", "es"] as const) {
      for (const s of CAL_STARTERS[lang]) expect(checkHuddleReply(s).ok, s).toBe(false);
      expect(CAL_STARTERS[lang].join(" ")).not.toMatch(/wednesday|miércoles/i);
    }
  });

  it("every time chip's words pass on their own", () => {
    for (const t of HUDDLE_TIMES) {
      expect(checkHuddleReply(t.words.en).ok).toBe(true);
      expect(checkHuddleReply(t.words.es).ok).toBe(true);
      expect(checkHuddleReply(t.starter.en).ok).toBe(true);
      expect(checkHuddleReply(t.starter.es).ok).toBe(true);
    }
  });

  it("the Job Card asks the learner to look instead of stating the day off", () => {
    expect(CAL_STEPS[1].en).not.toMatch(/do not work|day off/i);
    expect(CAL_STEPS[1].en).toMatch(/\?/);
    expect(CAL_STEPS[1].es).not.toMatch(/no trabajas|día libre/i);
  });
});

describe("files: search finds plain words", () => {
  const found = (q: string) => MESSY_FILES.filter((f) => fileMatchesQuery(f, q)).map((f) => f.key).sort();
  const aug24 = ["sched-aug24", "sched-aug24-copy", "sched-aug24-draft"];
  it.each(["sep 14", "Sep 14", "sep14", "september 14", "sept 14", "week of sep 14", "schedule-week-of-sep-14", "9/14", "14 de septiembre", "semana del 14 de septiembre"])(
    "%j finds this week's schedules",
    (q) => expect(found(q)).toEqual(aug24),
  );
  it("finds by kind, folder, or the old coded name", () => {
    expect(found("schedule")).toHaveLength(5);
    expect(found("horario")).toHaveLength(5);
    expect(found("vacation")).toEqual(["vacation-form"]);
    expect(found("draft")).toEqual(["sched-aug24-draft"]);
    expect(found("91426")).toEqual(aug24);
    expect(found("sched_9")).toHaveLength(5);
    expect(found("zebra")).toEqual([]);
  });
});

describe("files: rename corrections name the problem", () => {
  const old = "sched_91426.pdf";
  it.each([
    ["", "empty"],
    ["   ", "empty"],
    ["sched_91426schedule-week-of-sep-14", "oldName"],
    ["schedule-week-of-sep-14sched_91426", "oldName"],
    ["sched_91426 schedule", "oldName"],
    ["schedule-sep-14", "wrong"],
    ["schedule-week-of-aug-24", "wrong"],
  ])("%j -> %s", (value, problem) => {
    expect(renameProblem(value, old)).toBe(problem);
  });
  it("passes the forgiving forms", () => {
    for (const v of ["schedule-week-of-sep-14", "Schedule Week Of September 14.pdf", "schedule_week_of_sep14", "schedule-week-of-sept-14"]) {
      expect(renameProblem(v, old)).toBeNull();
    }
  });
  it("the old-name correction says to delete it first", () => {
    expect(RENAME_HINTS.oldName.en).toMatch(/Delete the old name first\./);
    expect(RENAME_HINTS.oldName.es).toMatch(/Borra el nombre viejo primero\./);
  });
});

describe("files: the data adds up", () => {
  const TODAY = STORY_DAY_BY_LEVEL.level5; // Monday, Sep 14: Jordan starts today.
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = (d: string) => {
    const m = d.match(/^([A-Z][a-z]{2}) (\d+)/)!;
    return storyDayFor(MONTHS.indexOf(m[1]), Number(m[2]));
  };
  it("nothing is posted after today", () => {
    for (const f of MESSY_FILES) expect(day(f.date), f.key).toBeLessThanOrEqual(TODAY);
  });
  it("schedule name codes match the week on the page (M DD YY)", () => {
    for (const f of MESSY_FILES) {
      const doc = FILE_PAGES[f.key].doc;
      if (doc.kind !== "schedule") continue;
      const code = f.name.match(/sched_(\d)(\d{2})(\d{2})/)!;
      expect(doc.week, f.key).toMatch(new RegExp(`^Week of ${MONTHS[Number(code[1]) - 1]} ${Number(code[2])}\\b`));
      expect(code[3]).toBe("26");
    }
  });
  it("the week Jordan starts is the Monday of the Shared Files sitting", () => {
    const target = FILE_PAGES["sched-aug24"].doc;
    if (target.kind !== "schedule") throw new Error("not a schedule");
    expect(FILES_WEEK).toBe(TODAY);
    expect(target.week).toBe(`Week of ${weekRange(FILES_WEEK)}`);
    expect(RENAME_TARGET).toBe("schedule-week-of-sep-14");
  });
  it("the check-the-week rule mentions drafts and copies", () => {
    expect(CHECK_OTHER_WEEK.en).toMatch(/draft/);
    expect(CHECK_OTHER_WEEK.en).toMatch(/copy/);
    expect(CHECK_OTHER_WEEK.es).toMatch(/borrador/);
  });
});

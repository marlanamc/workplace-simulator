import { describe, expect, it } from "vitest";
import { LEVELS } from "@/lib/tracks-content";
import {
  HIRE_DAY,
  HUDDLE_DAY,
  NIGHT_BEFORE,
  formatInboxTime,
  hasArrived,
  inboxSortKey,
  inboxToday,
  leadHuddleVisible,
  sentOnForTask,
  shiftTimeOn,
  storyClockFor,
  storyToday,
} from "@/lib/story-calendar";

const byKey = (key: string) => LEVELS.find((l) => l.key === key)!;

describe("the cafe calendar follows the story", () => {
  it("puts the Night Before on Monday evening, the day before the Tuesday hire date", () => {
    expect(NIGHT_BEFORE).toBe(17);
    expect(HIRE_DAY).toBe(18);
    expect(storyToday(byKey("level0"))).toBe(NIGHT_BEFORE);
    expect(storyToday(byKey("level1"))).toBe(NIGHT_BEFORE);
  });

  it("moves today forward with the sitting, not the wall clock", () => {
    expect(storyToday(byKey("level2"))).toBe(19);
    expect(storyToday(byKey("level3"))).toBe(21);
    expect(storyToday(byKey("level3a"))).toBe(22);
    expect(storyToday(byKey("level3a2"))).toBe(24);
    expect(storyToday(byKey("level3a3"))).toBe(28);
  });

  it("starts Act II after payday, not back in the first week", () => {
    for (const key of ["level3b", "level3c", "level4", "level5", "level6", "level7", "level8"]) {
      expect(storyToday(byKey(key)), key).toBeGreaterThan(28);
    }
  });

  it("never shows a shift from before they were hired", () => {
    expect(shiftTimeOn(NIGHT_BEFORE)).toBeUndefined();
    // Maria's email the night before: "Your shift tomorrow starts at 10 AM."
    expect(shiftTimeOn(HIRE_DAY)).toBe("10:00 AM");
  });

  it("keeps the lead huddle on a day off, and hides it from a new hire", () => {
    expect(shiftTimeOn(HUDDLE_DAY)).toBeUndefined();
    expect(HUDDLE_DAY).toBeGreaterThan(storyToday(byKey("level4")));
    expect(leadHuddleVisible(byKey("level0"))).toBe(false);
    expect(leadHuddleVisible(byKey("level1"))).toBe(false);
    expect(leadHuddleVisible(byKey("level4"))).toBe(true);
  });
});

describe("inbox stamps follow the sitting", () => {
  const nightBefore = { sentOn: sentOnForTask("mail-reply"), clock: "6:02 PM" };
  const day2 = { sentOn: sentOnForTask("schedule"), clock: "10:04 AM" };
  const day3 = { sentOn: sentOnForTask("timeclock"), clock: "8:22 AM" };

  it("stamps the Night Before's mail as a clock time that evening", () => {
    expect(nightBefore.sentOn).toBe(NIGHT_BEFORE);
    const today = inboxToday(byKey("level1"));
    expect(formatInboxTime({ ...nightBefore, today, lang: "en" })).toBe("6:02 PM");
  });

  it("splits the Night Before and Day 2 mail once it is Day 3", () => {
    const today = inboxToday(byKey("level3"));
    expect(today).toBe(21);
    expect(formatInboxTime({ ...nightBefore, today, lang: "en" })).toBe("Mon");
    expect(formatInboxTime({ ...day2, today, lang: "en" })).toBe("Wed");
    expect(formatInboxTime({ ...day3, today, lang: "en" })).toBe("8:22 AM");
    expect(formatInboxTime({ ...nightBefore, today, lang: "es" })).toBe("Lun");
    expect(formatInboxTime({ ...day2, today, lang: "es" })).toBe("Mié");
  });

  it("ages Day 3 mail off the clock by the sick-call Monday", () => {
    const today = inboxToday(byKey("level3a2"));
    expect(formatInboxTime({ ...day3, today, lang: "en" })).toBe("Fri");
    expect(formatInboxTime({ ...day2, today, lang: "en" })).toBe("Wed");
  });

  it("uses a calendar date once the mail is a week old", () => {
    const today = inboxToday(byKey("level3a3"));
    expect(formatInboxTime({ ...nightBefore, today, lang: "en" })).toBe("Aug 17");
    expect(formatInboxTime({ ...nightBefore, today, lang: "es" })).toBe("17 ago");
  });

  it("stamps a later-act reply with its own month, not Aug 21", () => {
    const sent = sentOnForTask("calendar");
    const today = inboxToday(byKey("level8"));
    expect(formatInboxTime({ sentOn: sent, clock: "9:06 AM", today, lang: "en" })).toBe("Sep 10");
    expect(formatInboxTime({ sentOn: sent, clock: "9:06 AM", today, lang: "es" })).toBe("10 sept");
  });

  it("sorts today's clock time above Wednesday above Tuesday", () => {
    const today = 21;
    const tue = inboxSortKey({ time: "8:22 AM", sentOn: 18 }, today);
    const wed = inboxSortKey({ time: "10:04 AM", sentOn: 19 }, today);
    const fri = inboxSortKey({ time: "8:22 AM", sentOn: 21 }, today);
    expect(fri).toBeGreaterThan(wed);
    expect(wed).toBeGreaterThan(tue);
  });

  it("sorts a September label after an August one", () => {
    expect(inboxSortKey({ time: "Sep 2" }, 45)).toBeGreaterThan(inboxSortKey({ time: "Aug 30" }, 45));
  });

  it("does not rewind inbox today after the first-paycheck sitting", () => {
    expect(inboxToday(byKey("level4"))).toBeGreaterThanOrEqual(inboxToday(byKey("level3a3")));
  });

  it("holds back mail dated after today", () => {
    expect(hasArrived({ time: "9:48 AM", sentOn: 22 }, 19)).toBe(false);
    expect(hasArrived({ time: "9:48 AM", sentOn: 22 }, 22)).toBe(true);
    expect(hasArrived({ time: "7:30 AM", sentOn: 24 }, 24, "6:12 AM")).toBe(false);
    expect(hasArrived({ time: "Yesterday" }, 24)).toBe(true);
  });
});

describe("the desktop clock tells story time", () => {
  it("uses the task's own time when its moment names one", () => {
    expect(storyClockFor(byKey("level12"), "priority-call")).toBe("3:40 PM");
    expect(storyClockFor(byKey("level3"), "timeclock")).toBe("8:15 AM");
    expect(storyClockFor(byKey("level3"), "shift-review")).toBe("6:00 PM");
  });

  it("falls back to the sitting's start, one per level", () => {
    for (const level of LEVELS) expect(storyClockFor(level), level.key).toMatch(/^\d{1,2}:\d{2} (AM|PM)$/);
    expect(storyClockFor(byKey("level3b"))).toBe("2:25 PM"); // ten minutes after the 2:15 PM slip
  });
});

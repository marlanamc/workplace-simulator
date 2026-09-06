import { describe, expect, it } from "vitest";
import { LEVELS } from "@/lib/tracks-content";
import {
  HIRE_DAY,
  HUDDLE_DAY,
  formatInboxTime,
  inboxSortKey,
  inboxToday,
  leadHuddleVisible,
  sentOnForTask,
  shiftTimeOn,
  storyToday,
} from "@/lib/story-calendar";

const byKey = (key: string) => LEVELS.find((l) => l.key === key)!;

describe("the cafe calendar follows the story", () => {
  it("treats Day One Tuesday as the hire date, not a Friday mid-week", () => {
    expect(storyToday(byKey("level0"))).toBe(HIRE_DAY);
    expect(storyToday(byKey("level1"))).toBe(HIRE_DAY);
    expect(HIRE_DAY).toBe(18);
  });

  it("moves today forward with the sitting, not the wall clock", () => {
    expect(storyToday(byKey("level2"))).toBe(19);
    expect(storyToday(byKey("level3"))).toBe(21);
    expect(storyToday(byKey("level3a2"))).toBe(24);
    expect(storyToday(byKey("level3a3"))).toBe(28);
  });

  it("never shows a shift from before they were hired", () => {
    expect(shiftTimeOn(17)).toBeUndefined();
    expect(shiftTimeOn(HIRE_DAY)).toBe("7:00 AM");
  });

  it("keeps the lead huddle on a day off, and hides it from a new hire", () => {
    expect(shiftTimeOn(HUDDLE_DAY)).toBeUndefined();
    expect(leadHuddleVisible(byKey("level0"))).toBe(false);
    expect(leadHuddleVisible(byKey("level1"))).toBe(false);
    expect(leadHuddleVisible(byKey("level4"))).toBe(true);
  });
});

describe("inbox stamps follow the sitting", () => {
  const day1 = { sentOn: sentOnForTask("mail-attach"), clock: "8:22 AM" };
  const day2 = { sentOn: sentOnForTask("schedule"), clock: "10:04 AM" };
  const day3 = { sentOn: sentOnForTask("timeclock"), clock: "8:22 AM" };

  it("keeps Day 1 mail as a clock time on Day 1", () => {
    const today = inboxToday(byKey("level1"));
    expect(formatInboxTime({ ...day1, today, lang: "en" })).toBe("8:22 AM");
  });

  it("splits Day 1 and Day 2 Maria mail once it is Day 3", () => {
    const today = inboxToday(byKey("level3"));
    expect(today).toBe(21);
    expect(formatInboxTime({ ...day1, today, lang: "en" })).toBe("Tue");
    expect(formatInboxTime({ ...day2, today, lang: "en" })).toBe("Wed");
    expect(formatInboxTime({ ...day3, today, lang: "en" })).toBe("8:22 AM");
    expect(formatInboxTime({ ...day1, today, lang: "es" })).toBe("Mar");
    expect(formatInboxTime({ ...day2, today, lang: "es" })).toBe("Mié");
  });

  it("ages Day 3 mail off the clock by the sick-call Monday", () => {
    const today = inboxToday(byKey("level3a2"));
    expect(formatInboxTime({ ...day3, today, lang: "en" })).toBe("Fri");
    expect(formatInboxTime({ ...day1, today, lang: "en" })).toBe("Tue");
  });

  it("uses a calendar date once the mail is a week old", () => {
    const today = inboxToday(byKey("level3a3"));
    expect(formatInboxTime({ ...day1, today, lang: "en" })).toBe("Aug 18");
    expect(formatInboxTime({ ...day1, today, lang: "es" })).toBe("18 ago");
  });

  it("sorts today's clock time above Wednesday above Tuesday", () => {
    const today = 21;
    const tue = inboxSortKey({ time: "8:22 AM", sentOn: 18 }, today);
    const wed = inboxSortKey({ time: "10:04 AM", sentOn: 19 }, today);
    const fri = inboxSortKey({ time: "8:22 AM", sentOn: 21 }, today);
    expect(fri).toBeGreaterThan(wed);
    expect(wed).toBeGreaterThan(tue);
  });

  it("does not rewind inbox today after the first-paycheck sitting", () => {
    expect(inboxToday(byKey("level4"))).toBeGreaterThanOrEqual(inboxToday(byKey("level3a3")));
  });
});

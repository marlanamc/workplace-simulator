import { describe, expect, it } from "vitest";
import { LEVELS } from "@/lib/tracks-content";
import {
  HIRE_DAY,
  HUDDLE_DAY,
  leadHuddleVisible,
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

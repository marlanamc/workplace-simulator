import { describe, expect, it } from "vitest";
import { LEVELS, taskKeysForLevel, TASK_INFO } from "@/lib/tracks-content";
import { SHIFT_MOMENT } from "@/lib/story-beats";
import { dayNumber, dayTitle, dayLabel } from "@/lib/shift-spine";
import { JOB_CARD_COPY } from "@/lib/job-card-content";

/**
 * The story has to hold together for someone reading it once, in order, with
 * no idea how the code is organized. These are the three ways it fell apart
 * before: a counter that reset without saying what it counted, a level number
 * that skipped, and a calendar that ran backwards.
 */

/** Weekday order within a work week, for comparing two story moments. */
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function weekdayOf(moment: string): number {
  const hit = DAYS.findIndex((d) => moment.includes(d));
  return hit;
}

describe("the story calendar", () => {
  it("never runs backwards inside a single day", () => {
    for (const level of LEVELS) {
      const moments = taskKeysForLevel(level).map((k) => ({
        key: k,
        day: weekdayOf(SHIFT_MOMENT[k].en),
        text: SHIFT_MOMENT[k].en,
      }));
      const dated = moments.filter((m) => m.day >= 0);
      for (let i = 1; i < dated.length; i++) {
        expect(
          dated[i].day,
          `${dayTitle(level, "en")}: "${dated[i].text}" (${dated[i].key}) comes after ` +
            `"${dated[i - 1].text}" (${dated[i - 1].key}) but is an earlier weekday`,
        ).toBeGreaterThanOrEqual(dated[i - 1].day);
      }
    }
  });

  it("gives every task a moment in both languages", () => {
    for (const key of Object.keys(TASK_INFO) as (keyof typeof TASK_INFO)[]) {
      expect(SHIFT_MOMENT[key]?.en, `${key} has no English moment`).toBeTruthy();
      expect(SHIFT_MOMENT[key]?.es, `${key} has no Spanish moment`).toBeTruthy();
    }
  });
});

describe("day numbering", () => {
  it("is sequential with no letter suffixes or gaps", () => {
    LEVELS.forEach((level, i) => {
      expect(dayNumber(level)).toBe(i);
    });
  });

  it("never bakes a number into a level title", () => {
    for (const level of LEVELS) {
      expect(
        level.title,
        `"${level.title}" carries its own number — numbering comes from LEVELS order`,
      ).not.toMatch(/^(Level|Day)\s*\d/i);
    }
  });

  it("labels the orientation level by name, not as a day", () => {
    expect(dayTitle(LEVELS[0], "en")).toBe("How this works");
    expect(dayLabel(LEVELS[0], "en")).toBe("How this works");
  });

  it("numbers the first real level Day 1, in both languages", () => {
    expect(dayTitle(LEVELS[1], "en")).toBe("Day 1: Day One");
    expect(dayLabel(LEVELS[1], "es")).toBe("Día 1");
  });
});

describe("the task counter", () => {
  it("says what it is counting when there is more than one task", () => {
    for (const lang of ["en", "es"] as const) {
      expect(JOB_CARD_COPY[lang].jobOf(2, 4)).toMatch(/2/);
      expect(JOB_CARD_COPY[lang].jobOf(2, 4)).toMatch(/4/);
    }
  });

  it("shows nothing at all on a one-task day", () => {
    // "Task 1 of 1" is a counter that communicates nothing; the day's name
    // carries the position instead.
    for (const lang of ["en", "es"] as const) {
      expect(JOB_CARD_COPY[lang].jobOf(1, 1)).toBe("");
    }
  });
});

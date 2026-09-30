import { describe, expect, it } from "vitest";
import { storyEpochFor, storyTimeAt } from "@/lib/story-dates";

/**
 * Wave 5 F-13: every clock in a sitting (shelf, desktop, a phone opened in a
 * task) must read the same story time. They re-render only when the real
 * minute changes, so the story minute must only change then too.
 */
const at = (h: number, m: number, s: number) => new Date(2026, 8, 29, h, m, s).getTime();

describe("story clock", () => {
  it("starts at the scene's time", () => {
    const first = at(10, 0, 40);
    expect(storyTimeAt("9:40 AM", storyEpochFor(first), first)).toBe("9:40 AM");
  });

  it("reads the same at every moment within one real minute, whenever the clock was first shown", () => {
    // First shown 40 s into a minute; the old rule turned the story minute
    // 20 s into the next real minute, between two re-renders, so a phone
    // drawn at 10:01:30 read 9:41 while the shelf (drawn at 10:01:00) read 9:40.
    for (const firstSecond of [0, 1, 20, 40, 59]) {
      const epoch = storyEpochFor(at(10, 0, firstSecond));
      for (let minute = 0; minute < 5; minute++) {
        const times = new Set([0, 15, 30, 45, 59].map((s) => storyTimeAt("9:40 AM", epoch, at(10, minute, s))));
        expect(times.size, `first shown at :${firstSecond}, minute ${minute}`).toBe(1);
      }
    }
  });

  it("moves one story minute per real minute and wraps past noon", () => {
    const epoch = storyEpochFor(at(10, 0, 10));
    expect(storyTimeAt("11:59 AM", epoch, at(10, 1, 0))).toBe("12:00 PM");
    expect(storyTimeAt("9:40 AM", epoch, at(10, 20, 5))).toBe("10:00 AM");
  });
});

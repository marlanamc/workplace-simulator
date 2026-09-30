import { describe, expect, it } from "vitest";
import { levelCardMode } from "@/lib/level-card";
import { DESKTOP_COPY } from "@/lib/desktop-content";
import { LEVELS } from "@/lib/tracks-content";

describe("level card layout (Wave 5 F-6: the stop card on return)", () => {
  it("offers Stop for today first at the end of a sitting, just finished", () => {
    expect(levelCardMode(true, false)).toBe("stop");
  });
  it("welcomes the learner back when the same stop card returns after a sign-in", () => {
    expect(levelCardMode(true, true)).toBe("welcome-back");
  });
  it("leaves every other card continue-first, returning or not", () => {
    expect(levelCardMode(false, false)).toBe("continue");
    expect(levelCardMode(undefined, true)).toBe("continue");
  });
  it("has a welcome back in both languages that never says 'next time you sign in'", () => {
    for (const lang of ["en", "es"] as const) {
      const c = DESKTOP_COPY[lang];
      expect(c.welcomeBackKicker.trim()).not.toBe("");
      expect(c.welcomeBackBody).not.toMatch(/next time|próxima vez/i);
    }
    expect(DESKTOP_COPY.en.welcomeBackBody).not.toBe(DESKTOP_COPY.es.welcomeBackBody);
  });
  it("covers every Act I stop card, each with a continue label", () => {
    const stops = LEVELS.filter((l) => l.levelUp?.stoppingPoint).map((l) => l.key);
    expect(stops).toEqual(expect.arrayContaining(["level2", "level3a", "level3b"]));
    for (const l of LEVELS.filter((l) => l.levelUp?.stoppingPoint)) {
      expect(l.levelUp!.cta.en.trim()).not.toBe("");
      expect(l.levelUp!.cta.es.trim()).not.toBe("");
    }
  });
});

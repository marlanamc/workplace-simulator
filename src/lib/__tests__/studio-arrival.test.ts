import { describe, expect, it } from "vitest";
import { arriveLevelKey } from "@/app/studio/jump-to-preset";
import { arrivalLevelUp, LEVELS } from "@/lib/tracks-content";

describe("Studio day arrival", () => {
  it("parses the level key from a preset", () => {
    expect(arriveLevelKey("level3")).toBe("level3");
    expect(arriveLevelKey("level16:a")).toBe("level16");
    expect(arriveLevelKey("all")).toBeNull();
    expect(arriveLevelKey("core-complete")).toBeNull();
  });

  it("seeds Act I day arrivals, but not Act II+ openers (ActIntro owns those)", () => {
    const payday = LEVELS.find((l) => l.key === "level3")!;
    expect(arrivalLevelUp(payday)?.levelUp?.cta.en).toMatch(/Clock in/i);

    const firstPay = LEVELS.find((l) => l.key === "level3a3")!;
    expect(arrivalLevelUp(firstPay)?.levelUp?.cta.en).toMatch(/stub|recibo/i);

    const act2Open = LEVELS.find((l) => l.key === "level3b")!;
    expect(arrivalLevelUp(act2Open)).toBeNull();
    // Completing First Paycheck still gets a clock-out card via this levelUp;
    // Studio arrival skips it so ActIntro stays the Act II opener.
    expect(act2Open.levelUp?.stoppingPoint).toBe(true);
    expect(act2Open.levelUp?.cta.en).toMatch(/next|sigue/i);
  });
});

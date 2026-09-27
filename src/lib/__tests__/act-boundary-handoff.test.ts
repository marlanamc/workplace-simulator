import { describe, it, expect } from "vitest";
import { ACTS, LEVELS, levelUpCardFor } from "../tracks-content";

/**
 * The handoff at an act boundary, pinned from both sides.
 *
 * Two components decide what a learner sees the moment they finish the last
 * level of an act:
 *
 *   - `LevelUpCelebration` returns null when the level opens a later act and
 *     its `levelUp` is not a `stoppingPoint` — it defers to the act intro.
 *   - `JobCardHost` (DesktopClient) holds `ActIntro` back while a level-up
 *     celebration is pending.
 *
 * If the second condition waits on *any* `levelUp` rather than only the
 * `stoppingPoint` card that actually renders, the two rules cancel out: the
 * celebration draws nothing, the intro stays blocked, and the learner is
 * stranded on a finished desktop with no way forward. That shipped, and it hit
 * five of the six act transitions — everything except Act II, whose opener is a
 * clock-out card. These tests encode the rule so it cannot regress quietly.
 */

/** `LevelUpCelebration` draws nothing for a level with no card to play. */
function celebrationRendersNothing(levelKey: string): boolean {
  const level = LEVELS.find((l) => l.key === levelKey);
  if (!level?.levelUp) return false;
  return levelUpCardFor(level) === null;
}

/** Mirrors the `celebrateLevel` clause of the `ActIntro` gate in `JobCardHost`. */
function introBlockedBy(levelKey: string): boolean {
  const level = LEVELS.find((l) => l.key === levelKey);
  return !!level?.levelUp?.stoppingPoint;
}

describe("act boundary handoff", () => {
  const laterActs = ACTS.filter((a) => a.key !== "act1");

  it("covers every act after the first", () => {
    expect(laterActs.length).toBeGreaterThanOrEqual(6);
  });

  it.each(laterActs.map((a) => [a.key, a.levelKeys[0]!] as const))(
    "%s: something always renders at the boundary into %s",
    (_actKey, openerKey) => {
      // The invariant: the celebration and the intro can never both bow out.
      // One of the two has to put a screen in front of the learner.
      expect(celebrationRendersNothing(openerKey) && introBlockedBy(openerKey)).toBe(false);
    },
  );

  it("still lets a clock-out card hold the intro back", () => {
    // Act II opens on a stoppingPoint card: the day ends, *then* the intro.
    // That ordering is deliberate and must survive the fix above.
    const act2Opener = ACTS.find((a) => a.key === "act2")!.levelKeys[0]!;
    const level = LEVELS.find((l) => l.key === act2Opener)!;
    expect(level.levelUp?.stoppingPoint).toBe(true);
    expect(introBlockedBy(act2Opener)).toBe(true);
    expect(celebrationRendersNothing(act2Opener)).toBe(false);
  });

  it.each(laterActs.map((a) => [a.key, a.levelKeys[0]!] as const))(
    "%s: finishing into %s leaves no celebration pending that nobody can dismiss",
    (_actKey, openerKey) => {
      // Story Mode Audit #3. Progress used to record the opener's level-up
      // even when nothing would draw it. The Job Card hides while one is
      // pending, so "Start Act IV" and "Start Act VII" led to an empty screen
      // until a reload. Whatever is recorded must be a card that renders.
      const opener = LEVELS.find((l) => l.key === openerKey)!;
      const recorded = levelUpCardFor(opener);
      if (recorded) expect(recorded.levelUp?.stoppingPoint).toBe(true);
    },
  );
});

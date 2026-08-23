import { describe, expect, it } from "vitest";
import {
  applyGapDecay,
  recordCleanRun,
  recordMissedRun,
  rungFor,
  type RungMap,
} from "@/lib/release-ladder";

const T0 = "2026-01-01T00:00:00.000Z";
const DAYS = (n: number) => new Date(Date.parse(T0) + n * 24 * 60 * 60 * 1000).toISOString();

describe("release ladder", () => {
  it("climbs 1 → 2 on the first clean run, 2 → 3 after two, 3 → 4 after one", () => {
    let map: RungMap = {};
    map = recordCleanRun(map, "mail", T0);
    expect(rungFor(map, "mail")).toBe(2);

    map = recordCleanRun(map, "mail", T0);
    expect(rungFor(map, "mail")).toBe(2);
    map = recordCleanRun(map, "mail", T0);
    expect(rungFor(map, "mail")).toBe(3);

    map = recordCleanRun(map, "mail", T0);
    expect(rungFor(map, "mail")).toBe(4);
  });

  it("one miss is forgiven; two in a row drop one rung", () => {
    let map: RungMap = {};
    map = recordCleanRun(map, "mail", T0);
    map = recordCleanRun(map, "mail", T0);
    map = recordCleanRun(map, "mail", T0); // rung 3

    map = recordMissedRun(map, "mail", T0);
    expect(rungFor(map, "mail")).toBe(3);
    map = recordMissedRun(map, "mail", T0);
    expect(rungFor(map, "mail")).toBe(2);
  });

  it("a clean run resets the miss streak", () => {
    let map: RungMap = {};
    map = recordCleanRun(map, "mail", T0); // rung 2
    map = recordMissedRun(map, "mail", T0);
    map = recordCleanRun(map, "mail", T0);
    map = recordMissedRun(map, "mail", T0);
    expect(rungFor(map, "mail")).toBe(2);
  });

  it("never drops below rung 1", () => {
    let map: RungMap = {};
    for (let i = 0; i < 6; i++) map = recordMissedRun(map, "mail", T0);
    expect(rungFor(map, "mail")).toBe(1);
  });

  it("decays one rung after a 21-day gap, and returns the same map when nothing changed", () => {
    let map: RungMap = {};
    map = recordCleanRun(map, "mail", T0); // rung 2

    expect(applyGapDecay(map, DAYS(20))).toBe(map); // identity: nothing decayed
    const decayed = applyGapDecay(map, DAYS(21));
    expect(rungFor(decayed, "mail")).toBe(1);
    // Rung 1 never decays further.
    expect(applyGapDecay(decayed, DAYS(100))).toBe(decayed);
  });
});

import { describe, expect, it } from "vitest";
import { FILES, MESSY_FILES, RENAME_TARGET, normalizeRename } from "@/lib/tasks/files/content";
import { LEVELS } from "@/lib/tracks-content";
import { newTabHint, sittingTitle, jobTitle } from "@/lib/shift-spine";

/**
 * The rename step is the heaviest typing ask in the app — these pin down
 * exactly how forgiving it is, so a future tweak never silently starts
 * failing learners over a capital letter or a kept ".pdf".
 */
describe("Files rename forgiveness", () => {
  it.each([
    "schedule-week-of-aug-24",
    "Schedule Week Of Aug 24",
    "  schedule-week-of-aug-24.pdf ",
    "SCHEDULE-WEEK-OF-AUG-24",
    "schedule week of aug 24.pdf",
  ])("accepts %j", (input) => {
    expect(normalizeRename(input)).toBe(RENAME_TARGET);
  });

  it.each(["schedule-aug-24", "schedule-week-of-aug-25", ""])("rejects %j", (input) => {
    expect(normalizeRename(input)).not.toBe(RENAME_TARGET);
  });
});

describe("Files decoys", () => {
  it("exactly one target file, in both normal and messy mode", () => {
    expect(FILES.filter((f) => f.isTarget)).toHaveLength(1);
    expect(MESSY_FILES.filter((f) => f.isTarget)).toHaveLength(1);
  });

  it("every decoy has a bilingual wrong-click hint", () => {
    for (const f of MESSY_FILES) {
      if (f.isTarget) continue;
      expect(f.wrongHint?.en, `${f.key} en hint`).toBeTruthy();
      expect(f.wrongHint?.es, `${f.key} es hint`).toBeTruthy();
    }
  });

  it("messy mode adds decoys, never removes the originals", () => {
    for (const f of FILES) {
      expect(MESSY_FILES.map((m) => m.key)).toContain(f.key);
    }
  });
});

describe("shift-spine naming", () => {
  it("strips 'Level N:' and 'Act X:' prefixes", () => {
    const level1 = LEVELS.find((l) => l.key === "level1")!;
    expect(sittingTitle(level1)).toBe("Day One");
    expect(jobTitle(level1)).toBe("New Hire");
  });

  it("newTabHint names the right bookmark in both languages", () => {
    const level4 = LEVELS.find((l) => l.key === "level4")!;
    expect(newTabHint(level4, "calendar", "en")).toContain("Calendar");
    expect(newTabHint(level4, "calendar", "es")).toContain("Calendar");
    expect(newTabHint(level4, null, "es")).toContain("marcadores");
  });
});

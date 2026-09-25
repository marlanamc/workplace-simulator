import { describe, expect, it } from "vitest";
import { FILES, MESSY_FILES, RENAME_TARGET, normalizeRename } from "@/lib/tasks/files/content";
import { HQ_FILES } from "@/lib/tasks/office-drive/content";
import { LEVELS } from "@/lib/tracks-content";
import { newTabHint, sittingTitle, jobTitle } from "@/lib/shift-spine";
import { followupHasOwnersAndDates } from "@/lib/tasks/meeting-minutes/content";
import { parseMoney } from "@/lib/text-facts";
import { TIP_ROWS, entryMatches, wrongEntryHint } from "@/lib/tasks/spreadsheet/content";
import { codeMatches } from "@/lib/tasks/account-recovery/content";

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
    "schedule_week_of_aug_24",
    "schedule - week - of - aug - 24",
    "schedule-week-of-aug24",
    "schedule-week-of-august-24",
    "schedule-week-of-aug-24.",
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

describe("HQ Drive decoys", () => {
  it("exactly one target file", () => {
    expect(HQ_FILES.filter((f) => f.isTarget)).toHaveLength(1);
  });

  it("every decoy has a bilingual wrong-click hint", () => {
    for (const f of HQ_FILES) {
      if (f.isTarget) continue;
      expect(f.wrongHint?.en, `${f.key} en hint`).toBeTruthy();
      expect(f.wrongHint?.es, `${f.key} es hint`).toBeTruthy();
    }
  });
});

/**
 * The meeting follow-up grader is the one most likely to false-reject a real
 * answer — it looks for an owner and a time. These pin real phrasings that
 * must pass, so a future tightening never starts failing a learner who wrote
 * a perfectly good list.
 */
describe("meeting follow-up forgiveness", () => {
  it.each([
    "Alex — Saturday close by Friday. Jordan runs the huddle Monday. Riley trains Thursday.",
    "Jordan hará el inventario el jueves y Alex llamará al proveedor el lunes por la mañana.",
    "Riley: schedule draft, Wednesday. Sam: supply order, end of day.",
    "I will send the numbers Friday. Alex covers the open Tuesday. Casey closes Saturday.",
  ])("accepts %j", (text) => {
    expect(followupHasOwnersAndDates(text)).toBe(true);
  });

  it.each(["", "thanks everyone, good meeting", "we talked about a few things"])(
    "rejects %j",
    (text) => {
      expect(followupHasOwnersAndDates(text)).toBe(false);
    },
  );
});

describe("shift-spine naming", () => {
  it("names the sitting and the job in both languages", () => {
    const level1 = LEVELS.find((l) => l.key === "level1")!;
    expect(sittingTitle(level1, "en")).toBe("The Night Before");
    expect(sittingTitle(level1, "es")).toBe("La noche anterior");
    expect(jobTitle(level1, "en")).toBe("New Hire");
    expect(jobTitle(level1, "es")).toBe("Personal nuevo");
  });

  it("newTabHint names the right bookmark in both languages", () => {
    const level4 = LEVELS.find((l) => l.key === "level4")!;
    expect(newTabHint(level4, "calendar", "en")).toContain("Calendar");
    expect(newTabHint(level4, "calendar", "es")).toContain("Calendar");
    expect(newTabHint(level4, null, "es")).toContain("marcadores");
  });
});

/**
 * Money a learner copies off a slip. "$42.50" exactly as printed, and a comma
 * for cents, both used to be marked wrong.
 */
describe("money amounts", () => {
  it.each([
    ["$42.50", 42.5],
    ["42.50", 42.5],
    ["42.5", 42.5],
    ["42,50", 42.5],
    ["$ 42.50", 42.5],
    ["38", 38],
    ["1,234.50", 1234.5],
  ])("reads %j as %d", (input, expected) => {
    expect(parseMoney(input)).toBe(expected);
  });

  it.each(["", "abc", "42.5.0", "4.2.5"])("rejects %j", (input) => {
    expect(parseMoney(input)).toBeNull();
  });

  it("a tip entry counts however the amount is written", () => {
    const monday = TIP_ROWS[0];
    for (const typed of ["$42.50", "42.5", "42,50"]) expect(entryMatches(monday, typed)).toBe(true);
    expect(entryMatches(monday, "42.05")).toBe(false);
  });

  it("the correction names the day and the slip's amount", () => {
    expect(wrongEntryHint(TIP_ROWS[3], "en")).toBe("Check Thursday. The slip says $46.75.");
    expect(wrongEntryHint(TIP_ROWS[3], "es")).toContain("jueves");
  });
});

describe("text codes", () => {
  it.each(["482915", "482 915", " 482915 "])("accepts %j", (input) => {
    expect(codeMatches(input)).toBe(true);
  });

  it.each(["482916", "Your verification code is 482915", ""])("rejects %j", (input) => {
    expect(codeMatches(input)).toBe(false);
  });
});

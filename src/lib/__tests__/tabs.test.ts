import { describe, expect, it } from "vitest";
import { TAB_META, TAB_LEVEL_KEYS, bookmarkTabKeys } from "@/lib/tabs";
import { LEVELS, taskKeysBeforeLevel, unlockedLevels } from "@/lib/tracks-content";

const SHEET_TABS = ["spreadsheet", "make-a-copy", "status-report", "team-schedule", "formula-check", "budget-sheet", "billing-sheet", "expense-report"];

function unlockedFor(levelKey: string, path?: "a" | "b" | null) {
  const done = taskKeysBeforeLevel(levelKey, path);
  const keys = new Set(unlockedLevels(done, path).map((l) => l.key));
  keys.add(levelKey);
  return keys;
}

describe("tab registry", () => {
  it("TAB_LEVEL_KEYS is derived from TAB_META", () => {
    expect(Object.keys(TAB_LEVEL_KEYS).sort()).toEqual(TAB_META.map((t) => t.key).sort());
    for (const t of TAB_META) expect(TAB_LEVEL_KEYS[t.key]).toBe(t.levelKey);
  });

  it("every tab's owning level exists", () => {
    const levelKeys = new Set(LEVELS.map((l) => l.key));
    for (const t of TAB_META) {
      expect(levelKeys.has(t.levelKey), `tab "${t.key}" points at unknown level "${t.levelKey}"`).toBe(true);
    }
  });
});

describe("bookmarkTabKeys", () => {
  it("shows exactly one Sheets variant at a time on Sheets days", () => {
    for (const levelKey of ["level6", "level7", "level9", "level10", "level14", "level22"]) {
      const visible = bookmarkTabKeys(levelKey, [], null, { unlockedLevelKeys: unlockedFor(levelKey) });
      const sheets = SHEET_TABS.filter((k) => visible.has(k));
      expect(sheets, `level "${levelKey}"`).toHaveLength(1);
    }
  });

  it("picks the right Sheets variant per level", () => {
    expect(bookmarkTabKeys("level6", [], null, { unlockedLevelKeys: unlockedFor("level6") }).has("spreadsheet")).toBe(true);
    expect(bookmarkTabKeys("level9", [], null, { unlockedLevelKeys: unlockedFor("level9") }).has("team-schedule")).toBe(true);
    expect(bookmarkTabKeys("level10", [], null, { unlockedLevelKeys: unlockedFor("level10") }).has("formula-check")).toBe(true);
    expect(bookmarkTabKeys("level14", [], null, { unlockedLevelKeys: unlockedFor("level14") }).has("budget-sheet")).toBe(true);
    expect(bookmarkTabKeys("level22", [], null, { unlockedLevelKeys: unlockedFor("level22") }).has("expense-report")).toBe(true);
  });

  it("hides Sheets on days that do not use them", () => {
    const day3 = bookmarkTabKeys("level3", [], null, { unlockedLevelKeys: unlockedFor("level3") });
    for (const k of SHEET_TABS) expect(day3.has(k), k).toBe(false);
    const driveDay = bookmarkTabKeys("level5", [], null, { unlockedLevelKeys: unlockedFor("level5") });
    for (const k of SHEET_TABS) expect(driveDay.has(k), k).toBe(false);
  });

  it("swaps level 7 from make-a-copy to status-report once the copy is made", () => {
    const before = unlockedFor("level7");
    expect(bookmarkTabKeys("level7", [], null, { unlockedLevelKeys: before }).has("make-a-copy")).toBe(true);
    expect(bookmarkTabKeys("level7", [], null, { unlockedLevelKeys: before }).has("status-report")).toBe(false);
    const after = bookmarkTabKeys("level7", ["make-a-copy"], null, { unlockedLevelKeys: before });
    expect(after.has("status-report")).toBe(true);
    expect(after.has("make-a-copy")).toBe(false);
  });

  it("gates triage / team-meeting / priority-call / college-offer to their own level", () => {
    expect(bookmarkTabKeys("level8", [], null, { unlockedLevelKeys: unlockedFor("level8") }).has("triage")).toBe(true);
    expect(bookmarkTabKeys("level9", [], null, { unlockedLevelKeys: unlockedFor("level9") }).has("triage")).toBe(false);
    expect(bookmarkTabKeys("level11", [], null, { unlockedLevelKeys: unlockedFor("level11") }).has("team-meeting")).toBe(true);
    expect(bookmarkTabKeys("level12", [], null, { unlockedLevelKeys: unlockedFor("level12") }).has("priority-call")).toBe(true);
    expect(bookmarkTabKeys("level11", [], null, { unlockedLevelKeys: unlockedFor("level11") }).has("priority-call")).toBe(false);
    expect(bookmarkTabKeys("level13", [], null, { unlockedLevelKeys: unlockedFor("level13") }).has("college-offer")).toBe(true);
    expect(bookmarkTabKeys("level14", [], null, { unlockedLevelKeys: unlockedFor("level14") }).has("college-offer")).toBe(false);
  });

  it("keeps Zoom off the learner bookmark bar except on the HQ meeting day", () => {
    for (const level of LEVELS) {
      const expected = level.key === "level21";
      expect(
        bookmarkTabKeys(level.key, [], null, { unlockedLevelKeys: unlockedFor(level.key) }).has("zoom"),
        level.key,
      ).toBe(expected);
    }
  });

  it("gates Act V tools to their path and day", () => {
    expect(bookmarkTabKeys("level16", [], "a", { unlockedLevelKeys: unlockedFor("level16", "a") }).has("college-portal")).toBe(true);
    expect(bookmarkTabKeys("level16", [], "a", { unlockedLevelKeys: unlockedFor("level16", "a") }).has("front-desk")).toBe(false);
    expect(bookmarkTabKeys("level16", [], "b", { unlockedLevelKeys: unlockedFor("level16", "b") }).has("front-desk")).toBe(true);
    expect(bookmarkTabKeys("level16", [], "b", { unlockedLevelKeys: unlockedFor("level16", "b") }).has("college-portal")).toBe(false);

    expect(bookmarkTabKeys("level18", [], "a", { unlockedLevelKeys: unlockedFor("level18", "a") }).has("coursework")).toBe(true);
    expect(bookmarkTabKeys("level18", [], "a", { unlockedLevelKeys: unlockedFor("level18", "a") }).has("billing-sheet")).toBe(false);
    expect(bookmarkTabKeys("level18", [], "b", { unlockedLevelKeys: unlockedFor("level18", "b") }).has("billing-sheet")).toBe(true);
    expect(bookmarkTabKeys("level18", [], "b", { unlockedLevelKeys: unlockedFor("level18", "b") }).has("coursework")).toBe(false);

    expect(bookmarkTabKeys("level19", [], "a", { unlockedLevelKeys: unlockedFor("level19", "a") }).has("library")).toBe(true);
    expect(bookmarkTabKeys("level19", [], "b", { unlockedLevelKeys: unlockedFor("level19", "b") }).has("front-desk")).toBe(true);
    expect(bookmarkTabKeys("level19", [], "a", { unlockedLevelKeys: unlockedFor("level19", "a") }).has("front-desk")).toBe(false);
  });

  it("gates the Act VII tabs to their own level", () => {
    expect(bookmarkTabKeys("level24", [], null, { unlockedLevelKeys: unlockedFor("level24") }).has("meeting-minutes")).toBe(true);
    expect(bookmarkTabKeys("level25", [], null, { unlockedLevelKeys: unlockedFor("level25") }).has("meeting-minutes")).toBe(false);
    expect(bookmarkTabKeys("level25", [], null, { unlockedLevelKeys: unlockedFor("level25") }).has("performance-review")).toBe(true);
    expect(bookmarkTabKeys("level26", [], null, { unlockedLevelKeys: unlockedFor("level26") }).has("performance-review")).toBe(false);
    expect(bookmarkTabKeys("level26", [], null, { unlockedLevelKeys: unlockedFor("level26") }).has("ops-report-packet")).toBe(true);
    expect(bookmarkTabKeys("level27", [], null, { unlockedLevelKeys: unlockedFor("level27") }).has("portfolio-reflection")).toBe(true);
    expect(bookmarkTabKeys("level26", [], null, { unlockedLevelKeys: unlockedFor("level26") }).has("portfolio-reflection")).toBe(false);
  });

  it("on Day 3 only shows apps already unlocked — not Drive, Calendar, or Sheets", () => {
    const visible = bookmarkTabKeys("level3", [], null, { unlockedLevelKeys: unlockedFor("level3") });
    expect(visible.has("tour")).toBe(true);
    expect(visible.has("mail")).toBe(true);
    expect(visible.has("portal")).toBe(true);
    expect(visible.has("files")).toBe(false);
    expect(visible.has("calendar")).toBe(false);
    expect(visible.has("handbook")).toBe(false);
    expect(visible.has("incident")).toBe(false);
    expect(visible.has("account-recovery")).toBe(false);
    for (const k of SHEET_TABS) expect(visible.has(k)).toBe(false);
  });

  it("orientation can surface Mail before Day One (tour walkthrough)", () => {
    const keys = unlockedFor("level0");
    keys.add("level1");
    const visible = bookmarkTabKeys("level0", [], null, { unlockedLevelKeys: keys });
    expect(visible.has("tour")).toBe(true);
    expect(visible.has("mail")).toBe(true);
    expect(visible.has("portal")).toBe(false);
  });

  it("passing unlockedLevelKeys null shows all core apps (escape hatch)", () => {
    const visible = bookmarkTabKeys("level3", [], null, { unlockedLevelKeys: null });
    expect(visible.has("files")).toBe(true);
    expect(visible.has("calendar")).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import { TAB_META, TAB_LEVEL_KEYS, bookmarkTabKeys } from "@/lib/tabs";
import { LEVELS } from "@/lib/tracks-content";

const SHEET_TABS = ["spreadsheet", "make-a-copy", "status-report", "team-schedule", "formula-check", "budget-sheet", "billing-sheet", "expense-report"];

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
  it("shows exactly one Sheets variant at a time", () => {
    for (const levelKey of ["level6", "level7", "level9", "level10", "level14", "level5", "level22"]) {
      const visible = bookmarkTabKeys(levelKey, []);
      const sheets = SHEET_TABS.filter((k) => visible.has(k));
      expect(sheets, `level "${levelKey}"`).toHaveLength(1);
    }
  });

  it("picks the right Sheets variant per level", () => {
    expect(bookmarkTabKeys("level6", []).has("spreadsheet")).toBe(true);
    expect(bookmarkTabKeys("level9", []).has("team-schedule")).toBe(true);
    expect(bookmarkTabKeys("level10", []).has("formula-check")).toBe(true);
    expect(bookmarkTabKeys("level14", []).has("budget-sheet")).toBe(true);
    expect(bookmarkTabKeys("level22", []).has("expense-report")).toBe(true);
    // level5 has no Sheets task — falls back to the plain spreadsheet bookmark.
    expect(bookmarkTabKeys("level5", []).has("spreadsheet")).toBe(true);
  });

  it("swaps level 7 from make-a-copy to status-report once the copy is made", () => {
    expect(bookmarkTabKeys("level7", []).has("make-a-copy")).toBe(true);
    expect(bookmarkTabKeys("level7", []).has("status-report")).toBe(false);
    const after = bookmarkTabKeys("level7", ["make-a-copy"]);
    expect(after.has("status-report")).toBe(true);
    expect(after.has("make-a-copy")).toBe(false);
  });

  it("gates triage / team-meeting / priority-call / college-offer to their own level", () => {
    expect(bookmarkTabKeys("level8", []).has("triage")).toBe(true);
    expect(bookmarkTabKeys("level9", []).has("triage")).toBe(false);
    expect(bookmarkTabKeys("level11", []).has("team-meeting")).toBe(true);
    expect(bookmarkTabKeys("level12", []).has("priority-call")).toBe(true);
    expect(bookmarkTabKeys("level11", []).has("priority-call")).toBe(false);
    expect(bookmarkTabKeys("level13", []).has("college-offer")).toBe(true);
    expect(bookmarkTabKeys("level14", []).has("college-offer")).toBe(false);
  });

  it("keeps Zoom off the learner bookmark bar except on the HQ meeting day", () => {
    for (const level of LEVELS) {
      const expected = level.key === "level21";
      expect(bookmarkTabKeys(level.key, []).has("zoom"), level.key).toBe(expected);
    }
  });

  it("gates Act V tools to their path and day", () => {
    expect(bookmarkTabKeys("level16", [], "a").has("college-portal")).toBe(true);
    expect(bookmarkTabKeys("level16", [], "a").has("front-desk")).toBe(false);
    expect(bookmarkTabKeys("level16", [], "b").has("front-desk")).toBe(true);
    expect(bookmarkTabKeys("level16", [], "b").has("college-portal")).toBe(false);
    expect(bookmarkTabKeys("level16", []).has("college-portal")).toBe(false);
    expect(bookmarkTabKeys("level16", []).has("front-desk")).toBe(false);

    expect(bookmarkTabKeys("level18", [], "a").has("coursework")).toBe(true);
    expect(bookmarkTabKeys("level18", [], "a").has("billing-sheet")).toBe(false);
    expect(bookmarkTabKeys("level18", [], "b").has("billing-sheet")).toBe(true);
    expect(bookmarkTabKeys("level18", [], "b").has("coursework")).toBe(false);

    expect(bookmarkTabKeys("level19", [], "a").has("library")).toBe(true);
    expect(bookmarkTabKeys("level19", [], "b").has("front-desk")).toBe(true);
    expect(bookmarkTabKeys("level19", [], "a").has("front-desk")).toBe(false);
  });

  it("keeps Zoom off the bar on Act V, and on the bar for the HQ meeting", () => {
    expect(bookmarkTabKeys("level16", [], "a").has("zoom")).toBe(false);
    expect(bookmarkTabKeys("level18", [], "b").has("zoom")).toBe(false);
    expect(bookmarkTabKeys("level21", []).has("zoom")).toBe(true);
    expect(bookmarkTabKeys("level20", []).has("zoom")).toBe(false);
    expect(bookmarkTabKeys("level23", []).has("slides")).toBe(true);
    expect(bookmarkTabKeys("level22", []).has("slides")).toBe(false);
    expect(bookmarkTabKeys("level22", []).has("expense-report")).toBe(true);
  });

  it("always shows the un-gated tabs", () => {
    const visible = bookmarkTabKeys("level8", []);
    for (const key of ["mail", "calendar", "files", "handbook", "portal", "tour"]) {
      expect(visible.has(key), key).toBe(true);
    }
  });
});

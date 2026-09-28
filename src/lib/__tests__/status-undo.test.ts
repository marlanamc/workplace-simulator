import { describe, expect, it } from "vitest";
import {
  UNDO_FIRST,
  UNDO_STEPS,
  afterDelete,
  afterUndo,
  cellShows,
  isDeleteKey,
  isUndoShortcut,
} from "@/lib/tasks/status-report/undo";

/** Wave 4, everyday recovery: Day 12's Undo practice in the status report. */
describe("Day 12 Undo practice", () => {
  const key = (k: string, mods: Partial<{ ctrlKey: boolean; metaKey: boolean; shiftKey: boolean }> = {}) => ({
    key: k, ctrlKey: false, metaKey: false, shiftKey: false, ...mods,
  });

  it("clears the selected cell on Delete, only once, only with a cell selected", () => {
    expect(afterDelete("delete", null, "fri")).toEqual({ stage: "undo", cleared: "fri" });
    expect(afterDelete("delete", null, null)).toEqual({ stage: "delete", cleared: null });
    expect(afterDelete("undo", "fri", "mon")).toEqual({ stage: "undo", cleared: "fri" });
    expect(afterDelete("done", null, "fri")).toEqual({ stage: "done", cleared: null });
  });

  it("brings the number back on Undo, and Undo before a delete does nothing", () => {
    expect(afterUndo("undo", "fri")).toEqual({ stage: "done", cleared: null });
    expect(afterUndo("delete", null)).toEqual({ stage: "delete", cleared: null });
    expect(cellShows("fri", "fri")).toBe("");
    expect(cellShows("fri", null)).toBe("15");
    expect(cellShows("mon", "fri")).toBe("12");
  });

  it("reads Delete, Backspace, Ctrl+Z and Cmd+Z, but not Redo", () => {
    expect(isDeleteKey("Delete")).toBe(true);
    expect(isDeleteKey("Backspace")).toBe(true);
    expect(isDeleteKey("d")).toBe(false);
    expect(isUndoShortcut(key("z", { ctrlKey: true }))).toBe(true);
    expect(isUndoShortcut(key("Z", { metaKey: true }))).toBe(true);
    expect(isUndoShortcut(key("z", { ctrlKey: true, shiftKey: true }))).toBe(false);
    expect(isUndoShortcut(key("z"))).toBe(false);
  });

  it("has its lines in both languages", () => {
    for (const line of [UNDO_STEPS.delete, UNDO_STEPS.undo, UNDO_FIRST]) {
      expect(line.en).not.toBe(line.es);
      expect(line.es.trim()).not.toBe("");
    }
  });
});

import { describe, expect, it } from "vitest";
import {
  COMMENT_CORRECTIONS,
  COMMENT_STEPS,
  HEADING_AFTER,
  HEADING_BEFORE,
  HEADING_CELL,
  RENATA_REPLY,
  commentProblem,
} from "@/lib/tasks/make-a-copy/comment";
import { COPY_NAME } from "@/lib/tasks/status-sheet";

/** Wave 4, communication beyond email: Day 12's comment on Renata's template. */
describe("Day 12 template comment", () => {
  it.each([
    "Should this say Sep 14?",
    "wrong date",
    "is this last week?",
    "Sep 7 or 14?",
    "¿La fecha es correcta?",
    "creo que es otra semana",
  ])("passes a short, specific comment on C1: %s", (text) => {
    expect(commentProblem(HEADING_CELL, text)).toBeNull();
  });

  it("names what is missing", () => {
    expect(commentProblem(HEADING_CELL, "   ")).toBe("empty");
    expect(commentProblem("B2", "wrong date")).toBe("wrong-cell");
    expect(commentProblem(null, "wrong date")).toBe("wrong-cell");
    expect(commentProblem(HEADING_CELL, "ok")).toBe("vague");
  });

  it("fixes the heading to the copy's own week", () => {
    expect(HEADING_BEFORE).not.toBe(HEADING_AFTER);
    expect(COPY_NAME).toContain(HEADING_AFTER.replace("Week of ", "").toLowerCase().replace(" ", "-"));
  });

  it("has every line in both languages", () => {
    for (const line of [COMMENT_STEPS.select, COMMENT_STEPS.write, RENATA_REPLY, ...Object.values(COMMENT_CORRECTIONS)]) {
      expect(line.en).not.toBe(line.es);
      expect(line.es.trim()).not.toBe("");
    }
  });
});

import { describe, expect, it } from "vitest";
import { shiftSummaryIsComplete, STARTERS } from "@/lib/tasks/shift-review/content";

describe("end-of-shift note", () => {
  it("accepts a note that restates the planted facts", () => {
    expect(
      shiftSummaryIsComplete(
        "Hi Maria,\nToday's shift ran smoothly. It got a little busy around 11 AM.",
      ),
    ).toBe(true);
    expect(
      shiftSummaryIsComplete(
        "Hola Maria,\nEl turno de hoy salió bien. Se puso un poco ocupado alrededor de las 11 AM.",
      ),
    ).toBe(true);
  });

  it("rejects notes that skip a planted fact", () => {
    expect(shiftSummaryIsComplete("ok")).toBe(false);
    expect(shiftSummaryIsComplete("The shift ran smoothly today with no issues at all.")).toBe(false);
    expect(shiftSummaryIsComplete("It got busy around 11 AM and that was it.")).toBe(false);
  });

  it("has bilingual starters that name the facts", () => {
    expect(STARTERS.en.join(" ")).toMatch(/smoothly|busy|11/i);
    expect(STARTERS.es.join(" ")).toMatch(/bien|ocupado|11/i);
    expect(STARTERS.es.length).toBe(STARTERS.en.length);
  });
});

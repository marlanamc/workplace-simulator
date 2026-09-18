import { describe, expect, it } from "vitest";
import { shiftSummaryIsComplete, STARTERS } from "@/lib/tasks/shift-review/content";

describe("end-of-shift note", () => {
  it("accepts a substantive note that mentions 11 in either language", () => {
    expect(
      shiftSummaryIsComplete(
        "Hi Maria,\nAt 11 AM I checked on the front counter before I left. Thanks.",
        "en",
      ),
    ).toBe(true);
    expect(
      shiftSummaryIsComplete(
        "Hola Maria,\nA las once revisé el mostrador antes de salir. Gracias.",
        "es",
      ),
    ).toBe(true);
  });

  it("accepts a short note that does exactly what the card asked", () => {
    // The instruction is "write a short shift summary, mention 11 AM". These
    // do that. A 28-character floor nothing on screen mentioned used to reject
    // them, and a learner working alone cannot argue with a wrong no.
    expect(shiftSummaryIsComplete("Busy at 11 am.", "en")).toBe(true);
    expect(shiftSummaryIsComplete("Ocupado a las 11.", "es")).toBe(true);
    expect(shiftSummaryIsComplete("Rush around eleven.", "en")).toBe(true);
  });

  it("rejects notes that omit the 11 AM moment", () => {
    expect(shiftSummaryIsComplete("ok", "en")).toBe(false);
    expect(shiftSummaryIsComplete("The shift ran smoothly today with no issues at all.", "en")).toBe(false);
    expect(shiftSummaryIsComplete("El turno salió bien y no hubo nada más que reportar hoy.", "es")).toBe(false);
  });

  it("does not let the English word 'once' stand in for eleven", () => {
    // `once` is Spanish for eleven, so it was in the shared pattern — and it
    // let an English note pass without naming the hour at all.
    expect(shiftSummaryIsComplete("It got busy once around lunch today.", "en")).toBe(false);
    expect(shiftSummaryIsComplete("Se puso ocupado a las once hoy.", "es")).toBe(true);
  });

  it("needs a real sentence, not a bare number", () => {
    expect(shiftSummaryIsComplete("11", "en")).toBe(false);
    expect(shiftSummaryIsComplete("11 am", "en")).toBe(false);
  });

  it("has bilingual starters that mention 11", () => {
    expect(STARTERS.en.join(" ")).toMatch(/11/i);
    expect(STARTERS.es.join(" ")).toMatch(/11/i);
    expect(STARTERS.es.length).toBe(STARTERS.en.length);
  });
});

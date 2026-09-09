import { describe, expect, it } from "vitest";
import { shiftSummaryIsComplete, STARTERS } from "@/lib/tasks/shift-review/content";

describe("end-of-shift note", () => {
  it("accepts a substantive note that mentions 11 in either language", () => {
    expect(
      shiftSummaryIsComplete(
        "Hi Maria,\nAt 11 AM I checked on the front counter before I left. Thanks.",
      ),
    ).toBe(true);
    expect(
      shiftSummaryIsComplete(
        "Hola Maria,\nA las once revisé el mostrador antes de salir. Gracias.",
      ),
    ).toBe(true);
  });

  it("rejects notes that omit the 11 AM moment", () => {
    expect(shiftSummaryIsComplete("ok")).toBe(false);
    expect(shiftSummaryIsComplete("The shift ran smoothly today with no issues at all.")).toBe(false);
    expect(shiftSummaryIsComplete("El turno salió bien y no hubo nada más que reportar hoy.")).toBe(false);
  });

  it("has bilingual starters that mention 11", () => {
    expect(STARTERS.en.join(" ")).toMatch(/11/i);
    expect(STARTERS.es.join(" ")).toMatch(/11/i);
    expect(STARTERS.es.length).toBe(STARTERS.en.length);
  });
});

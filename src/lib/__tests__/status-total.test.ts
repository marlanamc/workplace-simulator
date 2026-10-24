import { describe, expect, it } from "vitest";
import { STATUS_TOTAL, isValidSumFormula, totalCellShows, totalProblem } from "@/lib/tasks/status-sheet";

/** Story Mode Audit #7: typing the right total by hand showed "#ERROR?". */
describe("the Day 12 total cell", () => {
  it.each(["=SUMA(B2:B6)", " = suma ( b6 : b2 ) ", "=SUM($B$2:$B$6)", "=SUMA(B1:B6)"])("accepts complete bilingual ranges: %s", (formula) => {
    expect(isValidSumFormula(formula)).toBe(true);
    expect(totalCellShows(formula)).toBe(String(STATUS_TOTAL));
    expect(totalProblem(formula)).toBeNull();
  });
  it.each(["=SUM(B2:B7)", "=SUMA(B7:B2)", "=SUM(B0:B6)", "=SUM(B2:B100)", "=SUM(B3:B6)", "=SUM(C2:C6)"])("rejects circular, invalid, and incomplete ranges: %s", (formula) => {
    expect(isValidSumFormula(formula)).toBe(false);
    expect(totalProblem(formula)).toBe("formula");
  });
  it("shows what real Sheets would", () => {
    expect(totalCellShows("=SUM(B2:B6)")).toBe(String(STATUS_TOTAL));
    expect(totalCellShows(String(STATUS_TOTAL))).toBe(String(STATUS_TOTAL));
    expect(totalCellShows(" 60 ")).toBe("60");
    expect(totalCellShows("total")).toBe("total");
    expect(totalCellShows("=SUM(B2")).toBe("#ERROR!");
    expect(totalCellShows("")).toBe("");
  });

  it("tells a right number typed by hand apart from a wrong one", () => {
    expect(totalProblem("=sum(b2:b6)")).toBeNull();
    expect(totalProblem(String(STATUS_TOTAL))).toBe("rightNumber");
    expect(totalProblem("60")).toBe("number");
    expect(totalProblem("=SUM(B2:B5)")).toBe("formula");
    expect(totalProblem("")).toBe("formula");
  });
});

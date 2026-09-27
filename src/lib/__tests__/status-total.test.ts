import { describe, expect, it } from "vitest";
import { STATUS_TOTAL, totalCellShows, totalProblem } from "@/lib/tasks/status-sheet";

/** Story Mode Audit #7: typing the right total by hand showed "#ERROR?". */
describe("the Day 12 total cell", () => {
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

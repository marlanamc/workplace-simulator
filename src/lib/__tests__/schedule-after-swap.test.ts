import { describe, expect, it } from "vitest";
import { SCHEDULE, SWAP_OPTIONS, scheduleAfterSwap } from "@/lib/tasks/schedule/content";

// Phase 3 F-9: after Day 2 the Portal's Schedule tab shows the week as it is
// once the swap is filed, not Day 2's finished screen.
describe("scheduleAfterSwap", () => {
  const after = scheduleAfterSwap();

  it("moves Thursday to the late shift, the one swap that clears the doctor", () => {
    const thu = after.find((d) => d.key === "thu")!;
    expect(thu.shift).toBe("2:00 PM – 10:00 PM");
    expect(SWAP_OPTIONS.find((o) => o.works)!.label.en).toContain(thu.shift!);
  });

  it("leaves nothing clashing, so there is no swap left to ask for", () => {
    expect(after.some((d) => d.conflict)).toBe(false);
  });

  it("keeps every other day exactly as posted", () => {
    expect(after.filter((d) => d.key !== "thu")).toEqual(SCHEDULE.filter((d) => d.key !== "thu"));
  });

  it("does not change the posted schedule the Day 2 task reads", () => {
    expect(SCHEDULE.find((d) => d.key === "thu")!.conflict).toBe(true);
    expect(SCHEDULE.find((d) => d.key === "thu")!.shift).not.toBe("2:00 PM – 10:00 PM");
  });
});

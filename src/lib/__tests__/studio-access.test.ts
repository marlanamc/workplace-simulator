import { describe, expect, it } from "vitest";
import { canUseStudio, studioClassCodes } from "@/lib/studio-access";

const learner = (classCode: string) => ({ role: "learner", classCode });

describe("canUseStudio", () => {
  const defaults = studioClassCodes(undefined);

  it("lets teachers in whatever their class code", () => {
    expect(canUseStudio({ role: "teacher", classCode: "HARBOR-27" }, defaults)).toBe(true);
  });

  it("keeps a learner in a real class out", () => {
    expect(canUseStudio(learner("HARBOR-27"), defaults)).toBe(false);
  });

  it("keeps a signed-out or unknown account out", () => {
    expect(canUseStudio(null, defaults)).toBe(false);
    expect(canUseStudio(undefined, defaults)).toBe(false);
  });

  it("lets the e2e suite's codes in by default, matching case-insensitively", () => {
    expect(canUseStudio(learner("TEST-E2E"), defaults)).toBe(true);
    expect(canUseStudio(learner("test-e2e"), defaults)).toBe(true);
    expect(canUseStudio(learner("E2E-REVIEW-123456"), defaults)).toBe(true);
  });

  it("reads a configured list, with * as a prefix match", () => {
    const allowed = studioClassCodes(" staff-demo , DESIGN-* ");
    expect(canUseStudio(learner("STAFF-DEMO"), allowed)).toBe(true);
    expect(canUseStudio(learner("design-marlie"), allowed)).toBe(true);
    expect(canUseStudio(learner("TEST-E2E"), allowed)).toBe(false);
    expect(canUseStudio(learner("STAFF-DEMO-2"), allowed)).toBe(false);
  });

  it("does not let a bare * or empty entries open Studio to everyone by accident", () => {
    expect(studioClassCodes(",, ,")).toEqual([]);
    expect(canUseStudio(learner("HARBOR-27"), studioClassCodes("*"))).toBe(false);
    expect(canUseStudio(learner("HARBOR-27"), studioClassCodes(",,"))).toBe(false);
  });
});

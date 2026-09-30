import { describe, expect, it } from "vitest";
import { NEW_HIRE_COPY, shouldShowNewHire } from "@/lib/new-hire-content";
import { CAST } from "@/lib/cast";

describe("shouldShowNewHire", () => {
  const base = {
    storyFlags: {},
    completedTaskKeys: ["tour"],
    levelKey: "level1",
    celebratingLevel: false,
  };

  it("shows once the tour is done, on Level 1, once Level 0's celebration is dismissed", () => {
    expect(shouldShowNewHire(base)).toBe(true);
  });

  it("waits for the tour and for Level 0's celebration to clear first", () => {
    expect(shouldShowNewHire({ ...base, completedTaskKeys: [] })).toBe(false);
    expect(shouldShowNewHire({ ...base, celebratingLevel: true })).toBe(false);
  });

  it("never shows again once seen, and never shows past Level 1", () => {
    expect(shouldShowNewHire({ ...base, storyFlags: { "new-hire-seen": "true" } })).toBe(false);
    expect(shouldShowNewHire({ ...base, levelKey: "level2" })).toBe(false);
  });
});

describe("NEW_HIRE_COPY", () => {
  it("names Maria as manager and Darnell as coworker, in both languages", () => {
    for (const lang of ["en", "es"] as const) {
      expect(NEW_HIRE_COPY.managerLine[lang]).toContain(CAST.maria.name);
      expect(NEW_HIRE_COPY.coworkerLine[lang]).toContain(CAST.darnell.name);
      expect(NEW_HIRE_COPY.title[lang]).toBeTruthy();
      expect(NEW_HIRE_COPY.start[lang]).toBeTruthy();
    }
  });
});

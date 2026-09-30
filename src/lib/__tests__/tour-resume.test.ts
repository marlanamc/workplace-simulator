import { describe, expect, it } from "vitest";
import { TOUR_STEPS } from "@/lib/tasks/tour/content";
import { INTRO_BEATS } from "@/lib/job-card-content";
import { readDraft } from "@/lib/task-draft";
import { savedIntroBeat, savedMovePracticeStage, savedPracticeStage, savedTourStep, tourResumeTab } from "@/lib/tour-resume";

/** Wave 5 F-7: a reload mid-tour keeps the learner's place. */

describe("savedIntroBeat", () => {
  it("keeps a stored beat and clamps anything past the end to 'through them'", () => {
    expect(savedIntroBeat(0, INTRO_BEATS.length)).toBe(0);
    expect(savedIntroBeat(INTRO_BEATS.length, INTRO_BEATS.length)).toBe(INTRO_BEATS.length);
    expect(savedIntroBeat(99, INTRO_BEATS.length)).toBe(INTRO_BEATS.length);
  });

  it("starts at the welcome beat for anything that is not a beat", () => {
    for (const bad of [-1, 0.5, NaN, "1", null, undefined, true]) expect(savedIntroBeat(bad, 1)).toBe(0);
  });
});

describe("savedPracticeStage", () => {
  it("keeps each real stage", () => {
    for (const stage of ["inactive", "click", "scroll", "complete"]) expect(savedPracticeStage(stage)).toBe(stage);
  });

  it("falls back to inactive for an unknown stage", () => {
    for (const bad of ["Click", "done", "", null, 2, undefined]) expect(savedPracticeStage(bad)).toBe("inactive");
  });
});

describe("savedMovePracticeStage", () => {
  it("keeps each real stage of the sibling move/hide practice", () => {
    for (const stage of ["inactive", "move", "collapse", "complete"]) expect(savedMovePracticeStage(stage)).toBe(stage);
  });

  it("falls back to inactive for an unknown stage", () => {
    for (const bad of ["Move", "click", "", null, 2, undefined]) expect(savedMovePracticeStage(bad)).toBe("inactive");
  });
});

describe("savedTourStep", () => {
  const count = TOUR_STEPS.en.length;
  it("keeps every step that exists", () => {
    for (let i = 0; i < count; i++) expect(savedTourStep(i, count)).toBe(i);
  });

  it("drops a step that no longer exists or is not a step", () => {
    for (const bad of [count, -1, 1.5, "1", null, undefined]) expect(savedTourStep(bad, count)).toBeNull();
  });

  it("reads back through the draft format the hook stores", () => {
    expect(readDraft<number | null>(JSON.stringify({ value: 2 }), null)).toBe(2);
    expect(readDraft<number | null>(JSON.stringify({ value: null }), null)).toBeNull();
    expect(readDraft<number | null>("not json", null)).toBeNull();
  });
});

describe("tourResumeTab", () => {
  for (const lang of ["en", "es"] as const) {
    const steps = TOUR_STEPS[lang];
    const clickMail = steps.findIndex((s) => s.targetTabKey === "mail" && !s.targetTestId);

    it(`stays on Welcome until Mail has been clicked (${lang})`, () => {
      expect(clickMail).toBeGreaterThan(0);
      for (let i = 0; i <= clickMail; i++) expect(tourResumeTab(steps, i)).toBeNull();
    });

    it(`brings Mail back for every step after "Click Mail" (${lang})`, () => {
      for (let i = clickMail + 1; i < steps.length; i++) expect(tourResumeTab(steps, i)).toBe("mail");
    });
  }

  it("ignores an index past the end", () => {
    expect(tourResumeTab(TOUR_STEPS.en, 99)).toBe("mail");
    expect(tourResumeTab([], 3)).toBeNull();
  });
});

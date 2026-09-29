import { describe, expect, it } from "vitest";
import { ownsFinish } from "@/lib/job-card-finish";

describe("ownsFinish (Wave 5 F-9, F-22: only the owning task says Done)", () => {
  it("believes the job the learner just completed", () => {
    expect(ownsFinish({ reported: "schedule", justFinished: "schedule", inLesson: false })).toBe(true);
  });

  it("ignores Day 2's swap when the Portal is opened on Day 4", () => {
    // Same session: Day 3's shift notes were the last job finished.
    expect(ownsFinish({ reported: "schedule", justFinished: "shift-review", inLesson: false })).toBe(false);
  });

  it("ignores Day 5's sick call when Mail is opened on Day 6", () => {
    expect(ownsFinish({ reported: "call-out-sick", justFinished: null, inLesson: false })).toBe(false);
  });

  it("ignores even the job just finished once the learner has gone back to the desktop", () => {
    // The card clears `justFinished` on the desktop, so a reopened done
    // screen for that same job reports into null.
    expect(ownsFinish({ reported: "shift-review", justFinished: null, inLesson: false })).toBe(false);
  });

  it("ignores every finish after a fresh sign-in or reload, before anything is completed", () => {
    for (const reported of ["mail-reply", "timeclock", "paystub", "tour"] as const) {
      expect(ownsFinish({ reported, justFinished: null, inLesson: false })).toBe(false);
    }
  });

  it("keeps a lesson's own finish, since a lesson is one job", () => {
    expect(ownsFinish({ reported: "paystub", justFinished: null, inLesson: true })).toBe(true);
  });

  it("keeps a finished job the learner deliberately reopened to revise", () => {
    // A teacher's note opens the job again; its "Do it again" must work.
    expect(ownsFinish({ reported: "performance-review", justFinished: null, inLesson: false, revisiting: true })).toBe(true);
    // Only that job: the same false Done is still refused without it.
    expect(ownsFinish({ reported: "schedule", justFinished: null, inLesson: false, revisiting: false })).toBe(false);
  });
});

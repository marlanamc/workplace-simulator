import { describe, expect, it } from "vitest";
import {
  NEXT_SCHEDULE_DOC,
  NEXT_SCHEDULE_NAME,
  PICKER_PAGES,
  PICKER_TARGET_KEY,
  SCHEDULE_MAIL,
  THIS_SCHEDULE_DOC,
  UPLOAD_FOLDER,
  downloadsFor,
  uploadCorrection,
  uploadProblem,
  uploadStartProblem,
  type UploadProblem,
} from "@/lib/tasks/upload-schedule/content";
import { FILE_PAGES, MESSY_FILES } from "@/lib/tasks/files/content";
import { TRACKS } from "@/lib/tracks-content";

/**
 * Wave 4, file confidence (Day 10). The evidence is which file went to which
 * folder, never a typed name or a click. See
 * curriculum/design/story-transfer-practice.md.
 */
describe("upload-schedule grading", () => {
  const wrongKeys = downloadsFor(true).filter((i) => !i.isTarget).map((i) => i.key);

  it("passes next week's schedule uploaded to Schedules", () => {
    expect(uploadProblem(PICKER_TARGET_KEY, UPLOAD_FOLDER, true)).toBeNull();
  });

  it("refuses this week's schedule and the other look-alikes", () => {
    expect(wrongKeys.length).toBeGreaterThanOrEqual(3);
    for (const key of wrongKeys) expect(uploadProblem(key, UPLOAD_FOLDER, true)).toBe("wrong-file");
  });

  it("refuses any folder but Schedules, before and after the picker", () => {
    for (const folder of [null, "Forms", "Manager Memos"]) {
      expect(uploadStartProblem(folder)).toBe("wrong-folder");
      expect(uploadProblem(PICKER_TARGET_KEY, folder, true)).toBe("wrong-folder");
    }
    expect(uploadStartProblem(UPLOAD_FOLDER)).toBeNull();
  });

  it("says the download is missing when nothing was downloaded yet", () => {
    expect(downloadsFor(false).some((i) => i.isTarget)).toBe(false);
    for (const key of wrongKeys) expect(uploadProblem(key, UPLOAD_FOLDER, false)).toBe("not-downloaded");
  });

  it("passes on a retry after a wrong pick: nothing is reset", () => {
    expect(uploadProblem(wrongKeys[0]!, UPLOAD_FOLDER, true)).toBe("wrong-file");
    expect(uploadProblem(PICKER_TARGET_KEY, UPLOAD_FOLDER, true)).toBeNull();
  });

  it("gives a bilingual correction for every problem and every wrong file", () => {
    const problems: UploadProblem[] = ["not-downloaded", "wrong-folder", "wrong-file"];
    for (const p of problems) {
      const line = uploadCorrection(p, "Forms");
      expect(line.en.trim()).not.toBe("");
      expect(line.es.trim()).not.toBe("");
      expect(line.es).not.toBe(line.en);
    }
    for (const item of downloadsFor(true).filter((i) => !i.isTarget)) {
      expect(item.wrongHint?.en, item.key).toBeTruthy();
      expect(item.wrongHint?.es, item.key).toBeTruthy();
    }
  });

  it("shows a real page for every file in the picker", () => {
    for (const item of downloadsFor(true)) expect(PICKER_PAGES[item.key], item.key).toBeDefined();
  });
});

describe("upload-schedule fits the Day 10 story", () => {
  it("is Day 10's first job, before the share and the link", () => {
    expect(TRACKS.find((t) => t.key === "files")!.taskKeys).toEqual(["upload-schedule", "files", "mail-send-link"]);
  });

  it("attaches next week's schedule, the same file the share task later shows as a look-alike", () => {
    const later = MESSY_FILES.find((f) => f.key === "sched-sept")!;
    expect(NEXT_SCHEDULE_NAME).toBe(later.name);
    expect(later.isTarget).toBe(false);
    expect(NEXT_SCHEDULE_DOC).toMatchObject({ kind: "schedule", week: (FILE_PAGES["sched-sept"].doc as { week: string }).week });
  });

  it("uses this week's schedule as the distractor, with a different week on the page", () => {
    const week = (d: unknown) => (d as { week: string }).week;
    expect(week(THIS_SCHEDULE_DOC)).not.toBe(week(NEXT_SCHEDULE_DOC));
  });

  it("has Renata's email in both languages, naming the folder", () => {
    for (const lang of ["en", "es"] as const) {
      expect(SCHEDULE_MAIL.body?.[lang].join(" ")).toContain(UPLOAD_FOLDER);
    }
  });
});

import { describe, expect, it } from "vitest";
import { introBeatsDone, JOB_CARD_LINE } from "@/lib/job-card-content";
import { LEVELS, levelUpShowsConfetti, taskKeysBeforeLevel, unlockedLevels } from "@/lib/tracks-content";
import { HQ_FILES, hqFileMatches, normalizeDriveSearch } from "@/lib/tasks/office-drive/content";
import { slideFigure, PLANTED_TOTAL } from "@/lib/tasks/slide-deck/content";
import { LESSON_PASSWORD, RIGHT_NOW_STEPS as RECOVERY_STEPS, STORY_SIGNIN_GOAL, practicePasswordMatches } from "@/lib/tasks/account-recovery/content";
import { bookmarkTabKeys } from "@/lib/tabs";
import { moveGridCell } from "@/lib/sheet-grid-keys";
import { LESSONS as TOUR_LESSONS } from "@/lib/tasks/tour/content";

/** Story Mode Audit Stream H: findings #17 (on-ramp), #18 (tool mismatches), #19 (keyboard). */

describe("#17 the practice offer survives a reload", () => {
  it("keeps the welcome beat (and its practice) until the first task is finished", () => {
    expect(introBeatsDone([])).toBe(false);
    expect(introBeatsDone(["tour"])).toBe(true);
  });
});

describe("#18 tool mismatches", () => {
  it("HQ Drive search ignores case, underscores and extra spaces", () => {
    expect(normalizeDriveSearch("  Q3_notes__FINAL ")).toBe("q3 notes final");
    const found = (q: string) => HQ_FILES.filter((f) => hqFileMatches(f, q)).map((f) => f.key);
    expect(found("q3 notes")).toEqual(found("Q3_notes"));
    expect(found("q3 notes").length).toBeGreaterThan(0);
    expect(found("q3   NOTES final")).toEqual(found("q3_notes_final"));
    expect(found("payroll")).toEqual([]);
    expect(found("")).toHaveLength(HQ_FILES.length);
  });

  it("the HQ card names the file and who asked", () => {
    expect(JOB_CARD_LINE["office-drive"]?.en).toMatch(/Chris/);
    expect(JOB_CARD_LINE["office-drive"]?.en).toMatch(/Q3/);
    expect(JOB_CARD_LINE["office-drive"]?.es).toMatch(/Chris/);
  });

  it("the video call card names the camera step the check requires", () => {
    expect(JOB_CARD_LINE["video-call"]?.en).toMatch(/Turn on your camera/i);
    expect(JOB_CARD_LINE["video-call"]?.es).toMatch(/Enciende la cámara/i);
  });

  it("the slide shows one dollar sign however the total was typed", () => {
    for (const typed of ["188", "$188", "$ 188", " $$188 "]) expect(slideFigure(typed)).toBe(`$${PLANTED_TOTAL}`);
    expect(slideFigure("")).toBe("");
    expect(slideFigure("  ")).toBe("");
  });

  it("locked out means the practice password is checked, and the Story card says it", () => {
    expect(practicePasswordMatches(LESSON_PASSWORD)).toBe(true);
    expect(practicePasswordMatches(` ${LESSON_PASSWORD} `)).toBe(true);
    for (const typed of ["", "anything", "harbor2026", "Harbor 2026"]) expect(practicePasswordMatches(typed)).toBe(false);
    expect(STORY_SIGNIN_GOAL.en).toContain(LESSON_PASSWORD);
    expect(STORY_SIGNIN_GOAL.es).toContain(LESSON_PASSWORD);
    expect(RECOVERY_STEPS[0].en).toContain(LESSON_PASSWORD);
    expect(RECOVERY_STEPS[0].es).toContain(LESSON_PASSWORD);
  });

  it("no confetti on a card that opens on bad news", () => {
    const card = (key: string) => LEVELS.find((l) => l.key === key)!.levelUp!;
    expect(levelUpShowsConfetti(card("level3c"))).toBe(false);
    expect(levelUpShowsConfetti(card("level3a2"))).toBe(false);
    expect(levelUpShowsConfetti(card("level1"))).toBe(true);
  });

  it("the job posting stays on the bookmark bar for the whole hiring arc", () => {
    for (const key of ["level19h1", "level19h2", "level19h3", "level19h4", "level19h5"]) {
      const unlocked = new Set(unlockedLevels(taskKeysBeforeLevel(key)).map((l) => l.key));
      unlocked.add(key);
      expect(bookmarkTabKeys(key, [], null, { unlockedLevelKeys: unlocked }).has("jobs"), key).toBe(true);
    }
    const hq = new Set(unlockedLevels(taskKeysBeforeLevel("level20")).map((l) => l.key));
    expect(bookmarkTabKeys("level20", [], null, { unlockedLevelKeys: hq }).has("jobs")).toBe(false);
  });
});

describe("#19 keyboard", () => {
  const rows = [1, 2, 3];
  const cols = ["A", "B", "C"] as const;

  it("arrow keys move one cell and stop at the edge", () => {
    expect(moveGridCell({ row: 2, col: "B" }, "ArrowUp", rows, cols)).toEqual({ row: 1, col: "B" });
    expect(moveGridCell({ row: 2, col: "B" }, "ArrowDown", rows, cols)).toEqual({ row: 3, col: "B" });
    expect(moveGridCell({ row: 2, col: "B" }, "ArrowLeft", rows, cols)).toEqual({ row: 2, col: "A" });
    expect(moveGridCell({ row: 2, col: "B" }, "ArrowRight", rows, cols)).toEqual({ row: 2, col: "C" });
    expect(moveGridCell({ row: 1, col: "A" }, "ArrowUp", rows, cols)).toBeNull();
    expect(moveGridCell({ row: 3, col: "C" }, "ArrowRight", rows, cols)).toBeNull();
  });

  it("Home and End jump along the row; other keys, like Tab, are left to the browser", () => {
    expect(moveGridCell({ row: 2, col: "B" }, "Home", rows, cols)).toEqual({ row: 2, col: "A" });
    expect(moveGridCell({ row: 2, col: "B" }, "End", rows, cols)).toEqual({ row: 2, col: "C" });
    expect(moveGridCell({ row: 2, col: "A" }, "Home", rows, cols)).toBeNull();
    expect(moveGridCell({ row: 2, col: "B" }, "Tab", rows, cols)).toBeNull();
    expect(moveGridCell({ row: 2, col: "B" }, "Enter", rows, cols)).toBeNull();
  });

  it("follows the drawn order, even when row numbers skip", () => {
    expect(moveGridCell({ row: 2, col: "A" }, "ArrowDown", [1, 2, 9], cols)).toEqual({ row: 9, col: "A" });
    expect(moveGridCell({ row: 5, col: "A" }, "ArrowDown", rows, cols)).toBeNull();
  });

  it("the tour Help says how to move the card without a mouse, in both languages", () => {
    expect(TOUR_LESSONS.en[0].s.join(" ")).toMatch(/arrow key/);
    expect(TOUR_LESSONS.es[0].s.join(" ")).toMatch(/flecha del teclado/);
  });
});

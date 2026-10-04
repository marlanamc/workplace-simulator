import { describe, expect, it } from "vitest";
import { CONFIDENCE_KEYS, CONFIDENCE_SEQUENCES, parseScenario, scenarioHref } from "../lessons/confidence";
import { CONFIDENCE_SCENARIOS, confidenceProblem } from "../tasks/confidence/content";
import { lessonByKey, seedForLesson } from "../lessons/catalog";
import { safeReturn } from "../lessons/return";

describe("digital confidence launch", () => {
  it("publishes all eight in the chosen order with working seeds and bilingual teaching sequences", () => {
    expect(CONFIDENCE_KEYS).toHaveLength(8);
    for (const key of CONFIDENCE_KEYS) {
      expect(lessonByKey(key)?.sequence).toEqual(CONFIDENCE_SEQUENCES[key]);
      expect(seedForLesson(key)?.completedTaskKeys).not.toContain(key);
      for (const [field, value] of Object.entries(CONFIDENCE_SEQUENCES[key])) {
        if (field === "scenarios") continue;
        expect((value as { en: string }).en.trim()).not.toBe("");
        expect((value as { es: string }).es.trim()).not.toBe("");
      }
      expect(CONFIDENCE_SCENARIOS[key].try.request).not.toEqual(CONFIDENCE_SCENARIOS[key].home.request);
    }
  });
  it("validates scenarios and preserves them through sign-in", () => {
    expect(parseScenario()).toBe("classroom");
    expect(parseScenario("bogus")).toBeNull();
    expect(parseScenario("home")).toBe("home");
    const href = scenarioHref("mail-attach", "home", "es", "independent");
    const result = new URL(safeReturn(href), "https://example.test");
    expect(result.searchParams.get("scenario")).toBe("home");
    expect(result.searchParams.get("lang")).toBe("es");
    expect(result.searchParams.get("mode")).toBe("independent");
    expect(safeReturn("/lessons/mail-attach?scenario=bad")).toBe("/lessons/mail-attach");
  });
  it("checks the requested email fact without grading grammar", () => {
    const s = CONFIDENCE_SCENARIOS["mail-reply"];
    for (const body of ["Room 28.", "En la 28", "It's moved to 28, thank you."]) expect(confidenceProblem(s.try, { recipient: "ana@example.test", body })).toBeNull();
    for (const body of ["Room 14", "Thanks", ""]) expect(confidenceProblem(s.try, { recipient: "ana@example.test", body })).not.toBeNull();
    for (const body of ["three more", "Trae tres", "3"]) expect(confidenceProblem(s.home, { recipient: "lee@example.test", body })).toBeNull();
    expect(confidenceProblem(s.home, { recipient: "wrong@example.test", body: "3" })).not.toBeNull();
  });
  it("distinguishes signed/approved files and requested permission, not the previous answer", () => {
    const attach = CONFIDENCE_SCENARIOS["mail-attach"].home;
    expect(confidenceProblem(attach, { recipient: "lee@example.test", file: "draft" })).not.toBeNull();
    expect(confidenceProblem(attach, { recipient: "lee@example.test", file: "approved" })).toBeNull();
    const files = CONFIDENCE_SCENARIOS.files.home;
    expect(confidenceProblem(files, { recipient: "ana@example.test", file: "final", name: "Class reading final", permission: "edit" })).toBeNull();
    expect(confidenceProblem(files, { recipient: "ana@example.test", file: "final", name: "Class-reading-final.pdf", permission: "view" })).not.toBeNull();
  });
  it("rejects ordered quantities and swapped rows even when the total happens to match", () => {
    const s = CONFIDENCE_SCENARIOS.spreadsheet.home;
    expect(confidenceProblem(s, { recipient: "lee@example.test", B2: "9", B3: "7", total: "16" })).toBeNull();
    for (const cells of [{ B2: "15", B3: "10", total: "25" }, { B2: "7", B3: "9", total: "16" }, { B2: "", B3: "7", total: "7" }]) expect(confidenceProblem(s, { recipient: "lee@example.test", ...cells })).not.toBeNull();
  });
  it("requires the current code, including when its message is second", () => {
    const s = CONFIDENCE_SCENARIOS["account-recovery"].home;
    expect(confidenceProblem(s, { email: "reader@library.example.test", password: "Books!26", code: "730184", text: "1" })).toBeNull();
    expect(confidenceProblem(s, { email: "reader@library.example.test", password: "Books!26", code: "562901", text: "0" })).not.toBeNull();
  });
  it("rejects the old deadline and a draft upload", () => {
    const s = CONFIDENCE_SCENARIOS.coursework.home;
    expect(confidenceProblem(s, { deadline: "2026-11-18", file: "revised" })).toBeNull();
    expect(confidenceProblem(s, { deadline: "2026-11-16", file: "revised" })).not.toBeNull();
    expect(confidenceProblem(s, { deadline: "2026-11-18", file: "old" })).not.toBeNull();
  });
  it("compares the full meeting duration and the correct date", () => {
    const s = CONFIDENCE_SCENARIOS.calendar.home;
    expect(confidenceProblem(s, { recipient: "lee@example.test", date: "2026-11-13", time: "12:00" })).toBeNull();
    expect(confidenceProblem(s, { recipient: "lee@example.test", date: "2026-11-13", time: "10:00" })).not.toBeNull();
    expect(confidenceProblem(s, { recipient: "lee@example.test", date: "2026-11-12", time: "12:00" })).not.toBeNull();
  });
});

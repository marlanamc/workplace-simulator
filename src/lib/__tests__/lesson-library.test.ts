import { describe, expect, it } from "vitest";
import { LESSONS } from "@/lib/lessons/catalog";
import { libraryHref, libraryReturn, QUICK_SEARCHES, searchLessons } from "@/lib/lessons/library";
import { SKILL_LOOK, SKILL_TAGS } from "@/lib/lessons/skills";
import { safeReturn } from "@/lib/lessons/return";

describe("lesson discovery", () => {
  it("keeps catalog order for empty searches and combines skill and text", () => {
    expect(searchLessons(null, "  ")).toEqual(LESSONS);
    expect(searchLessons("forms", "W-4").map(l => l.taskKey)).toEqual(["w4-form"]);
    expect(searchLessons("email", "W-4")).toEqual([]);
  });
  it("matches accents and case in either language, including skill labels", () => {
    expect(searchLessons(null, "CODIGO").map(l => l.taskKey)).toContain("account-recovery");
    expect(searchLessons(null, "CONTRASENAS").map(l => l.taskKey)).toContain("account-recovery");
    expect(searchLessons(null, "passwords").map(l => l.taskKey)).toContain("account-recovery");
  });
  it("matches any word, ranks more matches first, and ignores filler words", () => {
    const both = searchLessons(null, "W-4 attach");
    expect(both.map(l => l.taskKey)).toEqual(expect.arrayContaining(["w4-form", "mail-attach"]));
    expect(searchLessons(null, "the W-4").map(l => l.taskKey)).toEqual(["w4-form"]);
    expect(searchLessons(null, "zzzz")).toEqual([]);
  });
  it("maps a learner's word to the lessons' words", () => {
    expect(searchLessons(null, "password").map(l => l.taskKey)).toContain("account-recovery");
    expect(searchLessons(null, "empleo").length).toBeGreaterThan(0);
  });
  it("every quick search finds a lesson in both languages", () => {
    for (const s of QUICK_SEARCHES) {
      expect(searchLessons(null, s.en).length, s.en).toBeGreaterThan(0);
      expect(searchLessons(null, s.es).length, s.es).toBeGreaterThan(0);
    }
  });
  it("every skill has a topic look", () => {
    for (const tag of SKILL_TAGS) expect(SKILL_LOOK[tag].colors.solid).toMatch(/^#[0-9a-f]{6}$/);
  });
});

describe("library return navigation", () => {
  it("preserves filters while using the current language", () => {
    expect(libraryReturn("/lessons?skill=forms&q=W-4&lang=en", "es")).toBe("/lessons?lang=es&skill=forms&q=W-4");
    expect(libraryReturn(null, "es")).toBe("/lessons?lang=es");
    expect(libraryHref("en", null, "   ")).toBe("/lessons");
    expect(libraryReturn("/lessons?skill=forms&teacher=1", "en")).toBe("/lessons?skill=forms&teacher=1");
  });
  it("rejects external, non-library and invalid filter destinations", () => {
    for (const raw of ["https://evil.test/lessons", "//evil.test/lessons", "/lessons/../teacher", "/lessons/w4-form"]) expect(libraryReturn(raw)).toBe("/lessons");
    expect(libraryReturn("/lessons?skill=invalid&preview=1&returnTo=https://evil.test&q=tax")).toBe("/lessons?q=tax");
  });
  it("carries safe context through sign-in without nested return parameters", () => {
    const result = new URL(safeReturn("/lessons/w4-form?mode=independent&returnTo=" + encodeURIComponent("/lessons?skill=forms&q=W-4")), "https://test.invalid");
    expect(result.searchParams.get("returnTo")).toBe("/lessons?skill=forms&q=W-4");
    expect(result.searchParams.get("mode")).toBe("independent");
    expect(safeReturn("/lessons?skill=forms&q=W-4")).toBe("/lessons?skill=forms&q=W-4");
  });
});

import { describe, expect, it } from "vitest";
import { LESSONS } from "@/lib/lessons/catalog";
import { LESSON_PATHWAYS, PIECE_LABELS } from "@/lib/lessons/pathways";
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
  it("finds the words the audit's learners typed: no hyphen, plurals, synonyms, one typo", () => {
    const keys = (q: string) => searchLessons(null, q).map(l => l.taskKey);
    expect(keys("W4")).toContain("w4-form");
    expect(keys("taxes")).toContain("w4-form");
    expect(keys("login")).toContain("account-recovery");
    expect(keys("phone")).toContain("account-recovery");
    expect(keys("pasword")).toContain("account-recovery");
    expect(keys("calender")).toContain("calendar");
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
  it("keeps validated pathways and gives search and topics precedence", () => {
    const href = libraryHref("es", null, "", true, "classwork");
    expect(href).toBe("/lessons?lang=es&teacher=1&pathway=classwork");
    expect(libraryReturn(href, "en")).toBe("/lessons?teacher=1&pathway=classwork");
    expect(libraryReturn("/lessons?pathway=invalid")).toBe("/lessons");
    expect(libraryHref("en", "email", "", false, "classwork")).toBe("/lessons?skill=email");
    expect(libraryHref("en", null, "email", false, "classwork")).toBe("/lessons?q=email");
    const returned = new URL(safeReturn("/lessons/mail-reply?returnTo=" + encodeURIComponent(href)), "https://test.invalid");
    expect(returned.searchParams.get("returnTo")).toContain("pathway=classwork");
  });
  it("offers short pathways of unique published lessons with bilingual goals", () => {
    expect(new Set(LESSON_PATHWAYS.map(p => p.key)).size).toBe(LESSON_PATHWAYS.length);
    for (const pathway of LESSON_PATHWAYS) {
      expect(pathway.taskKeys.length).toBeGreaterThanOrEqual(3);
      expect(pathway.taskKeys.length).toBeLessThanOrEqual(4);
      expect(new Set(pathway.taskKeys).size).toBe(pathway.taskKeys.length);
      for (const key of pathway.taskKeys) expect(LESSONS.some(l => l.taskKey === key)).toBe(true);
      for (const lang of ["en", "es"] as const) {
        expect(pathway.title[lang].length).toBeGreaterThan(0);
        expect(pathway.summary[lang].length).toBeGreaterThan(0);
        // Each lesson is one short puzzle piece in the goal's tower.
        for (const key of pathway.taskKeys) {
          expect(PIECE_LABELS[key]?.[lang]).toBeTruthy();
          expect(PIECE_LABELS[key]![lang].length).toBeLessThanOrEqual(12);
        }
      }
    }
  });
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

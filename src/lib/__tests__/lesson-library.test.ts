import { describe, expect, it } from "vitest";
import { LESSONS } from "@/lib/lessons/catalog";
import { libraryHref, libraryReturn, searchLessons, STARTER_LESSONS } from "@/lib/lessons/library";
import { safeReturn } from "@/lib/lessons/return";

describe("lesson discovery", () => {
  it("keeps catalog order for empty searches and combines skill and text", () => {
    expect(searchLessons("en", null, "  ")).toEqual(LESSONS);
    expect(searchLessons("en", "forms", "W-4").map(l => l.taskKey)).toEqual(["w4-form"]);
    expect(searchLessons("en", "email", "W-4")).toEqual([]);
  });
  it("matches accents and case, using the selected language and skill labels", () => {
    expect(searchLessons("es", null, "CODIGO").map(l => l.taskKey)).toContain("account-recovery");
    expect(searchLessons("es", null, "CONTRASENAS").map(l => l.taskKey)).toContain("account-recovery");
    expect(searchLessons("en", null, "CODIGO")).toEqual([]);
  });
  it("uses three published distinct starters", () => {
    expect(new Set(STARTER_LESSONS).size).toBe(3);
    for (const key of STARTER_LESSONS) expect(LESSONS.some(l => l.taskKey === key)).toBe(true);
  });
});

describe("library return navigation", () => {
  it("preserves filters while using the current language", () => {
    expect(libraryReturn("/lessons?skill=forms&q=W-4&lang=en", "es")).toBe("/lessons?lang=es&skill=forms&q=W-4");
    expect(libraryReturn(null, "es")).toBe("/lessons?lang=es");
    expect(libraryHref("en", null, "   ")).toBe("/lessons");
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

import { describe, expect, it } from "vitest";
import { lessonByKey } from "@/lib/lessons/catalog";
import { PRACTICE_PACKS } from "@/lib/lessons/materials";
import { MATERIAL_TASKS, materialsHref } from "@/lib/lessons/materials-links";

function bilingualLeaves(value: unknown): void {
  if (Array.isArray(value)) { value.forEach(bilingualLeaves); return; }
  if (!value || typeof value !== "object") return;
  const obj = value as Record<string, unknown>;
  if ("en" in obj || "es" in obj) {
    for (const lang of ["en", "es"]) {
      expect(typeof obj[lang]).toBe("string");
      expect((obj[lang] as string).trim().length).toBeGreaterThan(0);
    }
  } else Object.values(obj).forEach(bilingualLeaves);
}

describe("workplace practice materials", () => {
  it("links only complete packets for published lessons", () => {
    expect(Object.keys(PRACTICE_PACKS).sort()).toEqual([...MATERIAL_TASKS].sort());
    for (const key of MATERIAL_TASKS) {
      expect(lessonByKey(key), key).toBeDefined();
      const pack = PRACTICE_PACKS[key]!;
      expect(pack.documents.length).toBeGreaterThanOrEqual(2);
      expect(pack.discuss.length).toBeGreaterThan(0);
      expect(pack.evidence.length).toBeGreaterThan(0);
      bilingualLeaves(pack);
      for (const doc of pack.documents) {
        expect(Boolean(doc.paragraphs?.length || doc.table?.rows.length)).toBe(true);
        if (doc.table) for (const row of doc.table.rows) expect(row.length).toBe(doc.table.columns.length);
      }
      expect(materialsHref(key, "es")).toBe(`/lessons/${key}/materials?lang=es`);
    }
    expect(materialsHref("unknown", "en")).toBeUndefined();
    expect(materialsHref("account-recovery", "en")).toBeUndefined();
  });
});

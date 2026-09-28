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
      expect(pack.learnerTask.length, key).toBeGreaterThanOrEqual(2);
      // The learner writes somewhere: on answer lines or in blank grid cells.
      const writesOnLines = pack.learnerTask.some(q => q.lines > 0);
      const fillsCells = pack.documents.some(d => d.table?.rows.some(r => r.includes(null)));
      expect(writesOnLines || fillsCells, key).toBe(true);
      for (const doc of pack.documents) {
        expect(Boolean(doc.paragraphs?.length || doc.table?.rows.length)).toBe(true);
        if (doc.table) for (const row of doc.table.rows) expect(row.length).toBe(doc.table.columns.length);
      }
      expect(materialsHref(key, "es")).toBe(`/lessons/${key}/materials?lang=es`);
    }
    expect(materialsHref("unknown", "en")).toBeUndefined();
    expect(materialsHref("account-recovery", "en")).toBeUndefined();
  });

  it("keeps workplace file names in English in both languages", () => {
    const fileName = /\S+\.(pdf|xlsx)\b/g;
    for (const key of MATERIAL_TASKS) {
      for (const doc of PRACTICE_PACKS[key]!.documents) {
        for (const cell of doc.table?.rows.flat() ?? []) {
          if (cell && fileName.test(cell.en)) expect(cell.es, key).toBe(cell.en);
          fileName.lastIndex = 0;
        }
      }
    }
  });

  it("matches the Spanish appointment note to the intended answer", () => {
    // "salir antes de las 11:00" made the 10:30–11:00 answer look wrong.
    const note = PRACTICE_PACKS["appointment-scheduling"]!.documents[0].paragraphs![0].es;
    expect(note).not.toMatch(/antes de las 11/);
    expect(note).toMatch(/irme a las 11:00/);
  });
});

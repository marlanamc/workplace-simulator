import { describe, expect, it } from "vitest";
import { FOLLOWUP_ROUNDS, practiceProblem, type PracticeRound } from "@/lib/tasks/lesson-followups/content";
import { lessonByKey } from "@/lib/lessons/catalog";

const rounds = Object.values(FOLLOWUP_ROUNDS).flat();
const correct = (round: PracticeRound) => Object.fromEntries(round.fields.map((f) => [f.id, f.answer]));

describe("expanded standalone lessons", () => {
  it("only extends published lessons, with two fresh situations each", () => {
    for (const [key, cases] of Object.entries(FOLLOWUP_ROUNDS)) {
      expect(lessonByKey(key), key).toBeDefined();
      expect(cases).toHaveLength(2);
      expect(lessonByKey(key)!.minutes).toBeGreaterThanOrEqual(20);
    }
    expect(new Set(rounds.map((r) => r.id)).size).toBe(rounds.length);
  });
  it.each(rounds)("$id accepts supported decisions and rejects each distractor", (round) => {
    expect(practiceProblem(round, correct(round))).toBeNull();
    expect(practiceProblem(round, {})).not.toBeNull();
    expect(round.sources.length).toBeGreaterThanOrEqual(2);
    for (const field of round.fields) {
      expect(field.options.filter((o) => o.id === field.answer)).toHaveLength(1);
      expect(practiceProblem(round, { ...correct(round), [field.id]: "invalid" })).not.toBeNull();
      for (const option of field.options.filter((o) => o.id !== field.answer)) {
        expect(option.correction?.en).toBeTruthy();
        expect(option.correction?.es).toBeTruthy();
        expect(practiceProblem(round, { ...correct(round), [field.id]: option.id })).toEqual(option.correction);
      }
    }
  });
  it("all authored visible copy is bilingual", () => {
    function visit(value: unknown) {
      if (!value || typeof value !== "object") return;
      if ("en" in value || "es" in value) {
        expect(value).toMatchObject({ en: expect.any(String), es: expect.any(String) });
        expect((value as { en: string }).en.trim()).not.toBe("");
        expect((value as { es: string }).es.trim()).not.toBe("");
      } else Object.values(value).forEach(visit);
    }
    visit(FOLLOWUP_ROUNDS);
  });
  it("requires different decisions instead of repeating the first task's answer", () => {
    const files = FOLLOWUP_ROUNDS.files!;
    expect(correct(files[0]).access).toBe("view");
    expect(correct(files[1]).access).toBe("edit");
    expect(correct(FOLLOWUP_ROUNDS["mail-attach"]![1]).attachment).toBe("none");
    expect(correct(FOLLOWUP_ROUNDS["appointment-scheduling"]![1]).reply).toBe("ask");
  });
  it("the starting attachment must actually be replaced", () => {
    const round = FOLLOWUP_ROUNDS["mail-attach"]![0];
    expect(practiceProblem(round, { ...correct(round), attachment: "aug" })?.en).toContain("August is still attached");
    expect(practiceProblem(round, { ...correct(round), attachment: "" })).not.toBeNull();
  });
});

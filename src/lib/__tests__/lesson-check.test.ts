import { describe, expect, it } from "vitest";
import { TASKS } from "@/lib/tasks/registry";

/**
 * The comprehension check is optional per lesson, but wherever it exists it
 * must hold together: one right answer per question, a real question in
 * both languages, and at least two choices to pick between.
 */
describe("lesson comprehension checks", () => {
  for (const task of Object.values(TASKS)) {
    const check = task.lesson?.check;
    if (!check?.length) continue;

    describe(task.key, () => {
      it("has 3 to 5 questions", () => {
        expect(check.length).toBeGreaterThanOrEqual(3);
        expect(check.length).toBeLessThanOrEqual(5);
      });

      it("every question has exactly one correct choice, bilingual, at least two options", () => {
        for (const q of check) {
          expect(q.question.en.trim(), "question en").not.toBe("");
          expect(q.question.es.trim(), "question es").not.toBe("");
          expect(q.choices.length).toBeGreaterThanOrEqual(2);
          expect(q.choices.filter((c) => c.correct)).toHaveLength(1);
          for (const choice of q.choices) {
            expect(choice.text.en.trim(), "choice en").not.toBe("");
            expect(choice.text.es.trim(), "choice es").not.toBe("");
          }
        }
      });
    });
  }
});

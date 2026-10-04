import { describe, expect, it } from "vitest";
import { CORRECT_WEEK_TOTAL, SHORT_WEEK_TOTAL } from "@/lib/tasks/crew-week";
import {
  RIGHT_NOW_STEPS as TIP_STEPS,
  STARTERS as TIP_STARTERS,
  TOTAL_EMAIL_HINT,
  totalEmailProblem,
  totalFormula,
  dayLabel,
  TIP_ROWS,
  REAL_TOTAL_LABEL,
} from "@/lib/tasks/spreadsheet/content";
import {
  RIGHT_NOW_STEPS as FORMULA_STEPS,
  STARTERS as FORMULA_STARTERS,
  fixEmailProblem,
  keysToFix,
  rangeCoversCrew,
  sumCorrection,
  sumProblem,
  wrongSumFormula,
} from "@/lib/tasks/formula-check/content";
import {
  RIGHT_NOW_STEPS as BUDGET_STEPS,
  LESSONS as BUDGET_HELP,
  STARTERS as BUDGET_STARTERS,
  emailFlagsOver,
  statusFormula,
} from "@/lib/tasks/budget-sheet/content";
import { TASKS } from "@/lib/tasks/registry";

describe("spreadsheet: the total email", () => {
  it.each([
    "The total is $241.50.",
    "total 241.50",
    "Hi Renata, 241,50 this week",
    "The total from the sheet is $241.5.",
  ])("passes %j", (body) => expect(totalEmailProblem(body)).toBe("ok"));

  it.each([
    ["", "empty"],
    ["I sent it.", "no-number"],
    ["241", "no-cents"],
    ["The total is $241", "no-cents"],
    ["The total is $242.", "no-cents"],
    ["The total is 200.", "wrong-number"],
    ["The total from the sheet is $___.", "no-number"],
  ] as const)("rejects %j as %s", (body, problem) => expect(totalEmailProblem(body)).toBe(problem));

  it("names the cents, not 'not just that you sent it', for 241", () => {
    const hint = TOTAL_EMAIL_HINT[totalEmailProblem("241") as "no-cents"];
    expect(hint.en).toMatch(/cents/);
    expect(hint.en).not.toMatch(/sent it/);
    expect(hint.es).toMatch(/centavos/);
  });

  it("starters are frames, not the answer", () => {
    for (const lang of ["en", "es"] as const) {
      expect(TIP_STARTERS[lang].join(" ")).not.toContain(REAL_TOTAL_LABEL);
      expect(TIP_STARTERS[lang].join(" ")).toContain("___");
    }
  });

  it("shows Spanish data on the Spanish screen", () => {
    expect(totalFormula("en")).toBe("=SUM(B2:B6)");
    expect(totalFormula("es")).toBe("=SUMA(B2:B6)");
    expect(dayLabel(TIP_ROWS[0], "es")).toBe("Lunes");
    expect(TIP_STEPS[1].es).toMatch(/Propinas/);
  });
});

describe("formula-check: the formula", () => {
  it.each(["=SUM(H2:H6)", "=SUMA(H2:H6)", "=suma(h2:h6)", "=H2+H3+H4+H5+H6"])("accepts %j", (f) =>
    expect(rangeCoversCrew(f, "sum")).toBe(true),
  );
  it("accepts PROMEDIO as AVERAGE", () => expect(rangeCoversCrew("=PROMEDIO(H2:H6)", "average")).toBe(true));
  it("shows SUMA on the Spanish screen", () => expect(wrongSumFormula("es")).toBe("=SUMA(H2:H5)"));

  it("reads =SUM(H2:H5)H6 (caret at the end) as unreadable and names the keys", () => {
    const typed = "=SUM(H2:H5)H6";
    expect(sumProblem(typed)).toBe("unreadable");
    expect(keysToFix(typed, "en")).toEqual({ backspaces: 4, type: "6)" });
    const hint = sumCorrection(typed, "en", 1)!;
    expect(hint).toMatch(/Backspace 4 times, then type 6\)/);
    expect(sumCorrection("=SUMA(H2:H5)H6", "es", 1)).toMatch(/Backspace\) 4 veces y luego escribe 6\)/);
  });

  it("first miss asks a looking question; the exact edit comes only after another wrong try", () => {
    const first = sumCorrection("=SUM(H2:H5)", "en", 1)!;
    expect(first).toMatch(/green/);
    expect(first).not.toMatch(/H6|Casey|row 6/);
    const second = sumCorrection("=SUM(H2:H5)", "en", 2)!;
    expect(second).toMatch(/Backspace 2 times, then type 6\)/);
  });

  it("the Job Card does not give away the edit or the name", () => {
    for (const step of FORMULA_STEPS) {
      expect(step.en).not.toMatch(/H5 to H6|Casey/);
      expect(step.es).not.toMatch(/H5 por H6|Casey/);
    }
  });

  it("the intro says one person is missing, without naming Casey", () => {
    const lesson = TASKS["formula-check"].lesson!;
    expect(lesson.scene.need.en).toMatch(/one person is missing/i);
    expect(JSON.stringify(lesson.scene)).not.toMatch(/Casey/);
  });

  it("starters are frames", () => {
    for (const lang of ["en", "es"] as const) {
      const all = FORMULA_STARTERS[lang].join(" ");
      expect(all).not.toMatch(/Casey/);
      expect(all).not.toContain(String(CORRECT_WEEK_TOTAL));
    }
  });
});

describe("formula-check: the email", () => {
  it.each([
    `One person was not in the total. New total is ${CORRECT_WEEK_TOTAL}.`,
    `Casey was missing. Total ${CORRECT_WEEK_TOTAL}.`,
    `the formula forgot casey, now ${CORRECT_WEEK_TOTAL}`,
    `I fixed the formula. The total is ${CORRECT_WEEK_TOTAL}.`,
    `Faltaba una persona. El total nuevo es ${CORRECT_WEEK_TOTAL}.`,
    `Casey no estaba en el total. Ahora es ${CORRECT_WEEK_TOTAL}.`,
    `La suma omitía la última fila. Total: ${CORRECT_WEEK_TOTAL}.`,
  ])("passes %j", (body) => expect(fixEmailProblem(body)).toBe("ok"));

  it.each([
    [`the sum is ${CORRECT_WEEK_TOTAL}`, "no-reason"],
    [`la suma es ${CORRECT_WEEK_TOTAL}`, "no-reason"],
    [`The total is ${CORRECT_WEEK_TOTAL}.`, "no-reason"],
    [`Casey was missing. Total ${SHORT_WEEK_TOTAL}.`, "old-total"],
    ["Casey was missing.", "no-total"],
    ["", "empty"],
  ] as const)("rejects %j as %s", (body, problem) => expect(fixEmailProblem(body)).toBe(problem));
});

describe("budget-sheet", () => {
  it("does not give away the line on the find step", () => {
    expect(BUDGET_STEPS[1].en).not.toMatch(/says over|Labor/);
    expect(BUDGET_STEPS[1].en).toMatch(/Budget and Actual/);
  });
  it("keeps the formula explanation in Help and the email goal on the card", () => {
    expect(BUDGET_STEPS[2].en).toMatch(/Email Renata/);
    expect(BUDGET_STEPS[2].es).toMatch(/Escribe a Renata/);
    expect(BUDGET_HELP.en[0].s.join(" ")).toMatch(/if Actual.*bigger than Budget/i);
    expect(BUDGET_HELP.es[0].s.join(" ")).toMatch(/si Real.*más grande que Presupuesto/i);
  });
  it("starters are frames that do not write the answer", () => {
    for (const lang of ["en", "es"] as const) {
      const all = BUDGET_STARTERS[lang].join(" ");
      expect(all).not.toMatch(/450|labou?r|mano de obra/i);
      expect(emailFlagsOver(all)).toBe(false);
    }
  });
  it("shows SI on the Spanish screen", () => {
    expect(statusFormula(3, "en")).toBe('=IF(C3>B3,"over","within budget")');
    expect(statusFormula(3, "es")).toBe('=SI(C3>B3,"sobre","dentro del presupuesto")');
  });
  it.each(["Labor is over by $450.", "labor 450 over", "Mano de obra se pasó por 450."])("passes %j", (b) =>
    expect(emailFlagsOver(b)).toBe(true),
  );
});

describe("sheet lessons have takeaways", () => {
  it.each(["spreadsheet", "formula-check", "budget-sheet"] as const)("%s", (key) => {
    const t = TASKS[key].lesson!.takeaway!;
    expect(t.en.length).toBeGreaterThan(10);
    expect(t.es.length).toBeGreaterThan(10);
  });
});

import { describe, expect, it } from "vitest";
import { PDF_DOCUMENTS } from "@/lib/pdf-content";
import { SHIFT_TIMES, STORY_DAY_BY_LEVEL } from "@/lib/story-dates";
import { TASKS } from "@/lib/tasks/registry";
import {
  EVENT_INTRO,
  HOURS_CHECK,
  LESSONS,
  NET_PAY_CHECK,
  PAYSTUB_COPY,
  PAY_STUBS,
  RIGHT_NOW_STEPS,
  TIME_RECORD,
  TIME_RECORD_COPY,
} from "@/lib/tasks/paystub/content";
import type { Lang } from "@/lib/task-types";

const LANGS: Lang[] = ["en", "es"];
const stub = PDF_DOCUMENTS.find((d) => d.id === "paystub-first");
if (stub?.kind !== "paystub") throw new Error("Missing first pay stub");
const regularHours = Number(stub.earnings.find((e) => e.label === "Regular hours")!.detail.split(" ")[0]);

/**
 * Everything Day 6 shows the learner before or while they answer: the list
 * row, the arrival, the card lines, the questions, Help. None of it may state
 * an answer (Wave 5 F-8).
 */
function linesBeforeTheAnswer(lang: Lang): string[] {
  return [
    EVENT_INTRO[lang].headline,
    EVENT_INTRO[lang].body,
    PAYSTUB_COPY[lang].listLead,
    ...PAY_STUBS.flatMap((p) => [p.role, p.period[lang], p.payDate[lang], PAYSTUB_COPY[lang].paidLabel]),
    ...RIGHT_NOW_STEPS.map((s) => s[lang]),
    NET_PAY_CHECK[lang].question,
    HOURS_CHECK[lang].question,
    TIME_RECORD_COPY[lang].heading,
    TIME_RECORD_COPY[lang].note,
    ...LESSONS[lang].flatMap((l) => [l.t, ...l.s, l.tip]),
    TASKS.paystub.jobCardLine?.[lang] ?? "",
    TASKS.paystub.dispatch[lang],
  ];
}

describe("Day 6 pay stub: the answers are the learner's to find (F-8)", () => {
  it.each(LANGS)("no list row, card line, question or Help line states the net pay or the paid hours (%s)", (lang) => {
    const net = stub.netPay;
    for (const line of linesBeforeTheAnswer(lang)) {
      expect(line, line).not.toContain(net);
      expect(line, line).not.toContain("571");
      expect(line, line).not.toMatch(/\b48\b/);
      // "six shifts", "6 shifts", "6 turnos", "seis turnos": the count is theirs.
      expect(line, line).not.toMatch(/\b(6|six|seis)\s+(shifts|turnos)\b/i);
    }
  });

  it("the list row shows the pay date, never the net pay", () => {
    for (const p of PAY_STUBS) {
      for (const lang of LANGS) {
        expect(p.payDate[lang]).not.toContain("$");
        expect(p.period[lang]).not.toContain("$");
      }
    }
    expect(PAY_STUBS[0].payDate).toEqual({ en: "Aug 28", es: "28 ago" });
    expect(PAY_STUBS[0].period).toEqual({ en: "Aug 18 – Aug 27", es: "18 ago – 27 ago" });
  });

  it("the time record is one row per shift and adds up to the stub's Regular hours", () => {
    expect(TIME_RECORD.reduce((sum, r) => sum + r.hours, 0)).toBe(regularHours);
    for (const lang of LANGS) {
      expect(HOURS_CHECK[lang].options.find((o) => o.isTarget)?.label).toMatch(new RegExp(`^${regularHours} `));
    }
    // Five shifts would be the 40-hour distractor; it must not also add up.
    expect(TIME_RECORD.length * 8).not.toBe(40);
  });

  it("the time record follows the story: no sick day, the fixed punch, the swapped Thursday, nothing after payday", () => {
    const days = TIME_RECORD.map((r) => r.day);
    expect(days).not.toContain(STORY_DAY_BY_LEVEL.level3a2);
    for (const d of days) {
      expect(SHIFT_TIMES[d], `day ${d} is a scheduled shift`).toBeDefined();
      expect(d).toBeLessThan(STORY_DAY_BY_LEVEL.level3a3);
    }
    expect(TIME_RECORD.find((r) => r.day === 27)?.block).toEqual({ start: "2:00 PM", end: "10:00 PM" });
    const fixed = TIME_RECORD.find((r) => r.day === STORY_DAY_BY_LEVEL.level3);
    expect(fixed?.block.start).toBe("7:00 AM");
    expect(fixed?.note).toBeDefined();
    for (const r of TIME_RECORD) {
      expect(r.date.es).not.toMatch(/Aug|Mon|Tue|Wed|Thu|Fri|Sat/);
    }
  });

  it.each(LANGS)("each wrong choice still gets its own correction (%s)", (lang) => {
    for (const check of [NET_PAY_CHECK[lang], HOURS_CHECK[lang]]) {
      for (const o of check.options.filter((opt) => !opt.isTarget)) {
        expect(o.wrongHint?.[lang], o.label).toBeTruthy();
      }
    }
    const gross = HOURS_CHECK[lang].options.find((o) => o.label === stub.grossPay);
    expect(gross?.wrongHint?.en).toMatch(/gross pay in dollars/);
    // The correction after a wrong answer may name a count, but not the right one.
    for (const o of HOURS_CHECK[lang].options) {
      expect(o.wrongHint?.[lang] ?? "").not.toMatch(/\b48\b|\b(6|six|seis)\s+(shifts|turnos)\b/i);
    }
  });
});

describe("Day 6 in Spanish: the English stub words are named (F-21)", () => {
  /** Every Spanish line that tells the learner what to look at on the stub. */
  const spanishDirections = [
    EVENT_INTRO.es.body,
    PAYSTUB_COPY.es.listLead,
    ...RIGHT_NOW_STEPS.map((s) => s.es),
    NET_PAY_CHECK.es.question,
    ...NET_PAY_CHECK.es.options.map((o) => o.wrongHint?.es ?? ""),
    ...HOURS_CHECK.es.options.map((o) => o.wrongHint?.es ?? ""),
    ...LESSONS.es.flatMap((l) => [l.t, ...l.s, l.tip]),
    // The desktop card's line for the day, from the task registry.
    TASKS.paystub.jobCardLine?.es ?? "",
  ];

  it("every Spanish line that says pago neto also says Net pay", () => {
    const lines = spanishDirections.filter((l) => /pago neto/i.test(l));
    expect(lines.length).toBeGreaterThan(4);
    for (const l of lines) expect(l, l).toContain("(Net pay)");
  });

  it("every Spanish line that says pago bruto also says Gross pay", () => {
    const lines = spanishDirections.filter((l) => /pago bruto/i.test(l));
    expect(lines.length).toBeGreaterThan(2);
    for (const l of lines) expect(l, l).toContain("(Gross pay)");
  });

  it("the hours steps name the stub's English label for hours", () => {
    const label = stub.earnings[0].label;
    expect(label).toBe("Regular hours");
    expect(RIGHT_NOW_STEPS[3].es).toContain(`(${label})`);
    expect(RIGHT_NOW_STEPS[4].es).toContain(`(${label})`);
    expect(LESSONS.es[2].s.join(" ")).toContain(`(${label})`);
  });

  it("the English lines are not glossed", () => {
    for (const s of RIGHT_NOW_STEPS) expect(s.en).not.toMatch(/\(/);
  });
});

describe("the pay period agrees everywhere (owner decision: Aug 18 – Aug 27)", () => {
  const lastWorked = Math.max(...TIME_RECORD.map((r) => r.day));
  const stubPdf = PDF_DOCUMENTS.find((d) => d.id === "paystub-first") as { payPeriod: string; name: string };

  it("ends the day before payday, on the last shift of the time record", () => {
    expect(lastWorked).toBe(STORY_DAY_BY_LEVEL.level3a3 - 1);
    expect(PAY_STUBS[0].period.en.endsWith("Aug 27")).toBe(true);
    expect(stubPdf.payPeriod).toContain("Aug 27");
    expect(stubPdf.name).toContain("18-27");
  });

  it("is what HR told the learner, in both languages", async () => {
    const { emailsForTask } = await import("@/lib/tasks/mail/content");
    const hr = emailsForTask("mail-reply").find((r) => r.key === "hr") as { body?: Record<Lang, string[]> };
    expect(hr.body!.en.join(" ")).toContain("Aug 18 to 27");
    expect(hr.body!.es.join(" ")).toContain("del 18 al 27 de agosto");
  });

  it("no Day 6 arrival says 'two weeks' for an 11-day first period", async () => {
    const { LEVELS } = await import("@/lib/tracks-content");
    const arrival = LEVELS.find((l) => l.key === "level3a3")!.levelUp!.body;
    for (const text of [arrival.en, arrival.es, EVENT_INTRO.en.body, EVENT_INTRO.es.body]) {
      expect(text).not.toMatch(/two weeks|dos semanas/i);
    }
    expect(arrival.en).toMatch(/^Your first payday\./);
    expect(arrival.es).toMatch(/^Tu primer día de pago\./);
  });
});

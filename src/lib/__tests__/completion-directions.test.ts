import { describe, expect, it } from "vitest";
import type { EventIntroCopy, Lang } from "@/lib/task-types";
import type { TaskKey } from "@/lib/desktop-content";
import { taskDescriptor } from "@/lib/tasks/registry";
import { CORRECT_WEEK_TOTAL } from "@/lib/tasks/crew-week";
import {
  EVENT_INTRO as SHIFT_INTRO,
  REVIEW_COPY as SHIFT_COPY,
  RIGHT_NOW_STEPS as SHIFT_STEPS,
} from "@/lib/tasks/shift-review/content";
import { EVENT_INTRO as FORMULA_INTRO, RIGHT_NOW_STEPS as FORMULA_STEPS } from "@/lib/tasks/formula-check/content";
import { RIGHT_NOW_STEPS as STATUS_STEPS } from "@/lib/tasks/status-report/content";
import { RIGHT_NOW_STEPS as COURSEWORK_STEPS } from "@/lib/tasks/coursework/content";
import { RIGHT_NOW_STEPS as ENROLLMENT_STEPS } from "@/lib/tasks/enrollment/content";
import { RIGHT_NOW_STEPS as RESEARCH_STEPS } from "@/lib/tasks/research/content";
import { RIGHT_NOW_STEPS as INCIDENT_STEPS } from "@/lib/tasks/incident/content";
import { RIGHT_NOW_STEPS as PRIORITY_STEPS } from "@/lib/tasks/priority-call/content";
import { RIGHT_NOW_STEPS as RESUME_STEPS } from "@/lib/tasks/resume-build/content";
import { RIGHT_NOW_STEPS as SLIDE_STEPS } from "@/lib/tasks/slide-deck/content";
import { RIGHT_NOW_STEPS as OPS_STEPS, SUMMARY_CORRECTIONS as OPS_CORRECTIONS } from "@/lib/tasks/ops-report-packet/content";
import { BUDGET_ROWS, EVENT_INTRO as BUDGET_INTRO, RIGHT_NOW_STEPS as BUDGET_STEPS } from "@/lib/tasks/budget-sheet/content";
import { RIGHT_NOW_STEPS as BILLING_STEPS } from "@/lib/tasks/billing-sheet/content";
import { RIGHT_NOW_STEPS as APPOINTMENT_STEPS } from "@/lib/tasks/appointment-scheduling/content";
import { EVENT_INTRO as CALENDAR_INTRO, RIGHT_NOW_STEPS as CALENDAR_STEPS } from "@/lib/tasks/calendar/content";
import { MAIL_JOB_CARD_STEPS } from "@/lib/tasks/mail/content";

/**
 * Option C (owner decision, 28 Sep): question first, requirements named.
 *
 * 1. REQUIREMENTS ARE VISIBLE. What a good answer must *contain* is on the
 *    Job Card before the check runs, the way a manager gives instructions:
 *    "say who was hurt and what you did", "cc Jordan", "a full sentence",
 *    "at least three skills", "do not promise a refund". If a grader checks
 *    it, some pre-try line asks for it, in both languages.
 *
 * 2. THE ANSWER IS NOT. The answer to the judgment (which source, which
 *    time, which person, what is missing, which number, the fix) never
 *    appears before the learner's first try. The card asks the question
 *    instead. A premise such as "one category is over" is allowed while
 *    finding WHICH one is still the learner's work. After a wrong try, the
 *    correction points to where to look; Help (the task's LESSONS) may give
 *    the answer.
 *
 * "Before the first try" here means every line the learner can read before
 * they submit: the task's RIGHT_NOW_STEPS, the registry dispatch and
 * jobCardLine, the arrival card (EVENT_INTRO headline and body), and a
 * lesson's summary and scene. Keep mechanical anti-gibberish checks out of
 * the requirement matrix: they are forgiving safeguards, not objectives.
 */

type Direction = { en: string; es: string };

function expectDirection(direction: Direction, en: RegExp, es: RegExp) {
  expect(direction.en).toMatch(en);
  expect(direction.es).toMatch(es);
}

function introLines(intro: Record<Lang, EventIntroCopy>): Direction[] {
  return [
    { en: intro.en.headline, es: intro.es.headline },
    { en: intro.en.body, es: intro.es.body },
  ];
}

/** Everything the learner can read about this task before the first check. */
function preTryText(key: TaskKey, steps: Direction[], intro?: Record<Lang, EventIntroCopy>): Direction[] {
  const task = taskDescriptor(key);
  return [
    ...steps,
    task.dispatch,
    ...(task.jobCardLine ? [task.jobCardLine] : []),
    ...(intro ? introLines(intro) : []),
    ...(task.lesson ? [task.lesson.summary, task.lesson.scene.need] : []),
  ];
}

describe("option C, half 1: requirements are named before the check", () => {
  it("names each content requirement in both languages", () => {
    // The time is on the form's facts panel; the card asks for a time, not which.
    expectDirection(SHIFT_STEPS[0], /what happened.*what time/i, /qué pasó.*a qué hora/i);
    // A looking question, not the edit: "change H5 to H6" gave the answer away (lesson audit).
    expectDirection(FORMULA_STEPS[1], /green.*every person.*formula bar/i, /verdes.*cada persona.*barra de fórmulas/i);
    // "Who was missing" is a requirement (say who), not the name.
    expectDirection(FORMULA_STEPS[3], /new total.*who was missing/i, /total nuevo.*quién faltaba/i);
    expectDirection(STATUS_STEPS[4], /total.*cc Jordan/i, /total.*copia a Jordan/i);
    expectDirection(COURSEWORK_STEPS[2], /sorry.*what you will do/i, /lo sientes.*qué vas a hacer/i);
    expectDirection(ENROLLMENT_STEPS[2], /BHCC.*program/i, /BHCC.*programa/i);
    expectDirection(RESEARCH_STEPS[2], /who wrote it.*where it was published/i, /quién la escribió.*dónde se publicó/i);
    expectDirection(INCIDENT_STEPS[0], /hurt.*what you did/i, /lastimó.*qué hiciste/i);
    expectDirection(PRIORITY_STEPS[2], /acknowledge.*check.*Do not promise.*refund/i, /Reconoce.*revisarás.*No prometas.*reembolso/i);
    expectDirection(RESUME_STEPS[2], /at least three skills/i, /al menos tres habilidades/i);
    expectDirection(SLIDE_STEPS[2], /full sentence/i, /oración completa/i);
    // The grader wants the total plus the day, the shift, and that nobody is on it.
    expectDirection(OPS_STEPS[3], /weekly total.*calendar.*which day.*which shift.*why/i, /total semanal.*calendario.*qué día.*qué turno.*por qué/i);
    expectDirection(BUDGET_STEPS[3], /category.*how much/i, /categoría.*por cuánto/i);
    expectDirection(BILLING_STEPS[2], /row.*correct charge/i, /fila.*cargo correcto/i);
    expectDirection(APPOINTMENT_STEPS[3], /new time/i, /hora nueva/i);
  });

  it("keeps Mail's checked writing requirements in its testable content", () => {
    expectDirection(MAIL_JOB_CARD_STEPS.writeForTask["call-out-sick"]!, /cannot work today's shift/i, /no puedes trabajar el turno de hoy/i);
    expectDirection(MAIL_JOB_CARD_STEPS.writeForTask["mail-send-link"]!, /schedule.*link.*Do not attach/i, /horario.*enlace.*No adjuntes/i);
    expectDirection(MAIL_JOB_CARD_STEPS.replyAllEdit, /professional.*yes or no.*Friday's 6 AM delivery/i, /profesional.*sí o no.*viernes.*6 AM/i);
  });
});

const labor = BUDGET_ROWS.find((row) => row.key === "labor")!;

/**
 * The answer to each judgment, per language. None of these may appear in the
 * task's pre-try text. Add a row when a task's judgment has a word or value
 * that a careless instruction could give away.
 */
const ANSWERS: {
  key: TaskKey;
  steps: Direction[];
  intro?: Record<Lang, EventIntroCopy>;
  en: RegExp[];
  es: RegExp[];
}[] = [
  // Which time: it is on the "What happened on your shift" panel.
  { key: "shift-review", steps: SHIFT_STEPS, intro: SHIFT_INTRO, en: [/\b11\b/, /eleven/i], es: [/\b11\b/, /\bonce\b/i] },
  // Which source.
  {
    key: "research",
    steps: RESEARCH_STEPS,
    en: [/database/i, /library/i, /peer/i, /journal/i, /\b2024\b/, /Chen|Morales/, /BHCC/],
    es: [/base de datos/i, /biblioteca/i, /pares/i, /revista/i, /\b2024\b/, /Chen|Morales/, /BHCC/],
  },
  // What on the calendar needs attention.
  {
    key: "ops-report-packet",
    steps: OPS_STEPS,
    en: [/Thursday/i, /uncovered/i, /no one|nobody/i, /morning open/i, /\b6(:00)?\s*AM\b/i],
    es: [/jueves/i, /sin cobertura/i, /nadie/i, /apertura/i, /\b6(:00)?\s*AM\b/i],
  },
  // Who was missing, the fixed range, the corrected total.
  {
    key: "formula-check",
    steps: FORMULA_STEPS,
    intro: FORMULA_INTRO,
    en: [/Casey|Brooks/, /\bH6\b/, /H2:H6/, /row 6/i, new RegExp(`\\b${CORRECT_WEEK_TOTAL}\\b`)],
    es: [/Casey|Brooks/, /\bH6\b/, /H2:H6/, /fila 6/i, new RegExp(`\\b${CORRECT_WEEK_TOTAL}\\b`)],
  },
  // Which category, and by how much.
  {
    key: "budget-sheet",
    steps: BUDGET_STEPS,
    intro: BUDGET_INTRO,
    en: [/\blabou?r\b/i, /payroll|wages/i, new RegExp(`\\b${labor.actual - labor.budget}\\b`)],
    es: [/mano de obra/i, /nómina|salarios/i, new RegExp(`\\b${labor.actual - labor.budget}\\b`)],
  },
  // Which row, and the right charge.
  { key: "billing-sheet", steps: BILLING_STEPS, en: [/EKG/i, /Morgan|Okonkwo/, /\b85\b/, /\b185\b/], es: [/EKG/i, /Morgan|Okonkwo/, /\b85\b/, /\b185\b/] },
  // Which time is open.
  { key: "appointment-scheduling", steps: APPOINTMENT_STEPS, en: [/11:30/], es: [/11:30/] },
  // Whether you work that day.
  {
    key: "calendar",
    steps: CALENDAR_STEPS,
    intro: CALENDAR_INTRO,
    en: [/do not work|don't work|day off|decline/i],
    es: [/no trabajas|día libre|rechaz/i],
  },
];

describe("option C, half 2: the answer is not stated before the first try", () => {
  it.each(ANSWERS)("$key keeps its answer off the pre-try text", ({ key, steps, intro, en, es }) => {
    const lines = preTryText(key, steps, intro);
    expect(lines.length).toBeGreaterThan(0);
    for (const line of lines) {
      for (const token of en) expect(line.en, `${key} (en) gives away ${token}`).not.toMatch(token);
      for (const token of es) expect(line.es, `${key} (es) gives away ${token}`).not.toMatch(token);
    }
  });

  it("points a wrong try back to where to look, without the answer", () => {
    // Shift review: back to the facts panel on the form.
    expectDirection(
      { en: SHIFT_COPY.en.factsNudge, es: SHIFT_COPY.es.factsNudge },
      /What happened on your shift/,
      /Lo que pasó en tu turno/,
    );
    // Ops report: back to the calendar item.
    for (const verdict of ["empty", "no-gap", "all-fine"] as const) {
      expectDirection(OPS_CORRECTIONS[verdict], /calendar/i, /calendario/i);
      expect(OPS_CORRECTIONS[verdict].en).not.toMatch(/Thursday|nobody|no one/i);
      expect(OPS_CORRECTIONS[verdict].es).not.toMatch(/jueves|nadie/i);
    }
  });
});

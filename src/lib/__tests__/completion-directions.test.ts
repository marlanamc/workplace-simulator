import { describe, expect, it } from "vitest";
import { RIGHT_NOW_STEPS as SHIFT_STEPS } from "@/lib/tasks/shift-review/content";
import { RIGHT_NOW_STEPS as FORMULA_STEPS } from "@/lib/tasks/formula-check/content";
import { RIGHT_NOW_STEPS as STATUS_STEPS } from "@/lib/tasks/status-report/content";
import { RIGHT_NOW_STEPS as COURSEWORK_STEPS } from "@/lib/tasks/coursework/content";
import { RIGHT_NOW_STEPS as ENROLLMENT_STEPS } from "@/lib/tasks/enrollment/content";
import { RIGHT_NOW_STEPS as RESEARCH_STEPS } from "@/lib/tasks/research/content";
import { RIGHT_NOW_STEPS as INCIDENT_STEPS } from "@/lib/tasks/incident/content";
import { RIGHT_NOW_STEPS as PRIORITY_STEPS } from "@/lib/tasks/priority-call/content";
import { RIGHT_NOW_STEPS as RESUME_STEPS } from "@/lib/tasks/resume-build/content";
import { RIGHT_NOW_STEPS as SLIDE_STEPS } from "@/lib/tasks/slide-deck/content";
import { RIGHT_NOW_STEPS as OPS_STEPS } from "@/lib/tasks/ops-report-packet/content";
import { MAIL_JOB_CARD_STEPS } from "@/lib/tasks/mail/content";

type Direction = { en: string; es: string };

function expectDirection(direction: Direction, en: RegExp, es: RegExp) {
  expect(direction.en).toMatch(en);
  expect(direction.es).toMatch(es);
}

/**
 * A learner should see every meaningful requirement before a completion gate
 * evaluates it. Keep mechanical anti-gibberish checks out of this matrix:
 * they are intentionally forgiving implementation safeguards, not objectives.
 */
describe("completion requirements are explicit in the Job Card", () => {
  it("names each revised content requirement in both languages", () => {
    expectDirection(SHIFT_STEPS[0], /11\s*AM/i, /11\s*AM/i);
    expectDirection(FORMULA_STEPS[2], /both formulas.*every crew row.*corrected total/i, /dos fórmulas.*cada fila.*total corregido/i);
    expectDirection(STATUS_STEPS[2], /total.*cc Jordan/i, /total.*copia a Jordan/i);
    expectDirection(COURSEWORK_STEPS[2], /heard.*check/i, /escuchaste.*revisarás/i);
    expectDirection(ENROLLMENT_STEPS[2], /BHCC.*program/i, /BHCC.*programa/i);
    expectDirection(RESEARCH_STEPS[2], /authors.*library database/i, /autores.*base de datos de la biblioteca/i);
    expectDirection(INCIDENT_STEPS[0], /hurt.*what you did/i, /lastimó.*qué hiciste/i);
    expectDirection(PRIORITY_STEPS[2], /acknowledge.*check.*Do not promise.*refund/i, /Reconoce.*revisarás.*No prometas.*reembolso/i);
    expectDirection(RESUME_STEPS[1], /at least three skills/i, /al menos tres habilidades/i);
    expectDirection(SLIDE_STEPS[2], /full sentence/i, /oración completa/i);
    expectDirection(OPS_STEPS[3], /weekly total.*Thursday.*uncovered/i, /total semanal.*jueves.*sin cobertura/i);
  });

  it("keeps Mail's checked writing requirements in its testable content", () => {
    expectDirection(MAIL_JOB_CARD_STEPS.writeForTask["call-out-sick"]!, /cannot work today's shift/i, /no puedes trabajar el turno de hoy/i);
    expectDirection(MAIL_JOB_CARD_STEPS.writeForTask["mail-send-link"]!, /schedule.*link.*Do not attach/i, /horario.*enlace.*No adjuntes/i);
    expectDirection(MAIL_JOB_CARD_STEPS.replyAllEdit, /professional.*yes or no.*Friday's 6 AM delivery/i, /profesional.*sí o no.*viernes.*6 AM/i);
  });
});

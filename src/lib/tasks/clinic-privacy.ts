import { BOOKED_VISIT, OPEN_SLOT } from "@/lib/tasks/appointment-scheduling/content";

/**
 * What counts as giving away Maya's visit at the Harborside Health front desk.
 *
 * The facts come from the story itself: the slot the learner booked her into
 * on Day 21 and the reason on that booking. When those change, these checks
 * change with them. They used to be hand-written and went stale: the call
 * blocked "2 pm" long after Maya's slot became 11:30, and neither check knew
 * about her cough.
 *
 * Two kinds of leak:
 * - A fact (her time, or why she came in) leaks however it is phrased, even
 *   inside "I can't tell you…".
 * - A confirmation ("she has an appointment", "she is here for…") leaks only
 *   when it is not itself refused ("I can't tell you if she has an
 *   appointment" is the right answer).
 */

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** "Follow-up, cough" → follow-up | cough, with "follow up" and "followup" too. */
const reasonWords = [BOOKED_VISIT.en, BOOKED_VISIT.es]
  .flatMap((line) => line.split(","))
  .map((w) => w.trim().toLowerCase())
  .filter(Boolean)
  .map((w) => escape(w).replace(/\\?-/g, "[- ]?"));

const [slotHour, slotMinute] = OPEN_SLOT.split(":");

const FACTS: RegExp[] = [
  new RegExp(`(^|[^\\p{L}])(${reasonWords.join("|")}|sick|ill|enferm[ao])(?![\\p{L}])`, "u"),
  // Her slot however it is written: 11:30, 11.30, 11 30.
  new RegExp(`\\b${slotHour}\\s*[:.\\s]\\s*${slotMinute}\\b`),
  // Any clock time is a visit time here: 2 pm, 10:00, 3.15.
  /\b\d{1,2}[:.]\d{2}\b/,
  /\b\d{1,2}\s*(am|pm|a\.\s?m\.?|p\.\s?m\.?)(?![a-z])/,
];

const CONFIRMS: RegExp[] = [
  // "Yes, she…" / "Sí, tiene…": a yes that answers the caller's question.
  /\byes\b[,!]?\s*(she|maya|today|at|it is|it's|there|she's)\b/,
  /(?:^|[^a-záéíóúñ])s[ií](?![a-záéíóúñ])[,!]?\s*(tiene|viene|hoy|a las|ella|maya|est[aá])/,
  /\b(she|maya)\s*(has|have|got|'s got)\s+(an?\s+)?(appointment|appt|visit|booking)/,
  /\b(she|maya)\s*('s|is|will be)\s+(coming|here|booked|scheduled|in today|in at)/,
  /\b(she|maya)\s+(comes?|will come|arrives?)\b/,
  /\b(she|maya)\s*('s|is)\s+here\s+(for|because|to)\b/,
  /\bhere\s+for\s+(her|a|the)\b/,
  /tiene\s+(una\s+)?cita/,
  /\b(maya|ella)\s+viene\b/,
  /est[aá]\s+aqu[ií]\s+(por|para)/,
  /viene\s+(por|para|a\s+las)/,
];

/** Words that turn what follows in the same clause into a refusal or a question. */
const REFUSED = /(can'?t|cannot|can not|cant|n't|\bnot\b|\bno\b|\bif\b|\bwhether\b|\bni\b|\bnunca\b)/;

const clauses = (body: string) =>
  body
    .toLowerCase()
    .replace(/[’`]/g, "'")
    .split(/[.!?;\n]+|,\s*(?:but|pero)\b/);

/** Mentions Maya's visit time or reason, however it is phrased. */
export function mentionsVisitFact(body: string): boolean {
  const t = body.toLowerCase().replace(/[’`]/g, "'");
  return FACTS.some((re) => re.test(t));
}

/** Confirms the visit outright, outside of a refusal. */
export function confirmsVisit(body: string): boolean {
  return clauses(body).some((clause) =>
    CONFIRMS.some((re) => {
      const m = re.exec(clause);
      return Boolean(m) && !REFUSED.test(clause.slice(0, m!.index));
    }),
  );
}

/** Gives away anything about Maya's visit: the thing both clinic privacy tasks teach against. */
export function sharesVisit(body: string): boolean {
  return mentionsVisitFact(body) || confirmsVisit(body);
}

/** Says no in beginner English too: can not, cant, not allowed, no puedo. */
export const REFUSES =
  /(can'?t|cannot|can not|cant|not able to|not allowed|no (te |le )?puedo|no (me )?est[aá] permitido|no se puede|no es posible)/;

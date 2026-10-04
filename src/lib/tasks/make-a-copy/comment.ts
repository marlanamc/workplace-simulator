import type { Localized } from "@/lib/task-types";
import { shortDate, monthDate } from "@/lib/story-dates";
import { STATUS_WEEK } from "../status-sheet";

/**
 * Wave 4, communication beyond email (Day 12). Renata's view-only template
 * has last week's date in its heading (C1). The learner cannot type there, and
 * should not: it is Renata's. They select the cell and leave her a comment
 * asking about it. Renata answers in the thread and fixes the heading, so
 * the copy they make next has the right week.
 *
 * Evidence: the comment is on C1, and it names the date or the week. Short
 * beginner English or Spanish passes; it does not have to be a full question.
 */
export const HEADING_CELL = "C1";
const WRONG_WEEK = STATUS_WEEK - 7;

export const HEADING_BEFORE = `Week of ${shortDate(WRONG_WEEK, "en")}`;
export const HEADING_AFTER = `Week of ${shortDate(STATUS_WEEK, "en")}`;

export type CommentProblem = "empty" | "wrong-cell" | "vague";

const fold = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const WEEK_WORDS = /\b(sep|sept|september|septiembre|date|fecha|week|semana|dia|day|7|14|wrong|old|last|pasada|vieja|incorrect\w*|correct\w*)\b/;

export function commentProblem(cell: string | null, text: string): CommentProblem | null {
  if (!text.trim()) return "empty";
  if (cell !== HEADING_CELL) return "wrong-cell";
  if (!WEEK_WORDS.test(fold(text))) return "vague";
  return null;
}

export const COMMENT_CORRECTIONS: Record<CommentProblem, Localized> = {
  empty: {
    en: "Write your comment first. For example: Should this say Sep 14?",
    es: `Primero escribe tu comentario. Por ejemplo: ¿Debe decir ${shortDate(STATUS_WEEK, "en")}?`,
  },
  "wrong-cell": {
    en: "Put the comment on the cell with the date, C1, so Renata knows what you mean.",
    es: "Pon el comentario en la celda con la fecha, C1, para que Renata sepa de qué hablas.",
  },
  vague: {
    en: "Say what looks wrong: the date or the week. For example: This says Sep 7. Is it Sep 14?",
    es: `Di qué se ve mal: la fecha o la semana. Por ejemplo: Dice ${shortDate(WRONG_WEEK, "en")}. ¿Es ${shortDate(STATUS_WEEK, "en")}?`,
  },
};

/** The Job Card lines for this step; the goal is new, so it is said in full even in Act II. */
export const COMMENT_STEPS: Record<"select" | "write", Localized> = {
  select: { en: "Check the date in the template heading. Select its cell and comment to Renata about the date.", es: "Revisa la fecha del encabezado de la plantilla. Selecciona esa celda y escribe un comentario a Renata sobre la fecha." },
  write: {
    en: "Write a short comment for Renata about the date. Then click Comment.",
    es: "Escribe un comentario corto para Renata sobre la fecha. Después haz clic en Comentar.",
  },
};

export const RENATA_REPLY: Localized = {
  en: `Good catch, thank you. It is the week of ${shortDate(STATUS_WEEK, "en")}. I fixed the template.`,
  es: `Bien visto, gracias. Es la semana del ${monthDate(STATUS_WEEK, "es")}. Ya arreglé la plantilla.`,
};

export const COMMENT_COPY: Localized<{ comment: string; placeholder: string; cancel: string; you: string; resolvedNote: string }> = {
  en: { comment: "Comment", placeholder: "Add a comment", cancel: "Cancel", you: "You", resolvedNote: "Renata fixed the heading." },
  es: { comment: "Comentar", placeholder: "Agrega un comentario", cancel: "Cancelar", you: "Tú", resolvedNote: "Renata arregló el encabezado." },
};

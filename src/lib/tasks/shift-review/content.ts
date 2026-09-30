import type { EventIntroCopy, Lang, Lesson, Localized, SubmissionContent } from "@/lib/task-types";
import { STORY_DAY_BY_LEVEL, shortDate } from "@/lib/story-dates";
import { affirms, denies, normalizeReply } from "@/lib/grading/meaning";

/**
 * What actually happened on the shift, shown on the form itself (see
 * `ShiftReviewTask`). This used to be defined here and read by nothing, so the
 * Job Card asked the learner to "make sure it mentions 11 AM" about an 11 AM
 * that appeared nowhere on screen — a note about a shift they never saw.
 */
export const SHIFT_FACTS: Record<Lang, { heading: string; lines: string[] }> = {
  en: {
    heading: "What happened on your shift",
    lines: ["The shift ran smoothly.", "It got a little busy around 11 AM."],
  },
  es: {
    heading: "Lo que pasó en tu turno",
    lines: ["El turno salió bien.", "Se puso un poco ocupado alrededor de las 11 AM."],
  },
};

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "📝",
    kicker: "Friday, end of shift.",
    headline: "Maria has to leave early.",
    body: "Write a short note about the shift for her to read. Use what happened on your shift: say what happened, and at what time. You don't need to invent anything else.",
    cta: "Write the note",
  },
  es: {
    emoji: "📝",
    kicker: "Viernes, fin de turno.",
    headline: "Maria tiene que irse temprano.",
    body: "Escríbele una nota corta del turno para que la lea. Usa lo que pasó en tu turno: di qué pasó y a qué hora. No hace falta inventar nada más.",
    cta: "Escribir la nota",
  },
};

export const REVIEW_COPY: Record<Lang, {
  heading: string;
  /** Story Friday for this sitting — same day as Portal schedule + payday. */
  date: string;
  dateLabel: string;
  summaryLabel: string;
  writeHere: string;
  submit: string;
  sentKicker: string;
  doneTitle: string;
  doneBody: string;
  badgeName: string;
  badgeWhere: string;
  tryAgain: string;
  backToDesk: string;
  lessonKicker: string;
  tipLabel: string;
  gotIt: string;
  shortNudge: string;
  factsNudge: string;
}> = {
  en: {
    heading: "Shift notes",
    date: `Friday, ${shortDate(STORY_DAY_BY_LEVEL.level3, "en")}`,
    dateLabel: "Shift date",
    summaryLabel: "Shift summary",
    writeHere: "How did your shift go?",
    submit: "Submit",
    sentKicker: "Note submitted",
    doneTitle: "You left a clear end-of-shift note.",
    doneBody:
      "You restated what happened in your own words. That is what a short shift note is for.",
    badgeName: "Write a short shift summary",
    badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "I understand. Back to my task",
    shortNudge: "Write a full sentence. One or two is enough.",
    factsNudge: "Look at What happened on your shift. Say what time it got busy. The rest can be in your own words.",
  },
  es: {
    heading: "Notas del turno",
    date: `Viernes, ${shortDate(STORY_DAY_BY_LEVEL.level3, "es")}`,
    dateLabel: "Fecha del turno",
    summaryLabel: "Resumen del turno",
    writeHere: "¿Cómo te fue en el turno?",
    submit: "Enviar",
    sentKicker: "Nota enviada",
    doneTitle: "Dejaste una nota clara de fin de turno.",
    doneBody:
      "Repetiste lo que pasó con tus palabras. Para eso sirve una nota corta de turno.",
    badgeName: "Escribir un resumen corto del turno",
    badgeWhere: "Cuenta para: Oficina · Servicio de alimentos",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
    shortNudge: "Escribe una oración completa. Una o dos bastan.",
    factsNudge: "Mira Lo que pasó en tu turno. Di a qué hora se puso ocupado. Lo demás puede estar en tus propias palabras.",
  },
};

export const STARTERS: Record<Lang, string[]> = {
  en: [
    "Hi Maria,\nHere is a note about today's shift.",
    "It got busy around",
    "Nothing else unusual to report. Thanks.",
  ],
  es: [
    "Hola Maria,\nTe dejo una nota sobre el turno de hoy.",
    "Se puso ocupado alrededor de las",
    "Nada más raro que reportar. Gracias.",
  ],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "End-of-shift notes",
      s: [
        "Write only what you know. You do not need to invent a story.",
        "Two or three sentences is enough.",
        "Make sure your note mentions 11 AM.",
      ],
      tip: "Leads skim these. A clear note that mentions 11 AM is enough.",
    },
  ],
  es: [
    {
      t: "Notas de fin de turno",
      s: [
        "Escribe solo lo que sabes. No hace falta inventar una historia.",
        "Dos o tres frases bastan.",
        "Asegúrate de mencionar las 11 AM.",
      ],
      tip: "Los líderes leen esto de pasada. Una nota clara que menciona las 11 AM basta.",
    },
  ],
};

/**
 * Lenient by design: a note passes once it is a real sentence and names the
 * 11 AM moment.
 *
 * There used to be a 28-character floor that nothing on screen mentioned, so
 * "Busy at 11 am." — which follows the instruction exactly — was rejected with
 * "Add a little more." The floor is a word count now, low enough that any real
 * sentence clears it and only a bare "11" does not.
 *
 * `once` is Spanish for eleven and an ordinary English word, so it only counts
 * as the hour in Spanish. Before this, "It got busy once around lunch" passed
 * without mentioning 11 at all.
 */
export function shiftSummaryIsComplete(text: string, lang: Lang): boolean {
  const t = normalizeReply(text);
  if (t.split(/\s+/).filter(Boolean).length < 3) return false;
  // Any way of writing the hour: 11, 11am, 11AM, 11:00, 11h, 11.00. Wave 5
  // found "busy at 11am" refused, because `\b11\b` never ends before "am".
  // Not $11, 11 minutes or 11 people.
  const digits = /(?<![\d:.$])11(?!\d)(?!\s*(?:%|dollars?|dolares?|minutes?|minutos?|mins?\b|people|personas?|customers?|clientes?))/;
  const word = lang === "es" ? /\bonce\b/ : /\beleven\b/;
  if (!digits.test(t) && !word.test(t)) return false;
  // The facts say it got busy. "It was not busy at 11" says the opposite,
  // unless the note also says it did get busy.
  return !(denies(t, BUSY) && !affirms(t, BUSY));
}

const BUSY = /\b(busy|bussy|busi|rush|crowded|full|ocupad[oa]s?|lleno|llena|mucha gente|muchos clientes)\b/;

export function describeSubmission(summary: string, lang: Lang): SubmissionContent {
  return {
    lang,
    fields: [
      {
        label: lang === "en" ? "Shift summary" : "Resumen del turno",
        value: summary.trim(),
      },
    ],
  };
}

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Write a short shift summary. Say what happened, and at what time.",
    es: "Escribe un resumen corto del turno. Di qué pasó y a qué hora.",
  },
  // Once the note has words in it (Wave 5 F-5: the card never said Submit,
  // and Submit sits below the fold).
  {
    en: "Click Submit.",
    es: "Haz clic en Enviar.",
  },
];

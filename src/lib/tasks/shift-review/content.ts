import type { EventIntroCopy, Lang, Lesson, Localized, SubmissionContent } from "@/lib/task-types";

/** Context for the note — students do not need to invent a day. */
export const SHIFT_FACTS = {
  en: {
    overall: "ran smoothly",
    rush: "a little busy around 11 AM",
  },
  es: {
    overall: "salió bien",
    rush: "un poco ocupado alrededor de las 11 AM",
  },
} as const;

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "📝",
    kicker: "Friday, end of shift.",
    headline: "Maria has to leave early.",
    body: "Write a short note about the shift for her to read. Include that something happened around 11 AM. You don't need to invent anything else.",
    cta: "Write the note",
  },
  es: {
    emoji: "📝",
    kicker: "Viernes, fin de turno.",
    headline: "Maria tiene que irse temprano.",
    body: "Escríbele una nota corta del turno para que la lea. Incluye que algo pasó alrededor de las 11 AM. No hace falta inventar nada más.",
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
    date: "Friday, Aug 28",
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
    shortNudge: "Add a little more. A couple of sentences is enough.",
    factsNudge: "Mention 11 in your note. The rest can be in your own words.",
  },
  es: {
    heading: "Notas del turno",
    date: "Viernes, 28 ago",
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
    shortNudge: "Agrega un poco más. Un par de frases bastan.",
    factsNudge: "Menciona las 11 en tu nota. Lo demás puede estar en tus propias palabras.",
  },
};

export const STARTERS: Record<Lang, string[]> = {
  en: [
    "Hi Maria,\nI am leaving a note about the 11 AM part of the shift.",
    "Around 11 AM, things needed my attention.",
    "Nothing else unusual to report. Thanks.",
  ],
  es: [
    "Hola Maria,\nDejo una nota sobre la parte del turno de las 11 AM.",
    "Alrededor de las 11 AM, las cosas necesitaron mi atención.",
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
 * Lenient: a substantive note only needs to mention the 11 AM moment.
 */
export function shiftSummaryIsComplete(text: string): boolean {
  const t = text.trim().toLowerCase();
  if (t.length < 28) return false;
  return /\b(11|eleven|once|11\s*am|11:00)\b/.test(t);
}

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
    en: "Write a short shift summary. Make sure it mentions 11 AM.",
    es: "Escribe un resumen corto del turno. Asegúrate de mencionar las 11 AM.",
  },
];

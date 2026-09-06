import type { EventIntroCopy, Lang, Lesson, Localized, SubmissionContent } from "@/lib/task-types";

/** Planted facts for the note — students restate these; they do not invent a day. */
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
    body: "Write a short note about the shift for her to read. It ran smoothly and got a little busy around 11 AM. You don't need to invent anything else.",
    cta: "Write the note",
  },
  es: {
    emoji: "📝",
    kicker: "Viernes, fin de turno.",
    headline: "Maria tiene que irse temprano.",
    body: "Escríbele una nota corta del turno para que la lea. Salió bien y se puso un poco ocupado alrededor de las 11 AM. No hace falta inventar nada más.",
    cta: "Escribir la nota",
  },
};

export const REVIEW_COPY: Record<Lang, {
  heading: string;
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
    factsNudge:
      "Include both facts: the shift ran smoothly, and it got a little busy around 11 AM.",
  },
  es: {
    heading: "Notas del turno",
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
    factsNudge:
      "Incluye los dos datos: el turno salió bien, y se puso un poco ocupado alrededor de las 11 AM.",
  },
};

export const STARTERS: Record<Lang, string[]> = {
  en: [
    "Hi Maria,\nToday's shift ran smoothly.",
    "It got a little busy around 11 AM.",
    "Nothing else unusual to report. Thanks.",
  ],
  es: [
    "Hola Maria,\nEl turno de hoy salió bien.",
    "Se puso un poco ocupado alrededor de las 11 AM.",
    "Nada más raro que reportar. Gracias.",
  ],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "End-of-shift notes",
      s: [
        "Use the facts you were given. You do not need to invent a story.",
        "Two or three sentences is enough.",
        "Say the pace and when the busy moment was.",
      ],
      tip: "Leads skim these. Restating the facts clearly beats making something up.",
    },
  ],
  es: [
    {
      t: "Notas de fin de turno",
      s: [
        "Usa los datos que te dieron. No hace falta inventar una historia.",
        "Dos o tres frases bastan.",
        "Di el ritmo y cuándo fue el momento ocupado.",
      ],
      tip: "Los líderes leen esto de pasada. Repetir los datos con claridad gana a inventar.",
    },
  ],
};

/**
 * Lenient: the note should include the planted pace (smooth/fine) and the
 * busy moment around 11.
 */
export function shiftSummaryIsComplete(text: string): boolean {
  const t = text.trim().toLowerCase();
  if (t.length < 28) return false;
  const smooth =
    /\b(smooth|fine|normal|quiet|well|ok|okay|good|sali[oó]|bien|tranquil|normal)\w*\b/.test(t) ||
    /ran\s+smooth/.test(t);
  const busyRush =
    /\b(busy|ocupad|rush|pico|movid)\w*\b/.test(t) &&
    /\b(11|eleven|once|11\s*am|11:00)\b/.test(t);
  return smooth && busyRush;
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
    en: "The shift ran smoothly and got a little busy around 11 AM. Write a short summary.",
    es: "El turno salió bien y se puso un poco ocupado alrededor de las 11 AM. Escribe un resumen corto.",
  },
];

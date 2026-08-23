import type { ConfidenceOption, EventIntroCopy, Lang } from "@/lib/task-types";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "☀️",
    kicker: "Job 9 of 9",
    headline: "A normal shift. Nothing new.",
    body: "No new tools today - just three things you already know how to do, back to back.",
    cta: "Start the shift",
  },
  es: {
    emoji: "☀️",
    kicker: "Trabajo 9 de 9",
    headline: "Un turno normal. Nada nuevo.",
    body: "Hoy no hay herramientas nuevas, solo tres cosas que ya sabes hacer, una tras otra.",
    cta: "Empezar el turno",
  },
};

export interface ReviewBeat {
  key: string;
  emoji: string;
  prompt: Record<Lang, string>;
  options: Record<Lang, { label: string; correct: boolean }[]>;
  wrongHint: Record<Lang, string>;
}

export const BEATS: ReviewBeat[] = [
  {
    key: "schedule",
    emoji: "📅",
    prompt: {
      en: "Where do you go to find your shift for the week?",
      es: "¿A dónde vas para encontrar tu turno de la semana?",
    },
    options: {
      en: [
        { label: "The Employee Portal, Schedule tab", correct: true },
        { label: "Your personal phone calendar", correct: false },
      ],
      es: [
        { label: "El Portal del empleado, pestaña Horario", correct: true },
        { label: "Tu calendario personal del teléfono", correct: false },
      ],
    },
    wrongHint: {
      en: "Work shifts live in the Employee Portal, not your personal calendar.",
      es: "Los turnos de trabajo están en el Portal del empleado, no en tu calendario personal.",
    },
  },
  {
    key: "timeclock",
    emoji: "🕐",
    prompt: {
      en: "Your shift just ended. What's the first thing you do?",
      es: "Tu turno acaba de terminar. ¿Qué haces primero?",
    },
    options: {
      en: [
        { label: "Clock out and check the hours", correct: true },
        { label: "Just leave, it clocks out on its own", correct: false },
      ],
      es: [
        { label: "Marcar salida y revisar las horas", correct: true },
        { label: "Solo irte, se marca solo", correct: false },
      ],
    },
    wrongHint: {
      en: "You have to clock out yourself, then check the hours look right.",
      es: "Tienes que marcar tu salida tú mismo, y luego revisar que las horas estén bien.",
    },
  },
  {
    key: "paystub",
    emoji: "💵",
    prompt: {
      en: "How do you know your last paycheck was correct?",
      es: "¿Cómo sabes que tu último cheque fue correcto?",
    },
    options: {
      en: [
        { label: "Find your pay stub and check the hours and total", correct: true },
        { label: "Assume it's right - it's usually the same", correct: false },
      ],
      es: [
        { label: "Buscar tu recibo de pago y revisar las horas y el total", correct: true },
        { label: "Suponer que está bien, casi siempre es igual", correct: false },
      ],
    },
    wrongHint: {
      en: "Check your own pay stub. Leads catch mistakes instead of assuming.",
      es: "Revisa tu propio recibo de pago. Los líderes detectan errores en vez de suponer.",
    },
  },
];

export const REVIEW_COPY: Record<Lang, {
  heading: string;
  subhead: string;
  continueLabel: string;
  sentKicker: string;
  doneBody: string;
  badgeName: string;
  badgeWhere: string;
  confidenceQ: string;
  tryAgain: string;
  backToDesk: string;
}> = {
  en: {
    heading: "A Normal Shift",
    subhead: "Three quick checks. Nothing new to learn today.",
    continueLabel: "Continue",
    sentKicker: "Shift complete",
    doneBody: "Three things you already knew how to do, all in one shift. No new tools, no coaching needed - that's what a normal day looks like now.",
    badgeName: "A normal shift, start to finish",
    badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    confidenceQ: "How do you feel about a normal shift like this one?",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
  },
  es: {
    heading: "Un turno normal",
    subhead: "Tres revisiones rápidas. Hoy no hay nada nuevo que aprender.",
    continueLabel: "Continuar",
    sentKicker: "Turno completo",
    doneBody: "Tres cosas que ya sabías hacer, todas en un turno. Sin herramientas nuevas, sin necesitar ayuda: así se ve un día normal ahora.",
    badgeName: "Un turno normal, de principio a fin",
    badgeWhere: "Cuenta para: Oficina · Servicio de alimentos",
    confidenceQ: "¿Cómo te sientes con un turno normal como este?",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
  },
};

export const CONFIDENCE_OPTIONS: Record<Lang, ConfidenceOption[]> = {
  en: [
    { label: "Still unsure", reply: "That's honest. Do the task one more time, or come on Wednesday and we can do it together." },
    { label: "I could try", reply: "Good. Try it again without Help. That is how it will feel at work." },
    { label: "I can do this", reply: "You just did three jobs in a row with no help. That's what a real normal shift feels like." },
  ],
  es: [
    { label: "Todavía dudo", reply: "Eso es honesto. Hazlo otra vez, o ven el miércoles y lo hacemos juntos." },
    { label: "Podría intentarlo", reply: "Bien. Inténtalo otra vez sin Ayuda. Así se siente en el trabajo." },
    { label: "Puedo hacerlo", reply: "Acabas de hacer tres trabajos seguidos sin ayuda. Así se siente un turno normal de verdad." },
  ],
};

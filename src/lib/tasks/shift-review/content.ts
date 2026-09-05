import type { EventIntroCopy, Lang, Localized } from "@/lib/task-types";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "☀️",
    kicker: "Monday. A normal shift.",
    headline: "A normal shift. Nothing new.",
    body: "No new tools today - just three things you already know how to do, back to back.",
    cta: "Start the shift",
  },
  es: {
    emoji: "☀️",
    kicker: "Lunes. Un turno normal.",
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
      en: "You just arrived for your shift. What's the first thing you do?",
      es: "Acabas de llegar a tu turno. ¿Qué haces primero?",
    },
    options: {
      en: [
        { label: "Clock in and check the time", correct: true },
        { label: "Start working. The clock will catch you", correct: false },
      ],
      es: [
        { label: "Marcar entrada y revisar la hora", correct: true },
        { label: "Empezar a trabajar. El reloj te registra solo", correct: false },
      ],
    },
    wrongHint: {
      en: "You have to clock in yourself, then check the time looks right.",
      es: "Tienes que marcar tu entrada tú mismo, y luego revisar que la hora esté bien.",
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
  tryAgain: string;
  backToDesk: string;
}> = {
  en: {
    heading: "A Normal Shift",
    subhead: "Three quick checks. Nothing new to learn today.",
    continueLabel: "Continue",
    sentKicker: "Shift complete",
    doneBody: "You reviewed where to find your schedule, when to clock in, and what to check on your pay stub.",
    badgeName: "A normal shift, start to finish",
    badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
  },
  es: {
    heading: "Un turno normal",
    subhead: "Tres revisiones rápidas. Hoy no hay nada nuevo que aprender.",
    continueLabel: "Continuar",
    sentKicker: "Turno completo",
    doneBody: "Repasaste dónde encontrar tu horario, cuándo marcar entrada y qué revisar en tu recibo de pago.",
    badgeName: "Un turno normal, de principio a fin",
    badgeWhere: "Cuenta para: Oficina · Servicio de alimentos",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
  },
};

/** The persistent "what to do right now" line, one per step of this job. */
export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Work through the shift, one thing at a time.",
    es: "Trabaja el turno, una cosa a la vez.",
  },
];

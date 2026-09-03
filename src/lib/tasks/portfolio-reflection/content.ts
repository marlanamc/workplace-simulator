import type { Lang, Lesson, Localized } from "@/lib/task-types";

/**
 * Level 27 — Where You've Been. The closing level of the written curriculum.
 * No new software skill: look back across every award earned, answer a few
 * reflection prompts, and read a short summary the learner could show a real
 * employer or a college advisor.
 *
 * The summary is built in-app from the learner's own earned tracks. There is
 * no certificate page — the retired /certificate route is a redirect, and the
 * in-game Awards Case is the record now.
 *
 * Teacher-check in name only: the app checks every prompt has an answer.
 * Nothing here is graded.
 */

export const REFLECTION_COPY: Record<Lang, {
  appName: string;
  helpBtn: string;
  reviewTitle: string;
  reviewIntro: string;
  noAwardsYet: string;
  reflectTitle: string;
  reflectIntro: string;
  answerPlaceholder: string;
  submit: string;
  needAll: string;
  summaryTitle: string;
  summaryIntro: string;
  canDoHeading: string;
  reflectionHeading: string;
  sentKicker: string;
  tryAgain: string;
  backToDesk: string;
  lessonKicker: string;
  tipLabel: string;
  gotIt: string;
}> = {
  en: {
    appName: "Recap",
    helpBtn: "Help me with this step",
    reviewTitle: "Everything you've done",
    reviewIntro: "Every award you've earned, from your first day to here.",
    noAwardsYet: "Your awards will show here once you've finished a track.",
    reflectTitle: "Look back",
    reflectIntro: "Four short questions. A sentence or two each.",
    answerPlaceholder: "Your answer…",
    submit: "See my summary",
    needAll: "Answer all four questions — a few words each is fine.",
    summaryTitle: "Your summary",
    summaryIntro: "This is yours. Share it with whoever's useful — a friend, an employer, an advisor.",
    canDoHeading: "What I can do now",
    reflectionHeading: "In my own words",
    sentKicker: "Summary ready",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
  },
  es: {
    appName: "Resumen",
    helpBtn: "Ayúdame con este paso",
    reviewTitle: "Todo lo que has hecho",
    reviewIntro: "Cada premio que ganaste, desde tu primer día hasta aquí.",
    noAwardsYet: "Tus premios aparecerán aquí cuando termines un tramo.",
    reflectTitle: "Mira atrás",
    reflectIntro: "Cuatro preguntas cortas. Una o dos oraciones cada una.",
    answerPlaceholder: "Tu respuesta…",
    submit: "Ver mi resumen",
    needAll: "Responde las cuatro preguntas — unas palabras cada una está bien.",
    summaryTitle: "Tu resumen",
    summaryIntro: "Esto es tuyo. Compártelo con quien te sirva — un amigo, un empleador, un asesor.",
    canDoHeading: "Lo que ya puedo hacer",
    reflectionHeading: "En mis propias palabras",
    sentKicker: "Resumen listo",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
  },
};

export const PROMPTS: Localized[] = [
  {
    en: "Out of everything in this program, what do you feel most ready for at a real job?",
    es: "De todo lo que hiciste en este programa, ¿para qué te sientes más listo en un trabajo de verdad?",
  },
  {
    en: "What are you still building confidence in?",
    es: "¿En qué todavía estás ganando confianza?",
  },
  {
    en: "If you could tell yourself something on day one, what would it be?",
    es: "Si pudieras decirte algo el primer día, ¿qué sería?",
  },
  {
    en: "What would you tell a friend thinking about starting this program?",
    es: "¿Qué le dirías a un amigo que está pensando en empezar este programa?",
  },
];

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "This one is a look back, not a test",
      s: [
        "The top of the screen lists every award you've earned. Scroll through it — that's a real record of what you can do.",
        "Then answer the four questions. There are no wrong answers. A sentence or two each is plenty.",
        "The summary it makes is yours to keep. It says, in plain words, what you learned to do here.",
      ],
      tip: "If you want to talk through your answers with the teacher during office hours, that's the real value of this level. It's not required.",
    },
  ],
  es: [
    {
      t: "Este es un repaso, no un examen",
      s: [
        "Arriba en la pantalla está la lista de cada premio que ganaste. Recórrela — es un registro real de lo que puedes hacer.",
        "Luego responde las cuatro preguntas. No hay respuestas incorrectas. Una o dos oraciones cada una es suficiente.",
        "El resumen que hace es tuyo para guardar. Dice, en palabras simples, lo que aprendiste a hacer aquí.",
      ],
      tip: "Si quieres conversar tus respuestas con el maestro en horas de oficina, ese es el verdadero valor de este nivel. No es obligatorio.",
    },
  ],
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  { en: "Look through every award you've earned.", es: "Repasa cada premio que ganaste." },
  { en: "Answer the four questions.", es: "Responde las cuatro preguntas." },
  { en: "Read your summary. It's yours to share.", es: "Lee tu resumen. Es tuyo para compartir." },
];

export function reflectionComplete(answers: string[]): boolean {
  if (answers.length < PROMPTS.length) return false;
  return answers.every((a) => a.trim().split(/\s+/).filter(Boolean).length >= 3);
}

export function portfolioReflectionPasses(answers: string[]): boolean {
  return reflectionComplete(answers);
}

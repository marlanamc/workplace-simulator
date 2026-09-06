import type { Lang, Lesson, Localized, SubmissionContent } from "@/lib/task-types";

/**
 * "The Interview" — the fourth step of the getting-hired arc. Anita Raman asks
 * four common interview questions; the learner types an answer to each, then
 * picks one question to ask back. Teacher-check: the app confirms every answer
 * is real; it does not grade them. A spoken mode is planned (Phase 4).
 */

export const INTERVIEW_COPY: Record<Lang, {
  appName: string;
  interviewer: string;
  interviewerTitle: string;
  heading: string;
  intro: string;
  answerHint: string;
  listeningForLabel: string;
  askBackLabel: string;
  askBackHint: string;
  finish: string;
  needAnswers: string;
  needAskBack: string;
  sentKicker: string;
  doneTitle: string;
  doneBody: string;
  tryAgain: string;
  backToDesk: string;
  lessonKicker: string;
  tipLabel: string;
  gotIt: string;
}> = {
  en: {
    appName: "Interview — Office Administrator",
    interviewer: "Anita Raman",
    interviewerTitle: "Operations Director, Harborside HQ",
    heading: "Practice interview",
    intro: "Four questions. Answer each in a few sentences — the way you'd say it out loud. There's no trick here; say what's true.",
    answerHint: "A few sentences. Real examples beat general statements.",
    listeningForLabel: "What she's listening for",
    askBackLabel: "One question to ask her",
    askBackHint: "Pick one, or write your own. Asking a question shows you're serious.",
    finish: "Finish the interview",
    needAnswers: "Answer every question with a few sentences before you finish.",
    needAskBack: "Choose or write one question to ask before you finish.",
    sentKicker: "Interview done",
    doneTitle: "You got through the interview.",
    doneBody: "Four honest answers and a question of your own. That's what a good interview looks like. Anita said she'd be in touch soon.",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
  },
  es: {
    appName: "Entrevista — Administrador de Oficina",
    interviewer: "Anita Raman",
    interviewerTitle: "Directora de Operaciones, Harborside HQ",
    heading: "Entrevista de práctica",
    intro: "Cuatro preguntas. Responde cada una en unas oraciones — como lo dirías en voz alta. No hay trampa; di lo que es verdad.",
    answerHint: "Unas oraciones. Los ejemplos reales valen más que las frases generales.",
    listeningForLabel: "Qué está escuchando ella",
    askBackLabel: "Una pregunta para hacerle a ella",
    askBackHint: "Elige una, o escribe la tuya. Hacer una pregunta muestra que vas en serio.",
    finish: "Terminar la entrevista",
    needAnswers: "Responde cada pregunta con unas oraciones antes de terminar.",
    needAskBack: "Elige o escribe una pregunta para hacer antes de terminar.",
    sentKicker: "Entrevista terminada",
    doneTitle: "Pasaste la entrevista.",
    doneBody: "Cuatro respuestas honestas y una pregunta tuya. Así se ve una buena entrevista. Anita dijo que se comunicaría pronto.",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
  },
};

export interface InterviewQuestion {
  key: string;
  question: Localized;
  listeningFor: Localized;
  starters: Localized<string[]>;
}

export const QUESTIONS: InterviewQuestion[] = [
  {
    key: "about-you",
    question: {
      en: "Tell me about yourself.",
      es: "Cuéntame sobre ti.",
    },
    listeningFor: {
      en: "A short work story, not your life story. Where you started, where you are now.",
      es: "Una historia corta de trabajo, no de tu vida. Dónde empezaste, dónde estás ahora.",
    },
    starters: {
      en: [
        "I started with everyday tasks in the workplace simulator.",
        "I practiced workplace tools in a simulated cafe.",
        "I practiced reading schedules, checking totals, and sending clear messages.",
        "I'm looking for a full-time office role where I can keep growing.",
      ],
      es: [
        "Empecé con tareas cotidianas en el simulador de trabajo.",
        "Practiqué herramientas de trabajo en un café simulado.",
        "Practiqué leer horarios, revisar totales y enviar mensajes claros.",
        "Busco un puesto de oficina de tiempo completo donde pueda seguir creciendo.",
      ],
    },
  },
  {
    key: "why-role",
    question: {
      en: "Why do you want this role?",
      es: "¿Por qué quieres este puesto?",
    },
    listeningFor: {
      en: "A reason that's about the work, not just the paycheck.",
      es: "Una razón sobre el trabajo, no solo sobre el sueldo.",
    },
    starters: {
      en: [
        "I like keeping things organized so a team can do their work.",
        "I already use the tools this job needs.",
        "I want steady daytime hours and room to learn.",
      ],
      es: [
        "Me gusta mantener todo organizado para que un equipo pueda trabajar.",
        "Ya uso las herramientas que este trabajo necesita.",
        "Quiero un horario estable de día y espacio para aprender.",
      ],
    },
  },
  {
    key: "problem",
    question: {
      en: "Tell me about a time you solved a problem at work.",
      es: "Cuéntame de una vez que resolviste un problema en el trabajo.",
    },
    listeningFor: {
      en: "One real situation: what happened, what you did, how it turned out.",
      es: "Una situación real: qué pasó, qué hiciste, cómo terminó.",
    },
    starters: {
      en: [
        "One Saturday we had no one for the closing shift.",
        "I checked who had hours to spare and asked them to cover.",
        "I told my manager before it became a bigger problem.",
      ],
      es: [
        "Un sábado no teníamos a nadie para el turno de cierre.",
        "Revisé quién tenía horas de sobra y le pedí que cubriera.",
        "Le avisé a mi gerente antes de que fuera un problema más grande.",
      ],
    },
  },
  {
    key: "weakness",
    question: {
      en: "What's something you're working on getting better at?",
      es: "¿En qué estás trabajando para mejorar?",
    },
    listeningFor: {
      en: "An honest answer plus what you're doing about it. Not \"I work too hard.\"",
      es: "Una respuesta honesta y qué estás haciendo al respecto. No \"trabajo demasiado.\"",
    },
    starters: {
      en: [
        "English is my second language, and long emails still take me time.",
        "I'm getting faster by using templates and reading them out loud.",
        "I ask a coworker to check anything important before I send it.",
      ],
      es: [
        "El inglés es mi segundo idioma, y los correos largos todavía me toman tiempo.",
        "Voy más rápido usando plantillas y leyéndolos en voz alta.",
        "Le pido a un compañero que revise lo importante antes de enviarlo.",
      ],
    },
  },
];

export const ASK_BACK_CHOICES: { key: string; text: Localized }[] = [
  {
    key: "day",
    text: {
      en: "What does a normal day in this role look like?",
      es: "¿Cómo es un día normal en este puesto?",
    },
  },
  {
    key: "team",
    text: {
      en: "Who would I work with most closely?",
      es: "¿Con quién trabajaría más de cerca?",
    },
  },
  {
    key: "success",
    text: {
      en: "What would a good first three months look like?",
      es: "¿Cómo se verían unos buenos primeros tres meses?",
    },
  },
  {
    key: "next",
    text: {
      en: "What are the next steps after today?",
      es: "¿Cuáles son los próximos pasos después de hoy?",
    },
  },
];

export function answerLooksReal(answer: string): boolean {
  return answer.trim().split(/\s+/).filter(Boolean).length >= 6;
}

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Answering interview questions",
      s: [
        "Most questions want a short story: what happened, what you did, how it went. One real example is enough.",
        "It's fine to take a second before you answer. \"Let me think about that\" is a good sentence.",
        "Ask at least one question at the end. It shows you actually want the job.",
      ],
      tip: "You do not have to be perfect. Honest and specific beats smooth and vague.",
    },
  ],
  es: [
    {
      t: "Responder preguntas de entrevista",
      s: [
        "La mayoría de las preguntas quieren una historia corta: qué pasó, qué hiciste, cómo salió. Un ejemplo real basta.",
        "Está bien tomarte un segundo antes de responder. \"Déjame pensarlo\" es una buena frase.",
        "Haz al menos una pregunta al final. Muestra que de verdad quieres el trabajo.",
      ],
      tip: "No tienes que ser perfecto. Honesto y específico vale más que fluido y vago.",
    },
  ],
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Answer each question in a few sentences.",
    es: "Responde cada pregunta en unas oraciones.",
  },
  {
    en: "Pick one question to ask her, then finish.",
    es: "Elige una pregunta para hacerle, luego termina.",
  },
];

/** What the teacher sees: every interview answer and the question the learner asked. */
export function describeSubmission(
  fields: { answers: Record<string, string>; askBack: string },
  lang: Lang,
): SubmissionContent {
  const c = INTERVIEW_COPY[lang];
  return {
    lang,
    fields: [
      ...QUESTIONS.map((q) => ({
        label: q.question[lang],
        value: fields.answers[q.key] ?? "",
      })),
      { label: c.askBackLabel, value: fields.askBack },
    ],
  };
}

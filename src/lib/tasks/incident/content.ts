import type { ConfidenceOption, EventIntroCopy, Lang, Lesson } from "@/lib/task-types";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "⚠️",
    kicker: "10 minutes ago",
    headline: "Oh no! A customer just slipped near the front door.",
    body: "Nobody was hurt, but the floor was wet from a spill. Your shift lead needs a short written report on what happened, while it's still fresh.",
    cta: "Write the report",
  },
  es: {
    emoji: "⚠️",
    kicker: "Hace 10 minutos",
    headline: "¡Uy no! Un cliente se acaba de resbalar cerca de la puerta.",
    body: "Nadie se lastimó, pero el piso estaba mojado por un derrame. Tu líder de turno necesita un reporte breve de lo que pasó, mientras lo recuerdas bien.",
    cta: "Escribir el reporte",
  },
};

export const INCIDENT_COPY: Record<Lang, {
  heading: string;
  helpBtn: string;
  langBtn: string;
  scenarioKicker: string;
  scenario: string;
  whenLabel: string;
  whereLabel: string;
  whatLabel: string;
  writeHere: string;
  startersLabel: string;
  submitTo: string;
  submit: string;
  sentKicker: string;
  doneTitle: string;
  doneBody: string;
  badgeName: string;
  badgeWhere: string;
  confidenceQ: string;
  tryAgain: string;
  backToDesk: string;
  lessonKicker: string;
  tipLabel: string;
  gotIt: string;
  askPerson: string;
}> = {
  en: {
    heading: "Incident Report",
    helpBtn: "Help me with this step",
    langBtn: "Español",
    scenarioKicker: "What happened",
    scenario: "A customer slipped near the front door about ten minutes ago. Nobody was hurt, but the floor was wet from a spill. Your shift lead needs a short written report.",
    whenLabel: "When",
    whereLabel: "Where",
    whatLabel: "What happened",
    writeHere: "Write what happened, in order…",
    startersLabel: "Sentence starters",
    submitTo: "Submit to",
    submit: "Submit report",
    sentKicker: "Report submitted",
    doneTitle: "You filed an incident report.",
    doneBody: "Maria has what happened, in order, with the time and place. That is what a written report needs. No more, no less.",
    badgeName: "Write an incident report",
    badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    confidenceQ: "How do you feel about writing something up if something goes wrong at work?",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
    askPerson: "Ask a person instead",
  },
  es: {
    heading: "Reporte de incidente",
    helpBtn: "Ayúdame con este paso",
    langBtn: "English",
    scenarioKicker: "Qué pasó",
    scenario: "Un cliente se resbaló cerca de la puerta principal hace unos diez minutos. Nadie se lastimó, pero el piso estaba mojado por un derrame. Tu líder de turno necesita un reporte escrito breve.",
    whenLabel: "Cuándo",
    whereLabel: "Dónde",
    whatLabel: "Qué pasó",
    writeHere: "Escribe qué pasó, en orden…",
    startersLabel: "Frases de ayuda",
    submitTo: "Enviar a",
    submit: "Enviar reporte",
    sentKicker: "Reporte enviado",
    doneTitle: "Presentaste un reporte de incidente.",
    doneBody: "Maria tiene lo que pasó, en orden, con la hora y el lugar. Eso es exactamente lo que necesita un reporte escrito. Ni más, ni menos.",
    badgeName: "Escribir un reporte de incidente",
    badgeWhere: "Cuenta para: Oficina · Servicio de alimentos",
    confidenceQ: "¿Cómo te sientes de escribir un reporte si algo sale mal en el trabajo?",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
    askPerson: "Mejor preguntar a una persona",
  },
};

export const DEFAULTS: Record<Lang, { when: string; where: string }> = {
  en: { when: "Today, 2:15 PM", where: "Front entrance" },
  es: { when: "Hoy, 2:15 PM", where: "Entrada principal" },
};

export const STARTERS: Record<Lang, string[]> = {
  en: [
    "A customer slipped near the front door.",
    "No one was injured.",
    "I cleaned up the spill and put out a wet floor sign.",
    "I let my shift lead know right away.",
  ],
  es: [
    "Un cliente se resbaló cerca de la puerta principal.",
    "Nadie se lastimó.",
    "Limpié el derrame y puse un letrero de piso mojado.",
    "Le avisé a mi líder de turno de inmediato.",
  ],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Writing it up",
      s: [
        "Say what happened first, then what you did about it, in that order.",
        "Keep it short. A few clear sentences are better than a long story.",
        "Stick to what you saw or did. Skip guessing about whose fault it was.",
      ],
      tip: "There is no one \"right\" way to say it. Clear and in order is what matters.",
    },
  ],
  es: [
    {
      t: "Escribir el reporte",
      s: [
        "Di qué pasó primero, y luego qué hiciste al respecto, en ese orden.",
        "Manténlo corto. Unas oraciones claras son mejores que una historia larga.",
        "Cíñete a lo que viste o hiciste. Evita adivinar de quién fue la culpa.",
      ],
      tip: "No hay una única redacción \"correcta\". Lo que importa es que sea claro y en orden.",
    },
  ],
};

export const CONFIDENCE_OPTIONS: Record<Lang, ConfidenceOption[]> = {
  en: [
    { label: "Still unsure", reply: "That's honest. Do the task one more time, or come on Wednesday and we can do it together." },
    { label: "I could try", reply: "Good. Try it again without Help. That is how it will feel at work." },
    { label: "I can do this", reply: "You just did it with no help. Move on to the next task on your desktop." },
  ],
  es: [
    { label: "Todavía dudo", reply: "Eso es honesto. Hazlo otra vez, o ven el miércoles y lo hacemos juntos." },
    { label: "Podría intentarlo", reply: "Bien. Inténtalo otra vez sin Ayuda. Así se siente en el trabajo." },
    { label: "Puedo hacerlo", reply: "Lo hiciste sin ayuda. Sigue con la siguiente tarea en tu escritorio." },
  ],
};

import { affirms, denies, looksLikeRealText } from "@/lib/grading/meaning";
import type { EventIntroCopy, Lang, Lesson, Localized, SubmissionContent } from "@/lib/task-types";

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
    doneBody: "Your report was submitted with the time and place. Optional teacher feedback can help you check its sequence and clarity.",
    badgeName: "Write an incident report",
    badgeWhere: "Counts toward: Office Ready · Food Service Ready",
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
    doneBody: "Se envió tu reporte con la hora y el lugar. Los comentarios opcionales de tu docente pueden ayudarte a revisar el orden y la claridad.",
    badgeName: "Escribir un reporte de incidente",
    badgeWhere: "Cuenta para: Oficina · Servicio de alimentos",
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

/** Why the report is not filed yet, or "ok". */
export type IncidentVerdict = "ok" | "empty" | "no-injury" | "no-action" | "false-injury" | "false-action";

/** Said as a fact about the customer: hurt, injured, bleeding, se lastimó. */
const HURT = /\b(hurt|hurts|injur\w*|bleed\w*|broke|broken|lastim\w*|herid[oa]s?|sangr\w*)\b/;
/** Fine, in plain words: "he is ok", "she is fine", "está bien". */
const FINE = /\b(ok|okay|fine|alright|all right|safe|unhurt|uninjured|bien)\b/;
/** Something the learner did about it: cleaned, mopped, put a sign out, told someone, said sorry. */
const ACTION =
  /\b(clean\w*|mop\w*|wip(e|ed|ing)|dr(y|ied)|sign|cone|told|tell|inform\w*|notif\w*|reported|call(ed)?|help(ed)?|sorry|apologi\w*|limpi\w*|trape\w*|seque|seca\w*|letrero|senal|avis\w*|dije|le dije|llame|ayude|perdon|disculp\w*)\b/;

/**
 * A report is complete when it says (1) that the customer is fine, and (2)
 * what the learner did about it. It must also be true: the story says nobody
 * was hurt, and the learner cleaned up and told someone.
 *
 * Negation is read in its own clause, so "he is ok, i mop the floor and say
 * sorry" passes, and "The customer was badly hurt. I did not clean anything
 * and did not tell anyone." does not.
 */
export function incidentVerdict(what: string): IncidentVerdict {
  if (!what.trim()) return "empty";
  const hurt = affirms(what, HURT);
  const fine = affirms(what, FINE) || denies(what, HURT);
  if (hurt && !fine) return "false-injury";
  const acted = affirms(what, ACTION);
  if (!acted && denies(what, ACTION)) return "false-action";
  if (!fine) return "no-injury";
  if (!acted || !looksLikeRealText(what, 3)) return "no-action";
  return "ok";
}

export function incidentNarrativeIsComplete(what: string): boolean {
  return incidentVerdict(what) === "ok";
}

/** The Job Card's correction for each verdict. It names only what is missing or wrong. */
export const INCIDENT_CORRECTIONS: Record<Exclude<IncidentVerdict, "ok">, Localized> = {
  empty: {
    en: "Write what happened. A few short sentences is fine.",
    es: "Escribe qué pasó. Unas oraciones cortas están bien.",
  },
  "no-injury": {
    en: "Say if the customer was hurt. For example: He is OK.",
    es: "Di si el cliente se lastimó. Por ejemplo: Está bien.",
  },
  "no-action": {
    en: "Say what you did about it: cleaned it up, put out a sign, or told someone.",
    es: "Di qué hiciste al respecto: limpiaste, pusiste un letrero o le avisaste a alguien.",
  },
  "false-injury": {
    en: "Check the facts. Nobody was hurt. Write what really happened.",
    es: "Revisa los datos. Nadie se lastimó. Escribe lo que de verdad pasó.",
  },
  "false-action": {
    en: "Your report says you did nothing. Say what you did about the spill.",
    es: "Tu reporte dice que no hiciste nada. Di qué hiciste con el derrame.",
  },
};

/** What the teacher sees: the when/where/what fields the learner submitted. */
export function describeSubmission(when: string, where: string, what: string, lang: Lang): SubmissionContent {
  const c = INCIDENT_COPY[lang];
  return {
    lang,
    fields: [
      { label: c.whenLabel, value: when },
      { label: c.whereLabel, value: where },
      { label: c.whatLabel, value: what },
    ],
  };
}

/** The persistent "what to do right now" line, one per step of this job. */
export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Fill in what happened, when, and where. Say if anyone was hurt and what you did.",
    es: "Llena qué pasó, cuándo y dónde. Di si alguien se lastimó y qué hiciste.",
  },
];

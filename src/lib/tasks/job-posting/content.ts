import type { Lang, Lesson, Localized, SubmissionContent } from "@/lib/task-types";
import { hasBlank, looksLikeKeyboardMash, plain, realWordCount } from "@/lib/grading-jobs";
import { JOB_SEEKER } from "@/lib/tasks/job-application/content";

/**
 * "The Posting" — the first step of the getting-hired arc at the front of
 * Act VI. The learner reads the HQ Office Administrator posting and checks
 * off the requirements their cafe experience already covers, then writes one
 * line on why they're a fit. Teacher-check: the app confirms they matched
 * enough requirements and wrote a reason; it does not grade the reason.
 */

export const JOB_POSTING_COPY: Record<Lang, {
  siteName: string;
  heading: string;
  company: string;
  jobTitle: string;
  location: string;
  pay: string;
  postedBy: string;
  aboutLabel: string;
  about: string;
  reqLabel: string;
  reqHint: string;
  fitLabel: string;
  fitHint: string;
  apply: string;
  needPicks: string;
  needFit: string;
  degreeNote: string;
  /** The same fact about the character a lesson learner is playing. */
  lessonDegreeNote: string;
  needFitWords: string;
  needFitReal: string;
  needFitBlank: string;
  needFitWork: string;
  doneChecked: string;
  doneFit: string;
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
    siteName: "Harborside Jobs",
    heading: "Job posting",
    company: "Harborside HQ",
    jobTitle: "Office Administrator",
    location: "Boston, MA",
    pay: "$24–27 / hour · Full time",
    postedBy: "Shared with you by Anita Raman",
    aboutLabel: "About the role",
    about:
      "The Office Administrator keeps the HQ office running: files and shared drives, calendars and meetings, expense reports, and helping teams get what they need. You do not need an office background. We are looking for someone organized who has led a team before.",
    reqLabel: "What we're looking for",
    reqHint: "Check each thing you have already done.",
    fitLabel: "In one line: why are you a good fit?",
    fitHint: "Say one thing you did at Harborside Cafe that fits this job.",
    apply: "Apply for this job",
    needPicks: "Check at least three things you have done. Read each line and ask: have I done this?",
    needFit: "Write one sentence about why you are a good fit. Then click Apply.",
    degreeNote: "Your cafe work does not include a college degree. This job does not need one. Leave that box empty.",
    lessonDegreeNote: `${JOB_SEEKER.first} has no college degree. This job does not need one. Leave that box empty.`,
    needFitWords: "Write a few more words: say one thing you did, like \"I fixed the schedule.\"",
    needFitReal: "Some of that is not words. Write one thing you did at the cafe, in your own words.",
    needFitBlank: "Fill in the blank ___ with your own words.",
    needFitWork: "Name one thing you did at Harborside Cafe that this job asks for, like fixing the schedule.",
    doneChecked: "You checked",
    doneFit: "Why you fit",
    sentKicker: "Ready to apply",
    doneTitle: "You matched the posting to your experience.",
    doneBody: "You have most of what they ask for. A missing box or two is normal. Apply anyway.",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
  },
  es: {
    siteName: "Empleos Harborside",
    heading: "Anuncio de empleo",
    company: "Harborside HQ",
    jobTitle: "Administrador de Oficina",
    location: "Boston, MA",
    pay: "$24–27 / hora · Tiempo completo",
    postedBy: "Anita Raman te lo compartió",
    aboutLabel: "Sobre el puesto",
    about:
      "El Administrador de Oficina mantiene la oficina de HQ funcionando: archivos y drives compartidos, calendarios y reuniones, informes de gastos, y ayudar a los equipos con lo que necesitan. No necesitas experiencia de oficina. Buscamos a alguien organizado que ya haya dirigido un equipo.",
    reqLabel: "Lo que buscamos",
    reqHint: "Marca cada cosa que ya hiciste.",
    fitLabel: "En una línea: ¿por qué eres una buena opción?",
    fitHint: "Di una cosa que hiciste en Harborside Cafe que encaje con este trabajo.",
    apply: "Aplicar a este trabajo",
    needPicks: "Marca al menos tres cosas que ya hiciste. Lee cada línea y pregúntate: ¿ya hice esto?",
    needFit: "Escribe una oración sobre por qué eres buena opción. Después haz clic en Aplicar.",
    degreeNote: "Tu trabajo en el café no incluye un título universitario. Este trabajo no lo necesita. Deja esa casilla vacía.",
    lessonDegreeNote: `${JOB_SEEKER.first} no tiene título universitario. Este trabajo no lo necesita. Deja esa casilla vacía.`,
    needFitWords: "Escribe unas palabras más: di una cosa que hiciste, como \"Arreglé el horario.\"",
    needFitReal: "Parte de eso no son palabras. Escribe una cosa que hiciste en el café, con tus palabras.",
    needFitBlank: "Llena el espacio ___ con tus propias palabras.",
    needFitWork: "Nombra una cosa que hiciste en Harborside Cafe y que este trabajo pide, como arreglar el horario.",
    doneChecked: "Marcaste",
    doneFit: "Por qué encajas",
    sentKicker: "Listo para aplicar",
    doneTitle: "Comparaste el anuncio con tu experiencia.",
    doneBody: "Tienes casi todo lo que piden. Que falten uno o dos puntos es normal. Aplica de todos modos.",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
  },
};

export interface PostingRequirement {
  key: string;
  text: Localized;
  /** True when the shared core supplies practice relevant to this requirement. */
  met: boolean;
}

export const REQUIREMENTS: PostingRequirement[] = [
  {
    key: "customer-facing",
    text: {
      en: "Talks with coworkers and managers, by email and in person",
      es: "Habla con compañeros y gerentes, por correo y en persona",
    },
    met: true,
  },
  {
    key: "scheduling",
    text: {
      en: "Reads a work schedule and fixes problems in it",
      es: "Lee un horario de trabajo y arregla problemas en él",
    },
    met: true,
  },
  {
    key: "tools",
    text: {
      en: "Comfortable with email, calendars, and spreadsheets",
      es: "Cómodo con correo, calendarios y hojas de cálculo",
    },
    met: true,
  },
  {
    key: "budget",
    text: {
      en: "Has typed numbers in a spreadsheet and sent the total",
      es: "Ha escrito números en una hoja de cálculo y enviado el total",
    },
    met: true,
  },
  {
    key: "degree",
    text: {
      en: "College degree (bachelor's) preferred",
      es: "Título universitario (licenciatura), de preferencia",
    },
    met: false,
  },
];

export const MET_KEYS = REQUIREMENTS.filter((r) => r.met).map((r) => r.key);
export const MIN_PICKS = 3;

/** Enough requirements matched to apply with confidence. */
export function pickingLooksReady(pickedKeys: string[]): boolean {
  return pickedKeys.filter((k) => MET_KEYS.includes(k)).length >= MIN_PICKS;
}

export type PickProblem = "few" | "degree";

/**
 * What is wrong with the boxes checked. The degree line is a fact about the
 * person applying (the lesson's character has none), so checking it is a
 * claim that is not true, even with enough other boxes.
 */
export function pickProblem(pickedKeys: string[]): PickProblem | null {
  if (pickedKeys.includes("degree")) return "degree";
  return pickingLooksReady(pickedKeys) ? null : "few";
}

/** The fewest words that can still say one real thing: "I led team". */
export const FIT_MIN_WORDS = 3;

// Word starts that name something from the cafe jobs or this posting. A fit
// line has to point at one of them: "I look at the sky every day" does not.
const WORK_WORDS = [
  // English
  "schedul", "team", "train", "led", "lead", "manag", "supervis", "email", "mail", "calendar",
  "spreadsheet", "sheet", "excel", "tip", "total", "number", "budget", "customer", "serv", "organiz",
  "organis", "fix", "help", "coworker", "report", "shift", "cafe", "work", "job", "meeting",
  "file", "computer", "talk", "communicat", "plan", "answer", "cash", "money", "people", "staff",
  "office", "problem", "run", "ran", "boss",
  // Spanish (accents are removed before matching)
  "horario", "equipo", "entren", "capacit", "dirig", "lider", "gerent", "jefe", "correo", "calendario",
  "hoja", "propina", "numero", "presupuesto", "cliente", "atend", "atiend", "organic", "organiz", "arregl",
  "ayud", "companer", "informe", "turno", "trabaj", "reunion", "archivo", "computadora", "habl",
  "contest", "dinero", "gente", "personal", "oficina", "problema", "manej", "empleo",
];

export type FitProblem = "empty" | "blank" | "mash" | "short" | "offTopic";

/**
 * The fit line passes when it is a short, real sentence about something done
 * at work. It is not graded for quality: the teacher reads it.
 */
export function fitProblem(fit: string): FitProblem | null {
  if (!fit.trim()) return "empty";
  if (hasBlank(fit)) return "blank";
  if (looksLikeKeyboardMash(fit)) return "mash";
  if (realWordCount(fit) < FIT_MIN_WORDS) return "short";
  const words = plain(fit).split(" ");
  if (!words.some((w) => WORK_WORDS.some((stem) => w.startsWith(stem)))) {
    return "offTopic";
  }
  return null;
}

export function fitLooksReal(fit: string): boolean {
  return fitProblem(fit) === null;
}

/** The correction for each way the fit line falls short. */
export function fitHint(problem: FitProblem, lang: Lang): string {
  const c = JOB_POSTING_COPY[lang];
  switch (problem) {
    case "empty":
      return c.needFit;
    case "blank":
      return c.needFitBlank;
    case "mash":
      return c.needFitReal;
    case "short":
      return c.needFitWords;
    case "offTopic":
      return c.needFitWork;
  }
}

/**
 * Frames, not answers: each has a blank the learner fills from the info card,
 * so one click plus Apply is never a finished line.
 */
export const STARTERS: Record<Lang, string[]> = {
  en: [
    "At Harborside Cafe, I ___.",
    "I am good at ___.",
    "At work I used ___ every day.",
    "I led a team when I ___.",
  ],
  es: [
    "En Harborside Cafe, yo ___.",
    "Se me da bien ___.",
    "En el trabajo usaba ___ todos los días.",
    "Dirigí un equipo cuando ___.",
  ],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "You don't need every box",
      s: [
        "A job posting is a wish list. Most people who get hired do not match every line.",
        "Look for the lines you do cover, and count them. Three or four strong matches is enough to apply.",
        "Read the degree line closely. This one says \"preferred\". Preferred means nice to have, not required.",
      ],
      tip: "If you match most of the list, apply. Let them decide, not you.",
    },
  ],
  es: [
    {
      t: "No necesitas todos los puntos",
      s: [
        "Un anuncio de empleo es una lista de deseos. La mayoría de quienes son contratados no cumplen cada línea.",
        "Busca las líneas que sí cubres y cuéntalas. Tres o cuatro coincidencias fuertes bastan para aplicar.",
        "Lee con cuidado la línea del título. Esta dice \"de preferencia\". Eso quiere decir que ayuda, pero no es obligatorio.",
      ],
      tip: "Si cumples casi toda la lista, aplica. Que decidan ellos, no tú.",
    },
  ],
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Read what the job asks for. Check each thing you have done.",
    es: "Lee lo que pide el trabajo. Marca cada cosa que ya hiciste.",
  },
  {
    en: "Write one sentence: why are you a good fit? Then click Apply for this job.",
    es: "Escribe una oración: ¿por qué eres buena opción? Después haz clic en Aplicar a este trabajo.",
  },
];

/** A lesson learner is playing a character, so the card names who "you" are. */
export const LESSON_RIGHT_NOW_STEPS: Localized[] = [
  {
    en: `Check each thing ${JOB_SEEKER.first} has done. Look at your info card.`,
    es: `Marca cada cosa que ${JOB_SEEKER.first} ya hizo. Mira tu tarjeta de información.`,
  },
  {
    en: `Write one sentence as ${JOB_SEEKER.first}: why are you a good fit? Then click Apply for this job.`,
    es: `Escribe una oración como ${JOB_SEEKER.first}: ¿por qué eres buena opción? Después haz clic en Aplicar a este trabajo.`,
  },
];

/** What the teacher sees: which requirements the learner claimed, and their reason. */
export function describeSubmission(pickedKeys: string[], fit: string, lang: Lang): SubmissionContent {
  const c = JOB_POSTING_COPY[lang];
  const picked = REQUIREMENTS.filter((r) => pickedKeys.includes(r.key))
    .map((r) => r.text[lang])
    .join("; ");
  return {
    lang,
    fields: [
      { label: c.reqLabel, value: picked },
      { label: c.fitLabel, value: fit },
    ],
  };
}

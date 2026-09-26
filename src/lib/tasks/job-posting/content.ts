import type { Lang, Lesson, Localized, SubmissionContent } from "@/lib/task-types";

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
    degreeNote: "Your cafe experience does not include a college degree. This job does not need one, so leave that box empty. You still have enough.",
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
    degreeNote: "Tu experiencia en el café no incluye un título universitario. Este trabajo no lo necesita, así que deja esa casilla vacía. Aun así tienes suficiente.",
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

export function fitLooksReal(fit: string): boolean {
  return fit.trim().split(/\s+/).filter(Boolean).length >= 4;
}

export const STARTERS: Record<Lang, string[]> = {
  en: [
    "I fixed problems in the cafe's work schedule.",
    "I typed tips in a spreadsheet and sent the total to my manager.",
    "I use email, calendars, and spreadsheets at work.",
    "I led a team as a shift lead.",
  ],
  es: [
    "Arreglé problemas en el horario de trabajo del café.",
    "Escribí propinas en una hoja de cálculo y le envié el total a mi gerente.",
    "Uso correo, calendarios y hojas de cálculo en el trabajo.",
    "Dirigí un equipo como líder de turno.",
  ],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "You don't need every box",
      s: [
        "A job posting is a wish list. Most people who get hired do not match every line.",
        "Look for the lines you do cover, and count them. Three or four strong matches is enough to apply.",
        "The degree line is common and often not required. When the role says \"or equivalent experience,\" your work counts.",
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
        "La línea del título es común y muchas veces no es obligatoria. Cuando el puesto dice \"o experiencia equivalente\", tu trabajo cuenta.",
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

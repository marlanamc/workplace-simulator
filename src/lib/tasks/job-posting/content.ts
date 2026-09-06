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
    location: "Harborside HQ · Boston, MA",
    pay: "$24–27 / hour · Full time",
    postedBy: "Shared with you by Anita Raman",
    aboutLabel: "About the role",
    about:
      "The Office Administrator keeps the HQ office running: files and shared drives, calendars and meetings, expense reports, and helping teams get what they need. You do not need an office background. We are looking for someone organized who has led a team before.",
    reqLabel: "What we're looking for",
    reqHint: "Check every one your cafe experience already covers.",
    fitLabel: "In one line: why are you a good fit?",
    fitHint: "Describe one example from your simulator practice that fits this role.",
    apply: "Apply for this job",
    needPicks: "Check at least three that your experience covers.",
    needFit: "Write one line about why you fit before you apply.",
    degreeNote: "You do not have a degree — and this job does not need one. Leave that one unchecked. You still have enough.",
    sentKicker: "Ready to apply",
    doneTitle: "You matched the posting to your experience.",
    doneBody: "You have most of what they ask for. A missing box or two is normal — apply anyway.",
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
    location: "Harborside HQ · Boston, MA",
    pay: "$24–27 / hora · Tiempo completo",
    postedBy: "Anita Raman te lo compartió",
    aboutLabel: "Sobre el puesto",
    about:
      "El Administrador de Oficina mantiene la oficina de HQ funcionando: archivos y drives compartidos, calendarios y reuniones, informes de gastos, y ayudar a los equipos con lo que necesitan. No necesitas experiencia de oficina. Buscamos a alguien organizado que ya haya dirigido un equipo.",
    reqLabel: "Lo que buscamos",
    reqHint: "Marca cada punto que tu experiencia en el café ya cubre.",
    fitLabel: "En una línea: ¿por qué eres una buena opción?",
    fitHint: "Describe un ejemplo de tu práctica en el simulador que encaje con este puesto.",
    apply: "Aplicar a este trabajo",
    needPicks: "Marca al menos tres que tu experiencia cubra.",
    needFit: "Escribe una línea sobre por qué encajas antes de aplicar.",
    degreeNote: "No tienes un título — y este trabajo no lo necesita. Deja ese punto sin marcar. Aun así tienes suficiente.",
    sentKicker: "Listo para aplicar",
    doneTitle: "Comparaste el anuncio con tu experiencia.",
    doneBody: "Tienes casi todo lo que piden. Que falten uno o dos puntos es normal — aplica de todos modos.",
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
      en: "Practice communicating with coworkers and supervisors",
      es: "Práctica de comunicación con compañeros y supervisores",
    },
    met: true,
  },
  {
    key: "scheduling",
    text: {
      en: "Practice reading schedules and resolving a conflict",
      es: "Práctica de leer horarios y resolver un conflicto",
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
      en: "Has entered and reported a spreadsheet total",
      es: "Ha ingresado y reportado un total en una hoja de cálculo",
    },
    met: true,
  },
  {
    key: "degree",
    text: {
      en: "Bachelor's degree",
      es: "Título universitario",
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
    "I ran shift schedules for the cafe crew.",
    "I entered figures and reported a spreadsheet total.",
    "I use email, calendars, and spreadsheets every shift.",
    "I practiced professional messages in the simulator.",
  ],
  es: [
    "Manejé los horarios de turnos del equipo del café.",
    "Ingresé cifras y reporté el total de una hoja de cálculo.",
    "Uso correo, calendarios y hojas de cálculo en cada turno.",
    "Practiqué mensajes profesionales en el simulador.",
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
    en: "Read the posting. Check every requirement your experience covers.",
    es: "Lee el anuncio. Marca cada requisito que tu experiencia cubre.",
  },
  {
    en: "Write one line on why you fit, then apply.",
    es: "Escribe una línea de por qué encajas, luego aplica.",
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

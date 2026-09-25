import type { TaskKey } from "@/lib/desktop-content";
import type { Lang, Lesson, Localized, SubmissionContent } from "@/lib/task-types";

/**
 * "The Application" — the second step of the getting-hired arc. A short
 * multi-section job application: position, work history (pre-filled from the
 * learner's Harborside arc — they review it, they don't retype it),
 * availability, and one "why do you want this" answer. Teacher-check: the app
 * confirms availability is set and the answer is real; it does not grade it.
 */

export const JOB_APPLICATION_COPY: Record<Lang, {
  siteName: string;
  heading: string;
  intro: string;
  positionLabel: string;
  position: string;
  historyLabel: string;
  historyHint: string;
  present: string;
  availabilityLabel: string;
  whyLabel: string;
  whyHint: string;
  submit: string;
  needAvailability: string;
  needWhy: string;
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
    heading: "Application · Office Administrator",
    intro: "Four short sections. Your work history is already filled in. This is practice, not a real application.",
    positionLabel: "Position you're applying for",
    position: "Office Administrator: Harborside HQ",
    historyLabel: "Work history",
    historyHint: "Already filled in. Read it.",
    present: "Present",
    availabilityLabel: "Availability",
    whyLabel: "Why do you want this role?",
    whyHint: "Two or three sentences. Why do you want this job? What are you good at?",
    submit: "Submit application",
    needAvailability: "Choose your availability before you submit.",
    needWhy: "Write 2 or 3 sentences: why do you want this job? At least 6 words.",
    sentKicker: "Application submitted",
    doneTitle: "Your application is in.",
    doneBody: "Position, work history, availability, and your reason: all sent.",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
  },
  es: {
    siteName: "Empleos Harborside",
    heading: "Solicitud · Administrador de Oficina",
    intro: "Cuatro secciones cortas. Tu historial de trabajo ya está lleno. Es práctica, no una solicitud real.",
    positionLabel: "Puesto al que aplicas",
    position: "Administrador de Oficina: Harborside HQ",
    historyLabel: "Historial de trabajo",
    historyHint: "Ya está lleno. Léelo.",
    present: "Presente",
    availabilityLabel: "Disponibilidad",
    whyLabel: "¿Por qué quieres este puesto?",
    whyHint: "Dos o tres oraciones. ¿Por qué quieres este trabajo? ¿En qué eres bueno?",
    submit: "Enviar solicitud",
    needAvailability: "Elige tu disponibilidad antes de enviar.",
    needWhy: "Escribe 2 o 3 oraciones: ¿por qué quieres este trabajo? Al menos 6 palabras.",
    sentKicker: "Solicitud enviada",
    doneTitle: "Tu solicitud está enviada.",
    doneBody: "Puesto, historial de trabajo, disponibilidad y tu razón: todo enviado.",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
  },
};

export interface HistoryRow {
  title: Localized;
  org: string;
  span: Localized;
  /** What the job involved. Lessons show it; Story rows are the learner's own play. */
  duties?: Localized;
}

export const WORK_HISTORY: HistoryRow[] = [
  {
    title: { en: "Assistant Manager", es: "Asistente de gerencia" },
    org: "Harborside Cafe",
    span: { en: "This year – Present", es: "Este año – Presente" },
  },
  {
    title: { en: "Shift Supervisor", es: "Supervisor de turno" },
    org: "Harborside Cafe",
    span: { en: "Last year", es: "El año pasado" },
  },
  {
    title: { en: "Shift Lead", es: "Líder de turno" },
    org: "Harborside Cafe",
    span: { en: "Last year", es: "El año pasado" },
  },
  {
    title: { en: "Team Member / New Hire", es: "Miembro del equipo / Nuevo empleado" },
    org: "Harborside Cafe",
    span: { en: "Two years ago", es: "Hace dos años" },
  },
];

export const AVAILABILITY_OPTIONS: { key: string; label: Localized }[] = [
  { key: "full", label: { en: "Full time", es: "Tiempo completo" } },
  { key: "part", label: { en: "Part time", es: "Medio tiempo" } },
  { key: "either", label: { en: "Either one works", es: "Cualquiera de las dos" } },
];

export function whyLooksReal(why: string): boolean {
  return why.trim().split(/\s+/).filter(Boolean).length >= 6;
}

export const STARTERS: Record<Lang, string[]> = {
  en: [
    "At Harborside Cafe I kept the schedule organized and shared it with the team.",
    "I like keeping things organized so the team can do their work.",
    "I already use the tools this job needs: calendars, spreadsheets, shared files.",
    "I want steady daytime hours and room to keep learning.",
  ],
  es: [
    "En Harborside Cafe mantuve el horario organizado y lo compartí con el equipo.",
    "Me gusta mantener todo organizado para que el equipo pueda hacer su trabajo.",
    "Ya uso las herramientas que este trabajo necesita: calendarios, hojas de cálculo, archivos compartidos.",
    "Quiero un horario estable de día y espacio para seguir aprendiendo.",
  ],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Filling out an application",
      s: [
        "Go section by section. Do not skip one because it looks long. Most are short once you start.",
        "For \"why do you want this role,\" say something true and specific. \"I need a job\" is honest but weak; \"I want to keep growing and I'm good at organizing\" is better.",
        "Read the parts that are already filled in, like your work history.",
      ],
      tip: "One clear reason beats three vague ones.",
    },
  ],
  es: [
    {
      t: "Llenar una solicitud",
      s: [
        "Ve sección por sección. No te saltes una porque se ve larga. Casi todas son cortas cuando empiezas.",
        "Para \"por qué quieres este puesto,\" di algo verdadero y específico. \"Necesito un trabajo\" es honesto pero débil; \"quiero seguir creciendo y soy bueno organizando\" es mejor.",
        "Lee las partes que ya están llenas, como tu historial de trabajo.",
      ],
      tip: "Una razón clara vale más que tres vagas.",
    },
  ],
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Read your work history. Then choose your availability: full time, part time, or either.",
    es: "Lee tu historial de trabajo. Después elige tu disponibilidad: tiempo completo, medio tiempo o cualquiera.",
  },
  {
    en: "Write why you want this job, in 2 or 3 sentences. Then click Submit application.",
    es: "Escribe por qué quieres este trabajo, en 2 o 3 oraciones. Después haz clic en Enviar solicitud.",
  },
];

/** What the teacher sees: the availability chosen and the "why" answer. */
export function describeSubmission(
  fields: { availability: string; why: string },
  lang: Lang,
): SubmissionContent {
  const c = JOB_APPLICATION_COPY[lang];
  const avail = AVAILABILITY_OPTIONS.find((o) => o.key === fields.availability)?.label[lang] ?? fields.availability;
  return {
    lang,
    fields: [
      { label: c.availabilityLabel, value: avail },
      { label: c.whyLabel, value: fields.why },
    ],
  };
}

/**
 * A lesson learner has no game history, so their job-search lessons use this
 * one: the same two cafe jobs the info card lists, with what each involved.
 */
export const LESSON_HISTORY: HistoryRow[] = [
  {
    title: { en: "Shift Lead", es: "Líder de turno" },
    org: "Harborside Cafe",
    span: { en: "2025 to now", es: "2025 a hoy" },
    duties: {
      en: "Made the weekly schedule and fixed problems in it. Trained new workers. Sent reports to the manager.",
      es: "Hacía el horario semanal y arreglaba sus problemas. Entrenaba a trabajadores nuevos. Enviaba informes a la gerente.",
    },
  },
  {
    title: { en: "Team Member", es: "Miembro del equipo" },
    org: "Harborside Cafe",
    span: { en: "2024 to 2025", es: "2024 a 2025" },
    duties: {
      en: "Served customers. Typed tips in a spreadsheet. Answered work email.",
      es: "Atendía a clientes. Escribía las propinas en una hoja de cálculo. Contestaba el correo del trabajo.",
    },
  },
];

/** The history a job-search task shows: the lesson's, or what the learner played. */
export function historyFor(done: readonly TaskKey[], inLesson: boolean): HistoryRow[] {
  return inLesson ? LESSON_HISTORY : practicedHistory(done);
}

export function practicedHistory(done: readonly TaskKey[]): HistoryRow[] {
  return WORK_HISTORY.filter((_, i) => done.includes((['reply-all', 'priority-call', 'triage', 'mail-reply'] as const)[i]))
    .map((r) => ({ ...r, org: 'Harborside · Simulator', span: { en: 'Simulated practice', es: 'Práctica simulada' } }));
}

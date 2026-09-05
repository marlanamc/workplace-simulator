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
    intro: "Four short sections. Your work history is already filled in from your Harborside record — check that it's right.",
    positionLabel: "Position you're applying for",
    position: "Office Administrator — Harborside HQ",
    historyLabel: "Work history",
    historyHint: "From your Harborside record. Read it over.",
    present: "Present",
    availabilityLabel: "Availability",
    whyLabel: "Why do you want this role?",
    whyHint: "Two or three sentences. What draws you to it, and what you'd bring.",
    submit: "Submit application",
    needAvailability: "Choose your availability before you submit.",
    needWhy: "Write a few sentences on why you want the role.",
    sentKicker: "Application submitted",
    doneTitle: "Your application is in.",
    doneBody: "Position, history, availability, and your reason — all sent. Next comes the interview.",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
  },
  es: {
    siteName: "Empleos Harborside",
    heading: "Solicitud · Administrador de Oficina",
    intro: "Cuatro secciones cortas. Tu historial de trabajo ya está lleno con tu registro de Harborside — revisa que esté bien.",
    positionLabel: "Puesto al que aplicas",
    position: "Administrador de Oficina — Harborside HQ",
    historyLabel: "Historial de trabajo",
    historyHint: "De tu registro de Harborside. Léelo con calma.",
    present: "Presente",
    availabilityLabel: "Disponibilidad",
    whyLabel: "¿Por qué quieres este puesto?",
    whyHint: "Dos o tres oraciones. Qué te atrae y qué aportarías.",
    submit: "Enviar solicitud",
    needAvailability: "Elige tu disponibilidad antes de enviar.",
    needWhy: "Escribe unas oraciones sobre por qué quieres el puesto.",
    sentKicker: "Solicitud enviada",
    doneTitle: "Tu solicitud está enviada.",
    doneBody: "Puesto, historial, disponibilidad y tu razón — todo enviado. Sigue la entrevista.",
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
    "I've grown from new hire to assistant manager at the cafe, and I'm ready for an office role.",
    "I like keeping things organized so the team can do their work.",
    "I already use the tools this job needs — calendars, spreadsheets, shared files.",
    "I want steady daytime hours and room to keep learning.",
  ],
  es: [
    "Pasé de nuevo empleado a asistente de gerencia en el café, y estoy listo para un puesto de oficina.",
    "Me gusta mantener todo organizado para que el equipo pueda hacer su trabajo.",
    "Ya uso las herramientas que este trabajo necesita — calendarios, hojas de cálculo, archivos compartidos.",
    "Quiero un horario estable de día y espacio para seguir aprendiendo.",
  ],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Filling out an application",
      s: [
        "Go section by section. Do not skip one because it looks long — most are short once you start.",
        "For \"why do you want this role,\" say something true and specific. \"I need a job\" is honest but weak; \"I want to keep growing and I'm good at organizing\" is better.",
        "Check the pre-filled parts. If a date or title is wrong, fix it before you submit.",
      ],
      tip: "One clear reason beats three vague ones.",
    },
  ],
  es: [
    {
      t: "Llenar una solicitud",
      s: [
        "Ve sección por sección. No te saltes una porque se ve larga — casi todas son cortas cuando empiezas.",
        "Para \"por qué quieres este puesto,\" di algo verdadero y específico. \"Necesito un trabajo\" es honesto pero débil; \"quiero seguir creciendo y soy bueno organizando\" es mejor.",
        "Revisa las partes ya llenas. Si una fecha o un título está mal, corrígelo antes de enviar.",
      ],
      tip: "Una razón clara vale más que tres vagas.",
    },
  ],
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Read each section. Check your work history is right.",
    es: "Lee cada sección. Revisa que tu historial esté bien.",
  },
  {
    en: "Pick your availability and write why you want the role. Then submit.",
    es: "Elige tu disponibilidad y escribe por qué quieres el puesto. Luego envía.",
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

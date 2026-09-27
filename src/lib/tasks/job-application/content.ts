import type { TaskKey } from "@/lib/desktop-content";
import type { Lang, Lesson, Localized, SubmissionContent } from "@/lib/task-types";
import { hasBlank, looksLikeKeyboardMash, realWordCount, sameEmail, sameName, samePhone } from "@/lib/grading-jobs";
import { sameDate } from "@/lib/tasks/onboarding-paperwork/content";

/**
 * The character a hiring lesson's learner plays. A lesson has no account and
 * no game history, and it must never tell a real adult a fact about
 * themselves ("No college degree"), so the job-search lessons are about Sam:
 * the info card, the card lines, and the corrections all name Sam.
 */
export const JOB_SEEKER = {
  name: "Sam Rivera",
  first: "Sam",
  phone: "(617) 555-0142",
  email: "sam.rivera@mail.com",
  /** Month/day/year. The day is past 12 so it cannot be read day-first. */
  start: "11/16/2026",
  startSpoken: { en: "November 16", es: "16 de noviembre" } as Localized,
  city: "Boston, MA",
  school: { en: "High school diploma, 2019", es: "Diploma de secundaria, 2019" } as Localized,
};

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
  positionHours: string;
  contactLabel: string;
  contactHint: string;
  nameLabel: string;
  phoneLabel: string;
  emailLabel: string;
  startLabel: string;
  datePlaceholder: string;
  needWhyShort: string;
  needWhyReal: string;
  needWhyBlank: string;
  needWhyReason: string;
  needFullTime: string;
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
    intro: "A few short sections. Your work history is already filled in. This is practice, not a real application.",
    positionLabel: "Position you're applying for",
    position: "Office Administrator: Harborside HQ",
    positionHours: "$24–27 / hour · Full time (40 hours a week)",
    contactLabel: "Contact information",
    contactHint: "Copy each one exactly.",
    nameLabel: "Full name",
    phoneLabel: "Phone",
    emailLabel: "Email",
    startLabel: "Date you can start",
    datePlaceholder: "MM/DD/YYYY",
    needWhyShort: "Add your reason. For example: \"I want this job because ___.\"",
    needWhyReal: "Some of that is not words. Write your reason in your own words.",
    needWhyBlank: "Fill in the blank ___ with your own words.",
    needWhyReason: "Say why Sam wants this job, or what Sam is good at. For example: \"I want this job because ___.\"",
    needFullTime: `This job is full time, 40 hours a week. ${JOB_SEEKER.first} wants 40 hours a week. Choose Full time.`,
    historyLabel: "Work history",
    historyHint: "Already filled in. Read it.",
    present: "Present",
    availabilityLabel: "Availability",
    whyLabel: "Why do you want this role?",
    whyHint: "One or two sentences. Why do you want this job? What are you good at?",
    submit: "Submit application",
    needAvailability: "Choose an availability in the Availability box before you submit.",
    needWhy: "Write one or two sentences in the last box: why do you want this job?",
    sentKicker: "Application submitted",
    doneTitle: "Your application is in.",
    doneBody: "Position, contact, work history, availability, and your reason: all sent.",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
  },
  es: {
    siteName: "Empleos Harborside",
    heading: "Solicitud · Administrador de Oficina",
    intro: "Unas secciones cortas. Tu historial de trabajo ya está lleno. Es práctica, no una solicitud real.",
    positionLabel: "Puesto al que aplicas",
    position: "Administrador de Oficina: Harborside HQ",
    positionHours: "$24–27 / hora · Tiempo completo (40 horas por semana)",
    contactLabel: "Datos de contacto",
    contactHint: "Copia cada uno tal como está.",
    nameLabel: "Nombre completo",
    phoneLabel: "Teléfono",
    emailLabel: "Correo electrónico",
    startLabel: "Fecha en que puedes empezar",
    datePlaceholder: "MM/DD/AAAA",
    needWhyShort: "Agrega tu razón. Por ejemplo: \"Quiero este trabajo porque ___.\"",
    needWhyReal: "Parte de eso no son palabras. Escribe tu razón con tus propias palabras.",
    needWhyBlank: "Llena el espacio ___ con tus propias palabras.",
    needWhyReason: "Di por qué Sam quiere este trabajo, o qué hace bien Sam. Por ejemplo: \"Quiero este trabajo porque ___.\"",
    needFullTime: `Este trabajo es de tiempo completo, 40 horas por semana. ${JOB_SEEKER.first} quiere 40 horas por semana. Elige Tiempo completo.`,
    historyLabel: "Historial de trabajo",
    historyHint: "Ya está lleno. Léelo.",
    present: "Presente",
    availabilityLabel: "Disponibilidad",
    whyLabel: "¿Por qué quieres este puesto?",
    whyHint: "Una o dos oraciones. ¿Por qué quieres este trabajo? ¿Qué haces bien?",
    submit: "Enviar solicitud",
    needAvailability: "Elige una opción en Disponibilidad antes de enviar.",
    needWhy: "Escribe una o dos oraciones en la última casilla: ¿por qué quieres este trabajo?",
    sentKicker: "Solicitud enviada",
    doneTitle: "Tu solicitud está enviada.",
    doneBody: "Puesto, contacto, historial de trabajo, disponibilidad y tu razón: todo enviado.",
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

/** One short sentence with a reason: "I want this job because I like office work." */
export const WHY_MIN_WORDS = 5;

export type WhyProblem = "empty" | "blank" | "mash" | "short" | "noReason";

/**
 * Words that give a reason for wanting a job, or say what the person is good
 * at, in either language. Deliberately broad: honest reasons vary ("steady
 * hours for my family", "me gusta organizar"), so this only catches a
 * sentence that is about something else ("I look at the sky every day").
 */
const REASON_WORDS =
  /\b(because|want|wants|like|likes|love|enjoy|interest|good at|experience|skill|help|learn|grow|career|team|customer|office|organi[sz]|work|job|role|position|hours|pay|family|future|people|can|am|porque|quiero|quisiera|me gusta|me encanta|experiencia|ayudar|aprender|crecer|equipo|client|oficina|organiz|trabaj|puesto|empleo|horario|horas|familia|futuro|gente|personas|puedo|soy|sé)/i;

/**
 * The "why" answer passes when it is one real sentence. The card, the box's
 * hint, and the help all ask for "one or two sentences", and this check asks
 * for no more than one. The teacher reads it for quality.
 */
export function whyProblem(why: string): WhyProblem | null {
  if (!why.trim()) return "empty";
  if (hasBlank(why)) return "blank";
  if (looksLikeKeyboardMash(why)) return "mash";
  if (realWordCount(why) < WHY_MIN_WORDS) return "short";
  if (!REASON_WORDS.test(why.normalize("NFC"))) return "noReason";
  return null;
}

export function whyLooksReal(why: string): boolean {
  return whyProblem(why) === null;
}

export function whyHint(problem: WhyProblem, lang: Lang): string {
  const c = JOB_APPLICATION_COPY[lang];
  return problem === "empty"
    ? c.needWhy
    : problem === "blank"
      ? c.needWhyBlank
      : problem === "mash"
        ? c.needWhyReal
        : problem === "noReason"
          ? c.needWhyReason
          : c.needWhyShort;
}

/**
 * Availability is a reading check in a lesson: the job is full time and Sam
 * wants 40 hours. Story mode asks the learner about themselves, so any
 * choice stands there.
 */
export function availabilityFits(key: string | null, inLesson: boolean): boolean {
  if (!key) return false;
  return !inLesson || key === "full" || key === "either";
}

/* ---------------- contact (lesson) ---------------- */

export type ContactField = "name" | "phone" | "email" | "start";
export const CONTACT_FIELDS: ContactField[] = ["name", "phone", "email", "start"];
export type ContactValues = Record<ContactField, string>;

export function contactFieldMatches(field: ContactField, value: string): boolean {
  switch (field) {
    case "name":
      return sameName(value, JOB_SEEKER.name);
    case "phone":
      return samePhone(value, JOB_SEEKER.phone);
    case "email":
      return sameEmail(value, JOB_SEEKER.email);
    case "start":
      return sameDate(value, JOB_SEEKER.start);
  }
}

/** The first contact box that is empty, then the first that does not match, top to bottom. */
export function contactProblem(values: ContactValues): { field: ContactField; kind: "empty" | "wrong" } | null {
  const empty = CONTACT_FIELDS.find((f) => !values[f].trim());
  if (empty) return { field: empty, kind: "empty" };
  const wrong = CONTACT_FIELDS.find((f) => !contactFieldMatches(f, values[f]));
  return wrong ? { field: wrong, kind: "wrong" } : null;
}

const FIRST = JOB_SEEKER.first;
export const CONTACT_HINT: Record<ContactField, { empty: Localized; wrong: Localized }> = {
  name: {
    empty: { en: `Type ${FIRST}'s full name in the Full name box.`, es: `Escribe el nombre completo de ${FIRST} en la casilla Nombre completo.` },
    wrong: {
      en: `Check the Full name box. Copy it from your info card: ${JOB_SEEKER.name}.`,
      es: `Revisa la casilla Nombre completo. Cópialo de tu tarjeta de información: ${JOB_SEEKER.name}.`,
    },
  },
  phone: {
    empty: { en: `Type ${FIRST}'s phone number in the Phone box.`, es: `Escribe el teléfono de ${FIRST} en la casilla Teléfono.` },
    wrong: {
      en: `Check the Phone box. Copy the number from your info card: ${JOB_SEEKER.phone}.`,
      es: `Revisa la casilla Teléfono. Copia el número de tu tarjeta de información: ${JOB_SEEKER.phone}.`,
    },
  },
  email: {
    empty: { en: `Type ${FIRST}'s email in the Email box.`, es: `Escribe el correo de ${FIRST} en la casilla Correo electrónico.` },
    wrong: {
      en: `Check the Email box. Copy it letter by letter from your info card: ${JOB_SEEKER.email}.`,
      es: `Revisa la casilla Correo electrónico. Cópialo letra por letra de tu tarjeta de información: ${JOB_SEEKER.email}.`,
    },
  },
  start: {
    empty: {
      en: `Type the date ${FIRST} can start in the Date you can start box.`,
      es: `Escribe la fecha en que ${FIRST} puede empezar en la casilla Fecha en que puedes empezar.`,
    },
    wrong: {
      en: `Check the start date. Copy it from your info card: ${JOB_SEEKER.start} (month/day/year).`,
      es: `Revisa la fecha para empezar. Cópiala de tu tarjeta de información: ${JOB_SEEKER.start} (mes/día/año: ${JOB_SEEKER.startSpoken.es}).`,
    },
  },
};

/** Frames with a blank, so a starter is a way in, never the finished answer. */
export const STARTERS: Record<Lang, string[]> = {
  en: [
    "I want this job because ___.",
    "At Harborside Cafe, I ___.",
    "I am good at ___.",
    "I want to learn ___.",
  ],
  es: [
    "Quiero este trabajo porque ___.",
    "En Harborside Cafe, yo ___.",
    "Se me da bien ___.",
    "Quiero aprender ___.",
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
        "Copy names, phone numbers, emails, and dates exactly. One wrong number and they cannot call you.",
        "Check the job's hours. Choose the availability that fits them.",
      ],
      tip: "One or two sentences is enough. One clear reason beats three vague ones.",
    },
  ],
  es: [
    {
      t: "Llenar una solicitud",
      s: [
        "Ve sección por sección. No te saltes una porque se ve larga. Casi todas son cortas cuando empiezas.",
        "Para \"por qué quieres este puesto,\" di algo verdadero y específico. \"Necesito un trabajo\" es honesto pero débil; \"quiero seguir creciendo y soy bueno organizando\" es mejor.",
        "Lee las partes que ya están llenas, como tu historial de trabajo.",
        "Copia nombres, teléfonos, correos y fechas tal como están. Con un número equivocado no te pueden llamar.",
        "Mira las horas del trabajo. Elige la disponibilidad que encaja con ellas.",
      ],
      tip: "Una o dos oraciones bastan. Una razón clara vale más que tres vagas.",
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
    en: "Write why you want this job, in one or two sentences. Then click Submit application.",
    es: "Escribe por qué quieres este trabajo, en una o dos oraciones. Después haz clic en Enviar solicitud.",
  },
];

/** A lesson adds the contact boxes first and names who "you" are. */
export const LESSON_RIGHT_NOW_STEPS: Localized[] = [
  {
    en: `Type ${FIRST}'s name, phone, email, and start date. Copy them from your info card.`,
    es: `Escribe el nombre, teléfono, correo y fecha para empezar de ${FIRST}. Cópialos de tu tarjeta de información.`,
  },
  {
    en: `Read the job's hours. Then choose the availability that fits ${FIRST}.`,
    es: `Lee las horas del trabajo. Después elige la disponibilidad que encaja con ${FIRST}.`,
  },
  {
    en: `Write one or two sentences as ${FIRST}: why do you want this job? Then click Submit application.`,
    es: `Escribe una o dos oraciones como ${FIRST}: ¿por qué quieres este trabajo? Después haz clic en Enviar solicitud.`,
  },
];

/** What the teacher sees: the availability chosen and the "why" answer. */
export function describeSubmission(
  fields: { availability: string; why: string; contact?: ContactValues },
  lang: Lang,
): SubmissionContent {
  const c = JOB_APPLICATION_COPY[lang];
  const avail = AVAILABILITY_OPTIONS.find((o) => o.key === fields.availability)?.label[lang] ?? fields.availability;
  const contact = fields.contact;
  return {
    lang,
    fields: [
      ...(contact
        ? [
            { label: c.nameLabel, value: contact.name },
            { label: c.phoneLabel, value: contact.phone },
            { label: c.emailLabel, value: contact.email },
            { label: c.startLabel, value: contact.start },
          ]
        : []),
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

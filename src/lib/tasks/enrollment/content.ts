import type { Lang, Lesson, Localized, SubmissionContent } from "@/lib/task-types";

export const DEADLINE = { en: "September 15, 2026", es: "15 de septiembre de 2026" };

export const MISSING_DOC = "immunization";

export const CHECKLIST = [
  { key: "transcript", label: { en: "Official transcript", es: "Historial oficial" }, done: true },
  { key: "id", label: { en: "Photo ID", es: "Identificación con foto" }, done: true },
  { key: "immunization", label: { en: "Immunization record", es: "Registro de vacunas" }, done: false },
] as const;

export const ENROLLMENT_COPY: Record<Lang, {
  helpBtn: string;
  school: string;
  heading: string;
  deadlineLabel: string;
  docsHeading: string;
  missingNote: string;
  markReady: string;
  marked: string;
  statementHeading: string;
  statementHint: string;
  submit: string;
  needDoc: string;
  empty: string;
  weak: string;
  sentKicker: string;
  tryAgain: string;
  backToDesk: string;
  lessonKicker: string;
  tipLabel: string;
  gotIt: string;
}> = {
  en: {
    helpBtn: "Help me with this step",
    school: "Bunker Hill Community College",
    heading: "Fall 2026 application",
    deadlineLabel: "Apply by",
    docsHeading: "Required documents",
    missingNote: "One required document is missing.",
    markReady: "Choose file",
    marked: "Ready",
    statementHeading: "Statement of interest",
    statementHint: "Why this college, in a few sentences…",
    submit: "Submit application",
    needDoc: "The missing document is not attached yet. Compare the checklist with the file names.",
    empty: "Write a short statement first.",
    weak: "Say why you want this college — a program, a class, or BHCC.",
    sentKicker: "Application sent",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
  },
  es: {
    helpBtn: "Ayúdame con este paso",
    school: "Bunker Hill Community College",
    heading: "Solicitud otoño 2026",
    deadlineLabel: "Aplicar antes del",
    docsHeading: "Documentos requeridos",
    missingNote: "Falta un documento requerido.",
    markReady: "Elegir archivo",
    marked: "Listo",
    statementHeading: "Carta de interés",
    statementHint: "Por qué esta universidad, en unas oraciones…",
    submit: "Enviar solicitud",
    needDoc: "Todavía no se ha adjuntado el documento que falta. Compara la lista de requisitos con los nombres de los archivos.",
    empty: "Primero escribe una carta corta.",
    weak: "Di por qué quieres esta universidad — un programa, una clase, o BHCC.",
    sentKicker: "Solicitud enviada",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
  },
};

export const STARTERS: Record<Lang, string[]> = {
  en: [
    "I want to start at BHCC in the Business Essentials program.",
    "This college is close to my job and I can take evening classes.",
    "I am applying so I can keep working and go to school.",
  ],
  es: [
    "Quiero empezar en BHCC en el programa de Business Essentials.",
    "Esta universidad queda cerca de mi trabajo y puedo tomar clases de noche.",
    "Aplico para seguir trabajando e ir a la escuela.",
  ],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "The deadline is the first number",
      s: [
        "Portals bury the date. Find it before you write.",
        "A checklist with one box still open is not ready to send.",
        "The statement only has to name the school or the program. Short is fine.",
      ],
      tip: "If you cannot point at the deadline, you are not ready to submit.",
    },
  ],
  es: [
    {
      t: "La fecha es el primer número",
      s: [
        "Los portales esconden la fecha. Encuéntrala antes de escribir.",
        "Una lista con una casilla abierta no está lista para enviar.",
        "La carta solo tiene que nombrar la escuela o el programa. Corta está bien.",
      ],
      tip: "Si no puedes señalar la fecha, no estás listo para enviar.",
    },
  ],
};

/** What the teacher sees: the statement of interest the learner wrote. */
export function describeSubmission(statement: string, lang: Lang): SubmissionContent {
  return { lang, fields: [{ label: ENROLLMENT_COPY[lang].statementHeading, value: statement }] };
}

export function statementShowsInterest(body: string): boolean {
  const t = body.toLowerCase();
  if (t.trim().length < 24) return false;
  return /bhcc|bunker|college|universidad|escuela|program|programa|class|clase|business|negocio/.test(t);
}

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  { en: "Find the apply-by date.", es: "Encuentra la fecha para aplicar." },
  { en: "Mark the missing document.", es: "Marca el documento que falta." },
  { en: "Write a short statement and submit.", es: "Escribe una carta corta y envía." },
];

export const DOCUMENT_FILES = [
  { key: 'vaccine', label: { en: 'Immunization record.pdf', es: 'Registro de vacunas.pdf' } },
  { key: 'schedule', label: { en: 'Class schedule.pdf', es: 'Horario de clases.pdf' } },
  { key: 'receipt', label: { en: 'Application receipt.pdf', es: 'Recibo de solicitud.pdf' } },
];
export function documentMatchesMissing(key: string): boolean { return key === 'vaccine'; }

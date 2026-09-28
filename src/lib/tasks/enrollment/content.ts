import { looksLikeRealText, normalizeReply } from "@/lib/grading/meaning";
import { DATE_CHECK } from "@/lib/tasks/financial-aid/content";
import type { Lang, Lesson, Localized, SubmissionContent } from "@/lib/task-types";
import { STORY_DAY_BY_LEVEL, STORY_YEAR, monthDate } from "@/lib/story-dates";

/**
 * The application deadline: the Friday after next from Getting Ready
 * (level16), so it is still ahead of the learner, and before the aid letter's
 * accept-by date (October 15).
 */
const DEADLINE_DAY = STORY_DAY_BY_LEVEL.level16 + 11;
export const DEADLINE = { en: `${monthDate(DEADLINE_DAY, "en")}, ${STORY_YEAR}`, es: `${monthDate(DEADLINE_DAY, "es")} de ${STORY_YEAR}` };

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
    weak: "Say why you want to study here, in your own words. One honest reason is enough.",
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
    weak: "Di por qué quieres estudiar aquí, con tus propias palabras. Una razón honesta basta.",
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
        "The statement only has to say why you want to study here. Short is fine.",
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
        "La carta solo tiene que decir por qué quieres estudiar aquí. Corta está bien.",
      ],
      tip: "Si no puedes señalar la fecha, no estás listo para enviar.",
    },
  ],
};

/** What the teacher sees: the statement of interest the learner wrote. */
export function describeSubmission(statement: string, lang: Lang): SubmissionContent {
  return { lang, fields: [{ label: ENROLLMENT_COPY[lang].statementHeading, value: statement }] };
}

/** A reason to apply, or the school or program by name. */
const REASON =
  /\b(bhcc|bunker|college|colegio|universidad|escuela|school|program\w*|class\w*|clase\w*|course\w*|curso\w*|business|negocio\w*|learn\w*|aprend\w*|stud\w*|estudi\w*|english|ingles|job|jobs|work\w*|trabaj\w*|career\w*|carrera\w*|future|futuro|family|familia|better|mejor\w*|goal\w*|meta\w*|help\w*|ayud\w*|degree|titulo|nurs\w*|enfermer\w*|hospital|office|oficina|dream\w*|sueno\w*|want|quiero|like|gusta)\b/;

/**
 * An honest reason in real words: "I like to learn english and work in
 * hospital" counts, and "asdf college asdf asdf asdf" does not, even though
 * it names the college.
 */
export function statementShowsInterest(body: string): boolean {
  if (!looksLikeRealText(body, 4)) return false;
  return REASON.test(normalizeReply(body));
}

/**
 * Step one: find the apply-by date. The learner picks it from three dates:
 * the deadline, and the award letter's dates from the same portal, which a
 * learner skimming could mix up with it.
 */
export const DEADLINE_CHOICES: { key: string; label: Localized; ok: boolean }[] = [
  { key: "deadline", label: DEADLINE, ok: true },
  ...DATE_CHECK.en.options
    .map((option, i) => ({ en: option.label, es: DATE_CHECK.es.options[i]?.label ?? option.label }))
    .filter((label) => label.en !== DEADLINE.en)
    .map((label, i) => ({ key: `other-${i}`, label, ok: false })),
];

export function deadlinePickIsRight(key: string): boolean {
  return DEADLINE_CHOICES.some((choice) => choice.key === key && choice.ok);
}

export const DEADLINE_COPY: Record<Lang, { question: string; wrong: string; need: string }> = {
  en: {
    question: "What is the last day to apply?",
    wrong: "That is not the apply-by date. Look at the top of the page.",
    need: "First, find the apply-by date. Pick it below the heading.",
  },
  es: {
    question: "¿Cuál es el último día para aplicar?",
    wrong: "Esa no es la fecha para aplicar. Mira arriba en la página.",
    need: "Primero, encuentra la fecha para aplicar. Elígela debajo del título.",
  },
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  { en: "Find the apply-by date.", es: "Encuentra la fecha para aplicar." },
  { en: "Mark the missing document.", es: "Marca el documento que falta." },
  { en: "Write a short statement: why you want to study at BHCC or in the program. Then submit.", es: "Escribe una carta corta: por qué quieres estudiar en BHCC o en el programa. Luego envía." },
];

export const DOCUMENT_FILES = [
  { key: 'vaccine', label: { en: 'Immunization record.pdf', es: 'Registro de vacunas.pdf' } },
  { key: 'schedule', label: { en: 'Class schedule.pdf', es: 'Horario de clases.pdf' } },
  { key: 'receipt', label: { en: 'Application receipt.pdf', es: 'Recibo de solicitud.pdf' } },
];
export function documentMatchesMissing(key: string): boolean { return key === 'vaccine'; }

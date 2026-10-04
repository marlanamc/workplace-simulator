import { mentionsAmount } from "@/lib/text-facts";
import { shortDate } from "@/lib/story-dates";
import { CAST } from "@/lib/cast";
import type { EventIntroCopy, Lang, Lesson, Localized, SubmissionContent } from "@/lib/task-types";
import { COPY_NAME, STATUS_TOTAL, STATUS_WEEK } from "../status-sheet";
import { openFileStep } from "../open-file-step";
import { UNDO_STEPS } from "./undo";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "✉️",
    kicker: "Same sheet, your own copy.",
    headline: "Write the total yourself. Then cc a co-lead.",
    body: "The numbers are all in, but the total cell is empty. Add them up with a formula, check the number, and email it to Renata. Jordan needs to see it too.",
    cta: "Open my copy",
  },
  es: {
    emoji: "✉️",
    kicker: "La misma hoja, tu propia copia.",
    headline: "Escribe el total tú. Luego pon en copia a un co-líder.",
    body: "Ya están todos los números, pero la celda del total está vacía. Súmalos con una fórmula, revisa el número y envíaselo a Renata. Jordan también tiene que verlo.",
    cta: "Abrir mi copia",
  },
};

export const CC_EMAIL = CAST.jordan.email;
export const CC_NAME = CAST.jordan.name;

export const STATUS_REPORT_COPY: Record<Lang, {
  helpBtn: string;
  appName: string;
  sheetName: string;
  startNewHeading: string;
  blankLabel: string;
  templateBudget: string;
  templateSchedule: string;
  recentHeading: string;
  openedLabel: string;
  dayHeader: string;
  countHeader: string;
  totalLabel: string;
  emailCta: string;
  to: string;
  cc: string;
  ccAdd: string;
  subjectLabel: string;
  subject: string;
  writeHere: string;
  send: string;
  discard: string;
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
    helpBtn: "Help me with this step",
    appName: "Sheets",
    sheetName: COPY_NAME,
    startNewHeading: "Start a new spreadsheet",
    blankLabel: "Blank",
    templateBudget: "Budget",
    templateSchedule: "Schedule",
    recentHeading: "My Drive",
    openedLabel: "Your copy · Can edit",
    dayHeader: "Day",
    countHeader: "Tickets",
    totalLabel: "Total",
    emailCta: "Email the total",
    to: "To",
    cc: "Cc",
    ccAdd: "Cc",
    subjectLabel: "Subject",
    subject: `Week of ${shortDate(STATUS_WEEK, "en")} status`,
    writeHere: "Write your message here…",
    send: "Send",
    discard: "Discard",
    sentKicker: "Message sent",
    doneTitle: "You wrote the formula and cc'd Jordan.",
    doneBody: `The sheet did not give you a total. You typed =SUM and got ${STATUS_TOTAL}. Renata is on the To line. Jordan is on Cc. That is what a status report looks like.`,
    badgeName: "Write a SUM and cc a co-lead",
    badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
    askPerson: "Ask a person instead",
  },
  es: {
    helpBtn: "Ayúdame con este paso",
    appName: "Sheets",
    sheetName: COPY_NAME,
    startNewHeading: "Iniciar una nueva hoja de cálculo",
    blankLabel: "En blanco",
    templateBudget: "Presupuesto",
    templateSchedule: "Horario",
    recentHeading: "Mi Drive",
    openedLabel: "Tu copia · Puede editar",
    dayHeader: "Día",
    countHeader: "Tickets",
    totalLabel: "Total",
    emailCta: "Enviar el total",
    to: "Para",
    cc: "Cc",
    ccAdd: "Cc",
    subjectLabel: "Asunto",
    subject: `Estado de la semana del ${shortDate(STATUS_WEEK, "es")}`,
    writeHere: "Escribe tu mensaje aquí…",
    send: "Enviar",
    discard: "Descartar",
    sentKicker: "Mensaje enviado",
    doneTitle: "Escribiste la fórmula y pusiste a Jordan en copia.",
    doneBody: `La hoja no te dio el total. Escribiste =SUM y salió ${STATUS_TOTAL}. Renata está en la línea Para. Jordan está en Cc. Así se ve un reporte de estado.`,
    badgeName: "Escribir un SUM y poner en copia a un co-líder",
    badgeWhere: "Cuenta para: Oficina · Servicio de alimentos",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
    askPerson: "Mejor preguntar a una persona",
  },
};

export const HINTS: Record<Lang, { formula: string; rightNumber: string; number: string; empty: string; cc: string; total: string }> = {
  en: {
    formula: "Type =SUM(B2:B6) in the total cell. That is every ticket row.",
    rightNumber: "Right number. Now let the sheet add it: type =SUM(B2:B6) in the total cell.",
    number: "Check that number. Let the sheet add it: type =SUM(B2:B6) in the total cell.",
    empty: "Write a short message first. Even one sentence is fine.",
    cc: "Click Cc and add Jordan. A co-lead needs this number too.",
    total: `Mention the total (${STATUS_TOTAL}) so Renata does not have to open the sheet.`,
  },
  es: {
    formula: "Escribe =SUM(B2:B6) en la celda del total. Esas son todas las filas de tickets.",
    rightNumber: "Es el número correcto. Ahora deja que la hoja lo sume: escribe =SUM(B2:B6) en la celda del total.",
    number: "Revisa ese número. Deja que la hoja lo sume: escribe =SUM(B2:B6) en la celda del total.",
    empty: "Primero escribe un mensaje corto. Una oración está bien.",
    cc: "Haz clic en Cc y agrega a Jordan. Un co-líder también necesita este número.",
    total: `Menciona el total (${STATUS_TOTAL}) para que Renata no tenga que abrir la hoja.`,
  },
};

export const STARTERS: Record<Lang, string[]> = {
  en: [
    `Hi Renata, this week's ticket total is ${STATUS_TOTAL}.`,
    "I added it with =SUM on my copy of the status sheet.",
    "Cc'ing Jordan so he has the number too.",
  ],
  es: [
    `Hola Renata, el total de tickets de esta semana es ${STATUS_TOTAL}.`,
    "Lo sumé con =SUM en mi copia de la hoja de estado.",
    "Pongo a Jordan en copia para que también tenga el número.",
  ],
};

export const CC_PICKS = [
  { key: "jordan", name: CAST.jordan.name, email: CC_EMAIL, ok: true },
  { key: "alex", name: CAST.alex.name, email: CAST.alex.email, ok: false },
  { key: "sam", name: "Sam Rivera", email: "sam.rivera@harborsidecafe.com", ok: false },
] as const;

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Write the formula yourself",
      s: [
        "Click the empty total cell. Type =SUM( then click the cells with numbers, then type ).",
        "Press Enter. Check that the number looks about right.",
        "Work in your own copy. The view-only template still will not let you type a formula.",
      ],
      tip: "Use one SUM. Do not put a formula inside another formula. The point is that you wrote the total yourself.",
    },
    {
      t: "Cc the person who also needs the number",
      s: [
        "Put Renata in the To line. Put the co-lead who uses the same number in the Cc line.",
        "Write the total in the email itself. Do not make them open the sheet to find it.",
        "Cc is for people who need to know. It is not the same as Reply all.",
      ],
      tip: "If they would have to come ask you for the number later, put them on Cc now.",
    },
  ],
  es: [
    {
      t: "Escribe la fórmula por tu cuenta",
      s: [
        "Haz clic en la celda del total vacía. Escribe =SUM( luego haz clic en las celdas con números, luego escribe ).",
        "Presiona Enter. Revisa que el número se vea más o menos bien.",
        "Trabaja en tu propia copia. La plantilla de solo ver sigue sin dejarte escribir una fórmula.",
      ],
      tip: "Usa un solo SUM. No pongas una fórmula dentro de otra. La idea es que tú escribiste el total.",
    },
    {
      t: "Pon en copia a quien también necesita el número",
      s: [
        "Pon a Renata en la línea Para. Pon en la línea Cc al co-líder que usa el mismo número.",
        "Escribe el total en el correo mismo. No los hagas abrir la hoja para buscarlo.",
        "Cc es para las personas que necesitan saber. No es lo mismo que Responder a todos.",
      ],
      tip: "Si después te tendrían que venir a pedir el número, ponlos en Cc ahora.",
    },
  ],
};


export function emailMentionsTotal(body: string): boolean { return mentionsAmount(body, STATUS_TOTAL); }

/** What the teacher sees: the SUM formula and the status email. */
export function describeSubmission(
  input: { formula: string; body: string },
  lang: Lang,
): SubmissionContent {
  const c = STATUS_REPORT_COPY[lang];
  return {
    lang,
    fields: [
      { label: c.totalLabel, value: input.formula },
      { label: c.subject, value: input.body },
    ],
  };
}

/** The persistent "what to do right now" line, one per step of this job. */
export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  openFileStep(STATUS_REPORT_COPY, (c) => c.sheetName),
  UNDO_STEPS.delete,
  UNDO_STEPS.undo,
  { en: "Enter a formula in the Total cell to add the tickets. Check the result.", es: "Escribe una fórmula en la celda del total para sumar los pedidos. Revisa el resultado." },
  { en: "Email Renata the total. Add Jordan in Cc. Then click Send.", es: "Escribe a Renata el total. Agrega a Jordan en Cc. Después haz clic en Enviar." },
];

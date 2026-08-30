import { CAST } from "@/lib/cast";
import type { EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";
import { COPY_NAME, STATUS_TOTAL } from "../status-sheet";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "✉️",
    kicker: "Same sheet. Your copy.",
    headline: "Write the total yourself. Then cc a co-lead.",
    body: "The numbers are in. The total cell is empty. Type =SUM, check the number, and email Maria. Jordan needs to see it too.",
    cta: "Open my copy",
  },
  es: {
    emoji: "✉️",
    kicker: "La misma hoja. Tu copia.",
    headline: "Escribe el total tú. Luego pon en copia a un co-líder.",
    body: "Los números ya están. La celda del total está vacía. Escribe =SUM, revisa el número, y escríbele a Maria. Jordan también tiene que verlo.",
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
  writeFormula: string;
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
    writeFormula: "Click the total cell and type =SUM(B2:B6).",
    to: "To",
    cc: "Cc",
    ccAdd: "Cc",
    subjectLabel: "Subject",
    subject: "Week of Aug 24 status",
    writeHere: "Write your message here…",
    send: "Send",
    discard: "Discard",
    sentKicker: "Message sent",
    doneTitle: "You wrote the formula and cc'd Jordan.",
    doneBody: `The sheet did not hand you a total. You typed =SUM and got ${STATUS_TOTAL}. Maria is To. Jordan is Cc. That is a status report.`,
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
    writeFormula: "Haz clic en la celda del total y escribe =SUM(B2:B6).",
    to: "Para",
    cc: "Cc",
    ccAdd: "Cc",
    subjectLabel: "Asunto",
    subject: "Estado de la semana del 24 ago",
    writeHere: "Escribe tu mensaje aquí…",
    send: "Enviar",
    discard: "Descartar",
    sentKicker: "Mensaje enviado",
    doneTitle: "Escribiste la fórmula y pusiste a Jordan en copia.",
    doneBody: `La hoja no te dio el total. Escribiste =SUM y salió ${STATUS_TOTAL}. Maria es Para. Jordan es Cc. Eso es un reporte de estado.`,
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

export const HINTS: Record<Lang, { formula: string; empty: string; cc: string; total: string }> = {
  en: {
    formula: "Type =SUM(B2:B6) in the total cell. That is every ticket row.",
    empty: "Write a short message first. Even one sentence is fine.",
    cc: "Click Cc and add Jordan. A co-lead needs this number too.",
    total: `Mention the total (${STATUS_TOTAL}) so Maria does not have to open the sheet.`,
  },
  es: {
    formula: "Escribe =SUM(B2:B6) en la celda del total. Esas son todas las filas de tickets.",
    empty: "Primero escribe un mensaje corto. Una oración está bien.",
    cc: "Haz clic en Cc y agrega a Jordan. Un co-líder también necesita este número.",
    total: `Menciona el total (${STATUS_TOTAL}) para que Maria no tenga que abrir la hoja.`,
  },
};

export const STARTERS: Record<Lang, string[]> = {
  en: [
    `Hi Maria, this week's ticket total is ${STATUS_TOTAL}.`,
    "I added it with =SUM on my copy of the status sheet.",
    "Cc'ing Jordan so he has the number too.",
  ],
  es: [
    `Hola Maria, el total de tickets de esta semana es ${STATUS_TOTAL}.`,
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
      t: "Write the formula. Do not wait for one",
      s: [
        "Click the empty total. Type =SUM( then the cells with numbers, then ).",
        "Press Enter. Check that the number matches what you would expect.",
        "Work in your copy. The view-only template still will not take a formula.",
      ],
      tip: "One SUM. No nesting. The habit is: you authored the total.",
    },
    {
      t: "Cc the person who also needs the number",
      s: [
        "To is Maria. Cc is the co-lead who uses the same number.",
        "Say the total in the email. Do not make them open the sheet.",
        "Cc is for people who need to know. It is not Reply-all.",
      ],
      tip: "If they would have to ask you for the number later, they belong on Cc.",
    },
  ],
  es: [
    {
      t: "Escribe la fórmula. No esperes una",
      s: [
        "Haz clic en el total vacío. Escribe =SUM( luego las celdas con números, luego ).",
        "Presiona Enter. Revisa que el número coincida con lo que esperarías.",
        "Trabaja en tu copia. La plantilla de solo ver sigue sin aceptar una fórmula.",
      ],
      tip: "Un SUM. Sin anidar. El hábito es: tú escribiste el total.",
    },
    {
      t: "Pon en copia a quien también necesita el número",
      s: [
        "Para es Maria. Cc es el co-líder que usa el mismo número.",
        "Di el total en el correo. No los hagas abrir la hoja.",
        "Cc es para quienes necesitan saber. No es Responder a todos.",
      ],
      tip: "Si después te tendrían que pedir el número, van en Cc.",
    },
  ],
};


export function emailMentionsTotal(body: string) {
  return body.includes(String(STATUS_TOTAL));
}

/** The persistent "what to do right now" line, one per step of this job. */
export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Open your copy of the status report.",
    es: "Abre tu copia del reporte de estado.",
  },
  {
    en: "The total cell is empty. Type =SUM and check the number.",
    es: "La celda del total está vacía. Escribe =SUM y revisa el número.",
  },
  {
    en: "Email Maria the report, and cc Jordan.",
    es: "Envíale el reporte a Maria, con copia a Jordan.",
  },
];

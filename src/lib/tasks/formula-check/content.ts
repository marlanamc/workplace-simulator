import type { EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";
import { CORRECT_WEEK_TOTAL } from "../crew-week";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "🧮",
    kicker: "Friday. Hours are due.",
    headline: "The total looks fine, but the formula is not.",
    body: "Open the Hours cell and look at which rows the formula adds up. Someone on the list is being left out.",
    cta: "Open the sheet",
  },
  es: {
    emoji: "🧮",
    kicker: "Viernes. Hay que entregar las horas.",
    headline: "El total se ve bien, pero la fórmula no.",
    body: "Abre la celda de Horas y mira qué filas está sumando la fórmula. Está dejando fuera a alguien de la lista.",
    cta: "Abrir la hoja",
  },
};

export const WRONG_SUM_FORMULA = "=SUM(H2:H5)";
export const RIGHT_SUM_FORMULA = "=SUM(H2:H6)";
export const AVERAGE_FORMULA = "=AVERAGE(H2:H6)";

export const FORMULA_CHECK_COPY: Record<Lang, {
  helpBtn: string;
  appName: string;
  sheetName: string;
  startNewHeading: string;
  blankLabel: string;
  templateBudget: string;
  templateSchedule: string;
  recentHeading: string;
  openedLabel: string;
  noteHeading: string;
  noteBody: string;
  hoursHeader: string;
  nameHeader: string;
  totalLabel: string;
  averageLabel: string;
  emailCta: string;
  fixFirst: string;
  to: string;
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
    sheetName: "Crew Week — Aug 24",
    startNewHeading: "Start a new spreadsheet",
    blankLabel: "Blank",
    templateBudget: "Budget",
    templateSchedule: "Schedule",
    recentHeading: "Recent spreadsheets",
    openedLabel: "Opened today",
    noteHeading: "Maria's note",
    noteBody: "The Hours total looks close enough for payroll. Still — click the formula. Does it include everyone?",
    hoursHeader: "Hours",
    nameHeader: "Name",
    totalLabel: "Total",
    averageLabel: "Average",
    emailCta: "Email Maria the corrected total",
    fixFirst: "The SUM is still missing someone. Change the range so it includes the last name.",
    to: "To",
    subjectLabel: "Subject",
    subject: "Corrected week hours",
    writeHere: "Write your message here…",
    send: "Send",
    discard: "Discard",
    sentKicker: "Message sent",
    doneTitle: "You fixed the range, not just the number.",
    doneBody: "The total looked fine, but the formula was skipping Casey. You opened it, fixed the rows, and sent Maria the real total.",
    badgeName: "Fix a formula range",
    badgeWhere: "Counts toward: Shift Supervisor",
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
    sheetName: "Semana del equipo — 24 ago",
    startNewHeading: "Iniciar una nueva hoja de cálculo",
    blankLabel: "En blanco",
    templateBudget: "Presupuesto",
    templateSchedule: "Horario",
    recentHeading: "Hojas de cálculo recientes",
    openedLabel: "Abierta hoy",
    noteHeading: "Nota de Maria",
    noteBody: "El total de Horas se ve bastante bien para la nómina. Aun así — haz clic en la fórmula. ¿Incluye a todos?",
    hoursHeader: "Horas",
    nameHeader: "Nombre",
    totalLabel: "Total",
    averageLabel: "Promedio",
    emailCta: "Enviar a Maria el total corregido",
    fixFirst: "El SUM todavía omite a alguien. Cambia el rango para que incluya el último nombre.",
    to: "Para",
    subjectLabel: "Asunto",
    subject: "Horas de la semana corregidas",
    writeHere: "Escribe tu mensaje aquí…",
    send: "Enviar",
    discard: "Descartar",
    sentKicker: "Mensaje enviado",
    doneTitle: "Arreglaste el rango, no solo el número.",
    doneBody: "El total se veía bien, pero la fórmula estaba dejando fuera a Casey. La abriste, corregiste las filas y le enviaste a Maria el total real.",
    badgeName: "Corregir el rango de una fórmula",
    badgeWhere: "Cuenta para: Supervisor de turno",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
    askPerson: "Mejor preguntar a una persona",
  },
};

export const EMPTY_EMAIL_HINT: Record<Lang, string> = {
  en: "Write a short message first. Even one sentence is fine.",
  es: "Primero escribe un mensaje corto. Una oración está bien.",
};

export const WRONG_EMAIL_HINT: Record<Lang, string> = {
  en: `Tell Maria the corrected total (${CORRECT_WEEK_TOTAL}) and that a name was missing.`,
  es: `Dile a Maria el total corregido (${CORRECT_WEEK_TOTAL}) y que faltaba un nombre.`,
};

export const STARTERS: Record<Lang, string[]> = {
  en: [
    `Hi Maria, the hours total is ${CORRECT_WEEK_TOTAL}.`,
    "The SUM was missing Casey Brooks. I fixed the range.",
    "The AVERAGE already included everyone.",
  ],
  es: [
    `Hola Maria, el total de horas es ${CORRECT_WEEK_TOTAL}.`,
    "El SUM no incluía a Casey Brooks. Ya corregí el rango.",
    "El AVERAGE ya incluía a todos.",
  ],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Read the formula, not just the number",
      s: [
        "Click the total cell. The formula bar shows you which rows it is actually adding.",
        "Count the names. If the last row is outside the range, the total is wrong even though it looks fine.",
        "Fix the range so it includes everyone. Then check AVERAGE the same way.",
      ],
      tip: "A number can look official and still skip a person. Open the formula every time.",
    },
    {
      t: "Tell your lead what was wrong",
      s: [
        "Send the corrected total. Say what the formula was missing.",
        "You do not need a long explanation. One clear sentence is enough.",
        "Fix it first, then write. Do not send a number you have not checked.",
      ],
      tip: "Naming the missed person helps your lead trust the new number.",
    },
  ],
  es: [
    {
      t: "Lee la fórmula, no solo el número",
      s: [
        "Haz clic en la celda del total. La barra de fórmulas te muestra qué filas está sumando en realidad.",
        "Cuenta los nombres. Si la última fila queda fuera del rango, el total está mal aunque se vea bien.",
        "Corrige el rango para que incluya a todos. Luego revisa AVERAGE de la misma forma.",
      ],
      tip: "Un número puede verse oficial y aun así saltarse a una persona. Abre la fórmula siempre.",
    },
    {
      t: "Dile a tu líder qué estaba mal",
      s: [
        "Envía el total corregido. Di qué le faltaba a la fórmula.",
        "No necesitas una explicación larga. Con una oración clara es suficiente.",
        "Corrígelo primero, luego escribe. No envíes un número que no hayas revisado.",
      ],
      tip: "Nombrar a la persona que faltaba ayuda a tu líder a confiar en el número nuevo.",
    },
  ],
};


/** Accept SUM/AVERAGE ranges that include every crew row (2 through 6). */
export function rangeCoversCrew(formula: string, fn: "sum" | "average"): boolean {
  const t = formula.trim();
  const re = fn === "sum"
    ? /^=\s*sum\s*\(\s*H\s*(\d+)\s*:\s*H\s*(\d+)\s*\)\s*$/i
    : /^=\s*average\s*\(\s*H\s*(\d+)\s*:\s*H\s*(\d+)\s*\)\s*$/i;
  const m = t.match(re);
  if (!m) return false;
  const start = Math.min(Number(m[1]), Number(m[2]));
  const end = Math.max(Number(m[1]), Number(m[2]));
  return start <= 2 && end >= 6 && end <= 6;
}

export function parseRange(formula: string): { start: number; end: number } | null {
  const m = formula.trim().match(/^=\s*(?:sum|average)\s*\(\s*H\s*(\d+)\s*:\s*H\s*(\d+)\s*\)\s*$/i);
  if (!m) return null;
  return { start: Math.min(Number(m[1]), Number(m[2])), end: Math.max(Number(m[1]), Number(m[2])) };
}

export function emailMentionsFix(body: string): boolean {
  const t = body.toLowerCase();
  const hasTotal = t.includes(String(CORRECT_WEEK_TOTAL));
  const hasMiss = /casey|missing|faltaba|faltaba|omit|range|rango|sum/.test(t);
  return hasTotal || hasMiss;
}

/** The persistent "what to do right now" line, one per step of this job. */
export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Open the hours sheet.",
    es: "Abre la hoja de horas.",
  },
  {
    en: "Click the Hours total and read which rows it adds.",
    es: "Haz clic en el total de Horas y mira qué filas suma.",
  },
  {
    en: "Someone is missing. Fix the formula, then tell Maria.",
    es: "Falta alguien. Arregla la fórmula y avísale a Maria.",
  },
];

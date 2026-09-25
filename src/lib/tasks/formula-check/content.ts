import type { EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";
import { mentionsAmount } from "@/lib/text-facts";
import { CORRECT_WEEK_TOTAL } from "../crew-week";
import { openFileStep } from "../open-file-step";

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
    sheetName: "Crew Week: Aug 24",
    startNewHeading: "Start a new spreadsheet",
    blankLabel: "Blank",
    templateBudget: "Budget",
    templateSchedule: "Schedule",
    recentHeading: "Recent spreadsheets",
    openedLabel: "Opened today",
    noteHeading: "Renata's note",
    noteBody: "Please check the Hours total before I do payroll. Does the formula count everyone on the crew?",
    hoursHeader: "Hours",
    nameHeader: "Name",
    totalLabel: "Total",
    averageLabel: "Average",
    emailCta: "Email Renata the corrected total",
    fixFirst: "The total still stops before row 6. Casey is in row 6. Change H5 to H6.",
    to: "To",
    subjectLabel: "Subject",
    subject: "Corrected week hours",
    writeHere: "Write your message here…",
    send: "Send",
    discard: "Discard",
    sentKicker: "Message sent",
    doneTitle: "You fixed the range, not just the number.",
    doneBody: "The total looked fine, but the formula was skipping Casey. You opened it, fixed the rows, and sent Renata the real total.",
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
    sheetName: "Semana del equipo: 24 ago",
    startNewHeading: "Iniciar una nueva hoja de cálculo",
    blankLabel: "En blanco",
    templateBudget: "Presupuesto",
    templateSchedule: "Horario",
    recentHeading: "Hojas de cálculo recientes",
    openedLabel: "Abierta hoy",
    noteHeading: "Nota de Renata",
    noteBody: "Por favor revisa el total de Horas antes de hacer la nómina. ¿La fórmula cuenta a todo el equipo?",
    hoursHeader: "Horas",
    nameHeader: "Nombre",
    totalLabel: "Total",
    averageLabel: "Promedio",
    emailCta: "Enviar a Renata el total corregido",
    fixFirst: "El total todavía se detiene antes de la fila 6. Casey está en la fila 6. Cambia H5 por H6.",
    to: "Para",
    subjectLabel: "Asunto",
    subject: "Horas de la semana corregidas",
    writeHere: "Escribe tu mensaje aquí…",
    send: "Enviar",
    discard: "Descartar",
    sentKicker: "Mensaje enviado",
    doneTitle: "Arreglaste el rango, no solo el número.",
    doneBody: "El total se veía bien, pero la fórmula estaba dejando fuera a Casey. La abriste, corregiste las filas y le enviaste a Renata el total real.",
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
  en: `Tell Renata the corrected total (${CORRECT_WEEK_TOTAL}) and that a name was missing.`,
  es: `Dile a Renata el total corregido (${CORRECT_WEEK_TOTAL}) y que faltaba un nombre.`,
};

export const STARTERS: Record<Lang, string[]> = {
  en: [
    `Hi Renata, the hours total is ${CORRECT_WEEK_TOTAL}.`,
    "The formula was missing Casey Brooks. I fixed it.",
    "Casey's hours are in the total now.",
  ],
  es: [
    `Hola Renata, el total de horas es ${CORRECT_WEEK_TOTAL}.`,
    "A la fórmula le faltaba Casey Brooks. Ya la corregí.",
    "Las horas de Casey ya están en el total.",
  ],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Read the formula, not just the number",
      s: [
        "Click the total. The formula bar at the top shows the formula, like =SUM(H2:H5).",
        "H2:H5 means: add column H, from row 2 to row 5. Look at the row numbers on the left.",
        "If a person is in a row the formula does not add, change the last number. H5 becomes H6.",
      ],
      tip: "A total can look right and still leave someone out. Look at the formula, not only the number.",
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
        "Haz clic en el total. La barra de fórmulas, arriba, muestra la fórmula, como =SUM(H2:H5).",
        "H2:H5 quiere decir: suma la columna H, de la fila 2 a la fila 5. Mira los números de fila a la izquierda.",
        "Si una persona está en una fila que la fórmula no suma, cambia el último número. H5 pasa a ser H6.",
      ],
      tip: "Un total puede verse bien y aun así dejar a alguien fuera. Mira la fórmula, no solo el número.",
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


const FIRST_CREW_ROW = 2;
const LAST_CREW_ROW = 6;

/**
 * The rows a formula adds, however the learner wrote it: a range
 * (=SUM(H2:H6), backwards or spaced out) or one cell at a time
 * (=H2+H3+H4+H5+H6). Null when it is not a formula this sheet reads.
 */
function rowsOf(formula: string, fn: "sum" | "average"): number[] | null {
  const t = formula.trim();
  const range = t.match(
    fn === "sum"
      ? /^=\s*sum\s*\(\s*H\s*(\d+)\s*:\s*H\s*(\d+)\s*\)\s*$/i
      : /^=\s*average\s*\(\s*H\s*(\d+)\s*:\s*H\s*(\d+)\s*\)\s*$/i,
  );
  if (range) {
    const a = Number(range[1]);
    const b = Number(range[2]);
    const rows: number[] = [];
    for (let r = Math.min(a, b); r <= Math.max(a, b); r++) rows.push(r);
    return rows;
  }
  if (fn === "sum" && /^=\s*H\s*\d+(\s*\+\s*H\s*\d+)*\s*$/i.test(t)) {
    return [...new Set((t.match(/\d+/g) ?? []).map(Number))].sort((x, y) => x - y);
  }
  return null;
}

/** Accept SUM/AVERAGE formulas that add every crew row (2 through 6) and nothing else. */
export function rangeCoversCrew(formula: string, fn: "sum" | "average"): boolean {
  const rows = rowsOf(formula, fn);
  if (!rows) return false;
  return rows.length === LAST_CREW_ROW - FIRST_CREW_ROW + 1 && rows[0] === FIRST_CREW_ROW && rows[rows.length - 1] === LAST_CREW_ROW;
}

/** The rows a formula spans, low to high, for the sheet's highlight and its live value. */
export function parseRange(formula: string): { start: number; end: number } | null {
  const rows = rowsOf(formula, /average/i.test(formula) ? "average" : "sum");
  if (!rows || rows.length === 0) return null;
  const start = rows[0];
  const end = rows[rows.length - 1];
  // A one-cell-at-a-time list with a gap is not one range; the sheet cannot shade it.
  if (rows.length !== end - start + 1) return null;
  return { start, end };
}

export type FormulaProblem = "ok" | "no-equals" | "unreadable" | "missing-last" | "missing-first" | "too-far";

/** What is wrong with a SUM, so the correction can say exactly that. */
export function sumProblem(formula: string): FormulaProblem {
  if (rangeCoversCrew(formula, "sum")) return "ok";
  const t = formula.trim();
  if (!t.startsWith("=")) return "no-equals";
  const rows = rowsOf(t, "sum");
  if (!rows) return "unreadable";
  if (rows[rows.length - 1] > LAST_CREW_ROW) return "too-far";
  if (rows[0] > FIRST_CREW_ROW) return "missing-first";
  return "missing-last";
}

export const SUM_PROBLEM_HINT: Record<Exclude<FormulaProblem, "ok">, Localized> = {
  "no-equals": {
    en: "A formula starts with =. Type it like this: =SUM(H2:H6)",
    es: "Una fórmula empieza con =. Escríbela así: =SUM(H2:H6)",
  },
  unreadable: {
    en: "Type it like this: =SUM(H2:H6)",
    es: "Escríbela así: =SUM(H2:H6)",
  },
  "missing-last": {
    en: "The total still stops before row 6. Casey is in row 6. Change H5 to H6.",
    es: "El total todavía se detiene antes de la fila 6. Casey está en la fila 6. Cambia H5 por H6.",
  },
  "missing-first": {
    en: "The total starts too late. Alex is in row 2. Start at H2: =SUM(H2:H6)",
    es: "El total empieza muy tarde. Alex está en la fila 2. Empieza en H2: =SUM(H2:H6)",
  },
  "too-far": {
    en: "Row 7 is the total itself. Stop at row 6: =SUM(H2:H6)",
    es: "La fila 7 es el total. Detente en la fila 6: =SUM(H2:H6)",
  },
};

export function emailMentionsFix(body: string): boolean {
  const t = body.toLowerCase();
  const hasTotal = mentionsAmount(t, CORRECT_WEEK_TOTAL);
  const hasMiss = /casey|missing|missed|left out|excluded|skipped|falt|omit|no inclu|exclu|range|rango|sum|última fila|ultima fila|last row/.test(t);
  return hasTotal && hasMiss;
}

/** The persistent "what to do right now" line, one per step of this job. */
export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  openFileStep(FORMULA_CHECK_COPY, (c) => c.sheetName),
  {
    en: "The total adds rows 2 to 5. Casey is in row 6. Click the formula bar and change H5 to H6.",
    es: "El total suma las filas 2 a 5. Casey está en la fila 6. Haz clic en la barra de fórmulas y cambia H5 por H6.",
  },
  {
    en: `The total is ${CORRECT_WEEK_TOTAL} now. Click Email Renata the corrected total.`,
    es: `Ahora el total es ${CORRECT_WEEK_TOTAL}. Haz clic en Enviar a Renata el total corregido.`,
  },
  {
    en: "Tell Renata the new total and who was missing. Then click Send.",
    es: "Dile a Renata el total nuevo y quién faltaba. Después haz clic en Enviar.",
  },
];

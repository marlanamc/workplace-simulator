import { mentionsAmount } from "@/lib/text-facts";
import type { EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";
import { openFileStep } from "../open-file-step";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "📈",
    kicker: "Wednesday. Budget is in.",
    headline: "One category is over.",
    body: "Open the status formula. Look at the chart. Email Renata which one went over, and by how much.",
    cta: "Open the sheet",
  },
  es: {
    emoji: "📈",
    kicker: "Miércoles. Ya está el presupuesto.",
    headline: "Una categoría se pasó.",
    body: "Abre la fórmula de estado. Mira el gráfico. Escríbele a Renata cuál se pasó, y por cuánto.",
    cta: "Abrir la hoja",
  },
};

export const OVER_KEY = "labor";
export const OVER_AMOUNT = 450;

export const BUDGET_ROWS = [
  { key: "supplies", label: { en: "Supplies", es: "Insumos" }, budget: 800, actual: 720 },
  { key: "labor", label: { en: "Labor", es: "Mano de obra" }, budget: 2400, actual: 2850 },
  { key: "utilities", label: { en: "Utilities", es: "Servicios" }, budget: 360, actual: 340 },
  { key: "marketing", label: { en: "Marketing", es: "Marketing" }, budget: 200, actual: 180 },
] as const;

export function statusFor(actual: number, budget: number): "over" | "under" {
  return actual > budget ? "over" : "under";
}

/** The formula as the sheet shows it, with the same words the cells show. */
export function statusFormula(row: number, lang: Lang = "en"): string {
  const [over, under] = lang === "en" ? ["over", "under"] : ["sobre", "bajo"];
  return `=IF(C${row}>B${row},"${over}","${under}")`;
}

/** Money as the sheet and the corrections both write it: $2,850. */
export const dollars = (n: number) => `$${n.toLocaleString("en-US")}`;

export const BUDGET_SHEET_COPY: Record<Lang, {
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
  categoryHeader: string;
  budgetHeader: string;
  actualHeader: string;
  statusHeader: string;
  overLabel: string;
  underLabel: string;
  chartTitle: string;
  emailCta: string;
  readFirst: string;
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
}> = {
  en: {
    helpBtn: "Help me with this step",
    appName: "Sheets",
    sheetName: "Cafe budget: week of Sep 1",
    startNewHeading: "Start a new spreadsheet",
    blankLabel: "Blank",
    templateBudget: "Budget",
    templateSchedule: "Schedule",
    recentHeading: "Recent spreadsheets",
    openedLabel: "Opened today",
    noteHeading: "Renata's note",
    noteBody: "One kind of cost went over the budget this week. Which one, and by how much? Please email me.",
    categoryHeader: "Category",
    budgetHeader: "Budget",
    actualHeader: "Actual",
    statusHeader: "Status",
    overLabel: "over",
    underLabel: "under",
    chartTitle: "Actual by category",
    emailCta: "Email Renata what is over",
    readFirst: "First, find the Status cell that says \"over\". Click it and read its formula.",
    to: "To",
    subjectLabel: "Subject",
    subject: "This week's budget: one category over",
    writeHere: "Write which category is over, and by how much…",
    send: "Send",
    discard: "Discard",
    sentKicker: "Message sent",
    doneTitle: "You read the IF, not just the total.",
    doneBody: "Labor was $450 over budget. The formula and the chart said the same thing. You told Renata which category it was and how much.",
    badgeName: "Read a budget IF and a chart",
    badgeWhere: "Counts toward: Assistant Manager",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
  },
  es: {
    helpBtn: "Ayúdame con este paso",
    appName: "Hojas",
    sheetName: "Presupuesto del café: sem. 1 sep",
    startNewHeading: "Iniciar una nueva hoja de cálculo",
    blankLabel: "En blanco",
    templateBudget: "Presupuesto",
    templateSchedule: "Horario",
    recentHeading: "Hojas de cálculo recientes",
    openedLabel: "Abierta hoy",
    noteHeading: "Nota de Renata",
    noteBody: "Un tipo de gasto se pasó del presupuesto esta semana. ¿Cuál, y por cuánto? Por favor escríbeme.",
    categoryHeader: "Categoría",
    budgetHeader: "Presupuesto",
    actualHeader: "Real",
    statusHeader: "Estado",
    overLabel: "sobre",
    underLabel: "bajo",
    chartTitle: "Real por categoría",
    emailCta: "Escribirle a Renata qué se pasó",
    readFirst: "Primero busca la celda de Estado que dice \"sobre\". Haz clic en ella y lee su fórmula.",
    to: "Para",
    subjectLabel: "Asunto",
    subject: "Presupuesto de esta semana: una categoría se pasó",
    writeHere: "Escribe qué categoría se pasó, y por cuánto…",
    send: "Enviar",
    discard: "Descartar",
    sentKicker: "Mensaje enviado",
    doneTitle: "Leíste el IF, no solo el total.",
    doneBody: "Mano de obra se pasó $450 del presupuesto. La fórmula y el gráfico dijeron lo mismo. Le dijiste a Renata cuál categoría era y por cuánto.",
    badgeName: "Leer un IF de presupuesto y un gráfico",
    badgeWhere: "Cuenta para: Asistente de gerencia",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
  },
};

export const EMPTY_EMAIL_HINT: Record<Lang, string> = {
  en: "Write a short message first. Even one sentence is fine.",
  es: "Primero escribe un mensaje corto. Una oración está bien.",
};

export const WRONG_EMAIL_HINT: Record<Lang, string> = {
  en: "Name the category and how much it is over. Compare actual spending ($2,850) with the budget ($2,400).",
  es: "Nombra la categoría y cuánto se pasó. Compara el gasto real ($2,850) con el presupuesto ($2,400).",
};

export const STARTERS: Record<Lang, string[]> = {
  en: [
    "Hi Renata, labor is over budget by $450.",
    "Labor actual is 2850 against a 2400 budget, a difference of 450.",
    "The IF flags labor as over by $450. The chart shows the same bar.",
  ],
  es: [
    "Hola Renata, mano de obra se pasó del presupuesto por $450.",
    "Mano de obra real es 2850 contra un presupuesto de 2400: una diferencia de 450.",
    "El IF marca mano de obra como \"sobre\" por $450. El gráfico muestra la misma barra.",
  ],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "An IF formula is a yes-or-no question in a cell",
      s: [
        "Click the Status cell. The formula bar shows =IF(C3>B3,\"over\",\"under\").",
        "In plain words: if Actual (column C) is bigger than Budget (column B), the cell says \"over\". If not, it says \"under\".",
        "The chart shows the same thing. The red bar goes past its dashed budget line.",
        "To find how much over, subtract: Actual minus Budget.",
      ],
      tip: "In this lesson you only read the formula. You do not write one. Once you can read an IF, writing one later is easier.",
    },
  ],
  es: [
    {
      t: "Una fórmula IF es una pregunta de sí o no dentro de una celda",
      s: [
        "Haz clic en la celda de Estado. La barra de fórmulas muestra =IF(C3>B3,\"sobre\",\"bajo\").",
        "En palabras simples: si Real (columna C) es más grande que Presupuesto (columna B), la celda dice \"sobre\". Si no, dice \"bajo\".",
        "El gráfico muestra lo mismo. La barra roja pasa su línea punteada de presupuesto.",
        "Para saber por cuánto se pasó, resta: Real menos Presupuesto.",
      ],
      tip: "En esta lección solo lees la fórmula. No escribes ninguna. Cuando puedas leer un IF, escribir uno después es más fácil.",
    },
  ],
};

export function emailFlagsOver(body: string): boolean {
  const t = body.toLowerCase();
  const namesLabor = /labou?r|mano de obra|nómina|nomina|payroll|staff|wages|salarios|sueldos/.test(t);
  const labor = BUDGET_ROWS.find((row) => row.key === "labor")!;
  return namesLabor && mentionsAmount(t, labor.actual - labor.budget);
}

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  openFileStep(BUDGET_SHEET_COPY, (c) => c.sheetName),
  {
    en: "Find the Status cell that says over. Click it and read the formula.",
    es: "Busca la celda de Estado que dice sobre. Haz clic en ella y lee la fórmula.",
  },
  {
    en: "Click Email Renata what is over.",
    es: "Haz clic en Escribirle a Renata qué se pasó.",
  },
  {
    en: "Write Renata the category and how much it is over. Subtract: Actual minus Budget.",
    es: "Escríbele a Renata la categoría y por cuánto se pasó. Resta: Real menos Presupuesto.",
  },
];

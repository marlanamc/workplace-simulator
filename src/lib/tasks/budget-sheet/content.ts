import type { EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "📈",
    kicker: "Wednesday. Budget is in.",
    headline: "One category is over.",
    body: "Open the status formula. Look at the chart. Email Maria which one went over, and by how much.",
    cta: "Open the sheet",
  },
  es: {
    emoji: "📈",
    kicker: "Miércoles. Ya está el presupuesto.",
    headline: "Una categoría se pasó.",
    body: "Abre la fórmula de estado. Mira el gráfico. Escríbele a Maria cuál se pasó, y por cuánto.",
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

export function statusFormula(row: number): string {
  return `=IF(C${row}>B${row},"over","under")`;
}

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
    sheetName: "Cafe budget — week of Sep 1",
    startNewHeading: "Start a new spreadsheet",
    blankLabel: "Blank",
    templateBudget: "Budget",
    templateSchedule: "Schedule",
    recentHeading: "Recent spreadsheets",
    openedLabel: "Opened today",
    noteHeading: "Maria's note",
    noteBody: "Click a status cell. Read the IF. Then look at the chart — it should tell the same story.",
    categoryHeader: "Category",
    budgetHeader: "Budget",
    actualHeader: "Actual",
    statusHeader: "Status",
    overLabel: "over",
    underLabel: "under",
    chartTitle: "Actual by category",
    emailCta: "Email Maria what is over",
    readFirst: "Click the status cell that says over. Read the formula first.",
    to: "To",
    subjectLabel: "Subject",
    subject: "This week's budget — one category over",
    writeHere: "Write which category is over, and by how much…",
    send: "Send",
    discard: "Discard",
    sentKicker: "Message sent",
    doneTitle: "You read the IF, not just the total.",
    doneBody: "Labor was $450 over. The formula and the chart said the same thing. You told Maria the category and the amount.",
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
    sheetName: "Presupuesto del café — sem. 1 sep",
    startNewHeading: "Iniciar una nueva hoja de cálculo",
    blankLabel: "En blanco",
    templateBudget: "Presupuesto",
    templateSchedule: "Horario",
    recentHeading: "Hojas de cálculo recientes",
    openedLabel: "Abierta hoy",
    noteHeading: "Nota de Maria",
    noteBody: "Haz clic en una celda de estado. Lee el IF. Luego mira el gráfico — debe contar lo mismo.",
    categoryHeader: "Categoría",
    budgetHeader: "Presupuesto",
    actualHeader: "Real",
    statusHeader: "Estado",
    overLabel: "sobre",
    underLabel: "bajo",
    chartTitle: "Real por categoría",
    emailCta: "Escribirle a Maria qué se pasó",
    readFirst: "Haz clic en la celda de estado que dice sobre. Lee la fórmula primero.",
    to: "Para",
    subjectLabel: "Asunto",
    subject: "Presupuesto de esta semana — una categoría se pasó",
    writeHere: "Escribe qué categoría se pasó, y por cuánto…",
    send: "Enviar",
    discard: "Descartar",
    sentKicker: "Mensaje enviado",
    doneTitle: "Leíste el IF, no solo el total.",
    doneBody: "Mano de obra se pasó $450. La fórmula y el gráfico dijeron lo mismo. Le dijiste a Maria la categoría y la cantidad.",
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
  en: "Name the over category (labor) and that it is over — the $450 helps.",
  es: "Nombra la categoría que se pasó (mano de obra) y que se pasó — los $450 ayudan.",
};

export const STARTERS: Record<Lang, string[]> = {
  en: [
    "Hi Maria, labor is over budget by $450.",
    "Labor actual is 2850 against a 2400 budget.",
    "The IF flags labor as over. The chart shows the same bar.",
  ],
  es: [
    "Hola Maria, mano de obra se pasó del presupuesto por $450.",
    "Mano de obra real es 2850 contra un presupuesto de 2400.",
    "El IF marca mano de obra como sobre. El gráfico muestra la misma barra.",
  ],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "IF is a yes-or-no in a cell",
      s: [
        "Click the status cell. The formula bar shows =IF(actual>budget,\"over\",\"under\").",
        "In plain language: if this number is bigger than that one, say over. If not, say under.",
        "The chart next to the table is the same story in bars. Find the tall one that passed its budget.",
      ],
      tip: "This lesson is reading, not writing the formula. Once you can read an IF, writing one later is easier.",
    },
  ],
  es: [
    {
      t: "IF es un sí-o-no en una celda",
      s: [
        "Haz clic en la celda de estado. La barra muestra =IF(real>presupuesto,\"sobre\",\"bajo\").",
        "En lenguaje claro: si este número es más grande que aquel, di sobre. Si no, di bajo.",
        "El gráfico al lado de la tabla es la misma historia en barras. Encuentra la alta que pasó su presupuesto.",
      ],
      tip: "Esta lección es de leer, no de escribir la fórmula. Cuando puedas leer un IF, escribirlo después es más fácil.",
    },
  ],
};

export function emailFlagsOver(body: string): boolean {
  const t = body.toLowerCase();
  const namesLabor = /labor|mano de obra|nómina|nomina|payroll/.test(t);
  const namesOver = /over|sobre|pasó|paso|450|2850/.test(t);
  return namesLabor && namesOver;
}

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Open this week's budget sheet.",
    es: "Abre la hoja de presupuesto de esta semana.",
  },
  {
    en: "Click the over status cell and read the IF.",
    es: "Haz clic en la celda de estado sobre y lee el IF.",
  },
  {
    en: "Email Maria the category and how much it is over.",
    es: "Escríbele a Maria la categoría y por cuánto se pasó.",
  },
];

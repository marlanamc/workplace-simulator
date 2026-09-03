import type { Lang, Lesson, Localized } from "@/lib/task-types";

export const PLANTED_TOTAL = 188;
export const MISSING_KEY = "dinner";

export interface ExpenseRow {
  key: string;
  merchant: Localized;
  category: Localized;
  amount: number;
  receipt: string | null;
}

export const EXPENSE_ROWS: ExpenseRow[] = [
  {
    key: "uber",
    merchant: { en: "Uber", es: "Uber" },
    category: { en: "Travel", es: "Viaje" },
    amount: 24,
    receipt: "uber-0912.pdf",
  },
  {
    key: "staples",
    merchant: { en: "Staples", es: "Staples" },
    category: { en: "Supplies", es: "Suministros" },
    amount: 42,
    receipt: "staples-0910.pdf",
  },
  {
    key: "lunch",
    merchant: { en: "Harbor Deli", es: "Harbor Deli" },
    category: { en: "Meals", es: "Comidas" },
    amount: 48,
    receipt: "deli-0911.pdf",
  },
  {
    key: "parking",
    merchant: { en: "Garage 4", es: "Garage 4" },
    category: { en: "Travel", es: "Viaje" },
    amount: 74,
    receipt: "parking-0912.pdf",
  },
  {
    key: MISSING_KEY,
    merchant: { en: "Team dinner", es: "Cena del equipo" },
    category: { en: "Meals", es: "Comidas" },
    amount: 95,
    receipt: null,
  },
];

export const RECEIPT_FILES = EXPENSE_ROWS.filter((r) => r.receipt).map((r) => ({
  key: r.key,
  name: r.receipt!,
  folder: "Receipts",
  date: "Sep 2",
}));

export function receiptedKeys(): string[] {
  return EXPENSE_ROWS.filter((r) => r.receipt).map((r) => r.key);
}

export function expenseReadyToSubmit(flagged: string | null, matched: readonly string[]): boolean {
  const needed = receiptedKeys();
  return flagged === MISSING_KEY && needed.every((k) => matched.includes(k));
}

export const EXPENSE_COPY: Record<Lang, {
  helpBtn: string;
  appName: string;
  sheetName: string;
  startNewHeading: string;
  blankLabel: string;
  recentHeading: string;
  openedLabel: string;
  noteHeading: string;
  noteBody: string;
  merchantHeader: string;
  categoryHeader: string;
  amountHeader: string;
  receiptHeader: string;
  match: string;
  matched: string;
  flag: string;
  flagged: string;
  noReceipt: string;
  submit: string;
  submitBlind: string;
  needMatch: string;
  sentKicker: string;
  tryAgain: string;
  backToDesk: string;
  lessonKicker: string;
  tipLabel: string;
  gotIt: string;
  receiptsHint: string;
}> = {
  en: {
    helpBtn: "Help me with this step",
    appName: "Sheets",
    sheetName: "September expenses",
    startNewHeading: "Start a new spreadsheet",
    blankLabel: "Blank",
    recentHeading: "Recent spreadsheets",
    openedLabel: "Opened today",
    noteHeading: "Office note",
    noteBody: "Match each row to its receipt in Drive. One row has no receipt. Flag that row, then submit the report.",
    merchantHeader: "Merchant",
    categoryHeader: "Category",
    amountHeader: "Amount",
    receiptHeader: "Receipt",
    match: "Match",
    matched: "Matched",
    flag: "Flag missing",
    flagged: "Flagged",
    noReceipt: "No receipt",
    submit: "Submit report",
    submitBlind: "Do not submit it like this. First, flag the row that has no receipt.",
    needMatch: "Match the rows that have receipts first. Open Drive if you need to see them.",
    sentKicker: "Report submitted",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
    receiptsHint: "Receipts live in Drive. Open Drive from the bookmarks.",
  },
  es: {
    helpBtn: "Ayúdame con este paso",
    appName: "Hojas",
    sheetName: "Gastos de septiembre",
    startNewHeading: "Iniciar una nueva hoja de cálculo",
    blankLabel: "En blanco",
    recentHeading: "Hojas de cálculo recientes",
    openedLabel: "Abierta hoy",
    noteHeading: "Nota de la oficina",
    noteBody: "Empareja cada fila con su recibo en Drive. Una fila no tiene recibo. Marca esa fila, luego envía el informe.",
    merchantHeader: "Comercio",
    categoryHeader: "Categoría",
    amountHeader: "Monto",
    receiptHeader: "Recibo",
    match: "Emparejar",
    matched: "Emparejado",
    flag: "Marcar falta",
    flagged: "Marcado",
    noReceipt: "Sin recibo",
    submit: "Enviar informe",
    submitBlind: "No lo envíes así. Primero, marca la fila que no tiene recibo.",
    needMatch: "Empareja primero las filas que sí tienen recibo. Abre Drive si necesitas verlos.",
    sentKicker: "Informe enviado",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
    receiptsHint: "Los recibos están en Drive. Abre Drive en los marcadores.",
  },
};

export const RECEIPTS_COPY: Record<Lang, {
  heading: string;
  body: string;
  back: string;
}> = {
  en: {
    heading: "Receipts — September",
    body: "There are four PDFs here. There is no receipt for the team dinner.",
    back: "You can only read these. Match them to the rows on the sheet.",
  },
  es: {
    heading: "Recibos — septiembre",
    body: "Aquí hay cuatro PDFs. No hay recibo de la cena del equipo.",
    back: "Estos solo se pueden leer. Emparéjalos con las filas de la hoja.",
  },
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "The row with no receipt is the point of this task",
      s: [
        "Open Drive to see the receipts. Match the four rows that have one.",
        "The row with no file is the one to flag. If you submit the report without flagging it, it comes back to you.",
      ],
      tip: "If you cannot point at the PDF for a row, you have not matched that row yet.",
    },
  ],
  es: [
    {
      t: "La fila sin recibo es el punto de esta tarea",
      s: [
        "Abre Drive para ver los recibos. Empareja las cuatro filas que sí tienen uno.",
        "La fila sin archivo es la que hay que marcar. Si envías el informe sin marcarla, te lo regresan.",
      ],
      tip: "Si no puedes señalar el PDF de una fila, todavía no emparejaste esa fila.",
    },
  ],
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  { en: "Open the expense sheet.", es: "Abre la hoja de gastos." },
  { en: "Match the receipts. Flag what is missing.", es: "Empareja los recibos. Marca lo que falta." },
  { en: "Submit the report.", es: "Envía el informe." },
];

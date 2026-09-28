import type { Lang, Lesson, Localized } from "@/lib/task-types";
import { openFileStep } from "../open-file-step";

export const PLANTED_TOTAL = 188;
export const MISSING_KEY = "dinner";

export interface ExpenseRow {
  key: string;
  merchant: Localized;
  category: Localized;
  amount: number;
  /** The receipt's file name in Drive. The name does not say the merchant, so the learner reads the receipt. */
  receipt: string | null;
  /** The date printed on the receipt, "Sep 12". */
  receiptDate?: string;
}

export const EXPENSE_ROWS: ExpenseRow[] = [
  {
    key: "uber",
    merchant: { en: "Uber", es: "Uber" },
    category: { en: "Travel", es: "Viaje" },
    amount: 24,
    receipt: "receipt-0912-a.pdf",
    receiptDate: "Sep 12",
  },
  {
    key: "staples",
    merchant: { en: "Staples", es: "Staples" },
    category: { en: "Supplies", es: "Suministros" },
    amount: 42,
    receipt: "receipt-0910.pdf",
    receiptDate: "Sep 10",
  },
  {
    key: "lunch",
    merchant: { en: "Harbor Deli", es: "Harbor Deli" },
    category: { en: "Meals", es: "Comidas" },
    amount: 48,
    receipt: "receipt-0911.pdf",
    receiptDate: "Sep 11",
  },
  {
    key: "parking",
    merchant: { en: "Garage 4", es: "Garage 4" },
    category: { en: "Travel", es: "Viaje" },
    amount: 74,
    receipt: "receipt-0912-b.pdf",
    receiptDate: "Sep 12",
  },
  {
    key: MISSING_KEY,
    merchant: { en: "Team dinner", es: "Cena del equipo" },
    category: { en: "Meals", es: "Comidas" },
    amount: 95,
    receipt: null,
  },
];

/**
 * The receipts in Drive, in file-name order (not sheet order). Two are from
 * Sep 12 and both are Travel, so only the merchant and amount printed on the
 * receipt tell them apart.
 */
export const RECEIPT_FILES = EXPENSE_ROWS.filter((r) => r.receipt)
  .map((r) => ({
    key: r.key,
    name: r.receipt!,
    folder: "Receipts",
    date: r.receiptDate ?? "",
    merchant: r.merchant,
    amount: r.amount,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export function receiptedKeys(): string[] {
  return EXPENSE_ROWS.filter((r) => r.receipt).map((r) => r.key);
}

export function expenseReadyToSubmit(flagged: string | null, matched: readonly string[]): boolean {
  const needed = receiptedKeys();
  return flagged === MISSING_KEY && needed.every((k) => matched.includes(k));
}

export function expenseReceiptMatches(key: string, receipt: string): boolean {
  const row = EXPENSE_ROWS.find(r => r.key === key);
  return Boolean(row?.receipt && row.receipt === receipt);
}

export function expenseTotalIsCorrect(value: string): boolean {
  const normalized = value.trim().replace(/^\$\s*/, "").replace(",", ".");
  return /^\d+(?:\.\d{1,2})?$/.test(normalized) && Number(normalized) === PLANTED_TOTAL;
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
  chooseReceipt: string;
  totalLabel: string;
  wrongTotal: string;
  notToday: string;
  hasReceipt: string;
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
    needMatch: "Compare each selected receipt with its merchant and amount. Open Drive to read the receipts. Leave an expense without a receipt empty.",
    sentKicker: "Report submitted",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
    receiptsHint: "Receipts live in Drive. Open Drive from the bookmarks.",
    chooseReceipt: "Choose receipt",
    totalLabel: "Total with receipts ($)",
    wrongTotal: "Add only the amounts with receipts. Leave out the expense you flagged.",
    notToday: "That's not today's sheet. Open September expenses.",
    hasReceipt: "There is a receipt for this expense in Drive. Compare its merchant and amount.",
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
    needMatch: "Compara cada recibo elegido con su comercio y monto. Abre Drive para leer los recibos. Deja vacío el gasto sin recibo.",
    sentKicker: "Informe enviado",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
    receiptsHint: "Los recibos están en Drive. Abre Drive en los marcadores.",
    chooseReceipt: "Elegir recibo",
    totalLabel: "Total con recibos ($)",
    wrongTotal: "Suma solo los montos con recibos. No incluyas el gasto que marcaste.",
    notToday: "Esa no es la hoja de hoy. Abre Gastos de septiembre.",
    hasReceipt: "Hay un recibo para este gasto en Drive. Compara el comercio y el monto.",
  },
};

export const RECEIPTS_COPY: Record<Lang, {
  heading: string;
  body: string;
  back: string;
  shows: string;
}> = {
  en: {
    heading: "Receipts: September",
    body: "Four receipts received for September.",
    back: "Read-only receipt files.",
    shows: "Receipt shows",
  },
  es: {
    heading: "Recibos: septiembre",
    body: "Cuatro recibos recibidos de septiembre.",
    back: "Archivos de recibos de solo lectura.",
    shows: "El recibo dice",
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
  openFileStep(EXPENSE_COPY, (c) => c.sheetName),
  { en: "Match the receipts. Flag what is missing.", es: "Empareja los recibos. Marca lo que falta." },
  { en: "Enter the total for expenses with receipts, then submit the report.", es: "Escribe el total de los gastos con recibos y envía el informe." },
];

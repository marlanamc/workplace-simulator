import type { EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "💵",
    kicker: "Friday. Your first payday.",
    headline: "Your stub is here.",
    body: "Two weeks in. Open your pay stub and check the net pay and the hours — the same way you will every payday.",
    cta: "Open my stub",
  },
  es: {
    emoji: "💵",
    kicker: "Viernes. Tu primer día de pago.",
    headline: "Ya está tu recibo.",
    body: "Dos semanas. Abre tu recibo y revisa el pago neto y las horas — igual que harás cada día de pago.",
    cta: "Abrir mi recibo",
  },
};

export interface PayStub {
  id: string;
  /** Placeholder; UI substitutes the learner's display name. */
  employee: string;
  role: string;
  period: string;
  payDate: string;
  gross: string;
  net: string;
  pdfDocId?: string;
}

/** Single stub — the learner's first paycheck (hire Tue Aug 18 through Fri Aug 28). */
export const PAY_STUBS: PayStub[] = [
  {
    id: "mine",
    employee: "You",
    role: "Barista",
    period: "Aug 18 – Aug 28",
    payDate: "Aug 28, 2026",
    gross: "$720.00",
    net: "$618.40",
    pdfDocId: "paystub-first",
  },
];

export const TARGET_STUB_ID = "mine";

export interface CheckOption {
  label: string;
  isTarget: boolean;
  wrongHint?: Localized;
}

export const NET_PAY_CHECK: Record<Lang, { question: string; options: CheckOption[] }> = {
  en: {
    question: "What was the net pay on your stub?",
    options: [
      { label: "$720.00", isTarget: false, wrongHint: { en: "That's the gross pay, before taxes come out. Look for Net pay.", es: "Ese es el pago bruto, antes de impuestos y deducciones. Busca el pago neto." } },
      { label: "$618.40", isTarget: true },
      { label: "$600.00", isTarget: false, wrongHint: { en: "Close, but not the number on this stub. Find Net pay at the bottom.", es: "Casi, pero no es el número de este recibo. Busca el pago neto al final." } },
    ],
  },
  es: {
    question: "¿Cuál fue el pago neto en tu recibo?",
    options: [
      { label: "$720.00", isTarget: false, wrongHint: { en: "That's the gross pay, before taxes come out. Look for Net pay.", es: "Ese es el pago bruto, antes de impuestos y deducciones. Busca el pago neto." } },
      { label: "$618.40", isTarget: true },
      { label: "$600.00", isTarget: false, wrongHint: { en: "Close, but not the number on this stub. Find Net pay at the bottom.", es: "Casi, pero no es el número de este recibo. Busca el pago neto al final." } },
    ],
  },
};

export const HOURS_CHECK: Record<Lang, { question: string; options: CheckOption[] }> = {
  en: {
    question: "How many total hours were paid on your stub?",
    options: [
      { label: "40 hours", isTarget: false, wrongHint: { en: "That's a full week, but this stub covers more days. Add up Regular hours on the document.", es: "Eso es una semana completa, pero este recibo cubre más días. Suma las horas regulares en el documento." } },
      { label: "48 hours", isTarget: true },
      { label: "$720.00", isTarget: false, wrongHint: { en: "That's the gross pay in dollars, not a number of hours.", es: "Eso es el pago bruto en dólares, no un número de horas." } },
    ],
  },
  es: {
    question: "¿Cuántas horas totales se pagaron en tu recibo?",
    options: [
      { label: "40 horas", isTarget: false, wrongHint: { en: "That's a full week, but this stub covers more days. Add up Regular hours on the document.", es: "Eso es una semana completa, pero este recibo cubre más días. Suma las horas regulares en el documento." } },
      { label: "48 horas", isTarget: true },
      { label: "$720.00", isTarget: false, wrongHint: { en: "That's the gross pay in dollars, not a number of hours.", es: "Eso es el pago bruto en dólares, no un número de horas." } },
    ],
  },
};

export const PAYSTUB_COPY: Record<Lang, {
  heading: string;
  listLead: string;
  helpBtn: string;
  langBtn: string;
  netLabel: string;
  paidLabel: string;
  openInPdfHint: string;
  close: string;
  payDate: string;
  grossPay: string;
  netPay: string;
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
    heading: "My pay stubs",
    listLead: "Your first stub is ready. Open it and check the net pay and the hours.",
    helpBtn: "Help me with this step",
    langBtn: "Español",
    netLabel: "net pay",
    paidLabel: "Paid",
    openInPdfHint: "Opens as a real document in PDF Reader",
    close: "Close",
    payDate: "Pay date",
    grossPay: "Gross pay",
    netPay: "Net pay",
    sentKicker: "Checked",
    doneTitle: "You found your net pay and confirmed the hours.",
    doneBody: "That is the habit: every payday, open your stub and check the numbers. If something looks off, write Maria.",
    badgeName: "Read a pay stub",
    badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "I understand. Back to my task",
    askPerson: "Ask a person instead",
  },
  es: {
    heading: "Mis recibos de pago",
    listLead: "Ya está tu primer recibo. Ábrelo y revisa el pago neto y las horas.",
    helpBtn: "Ayúdame con este paso",
    langBtn: "English",
    netLabel: "pago neto",
    paidLabel: "Pagado",
    openInPdfHint: "Se abre como un documento real en el Lector de PDF",
    close: "Cerrar",
    payDate: "Fecha de pago",
    grossPay: "Pago bruto",
    netPay: "Pago neto",
    sentKicker: "Revisado",
    doneTitle: "Encontraste tu pago neto y confirmaste las horas.",
    doneBody: "Ese es el hábito: cada día de pago, abre tu recibo y revisa los números. Si algo se ve mal, escríbele a Maria.",
    badgeName: "Leer un recibo de pago",
    badgeWhere: "Cuenta para: Oficina · Servicio de alimentos",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
    askPerson: "Mejor preguntar a una persona",
  },
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Opening your pay stub",
      s: [
        "Open your stub from the list. It opens in PDF Reader, just like any downloaded file.",
        "Read from top to bottom. First earnings, then money taken out, then net pay at the bottom.",
        "Compare the hours to what you remember working.",
      ],
      tip: "Net pay is what actually goes into your account. It is always smaller than gross pay.",
    },
    {
      t: "Gross pay vs. net pay",
      s: [
        "Gross pay is everything you earned before anything is taken out.",
        "Deductions are taxes and other withholdings, listed below gross pay.",
        "Net pay, at the bottom, is gross pay minus every deduction.",
      ],
      tip: "If a number looks wrong, gross vs. net pay is the most common mix-up.",
    },
  ],
  es: [
    {
      t: "Abrir tu recibo de pago",
      s: [
        "Abre tu recibo de la lista. Se abre en el Lector de PDF, como cualquier archivo descargado.",
        "Lee de arriba a abajo. Ingresos, luego deducciones, y el pago neto al final.",
        "Compara las horas con lo que recuerdas haber trabajado.",
      ],
      tip: "El pago neto es lo que realmente llega a tu cuenta. Siempre es menor que el pago bruto.",
    },
    {
      t: "Pago bruto vs. pago neto",
      s: [
        "El pago bruto es todo lo que ganaste antes de quitar nada.",
        "Las deducciones son impuestos y otras retenciones, debajo del pago bruto.",
        "El pago neto, al final, es el pago bruto menos cada deducción.",
      ],
      tip: "Si un número se ve mal, confundir bruto con neto es el error más común.",
    },
  ],
};

/** The persistent "what to do right now" line, one per step of this job. */
export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Open your pay stub from the list.",
    es: "Abre tu recibo de la lista.",
  },
  {
    en: "Find the net pay: the amount that actually reaches the bank.",
    es: "Busca el pago neto: la cantidad que de verdad llega al banco.",
  },
  {
    en: "Now find the hours this stub was paid for.",
    es: "Ahora busca las horas por las que pagaron este recibo.",
  },
];

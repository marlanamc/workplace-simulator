import type { EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "💵",
    kicker: "Friday. Payday for the crew.",
    headline: "Yours is not here yet.",
    body: "First check takes two weeks. Maria still wants you to know how to read one. Open last period's stub for Alex Chen — not Sam, not Priya. At a real job you usually only see your own. This list is practice.",
    cta: "Open the pay list",
  },
  es: {
    emoji: "💵",
    kicker: "Viernes. Día de pago del equipo.",
    headline: "El tuyo todavía no está.",
    body: "El primer cheque tarda dos semanas. Maria igual quiere que sepas leer uno. Abre el recibo del último período de Alex Chen — no el de Sam, no el de Priya. En un trabajo real casi siempre solo ves el tuyo. Esta lista es práctica.",
    cta: "Abrir la lista de pagos",
  },
};

export interface PayStub {
  id: string;
  employee: string;
  role: string;
  period: string;
  payDate: string;
  gross: string;
  net: string;
  /** Only the assigned stub opens as a real PDF and drives the graded check. */
  pdfDocId?: string;
  wrongHint?: Localized;
}

const WRONG_PERSON: Localized = {
  en: "That's not Alex Chen. Maria asked you to open Alex's stub.",
  es: "Ese no es Alex Chen. Maria te pidió abrir el recibo de Alex.",
};

export const PAY_STUBS: PayStub[] = [
  {
    id: "alex",
    employee: "Alex Chen",
    role: "Closer",
    period: "Aug 1 – Aug 15",
    payDate: "Aug 16, 2026",
    gross: "$1,005.00",
    net: "$863.30",
    pdfDocId: "paystub-aug-1",
  },
  {
    id: "sam",
    employee: "Sam Rivera",
    role: "Barista",
    period: "Aug 1 – Aug 15",
    payDate: "Aug 16, 2026",
    gross: "$720.00",
    net: "$618.40",
    wrongHint: WRONG_PERSON,
  },
  {
    id: "priya",
    employee: "Priya Shah",
    role: "Opener",
    period: "Aug 1 – Aug 15",
    payDate: "Aug 16, 2026",
    gross: "$840.00",
    net: "$721.80",
    wrongHint: WRONG_PERSON,
  },
];

export interface CheckOption {
  label: string;
  isTarget: boolean;
  wrongHint?: Localized;
}

export const NET_PAY_CHECK: Record<Lang, { question: string; options: CheckOption[] }> = {
  en: {
    question: "What was the net pay on Alex Chen's stub?",
    options: [
      { label: "$1,005.00", isTarget: false, wrongHint: { en: "That's the gross pay, before taxes come out. Look for Net pay.", es: "Ese es el pago bruto, antes de impuestos y deducciones. Busca el pago neto." } },
      { label: "$863.30", isTarget: true },
      { label: "$618.40", isTarget: false, wrongHint: { en: "That's Sam's net pay. Stay on Alex Chen's stub.", es: "Ese es el pago neto de Sam. Quédate en el recibo de Alex Chen." } },
    ],
  },
  es: {
    question: "¿Cuál fue el pago neto en el recibo de Alex Chen?",
    options: [
      { label: "$1,005.00", isTarget: false, wrongHint: { en: "That's the gross pay, before taxes come out. Look for Net pay.", es: "Ese es el pago bruto, antes de impuestos y deducciones. Busca el pago neto." } },
      { label: "$863.30", isTarget: true },
      { label: "$618.40", isTarget: false, wrongHint: { en: "That's Sam's net pay. Stay on Alex Chen's stub.", es: "Ese es el pago neto de Sam. Quédate en el recibo de Alex Chen." } },
    ],
  },
};

export const HOURS_CHECK: Record<Lang, { question: string; options: CheckOption[] }> = {
  en: {
    question: "How many total hours were paid on Alex Chen's stub (regular + overtime)?",
    options: [
      { label: "62.5 hours", isTarget: false, wrongHint: { en: "That's just the regular hours. Don't forget to add the overtime hours too.", es: "Esas son solo las horas regulares. No olvides sumar las horas extra." } },
      { label: "65.5 hours", isTarget: true },
      { label: "$67.50", isTarget: false, wrongHint: { en: "That's the overtime pay in dollars, not a number of hours.", es: "Eso es el pago de horas extra en dólares, no un número de horas." } },
    ],
  },
  es: {
    question: "¿Cuántas horas totales se pagaron en el recibo de Alex Chen (regulares + extra)?",
    options: [
      { label: "62.5 horas", isTarget: false, wrongHint: { en: "That's just the regular hours. Don't forget to add the overtime hours too.", es: "Esas son solo las horas regulares. No olvides sumar las horas extra." } },
      { label: "65.5 horas", isTarget: true },
      { label: "$67.50", isTarget: false, wrongHint: { en: "That's the overtime pay in dollars, not a number of hours.", es: "Eso es el pago de horas extra en dólares, no un número de horas." } },
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
    heading: "Team pay stubs — this period",
    listLead: "Open Alex Chen's stub. The others are the same week, different people.",
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
    doneTitle: "You found Alex's net pay and confirmed the hours.",
    doneBody: "You opened the right person's stub, not the first name on the list. When yours lands in two weeks, read it the same way.",
    badgeName: "Read a pay stub",
    badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
    askPerson: "Ask a person instead",
  },
  es: {
    heading: "Recibos del equipo — este período",
    listLead: "Abre el recibo de Alex Chen. Los otros son de la misma semana, otras personas.",
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
    doneTitle: "Encontraste el pago neto de Alex y confirmaste las horas.",
    doneBody: "Abriste el recibo de la persona correcta, no el primer nombre de la lista. Cuando llegue el tuyo en dos semanas, léelo igual.",
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
      t: "Opening a pay stub",
      s: [
        "Find Alex Chen's name. Click that stub to open the real document.",
        "It opens in PDF Reader, just like any downloaded file.",
        "Read from top to bottom. First earnings, then money taken out, then net pay at the bottom.",
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
      t: "Abrir un recibo de pago",
      s: [
        "Busca el nombre de Alex Chen. Haz clic en ese recibo para abrir el documento real.",
        "Se abre en el Lector de PDF, como cualquier archivo descargado.",
        "Lee de arriba a abajo. Ingresos, luego deducciones, y el pago neto al final.",
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
    en: "Open Alex Chen's stub from last period — not Sam's, not Priya's.",
    es: "Abre el recibo de Alex Chen del último período, no el de Sam ni el de Priya.",
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

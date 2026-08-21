import type { ConfidenceOption, EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "💵",
    kicker: "Payday",
    headline: "Your first paycheck just landed.",
    body: "Your pay stub is ready in the portal. Before you trust the number, take a look — knowing how to read your own pay stub is a skill that pays off for the rest of your career.",
    cta: "Open my pay stub",
  },
  es: {
    emoji: "💵",
    kicker: "Día de pago",
    headline: "Tu primer cheque acaba de llegar.",
    body: "Tu recibo de pago ya está en el portal. Antes de confiar en el número, échale un vistazo — saber leer tu propio recibo es una habilidad que te sirve para toda tu carrera.",
    cta: "Abrir mi recibo",
  },
};

export interface PayStub {
  id: string;
  period: string;
  payDate: string;
  gross: string;
  net: string;
  /** Only the most recent stub opens as a real PDF and drives the graded check. */
  pdfDocId?: string;
}

export const PAY_STUBS: PayStub[] = [
  { id: "aug-1", period: "Aug 1 – Aug 15", payDate: "Aug 16, 2026", gross: "$864.00", net: "$742.18", pdfDocId: "paystub-aug-1" },
  { id: "jul-2", period: "Jul 16 – Jul 31", payDate: "Aug 1, 2026", gross: "$901.50", net: "$774.61" },
  { id: "jul-1", period: "Jul 1 – Jul 15", payDate: "Jul 16, 2026", gross: "$832.00", net: "$714.99" },
];

export interface CheckOption {
  label: string;
  isTarget: boolean;
  wrongHint?: Localized;
}

export const NET_PAY_CHECK: Record<Lang, { question: string; options: CheckOption[] }> = {
  en: {
    question: "What was the net pay on your most recent pay stub?",
    options: [
      { label: "$864.00", isTarget: false, wrongHint: { en: "That's the gross pay — before taxes and deductions come out. Look for Net pay.", es: "Ese es el pago bruto — antes de impuestos y deducciones. Busca el pago neto." } },
      { label: "$742.18", isTarget: true },
      { label: "$901.50", isTarget: false, wrongHint: { en: "That's from a different pay period. Make sure you're reading the Aug 1–15 stub.", es: "Ese es de otro período de pago. Asegúrate de leer el recibo del 1 al 15 de agosto." } },
    ],
  },
  es: {
    question: "¿Cuál fue el pago neto en tu recibo de pago más reciente?",
    options: [
      { label: "$864.00", isTarget: false, wrongHint: { en: "That's the gross pay — before taxes and deductions come out. Look for Net pay.", es: "Ese es el pago bruto — antes de impuestos y deducciones. Busca el pago neto." } },
      { label: "$742.18", isTarget: true },
      { label: "$901.50", isTarget: false, wrongHint: { en: "That's from a different pay period. Make sure you're reading the Aug 1–15 stub.", es: "Ese es de otro período de pago. Asegúrate de leer el recibo del 1 al 15 de agosto." } },
    ],
  },
};

export const HOURS_CHECK: Record<Lang, { question: string; options: CheckOption[] }> = {
  en: {
    question: "How many total hours were paid (regular + overtime)?",
    options: [
      { label: "62.5 hours", isTarget: false, wrongHint: { en: "That's just the regular hours — don't forget to add the overtime hours too.", es: "Esas son solo las horas regulares — no olvides sumar las horas extra." } },
      { label: "65.5 hours", isTarget: true },
      { label: "$59.40", isTarget: false, wrongHint: { en: "That's the overtime pay in dollars, not a number of hours.", es: "Eso es el pago de horas extra en dólares, no un número de horas." } },
    ],
  },
  es: {
    question: "¿Cuántas horas totales se pagaron (regulares + extra)?",
    options: [
      { label: "62.5 horas", isTarget: false, wrongHint: { en: "That's just the regular hours — don't forget to add the overtime hours too.", es: "Esas son solo las horas regulares — no olvides sumar las horas extra." } },
      { label: "65.5 horas", isTarget: true },
      { label: "$59.40", isTarget: false, wrongHint: { en: "That's the overtime pay in dollars, not a number of hours.", es: "Eso es el pago de horas extra en dólares, no un número de horas." } },
    ],
  },
};

export const PAYSTUB_COPY: Record<Lang, {
  heading: string;
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
  confidenceQ: string;
  tryAgain: string;
  backToDesk: string;
  lessonKicker: string;
  tipLabel: string;
  gotIt: string;
  askPerson: string;
}> = {
  en: {
    heading: "Pay stubs",
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
    doneTitle: "You found your net pay and confirmed your hours.",
    doneBody: "Reading your own pay stub before questioning it is the habit that catches a real payroll mistake early.",
    badgeName: "Read a pay stub",
    badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    confidenceQ: "How do you feel about checking a real pay stub?",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it — back to my task",
    askPerson: "Ask a person instead",
  },
  es: {
    heading: "Recibos de pago",
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
    doneTitle: "Encontraste tu pago neto y confirmaste tus horas.",
    doneBody: "Revisar tu propio recibo de pago antes de cuestionarlo es el hábito que detecta un error de nómina real a tiempo.",
    badgeName: "Leer un recibo de pago",
    badgeWhere: "Cuenta para: Oficina · Servicio de alimentos",
    confidenceQ: "¿Cómo te sientes de revisar un recibo de pago real?",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido — volver a mi tarea",
    askPerson: "Mejor preguntar a una persona",
  },
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Opening a pay stub",
      s: [
        "Click your most recent pay stub to open the real document.",
        "It opens in PDF Reader, just like any downloaded file.",
        "Read top to bottom — earnings, then deductions, then net pay at the bottom.",
      ],
      tip: "Net pay is what actually lands in your account — always smaller than gross pay.",
    },
    {
      t: "Gross pay vs. net pay",
      s: [
        "Gross pay is everything you earned before anything is taken out.",
        "Deductions are taxes and other withholdings, listed below gross pay.",
        "Net pay — at the bottom — is gross pay minus every deduction.",
      ],
      tip: "If a number looks wrong, gross vs. net pay is the most common mix-up.",
    },
  ],
  es: [
    {
      t: "Abrir un recibo de pago",
      s: [
        "Haz clic en tu recibo más reciente para abrir el documento real.",
        "Se abre en el Lector de PDF, como cualquier archivo descargado.",
        "Lee de arriba a abajo — ingresos, luego deducciones, y el pago neto al final.",
      ],
      tip: "El pago neto es lo que realmente llega a tu cuenta — siempre menor que el pago bruto.",
    },
    {
      t: "Pago bruto vs. pago neto",
      s: [
        "El pago bruto es todo lo que ganaste antes de quitar nada.",
        "Las deducciones son impuestos y otras retenciones, debajo del pago bruto.",
        "El pago neto — al final — es el pago bruto menos cada deducción.",
      ],
      tip: "Si un número se ve mal, confundir bruto con neto es el error más común.",
    },
  ],
};

export const CONFIDENCE_OPTIONS: Record<Lang, ConfidenceOption[]> = {
  en: [
    { label: "Still unsure", reply: "That's honest — do the task once more, or bring it to Wednesday drop-in and we'll do it together." },
    { label: "I could try", reply: "Good. Try it again without guided mode — that's how it will feel at work." },
    { label: "I can do this", reply: "You just did it with no help. Move on to the next task on your desktop." },
  ],
  es: [
    { label: "Todavía dudo", reply: "Eso es honesto — hazlo otra vez, o ven el miércoles y lo hacemos juntos." },
    { label: "Podría intentarlo", reply: "Bien. Inténtalo otra vez sin el modo guiado — así se siente en el trabajo." },
    { label: "Puedo hacerlo", reply: "Lo hiciste sin ayuda. Sigue con la siguiente tarea en tu escritorio." },
  ],
};

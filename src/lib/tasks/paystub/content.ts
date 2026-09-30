import type { EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";
import {
  HIRE_DAY,
  SHIFT_BLOCKS,
  SHIFT_TIMES,
  STORY_DAY_BY_LEVEL,
  WEEKDAY_SHORT,
  shiftBlockFor,
  shortDate,
  storyDate,
  type ShiftBlock,
} from "@/lib/story-dates";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "💵",
    kicker: "Friday. Your first payday.",
    headline: "Your stub is here.",
    body: "Open your pay stub and check the net pay and the hours, the same way you will every payday.",
    cta: "Open my stub",
  },
  es: {
    emoji: "💵",
    kicker: "Viernes. Tu primer día de pago.",
    headline: "Ya está tu recibo.",
    body: "Abre tu recibo y revisa el pago neto (Net pay) y las horas, igual que harás cada día de pago.",
    cta: "Abrir mi recibo",
  },
};

const PAYDAY = STORY_DAY_BY_LEVEL.level3a3;

export interface PayStub {
  id: string;
  /** Placeholder; UI substitutes the learner's display name. */
  employee: string;
  role: string;
  period: Localized;
  /**
   * What the list row shows on the right. It is the pay date, not the net
   * pay: the net pay is the answer to the first question (Wave 5 F-8), and
   * the pay date is how the learner knows which stub is theirs (the HR email
   * says "Your first pay date is Friday, Aug 28").
   */
  payDate: Localized;
  gross: string;
  /** Kept for the stub/answer consistency test only. Never shown in the list. */
  net: string;
  pdfDocId?: string;
}

/** Single stub: the learner's first paycheck, paid Fri Aug 28 for Tue Aug 18 through Thu Aug 27. */
export const PAY_STUBS: PayStub[] = [
  {
    id: "mine",
    employee: "You",
    role: "Barista",
    period: {
      // Through the day before payday, the last day on the time record.
      en: `${shortDate(HIRE_DAY, "en")} – ${shortDate(PAYDAY - 1, "en")}`,
      es: `${shortDate(HIRE_DAY, "es")} – ${shortDate(PAYDAY - 1, "es")}`,
    },
    payDate: { en: shortDate(PAYDAY, "en"), es: shortDate(PAYDAY, "es") },
    gross: "$720.00",
    net: "$571.32",
    pdfDocId: "paystub-first",
  },
];

/**
 * The corrected time record the hours question is checked against. The
 * learner counts the shifts themselves (Wave 5 F-8: the question used to say
 * "six shifts of 8 hours", which was the answer). These are the shifts they
 * finished before payday, read from the story calendar:
 * - Mon Aug 24 is missing: that was the sick day (Day 5).
 * - Fri Aug 21 is the clock-in Maria fixed on Day 3 (7:00 AM, not 8:15).
 * - Thu Aug 27 is the late shift Maria moved them to on Day 2.
 * - Fri Aug 28, payday, is not on this stub.
 */
export interface TimeRecordRow {
  day: number;
  date: Localized;
  block: ShiftBlock;
  hours: number;
  note?: Localized;
}

const SICK_DAY = STORY_DAY_BY_LEVEL.level3a2;
const SWAP_DAY = 27;
const FIXED_PUNCH_DAY = STORY_DAY_BY_LEVEL.level3;

const blockHours = (b: ShiftBlock) => {
  const h = (t: string) => {
    const [, hh, mm, ap] = /^(\d+):(\d+)\s*(AM|PM)$/.exec(t)!;
    return ((Number(hh) % 12) + (ap === "PM" ? 12 : 0)) + Number(mm) / 60;
  };
  return h(b.end) - h(b.start);
};

export const TIME_RECORD: TimeRecordRow[] = Object.keys(SHIFT_TIMES)
  .map(Number)
  .filter((day) => day >= HIRE_DAY && day < PAYDAY && day !== SICK_DAY)
  .map((day) => {
    const block = day === SWAP_DAY ? SHIFT_BLOCKS.late : shiftBlockFor(SHIFT_TIMES[day])!;
    const weekday = storyDate(day).getDay();
    return {
      day,
      date: {
        en: `${WEEKDAY_SHORT.en[weekday]}, ${shortDate(day, "en")}`,
        es: `${WEEKDAY_SHORT.es[weekday]} ${shortDate(day, "es")}`,
      },
      block,
      hours: blockHours(block),
      note: day === FIXED_PUNCH_DAY ? { en: "fixed", es: "corregido" } : undefined,
    };
  });

export const TIME_RECORD_COPY: Record<Lang, { heading: string; note: string; hours: (n: number) => string }> = {
  en: {
    heading: "Your time record",
    note: "Maria added the clock-in fix you asked for.",
    hours: (n) => `${n} hours`,
  },
  es: {
    heading: "Tu registro de horas",
    note: "Maria agregó la corrección de entrada que pediste.",
    hours: (n) => `${n} horas`,
  },
};

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
      { label: "$720.00", isTarget: false, wrongHint: { en: "That's the gross pay, before taxes come out. Look for Net pay.", es: "Ese es el pago bruto (Gross pay), antes de impuestos y deducciones. Busca el pago neto (Net pay)." } },
      { label: "$571.32", isTarget: true },
      { label: "$600.00", isTarget: false, wrongHint: { en: "Close, but not the number on this stub. Find Net pay at the bottom.", es: "Casi, pero no es el número de este recibo. Busca el pago neto (Net pay) al final." } },
    ],
  },
  es: {
    question: "¿Cuál fue el pago neto (Net pay) en tu recibo?",
    options: [
      { label: "$720.00", isTarget: false, wrongHint: { en: "That's the gross pay, before taxes come out. Look for Net pay.", es: "Ese es el pago bruto (Gross pay), antes de impuestos y deducciones. Busca el pago neto (Net pay)." } },
      { label: "$571.32", isTarget: true },
      { label: "$600.00", isTarget: false, wrongHint: { en: "Close, but not the number on this stub. Find Net pay at the bottom.", es: "Casi, pero no es el número de este recibo. Busca el pago neto (Net pay) al final." } },
    ],
  },
};

const FORTY_HINT: Localized = {
  en: "That is 5 shifts of 8 hours. Count the shifts on your time record again.",
  es: "Eso son 5 turnos de 8 horas. Cuenta otra vez los turnos de tu registro de horas.",
};
const GROSS_AS_HOURS_HINT: Localized = {
  en: "That's the gross pay in dollars, not a number of hours.",
  es: "Eso es el pago bruto (Gross pay) en dólares, no un número de horas.",
};

/**
 * The time record sits under this question, so the learner counts the
 * shifts. The question never says how many there are.
 */
export const HOURS_CHECK: Record<Lang, { question: string; options: CheckOption[] }> = {
  en: {
    question: "Count the shifts on your time record. Which paid hours on the stub match it?",
    options: [
      { label: "40 hours", isTarget: false, wrongHint: FORTY_HINT },
      { label: "48 hours", isTarget: true },
      { label: "$720.00", isTarget: false, wrongHint: GROSS_AS_HOURS_HINT },
    ],
  },
  es: {
    question: "Cuenta los turnos de tu registro de horas. ¿Qué horas pagadas del recibo coinciden?",
    options: [
      { label: "40 horas", isTarget: false, wrongHint: FORTY_HINT },
      { label: "48 horas", isTarget: true },
      { label: "$720.00", isTarget: false, wrongHint: GROSS_AS_HOURS_HINT },
    ],
  },
};

export const PAYSTUB_COPY: Record<Lang, {
  heading: string;
  listLead: string;
  helpBtn: string;
  langBtn: string;
  paidLabel: string;
  openInPdfHint: string;
  /** Card button on the step where the PDF Reader covers the questions. */
  backToBrowser: string;
  /** On the questions, reopens the stub (after a reload closed the reader). */
  seeStubAgain: string;
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
    paidLabel: "Paid",
    openInPdfHint: "Opens as a real document in PDF Reader",
    backToBrowser: "Back to the Browser",
    seeStubAgain: "Look at the pay stub again",
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
    listLead: "Ya está tu primer recibo. Ábrelo y revisa el pago neto (Net pay) y las horas.",
    helpBtn: "Ayúdame con este paso",
    langBtn: "English",
    paidLabel: "Pagado",
    openInPdfHint: "Se abre como un documento real en el Lector de PDF",
    backToBrowser: "Volver al Navegador",
    seeStubAgain: "Ver el recibo otra vez",
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

/**
 * Help, one lesson per stage: [0] opening the stub, [1] net pay, [2] hours.
 * The stub itself stays in English, as real US stubs are (owner decision,
 * Wave 5 F-21), so the Spanish lines name the English words the stub uses:
 * "Net pay", "Gross pay", "Deductions", "Regular hours".
 */
export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Opening your pay stub",
      s: [
        "This is PDF Reader. Downloaded files like pay stubs and reports open here, not in the Browser.",
        "Read from top to bottom. First earnings, then money taken out, then net pay at the bottom.",
        "Go back to the Browser and pick that number. You do not type it.",
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
    {
      t: "Checking your hours",
      s: [
        "Your time record lists each shift you worked and its hours.",
        "Count the shifts and add up the hours.",
        "On the stub, find Regular hours. It should be the same number.",
      ],
      tip: "If the stub has fewer hours than your time record, write Maria the same day.",
    },
  ],
  es: [
    {
      t: "Abrir tu recibo de pago",
      s: [
        "Esto es el Lector de PDF. Los archivos descargados, como recibos y reportes, se abren aquí, no en el Navegador.",
        "El recibo está en inglés, como los recibos reales en EE. UU. Lee de arriba a abajo: ingresos (Earnings), deducciones (Deductions) y el pago neto (Net pay) al final.",
        "Vuelve al Navegador y elige ese número. No lo tienes que escribir.",
      ],
      tip: "El pago neto (Net pay) es lo que realmente llega a tu cuenta. Siempre es menor que el pago bruto (Gross pay).",
    },
    {
      t: "Pago bruto (Gross pay) y pago neto (Net pay)",
      s: [
        "El pago bruto (Gross pay) es todo lo que ganaste antes de quitar nada.",
        "Las deducciones (Deductions) son impuestos y otras retenciones. Están debajo del pago bruto (Gross pay).",
        "El pago neto (Net pay), al final, es el pago bruto (Gross pay) menos todas las deducciones.",
      ],
      tip: "Si un número se ve mal, lo más común es confundir el pago bruto (Gross pay) con el pago neto (Net pay).",
    },
    {
      t: "Revisar tus horas",
      s: [
        "Tu registro de horas muestra cada turno que trabajaste y sus horas.",
        "Cuenta los turnos y suma las horas.",
        "En el recibo, busca las horas regulares (Regular hours). Debe ser el mismo número.",
      ],
      tip: "Si el recibo tiene menos horas que tu registro, escríbele a Maria ese mismo día.",
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
    en: "Find the net pay on this stub.",
    es: "Encuentra el pago neto (Net pay) en este recibo.",
  },
  {
    en: "Pick the net pay.",
    es: "Elige el pago neto (Net pay).",
  },
  {
    en: "Find Regular hours on this stub.",
    es: "Encuentra las horas regulares (Regular hours) en este recibo.",
  },
  {
    en: "Count the shifts on your time record. Then pick the paid hours that match the stub.",
    es: "Cuenta los turnos de tu registro de horas. Luego elige las horas regulares (Regular hours) del recibo que coinciden.",
  },
];

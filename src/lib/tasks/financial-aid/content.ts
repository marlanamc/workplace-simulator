import type { Lang, Lesson, Localized } from "@/lib/task-types";
import { AID_ACCEPT_BY_DAY, ENROLLMENT_DEADLINE_DAY, SPRING_TERM_START, yearDate } from "@/lib/story-dates";

export const PDF_DOC_ID = "award-letter-spring-2027";
export const AWARD_AMOUNT = 2400;
/** The accept-by date on the Spring 2027 award letter: December 4, 2026. */
export const ACCEPT_BY = { en: yearDate(AID_ACCEPT_BY_DAY, "en"), es: yearDate(AID_ACCEPT_BY_DAY, "es") };

export type CheckOption = { label: string; isTarget?: boolean; wrongHint?: Localized };

export const AMOUNT_CHECK: Record<Lang, { question: string; options: CheckOption[] }> = {
  en: {
    question: "What is the award amount?",
    options: [
      { label: "$1,200", wrongHint: { en: "Look at the award total, not a payment.", es: "Mira el total de la ayuda, no un pago." } },
      { label: "$2,400", isTarget: true },
      { label: "$4,800", wrongHint: { en: "That is twice the letter.", es: "Eso es el doble de la carta." } },
    ],
  },
  es: {
    question: "¿Cuál es el monto de la ayuda?",
    options: [
      { label: "$1,200", wrongHint: { en: "Look at the award total, not a payment.", es: "Mira el total de la ayuda, no un pago." } },
      { label: "$2,400", isTarget: true },
      { label: "$4,800", wrongHint: { en: "That is twice the letter.", es: "Eso es el doble de la carta." } },
    ],
  },
};

const FIRST_CLASS_HINT: Localized = {
  en: "That is the first day of class. The accept-by date is earlier.",
  es: "Ese es el primer día de clase. La fecha para aceptar es antes.",
};

export const DATE_CHECK: Record<Lang, { question: string; options: CheckOption[] }> = {
  en: {
    question: "When must you accept?",
    options: [
      { label: yearDate(ENROLLMENT_DEADLINE_DAY, "en"), wrongHint: { en: "That was the application deadline.", es: "Esa era la fecha de la solicitud." } },
      { label: ACCEPT_BY.en, isTarget: true },
      { label: yearDate(SPRING_TERM_START, "en"), wrongHint: FIRST_CLASS_HINT },
    ],
  },
  es: {
    question: "¿Para cuándo hay que aceptar?",
    options: [
      { label: yearDate(ENROLLMENT_DEADLINE_DAY, "es"), wrongHint: { en: "That was the application deadline.", es: "Esa era la fecha de la solicitud." } },
      { label: ACCEPT_BY.es, isTarget: true },
      { label: yearDate(SPRING_TERM_START, "es"), wrongHint: FIRST_CLASS_HINT },
    ],
  },
};

export const FINANCIAL_AID_COPY: Record<Lang, {
  helpBtn: string;
  school: string;
  heading: string;
  letterName: string;
  letterNote: string;
  openLetter: string;
  next: string;
  sentKicker: string;
  tryAgain: string;
  backToDesk: string;
  lessonKicker: string;
  tipLabel: string;
  gotIt: string;
}> = {
  en: {
    helpBtn: "Help me with this step",
    school: "Bunker Hill Community College",
    heading: "Financial aid",
    letterName: "Award letter: Spring 2027",
    letterNote: "Open the letter. The amount and the accept-by date are on the page.",
    openLetter: "Open award letter",
    next: "Continue",
    sentKicker: "You read the letter",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
  },
  es: {
    helpBtn: "Ayúdame con este paso",
    school: "Bunker Hill Community College",
    heading: "Ayuda financiera",
    letterName: "Carta de ayuda: primavera 2027",
    letterNote: "Abre la carta. El monto y la fecha para aceptar están en la página.",
    openLetter: "Abrir carta de ayuda",
    next: "Seguir",
    sentKicker: "Leíste la carta",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
  },
};

export function amountLooksRight(answer: string): boolean {
  return /2,?400|2400/.test(answer.replace(/\s/g, ""));
}

/** December 4: "December 4, 2026", "Dec 4", "4 de diciembre", "12/4". */
export function dateLooksRight(answer: string): boolean {
  const t = answer.toLowerCase();
  if (/(?<!\d)12\/0?4(?!\d)/.test(t)) return true;
  return /dec|dic/.test(t) && /(?<!\d)0?4(?!\d)/.test(t);
}

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "The letter is the source",
      s: [
        "Open the PDF. Do not guess from the portal card.",
        "Award amount and accept-by date are two different numbers.",
        "If you cannot point at both on the page, you have not read it yet.",
      ],
      tip: "A portal summary can be wrong. The letter is what you keep.",
    },
  ],
  es: [
    {
      t: "La carta es la fuente",
      s: [
        "Abre el PDF. No adivines por la tarjeta del portal.",
        "El monto y la fecha para aceptar son dos números distintos.",
        "Si no puedes señalar los dos en la página, todavía no la leíste.",
      ],
      tip: "Un resumen del portal puede estar mal. La carta es lo que se guarda.",
    },
  ],
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  { en: "Open the award letter.", es: "Abre la carta de ayuda." },
  { en: "Find the award amount.", es: "Encuentra el monto." },
  { en: "Find the accept-by date.", es: "Encuentra la fecha para aceptar." },
];

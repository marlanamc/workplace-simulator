import type { Lang, Lesson, Localized } from "@/lib/task-types";

export const PDF_DOC_ID = "award-letter-fall-2026";
export const AWARD_AMOUNT = 2400;
export const ACCEPT_BY = { en: "October 15, 2026", es: "15 de octubre de 2026" };

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

export const DATE_CHECK: Record<Lang, { question: string; options: CheckOption[] }> = {
  en: {
    question: "When must you accept?",
    options: [
      { label: "September 15, 2026", wrongHint: { en: "That was the application deadline.", es: "Esa era la fecha de la solicitud." } },
      { label: "October 15, 2026", isTarget: true },
      { label: "December 1, 2026", wrongHint: { en: "The accept-by date is earlier.", es: "La fecha para aceptar es antes." } },
    ],
  },
  es: {
    question: "¿Para cuándo hay que aceptar?",
    options: [
      { label: "15 de septiembre de 2026", wrongHint: { en: "That was the application deadline.", es: "Esa era la fecha de la solicitud." } },
      { label: "15 de octubre de 2026", isTarget: true },
      { label: "1 de diciembre de 2026", wrongHint: { en: "The accept-by date is earlier.", es: "La fecha para aceptar es antes." } },
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
    letterName: "Award letter — Fall 2026",
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
    letterName: "Carta de ayuda — otoño 2026",
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

export function dateLooksRight(answer: string): boolean {
  const t = answer.toLowerCase();
  return /oct|octubre/.test(t) && /15/.test(t);
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

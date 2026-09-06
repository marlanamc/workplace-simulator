import { EXPENSE_ROWS } from "@/lib/tasks/expense-report/content";
import type { Lang, Lesson, Localized, SubmissionContent } from "@/lib/task-types";

/** Planted from the expense-report receipted total. The total is derived from receipted rows. */
export const PLANTED_TOTAL = EXPENSE_ROWS.filter((r) => r.receipt).reduce((sum, r) => sum + r.amount, 0);

export interface SlideDeckInput {
  title: string;
  takeaway: string;
  confirmedTotal: boolean;
  presented: boolean;
  coworkerAnswer: string;
}

export function takeawayIsASentence(text: string): boolean {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length >= 3;
}

export function slideDeckPasses(input: SlideDeckInput): boolean {
  return (
    input.title.trim().length >= 2 &&
    takeawayIsASentence(input.takeaway) &&
    input.confirmedTotal &&
    input.presented && input.coworkerAnswer === "receipt"
  );
}

/** What the teacher sees: the slide title and the one-sentence takeaway. */
export function describeSubmission(
  input: { title: string; takeaway: string; coworkerAnswer?: string },
  lang: Lang,
): SubmissionContent {
  const c = SLIDES_COPY[lang];
  return {
    lang,
    fields: [
      { label: c.titleLabel, value: input.title },
      { label: c.takeawayLabel, value: input.takeaway },
      { label: lang === "en" ? "Coworker question" : "Pregunta del compañero", value: input.coworkerAnswer ?? "" },
    ],
  };
}

export const SLIDES_COPY: Record<Lang, {
  appName: string;
  helpBtn: string;
  slideOf: (n: number) => string;
  titleLabel: string;
  titlePlaceholder: string;
  numberKicker: string;
  takeawayLabel: string;
  takeawayPlaceholder: string;
  next: string;
  back: string;
  present: string;
  slideLabels: [string, string, string];
  needTitle: string;
  needConfirm: string;
  needTakeaway: string;
  presenting: string;
  sentKicker: string;
  tryAgain: string;
  backToDesk: string;
  lessonKicker: string;
  tipLabel: string;
  gotIt: string;
}> = {
  en: {
    appName: "Slides",
    helpBtn: "Help me with this step",
    slideOf: (n) => `Slide ${n} of 3`,
    titleLabel: "Title",
    titlePlaceholder: "Give these slides a title…",
    numberKicker: "From the expense report",
    takeawayLabel: "Takeaway",
    takeawayPlaceholder: "One sentence the team should remember…",
    next: "Next slide",
    back: "Back",
    present: "Present",
    slideLabels: ["Title", "The number", "Takeaway"],
    needTitle: "Put a title on the first slide first.",
    needConfirm: "Compare the receipt rows and enter their total on slide two.",
    needTakeaway: "Write one full sentence. At least a few words.",
    presenting: "Presenting",
    sentKicker: "Presented",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
  },
  es: {
    appName: "Diapositivas",
    helpBtn: "Ayúdame con este paso",
    slideOf: (n) => `Diapositiva ${n} de 3`,
    titleLabel: "Título",
    titlePlaceholder: "Ponle un título a estas diapositivas…",
    numberKicker: "Del informe de gastos",
    takeawayLabel: "Idea",
    takeawayPlaceholder: "Una oración que el equipo debe recordar…",
    next: "Siguiente",
    back: "Atrás",
    present: "Presentar",
    slideLabels: ["Título", "El número", "Idea"],
    needTitle: "Pon un título en la primera diapositiva primero.",
    needConfirm: "Compara las filas con recibo e ingresa su total en la segunda diapositiva.",
    needTakeaway: "Escribe una oración completa. Al menos unas palabras.",
    presenting: "Presentando",
    sentKicker: "Presentado",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
  },
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "You need three slides, no more",
      s: [
        "One slide for the title, one for the expense figure you find in the reference, one for your takeaway.",
        "Use only expenses with receipts. Enter their total on slide two.",
      ],
      tip: "After presenting, answer Chris’s question using the expense reference.",
    },
  ],
  es: [
    {
      t: "Necesitas tres diapositivas, no más",
      s: [
        "Una diapositiva para el título, una para el gasto que encuentras en la referencia, y una para tu idea.",
        "Usa solo los gastos con recibos. Escribe su total en la segunda diapositiva.",
      ],
      tip: "Después de presentar, responde la pregunta de Chris usando la referencia de gastos.",
    },
  ],
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  { en: "Title the first slide.", es: "Ponle título a la primera diapositiva." },
  { en: "Find and enter the expense total.", es: "Busca y escribe el total de gastos." },
  { en: "Write a takeaway. Present and answer Chris.", es: "Escribe una idea. Presenta y responde a Chris." },
];

export const COWORKER_QUESTION: Localized = { en: 'Chris: Why is the dinner expense excluded from this total?', es: 'Chris: ¿Por qué el gasto de la cena no está incluido en este total?' };
export const COWORKER_ANSWERS = [
 { key: 'meal', label: { en: 'Meals never count as expenses.', es: 'Las comidas nunca cuentan como gastos.' } },
 { key: 'receipt', label: { en: 'Its receipt is missing. We need it before including the expense.', es: 'Falta su recibo. Lo necesitamos antes de incluir el gasto.' } },
 { key: 'small', label: { en: 'It is too small to report.', es: 'Es demasiado pequeño para reportarlo.' } },
];

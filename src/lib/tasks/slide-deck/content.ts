import type { Lang, Lesson, Localized } from "@/lib/task-types";

/** Planted from the expense-report receipted total. Learners confirm it; they do not invent it. */
export const PLANTED_TOTAL = 188;

export interface SlideDeckInput {
  title: string;
  takeaway: string;
  confirmedTotal: boolean;
  presented: boolean;
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
    input.presented
  );
}

export const SLIDES_COPY: Record<Lang, {
  appName: string;
  helpBtn: string;
  slideOf: (n: number) => string;
  titleLabel: string;
  titlePlaceholder: string;
  numberKicker: string;
  numberBody: string;
  confirm: string;
  takeawayLabel: string;
  takeawayPlaceholder: string;
  next: string;
  back: string;
  present: string;
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
    numberBody: `Receipted total: $${PLANTED_TOTAL}`,
    confirm: `Yes — the total is $${PLANTED_TOTAL}`,
    takeawayLabel: "Takeaway",
    takeawayPlaceholder: "One sentence the team should remember…",
    next: "Next slide",
    back: "Back",
    present: "Present",
    needTitle: "Put a title on the first slide first.",
    needConfirm: "Confirm the total that is already there. Do not type a different number.",
    needTakeaway: "Write one full sentence — at least a few words.",
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
    numberBody: `Total con recibo: $${PLANTED_TOTAL}`,
    confirm: `Sí — el total es $${PLANTED_TOTAL}`,
    takeawayLabel: "Idea",
    takeawayPlaceholder: "Una oración que el equipo debe recordar…",
    next: "Siguiente",
    back: "Atrás",
    present: "Presentar",
    needTitle: "Pon un título en la primera diapositiva primero.",
    needConfirm: "Confirma el total que ya está ahí. No escribas otro número.",
    needTakeaway: "Escribe una oración completa — al menos unas palabras.",
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
        "One slide for the title, one for the number that is already on the slide, one for your takeaway.",
        "Confirm the $188. Do not add a fourth slide or change the total.",
      ],
      tip: "Presenting is the last step. The number is already there for you, so you do not have to guess it.",
    },
  ],
  es: [
    {
      t: "Necesitas tres diapositivas, no más",
      s: [
        "Una diapositiva para el título, una para el número que ya está en la diapositiva, y una para tu idea.",
        "Confirma los $188. No agregues una cuarta diapositiva ni cambies el total.",
      ],
      tip: "Presentar es el último paso. El número ya está ahí para ti, así que no tienes que adivinarlo.",
    },
  ],
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  { en: "Title the first slide.", es: "Ponle título a la primera diapositiva." },
  { en: "Confirm the expense total.", es: "Confirma el total de gastos." },
  { en: "Write a takeaway. Then present.", es: "Escribe una idea. Luego presenta." },
];

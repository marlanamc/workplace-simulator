import type { Lang, Localized } from "@/lib/task-types";

/**
 * Copy for the "Notes from your teacher" surface — a real person (the class
 * teacher), kept visually separate from the in-story characters like Maria.
 */
export const TEACHER_NOTES_COPY: Record<
  Lang,
  {
    toastOne: string;
    toastMany: (n: number) => string;
    panelTitle: string;
    panelIntro: string;
    youWrote: string;
    teacherSaid: string;
    openTask: string;
    gotIt: string;
    close: string;
    writtenInSpanish: string;
    blank: string;
  }
> = {
  en: {
    toastOne: "Your teacher left a note on your work",
    toastMany: (n) => `Your teacher left ${n} notes on your work`,
    panelTitle: "Notes from your teacher",
    panelIntro: "Your teacher read what you wrote and has a suggestion. Nothing is wrong. You can try the task again if you want.",
    youWrote: "You wrote",
    teacherSaid: "Your teacher",
    openTask: "Open this task again",
    gotIt: "Got it",
    close: "Close",
    writtenInSpanish: "You wrote this in Spanish.",
    blank: "(left blank)",
  },
  es: {
    toastOne: "Tu maestra dejó una nota sobre tu trabajo",
    toastMany: (n) => `Tu maestra dejó ${n} notas sobre tu trabajo`,
    panelTitle: "Notas de tu maestra",
    panelIntro: "Tu maestra leyó lo que escribiste y tiene una sugerencia. No hiciste nada mal. Puedes volver a hacer la tarea si quieres.",
    youWrote: "Lo que escribiste",
    teacherSaid: "Tu maestra",
    openTask: "Abrir esta tarea otra vez",
    gotIt: "Entendido",
    close: "Cerrar",
    writtenInSpanish: "Escribiste esto en español.",
    blank: "(en blanco)",
  },
};

export const TEACHER_NOTES_LABEL: Localized = { en: "Teacher notes", es: "Notas de la maestra" };

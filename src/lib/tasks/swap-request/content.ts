import type { EventIntroCopy, Lang, Localized } from "@/lib/task-types";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "🔁",
    kicker: "Wednesday. Two shifts overlap.",
    headline: "Two shifts overlap. Ask for a swap.",
    body: "Thursday's shift lands on something you already have. Harborside uses a real form for this - not an email.",
    cta: "Open the swap form",
  },
  es: {
    emoji: "🔁",
    kicker: "Miércoles. Dos turnos se cruzan.",
    headline: "Dos turnos se cruzan. Pide un cambio.",
    body: "El turno del jueves cae en algo que ya tienes. Harborside usa un formulario real para esto, no un correo.",
    cta: "Abrir el formulario",
  },
};

export const SWAP_COPY: Record<Lang, {
  heading: string;
  helpBtn: string;
  shiftLabel: string;
  shiftPlaceholder: string;
  shiftPickedNote: string;
  coverLabel: string;
  coverPlaceholder: string;
  reasonLabel: string;
  reasonPlaceholder: string;
  submit: string;
  sentKicker: string;
  doneBody: string;
  badgeName: string;
  badgeWhere: string;
  tryAgain: string;
  backToDesk: string;
  lessonKicker: string;
  tipLabel: string;
  gotIt: string;
}> = {
  en: {
    heading: "Shift Swap Request",
    helpBtn: "Help me with this step",
    shiftLabel: "Which shift?",
    shiftPlaceholder: "Choose a shift",
    shiftPickedNote: "Picked from your schedule.",
    coverLabel: "Which shift could you work instead?",
    coverPlaceholder: "Choose a shift",
    reasonLabel: "Reason (optional)",
    reasonPlaceholder: "A doctor's appointment that day",
    submit: "Submit request",
    sentKicker: "Request sent",
    doneBody: "You asked for the late shift the same day, so the cafe still has you Thursday and you still make your appointment. That is what makes a swap easy to say yes to.",
    badgeName: "Request a shift swap",
    badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "Quick help",
    tipLabel: "Tip",
    gotIt: "I understand. Back to my task",
  },
  es: {
    heading: "Solicitud de cambio de turno",
    helpBtn: "Ayúdame con este paso",
    shiftLabel: "¿Qué turno?",
    shiftPlaceholder: "Elige un turno",
    shiftPickedNote: "Elegido desde tu horario.",
    coverLabel: "¿Qué turno podrías trabajar en su lugar?",
    coverPlaceholder: "Elige un turno",
    reasonLabel: "Motivo (opcional)",
    reasonPlaceholder: "Una cita con el doctor ese día",
    submit: "Enviar solicitud",
    sentKicker: "Solicitud enviada",
    doneBody: "Pediste el turno de la tarde el mismo día, así el café todavía te tiene el jueves y tú llegas a tu cita. Eso es lo que hace fácil decir que sí a un cambio.",
    badgeName: "Pedir un cambio de turno",
    badgeWhere: "Cuenta para: Oficina · Servicio de alimentos",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Ayuda rápida",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
  },
};

/**
 * The swap form's three moments, so the Job Card names the one the learner
 * is on (Wave 5 F-4: it said "Pick a shift you can work instead" while Show
 * me lit Submit). The cover line is `RIGHT_NOW_STEPS[0]`.
 */
export const FORM_STEPS: Record<"shift" | "submit", Localized> = {
  shift: {
    en: "Choose the shift you need to swap.",
    es: "Elige el turno que necesitas cambiar.",
  },
  submit: {
    en: "Click Submit request.",
    es: "Haz clic en Enviar solicitud.",
  },
};

/** The persistent "what to do right now" line, one per step of this job. */
export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  // The question, not the rule: which shift works is the learner's call. A
  // wrong pick explains why (SWAP_OPTIONS.wrongHint); Help has the rule.
  {
    en: "Look at the personal calendar on your phone. Pick a shift you can work instead.",
    es: "Mira el calendario personal de tu teléfono. Elige un turno que sí puedas trabajar.",
  },
];

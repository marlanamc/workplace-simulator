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
  subhead: string;
  helpBtn: string;
  shiftLabel: string;
  shiftPlaceholder: string;
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
}> = {
  en: {
    heading: "Shift Swap Request",
    subhead: "Your Thursday shift covers your 11 AM doctor's appointment. Ask for a shift that same day, after it.",
    helpBtn: "Help me with this step",
    shiftLabel: "Which shift?",
    shiftPlaceholder: "Choose a shift",
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
  },
  es: {
    heading: "Solicitud de cambio de turno",
    subhead: "Tu turno del jueves cubre tu cita con el doctor a las 11 AM. Pide un turno ese mismo día, después de la cita.",
    helpBtn: "Ayúdame con este paso",
    shiftLabel: "¿Qué turno?",
    shiftPlaceholder: "Elige un turno",
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
  },
};

/** The persistent "what to do right now" line, one per step of this job. */
export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Pick the Thursday shift, then a shift that starts after your appointment.",
    es: "Elige el turno del jueves, y luego uno que empiece después de tu cita.",
  },
];

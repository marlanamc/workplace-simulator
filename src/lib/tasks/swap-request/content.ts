import type { EventIntroCopy, Lang, Localized } from "@/lib/task-types";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "🔁",
    kicker: "Job 5 of 9",
    headline: "Two shifts overlap. Ask for a swap.",
    body: "Thursday's shift lands on something you already have. Harborside uses a real form for this - not an email.",
    cta: "Open the swap form",
  },
  es: {
    emoji: "🔁",
    kicker: "Trabajo 5 de 9",
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
  dateLabel: string;
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
    subhead: "Thursday's shift overlaps with something on your own calendar. Fill out the form to ask for a swap.",
    helpBtn: "Help me with this step",
    shiftLabel: "Which shift?",
    shiftPlaceholder: "Choose a shift",
    dateLabel: "New date you can work",
    reasonLabel: "Reason (optional)",
    reasonPlaceholder: "A doctor's appointment that day",
    submit: "Submit request",
    sentKicker: "Request sent",
    doneBody: "Maria will see this on her end and approve or suggest another day. You don't have to wait by the computer.",
    badgeName: "Request a shift swap",
    badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
  },
  es: {
    heading: "Solicitud de cambio de turno",
    subhead: "El turno del jueves se cruza con algo en tu propio calendario. Llena el formulario para pedir un cambio.",
    helpBtn: "Ayúdame con este paso",
    shiftLabel: "¿Qué turno?",
    shiftPlaceholder: "Elige un turno",
    dateLabel: "Nueva fecha en la que puedes trabajar",
    reasonLabel: "Motivo (opcional)",
    reasonPlaceholder: "Una cita con el doctor ese día",
    submit: "Enviar solicitud",
    sentKicker: "Solicitud enviada",
    doneBody: "Maria verá esto y lo aprobará o sugerirá otro día. No tienes que esperar frente a la computadora.",
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
    en: "Fill in the swap form: the shift, the reason, and who can cover.",
    es: "Llena el formulario: el turno, el motivo, y quién puede cubrirlo.",
  },
];

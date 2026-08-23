import type { ConfidenceOption, EventIntroCopy, Lang } from "@/lib/task-types";

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
  confidenceQ: string;
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
    confidenceQ: "How do you feel about doing this at work tomorrow?",
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
    confidenceQ: "¿Cómo te sientes de hacer esto mañana en el trabajo?",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
  },
};

export const CONFIDENCE_OPTIONS: Record<Lang, ConfidenceOption[]> = {
  en: [
    { label: "Still unsure", reply: "That's honest. Do the task one more time, or come on Wednesday and we can do it together." },
    { label: "I could try", reply: "Good. Try it again without Help. That is how it will feel at work." },
    { label: "I can do this", reply: "You just did it with no help. Use the Next button below to keep going." },
  ],
  es: [
    { label: "Todavía dudo", reply: "Eso es honesto. Hazlo otra vez, o ven el miércoles y lo hacemos juntos." },
    { label: "Podría intentarlo", reply: "Bien. Inténtalo otra vez sin Ayuda. Así se siente en el trabajo." },
    { label: "Puedo hacerlo", reply: "Lo hiciste sin ayuda. Usa el botón de Siguiente abajo para seguir." },
  ],
};

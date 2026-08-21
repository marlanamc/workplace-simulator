import type { ConfidenceOption, EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "📅",
    kicker: "Uh oh",
    headline: "Next week's shifts are up. Check them against your own calendar.",
    body: "Work posts the schedule. You have to notice if it lands on something you already have. If it does, ask Maria for a swap.",
    cta: "Check my schedule",
  },
  es: {
    emoji: "📅",
    kicker: "Uy no",
    headline: "Ya salieron los turnos de la próxima semana. Compáralos con tu propio calendario.",
    body: "El trabajo publica el horario. Tú tienes que ver si cae en algo que ya tienes. Si es así, pídele un cambio a Maria.",
    cta: "Revisar mi horario",
  },
};

export interface ShiftDay {
  day: string;
  date: string;
  shift: string | null;
  /** True on the one shift that overlaps a personal calendar event. Never shown as a warning on the row. */
  conflict?: boolean;
}

export const SCHEDULE: ShiftDay[] = [
  { day: "Mon", date: "Aug 24", shift: "7:00 AM – 3:00 PM" },
  { day: "Tue", date: "Aug 25", shift: "7:00 AM – 3:00 PM" },
  { day: "Wed", date: "Aug 26", shift: null },
  { day: "Thu", date: "Aug 27", shift: "10:00 AM – 6:00 PM", conflict: true },
  { day: "Fri", date: "Aug 28", shift: "10:00 AM – 6:00 PM" },
  { day: "Sat", date: "Aug 29", shift: "8:00 AM – 4:00 PM" },
  { day: "Sun", date: "Aug 30", shift: null },
];

export interface PersonalEvent {
  day: string;
  date: string;
  time: string;
  title: Localized;
}

/** Sits next to the work schedule. The student has to match days and times. */
export const PERSONAL_CALENDAR: PersonalEvent[] = [
  { day: "Tue", date: "Aug 25", time: "7:30 PM", title: { en: "Call the school", es: "Llamar a la escuela" } },
  { day: "Thu", date: "Aug 27", time: "11:00 AM", title: { en: "Doctor", es: "Doctor" } },
  { day: "Sat", date: "Aug 29", time: "6:00 PM", title: { en: "Soccer", es: "Fútbol" } },
];

export const SCHEDULE_COPY: Record<Lang, {
  heading: string;
  subhead: string;
  helpBtn: string;
  langBtn: string;
  requestSwap: string;
  phoneLabel: string;
  phoneHeading: string;
  to: string;
  subjectLabel: string;
  subjectPrefix: string;
  writeHere: string;
  startersLabel: string;
  send: string;
  discard: string;
  backToList: string;
  sentKicker: string;
  doneTitle: string;
  doneBody: string;
  badgeName: string;
  badgeWhere: string;
  confidenceQ: string;
  tryAgain: string;
  backToDesk: string;
  lessonKicker: string;
  tipLabel: string;
  gotIt: string;
  askPerson: string;
}> = {
  en: {
    heading: "Your schedule. Next week",
    subhead: "Times are shown in your local time.",
    helpBtn: "Help me with this step",
    langBtn: "Español",
    requestSwap: "Request a swap",
    phoneLabel: "Your phone",
    phoneHeading: "Calendar",
    to: "To",
    subjectLabel: "Subject",
    subjectPrefix: "Shift swap request:",
    writeHere: "Write your message here…",
    startersLabel: "Sentence starters",
    send: "Send",
    discard: "Discard",
    backToList: "Back to schedule",
    sentKicker: "Message sent",
    doneTitle: "You asked for a shift swap.",
    doneBody: "Maria got your message about the conflict. Asking early, in writing, is exactly how a real request like this should go.",
    badgeName: "Request a schedule change",
    badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    confidenceQ: "How do you feel about asking for a schedule change at a real job?",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
    askPerson: "Ask a person instead",
  },
  es: {
    heading: "Tu horario. Próxima semana",
    subhead: "Las horas se muestran en tu hora local.",
    helpBtn: "Ayúdame con este paso",
    langBtn: "English",
    requestSwap: "Pedir un cambio",
    phoneLabel: "Tu teléfono",
    phoneHeading: "Calendario",
    to: "Para",
    subjectLabel: "Asunto",
    subjectPrefix: "Solicitud de cambio de turno:",
    writeHere: "Escribe tu mensaje aquí…",
    startersLabel: "Frases de ayuda",
    send: "Enviar",
    discard: "Descartar",
    backToList: "Volver al horario",
    sentKicker: "Mensaje enviado",
    doneTitle: "Pediste un cambio de turno.",
    doneBody: "Maria recibió tu mensaje sobre el conflicto. Pedirlo temprano y por escrito es justo lo que se espera en una solicitud real como esta.",
    badgeName: "Pedir un cambio de horario",
    badgeWhere: "Cuenta para: Oficina · Servicio de alimentos",
    confidenceQ: "¿Cómo te sientes de pedir un cambio de horario en un trabajo real?",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
    askPerson: "Mejor preguntar a una persona",
  },
};

export const WRONG_SWAP_HINT: Localized = {
  en: "That shift is fine. Look at your calendar too. Which work day is at the same time as something you already have?",
  es: "Ese turno está bien. Mira tu calendario también. ¿Qué día de trabajo cae a la misma hora que algo que ya tienes?",
};

export const STARTERS: Record<Lang, string[]> = {
  en: [
    "Hi Maria, I have a conflict with my shift on Thursday.",
    "I have a doctor's appointment that day.",
    "Could we swap that shift, or could someone cover it?",
    "Let me know what works. Thank you.",
  ],
  es: [
    "Hola Maria, tengo un conflicto con mi turno del jueves.",
    "Tengo una cita con el doctor ese día.",
    "¿Podríamos cambiar ese turno, o alguien podría cubrirlo?",
    "Avísame qué funciona. Gracias.",
  ],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Reading your schedule",
      s: [
        "Each row is one day. The time on the right is your shift.",
        "\"Off\" means you're not scheduled that day.",
        "Look at your own calendar too. If a shift is at the same time as something you already have, ask for a swap.",
      ],
      tip: "Do this as soon as a new schedule is posted. The sooner you catch a conflict, the easier it is to fix.",
    },
    {
      t: "Asking for a swap",
      s: [
        "Say which day, and why it's a problem.",
        "Ask in a clear way. \"Could we swap\" or \"could someone cover it\" both work.",
        "Send it as soon as you notice the conflict, not the night before.",
      ],
      tip: "You don't need perfect words. Clear and polite is enough.",
    },
  ],
  es: [
    {
      t: "Leer tu horario",
      s: [
        "Cada fila es un día. La hora a la derecha es tu turno.",
        "\"Off\" significa que no trabajas ese día.",
        "Mira tu propio calendario también. Si un turno cae a la misma hora que algo que ya tienes, pide un cambio.",
      ],
      tip: "Hazlo en cuanto se publique un horario nuevo. Mientras antes veas el conflicto, más fácil es resolverlo.",
    },
    {
      t: "Pedir un cambio",
      s: [
        "Di qué día es y por qué es un problema.",
        "Pide de forma clara. \"Podríamos cambiar\" o \"alguien podría cubrirlo\" funcionan.",
        "Envíalo en cuanto notes el conflicto, no la noche anterior.",
      ],
      tip: "No necesitas la redacción perfecta. Con que sea claro y amable basta.",
    },
  ],
};

export const CONFIDENCE_OPTIONS: Record<Lang, ConfidenceOption[]> = {
  en: [
    { label: "Still unsure", reply: "That's honest. Do the task one more time, or come on Wednesday and we can do it together." },
    { label: "I could try", reply: "Good. Try it again without Help. That is how it will feel at work." },
    { label: "I can do this", reply: "You just did it with no help. Move on to the next task on your desktop." },
  ],
  es: [
    { label: "Todavía dudo", reply: "Eso es honesto. Hazlo otra vez, o ven el miércoles y lo hacemos juntos." },
    { label: "Podría intentarlo", reply: "Bien. Inténtalo otra vez sin Ayuda. Así se siente en el trabajo." },
    { label: "Puedo hacerlo", reply: "Lo hiciste sin ayuda. Sigue con la siguiente tarea en tu escritorio." },
  ],
};

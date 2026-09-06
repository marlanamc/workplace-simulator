import type { EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "📅",
    kicker: "Uh oh",
    headline: "Next week's shifts are up. Check them against the personal calendar on your phone.",
    body: "Work posts the schedule. Nobody checks it against your life for you. Find the day that is at the same time as something already on your phone.",
    cta: "Check my schedule",
  },
  es: {
    emoji: "📅",
    kicker: "Uy no",
    headline: "Ya salieron los turnos de la próxima semana. Compáralos con el calendario personal de tu teléfono.",
    body: "El trabajo publica el horario. Nadie lo compara con tu vida por ti. Busca el día que cae a la misma hora que algo que ya tienes en tu teléfono.",
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

/**
 * Cover options offered on the swap form for the clashing Thursday. The doctor
 * is at 11 AM, so only the late shift clears it — an earlier start or a
 * different day are both plausible-looking wrong answers, which is the point.
 */
export interface SwapOption {
  key: string;
  label: Localized;
  /** The one that actually clears the 11 AM appointment. */
  works: boolean;
  /** Why this option fails, shown when the learner picks it. */
  wrongHint?: Localized;
}

export const SWAP_OPTIONS: SwapOption[] = [
  {
    key: "thu-late",
    label: { en: "Thu Aug 27 · 2:00 PM – 10:00 PM", es: "Jue 27 ago · 2:00 PM – 10:00 PM" },
    works: true,
  },
  {
    key: "thu-early",
    label: { en: "Thu Aug 27 · 6:00 AM – 2:00 PM", es: "Jue 27 ago · 6:00 AM – 2:00 PM" },
    works: false,
    wrongHint: {
      en: "That one still covers 11 AM, and that is when the doctor is. You need a shift that starts after your appointment.",
      es: "Ese todavía cubre las 11 AM, que es cuando tienes al doctor. Necesitas un turno que empiece después de tu cita.",
    },
  },
  {
    key: "wed",
    label: { en: "Wed Aug 26 · 10:00 AM – 6:00 PM", es: "Mié 26 ago · 10:00 AM – 6:00 PM" },
    works: false,
    wrongHint: {
      en: "Wednesday is your day off, not the problem. Maria needs Thursday covered. Ask for a different time that same day.",
      es: "El miércoles es tu día libre, no el problema. Maria necesita cubrir el jueves. Pide otra hora ese mismo día.",
    },
  },
  {
    key: "fri",
    label: { en: "Fri Aug 28 · 10:00 AM – 6:00 PM", es: "Vie 28 ago · 10:00 AM – 6:00 PM" },
    works: false,
    wrongHint: {
      en: "You already work Friday. Moving Thursday onto a day you're on would give you two shifts and still leave Thursday open.",
      es: "El viernes ya trabajas. Mover el jueves a un día que ya tienes te daría dos turnos y el jueves seguiría sin cubrir.",
    },
  },
];

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
  pickConflict: string;
  phoneLabel: string;
  phoneHeading: string;
  doneTitle: string;
  doneBody: string;
  badgeName: string;
  badgeWhere: string;
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
    pickConflict: "Request a swap",
    phoneLabel: "Your personal calendar",
    phoneHeading: "My Calendar",
    doneTitle: "You caught the conflict and asked for a swap.",
    doneBody: "Thursday's shift landed on your doctor's appointment, so you asked Maria for a swap the same visit you spotted it. Catching that yourself, the day the schedule goes up, is what keeps a clash from turning into a missed shift or a missed appointment.",
    badgeName: "Read a schedule against your own calendar",
    badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "I understand. Back to my task",
    askPerson: "Ask a person instead",
  },
  es: {
    heading: "Tu horario. Próxima semana",
    subhead: "Las horas se muestran en tu hora local.",
    helpBtn: "Ayúdame con este paso",
    langBtn: "English",
    pickConflict: "Pedir un cambio",
    phoneLabel: "Tu calendario personal",
    phoneHeading: "Mi calendario",
    doneTitle: "Detectaste el conflicto y pediste un cambio.",
    doneBody: "El turno del jueves caía en tu cita con el doctor, así que le pediste a Maria un cambio en la misma visita en que lo notaste. Notarlo tú, el día que sale el horario, es lo que evita que un choque se convierta en un turno perdido o una cita perdida.",
    badgeName: "Leer un horario contra tu propio calendario",
    badgeWhere: "Cuenta para: Oficina · Servicio de alimentos",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
    askPerson: "Mejor preguntar a una persona",
  },
};

export const WRONG_SWAP_HINT: Localized = {
  en: "That shift is fine. Look at the personal calendar on your phone too. Which work day is at the same time as something you already have?",
  es: "Ese turno está bien. Mira también el calendario personal de tu teléfono. ¿Qué día de trabajo cae a la misma hora que algo que ya tienes?",
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Reading your schedule",
      s: [
        "Each row is one day. The time on the right is your shift.",
        "\"Off\" means you're not scheduled that day.",
        "Look at the personal calendar on your phone too. If a shift is at the same time as something you already have, ask for a swap.",
      ],
      tip: "Do this as soon as a new schedule is posted. The sooner you catch a conflict, the easier it is to fix.",
    },
  ],
  es: [
    {
      t: "Leer tu horario",
      s: [
        "Cada fila es un día. La hora a la derecha es tu turno.",
        "\"Off\" significa que no trabajas ese día.",
        "Mira también el calendario personal de tu teléfono. Si un turno cae a la misma hora que algo que ya tienes, pide un cambio.",
      ],
      tip: "Hazlo en cuanto se publique un horario nuevo. Mientras antes veas el conflicto, más fácil es resolverlo.",
    },
  ],
};

/** The persistent "what to do right now" line, one per step of this job. */
export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Compare next week's shifts to the personal calendar on your phone. Find a shift that is at the same time as something you already have scheduled.",
    es: "Compara los turnos de la próxima semana con el calendario personal de tu teléfono. Busca un turno que cae a la misma hora que algo que ya tienes agendado.",
  },
];

/** After two wrong days, narrow the comparison without completing it for them. */
export const STUCK_SWAP_HINT: Localized = {
  en: "Look at Thursday, Aug 27. Your doctor visit is at 11 AM. Compare that time with Thursday's work shift.",
  es: "Mira el jueves 27 de agosto. Tu cita con el doctor es a las 11 AM. Compara esa hora con el turno del jueves.",
};

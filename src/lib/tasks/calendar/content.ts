import type { EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "📅",
    kicker: "Next week",
    headline: "Renata put a meeting on your day off.",
    body: "The Weekly Lead Huddle is on Wednesday, August 26. You do not work that day. Ask her for a different time.",
    cta: "Open Calendar",
  },
  es: {
    emoji: "📅",
    kicker: "La semana que viene",
    headline: "Renata puso una reunión en tu día libre.",
    body: "La reunión semanal de líderes es el miércoles 26 de agosto. Ese día no trabajas. Pídele otro horario.",
    cta: "Abrir Calendar",
  },
};

export const HUDDLE_TIMES = [
  {
    key: "10am" as const,
    label: { en: "Thu 10:00 AM", es: "Jue 10:00 AM" },
    starter: {
      en: "Could we do Thursday at 10 AM instead?",
      es: "¿Podríamos el jueves a las 10 AM?",
    },
  },
  {
    key: "2pm" as const,
    label: { en: "Thu 2:00 PM", es: "Jue 2:00 PM" },
    starter: {
      en: "Could we do Thursday at 2 PM instead?",
      es: "¿Podríamos el jueves a las 2 PM?",
    },
  },
];

export const MEETING = {
  title: "Weekly Lead Huddle",
  organizer: "Renata Silva · General Manager",
  day: "Wed",
  date: "Aug 26",
  time: "9:00 AM – 9:30 AM",
  description: "A short weekly check-in with the shift leads. Counts, callouts, and anything coming up.",
};

export const CALENDAR_COPY: Record<Lang, {
  heading: string;
  helpBtn: string;
  langBtn: string;
  create: string;
  todayBtn: string;
  searchPlaceholder: string;
  myCalendars: string;
  workShifts: string;
  cafeCalendar: string;
  monthLabel: string;
  viewDay: string;
  viewWeek: string;
  viewMonth: string;
  weekdayLabels: string[];
  invitedBy: string;
  scheduleNote: string;
  going: string;
  accept: string;
  no: string;
  maybe: string;
  proposeTime: string;
  whatTime: string;
  to: string;
  subjectLabel: string;
  subject: string;
  writeHere: string;
  startersLabel: string;
  send: string;
  discard: string;
  sentKicker: string;
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
    heading: "Calendar",
    helpBtn: "Help me with this step",
    langBtn: "Español",
    create: "Create",
    todayBtn: "Today",
    searchPlaceholder: "Search for people",
    myCalendars: "My calendars",
    workShifts: "Work shifts",
    cafeCalendar: "Harborside Cafe",
    monthLabel: "August 2026",
    viewDay: "Day",
    viewWeek: "Week",
    viewMonth: "Month",
    weekdayLabels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    invitedBy: "Organizer",
    scheduleNote: "You're not scheduled to work this day.",
    going: "Going?",
    accept: "Yes",
    no: "No",
    maybe: "Maybe",
    proposeTime: "Propose a new time",
    whatTime: "What time works?",
    to: "To",
    subjectLabel: "Subject",
    subject: "Re: Weekly Lead Huddle. Different time?",
    writeHere: "Write your message here…",
    startersLabel: "Sentence starters",
    send: "Send",
    discard: "Discard",
    sentKicker: "Message sent",
    doneTitle: "You noticed a scheduling conflict before it became a problem.",
    doneBody: "Renata got your note about the huddle landing on your day off. Checking your calendar against your schedule, every time, stops you from coming in on a day you didn't plan to work.",
    badgeName: "Handle a meeting invite correctly",
    badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
    askPerson: "Ask a person instead",
  },
  es: {
    heading: "Calendario",
    helpBtn: "Ayúdame con este paso",
    langBtn: "English",
    create: "Crear",
    todayBtn: "Hoy",
    searchPlaceholder: "Buscar personas",
    myCalendars: "Mis calendarios",
    workShifts: "Turnos",
    cafeCalendar: "Harborside Cafe",
    monthLabel: "Agosto de 2026",
    viewDay: "Día",
    viewWeek: "Semana",
    viewMonth: "Mes",
    weekdayLabels: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
    invitedBy: "Organizador",
    scheduleNote: "No estás programado para trabajar ese día.",
    going: "¿Asistirás?",
    accept: "Sí",
    no: "No",
    maybe: "Quizá",
    proposeTime: "Proponer otro horario",
    whatTime: "¿Qué hora te funciona?",
    to: "Para",
    subjectLabel: "Asunto",
    subject: "Re: Weekly Lead Huddle. ¿Otro horario?",
    writeHere: "Escribe tu mensaje aquí…",
    startersLabel: "Frases de ayuda",
    send: "Enviar",
    discard: "Descartar",
    sentKicker: "Mensaje enviado",
    doneTitle: "Notaste un conflicto de horario antes de que fuera un problema.",
    doneBody: "Renata recibió tu nota sobre la reunión en tu día libre. Revisar tu calendario contra tu horario, siempre, evita que vengas a trabajar un día que no planeabas.",
    badgeName: "Manejar una invitación a una reunión correctamente",
    badgeWhere: "Cuenta para: Oficina · Servicio de alimentos",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
    askPerson: "Mejor preguntar a una persona",
  },
};

export const WRONG_ACCEPT_HINT: Record<Lang, string> = {
  en: "Check your schedule first. You are not working that day. Suggest a different time instead of just saying yes.",
  es: "Revisa tu horario primero. No trabajas ese día. Propón otro horario en vez de solo aceptar.",
};

export const STARTERS: Record<Lang, string[]> = {
  en: [
    "Hi Renata, I'm not scheduled to work Wednesday.",
    "Could we move the meeting to a day I work?",
    "I can also join by phone, if that is better.",
    "Let me know what works. Thank you.",
  ],
  es: [
    "Hola Renata, no estoy programado para trabajar el miércoles.",
    "¿Podemos mover la reunión a un día que trabajo?",
    "También me puedo unir por teléfono, si es mejor.",
    "Avísame qué funciona. Gracias.",
  ],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Reading a meeting invite",
      s: [
        "Look at the day and time of the meeting, not only who sent it.",
        "Look at your shifts. Green shows the days you work.",
        "If the meeting is on a day you do not work, do not just say yes. Ask for a different time.",
      ],
      tip: "It is the same skill as checking a work schedule.",
    },
    {
      t: "Proposing a different time",
      s: [
        "Say that the time does not work, and why.",
        "Say a day and time that works for you.",
        "Keep it short. One or two sentences is enough.",
      ],
      tip: "You do not need to fix the whole schedule. A clear message is enough.",
    },
  ],
  es: [
    {
      t: "Leer una invitación a una reunión",
      s: [
        "Mira el día y la hora de la reunión, no solo quién la envió.",
        "Mira tus turnos. El verde muestra los días que trabajas.",
        "Si la reunión es un día que no trabajas, no digas que sí sin más. Pide otro horario.",
      ],
      tip: "Es la misma habilidad que revisar un horario de trabajo.",
    },
    {
      t: "Proponer otro horario",
      s: [
        "Di que ese horario no te funciona, y por qué.",
        "Di un día y una hora que sí te funcionen.",
        "Que sea corto. Una o dos oraciones son suficientes.",
      ],
      tip: "No tienes que arreglar todo el horario. Un mensaje claro es suficiente.",
    },
  ],
};

/** The persistent "what to do right now" line, one per step of this job. */
export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Find the meeting on Wednesday, August 26. Click it.",
    es: "Busca la reunión del miércoles 26 de agosto. Haz clic en ella.",
  },
  {
    en: "You do not work on August 26. Click Propose a new time.",
    es: "No trabajas el 26 de agosto. Haz clic en Proponer otro horario.",
  },
  {
    en: "Write Renata a new day and time. Then click Send.",
    es: "Escríbele a Renata otro día y hora. Después haz clic en Enviar.",
  },
];

/** A shift's start and end, so a chip on the calendar says "Shift 10–6", not just "10:00 AM". */
export const SHIFT_SPAN: Record<string, string> = {
  "7:00 AM": "7–3",
  "10:00 AM": "10–6",
  "8:00 AM": "8–4",
};

export const SHIFT_WORD: Localized = { en: "Shift", es: "Turno" };

/** A message that asks for another time has to name one: a day, a time, or a part of the day. */
export function proposesATime(body: string): boolean {
  return /\d|monday|tuesday|wednesday|thursday|friday|saturday|sunday|lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bado|domingo|morning|afternoon|mañana|tarde/i.test(body);
}

export const NEEDS_TIME_HINT: Localized = {
  en: "Say a new day or time for the meeting. You can click Thu 10:00 AM or Thu 2:00 PM.",
  es: "Di otro día u hora para la reunión. Puedes hacer clic en Jue 10:00 AM o Jue 2:00 PM.",
};

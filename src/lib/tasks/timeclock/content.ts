import type { EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "⏰",
    kicker: "End of shift",
    headline: "Time to clock out. Check the hours first.",
    body: "Your shift is done. Before you go home, clock out and make sure the hours match what you worked. A quick look now can save a problem on payday.",
    cta: "Clock out",
  },
  es: {
    emoji: "⏰",
    kicker: "Fin del turno",
    headline: "Hora de marcar salida. Revisa las horas primero.",
    body: "Tu turno terminó. Antes de irte a casa, marca tu salida y asegúrate de que las horas coincidan con lo que trabajaste. Un vistazo rápido ahora te ahorra un dolor de cabeza el día de pago.",
    cta: "Marcar salida",
  },
};

export const TIMECLOCK = {
  scheduledStart: "7:00 AM",
  scheduledEnd: "3:00 PM",
  scheduledHours: "8h 00m",
  clockedInAt: "8:02 AM",
  clockedOutAt: "3:00 PM",
  todayTotal: "6h 58m",
  weekHours: "24h 30m this week",
  recent: [
    { date: "Mon, Aug 18", in: "6:58 AM", out: "3:04 PM", total: "8h 06m" },
    { date: "Sat, Aug 16", in: "8:01 AM", out: "4:00 PM", total: "7h 59m" },
    { date: "Fri, Aug 15", in: "10:03 AM", out: "6:02 PM", total: "7h 59m" },
  ],
};

export const TIMECLOCK_COPY: Record<Lang, {
  heading: string;
  helpBtn: string;
  langBtn: string;
  clockedInStatus: string;
  sinceLabel: string;
  clockOut: string;
  clockedOutStatus: string;
  todayTotalLabel: string;
  scheduledLabel: string;
  reviewQuestion: string;
  looksRight: string;
  somethingOff: string;
  recentHeading: string;
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
    heading: "Time Clock",
    helpBtn: "Help me with this step",
    langBtn: "Español",
    clockedInStatus: "Clocked in",
    sinceLabel: "Since",
    clockOut: "Clock Out",
    clockedOutStatus: "Clocked out",
    todayTotalLabel: "Today's total",
    scheduledLabel: "Your scheduled shift",
    reviewQuestion: "Does this look right?",
    looksRight: "Looks right",
    somethingOff: "Something looks wrong. Message my lead",
    recentHeading: "Recent shifts",
    to: "To",
    subjectLabel: "Subject",
    subject: "My hours today look short",
    writeHere: "Write your message here…",
    startersLabel: "Sentence starters",
    send: "Send",
    discard: "Discard",
    sentKicker: "Message sent",
    doneTitle: "You caught a mismatch and said something.",
    doneBody: "Your total did not match your scheduled shift, so you told Maria. That is the right move before payday.",
    badgeName: "Check your hours and speak up",
    badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
    askPerson: "Ask a person instead",
  },
  es: {
    heading: "Reloj de tiempo",
    helpBtn: "Ayúdame con este paso",
    langBtn: "English",
    clockedInStatus: "Turno iniciado",
    sinceLabel: "Desde",
    clockOut: "Marcar salida",
    clockedOutStatus: "Turno terminado",
    todayTotalLabel: "Total de hoy",
    scheduledLabel: "Tu turno programado",
    reviewQuestion: "¿Esto se ve correcto?",
    looksRight: "Se ve bien",
    somethingOff: "Algo no cuadra. Avisar a mi líder",
    recentHeading: "Turnos recientes",
    to: "Para",
    subjectLabel: "Asunto",
    subject: "Mis horas de hoy parecen menos de lo esperado",
    writeHere: "Escribe tu mensaje aquí…",
    startersLabel: "Frases de ayuda",
    send: "Enviar",
    discard: "Descartar",
    sentKicker: "Mensaje enviado",
    doneTitle: "Notaste un error y lo dijiste.",
    doneBody: "Tu total no coincidía con tu turno programado, así que se lo dijiste a Maria en vez de dejarlo pasar. Eso es lo que hay que hacer antes de que afecte un pago.",
    badgeName: "Revisar tus horas y avisar",
    badgeWhere: "Cuenta para: Oficina · Servicio de alimentos",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
    askPerson: "Mejor preguntar a una persona",
  },
};

export const WRONG_LOOKS_RIGHT_HINT: Record<Lang, string> = {
  en: "Look again. You clocked in later than your start time, so today's total is short. What would you ask your lead?",
  es: "Mira otra vez. Marcaste tu entrada más tarde que tu hora programada, así que el total de hoy es menor. ¿Qué querrías revisar con tu líder?",
};

export const STARTERS: Record<Lang, string[]> = {
  en: [
    "Hi Maria, my hours today look short.",
    "I clocked in at 8:02 AM instead of 7:00 AM.",
    "Can you check that this is recorded correctly?",
    "Let me know if you need anything else. Thank you.",
  ],
  es: [
    "Hola Maria, mis horas de hoy parecen menos de lo esperado.",
    "Marqué mi entrada a las 8:02 AM en vez de las 7:00 AM.",
    "¿Puedes revisar que esto esté registrado correctamente?",
    "Avísame si necesitas algo más. Gracias.",
  ],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Clocking out",
      s: [
        "Click Clock Out at the very end of your shift, not before.",
        "Once you clock out, the app shows your total hours for today.",
        "Compare that total to the shift you were scheduled for.",
      ],
      tip: "Do this every shift. It only takes a second, and it is the way to catch a mistake early.",
    },
    {
      t: "When the hours don't match",
      s: [
        "Say what you noticed. Say the total, and what you expected.",
        "You don't need to know why it's wrong. That's your lead's job to figure out.",
        "Send it the same day, while it's easy to check.",
      ],
      tip: "Catching this before payday is much easier to fix than after.",
    },
  ],
  es: [
    {
      t: "Marcar salida",
      s: [
        "Haz clic en Marcar salida solo al final de tu turno.",
        "Cuando marcas salida, la app muestra tu total de horas de hoy.",
        "Compara ese total con el turno que tenías programado.",
      ],
      tip: "Hazlo cada turno. Toma un segundo, y es la forma de notar un error a tiempo.",
    },
    {
      t: "Cuando las horas no coinciden",
      s: [
        "Di qué notaste. Di el total, y lo que esperabas.",
        "No necesitas saber por qué está mal. Eso lo resuelve tu líder.",
        "Envíalo el mismo día, mientras es fácil de revisar.",
      ],
      tip: "Notarlo antes del día de pago es mucho más fácil de arreglar que después.",
    },
  ],
};

/** The persistent "what to do right now" line, one per step of this job. */
export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Clock out to end your shift.",
    es: "Marca tu salida para terminar el turno.",
  },
  {
    en: "Check the hours against what you actually worked.",
    es: "Revisa las horas contra lo que de verdad trabajaste.",
  },
  {
    en: "Message Maria about the hours that don't match.",
    es: "Escríbele a Maria sobre las horas que no coinciden.",
  },
];

import type { EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "⏰",
    kicker: "Morning",
    headline: "You got here at 7. Clock in, then check the time.",
    body: "Your shift started at 7:00 AM. It is 8:15 AM now. Clock in, then look at the time the clock recorded.",
    cta: "Clock in",
  },
  es: {
    emoji: "⏰",
    kicker: "Por la mañana",
    headline: "Llegaste a las 7. Marca tu entrada y revisa la hora.",
    body: "Tu turno empezó a las 7:00 AM. Ahora son las 8:15 AM. Marca tu entrada y mira la hora que registró el reloj.",
    cta: "Marcar entrada",
  },
};

export const TIMECLOCK = {
  scheduledStart: "7:00 AM",
  scheduledEnd: "3:00 PM",
  arrivedAt: "7:00 AM",
  now: "8:15 AM",
  clockedInAt: "8:15 AM",
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
  notClockedInStatus: string;
  nowLabel: string;
  clockIn: string;
  clockedInStatus: string;
  sinceLabel: string;
  arrivedLabel: string;
  punchLabel: string;
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
    notClockedInStatus: "Not clocked in",
    nowLabel: "Now",
    clockIn: "Clock In",
    clockedInStatus: "Clocked in",
    sinceLabel: "Since",
    arrivedLabel: "You arrived",
    punchLabel: "Clock-in time",
    scheduledLabel: "Your scheduled shift",
    reviewQuestion: "Does this look right?",
    looksRight: "Looks right",
    somethingOff: "Something looks wrong. Message my supervisor",
    recentHeading: "Recent shifts",
    to: "To",
    subjectLabel: "Subject",
    subject: "I forgot to clock in at 7",
    writeHere: "Write your message here…",
    startersLabel: "Sentence starters",
    send: "Send",
    discard: "Discard",
    sentKicker: "Message sent",
    doneTitle: "You caught a late punch and said something.",
    doneBody: "You got here at 7:00 AM, but the clock said 8:15 AM, so you told Maria. That is the right move before payday.",
    badgeName: "Check your hours and speak up",
    badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "I understand. Back to my task",
    askPerson: "Ask a person instead",
  },
  es: {
    heading: "Reloj de tiempo",
    helpBtn: "Ayúdame con este paso",
    langBtn: "English",
    notClockedInStatus: "Sin marcar entrada",
    nowLabel: "Ahora",
    clockIn: "Marcar entrada",
    clockedInStatus: "Turno iniciado",
    sinceLabel: "Desde",
    arrivedLabel: "Llegaste",
    punchLabel: "Hora de entrada",
    scheduledLabel: "Tu turno programado",
    reviewQuestion: "¿Esto se ve correcto?",
    looksRight: "Se ve bien",
    somethingOff: "Algo no cuadra. Avisar a mi supervisor",
    recentHeading: "Turnos recientes",
    to: "Para",
    subjectLabel: "Asunto",
    subject: "Olvidé marcar entrada a las 7",
    writeHere: "Escribe tu mensaje aquí…",
    startersLabel: "Frases de ayuda",
    send: "Enviar",
    discard: "Descartar",
    sentKicker: "Mensaje enviado",
    doneTitle: "Notaste un registro tarde y lo dijiste.",
    doneBody: "Llegaste a las 7:00 AM, pero el reloj decía 8:15 AM, así que se lo dijiste a Maria. Eso es lo que hay que hacer antes del día de pago.",
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
  en: "Look again. You got here at 7:00 AM, but the clock says 8:15 AM. What would you tell your supervisor?",
  es: "Mira otra vez. Llegaste a las 7:00 AM, pero el reloj dice 8:15 AM. ¿Qué le dirías a tu supervisor?",
};

export const STARTERS: Record<Lang, string[]> = {
  en: [
    "Hi Maria, I forgot to clock in when I arrived.",
    "I got here at 7:00 AM, but I clocked in at 8:15 AM.",
    "Can you change my start time to 7:00 AM?",
    "Let me know if you need anything else. Thank you.",
  ],
  es: [
    "Hola Maria, olvidé marcar entrada cuando llegué.",
    "Llegué a las 7:00 AM, pero marqué entrada a las 8:15 AM.",
    "¿Puedes cambiar mi hora de entrada a las 7:00 AM?",
    "Avísame si necesitas algo más. Gracias.",
  ],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Clocking in",
      s: [
        "Click Clock In when you arrive, at the start of your shift.",
        "After you clock in, the app shows the time it recorded.",
        "Compare that time to when you actually got here.",
      ],
      tip: "Do this every shift. It only takes a second, and it is the way to catch a mistake early.",
    },
    {
      t: "When the time doesn't match",
      s: [
        "Say what you noticed. Say when you arrived, and what the clock shows.",
        "You don't need to know how to fix it. That's your supervisor's job.",
        "Send it the same morning, while it's easy to check.",
      ],
      tip: "Catching this before payday is much easier to fix than after.",
    },
  ],
  es: [
    {
      t: "Marcar entrada",
      s: [
        "Haz clic en Marcar entrada cuando llegues, al empezar tu turno.",
        "Cuando marcas entrada, la app muestra la hora que registró.",
        "Compara esa hora con la hora en que de verdad llegaste.",
      ],
      tip: "Hazlo cada turno. Toma un segundo, y es la forma de notar un error a tiempo.",
    },
    {
      t: "Cuando la hora no coincide",
      s: [
        "Di qué notaste. Di a qué hora llegaste, y lo que muestra el reloj.",
        "No necesitas saber cómo arreglarlo. Eso lo resuelve tu supervisor.",
        "Envíalo esa misma mañana, mientras es fácil de revisar.",
      ],
      tip: "Notarlo antes del día de pago es mucho más fácil de arreglar que después.",
    },
  ],
};

/** The persistent "what to do right now" line, one per step of this job. */
export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "You got here at 7. Clock in for your shift.",
    es: "Llegaste a las 7. Marca tu entrada para el turno.",
  },
  {
    en: "Check the clock-in time against when you arrived.",
    es: "Compara la hora de entrada con la hora en que llegaste.",
  },
  {
    en: "Tell Maria you forgot to clock in at 7.",
    es: "Dile a Maria que olvidaste marcar entrada a las 7.",
  },
];

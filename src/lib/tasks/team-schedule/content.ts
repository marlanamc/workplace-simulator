import type { EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";
import { GAP_SHIFT_LABEL } from "../crew-week";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "📋",
    kicker: "Monday morning. New job.",
    headline: "Saturday close has nobody on it.",
    body: "You write the crew schedule now. Find the gap, pick someone who has room, and tell them.",
    cta: "Open the schedule",
  },
  es: {
    emoji: "📋",
    kicker: "Lunes por la mañana. Trabajo nuevo.",
    headline: "El cierre del sábado no tiene a nadie.",
    body: "Ahora tú escribes el horario del equipo. Encuentra el hueco, elige a alguien con espacio, y avísale.",
    cta: "Abrir el horario",
  },
};

export const TEAM_SCHEDULE_COPY: Record<Lang, {
  helpBtn: string;
  appName: string;
  sheetName: string;
  startNewHeading: string;
  blankLabel: string;
  templateBudget: string;
  templateSchedule: string;
  recentHeading: string;
  openedLabel: string;
  noteHeading: string;
  noteBody: string;
  hoursHeader: string;
  nameHeader: string;
  pickShift: string;
  emailCta: string;
  fillFirst: string;
  to: string;
  subjectLabel: string;
  subject: string;
  writeHere: string;
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
    helpBtn: "Help me with this step",
    appName: "Sheets",
    sheetName: "Crew Week — Aug 24",
    startNewHeading: "Start a new spreadsheet",
    blankLabel: "Blank",
    templateBudget: "Budget",
    templateSchedule: "Schedule",
    recentHeading: "Recent spreadsheets",
    openedLabel: "Opened today",
    noteHeading: "Coverage note",
    noteBody: `Saturday close ${GAP_SHIFT_LABEL} PM still open. Check Hours. Do not pick the first name.`,
    hoursHeader: "Hours",
    nameHeader: "Name",
    pickShift: "Add shift…",
    emailCta: "Email the person you added",
    fillFirst: "Fill the Saturday close first. Pick someone with room.",
    to: "To",
    subjectLabel: "Subject",
    subject: "You're on Saturday close",
    writeHere: "Write your message here…",
    send: "Send",
    discard: "Discard",
    sentKicker: "Message sent",
    doneTitle: "You filled the gap and told Jordan.",
    doneBody: "You did not pick the first name. You checked the hours. You wrote the day and the time. That is how a supervisor builds a week.",
    badgeName: "Build a crew schedule",
    badgeWhere: "Counts toward: Shift Supervisor",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
    askPerson: "Ask a person instead",
  },
  es: {
    helpBtn: "Ayúdame con este paso",
    appName: "Sheets",
    sheetName: "Semana del equipo — 24 ago",
    startNewHeading: "Iniciar una nueva hoja de cálculo",
    blankLabel: "En blanco",
    templateBudget: "Presupuesto",
    templateSchedule: "Horario",
    recentHeading: "Hojas de cálculo recientes",
    openedLabel: "Abierta hoy",
    noteHeading: "Nota de cobertura",
    noteBody: `El cierre del sábado ${GAP_SHIFT_LABEL} PM sigue abierto. Mira Horas. No elijas el primer nombre.`,
    hoursHeader: "Horas",
    nameHeader: "Nombre",
    pickShift: "Agregar turno…",
    emailCta: "Escribirle a la persona que agregaste",
    fillFirst: "Primero llena el cierre del sábado. Elige a alguien con espacio.",
    to: "Para",
    subjectLabel: "Asunto",
    subject: "Estás en el cierre del sábado",
    writeHere: "Escribe tu mensaje aquí…",
    send: "Enviar",
    discard: "Descartar",
    sentKicker: "Mensaje enviado",
    doneTitle: "Llenaste el hueco y le avisaste a Jordan.",
    doneBody: "No elegiste el primer nombre. Revisaste las horas. Escribiste el día y la hora. Así arma una semana un supervisor.",
    badgeName: "Armar el horario del equipo",
    badgeWhere: "Cuenta para: Supervisor de turno",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
    askPerson: "Mejor preguntar a una persona",
  },
};

export const WRONG_EMAIL_HINT: Record<Lang, string> = {
  en: "Say the day and the time. Jordan needs to know it is Saturday, 4–10 PM.",
  es: "Di el día y la hora. Jordan necesita saber que es el sábado, 4–10 PM.",
};

export const EMPTY_EMAIL_HINT: Record<Lang, string> = {
  en: "Write a short message first. Even one sentence is fine.",
  es: "Primero escribe un mensaje corto. Una oración está bien.",
};

export const STARTERS: Record<Lang, string[]> = {
  en: [
    "Hi Jordan, I added you to Saturday close, 4–10 PM.",
    "You have room this week, so I put you on that shift.",
    "Text me if that does not work. Thank you.",
  ],
  es: [
    "Hola Jordan, te agregué al cierre del sábado, 4–10 PM.",
    "Tienes espacio esta semana, por eso te puse en ese turno.",
    "Escríbeme si no te funciona. Gracias.",
  ],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Fill a gap without overloading someone",
      s: [
        "Find the empty shift first. Here it is Saturday close.",
        "Read the Hours column. The first name on the list is often already full.",
        "Pick someone who has room and is actually free that day.",
      ],
      tip: "A name in a cell is a real person's week. Check the hours before you type.",
    },
    {
      t: "Tell the person you scheduled",
      s: [
        "Write them, not only your lead. They need the day and the time.",
        "Keep it short. One or two sentences is enough.",
        "Do not apologize for the schedule. Just say what you did and why it is fair.",
      ],
      tip: "If the message would confuse you at 6 AM, add the day and the time.",
    },
  ],
  es: [
    {
      t: "Llenar un hueco sin sobrecargar a alguien",
      s: [
        "Primero encuentra el turno vacío. Aquí es el cierre del sábado.",
        "Lee la columna de Horas. El primer nombre de la lista a menudo ya está lleno.",
        "Elige a alguien que tenga espacio y que esté libre ese día.",
      ],
      tip: "Un nombre en una celda es la semana de una persona real. Revisa las horas antes de escribir.",
    },
    {
      t: "Avisarle a la persona que programaste",
      s: [
        "Escríbele a esa persona, no solo a tu líder. Necesita el día y la hora.",
        "Que sea corto. Una o dos oraciones bastan.",
        "No te disculpes por el horario. Di qué hiciste y por qué es justo.",
      ],
      tip: "Si el mensaje te confundiría a las 6 AM, agrega el día y la hora.",
    },
  ],
};


export function emailMentionsShift(body: string): boolean {
  const t = body.toLowerCase();
  const hasDay = /\bsat(urday)?\b/.test(t) || /\bs[aá]b(ado)?\b/.test(t);
  const hasTime = /\b4\b/.test(t) || /\b16:00\b/.test(t) || /4\s*[–-]\s*10/.test(t);
  return hasDay && hasTime;
}

/** The persistent "what to do right now" line, one per step of this job. */
export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Open the crew schedule.",
    es: "Abre el horario del equipo.",
  },
  {
    en: "Find Saturday's gap, then pick someone who has room.",
    es: "Busca el hueco del sábado y elige a alguien con espacio.",
  },
  {
    en: "Tell the person you put on that shift.",
    es: "Avísale a la persona que pusiste en ese turno.",
  },
];

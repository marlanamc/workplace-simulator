import { looksLikeRealText, normalizeReply } from "@/lib/grading/meaning";
import type { EventIntroCopy, Lang, Lesson, Localized, SubmissionContent } from "@/lib/task-types";
import { STORY_DAY_BY_LEVEL, mondayOf, shortDate } from "@/lib/story-dates";
import { CREW, type DayKey } from "@/lib/tasks/crew-week";

/** The huddle the learner calls meets Thursday of the First Team Meeting week (the right slot is Thu 4:15 PM). */
const HUDDLE_THURSDAY = mondayOf(STORY_DAY_BY_LEVEL.level11) + 3;

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "🗣️",
    kicker: "You call the huddle now.",
    headline: "The crew needs 15 minutes on next week's schedule.",
    body: "Create the invite for a time the whole crew can come. Write two or three bullets so the meeting has a point.",
    cta: "Set it up",
  },
  es: {
    emoji: "🗣️",
    kicker: "Ahora tú llamas a la reunión.",
    headline: "El equipo necesita 15 minutos para el horario de la semana que viene.",
    body: "Crea la invitación para una hora en la que todo el equipo pueda venir. Escribe dos o tres puntos para que la reunión tenga un propósito.",
    cta: "Armarla",
  },
};

export const SLOTS = [
  {
    key: "wed", day: "wed", hour: 15, label: { en: "Wed 3:00 PM", es: "Mié 3:00 PM" }, ok: false,
    hint: {
      en: "On Wednesday at 3 PM, Alex, Riley, Sam, and Jordan are working. Look at the shifts again.",
      es: "El miércoles a las 3 PM, Alex, Riley, Sam y Jordan están trabajando. Mira los turnos otra vez.",
    },
  },
  { key: "thu", day: "thu", hour: 16.25, label: { en: "Thu 4:15 PM", es: "Jue 4:15 PM" }, ok: true, hint: { en: "", es: "" } },
  {
    key: "fri", day: "fri", hour: 8, label: { en: "Fri 8:00 AM", es: "Vie 8:00 AM" }, ok: false,
    hint: {
      en: "On Friday at 8 AM, Alex is working. Look at the shifts again.",
      es: "El viernes a las 8 AM, Alex está trabajando. Mira los turnos otra vez.",
    },
  },
] as const;

/**
 * A crew-sheet cell like "8–4", "12–4" or "2–10" as 24-hour start and end.
 * Cafe shifts start between 7 AM and 2 PM, so a start under 7 is PM, and an
 * end at or before the start is PM too. Empty or "Off" is no shift.
 */
export function shiftHours(label: string): { start: number; end: number } | null {
  const m = label.trim().match(/^(\d{1,2})\s*[–-]\s*(\d{1,2})$/);
  if (!m) return null;
  const a = Number(m[1]);
  const b = Number(m[2]);
  const start = a < 7 ? a + 12 : a;
  return { start, end: b <= start ? b + 12 : b };
}

/** First names of the crew on shift at this hour of this day, from the crew sheet the learner sees. */
export function crewWorkingAt(day: DayKey, hour: number): string[] {
  return CREW.filter((person) => {
    const shift = shiftHours(person.shifts[day].label);
    return shift !== null && hour >= shift.start && hour < shift.end;
  }).map((person) => person.name.split(" ")[0]);
}

/** The crew-shift table beside the time choices, so the learner can check who is working. */
export const CREW_TABLE_COPY: Record<"caption" | "name" | "off", Localized> = {
  caption: { en: "Crew shifts this week", es: "Turnos del equipo esta semana" },
  name: { en: "Name", es: "Nombre" },
  off: { en: "Off", es: "Libre" },
};

/** A meeting slot works only when nobody on the crew sheet is on shift then. */
export function slotIsFree(key: string): boolean {
  const slot = SLOTS.find((s) => s.key === key);
  return slot !== undefined && crewWorkingAt(slot.day, slot.hour).length === 0;
}

export const TEAM_MEETING_COPY: Record<Lang, {
  helpBtn: string;
  hubHeading: string;
  calTitle: string;
  calBody: string;
  calCta: string;
  docTitle: string;
  docBody: string;
  docCta: string;
  sendCta: string;
  sendNeed: string;
  eventTitleLabel: string;
  eventTitlePh: string;
  whenLabel: string;
  guestsLabel: string;
  saveEvent: string;
  agendaName: string;
  agendaPh: string;
  startersLabel: string;
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
    hubHeading: "Get the huddle on the calendar",
    calTitle: "Create the invite",
    calBody: "The crew is on the guest list. Their shifts are available in the calendar.",
    calCta: "Open Calendar",
    docTitle: "Write a short agenda",
    docBody: "Agenda for next week’s schedule discussion.",
    docCta: "Open Docs",
    sendCta: "Send the invite with the agenda",
    sendNeed: "Finish the invite and the agenda first.",
    eventTitleLabel: "Title",
    eventTitlePh: "Next week's schedule",
    whenLabel: "When",
    guestsLabel: "Guests",
    saveEvent: "Save",
    agendaName: `Huddle agenda: ${shortDate(HUDDLE_THURSDAY, "en")}`,
    agendaPh: "Type two or three bullets…",
    startersLabel: "Sentence starters",
    sentKicker: "Invite sent",
    doneTitle: "You called the meeting. It has a point.",
    doneBody: "Thursday 4:15 PM. The crew is on the invite. The agenda is two or three bullets, not a speech. That is a huddle a lead can run.",
    badgeName: "Create a meeting with an agenda",
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
    hubHeading: "Pon la reunión en el calendario",
    calTitle: "Crear la invitación",
    calBody: "El equipo está en la lista de invitados. Sus turnos aparecen en el calendario.",
    calCta: "Abrir Calendar",
    docTitle: "Escribir una agenda corta",
    docBody: "Agenda para hablar del horario de la próxima semana.",
    docCta: "Abrir Docs",
    sendCta: "Enviar la invitación con la agenda",
    sendNeed: "Primero termina la invitación y la agenda.",
    eventTitleLabel: "Título",
    eventTitlePh: "Horario de la semana que viene",
    whenLabel: "Cuándo",
    guestsLabel: "Invitados",
    saveEvent: "Guardar",
    agendaName: `Agenda de la reunión: ${shortDate(HUDDLE_THURSDAY, "es")}`,
    agendaPh: "Escribe dos o tres puntos…",
    startersLabel: "Frases de ayuda",
    sentKicker: "Invitación enviada",
    doneTitle: "Tú llamaste a la reunión. Tiene un propósito.",
    doneBody: "Jueves 4:15 PM. El equipo está en la invitación. La agenda es de dos o tres puntos, no un discurso. Así se arma una reunión que un líder puede dirigir.",
    badgeName: "Crear una reunión con agenda",
    badgeWhere: "Cuenta para: Supervisor de turno",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
    askPerson: "Mejor preguntar a una persona",
  },
};

export const GUESTS = ["Alex Chen", "Jordan Kim", "Riley Park", "Sam Rivera", "Casey Brooks"];

export const AGENDA_STARTERS: Record<Lang, string[]> = {
  en: [
    "- Walk the Saturday close coverage",
    "- Confirm who is opening Monday",
    "- One question from the floor",
  ],
  es: [
    "- Revisar la cobertura del cierre del sábado",
    "- Confirmar quién abre el lunes",
    "- Una pregunta del equipo",
  ],
};

export const HINTS: Record<Lang, { title: string; time: string; agenda: string }> = {
  en: {
    title: "Give it a one-line title. Say what the meeting is about, like the schedule.",
    time: "Pick a time that is not a shift.",
    agenda: "Write two things to talk about. Short lines are fine.",
  },
  es: {
    title: "Ponle un título de una línea. Di de qué es la reunión, por ejemplo el horario.",
    time: "Elige una hora que no sea un turno.",
    agenda: "Escribe dos cosas para hablar. Las líneas cortas están bien.",
  },
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "A meeting needs a time and a point",
      s: [
        "Create the invite yourself. Do not wait for Renata to send one.",
        "Check the crew's shifts before you pick a time. Same conflict skill. New side of it.",
        "Two or three bullets in Docs is the agenda. Attach it or the invite is just a time.",
      ],
      tip: "If you start from last week's agenda, File → Make a copy. Do not type over the shared original.",
    },
  ],
  es: [
    {
      t: "Una reunión necesita una hora y un propósito",
      s: [
        "Crea tú la invitación. No esperes a que Renata envíe una.",
        "Revisa los turnos del equipo antes de elegir la hora. La misma destreza de conflicto. El otro lado.",
        "Dos o tres puntos en Docs son la agenda. Adjúntala o la invitación es solo una hora.",
      ],
      tip: "Si partes de la agenda de la semana pasada, Archivo → Hacer una copia. No escribas encima del original compartido.",
    },
  ],
};


/**
 * A plain, accurate title for next week's huddle. "team meeting next week"
 * and a misspelled "schedul meeting" are real titles; "Quick chat" and
 * "asdf" say nothing about what the meeting is.
 */
export function titleIsAboutSchedule(title: string) {
  if (!looksLikeRealText(title, 1)) return false;
  return /\b(schedul\w*|sched|horario\w*|huddle|meeting|meet|reun\w*|junta|team|equipo|staff|crew|week|weekly|semana\w*|shift\w*|turno\w*|cover\w*|cobertura|saturday|sabado|plan\w*)\b/.test(
    normalizeReply(title),
  );
}

function agendaLines(text: string): string[] {
  return text
    .split(/\n+/)
    .map((l) => l.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);
}

export function agendaBulletCount(text: string) {
  return agendaLines(text).length;
}

/**
 * The things to talk about. Bullets count one each. A single honest line
 * that lists two things ("talk about schedule and saturday") counts as two,
 * so a learner is not failed for writing a sentence instead of bullets.
 */
export function agendaItemCount(text: string): number {
  const lines = agendaLines(text).filter((l) => looksLikeRealText(l, 1));
  if (lines.length !== 1) return lines.length;
  return lines[0].split(/,|;|\/|\+|&|\band\b|\by\b|\balso\b|\btambien\b/i).filter((part) => looksLikeRealText(part, 1)).length;
}

/** The agenda gives the meeting a point: two or more things to talk about, in real words. */
export function agendaIsReady(text: string): boolean {
  return agendaItemCount(text) >= 2 && looksLikeRealText(text, 2);
}

/** What the teacher sees: the meeting title and the agenda the learner wrote. */
export function describeSubmission(
  input: { title: string; agenda: string },
  lang: Lang,
): SubmissionContent {
  const c = TEAM_MEETING_COPY[lang];
  return {
    lang,
    fields: [
      { label: c.eventTitleLabel, value: input.title },
      { label: c.agendaName, value: input.agenda },
    ],
  };
}

/** The persistent "what to do right now" line, one per step of this job. */
export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Start the invite for next week's schedule huddle.",
    es: "Empieza la invitación para la reunión del horario.",
  },
  {
    en: "Pick a time when nobody is on shift.",
    es: "Elige una hora en la que nadie esté de turno.",
  },
  {
    en: "Write two or three bullets so the meeting has a point.",
    es: "Escribe dos o tres puntos para que la reunión tenga un propósito.",
  },
];

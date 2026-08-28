import type { EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "🗣️",
    kicker: "You call the huddle now.",
    headline: "The crew needs 15 minutes on next week's schedule.",
    body: "Create the invite. Pick a time nobody is on shift. Write two or three bullets so the meeting has a point.",
    cta: "Set it up",
  },
  es: {
    emoji: "🗣️",
    kicker: "Ahora tú llamas a la reunión.",
    headline: "El equipo necesita 15 minutos para el horario de la semana que viene.",
    body: "Crea la invitación. Elige una hora en la que nadie esté de turno. Escribe dos o tres puntos para que la reunión tenga un propósito.",
    cta: "Armarla",
  },
};

export const SLOTS = [
  { key: "wed", label: { en: "Wed 3:00 PM", es: "Mié 3:00 PM" }, ok: false, hint: { en: "Alex and Jordan close Wednesday. They cannot leave the floor.", es: "Alex y Jordan cierran el miércoles. No pueden salir del piso." } },
  { key: "thu", label: { en: "Thu 10:00 AM", es: "Jue 10:00 AM" }, ok: true, hint: { en: "", es: "" } },
  { key: "fri", label: { en: "Fri 8:00 AM", es: "Vie 8:00 AM" }, ok: false, hint: { en: "Friday 8 AM is the open. Half the crew is already on the floor.", es: "El viernes a las 8 AM es la apertura. La mitad del equipo ya está en el piso." } },
] as const;

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
    calBody: "One-line title. A time that is not a shift. The crew is already on the guest list.",
    calCta: "Open Calendar",
    docTitle: "Write a short agenda",
    docBody: "Two or three bullets. What the meeting is for — not formal minutes.",
    docCta: "Open Docs",
    sendCta: "Send the invite with the agenda",
    sendNeed: "Finish the invite and the agenda first.",
    eventTitleLabel: "Title",
    eventTitlePh: "Next week's schedule",
    whenLabel: "When",
    guestsLabel: "Guests",
    saveEvent: "Save",
    agendaName: "Huddle agenda — Aug 28",
    agendaPh: "Type two or three bullets…",
    startersLabel: "Sentence starters",
    sentKicker: "Invite sent",
    doneTitle: "You called the meeting. It has a point.",
    doneBody: "Thursday 10 AM. The crew is on the invite. The agenda is two or three bullets, not a speech. That is a huddle a lead can run.",
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
    calBody: "Un título de una línea. Una hora que no sea un turno. El equipo ya está en la lista.",
    calCta: "Abrir Calendar",
    docTitle: "Escribir una agenda corta",
    docBody: "Dos o tres puntos. Para qué es la reunión — no actas formales.",
    docCta: "Abrir Docs",
    sendCta: "Enviar la invitación con la agenda",
    sendNeed: "Primero termina la invitación y la agenda.",
    eventTitleLabel: "Título",
    eventTitlePh: "Horario de la semana que viene",
    whenLabel: "Cuándo",
    guestsLabel: "Invitados",
    saveEvent: "Guardar",
    agendaName: "Agenda de la reunión — 28 ago",
    agendaPh: "Escribe dos o tres puntos…",
    startersLabel: "Frases de ayuda",
    sentKicker: "Invitación enviada",
    doneTitle: "Tú llamaste a la reunión. Tiene un propósito.",
    doneBody: "Jueves 10 AM. El equipo está en la invitación. La agenda es de dos o tres puntos, no un discurso. Así se arma una reunión que un líder puede dirigir.",
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
    "- Una pregunta del piso",
  ],
};

export const HINTS: Record<Lang, { title: string; time: string; agenda: string }> = {
  en: {
    title: "Give it a one-line title. Say it is about the schedule.",
    time: "Pick a time that is not a shift.",
    agenda: "Write two or three short bullets. That is enough.",
  },
  es: {
    title: "Ponle un título de una línea. Di que es sobre el horario.",
    time: "Elige una hora que no sea un turno.",
    agenda: "Escribe dos o tres puntos cortos. Eso basta.",
  },
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "A meeting needs a time and a point",
      s: [
        "Create the invite yourself. Do not wait for Maria to send one.",
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
        "Crea tú la invitación. No esperes a que Maria envíe una.",
        "Revisa los turnos del equipo antes de elegir la hora. La misma destreza de conflicto. El otro lado.",
        "Dos o tres puntos en Docs son la agenda. Adjúntala o la invitación es solo una hora.",
      ],
      tip: "Si partes de la agenda de la semana pasada, Archivo → Hacer una copia. No escribas encima del original compartido.",
    },
  ],
};


export function titleIsAboutSchedule(title: string) {
  const t = title.toLowerCase();
  return /schedule|horario|huddle|reun|cover|cobertura/.test(t);
}

export function agendaBulletCount(text: string) {
  return text
    .split(/\n+/)
    .map((l) => l.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean).length;
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

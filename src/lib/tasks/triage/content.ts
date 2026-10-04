import type { EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";
import { SHIFT_BLOCKS, SHIFT_TIMES, STORY_DAY_BY_LEVEL, WEEKDAY_SHORT, cardDate, hourOnly, mondayOf, shiftBlockFor, shiftDash, shortDate } from "@/lib/story-dates";

/** Thursday of Covering More Ground's week: the learner closes (SHIFT_TIMES). */
const CLOSE_THURSDAY = mondayOf(STORY_DAY_BY_LEVEL.level8) + 3;
const CLOSE_BLOCK = shiftBlockFor(SHIFT_TIMES[CLOSE_THURSDAY]) ?? SHIFT_BLOCKS.close;
const CLOSE = shiftDash(CLOSE_BLOCK);
const CLOSE_ES = `${hourOnly(CLOSE_BLOCK.start)} a ${hourOnly(CLOSE_BLOCK.end)}`;
/** "allergen-list-sep-21": this week's list, named for the week's Monday. */
const ALLERGEN_FILE = `allergen-list-${shortDate(mondayOf(STORY_DAY_BY_LEVEL.level8), "en").toLowerCase().replace(" ", "-")}`;

export const TRIAGE_SLOTS = [
  { key: 'thu16', label: { en: 'Thu 4:00 PM', es: 'Jue 4:00 PM' }, available: false },
  { key: 'fri10', label: { en: 'Fri 10:00 AM', es: 'Vie 10:00 AM' }, available: true },
  { key: 'fri14', label: { en: 'Fri 2:00 PM', es: 'Vie 2:00 PM' }, available: false },
] as const;
export const TRIAGE_AVAILABILITY: Localized = {
  en: `Your shifts: Thursday ${CLOSE}; Friday off. Renata's calendar: Friday 9–11 AM available; 1–3 PM supplier meeting. The huddle needs 20 minutes.`,
  es: `Tus turnos: jueves ${CLOSE_ES}; viernes libre. Calendario de Renata: viernes de 9 a 11 AM disponible; de 1 a 3 PM reunión con proveedores. La reunión de inventario dura 20 minutos.`,
};
/** The new-time picker's words, and what the Job Card says when the time does not work. */
export const TRIAGE_SLOT_COPY: Record<"label" | "choose" | "notFree", Localized> = {
  label: { en: "New time", es: "Nueva hora" },
  choose: { en: "Choose a time", es: "Elige una hora" },
  notFree: {
    en: "Compare both calendars. The full 20 minutes must be free for both people.",
    es: "Compara ambos calendarios. Las dos personas deben tener los 20 minutos libres.",
  },
};
export function triageSlotWorks(key: string): boolean {
  return TRIAGE_SLOTS.some(slot => slot.key === key && slot.available);
}

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "🔔",
    kicker: "Tuesday, 9:04 AM",
    headline: "Two things are already waiting.",
    body: "A meeting lands on your close shift. Sam needs a file. Neither one can wait until tomorrow. You can do them in any order. Just do not forget one.",
    cta: "See what's open",
  },
  es: {
    emoji: "🔔",
    kicker: "Martes, 9:04 AM",
    headline: "Ya hay dos cosas esperando.",
    body: "Una reunión cae en tu turno de cierre. Sam necesita un archivo. Ninguna de las dos puede esperar a mañana. Puedes hacerlas en el orden que quieras. Solo no te olvides de ninguna.",
    cta: "Ver qué está abierto",
  },
};

export const TRIAGE_COPY: Record<Lang, {
  helpBtn: string;
  hubHeading: string;
  calTitle: string;
  calBody: string;
  calCta: string;
  fileTitle: string;
  fileBody: string;
  fileCta: string;
  meetingTitle: string;
  meetingWhen: string;
  meetingNote: string;
  accept: string;
  no: string;
  propose: string;
  fileName: string;
  fileWrong: string;
  shareWith: string;
  canView: string;
  canEdit: string;
  share: string;
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
    hubHeading: "Open items",
    calTitle: "Inventory huddle",
    calBody: "Thursday 4:00 PM. Renata and you are invited for 20 minutes.",
    calCta: "Open Calendar",
    fileTitle: "Sam needs the allergen list",
    fileBody: "Sam needs the current allergen list for reference; the master must stay unchanged.",
    fileCta: "Open Drive",
    meetingTitle: "Thursday inventory huddle",
    meetingWhen: `${cardDate(CLOSE_THURSDAY, "en")} · 4:00–4:20 PM`,
    meetingNote: `You close Thursday ${CLOSE}.`,
    accept: "Yes",
    no: "No",
    propose: "Propose a new time",
    fileName: ALLERGEN_FILE,
    fileWrong: "prep-list-old",
    shareWith: "Share with Sam Rivera",
    canView: "Viewer",
    canEdit: "Editor",
    share: "Share",
    sentKicker: "Both done",
    doneTitle: "You took care of both of them.",
    doneBody: "The huddle moved off your close shift. Sam has the allergen list, view only. Both tasks are done.",
    badgeName: "Handle two requests at once",
    badgeWhere: "Counts toward: Shift Lead",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
    askPerson: "Ask a person instead",
  },
  es: {
    helpBtn: "Ayúdame con este paso",
    hubHeading: "Pendientes",
    calTitle: "Reunión de inventario",
    calBody: "Jueves 4:00 PM. Renata y tú tienen una reunión de 20 minutos.",
    calCta: "Abrir Calendar",
    fileTitle: "Sam necesita la lista de alérgenos",
    fileBody: "Sam necesita consultar la lista actual de alérgenos; el original debe quedar sin cambios.",
    fileCta: "Abrir Drive",
    meetingTitle: "Reunión de inventario del jueves",
    meetingWhen: `${WEEKDAY_SHORT.es[4]} ${shortDate(CLOSE_THURSDAY, "es")} · 4:00–4:20 PM`,
    meetingNote: `El jueves cierras de ${CLOSE_ES}.`,
    accept: "Sí",
    no: "No",
    propose: "Proponer otra hora",
    fileName: ALLERGEN_FILE,
    fileWrong: "prep-list-old",
    shareWith: "Compartir con Sam Rivera",
    canView: "Lector",
    canEdit: "Editor",
    share: "Compartir",
    sentKicker: "Las dos listas",
    doneTitle: "Te encargaste de las dos.",
    doneBody: "La reunión salió de tu turno de cierre. Sam tiene la lista de alérgenos, solo ver. Las dos tareas están hechas.",
    badgeName: "Atender dos pedidos a la vez",
    badgeWhere: "Cuenta para: Shift Lead",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
    askPerson: "Mejor preguntar a una persona",
  },
};

export const HINTS: Record<Lang, { accept: string; no: string; file: string; edit: string }> = {
  en: {
    accept: "That time overlaps your shift. Compare both calendars for an available time.",
    no: "The team still needs a huddle. Compare both calendars and propose another time.",
    file: `That's last month's prep list. Open ${ALLERGEN_FILE}.`,
    edit: "View only. If Sam can edit, the master changes.",
  },
  es: {
    accept: "Esa hora coincide con tu turno. Compara ambos calendarios para encontrar una hora disponible.",
    no: "El equipo todavía necesita reunirse. Compara ambos calendarios y propón otra hora.",
    file: `Esa es la lista de prep del mes pasado. Abre ${ALLERGEN_FILE}.`,
    edit: "Solo ver. Si Sam puede editar, cambia el original.",
  },
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Look at both before you start one",
      s: [
        "There are two tasks waiting. Look at the whole list first so you do not lose track of one.",
        "The meeting is like the lead huddle: do not accept a time when you are working.",
        "The file is like Jordan's schedule: share the file itself, and set it to view only.",
      ],
      tip: "You choose the order. The only real mistake is forgetting one of them.",
    },
  ],
  es: [
    {
      t: "Mira las dos antes de empezar una",
      s: [
        "Hay dos tareas esperando. Mira toda la lista primero para no perder de vista ninguna.",
        "La reunión es como la reunión de líderes: no aceptes una hora en la que estás trabajando.",
        "El archivo es como el horario de Jordan: comparte el archivo en sí y ponlo en modo solo ver.",
      ],
      tip: "Tú eliges el orden. El único error de verdad es olvidarte de una.",
    },
  ],
};

/** The persistent "what to do right now" line, one per step of this job. */
export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  { en: "Complete both requests. Choose either one to start.", es: "Completa las dos solicitudes. Empieza por la que prefieras." },
  { en: "Compare the meeting time with your closing shift. Respond to the invitation.", es: "Compara la hora de la reunión con tu turno de cierre. Responde a la invitación." },
  {
    en: "Share the current allergen list with Sam for reference.",
    es: "Comparte la lista actual de alérgenos con Sam para que pueda consultarla.",
  },
];

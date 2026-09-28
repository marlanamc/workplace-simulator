import type { EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";
import { SHIFT_BLOCKS, SHIFT_TIMES, STORY_DAY_BY_LEVEL, WEEKDAY_SHORT, cardDate, hourOnly, mondayOf, shiftBlockFor, shiftDash, shortDate } from "@/lib/story-dates";

/** Thursday of Covering More Ground's week: the learner closes (SHIFT_TIMES). */
const CLOSE_THURSDAY = mondayOf(STORY_DAY_BY_LEVEL.level8) + 3;
const CLOSE_BLOCK = shiftBlockFor(SHIFT_TIMES[CLOSE_THURSDAY]) ?? SHIFT_BLOCKS.close;
const CLOSE = shiftDash(CLOSE_BLOCK);
const CLOSE_ES = `${hourOnly(CLOSE_BLOCK.start)} a ${hourOnly(CLOSE_BLOCK.end)}`;
/** "allergen-list-sep-21": this week's list, named for the week's Monday. */
const ALLERGEN_FILE = `allergen-list-${shortDate(mondayOf(STORY_DAY_BY_LEVEL.level8), "en").toLowerCase().replace(" ", "-")}`;

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
  slotLabel: string;
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
    calBody: "Thursday 4:00 PM. That is your close. Propose a time that is not a shift.",
    calCta: "Open Calendar",
    fileTitle: "Sam needs the allergen list",
    fileBody: "Find the file in Drive. Share it view only. Sam should not edit the master.",
    fileCta: "Open Drive",
    meetingTitle: "Thursday inventory huddle",
    meetingWhen: `${cardDate(CLOSE_THURSDAY, "en")} · 4:00–4:20 PM`,
    meetingNote: `You close Thursday ${CLOSE}. You cannot sit in a huddle at 4.`,
    accept: "Yes",
    no: "No",
    propose: "Propose a new time",
    slotLabel: "Fri 10:00 AM",
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
    calBody: "Jueves 4:00 PM. Ese es tu cierre. Propón una hora que no sea un turno.",
    calCta: "Abrir Calendar",
    fileTitle: "Sam necesita la lista de alérgenos",
    fileBody: "Encuentra el archivo en Drive. Compártelo en modo solo ver. Sam no debe editar el original.",
    fileCta: "Abrir Drive",
    meetingTitle: "Reunión de inventario del jueves",
    meetingWhen: `${WEEKDAY_SHORT.es[4]} ${shortDate(CLOSE_THURSDAY, "es")} · 4:00–4:20 PM`,
    meetingNote: `El jueves cierras de ${CLOSE_ES}. No puedes estar en una reunión a las 4.`,
    accept: "Sí",
    no: "No",
    propose: "Proponer otra hora",
    slotLabel: "Vie 10:00 AM",
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
    badgeWhere: "Cuenta para: Líder de turno",
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
    accept: "That time is your close. Propose Friday 10 AM instead.",
    no: "Don't just say no. They still need a huddle. Propose Friday 10 AM.",
    file: `That's last month's prep list. Open ${ALLERGEN_FILE}.`,
    edit: "View only. If Sam can edit, the master changes.",
  },
  es: {
    accept: "Esa hora es tu cierre. Propón el viernes a las 10 AM.",
    no: "No solo digas que no. Igual necesitan la reunión. Propón el viernes a las 10 AM.",
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
  {
    en: "Two things are waiting. Pick one to start. You can do them in any order.",
    es: "Hay dos cosas esperando. Elige una para empezar; puedes hacerlas en el orden que quieras.",
  },
  {
    en: "Handle the meeting sitting on your close shift.",
    es: "Resuelve la reunión que cae en tu turno de cierre.",
  },
  {
    en: "Now send Sam the file. Do not forget this one.",
    es: "Ahora envíale el archivo a Sam. No te olvides de este.",
  },
];

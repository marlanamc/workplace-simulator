import type { EventIntroCopy, Lang, Lesson } from "@/lib/task-types";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "🔔",
    kicker: "Tuesday, 9:04 AM",
    headline: "Two things are already waiting.",
    body: "A meeting sits on your close shift. Sam needs a file. Neither one can wait until tomorrow. Order does not matter. Dropping one does.",
    cta: "See what's open",
  },
  es: {
    emoji: "🔔",
    kicker: "Martes, 9:04 AM",
    headline: "Ya hay dos cosas esperando.",
    body: "Una reunión cae en tu turno de cierre. Sam necesita un archivo. Ninguna puede esperar a mañana. El orden no importa. Soltar una, sí.",
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
    meetingWhen: "Thu, Aug 27 · 4:00–4:20 PM",
    meetingNote: "You close Thursday 2–10. You cannot sit in a huddle at 4.",
    accept: "Yes",
    no: "No",
    propose: "Propose a new time",
    slotLabel: "Fri 10:00 AM",
    fileName: "allergen-list-aug-24",
    fileWrong: "prep-list-old",
    shareWith: "Share with Sam Rivera",
    canView: "Viewer",
    canEdit: "Editor",
    share: "Share",
    sentKicker: "Both handled",
    doneTitle: "You did not drop either one.",
    doneBody: "The huddle moved off your close. Sam has the allergen list, view only. Two open things. Both closed.",
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
    fileBody: "Encuentra el archivo en Drive. Compártelo solo para ver. Sam no debe editar el original.",
    fileCta: "Abrir Drive",
    meetingTitle: "Reunión de inventario del jueves",
    meetingWhen: "Jue 27 ago · 4:00–4:20 PM",
    meetingNote: "El jueves cierras de 2 a 10. No puedes estar en una reunión a las 4.",
    accept: "Sí",
    no: "No",
    propose: "Proponer otra hora",
    slotLabel: "Vie 10:00 AM",
    fileName: "allergen-list-aug-24",
    fileWrong: "prep-list-old",
    shareWith: "Compartir con Sam Rivera",
    canView: "Lector",
    canEdit: "Editor",
    share: "Compartir",
    sentKicker: "Las dos hechas",
    doneTitle: "No soltaste ninguna.",
    doneBody: "La reunión salió de tu cierre. Sam tiene la lista de alérgenos, solo ver. Dos cosas abiertas. Las dos cerradas.",
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
    file: "That's last month's prep list. Open allergen-list-aug-24.",
    edit: "View only. If Sam can edit, the master changes.",
  },
  es: {
    accept: "Esa hora es tu cierre. Propón el viernes a las 10 AM.",
    no: "No solo digas que no. Igual necesitan la reunión. Propón el viernes a las 10 AM.",
    file: "Esa es la lista de prep del mes pasado. Abre allergen-list-aug-24.",
    edit: "Solo ver. Si Sam puede editar, cambia el original.",
  },
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Notice both before you start either",
      s: [
        "Two badges. Two jobs. Look at the list first so one does not vanish.",
        "The calendar one is the same skill as the lead huddle: do not accept a time you work.",
        "The file one is the same skill as Jordan's schedule: share the file, view only.",
      ],
      tip: "Order is yours. Forgetting one is the fail.",
    },
  ],
  es: [
    {
      t: "Mira las dos antes de empezar una",
      s: [
        "Dos puntos. Dos trabajos. Mira la lista primero para que una no desaparezca.",
        "La del calendario es la misma destreza de la reunión de líderes: no aceptes una hora en la que trabajas.",
        "La del archivo es la misma destreza del horario de Jordan: comparte el archivo, solo ver.",
      ],
      tip: "El orden es tuyo. Olvidar una es el error.",
    },
  ],
};


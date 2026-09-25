import type { EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "📁",
    kicker: "Monday morning",
    headline: "Jordan starts today and needs this week's schedule.",
    body: "Renata asked you to find the file, rename it so people can find it later, and share it with Jordan. View only. Jordan should not be able to change it.",
    cta: "Open Drive",
  },
  es: {
    emoji: "📁",
    kicker: "Lunes por la mañana",
    headline: "Jordan empieza hoy y necesita el horario de esta semana.",
    body: "Renata te pidió encontrar el archivo, cambiarle el nombre para que se pueda encontrar después, y compartirlo con Jordan. Solo ver. Jordan no debe poder cambiarlo.",
    cta: "Abrir Drive",
  },
};

export interface DriveFile {
  key: string;
  name: string;
  folder: string;
  date: string;
  isTarget: boolean;
  wrongHint?: Localized;
}

const wrongHint = (en: string, es: string): Localized => ({ en, es });

export const FILES: DriveFile[] = [
  {
    key: "sched-aug17",
    name: "sched_81724.pdf",
    folder: "Schedules",
    date: "Aug 17",
    isTarget: false,
    wrongHint: wrongHint(
      "That's last week's schedule. Look for the one from this week (Aug 24).",
      "Ese es el horario de la semana pasada. Busca el de esta semana (24 de agosto)."
    ),
  },
  {
    key: "sched-aug24",
    name: "sched_82426.pdf",
    folder: "Schedules",
    date: "Aug 24",
    isTarget: true,
  },
  {
    key: "vacation-form",
    name: "vacation_request_form.pdf",
    folder: "Forms",
    date: "Jun 2",
    isTarget: false,
    wrongHint: wrongHint(
      "That's a vacation request form, not the schedule.",
      "Ese es un formulario de solicitud de vacaciones, no el horario."
    ),
  },
  {
    key: "memo-july",
    name: "memo_july.pdf",
    folder: "Manager Memos",
    date: "Jul 3",
    isTarget: false,
    wrongHint: wrongHint(
      "That's an old manager memo, not the schedule.",
      "Ese es un memo viejo del gerente, no el horario."
    ),
  },
];

/**
 * "Messy mode" variant (Level.messy) - the same task, more real-world
 * friction: three more plausible-looking near-duplicates of the actual
 * target, so reading the date carefully is the only way through, not a
 * highlight. Selected by `FilesTask.tsx` when its current level is `messy`.
 */
export const MESSY_FILES: DriveFile[] = [
  ...FILES,
  {
    key: "sched-aug24-draft",
    name: "sched_82426_draft.pdf",
    folder: "Schedules",
    date: "Aug 21",
    isTarget: false,
    wrongHint: wrongHint(
      "That's an earlier draft - it says so right in the name. Look for the one without \"draft.\"",
      "Ese es un borrador anterior - lo dice en el nombre. Busca el que no diga \"draft.\""
    ),
  },
  {
    key: "sched-aug24-copy",
    name: "sched_82426_copy.pdf",
    folder: "Schedules",
    date: "Aug 24",
    isTarget: false,
    wrongHint: wrongHint(
      "Same date, but it's a copy someone made - not the original. Open the one without \"copy\" in the name.",
      "Misma fecha, pero es una copia que alguien hizo, no el original. Abre el que no diga \"copy\" en el nombre."
    ),
  },
  {
    key: "sched-sept",
    name: "sched_090107.pdf",
    folder: "Schedules",
    date: "Sep 1",
    isTarget: false,
    wrongHint: wrongHint(
      "That's next week's schedule. Jordan starts today, on this week's.",
      "Ese es el horario de la próxima semana. Jordan empieza hoy, con el de esta semana."
    ),
  },
];

export const RENAME_TARGET = "schedule-week-of-aug-24";

/**
 * How FilesTask forgives a rename: case, spaces or underscores instead of
 * dashes, doubled or spaced dashes, "August" or "aug24", a kept ".pdf", and a
 * stray period all normalize away before comparing to RENAME_TARGET. The
 * skill is finding and renaming the file, not dash placement.
 */
export function normalizeRename(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\.pdf$/, "")
    .replace(/\.+$/, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/august/g, "aug")
    .replace(/aug\.?-?(\d)/g, "aug-$1")
    .replace(/^-|-$/g, "");
}

/** The single in-window instruction voice (RightNowBar), one step at a time. */
export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Click Cafe Shared Drive. The schedules are there.",
    es: "Haz clic en Unidad compartida del café. Ahí están los horarios.",
  },
  {
    en: "Find this week's schedule. Its date is Aug 24. Click it.",
    es: "Busca el horario de esta semana. Su fecha es Aug 24. Haz clic en él.",
  },
  {
    en: "Type the new name: schedule-week-of-aug-24. Then click Continue.",
    es: "Escribe el nombre nuevo: schedule-week-of-aug-24. Después haz clic en Continuar.",
  },
  {
    en: "Choose Can view. Then click Share.",
    es: "Elige Puede ver. Después haz clic en Compartir.",
  },
];

export const FILES_COPY: Record<Lang, {
  heading: string;
  newBtn: string;
  navHome: string;
  navMyDrive: string;
  navShared: string;
  foldersHeading: string;
  sharedHeading: string;
  sharedFolderName: string;
  sharedFrom: string;
  helpBtn: string;
  langBtn: string;
  scenarioKicker: string;
  scenario: string;
  searchPlaceholder: string;
  allFolders: string;
  renameLabel: string;
  renameHint: string;
  renamePlaceholder: string;
  renameContinue: string;
  shareWith: string;
  addPeople: string;
  canEdit: string;
  canView: string;
  canComment: string;
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
    heading: "Drive",
    newBtn: "New",
    navHome: "Home",
    navMyDrive: "My Drive",
    navShared: "Shared with me",
    foldersHeading: "Folders",
    sharedHeading: "Shared with me",
    sharedFolderName: "Cafe Shared Drive",
    sharedFrom: "Shared by Renata Silva",
    helpBtn: "Help me with this step",
    langBtn: "Español",
    scenarioKicker: "Today's situation",
    scenario: "Renata asked you to share this week's schedule with Jordan Kim, a new hire. Give view only. Jordan does not need to edit it. She also asked you to rename it like this: schedule-week-of-[date].",
    searchPlaceholder: "Search files…",
    allFolders: "All folders",
    renameLabel: "Rename this file",
    renameHint: "New name: schedule-week-of-aug-24",
    renamePlaceholder: "Type the new file name…",
    renameContinue: "Continue",
    shareWith: "Share with",
    addPeople: "Add people",
    canEdit: "Can edit",
    canView: "Can view",
    canComment: "Can comment",
    share: "Share",
    sentKicker: "Shared",
    doneTitle: "You shared the right file with the right access.",
    doneBody: "Jordan can see this week's schedule, and can't accidentally change it. Renaming it first means whoever looks for it next week can find it just as easily.",
    badgeName: "Share a file with the right access",
    badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
    askPerson: "Ask a person instead",
  },
  es: {
    heading: "Unidad compartida",
    newBtn: "Nuevo",
    navHome: "Inicio",
    navMyDrive: "Mi unidad",
    navShared: "Compartido conmigo",
    foldersHeading: "Carpetas",
    sharedHeading: "Compartido conmigo",
    sharedFolderName: "Unidad compartida del café",
    sharedFrom: "Compartido por Renata Silva",
    helpBtn: "Ayúdame con este paso",
    langBtn: "English",
    scenarioKicker: "La situación de hoy",
    scenario: "Renata te pidió compartir el horario de esta semana con Jordan Kim, un nuevo empleado. Solo para ver. Jordan no necesita editarlo. También te pidió renombrarlo así: schedule-week-of-[fecha].",
    searchPlaceholder: "Buscar archivos…",
    allFolders: "Todas las carpetas",
    renameLabel: "Cambia el nombre de este archivo",
    renameHint: "Nombre nuevo: schedule-week-of-aug-24",
    renamePlaceholder: "Escribe el nuevo nombre…",
    renameContinue: "Continuar",
    shareWith: "Compartir con",
    addPeople: "Agregar personas",
    canEdit: "Puede editar",
    canView: "Puede ver",
    canComment: "Puede comentar",
    share: "Compartir",
    sentKicker: "Compartido",
    doneTitle: "Compartiste el archivo correcto con el acceso correcto.",
    doneBody: "Jordan puede ver el horario de esta semana, y no puede cambiarlo por accidente. Renombrarlo primero significa que quien lo busque la próxima semana lo encontrará igual de fácil.",
    badgeName: "Compartir un archivo con el acceso correcto",
    badgeWhere: "Cuenta para: Oficina · Servicio de alimentos",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
    askPerson: "Mejor preguntar a una persona",
  },
};

export const WRONG_RENAME_HINT: Record<Lang, string> = {
  en: "Check the name. Type these words with a dash - between them: schedule-week-of-aug-24",
  es: "Revisa el nombre. Escribe estas palabras con un guion - entre ellas: schedule-week-of-aug-24",
};

export const COMMENT_HINT: Record<Lang, string> = {
  en: "Jordan only needs to look at the schedule. Choose Can view.",
  es: "Jordan solo necesita mirar el horario. Elige Puede ver.",
};

export const WRONG_EDIT_HINT: Record<Lang, string> = {
  en: "Jordan only needs to look at this, not change it. Choose \"Can view\" instead.",
  es: "Jordan solo necesita verlo, no cambiarlo. Elige \"Puede ver\" en su lugar.",
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Finding the right file",
      s: [
        "Open the folder. You can also type part of a name in Search.",
        "Look at the Date column. The date tells you which week a schedule is for.",
        "Some files look almost the same. Read the date before you click.",
      ],
      tip: "If two names look the same, the date is the fastest way to tell them apart.",
    },
    {
      t: "View access vs. edit access",
      s: [
        "\"Can view\" means the person can look at the file, but not change it.",
        "\"Can edit\" means they can change the file. Give it only when they need to change it.",
        "If you are not sure, choose \"Can view\".",
      ],
      tip: "It is easy to give \"Can edit\" by mistake. Look again before you click Share.",
    },
    {
      t: "Renaming a file",
      s: [
        "The old name is already in the box, and it is selected. Just start typing to replace it.",
        "Type the new name exactly: schedule-week-of-aug-24",
        "The dash - is next to the 0 key. Then click Continue.",
      ],
      tip: "A clear name helps the next person find the file.",
    },
  ],
  es: [
    {
      t: "Encontrar el archivo correcto",
      s: [
        "Abre la carpeta. También puedes escribir parte de un nombre en Buscar.",
        "Mira la columna Fecha. La fecha te dice de qué semana es un horario.",
        "Algunos archivos se ven casi iguales. Lee la fecha antes de hacer clic.",
      ],
      tip: "Si dos nombres se ven iguales, la fecha es la forma más rápida de distinguirlos.",
    },
    {
      t: "Acceso de ver vs. editar",
      s: [
        "\"Puede ver\" quiere decir que la persona puede mirar el archivo, pero no cambiarlo.",
        "\"Puede editar\" quiere decir que puede cambiar el archivo. Dalo solo si necesita cambiarlo.",
        "Si no estás seguro, elige \"Puede ver\".",
      ],
      tip: "Es fácil dar \"Puede editar\" por error. Revisa otra vez antes de hacer clic en Compartir.",
    },
    {
      t: "Cambiar el nombre de un archivo",
      s: [
        "El nombre viejo ya está en la casilla, y está seleccionado. Empieza a escribir para reemplazarlo.",
        "Escribe el nombre nuevo tal cual: schedule-week-of-aug-24",
        "El guion - está al lado de la tecla 0. Después haz clic en Continuar.",
      ],
      tip: "Un nombre claro ayuda a la próxima persona a encontrar el archivo.",
    },
  ],
};


import type { EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "📁",
    kicker: "Monday morning",
    headline: "Jordan starts today and needs this week's schedule.",
    body: "Maria asked you to find the file, rename it so people can find it later, and share it with Jordan. View only. Jordan should not be able to change it.",
    cta: "Open Drive",
  },
  es: {
    emoji: "📁",
    kicker: "Lunes por la mañana",
    headline: "Jordan empieza hoy y necesita el horario de esta semana.",
    body: "Maria te pidió encontrar el archivo, cambiarle el nombre para que se pueda encontrar después, y compartirlo con Jordan. Solo ver. Jordan no debe poder cambiarlo.",
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
 * How FilesTask forgives a rename: case, extra spaces, space-vs-hyphen, and
 * a kept ".pdf" all normalize away before comparing to RENAME_TARGET.
 */
export function normalizeRename(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-").replace(/\.pdf$/, "");
}

/** The single in-window instruction voice (RightNowBar), one step at a time. */
export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Find this week's schedule (Aug 24). Click it.",
    es: "Busca el horario de esta semana (24 de agosto). Haz clic en él.",
  },
  {
    en: "Type the new name: schedule-week-of-aug-24",
    es: "Escribe el nombre nuevo: schedule-week-of-aug-24",
  },
  {
    en: "Choose \"Can view\", then click Share.",
    es: "Elige \"Puede ver\" y luego haz clic en Compartir.",
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
    sharedFrom: "Shared by Maria Delgado",
    helpBtn: "Help me with this step",
    langBtn: "Español",
    scenarioKicker: "Today's situation",
    scenario: "Maria asked you to share this week's schedule with Jordan Kim, a new hire. Give view only. Jordan does not need to edit it. She also asked you to rename it like this: schedule-week-of-[date].",
    searchPlaceholder: "Search files…",
    allFolders: "All folders",
    renameLabel: "Rename this file to match the naming rule",
    renameHint: "Format: schedule-week-of-aug-24",
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
    sharedFrom: "Compartido por Maria Delgado",
    helpBtn: "Ayúdame con este paso",
    langBtn: "English",
    scenarioKicker: "La situación de hoy",
    scenario: "Maria te pidió compartir el horario de esta semana con Jordan Kim, un nuevo empleado. Solo para ver. Jordan no necesita editarlo. También te pidió renombrarlo así: schedule-week-of-[fecha].",
    searchPlaceholder: "Buscar archivos…",
    allFolders: "Todas las carpetas",
    renameLabel: "Renombra este archivo según la convención",
    renameHint: "Formato: schedule-week-of-aug-24",
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
  en: "Not quite the right name. Try: schedule-week-of-aug-24",
  es: "No es el formato correcto. Intenta: schedule-week-of-aug-24",
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
        "Use the folder tabs to narrow things down, or search by name.",
        "Match the file to the task. The date matters as much as the name.",
        "A similar-looking file from a different week or a different topic is a common mix-up.",
      ],
      tip: "When in doubt, the date column is the fastest way to tell files apart.",
    },
    {
      t: "View access vs. edit access",
      s: [
        "\"Can view\" means the person can look, but not change anything.",
        "\"Can edit\" means they can change the file. Only give this when someone really needs it.",
        "When you're not sure which one to give, view is almost always the safer default.",
      ],
      tip: "Giving edit access by accident is an easy real-world mistake. Always check twice.",
    },
  ],
  es: [
    {
      t: "Encontrar el archivo correcto",
      s: [
        "Usa las pestañas de carpetas para reducir opciones, o busca por nombre.",
        "Relaciona el archivo con la situación. La fecha importa tanto como el nombre.",
        "Un archivo parecido de otra semana o de otro tema es un error común.",
      ],
      tip: "Si tienes duda, la columna de fecha es la forma más rápida de distinguir archivos.",
    },
    {
      t: "Acceso de ver vs. editar",
      s: [
        "\"Puede ver\" significa que la persona puede mirar, pero no cambiar nada.",
        "\"Puede editar\" significa que puede cambiar el archivo. Dalo solo cuando alguien realmente lo necesite.",
        "Cuando no estés seguro, \"puede ver\" casi siempre es la opción más segura.",
      ],
      tip: "Dar acceso de edición por accidente es uno de los errores reales más fáciles de cometer. Siempre revisa dos veces.",
    },
  ],
};


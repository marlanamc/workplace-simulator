import type { EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";
import type { PdfDocument } from "@/lib/pdf-content";
import { CREW, DAYS, DAY_LABELS } from "@/lib/tasks/crew-week";

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
      "That page says Week of Aug 17. That is last week. Close it and open this week's schedule (Aug 24).",
      "Esa página dice Week of Aug 17. Es la semana pasada. Ciérrala y abre el horario de esta semana (24 de agosto)."
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
      "That page is a vacation request form, not the schedule. Close it and open a schedule.",
      "Esa página es un formulario para pedir vacaciones, no el horario. Ciérrala y abre un horario."
    ),
  },
  {
    key: "memo-july",
    name: "memo_july.pdf",
    folder: "Manager Memos",
    date: "Jul 3",
    isTarget: false,
    wrongHint: wrongHint(
      "That page is an old memo about summer hours, not the schedule. Close it and open a schedule.",
      "Esa página es un memo viejo sobre el horario de verano, no el horario de turnos. Ciérrala y abre un horario."
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
      "That page says DRAFT, and Friday is not filled in. Close it and open the one without draft in the name.",
      "Esa página dice DRAFT (borrador) y el viernes está vacío. Ciérrala y abre el que no dice draft en el nombre."
    ),
  },
  {
    key: "sched-aug24-copy",
    name: "sched_82426_copy.pdf",
    folder: "Schedules",
    date: "Aug 24",
    isTarget: false,
    wrongHint: wrongHint(
      "Same week, but this is a copy someone made. Rename the original, the one without copy in the name.",
      "Es la misma semana, pero es una copia que alguien hizo. Cámbiale el nombre al original, el que no dice copy."
    ),
  },
  {
    key: "sched-sept",
    name: "sched_090107.pdf",
    folder: "Schedules",
    date: "Sep 1",
    isTarget: false,
    wrongHint: wrongHint(
      "That page says Week of Aug 31. That is next week. Jordan starts today, so close it and open this week's.",
      "Esa página dice Week of Aug 31. Es la próxima semana. Jordan empieza hoy, así que ciérrala y abre el de esta semana."
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
    en: "Click a schedule to open it. Find the week of Aug 24.",
    es: "Haz clic en un horario para abrirlo. Busca la semana del 24 de agosto.",
  },
  // Advances when the right file is open, not when any file is.
  {
    en: "The top says Week of Aug 24. This is the one. Click Rename.",
    es: "Arriba dice Week of Aug 24 (semana del 24 de agosto). Es este. Haz clic en Cambiar nombre.",
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

/** While a file that is not the job is open: what to look at, and the way back. */
export const CHECK_OTHER_WEEK: Localized = {
  en: "Read the week at the top. If it is not Aug 24, click Close and open another file.",
  es: "Lee la semana arriba. Si no es Aug 24 (24 de agosto), haz clic en Cerrar y abre otro archivo.",
};

export const PREVIEW_COPY: Record<Lang, { rename: string; close: string; owner: string }> = {
  en: { rename: "Rename", close: "Close", owner: "Owner: Renata Silva" },
  es: { rename: "Cambiar nombre", close: "Cerrar", owner: "Propietaria: Renata Silva" },
};

// --- The pages behind the file names --------------------------------------
// Every file opens to a real page, so the learner tells them apart by
// reading it, the way they would at work. Schedules are in English, like a
// schedule posted at a US workplace; the Job Card says what to look for.

const WEEK_DAYS = [...DAYS.map((d) => DAY_LABELS.en[d]), "Sun"];
const crewRows = (shift: (member: (typeof CREW)[number], day: (typeof DAYS)[number]) => string) =>
  CREW.map((m) => ({ name: m.name, shifts: [...DAYS.map((d) => shift(m, d)), "Closed"] }));

function schedule(id: string, name: string, date: string, week: string, rows: { name: string; shifts: string[] }[], notes: string[]): PdfDocument {
  return {
    kind: "schedule",
    id,
    name,
    size: "84 KB",
    date,
    title: "Crew Schedule",
    week,
    days: WEEK_DAYS,
    rows,
    notes,
    postedBy: `Posted by Renata Silva, Shift Supervisor · ${date}`,
  };
}

const THIS_WEEK_ROWS = crewRows((m, d) => m.shifts[d].label);
const SWAP_NOTE = "Need to swap? Ask Renata at least 48 hours before the shift.";

/** The page each Drive file opens to, keyed by `DriveFile.key`. */
export const FILE_PAGES: Record<string, { doc: PdfDocument; stamp?: string }> = {
  "sched-aug24": {
    doc: schedule("sched-aug24", "sched_82426.pdf", "Aug 21", "Week of Aug 24 – 30, 2026", THIS_WEEK_ROWS, [
      "The cafe is closed on Sunday.",
      "Saturday 4–10 PM is not filled yet.",
      SWAP_NOTE,
    ]),
  },
  "sched-aug24-copy": {
    doc: schedule("sched-aug24-copy", "sched_82426_copy.pdf", "Aug 21", "Week of Aug 24 – 30, 2026", THIS_WEEK_ROWS, [
      "The cafe is closed on Sunday.",
      "Saturday 4–10 PM is not filled yet.",
      SWAP_NOTE,
    ]),
  },
  "sched-aug24-draft": {
    stamp: "DRAFT",
    doc: schedule(
      "sched-aug24-draft",
      "sched_82426_draft.pdf",
      "Aug 19",
      "Week of Aug 24 – 30, 2026",
      crewRows((m, d) => (d === "fri" ? "TBD" : m.shifts[d].label)),
      ["Friday shifts: to be decided."],
    ),
  },
  "sched-aug17": {
    doc: schedule(
      "sched-aug17",
      "sched_81724.pdf",
      "Aug 14",
      "Week of Aug 17 – 23, 2026",
      // Last week: the same crew on different days.
      crewRows((m, d) => m.shifts[DAYS[(DAYS.indexOf(d) + 2) % DAYS.length]].label || (d === "sat" ? "8–4" : "")),
      ["The cafe is closed on Sunday.", SWAP_NOTE],
    ),
  },
  "sched-sept": {
    doc: schedule(
      "sched-sept",
      "sched_090107.pdf",
      "Aug 28",
      "Week of Aug 31 – Sep 6, 2026",
      crewRows((m, d) => m.shifts[DAYS[(DAYS.indexOf(d) + 1) % DAYS.length]].label),
      ["Monday, Sep 7 is Labor Day. The cafe opens at 10 AM.", SWAP_NOTE],
    ),
  },
  "vacation-form": {
    doc: {
      kind: "report",
      id: "vacation-form",
      name: "vacation_request_form.pdf",
      size: "41 KB",
      date: "Jun 2, 2026",
      title: "Vacation Request Form",
      meta: [
        { label: "Employee", value: "________________" },
        { label: "Today's date", value: "________________" },
      ],
      sectionHeading: "Dates you are asking for",
      items: ["First day off: ________", "Last day off: ________", "Manager approval: ________________"],
      signedBy: "Turn this in at least 2 weeks before your first day off.",
    },
  },
  "memo-july": {
    doc: {
      kind: "report",
      id: "memo-july",
      name: "memo_july.pdf",
      size: "37 KB",
      date: "Jul 3, 2026",
      title: "Memo: Summer Hours",
      meta: [
        { label: "To", value: "All staff" },
        { label: "Date", value: "July 3, 2026" },
      ],
      sectionHeading: "What is changing",
      items: [
        "From July 6 to August 14, the cafe opens at 6:30 AM.",
        "The patio closes at 8 PM.",
        "Iced drinks count toward the monthly sales contest.",
      ],
      signedBy: "Maria Delgado, Cafe Manager",
    },
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
        "Click a file to open it. Opening a file does not change it.",
        "Read the top of the page. A schedule says which week it is for, like Week of Aug 24.",
      ],
      tip: "File names can be hard to read. The page itself tells you what the file is.",
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
        "Haz clic en un archivo para abrirlo. Abrir un archivo no lo cambia.",
        "Lee la parte de arriba de la página. Un horario dice de qué semana es, por ejemplo Week of Aug 24 (semana del 24 de agosto).",
      ],
      tip: "Los nombres de archivo pueden ser difíciles de leer. La página misma te dice qué es el archivo.",
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


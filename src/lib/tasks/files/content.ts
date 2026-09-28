import type { EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";
import type { PdfDocument } from "@/lib/pdf-content";
import { CREW, DAYS, DAY_LABELS } from "@/lib/tasks/crew-week";
import { STORY_DAY_BY_LEVEL, mondayOf, monthDate, shortDate, storyDate, weekRange } from "@/lib/story-dates";

/**
 * The week Jordan starts: the Monday of the Shared Files sitting. Every date
 * in this task (file names, "Week of", the rename target) comes from it.
 */
export const FILES_WEEK = mondayOf(STORY_DAY_BY_LEVEL.level5);
const LAST_WEEK = FILES_WEEK - 7;
export const NEXT_WEEK = FILES_WEEK + 7;

/** "sched_91426.pdf": the cafe's month/day/year code for a week's schedule. */
export function schedName(monday: number, suffix = ""): string {
  const d = storyDate(monday);
  return `sched_${d.getMonth() + 1}${String(d.getDate()).padStart(2, "0")}26${suffix}.pdf`;
}

/** "Sep 14" / "14 de septiembre". */
const WEEK = { en: shortDate(FILES_WEEK, "en"), es: monthDate(FILES_WEEK, "es") };
const LAST = shortDate(LAST_WEEK, "en");
const NEXT = shortDate(NEXT_WEEK, "en");
/** Posted the Friday before the week, like the real schedule. */
const POSTED = shortDate(FILES_WEEK - 3, "en");

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
    name: schedName(LAST_WEEK),
    folder: "Schedules",
    date: shortDate(LAST_WEEK - 3, "en"),
    isTarget: false,
    wrongHint: wrongHint(
      `That page says Week of ${LAST}. That is last week. Close it and open this week's schedule (${WEEK.en}).`,
      `Esa página dice Week of ${LAST}. Es la semana pasada. Ciérrala y abre el horario de esta semana (${WEEK.es}).`
    ),
  },
  {
    key: "sched-aug24",
    name: schedName(FILES_WEEK),
    folder: "Schedules",
    date: POSTED,
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
    name: schedName(FILES_WEEK, "_draft"),
    folder: "Schedules",
    date: shortDate(FILES_WEEK - 5, "en"),
    isTarget: false,
    wrongHint: wrongHint(
      "That page says DRAFT, and Friday is not filled in. Close it and open the one without draft in the name.",
      "Esa página dice DRAFT (borrador) y el viernes está vacío. Ciérrala y abre el que no dice draft en el nombre."
    ),
  },
  {
    key: "sched-aug24-copy",
    name: schedName(FILES_WEEK, "_copy"),
    folder: "Schedules",
    date: shortDate(FILES_WEEK, "en"),
    isTarget: false,
    wrongHint: wrongHint(
      "Same week, but this is a copy someone made. Rename the original, the one without copy in the name.",
      "Es la misma semana, pero es una copia que alguien hizo. Cámbiale el nombre al original, el que no dice copy."
    ),
  },
  {
    key: "sched-sept",
    name: schedName(NEXT_WEEK),
    folder: "Schedules",
    // Uploaded this morning, in the Day 10 upload-schedule task.
    date: shortDate(FILES_WEEK, "en"),
    isTarget: false,
    wrongHint: wrongHint(
      `That page says Week of ${NEXT}. That is next week. Jordan starts today, so close it and open this week's.`,
      `Esa página dice Week of ${NEXT}. Es la próxima semana. Jordan empieza hoy, así que ciérrala y abre el de esta semana.`
    ),
  },
];

/** "schedule-week-of-sep-14". */
export const RENAME_TARGET = `schedule-week-of-${WEEK.en.toLowerCase().replace(" ", "-")}`;

/**
 * How FilesTask forgives a rename: case, spaces or underscores instead of
 * dashes, doubled or spaced dashes, "September" or "sep14", a kept ".pdf", and a
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
    .replace(/sept(ember)?/g, "sep")
    .replace(/sep\.?-?(\d)/g, "sep-$1")
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
    en: `Click a schedule to open it. Find the week of ${WEEK.en}. Not a draft, not a copy.`,
    es: `Haz clic en un horario para abrirlo. Busca la semana del ${WEEK.es}. Ni borrador ni copia.`,
  },
  // Advances when the right file is open, not when any file is.
  {
    en: `The top says Week of ${WEEK.en}. This is the one. Click Rename.`,
    es: `Arriba dice Week of ${WEEK.en} (semana del ${WEEK.es}). Es este. Haz clic en Cambiar nombre.`,
  },
  {
    en: `Type the new name: ${RENAME_TARGET}. Then click Continue.`,
    es: `Escribe el nombre nuevo: ${RENAME_TARGET}. Después haz clic en Continuar.`,
  },
  {
    en: "Choose Can view. Then click Share.",
    es: "Elige Puede ver. Después haz clic en Compartir.",
  },
];

/** Step 0 while My Drive is open: the folder the line names is one click away. */
export const MY_DRIVE_STEP: Localized = {
  en: "This is My Drive. Click Shared with me. Then click Cafe Shared Drive.",
  es: "Esto es Mi unidad. Haz clic en Compartido conmigo. Después haz clic en Unidad compartida del café.",
};

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
    renameHint: `New name: ${RENAME_TARGET}`,
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
    scenario: "Renata te pidió compartir el horario de esta semana con Jordan Kim, una persona nueva en el equipo. Solo para ver. Jordan no necesita editarlo. También te pidió renombrarlo así: schedule-week-of-[fecha].",
    searchPlaceholder: "Buscar archivos…",
    allFolders: "Todas las carpetas",
    renameLabel: "Cambia el nombre de este archivo",
    renameHint: `Nombre nuevo: ${RENAME_TARGET}`,
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
  en: `Read the week at the top and the file name. You need Week of ${WEEK.en}, not a draft or a copy. If this is not it, click Close and open another file.`,
  es: `Lee la semana arriba y el nombre del archivo. Necesitas Week of ${WEEK.en} (${WEEK.es}), sin borrador (draft) ni copia (copy). Si no es este, haz clic en Cerrar y abre otro archivo.`,
};

/**
 * Folder names stay in English, like the files a US workplace keeps. A
 * Spanish screen adds a short gloss, the way the Job Card glosses DRAFT.
 */
export const FOLDER_LABEL: Record<string, Localized> = {
  Schedules: { en: "Schedules", es: "Schedules (horarios)" },
  Forms: { en: "Forms", es: "Forms (formularios)" },
  "Manager Memos": { en: "Manager Memos", es: "Manager Memos (memos de la gerencia)" },
};

/** Words a learner might search with that the file name does not show. */
const SEARCH_ALIASES: Record<string, string> = {
  Schedules: "horario horarios turnos",
  Forms: "formulario formularios",
  "Manager Memos": "memo memos gerencia",
};

const SEARCH_STOPWORDS = new Set([
  "of", "the", "for", "a", "this", "week", "file", "pdf",
  "de", "del", "la", "el", "los", "las", "esta", "este", "semana", "archivo",
]);

function searchWords(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\b(august|agosto)\b/g, "aug")
    .replace(/\b(sept|september|septiembre)\b/g, "sep")
    .replace(/([a-z])(\d)/g, "$1 $2")
    .replace(/(\d)([a-z])/g, "$1 $2")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

/**
 * Search reads more than the coded file name: the page's title and week, the
 * folder, and plain words ("aug 24", "schedule", "horario", "draft"). Every
 * word the learner types has to start a word in there. A part of the raw
 * file name ("82426", "sched_8") still works too.
 */
export function fileMatchesQuery(file: DriveFile, query: string): boolean {
  const raw = query.trim().toLowerCase();
  if (!raw) return true;
  if (file.name.toLowerCase().includes(raw)) return true;
  const doc = FILE_PAGES[file.key]?.doc;
  const hay = searchWords(
    [
      file.name,
      file.folder,
      SEARCH_ALIASES[file.folder] ?? "",
      doc && "title" in doc ? doc.title : "",
      doc?.kind === "schedule" ? doc.week : "",
      /draft/.test(file.name) ? "borrador" : "",
      /copy/.test(file.name) ? "copia" : "",
    ].join(" "),
  );
  const words = searchWords(raw).filter((w) => !SEARCH_STOPWORDS.has(w));
  if (words.length === 0) return true;
  return words.every((w) => hay.some((h) => h.startsWith(w)));
}

export type RenameProblem = "empty" | "oldName" | "wrong";

/** What is wrong with a typed name, or null when it matches RENAME_TARGET. */
export function renameProblem(value: string, oldName: string): RenameProblem | null {
  if (!value.trim()) return "empty";
  if (normalizeRename(value) === RENAME_TARGET) return null;
  const old = oldName.replace(/\.pdf$/i, "").toLowerCase();
  const code = old.match(/\d{4,}/)?.[0];
  const v = value.toLowerCase();
  // Clicking into the box drops the selection, so typing lands next to the old name.
  if (v.includes(old) || (code && v.includes(code))) return "oldName";
  return "wrong";
}

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
    postedBy: `Posted by Renata Silva, General Manager · ${date}`,
  };
}

const THIS_WEEK_ROWS = crewRows((m, d) => m.shifts[d].label);
const SWAP_NOTE = "Need to swap? Ask Renata at least 48 hours before the shift.";

/** The page each Drive file opens to, keyed by `DriveFile.key`. */
export const FILE_PAGES: Record<string, { doc: PdfDocument; stamp?: string }> = {
  "sched-aug24": {
    doc: schedule("sched-aug24", schedName(FILES_WEEK), POSTED, `Week of ${weekRange(FILES_WEEK)}`, THIS_WEEK_ROWS, [
      "The cafe is closed on Sunday.",
      "Saturday 4–10 PM is not filled yet.",
      SWAP_NOTE,
    ]),
  },
  "sched-aug24-copy": {
    doc: schedule("sched-aug24-copy", schedName(FILES_WEEK, "_copy"), POSTED, `Week of ${weekRange(FILES_WEEK)}`, THIS_WEEK_ROWS, [
      "The cafe is closed on Sunday.",
      "Saturday 4–10 PM is not filled yet.",
      SWAP_NOTE,
    ]),
  },
  "sched-aug24-draft": {
    stamp: "DRAFT",
    doc: schedule(
      "sched-aug24-draft",
      schedName(FILES_WEEK, "_draft"),
      shortDate(FILES_WEEK - 5, "en"),
      `Week of ${weekRange(FILES_WEEK)}`,
      crewRows((m, d) => (d === "fri" ? "TBD" : m.shifts[d].label)),
      ["Friday shifts: to be decided."],
    ),
  },
  "sched-aug17": {
    doc: schedule(
      "sched-aug17",
      schedName(LAST_WEEK),
      shortDate(LAST_WEEK - 3, "en"),
      `Week of ${weekRange(LAST_WEEK)}`,
      // Last week: the same crew on different days.
      crewRows((m, d) => m.shifts[DAYS[(DAYS.indexOf(d) + 2) % DAYS.length]].label || (d === "sat" ? "8–4" : "")),
      ["The cafe is closed on Sunday.", SWAP_NOTE],
    ),
  },
  "sched-sept": {
    doc: schedule(
      "sched-sept",
      schedName(NEXT_WEEK),
      POSTED,
      `Week of ${weekRange(NEXT_WEEK)}`,
      crewRows((m, d) => m.shifts[DAYS[(DAYS.indexOf(d) + 1) % DAYS.length]].label),
      ["The cafe is closed on Sunday.", SWAP_NOTE],
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
      signedBy: "Renata Silva, General Manager",
    },
  },
};

export const WRONG_RENAME_HINT: Record<Lang, string> = {
  en: `Check the name. Type these words with a dash - between them: ${RENAME_TARGET}`,
  es: `Revisa el nombre. Escribe estas palabras con un guion - entre ellas: ${RENAME_TARGET}`,
};

export const RENAME_HINTS: Record<RenameProblem, Localized> = {
  empty: {
    en: `The box is empty. Type the new name: ${RENAME_TARGET}`,
    es: `La casilla está vacía. Escribe el nombre nuevo: ${RENAME_TARGET}`,
  },
  oldName: {
    en: `The old name is still in the box. Delete the old name first. Then type ${RENAME_TARGET}`,
    es: `El nombre viejo sigue en la casilla. Borra el nombre viejo primero. Después escribe ${RENAME_TARGET}`,
  },
  wrong: { en: WRONG_RENAME_HINT.en, es: WRONG_RENAME_HINT.es },
};

/** Clicking My Drive or New is looking around, not a mistake. */
export const NEW_BUTTON_NOTE: Localized = {
  en: "New makes a new file. Today's schedule is already in Cafe Shared Drive.",
  es: "Nuevo crea un archivo nuevo. El horario de hoy ya está en la Unidad compartida del café.",
};

export const MY_DRIVE_EMPTY: Localized = {
  en: "My Drive is empty. Files other people share with you are in Shared with me.",
  es: "Mi unidad está vacía. Los archivos que otras personas comparten contigo están en Compartido conmigo.",
};

/** Show me on the open-a-file step points at a schedule, not the answer, so it says so. */
export const OPEN_ONE_POINTER: Localized = { en: "Open one. Read the week.", es: "Abre uno. Lee la semana." };

/** The finish shows the result: the new name and who it is shared with. */
export const DONE_SHARED_WITH: Localized = { en: "Shared with Jordan Kim · Viewer", es: "Compartido con Jordan Kim · Lector" };

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
        "Open the folder. You can also search, for example: aug 24, or schedule.",
        "Click a file to open it. Opening a file does not change it.",
        `Read the top of the page. A schedule says which week it is for, like Week of ${WEEK.en}.`,
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
        "The old name is already in the box, and it is selected. Just start typing to replace it. If you click in the box, delete the old name first.",
        `Type the new name exactly: ${RENAME_TARGET}`,
        "The dash - is next to the 0 key. Then click Continue, or press Enter.",
      ],
      tip: "A clear name helps the next person find the file.",
    },
  ],
  es: [
    {
      t: "Encontrar el archivo correcto",
      s: [
        "Abre la carpeta. También puedes buscar, por ejemplo: aug 24, o horario.",
        "Haz clic en un archivo para abrirlo. Abrir un archivo no lo cambia.",
        `Lee la parte de arriba de la página. Un horario dice de qué semana es, por ejemplo Week of ${WEEK.en} (semana del ${WEEK.es}).`,
      ],
      tip: "Los nombres de archivo pueden ser difíciles de leer. La página misma te dice qué es el archivo.",
    },
    {
      t: "Acceso de ver vs. editar",
      s: [
        "\"Puede ver\" quiere decir que la persona puede mirar el archivo, pero no cambiarlo.",
        "\"Puede editar\" quiere decir que puede cambiar el archivo. Dalo solo si necesita cambiarlo.",
        "Si tienes dudas, elige \"Puede ver\".",
      ],
      tip: "Es fácil dar \"Puede editar\" por error. Revisa otra vez antes de hacer clic en Compartir.",
    },
    {
      t: "Cambiar el nombre de un archivo",
      s: [
        "El nombre viejo ya está en la casilla, y está seleccionado. Empieza a escribir para reemplazarlo. Si haces clic en la casilla, borra primero el nombre viejo.",
        `Escribe el nombre nuevo tal cual: ${RENAME_TARGET}`,
        "El guion - está al lado de la tecla 0. Después haz clic en Continuar, o presiona Enter.",
      ],
      tip: "Un nombre claro ayuda a la próxima persona a encontrar el archivo.",
    },
  ],
};


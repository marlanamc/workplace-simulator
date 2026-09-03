import type { Lang, Lesson, Localized } from "@/lib/task-types";

export const SHARE_WITH = "Dana Ortiz";
export const TARGET_FILE = "q3-final";

export interface HqDriveFile {
  key: string;
  name: string;
  folder: string;
  date: string;
  isTarget: boolean;
  wrongHint?: Localized;
}

const hint = (en: string, es: string): Localized => ({ en, es });

export const HQ_FOLDERS = ["Q2 2026", "Q3 2026", "Shared"] as const;

export const HQ_FILES: HqDriveFile[] = [
  {
    key: "q2-final",
    name: "Q3_notes_FINAL.pdf",
    folder: "Q2 2026",
    date: "Jun 12",
    isTarget: false,
    wrongHint: hint(
      "That's last quarter, sitting in Q2. Open Q3 2026.",
      "Ese es el trimestre pasado, en Q2. Abre Q3 2026.",
    ),
  },
  {
    key: "q3-v1",
    name: "Q3_notes_FINAL_v1.pdf",
    folder: "Q3 2026",
    date: "Aug 28",
    isTarget: false,
    wrongHint: hint(
      "That's version 1. Dana asked for the current file, not the draft.",
      "Esa es la versión 1. Dana pidió el archivo actual, no el borrador.",
    ),
  },
  {
    key: "q3-copy",
    name: "Q3_notes_FINAL_copy.pdf",
    folder: "Q3 2026",
    date: "Aug 30",
    isTarget: false,
    wrongHint: hint(
      "That's a copy. Share the current file, not a duplicate.",
      "Esa es una copia. Comparte el archivo actual, no un duplicado.",
    ),
  },
  {
    key: TARGET_FILE,
    name: "Q3_notes_FINAL.pdf",
    folder: "Q3 2026",
    date: "Sep 1",
    isTarget: true,
  },
  {
    key: "roster",
    name: "team_roster.xlsx",
    folder: "Shared",
    date: "Aug 4",
    isTarget: false,
    wrongHint: hint(
      "That's the roster, not the Q3 notes.",
      "Ese es el roster, no las notas del T3.",
    ),
  },
];

export function isCurrentHqFile(key: string): boolean {
  return key === TARGET_FILE;
}

export function shareIsViewOnly(permission: "view" | "edit" | null): boolean {
  return permission === "view";
}

export const HQ_DRIVE_COPY: Record<Lang, {
  appName: string;
  searchPlaceholder: string;
  foldersHeading: string;
  filesHeading: string;
  navHome: string;
  navShared: string;
  newBtn: string;
  share: string;
  shareWith: string;
  addPeople: string;
  canView: string;
  canComment: string;
  canEdit: string;
  sentKicker: string;
  tryAgain: string;
  backToDesk: string;
  lessonKicker: string;
  tipLabel: string;
  gotIt: string;
  helpBtn: string;
}> = {
  en: {
    appName: "Drive",
    searchPlaceholder: "Search in Drive",
    foldersHeading: "Folders",
    filesHeading: "Files",
    navHome: "Home",
    navShared: "Shared drives",
    newBtn: "New",
    share: "Share",
    shareWith: "Share with",
    addPeople: "Add people",
    canView: "Can view",
    canComment: "Can comment",
    canEdit: "Can edit",
    sentKicker: "Shared view-only",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
    helpBtn: "Help me with this step",
  },
  es: {
    appName: "Drive",
    searchPlaceholder: "Buscar en Drive",
    foldersHeading: "Carpetas",
    filesHeading: "Archivos",
    navHome: "Inicio",
    navShared: "Unidades compartidas",
    newBtn: "Nuevo",
    share: "Compartir",
    shareWith: "Compartir con",
    addPeople: "Agregar personas",
    canView: "Puede ver",
    canComment: "Puede comentar",
    canEdit: "Puede editar",
    sentKicker: "Compartido solo para ver",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
    helpBtn: "Ayúdame con este paso",
  },
};

export const WRONG_EDIT_HINT: Localized = {
  en: "Dana asked for view only. Editor lets her change the file.",
  es: "Dana pidió solo ver. Editor le deja cambiar el archivo.",
};

export const NEED_PERMISSION_HINT: Localized = {
  en: "Choose an access level first.",
  es: "Primero elige un nivel de acceso.",
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Read the file name twice",
      s: [
        "HQ Drive has folders inside folders. Search first, then open the folder for this quarter.",
        "The file you want has today's date. The copies and the v1 are next to it on purpose, to see if you check.",
      ],
      tip: "When two files have the same name, the date is how you tell them apart.",
    },
    {
      t: "Share the file itself, not the folder",
      s: [
        "Dana needs the current Q3 notes. Share them as view only.",
        "Editor access is for people who should be able to change the file. Dana should not.",
      ],
      tip: "When someone only needs to read a file, view only is the safe choice.",
    },
  ],
  es: [
    {
      t: "Lee el nombre del archivo dos veces",
      s: [
        "El Drive de HQ tiene carpetas dentro de carpetas. Busca primero, luego abre la carpeta de este trimestre.",
        "El archivo que buscas tiene la fecha de hoy. Las copias y la v1 están al lado a propósito, para ver si revisas.",
      ],
      tip: "Cuando dos archivos tienen el mismo nombre, la fecha es cómo los distingues.",
    },
    {
      t: "Comparte el archivo mismo, no la carpeta",
      s: [
        "Dana necesita las notas actuales del T3. Compártelas en modo solo ver.",
        "El acceso de editor es para las personas que deben poder cambiar el archivo. Dana no.",
      ],
      tip: "Cuando alguien solo necesita leer un archivo, solo ver es la opción segura.",
    },
  ],
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  { en: "Find the current Q3 file.", es: "Encuentra el archivo actual del T3." },
  { en: "Share it with Dana as view only.", es: "Compártelo con Dana en modo solo ver." },
];

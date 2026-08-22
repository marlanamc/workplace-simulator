import type { Lang, Localized } from "./task-types";

export type { Lang };

// Desktop app icons - kept to what a learner would actually find on a work
// Chromebook: a browser (which hosts webmail, the HR portal, forms, the
// handbook as tabs/bookmarks) and a PDF reader for downloaded files.
export type AppKey = "browser" | "pdf";
export type AppState = "ready" | "done" | "locked";

export interface AppDef {
  key: AppKey;
  color: string;
  state: AppState;
}

export const APP_DEFS: AppDef[] = [
  { key: "browser", color: "#1a73e8", state: "ready" },
  { key: "pdf", color: "#ea4335", state: "ready" },
];

interface AppCopy {
  name: string;
  kicker: string;
  brief: string;
  points: string[];
}

export const APP_COPY: Record<Lang, Record<AppKey, AppCopy>> = {
  en: {
    browser: {
      name: "Browser",
      kicker: "Your main workspace",
      brief: "Almost everything for the job lives here. Email, your schedule, pay stubs, and forms all open as tabs.",
      points: ["Open a bookmarked site or a tab", "Read what it's asking you to do", "Reply, fill in, or submit. Then check it off"],
    },
    pdf: {
      name: "PDF Reader",
      kicker: "Your files",
      brief: "Opens files you download, like reports and pay stubs, so you can read them.",
      points: ["Find the file in Downloads", "Open it to read", "Print or attach it to an email when asked"],
    },
  },
  es: {
    browser: {
      name: "Navegador",
      kicker: "Tu espacio principal",
      brief: "Casi todo el trabajo pasa por aquí. Correo, tu horario, recibos de pago y formularios se abren como pestañas.",
      points: ["Abre un sitio guardado o una pestaña", "Lee lo que te pide", "Responde, llena o envía. Luego márcalo como hecho"],
    },
    pdf: {
      name: "Lector de PDF",
      kicker: "Referencia",
      brief: "Abre archivos descargados como reportes y recibos de pago para leerlos o imprimirlos.",
      points: ["Busca el archivo en Descargas", "Ábrelo para leerlo", "Imprímelo o adjúntalo a un correo cuando lo pidan"],
    },
  },
};

export const DESKTOP_COPY: Record<Lang, {
  practiceBanner: string;
  langBtn: string;
  nextLabel: string;
  progressWord: string;
  appsBtn: string;
  todayLabel: string;
  continueLabel: string;
  searchPlaceholder: string;
  back: string;
  start: string;
  soon: string;
  done: string;
  ready: string;
  locked: string;
  allDoneHeadline: string;
  allDoneBody: string;
  allDoneCta: string;
  replayLevel: string;
  replayShort: string;
  replayConfirm: string;
  replayConfirmCta: string;
  replayCancel: string;
  comingSoonHeadline: string;
  comingSoonBody: string;
  welcomeBack: string;
  mariaNote: string;
  someoneNote: string;
  bookmarkOnramp: string;
  leftoverOne: string;
  leftoverMany: string;
}> = {
  en: {
    practiceBanner: "Practice space. Nothing here is real.",
    langBtn: "Español",
    nextLabel: "Do this next",
    progressWord: "tasks done",
    appsBtn: "Start",
    todayLabel: "Your work apps",
    continueLabel: "Continue where you left off",
    searchPlaceholder: "Search your apps and tasks…",
    back: "Not now",
    start: "Open",
    soon: "Coming soon",
    done: "Done",
    ready: "Ready",
    locked: "Later",
    allDoneHeadline: "You finished every task we have.",
    allDoneBody: "Your awards are in the case. Replay any level if you want another round.",
    allDoneCta: "See awards",
    replayLevel: "Replay a level",
    replayShort: "Replay",
    replayConfirm: "This clears the checkmarks for this level. Later levels stay done.",
    replayConfirmCta: "Reset it",
    replayCancel: "Never mind",
    comingSoonHeadline: "More coming soon",
    comingSoonBody: "You're done with the tasks we have built so far. Come back later, or do any task again to practice.",
    welcomeBack: "Welcome back.",
    mariaNote: "Maria left a note",
    someoneNote: "A note just arrived",
    bookmarkOnramp: "From here on, you open your own apps from the bookmarks bar. Start with the one named in the button.",
    leftoverOne: "1 left",
    leftoverMany: "{n} left",
  },
  es: {
    practiceBanner: "Espacio de práctica. Nada aquí es real.",
    langBtn: "English",
    nextLabel: "Haz esto ahora",
    progressWord: "tareas hechas",
    appsBtn: "Inicio",
    todayLabel: "Tus apps de trabajo",
    continueLabel: "Continúa donde lo dejaste",
    searchPlaceholder: "Busca tus apps y tareas…",
    back: "Ahora no",
    start: "Abrir",
    soon: "Próximamente",
    done: "Hecho",
    ready: "Listo",
    locked: "Después",
    allDoneHeadline: "Terminaste todo el café.",
    allDoneBody: "Tus premios están en la vitrina. Repite cualquier nivel si quieres otra ronda.",
    allDoneCta: "Ver premios",
    replayLevel: "Repetir un nivel",
    replayShort: "Repetir",
    replayConfirm: "Se borran las marcas de este nivel. Los niveles siguientes se quedan.",
    replayConfirmCta: "Reiniciar",
    replayCancel: "Mejor no",
    comingSoonHeadline: "Muy pronto más",
    comingSoonBody: "Ya estás al día. La siguiente tarea de esta ruta todavía no está lista. Vuelve más tarde, o repite cualquier tarea para practicar más.",
    welcomeBack: "Bienvenido otra vez.",
    mariaNote: "Maria dejó una nota",
    someoneNote: "Llegó una nota",
    bookmarkOnramp: "A partir de ahora, abres tus apps desde la barra de marcadores. Empieza por la del botón.",
    leftoverOne: "1 queda",
    leftoverMany: "{n} quedan",
  },
};

export interface RecentItem {
  color: string;
  title: Localized;
  subtitle: Localized;
  appKey: AppKey;
  tab?: string;
}

export const RECENT_ITEMS: RecentItem[] = [
  {
    color: "#8430ce",
    title: { en: "Portal", es: "Portal" },
    subtitle: { en: "Check your schedule", es: "Revisa tu horario" },
    appKey: "browser",
    tab: "portal",
  },
  {
    color: "#4285f4",
    title: { en: "Docs", es: "Docs" },
    subtitle: { en: "Look something up", es: "Busca algo" },
    appKey: "browser",
    tab: "handbook",
  },
];

// The underlying curriculum tasks - independent of how many desktop app
// icons exist, since several tasks now live as tabs inside one Browser app.
export const TASK_KEYS = [
  "tour",
  "mail",
  "schedule",
  "timeclock",
  "paystub",
  "incident",
  "handbook",
  "calendar",
  "files",
  "spreadsheet",
  "make-a-copy",
  "status-report",
  "triage",
  "team-schedule",
  "formula-check",
  "team-meeting",
  "priority-call",
] as const;
export type TaskKey = (typeof TASK_KEYS)[number];

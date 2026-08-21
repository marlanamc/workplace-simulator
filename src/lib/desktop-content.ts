import type { Lang, Localized } from "./task-types";

export type { Lang };

// Desktop app icons — kept to what a learner would actually find on a work
// Chromebook: a browser (which hosts webmail, the HR portal, forms, the
// handbook as tabs/bookmarks) and a PDF reader for downloaded files.
export type AppKey = "browser" | "pdf";
export type AppState = "ready" | "done" | "locked";

export interface AppDef {
  key: AppKey;
  icon: string;
  color: string;
  state: AppState;
}

export const APP_DEFS: AppDef[] = [
  { key: "browser", icon: "◧", color: "#1a73e8", state: "ready" },
  { key: "pdf", icon: "▤", color: "#c5221f", state: "ready" },
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
      brief: "Almost everything for the job lives here — email, your schedule, pay stubs, and forms all open as tabs.",
      points: ["Open a bookmarked site or a tab", "Read what it's asking you to do", "Reply, fill in, or submit — then check it off"],
    },
    pdf: {
      name: "PDF Reader",
      kicker: "Reference",
      brief: "Opens downloaded files like reports and pay stubs so you can read or print them.",
      points: ["Find the file in Downloads", "Open it to read", "Print or attach it to an email when asked"],
    },
  },
  es: {
    browser: {
      name: "Navegador",
      kicker: "Tu espacio principal",
      brief: "Casi todo el trabajo pasa por aquí — correo, tu horario, recibos de pago y formularios se abren como pestañas.",
      points: ["Abre un sitio guardado o una pestaña", "Lee lo que te pide", "Responde, llena o envía — y márcalo como hecho"],
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
  focusHeadline: string;
  focusCta: string;
}> = {
  en: {
    practiceBanner: "Practice space — nothing here is real",
    langBtn: "Español",
    nextLabel: "Do this next",
    progressWord: "tasks done",
    appsBtn: "Apps",
    todayLabel: "Your work apps",
    continueLabel: "Continue where you left off",
    searchPlaceholder: "Search your apps and tasks…",
    back: "Not now",
    start: "Open",
    soon: "Coming soon",
    done: "Done",
    ready: "Ready",
    locked: "Later",
    focusHeadline: "Answer Maria's email",
    focusCta: "Open WorkMail",
  },
  es: {
    practiceBanner: "Espacio de práctica — nada aquí es real",
    langBtn: "English",
    nextLabel: "Haz esto ahora",
    progressWord: "tareas hechas",
    appsBtn: "Apps",
    todayLabel: "Tus apps de trabajo",
    continueLabel: "Continúa donde lo dejaste",
    searchPlaceholder: "Busca tus apps y tareas…",
    back: "Ahora no",
    start: "Abrir",
    soon: "Próximamente",
    done: "Hecho",
    ready: "Listo",
    locked: "Después",
    focusHeadline: "Contesta el correo de Maria",
    focusCta: "Abrir WorkMail",
  },
};

export interface RecentItem {
  icon: string;
  color: string;
  title: Localized;
  subtitle: Localized;
  appKey: AppKey;
  tab?: string;
}

export const RECENT_ITEMS: RecentItem[] = [
  {
    icon: "▦",
    color: "#8430ce",
    title: { en: "Employee Portal", es: "Portal del empleado" },
    subtitle: { en: "Check your schedule", es: "Revisa tu horario" },
    appKey: "browser",
    tab: "portal",
  },
  {
    icon: "▤",
    color: "#3c4043",
    title: { en: "Handbook", es: "Manual" },
    subtitle: { en: "Look something up", es: "Busca algo" },
    appKey: "browser",
    tab: "handbook",
  },
];

// The underlying curriculum tasks — independent of how many desktop app
// icons exist, since several tasks now live as tabs inside one Browser app.
export const TASK_KEYS = ["mail", "schedule", "timeclock", "paystub", "incident", "handbook"] as const;
export type TaskKey = (typeof TASK_KEYS)[number];

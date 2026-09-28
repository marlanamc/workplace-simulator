import type { TaskKey } from "@/lib/desktop-content";
import type { Localized } from "@/lib/task-types";

/**
 * Wave 4, everyday recovery (Day 7). The first time the learner opens the
 * handbook, the Wi-Fi has dropped: every page in the browser shows Chrome's
 * "No internet" page. The learner checks the Wi-Fi in the corner of the
 * screen, turns it back on, and reloads. Nothing about the learner's real
 * computer changes; this is the practice Wi-Fi, and the page says so.
 *
 * One story flag holds the stage, so the shelf, the browser and the Job Card
 * agree, a reload keeps it, and replaying Day 7 clears it.
 */
export const OFFLINE_FLAG = "handbook-offline";

/** Unset = not started (Wi-Fi off). "wifi" = Wi-Fi back on. "done" = page reloaded. */
export type OfflineStage = "off" | "wifi" | "done";

export function offlineStage(flag: string | undefined): OfflineStage {
  return flag === "wifi" || flag === "done" ? flag : "off";
}

/**
 * The incident runs only in Story, only while the handbook is the next job,
 * and only until the page has been reloaded on a working connection.
 */
export function offlineIncidentActive(nextTask: TaskKey | null, flag: string | undefined, inLesson: boolean): boolean {
  return !inLesson && nextTask === "handbook" && offlineStage(flag) !== "done";
}

/** The shelf shows Wi-Fi off only while the incident runs and Wi-Fi is not back yet. */
export function wifiOff(nextTask: TaskKey | null, flag: string | undefined, inLesson: boolean): boolean {
  return offlineIncidentActive(nextTask, flag, inLesson) && offlineStage(flag) === "off";
}

/** What Reload does: load the page once Wi-Fi is back, otherwise show the same error again. */
export function reloadResult(flag: string | undefined): "loaded" | "still-offline" {
  return offlineStage(flag) === "off" ? "still-offline" : "loaded";
}

export const OFFLINE_STEPS: Localized[] = [
  {
    en: "The page did not load. Check the Wi-Fi: click the clock in the corner of the screen.",
    es: "La página no cargó. Revisa el Wi-Fi: haz clic en el reloj en la esquina de la pantalla.",
  },
  {
    en: "The Wi-Fi is on again. Click Reload to load the page.",
    es: "El Wi-Fi está activo otra vez. Haz clic en Volver a cargar para cargar la página.",
  },
];

/** Act II states the goal, not the clicks. */
export const OFFLINE_GOAL: Localized = {
  en: "The page did not load. Check the Wi-Fi, then reload the page.",
  es: "La página no cargó. Revisa el Wi-Fi y después vuelve a cargar la página.",
};

export const STILL_OFFLINE: Localized = {
  en: "Still no internet. The Wi-Fi is off. Click the clock in the corner of the screen and turn on Wi-Fi.",
  es: "Todavía no hay internet. El Wi-Fi está apagado. Haz clic en el reloj en la esquina de la pantalla y activa el Wi-Fi.",
};

/** Chrome's own offline page, in both languages. */
export const OFFLINE_PAGE: Localized<{
  title: string;
  tryLabel: string;
  tries: string[];
  code: string;
  reload: string;
  practice: string;
}> = {
  en: {
    title: "No internet",
    tryLabel: "Try:",
    tries: ["Checking the Wi-Fi", "Reconnecting to Wi-Fi"],
    code: "ERR_INTERNET_DISCONNECTED",
    reload: "Reload",
    practice: "Practice Wi-Fi. Your real computer is still connected.",
  },
  es: {
    title: "Sin conexión a internet",
    tryLabel: "Prueba lo siguiente:",
    tries: ["Revisar el Wi-Fi", "Volver a conectarte al Wi-Fi"],
    code: "ERR_INTERNET_DISCONNECTED",
    reload: "Volver a cargar",
    practice: "Wi-Fi de práctica. Tu computadora real sigue conectada.",
  },
};

/** The quick-settings Wi-Fi tile while it is off. */
export const WIFI_TILE: Localized<{ off: string; on: string; connectedTo: string }> = {
  en: { off: "Off", on: "Connected", connectedTo: "Wi-Fi is on. Connected to Harborside Staff." },
  es: { off: "Apagado", on: "Conectado", connectedTo: "El Wi-Fi está activo. Conectado a Harborside Staff." },
};

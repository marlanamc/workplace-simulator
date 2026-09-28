import type { TaskKey } from "@/lib/desktop-content";
import type { Localized } from "@/lib/task-types";

/**
 * Wave 4, everyday recovery (Day 13). After the first of the two requests,
 * the Job Card asks the learner to step away and close the browser. Then it
 * asks them to reopen it and finish. The work they did is still there, because
 * triage keeps its drafts. Nothing fakes a crash: the close is asked for.
 *
 * One story flag holds the stage, so the browser's Close button, the desktop
 * Job Card and the task agree. Replaying Day 13 clears it.
 */
export const CLOSE_FLAG = "triage-close";

/** "none" = not yet. "ask" = close the browser. "closed" = closed; reopen and finish. */
export type CloseStage = "none" | "ask" | "closed";

export function closeStage(flag: string | undefined): CloseStage {
  return flag === "ask" || flag === "closed" ? flag : "none";
}

/** After one request is done, the card asks for the close. Only once. */
export function stageAfterRequest(stage: CloseStage, calDone: boolean, fileDone: boolean): CloseStage {
  return stage === "none" && calDone !== fileDone ? "ask" : stage;
}

/** Closing the browser counts only while the card is asking for it. */
export function stageAfterBrowserClosed(nextTask: TaskKey | null, stage: CloseStage): CloseStage {
  return nextTask === "triage" && stage === "ask" ? "closed" : stage;
}

/** The second request waits until the browser has been closed and reopened. */
export function mustCloseFirst(stage: CloseStage): boolean {
  return stage === "ask";
}

export const CLOSE_LINES: Record<"ask" | "reopen" | "back", Localized> = {
  ask: {
    en: "Renata needs you on the floor for a minute. Close the browser with the X at the top right. Your work is saved.",
    es: "Renata te necesita en el piso un minuto. Cierra el navegador con la X arriba a la derecha. Tu trabajo está guardado.",
  },
  reopen: {
    en: "You are back. Open the browser from the shelf at the bottom, then open Today and finish the other request.",
    es: "Ya volviste. Abre el navegador desde la barra de abajo. Después abre Today y termina la otra tarea.",
  },
  back: {
    en: "Your work is still here. Finish the other request.",
    es: "Tu trabajo sigue aquí. Termina la otra tarea.",
  },
};

export const CLOSE_FIRST: Localized = {
  en: "First close the browser, like Renata asked. Use the X at the top right. Your work is saved.",
  es: "Primero cierra el navegador, como pidió Renata. Usa la X arriba a la derecha. Tu trabajo está guardado.",
};

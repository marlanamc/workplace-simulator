import type { Localized } from "@/lib/task-types";
import { STATUS_ROWS } from "../status-sheet";

/**
 * Wave 4, everyday recovery (Day 12). Undo only reverses your own last
 * change, so the Job Card asks the learner to make the mistake on purpose:
 * delete Friday's number, then bring it back with Undo (the toolbar arrow,
 * or Ctrl+Z). The evidence is the original number back in its cell.
 */
export type UndoStage = "delete" | "undo" | "done";

export type RowKey = (typeof STATUS_ROWS)[number]["key"];
export const UNDO_TARGET: RowKey = "fri";

/** Delete or Backspace clears a selected cell, as in Sheets. */
export function isDeleteKey(key: string): boolean {
  return key === "Delete" || key === "Backspace";
}

/** Ctrl+Z, or Cmd+Z on a Mac. Shift+Z is Redo, not Undo. */
export function isUndoShortcut(e: { key: string; ctrlKey: boolean; metaKey: boolean; shiftKey: boolean }): boolean {
  return (e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "z";
}

/** What a Delete does at each stage: only the first one, before Undo, is the exercise. */
export function afterDelete(stage: UndoStage, cleared: RowKey | null, selected: RowKey | null): { stage: UndoStage; cleared: RowKey | null } {
  if (stage !== "delete" || !selected) return { stage, cleared };
  return { stage: "undo", cleared: selected };
}

/** Undo brings back the cleared number. With nothing cleared, it does nothing. */
export function afterUndo(stage: UndoStage, cleared: RowKey | null): { stage: UndoStage; cleared: RowKey | null } {
  if (stage !== "undo" || !cleared) return { stage, cleared };
  return { stage: "done", cleared: null };
}

/** What a cell shows: its number, or nothing while it is cleared. */
export function cellShows(key: RowKey, cleared: RowKey | null): string {
  return key === cleared ? "" : String(STATUS_ROWS.find((r) => r.key === key)!.value);
}

export const UNDO_STEPS: Record<"delete" | "undo", Localized> = {
  delete: { en: "Select Friday’s number in B6. Press Delete.", es: "Selecciona el número del viernes en B6. Presiona Suprimir (Delete)." },
  undo: { en: "Use Undo to restore the number you deleted.", es: "Usa Deshacer para recuperar el número que borraste." },
};

/** Before Undo, the total cannot be right, so the email waits. */
export const UNDO_FIRST: Localized = {
  en: "A number is missing from the sheet. Use Undo to bring it back first.",
  es: "Falta un número en la hoja. Primero usa Deshacer para recuperarlo.",
};

/** Clicking a ticket cell during the rest of the task is looking, not editing. */
export const CELLS_ARE_SET: Localized = {
  en: "The ticket numbers are right. Click the Total cell (B7) for the formula.",
  es: "Los números de pedidos están bien. Haz clic en la celda del total (B7) para la fórmula.",
};

export const UNDO_LABEL: Localized = { en: "Undo (Ctrl+Z)", es: "Deshacer (Ctrl+Z)" };
export const UNDONE_STATUS: Localized = { en: "Friday's number is back.", es: "El número del viernes volvió." };

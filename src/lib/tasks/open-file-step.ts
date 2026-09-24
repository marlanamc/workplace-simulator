import type { Lang, Localized } from "@/lib/task-types";

/**
 * First Job Card step for a Sheets/Drive job: name the exact file and the
 * heading it sits under, as they read on screen. "Open the hours sheet" left
 * learners guessing between templates; the real name tells them which card.
 * Built from the task's own copy so the step can never drift from the file.
 */
export function openFileStep<C extends { recentHeading: string }>(
  copy: Record<Lang, C>,
  fileName: (c: C) => string,
): Localized {
  return {
    en: `Open “${fileName(copy.en)}” under ${copy.en.recentHeading}.`,
    es: `Abre “${fileName(copy.es)}” en ${copy.es.recentHeading}.`,
  };
}

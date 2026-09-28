import type { Lang } from "./task-types";

/**
 * Copy and Download for the learner's summary. Both ways out carry the same
 * text; Download is the fallback when a Chromebook blocks the clipboard.
 * Call from a click handler (a browser only allows both after a real click).
 */

export function summaryFilename(lang: Lang): string {
  return lang === "en" ? "workplace-practice-summary.txt" : "resumen-practica-laboral.txt";
}

/** Resolves false when the clipboard is unavailable or denied. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Starts a UTF-8 .txt download. Returns false when it could not start. */
export function downloadText(text: string, filename: string): boolean {
  let url: string | undefined;
  let anchor: HTMLAnchorElement | undefined;
  try {
    url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    return true;
  } catch {
    return false;
  } finally {
    anchor?.remove();
    if (url) {
      const objectUrl = url;
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    }
  }
}

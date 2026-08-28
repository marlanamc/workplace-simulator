import type { Lang } from "@/lib/task-types";

/**
 * Browser text-to-speech via the free Web Speech API. No network, no cost.
 * Callers never need to feature-detect: on browsers without speechSynthesis
 * these are silent no-ops.
 */
const SPEECH_LANG: Record<Lang, string> = { en: "en-US", es: "es-ES" };

/** Longest text we'll read from one click — a paragraph, not a page. */
const MAX_SPOKEN_CHARS = 400;

export function speakText(text: string, lang: Lang) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const trimmed = text.replace(/\s+/g, " ").trim().slice(0, MAX_SPOKEN_CHARS);
  if (!trimmed) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(trimmed);
  utterance.lang = SPEECH_LANG[lang];
  // Slightly slower than default — the audience is hearing a second language.
  utterance.rate = 0.92;
  window.speechSynthesis.speak(utterance);
}

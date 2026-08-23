import type { Lang } from "@/lib/task-types";

/**
 * Browser text-to-speech via the free Web Speech API. No network, no cost —
 * the whole reason "Read aloud" can exist in a volunteer project. Callers
 * never need to feature-detect: on browsers without speechSynthesis these
 * are silent no-ops.
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

export function stopSpeaking() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
}

/**
 * Shared click handler for "Read aloud" mode: reads the text block the
 * learner tapped, but never hijacks interactive elements — a button click
 * still does what the button says, so listening never costs an action.
 */
export function speakFromClick(target: EventTarget | null, lang: Lang) {
  if (!(target instanceof HTMLElement)) return;
  if (target.closest("button, a, input, textarea, select, [role='button']")) return;
  const block = target.closest("p, h1, h2, h3, h4, li, label, td, th, span, div");
  if (!block?.textContent) return;
  speakText(block.textContent, lang);
}

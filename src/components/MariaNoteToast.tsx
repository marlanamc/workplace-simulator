"use client";

import { useEffect, useRef } from "react";
import { DESKTOP_COPY } from "@/lib/desktop-content";
import { noteIsFromMaria, storyNoteSenderFirstName } from "@/lib/story-beats";
import { useProgress } from "@/lib/progress-context";
import { useWindowManager } from "@/lib/window-manager";
import { SHELF_HEIGHT } from "@/components/Shelf";

/**
 * Quiet post-completion ping that Mail has a new story note. Click opens Mail.
 *
 * It sits in the shelf, just left of the app buttons, where no app window,
 * Job Card or control can be. Floating above the shelf it landed on the next
 * thing to press at 911 (Clock In, Submit, Attach file) (Phase 3 N-2).
 */
export default function MariaNoteToast() {
  const { mariaNoteTaskKey, dismissMariaNote, lang, celebrateLevel, celebrateTrack } = useProgress();
  const { openApp } = useWindowManager();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!mariaNoteTaskKey || celebrateLevel || celebrateTrack) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => dismissMariaNote(), 5500);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [mariaNoteTaskKey, celebrateLevel, celebrateTrack, dismissMariaNote]);

  if (!mariaNoteTaskKey || celebrateLevel || celebrateTrack) return null;

  const c = DESKTOP_COPY[lang];
  const senderName = storyNoteSenderFirstName(mariaNoteTaskKey);
  const label = noteIsFromMaria(mariaNoteTaskKey)
    ? c.mariaNote
    : senderName
      ? lang === "es"
        ? `${senderName} dejó una nota`
        : `${senderName} left a note`
      : c.someoneNote;

  return (
    <button
      type="button"
      onClick={() => {
        dismissMariaNote();
        openApp("browser", { tab: "mail" });
      }}
      className="fixed z-[85] h-10 max-w-[calc(50%-112px)] truncate rounded-lg bg-[#3c4043] px-4 text-[15px] font-medium text-white shadow-lg ring-1 ring-white/15 animate-fade-up cursor-pointer hover:bg-[#4a4e52]"
      style={{ bottom: (SHELF_HEIGHT - 40) / 2, right: "calc(50% + 96px)" }}
    >
      {label}
    </button>
  );
}

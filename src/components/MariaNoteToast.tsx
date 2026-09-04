"use client";

import { useEffect, useRef } from "react";
import { DESKTOP_COPY } from "@/lib/desktop-content";
import { noteIsFromMaria, storyNoteSenderFirstName } from "@/lib/story-beats";
import { useProgress } from "@/lib/progress-context";
import { useWindowManager } from "@/lib/window-manager";
import { SHELF_RESERVE } from "@/components/Shelf";

/** Quiet post-completion ping that Mail has a new story note. Click opens Mail. */
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
      className="fixed left-1/2 z-[85] max-w-[520px] -translate-x-1/2 rounded-xl bg-[#3c4043] px-5 py-3.5 text-center text-[15px] font-medium leading-snug text-white shadow-lg animate-fade-up cursor-pointer hover:bg-[#4a4e52]"
      style={{ bottom: SHELF_RESERVE + 16 }}
    >
      {label}
    </button>
  );
}

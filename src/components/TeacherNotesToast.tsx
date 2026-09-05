"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import { TEACHER_NOTES_COPY } from "@/lib/teacher-notes-content";
import { SHELF_RESERVE } from "@/components/Shelf";
import { GraduationCap, X } from "lucide-react";

/**
 * Quiet ping on login when the teacher has left a note. Distinct wording and
 * icon from MariaNoteToast so an adult learner knows this is their real
 * teacher, not the character Maria. Click opens the notes panel.
 */
export default function TeacherNotesToast({ onOpen }: { onOpen: () => void }) {
  const { pendingFeedback, lang, celebrateLevel, celebrateTrack } = useProgress();
  const [dismissed, setDismissed] = useState(false);
  const c = TEACHER_NOTES_COPY[lang];

  if (dismissed || celebrateLevel || celebrateTrack || pendingFeedback.length === 0) return null;

  const label = pendingFeedback.length === 1 ? c.toastOne : c.toastMany(pendingFeedback.length);

  return (
    <div
      className="animate-fade-up fixed left-1/2 z-[85] flex max-w-[520px] -translate-x-1/2 items-center gap-3 rounded-xl bg-[#1967d2] px-4 py-3 text-white shadow-lg"
      style={{ bottom: SHELF_RESERVE + 16 }}
    >
      <GraduationCap size={20} strokeWidth={2} className="shrink-0" aria-hidden />
      <button type="button" onClick={onOpen} className="flex-1 text-left text-[15px] font-medium leading-snug cursor-pointer">
        {label}
      </button>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label={c.close}
        className="-mr-1 shrink-0 rounded-full p-1 text-white/80 hover:bg-white/15 cursor-pointer"
      >
        <X size={16} strokeWidth={2.25} />
      </button>
    </div>
  );
}

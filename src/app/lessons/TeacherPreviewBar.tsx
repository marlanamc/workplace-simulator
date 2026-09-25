"use client";

import { useState } from "react";
import { BookOpen, Link2 } from "lucide-react";
import { useProgress } from "@/lib/progress-context";
import { useLesson } from "@/lib/lesson-context";
import type { TeacherGuide } from "@/lib/lessons/types";
import { LESSON_COPY, TEACHER_COPY } from "@/lib/lessons/copy";
import LessonGuide from "./LessonGuide";

/** Height the desktop keeps free above itself while the bar shows. */
export const PREVIEW_BAR_H = 44;

/**
 * Teacher-facing only: sits above the practice computer, never inside it, so
 * the Job Card stays the one voice the student hears. Holds the guide and the
 * link to hand out.
 */
export default function TeacherPreviewBar({ guide }: { guide: TeacherGuide }) {
  const { lang } = useProgress();
  const lesson = useLesson()!;
  const [open, setOpen] = useState(false);
  const [share, setShare] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    const url = new URL(`/lessons/${lesson.taskKey}`, window.location.origin);
    url.searchParams.set("mode", lesson.mode);
    if (lang === "es") url.searchParams.set("lang", "es");
    setShare(url.href);
    try {
      await navigator.clipboard.writeText(url.href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div data-testid="teacher-preview" className="fixed inset-x-0 top-0 z-[80] text-[14px] text-white">
      <div className="flex items-center gap-2 overflow-x-auto bg-[#202124] px-3" style={{ height: PREVIEW_BAR_H }}>
        <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-[12px] font-semibold uppercase tracking-wide">
          {TEACHER_COPY.preview[lang]}
        </span>
        <span className="hidden min-w-0 flex-1 truncate text-white/80 sm:block">
          {lesson.title[lang]} · {TEACHER_COPY.previewNote[lang]}
        </span>
        <span className="flex-1 sm:hidden" />
        <button
          type="button"
          onClick={copyLink}
          className="flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-white/12 px-3 font-medium hover:bg-white/20"
        >
          <Link2 size={15} aria-hidden />
          {copied ? TEACHER_COPY.copied[lang] : TEACHER_COPY.copyLink[lang]}
        </button>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-white px-3 font-medium text-[#202124] hover:bg-white/90"
        >
          <BookOpen size={15} aria-hidden />
          {open ? TEACHER_COPY.hideGuide[lang] : TEACHER_COPY.guide[lang]}
        </button>
      </div>
      {(open || (share && !copied)) && (
        <div className="max-h-[70dvh] overflow-y-auto border-b border-[#dadce0] bg-white px-4 py-4 text-[#202124] shadow-[0_12px_32px_rgba(0,0,0,0.25)] sm:px-6">
          {share && !copied && (
            <label className="mb-4 flex flex-col gap-1 text-[14px] font-medium">
              {TEACHER_COPY.copyThis[lang]}
              <input
                readOnly
                value={share}
                onFocus={(e) => e.target.select()}
                className="rounded-lg border border-[#dadce0] px-3 py-2 font-normal"
              />
            </label>
          )}
          {open && (
            <>
              <h2 className="m-0 mb-1 text-[18px] font-medium">{lesson.title[lang]}</h2>
              <p className="mt-0 mb-4 text-[14px] text-[#5f6368]">
                {LESSON_COPY.supportLabel[lang]}: {LESSON_COPY[lesson.mode][lang]}
              </p>
              <LessonGuide guide={guide} lang={lang} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

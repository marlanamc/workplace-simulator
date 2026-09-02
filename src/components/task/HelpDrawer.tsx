"use client";

import { useEffect, useRef } from "react";
import type { Lesson } from "@/lib/task-types";

export default function HelpDrawer({
  open,
  onClose,
  kicker,
  lesson,
  tipLabel,
  gotItLabel,
}: {
  open: boolean;
  onClose: () => void;
  kicker: string;
  lesson: Lesson;
  tipLabel: string;
  gotItLabel: string;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-[75] flex justify-end bg-black/40" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={lesson.t}
        onClick={(e) => e.stopPropagation()}
        className="flex h-full min-h-0 w-full max-w-[420px] flex-col bg-white animate-slide-in"
      >
        <div className="flex items-start gap-3 p-6 pb-0">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-wide text-warning">
              {kicker}
            </div>
            <h3 className="mt-1.5 text-[20px] font-medium leading-tight">{lesson.t}</h3>
          </div>
          <div className="flex-1" />
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-[16px] text-text-secondary cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-6">
          <div className="flex flex-col gap-2.5">
            {lesson.s.map((text, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-border bg-white p-3.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-warning-tint text-[13px] font-semibold text-warning">
                  {i + 1}
                </span>
                <span className="text-[15px] leading-relaxed">{text}</span>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-surface-muted p-4 text-[14px] leading-relaxed text-text-secondary">
            <span className="font-semibold text-text-primary">{tipLabel}: </span>
            {lesson.tip}
          </div>
        </div>

        <div className="shrink-0 p-6 pt-0">
          <button
            onClick={onClose}
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-accent text-[15px] font-medium text-white hover:bg-accent-hover cursor-pointer"
          >
            {gotItLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

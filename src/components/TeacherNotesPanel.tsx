"use client";

import { useProgress } from "@/lib/progress-context";
import { useWindowManager } from "@/lib/window-manager";
import { jumpTabForTask } from "@/lib/curriculum-catalog";
import { SKILLS } from "@/lib/skills";
import type { TaskKey } from "@/lib/desktop-content";
import { TEACHER_NOTES_COPY } from "@/lib/teacher-notes-content";
import { X } from "lucide-react";

/**
 * The learner's inbox for real notes from their teacher (not the in-story
 * characters). Opened from the desktop toast. Each note shows what the learner
 * wrote, the teacher's suggestion, and a way back into the task.
 */
export default function TeacherNotesPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { pendingFeedback, dismissFeedback, lang } = useProgress();
  const { openApp } = useWindowManager();
  const c = TEACHER_NOTES_COPY[lang];

  if (!open || pendingFeedback.length === 0) return null;

  const openTask = (id: string, taskKey: string) => {
    const tab = jumpTabForTask(taskKey);
    dismissFeedback(id);
    onClose();
    if (tab) openApp("browser", { tab });
  };

  return (
    <div className="fixed inset-0 z-[86] flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[86vh] w-full max-w-[560px] flex-col overflow-hidden rounded-2xl bg-white text-[#202124] shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-[#e8eaed] px-6 py-4">
          <div>
            <h2 className="text-[18px] font-medium">{c.panelTitle}</h2>
            <p className="mt-1 text-[13px] leading-relaxed text-[#5f6368]">{c.panelIntro}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={c.close}
            className="-mr-1 shrink-0 rounded-full p-1.5 text-[#5f6368] hover:bg-[#f1f3f4] cursor-pointer"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
          {pendingFeedback.map((f) => (
            <article key={f.id} className="rounded-xl border border-[#dadce0] p-4">
              <div className="text-[12px] font-medium uppercase tracking-wide text-[#5f6368]">
                {SKILLS[f.taskKey as TaskKey] ?? f.taskKey}
              </div>

              <div className="mt-3 text-[11px] font-medium uppercase tracking-wide text-[#80868b]">{c.youWrote}</div>
              <dl className="mt-1 flex flex-col gap-2">
                {f.content.fields.map((field, i) => (
                  <div key={i}>
                    <dt className="text-[12px] text-[#5f6368]">{field.label}</dt>
                    <dd className="whitespace-pre-wrap text-[14px] leading-relaxed text-[#3c4043]">
                      {field.value.trim() || <span className="text-[#80868b]">{c.blank}</span>}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-3 rounded-lg bg-[#e8f0fe] px-3 py-2.5">
                <div className="text-[11px] font-medium uppercase tracking-wide text-[#1967d2]">{c.teacherSaid}</div>
                <p className="mt-1 whitespace-pre-wrap text-[14px] leading-relaxed text-[#202124]">{f.note}</p>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                {jumpTabForTask(f.taskKey) && (
                  <button
                    type="button"
                    onClick={() => openTask(f.id, f.taskKey)}
                    className="inline-flex min-h-[40px] items-center rounded-full bg-[#1a73e8] px-4 text-[14px] font-medium text-white cursor-pointer"
                  >
                    {c.openTask}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => dismissFeedback(f.id)}
                  className="text-[13px] font-medium text-[#5f6368] hover:underline cursor-pointer"
                >
                  {c.gotIt}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

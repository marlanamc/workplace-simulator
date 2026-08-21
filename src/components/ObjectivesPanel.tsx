"use client";

import { useRef, useState } from "react";
import { useProgress } from "@/lib/progress-context";
import { TRACKS, TASK_INFO, isTrackComplete } from "@/lib/tracks-content";
import { useClickOutside } from "@/lib/use-click-outside";

export default function ObjectivesPanel() {
  const [open, setOpen] = useState(false);
  const { completedTaskKeys, currentTrack, certificateTrackKeys } = useProgress();
  const panelRef = useRef<HTMLDivElement>(null);
  useClickOutside(panelRef, open, () => setOpen(false));

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Objectives"
        className="fixed right-4 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-1 rounded-l-xl bg-white px-2.5 py-3 text-[var(--text-primary)] shadow-[0_8px_24px_rgba(0,0,0,0.18)] cursor-pointer hover:bg-[var(--surface-muted)]"
      >
        <span aria-hidden className="text-[16px]">🎯</span>
        <span className="text-[10px] font-semibold uppercase tracking-wide [writing-mode:vertical-rl]">
          Objectives
        </span>
      </button>

      {open && (
        <div
          ref={panelRef}
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[380px] flex-col gap-5 overflow-y-auto bg-white p-6 shadow-[-8px_0_40px_rgba(0,0,0,0.25)] animate-slide-in"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wide text-[var(--accent)]">
                Your progress
              </div>
              <h2 className="mt-1 text-[20px] font-medium leading-tight">{currentTrack.title}</h2>
              <p className="mt-1 text-[13px] text-[var(--text-secondary)]">{currentTrack.subtitle}</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[16px] text-[var(--text-secondary)] cursor-pointer"
            >
              ✕
            </button>
          </div>

          {certificateTrackKeys.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {certificateTrackKeys.map((key) => {
                const track = TRACKS.find((t) => t.key === key);
                if (!track) return null;
                return (
                  <span
                    key={key}
                    className="flex items-center gap-1.5 rounded-full bg-[var(--warning-tint)] px-3 py-1.5 text-[12px] font-medium text-[var(--warning)]"
                  >
                    🏆 {track.title}
                  </span>
                );
              })}
            </div>
          )}

          <div className="flex flex-col gap-3">
            {TRACKS.map((track) => {
              const complete = isTrackComplete(track, completedTaskKeys);
              const isCurrent = track.key === currentTrack.key && !complete;
              return (
                <div
                  key={track.key}
                  className={`rounded-xl border p-4 ${
                    isCurrent ? "border-[var(--accent)] bg-[var(--accent-tint)]" : "border-[var(--border)]"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[14px] font-semibold text-[var(--text-primary)]">{track.title}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                        complete
                          ? "bg-[var(--success-tint)] text-[var(--success)]"
                          : isCurrent
                            ? "bg-[var(--accent)] text-white"
                            : "bg-[var(--surface-muted)] text-[var(--text-tertiary)]"
                      }`}
                    >
                      {complete ? "Complete" : isCurrent ? "In progress" : "Up next"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {track.taskKeys.map((taskKey) => {
                      const info = TASK_INFO[taskKey];
                      const done = completedTaskKeys.includes(taskKey);
                      return (
                        <div key={taskKey} className="flex items-start gap-2.5">
                          <span
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                              done
                                ? "bg-[var(--success)] text-white"
                                : "bg-white text-[var(--text-tertiary)] ring-1 ring-inset ring-[var(--border)]"
                            }`}
                          >
                            {done ? "✓" : ""}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div
                              className={`text-[13px] font-medium ${done ? "text-[var(--text-tertiary)] line-through" : "text-[var(--text-primary)]"}`}
                            >
                              {info.label}
                            </div>
                            <div className="text-[12px] text-[var(--text-tertiary)]">
                              {info.built ? info.description : `${info.description} (not built yet)`}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

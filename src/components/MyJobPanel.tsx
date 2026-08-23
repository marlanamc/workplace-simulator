"use client";

import { useState } from "react";
import {
  ACTS,
  LEVELS,
  TRACKS,
  TASK_INFO,
  TASK_LOCATIONS,
  isLevelComplete,
  levelForTrack,
  nextLevel,
  nextTaskInTrack,
  furthestLevelIndex,
  taskKeysForLevel,
  type Level,
} from "@/lib/tracks-content";
import { useProgress } from "@/lib/progress-context";
import { useWindowManager } from "@/lib/window-manager";
import { TASK_ICONS, Flag, Lock, Trophy } from "@/lib/icons";
import { Check } from "lucide-react";
import { sittingTitle, jobTitle } from "@/lib/shift-spine";
import { SHELF_INSET, SHELF_RESERVE } from "@/components/Shelf";

export default function MyJobPanel({
  open,
  onOpenChange,
  onOpenAwards,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenAwards: () => void;
}) {
  const {
    completedTaskKeys,
    currentTrack,
    points,
    justEarnedPoints,
    restartLevel,
    lang,
  } = useProgress();
  const { openApp } = useWindowManager();
  const [levelsOpen, setLevelsOpen] = useState(false);
  const [pendingReplay, setPendingReplay] = useState<string | null>(null);

  const currentLevel = levelForTrack(currentTrack.key);
  const currentLevelIndex = LEVELS.findIndex((l) => l.key === currentLevel.key);
  const reachedIndex = furthestLevelIndex(completedTaskKeys);
  const upcoming = isLevelComplete(currentLevel, completedTaskKeys) ? nextLevel(currentLevel) : null;

  const levelTracks = TRACKS.filter((t) => currentLevel.trackKeys.includes(t.key));
  const nextTaskKey = nextTaskInTrack(currentTrack, completedTaskKeys);
  const nextTaskLocation = nextTaskKey ? TASK_LOCATIONS[nextTaskKey] : null;

  if (!open) return null;

  const goToLevel = (level: Level, index: number) => {
    if (index > reachedIndex) return;
    onOpenChange(false);
    openApp("browser", { tab: level.firstTabKey });
    setLevelsOpen(false);
    setPendingReplay(null);
  };

  return (
    <>
      <div
        aria-hidden
        onClick={() => onOpenChange(false)}
        className="fixed inset-x-0 top-0 z-40"
        style={{ bottom: SHELF_RESERVE }}
      />
      <div
        className="fixed z-50 flex w-[min(100%-24px,400px)] flex-col overflow-hidden rounded-2xl animate-slide-in"
        style={{
          top: SHELF_INSET,
          right: SHELF_INSET,
          bottom: SHELF_RESERVE + 8,
          background: "#fff",
          boxShadow: "0 16px 48px rgba(0,0,0,0.32)",
        }}
      >
        <div className="shrink-0 px-5 pb-5 pt-5 text-white" style={{ background: "#202124" }}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-[22px] font-medium leading-tight tracking-[-0.01em]">
                {jobTitle(currentLevel)} · {sittingTitle(currentLevel)}
              </div>
              {upcoming && (
                <div className="mt-1 text-[13px] text-white/70">
                  {lang === "en" ? `Next: ${sittingTitle(upcoming)}` : `Siguiente: ${sittingTitle(upcoming)}`}
                </div>
              )}
            </div>
            <button
              onClick={() => onOpenChange(false)}
              aria-label={lang === "en" ? "Close" : "Cerrar"}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[16px] text-white/70 hover:bg-white/10 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span
              className={`flex items-center gap-1.5 text-[14px] font-medium tabular-nums transition-transform ${
                justEarnedPoints ? "scale-110" : ""
              }`}
            >
              <span aria-hidden>★</span>
              {points}
              {justEarnedPoints && (
                <span className="text-[12px] font-semibold text-[#81c995]">+{justEarnedPoints}</span>
              )}
            </span>
            <button
              onClick={onOpenAwards}
              className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[13px] font-medium hover:bg-white/16 cursor-pointer"
            >
              <Trophy size={14} strokeWidth={2.25} aria-hidden />
              {lang === "en" ? "Awards" : "Premios"}
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-5 pt-4">
          {/* One quest list: done gets a check, the current job is the one
              highlighted (and clickable) card, later jobs wait quietly. */}
          <ul className="flex flex-col gap-1">
            {levelTracks.flatMap((track) => track.taskKeys).map((taskKey) => {
              const info = TASK_INFO[taskKey];
              const done = completedTaskKeys.includes(taskKey);
              const isCurrent = taskKey === nextTaskKey && Boolean(nextTaskLocation);

              if (isCurrent && nextTaskLocation) {
                const Icon = TASK_ICONS[taskKey];
                return (
                  <li key={taskKey}>
                    <button
                      onClick={() => {
                        onOpenChange(false);
                        openApp(nextTaskLocation.appKey, { tab: nextTaskLocation.tab, section: nextTaskLocation.section });
                      }}
                      className="flex w-full items-start gap-3.5 rounded-xl bg-[var(--accent-tint)] p-4 text-left hover:brightness-[0.98] cursor-pointer"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                        <Icon size={18} strokeWidth={2.25} aria-hidden />
                      </span>
                      <span className="min-w-0 text-[16px] font-medium leading-snug text-[var(--text-primary)]">
                        {info.dispatch[lang]}
                      </span>
                    </button>
                  </li>
                );
              }

              return (
                <li key={taskKey} className="flex items-start gap-2.5 px-1 py-1.5">
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: done ? "var(--success-tint)" : "var(--surface-muted)",
                      color: done ? "var(--success)" : "var(--text-tertiary)",
                    }}
                    aria-hidden
                  >
                    {done ? <Check size={14} strokeWidth={2.5} /> : null}
                  </span>
                  <span
                    className={`text-[15px] leading-snug ${
                      done ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"
                    }`}
                  >
                    {info.label[lang]}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 border-t border-[var(--border)] pt-4">
            <button
              onClick={() => setLevelsOpen((v) => !v)}
              className="flex w-full items-center justify-between text-[14px] font-medium text-[var(--text-secondary)] cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Flag size={15} strokeWidth={2.25} aria-hidden />
                {lang === "en" ? "Jump to or replay a level" : "Ir a o repetir un nivel"}
              </span>
              <span aria-hidden>{levelsOpen ? "▲" : "▼"}</span>
            </button>

            {levelsOpen && (
              <div className="mt-3 flex flex-col gap-1">
                {ACTS.map((act) => {
                  const actLevels = act.levelKeys
                    .map((key) => LEVELS.findIndex((l) => l.key === key))
                    .filter((i) => i !== -1);
                  if (actLevels.length === 0) return null;
                  return (
                    <div key={act.key} className="mb-1 last:mb-0">
                      <div className="px-1 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">
                        {act.title}
                      </div>
                      {actLevels.map((i) => {
                        const level = LEVELS[i];
                        const locked = i > reachedIndex;
                        const isCurrent = i === currentLevelIndex;
                        const complete = !locked && isLevelComplete(level, completedTaskKeys);
                        const canReplay =
                          !locked && taskKeysForLevel(level).some((k) => completedTaskKeys.includes(k));
                        return (
                          <div key={level.key} className={`rounded-xl ${isCurrent ? "bg-[var(--accent-tint)]" : ""}`}>
                            <div className="flex items-center">
                              <button
                                onClick={() => goToLevel(level, i)}
                                disabled={locked}
                                className={`flex min-w-0 flex-1 items-center gap-2.5 rounded-xl px-2 py-2 text-left text-[14px] ${
                                  locked
                                    ? "cursor-not-allowed text-[var(--text-tertiary)]"
                                    : "cursor-pointer hover:bg-[var(--surface-muted)]"
                                }`}
                              >
                                <span aria-hidden className="flex h-4 w-4 items-center justify-center text-[var(--text-secondary)]">
                                  {locked ? <Lock size={14} /> : complete ? <Check size={16} strokeWidth={2.5} /> : <Flag size={14} />}
                                </span>
                                <span className="min-w-0 flex-1 truncate font-medium">{level.title}</span>
                              </button>
                              {canReplay && pendingReplay !== level.key && (
                                <button
                                  onClick={() => setPendingReplay(level.key)}
                                  className="mr-1 shrink-0 rounded-full px-2 py-1 text-[12px] font-medium text-[var(--accent)] hover:bg-[var(--accent-tint)] cursor-pointer"
                                >
                                  {lang === "en" ? "Replay" : "Repetir"}
                                </button>
                              )}
                            </div>
                            {pendingReplay === level.key && (
                              <div className="px-2 pb-2.5">
                                <p className="text-[12px] leading-snug text-[var(--text-secondary)]">
                                  {lang === "en"
                                    ? "This clears your progress for this level only."
                                    : "Esto borra tu progreso solo de este nivel."}
                                </p>
                                <div className="mt-1.5 flex gap-3">
                                  <button
                                    onClick={() => {
                                      restartLevel(level);
                                      setPendingReplay(null);
                                      setLevelsOpen(false);
                                      onOpenChange(false);
                                      openApp("browser", { tab: level.firstTabKey });
                                    }}
                                    className="text-[12px] font-medium text-[var(--accent)] cursor-pointer"
                                  >
                                    {lang === "en" ? "Yes, replay" : "Sí, repetir"}
                                  </button>
                                  <button
                                    onClick={() => setPendingReplay(null)}
                                    className="text-[12px] text-[var(--text-tertiary)] cursor-pointer"
                                  >
                                    {lang === "en" ? "Cancel" : "Cancelar"}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

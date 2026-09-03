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
  firstTabForLevel,
  type Level,
} from "@/lib/tracks-content";
import { useProgress } from "@/lib/progress-context";
import { useWindowManager } from "@/lib/window-manager";
import { Flag, Lock, Trophy } from "@/lib/icons";
import { Check } from "lucide-react";
import { dayTitle, sittingTitle, jobTitle, workdaysInAct, dayInAct, dayLabel } from "@/lib/shift-spine";
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
    bridgePath,
  } = useProgress();
  const { openApp } = useWindowManager();
  const [levelsOpen, setLevelsOpen] = useState(false);
  const [pendingReplay, setPendingReplay] = useState<string | null>(null);

  const currentLevel = levelForTrack(currentTrack.key);
  const currentLevelIndex = LEVELS.findIndex((l) => l.key === currentLevel.key);
  const reachedIndex = furthestLevelIndex(completedTaskKeys, bridgePath);
  const upcoming = isLevelComplete(currentLevel, completedTaskKeys, bridgePath) ? nextLevel(currentLevel) : null;

  const scopedTrackKeys =
    bridgePath && currentLevel.pathTracks ? [currentLevel.pathTracks[bridgePath]] : currentLevel.trackKeys;
  const levelTracks = TRACKS.filter((t) => scopedTrackKeys.includes(t.key));
  const nextTaskKey = nextTaskInTrack(currentTrack, completedTaskKeys);
  const nextTaskLocation = nextTaskKey ? TASK_LOCATIONS[nextTaskKey] : null;
  const actWorkdays = workdaysInAct(currentLevel);
  const currentDayInAct = dayInAct(currentLevel);

  if (!open) return null;

  const goToLevel = (level: Level, index: number) => {
    if (index > reachedIndex) return;
    onOpenChange(false);
    openApp("browser", { tab: firstTabForLevel(level, bridgePath) });
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
                {jobTitle(currentLevel)} · {dayTitle(currentLevel, lang)}
              </div>
              {upcoming && (
                <div className="mt-1 text-[13px] text-white/70">
                  {lang === "en" ? `Next: ${sittingTitle(upcoming)}` : `Siguiente: ${sittingTitle(upcoming)}`}
                </div>
              )}
              {actWorkdays.length > 0 && (
                <div
                  className="mt-3 flex items-center gap-1.5"
                  role="img"
                  aria-label={
                    currentDayInAct > 0
                      ? dayLabel(currentLevel, lang)
                      : lang === "en"
                        ? `${actWorkdays.length} days in this job`
                        : `${actWorkdays.length} días en este trabajo`
                  }
                >
                  {actWorkdays.map((day, i) => {
                    const n = i + 1;
                    const status = n < currentDayInAct ? "done" : n === currentDayInAct ? "current" : "ahead";
                    return (
                      <span
                        key={day.key}
                        aria-hidden
                        className={
                          status === "current"
                            ? "h-2 w-2 rounded-full bg-white"
                            : status === "done"
                              ? "h-1.5 w-1.5 rounded-full bg-white/70"
                              : "h-1.5 w-1.5 rounded-full bg-white/25"
                        }
                      />
                    );
                  })}
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
          {/* One quest list: done gets a check, the current job is a highlighted
              row (backup open), later jobs wait quietly. Dispatch copy lives
              only on the desktop briefing. */}
          <ul className="flex flex-col gap-1">
            {levelTracks.flatMap((track) => track.taskKeys).map((taskKey) => {
              const info = TASK_INFO[taskKey];
              const done = completedTaskKeys.includes(taskKey);
              const isCurrent = taskKey === nextTaskKey && Boolean(nextTaskLocation);

              if (isCurrent && nextTaskLocation) {
                return (
                  <li key={taskKey}>
                    <button
                      onClick={() => {
                        onOpenChange(false);
                        openApp(nextTaskLocation.appKey, {
                          tab: nextTaskLocation.tab,
                          section: nextTaskLocation.section,
                        });
                      }}
                      className="flex w-full items-start gap-2.5 rounded-lg px-1 py-1.5 text-left cursor-pointer hover:bg-accent-tint"
                    >
                      <span
                        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent"
                        aria-hidden
                      >
                        <span className="h-2 w-2 rounded-full bg-white" />
                      </span>
                      <span className="min-w-0 text-[15px] font-medium leading-snug text-text-primary">
                        {info.label[lang]}
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
                      done ? "text-text-primary" : "text-text-tertiary"
                    }`}
                  >
                    {info.label[lang]}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 border-t border-border pt-4">
            <button
              onClick={() => setLevelsOpen((v) => !v)}
              className="flex w-full items-center justify-between text-[14px] font-medium text-text-secondary cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Flag size={15} strokeWidth={2.25} aria-hidden />
                {lang === "en" ? "Jump to or replay a day" : "Ir a o repetir un día"}
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
                      <div className="px-1 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wide text-text-tertiary">
                        {act.title}
                      </div>
                      {actLevels.map((i) => {
                        const level = LEVELS[i];
                        const locked = i > reachedIndex;
                        const isCurrent = i === currentLevelIndex;
                        const complete = !locked && isLevelComplete(level, completedTaskKeys, bridgePath);
                        const canReplay =
                          !locked && taskKeysForLevel(level, bridgePath).some((k) => completedTaskKeys.includes(k));
                        return (
                          <div key={level.key} className={`rounded-xl ${isCurrent ? "bg-accent-tint" : ""}`}>
                            <div className="flex items-center">
                              <button
                                onClick={() => goToLevel(level, i)}
                                disabled={locked}
                                className={`flex min-w-0 flex-1 items-center gap-2.5 rounded-xl px-2 py-2 text-left text-[14px] ${
                                  locked
                                    ? "cursor-not-allowed text-text-tertiary"
                                    : "cursor-pointer hover:bg-surface-muted"
                                }`}
                              >
                                <span aria-hidden className="flex h-4 w-4 items-center justify-center text-text-secondary">
                                  {locked ? <Lock size={14} /> : complete ? <Check size={16} strokeWidth={2.5} /> : <Flag size={14} />}
                                </span>
                                <span className="min-w-0 flex-1 truncate font-medium">{dayTitle(level, lang)}</span>
                              </button>
                              {canReplay && pendingReplay !== level.key && (
                                <button
                                  onClick={() => setPendingReplay(level.key)}
                                  className="mr-1 shrink-0 rounded-full px-2 py-1 text-[12px] font-medium text-accent hover:bg-accent-tint cursor-pointer"
                                >
                                  {lang === "en" ? "Replay" : "Repetir"}
                                </button>
                              )}
                            </div>
                            {pendingReplay === level.key && (
                              <div className="px-2 pb-2.5">
                                <p className="text-[12px] leading-snug text-text-secondary">
                                  {lang === "en"
                                    ? "This clears your progress for this day only."
                                    : "Esto borra tu progreso solo de este día."}
                                </p>
                                <div className="mt-1.5 flex gap-3">
                                  <button
                                    onClick={() => {
                                      restartLevel(level);
                                      setPendingReplay(null);
                                      setLevelsOpen(false);
                                      onOpenChange(false);
                                      openApp("browser", { tab: firstTabForLevel(level, bridgePath) });
                                    }}
                                    className="text-[12px] font-medium text-accent cursor-pointer"
                                  >
                                    {lang === "en" ? "Yes, replay" : "Sí, repetir"}
                                  </button>
                                  <button
                                    onClick={() => setPendingReplay(null)}
                                    className="text-[12px] text-text-tertiary cursor-pointer"
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

"use client";

import { useState } from "react";
import {
  TASK_INFO,
  TASK_LOCATIONS,
  TRACKS,
  LEVELS,
  nextTaskInTrack,
  furthestLevelIndex,
  taskKeysForLevel,
  type Level,
} from "@/lib/tracks-content";
import { DESKTOP_COPY, type Lang } from "@/lib/desktop-content";
import { useProgress } from "@/lib/progress-context";
import { TASK_ICONS, Hourglass, Coffee } from "@/lib/icons";
import { useWindowManager } from "@/lib/window-manager";

const shadow = { textShadow: "0 2px 18px rgba(0,0,0,0.35)" };

export default function ShiftBriefing({
  lang = "en",
  onSeeAwards,
}: {
  lang?: Lang;
  onSeeAwards: () => void;
}) {
  const c = DESKTOP_COPY[lang];
  const { completedTaskKeys, currentTrack, restartLevel } = useProgress();
  const { openApp } = useWindowManager();
  const [replayOpen, setReplayOpen] = useState(false);
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const totalTaskCount = TRACKS.reduce((n, t) => n + t.taskKeys.length, 0);
  const nextTaskKey = nextTaskInTrack(currentTrack, completedTaskKeys);
  const nextTaskLocation = nextTaskKey ? TASK_LOCATIONS[nextTaskKey] : null;
  const nextTaskInfo = nextTaskKey && nextTaskLocation ? TASK_INFO[nextTaskKey] : null;
  const comingSoon = nextTaskKey !== null && nextTaskInfo === null;
  const allDone = nextTaskKey === null;

  const furthest = furthestLevelIndex(completedTaskKeys);
  const replayable = LEVELS.filter((level, i) => {
    if (i > furthest) return false;
    return taskKeysForLevel(level).some((k) => completedTaskKeys.includes(k));
  });

  const confirmRestart = (level: Level) => {
    restartLevel(level);
    setPendingKey(null);
    setReplayOpen(false);
    openApp("browser", { tab: level.firstTabKey });
  };

  const BriefingIcon = nextTaskKey && nextTaskInfo ? TASK_ICONS[nextTaskKey] : comingSoon ? Hourglass : Coffee;
  const headline = nextTaskInfo
    ? nextTaskInfo.label
    : comingSoon
      ? c.comingSoonHeadline
      : c.allDoneHeadline;
  const body = nextTaskInfo ? nextTaskInfo.dispatch : comingSoon ? c.comingSoonBody : c.allDoneBody;

  return (
    <div className="text-white" style={shadow}>
      <BriefingIcon size={44} strokeWidth={1.75} className="text-white" aria-hidden />
      <h1 className="mt-3 max-w-[18ch] text-[28px] font-medium leading-[1.15] tracking-[-0.02em]">
        {headline}
      </h1>
      <p className="mt-2 max-w-[36ch] text-[16px] leading-relaxed text-white/90">{body}</p>

      {nextTaskLocation && (
        <button
          onClick={() => openApp(nextTaskLocation.appKey, { tab: nextTaskLocation.tab })}
          className="mt-5 inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-6 text-[16px] font-medium text-[#202124] hover:bg-white/90 cursor-pointer"
        >
          {nextTaskLocation.ctaLabel}
        </button>
      )}
      {allDone && (
        <button
          onClick={onSeeAwards}
          className="mt-5 inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-6 text-[16px] font-medium text-[#202124] hover:bg-white/90 cursor-pointer"
        >
          {c.allDoneCta}
        </button>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-white/80">
        <span>
          {completedTaskKeys.length} of {totalTaskCount} done
        </span>
        {replayable.length > 0 && (
          <button
            onClick={() => {
              setReplayOpen((v) => !v);
              setPendingKey(null);
            }}
            className="underline decoration-white/40 underline-offset-4 hover:text-white cursor-pointer"
          >
            {c.replayLevel}
          </button>
        )}
      </div>

      {replayOpen && (
        <div className="mt-3 flex flex-col gap-1">
          {replayable.map((level) =>
            pendingKey === level.key ? (
              <div key={level.key} className="rounded-xl bg-black/25 px-3 py-2.5">
                <p className="text-[14px] font-medium text-white">{level.title}</p>
                <p className="mt-1 text-[13px] leading-snug text-white/90">{c.replayConfirm}</p>
                <div className="mt-2 flex gap-3">
                  <button
                    onClick={() => confirmRestart(level)}
                    className="text-[13px] font-medium text-white underline decoration-white/40 underline-offset-4 cursor-pointer"
                  >
                    {c.replayConfirmCta}
                  </button>
                  <button
                    onClick={() => setPendingKey(null)}
                    className="text-[13px] text-white/70 hover:text-white cursor-pointer"
                  >
                    {c.replayCancel}
                  </button>
                </div>
              </div>
            ) : (
              <button
                key={level.key}
                onClick={() => setPendingKey(level.key)}
                className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-[14px] text-white/90 hover:bg-white/10 cursor-pointer"
              >
                <span>{level.title}</span>
                <span className="shrink-0 text-[13px] text-white/70">{c.replayShort}</span>
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}

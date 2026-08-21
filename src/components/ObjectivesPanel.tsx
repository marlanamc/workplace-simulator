"use client";

import type { TaskKey } from "@/lib/desktop-content";
import {
  TRACKS,
  TASK_INFO,
  TASK_LOCATIONS,
  LEVELS,
  TAB_LEVEL_KEYS,
  isTrackComplete,
  levelForTrack,
} from "@/lib/tracks-content";
import { useProgress } from "@/lib/progress-context";
import { useWindowManager } from "@/lib/window-manager";
import { TASK_ICONS, TRACK_ICONS } from "@/lib/icons";
import { Check } from "lucide-react";
import { SHELF_INSET, SHELF_RESERVE } from "@/components/Shelf";

export default function ObjectivesPanel({
  open,
  onOpenChange,
  onOpenAwards,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenAwards: () => void;
}) {
  const { completedTaskKeys, currentTrack, certificateTrackKeys } = useProgress();
  const { browserTab, active: activeApp, openApp } = useWindowManager();

  const progressLevel = levelForTrack(currentTrack.key);
  const viewedLevelKey = activeApp === "browser" ? TAB_LEVEL_KEYS[browserTab] : undefined;
  const currentLevel = (viewedLevelKey && LEVELS.find((l) => l.key === viewedLevelKey)) || progressLevel;
  const levelTracks = TRACKS.filter((t) => currentLevel.trackKeys.includes(t.key));
  const nextKey =
    levelTracks.flatMap((t) => t.taskKeys).find((k) => !completedTaskKeys.includes(k)) ?? null;
  const lookingBack = Boolean(viewedLevelKey && viewedLevelKey !== progressLevel.key);
  const levelDone = levelTracks.every((t) => isTrackComplete(t, completedTaskKeys));

  const openTask = (taskKey: TaskKey) => {
    const loc = TASK_LOCATIONS[taskKey];
    if (!loc) return;
    onOpenChange(false);
    openApp(loc.appKey, { tab: loc.tab });
  };

  if (!open) return null;

  return (
    <>
      <div
        aria-hidden
        onClick={() => onOpenChange(false)}
        className="fixed inset-x-0 top-0 z-40"
        style={{ bottom: SHELF_RESERVE }}
      />
      <div
        className="fixed z-50 flex w-[min(100%-24px,360px)] flex-col overflow-hidden animate-slide-in"
        style={{
          top: SHELF_INSET,
          right: SHELF_INSET,
          bottom: SHELF_RESERVE + 8,
          background: "#f3e6d4",
          color: "#1c1410",
          boxShadow: "0 16px 48px rgba(0,0,0,0.32), 0 1px 0 rgba(255,255,255,0.4) inset",
          borderRadius: 4,
        }}
      >
        <div
          className="relative flex h-5 shrink-0 items-center justify-center"
          style={{ background: "linear-gradient(180deg, #e0c15a 0%, #c9a227 48%, #8a7018 100%)" }}
          aria-hidden
        >
          <div
            className="h-3.5 w-3.5 rounded-full"
            style={{ background: "radial-gradient(circle at 35% 30%, #f4e6b0, #8a7018)" }}
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-5 pt-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-[22px] font-medium leading-tight tracking-[-0.02em]">{currentLevel.title}</h2>
              {lookingBack && (
                <p className="mt-1 text-[14px] leading-snug text-[#6a4e32]">Peeking at an earlier shift.</p>
              )}
              {levelDone && !lookingBack && (
                <p className="mt-1 text-[14px] leading-snug text-[#6a4e32]">This shift is done. Replay it anytime.</p>
              )}
            </div>
            <button
              onClick={() => onOpenChange(false)}
              aria-label="Close"
              className="flex h-9 w-9 shrink-0 items-center justify-center text-[18px] text-[#6a4e32] hover:text-[#1c1410] cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="mt-5 flex flex-col gap-6">
            {levelTracks.map((track) => {
              const trackComplete = isTrackComplete(track, completedTaskKeys);
              return (
                <section key={track.key}>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const Icon = TRACK_ICONS[track.key];
                      return Icon ? <Icon size={16} strokeWidth={2.25} aria-hidden /> : null;
                    })()}
                    <h3 className="text-[16px] font-medium leading-tight">{track.title}</h3>
                  </div>
                  <p className="mt-0.5 pl-6 text-[13px] leading-snug text-[#6a4e32]">{track.subtitle}</p>

                  <ul className="mt-3 flex flex-col">
                    {track.taskKeys.map((taskKey) => {
                      const info = TASK_INFO[taskKey];
                      const done = completedTaskKeys.includes(taskKey);
                      const isNext = taskKey === nextKey;
                      const loc = TASK_LOCATIONS[taskKey];
                      const canOpen = Boolean(loc && info.built);
                      const Row = canOpen ? "button" : "div";
                      return (
                        <li key={taskKey}>
                          <Row
                            {...(canOpen
                              ? {
                                  type: "button" as const,
                                  onClick: () => openTask(taskKey),
                                }
                              : {})}
                            className={`flex w-full items-start gap-2.5 py-2 text-left ${
                              canOpen ? "cursor-pointer hover:underline" : ""
                            }`}
                          >
                            <span
                              className="mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center"
                              style={{
                                border: done ? "none" : "1.5px solid #1c1410",
                                borderRadius: 4,
                                background: done ? "#1c1410" : "transparent",
                                color: done ? "#f3e6d4" : "#1c1410",
                              }}
                              aria-hidden
                            >
                              {done ? (
                                <Check size={14} strokeWidth={3} />
                              ) : isNext ? (
                                (() => {
                                  const Icon = TASK_ICONS[taskKey];
                                  return <Icon size={13} strokeWidth={2.25} />;
                                })()
                              ) : null}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span
                                className={`block text-[15px] leading-snug ${
                                  done ? "text-[#6a4e32]" : "font-medium text-[#1c1410]"
                                }`}
                              >
                                {info.label}
                              </span>
                              {isNext && !done && (
                                <span className="mt-0.5 block text-[13px] leading-snug text-[#6a4e32]">
                                  {info.dispatch}
                                </span>
                              )}
                              {!info.built && (
                                <span className="mt-0.5 block text-[13px] leading-snug text-[#6a4e32]">
                                  Not built yet
                                </span>
                              )}
                            </span>
                          </Row>
                        </li>
                      );
                    })}
                    {trackComplete && (
                      <li className="pl-[30px] pt-1 text-[13px] text-[#6a4e32]">
                        <button
                          type="button"
                          onClick={onOpenAwards}
                          className="underline decoration-[#6a4e32]/40 underline-offset-4 hover:text-[#1c1410] cursor-pointer"
                        >
                          See the {track.awardEmoji} award
                        </button>
                      </li>
                    )}
                  </ul>
                </section>
              );
            })}
          </div>

          {certificateTrackKeys.length > 0 && (
            <div className="mt-auto flex items-center gap-2 pt-6">
              {TRACKS.filter((t) => certificateTrackKeys.includes(t.key)).map((track) => (
                <button
                  key={track.key}
                  onClick={onOpenAwards}
                  title={track.title}
                  aria-label={`${track.title} award`}
                  className="text-[22px] leading-none cursor-pointer"
                >
                  {track.awardEmoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

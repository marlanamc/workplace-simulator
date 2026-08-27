"use client";

import {
  TASK_INFO,
  TASK_LOCATIONS,
  nextTaskInTrack,
  taskKeysForLevel,
  levelForTrack,
} from "@/lib/tracks-content";
import { DESKTOP_COPY, type Lang } from "@/lib/desktop-content";
import { useProgress } from "@/lib/progress-context";
import { TASK_ICONS, Hourglass, Coffee } from "@/lib/icons";
import { useWindowManager } from "@/lib/window-manager";
import { HANDOFF_CTA, SHIFT_MOMENT } from "@/lib/story-beats";
import { TASK_INTRO } from "@/lib/task-intros";

/**
 * Lock-screen widget: one headline, one button, and one dot per job in
 * THIS level (1-4 dots, never the whole curriculum). Everything else —
 * story flavor, global progress, replay — lives in the My Job panel for
 * whoever goes looking.
 */
export default function ShiftBriefing({
  lang = "en",
  onSeeAwards,
}: {
  lang?: Lang;
  onSeeAwards: () => void;
}) {
  const c = DESKTOP_COPY[lang];
  const { completedTaskKeys, currentTrack } = useProgress();
  const { openApp } = useWindowManager();

  const nextTaskKey = nextTaskInTrack(currentTrack, completedTaskKeys);
  const nextTaskLocation = nextTaskKey ? TASK_LOCATIONS[nextTaskKey] : null;
  const nextTaskInfo = nextTaskKey && nextTaskLocation ? TASK_INFO[nextTaskKey] : null;
  const comingSoon = nextTaskKey !== null && nextTaskInfo === null;
  const allDone = nextTaskKey === null;

  const levelTaskKeys = taskKeysForLevel(levelForTrack(currentTrack.key));

  const BriefingIcon = nextTaskKey && nextTaskInfo ? TASK_ICONS[nextTaskKey] : comingSoon ? Hourglass : Coffee;
  const headline = nextTaskInfo
    ? nextTaskInfo.dispatch[lang]
    : comingSoon
      ? c.comingSoonHeadline
      : c.allDoneHeadline;
  // The story beat that used to open each task as a full-screen card inside
  // the app. It belongs here: this is the one screen whose button really does
  // open the thing it names.
  const moment = nextTaskKey && nextTaskInfo ? SHIFT_MOMENT[nextTaskKey][lang] : null;
  const body = comingSoon
    ? c.comingSoonBody
    : allDone
      ? c.allDoneBody
      : nextTaskKey && nextTaskInfo
        ? TASK_INTRO[nextTaskKey][lang].body
        : null;

  return (
    <div
      className="rounded-[28px] px-6 py-6 text-white backdrop-blur-2xl"
      style={{
        background: "rgba(32, 32, 32, 0.76)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.08), 0 16px 40px rgba(0,0,0,0.28)",
      }}
      data-testid="shift-briefing"
    >
      <BriefingIcon size={36} strokeWidth={1.75} className="text-white" aria-hidden />
      {moment ? (
        <p className="mt-3 text-[13px] font-bold uppercase tracking-[0.16em] text-white/80">
          {moment}
        </p>
      ) : null}
      <h1 className="mt-1.5 max-w-[28ch] text-[28px] font-medium leading-[1.15] tracking-[-0.02em]">
        {headline}
      </h1>
      {body ? <p className="mt-2 max-w-[36ch] text-[16px] leading-relaxed text-white/90">{body}</p> : null}

      {nextTaskLocation && (
        <button
          onClick={() =>
            openApp(nextTaskLocation.appKey, {
              tab: nextTaskLocation.tab,
              section: nextTaskLocation.section,
            })
          }
          className="mt-5 inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-6 text-[16px] font-medium text-[#202124] hover:bg-white/90 cursor-pointer"
        >
          {nextTaskKey && HANDOFF_CTA[nextTaskKey]
            ? HANDOFF_CTA[nextTaskKey][lang]
            : nextTaskLocation.ctaLabel}
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

      {!allDone && levelTaskKeys.length > 1 && (
        <div className="mt-6 flex items-center gap-2" aria-hidden>
          {levelTaskKeys.map((taskKey) => (
            <span
              key={taskKey}
              className="h-3 w-3 rounded-full"
              style={{
                background: completedTaskKeys.includes(taskKey)
                  ? "var(--success)"
                  : taskKey === nextTaskKey
                    ? "#fff"
                    : "rgba(255,255,255,0.35)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

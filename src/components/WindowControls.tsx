"use client";

import type { AppKey } from "@/lib/desktop-content";
import { useWindowManager } from "@/lib/window-manager";
import { useProgress } from "@/lib/progress-context";
import { useNudge } from "@/lib/use-nudge";
import NudgeToast from "@/components/task/NudgeToast";
import { SHELF_RESERVE } from "@/components/Shelf";
import { useLesson } from "@/lib/lesson-context";
import { nextTaskInTrack } from "@/lib/tracks-content";
import { CLOSE_FLAG, closeStage, stageAfterBrowserClosed } from "@/lib/tasks/triage/close-window";

function MinimizeIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden>
      <rect x="1.5" y="5.2" width="8" height="1.1" fill="currentColor" />
    </svg>
  );
}

function MaximizeIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden>
      <rect x="1.5" y="1.5" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden>
      <path d="M1.5 1.5 L9.5 9.5 M9.5 1.5 L1.5 9.5" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
    </svg>
  );
}

/** The minimize/maximize/close trio real app windows have, for visual realism. */
export default function WindowControls({ appKey, dark = false }: { appKey: AppKey; dark?: boolean }) {
  const { minimizeActive, closeApp } = useWindowManager();
  const { lang, currentTrack, completedTaskKeys, storyFlags, setStoryFlag } = useProgress();
  const lesson = useLesson();

  const close = () => {
    // Day 13 asks the learner to close the browser on purpose (Wave 4, everyday recovery).
    if (appKey === "browser" && !lesson) {
      const stage = closeStage(storyFlags[CLOSE_FLAG]);
      const next = stageAfterBrowserClosed(nextTaskInTrack(currentTrack, completedTaskKeys), stage);
      if (next !== stage) setStoryFlag(CLOSE_FLAG, next);
    }
    closeApp(appKey);
  };
  const { nudge, say, dismiss } = useNudge();
  const iconColor = dark ? "text-white/70" : "text-[#5f6368]";

  return (
    <>
      {/* data-card-avoid: the Job Card parks elsewhere when it can, so
          Minimize and Close are not hidden under it. */}
      <div data-card-avoid className="flex items-center gap-0.5">
        <button
          onClick={minimizeActive}
          aria-label="Minimize"
          className={`flex h-8 w-9 items-center justify-center hover:bg-black/8 cursor-pointer ${iconColor}`}
        >
          <MinimizeIcon />
        </button>
        <button
          onClick={() =>
            say(
              lang === "en"
                ? "This window is already full screen."
                : "Esta ventana ya está en pantalla completa.",
            )
          }
          aria-label="Maximize"
          className={`flex h-8 w-9 items-center justify-center hover:bg-black/8 cursor-pointer ${iconColor}`}
        >
          <MaximizeIcon />
        </button>
        <button
          onClick={close}
          aria-label="Close"
          className={`flex h-8 w-9 items-center justify-center hover:bg-[#e81123] hover:text-white cursor-pointer ${iconColor}`}
        >
          <CloseIcon />
        </button>
      </div>
      <NudgeToast text={nudge} bottom={SHELF_RESERVE + 16} onDismiss={dismiss} />
    </>
  );
}

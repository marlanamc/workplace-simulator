"use client";

import { useEffect } from "react";
import { WifiOff } from "lucide-react";
import { useProgress } from "@/lib/progress-context";
import { useNudge } from "@/lib/use-nudge";
import { SHOW_ME_POINTER, useShowMe } from "@/lib/use-show-me";
import { TASK_ICONS } from "@/lib/icons";
import {
  OFFLINE_FLAG,
  OFFLINE_GOAL,
  OFFLINE_PAGE,
  OFFLINE_STEPS,
  STILL_OFFLINE,
  offlineStage,
  reloadResult,
} from "@/lib/tasks/handbook/offline";
import RightNowBar from "@/components/task/RightNowBar";
import NudgeToast from "@/components/task/NudgeToast";
import ShowMeHighlight from "@/components/task/ShowMeHighlight";

/** The browser toolbar's Reload button fires this; the page answers it. */
export const BROWSER_RELOAD_EVENT = "workplace-browser-reload";

/**
 * Chrome's "No internet" page, shown in place of the tab while Day 7's
 * practice Wi-Fi is off (see `lib/tasks/handbook/offline.ts`). Reload works
 * from the page or from the toolbar, like the real thing, and only loads the
 * page once the Wi-Fi is back on.
 */
export default function OfflinePage() {
  const { lang, storyFlags, setStoryFlag } = useProgress();
  const { nudge, say, dismiss } = useNudge();
  const showMe = useShowMe();
  const stage = offlineStage(storyFlags[OFFLINE_FLAG]);
  const p = OFFLINE_PAGE[lang];
  const showMeId = stage === "off" ? "shelf-status" : "offline-reload";

  const reload = () => {
    showMe.clear();
    if (reloadResult(storyFlags[OFFLINE_FLAG]) === "loaded") setStoryFlag(OFFLINE_FLAG, "done");
    else say(STILL_OFFLINE[lang]);
  };

  // The toolbar's Reload is outside this page; it announces itself with an event.
  useEffect(() => {
    window.addEventListener(BROWSER_RELOAD_EVENT, reload);
    return () => window.removeEventListener(BROWSER_RELOAD_EVENT, reload);
  });

  return (
    <div data-testid="offline-page" className="flex h-full min-h-0 flex-col overflow-y-auto bg-white px-6 py-6 text-[#202124]">
      <RightNowBar
        icon={TASK_ICONS.handbook}
        taskKey="handbook"
        stepIndex={stage === "off" ? 0 : 1}
        steps={OFFLINE_STEPS}
        goal={OFFLINE_GOAL}
        lang={lang}
        onShowMe={() => showMe.toggleFor(showMeId)}
        showMeActive={showMe.targetId === showMeId}
      />
      {/* Compact, so Reload stays on screen at Chromebook size with the Job Card up. */}
      <div className="mx-auto w-full max-w-[560px]">
        <div className="mb-3 flex items-center gap-3">
          <WifiOff size={32} strokeWidth={1.75} aria-hidden className="shrink-0 text-[#5f6368]" />
          <h1 className="text-[24px] font-normal">{p.title}</h1>
        </div>
        <button
          type="button"
          data-testid="offline-reload"
          data-showme="offline-reload"
          data-card-avoid
          onClick={reload}
          className="mb-5 min-h-10 rounded-full bg-[#0b57d0] px-6 text-[14px] font-medium text-white hover:bg-[#0b57d0]/90 cursor-pointer"
        >
          {p.reload}
        </button>
        <p className="mb-1 text-[14px] text-[#5f6368]">{p.tryLabel}</p>
        <ul className="mb-3 list-disc pl-6 text-[14px] text-[#5f6368]">
          {p.tries.map((t) => <li key={t}>{t}</li>)}
        </ul>
        <p className="text-[12px] uppercase tracking-wide text-[#5f6368]">{p.code}</p>
        <p className="mt-4 text-[12px] text-[#5f6368]">{p.practice}</p>
      </div>
      <NudgeToast text={nudge} onDismiss={dismiss} />
      <ShowMeHighlight targetId={showMe.targetId} label={SHOW_ME_POINTER[lang]} onDismiss={showMe.clear} />
    </div>
  );
}

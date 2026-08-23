"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  TOUR_COPY,
  LESSONS,
  EVENT_INTRO,
} from "@/lib/tasks/tour/content";
import EventIntroCard from "@/components/task/EventIntroCard";
import { TASK_ICONS } from "@/lib/icons";
import HelpDrawer from "@/components/task/HelpDrawer";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import AppHeaderTools from "@/components/task/AppHeaderTools";

type View = "intro" | "help" | "done";

export default function TourTask({
  startAtHelp,
  onStartWalkthrough,
}: {
  /** True once the step-by-step walkthrough (driven by BrowserClient) has finished. */
  startAtHelp: boolean;
  /** Tell BrowserClient to begin the one-instruction-at-a-time walkthrough overlay. */
  onStartWalkthrough: () => void;
}) {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(
    completedTaskKeys.includes("tour") ? "done" : startAtHelp ? "help" : "intro"
  );
  const [openedHelp, setOpenedHelp] = useState(false);
  const [help, setHelp] = useState(false);

  const c = TOUR_COPY[lang];

  const openHelp = () => {
    setOpenedHelp(true);
    setHelp(true);
  };

  const finish = () => {
    setView("done");
    markComplete("tour", "how_it_works");
  };

  const restart = () => {
    setOpenedHelp(false);
    onStartWalkthrough();
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f6f1e8] text-[15px] text-[#1c1410]">
      {view !== "intro" && (
        <div className="flex items-center gap-3 border-b border-[#e0d4c4] bg-white px-3 py-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c45c26] text-white">
            {(() => {
              const Icon = TASK_ICONS.tour;
              return <Icon size={18} strokeWidth={2.25} aria-hidden />;
            })()}
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-medium uppercase tracking-wide text-[#8a6a4a]">{c.packetKicker}</div>
            <div className="truncate text-[16px] font-medium leading-tight">{c.packetTitle}</div>
          </div>
          <AppHeaderTools helpLabel={c.helpBtn} onHelp={openHelp} />
        </div>
      )}

      {view === "intro" && (
        <div className="min-h-0 flex-1 overflow-y-auto bg-white p-6">
          <EventIntroCard {...EVENT_INTRO[lang]} icon={TASK_ICONS.tour} onContinue={onStartWalkthrough} />
        </div>
      )}

      {view === "help" && (
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="mx-auto flex w-full max-w-[560px] flex-col gap-5">
            <p className="text-[20px] font-medium leading-tight">{c.helpLead}</p>
            <p className="max-w-[46ch] text-[16px] leading-relaxed text-[#6a4e32]">
              {openedHelp ? c.helpOpened : c.helpInvite}
            </p>
            <button
              type="button"
              onClick={finish}
              className="inline-flex min-h-[48px] items-center justify-center self-start rounded-full bg-[var(--accent)] px-6 text-[16px] font-medium text-white hover:bg-[var(--accent-hover)] cursor-pointer"
            >
              {c.helpReady}
            </button>
          </div>
        </div>
      )}

      {view === "done" && (
        <div className="min-h-0 flex-1 overflow-y-auto bg-white p-6">
          <div className="mx-auto flex max-w-[640px] flex-col gap-5">
            <TaskDoneCard
              kicker={c.sentKicker}
              title={c.doneTitle}
              body={c.doneBody}
              badgeNumber="00"
              badgeName={c.badgeName}
              badgeWhere={c.badgeWhere}
            />
            <TaskDoneActions
              tryAgainLabel={c.tryAgain}
              backToDeskLabel={c.backToDesk}
              onTryAgain={restart}
            />
          </div>
        </div>
      )}

      <HelpDrawer
        open={help}
        onClose={() => setHelp(false)}
        kicker={c.lessonKicker}
        lesson={LESSONS[lang][0]}
        tipLabel={c.tipLabel}
        gotItLabel={c.gotIt}
      />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@/lib/progress-context";
import { TOUR_COPY, LESSONS, tourEventIntro } from "@/lib/tasks/tour/content";
import { TASK_ICONS } from "@/lib/icons";
import HelpDrawer from "@/components/task/HelpDrawer";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import AppHeaderTools from "@/components/task/AppHeaderTools";
import RightNowBar from "@/components/task/RightNowBar";

type View = "intro" | "help" | "done";

export default function TourTask({
  startAtHelp,
  walkthroughRunning,
  onStartWalkthrough,
}: {
  /** True once Mail + Calendar walkthrough is done and Help is next. */
  startAtHelp: boolean;
  /**
   * The spotlight overlay is still stepping. It is already speaking through
   * the Job Card, so this page must not report a step of its own - two
   * reporters means the last one wins and the learner reads the wrong line.
   */
  walkthroughRunning: boolean;
  /** Tell BrowserClient to begin the one-instruction-at-a-time walkthrough overlay. */
  onStartWalkthrough: () => void;
}) {
  const { markComplete, completedTaskKeys, lang, displayName } = useProgress();
  const [view, setView] = useState<View>(
    completedTaskKeys.includes("tour") ? "done" : startAtHelp ? "help" : "intro",
  );
  const [openedHelp, setOpenedHelp] = useState(false);
  const [help, setHelp] = useState(false);

  // Walkthrough returns here for the Help beat after Mail + Calendar.
  useEffect(() => {
    if (startAtHelp && view === "intro") setView("help");
  }, [startAtHelp, view]);

  const c = TOUR_COPY[lang];
  const intro = tourEventIntro(lang, displayName);

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
    setView("intro");
    onStartWalkthrough();
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f6f1e8] text-[15px] text-[#1c1410]">
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

      {/* A quiet welcome page, not a card with a button. The Job Card already
          welcomed the learner by name on the desktop and is what sent them
          here; this page only has to look like somewhere they arrived. */}
      {view === "intro" && (
        <div
          className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto p-10 text-center"
          style={{
            background:
              "radial-gradient(900px 480px at 50% 18%, #fff8ef 0%, #f6f1e8 55%, #ebe2d4 100%)",
          }}
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#c45c26] text-white">
            {(() => {
              const Icon = TASK_ICONS.tour;
              return <Icon size={30} strokeWidth={1.75} aria-hidden />;
            })()}
          </span>
          <p className="mt-5 text-[13px] font-bold uppercase tracking-[0.16em] text-[#8a6a4a]">
            {intro.kicker}
          </p>
          <h1 className="mt-2 max-w-[24ch] text-[30px] font-medium leading-[1.15] tracking-[-0.02em]">
            {intro.subheadline}
          </h1>
        </div>
      )}

      {view === "help" && (
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          {/* The card says the instruction and carries the button; this page
              only holds the reassurance that Help costs the learner nothing. */}
          {!walkthroughRunning && (
            <RightNowBar
              stepIndex={3}
              stepCount={4}
              instruction={{ en: c.helpLead, es: c.helpLead }}
              primaryLabel={c.helpReady}
              onPrimary={finish}
            />
          )}
          <div className="mx-auto flex w-full max-w-[560px] flex-col gap-5">
            <p className="max-w-[46ch] text-[16px] leading-relaxed text-[#6a4e32]">
              {openedHelp ? c.helpOpened : c.helpInvite}
            </p>
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

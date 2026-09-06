"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import { TOUR_COPY, LESSONS, tourEventIntro } from "@/lib/tasks/tour/content";
import { welcomeHomeFor } from "@/lib/welcome-home-content";
import { actForLevel, levelForTrack } from "@/lib/tracks-content";
import { TASK_ICONS } from "@/lib/icons";
import { SkillRow } from "@/components/welcome-shell";
import HelpDrawer from "@/components/task/HelpDrawer";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import RightNowBar from "@/components/task/RightNowBar";

type View = "intro" | "help" | "done";

export default function TourTask({
  startAtHelp,
  walkthroughRunning,
  helpOpen,
  onOpenHelp,
  onCloseHelp,
  onStartWalkthrough,
}: {
  /** True once Mail walkthrough is done and Help is next. */
  startAtHelp: boolean;
  /**
   * The spotlight overlay is still stepping. It is already speaking through
   * the Job Card, so this page must not report a step of its own - two
   * reporters means the last one wins and the learner reads the wrong line.
   */
  walkthroughRunning: boolean;
  /** Help is lifted so the walkthrough can open it via the card's ?. */
  helpOpen: boolean;
  onOpenHelp: () => void;
  onCloseHelp: () => void;
  /** Tell BrowserClient to begin the one-instruction-at-a-time walkthrough overlay. */
  onStartWalkthrough: () => void;
}) {
  const { markComplete, completedTaskKeys, lang, displayName, currentTrack } = useProgress();
  const [ownView, setView] = useState<View>(
    completedTaskKeys.includes("tour") ? "done" : startAtHelp ? "help" : "intro",
  );
  // Only the just-finished path reports a finish to the Job Card. Reopening
  // Welcome later must not steal the current task's instruction.
  const [justFinishedTour, setJustFinishedTour] = useState(false);
  const [openedHelp, setOpenedHelp] = useState(false);
  if (helpOpen && !openedHelp) setOpenedHelp(true);

  // The walkthrough returns here for the Help beat after Mail.
  // Derived rather than synced in an effect; "restart" clears startAtHelp via
  // onStartWalkthrough, so it can still send the learner back to the intro.
  const view: View = startAtHelp && ownView === "intro" ? "help" : ownView;

  const c = TOUR_COPY[lang];
  const intro = tourEventIntro(lang, displayName);
  const actKey = actForLevel(levelForTrack(currentTrack.key))?.key ?? "act1";
  const home = welcomeHomeFor(actKey);
  const chrome =
    view === "done"
      ? { kicker: home.packetKicker[lang], title: home.packetTitle[lang] }
      : { kicker: c.packetKicker, title: c.packetTitle };

  const openHelp = () => {
    setOpenedHelp(true);
    onOpenHelp();
  };

  const finish = () => {
    setJustFinishedTour(true);
    setView("done");
    markComplete("tour", "how_it_works");
  };

  const restart = () => {
    setOpenedHelp(false);
    setJustFinishedTour(false);
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
            <div className="text-[12px] font-medium uppercase tracking-wide text-[#8a6a4a]">{chrome.kicker}</div>
            <div className="truncate text-[16px] font-medium leading-tight">{chrome.title}</div>
          </div>
      </div>

      {/* The Job Card still says what to do. This page is the place they
          landed: first-day welcome, still visible while the walkthrough
          points at Mail. */}
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
            {intro.headline}
          </h1>
          <p className="mt-3 max-w-[36ch] text-[17px] leading-relaxed text-[#6a4e32]">
            {intro.subheadline}
          </p>
          <p className="mt-3 max-w-[36ch] text-[16px] leading-relaxed text-[#8a6a4a]">
            {intro.body}
          </p>
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
              onHelp={openHelp}
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
        <div
          data-testid="welcome-home"
          data-act={actKey}
          className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-8"
          style={{
            background:
              "radial-gradient(900px 480px at 50% 0%, #fff8ef 0%, #f6f1e8 55%, #ebe2d4 100%)",
          }}
        >
          <div className="mx-auto flex w-full max-w-[640px] flex-col">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#b06000]">
              {home.actLabel[lang]}
            </p>
            <h1 className="mt-1 text-[28px] font-semibold leading-[1.15] tracking-tight sm:text-[34px]">
              {home.role[lang]}
            </h1>
            <p className="mt-3 text-[17px] leading-relaxed text-[#3c4043]">{home.roleLine[lang]}</p>

            <section
              aria-labelledby="welcome-home-skills"
              className="mt-6 rounded-2xl bg-[#ece3d3] px-5 py-5 sm:px-6 sm:py-5"
            >
              <h2 id="welcome-home-skills" className="text-base font-semibold">
                {home.skillsTitle[lang]}
              </h2>
              <SkillRow skills={home.skills} lang={lang} />
            </section>

            <section className="mt-5 rounded-2xl border border-[#dfd4c2] bg-white/70 px-5 py-5 sm:px-6">
              <h2 className="text-lg font-semibold">{home.manager[lang]}</h2>
              <p className="mt-1.5 text-base leading-relaxed text-[#3c4043]">{home.bridge[lang]}</p>
              <p className="mt-3 text-sm leading-relaxed text-[#5f4b32]">{home.reassurance[lang]}</p>
            </section>
          </div>

          {justFinishedTour && (
            <TaskDoneActions kicker={c.sentKicker} tryAgainLabel={c.tryAgain} onTryAgain={restart} />
          )}
        </div>
      )}

      <HelpDrawer
        open={helpOpen}
        onClose={onCloseHelp}
        kicker={c.lessonKicker}
        lesson={LESSONS[lang][0]}
        tipLabel={c.tipLabel}
        gotItLabel={c.gotIt}
      />
    </div>
  );
}

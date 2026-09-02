"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  TIMECLOCK,
  TIMECLOCK_COPY,
  LESSONS,
  WRONG_LOOKS_RIGHT_HINT,
  RIGHT_NOW_STEPS,
  RIGHT_NOW_LABEL,
} from "@/lib/tasks/timeclock/content";
import { TIMECLOCK_MAIL_FLAG } from "@/lib/story-beats";
import { useNudge } from "@/lib/use-nudge";
import { TASK_ICONS } from "@/lib/icons";
import { useWindowManager } from "@/lib/window-manager";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import AppHeaderTools from "@/components/task/AppHeaderTools";
import RightNowBar from "@/components/task/RightNowBar";
import ShowMeHighlight from "@/components/task/ShowMeHighlight";
import { useShowMe, SHOW_ME_POINTER } from "@/lib/use-show-me";

type Phase = "clocked_in" | "review";

export default function TimeclockTask() {
  const { completedTaskKeys, lang, setStoryFlag } = useProgress();
  const { openApp } = useWindowManager();
  const done = completedTaskKeys.includes("timeclock");
  const [phase, setPhase] = useState<Phase>("clocked_in");
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const showMe = useShowMe();
  const showMeId = phase === "clocked_in" ? "clockout-button" : "something-off-button";

  const c = TIMECLOCK_COPY[lang];

  const looksRight = () => say(WRONG_LOOKS_RIGHT_HINT[lang]);

  const messageSupervisor = () => {
    setStoryFlag(TIMECLOCK_MAIL_FLAG, "true");
    openApp("browser", { tab: "mail" });
  };

  const restart = () => {
    setStoryFlag(TIMECLOCK_MAIL_FLAG, "false");
    setPhase("clocked_in");
  };

  return (
    <div className="relative">
      <div className="mb-1 flex items-center justify-between gap-3">
        <h2 className="text-[19px] font-medium">{c.heading}</h2>
        <AppHeaderTools helpLabel={c.helpBtn} onHelp={() => setHelp(true)} />
      </div>

      {!done && (
        <RightNowBar
          icon={TASK_ICONS.timeclock}
          stepIndex={phase === "clocked_in" ? 0 : 1}
          stepCount={RIGHT_NOW_STEPS.length}
          instruction={RIGHT_NOW_STEPS[phase === "clocked_in" ? 0 : 1]}
          lang={lang}
          rightNowLabel={RIGHT_NOW_LABEL}
          onShowMe={() => showMe.toggleFor(showMeId)}
          showMeActive={showMe.targetId === showMeId}
          onHelp={() => setHelp(true)}
        />
      )}

      {!done && phase === "clocked_in" && (
        <div className="flex flex-col gap-5">
          <div className="rounded-xl border border-success-tint bg-success-tint p-5">
            <div className="text-[12px] font-semibold uppercase tracking-wide text-success">
              {c.clockedInStatus}
            </div>
            <div className="mt-1 text-[20px] font-medium">
              {c.sinceLabel} {TIMECLOCK.clockedInAt}
            </div>
            <div className="mt-1 text-[14px] text-text-secondary">{TIMECLOCK.weekHours}</div>
            <button
              data-showme="clockout-button"
              onClick={() => setPhase("review")}
              className="mt-4 inline-flex min-h-[46px] items-center rounded-full bg-accent px-6 text-[15px] font-medium text-white hover:bg-accent-hover cursor-pointer"
            >
              {c.clockOut}
            </button>
          </div>

          <div>
            <h3 className="mb-2 text-[15px] font-medium">{c.recentHeading}</h3>
            <div className="overflow-hidden rounded-xl border border-border bg-white">
              {TIMECLOCK.recent.map((r, i) => (
                <div
                  key={r.date}
                  className={`grid grid-cols-4 gap-2 px-4 py-3 text-[13px] ${i !== 0 ? "border-t border-border" : ""}`}
                >
                  <span className="text-text-primary">{r.date}</span>
                  <span className="text-text-secondary">In {r.in}</span>
                  <span className="text-text-secondary">Out {r.out}</span>
                  <span className="text-right font-medium text-text-primary">{r.total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!done && phase === "review" && (
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="text-[12px] font-semibold uppercase tracking-wide text-text-tertiary">
            {c.clockedOutStatus}
          </div>
          <div className="mt-3 flex flex-wrap gap-6">
            <div>
              <div className="text-[13px] text-text-tertiary">{c.todayTotalLabel}</div>
              <div className="mt-0.5 text-[22px] font-medium">{TIMECLOCK.todayTotal}</div>
            </div>
            <div>
              <div className="text-[13px] text-text-tertiary">{c.scheduledLabel}</div>
              <div className="mt-0.5 text-[22px] font-medium">{TIMECLOCK.scheduledHours}</div>
              <div className="text-[13px] text-text-tertiary">
                {TIMECLOCK.scheduledStart} – {TIMECLOCK.scheduledEnd}
              </div>
            </div>
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <div className="mb-2.5 text-[15px] font-medium">{c.reviewQuestion}</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={looksRight}
                className="min-h-[44px] rounded-full border border-border px-4 text-[14px] font-medium text-text-primary hover:bg-surface-muted cursor-pointer"
              >
                {c.looksRight}
              </button>
              <button
                data-showme="something-off-button"
                onClick={messageSupervisor}
                className="min-h-[44px] rounded-full border border-border px-4 text-[14px] font-medium text-text-primary hover:bg-surface-muted cursor-pointer"
              >
                {c.somethingOff}
              </button>
            </div>
          </div>
        </div>
      )}

      {done && (
        <div className="flex flex-col gap-5">
          <TaskDoneCard
            kicker={c.sentKicker}
            title={c.doneTitle}
            body={c.doneBody}
            badgeNumber="03"
            badgeName={c.badgeName}
            badgeWhere={c.badgeWhere}
          />

          <TaskDoneActions
            kicker={c.sentKicker}
            tryAgainLabel={c.tryAgain}
            backToDeskLabel={c.backToDesk}
            onTryAgain={restart}
          />
        </div>
      )}

      <HelpDrawer
        open={help}
        onClose={() => setHelp(false)}
        kicker={c.lessonKicker}
        lesson={LESSONS[lang][phase === "clocked_in" ? 0 : 1]}
        tipLabel={c.tipLabel}
        gotItLabel={c.gotIt}
      />

      <NudgeToast text={nudge} onDismiss={dismiss} />
      <ShowMeHighlight targetId={showMe.targetId} label={SHOW_ME_POINTER[lang]} onDismiss={showMe.clear} />
    </div>
  );
}

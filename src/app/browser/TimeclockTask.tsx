"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import { CAST } from "@/lib/cast";
import {
  TIMECLOCK,
  TIMECLOCK_COPY,
  STARTERS,
  LESSONS,
  WRONG_LOOKS_RIGHT_HINT,
  RIGHT_NOW_STEPS,
  RIGHT_NOW_LABEL,
} from "@/lib/tasks/timeclock/content";
import { useNudge } from "@/lib/use-nudge";
import { TASK_ICONS } from "@/lib/icons";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import AppHeaderTools from "@/components/task/AppHeaderTools";
import RightNowBar from "@/components/task/RightNowBar";
import ShowMeHighlight from "@/components/task/ShowMeHighlight";
import { useShowMe, SHOW_ME_POINTER } from "@/lib/use-show-me";
import NeedAStart from "@/components/task/NeedAStart";

type View = "clocked_in" | "review" | "compose" | "done";

export default function TimeclockTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("timeclock") ? "done" : "clocked_in");
  const [body, setBody] = useState("");
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const showMe = useShowMe();
  // Clock out, then say the hours are wrong, then send.
  const showMeId =
    view === "clocked_in" ? "clockout-button" : view === "review" ? "something-off-button" : "send-button";

  const c = TIMECLOCK_COPY[lang];

  const looksRight = () => say(WRONG_LOOKS_RIGHT_HINT[lang]);

  const trySend = () => {
    if (!body.trim()) {
      return say(
        lang === "en"
          ? "Write a short message first. Even one sentence is fine."
          : "Primero escribe un mensaje corto. Una oración está bien."
      );
    }
    setView("done");
    markComplete("timeclock", "flag_hours_mismatch");
  };

  const discard = () => {
    setView("review");
    setBody("");
  };

  const restart = () => {
    setView("clocked_in");
    setBody("");
  };

  return (
    <div className="relative">
      <div className="mb-1 flex items-center justify-between gap-3">
        <h2 className="text-[19px] font-medium">{c.heading}</h2>
        <AppHeaderTools
          helpLabel={c.helpBtn}
          onHelp={() => setHelp(true)}
        />
      </div>

      {view !== "done" && (
        <RightNowBar
          icon={TASK_ICONS.timeclock}
          stepIndex={view === "clocked_in" ? 0 : view === "review" ? 1 : 2}
          stepCount={RIGHT_NOW_STEPS.length}
          instruction={RIGHT_NOW_STEPS[view === "clocked_in" ? 0 : view === "review" ? 1 : 2]}
          lang={lang}
          rightNowLabel={RIGHT_NOW_LABEL}
          onShowMe={() => showMe.toggleFor(showMeId)}
          showMeActive={showMe.targetId === showMeId}
          onHelp={() => setHelp(true)}
        />
      )}

      {view === "clocked_in" && (
        <div className="flex flex-col gap-5">
          <div className="rounded-xl border border-[var(--success-tint)] bg-[var(--success-tint)] p-5">
            <div className="text-[12px] font-semibold uppercase tracking-wide text-[var(--success)]">
              {c.clockedInStatus}
            </div>
            <div className="mt-1 text-[20px] font-medium">
              {c.sinceLabel} {TIMECLOCK.clockedInAt}
            </div>
            <div className="mt-1 text-[14px] text-[var(--text-secondary)]">{TIMECLOCK.weekHours}</div>
            <button
              data-showme="clockout-button"
              onClick={() => setView("review")}
              className="mt-4 inline-flex min-h-[46px] items-center rounded-full bg-[var(--accent)] px-6 text-[15px] font-medium text-white hover:bg-[var(--accent-hover)] cursor-pointer"
            >
              {c.clockOut}
            </button>
          </div>

          <div>
            <h3 className="mb-2 text-[15px] font-medium">{c.recentHeading}</h3>
            <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white">
              {TIMECLOCK.recent.map((r, i) => (
                <div
                  key={r.date}
                  className={`grid grid-cols-4 gap-2 px-4 py-3 text-[13px] ${i !== 0 ? "border-t border-[var(--border)]" : ""}`}
                >
                  <span className="text-[var(--text-primary)]">{r.date}</span>
                  <span className="text-[var(--text-secondary)]">In {r.in}</span>
                  <span className="text-[var(--text-secondary)]">Out {r.out}</span>
                  <span className="text-right font-medium text-[var(--text-primary)]">{r.total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === "review" && (
        <div className="rounded-xl border border-[var(--border)] bg-white p-5">
          <div className="text-[12px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">
            {c.clockedOutStatus}
          </div>
          <div className="mt-3 flex flex-wrap gap-6">
            <div>
              <div className="text-[13px] text-[var(--text-tertiary)]">{c.todayTotalLabel}</div>
              <div className="mt-0.5 text-[22px] font-medium">{TIMECLOCK.todayTotal}</div>
            </div>
            <div>
              <div className="text-[13px] text-[var(--text-tertiary)]">{c.scheduledLabel}</div>
              <div className="mt-0.5 text-[22px] font-medium">{TIMECLOCK.scheduledHours}</div>
              <div className="text-[13px] text-[var(--text-tertiary)]">
                {TIMECLOCK.scheduledStart} – {TIMECLOCK.scheduledEnd}
              </div>
            </div>
          </div>

          <div className="mt-5 border-t border-[var(--border)] pt-4">
            <div className="mb-2.5 text-[15px] font-medium">{c.reviewQuestion}</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={looksRight}
                className="min-h-[44px] rounded-full border border-[var(--border)] px-4 text-[14px] font-medium text-[var(--text-primary)] hover:bg-[var(--surface-muted)] cursor-pointer"
              >
                {c.looksRight}
              </button>
              <button
                data-showme="something-off-button"
                onClick={() => setView("compose")}
                className="min-h-[44px] rounded-full border border-[var(--border)] px-4 text-[14px] font-medium text-[var(--text-primary)] hover:bg-[var(--surface-muted)] cursor-pointer"
              >
                {c.somethingOff}
              </button>
            </div>
          </div>
        </div>
      )}

      {view === "compose" && (
        <div className="rounded-xl border border-[var(--border)] bg-white p-5">
          <div className="mb-3 flex gap-3 border-b border-[var(--border)] pb-2.5 text-[14px]">
            <span className="w-14 shrink-0 text-[var(--text-tertiary)]">{c.to}</span>
            <span>{CAST.maria.email}</span>
          </div>
          <div className="mb-3 flex gap-3 border-b border-[var(--border)] pb-2.5 text-[14px]">
            <span className="w-14 shrink-0 text-[var(--text-tertiary)]">{c.subjectLabel}</span>
            <span>{c.subject}</span>
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={c.writeHere}
            className="min-h-[130px] w-full resize-y border-none py-3 text-[16px] leading-relaxed outline-none placeholder:text-[var(--text-tertiary)]"
          />
          <div className="mb-4">
          <NeedAStart
            lang={lang}
            starters={STARTERS[lang]}
            onPick={(s) => setBody((b) => (b ? b + " " : "") + s)}
            chipClassName="min-h-[38px] rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 text-[13px] font-medium text-[var(--accent)] hover:bg-[var(--accent-tint)] cursor-pointer"
          />
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-4">
            <button
              data-showme="send-button"
              onClick={trySend}
              className="inline-flex min-h-[46px] items-center rounded-full bg-[var(--accent)] px-6 text-[15px] font-medium text-white hover:bg-[var(--accent-hover)] cursor-pointer"
            >
              {c.send}
            </button>
            <button
              onClick={discard}
              className="min-h-[40px] px-2 text-[14px] text-[var(--text-tertiary)] cursor-pointer"
            >
              {c.discard}
            </button>
          </div>
        </div>
      )}

      {view === "done" && (
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
        lesson={LESSONS[lang][view === "clocked_in" ? 0 : 1]}
        tipLabel={c.tipLabel}
        gotItLabel={c.gotIt}
      />

      <NudgeToast text={nudge} onDismiss={dismiss} />
      <ShowMeHighlight targetId={showMe.targetId} label={SHOW_ME_POINTER[lang]} onDismiss={showMe.clear} />
    </div>
  );
}

"use client";

import { useState } from "react";
import { useWindowManager } from "@/lib/window-manager";
import { useProgress } from "@/lib/progress-context";
import {
  TIMECLOCK,
  TIMECLOCK_COPY,
  STARTERS,
  LESSONS,
  EVENT_INTRO,
  CONFIDENCE_OPTIONS,
  WRONG_LOOKS_RIGHT_HINT,
} from "@/lib/tasks/timeclock/content";
import { useNudge } from "@/lib/use-nudge";
import ConfidenceCheck from "@/components/task/ConfidenceCheck";
import EventIntroCard from "@/components/task/EventIntroCard";
import { TASK_ICONS } from "@/lib/icons";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import TaskDoneCard from "@/components/task/TaskDoneCard";

type View = "intro" | "clocked_in" | "review" | "compose" | "done";

export default function TimeclockTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("timeclock") ? "done" : "intro");
  const [body, setBody] = useState("");
  const [confidence, setConfidence] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const { nudge, say } = useNudge();
  const { minimizeActive } = useWindowManager();

  const c = TIMECLOCK_COPY[lang];

  const looksRight = () => say(WRONG_LOOKS_RIGHT_HINT[lang]);

  const trySend = () => {
    if (!body.trim()) {
      return say(
        lang === "en"
          ? "Write a short message first — even one sentence is fine."
          : "Primero escribe un mensaje corto — una oración está bien."
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
    setConfidence(null);
  };

  return (
    <div className="relative">
      <div className="mb-1 flex items-center justify-between gap-3">
        <h2 className="text-[19px] font-medium">{c.heading}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHelp(true)}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-[var(--warning-tint)] px-3.5 text-[13px] font-medium text-[var(--warning)] hover:brightness-95 cursor-pointer"
          >
            ? {c.helpBtn}
          </button>
        </div>
      </div>

      {view === "intro" && (
        <EventIntroCard {...EVENT_INTRO[lang]} icon={TASK_ICONS.timeclock} onContinue={() => setView("clocked_in")} />
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
            <span>maria.delgado@harborsidecafe.com</span>
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
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-medium text-[var(--text-tertiary)]">{c.startersLabel}:</span>
            {STARTERS[lang].map((s, i) => (
              <button
                key={i}
                onClick={() => setBody((b) => (b ? b + " " : "") + s)}
                className="min-h-[38px] rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 text-[13px] font-medium text-[var(--accent)] hover:bg-[var(--accent-tint)] cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-4">
            <button
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

          <ConfidenceCheck
            question={c.confidenceQ}
            options={CONFIDENCE_OPTIONS[lang]}
            selected={confidence}
            onSelect={setConfidence}
          />

          <div className="flex flex-wrap gap-2">
            <button
              onClick={restart}
              className="inline-flex min-h-[46px] items-center rounded-full bg-[var(--accent)] px-5 text-[15px] font-medium text-white hover:bg-[var(--accent-hover)] cursor-pointer"
            >
              {c.tryAgain}
            </button>
            <button
              onClick={minimizeActive}
              className="inline-flex min-h-[46px] items-center rounded-full border border-[var(--border)] px-5 text-[15px] font-medium text-[var(--text-primary)] hover:bg-[var(--surface-muted)] cursor-pointer"
            >
              {c.backToDesk}
            </button>
          </div>
        </div>
      )}

      <HelpDrawer
        open={help}
        onClose={() => setHelp(false)}
        kicker={c.lessonKicker}
        lesson={LESSONS[lang][view === "clocked_in" ? 0 : 1]}
        tipLabel={c.tipLabel}
        gotItLabel={c.gotIt}
        askPersonLabel={c.askPerson}
      />

      <NudgeToast text={nudge} bottom={32} />
    </div>
  );
}

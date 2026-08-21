"use client";

import { useState } from "react";
import { useWindowManager } from "@/lib/window-manager";
import { useProgress } from "@/lib/progress-context";
import {
  SCHEDULE,
  SCHEDULE_COPY,
  STARTERS,
  LESSONS,
  CONFIDENCE_OPTIONS,
  WRONG_SWAP_HINT,
} from "@/lib/tasks/schedule/content";
import type { Lang } from "@/lib/task-types";
import { useNudge } from "@/lib/use-nudge";
import ConfidenceCheck from "@/components/task/ConfidenceCheck";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import TaskDoneCard from "@/components/task/TaskDoneCard";

type View = "list" | "compose" | "done";

export default function ScheduleTask() {
  const [lang, setLang] = useState<Lang>("en");
  const { markComplete, completedTaskKeys } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("schedule") ? "done" : "list");
  const [swapDay, setSwapDay] = useState<(typeof SCHEDULE)[number] | null>(null);
  const [body, setBody] = useState("");
  const [confidence, setConfidence] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const { nudge, say } = useNudge();
  const { minimizeActive } = useWindowManager();

  const c = SCHEDULE_COPY[lang];

  const requestSwap = (d: (typeof SCHEDULE)[number]) => {
    if (!d.conflict) return say(WRONG_SWAP_HINT[lang]);
    setSwapDay(d);
    setView("compose");
  };

  const trySend = () => {
    if (!body.trim()) {
      return say(
        lang === "en"
          ? "Write a short message first — even one sentence is fine."
          : "Primero escribe un mensaje corto — una oración está bien."
      );
    }
    setView("done");
    markComplete("schedule", "request_shift_swap");
  };

  const discard = () => {
    setView("list");
    setSwapDay(null);
    setBody("");
  };

  const restart = () => {
    setView("list");
    setSwapDay(null);
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
          <button
            onClick={() => setLang(lang === "en" ? "es" : "en")}
            className="inline-flex min-h-[40px] items-center rounded-full border border-[var(--border)] px-3.5 text-[13px] font-medium text-[var(--text-primary)] hover:bg-[var(--surface-muted)] cursor-pointer"
          >
            {c.langBtn}
          </button>
        </div>
      </div>
      <p className="mb-4 text-[14px] text-[var(--text-secondary)]">{c.subhead}</p>

      {view === "list" && (
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white">
          {SCHEDULE.map((d, i) => (
            <div
              key={d.day}
              className={`flex items-center justify-between gap-3 px-4 py-3.5 ${i !== 0 ? "border-t border-[var(--border)]" : ""}`}
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span className="w-11 shrink-0 text-[14px] font-semibold text-[var(--text-primary)]">{d.day}</span>
                <span className="shrink-0 text-[13px] text-[var(--text-tertiary)]">{d.date}</span>
                <div className="min-w-0">
                  <div
                    className={
                      d.shift
                        ? "text-[14px] font-medium text-[var(--text-primary)]"
                        : "text-[14px] text-[var(--text-tertiary)]"
                    }
                  >
                    {d.shift ?? "Off"}
                  </div>
                  {d.conflict && (
                    <div className="mt-0.5 text-[12px] font-medium text-[var(--danger)]">
                      ⚠ {c.conflictTag} — {d.conflict[lang]}
                    </div>
                  )}
                </div>
              </div>
              {d.shift && (
                <button
                  onClick={() => requestSwap(d)}
                  className="shrink-0 rounded-full border border-[var(--border)] px-3 py-1.5 text-[13px] font-medium text-[var(--text-primary)] hover:bg-[var(--surface-muted)] cursor-pointer"
                >
                  {c.requestSwap}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {view === "compose" && swapDay && (
        <div className="rounded-xl border border-[var(--border)] bg-white p-5">
          <div className="mb-3 flex gap-3 border-b border-[var(--border)] pb-2.5 text-[14px]">
            <span className="w-14 shrink-0 text-[var(--text-tertiary)]">{c.to}</span>
            <span>maria.delgado@harborsidecafe.com</span>
          </div>
          <div className="mb-3 flex gap-3 border-b border-[var(--border)] pb-2.5 text-[14px]">
            <span className="w-14 shrink-0 text-[var(--text-tertiary)]">{c.subjectLabel}</span>
            <span>
              {c.subjectPrefix} {swapDay.day} {swapDay.date}
            </span>
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
            badgeNumber="02"
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
        lesson={LESSONS[lang][view === "list" ? 0 : 1]}
        tipLabel={c.tipLabel}
        gotItLabel={c.gotIt}
        askPersonLabel={c.askPerson}
      />

      <NudgeToast text={nudge} bottom={32} />
    </div>
  );
}

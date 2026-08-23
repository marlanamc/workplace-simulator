"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  SCHEDULE,
  SCHEDULE_COPY,
  PERSONAL_CALENDAR,
  STARTERS,
  LESSONS,
  EVENT_INTRO,
  WRONG_SWAP_HINT,
} from "@/lib/tasks/schedule/content";
import { useNudge } from "@/lib/use-nudge";
import EventIntroCard from "@/components/task/EventIntroCard";
import { TASK_ICONS } from "@/lib/icons";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import AppHeaderTools from "@/components/task/AppHeaderTools";
import NeedAStart from "@/components/task/NeedAStart";

type View = "intro" | "list" | "compose" | "done";

export default function ScheduleTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("schedule") ? "done" : "intro");
  const [swapDay, setSwapDay] = useState<(typeof SCHEDULE)[number] | null>(null);
  const [body, setBody] = useState("");
  const [help, setHelp] = useState(false);
  const { nudge, say } = useNudge();

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
          ? "Write a short message first. Even one sentence is fine."
          : "Primero escribe un mensaje corto. Una oración está bien."
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
      <p className="mb-4 text-[14px] text-[var(--text-secondary)]">{c.subhead}</p>

      {view === "intro" && (
        <EventIntroCard {...EVENT_INTRO[lang]} icon={TASK_ICONS.schedule} onContinue={() => setView("list")} />
      )}

      {view === "list" && (
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-[var(--border)] bg-white">
            {SCHEDULE.map((d, i) => (
              <div
                key={d.day}
                className={`flex items-center justify-between gap-3 px-4 py-3.5 ${i !== 0 ? "border-t border-[var(--border)]" : ""}`}
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="w-11 shrink-0 text-[14px] font-semibold text-[var(--text-primary)]">{d.day}</span>
                  <span className="shrink-0 text-[13px] text-[var(--text-tertiary)]">{d.date}</span>
                  <div
                    className={
                      d.shift
                        ? "text-[14px] font-medium text-[var(--text-primary)]"
                        : "text-[14px] text-[var(--text-tertiary)]"
                    }
                  >
                    {d.shift ?? "Off"}
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

          <aside className="w-full shrink-0 lg:w-[260px]">
            <div className="overflow-hidden rounded-[28px] bg-[#1c1c1e] p-3 text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
              <div className="px-2 pb-2 pt-1">
                <div className="text-[11px] text-white/55">{c.phoneLabel}</div>
                <div className="text-[17px] font-medium">{c.phoneHeading}</div>
              </div>
              <div className="overflow-hidden rounded-2xl bg-[#2c2c2e]">
                {PERSONAL_CALENDAR.map((event, i) => (
                  <div
                    key={event.date}
                    className={`flex items-start gap-3 px-3 py-2.5 ${i !== 0 ? "border-t border-white/10" : ""}`}
                  >
                    <div className="w-[4.5rem] shrink-0">
                      <div className="text-[11px] text-white/55">{event.day}</div>
                      <div className="text-[13px] font-medium">{event.date}</div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[14px] font-medium">{event.title[lang]}</div>
                      <div className="text-[12px] text-white/65">{event.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
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

          <TaskDoneActions
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
        lesson={LESSONS[lang][view === "list" ? 0 : 1]}
        tipLabel={c.tipLabel}
        gotItLabel={c.gotIt}
      />

      <NudgeToast text={nudge} />
    </div>
  );
}

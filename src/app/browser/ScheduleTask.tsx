"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  SCHEDULE,
  SCHEDULE_COPY,
  PERSONAL_CALENDAR,
  LESSONS,
  WRONG_SWAP_HINT,
  RIGHT_NOW_STEPS,
  RIGHT_NOW_LABEL,
} from "@/lib/tasks/schedule/content";
import type { Lang } from "@/lib/task-types";
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

type View = "list" | "done";

export default function ScheduleTask({ onRequestSwap }: { onRequestSwap: (day: string) => void }) {
  const { completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("schedule") ? "done" : "list");
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const showMe = useShowMe();
  // One control this whole task: the clashing day. Picking any other day is
  // the mistake worth catching, so it nudges instead of advancing.
  const showMeId = "swap-button";

  const c = SCHEDULE_COPY[lang];

  // Finding the clash and asking for the swap are one task. Picking the
  // clashing day hands the day off to the swap form on the other tab
  // (pre-filled there); the task itself only completes when that form is
  // submitted, in the form Harborside actually uses.
  const pickDay = (d: (typeof SCHEDULE)[number]) => {
    if (!d.conflict) return say(WRONG_SWAP_HINT[lang]);
    onRequestSwap(d.day);
  };

  const restart = () => setView("list");

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

      {view !== "done" && (
        <RightNowBar
          icon={TASK_ICONS.schedule}
          stepIndex={0}
          stepCount={RIGHT_NOW_STEPS.length}
          instruction={RIGHT_NOW_STEPS[0]}
          lang={lang}
          rightNowLabel={RIGHT_NOW_LABEL}
          onShowMe={() => showMe.toggleFor(showMeId)}
          showMeActive={showMe.targetId === showMeId}
          onHelp={() => setHelp(true)}
        />
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
                    data-showme={d.conflict ? "swap-button" : undefined}
                    onClick={() => pickDay(d)}
                    className="shrink-0 rounded-full border border-[var(--border)] px-3 py-1.5 text-[13px] font-medium text-[var(--text-primary)] hover:bg-[var(--surface-muted)] cursor-pointer"
                  >
                    {c.pickConflict}
                  </button>
                )}
              </div>
            ))}
          </div>

          <aside className="w-full shrink-0 lg:w-[260px]">
            <PhoneCalendar label={c.phoneLabel} heading={c.phoneHeading} lang={lang} />
          </aside>
        </div>
      )}

      {view === "done" && (
        <div className="flex flex-col gap-5">
          <TaskDoneCard
            kicker={c.doneTitle}
            title={c.doneTitle}
            body={c.doneBody}
            badgeNumber="02"
            badgeName={c.badgeName}
            badgeWhere={c.badgeWhere}
          />

          <TaskDoneActions
            kicker={c.doneTitle}
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
        lesson={LESSONS[lang][0]}
        tipLabel={c.tipLabel}
        gotItLabel={c.gotIt}
      />

      <NudgeToast text={nudge} onDismiss={dismiss} />
      <ShowMeHighlight targetId={showMe.targetId} label={SHOW_ME_POINTER[lang]} onDismiss={showMe.clear} />
    </div>
  );
}

const PHONE_TYPE =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif';

function PhoneCalendar({
  label,
  heading,
  lang,
}: {
  label: string;
  heading: string;
  lang: Lang;
}) {
  const eventDates = new Set(PERSONAL_CALENDAR.map((event) => event.date));

  return (
    <figure className="mx-auto w-[236px]">
      <div className="relative">
        <div
          aria-hidden
          className="absolute -left-[3px] top-[58px] h-[16px] w-[3px] rounded-l-[2px] bg-[#5c5c60]"
        />
        <div
          aria-hidden
          className="absolute -left-[3px] top-[86px] h-[32px] w-[3px] rounded-l-[2px] bg-[#5c5c60]"
        />
        <div
          aria-hidden
          className="absolute -left-[3px] top-[124px] h-[32px] w-[3px] rounded-l-[2px] bg-[#5c5c60]"
        />
        <div
          aria-hidden
          className="absolute -right-[3px] top-[100px] h-[56px] w-[3px] rounded-r-[2px] bg-[#5c5c60]"
        />

        <div
          className="rounded-[42px] p-[8px] shadow-[0_18px_40px_rgba(0,0,0,0.28),0_4px_10px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.28),inset_0_-1px_0_rgba(0,0,0,0.55)]"
          style={{
            background:
              "linear-gradient(160deg, #4a4a4e 0%, #1c1c1e 22%, #111113 100%)",
          }}
        >
          <div
            className="relative overflow-hidden rounded-[34px] bg-[#f2f2f7] text-[#1d1d1f] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.45)]"
            style={{ fontFamily: PHONE_TYPE }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[8px] z-10 h-[24px] w-[78px] -translate-x-1/2 rounded-full bg-black"
            />

            <div
              aria-hidden
              className="flex h-[40px] items-end justify-between px-[16px] pb-[5px] text-[11px] font-semibold tracking-tight"
            >
              <span>8:14</span>
              <span className="flex items-center gap-[5px]">
                <SignalIcon />
                <WifiIcon />
                <BatteryIcon />
              </span>
            </div>

            <h3 className="px-[16px] pt-[4px] text-[22px] font-bold leading-none tracking-tight">
              {heading}
            </h3>

            <div
              aria-hidden
              className="mt-[12px] grid grid-cols-7 px-[8px]"
            >
              {SCHEDULE.map((d) => {
                const hasEvent = eventDates.has(d.date);
                const num = d.date.split(" ").pop();
                return (
                  <div key={d.day} className="flex flex-col items-center gap-[3px]">
                    <span className="text-[10px] font-medium text-[#6e6e73]">
                      {d.day.charAt(0)}
                    </span>
                    <span className="text-[13px] font-semibold tabular-nums">{num}</span>
                    <span
                      className={`h-[4px] w-[4px] rounded-full ${
                        hasEvent ? "bg-[#ff3b30]" : "bg-transparent"
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            <ul className="mt-[4px] pb-[2px]">
              {PERSONAL_CALENDAR.map((event) => (
                <li
                  key={event.date}
                  className="flex items-start gap-[10px] border-t border-black/10 px-[14px] py-[10px]"
                >
                  <div className="w-[36px] shrink-0 pt-[1px] text-center">
                    <div className="text-[18px] font-semibold leading-none tabular-nums">
                      {event.date.split(" ").pop()}
                    </div>
                    <div className="mt-[3px] text-[10px] font-medium uppercase tracking-wide text-[#6e6e73]">
                      {event.day}
                    </div>
                  </div>
                  <span
                    aria-hidden
                    className="mt-[3px] h-[30px] w-[3px] shrink-0 rounded-full bg-[#ff3b30]"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-semibold leading-tight">
                      {event.title[lang]}
                    </div>
                    <div className="mt-[2px] text-[12px] tabular-nums text-[#3a3a3c]">
                      {event.time}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div aria-hidden className="flex justify-center pb-[8px] pt-[2px]">
              <div className="h-[4px] w-[96px] rounded-full bg-[#1d1d1f]/25" />
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-2 text-center text-[12px] text-[var(--text-secondary)]">
        {label}
      </figcaption>
    </figure>
  );
}

function SignalIcon() {
  return (
    <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
      <rect x="0" y="7" width="3" height="4" rx="0.6" />
      <rect x="4.2" y="5" width="3" height="6" rx="0.6" />
      <rect x="8.4" y="2.5" width="3" height="8.5" rx="0.6" />
      <rect x="12.6" y="0" width="3" height="11" rx="0.6" opacity="0.28" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
      <path
        d="M1.2 4.4c3.2-3.1 8.4-3.1 11.6 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M3.2 6.6c2.1-2 5.5-2 7.6 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="7" cy="9.3" r="1.15" fill="currentColor" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="24" height="11" viewBox="0 0 24 11" fill="none">
      <rect
        x="0.6"
        y="0.6"
        width="20"
        height="9.8"
        rx="2.2"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect x="2.2" y="2.2" width="13.5" height="6.6" rx="1.2" fill="currentColor" />
      <path d="M22 3.4v4.2a1.6 1.6 0 0 0 0-4.2Z" fill="currentColor" opacity="0.45" />
    </svg>
  );
}

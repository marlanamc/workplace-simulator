"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  SCHEDULE,
  scheduleAfterSwap,
  SCHEDULE_COPY,
  LESSONS,
  WRONG_SWAP_HINT,
  STUCK_SWAP_HINT,
  RIGHT_NOW_STEPS,
  RIGHT_NOW_LABEL,
} from "@/lib/tasks/schedule/content";
import { useNudge } from "@/lib/use-nudge";
import { TASK_ICONS } from "@/lib/icons";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import PhoneCalendar from "@/components/task/PhoneCalendar";
import RightNowBar from "@/components/task/RightNowBar";
import ShowMeHighlight from "@/components/task/ShowMeHighlight";
import { useShowMe, SHOW_ME_POINTER } from "@/lib/use-show-me";

export default function ScheduleTask({ onRequestSwap }: { onRequestSwap: (day: string) => void }) {
  const { completedTaskKeys, lang } = useProgress();
  // Once the swap is filed this tab is just the learner's schedule: read-only,
  // Thursday on the late shift. It used to open on Day 2's green "You noticed
  // the conflict" on every later day (Phase 3 F-9). The job itself finishes,
  // and says so, on the swap form.
  const settled = completedTaskKeys.includes("schedule");
  const days = settled ? scheduleAfterSwap() : SCHEDULE;
  const [wrongDays, setWrongDays] = useState(0);
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
    if (!d.conflict) {
      setWrongDays((count) => count + 1);
      say((wrongDays >= 1 ? STUCK_SWAP_HINT : WRONG_SWAP_HINT)[lang]);
      return;
    }
    onRequestSwap(d.key);
  };

  return (
    <div className="relative">
      <div className="mb-1 flex items-center justify-between gap-3">
        <h2 className="text-[19px] font-medium">{c.heading}</h2>
      </div>
      <p className="mb-4 text-[14px] text-text-secondary">{c.subhead}</p>

      {!settled && (
        <RightNowBar
          icon={TASK_ICONS.schedule}
          stepIndex={0}
          stepCount={RIGHT_NOW_STEPS.length}
          instruction={wrongDays >= 2 ? STUCK_SWAP_HINT : RIGHT_NOW_STEPS[0]}
          lang={lang}
          rightNowLabel={RIGHT_NOW_LABEL}
          onShowMe={() => showMe.toggleFor(showMeId)}
          showMeActive={showMe.targetId === showMeId}
          onHelp={() => setHelp(true)}
        />
      )}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-border bg-white">
          {days.map((d, i) => (
            <div
              key={d.key}
              data-shift-day={d.key}
              className={`flex items-center justify-between gap-3 px-4 py-3.5 ${i !== 0 ? "border-t border-border" : ""}`}
            >
              {/* The day and time are what the step asks the learner to
                    read: the floating card keeps off them (Phase 3 F-3). Only
                while it is the job: afterwards the card has no reason to
                leave its corner for them. */}
              <div
                data-card-read={settled ? undefined : ""}
                className="flex min-w-0 flex-1 items-center gap-3"
              >
                <span className="w-11 shrink-0 text-[14px] font-semibold text-text-primary">
                  {d.day[lang]}
                </span>
                <span className="shrink-0 text-[13px] text-text-tertiary">
                  {d.date[lang]}
                </span>
                <div
                  className={
                    d.shift
                      ? "text-[14px] font-medium text-text-primary"
                      : "text-[14px] text-text-tertiary"
                  }
                >
                  {d.shift ?? c.off}
                </div>
              </div>
              {d.shift && !settled && (
                <button
                  data-showme={d.conflict ? "swap-button" : undefined}
                  onClick={() => pickDay(d)}
                  className="shrink-0 rounded-full border border-border px-3 py-1.5 text-[13px] font-medium text-text-primary hover:bg-surface-muted cursor-pointer"
                >
                  {c.pickConflict}
                </button>
              )}
            </div>
          ))}
        </div>

        <aside data-card-read={settled ? undefined : ""} className="w-full shrink-0 lg:w-[260px]">
          <PhoneCalendar
            label={c.phoneLabel}
            heading={c.phoneHeading}
            lang={lang}
          />
        </aside>
      </div>

      <HelpDrawer
        open={help}
        onClose={() => setHelp(false)}
        kicker={c.lessonKicker}
        lesson={LESSONS[lang][0]}
        tipLabel={c.tipLabel}
        gotItLabel={c.gotIt}
      />

      <NudgeToast text={nudge} onDismiss={dismiss} />
      <ShowMeHighlight
        targetId={showMe.targetId}
        label={SHOW_ME_POINTER[lang]}
        onDismiss={showMe.clear}
      />
    </div>
  );
}

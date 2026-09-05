"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  SCHEDULE,
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
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import RightNowBar from "@/components/task/RightNowBar";
import ShowMeHighlight from "@/components/task/ShowMeHighlight";
import { useShowMe, SHOW_ME_POINTER } from "@/lib/use-show-me";

type View = "list" | "done";

export default function ScheduleTask({ onRequestSwap }: { onRequestSwap: (day: string) => void }) {
  const { completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("schedule") ? "done" : "list");
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
    onRequestSwap(d.day);
  };

  const restart = () => {
    setWrongDays(0);
    dismiss();
    setView("list");
  };

  return (
    <div className="relative">
      <div className="mb-1 flex items-center justify-between gap-3">
        <h2 className="text-[19px] font-medium">{c.heading}</h2>
      </div>
      <p className="mb-4 text-[14px] text-text-secondary">{c.subhead}</p>

      {view !== "done" && (
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

      {view === "list" && (
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-border bg-white">
            {SCHEDULE.map((d, i) => (
              <div
                key={d.day}
                className={`flex items-center justify-between gap-3 px-4 py-3.5 ${i !== 0 ? "border-t border-border" : ""}`}
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="w-11 shrink-0 text-[14px] font-semibold text-text-primary">{d.day}</span>
                  <span className="shrink-0 text-[13px] text-text-tertiary">{d.date}</span>
                  <div
                    className={
                      d.shift
                        ? "text-[14px] font-medium text-text-primary"
                        : "text-[14px] text-text-tertiary"
                    }
                  >
                    {d.shift ?? "Off"}
                  </div>
                </div>
                {d.shift && (
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

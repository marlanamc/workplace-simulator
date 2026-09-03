"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  SLIDES_COPY,
  LESSONS,
  RIGHT_NOW_LABEL,
  RIGHT_NOW_STEPS,
  PLANTED_TOTAL,
  slideDeckPasses,
} from "@/lib/tasks/slide-deck/content";
import { useNudge } from "@/lib/use-nudge";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import { TASK_ICONS } from "@/lib/icons";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import RightNowBar from "@/components/task/RightNowBar";

export default function SlideDeckTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [done, setDone] = useState(completedTaskKeys.includes("slide-deck"));
  const [index, setIndex] = useState(0);
  const [title, setTitle] = useState("");
  const [takeaway, setTakeaway] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [presenting, setPresenting] = useState(false);
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const c = SLIDES_COPY[lang];

  const goNext = () => {
    if (index === 0 && title.trim().length < 2) return say(c.needTitle);
    if (index === 1 && !confirmed) return say(c.needConfirm);
    if (index < 2) setIndex((n) => n + 1);
  };

  const tryPresent = () => {
    if (!slideDeckPasses({ title, takeaway, confirmedTotal: confirmed, presented: true })) {
      if (title.trim().length < 2) return say(c.needTitle);
      if (!confirmed) return say(c.needConfirm);
      return say(c.needTakeaway);
    }
    setPresenting(true);
    setDone(true);
    markComplete("slide-deck", "present_three_slides");
  };

  const restart = () => {
    setDone(false);
    setIndex(0);
    setTitle("");
    setTakeaway("");
    setConfirmed(false);
    setPresenting(false);
  };

  const stepIndex = index === 0 ? 0 : index === 1 ? 1 : 2;

  if (done) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-white" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="mx-auto flex max-w-[640px] flex-col gap-5">
            <TaskDoneCard kicker={c.sentKicker} />
            <TaskDoneActions kicker={c.sentKicker} tryAgainLabel={c.tryAgain} backToDeskLabel={c.backToDesk} onTryAgain={restart} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-[#f8f9fa] text-[14px] text-[#202124]" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div className="flex items-center gap-3 border-b border-[#e0e0e0] bg-white px-4 py-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded bg-[#f9ab00] text-white">
          {(() => {
            const Icon = TASK_ICONS["slide-deck"];
            return <Icon size={18} strokeWidth={2.25} />;
          })()}
        </span>
        <span className="text-[18px] text-[#3c4043]">{c.appName}</span>
        <span className="ml-auto text-[13px] text-[#5f6368]">{c.slideOf(index + 1)}</span>
      </div>

      <RightNowBar
        icon={TASK_ICONS["slide-deck"]}
        stepIndex={stepIndex}
        steps={RIGHT_NOW_STEPS}
        lang={lang}
        rightNowLabel={RIGHT_NOW_LABEL}
        onHelp={() => setHelp(true)}
      />

      <div className="flex min-h-0 flex-1 items-center justify-center p-6">
        <div
          className="flex aspect-[16/9] w-full max-w-[720px] flex-col justify-center rounded-sm bg-white px-12 py-10 shadow-[0_1px_3px_rgba(60,64,67,.3)]"
          style={{ background: presenting ? "#202124" : "#fff", color: presenting ? "#fff" : "#202124" }}
        >
          {presenting ? (
            <p className="text-center text-[22px] font-medium">{c.presenting}</p>
          ) : index === 0 ? (
            <>
              <label className="mb-2 text-[12px] font-medium uppercase tracking-wide text-[#5f6368]">{c.titleLabel}</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={c.titlePlaceholder}
                className="w-full border-0 border-b border-[#dadce0] bg-transparent pb-2 text-[28px] font-medium outline-none focus:border-[#1a73e8]"
              />
            </>
          ) : index === 1 ? (
            <>
              <p className="text-[12px] font-medium uppercase tracking-wide text-[#5f6368]">{c.numberKicker}</p>
              <p className="mt-4 text-[48px] font-medium tabular-nums">${PLANTED_TOTAL}</p>
              <p className="mt-2 text-[14px] text-[#5f6368]">{c.numberBody}</p>
              <label className="mt-6 flex items-center gap-2 text-[14px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                />
                {c.confirm}
              </label>
            </>
          ) : (
            <>
              <label className="mb-2 text-[12px] font-medium uppercase tracking-wide text-[#5f6368]">{c.takeawayLabel}</label>
              <textarea
                value={takeaway}
                onChange={(e) => setTakeaway(e.target.value)}
                placeholder={c.takeawayPlaceholder}
                rows={4}
                className="w-full resize-none rounded border border-[#dadce0] px-3 py-2 text-[16px] outline-none focus:border-[#1a73e8]"
              />
            </>
          )}
        </div>
      </div>

      {!presenting && (
        <div className="flex items-center justify-between border-t border-[#e0e0e0] bg-white px-4 py-3">
          <button
            type="button"
            onClick={() => setIndex((n) => Math.max(0, n - 1))}
            disabled={index === 0}
            className="min-h-[40px] rounded-lg px-4 text-[14px] font-medium text-[#1a73e8] disabled:text-[#9aa0a6] cursor-pointer disabled:cursor-default"
          >
            {c.back}
          </button>
          {index < 2 ? (
            <button
              type="button"
              onClick={goNext}
              className="min-h-[40px] rounded-lg bg-[#1a73e8] px-5 text-[14px] font-medium text-white cursor-pointer"
            >
              {c.next}
            </button>
          ) : (
            <button
              type="button"
              onClick={tryPresent}
              className="min-h-[40px] rounded-lg bg-[#c5221f] px-5 text-[14px] font-medium text-white cursor-pointer"
            >
              {c.present}
            </button>
          )}
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
    </div>
  );
}

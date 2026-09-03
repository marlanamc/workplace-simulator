"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  REVIEW_COPY,
  PROFILE,
  STRENGTH_STARTERS,
  AREA_STARTERS,
  LESSONS,
  RIGHT_NOW_LABEL,
  RIGHT_NOW_STEPS,
  strengthIsSpecific,
  areaToGrowIsConstructive,
  performanceReviewPasses,
} from "@/lib/tasks/performance-review/content";
import { useNudge } from "@/lib/use-nudge";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import NeedAStart from "@/components/task/NeedAStart";
import { TASK_ICONS } from "@/lib/icons";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import RightNowBar from "@/components/task/RightNowBar";

export default function PerformanceReviewTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [done, setDone] = useState(completedTaskKeys.includes("performance-review"));
  const [strength, setStrength] = useState("");
  const [area, setArea] = useState("");
  const [touched, setTouched] = useState(false);
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const c = REVIEW_COPY[lang];

  const stepIndex = !touched ? 0 : !strengthIsSpecific(strength) ? 1 : 2;

  const submit = () => {
    setTouched(true);
    if (!strengthIsSpecific(strength)) {
      return say(strength.trim() ? c.vagueStrength : c.needStrength);
    }
    if (!areaToGrowIsConstructive(area)) return say(c.needArea);
    if (!performanceReviewPasses({ strength, area })) return say(c.needArea);
    setDone(true);
    markComplete("performance-review", "write_a_fair_review");
  };

  const restart = () => {
    setDone(false);
    setStrength("");
    setArea("");
    setTouched(false);
  };

  if (done) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-white" style={{ fontFamily: "Roboto, Arial, sans-serif" }}>
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="mx-auto flex max-w-[640px] flex-col gap-5">
            <TaskDoneCard kicker={c.sentKicker} />
            <TaskDoneActions kicker={c.sentKicker} tryAgainLabel={c.tryAgain} backToDeskLabel={c.backToDesk} onTryAgain={restart} />
          </div>
        </div>
        <NudgeToast text={nudge} onDismiss={dismiss} />
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-[#f8f9fa] text-[14px] text-[#202124]" style={{ fontFamily: "Roboto, Arial, sans-serif" }}>
      <div className="flex items-center gap-3 border-b border-[#e0e0e0] bg-white px-4 py-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded bg-[#7248b9] text-white">
          {(() => {
            const Icon = TASK_ICONS["performance-review"];
            return <Icon size={18} strokeWidth={2.25} />;
          })()}
        </span>
        <span className="text-[18px] text-[#3c4043]">{c.appName}</span>
      </div>

      <RightNowBar
        icon={TASK_ICONS["performance-review"]}
        stepIndex={stepIndex}
        steps={RIGHT_NOW_STEPS}
        lang={lang}
        rightNowLabel={RIGHT_NOW_LABEL}
        onHelp={() => setHelp(true)}
      />

      <div className="min-h-0 flex-1 overflow-auto p-6">
        <div className="mx-auto flex max-w-[560px] flex-col gap-5">
          <div>
            <div className="text-[12px] font-medium uppercase tracking-wide text-[#5f6368]">{c.formTitle}</div>
            <div className="mt-3 rounded-xl border border-[#dadce0] bg-white p-4">
              <div className="text-[16px] font-medium">{PROFILE.name}</div>
              <div className="text-[13px] text-[#5f6368]">{PROFILE.role[lang]}</div>
              <div className="mt-3 text-[12px] font-medium uppercase tracking-wide text-[#5f6368]">{c.winsLabel}</div>
              <ul className="mt-1 list-disc pl-5 text-[14px] leading-relaxed text-[#3c4043]">
                {PROFILE.wins.map((w, i) => (
                  <li key={i}>{w[lang]}</li>
                ))}
              </ul>
              <div className="mt-3 text-[12px] font-medium uppercase tracking-wide text-[#5f6368]">{c.issueLabel}</div>
              <p className="mt-1 text-[14px] leading-relaxed text-[#3c4043]">{PROFILE.issue[lang]}</p>
            </div>
          </div>

          <div>
            <label className="text-[12px] font-medium uppercase tracking-wide text-[#5f6368]">{c.strengthLabel}</label>
            <textarea
              value={strength}
              onChange={(e) => setStrength(e.target.value)}
              placeholder={c.strengthPlaceholder}
              rows={3}
              className="mt-2 w-full resize-y rounded-xl border border-[#dadce0] p-3 text-[15px] leading-relaxed outline-none focus:border-[#1a73e8]"
            />
            <div className="mt-2">
              <NeedAStart lang={lang} starters={STRENGTH_STARTERS[lang]} onPick={(s) => setStrength((b) => (b ? `${b} ` : "") + s)} />
            </div>
          </div>

          <div>
            <label className="text-[12px] font-medium uppercase tracking-wide text-[#5f6368]">{c.areaLabel}</label>
            <textarea
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder={c.areaPlaceholder}
              rows={3}
              className="mt-2 w-full resize-y rounded-xl border border-[#dadce0] p-3 text-[15px] leading-relaxed outline-none focus:border-[#1a73e8]"
            />
            <div className="mt-2">
              <NeedAStart lang={lang} starters={AREA_STARTERS[lang]} onPick={(s) => setArea((b) => (b ? `${b} ` : "") + s)} />
            </div>
          </div>

          <button onClick={submit} className="inline-flex min-h-[44px] w-fit items-center rounded-full bg-accent px-5 text-[15px] font-medium text-white cursor-pointer">
            {c.submit}
          </button>
        </div>
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
    </div>
  );
}

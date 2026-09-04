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
import {
  FormsShell,
  FormTitleCard,
  QuestionCard,
  FormTextarea,
  FormSubmitButton,
} from "@/components/task/FormsShell";

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
      <FormsShell>
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="mx-auto flex max-w-[640px] flex-col gap-5">
            <TaskDoneCard kicker={c.sentKicker} />
            <TaskDoneActions kicker={c.sentKicker} tryAgainLabel={c.tryAgain} backToDeskLabel={c.backToDesk} onTryAgain={restart} />
          </div>
        </div>
        <NudgeToast text={nudge} onDismiss={dismiss} />
      </FormsShell>
    );
  }

  return (
    <FormsShell>
      <RightNowBar
        icon={TASK_ICONS["performance-review"]}
        stepIndex={stepIndex}
        steps={RIGHT_NOW_STEPS}
        lang={lang}
        rightNowLabel={RIGHT_NOW_LABEL}
        onHelp={() => setHelp(true)}
      />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-[640px] flex-col gap-3 px-4 py-6">
          <FormTitleCard title={c.formTitle} requiredLabel={lang === "en" ? "Required" : "Obligatorio"} />

          <div className="rounded-lg bg-white px-6 py-5 shadow-[0_1px_2px_rgba(0,0,0,.15)]">
            <div className="text-[16px] font-medium text-[#202124]">{PROFILE.name}</div>
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

          <QuestionCard label={c.strengthLabel} required>
            <FormTextarea
              value={strength}
              onChange={(e) => setStrength(e.target.value)}
              placeholder={c.strengthPlaceholder}
            />
            <div className="mt-3">
              <NeedAStart lang={lang} starters={STRENGTH_STARTERS[lang]} onPick={(s) => setStrength((b) => (b ? `${b} ` : "") + s)} />
            </div>
          </QuestionCard>

          <QuestionCard label={c.areaLabel} required>
            <FormTextarea
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder={c.areaPlaceholder}
            />
            <div className="mt-3">
              <NeedAStart lang={lang} starters={AREA_STARTERS[lang]} onPick={(s) => setArea((b) => (b ? `${b} ` : "") + s)} />
            </div>
          </QuestionCard>

          <div className="pt-1">
            <FormSubmitButton onClick={submit}>{c.submit}</FormSubmitButton>
          </div>
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
    </FormsShell>
  );
}

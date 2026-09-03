"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  RESEARCH_COPY,
  RESULTS,
  CREDIBLE_KEY,
  STARTERS,
  LESSONS,
  whyHoldsUp,
  RIGHT_NOW_STEPS,
  RIGHT_NOW_LABEL,
} from "@/lib/tasks/research/content";
import { useNudge } from "@/lib/use-nudge";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import NeedAStart from "@/components/task/NeedAStart";
import { TASK_ICONS } from "@/lib/icons";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import RightNowBar from "@/components/task/RightNowBar";

export default function LibrarySearchTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [done, setDone] = useState(completedTaskKeys.includes("research"));
  const [picked, setPicked] = useState<string | null>(null);
  const [why, setWhy] = useState("");
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const c = RESEARCH_COPY[lang];

  const tryCite = () => {
    if (!picked) return say(c.needPick);
    if (picked !== CREDIBLE_KEY) {
      return say(lang === "en"
        ? "That one does not hold up. Look for a named author and a library database."
        : "Esa no se sostiene. Busca un autor nombrado y una base de datos.");
    }
    if (!why.trim()) return say(c.empty);
    if (!whyHoldsUp(why)) return say(c.weak);
    setDone(true);
    markComplete("research", "cite_a_credible_source");
  };

  const restart = () => {
    setDone(false);
    setPicked(null);
    setWhy("");
  };

  const stepIndex = !picked ? 0 : 2;

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-white text-[14px] text-[#202124]">
      <div className="flex items-center gap-3 border-b border-[#e0e0e0] bg-[#5f6368] px-4 py-2.5 text-white">
        <span className="text-[15px] font-semibold">{c.heading}</span>
        <span className="rounded-full bg-white/15 px-3 py-0.5 text-[12px]">{c.query}</span>
      </div>
      {!done && (
        <RightNowBar
          icon={TASK_ICONS.research}
          stepIndex={stepIndex}
          stepCount={RIGHT_NOW_STEPS.length}
          instruction={RIGHT_NOW_STEPS[stepIndex]}
          lang={lang}
          rightNowLabel={RIGHT_NOW_LABEL}
          onHelp={() => setHelp(true)}
        />
      )}
      {done ? (
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="mx-auto flex max-w-[640px] flex-col gap-5">
            <TaskDoneCard kicker={c.sentKicker} />
            <TaskDoneActions kicker={c.sentKicker} tryAgainLabel={c.tryAgain} backToDeskLabel={c.backToDesk} onTryAgain={restart} />
          </div>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="mx-auto flex max-w-[680px] flex-col gap-3">
            <div className="text-[13px] font-medium text-[#5f6368]">{c.pickLabel}</div>
            {RESULTS.map((row) => {
              const selected = picked === row.key;
              return (
                <button
                  key={row.key}
                  type="button"
                  onClick={() => setPicked(row.key)}
                  className={`rounded-xl border px-4 py-3 text-left cursor-pointer ${
                    selected ? "border-[#1a73e8] bg-[#e8f0fe]" : "border-[#dadce0] bg-white hover:bg-[#f8f9fa]"
                  }`}
                >
                  <div className="text-[11px] font-medium uppercase tracking-wide text-[#5f6368]">{row.kind[lang]}</div>
                  <div className="mt-0.5 text-[16px] font-medium text-[#1a0dab]">{row.title[lang]}</div>
                  <div className="mt-0.5 text-[13px] text-[#188038]">{row.source[lang]}</div>
                  <p className="mt-1 text-[13px] text-[#5f6368]">{row.blurb[lang]}</p>
                </button>
              );
            })}
            <div className="mt-2 rounded-xl border border-[#dadce0] bg-[#f8f9fa] p-4">
              <div className="text-[13px] font-medium text-[#5f6368]">{c.whyLabel}</div>
              <textarea
                value={why}
                onChange={(e) => setWhy(e.target.value)}
                placeholder={c.whyHint}
                className="mt-2 min-h-[72px] w-full resize-y rounded-lg border border-[#dadce0] bg-white px-3 py-2 text-[15px] outline-none"
              />
              <NeedAStart lang={lang} starters={STARTERS[lang]} onPick={(s) => setWhy((b) => (b ? `${b} ` : "") + s)} />
              <button
                type="button"
                onClick={tryCite}
                className="mt-3 inline-flex min-h-[46px] items-center rounded-full bg-[#5f6368] px-5 text-[15px] font-medium text-white cursor-pointer"
              >
                {c.cite}
              </button>
            </div>
          </div>
        </div>
      )}
      <HelpDrawer open={help} onClose={() => setHelp(false)} kicker={c.lessonKicker} lesson={LESSONS[lang][0]} tipLabel={c.tipLabel} gotItLabel={c.gotIt} />
      <NudgeToast text={nudge} onDismiss={dismiss} />
    </div>
  );
}

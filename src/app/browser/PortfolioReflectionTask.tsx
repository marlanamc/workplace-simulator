"use client";

import { useMemo, useState } from "react";
import { useProgress } from "@/lib/progress-context";
import { earnedAwardsByAct } from "@/lib/tracks-content";
import { SKILLS } from "@/lib/skills";
import {
  REFLECTION_COPY,
  PROMPTS,
  LESSONS,
  RIGHT_NOW_LABEL,
  RIGHT_NOW_STEPS,
  reflectionComplete,
} from "@/lib/tasks/portfolio-reflection/content";
import { useNudge } from "@/lib/use-nudge";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import { TASK_ICONS } from "@/lib/icons";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import RightNowBar from "@/components/task/RightNowBar";

type View = "review" | "reflect" | "done";

function actNumeral(title: string): string {
  return title.match(/^Act ([IVX]+)/)?.[1] ?? title;
}

function AwardList({
  awards,
  emptyLabel,
}: {
  awards: ReturnType<typeof earnedAwardsByAct>;
  emptyLabel: string;
}) {
  if (awards.length === 0) {
    return <p className="text-[14px] text-[#5f6368]">{emptyLabel}</p>;
  }
  return (
    <div className="flex flex-col gap-4">
      {awards.map(({ act, tracks }) => (
        <section key={act.key}>
          <div className="text-[11px] font-medium tracking-wide text-[#5f6368]">
            {actNumeral(act.title)} · {act.title.replace(/^Act [IVX]+:\s*/, "")}
          </div>
          <ul className="mt-1.5 flex flex-col gap-1.5">
            {tracks.map((track) =>
              track.taskKeys.map((taskKey) => (
                <li key={taskKey} className="flex items-start gap-2 text-[14px] leading-snug">
                  <span aria-hidden>{track.awardEmoji}</span>
                  <span>{SKILLS[taskKey]}</span>
                </li>
              )),
            )}
          </ul>
        </section>
      ))}
    </div>
  );
}

export default function PortfolioReflectionTask() {
  const { markComplete, completedTaskKeys, certificateTrackKeys, lang } = useProgress();
  const [view, setView] = useState<View>(
    completedTaskKeys.includes("portfolio-reflection") ? "done" : "review",
  );
  const [answers, setAnswers] = useState<string[]>(() => PROMPTS.map(() => ""));
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const c = REFLECTION_COPY[lang];

  const awards = useMemo(() => earnedAwardsByAct(certificateTrackKeys), [certificateTrackKeys]);
  const stepIndex = view === "review" ? 0 : view === "reflect" ? 1 : 2;

  const setAnswer = (i: number, value: string) => {
    setAnswers((prev) => prev.map((a, j) => (j === i ? value : a)));
  };

  const submit = () => {
    if (!reflectionComplete(answers)) return say(c.needAll);
    setView("done");
    markComplete("portfolio-reflection", "look_back");
  };

  const restart = () => {
    setView("review");
    setAnswers(PROMPTS.map(() => ""));
  };

  if (view === "done") {
    return (
      <div className="flex h-full min-h-0 flex-col bg-white text-[14px] text-[#202124]" style={{ fontFamily: "Roboto, Arial, sans-serif" }}>
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="mx-auto flex max-w-[640px] flex-col gap-5">
            <TaskDoneCard kicker={c.sentKicker} />
            <div className="rounded-2xl border border-[#dadce0] bg-white p-5">
              <h2 className="text-[18px] font-medium">{c.summaryTitle}</h2>
              <p className="mt-1 text-[13px] leading-relaxed text-[#5f6368]">{c.summaryIntro}</p>

              <div className="mt-4 text-[12px] font-medium uppercase tracking-wide text-[#5f6368]">{c.canDoHeading}</div>
              <div className="mt-2">
                <AwardList awards={awards} emptyLabel={c.noAwardsYet} />
              </div>

              <div className="mt-5 text-[12px] font-medium uppercase tracking-wide text-[#5f6368]">{c.reflectionHeading}</div>
              <dl className="mt-2 flex flex-col gap-3">
                {PROMPTS.map((prompt, i) => (
                  <div key={i}>
                    <dt className="text-[13px] font-medium text-[#3c4043]">{prompt[lang]}</dt>
                    <dd className="mt-0.5 text-[14px] leading-relaxed">{answers[i]}</dd>
                  </div>
                ))}
              </dl>
            </div>
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
        <span className="flex h-8 w-8 items-center justify-center rounded bg-[#c9a227] text-white">
          {(() => {
            const Icon = TASK_ICONS["portfolio-reflection"];
            return <Icon size={18} strokeWidth={2.25} />;
          })()}
        </span>
        <span className="text-[18px] text-[#3c4043]">{c.appName}</span>
      </div>

      <RightNowBar
        icon={TASK_ICONS["portfolio-reflection"]}
        stepIndex={stepIndex}
        steps={RIGHT_NOW_STEPS}
        lang={lang}
        rightNowLabel={RIGHT_NOW_LABEL}
        onHelp={() => setHelp(true)}
      />

      <div className="min-h-0 flex-1 overflow-auto p-6">
        <div className="mx-auto flex max-w-[600px] flex-col gap-5">
          {view === "review" && (
            <>
              <div>
                <h2 className="text-[20px] font-medium leading-tight">{c.reviewTitle}</h2>
                <p className="mt-1 text-[13px] leading-relaxed text-[#5f6368]">{c.reviewIntro}</p>
              </div>
              <div className="rounded-2xl border border-[#dadce0] bg-white p-5">
                <AwardList awards={awards} emptyLabel={c.noAwardsYet} />
              </div>
              <button
                onClick={() => setView("reflect")}
                className="inline-flex min-h-[44px] w-fit items-center rounded-full bg-accent px-5 text-[15px] font-medium text-white cursor-pointer"
              >
                {lang === "en" ? "Next: look back" : "Siguiente: mirar atrás"}
              </button>
            </>
          )}

          {view === "reflect" && (
            <>
              <div>
                <h2 className="text-[20px] font-medium leading-tight">{c.reflectTitle}</h2>
                <p className="mt-1 text-[13px] leading-relaxed text-[#5f6368]">{c.reflectIntro}</p>
              </div>
              {PROMPTS.map((prompt, i) => (
                <div key={i}>
                  <label className="text-[14px] font-medium text-[#3c4043]">{prompt[lang]}</label>
                  <textarea
                    value={answers[i]}
                    onChange={(e) => setAnswer(i, e.target.value)}
                    placeholder={c.answerPlaceholder}
                    rows={3}
                    className="mt-2 w-full resize-y rounded-xl border border-[#dadce0] p-3 text-[15px] leading-relaxed outline-none focus:border-[#1a73e8]"
                  />
                </div>
              ))}
              <button
                onClick={submit}
                className="inline-flex min-h-[44px] w-fit items-center rounded-full bg-accent px-5 text-[15px] font-medium text-white cursor-pointer"
              >
                {c.submit}
              </button>
            </>
          )}
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

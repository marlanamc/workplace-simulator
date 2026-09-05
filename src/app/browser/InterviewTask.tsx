"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import { useWindowManager } from "@/lib/window-manager";
import { TASK_ICONS } from "@/lib/icons";
import { useNudge } from "@/lib/use-nudge";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import NeedAStart from "@/components/task/NeedAStart";
import RightNowBar from "@/components/task/RightNowBar";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import {
  INTERVIEW_COPY,
  QUESTIONS,
  ASK_BACK_CHOICES,
  LESSONS,
  RIGHT_NOW_LABEL,
  RIGHT_NOW_STEPS,
  answerLooksReal,
  describeSubmission,
} from "@/lib/tasks/interview-practice/content";

export default function InterviewTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const { browserTabToken } = useWindowManager();

  const [done, setDone] = useState(completedTaskKeys.includes("interview-practice"));
  const [lastToken, setLastToken] = useState(browserTabToken);
  if (browserTabToken !== lastToken) {
    setLastToken(browserTabToken);
    setDone(completedTaskKeys.includes("interview-practice"));
  }

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [askBackKey, setAskBackKey] = useState<string | null>(null);
  const [askBackCustom, setAskBackCustom] = useState("");
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();

  const c = INTERVIEW_COPY[lang];

  const setAnswer = (key: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [key]: value }));

  const askBackText =
    askBackKey === "custom"
      ? askBackCustom
      : ASK_BACK_CHOICES.find((a) => a.key === askBackKey)?.text[lang] ?? "";

  const answersReady = QUESTIONS.every((q) => answerLooksReal(answers[q.key] ?? ""));

  const tryFinish = () => {
    if (!answersReady) return say(c.needAnswers);
    if (!askBackText.trim()) return say(c.needAskBack);
    setDone(true);
    markComplete(
      "interview-practice",
      "practice_interview",
      describeSubmission({ answers, askBack: askBackText }, lang),
    );
  };

  const restart = () => {
    setDone(false);
    setAnswers({});
    setAskBackKey(null);
    setAskBackCustom("");
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-[#f6f8fc] text-[14px] text-[#202124]">
      <div className="flex items-center gap-3 border-b border-[#dadce0] bg-white px-4 py-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8430ce] text-[12px] font-bold text-white" aria-hidden>
          AR
        </span>
        <div className="leading-tight">
          <div className="text-[14px] font-medium text-[#3c4043]">{c.interviewer}</div>
          <div className="text-[11px] text-[#5f6368]">{c.interviewerTitle}</div>
        </div>
      </div>

      {!done && (
        <RightNowBar
          icon={TASK_ICONS["interview-practice"]}
          stepIndex={answersReady ? 1 : 0}
          steps={RIGHT_NOW_STEPS}
          lang={lang}
          rightNowLabel={RIGHT_NOW_LABEL}
          onHelp={() => setHelp(true)}
        />
      )}

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4">
          {done ? (
            <>
              <TaskDoneCard kicker={c.sentKicker} />
              <p className="text-[14px] leading-relaxed text-[#3c4043]">{c.doneBody}</p>
              <TaskDoneActions
                kicker={c.sentKicker}
                tryAgainLabel={c.tryAgain}
                backToDeskLabel={c.backToDesk}
                onTryAgain={restart}
              />
            </>
          ) : (
            <>
              <p className="text-[13px] leading-relaxed text-[#5f6368]">{c.intro}</p>

              {QUESTIONS.map((q, i) => (
                <section key={q.key} className="rounded-xl border border-[#dadce0] bg-white p-4">
                  <div className="flex gap-2">
                    <span className="text-[13px] font-semibold text-[#8430ce]">{i + 1}.</span>
                    <span className="text-[15px] font-medium text-[#202124]">{q.question[lang]}</span>
                  </div>
                  <div className="mt-1.5 rounded-lg bg-[#f3e9fb] px-3 py-2 text-[12px] leading-snug text-[#5b3a8a]">
                    <span className="font-medium">{c.listeningForLabel}: </span>
                    {q.listeningFor[lang]}
                  </div>
                  <textarea
                    value={answers[q.key] ?? ""}
                    onChange={(e) => setAnswer(q.key, e.target.value)}
                    placeholder={c.answerHint}
                    className="mt-2 min-h-[72px] w-full resize-y rounded-lg border border-[#dadce0] bg-white px-3 py-2 text-[15px] leading-relaxed outline-none focus:border-[#8430ce]"
                  />
                  <div className="mt-1.5">
                    <NeedAStart
                      lang={lang}
                      starters={q.starters[lang]}
                      onPick={(s) => setAnswer(q.key, (answers[q.key] ? `${answers[q.key]} ` : "") + s)}
                    />
                  </div>
                </section>
              ))}

              <section className="rounded-xl border border-[#dadce0] bg-white p-4">
                <div className="text-[14px] font-medium text-[#202124]">{c.askBackLabel}</div>
                <div className="mt-0.5 text-[12px] text-[#5f6368]">{c.askBackHint}</div>
                <div className="mt-3 flex flex-col gap-2">
                  {ASK_BACK_CHOICES.map((a) => {
                    const on = askBackKey === a.key;
                    return (
                      <button
                        key={a.key}
                        type="button"
                        onClick={() => setAskBackKey(a.key)}
                        className={`rounded-lg border px-3 py-2 text-left text-[14px] cursor-pointer ${
                          on ? "border-[#8430ce] bg-[#f3e9fb]" : "border-[#dadce0] bg-white hover:bg-[#f8f9fa]"
                        }`}
                      >
                        {a.text[lang]}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setAskBackKey("custom")}
                    className={`rounded-lg border px-3 py-2 text-left text-[14px] cursor-pointer ${
                      askBackKey === "custom" ? "border-[#8430ce] bg-[#f3e9fb]" : "border-[#dadce0] bg-white hover:bg-[#f8f9fa]"
                    }`}
                  >
                    {lang === "en" ? "Write my own question" : "Escribir mi propia pregunta"}
                  </button>
                  {askBackKey === "custom" && (
                    <input
                      value={askBackCustom}
                      onChange={(e) => setAskBackCustom(e.target.value)}
                      placeholder={lang === "en" ? "Your question…" : "Tu pregunta…"}
                      className="rounded-lg border border-[#dadce0] bg-white px-3 py-2 text-[15px] outline-none focus:border-[#8430ce]"
                    />
                  )}
                </div>
              </section>

              <button
                type="button"
                onClick={tryFinish}
                className="inline-flex min-h-[46px] items-center justify-center self-start rounded-full bg-[#8430ce] px-6 text-[15px] font-medium text-white cursor-pointer hover:brightness-95"
              >
                {c.finish}
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

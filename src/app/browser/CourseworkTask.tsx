"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  COURSEWORK_COPY,
  DUE,
  STARTERS,
  LESSONS,
  responseIsComplete,
  RIGHT_NOW_STEPS,
  RIGHT_NOW_LABEL,
} from "@/lib/tasks/coursework/content";
import { useNudge } from "@/lib/use-nudge";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import NeedAStart from "@/components/task/NeedAStart";
import { TASK_ICONS } from "@/lib/icons";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import RightNowBar from "@/components/task/RightNowBar";

export default function CourseworkTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const done = completedTaskKeys.includes("coursework");
  const [submitted, setSubmitted] = useState(done);
  const [acked, setAcked] = useState(false);
  const [body, setBody] = useState("");
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const c = COURSEWORK_COPY[lang];

  const trySubmit = () => {
    if (!acked) return say(c.needAck);
    if (!body.trim()) return say(c.empty);
    if (!responseIsComplete(body)) return say(c.weak);
    setSubmitted(true);
    markComplete("coursework", "submit_assignment_on_time");
  };

  const restart = () => {
    setSubmitted(false);
    setAcked(false);
    setBody("");
  };

  const stepIndex = !acked ? 0 : 2;

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-[#f8f9fa] text-[14px] text-[#202124]">
      <div className="flex items-center gap-3 bg-[#1a73e8] px-4 py-2.5 text-white">
        <span className="text-[15px] font-semibold">{c.course}</span>
        <span className="text-[12px] text-white/70">Classroom</span>
      </div>
      {!submitted && (
        <RightNowBar
          icon={TASK_ICONS.coursework}
          stepIndex={stepIndex}
          stepCount={RIGHT_NOW_STEPS.length}
          instruction={RIGHT_NOW_STEPS[stepIndex]}
          lang={lang}
          rightNowLabel={RIGHT_NOW_LABEL}
          onHelp={() => setHelp(true)}
        />
      )}
      {submitted ? (
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="mx-auto flex max-w-[640px] flex-col gap-5">
            <TaskDoneCard kicker={c.sentKicker} />
            <TaskDoneActions kicker={c.sentKicker} tryAgainLabel={c.tryAgain} backToDeskLabel={c.backToDesk} onTryAgain={restart} />
          </div>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="mx-auto flex max-w-[640px] flex-col gap-4">
            <h2 className="text-[20px] font-medium">{c.heading}</h2>
            <div className="rounded-xl border border-[#dadce0] bg-white p-4">
              <div className="text-[12px] font-medium uppercase tracking-wide text-[#5f6368]">{c.dueLabel}</div>
              <div className="mt-1 text-[18px] font-semibold text-[#1a73e8]">{DUE[lang]}</div>
              <p className="mt-3 text-[15px] leading-relaxed">{c.syllabus}</p>
            </div>
            <label className="flex items-start gap-3 rounded-xl border border-[#dadce0] bg-white px-4 py-3 cursor-pointer">
              <input type="checkbox" checked={acked} onChange={(e) => setAcked(e.target.checked)} className="mt-1 h-4 w-4" />
              <span className="text-[15px]">{c.ackLabel}</span>
            </label>
            <div className="rounded-xl border border-[#dadce0] bg-white p-4">
              <div className="text-[16px] font-medium">{c.assignment}</div>
              <p className="mt-1 text-[14px] text-[#5f6368]">{c.prompt}</p>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={c.writeHere}
                className="mt-3 min-h-[130px] w-full resize-y rounded-lg border border-[#dadce0] px-3 py-2 text-[15px] outline-none focus:border-[#1a73e8]"
              />
              <NeedAStart lang={lang} starters={STARTERS[lang]} onPick={(s) => setBody((b) => (b ? `${b} ` : "") + s)} />
            </div>
            <button
              type="button"
              onClick={trySubmit}
              className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-[#1a73e8] px-6 text-[15px] font-medium text-white cursor-pointer"
            >
              {c.submit}
            </button>
          </div>
        </div>
      )}
      <HelpDrawer open={help} onClose={() => setHelp(false)} kicker={c.lessonKicker} lesson={LESSONS[lang][0]} tipLabel={c.tipLabel} gotItLabel={c.gotIt} />
      <NudgeToast text={nudge} onDismiss={dismiss} />
    </div>
  );
}

"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  COURSEWORK_COPY,
  DUE,
  DEADLINE_OPTIONS,
  deadlineIsCorrect,
  STARTERS,
  LESSONS,
  responseIsComplete,
  describeSubmission,
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

/** Google Classroom's colors, so the page looks like the one students use at school. */
const GC = { class: "#1967d2", line: "#dadce0", muted: "#5f6368" } as const;

function ClassroomLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden className="shrink-0">
      <rect x="1" y="3" width="22" height="18" rx="2" fill="#0f9d58" />
      <rect x="3" y="5" width="18" height="12" fill="#57bb8a" />
      <circle cx="12" cy="10" r="2" fill="#fff" />
      <path d="M8 15c0-2 1.8-3 4-3s4 1 4 3" fill="#fff" />
      <rect x="14" y="18" width="5" height="1.5" fill="#fff" />
    </svg>
  );
}

function AssignmentIcon({ muted }: { muted?: boolean }) {
  return (
    <span
      aria-hidden
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
      style={{ background: muted ? "#e8eaed" : GC.class }}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" fill={muted ? GC.muted : "#fff"}>
        <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
      </svg>
    </span>
  );
}

export default function CourseworkTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const done = completedTaskKeys.includes("coursework");
  const [submitted, setSubmitted] = useState(done);
  const [deadline, setDeadline] = useState("");
  const acked = deadlineIsCorrect(deadline);
  const [body, setBody] = useState("");
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const c = COURSEWORK_COPY[lang];

  const trySubmit = () => {
    if (!acked) return say(c.needAck);
    if (!body.trim()) return say(c.empty);
    if (!responseIsComplete(body)) return say(c.weak);
    setSubmitted(true);
    markComplete("coursework", "submit_assignment_on_time", describeSubmission(body, lang));
  };

  const restart = () => {
    setSubmitted(false);
    setDeadline("");
    setBody("");
  };

  const stepIndex = !acked ? 0 : 2;

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-white text-[14px] text-[#3c4043]">
      {/* Classroom app bar */}
      <div className="flex items-center gap-3 border-b px-4 py-2" style={{ borderColor: GC.line }}>
        <span aria-hidden className="w-8 text-center text-[22px]" style={{ color: GC.muted }}>☰</span>
        <ClassroomLogo />
        <span className="flex min-w-0 flex-wrap items-center gap-2 text-[20px]">
          <span style={{ color: GC.muted }}>Classroom</span>
          <span aria-hidden style={{ color: GC.muted }}>›</span>
          <span className="truncate text-[#202124]">{c.course}</span>
        </span>
        <span aria-hidden className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1e8e3e] text-[14px] font-medium text-white">
          Y
        </span>
      </div>
      <nav aria-label={c.course} className="flex justify-center gap-2 border-b text-[14px] font-medium" style={{ borderColor: GC.line }}>
        {c.tabs.map((tab, i) => (
          <span
            key={tab}
            aria-current={i === 1 ? "page" : undefined}
            className="px-5 py-3"
            style={i === 1 ? { color: GC.class, boxShadow: `inset 0 -4px 0 ${GC.class}` } : { color: GC.muted }}
          >
            {tab}
          </span>
        ))}
      </nav>

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

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-[1000px] flex-col gap-6 px-6 py-6 md:flex-row md:items-start">
          {/* The assignment */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-4 border-b pb-4" style={{ borderColor: GC.class }}>
              <AssignmentIcon muted={submitted} />
              <div className="min-w-0">
                <h2 className="m-0 text-[28px] font-normal leading-tight" style={{ color: submitted ? "#202124" : GC.class }}>
                  {c.assignment}
                </h2>
                <p className="mt-1 mb-0" style={{ color: GC.muted }}>{c.heading} · Ms. Rivera</p>
                <p className="mt-2 mb-0 flex flex-wrap justify-between gap-2 text-[14px] font-medium text-[#202124]">
                  <span>{c.points}</span>
                  <span>
                    {c.dueLabel} {DUE[lang]}
                  </span>
                </p>
              </div>
            </div>
            <p className="mt-4 mb-0 text-[15px] leading-relaxed text-[#202124]">{c.syllabus}</p>
            <p className="mt-3 mb-0 text-[15px] leading-relaxed">{c.prompt}</p>
            {submitted && (
              <div className="mt-6 flex flex-col gap-5">
                <TaskDoneCard kicker={c.sentKicker} />
                <TaskDoneActions kicker={c.sentKicker} tryAgainLabel={c.tryAgain} backToDeskLabel={c.backToDesk} onTryAgain={restart} />
              </div>
            )}
          </div>

          {/* Your work */}
          <aside className="flex w-full shrink-0 flex-col gap-4 md:w-[340px]">
            <section
              aria-label={c.yourWork}
              className="rounded-lg border bg-white p-4 shadow-[0_1px_2px_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)]"
              style={{ borderColor: GC.line }}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="m-0 text-[20px] font-normal text-[#202124]">{c.yourWork}</h3>
                <span className="text-[13px] font-medium" style={{ color: submitted ? GC.muted : "#1e8e3e" }}>
                  {submitted ? c.turnedIn : c.assigned}
                </span>
              </div>
              {submitted ? (
                <p className="m-0 whitespace-pre-wrap rounded-lg border px-3 py-2 text-[14px]" style={{ borderColor: GC.line }}>
                  {body || c.turnedIn}
                </p>
              ) : (
                <>
                  <label className="block text-[14px] font-medium text-[#202124]">
                    {c.deadlineLabel}
                    <select
                      aria-label={c.deadlineLabel}
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="mt-1.5 block min-h-11 w-full rounded-md border bg-white px-2 font-normal"
                      style={{ borderColor: GC.line }}
                    >
                      <option value="">{c.chooseDeadline}</option>
                      {DEADLINE_OPTIONS.map((o) => (
                        <option key={o.key} value={o.key}>
                          {o.label[lang]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="mt-4 block text-[14px] font-medium text-[#202124]">
                    {c.answerLabel}
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder={c.writeHere}
                      className="mt-1.5 block min-h-[130px] w-full resize-y rounded-md border px-3 py-2 text-[15px] font-normal outline-none focus:border-[#1967d2]"
                      style={{ borderColor: GC.line }}
                    />
                  </label>
                  <NeedAStart lang={lang} starters={STARTERS[lang]} onPick={(s) => setBody((b) => (b ? `${b} ` : "") + s)} />
                  <button
                    type="button"
                    onClick={trySubmit}
                    className="mt-4 inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center rounded-md px-6 text-[15px] font-medium text-white"
                    style={{ background: GC.class }}
                  >
                    {c.submit}
                  </button>
                </>
              )}
            </section>
            <section
              aria-hidden
              className="rounded-lg border p-4 shadow-[0_1px_2px_rgba(60,64,67,0.3)]"
              style={{ borderColor: GC.line }}
            >
              <h3 className="m-0 text-[15px] font-medium text-[#202124]">{c.privateComments}</h3>
              <p className="mt-2 mb-0" style={{ color: GC.muted }}>Ms. Rivera</p>
            </section>
          </aside>
        </div>
      </div>
      <HelpDrawer open={help} onClose={() => setHelp(false)} kicker={c.lessonKicker} lesson={LESSONS[lang][0]} tipLabel={c.tipLabel} gotItLabel={c.gotIt} />
      <NudgeToast text={nudge} onDismiss={dismiss} />
    </div>
  );
}

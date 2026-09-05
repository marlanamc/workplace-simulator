"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import { useWindowManager } from "@/lib/window-manager";
import type { TaskKey } from "@/lib/desktop-content";
import { TASK_ICONS } from "@/lib/icons";
import { useNudge } from "@/lib/use-nudge";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import NeedAStart from "@/components/task/NeedAStart";
import RightNowBar from "@/components/task/RightNowBar";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import {
  JOB_POSTING_COPY,
  REQUIREMENTS,
  STARTERS as POSTING_STARTERS,
  LESSONS as POSTING_LESSONS,
  RIGHT_NOW_LABEL as POSTING_RN_LABEL,
  RIGHT_NOW_STEPS as POSTING_STEPS,
  pickingLooksReady,
  fitLooksReal,
  describeSubmission as describePosting,
} from "@/lib/tasks/job-posting/content";
import {
  JOB_APPLICATION_COPY,
  WORK_HISTORY,
  AVAILABILITY_OPTIONS,
  STARTERS as APP_STARTERS,
  LESSONS as APP_LESSONS,
  RIGHT_NOW_LABEL as APP_RN_LABEL,
  RIGHT_NOW_STEPS as APP_STEPS,
  whyLooksReal,
  describeSubmission as describeApplication,
} from "@/lib/tasks/job-application/content";

const JOB_TASK_ORDER: TaskKey[] = ["job-posting", "job-application"];

function activeJobTaskFor(completedTaskKeys: TaskKey[]): TaskKey {
  return JOB_TASK_ORDER.find((k) => !completedTaskKeys.includes(k)) ?? JOB_TASK_ORDER[JOB_TASK_ORDER.length - 1];
}

export default function JobsTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const { browserTabToken } = useWindowManager();

  const [active, setActive] = useState<TaskKey>(() => activeJobTaskFor(completedTaskKeys));
  const [lastToken, setLastToken] = useState(browserTabToken);
  if (browserTabToken !== lastToken) {
    setLastToken(browserTabToken);
    setActive(activeJobTaskFor(completedTaskKeys));
  }

  const done = completedTaskKeys.includes(active);
  const { nudge, say, dismiss } = useNudge();
  const [help, setHelp] = useState(false);

  // ---- job-posting state ----
  const [picked, setPicked] = useState<string[]>([]);
  const [fit, setFit] = useState("");

  // ---- job-application state ----
  const [availability, setAvailability] = useState<string | null>(null);
  const [why, setWhy] = useState("");

  const pc = JOB_POSTING_COPY[lang];
  const ac = JOB_APPLICATION_COPY[lang];

  const togglePick = (key: string) => {
    setPicked((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
    if (key === "degree" && !picked.includes("degree")) say(pc.degreeNote);
  };

  const tryApply = () => {
    if (!pickingLooksReady(picked)) return say(pc.needPicks);
    if (!fitLooksReal(fit)) return say(pc.needFit);
    markComplete("job-posting", "match_posting", describePosting(picked, fit, lang));
  };

  const trySubmit = () => {
    if (!availability) return say(ac.needAvailability);
    if (!whyLooksReal(why)) return say(ac.needWhy);
    markComplete("job-application", "submit_application", describeApplication({ availability, why }, lang));
  };

  const restart = () => {
    if (active === "job-posting") {
      setPicked([]);
      setFit("");
    } else {
      setAvailability(null);
      setWhy("");
    }
  };

  const isPosting = active === "job-posting";
  const steps = isPosting ? POSTING_STEPS : APP_STEPS;
  const stepIndex = isPosting
    ? pickingLooksReady(picked)
      ? 1
      : 0
    : availability
      ? 1
      : 0;

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-[#f6f8fc] text-[14px] text-[#202124]">
      <div className="flex items-center gap-3 border-b border-[#dadce0] bg-white px-4 py-2.5">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[13px] font-bold text-white"
          style={{ background: "#1a73e8" }}
          aria-hidden
        >
          H
        </span>
        <span className="text-[15px] font-medium text-[#3c4043]">
          {isPosting ? pc.siteName : ac.siteName}
        </span>
      </div>

      {!done && (
        <RightNowBar
          icon={TASK_ICONS[active]}
          stepIndex={stepIndex}
          steps={steps}
          lang={lang}
          rightNowLabel={isPosting ? POSTING_RN_LABEL : APP_RN_LABEL}
          onHelp={() => setHelp(true)}
        />
      )}

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4">
          {done ? (
            <>
              <TaskDoneCard kicker={isPosting ? pc.sentKicker : ac.sentKicker} />
              <p className="text-[14px] leading-relaxed text-[#3c4043]">
                {isPosting ? pc.doneBody : ac.doneBody}
              </p>
              <TaskDoneActions
                kicker={isPosting ? pc.sentKicker : ac.sentKicker}
                tryAgainLabel={isPosting ? pc.tryAgain : ac.tryAgain}
                backToDeskLabel={isPosting ? pc.backToDesk : ac.backToDesk}
                onTryAgain={restart}
              />
            </>
          ) : isPosting ? (
            <>
              <div className="rounded-xl border border-[#dadce0] bg-white p-5">
                <div className="text-[11px] font-medium uppercase tracking-wide text-[#5f6368]">{pc.heading}</div>
                <h1 className="mt-1 text-[22px] font-semibold text-[#202124]">{pc.jobTitle}</h1>
                <div className="mt-1 text-[13px] text-[#5f6368]">{pc.company} · {pc.location}</div>
                <div className="mt-0.5 text-[13px] text-[#188038]">{pc.pay}</div>
                <div className="mt-2 text-[12px] text-[#5f6368]">{pc.postedBy}</div>
                <div className="mt-4 text-[13px] font-medium text-[#3c4043]">{pc.aboutLabel}</div>
                <p className="mt-1 text-[14px] leading-relaxed text-[#3c4043]">{pc.about}</p>
              </div>

              <div className="rounded-xl border border-[#dadce0] bg-white p-5">
                <div className="text-[14px] font-medium text-[#202124]">{pc.reqLabel}</div>
                <div className="mt-1 text-[12px] text-[#5f6368]">{pc.reqHint}</div>
                <div className="mt-3 flex flex-col gap-2">
                  {REQUIREMENTS.map((r) => {
                    const on = picked.includes(r.key);
                    return (
                      <button
                        key={r.key}
                        type="button"
                        onClick={() => togglePick(r.key)}
                        className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 text-left cursor-pointer ${
                          on ? "border-[#1a73e8] bg-[#e8f0fe]" : "border-[#dadce0] bg-white hover:bg-[#f8f9fa]"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                            on ? "border-[#1a73e8] bg-[#1a73e8] text-white" : "border-[#9aa0a6] bg-white"
                          }`}
                          aria-hidden
                        >
                          {on ? "✓" : ""}
                        </span>
                        <span className="text-[14px] leading-snug text-[#202124]">{r.text[lang]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-[#dadce0] bg-white p-5">
                <label className="text-[14px] font-medium text-[#202124]">{pc.fitLabel}</label>
                <textarea
                  value={fit}
                  onChange={(e) => setFit(e.target.value)}
                  placeholder={pc.fitHint}
                  className="mt-2 min-h-[72px] w-full resize-y rounded-lg border border-[#dadce0] bg-white px-3 py-2 text-[15px] outline-none focus:border-[#1a73e8]"
                />
                <div className="mt-2">
                  <NeedAStart lang={lang} starters={POSTING_STARTERS[lang]} onPick={(s) => setFit((b) => (b ? `${b} ` : "") + s)} />
                </div>
              </div>

              <button
                type="button"
                onClick={tryApply}
                className="inline-flex min-h-[46px] items-center justify-center self-start rounded-full bg-[#1a73e8] px-6 text-[15px] font-medium text-white cursor-pointer hover:brightness-95"
              >
                {pc.apply}
              </button>
            </>
          ) : (
            <>
              <h1 className="text-[20px] font-semibold text-[#202124]">{ac.heading}</h1>
              <p className="text-[13px] leading-relaxed text-[#5f6368]">{ac.intro}</p>

              <div className="rounded-xl border border-[#dadce0] bg-white p-5">
                <div className="text-[12px] font-medium uppercase tracking-wide text-[#5f6368]">{ac.positionLabel}</div>
                <div className="mt-1 text-[15px] text-[#202124]">{ac.position}</div>
              </div>

              <div className="rounded-xl border border-[#dadce0] bg-white p-5">
                <div className="text-[12px] font-medium uppercase tracking-wide text-[#5f6368]">{ac.historyLabel}</div>
                <div className="mt-0.5 text-[12px] text-[#5f6368]">{ac.historyHint}</div>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {WORK_HISTORY.map((row, i) => (
                    <li key={i} className="border-l-2 border-[#dadce0] pl-3">
                      <div className="text-[14px] font-medium text-[#202124]">{row.title[lang]}</div>
                      <div className="text-[13px] text-[#5f6368]">{row.org} · {row.span[lang]}</div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-[#dadce0] bg-white p-5">
                <div className="text-[14px] font-medium text-[#202124]">{ac.availabilityLabel}</div>
                <div className="mt-3 flex flex-col gap-2">
                  {AVAILABILITY_OPTIONS.map((o) => {
                    const on = availability === o.key;
                    return (
                      <button
                        key={o.key}
                        type="button"
                        onClick={() => setAvailability(o.key)}
                        className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left cursor-pointer ${
                          on ? "border-[#1a73e8] bg-[#e8f0fe]" : "border-[#dadce0] bg-white hover:bg-[#f8f9fa]"
                        }`}
                      >
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                            on ? "border-[#1a73e8]" : "border-[#9aa0a6]"
                          }`}
                          aria-hidden
                        >
                          {on ? <span className="h-2 w-2 rounded-full bg-[#1a73e8]" /> : null}
                        </span>
                        <span className="text-[14px] text-[#202124]">{o.label[lang]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-[#dadce0] bg-white p-5">
                <label className="text-[14px] font-medium text-[#202124]">{ac.whyLabel}</label>
                <textarea
                  value={why}
                  onChange={(e) => setWhy(e.target.value)}
                  placeholder={ac.whyHint}
                  className="mt-2 min-h-[96px] w-full resize-y rounded-lg border border-[#dadce0] bg-white px-3 py-2 text-[15px] leading-relaxed outline-none focus:border-[#1a73e8]"
                />
                <div className="mt-2">
                  <NeedAStart lang={lang} starters={APP_STARTERS[lang]} onPick={(s) => setWhy((b) => (b ? `${b} ` : "") + s)} />
                </div>
              </div>

              <button
                type="button"
                onClick={trySubmit}
                className="inline-flex min-h-[46px] items-center justify-center self-start rounded-full bg-[#1a73e8] px-6 text-[15px] font-medium text-white cursor-pointer hover:brightness-95"
              >
                {ac.submit}
              </button>
            </>
          )}
        </div>
      </div>

      <HelpDrawer
        open={help}
        onClose={() => setHelp(false)}
        kicker={isPosting ? pc.lessonKicker : ac.lessonKicker}
        lesson={(isPosting ? POSTING_LESSONS : APP_LESSONS)[lang][0]}
        tipLabel={isPosting ? pc.tipLabel : ac.tipLabel}
        gotItLabel={isPosting ? pc.gotIt : ac.gotIt}
      />
      <NudgeToast text={nudge} onDismiss={dismiss} />
    </div>
  );
}

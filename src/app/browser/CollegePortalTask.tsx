"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import { useWindowManager } from "@/lib/window-manager";
import {
  ENROLLMENT_COPY,
  CHECKLIST,
  MISSING_DOC,
  DEADLINE,
  STARTERS as ENROLL_STARTERS,
  LESSONS as ENROLL_LESSONS,
  statementShowsInterest,
  RIGHT_NOW_STEPS as ENROLL_STEPS,
  RIGHT_NOW_LABEL as ENROLL_LABEL,
} from "@/lib/tasks/enrollment/content";
import {
  FINANCIAL_AID_COPY,
  AMOUNT_CHECK,
  DATE_CHECK,
  PDF_DOC_ID,
  LESSONS as AID_LESSONS,
  RIGHT_NOW_STEPS as AID_STEPS,
  RIGHT_NOW_LABEL as AID_LABEL,
  type CheckOption,
} from "@/lib/tasks/financial-aid/content";
import { useNudge } from "@/lib/use-nudge";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import NeedAStart from "@/components/task/NeedAStart";
import { TASK_ICONS } from "@/lib/icons";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import RightNowBar from "@/components/task/RightNowBar";

type EnrollView = "form" | "done";
type AidView = "home" | "check1" | "check2" | "done";

export default function CollegePortalTask() {
  const { currentTrack, completedTaskKeys } = useProgress();
  const isAid = currentTrack.key === "financial-aid" || (currentTrack.key !== "enrollment" && completedTaskKeys.includes("financial-aid"));
  if (isAid) return <FinancialAidPortal />;
  return <EnrollmentPortal />;
}

function PortalChrome({ school, children }: { school: string; children: React.ReactNode }) {
  return (
    <div className="relative flex h-full min-h-0 flex-col bg-[#f4f7f6] text-[14px] text-[#202124]">
      <div className="flex items-center gap-3 bg-[#004d40] px-4 py-2.5 text-white">
        <span className="text-[15px] font-semibold tracking-wide">{school}</span>
        <span className="text-[12px] text-white/70">Student portal</span>
      </div>
      {children}
    </div>
  );
}

function EnrollmentPortal() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<EnrollView>(completedTaskKeys.includes("enrollment") ? "done" : "form");
  const [docReady, setDocReady] = useState(false);
  const [statement, setStatement] = useState("");
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const c = ENROLLMENT_COPY[lang];

  const trySubmit = () => {
    if (!docReady) return say(c.needDoc);
    if (!statement.trim()) return say(c.empty);
    if (!statementShowsInterest(statement)) return say(c.weak);
    setView("done");
    markComplete("enrollment", "apply_before_the_deadline");
  };

  const stepIndex = !docReady ? 1 : 2;

  return (
    <PortalChrome school={c.school}>
      {view !== "done" && (
        <RightNowBar
          icon={TASK_ICONS.enrollment}
          stepIndex={stepIndex}
          stepCount={ENROLL_STEPS.length}
          instruction={ENROLL_STEPS[stepIndex]}
          lang={lang}
          rightNowLabel={ENROLL_LABEL}
          onHelp={() => setHelp(true)}
        />
      )}
      {view === "form" && (
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="mx-auto flex max-w-[640px] flex-col gap-5">
            <div>
              <h2 className="text-[20px] font-medium">{c.heading}</h2>
              <p className="mt-1 text-[15px]">
                <span className="text-[#5f6368]">{c.deadlineLabel}: </span>
                <span className="font-semibold text-[#004d40]">{DEADLINE[lang]}</span>
              </p>
            </div>
            <div className="rounded-xl border border-[#dadce0] bg-white p-4">
              <div className="text-[13px] font-medium text-[#5f6368]">{c.docsHeading}</div>
              <p className="mt-1 text-[13px] text-[#5f6368]">{c.missingNote}</p>
              <ul className="mt-3 flex flex-col gap-2">
                {CHECKLIST.map((item) => {
                  const ready = item.done || (item.key === MISSING_DOC && docReady);
                  return (
                    <li key={item.key} className="flex items-center justify-between gap-3 rounded-lg bg-[#f8f9fa] px-3 py-2.5">
                      <span className={ready ? "text-[#1e8e3e]" : "text-[#202124]"}>{item.label[lang]}</span>
                      {ready ? (
                        <span className="text-[12px] font-medium text-[#1e8e3e]">{c.marked}</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDocReady(true)}
                          className="min-h-[36px] rounded-full bg-[#004d40] px-3 text-[13px] font-medium text-white cursor-pointer"
                        >
                          {c.markReady}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="rounded-xl border border-[#dadce0] bg-white p-4">
              <div className="text-[13px] font-medium text-[#5f6368]">{c.statementHeading}</div>
              <textarea
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                placeholder={c.statementHint}
                className="mt-2 min-h-[120px] w-full resize-y rounded-lg border border-[#dadce0] px-3 py-2 text-[15px] outline-none focus:border-[#004d40]"
              />
              <div className="mt-2">
                <NeedAStart lang={lang} starters={ENROLL_STARTERS[lang]} onPick={(s) => setStatement((b) => (b ? `${b} ` : "") + s)} />
              </div>
            </div>
            <button
              type="button"
              onClick={trySubmit}
              className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-[#004d40] px-6 text-[15px] font-medium text-white cursor-pointer"
            >
              {c.submit}
            </button>
          </div>
        </div>
      )}
      {view === "done" && (
        <DoneBlock kicker={c.sentKicker} tryAgain={c.tryAgain} back={c.backToDesk} onRestart={() => { setView("form"); setDocReady(false); setStatement(""); }} />
      )}
      <HelpDrawer open={help} onClose={() => setHelp(false)} kicker={c.lessonKicker} lesson={ENROLL_LESSONS[lang][0]} tipLabel={c.tipLabel} gotItLabel={c.gotIt} />
      <NudgeToast text={nudge} onDismiss={dismiss} />
    </PortalChrome>
  );
}

function FinancialAidPortal() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const { openApp } = useWindowManager();
  const [view, setView] = useState<AidView>(completedTaskKeys.includes("financial-aid") ? "done" : "home");
  const [opened, setOpened] = useState(false);
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const c = FINANCIAL_AID_COPY[lang];
  const amount = AMOUNT_CHECK[lang];
  const date = DATE_CHECK[lang];

  const openLetter = () => {
    openApp("pdf", { docId: PDF_DOC_ID });
    setOpened(true);
    setView("check1");
  };

  const answer = (opt: CheckOption, onCorrect: () => void) => {
    if (opt.isTarget) return onCorrect();
    if (opt.wrongHint) say(opt.wrongHint[lang]);
  };

  const stepIndex = view === "home" ? 0 : view === "check1" ? 1 : 2;

  return (
    <PortalChrome school={c.school}>
      {view !== "done" && (
        <RightNowBar
          icon={TASK_ICONS["financial-aid"]}
          stepIndex={stepIndex}
          stepCount={AID_STEPS.length}
          instruction={AID_STEPS[stepIndex]}
          lang={lang}
          rightNowLabel={AID_LABEL}
          onHelp={() => setHelp(true)}
        />
      )}
      {view === "home" && (
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="mx-auto max-w-[640px] rounded-xl border border-[#dadce0] bg-white p-5">
            <h2 className="text-[20px] font-medium">{c.heading}</h2>
            <p className="mt-2 text-[15px] text-[#5f6368]">{c.letterNote}</p>
            <button
              type="button"
              onClick={openLetter}
              className="mt-4 inline-flex min-h-[46px] items-center rounded-full bg-[#004d40] px-5 text-[15px] font-medium text-white cursor-pointer"
            >
              {c.openLetter}
            </button>
            <p className="mt-3 text-[13px] text-[#5f6368]">{c.letterName}</p>
          </div>
        </div>
      )}
      {(view === "check1" || view === "check2") && (
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="mx-auto max-w-[640px] rounded-xl border border-[#dadce0] bg-white p-5">
            <h2 className="text-[18px] font-medium">{view === "check1" ? amount.question : date.question}</h2>
            {!opened ? null : (
              <button type="button" onClick={() => openApp("pdf", { docId: PDF_DOC_ID })} className="mt-2 text-[13px] text-[#004d40] underline cursor-pointer">
                {c.openLetter}
              </button>
            )}
            <div className="mt-4 flex flex-col gap-2">
              {(view === "check1" ? amount.options : date.options).map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() =>
                    answer(opt, () => {
                      if (view === "check1") setView("check2");
                      else {
                        setView("done");
                        markComplete("financial-aid", "read_award_letter");
                      }
                    })
                  }
                  className="min-h-[48px] rounded-xl border border-[#dadce0] px-4 text-left text-[15px] hover:bg-[#e8f5f2] cursor-pointer"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {view === "done" && (
        <DoneBlock kicker={c.sentKicker} tryAgain={c.tryAgain} back={c.backToDesk} onRestart={() => { setView("home"); setOpened(false); }} />
      )}
      <HelpDrawer open={help} onClose={() => setHelp(false)} kicker={c.lessonKicker} lesson={AID_LESSONS[lang][0]} tipLabel={c.tipLabel} gotItLabel={c.gotIt} />
      <NudgeToast text={nudge} onDismiss={dismiss} />
    </PortalChrome>
  );
}

function DoneBlock({
  kicker,
  tryAgain,
  back,
  onRestart,
}: {
  kicker: string;
  tryAgain: string;
  back: string;
  onRestart: () => void;
}) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-6">
      <div className="mx-auto flex max-w-[640px] flex-col gap-5">
        <TaskDoneCard kicker={kicker} />
        <TaskDoneActions kicker={kicker} tryAgainLabel={tryAgain} backToDeskLabel={back} onTryAgain={onRestart} />
      </div>
    </div>
  );
}

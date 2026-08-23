"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  SCENARIO_CHECK,
  HANDBOOK_TASK_COPY,
  LESSONS,
  EVENT_INTRO,
  CONFIDENCE_OPTIONS,
  type CheckOption,
} from "@/lib/tasks/handbook/content";
import { useNudge } from "@/lib/use-nudge";
import ConfidenceCheck from "@/components/task/ConfidenceCheck";
import EventIntroCard from "@/components/task/EventIntroCard";
import { TASK_ICONS } from "@/lib/icons";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import AppHeaderTools from "@/components/task/AppHeaderTools";
import HandbookPage from "./HandbookPage";

type View = "intro" | "task" | "done";

const MENU = ["File", "Edit", "View", "Insert", "Format", "Tools"];

export default function HandbookTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("handbook") ? "done" : "intro");
  const [confidence, setConfidence] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const { nudge, say } = useNudge();

  const c = HANDBOOK_TASK_COPY[lang];
  const check = SCENARIO_CHECK[lang];

  const answer = (opt: CheckOption) => {
    if (opt.isTarget) {
      setView("done");
      markComplete("handbook", "look_it_up");
    } else if (opt.wrongHint) {
      say(opt.wrongHint[lang]);
    }
  };

  const restart = () => {
    setView("task");
    setConfidence(null);
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-white text-[14px] text-[#202124]" style={{ fontFamily: "Roboto, Arial, sans-serif" }}>
      {view === "intro" && (
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <EventIntroCard {...EVENT_INTRO[lang]} icon={TASK_ICONS.handbook} onContinue={() => setView("task")} />
        </div>
      )}

      {view === "task" && (
        <>
          <div className="flex items-center gap-2 px-2 pt-1">
            <span className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#1a73e8] text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" fill="#aecbfa" />
                <path d="M8 13h8v1.4H8zm0 3h8v1.4H8zm0-6h5v1.4H8z" />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[18px] leading-tight text-[#202124]">Employee Handbook</div>
              <div className="-ml-1 flex flex-wrap items-center text-[13px] text-[#444746]">
                {MENU.map((item) => (
                  <span key={item} className="rounded px-2 py-0.5">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <AppHeaderTools
              helpLabel={c.helpBtn}
              onHelp={() => setHelp(true)}
            />
          </div>

          <div className="mx-2 mb-1 flex h-10 items-center gap-1 rounded-full bg-[#f0f4f9] px-3 text-[13px] text-[#444746]">
            <span className="rounded px-2 py-0.5">Arial</span>
            <span className="h-5 w-px bg-[#dadce0]" />
            <span className="px-1">11</span>
            <span className="h-5 w-px bg-[#dadce0]" />
            <span className="px-1.5 font-bold">B</span>
            <span className="px-1.5 italic">I</span>
            <span className="px-1.5 underline">U</span>
          </div>

          <div className="flex min-h-0 flex-1">
            <div className="min-w-0 flex-1">
              <HandbookPage />
            </div>
            <aside className="flex w-[260px] shrink-0 flex-col gap-3 overflow-y-auto border-l border-[#e8eaed] bg-[#f8f9fa] p-3">
              <div className="rounded-xl bg-white p-3 shadow-[0_1px_2px_rgba(60,64,67,.15)]">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1a73e8] text-[11px] font-medium text-white">
                    MD
                  </span>
                  <div>
                    <div className="text-[13px] font-medium">Maria Delgado</div>
                    <div className="text-[11px] text-[#5f6368]">
                      {lang === "en" ? "Comment" : "Comentario"}
                    </div>
                  </div>
                </div>
                <p className="text-[13px] leading-relaxed text-[#3c4043]">{check.scenario}</p>
                <p className="mt-2 text-[13px] font-medium">{check.question}</p>
                <div className="mt-2 flex flex-col gap-1.5">
                  {check.options.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => answer(opt)}
                      className="min-h-[40px] rounded-lg border border-[#dadce0] px-3 text-left text-[13px] hover:bg-[#e8f0fe] hover:border-[#1a73e8] cursor-pointer"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </>
      )}

      {view === "done" && (
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="mx-auto flex max-w-[640px] flex-col gap-5">
            <TaskDoneCard
              kicker={c.sentKicker}
              title={c.doneTitle}
              body={c.doneBody}
              badgeNumber="06"
              badgeName={c.badgeName}
              badgeWhere={c.badgeWhere}
            />
            <ConfidenceCheck
              question={c.confidenceQ}
              options={CONFIDENCE_OPTIONS[lang]}
              selected={confidence}
              onSelect={setConfidence}
            />
            <TaskDoneActions
              tryAgainLabel={c.tryAgain}
              backToDeskLabel={c.backToDesk}
              onTryAgain={restart}
            />
          </div>
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

      <NudgeToast text={nudge} bottom={32} />
    </div>
  );
}

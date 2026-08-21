"use client";

import { useState } from "react";
import { useWindowManager } from "@/lib/window-manager";
import { useProgress } from "@/lib/progress-context";
import {
  SCENARIO_CHECK,
  HANDBOOK_TASK_COPY,
  LESSONS,
  EVENT_INTRO,
  CONFIDENCE_OPTIONS,
  type CheckOption,
} from "@/lib/tasks/handbook/content";
import type { Lang } from "@/lib/task-types";
import { useNudge } from "@/lib/use-nudge";
import ConfidenceCheck from "@/components/task/ConfidenceCheck";
import EventIntroCard from "@/components/task/EventIntroCard";
import { TASK_ICONS } from "@/lib/icons";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import HandbookPage from "./HandbookPage";

type View = "intro" | "task" | "done";

export default function HandbookTask() {
  const [lang, setLang] = useState<Lang>("en");
  const { markComplete, completedTaskKeys } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("handbook") ? "done" : "intro");
  const [confidence, setConfidence] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const { nudge, say } = useNudge();
  const { minimizeActive } = useWindowManager();

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
    <div className="flex h-full min-h-0 flex-col bg-white text-[15px] text-[var(--text-primary)]">
      {view === "intro" && (
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <EventIntroCard {...EVENT_INTRO[lang]} icon={TASK_ICONS.handbook} onContinue={() => setView("task")} />
        </div>
      )}

      {view === "task" && (
        <>
          <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--warning-tint)] px-4 py-3">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wide text-[var(--warning)]">
                {c.scenarioKicker}
              </div>
              <p className="mt-0.5 max-w-[70ch] text-[14px] leading-relaxed text-[var(--text-primary)]">
                {check.scenario}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => setHelp(true)}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-white px-3.5 text-[13px] font-medium text-[var(--warning)] hover:brightness-95 cursor-pointer"
              >
                ? {c.helpBtn}
              </button>
              <button
                onClick={() => setLang(lang === "en" ? "es" : "en")}
                className="inline-flex min-h-[40px] items-center rounded-full border border-[var(--border)] bg-white px-3.5 text-[13px] font-medium text-[var(--text-primary)] hover:bg-[var(--surface-muted)] cursor-pointer"
              >
                {c.langBtn}
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1">
            <HandbookPage />
          </div>

          <div className="border-t border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5">
            <div className="mb-2 text-[13px] font-medium text-[var(--text-tertiary)]">{c.answerLabel}:</div>
            <div className="mb-2 text-[15px] font-medium">{check.question}</div>
            <div className="flex flex-wrap gap-2">
              {check.options.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => answer(opt)}
                  className="min-h-[44px] rounded-full border border-[var(--border)] bg-white px-4 text-[14px] font-medium text-[var(--text-primary)] hover:bg-[var(--accent-tint)] cursor-pointer"
                >
                  {opt.label}
                </button>
              ))}
            </div>
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

            <div className="flex flex-wrap gap-2">
              <button
                onClick={restart}
                className="inline-flex min-h-[46px] items-center rounded-full bg-[var(--accent)] px-5 text-[15px] font-medium text-white hover:bg-[var(--accent-hover)] cursor-pointer"
              >
                {c.tryAgain}
              </button>
              <button
                onClick={minimizeActive}
                className="inline-flex min-h-[46px] items-center rounded-full border border-[var(--border)] px-5 text-[15px] font-medium text-[var(--text-primary)] hover:bg-[var(--surface-muted)] cursor-pointer"
              >
                {c.backToDesk}
              </button>
            </div>
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
        askPersonLabel={c.askPerson}
      />

      <NudgeToast text={nudge} bottom={32} />
    </div>
  );
}

"use client";

import { useState } from "react";
import { useTaskDraft } from "@/lib/use-task-draft";
import { useProgress } from "@/lib/progress-context";
import {
  REVIEW_COPY,
  STARTERS,
  LESSONS,
  RIGHT_NOW_STEPS,
  RIGHT_NOW_LABEL,
  SHIFT_FACTS,
  shiftSummaryIsComplete,
  describeSubmission,
} from "@/lib/tasks/shift-review/content";
import { useNudge } from "@/lib/use-nudge";
import { TASK_ICONS } from "@/lib/icons";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import RightNowBar from "@/components/task/RightNowBar";
import NeedAStart from "@/components/task/NeedAStart";
import ShowMeHighlight from "@/components/task/ShowMeHighlight";
import { useShowMe, SHOW_ME_POINTER } from "@/lib/use-show-me";
import { firstPersonSkill } from "@/lib/skills";

type View = "form" | "done";

export default function ShiftReviewTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("shift-review") ? "done" : "form");
  // The note survives a reload (Wave 5 F-7).
  const [summary, setSummary] = useTaskDraft("shift-review", "summary", "");
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const showMe = useShowMe();

  const c = REVIEW_COPY[lang];
  const facts = SHIFT_FACTS[lang];

  // Written and not just refused: the card says Submit and Show me points at
  // it. A refused note sends the card back to the writing line until it
  // changes, so "Click Submit" never sits over a correction.
  const [refusedNote, setRefusedNote] = useState<string | null>(null);
  const ready = Boolean(summary.trim()) && summary !== refusedNote;
  const step = ready ? 1 : 0;
  const showMeId = ready ? "shift-note-submit" : "shift-note-box";
  // Raised a moment later, once the card shows the writing line again: a
  // correction belongs to the line it was raised on.
  const refuse = (message: string) => {
    setRefusedNote(summary);
    setTimeout(() => say(message), 60);
  };

  const trySubmit = () => {
    if (summary.trim().split(/\s+/).filter(Boolean).length < 3) {
      return refuse(c.shortNudge);
    }
    if (!shiftSummaryIsComplete(summary, lang)) {
      return refuse(c.factsNudge);
    }
    setView("done");
    markComplete("shift-review", "write_shift_summary", describeSubmission(summary, lang));
  };

  const restart = () => {
    setView("form");
    setSummary("");
  };

  return (
    <div className="relative">
      <div className="mb-1 flex items-center justify-between gap-3">
        <h2 className="text-[19px] font-medium">{c.heading}</h2>
      </div>

      {view !== "done" && (
        <RightNowBar
          taskKey="shift-review"
          icon={TASK_ICONS["shift-review"]}
          stepIndex={step}
          stepCount={RIGHT_NOW_STEPS.length}
          instruction={RIGHT_NOW_STEPS[step]}
          lang={lang}
          rightNowLabel={RIGHT_NOW_LABEL}
          onShowMe={() => showMe.toggleFor(showMeId)}
          showMeActive={showMe.targetId === showMeId}
          onHelp={() => setHelp(true)}
        />
      )}

      {view === "form" && (
        <div className="mt-4 max-w-[560px]">
          <div className="rounded-xl border border-border bg-white p-5">
            <div className="mb-4">
              <div className="text-[13px] font-medium text-text-secondary">{c.dateLabel}</div>
              <div className="mt-0.5 text-[15px] text-text-primary">{c.date}</div>
            </div>
            {/* The learner did not live this shift. Without these two lines the
                card's "say what happened, and at what time" has nothing to
                point to. The time itself is never on the card (option C). */}
            <div className="mb-4 rounded-xl bg-surface-muted px-4 py-3">
              <div className="text-[13px] font-medium text-text-secondary">{facts.heading}</div>
              <ul className="mt-1.5 flex flex-col gap-1">
                {facts.lines.map((line) => (
                  <li key={line} className="text-[15px] leading-snug text-text-primary">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <label className="mb-2 block text-[13px] font-medium text-text-secondary">{c.summaryLabel}</label>
            <textarea
              data-showme="shift-note-box"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder={c.writeHere}
              rows={5}
              className="w-full resize-y rounded-xl border border-border bg-white px-3.5 py-3 text-[15px] leading-relaxed text-text-primary outline-none placeholder:text-text-tertiary focus:border-accent"
            />
            <div className="mt-3">
              <NeedAStart
                lang={lang}
                starters={STARTERS[lang]}
                onPick={(s) => setSummary((w) => (w ? `${w} ${s}` : s))}
              />
            </div>
            <button
              type="button"
              data-showme="shift-note-submit"
              onClick={trySubmit}
              className="mt-4 inline-flex min-h-[46px] items-center rounded-full bg-accent px-6 text-[15px] font-medium text-white hover:bg-accent-hover cursor-pointer"
            >
              {c.submit}
            </button>
          </div>
        </div>
      )}

      {view === "done" && (
        <div className="flex flex-col gap-5">
          <TaskDoneCard
            kicker={c.sentKicker}
            title={firstPersonSkill("shift-review", lang)}
            body={c.doneBody}
            badgeNumber="09"
            badgeName={c.badgeName}
            badgeWhere={c.badgeWhere}
          />
          <TaskDoneActions taskKey="shift-review"
            kicker={c.sentKicker}
            tryAgainLabel={c.tryAgain}
            backToDeskLabel={c.backToDesk}
            onTryAgain={restart}
          />
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

      <NudgeToast text={nudge} onDismiss={dismiss} />
      <ShowMeHighlight targetId={showMe.targetId} label={SHOW_ME_POINTER[lang]} onDismiss={showMe.clear} />
    </div>
  );
}

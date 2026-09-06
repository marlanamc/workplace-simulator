"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  REVIEW_COPY,
  STARTERS,
  LESSONS,
  RIGHT_NOW_STEPS,
  RIGHT_NOW_LABEL,
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
  const [summary, setSummary] = useState("");
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const showMe = useShowMe();

  const c = REVIEW_COPY[lang];

  const trySubmit = () => {
    if (summary.trim().length < 28) {
      return say(c.shortNudge);
    }
    if (!shiftSummaryIsComplete(summary)) {
      return say(c.factsNudge);
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
          stepIndex={0}
          stepCount={RIGHT_NOW_STEPS.length}
          instruction={RIGHT_NOW_STEPS[0]}
          lang={lang}
          rightNowLabel={RIGHT_NOW_LABEL}
          onShowMe={() => showMe.toggleFor("shift-note-box")}
          showMeActive={showMe.targetId === "shift-note-box"}
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
            title={firstPersonSkill("shift-review")}
            body={c.doneBody}
            badgeNumber="09"
            badgeName={c.badgeName}
            badgeWhere={c.badgeWhere}
          />
          <TaskDoneActions
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

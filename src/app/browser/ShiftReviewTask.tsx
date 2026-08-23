"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import { useSkillGuidance } from "@/lib/use-skill-guidance";
import { EVENT_INTRO, BEATS, REVIEW_COPY, CONFIDENCE_OPTIONS } from "@/lib/tasks/shift-review/content";
import ConfidenceCheck from "@/components/task/ConfidenceCheck";
import EventIntroCard from "@/components/task/EventIntroCard";
import { TASK_ICONS } from "@/lib/icons";
import NudgeToast from "@/components/task/NudgeToast";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import { firstPersonSkill } from "@/lib/skills";

type View = "intro" | "beats" | "done";

export default function ShiftReviewTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("shift-review") ? "done" : "intro");
  const [beatIndex, setBeatIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<string | null>(null);
  const [noHelp, setNoHelp] = useState(false);
  const { nudge, recordWrong, recordClean, recordMissed, wrongCount } = useSkillGuidance("shift-review");

  const c = REVIEW_COPY[lang];
  const beat = BEATS[beatIndex];

  const pick = (option: { label: string; correct: boolean }) => {
    setPicked(option.label);
    if (!option.correct) {
      recordWrong({ title: lang === "en" ? "Not quite." : "No es así.", body: beat.wrongHint[lang] });
      return;
    }
    if (beatIndex < BEATS.length - 1) {
      // Advance without touching rung state - wrongCount should keep
      // accumulating across all 3 beats so the final "no help" check below
      // reflects the whole review, not just the last beat.
      setBeatIndex((i) => i + 1);
      setPicked(null);
      return;
    }
    const cleanRun = wrongCount === 0;
    setNoHelp(cleanRun);
    if (cleanRun) {
      recordClean();
    } else {
      recordMissed();
    }
    setView("done");
    markComplete("shift-review", "normal_shift");
  };

  const restart = () => {
    setView("beats");
    setBeatIndex(0);
    setPicked(null);
    setConfidence(null);
    setNoHelp(false);
  };

  return (
    <div className="relative">
      <div className="mb-1 flex items-center justify-between gap-3">
        <h2 className="text-[19px] font-medium">{c.heading}</h2>
      </div>
      <p className="mb-4 text-[14px] text-[var(--text-secondary)]">{c.subhead}</p>

      {view === "intro" && (
        <EventIntroCard {...EVENT_INTRO[lang]} icon={TASK_ICONS["shift-review"]} onContinue={() => setView("beats")} />
      )}

      {view === "beats" && (
        <div className="max-w-[520px]">
          <div className="mb-4 flex items-center gap-1.5">
            {BEATS.map((b, i) => (
              <span
                key={b.key}
                className="h-2 flex-1 rounded-full"
                style={{ background: i < beatIndex ? "var(--success)" : i === beatIndex ? "var(--warning)" : "var(--border)" }}
              />
            ))}
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-white p-5">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[20px]">
                {beat.emoji}
              </span>
              <p className="text-[16px] font-medium leading-snug">{beat.prompt[lang]}</p>
            </div>
            <div className="flex flex-col gap-2">
              {beat.options[lang].map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => pick(opt)}
                  className={`rounded-xl border px-4 py-3 text-left text-[14px] font-medium cursor-pointer ${
                    picked === opt.label
                      ? opt.correct
                        ? "border-[#1e8e3e] bg-[#e6f4ea] text-[#1e8e3e]"
                        : "border-[#c5221f] bg-[#fce8e6] text-[#c5221f]"
                      : "border-[var(--border)] hover:bg-[var(--surface-muted)]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
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
            noHelp={noHelp}
            noHelpLabel={lang === "en" ? "You did this with no help" : "Lo hiciste sin ayuda"}
          />
          <ConfidenceCheck
            question={c.confidenceQ}
            options={CONFIDENCE_OPTIONS[lang]}
            selected={confidence}
            onSelect={setConfidence}
          />
          <TaskDoneActions tryAgainLabel={c.tryAgain} backToDeskLabel={c.backToDesk} onTryAgain={restart} />
        </div>
      )}

      <NudgeToast text={nudge} bottom={32} />
    </div>
  );
}

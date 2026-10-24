"use client";

import { useState } from "react";
import type { Lang } from "@/lib/task-types";
import type { LessonCheckQuestion } from "@/lib/lessons/types";
import { LESSON_COPY, CHECK_PROGRESS, fill } from "@/lib/lessons/copy";

/**
 * A few multiple-choice recall questions shown once, right after a lesson's
 * task completes. Ungraded and skippable: it never blocks "Back to lessons"
 * or "Practice again" on the Job Card, which keep working the whole time.
 * A wrong pick explains nothing and does not advance — the learner tries the
 * same question again, so there is no answer to passively read off.
 */
export default function ComprehensionCheck({
  questions,
  lang,
  onDone,
}: {
  questions: LessonCheckQuestion[];
  lang: Lang;
  onDone: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const c = LESSON_COPY;
  const question = questions[index];
  const isLast = index === questions.length - 1;
  const correctChoice = question.choices.findIndex((choice) => choice.correct);
  const answeredCorrectly = picked === correctChoice;

  const pick = (choiceIndex: number) => {
    setPicked(choiceIndex);
  };

  const advance = () => {
    if (isLast) {
      onDone();
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
  };

  return (
    <div className="mx-auto flex h-full max-w-[560px] flex-col gap-5 overflow-y-auto p-6" data-testid="comprehension-check">
      <div>
        <p className="m-0 text-[13px] font-semibold uppercase tracking-wide text-[#0b57d0]">{c.checkKicker[lang]}</p>
        <h2 className="m-0 mt-1 text-[20px] font-medium text-[#202124]">{c.checkTitle[lang]}</h2>
        <p className="m-0 mt-1 text-[13px] text-[#5f6368]">{fill(CHECK_PROGRESS[lang], { current: index + 1, total: questions.length })}</p>
      </div>

      <div className="rounded-xl border border-[#e8eaed] p-5">
        <p className="m-0 mb-4 text-[16px] leading-relaxed text-[#202124]">{question.question[lang]}</p>
        <div className="flex flex-col gap-2">
          {question.choices.map((choice, i) => {
            const isPicked = picked === i;
            const showWrong = isPicked && !choice.correct;
            const showRight = isPicked && choice.correct;
            return (
              <button
                key={i}
                type="button"
                data-testid={`check-choice-${index}-${i}`}
                onClick={() => pick(i)}
                disabled={answeredCorrectly}
                aria-pressed={isPicked}
                className={`block min-h-11 w-full rounded-lg border px-4 py-2.5 text-left text-[14px] leading-snug cursor-pointer disabled:cursor-default ${
                  showRight
                    ? "border-success bg-success-tint text-[#202124]"
                    : showWrong
                      ? "border-[#d93025] bg-[#fce8e6] text-[#202124]"
                      : "border-[#747775] text-[#202124] hover:bg-[#f1f3f4]"
                }`}
              >
                {choice.text[lang]}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <p
            data-testid="check-feedback"
            className={`m-0 mt-3 text-[14px] font-medium ${answeredCorrectly ? "text-success" : "text-[#d93025]"}`}
          >
            {answeredCorrectly ? c.checkCorrect[lang] : c.checkIncorrect[lang]}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          data-testid="check-skip"
          onClick={onDone}
          className="min-h-11 cursor-pointer rounded-full px-3 text-[13px] font-medium text-[#444746] hover:bg-[#f1f3f4]"
        >
          {c.checkSkip[lang]}
        </button>
        {answeredCorrectly && (
          <button
            type="button"
            data-testid="check-advance"
            onClick={advance}
            className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-[#0b57d0] px-5 text-[14px] font-medium text-white hover:bg-[#0842a0]"
          >
            {isLast ? c.checkFinish[lang] : c.checkNext[lang]}
          </button>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { IdCard, X } from "lucide-react";
import { useLesson } from "@/lib/lesson-context";
import { useProgress } from "@/lib/progress-context";
import { LESSON_COPY } from "@/lib/lessons/copy";
import { SHELF_RESERVE } from "@/components/Shelf";
import { CARD_W, EDGE } from "@/components/task/JobCard";

/**
 * On wide screens a lesson keeps a left column: this card on top, the Job
 * Card in its home corner below, and the app window to the right of both.
 * Otherwise the 420px card sits on the left of every task, over whatever the
 * learner needs to read (the tip slips, a form's first fields). Tailwind
 * needs the literal class: 460 = the card's edge + width + a gap.
 */
export const LESSON_RAIL_CLASS = "xl:[--app-left:460px]";

/**
 * Facts a lesson learner needs while working: who they are, who the task
 * names, and anything to copy (a password, a date). Story mode teaches these
 * over many tasks; a lesson has to keep them on screen.
 *
 * Facts only, never a step. The Job Card is the one instruction voice.
 *
 * Wide screens dock it at the top of the lesson's left column; narrow ones
 * fold it into a tab the learner opens when they need it.
 */
export default function LessonInfoCard({ top }: { top: number }) {
  const lesson = useLesson();
  const { lang } = useProgress();
  const [open, setOpen] = useState(false);
  if (!lesson) return null;

  const { scene, reference } = lesson;
  const body = (
    <div data-testid="lesson-info-card" className="flex flex-col gap-3 text-[#2a1810]">
      <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b5340]">
        {LESSON_COPY.infoTitle[lang]}
      </p>
      <p className="m-0 text-[15px] leading-snug">{scene.you[lang]}</p>
      {scene.people.length > 0 && (
        <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
          {scene.people.map((p) => (
            <li key={p.name} className="text-[15px] leading-snug">
              <span className="font-semibold">{p.name}</span>
              <span className="block text-[13px] text-[#6b5340]">{p.role[lang]}</span>
            </li>
          ))}
        </ul>
      )}
      {reference.length > 0 && (
        <dl className="m-0 flex flex-col gap-2 border-t border-[#2a1810]/15 pt-3">
          {reference.map((fact) => {
            const value = typeof fact.value === "string" ? fact.value : fact.value[lang];
            // Something to copy letter for letter (a password, a date) reads in a
            // typewriter face; a sentence stays in the normal one.
            const exact = !/\s/.test(value);
            return (
              <div key={fact.label.en}>
                <dt className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#6b5340]">{fact.label[lang]}</dt>
                <dd
                  className={`m-0 leading-snug ${
                    exact
                      ? `font-mono font-semibold select-all ${value.length > 14 ? "break-all text-[13px]" : "text-[17px]"}`
                      : "break-words text-[14px]"
                  }`}
                >
                  {value}
                </dd>
              </div>
            );
          })}
        </dl>
      )}
    </div>
  );

  const paper = {
    background: "linear-gradient(165deg, #fff8e8 0%, #f6edd4 55%, #efe4c8 100%)",
    boxShadow: "0 1px 0 rgba(255,255,255,0.55) inset, 0 10px 22px rgba(28,16,10,0.22), 0 2px 4px rgba(28,16,10,0.12)",
  };

  return (
    <>
      {/* Wide screens: the top of the left column, above the Job Card. Its
          height gives way to the card, and scrolls if the facts run long. */}
      <aside
        aria-label={LESSON_COPY.infoTitle[lang]}
        className="fixed z-[60] hidden overflow-y-auto rounded-[6px] px-5 pb-4 pt-4 xl:block"
        style={{ ...paper, top, left: EDGE, width: CARD_W, maxHeight: "max(160px, calc(100dvh - 540px))" }}
      >
        {body}
      </aside>

      {/* Narrow screens: a tab above the shelf, on the right because the Job Card is home on the left. */}
      <div className="xl:hidden">
        {open ? (
          <aside
            aria-label={LESSON_COPY.infoTitle[lang]}
            className="fixed right-2 z-[74] max-h-[calc(100vh-120px)] w-[280px] overflow-y-auto rounded-[6px] px-4 pb-4 pt-4"
            style={{ ...paper, bottom: SHELF_RESERVE + 16 }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={LESSON_COPY.infoClose[lang]}
              className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full text-[#6b5340] hover:bg-black/5"
            >
              <X size={18} aria-hidden />
            </button>
            {body}
          </aside>
        ) : (
          <button
            type="button"
            data-testid="lesson-info-open"
            onClick={() => setOpen(true)}
            className="fixed right-2 z-[74] flex min-h-11 items-center gap-2 rounded-full px-4 text-[15px] font-semibold text-[#2a1810]"
            style={{ ...paper, bottom: SHELF_RESERVE + 16 }}
          >
            <IdCard size={18} aria-hidden />
            {LESSON_COPY.infoOpen[lang]}
          </button>
        )}
      </div>
    </>
  );
}

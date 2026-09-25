"use client";

import { useState } from "react";
import { IdCard, X } from "lucide-react";
import { useLesson } from "@/lib/lesson-context";
import { useJobCardOptional } from "@/lib/job-card-context";
import type { LessonFact, LessonScene } from "@/lib/lessons/types";
import type { Lang } from "@/lib/task-types";
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
/** The card's face, shared by the docked card and the preview on the intro screen. */
export function InfoCardBody({
  scene,
  reference,
  lang,
}: {
  scene: LessonScene;
  reference: LessonFact[];
  lang: Lang;
}) {
  return (
    <div data-testid="lesson-info-card" className="text-[#2a1810]">
      {/* A band of its own, so it reads as part of the screen, not wallpaper. */}
      <p className="m-0 flex items-center gap-2 bg-[#5b3a1e] px-5 py-2.5 text-[15px] font-semibold text-white">
        <IdCard size={18} aria-hidden />
        {LESSON_COPY.infoTitle[lang]}
      </p>
      <div className="flex flex-col gap-2.5 px-5 pb-3.5 pt-3">
        <p className="m-0 text-[16px] leading-snug">{scene.you[lang]}</p>
        {scene.people.length > 0 && (
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {scene.people.map((p) => (
              <li key={p.name} className="text-[15px] leading-snug">
                <span className="font-semibold">{p.name}</span>
                <span className="text-[#6b5340]"> · {p.role[lang]}</span>
              </li>
            ))}
          </ul>
        )}
        {reference.length > 0 && (
          // Label beside value, one line each where it fits: the card has to
          // stay short on a Chromebook screen, above the Job Card.
          <dl className="m-0 grid grid-cols-[auto_1fr] items-baseline gap-x-3 gap-y-1.5 border-t border-[#2a1810]/15 pt-2.5">
            {reference.map((fact) => {
              const value = typeof fact.value === "string" ? fact.value : fact.value[lang];
              // Something to copy letter for letter (a password, a date) reads in a
              // typewriter face; a sentence stays in the normal one.
              const exact = !/\s/.test(value);
              return (
                <div key={fact.label.en} className="contents">
                  <dt className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#6b5340]">{fact.label[lang]}</dt>
                  <dd
                    className={`m-0 leading-snug ${
                      exact
                        ? `font-mono font-semibold select-all ${value.length > 14 ? "break-all text-[14px]" : "text-[18px]"}`
                        : "break-words text-[15px]"
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
    </div>
  );
}

export const INFO_PAPER = {
  background: "linear-gradient(165deg, #fff8e8 0%, #f6edd4 55%, #efe4c8 100%)",
  boxShadow: "0 1px 0 rgba(255,255,255,0.55) inset, 0 10px 22px rgba(28,16,10,0.22), 0 2px 4px rgba(28,16,10,0.12)",
};

/** How the Job Card sends the learner here. Its copy always says it this way. */
const MENTIONS_CARD = /info card|tarjeta de información/i;

export default function LessonInfoCard({ top }: { top: number }) {
  const lesson = useLesson();
  const { lang } = useProgress();
  const card = useJobCardOptional();
  const [open, setOpen] = useState(false);
  if (!lesson) return null;

  // When the Job Card's step or correction sends the learner here ("Type the
  // password from your info card"), the card glows until they move on. It
  // also pulses a few times on arrival, so the eye finds it once.
  const pointedAt = MENTIONS_CARD.test(`${card?.step?.line.en ?? ""} ${card?.step?.line.es ?? ""} ${card?.correction ?? ""}`);
  const glow = pointedAt ? "animate-showme-pulse" : "animate-[showme-pulse_1.6s_ease-in-out_3]";

  const body = <InfoCardBody scene={lesson.scene} reference={lesson.reference} lang={lang} />;
  const paper = INFO_PAPER;

  return (
    <>
      {/* Wide screens: the top of the left column, above the Job Card. Its
          height gives way to the card, and scrolls if the facts run long. */}
      <aside
        aria-label={LESSON_COPY.infoTitle[lang]}
        className={`fixed z-[60] hidden overflow-y-auto rounded-[8px] xl:block ${glow}`}
        style={{ ...paper, top, left: EDGE, width: CARD_W, maxHeight: "max(180px, calc(100dvh - 440px))" }}
      >
        {body}
      </aside>

      {/* Narrow screens: a tab above the shelf, on the right because the Job Card is home on the left. */}
      <div className="xl:hidden">
        {open ? (
          <aside
            aria-label={LESSON_COPY.infoTitle[lang]}
            className="fixed right-2 z-[74] max-h-[calc(100vh-120px)] w-[300px] overflow-y-auto rounded-[8px]"
            style={{ ...paper, bottom: SHELF_RESERVE + 16 }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={LESSON_COPY.infoClose[lang]}
              className="absolute right-1.5 top-1 flex h-9 w-9 items-center justify-center rounded-full text-white hover:bg-white/15"
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
            className={`fixed right-2 z-[74] flex min-h-12 items-center gap-2 rounded-full bg-[#5b3a1e] px-5 text-[16px] font-semibold text-white ${glow}`}
            style={{ bottom: SHELF_RESERVE + 16 }}
          >
            <IdCard size={18} aria-hidden />
            {LESSON_COPY.infoOpen[lang]}
          </button>
        )}
      </div>
    </>
  );
}

"use client";

import { IdCard } from "lucide-react";
import { useLesson } from "@/lib/lesson-context";
import type { LessonFact, LessonScene } from "@/lib/lessons/types";
import type { Lang } from "@/lib/task-types";
import { useProgress } from "@/lib/progress-context";
import { LESSON_COPY } from "@/lib/lessons/copy";

/** Lessons reserve space for the Job Card at every viewport size. */
export const LESSON_RAIL_CLASS = "lesson-desktop";

/**
 * Facts a lesson learner needs while working: who they are, who the task
 * names, and anything to copy (a password, a date). Story mode teaches these
 * over many tasks; a lesson has to keep them on screen.
 *
 * Facts only, never a step. The Job Card is the one instruction voice.
 *
 * The Job Card contains these facts at every screen size. Context without
 * copyable reference facts is available through its Info card control.
 */
/** The card's face, shared by the docked card and the preview on the intro screen. */
export function InfoCardBody({
  scene,
  reference,
  lang,
  compact = false,
}: {
  scene: LessonScene;
  reference: LessonFact[];
  lang: Lang;
  compact?: boolean;
}) {
  return (
    <div data-testid="lesson-info-card" className="text-[#2a1810]">
      {/* A band of its own, so it reads as part of the screen, not wallpaper. */}
      <p className="m-0 flex items-center gap-2 bg-[#5b3a1e] px-5 py-2.5 text-[15px] font-semibold text-white">
        <IdCard size={18} aria-hidden />
        {LESSON_COPY.infoTitle[lang]}
      </p>
      <div className="flex flex-col gap-2.5 px-5 pb-3.5 pt-3">
        {(!compact || reference.length === 0) && <>
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
        </>}
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


/** Reference facts stay next to the task, inside the single lesson panel. */
export default function LessonInfoCard() {
  const lesson = useLesson();
  const { lang } = useProgress();
  if (!lesson || (!lesson.reference.length && !lesson.infoOpen)) return null;
  return (
    <section aria-label={LESSON_COPY.infoTitle[lang]} className="lesson-reference mt-4 border-t border-[#dadce0] pt-3">
      <InfoCardBody scene={lesson.scene} reference={lesson.reference} lang={lang} compact />
    </section>
  );
}

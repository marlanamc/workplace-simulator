"use client";

import { useProgress } from "@/lib/progress-context";
import { LESSON_COPY } from "@/lib/lessons/copy";
import type { LessonFact, LessonScene } from "@/lib/lessons/types";
import type { Localized } from "@/lib/task-types";
import { WelcomeShell } from "@/components/welcome-shell";
import { INFO_PAPER, InfoCardBody } from "@/components/lesson/LessonInfoCard";

/**
 * The scene a lesson opens on: who you are, who the task names, and what is
 * needed today. Story mode builds this up over many tasks; a lesson learner
 * arrives cold. Orientation only, like `ActIntro` — the steps stay on the
 * Job Card, and the people stay on the info card afterwards.
 */
export default function LessonIntro({
  title,
  scene,
  reference,
  onStart,
}: {
  title: Localized;
  scene: LessonScene;
  reference: LessonFact[];
  onStart: () => void;
}) {
  const { lang } = useProgress();
  const people = scene.people.map((p) => `${p.name}: ${p.role[lang]}.`);
  const speak = [title[lang], scene.you[lang], ...people, scene.need[lang], LESSON_COPY.introCard[lang]]
    .filter(Boolean)
    .join(" ");

  return (
    <WelcomeShell testId="lesson-intro" speak={speak}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-warning">{LESSON_COPY.kicker[lang]}</p>
        <h1 className="mt-1 text-[30px] leading-[1.1] font-semibold tracking-tight sm:text-[38px]">{title[lang]}</h1>
      </div>

      <section aria-labelledby="lesson-intro-need" className="mt-6 rounded-2xl bg-[#ece3d3] px-5 py-5 sm:px-7 sm:py-6">
        <h2 id="lesson-intro-need" className="text-base font-semibold">{LESSON_COPY.introNeed[lang]}</h2>
        <p className="mt-2 text-lg leading-relaxed">{scene.need[lang]}</p>
      </section>

      {/* The real card: who you are, who the task names, and what to copy.
          Seeing it here first means the learner knows what to look for. */}
      <section aria-labelledby="lesson-intro-card" className="mt-6">
        <h2 id="lesson-intro-card" className="text-lg font-semibold">{LESSON_COPY.introCardTitle[lang]}</h2>
        <p className="mt-1 text-base leading-relaxed text-[#3c4043]">{LESSON_COPY.introCard[lang]}</p>
        <div className="mt-3 max-w-[420px] overflow-hidden rounded-[8px]" style={INFO_PAPER}>
          <InfoCardBody scene={scene} reference={reference} lang={lang} />
        </div>
      </section>

      <button
        type="button"
        data-testid="lesson-intro-start"
        onClick={onStart}
        className="job-card-primary mt-6 inline-flex min-h-14 w-full items-center justify-center gap-2 bg-[#0b57d0] text-lg font-semibold text-white sm:w-auto sm:min-w-72"
      >
        {LESSON_COPY.introStart[lang]}
        <span aria-hidden>&rarr;</span>
      </button>
    </WelcomeShell>
  );
}

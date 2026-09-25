"use client";

import { useProgress } from "@/lib/progress-context";
import { LESSON_COPY } from "@/lib/lessons/copy";
import type { LessonScene } from "@/lib/lessons/types";
import type { Localized } from "@/lib/task-types";
import { WelcomeShell } from "@/components/welcome-shell";

/**
 * The scene a lesson opens on: who you are, who the task names, and what is
 * needed today. Story mode builds this up over many tasks; a lesson learner
 * arrives cold. Orientation only, like `ActIntro` — the steps stay on the
 * Job Card, and the people stay on the info card afterwards.
 */
export default function LessonIntro({
  title,
  scene,
  hasCard,
  onStart,
}: {
  title: Localized;
  scene: LessonScene;
  /** Whether the info card will be on screen, so the intro can point to it. */
  hasCard: boolean;
  onStart: () => void;
}) {
  const { lang } = useProgress();
  const people = scene.people.map((p) => `${p.name}: ${p.role[lang]}.`);
  const speak = [title[lang], scene.you[lang], ...people, scene.need[lang], hasCard ? LESSON_COPY.introCard[lang] : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <WelcomeShell testId="lesson-intro" speak={speak}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-warning">{LESSON_COPY.kicker[lang]}</p>
        <h1 className="mt-1 text-[30px] leading-[1.1] font-semibold tracking-tight sm:text-[38px]">{title[lang]}</h1>
      </div>

      <section aria-labelledby="lesson-intro-you" className="mt-6 rounded-2xl bg-[#ece3d3] px-5 py-5 sm:px-7 sm:py-6">
        <h2 id="lesson-intro-you" className="text-base font-semibold">
          {LESSON_COPY.introYou[lang]}
        </h2>
        <p className="mt-2 text-lg leading-relaxed">{scene.you[lang]}</p>
        {scene.people.length > 0 && (
          <>
            <h2 className="mt-5 text-base font-semibold">{LESSON_COPY.introPeople[lang]}</h2>
            <ul className="mt-2 space-y-1.5">
              {scene.people.map((p) => (
                <li key={p.name} className="text-lg leading-snug">
                  <span className="font-semibold">{p.name}</span>
                  <span className="text-[#3c4043]"> · {p.role[lang]}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-[#dfd4c2] bg-white/60 px-5 py-5 sm:px-7 sm:py-6">
        <div>
          <h2 className="text-lg font-semibold">{LESSON_COPY.introNeed[lang]}</h2>
          <p className="mt-1.5 text-lg leading-relaxed text-[#3c4043]">{scene.need[lang]}</p>
          {hasCard && <p className="mt-3 text-base leading-relaxed text-[#3c4043]">{LESSON_COPY.introCard[lang]}</p>}
          <button
            type="button"
            data-testid="lesson-intro-start"
            onClick={onStart}
            className="job-card-primary mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 bg-[#0b57d0] text-lg font-semibold text-white sm:w-auto sm:min-w-72"
          >
            {LESSON_COPY.introStart[lang]}
            <span aria-hidden>&rarr;</span>
          </button>
        </div>
      </section>
    </WelcomeShell>
  );
}

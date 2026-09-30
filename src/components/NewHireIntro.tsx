"use client";

import { useEffect, useRef } from "react";
import { useProgress } from "@/lib/progress-context";
import { NEW_HIRE_COPY } from "@/lib/new-hire-content";
import { CafeMotif, WelcomeShell } from "@/components/welcome-shell";

/**
 * Introduces Maria (manager) and Darnell (coworker) as their own full-page
 * screen, once: after the computer tour's first Job Card beats, before Day 1
 * starts. Acts II–VII get this from `ActIntro`; Act I has no such screen
 * until now, because there was no new role or new skills to name — only two
 * people the learner is about to get email from.
 */
export default function NewHireIntro({ onContinue }: { onContinue: () => void }) {
  const { lang } = useProgress();
  const c = NEW_HIRE_COPY;
  const start = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    start.current?.focus();
  }, []);

  return (
    <WelcomeShell
      testId="new-hire-intro"
      speak={[c.title[lang], c.managerRole[lang], c.managerLine[lang], c.coworkerRole[lang], c.coworkerLine[lang]].join(" ")}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-warning">{c.kicker[lang]}</p>
        <h1 className="mt-1 text-[30px] leading-[1.1] font-semibold tracking-tight sm:text-[38px]">
          {c.title[lang]}
        </h1>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <section className="rounded-2xl border border-[#dfd4c2] bg-white/60 px-5 py-5 sm:px-7 sm:py-6">
          <h2 className="text-lg font-semibold">{c.managerRole[lang]}</h2>
          <p className="mt-1.5 text-base leading-relaxed text-[#3c4043]">{c.managerLine[lang]}</p>
        </section>
        <section className="rounded-2xl border border-[#dfd4c2] bg-white/60 px-5 py-5 sm:px-7 sm:py-6">
          <h2 className="text-lg font-semibold">{c.coworkerRole[lang]}</h2>
          <p className="mt-1.5 text-base leading-relaxed text-[#3c4043]">{c.coworkerLine[lang]}</p>
        </section>
      </div>

      <div className="mt-6 flex items-center gap-5 rounded-2xl bg-[#ece3d3] px-5 py-5 sm:gap-7 sm:px-7 sm:py-6">
        <div className="min-w-0 flex-1">
          <button
            type="button"
            ref={start}
            data-testid="new-hire-continue"
            onClick={onContinue}
            className="job-card-primary inline-flex min-h-14 w-full items-center justify-center gap-2 bg-[#0b57d0] text-lg font-semibold text-white sm:w-auto sm:min-w-72"
          >
            {c.start[lang]}
            <span aria-hidden>&rarr;</span>
          </button>
        </div>
        <div className="hidden shrink-0 sm:block sm:w-[128px] md:w-[144px]">
          <CafeMotif />
        </div>
      </div>
    </WelcomeShell>
  );
}

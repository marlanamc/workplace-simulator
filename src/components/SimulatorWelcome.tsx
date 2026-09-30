"use client";

import { useProgress } from "@/lib/progress-context";
import { WELCOME_COPY, WELCOME_SKILLS } from "@/lib/welcome-content";
import { CafeMotif, SkillRow, WelcomeShell } from "@/components/welcome-shell";

/** The purpose of the simulator, before the desktop introduces its Job Card. */
export default function SimulatorWelcome({ onContinue }: { onContinue: () => void }) {
  const { lang } = useProgress();
  const c = WELCOME_COPY;

  return (
    <WelcomeShell
      testId="simulator-welcome"
      speak={[c.title[lang], c.purposeLine1[lang], c.purposeLine2[lang], c.jobTitle[lang], c.jobLine1[lang], c.jobLine2[lang], c.reassurance[lang]].join(" ")}
    >
      {/* Row 1 — the pitch */}
      <div>
        <h1 className="text-[30px] leading-[1.1] font-semibold tracking-tight sm:text-[38px]">
          {c.title[lang]}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-[#3c4043]">
          {c.purposeLine1[lang]}
          <br />
          {c.purposeLine2[lang]}
        </p>
      </div>

      {/* Rows 2 and 3. On a short screen (911x512, a Chromebook at 150% text)
          the first job and its button come first, so the way in is on screen
          without scrolling (Phase 3 N-6); tall screens keep this order. */}
      <div className="mt-6 flex flex-col gap-6">
      {/* Row 2 — what you'll practice */}
      <section
        aria-labelledby="welcome-skills-title"
        className="rounded-2xl bg-[#ece3d3] px-5 py-5 sm:px-7 sm:py-6"
      >
        <h2 id="welcome-skills-title" className="text-base font-semibold">
          {c.skillsTitle[lang]}
        </h2>
        <SkillRow skills={WELCOME_SKILLS} lang={lang} />
      </section>

      {/* Row 3 — your first job, and the way in */}
      <section className="flex items-center gap-5 rounded-2xl border border-[#dfd4c2] bg-white/60 px-5 py-5 sm:gap-7 sm:px-7 sm:py-6 [@media(max-height:640px)]:order-first">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold">{c.jobTitle[lang]}</h2>
          <p className="mt-1.5 text-base leading-relaxed text-[#3c4043]">
            {c.jobLine1[lang]}
            <br />
            {c.jobLine2[lang]}
          </p>
          <button
            type="button"
            data-testid="welcome-continue"
            onClick={onContinue}
            className="job-card-primary mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 bg-[#0b57d0] text-lg font-semibold text-white sm:w-auto sm:min-w-72"
          >
            {c.start[lang]}
            <span aria-hidden>&rarr;</span>
          </button>
          <p className="mt-2.5 text-sm leading-relaxed text-[#5f4b32]">{c.reassurance[lang]}</p>
        </div>
        <div className="hidden shrink-0 sm:block sm:w-[128px] md:w-[144px]">
          <CafeMotif />
        </div>
      </section>
      </div>
    </WelcomeShell>
  );
}

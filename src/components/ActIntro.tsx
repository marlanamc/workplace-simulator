"use client";

import { useProgress } from "@/lib/progress-context";
import { actIntroFor } from "@/lib/act-intro-content";
import type { Act } from "@/lib/tracks-content";
import { CafeMotif, SkillRow, WelcomeShell } from "@/components/welcome-shell";

/**
 * The orientation screen before a new act: role, the manager taking over, what
 * changed in the story, and the new skills this act builds. Same frame and
 * layout as `SimulatorWelcome`. Gated once per act in `DesktopClient`.
 */
export default function ActIntro({ act, onContinue }: { act: Act; onContinue: () => void }) {
  const { lang } = useProgress();
  const intro = actIntroFor(act.key);
  // Guard: an act without copy (shouldn't happen — content-integrity covers it)
  // falls through so the learner is never stuck on a blank screen.
  if (!intro) {
    onContinue();
    return null;
  }

  return (
    <WelcomeShell testId="act-intro" dataAct={act.key}>
      {/* Row 1 — the new role */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-warning">{intro.actLabel[lang]}</p>
        <h1 className="mt-1 text-[30px] leading-[1.1] font-semibold tracking-tight sm:text-[38px]">
          {intro.role[lang]}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-[#3c4043]">{intro.roleLine[lang]}</p>
      </div>

      {/* Row 2 — new skills */}
      <section
        aria-labelledby="act-intro-skills-title"
        className="mt-6 rounded-2xl bg-[#ece3d3] px-5 py-5 sm:px-7 sm:py-6"
      >
        <h2 id="act-intro-skills-title" className="text-base font-semibold">
          {intro.skillsTitle[lang]}
        </h2>
        <SkillRow skills={intro.skills} lang={lang} />
      </section>

      {/* Row 3 — the manager, the story bridge, and the way in */}
      <section className="mt-6 flex items-center gap-5 rounded-2xl border border-[#dfd4c2] bg-white/60 px-5 py-5 sm:gap-7 sm:px-7 sm:py-6">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold">{intro.manager[lang]}</h2>
          <p className="mt-1.5 text-base leading-relaxed text-[#3c4043]">{intro.bridge[lang]}</p>
          <button
            type="button"
            data-testid="act-intro-continue"
            onClick={onContinue}
            className="job-card-primary mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 bg-[#0b57d0] text-lg font-semibold text-white sm:w-auto sm:min-w-72"
          >
            {intro.start[lang]}
            <span aria-hidden>&rarr;</span>
          </button>
        </div>
        <div className="hidden shrink-0 sm:block sm:w-[128px] md:w-[144px]">
          <CafeMotif />
        </div>
      </section>
    </WelcomeShell>
  );
}

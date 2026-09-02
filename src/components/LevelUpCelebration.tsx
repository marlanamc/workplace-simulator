"use client";

import { useProgress } from "@/lib/progress-context";
import { useWindowManager } from "@/lib/window-manager";
import { nextHandoff } from "@/lib/tracks-content";
import { DESKTOP_COPY } from "@/lib/desktop-content";
import { HANDOFF_CTA } from "@/lib/story-beats";
import Confetti from "@/components/task/Confetti";
import { logout } from "@/app/actions";

/**
 * The end of a level: what just changed in the story, and a real choice about
 * what happens next. A learner who has finished a day should not have to
 * decide whether closing the laptop counts as quitting - "Clock out for
 * today" is a legitimate way to end, in the language of the job, and their
 * progress is already saved either way.
 */
export default function LevelUpCelebration() {
  const { celebrateLevel, dismissLevelCelebration, completedTaskKeys, lang } = useProgress();
  const { openApp } = useWindowManager();
  if (!celebrateLevel?.levelUp) return null;
  const { levelUp } = celebrateLevel;
  const kicker = levelUp.kicker[lang];
  const title = levelUp.title[lang];
  const body = levelUp.body[lang];
  const handoff = nextHandoff(completedTaskKeys);
  const cta =
    celebrateLevel.freeTabbing && handoff
      ? HANDOFF_CTA[handoff.taskKey][lang]
      : levelUp.cta[lang];

  const keepGoing = () => {
    const handoff = nextHandoff(completedTaskKeys);
    dismissLevelCelebration();
    if (!handoff) return;
    openApp(handoff.location.appKey, {
      tab: handoff.location.tab,
      section: handoff.location.section,
    });
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-6"
      onClick={dismissLevelCelebration}
    >
      <div
        className="relative w-full max-w-[460px] overflow-hidden rounded-2xl bg-white p-8 text-center shadow-2xl animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <Confetti count={22} />
        <div className="relative z-10">
        <div className="mx-auto animate-pop-in text-[48px] leading-none" aria-hidden>
          {levelUp.emoji}
        </div>
        <div className="mt-3 text-[12px] font-semibold uppercase tracking-wide text-warning">{kicker}</div>
        <h2 className="mt-2 text-[26px] font-medium leading-tight">{title}</h2>
        <p className="mt-3 text-[16px] leading-relaxed text-text-secondary">{body}</p>
        {celebrateLevel.freeTabbing ? (
          <p className="mt-4 rounded-xl bg-surface-muted px-4 py-3 text-[14px] leading-snug text-text-primary">
            {DESKTOP_COPY[lang].bookmarkOnramp}
          </p>
        ) : null}
        {levelUp.stoppingPoint ? (
          <>
            <form action={logout}>
              <button
                type="submit"
                className="mt-7 inline-flex min-h-[50px] w-full items-center justify-center rounded-full bg-accent px-6 text-[16px] font-medium text-white hover:bg-accent-hover cursor-pointer"
              >
                {DESKTOP_COPY[lang].clockOut}
              </button>
            </form>
            <button
              onClick={keepGoing}
              className="mt-2 inline-flex min-h-[50px] w-full items-center justify-center rounded-full px-6 text-[16px] font-medium text-text-secondary hover:bg-surface-muted cursor-pointer"
            >
              {cta}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={keepGoing}
              className="mt-7 inline-flex min-h-[50px] w-full items-center justify-center rounded-full bg-accent px-6 text-[16px] font-medium text-white hover:bg-accent-hover cursor-pointer"
            >
              {cta}
            </button>
            <form action={logout}>
              <button
                type="submit"
                className="mt-2 inline-flex min-h-[50px] w-full items-center justify-center rounded-full px-6 text-[16px] font-medium text-text-secondary hover:bg-surface-muted cursor-pointer"
              >
                {DESKTOP_COPY[lang].clockOut}
              </button>
            </form>
          </>
        )}
        </div>
      </div>
    </div>
  );
}

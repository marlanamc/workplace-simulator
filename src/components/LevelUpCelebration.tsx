"use client";

import { useProgress } from "@/lib/progress-context";
import Confetti from "@/components/task/Confetti";
import { PartyPopper } from "@/lib/icons";

/** The big "you leveled up" moment - bigger than a single track's award popup, since a whole level (and often a promotion) just finished. */
export default function LevelUpCelebration() {
  const { celebrateLevel, dismissLevelCelebration } = useProgress();
  if (!celebrateLevel?.levelUp) return null;
  const { kicker, title, body, cta } = celebrateLevel.levelUp;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-6"
      onClick={dismissLevelCelebration}
    >
      <div
        className="relative w-full max-w-[460px] overflow-hidden rounded-2xl bg-white p-8 text-center shadow-2xl animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <Confetti count={48} />
        <PartyPopper size={48} strokeWidth={1.6} className="mx-auto animate-pop-in text-[var(--text-primary)]" aria-hidden />
        <div className="mt-3 text-[12px] font-semibold uppercase tracking-wide text-[var(--warning)]">{kicker}</div>
        <h2 className="mt-2 text-[26px] font-medium leading-tight">{title}</h2>
        <p className="mt-3 text-[16px] leading-relaxed text-[var(--text-secondary)]">{body}</p>
        <button
          onClick={dismissLevelCelebration}
          className="mt-7 inline-flex min-h-[50px] w-full items-center justify-center rounded-full bg-[var(--accent)] px-6 text-[16px] font-medium text-white hover:bg-[var(--accent-hover)] cursor-pointer"
        >
          {cta}
        </button>
      </div>
    </div>
  );
}

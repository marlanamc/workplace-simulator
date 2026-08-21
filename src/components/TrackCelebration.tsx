"use client";

import { useProgress } from "@/lib/progress-context";
import Confetti from "@/components/task/Confetti";

export default function TrackCelebration({ onSeeAward }: { onSeeAward: () => void }) {
  const { celebrateTrack, dismissCelebration } = useProgress();
  if (!celebrateTrack) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-6"
      onClick={dismissCelebration}
    >
      <div
        className="relative w-full max-w-[420px] overflow-hidden rounded-2xl bg-white p-7 text-center shadow-2xl animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <Confetti count={26} />
        <div className="animate-pop-in mb-4 text-[48px] leading-none">{celebrateTrack.awardEmoji}</div>
        <h2 className="mb-2 text-[22px] font-medium leading-tight">{celebrateTrack.title}</h2>
        <p className="mb-6 text-[15px] leading-relaxed text-[var(--text-secondary)]">
          Award unlocked. It&rsquo;s in your trophy case.
        </p>
        <button
          onClick={onSeeAward}
          className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[var(--accent)] px-6 text-[16px] font-medium text-white hover:bg-[var(--accent-hover)] cursor-pointer"
        >
          See award
        </button>
      </div>
    </div>
  );
}

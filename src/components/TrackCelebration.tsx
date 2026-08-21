"use client";

import { useProgress } from "@/lib/progress-context";

export default function TrackCelebration() {
  const { celebrateTrack, dismissCelebration } = useProgress();
  if (!celebrateTrack) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-6"
      onClick={dismissCelebration}
    >
      <div
        className="w-full max-w-[420px] rounded-2xl bg-white p-7 text-center shadow-2xl animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 text-[40px]">🏆</div>
        <div className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-[var(--warning)]">
          Certificate earned
        </div>
        <h2 className="mb-2 text-[22px] font-medium leading-tight">{celebrateTrack.title}</h2>
        <p className="mb-6 text-[15px] leading-relaxed text-[var(--text-secondary)]">
          You finished every task in this track. Great work — it&rsquo;s saved to your certificates.
        </p>
        <button
          onClick={dismissCelebration}
          className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[var(--accent)] px-6 text-[16px] font-medium text-white hover:bg-[var(--accent-hover)] cursor-pointer"
        >
          Keep going
        </button>
      </div>
    </div>
  );
}

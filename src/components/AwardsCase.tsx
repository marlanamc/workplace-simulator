"use client";

import { useMemo, useState } from "react";
import { TRACKS } from "@/lib/tracks-content";
import { SKILLS } from "@/lib/skills";
import { useProgress } from "@/lib/progress-context";
import { SHELF_RESERVE } from "@/components/Shelf";

export default function AwardsCase({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { certificateTrackKeys } = useProgress();
  const earned = useMemo(() => new Set(certificateTrackKeys), [certificateTrackKeys]);
  const fallbackKey = certificateTrackKeys[certificateTrackKeys.length - 1] ?? TRACKS[0].key;
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const activeKey = selectedKey ?? fallbackKey;

  if (!open) return null;

  const selected = TRACKS.find((t) => t.key === activeKey) ?? TRACKS[0];
  const selectedEarned = earned.has(selected.key);
  const earnedCount = TRACKS.filter((t) => earned.has(t.key)).length;

  return (
    <>
      <div
        aria-hidden
        onClick={() => onOpenChange(false)}
        className="fixed inset-x-0 top-0 z-40 bg-black/45"
        style={{ bottom: SHELF_RESERVE }}
      />
      <div
        className="fixed inset-x-0 top-0 z-50 flex justify-center overflow-y-auto px-3 pt-10 pb-4"
        style={{ bottom: SHELF_RESERVE }}
        onClick={() => onOpenChange(false)}
      >
        <div
          className="mb-auto w-full max-w-[480px] overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.45)] animate-fade-up"
          style={{ background: "#1c1410", color: "#f3e6d4" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between px-5 pt-5 pb-3">
            <div>
              <h2 className="text-[22px] font-medium leading-tight text-white">Awards</h2>
              <p className="mt-1 text-[13px] text-[#d4b896]">
                {earnedCount === 0
                  ? "Finish a track to unlock your first trophy."
                  : `${earnedCount} of ${TRACKS.length} unlocked`}
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              aria-label="Close"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[16px] text-[#d4b896] hover:bg-white/10 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div
            className="mx-4 flex items-end justify-around gap-1 rounded-xl px-1 pt-8 pb-3"
            style={{
              background: "linear-gradient(180deg, #4a2f1c 0%, #2a1a10 58%, #c9a227 59%, #8a7018 100%)",
            }}
          >
            {TRACKS.map((track) => {
              const unlocked = earned.has(track.key);
              const isSelected = activeKey === track.key;
              return (
                <button
                  key={track.key}
                  onClick={() => setSelectedKey(track.key)}
                  className={`flex min-w-0 flex-1 flex-col items-center gap-1.5 rounded-xl px-1 py-2 cursor-pointer ${
                    isSelected ? "bg-white/10" : "hover:bg-white/6"
                  }`}
                >
                  <span
                    className={`text-[36px] leading-none ${unlocked ? "" : "opacity-25 grayscale"}`}
                    aria-hidden
                  >
                    {track.awardEmoji}
                  </span>
                  <span
                    className={`w-full truncate text-center text-[11px] font-medium leading-tight ${
                      unlocked ? "text-white" : "text-white/40"
                    }`}
                  >
                    {track.title}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="px-5 py-5">
            <h3 className="text-[18px] font-medium text-white">{selected.title}</h3>
            <p className="mt-1 text-[14px] leading-relaxed text-[#d4b896]">{selected.subtitle}</p>
            {selectedEarned ? (
              <ul className="mt-4 flex flex-col gap-2">
                {selected.taskKeys.map((taskKey) => (
                  <li key={taskKey} className="flex items-start gap-2 text-[14px] leading-snug text-[#f3e6d4]">
                    <span className="mt-0.5 text-[#c9a227]" aria-hidden>
                      ★
                    </span>
                    {SKILLS[taskKey]}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-[14px] leading-relaxed text-white/45">
                Keep going — this one unlocks when you finish every task in the track.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

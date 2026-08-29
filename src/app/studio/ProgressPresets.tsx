"use client";

import { useState } from "react";
import { LEVELS } from "@/lib/tracks-content";
import { dayTitle } from "@/lib/shift-spine";
import { setProgressPreset } from "@/app/actions";

/**
 * The Studio time machine: one click sets THIS signed-in account's progress
 * to the start of any level (or fresh, or everything done), clears the
 * device-side story state to match, and drops you on the learner desktop —
 * exactly what a real learner at that moment would see. No extra accounts.
 */
export default function ProgressPresets({ learnerId }: { learnerId: string }) {
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const apply = async (levelKey: string | "all") => {
    if (busyKey) return;
    setBusyKey(levelKey);
    const result = await setProgressPreset(levelKey);
    if (!result.ok) {
      setBusyKey(null);
      return;
    }
    // Progress flags and help-ladder rungs live in localStorage per learner;
    // stale ones would leak "future" story into the rewound state.
    try {
      window.localStorage.removeItem(`ws-story-flags:${learnerId}`);
      window.localStorage.removeItem(`ws-rungs:${learnerId}`);
    } catch {
      // Private browsing: nothing stored, nothing to clear.
    }
    // Full navigation on purpose: router.push() would keep the cached RSC
    // payload and the desktop would render the pre-rewind progress.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/?from=studio");
  };

  const pill =
    "inline-flex h-8 items-center rounded-full px-3 text-[12px] font-medium cursor-pointer disabled:opacity-40 disabled:cursor-wait";

  return (
    <section className="rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4">
      <h2 className="text-[15px] font-medium">Time machine</h2>
      <p className="mt-1 max-w-[640px] text-[13px] leading-relaxed text-[#9aa0a6]">
        Sets <span className="text-[#e8eaed]">your</span> account&apos;s progress to the start of a
        level and opens the learner desktop — celebrations, story emails, and locks behave exactly
        as they would for a real learner at that moment. It replaces this account&apos;s progress,
        so use a test account, not a demo account you care about.
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <button
          onClick={() => apply(LEVELS[0].key)}
          disabled={busyKey !== null}
          className={`${pill} bg-white/10 text-white hover:bg-white/20`}
        >
          {busyKey === LEVELS[0].key ? "…" : "Fresh account"}
        </button>
        {LEVELS.slice(1).map((level) => (
          <button
            key={level.key}
            onClick={() => apply(level.key)}
            disabled={busyKey !== null}
            className={`${pill} bg-white/6 text-white/85 hover:bg-white/15`}
          >
            {busyKey === level.key ? "…" : `Start of ${dayTitle(level, "en")}`}
          </button>
        ))}
        <button
          onClick={() => apply("all")}
          disabled={busyKey !== null}
          className={`${pill} bg-[#81c995]/15 text-[#81c995] hover:bg-[#81c995]/25`}
        >
          {busyKey === "all" ? "…" : "Everything done"}
        </button>
      </div>
    </section>
  );
}

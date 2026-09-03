"use client";

import { useState } from "react";
import { LEVELS, TRACKS } from "@/lib/tracks-content";
import { dayTitle } from "@/lib/shift-spine";
import { learnerKey, storage } from "@/lib/storage";
import { setProgressPreset } from "@/app/actions";
import { BRIDGE_PATH_FLAG, isAct6Task, isAct7Task, type BridgePath } from "@/lib/bridge-path";

/**
 * The Studio time machine: one click sets THIS signed-in account's progress
 * to the start of any level (or fresh, or everything done), clears the
 * device-side story state to match, and drops you on the learner desktop —
 * exactly what a real learner at that moment would see. No extra accounts.
 */
export default function ProgressPresets({ learnerId }: { learnerId: string }) {
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const apply = async (presetKey: string | "all", path?: BridgePath) => {
    if (busyKey) return;
    setBusyKey(presetKey);
    const result = await setProgressPreset(presetKey);
    if (!result.ok) {
      setBusyKey(null);
      return;
    }
    // Progress flags and help-ladder rungs live in localStorage per learner;
    // stale ones would leak "future" story into the rewound state.
    storage.remove(learnerKey.storyFlags(learnerId));
    storage.remove(learnerKey.rungs(learnerId));
    if (path) {
      storage.setJSON(learnerKey.storyFlags(learnerId), { [BRIDGE_PATH_FLAG]: path });
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
        {LEVELS.slice(1).map((level) => {
          const title = dayTitle(level, "en");
          // HQ (Act VI) and Team Lead (Act VII) both sit on a chosen bridge
          // path, so their presets carry the :a/:b door the way Act V's do.
          const isHqOrAct7 = level.trackKeys.some((tk) =>
            TRACKS.find((t) => t.key === tk)?.taskKeys.some((k) => isAct6Task(k) || isAct7Task(k)),
          );
          if (level.pathTracks || isHqOrAct7) {
            const pickerKey = level.pathTracks && level.key === "level16" ? level.key : null;
            return (
              <span key={level.key} className="contents">
                {pickerKey ? (
                  <button
                    onClick={() => apply(pickerKey)}
                    disabled={busyKey !== null}
                    className={`${pill} bg-white/6 text-white/85 hover:bg-white/15`}
                  >
                    {busyKey === pickerKey ? "…" : `Start of ${title} (pick a door)`}
                  </button>
                ) : null}
                <button
                  onClick={() => apply(`${level.key}:a`, "a")}
                  disabled={busyKey !== null}
                  className={`${pill} bg-white/6 text-white/85 hover:bg-white/15`}
                >
                  {busyKey === `${level.key}:a` ? "…" : `Start of ${title} · College`}
                </button>
                <button
                  onClick={() => apply(`${level.key}:b`, "b")}
                  disabled={busyKey !== null}
                  className={`${pill} bg-white/6 text-white/85 hover:bg-white/15`}
                >
                  {busyKey === `${level.key}:b` ? "…" : `Start of ${title} · Front desk`}
                </button>
              </span>
            );
          }
          return (
            <button
              key={level.key}
              onClick={() => apply(level.key)}
              disabled={busyKey !== null}
              className={`${pill} bg-white/6 text-white/85 hover:bg-white/15`}
            >
              {busyKey === level.key ? "…" : `Start of ${title}`}
            </button>
          );
        })}
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

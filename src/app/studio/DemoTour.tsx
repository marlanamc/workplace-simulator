"use client";

import { useState } from "react";
import { CATALOG_ACTS } from "@/lib/curriculum-catalog";
import { dayTitle } from "@/lib/shift-spine";
import { LEVELS } from "@/lib/tracks-content";
import { jumpToPreset } from "./jump-to-preset";

/**
 * A short, ordered walk through the game for showing it to people: first
 * login to capstone. Each stop is a time-machine preset, so it lands exactly
 * where a real learner at that moment would be.
 */
const STOPS: { presetKey: string; actKey: string; title?: string; point: string }[] = [
  {
    presetKey: "level0",
    actKey: "act1",
    title: "Fresh account",
    point: "What a new student sees first. The Job Card is the one place that says what to do next.",
  },
  {
    presetKey: "level3",
    actKey: "act1",
    point: "A real hourly-job problem. Early on, the app checks each click.",
  },
  {
    presetKey: "level6",
    actKey: "act2",
    point: "Shift-lead work in Sheets. The support steps back.",
  },
  {
    presetKey: "core-complete",
    actKey: "act2",
    title: "After Act II: pick a door",
    point: "Three equal paths: stay and lead, healthcare / front desk, or office.",
  },
  {
    presetKey: "level19h3",
    actKey: "act6",
    point: "The office path: applying for the HQ job and practicing the interview.",
  },
  {
    presetKey: "level27",
    actKey: "act7",
    point: "The capstone. Students look back at everything they did.",
  },
];

function stopTitle(stop: (typeof STOPS)[number]): string {
  if (stop.title) return stop.title;
  const level = LEVELS.find((l) => l.key === stop.presetKey);
  return level ? dayTitle(level, "en") : stop.presetKey;
}

export default function DemoTour({ learnerId }: { learnerId: string }) {
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const go = async (presetKey: string) => {
    if (busyKey) return;
    // Open the tab now, while this is still the click: a tab opened after the
    // await would be blocked as a pop-up. Studio stays put in this tab.
    const tab = window.open("about:blank", "_blank");
    setBusyKey(presetKey);
    await jumpToPreset(learnerId, presetKey, undefined, tab);
    setBusyKey(null);
  };

  return (
    <section className="rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4">
      <h2 className="text-[15px] font-medium">Demo tour</h2>
      <p className="mt-1 max-w-[640px] text-[13px] leading-relaxed text-[#9aa0a6]">
        Six stops, first login to capstone. Each button sets this account to that moment and
        opens the desktop in a new tab, so this list stays open here.
      </p>
      <ol className="mt-3 flex flex-col divide-y divide-white/6">
        {STOPS.map((stop, i) => {
          const color = CATALOG_ACTS.find((a) => a.key === stop.actKey)?.color ?? "#9aa0a6";
          return (
            <li
              key={stop.presetKey}
              className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
            >
              <div className="flex min-w-0 items-start gap-2.5">
                <span
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-white"
                  style={{ background: color }}
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium leading-snug text-[#e8eaed]">
                    {stopTitle(stop)}
                  </p>
                  <p className="mt-0.5 text-[13px] leading-snug text-[#9aa0a6]">{stop.point}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => go(stop.presetKey)}
                disabled={busyKey !== null}
                className="inline-flex h-9 shrink-0 items-center rounded-full bg-white px-3.5 text-[13px] font-medium text-[#202124] hover:bg-[#e8eaed] disabled:cursor-wait disabled:opacity-40"
              >
                {busyKey === stop.presetKey ? "…" : "Go"}
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

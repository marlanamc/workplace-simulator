"use client";

import { useState } from "react";
import type { CatalogAct } from "@/lib/curriculum-catalog";
import { jumpToPreset, presetForAct } from "./jump-to-preset";

/**
 * Header pills: one click jumps to that act's orientation screen (welcome for
 * Act I, ActIntro for II–VII) with the same in-day locks as a learner.
 */
export default function ActJumpNav({
  learnerId,
  acts,
}: {
  learnerId: string;
  acts: Pick<CatalogAct, "key" | "title" | "color">[];
}) {
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const jump = async (actKey: string) => {
    if (busyKey) return;
    const preset = presetForAct(actKey);
    if (!preset) return;
    setBusyKey(actKey);
    const ok = await jumpToPreset(learnerId, preset.presetKey, preset.path);
    if (!ok) setBusyKey(null);
  };

  return (
    <nav className="flex flex-wrap gap-1.5" aria-label="Acts">
      {acts.map((act) => (
        <button
          key={act.key}
          type="button"
          onClick={() => jump(act.key)}
          disabled={busyKey !== null}
          className="rounded-full px-3 py-1 text-[12px] font-medium text-white/80 hover:bg-white/10 hover:text-white disabled:cursor-wait disabled:opacity-40"
          style={{ boxShadow: `inset 0 0 0 1px ${act.color}55` }}
        >
          {busyKey === act.key ? "…" : act.title.replace(/^Act /, "")}
        </button>
      ))}
    </nav>
  );
}

"use client";

import { useEffect } from "react";
import { useWindowManager } from "@/lib/window-manager";
import { TAB_ICONS } from "@/lib/icons";

export interface TourStep {
  instruction: string;
  targetTabKey: string;
}

/** One instruction, one real target, nothing else on screen - like a game's tutorial prompt. Advances only when the learner actually clicks the named tab, detected by watching the shared browserTab state (the same signal ObjectivesPanel already reads). */
export default function TourWalkthrough({
  steps,
  stepIndex,
  onAdvance,
  tabColors,
}: {
  steps: TourStep[];
  stepIndex: number;
  onAdvance: () => void;
  /** Real tab color per tab key (from BrowserClient's BASE_TABS), so the instruction icon matches the actual tab it's pointing at. */
  tabColors: Record<string, string>;
}) {
  const { browserTab } = useWindowManager();
  const step = steps[stepIndex];

  useEffect(() => {
    if (step && browserTab === step.targetTabKey) {
      onAdvance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [browserTab, stepIndex]);

  if (!step) return null;
  const Icon = TAB_ICONS[step.targetTabKey];
  const color = tabColors[step.targetTabKey] ?? "var(--accent)";

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] bg-black/60">
      <div className="absolute left-1/2 top-[92px] flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.35)] animate-fade-up">
        {Icon && (
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white"
            style={{ background: color }}
          >
            <Icon size={18} strokeWidth={2.25} aria-hidden />
          </span>
        )}
        <p className="text-[16px] font-medium leading-tight text-[#1c1410]">{step.instruction}</p>
      </div>
    </div>
  );
}

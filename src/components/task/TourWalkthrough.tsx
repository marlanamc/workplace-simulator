"use client";

import { useEffect, useState } from "react";
import { MoveUp } from "lucide-react";
import { useWindowManager } from "@/lib/window-manager";
import { TAB_ICONS } from "@/lib/icons";
import type { TourStep } from "@/lib/tasks/tour/content";

function targetSelector(step: TourStep) {
  if (step.targetTestId) return `[data-testid="${step.targetTestId}"]`;
  if (step.targetTabKey) return `[data-testid="bookmark-${step.targetTabKey}"]`;
  return null;
}

/**
 * One instruction, one real control. Spotlight it so learners can still see
 * it through the dim. Click steps advance on the real click; look beats wait
 * for Got it so they don't scan past Mail or Calendar.
 */
export default function TourWalkthrough({
  steps,
  stepIndex,
  onAdvance,
  tabColors,
}: {
  steps: TourStep[];
  stepIndex: number;
  onAdvance: () => void;
  tabColors: Record<string, string>;
}) {
  const { browserTab } = useWindowManager();
  const step = steps[stepIndex];
  const [rect, setRect] = useState<DOMRect | null>(null);
  const isLookBeat = Boolean(step?.continueLabel);
  const isTargetClick = Boolean(step?.targetTestId) && !step?.continueLabel;

  useEffect(() => {
    if (!step || step.continueLabel || step.targetTestId) return;
    if (step.targetTabKey && browserTab === step.targetTabKey) {
      onAdvance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [browserTab, stepIndex]);

  useEffect(() => {
    if (!step?.targetTestId || step.continueLabel) return;
    const el = document.querySelector(`[data-testid="${step.targetTestId}"]`);
    if (!el) return;
    const onClick = () => onAdvance();
    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, step?.targetTestId]);

  useEffect(() => {
    if (!step) {
      setRect(null);
      return;
    }
    const sel = targetSelector(step);
    const measure = () => {
      if (!sel) {
        setRect(null);
        return;
      }
      const el = document.querySelector(sel);
      setRect(el ? el.getBoundingClientRect() : null);
    };
    const raf = requestAnimationFrame(measure);
    // Help lands after a tab switch; measure again shortly so the ? exists.
    const t = window.setTimeout(measure, 80);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [step, stepIndex]);

  if (!step) return null;

  const iconKey = step.targetTabKey;
  const Icon = iconKey ? TAB_ICONS[iconKey] : undefined;
  const color = iconKey ? (tabColors[iconKey] ?? "var(--accent)") : "#c45c26";
  const dim = isLookBeat ? "rgba(28, 20, 16, 0.22)" : "rgba(28, 20, 16, 0.38)";

  const hole = rect
    ? {
        left: rect.left - 8,
        top: rect.top - 6,
        width: rect.width + 16,
        height: rect.height + 12,
      }
    : null;

  const bubbleAbove = rect ? rect.top > 140 : false;
  const bubbleTop = rect ? (bubbleAbove ? rect.top - 14 : rect.bottom + 14) : 92;
  const bubbleLeft = rect
    ? Math.min(Math.max(16, rect.left + rect.width / 2 - 160), window.innerWidth - 340)
    : undefined;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70]">
      {hole ? (
        <>
          <div
            className="absolute rounded-xl"
            style={{
              ...hole,
              boxShadow: `0 0 0 9999px ${dim}`,
            }}
            aria-hidden
          />
          {isLookBeat ? (
            <div
              className="absolute rounded-xl"
              style={{
                ...hole,
                boxShadow: "0 0 0 3px rgba(196, 92, 38, 0.85)",
              }}
              aria-hidden
            />
          ) : (
            <div className="animate-showme-pulse absolute rounded-xl" style={hole} aria-hidden />
          )}
        </>
      ) : (
        <div className="absolute inset-0 bg-[#1c1410]/30" aria-hidden />
      )}

      <div
        className={`absolute flex max-w-[min(360px,calc(100vw-32px))] flex-col gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-[0_16px_40px_rgba(28,20,16,0.28)] animate-fade-up ${
          bubbleAbove ? "-translate-y-full" : ""
        } ${isLookBeat ? "pointer-events-auto" : "pointer-events-none"}`}
        style={{
          left: bubbleLeft ?? "50%",
          top: bubbleTop,
          transform: bubbleLeft == null ? "translateX(-50%)" : undefined,
        }}
        role={isLookBeat ? "dialog" : undefined}
        aria-label={isLookBeat ? step.instruction : undefined}
      >
        <div className="flex items-start gap-3">
          {Icon ? (
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white"
              style={{ background: color }}
            >
              <Icon size={18} strokeWidth={2.25} aria-hidden />
            </span>
          ) : isTargetClick ? (
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#747775] text-[18px] font-medium text-[#3c4043]"
              aria-hidden
            >
              ?
            </span>
          ) : null}
          <p className="text-[16px] font-medium leading-snug text-[#1c1410]">{step.instruction}</p>
          {!isLookBeat && rect ? (
            <MoveUp
              size={18}
              strokeWidth={2.25}
              aria-hidden
              className={`mt-1 shrink-0 text-[#c45c26] ${bubbleAbove ? "rotate-180" : ""}`}
            />
          ) : null}
        </div>
        {step.continueLabel ? (
          <button
            type="button"
            onClick={onAdvance}
            className="inline-flex min-h-[44px] items-center justify-center self-end rounded-full bg-[#c45c26] px-5 text-[15px] font-medium text-white hover:bg-[#a34c1f] cursor-pointer"
          >
            {step.continueLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useWindowManager } from "@/lib/window-manager";
import { useJobCardOptional, useReporterId } from "@/lib/job-card-context";
import type { TourStep } from "@/lib/tasks/tour/content";

function targetSelector(step: TourStep) {
  if (step.targetTestId) return `[data-testid="${step.targetTestId}"]`;
  if (step.targetTabKey) return `[data-testid="bookmark-${step.targetTabKey}"]`;
  return null;
}

/**
 * The spotlight half of the tour. It dims the screen, rings the one real
 * control, and reports the step's sentence to the Job Card - which is what
 * actually says it. Same division of labour as everywhere else in the
 * product: the card speaks, the highlight points.
 *
 * Click steps still advance on the real click. "Look" beats have nothing to
 * click, so they advance from the card's own primary button instead.
 */
export default function TourWalkthrough({
  steps,
  stepIndex,
  onAdvance,
}: {
  steps: TourStep[];
  stepIndex: number;
  onAdvance: () => void;
  /** Kept for call-site compatibility; the card carries the step's identity now. */
  tabColors?: Record<string, string>;
}) {
  const { browserTab } = useWindowManager();
  const card = useJobCardOptional();
  const id = useReporterId();
  const step = steps[stepIndex];
  const [rect, setRect] = useState<DOMRect | null>(null);
  const isLookBeat = Boolean(step?.continueLabel);

  const reportStep = card?.reportStep;
  const registerPrimary = card?.registerPrimary;
  const instruction = step?.instruction ?? "";
  const continueLabel = step?.continueLabel;

  // Handed over fresh every render; see RightNowBar for why this is a ref.
  useEffect(() => {
    registerPrimary?.(continueLabel ? onAdvance : null);
  });

  useEffect(() => {
    if (!reportStep || !instruction) return;
    reportStep({
      id,
      stepIndex,
      stepCount: steps.length,
      // Tour steps are picked out of `TOUR_STEPS[lang]`, so they are already
      // in the learner's language by the time they get here.
      line: { en: instruction, es: instruction },
      showMeActive: false,
      // The spotlight is already lit on every step - a Show me button would
      // be a no-op, so the card shows only the speaker.
      canShowMe: false,
      primaryLabel: continueLabel,
    });
    return () => reportStep(null, id);
  }, [reportStep, id, stepIndex, steps.length, instruction, continueLabel]);

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
    // No step means nothing is spotlit; measure() clears the hole for us, and
    // the component renders null below either way.
    const sel = step ? targetSelector(step) : null;
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

  const dim = isLookBeat ? "rgba(28, 20, 16, 0.22)" : "rgba(28, 20, 16, 0.38)";

  const hole = rect
    ? {
        left: rect.left - 8,
        top: rect.top - 6,
        width: rect.width + 16,
        height: rect.height + 12,
      }
    : null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70]" aria-hidden>
      {hole ? (
        <>
          <div
            className="absolute rounded-xl"
            style={{ ...hole, boxShadow: `0 0 0 9999px ${dim}` }}
          />
          {/* A look beat is a steady ring - nothing to click, so nothing
              should be pulsing at them. A click beat pulses. */}
          {isLookBeat ? (
            <div
              className="absolute rounded-xl"
              style={{ ...hole, boxShadow: "0 0 0 3px rgba(196, 92, 38, 0.85)" }}
            />
          ) : (
            <div className="animate-showme-pulse absolute rounded-xl" style={hole} />
          )}
        </>
      ) : (
        <div className="absolute inset-0 bg-[#1c1410]/45" />
      )}
    </div>
  );
}

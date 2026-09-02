"use client";

import { useEffect, useRef, useState } from "react";
import { useWindowManager } from "@/lib/window-manager";
import { useJobCardOptional, useReporterId } from "@/lib/job-card-context";
import type { TourStep } from "@/lib/tasks/tour/content";

function targetSelector(step: TourStep) {
  if (step.targetTestId) return `[data-testid="${step.targetTestId}"]`;
  if (step.targetTabKey) return `[data-testid="bookmark-${step.targetTabKey}"]`;
  return null;
}

type Hole = { left: number; top: number; width: number; height: number };

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
  onHelp,
}: {
  steps: TourStep[];
  stepIndex: number;
  onAdvance: () => void;
  /** Opens Help on the Job Card — the only ? in the product. */
  onHelp?: () => void;
  /** Kept for call-site compatibility; the card carries the step's identity now. */
  tabColors?: Record<string, string>;
}) {
  const { browserTab } = useWindowManager();
  const card = useJobCardOptional();
  const id = useReporterId();
  const step = steps[stepIndex];
  const overlayRef = useRef<HTMLDivElement>(null);
  const [hole, setHole] = useState<Hole | null>(null);
  const isLookBeat = Boolean(step?.continueLabel);
  const isBookmark = Boolean(step?.targetTabKey) && !step?.targetTestId;

  const reportStep = card?.reportStep;
  const registerPrimary = card?.registerPrimary;
  const registerHelp = card?.registerHelp;
  const instruction = step?.instruction ?? "";
  const continueLabel = step?.continueLabel;
  const isCardHelp = step?.targetTestId === "job-card-help";

  // Handed over fresh every render; see RightNowBar for why this is a ref.
  useEffect(() => {
    registerPrimary?.(continueLabel ? onAdvance : null);
    registerHelp?.(onHelp ?? null);
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
      canHelp: Boolean(onHelp),
      pulseHelp: isCardHelp,
      primaryLabel: continueLabel,
    });
    return () => reportStep(null, id);
  }, [reportStep, id, stepIndex, steps.length, instruction, continueLabel, onHelp, isCardHelp]);

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
    // Look beats have nothing to click. Measuring them put a leftover ring
    // on the Mail wordmark after the tab switch — a stray oval. The card
    // already says the sentence; the highlight stays off.
    // The card's ? sits outside this window. Measuring it here would punch a
    // hole in the wrong place. The card pulses that button instead.
    const sel = step && !step.continueLabel && !isCardHelp ? targetSelector(step) : null;
    const measure = () => {
      const overlay = overlayRef.current;
      if (!sel || !overlay) {
        setHole(null);
        return;
      }
      const el = document.querySelector(sel);
      if (!el) {
        setHole(null);
        return;
      }
      // Overlay-local coords, not viewport. The browser window is `fixed` and
      // plays a transform on open; `position: fixed` inside it is trapped, so
      // a raw getBoundingClientRect() sits SHELF_INSET / window-top off the
      // real chip — tight on the icon, loose after the label.
      const r = el.getBoundingClientRect();
      const o = overlay.getBoundingClientRect();
      // Bookmarks are already padded chips. A small even cushion + a pill
      // reads as an oval around the icon and label. Other targets keep the
      // roomier Show-me hole.
      const pad = isBookmark ? 5 : 8;
      const padY = isBookmark ? 5 : 6;
      setHole({
        left: r.left - o.left - pad,
        top: r.top - o.top - padY,
        width: r.width + pad * 2,
        height: r.height + padY * 2,
      });
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
  }, [step, stepIndex, isBookmark, isCardHelp]);

  if (!step) return null;

  const dim = "rgba(28, 20, 16, 0.38)";
  const pulseClass = isBookmark ? "animate-showme-pulse-compact" : "animate-showme-pulse";
  const radius = isBookmark ? "rounded-full" : "rounded-xl";

  return (
    <div ref={overlayRef} className="pointer-events-none absolute inset-0 z-[70]" aria-hidden>
      {isLookBeat ? null : hole ? (
        <>
          <div
            className={`absolute ${radius}`}
            style={{ ...hole, boxShadow: `0 0 0 9999px ${dim}` }}
          />
          <div className={`${pulseClass} absolute ${radius}`} style={hole} />
        </>
      ) : (
        <div className="absolute inset-0 bg-[#1c1410]/45" />
      )}
    </div>
  );
}

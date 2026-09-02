"use client";

import { useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import type { Lang, Localized } from "@/lib/task-types";
import { useJobCardOptional, useReporterId } from "@/lib/job-card-context";

/**
 * No longer a bar. The Job Card is the only surface that tells a learner what
 * to do, so this reports the running task's current step to it and renders
 * nothing itself.
 *
 * The prop shape is unchanged on purpose: every task already computes its own
 * step index, step count, instruction, and Show-me toggle, and those are
 * exactly what the card needs. Tasks keep owning their own step state — the
 * card just speaks for them.
 */
export default function RightNowBar({
  stepIndex,
  stepCount,
  instruction,
  steps,
  onShowMe,
  showMeActive,
  onHelp,
  primaryLabel,
  onPrimary,
}: {
  /** Kept for call-site compatibility; the card shows a job badge instead. */
  icon?: LucideIcon;
  stepIndex: number;
  /**
   * The task's full step list. When given, `instruction` and `stepCount` are
   * read from it (`steps[stepIndex]`, `steps.length`) so the call site never
   * has to compute the same step ternary twice.
   */
  steps?: Localized<string>[];
  /** Explicit instruction, when a task doesn't pass `steps`. */
  instruction?: Localized<string>;
  /** Explicit step count, when a task doesn't pass `steps`. */
  stepCount?: number;
  lang?: Lang;
  rightNowLabel?: Localized<string>;
  onShowMe?: () => void;
  showMeActive?: boolean;
  showMeLabel?: Localized<string>;
  onHelp?: () => void;
  /** For a step with nothing to click in the app - the card supplies the button. */
  primaryLabel?: string;
  onPrimary?: () => void;
}) {
  const card = useJobCardOptional();
  const id = useReporterId();
  const line = instruction ?? steps?.[stepIndex] ?? { en: "", es: "" };
  const count = stepCount ?? steps?.length ?? 1;
  const en = line.en;
  const es = line.es;
  const canShowMe = Boolean(onShowMe);
  const lit = Boolean(showMeActive);

  const reportStep = card?.reportStep;
  const registerShowMe = card?.registerShowMe;
  const registerPrimary = card?.registerPrimary;
  const registerHelp = card?.registerHelp;
  const canHelp = Boolean(onHelp);

  // Handed over fresh every render without re-running the effect below, so a
  // task that rebuilds its handler each render doesn't thrash the card.
  useEffect(() => {
    registerShowMe?.(onShowMe ?? null);
    registerPrimary?.(onPrimary ?? null);
    registerHelp?.(onHelp ?? null);
  });

  useEffect(() => {
    if (!reportStep) return;
    reportStep({ id, stepIndex, stepCount: count, line: { en, es }, showMeActive: lit, canShowMe, canHelp, primaryLabel });
    return () => reportStep(null, id);
  }, [reportStep, id, stepIndex, count, en, es, lit, canShowMe, canHelp, primaryLabel]);

  return null;
}

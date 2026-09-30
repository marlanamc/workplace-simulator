"use client";

import { useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import type { Lang, Localized } from "@/lib/task-types";
import type { LessonFact } from "@/lib/lessons/types";
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
  taskKey,
  priority,
  stepIndex,
  stepCount,
  instruction,
  goal,
  steps,
  onShowMe,
  showMeActive,
  onHelp,
  primaryLabel,
  onPrimary,
  facts,
}: {
  /** Kept for call-site compatibility; the card shows a job badge instead. */
  icon?: LucideIcon;
  /** Curriculum task this report belongs to — see JobCardStep.taskKey. */
  taskKey?: import("@/lib/desktop-content").TaskKey;
  priority?: "save";
  stepIndex: number;
  /**
   * The task's full step list. When given, `instruction` and `stepCount` are
   * read from it (`steps[stepIndex]`, `steps.length`) so the call site never
   * has to compute the same step ternary twice.
   */
  steps?: Localized<string>[];
  /** Explicit instruction, when a task doesn't pass `steps`. */
  instruction?: Localized<string>;
  goal?: Localized<string>;
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
  /** Reference facts the Job Card keeps on screen while this step is live. */
  facts?: LessonFact[];
}) {
  const card = useJobCardOptional();
  const id = useReporterId();
  const line = instruction ?? steps?.[stepIndex] ?? { en: "", es: "" };
  const count = stepCount ?? steps?.length ?? 1;
  const en = line.en;
  const es = line.es;
  const goalEn = goal?.en;
  const goalEs = goal?.es;
  const canShowMe = Boolean(onShowMe);
  const lit = Boolean(showMeActive);

  const reportStep = card?.reportStep;
  const registerShowMe = card?.registerShowMe;
  const registerPrimary = card?.registerPrimary;
  const registerHelp = card?.registerHelp;
  const canHelp = Boolean(onHelp);
  // A stable primitive for the effect's deps: most call sites build `facts`
  // as a fresh array literal every render, which would otherwise re-fire the
  // effect (and re-report the step) on every render of the owning task.
  const factsKey = facts ? JSON.stringify(facts) : "";

  // Handed over fresh every render without re-running the effect below, so a
  // task that rebuilds its handler each render doesn't thrash the card.
  useEffect(() => {
    registerShowMe?.(onShowMe ?? null);
    registerPrimary?.(onPrimary ?? null);
    registerHelp?.(onHelp ?? null);
  });

  useEffect(() => {
    if (!reportStep) return;
    reportStep({
      id,
      taskKey,
      priority,
      stepIndex,
      stepCount: count,
      line: { en, es },
      goal: goalEn && goalEs ? { en: goalEn, es: goalEs } : undefined,
      showMeActive: lit,
      canShowMe,
      canHelp,
      primaryLabel,
      facts,
    });
    return () => reportStep(null, id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `facts` itself is a fresh array reference every render; `factsKey` stands in for it.
  }, [reportStep, id, taskKey, priority, stepIndex, count, en, es, goalEn, goalEs, lit, canShowMe, canHelp, primaryLabel, factsKey]);

  return null;
}

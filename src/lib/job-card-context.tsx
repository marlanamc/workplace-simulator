"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { INTRO_BEATS } from "@/lib/job-card-content";
import type { Localized } from "@/lib/task-types";

/**
 * The Job Card's state source.
 *
 * There is exactly one instruction voice in this product, and this is where
 * it comes from. Tasks do not render their own instruction UI any more: they
 * *report* the step they are on (`useJobCardStep`), report a correction when
 * the learner clicks something wrong (`correct`), and report the finish
 * (`useJobCardFinish`). The card itself decides what the learner reads,
 * and everything not currently on screen is silent.
 *
 * Deliberately NOT a parallel store: nothing here duplicates progress. Jobs,
 * completion, and level come from `useProgress()`; which surface is showing
 * comes from `useWindowManager()`. This holds only what neither of those
 * knows — the step inside a running task, a transient correction, and the
 * card's own corner.
 */

/** What a running task reports about the step the learner is on. */
export interface JobCardStep {
  /** Stable id of the reporter, so a mounted-but-hidden task can't win. */
  id: string;
  stepIndex: number;
  stepCount: number;
  line: Localized<string>;
  /** Whether the task's Show-me spotlight is currently lit. */
  showMeActive: boolean;
  /** Whether the task offers a Show me at all on this step. */
  canShowMe: boolean;
  /**
   * A step that advances from the card rather than from a click in the app -
   * the tour's "look at this" beats, where the only thing to do is read and
   * say Got it. The card renders it as its one primary button.
   */
  primaryLabel?: string;
}

/** What a finished task reports. The card supplies the button. */
export interface JobCardFinish {
  id: string;
  /** Short past-tense kicker, e.g. "Thank-you sent". The card falls back to
   *  its own localized word when a task doesn't supply one. */
  kicker?: string;
  /** Replay this same job. Offered quietly, never as a competing choice. */
  onTryAgain?: () => void;
}

interface JobCardValue {
  /** The most recently reported step, or null when no task is talking. */
  step: JobCardStep | null;
  reportStep: (step: JobCardStep | null, id?: string) => void;
  finish: JobCardFinish | null;
  reportFinish: (finish: JobCardFinish | null, id?: string) => void;
  /**
   * "" when there is nothing to correct. A correction belongs to the step it
   * was raised on, so it clears the moment the learner advances - answered by
   * doing the right thing, not only by waiting - and after 5s otherwise.
   */
  correction: string;
  correct: (message: string) => void;
  clearCorrection: () => void;
  /** Ask the running task to toggle its own Show-me spotlight. */
  toggleShowMe: () => void;
  /**
   * The running task hands over its spotlight toggle. Held in a ref rather
   * than state on purpose: tasks rebuild the handler every render, and the
   * card only ever needs the latest one at the moment it is pressed.
   */
  registerShowMe: (handler: (() => void) | null) => void;
  /** Press the running step's own primary button, if it declared one. */
  pressPrimary: () => void;
  /** The running task hands over that button's action. Ref, as above. */
  registerPrimary: (handler: (() => void) | null) => void;
  /** Index into `INTRO_BEATS`; past its length means the learner is through them. */
  introBeat: number;
  advanceIntro: () => void;
}

const JobCardContext = createContext<JobCardValue | null>(null);

/** How long a correction stays on the card before it clears itself. */
const CORRECTION_MS = 5000;

export function JobCardProvider({
  children,
  introSeen,
  onIntroDone,
}: {
  children: ReactNode;
  /** True once the learner has been through the first-run beats. */
  introSeen: boolean;
  onIntroDone: () => void;
}) {
  const [step, setStep] = useState<JobCardStep | null>(null);
  const [finish, setFinish] = useState<JobCardFinish | null>(null);
  const [raised, setRaised] = useState<{ message: string; onStep: string } | null>(null);
  const [introBeat, setIntroBeat] = useState(introSeen ? INTRO_BEATS.length : 0);
  const showMeHandler = useRef<(() => void) | null>(null);
  const primaryHandler = useRef<(() => void) | null>(null);
  const correctionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Identifies the moment the learner is standing in. A correction raised on
  // one moment is simply not shown on the next, so advancing clears it with
  // no extra bookkeeping and no state written from a render.
  const stepKey = finish ? "finish" : step ? `${step.id}:${step.line.en}` : "none";
  const stepKeyRef = useRef(stepKey);
  useEffect(() => {
    stepKeyRef.current = stepKey;
  }, [stepKey]);

  useEffect(() => () => {
    if (correctionTimer.current) clearTimeout(correctionTimer.current);
  }, []);

  const clearCorrection = useCallback(() => {
    if (correctionTimer.current) clearTimeout(correctionTimer.current);
    setRaised(null);
  }, []);

  const correct = useCallback((message: string) => {
    if (correctionTimer.current) clearTimeout(correctionTimer.current);
    setRaised({ message, onStep: stepKeyRef.current });
    correctionTimer.current = setTimeout(() => setRaised(null), CORRECTION_MS);
  }, []);

  const correction = raised && raised.onStep === stepKey ? raised.message : "";

  // Last reporter wins. Task windows stay mounted while minimized, so a
  // background task can still be reporting; a clear only lands when it comes
  // from whichever reporter is currently holding the card, so an unmounting
  // background task can never blank a live step.
  const clearBy = <T extends { id: string }>(id: string) => (prev: T | null) =>
    prev && prev.id !== id ? prev : null;

  const reportStep = useCallback((next: JobCardStep | null, id?: string) => {
    setStep(next ? () => next : clearBy<JobCardStep>(id ?? ""));
  }, []);

  const reportFinish = useCallback((next: JobCardFinish | null, id?: string) => {
    setFinish(next ? () => next : clearBy<JobCardFinish>(id ?? ""));
  }, []);

  const registerShowMe = useCallback((handler: (() => void) | null) => {
    showMeHandler.current = handler;
  }, []);

  const toggleShowMe = useCallback(() => {
    clearCorrection();
    showMeHandler.current?.();
  }, [clearCorrection]);

  const registerPrimary = useCallback((handler: (() => void) | null) => {
    primaryHandler.current = handler;
  }, []);

  const pressPrimary = useCallback(() => {
    clearCorrection();
    primaryHandler.current?.();
  }, [clearCorrection]);

  // Both statements run in the button's event handler, never inside the state
  // updater: `onIntroDone` persists a story flag on ProgressProvider, and an
  // updater has to stay pure.
  const advanceIntro = useCallback(() => {
    const next = introBeat + 1;
    setIntroBeat(next);
    if (next >= INTRO_BEATS.length) onIntroDone();
  }, [introBeat, onIntroDone]);

  const value = useMemo(
    () => ({
      step,
      reportStep,
      finish,
      reportFinish,
      correction,
      correct,
      clearCorrection,
      toggleShowMe,
      registerShowMe,
      pressPrimary,
      registerPrimary,
      introBeat,
      advanceIntro,
    }),
    [
      step,
      reportStep,
      finish,
      reportFinish,
      correction,
      correct,
      clearCorrection,
      toggleShowMe,
      registerShowMe,
      pressPrimary,
      registerPrimary,
      introBeat,
      advanceIntro,
    ],
  );

  return <JobCardContext.Provider value={value}>{children}</JobCardContext.Provider>;
}

export function useJobCard() {
  const ctx = useContext(JobCardContext);
  if (!ctx) throw new Error("useJobCard must be used within JobCardProvider");
  return ctx;
}

/**
 * Optional variant for components that may render outside a card (tests,
 * the studio preview). Returns null instead of throwing.
 */
export function useJobCardOptional() {
  return useContext(JobCardContext);
}

let reporterSeq = 0;
/** One stable id per mounted reporter, so "last one wins" is well defined. */
export function useReporterId() {
  const [id] = useState(() => `jc-${++reporterSeq}`);
  return id;
}

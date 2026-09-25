import type { LessonMode } from "./types";
import { LESSON_MODES } from "./types";

/**
 * What a lesson saves: how often the student finished it and with how much
 * help. Never the task's inner state; a lesson always starts fresh, the way
 * "Practice again" does. Stored in `practice_attempts` with the task key as
 * `activity_id`, apart from game credit.
 */
export type LessonAttempt = {
  version: 1;
  /** The support used most recently. */
  mode: LessonMode;
  /** Times finished. */
  attempts: number;
  /** ISO time of the latest finish. */
  completedAt?: string;
  /** Support used for each finish, oldest first (last 20). */
  modes: LessonMode[];
};

export const LESSON_ATTEMPT_VERSION = 1;
const MAX_HISTORY = 20;

const isMode = (v: unknown): v is LessonMode => LESSON_MODES.some((m) => m === v);

/** Accepts only a well-formed attempt; anything else is null. */
export function parseAttempt(value: unknown): LessonAttempt | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  if (v.version !== 1 || !isMode(v.mode)) return null;
  if (typeof v.attempts !== "number" || !Number.isInteger(v.attempts) || v.attempts < 0 || v.attempts > 10_000) return null;
  if (!Array.isArray(v.modes) || v.modes.length > MAX_HISTORY || !v.modes.every(isMode)) return null;
  if (v.completedAt !== undefined && (typeof v.completedAt !== "string" || Number.isNaN(Date.parse(v.completedAt)))) return null;
  return {
    version: 1,
    mode: v.mode,
    attempts: v.attempts,
    modes: v.modes as LessonMode[],
    ...(v.completedAt ? { completedAt: v.completedAt as string } : {}),
  };
}

/** One more finish, at `now`. */
export function recordFinish(prev: LessonAttempt | null, mode: LessonMode, now: string): LessonAttempt {
  return {
    version: 1,
    mode,
    attempts: (prev?.attempts ?? 0) + 1,
    completedAt: now,
    modes: [...(prev?.modes ?? []), mode].slice(-MAX_HISTORY),
  };
}

/** A guest's attempts carried into an account on sign-in: counts add, the latest finish wins. */
export function mergeAttempts(account: LessonAttempt | null, guest: LessonAttempt | null): LessonAttempt | null {
  if (!account || !guest) return account ?? guest;
  const latest = (account.completedAt ?? "") >= (guest.completedAt ?? "") ? account : guest;
  return {
    version: 1,
    mode: latest.mode,
    attempts: account.attempts + guest.attempts,
    ...(latest.completedAt ? { completedAt: latest.completedAt } : {}),
    modes: [...account.modes, ...guest.modes].slice(-MAX_HISTORY),
  };
}

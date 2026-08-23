"use server";

import { redirect } from "next/navigation";
import { clearSessionCookie, getSessionLearnerId } from "@/lib/auth";
import { awardBadge, recordCompletion, deleteCompletions, deleteBadges, replaceProgress } from "@/lib/db/queries";
import { LEVELS, TRACKS, taskKeysForLevel, taskKeysBeforeLevel, trackKeysBeforeLevel } from "@/lib/tracks-content";

export async function logout() {
  await clearSessionCookie();
  redirect("/login");
}

/** Records a task as done for the signed-in learner and awards a badge, if given. */
export async function completeTask(taskKey: string, badgeKey?: string) {
  const learnerId = await getSessionLearnerId();
  if (!learnerId) return { ok: false as const };
  await recordCompletion(learnerId, taskKey, null);
  if (badgeKey) await awardBadge(learnerId, badgeKey);
  return { ok: true as const };
}

/** Awards a track-completion trophy, stored as a badge keyed "track:<trackKey>". */
export async function awardCertificate(trackKey: string) {
  const learnerId = await getSessionLearnerId();
  if (!learnerId) return { ok: false as const };
  await awardBadge(learnerId, `track:${trackKey}`);
  return { ok: true as const };
}

/**
 * Studio-only time machine: sets the signed-in account's progress to exactly
 * the start of the given level ("all" = everything finished). One test
 * account can teleport to any moment in the game instead of replaying —
 * or making — a pile of accounts.
 */
export async function setProgressPreset(levelKey: string | "all") {
  const learnerId = await getSessionLearnerId();
  if (!learnerId) return { ok: false as const };

  if (levelKey !== "all" && !LEVELS.some((l) => l.key === levelKey)) {
    return { ok: false as const };
  }

  const taskKeys =
    levelKey === "all" ? LEVELS.flatMap(taskKeysForLevel) : taskKeysBeforeLevel(levelKey);
  const trackKeys =
    levelKey === "all" ? TRACKS.map((t) => t.key) : trackKeysBeforeLevel(levelKey);

  await replaceProgress(
    learnerId,
    taskKeys,
    trackKeys.map((k) => `track:${k}`),
  );
  return { ok: true as const };
}

/** Clears one level's task completions and track awards. Later levels stay. */
export async function restartLevelProgress(levelKey: string) {
  const learnerId = await getSessionLearnerId();
  if (!learnerId) return { ok: false as const };
  const level = LEVELS.find((l) => l.key === levelKey);
  if (!level) return { ok: false as const };
  await deleteCompletions(learnerId, taskKeysForLevel(level));
  await deleteBadges(
    learnerId,
    level.trackKeys.map((k) => `track:${k}`),
  );
  return { ok: true as const };
}

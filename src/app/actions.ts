"use server";

import { redirect } from "next/navigation";
import { clearSessionCookie, getSessionLearnerId } from "@/lib/auth";
import { awardBadge, recordCompletion, deleteCompletions, deleteBadges, getBadges, replaceProgress } from "@/lib/db/queries";
import { LEVELS, TRACKS, taskKeysForLevel, taskKeysBeforeLevel, trackKeysBeforeLevel } from "@/lib/tracks-content";
import {
  BRIDGE_PATH_BADGES,
  bridgePathBadge,
  bridgePathFromBadgeKeys,
  type BridgePath,
} from "@/lib/bridge-path";

function parsePresetKey(presetKey: string): { levelKey: string; path?: BridgePath } {
  const colon = presetKey.indexOf(":");
  if (colon === -1) return { levelKey: presetKey };
  const levelKey = presetKey.slice(0, colon);
  const suffix = presetKey.slice(colon + 1);
  if (suffix === "a" || suffix === "b") return { levelKey, path: suffix };
  return { levelKey };
}

export async function logout() {
  await clearSessionCookie();
  redirect("/login");
}

/** Records a task as done for the signed-in learner and awards a badge, if given. */
export async function completeTask(taskKey: string, badgeKey?: string) {
  const learnerId = await getSessionLearnerId();
  if (!learnerId) return { ok: false as const };
  await recordCompletion(learnerId, taskKey);
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
export async function setProgressPreset(presetKey: string | "all") {
  const learnerId = await getSessionLearnerId();
  if (!learnerId) return { ok: false as const };

  const { levelKey, path } = presetKey === "all" ? { levelKey: "all" as const, path: undefined } : parsePresetKey(presetKey);

  if (levelKey !== "all" && !LEVELS.some((l) => l.key === levelKey)) {
    return { ok: false as const };
  }

  const taskKeys =
    levelKey === "all" ? LEVELS.flatMap((l) => taskKeysForLevel(l)) : taskKeysBeforeLevel(levelKey, path);
  const trackKeys =
    levelKey === "all" ? TRACKS.map((t) => t.key) : trackKeysBeforeLevel(levelKey, path);

  const badgeKeys = [
    ...trackKeys.map((k) => `track:${k}`),
    ...(path ? [bridgePathBadge(path)] : []),
  ];
  await replaceProgress(learnerId, taskKeys, badgeKeys);
  return { ok: true as const };
}

/** Persist the Act V door so a refresh hydrates the same path. */
export async function persistBridgePath(path: BridgePath) {
  const learnerId = await getSessionLearnerId();
  if (!learnerId) return { ok: false as const };
  await deleteBadges(learnerId, [...BRIDGE_PATH_BADGES]);
  await awardBadge(learnerId, bridgePathBadge(path));
  return { ok: true as const };
}

/** Clears one level's task completions and track awards. Later levels stay. */
export async function restartLevelProgress(levelKey: string) {
  const learnerId = await getSessionLearnerId();
  if (!learnerId) return { ok: false as const };
  const level = LEVELS.find((l) => l.key === levelKey);
  if (!level) return { ok: false as const };
  const badges = await getBadges(learnerId);
  const path = bridgePathFromBadgeKeys(badges.map((b) => b.badgeKey));
  await deleteCompletions(learnerId, taskKeysForLevel(level, path));
  const tracks = path && level.pathTracks ? [level.pathTracks[path]] : level.trackKeys;
  await deleteBadges(
    learnerId,
    tracks.map((k) => `track:${k}`),
  );
  return { ok: true as const };
}

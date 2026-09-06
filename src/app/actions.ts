"use server";

import { redirect } from "next/navigation";
import { clearSessionCookie, getSessionLearnerId } from "@/lib/auth";
import {
  awardBadge,
  recordCompletion,
  deleteCompletions,
  deleteBadges,
  getBadges,
  getLearnerSubmissions,
  getLearnerById,
  getSubmissionOwner,
  markFeedbackSeen,
  recordSubmission,
  replaceProgress,
  replaceSettingBadge,
  setSubmissionNote,
  upsertSkillRung,
} from "@/lib/db/queries";
import { COURSE_ROUTES, COURSE_ROUTE_PREFIX, courseRouteFromBadges, isCourseRoute, routeForLevel, routeBridgePath, type CourseRoute } from "@/lib/course-route";
import type { SubmissionContent } from "@/lib/db/schema";
import { courseLevels, LEVELS, TRACKS, taskKeysForLevel } from "@/lib/tracks-content";
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

/** How sure the learner felt on a teacher-check task, tapped on the done screen. */
export type Confidence = "low" | "mid" | "high";

/** Records a task as done for the signed-in learner and awards a badge, if given. */
export async function completeTask(taskKey: string, badgeKey?: string, confidence?: Confidence) {
  const learnerId = await getSessionLearnerId();
  if (!learnerId) return { ok: false as const };
  await recordCompletion(learnerId, taskKey, confidence ?? null);
  if (badgeKey) await awardBadge(learnerId, badgeKey);
  return { ok: true as const };
}

/**
 * Persists one skill's release-ladder rung. The pure transition logic in
 * `src/lib/release-ladder.ts` runs client-side; this only stores the result so it
 * survives a device switch and the teacher dashboard can read it.
 */
export async function syncSkillRun(
  skillKey: string,
  state: { rung: number; cleanRunStreak: number; missStreak: number; lastPracticedAt: string },
) {
  const learnerId = await getSessionLearnerId();
  if (!learnerId) return { ok: false as const };
  await upsertSkillRung(learnerId, skillKey, state);
  return { ok: true as const };
}

/**
 * Saves what the learner wrote in a later-act task (the `TEACHER_CHECK_TASKS` set),
 * so the teacher can read it and suggest changes. Completion awaits persistence;
 * failed saves retain the writing for a learner-controlled retry.
 */
export async function recordWritingSubmission(taskKey: string, content: SubmissionContent) {
  const learnerId = await getSessionLearnerId();
  if (!learnerId) return { ok: false as const };
  await recordSubmission(learnerId, taskKey, content);
  return { ok: true as const };
}

/** Teacher-only: attach suggested changes to one submission from the teacher's own class. */
export async function saveSubmissionNote(submissionId: string, note: string) {
  const learnerId = await getSessionLearnerId();
  if (!learnerId) return { ok: false as const };
  const teacher = await getLearnerById(learnerId);
  if (!teacher || teacher.role !== "teacher") return { ok: false as const };
  const owner = await getSubmissionOwner(submissionId);
  if (!owner || owner.classCode !== teacher.classCode) return { ok: false as const };
  const trimmed = note.trim();
  if (!trimmed) return { ok: false as const };
  await setSubmissionNote(submissionId, trimmed);
  return { ok: true as const };
}

/** Learner marks a teacher note as read (opened it in the simulator). */
export async function markMyFeedbackSeen(submissionId: string) {
  const learnerId = await getSessionLearnerId();
  if (!learnerId) return { ok: false as const };
  await markFeedbackSeen(submissionId, learnerId);
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

  if (levelKey !== "all" && levelKey !== "core-complete" && !LEVELS.some((l) => l.key === levelKey)) {
    return { ok: false as const };
  }

  const route = routeForLevel(levelKey, path);
  const selectedPath = routeBridgePath(route);
  const routeLevels = courseLevels(route);
  const before = levelKey === "core-complete" ? courseLevels(null) : routeLevels.slice(0, routeLevels.findIndex((l) => l.key === levelKey));
  const taskKeys = levelKey === "all" ? LEVELS.flatMap((l) => taskKeysForLevel(l, null))
    : before.flatMap((l) => taskKeysForLevel(l, selectedPath));
  const trackKeys = levelKey === "all" ? TRACKS.map((t) => t.key)
    : before.flatMap((l) => selectedPath && l.pathTracks ? [l.pathTracks[selectedPath]] : l.trackKeys);
  const badgeKeys = [
    ...trackKeys.map((k) => `track:${k}`),
    ...(selectedPath ? [bridgePathBadge(selectedPath)] : []),
    ...(route ? [COURSE_ROUTE_PREFIX + route] : []),
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
  const badgeKeys = badges.map((b) => b.badgeKey);
  const route = courseRouteFromBadges(badgeKeys);
  const path = route ? routeBridgePath(route) : bridgePathFromBadgeKeys(badgeKeys);
  await deleteCompletions(learnerId, taskKeysForLevel(level, path));
  const tracks = path && level.pathTracks ? [level.pathTracks[path]] : level.trackKeys;
  await deleteBadges(
    learnerId,
    tracks.map((k) => `track:${k}`),
  );
  return { ok: true as const };
}

/** Session-owned route selection: no caller-supplied learner identity. */
export async function persistCourseRoute(route: CourseRoute) {
  const learnerId = await getSessionLearnerId();
  if (!learnerId || !isCourseRoute(route)) return { ok: false as const };
  await replaceSettingBadge(learnerId, COURSE_ROUTES.map((r) => COURSE_ROUTE_PREFIX + r), COURSE_ROUTE_PREFIX + route);
  return { ok: true as const };
}
export async function getMyWriting() {
  const learnerId = await getSessionLearnerId();
  if (!learnerId) throw new Error('Sign in to load your writing');
  const rows = await getLearnerSubmissions(learnerId);
  const latest: Record<string, SubmissionContent> = {};
  for (const row of rows) if (!latest[row.taskKey]) latest[row.taskKey] = row.content as SubmissionContent;
  return latest;
}

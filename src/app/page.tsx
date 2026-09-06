import { courseRouteFromBadges } from "@/lib/course-route";
import { redirect } from "next/navigation";
import { getSessionLearnerId } from "@/lib/auth";
import { getBadges, getCompletions, getLearnerById, getSkillRungs, getUnseenFeedback, getLearnerSubmissions } from "@/lib/db/queries";
import type { TaskKey } from "@/lib/desktop-content";
import type { SubmissionContent } from "@/lib/task-types";
import type { Rung, RungMap } from "@/lib/release-ladder";
import { isJumpTab } from "@/lib/curriculum-catalog";
import { bridgePathFromBadgeKeys } from "@/lib/bridge-path";
import { normalizeCertificateTrackKeys } from "@/lib/tracks-content";
import DesktopClient from "./DesktopClient";

const clampRung = (n: number): Rung => (Math.min(4, Math.max(1, Math.round(n))) as Rung);

/** Soft-fail a settled query so one reject cannot take down the desktop page. */
function settledOrEmpty<T>(result: PromiseSettledResult<T[]>, label: string): T[] {
  if (result.status === "fulfilled") return result.value;
  console.error(`${label} failed, falling back to []`, result.reason);
  return [];
}

export default async function DesktopPage({
  searchParams,
}: {
  searchParams: Promise<{ task?: string | string[]; from?: string | string[]; arrive?: string | string[] }>;
}) {
  const learnerId = await getSessionLearnerId();
  if (!learnerId) redirect("/login");

  const learner = await getLearnerById(learnerId);
  if (!learner) redirect("/login");

  // A teacher account has no learner progress and never plays the simulator —
  // send it straight to the class dashboard.
  if (learner.role === "teacher") redirect("/teacher");

  const params = await searchParams;
  const taskParam = Array.isArray(params.task) ? params.task[0] : params.task;
  const fromParam = Array.isArray(params.from) ? params.from[0] : params.from;
  const arriveParam = Array.isArray(params.arrive) ? params.arrive[0] : params.arrive;

  // Load independently so optional feedback/rungs may degrade gracefully.
  // Required progress and writing must never fall back to a fresh account.
  const [completionsR, badgesR, feedbackR, rungsR, writingR] = await Promise.allSettled([
    getCompletions(learnerId),
    getBadges(learnerId),
    getUnseenFeedback(learnerId),
    getSkillRungs(learnerId),
    getLearnerSubmissions(learnerId),
  ]);
  // Required state must not masquerade as a fresh account when a read fails.
  for (const result of [completionsR, badgesR, writingR]) {
    if (result.status === 'rejected') throw new Error('Unable to load saved progress. Please reload.');
  }
  const completions = settledOrEmpty(completionsR, "getCompletions");
  const badges = settledOrEmpty(badgesR, "getBadges");
  const unseenFeedback = settledOrEmpty(feedbackR, "getUnseenFeedback");
  const skillRungs = settledOrEmpty(rungsR, "getSkillRungs");

  const initialRungs: RungMap = Object.fromEntries(
    skillRungs.map((r) => [
      r.skillKey,
      {
        rung: clampRung(r.rung),
        cleanRunStreak: r.cleanRunStreak,
        missStreak: r.missStreak,
        lastPracticedAt: r.lastPracticedAt.toISOString(),
      },
    ]),
  );
  const completedTaskKeys = Array.from(new Set(completions.map((c) => c.taskKey))) as TaskKey[];
  const badgeKeys = badges.map((b) => b.badgeKey);
  const certificateTrackKeys = normalizeCertificateTrackKeys(
    badgeKeys.filter((k) => k.startsWith("track:")).map((k) => k.slice("track:".length)),
    completedTaskKeys,
  );

  const initialWriting: Record<string, SubmissionContent> = {};
  for (const row of settledOrEmpty(writingR, "getLearnerSubmissions")) {
    if (!initialWriting[row.taskKey]) initialWriting[row.taskKey] = row.content as SubmissionContent;
  }
  const initialFeedback = unseenFeedback
    .filter((f) => f.teacherNote)
    .map((f) => ({
      id: f.id,
      taskKey: f.taskKey,
      content: f.content as SubmissionContent,
      note: f.teacherNote as string,
    }));

  return (
    <DesktopClient
      learnerId={learnerId}
      displayName={learner.displayName}
      completedTaskKeys={completedTaskKeys}
      certificateTrackKeys={certificateTrackKeys}
      initialCourseRoute={courseRouteFromBadges(badgeKeys)}
      initialWriting={initialWriting}
      initialBridgePath={bridgePathFromBadgeKeys(badgeKeys)}
      initialFeedback={initialFeedback}
      initialRungs={initialRungs}
      jumpTab={isJumpTab(taskParam) ? taskParam : undefined}
      fromStudio={fromParam === "studio"}
      arriveLevelKey={fromParam === "studio" ? arriveParam : undefined}
    />
  );
}

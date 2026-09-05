import { redirect } from "next/navigation";
import { getSessionLearnerId } from "@/lib/auth";
import { getBadges, getCompletions, getLearnerById, getSkillRungs, getUnseenFeedback } from "@/lib/db/queries";
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
  searchParams: Promise<{ task?: string | string[]; from?: string | string[] }>;
}) {
  const learnerId = await getSessionLearnerId();
  if (!learnerId) redirect("/login");

  const learner = await getLearnerById(learnerId);
  if (!learner) redirect("/login");

  const params = await searchParams;
  const taskParam = Array.isArray(params.task) ? params.task[0] : params.task;
  const fromParam = Array.isArray(params.from) ? params.from[0] : params.from;

  // 2. Resilience: settle each load independently — feedback/rungs (or a flaky
  // completion read) must not 500 the whole desktop. Empty = "nothing yet."
  const [completionsR, badgesR, feedbackR, rungsR] = await Promise.allSettled([
    getCompletions(learnerId),
    getBadges(learnerId),
    getUnseenFeedback(learnerId),
    getSkillRungs(learnerId),
  ]);
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
      initialBridgePath={bridgePathFromBadgeKeys(badgeKeys)}
      initialFeedback={initialFeedback}
      initialRungs={initialRungs}
      jumpTab={isJumpTab(taskParam) ? taskParam : undefined}
      fromStudio={fromParam === "studio"}
    />
  );
}

import { redirect } from "next/navigation";
import { getSessionLearnerId } from "@/lib/auth";
import { getBadges, getCompletions, getLearnerById } from "@/lib/db/queries";
import type { TaskKey } from "@/lib/desktop-content";
import { isJumpTab } from "@/lib/curriculum-catalog";
import { normalizeCertificateTrackKeys } from "@/lib/tracks-content";
import DesktopClient from "./DesktopClient";

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

  const [completions, badges] = await Promise.all([getCompletions(learnerId), getBadges(learnerId)]);
  const completedTaskKeys = Array.from(new Set(completions.map((c) => c.taskKey))) as TaskKey[];
  const certificateTrackKeys = normalizeCertificateTrackKeys(
    badges
      .map((b) => b.badgeKey)
      .filter((k) => k.startsWith("track:"))
      .map((k) => k.slice("track:".length)),
    completedTaskKeys,
  );

  return (
    <DesktopClient
      learnerId={learnerId}
      displayName={learner.displayName}
      completedTaskKeys={completedTaskKeys}
      certificateTrackKeys={certificateTrackKeys}
      jumpTab={isJumpTab(taskParam) ? taskParam : undefined}
      fromStudio={fromParam === "studio"}
    />
  );
}

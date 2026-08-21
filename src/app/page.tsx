import { redirect } from "next/navigation";
import { getSessionLearnerId } from "@/lib/auth";
import { getBadges, getCompletions, getLearnerById } from "@/lib/db/queries";
import type { TaskKey } from "@/lib/desktop-content";
import DesktopClient from "./DesktopClient";

export default async function DesktopPage() {
  const learnerId = await getSessionLearnerId();
  if (!learnerId) redirect("/login");

  const learner = await getLearnerById(learnerId);
  if (!learner) redirect("/login");

  const [completions, badges] = await Promise.all([getCompletions(learnerId), getBadges(learnerId)]);
  const completedTaskKeys = Array.from(new Set(completions.map((c) => c.taskKey))) as TaskKey[];
  const certificateTrackKeys = badges
    .map((b) => b.badgeKey)
    .filter((k) => k.startsWith("track:"))
    .map((k) => k.slice("track:".length));

  return (
    <DesktopClient
      displayName={learner.displayName}
      completedTaskKeys={completedTaskKeys}
      certificateTrackKeys={certificateTrackKeys}
    />
  );
}

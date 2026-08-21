import { redirect } from "next/navigation";
import { getSessionLearnerId } from "@/lib/auth";
import { getCompletions, getLearnerById } from "@/lib/db/queries";
import type { TaskKey } from "@/lib/desktop-content";
import DesktopClient from "./DesktopClient";

export default async function DesktopPage() {
  const learnerId = await getSessionLearnerId();
  if (!learnerId) redirect("/login");

  const learner = await getLearnerById(learnerId);
  if (!learner) redirect("/login");

  const completions = await getCompletions(learnerId);
  const completedTaskKeys = Array.from(new Set(completions.map((c) => c.taskKey))) as TaskKey[];

  return <DesktopClient displayName={learner.displayName} completedTaskKeys={completedTaskKeys} />;
}

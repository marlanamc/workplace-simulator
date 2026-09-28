import { redirect } from "next/navigation";
import { getSessionLearnerId } from "@/lib/auth";
import { getCompletions, getLearnerById } from "@/lib/db/queries";
import type { TaskKey } from "@/lib/desktop-content";
import SummaryView from "./SummaryView";

/**
 * The learner's summary: what they can do now, to show a teacher, a job
 * center, or an employer. The Job Card offers it at every route end and at
 * "Stop here for now"; the Office route's Recap builds the same summary.
 * It replaced the retired certificate (`/certificate/*` lands here).
 *
 * Signed-in learners only. Lessons have no account and never link here.
 */
export default async function SummaryPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string | string[] }>;
}) {
  const learnerId = await getSessionLearnerId();
  if (!learnerId) redirect("/login");
  const learner = await getLearnerById(learnerId);
  if (!learner) redirect("/login");
  if (learner.role === "teacher") redirect("/teacher");

  const completions = await getCompletions(learnerId);
  const completedTaskKeys = Array.from(new Set(completions.map((c) => c.taskKey))) as TaskKey[];
  const params = await searchParams;
  const langParam = Array.isArray(params.lang) ? params.lang[0] : params.lang;

  return (
    <SummaryView
      displayName={learner.displayName}
      classCode={learner.classCode}
      completedTaskKeys={completedTaskKeys}
      // The moment the page was asked for. The view writes it as a date in
      // the learner's own time zone.
      nowIso={new Date().toISOString()}
      langParam={langParam === "es" || langParam === "en" ? langParam : null}
    />
  );
}

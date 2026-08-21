"use server";

import { redirect } from "next/navigation";
import { clearSessionCookie, getSessionLearnerId } from "@/lib/auth";
import { awardBadge, recordCompletion } from "@/lib/db/queries";

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

/** Awards a track-completion certificate, stored as a badge keyed "track:<trackKey>". */
export async function awardCertificate(trackKey: string) {
  const learnerId = await getSessionLearnerId();
  if (!learnerId) return { ok: false as const };
  await awardBadge(learnerId, `track:${trackKey}`);
  return { ok: true as const };
}

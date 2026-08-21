import { and, desc, eq } from "drizzle-orm";
import { getDb } from "./client";
import { badges, learners, taskCompletions } from "./schema";

export async function findLearner(displayName: string, classCode: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(learners)
    .where(and(eq(learners.displayName, displayName), eq(learners.classCode, classCode)));
  return rows[0] ?? null;
}

export async function getLearnerById(id: string) {
  const db = getDb();
  const rows = await db.select().from(learners).where(eq(learners.id, id));
  return rows[0] ?? null;
}

export async function createLearner(displayName: string, pinHash: string, classCode: string) {
  const db = getDb();
  const rows = await db
    .insert(learners)
    .values({ displayName, pinHash, classCode })
    .returning();
  return rows[0];
}

export async function recordCompletion(learnerId: string, taskKey: string, confidence: string | null) {
  const db = getDb();
  const rows = await db
    .insert(taskCompletions)
    .values({ learnerId, taskKey, confidence })
    .returning();
  return rows[0];
}

export async function awardBadge(learnerId: string, badgeKey: string) {
  const db = getDb();
  const existing = await db
    .select()
    .from(badges)
    .where(and(eq(badges.learnerId, learnerId), eq(badges.badgeKey, badgeKey)));
  if (existing[0]) return existing[0];
  const rows = await db.insert(badges).values({ learnerId, badgeKey }).returning();
  return rows[0];
}

export async function getCompletions(learnerId: string) {
  const db = getDb();
  return db
    .select()
    .from(taskCompletions)
    .where(eq(taskCompletions.learnerId, learnerId))
    .orderBy(desc(taskCompletions.completedAt));
}

export async function getBadges(learnerId: string) {
  const db = getDb();
  return db
    .select()
    .from(badges)
    .where(eq(badges.learnerId, learnerId))
    .orderBy(desc(badges.awardedAt));
}

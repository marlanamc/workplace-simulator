import { and, desc, eq, inArray, isNotNull, isNull } from "drizzle-orm";
import { getDb } from "./client";
import { badges, learners, skillRungs, submissions, taskCompletions, type SubmissionContent } from "./schema";

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

export async function recordCompletion(
  learnerId: string,
  taskKey: string,
  confidence: string | null = null,
) {
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

export async function deleteCompletions(learnerId: string, taskKeys: string[]) {
  if (taskKeys.length === 0) return;
  const db = getDb();
  await db
    .delete(taskCompletions)
    .where(and(eq(taskCompletions.learnerId, learnerId), inArray(taskCompletions.taskKey, taskKeys)));
}

/**
 * Wipes a learner's progress and installs an exact new state — completions
 * and badges become precisely the given lists. Studio-only (progress
 * presets); learner-facing flows only ever add or clear one level.
 */
export async function replaceProgress(learnerId: string, taskKeys: string[], badgeKeys: string[]) {
  const db = getDb();
  await db.delete(taskCompletions).where(eq(taskCompletions.learnerId, learnerId));
  await db.delete(badges).where(eq(badges.learnerId, learnerId));
  if (taskKeys.length) {
    await db.insert(taskCompletions).values(taskKeys.map((taskKey) => ({ learnerId, taskKey, confidence: null })));
  }
  if (badgeKeys.length) {
    await db.insert(badges).values(badgeKeys.map((badgeKey) => ({ learnerId, badgeKey })));
  }
}

export async function deleteBadges(learnerId: string, badgeKeys: string[]) {
  if (badgeKeys.length === 0) return;
  const db = getDb();
  await db.delete(badges).where(and(eq(badges.learnerId, learnerId), inArray(badges.badgeKey, badgeKeys)));
}

/* ---------- submissions: learner-authored text in later-act tasks ---------- */

export async function recordSubmission(
  learnerId: string,
  taskKey: string,
  content: SubmissionContent,
) {
  const db = getDb();
  const rows = await db
    .insert(submissions)
    .values({ learnerId, taskKey, content })
    .returning();
  return rows[0];
}

/** Every submission by learners in one class, newest first. Powers the teacher dashboard. */
export async function getClassSubmissions(classCode: string) {
  const db = getDb();
  return db
    .select({
      id: submissions.id,
      learnerId: submissions.learnerId,
      learnerName: learners.displayName,
      taskKey: submissions.taskKey,
      content: submissions.content,
      submittedAt: submissions.submittedAt,
      teacherNote: submissions.teacherNote,
      notedAt: submissions.notedAt,
      seenAt: submissions.seenAt,
    })
    .from(submissions)
    .innerJoin(learners, eq(learners.id, submissions.learnerId))
    .where(eq(learners.classCode, classCode))
    .orderBy(desc(submissions.submittedAt));
}

/** One learner's submissions, newest first — for the per-student progress page. */
export async function getLearnerSubmissions(learnerId: string) {
  const db = getDb();
  return db
    .select()
    .from(submissions)
    .where(eq(submissions.learnerId, learnerId))
    .orderBy(desc(submissions.submittedAt));
}

/** Every learner in a class, with their completions and badges, for the teacher roster. */
export async function getClassRoster(classCode: string) {
  const db = getDb();
  const people = await db
    .select()
    .from(learners)
    .where(eq(learners.classCode, classCode))
    .orderBy(learners.displayName);
  if (people.length === 0) return [];
  const ids = people.map((p) => p.id);
  const [completions, allBadges] = await Promise.all([
    db.select().from(taskCompletions).where(inArray(taskCompletions.learnerId, ids)),
    db.select().from(badges).where(inArray(badges.learnerId, ids)),
  ]);
  return people.map((p) => ({
    id: p.id,
    displayName: p.displayName,
    role: p.role,
    createdAt: p.createdAt,
    completions: completions.filter((c) => c.learnerId === p.id),
    badges: allBadges.filter((b) => b.learnerId === p.id),
  }));
}

export async function setSubmissionNote(id: string, note: string) {
  const db = getDb();
  await db
    .update(submissions)
    .set({ teacherNote: note, notedAt: new Date() })
    .where(eq(submissions.id, id));
}

/** The submission's learner id, so a server action can check it belongs to the teacher's class. */
export async function getSubmissionOwner(id: string) {
  const db = getDb();
  const rows = await db
    .select({ learnerId: submissions.learnerId, classCode: learners.classCode })
    .from(submissions)
    .innerJoin(learners, eq(learners.id, submissions.learnerId))
    .where(eq(submissions.id, id));
  return rows[0] ?? null;
}

/** Notes the learner hasn't opened yet — shown on next login. */
export async function getUnseenFeedback(learnerId: string) {
  const db = getDb();
  return db
    .select()
    .from(submissions)
    .where(
      and(
        eq(submissions.learnerId, learnerId),
        isNotNull(submissions.teacherNote),
        isNull(submissions.seenAt),
      ),
    )
    .orderBy(desc(submissions.notedAt));
}

export async function markFeedbackSeen(id: string, learnerId: string) {
  const db = getDb();
  await db
    .update(submissions)
    .set({ seenAt: new Date() })
    .where(and(eq(submissions.id, id), eq(submissions.learnerId, learnerId)));
}

/* ---------- skill rungs: per-skill mastery from the release ladder ---------- */

export type SkillRungRow = {
  skillKey: string;
  rung: number;
  cleanRunStreak: number;
  missStreak: number;
  lastPracticedAt: Date;
};

/**
 * Postgres "undefined_table" (42P01) — the `skill_rungs` migration hasn't been
 * pushed yet. Drizzle and the Neon driver wrap the original error, so check the
 * whole cause chain: the PG `code`, and the message text as a fallback (the
 * Neon HTTP driver doesn't always propagate `code`).
 */
function isMissingTable(err: unknown): boolean {
  let cur: unknown = err;
  for (let i = 0; i < 6 && cur && typeof cur === "object"; i++) {
    const e = cur as { code?: string; message?: string; cause?: unknown };
    if (e.code === "42P01") return true;
    if (typeof e.message === "string" && /relation .*skill_rungs.* does not exist|"skill_rungs" does not exist/i.test(e.message)) {
      return true;
    }
    cur = e.cause;
  }
  return false;
}

export async function getSkillRungs(learnerId: string): Promise<SkillRungRow[]> {
  const db = getDb();
  try {
    return await db
      .select({
        skillKey: skillRungs.skillKey,
        rung: skillRungs.rung,
        cleanRunStreak: skillRungs.cleanRunStreak,
        missStreak: skillRungs.missStreak,
        lastPracticedAt: skillRungs.lastPracticedAt,
      })
      .from(skillRungs)
      .where(eq(skillRungs.learnerId, learnerId));
  } catch (err) {
    // Skill rungs are a progressive enhancement over the localStorage cache —
    // a read failure here (missing table before `drizzle-kit push`, a
    // permissions gap) must never take down the desktop page. A real DB
    // outage still surfaces via getCompletions/getBadges on the same page.
    if (!isMissingTable(err)) console.error("getSkillRungs failed, falling back to []", err);
    return [];
  }
}

/** Every skill rung for a whole class, keyed by learner id, for the teacher dashboard. */
export async function getClassSkillRungs(classCode: string): Promise<Map<string, SkillRungRow[]>> {
  const db = getDb();
  let rows: Array<SkillRungRow & { learnerId: string }> = [];
  try {
    rows = await db
      .select({
        learnerId: skillRungs.learnerId,
        skillKey: skillRungs.skillKey,
        rung: skillRungs.rung,
        cleanRunStreak: skillRungs.cleanRunStreak,
        missStreak: skillRungs.missStreak,
        lastPracticedAt: skillRungs.lastPracticedAt,
      })
      .from(skillRungs)
      .innerJoin(learners, eq(learners.id, skillRungs.learnerId))
      .where(eq(learners.classCode, classCode));
  } catch (err) {
    if (!isMissingTable(err)) console.error("getClassSkillRungs failed, falling back to empty", err);
  }
  const byLearner = new Map<string, SkillRungRow[]>();
  for (const r of rows) {
    const list = byLearner.get(r.learnerId) ?? [];
    list.push(r);
    byLearner.set(r.learnerId, list);
  }
  return byLearner;
}

/** Persist one skill's rung state — the client computes it, this just stores it. */
export async function upsertSkillRung(
  learnerId: string,
  skillKey: string,
  state: { rung: number; cleanRunStreak: number; missStreak: number; lastPracticedAt: string },
) {
  const db = getDb();
  const lastPracticedAt = new Date(state.lastPracticedAt);
  try {
    await db
      .insert(skillRungs)
      .values({
        learnerId,
        skillKey,
        rung: state.rung,
        cleanRunStreak: state.cleanRunStreak,
        missStreak: state.missStreak,
        lastPracticedAt,
      })
      .onConflictDoUpdate({
        target: [skillRungs.learnerId, skillRungs.skillKey],
        set: {
          rung: state.rung,
          cleanRunStreak: state.cleanRunStreak,
          missStreak: state.missStreak,
          lastPracticedAt,
        },
      });
  } catch (err) {
    // Write-through only — the client keeps the authoritative localStorage copy,
    // so a failure here (missing table before `drizzle-kit push`) is non-fatal.
    if (!isMissingTable(err)) console.error("upsertSkillRung failed", err);
  }
}

/** Replace one setting atomically; a failed insert must retain the previous route. */
export async function replaceSettingBadge(learnerId: string, keys: string[], value: string) {
  const db = getDb();
  await db.batch([
    db.select({ id: learners.id }).from(learners).where(eq(learners.id, learnerId)).for('update'),
    db.delete(badges).where(and(eq(badges.learnerId, learnerId), inArray(badges.badgeKey, keys))),
    db.insert(badges).values({ learnerId, badgeKey: value }),
  ]);
}

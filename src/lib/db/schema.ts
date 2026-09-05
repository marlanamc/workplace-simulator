import { index, integer, jsonb, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

export const learners = pgTable("learners", {
  id: uuid("id").primaryKey().defaultRandom(),
  displayName: text("display_name").notNull(),
  pinHash: text("pin_hash").notNull(),
  classCode: text("class_code").notNull(),
  /** "learner" (default) or "teacher". A teacher sees the review dashboard for their class_code. */
  role: text("role").notNull().default("learner"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const taskCompletions = pgTable("task_completions", {
  id: uuid("id").primaryKey().defaultRandom(),
  learnerId: uuid("learner_id").notNull().references(() => learners.id, { onDelete: "cascade" }),
  taskKey: text("task_key").notNull(),
  confidence: text("confidence"),
  completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Per-skill mastery from the release ladder (`src/lib/release-ladder.ts`). One row
 * per (learner, skill). The transition logic stays client-side and pure; this table
 * just persists the computed state so it survives a device switch and the teacher
 * dashboard can read it. `localStorage` remains an offline cache; on load the
 * server value wins.
 */
export const skillRungs = pgTable(
  "skill_rungs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    learnerId: uuid("learner_id").notNull().references(() => learners.id, { onDelete: "cascade" }),
    /** The task descriptor's `skill` string — the same key `useSkillGuidance` uses. */
    skillKey: text("skill_key").notNull(),
    /** 1–4. Higher = less scaffolding; 3+ counts as "mastered" for the readiness record. */
    rung: integer("rung").notNull().default(1),
    cleanRunStreak: integer("clean_run_streak").notNull().default(0),
    missStreak: integer("miss_streak").notNull().default(0),
    lastPracticedAt: timestamp("last_practiced_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique("skill_rungs_learner_skill_uq").on(t.learnerId, t.skillKey)],
);

export const badges = pgTable("badges", {
  id: uuid("id").primaryKey().defaultRandom(),
  learnerId: uuid("learner_id").notNull().references(() => learners.id, { onDelete: "cascade" }),
  badgeKey: text("badge_key").notNull(),
  awardedAt: timestamp("awarded_at", { withTimezone: true }).notNull().defaultNow(),
});

/** What a learner actually wrote in a later-act task. One row per submit (history kept
 *  so a revision after a teacher note is visible next to the original). */
export const submissions = pgTable(
  "submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    learnerId: uuid("learner_id").notNull().references(() => learners.id, { onDelete: "cascade" }),
    taskKey: text("task_key").notNull(),
    /** { lang: "en" | "es", fields: [{ label, value }] } */
    content: jsonb("content").notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
    /** The teacher's suggested changes, plain text, in whatever language they wrote it. */
    teacherNote: text("teacher_note"),
    notedAt: timestamp("noted_at", { withTimezone: true }),
    /** When the learner opened the note in the simulator. */
    seenAt: timestamp("seen_at", { withTimezone: true }),
  },
  (t) => [
    index("submissions_learner_task_idx").on(t.learnerId, t.taskKey),
    index("submissions_task_idx").on(t.taskKey),
  ],
);

export type Learner = typeof learners.$inferSelect;
export type TaskCompletion = typeof taskCompletions.$inferSelect;
export type SkillRung = typeof skillRungs.$inferSelect;
export type Badge = typeof badges.$inferSelect;
export type Submission = typeof submissions.$inferSelect;
export type { SubmissionContent, SubmissionField } from "../task-types";

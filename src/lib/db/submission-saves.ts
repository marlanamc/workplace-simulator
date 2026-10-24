import type { getDb } from './client';
import { submissions, type SubmissionContent } from './schema';

/** Conflict handling preserves the original content, timestamp and teacher feedback. */
export function submissionInsert(
  db: Pick<ReturnType<typeof getDb>, 'insert'>,
  learnerId: string,
  taskKey: string,
  content: SubmissionContent,
  attemptId: string,
) {
  return db.insert(submissions).values({ learnerId, taskKey, content, attemptId })
    .onConflictDoNothing({ target: [submissions.learnerId, submissions.taskKey, submissions.attemptId] })
    .returning();
}

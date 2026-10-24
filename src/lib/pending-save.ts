import type { Confidence } from '@/app/actions';
import type { TaskKey } from './desktop-content';
import type { SubmissionContent } from './task-types';

export type PendingSave = {
  taskKey: TaskKey;
  badgeKey?: string;
  submission?: SubmissionContent;
  confidence?: Confidence;
  submissionAttemptId?: string;
};
export const isSubmissionAttemptId = (value: unknown): value is string =>
  typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

/** Retry only the still-pending attempt. A completed attempt is never deduplicated by its text. */
export function preparePendingSave(queue: PendingSave[], next: PendingSave): PendingSave {
  if (!next.submission) return next;
  const previous = queue.find(item => item.taskKey === next.taskKey);
  const reuse = previous && isSubmissionAttemptId(previous.submissionAttemptId)
    && JSON.stringify(previous.submission) === JSON.stringify(next.submission);
  return { ...next, submissionAttemptId: reuse ? previous.submissionAttemptId : crypto.randomUUID() };
}

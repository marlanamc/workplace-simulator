import { mergeAttempts, parseAttempt, type LessonAttempt } from './attempts';

/** A retry snapshot also remembers which guest transfer it already includes. */
export type PendingLessonSave = { attempt: LessonAttempt; transferToken?: string };

export function parsePendingLessonSave(value: unknown): PendingLessonSave | null {
  if (!value || typeof value !== 'object') return null;
  const v = value as Record<string, unknown>;
  const attempt = parseAttempt(v.attempt ?? value); // Existing device buffers were bare attempts.
  if (!attempt) return null;
  return { attempt, ...(typeof v.transferToken === 'string' ? { transferToken: v.transferToken } : {}) };
}

export function prepareLessonSave(server: LessonAttempt | null, buffered: PendingLessonSave | null, carried: LessonAttempt | null): PendingLessonSave | null {
  const transferToken = carried ? JSON.stringify(carried) : undefined;
  if (buffered && (!carried || buffered.transferToken === transferToken)) return buffered;
  const attempt = mergeAttempts(buffered?.attempt ?? server, carried);
  return attempt ? { attempt, ...(transferToken ? { transferToken } : {}) } : null;
}

/** Serialize PUTs and never let an old acknowledgement erase a newer retry copy. */
export function createLessonSaveQueue(io: {
  write: (owner: string, value: PendingLessonSave) => void;
  send: (owner: string, value: LessonAttempt) => Promise<void>;
  clear: (owner: string, value: PendingLessonSave) => void;
  status: (status: 'saving' | 'saved' | 'error') => void;
}) {
  let tail: Promise<unknown> = Promise.resolve();
  let revision = 0;
  return (owner: string, value: PendingLessonSave): Promise<boolean> => {
    const mine = ++revision;
    io.write(owner, value);
    io.status('saving');
    const operation = tail.then(async () => {
      try {
        await io.send(owner, value.attempt);
        if (mine === revision) {
          io.clear(owner, value);
          io.status('saved');
        }
        return true;
      } catch {
        if (mine === revision) io.status('error');
        return false;
      }
    });
    tail = operation;
    return operation;
  };
}

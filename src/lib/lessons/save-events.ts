import { parseAttempt, type LessonAttempt } from './attempts';

/** Stable across retries; a guest transfer can contribute several finishes. */
export type LessonSaveEvent = { id: string; attempt: LessonAttempt };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function parseSaveEvents(value: unknown): LessonSaveEvent[] | null {
  if (!Array.isArray(value) || value.length > 10_000) return null;
  const events: LessonSaveEvent[] = [];
  const ids = new Set<string>();
  for (const entry of value) {
    if (!entry || typeof entry.id !== 'string' || !UUID.test(entry.id) || ids.has(entry.id)) return null;
    const attempt = parseAttempt(entry.attempt);
    if (!attempt || attempt.attempts < 1) return null;
    ids.add(entry.id);
    events.push({ id: entry.id, attempt });
  }
  return events;
}

/** Upgrade old snapshot buffers conservatively: only their unsaved excess is new. */
export function legacySaveEvents(server: LessonAttempt | null, pending: LessonAttempt): LessonSaveEvent[] {
  const count = Math.max(0, pending.attempts - (server?.attempts ?? 0));
  return count ? [{ id: crypto.randomUUID(), attempt: { ...pending, attempts: count, modes: pending.modes.slice(-count) } }] : [];
}

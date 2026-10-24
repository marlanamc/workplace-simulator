import { describe, expect, it } from 'vitest';
import { legacySaveEvents, parseSaveEvents } from '../lessons/save-events';
import { recordFinish } from '../lessons/attempts';
import { parsePendingLessonSave } from '../lessons/save-queue';
const one = recordFinish(null, 'guided', '2026-10-24T10:00:00Z');
const id = '00000000-0000-4000-8000-000000000001';
describe('lesson event protocol', () => {
  it('keeps event identities across durable snapshot round trips', () => {
    const pending = { attempt: one, events: [{ id, attempt: one }] };
    expect(parsePendingLessonSave(JSON.parse(JSON.stringify(pending)))).toEqual(pending);
  });
  it('rejects invalid IDs, duplicates, zero counts and malformed event payloads', () => {
    for (const events of [null, [{}], [{ id: 'bad', attempt: one }], [{ id, attempt: { ...one, attempts: 0 } }], [{ id, attempt: one }, { id, attempt: one }]]) expect(parseSaveEvents(events)).toBeNull();
  });
  it('only migrates excess legacy counts, never replaces newer server progress', () => {
    expect(legacySaveEvents(one, one)).toEqual([]);
    expect(legacySaveEvents({ ...one, attempts: 5 }, one)).toEqual([]);
    expect(legacySaveEvents(one, { ...one, attempts: 3 })[0].attempt.attempts).toBe(2);
  });
});

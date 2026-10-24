import { describe, expect, it, vi } from 'vitest';
import { createLessonSaveQueue, parsePendingLessonSave, prepareLessonSave } from '../lessons/save-queue';
import { recordFinish } from '../lessons/attempts';

const one = recordFinish(null, 'guided', '2026-10-24T10:00:00Z');
const two = recordFinish(one, 'independent', '2026-10-24T11:00:00Z');

describe('lesson retry snapshots', () => {
  it('does not add the same guest transfer again after a failed save or lost acknowledgement', () => {
    const pending = prepareLessonSave(two, null, one)!;
    expect(pending.attempt.attempts).toBe(3);
    expect(prepareLessonSave(two, pending, one)).toEqual(pending);
    expect(prepareLessonSave(pending.attempt, pending, one)).toEqual(pending);
  });
  it('still adds a new guest transfer to an older account buffer', () => {
    const pending = prepareLessonSave(two, { attempt: two }, one)!;
    expect(pending.attempt.attempts).toBe(3);
    expect(parsePendingLessonSave(pending)).toEqual(pending);
    expect(parsePendingLessonSave(two)).toEqual({ attempt: two });
    expect(parsePendingLessonSave({ attempt: { version: 9 } })).toBeNull();
  });
  it('serializes saves and keeps the latest retry snapshot when the second fails', async () => {
    let release!: () => void;
    const first = new Promise<void>(resolve => { release = resolve; });
    const io = { write: vi.fn(), send: vi.fn().mockReturnValueOnce(first).mockRejectedValueOnce(new Error('offline')), clear: vi.fn(), status: vi.fn() };
    const push = createLessonSaveQueue(io);
    const a = push('owner', { attempt: one });
    const b = push('owner', { attempt: two });
    await Promise.resolve();
    expect(io.send).toHaveBeenCalledTimes(1);
    expect(io.write).toHaveBeenLastCalledWith('owner', { attempt: two });
    release();
    expect(await a).toBe(true);
    expect(await b).toBe(false);
    expect(io.clear).not.toHaveBeenCalled();
    expect(io.status).toHaveBeenLastCalledWith('error');
    io.send.mockResolvedValueOnce(undefined);
    expect(await push('owner', { attempt: two })).toBe(true);
    expect(io.clear).toHaveBeenCalledExactlyOnceWith('owner', { attempt: two });
    expect(io.status).toHaveBeenLastCalledWith('saved');
  });
});

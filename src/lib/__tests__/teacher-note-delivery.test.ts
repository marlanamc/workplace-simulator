import { beforeEach, expect, it, vi } from 'vitest';
const m = vi.hoisted(() => ({ update: vi.fn(), set: vi.fn(), where: vi.fn() }));
vi.mock('@/lib/db/client', () => ({ getDb: () => ({ update: m.update }) }));
import { setSubmissionNote } from '../db/queries';

beforeEach(() => {
  vi.resetAllMocks();
  m.update.mockReturnValue({ set: m.set });
  m.set.mockReturnValue({ where: m.where });
  m.where.mockResolvedValue(undefined);
});
it('makes a revised note unread even when the learner read the previous version', async () => {
  const row = { teacherNote: 'Old feedback', seenAt: new Date('2026-10-01'), notedAt: new Date('2026-09-30') };
  m.set.mockImplementation(patch => { Object.assign(row, patch); return { where: m.where }; });
  await setSubmissionNote('submission-id', 'Please add the final deadline.');
  expect(row.teacherNote).toBe('Please add the final deadline.');
  expect(row.seenAt).toBeNull();
  expect(row.notedAt.getTime()).toBeGreaterThan(new Date('2026-09-30').getTime());
});
it('propagates database failures so the form can offer retry', async () => {
  m.where.mockRejectedValue(new Error('offline'));
  await expect(setSubmissionNote('submission-id', 'Keep this draft')).rejects.toThrow('offline');
});

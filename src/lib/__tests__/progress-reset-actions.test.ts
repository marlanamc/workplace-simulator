import { beforeEach, expect, it, vi } from 'vitest';
const m = vi.hoisted(() => ({ session: vi.fn(), badges: vi.fn(), reset: vi.fn() }));
vi.mock('@/lib/auth', () => ({ getSessionLearnerId: m.session }));
vi.mock('@/lib/db/queries', () => ({ getBadges: m.badges, resetLevelProgress: m.reset }));
import { restartLevelProgress } from '@/app/actions';
beforeEach(() => { vi.resetAllMocks(); m.session.mockResolvedValue('owner'); m.badges.mockResolvedValue([]); });
it('routes level replay through one session-owned atomic reset', async () => {
  expect(await restartLevelProgress('level1')).toEqual({ ok: true });
  expect(m.reset).toHaveBeenCalledOnce();
  expect(m.reset.mock.calls[0][0]).toBe('owner');
  expect(m.reset.mock.calls[0][1]).toContain('mail-reply');
  expect(m.reset.mock.calls[0][2].length).toBeGreaterThan(0);
});
it('does not reset invalid levels or signed-out callers', async () => {
  expect(await restartLevelProgress('bogus')).toEqual({ ok: false });
  m.session.mockResolvedValue(null);
  expect(await restartLevelProgress('level1')).toEqual({ ok: false });
  expect(m.reset).not.toHaveBeenCalled();
});
it('does not report success if the transaction fails', async () => {
  m.reset.mockRejectedValue(new Error('rollback'));
  await expect(restartLevelProgress('level1')).rejects.toThrow('rollback');
});

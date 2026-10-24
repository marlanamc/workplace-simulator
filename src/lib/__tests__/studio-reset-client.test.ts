import { afterEach, describe, expect, it, vi } from 'vitest';
const action = vi.hoisted(() => vi.fn());
vi.mock('@/app/actions', () => ({ setProgressPreset: action }));
import { jumpToPreset } from '@/app/studio/jump-to-preset';
import { storage } from '../storage';
afterEach(() => vi.unstubAllGlobals());
function setup() {
  const values = new Map<string, string>();
  const localStorage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value), removeItem: (key: string) => values.delete(key), key: (i: number) => [...values.keys()][i], get length() { return values.size; } };
  const assign = vi.fn();
  vi.stubGlobal('window', { localStorage, location: { assign } });
  storage.setJSON('workplace:pending-saves:owner', [{ taskKey: 'enrollment', submission: { lang: 'en', fields: [] } }]);
  storage.setJSON('workplace:pending-saves:other', [{ taskKey: 'tour' }]);
  return { assign };
}
describe('Studio pending-save reset', () => {
  it('cannot replay the old writing/completion queue after a successful Fresh jump', async () => {
    const { assign } = setup();
    action.mockResolvedValue({ ok: true });
    expect(await jumpToPreset('owner', 'level1')).toBe(true);
    expect(storage.getJSON('workplace:pending-saves:owner', [])).toEqual([]);
    expect(storage.getJSON('workplace:pending-saves:other', [])).toEqual([{ taskKey: 'tour' }]);
    expect(assign).toHaveBeenCalledOnce();
  });
  it('retains retryable work when the server rejects the reset', async () => {
    const { assign } = setup();
    action.mockResolvedValue({ ok: false });
    expect(await jumpToPreset('owner', 'level1')).toBe(false);
    expect(storage.getJSON<unknown[]>('workplace:pending-saves:owner', [])).toHaveLength(1);
    expect(assign).not.toHaveBeenCalled();
  });
});

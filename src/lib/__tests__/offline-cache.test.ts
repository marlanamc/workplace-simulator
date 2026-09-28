import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it, vi } from 'vitest';

function worker() {
  const handlers: Record<string, (event: unknown) => void> = {};
  const addAll = vi.fn().mockResolvedValue(undefined);
  const match = vi.fn().mockResolvedValue(new Response('Offline'));
  const remove = vi.fn().mockResolvedValue(true);
  const fetch = vi.fn().mockRejectedValue(new Error('Offline'));
  runInNewContext(readFileSync('public/sw.js', 'utf8'), {
    self: { location: { origin: 'https://practice.example' }, skipWaiting() {}, clients: { claim() {} }, addEventListener: (key: string, fn: (event: unknown) => void) => { handlers[key] = fn; } },
    caches: { open: async () => ({ addAll }), keys: async () => ['workplace-sim-v1', 'workplace-sim-v2', 'other-app'], delete: remove, match },
    fetch, URL,
  });
  return { handlers, addAll, match, remove, fetch };
}

describe('safe offline fallback', () => {
  it('precaches only the public offline page and removes only old app caches', async () => {
    const w = worker();
    let pending: Promise<unknown>;
    const event = { waitUntil: (p: Promise<unknown>) => { pending = p; } };
    w.handlers.install(event);
    await pending!;
    expect(w.addAll).toHaveBeenCalledWith(['/offline.html']);
    w.handlers.activate(event);
    await pending!;
    expect(w.remove.mock.calls).toEqual([['workplace-sim-v1']]);
  });
  it('never serves a cached authenticated page on an offline navigation', async () => {
    const w = worker();
    const respondWith = vi.fn();
    w.handlers.fetch({ request: { method: 'GET', url: 'https://practice.example/summary', mode: 'navigate' }, respondWith });
    await respondWith.mock.calls[0][0];
    expect(w.match).toHaveBeenCalledWith('/offline.html');
  });
  it('leaves JavaScript, actions, and lesson data to the network', () => {
    const w = worker();
    for (const [method, path] of [['GET', '/_next/static/chunks/app/page.js'], ['POST', '/'], ['GET', '/lessons/mail-reply?_rsc=1']]) {
      const respondWith = vi.fn();
      w.handlers.fetch({ request: { method, url: `https://practice.example${path}`, mode: 'cors' }, respondWith });
      expect(respondWith).not.toHaveBeenCalled();
    }
  });
});

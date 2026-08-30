/**
 * One wrapper around `localStorage` so the try/catch (private browsing throws
 * on access) and the JSON parse guard live in a single place instead of being
 * re-implemented at every call site.
 *
 * Everything degrades to "no value stored": a read returns the fallback, a
 * write is silently dropped. That is the right behavior for every current
 * caller — language choice, help-ladder rungs, story flags — none of which
 * are load-bearing enough to warrant surfacing a storage error to a learner.
 */

function area(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export const storage = {
  getString(key: string): string | null {
    try {
      return area()?.getItem(key) ?? null;
    } catch {
      return null;
    }
  },

  setString(key: string, value: string): void {
    try {
      area()?.setItem(key, value);
    } catch {
      /* private browsing — the value still lives in memory this session */
    }
  },

  getJSON<T>(key: string, fallback: T): T {
    try {
      const raw = area()?.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw) as unknown;
      if (!parsed || typeof parsed !== "object") return fallback;
      return parsed as T;
    } catch {
      return fallback;
    }
  },

  setJSON(key: string, value: unknown): void {
    try {
      area()?.setItem(key, JSON.stringify(value));
    } catch {
      /* private browsing — the value still lives in memory this session */
    }
  },

  remove(key: string): void {
    try {
      area()?.removeItem(key);
    } catch {
      /* nothing stored, nothing to clear */
    }
  },
};

/**
 * Device-level settings — a shared classroom Chromebook set to Spanish or
 * bigger text should stay that way for the next person.
 */
export const DEVICE_KEY = {
  lang: "ws-lang",
  bigText: "ws-big-text",
  loginRecents: "ws-login-recents",
} as const;

/** Per-learner keys — namespaced by learner id so accounts don't cross over. */
export const learnerKey = {
  storyFlags: (learnerId: string) => `ws-story-flags:${learnerId}`,
  rungs: (learnerId: string) => `ws-rungs:${learnerId}`,
} as const;

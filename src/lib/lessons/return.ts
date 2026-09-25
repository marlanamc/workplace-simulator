import { libraryReturn } from "./library";
import { lessonByKey } from "./catalog";

const ORIGIN = "https://return.invalid";

/** Query params a lesson link may carry back through sign-in, and their allowed values. */
const LESSON_PARAMS: Record<string, string[]> = {
  mode: ["guided", "independent"],
  lang: ["en", "es"],
  transfer: ["1"],
  skill: [],
};

/**
 * Where sign-in may send someone next. Only our own pages: the game, the
 * teacher dashboard, the Studio, the lesson library, or one lesson, with
 * whitelisted params. Anything else (another site, a made-up lesson) is "/".
 */
export function safeReturn(raw: string | null | undefined): string {
  if (!raw) return "/";
  if (raw === "/" || raw === "/teacher" || raw === "/studio") return raw;
  try {
    const u = new URL(raw, ORIGIN);
    if (u.origin !== ORIGIN) return "/";
    const isLibrary = u.pathname === "/lessons";
    const key = u.pathname.match(/^\/lessons\/([a-z0-9-]+)$/)?.[1];
    if (!isLibrary && !(key && lessonByKey(key))) return "/";
    if (isLibrary) return libraryReturn(raw);
    const q = new URLSearchParams();
    for (const [name, choices] of Object.entries(LESSON_PARAMS)) {
      const v = u.searchParams.get(name);
      if (!v) continue;
      if (name === "skill" ? isLibrary && /^[a-z-]{1,40}$/.test(v) : choices.includes(v)) q.set(name, v);
    }
    const returnTo = u.searchParams.get("returnTo");
    if (returnTo) q.set("returnTo", libraryReturn(returnTo));
    return u.pathname + (q.size ? `?${q}` : "");
  } catch {
    return "/";
  }
}

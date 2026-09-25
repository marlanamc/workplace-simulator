import { workshop } from "./content";
import { assignment } from "./assignment";
import type { ActivityMeta } from "./types";
/** Library order. Adding an activity here also opens its login return path and API key. */
export const ACTIVITIES: readonly ActivityMeta[] = [workshop, assignment];
export function activityById(id: string | null | undefined) {
  return ACTIVITIES.find((a) => a.id === id) ?? null;
}
export function practiceReturn(raw: string): string {
  if (raw === "/teacher" || raw === "/studio") return raw;
  try {
    const u = new URL(raw, "https://practice.invalid");
    const id = u.pathname.match(/^\/practice\/([a-z-]+)$/)?.[1];
    if (u.origin !== "https://practice.invalid" || !activityById(id))
      return "/";
    const q = new URLSearchParams();
    for (const [key, choices] of Object.entries({
      mode: ["guided", "independent"],
      lang: ["en", "es"],
      transfer: ["1"],
    })) {
      const v = u.searchParams.get(key);
      if (v && choices.includes(v)) q.set(key, v);
    }
    return u.pathname + (q.size ? "?" + q : "");
  } catch {
    return "/";
  }
}

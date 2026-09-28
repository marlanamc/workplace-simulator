/**
 * Which bookmark to flash when the Job Card's "Open X from the bookmarks" is
 * pressed while the Browser is already in front.
 *
 * From Day 9 the card does not open the task's tab for the learner: finding
 * the bookmark is the exercise. The first press brings the Browser forward on
 * a New Tab. A second press used to do nothing visible, so a learner who had
 * not spotted the bookmark was left pressing a dead button. Now the Browser
 * flashes the bookmark the card names. It shows where, without opening it.
 *
 * `candidates` are the tab keys that could host the task, best first (the
 * task's own location tab, its catalog tab, the task key itself). The first
 * one on the bookmarks bar wins. Nothing flashes when that tab is already the
 * one in front, since then there is nothing left to find.
 */
export function bookmarkToPulse(
  candidates: readonly (string | null | undefined)[],
  visibleBookmarks: ReadonlySet<string>,
  activeTab: string | null | undefined,
): string | null {
  const hit = candidates.find((k): k is string => Boolean(k) && visibleBookmarks.has(k as string));
  if (!hit || hit === activeTab) return null;
  return hit;
}

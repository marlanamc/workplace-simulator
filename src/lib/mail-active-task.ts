import type { TaskKey } from "@/lib/desktop-content";
import type { CourseRoute } from "@/lib/course-route";
import { routeBridgePath } from "@/lib/course-route";
import { PLAYABLE_MAIL_TASKS, type PlayableMailTask } from "@/lib/tasks/mail/content";
import { courseLevels, taskKeysForLevel } from "@/lib/tracks-content";

/**
 * The mail jobs this learner can meet, in the order they meet them: only
 * their route's levels, and only up to the level they are on today.
 *
 * Without both limits the Mail app ran a job the learner would never get:
 * an Office or clinic learner sat on the Stay-and-lead Reply-All task for the
 * rest of the game, and a learner on Day 6 was handed Day 10's email to
 * Jordan. Both also hid every story email that came after that job.
 */
export function mailTasksReachable(route: CourseRoute | null, currentLevelKey: string): PlayableMailTask[] {
  const levels = courseLevels(route);
  const here = levels.findIndex((l) => l.key === currentLevelKey);
  const upToToday = here === -1 ? levels : levels.slice(0, here + 1);
  const path = routeBridgePath(route);
  return (upToToday.flatMap((l) => taskKeysForLevel(l, path)) as string[]).filter(
    (k): k is PlayableMailTask => (PLAYABLE_MAIL_TASKS as string[]).includes(k),
  );
}

/**
 * Every mail job shares one Mail app. The one running is the first reachable
 * job not done yet. With none left, it is the last one done, which Mail shows
 * as finished, so the inbox holds the whole story so far.
 */
export function activeMailTaskFor(
  completedTaskKeys: readonly TaskKey[],
  route: CourseRoute | null,
  currentLevelKey: string,
): PlayableMailTask {
  const reachable = mailTasksReachable(route, currentLevelKey);
  const next =
    reachable.find((k) => !completedTaskKeys.includes(k)) ?? reachable[reachable.length - 1] ?? "mail-reply";
  // Mail remains browsable during the schedule job, but its next challenge
  // must wait until that job is finished.
  return next === "mail-attach" && !completedTaskKeys.includes("schedule") ? "mail-reply" : next;
}

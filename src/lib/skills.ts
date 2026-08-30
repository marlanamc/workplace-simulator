import type { TaskKey } from "./desktop-content";
import { TASK_LIST } from "./tasks/registry";

/**
 * The named skill shown on a task's own done-screen badge, derived from the
 * task registry (`src/lib/tasks/registry.ts`).
 */
export const SKILLS: Record<TaskKey, string> = Object.fromEntries(
  TASK_LIST.map((d) => [d.key, d.skill]),
) as Record<TaskKey, string>;

/** SKILLS as a first-person statement ("Reply with an attachment" -> "I can reply with an attachment."), for the done screen and awards case. */
export function firstPersonSkill(taskKey: TaskKey): string {
  const skill = SKILLS[taskKey];
  return `I can ${skill.charAt(0).toLowerCase()}${skill.slice(1)}.`;
}

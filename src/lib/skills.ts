import type { TaskKey } from "./desktop-content";
import type { Lang, Localized } from "./task-types";
import { TASK_LIST } from "./tasks/registry";

/**
 * The named skill shown on a task's own done-screen badge, derived from the
 * task registry (`src/lib/tasks/registry.ts`).
 */
export const SKILLS: Record<TaskKey, Localized<string>> = Object.fromEntries(
  TASK_LIST.map((d) => [d.key, d.skill]),
) as Record<TaskKey, Localized<string>>;

/**
 * SKILLS as a first-person statement, for the done screen and awards case:
 * "Reply with an attachment" -> "I can reply with an attachment."
 *
 * The frame is per-language rather than a concatenation onto a fixed English
 * "I can ", which is why the registry stores the Spanish half as an infinitive
 * phrase ("responder con un archivo adjunto" -> "Puedo responder con un
 * archivo adjunto.").
 */
export function firstPersonSkill(taskKey: TaskKey, lang: Lang): string {
  const skill = SKILLS[taskKey][lang];
  const phrase = `${skill.charAt(0).toLowerCase()}${skill.slice(1)}`;
  return lang === "en" ? `I can ${phrase}.` : `Puedo ${phrase}.`;
}

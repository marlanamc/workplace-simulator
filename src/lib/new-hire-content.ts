import { CAST } from "@/lib/cast";
import type { Localized } from "@/lib/task-types";

/**
 * The New Hire introduction: who the learner's manager and coworker are,
 * shown once as its own full-page screen after the computer tour and before
 * Day 1 starts. Act I has no orientation screen the way Acts II–VII do
 * (`ActIntro`) — this is that screen's Act I counterpart, scoped to "who are
 * these two people", not a new role or new skills.
 */

export const NEW_HIRE_FLAG = "new-hire-seen";

/**
 * Shown once, after the in-card computer tour finishes and before Day 1
 * starts — only on Level 1 (Act I's first level), and only once Level 0's own
 * "You found your way around" celebration has been dismissed. A returning
 * learner already past Level 1 never sees it, flag or not.
 */
export function shouldShowNewHire(opts: {
  storyFlags: Record<string, string>;
  completedTaskKeys: readonly string[];
  levelKey: string;
  celebratingLevel: boolean;
}): boolean {
  if (opts.storyFlags[NEW_HIRE_FLAG] === "true") return false;
  if (opts.levelKey !== "level1") return false;
  if (!opts.completedTaskKeys.includes("tour")) return false;
  if (opts.celebratingLevel) return false;
  return true;
}

export const NEW_HIRE_COPY = {
  kicker: { en: "Harborside Cafe · New Hire", es: "Harborside Cafe · Nueva contratación" },
  title: { en: "Meet your team", es: "Conoce a tu equipo" },
  managerRole: { en: "Your manager", es: "Tu gerente" },
  managerLine: {
    en: `${CAST.maria.name} runs the cafe. She'll email you about your schedule and anything you need to know.`,
    es: `${CAST.maria.name} dirige el café. Te va a escribir por correo sobre tu horario y lo que necesites saber.`,
  },
  coworkerRole: { en: "A coworker", es: "Un compañero" },
  coworkerLine: {
    en: `${CAST.darnell.name} also works mornings. He'll show you around too.`,
    es: `${CAST.darnell.name} también trabaja en las mañanas. Él también te va a ayudar a conocer el lugar.`,
  },
  start: { en: "Start my first day", es: "Comenzar mi primer día" },
} satisfies Record<string, Localized>;

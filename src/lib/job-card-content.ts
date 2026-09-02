import type { TaskKey } from "@/lib/desktop-content";
import type { Localized } from "@/lib/task-types";
import { TASK_LIST } from "@/lib/tasks/registry";

/**
 * Copy for the Job Card — the one surface that tells a learner what to do.
 *
 * Hard rule from the design handoff: an instruction line is ONE short
 * sentence, ideally under six words. Anything longer belongs in the Help
 * drawer, not here.
 */

export interface IntroBeat {
  kicker: Localized<string>;
  /** `{name}` is replaced with the learner's first name. */
  line: Localized<string>;
  cta?: Localized<string>;
  /** Advance when they collapse the card, so this beat is a try, not a read. */
  tryCollapse?: boolean;
}

/**
 * First run, on an empty desktop: three beats, one sentence and one button
 * each, before any app window exists.
 *
 * The welcome and the "you cannot break it" reassurance live here rather than
 * in a separate full-screen card inside the Welcome tab. That card used to be
 * the very first thing a learner saw, talking over this one — two voices on
 * screen one, which is the thing this whole design exists to remove. The
 * browser now opens because the learner presses this card's button, which is
 * also the loop the rest of the product teaches.
 */
export const INTRO_BEATS: IntroBeat[] = [
  {
    kicker: { en: "Your first day", es: "Tu primer día" },
    // The greeting rides along with the card's first promise rather than
    // taking a beat of its own. The "practice computer, nothing is real"
    // reassurance is already on the login screen and is not repeated here.
    line: {
      en: "Welcome, {name}. This card tells you what to do.",
      es: "Bienvenida, {name}. Esta tarjeta te dice qué hacer.",
    },
    cta: { en: "OK", es: "OK" },
  },
  {
    kicker: { en: "Your task card", es: "Tu tarjeta de tarea" },
    // Teaching the drag here is the only reliable moment: the grip dots are a
    // quiet affordance, and a learner who feels stuck behind the card needs to
    // already know it moves rather than discover it under pressure.
    line: {
      en: "It stays in this corner. Drag it if it is in the way.",
      es: "Se queda en esta esquina. Arrástrala si te estorba.",
    },
    cta: { en: "Got it", es: "Entendido" },
  },
  {
    kicker: { en: "Your task card", es: "Tu tarjeta de tarea" },
    line: {
      en: "Tap the arrow to shrink it.",
      es: "Toca la flecha para encogerla.",
    },
    tryCollapse: true,
  },
];

/**
 * Day One, once: the Job Card points at the orange shelf pin so nobody has
 * to know the word "briefcase". Locked during the walkthrough; this is the
 * first sitting where the list is real.
 */
export const LIST_INTRO_FLAG = "list-intro-seen";
export const LIST_INTRO: {
  kicker: Localized;
  line: Localized;
  cta: Localized;
} = {
  kicker: { en: "Your list", es: "Tu lista" },
  line: {
    en: "Your jobs are this orange button on the bar.",
    es: "Tus trabajos son este botón naranja en la barra.",
  },
  cta: { en: "Got it", es: "Entendido" },
};

export function shouldShowListIntro(opts: {
  storyFlags: Record<string, string>;
  completedTaskKeys: readonly string[];
  levelKey: string;
  celebrating: boolean;
}): boolean {
  if (opts.storyFlags[LIST_INTRO_FLAG] === "true") return false;
  if (!opts.completedTaskKeys.includes("tour")) return false;
  if (opts.levelKey !== "level1") return false;
  if (opts.celebrating) return false;
  return true;
}

/**
 * The desktop line for a job: what just happened, in one short sentence.
 * Tasks without a `jobCardLine` in the registry fall back to their
 * `TASK_INFO.dispatch`. The green finish line (`jobCardDoneLine`) falls back
 * to the generic done copy. Both derived from `src/lib/tasks/registry.ts`.
 */
export const JOB_CARD_LINE: Partial<Record<TaskKey, Localized<string>>> = Object.fromEntries(
  TASK_LIST.flatMap((d) => (d.jobCardLine ? [[d.key, d.jobCardLine] as const] : [])),
);

export const JOB_CARD_DONE_LINE: Partial<Record<TaskKey, Localized<string>>> = Object.fromEntries(
  TASK_LIST.flatMap((d) => (d.jobCardDoneLine ? [[d.key, d.jobCardDoneLine] as const] : [])),
);

export const JOB_CARD_COPY: Record<
  "en" | "es",
  {
    jobOf: (n: number, total: number) => string;
    doneKicker: string;
    dayDoneKicker: string;
    dayDoneLine: string;
    startTomorrow: string;
    nextJob: string;
    oneJobLeft: string;
    jobsLeft: (n: number) => string;
    doItAgain: string;
    showMe: string;
    hide: string;
    help: string;
    hideHelp: string;
    readAloud: string;
    dragHint: string;
    snapBack: string;
    collapse: string;
    expand: string;
    allDoneLine: string;
    seeAwards: string;
    comingSoonLine: string;
  }
> = {
  en: {
    // The counter always names what it is counting. Unlabeled, "Task 1 of 4"
    // reads as "this game has 4 tasks" — and then the day ends and a new one
    // starts at 1 of 2, which is the single most confusing thing the old
    // build did. A one-task day gets the day alone: "Task 1 of 1" is a
    // counter that communicates nothing.
    jobOf: (n, total) => (total <= 1 ? "" : `Task ${n} of ${total}`),
    doneKicker: "Done",
    dayDoneKicker: "Day finished",
    dayDoneLine: "That's today done.",
    startTomorrow: "Start tomorrow",
    nextJob: "Next task",
    oneJobLeft: "Done. One task left.",
    jobsLeft: (n) => `Done. ${n} tasks left.`,
    doItAgain: "Do it again",
    showMe: "Show me",
    hide: "Hide",
    help: "Help with this job",
    hideHelp: "Hide help",
    readAloud: "Read this out loud",
    dragHint: "Move this card to another corner. Drag it, or use the arrow keys.",
    snapBack: "Put the card back in the corner",
    collapse: "Hide the rest of this card",
    expand: "Show the rest of this card",
    allDoneLine: "You finished everything.",
    seeAwards: "See awards",
    comingSoonLine: "Nothing new yet. Check back soon.",
  },
  es: {
    jobOf: (n, total) => (total <= 1 ? "" : `Tarea ${n} de ${total}`),
    doneKicker: "Listo",
    dayDoneKicker: "Día terminado",
    dayDoneLine: "El día de hoy está listo.",
    startTomorrow: "Empezar mañana",
    nextJob: "Siguiente tarea",
    oneJobLeft: "Listo. Queda una tarea.",
    jobsLeft: (n) => `Listo. Quedan ${n} tareas.`,
    doItAgain: "Hazlo otra vez",
    showMe: "Muéstrame",
    hide: "Ocultar",
    help: "Ayuda con este trabajo",
    hideHelp: "Ocultar ayuda",
    readAloud: "Léelo en voz alta",
    dragHint: "Mueve esta tarjeta a otra esquina. Arrástrala o usa las flechas.",
    snapBack: "Regresa la tarjeta a la esquina",
    collapse: "Ocultar el resto de esta tarjeta",
    expand: "Mostrar el resto de esta tarjeta",
    allDoneLine: "Terminaste todo.",
    seeAwards: "Ver premios",
    comingSoonLine: "Nada nuevo todavía. Vuelve pronto.",
  },
};

import type { TaskKey } from "@/lib/desktop-content";
import type { Localized } from "@/lib/task-types";

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
  cta: Localized<string>;
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
    kicker: { en: "Your job card", es: "Tu tarjeta de trabajo" },
    // Teaching the drag here is the only reliable moment: the grip dots are a
    // quiet affordance, and a learner who feels stuck behind the card needs to
    // already know it moves rather than discover it under pressure.
    line: {
      en: "It stays in this corner. Drag it if it is in the way.",
      es: "Se queda en esta esquina. Arrástrala si te estorba.",
    },
    cta: { en: "Got it", es: "Entendido" },
  },
];

/**
 * The desktop line for a job: what just happened, in one sentence, shorter
 * than the old briefing headline. Tasks without an entry fall back to their
 * existing `TASK_INFO.dispatch`, which is a full sentence and still true —
 * shortening the rest is a content pass, not a code change.
 */
export const JOB_CARD_LINE: Partial<Record<TaskKey, Localized<string>>> = {
  tour: { en: "Look around this computer.", es: "Conoce esta computadora." },
  "mail-reply": {
    en: "Maria said welcome. Write her back.",
    es: "Maria te dio la bienvenida. Contéstale.",
  },
  "mail-attach": {
    en: "Maria needs the July safety report.",
    es: "Maria necesita el reporte de julio.",
  },
};

/** The green finish line for a job. Falls back to the generic lines below. */
export const JOB_CARD_DONE_LINE: Partial<Record<TaskKey, Localized<string>>> = {
  "mail-reply": { en: "Sent. One job left.", es: "Enviado. Queda un trabajo." },
  "mail-attach": { en: "Sent, with the file.", es: "Enviado, con el archivo." },
};

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
    readAloud: string;
    dragHint: string;
    snapBack: string;
    allDoneLine: string;
    seeAwards: string;
    comingSoonLine: string;
  }
> = {
  en: {
    jobOf: (n, total) => `Job ${n} of ${total}`,
    doneKicker: "Done",
    dayDoneKicker: "Day finished",
    dayDoneLine: "That's today done.",
    startTomorrow: "Start tomorrow",
    nextJob: "Next job",
    oneJobLeft: "Done. One job left.",
    jobsLeft: (n) => `Done. ${n} jobs left.`,
    doItAgain: "Do it again",
    showMe: "Show me",
    hide: "Hide",
    readAloud: "Read this out loud",
    dragHint: "Move this card to another corner. Drag it, or use the arrow keys.",
    snapBack: "Put the card back in the corner",
    allDoneLine: "You finished everything.",
    seeAwards: "See awards",
    comingSoonLine: "Nothing new yet. Check back soon.",
  },
  es: {
    jobOf: (n, total) => `Trabajo ${n} de ${total}`,
    doneKicker: "Listo",
    dayDoneKicker: "Día terminado",
    dayDoneLine: "El día de hoy está listo.",
    startTomorrow: "Empezar mañana",
    nextJob: "Siguiente trabajo",
    oneJobLeft: "Listo. Queda un trabajo.",
    jobsLeft: (n) => `Listo. Quedan ${n} trabajos.`,
    doItAgain: "Hazlo otra vez",
    showMe: "Muéstrame",
    hide: "Ocultar",
    readAloud: "Léelo en voz alta",
    dragHint: "Mueve esta tarjeta a otra esquina. Arrástrala o usa las flechas.",
    snapBack: "Regresa la tarjeta a la esquina",
    allDoneLine: "Terminaste todo.",
    seeAwards: "Ver premios",
    comingSoonLine: "Nada nuevo todavía. Vuelve pronto.",
  },
};

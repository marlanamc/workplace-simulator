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
}

export const INTRO_BEATS: IntroBeat[] = [{
  kicker: { en: "Before your first shift", es: "Antes de tu primer turno" },
  line: { en: "Welcome, {name}. This card tells you what to do.", es: "Te damos la bienvenida, {name}. Esta tarjeta te dice qué hacer." },
  cta: { en: "Start looking around", es: "Empezar a mirar" },
}];

/**
 * A deliberate reading pause after certain Act I tasks (see
 * `src/lib/read-pause.ts`): the reply saved, but the next job and any
 * celebration wait for the learner to open the response and press Continue.
 */
export const READ_PAUSE_COPY = {
  en: {
    line: "Read what they said back before you move on.",
    readReply: "Read reply",
    continueLabel: "Continue",
  },
  es: {
    line: "Lee lo que te contestaron antes de seguir.",
    readReply: "Leer respuesta",
    continueLabel: "Continuar",
  },
};

export const CARD_PRACTICE = {
  title: { en: "Practice clicking and scrolling", es: "Practicar clics y desplazamiento" },
  label: { en: "Practice only", es: "Solo práctica" },
  click: { en: "Open the practice notice.", es: "Abre el aviso de práctica." },
  scroll: { en: "Scroll down to find Ready.", es: "Desplázate hacia abajo hasta Listo." },
  complete: { en: "Practice complete. You're ready to continue.", es: "Práctica terminada. Puedes continuar." },
  envelope: { en: "Open practice notice", es: "Abrir aviso de práctica" },
  notice: { en: "A little break", es: "Una pequeña pausa" },
  paragraphs: [
    { en: "This is a sample notice.", es: "Este es un aviso de ejemplo." },
    { en: "There is a sunny spot by the window.", es: "Hay un lugar soleado junto a la ventana." },
    { en: "A plant sits on the table.", es: "Hay una planta sobre la mesa." },
    { en: "Nothing here sends a message or changes your work.", es: "Nada aquí envía mensajes ni cambia tu trabajo." },
  ],
  ready: { en: "Ready", es: "Listo" },
  skip: { en: "Skip practice", es: "Omitir práctica" },
};

/**
 * Optional, ungraded practice for moving, collapsing, and restoring the Job
 * Card itself — offered next to `CARD_PRACTICE` on the welcome beat. Skipped
 * entirely wherever the card is docked (below ~1100px): there's nothing to
 * move there.
 */
export const MOVE_PRACTICE = {
  title: { en: "Practice moving and hiding this card", es: "Practicar mover y ocultar esta tarjeta" },
  label: { en: "Practice only", es: "Solo práctica" },
  move: {
    en: "Drag this card to a corner, or use the arrow keys.",
    es: "Arrastra esta tarjeta a una esquina, o usa las flechas.",
  },
  moveNext: { en: "I moved it", es: "Ya la moví" },
  collapse: {
    en: "Now hide the card with the fold button, top right.",
    es: "Ahora oculta la tarjeta con el botón de flecha, arriba a la derecha.",
  },
  collapseNext: { en: "I hid it", es: "Ya la oculté" },
  restoreLine: {
    en: "A hidden card always has a way back: the same button shows it again.",
    es: "Una tarjeta oculta siempre tiene forma de volver: el mismo botón la muestra de nuevo.",
  },
  complete: { en: "Practice complete. You're ready to continue.", es: "Práctica terminada. Puedes continuar." },
  skip: { en: "Skip practice", es: "Omitir práctica" },
};

/**
 * Whether the first-run beats are behind the learner for good: once the tour
 * is finished. Before that, where they are (the welcome beat, the practice
 * stage, the walkthrough step) is a tour draft on this device, so a reload
 * keeps their place (Wave 5 F-7; see tour-resume.ts). A learner who reloads on
 * the welcome beat still has its optional practice (finding #17); one who
 * skipped it and moved on is not sent back.
 */
export function introBeatsDone(completedTaskKeys: readonly string[]): boolean {
  return completedTaskKeys.length > 0;
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
    keyInfo: string;
    yourTask: string;
    needHelp: string;
    readAloudShort: string;
    optional: string;
    dragHint: string;
    snapBack: string;
    collapse: string;
    expand: string;
    allDoneLine: string;
    seeAwards: string;
    comingSoonLine: string;
    pickDoorKicker: string;
    pickDoorLine: string;
    pickCollege: string;
    pickFrontDesk: string;
    otherDoorKicker: string;
    otherDoorLine: string;
    tryCollege: string;
    tryFrontDesk: string;
    hqOtherHint: string;
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
    oneJobLeft: "Done. One more task for today.",
    jobsLeft: (n) => `Done. ${n} tasks left.`,
    doItAgain: "Do it again",
    showMe: "Show me",
    hide: "Hide",
    help: "Help with this job",
    hideHelp: "Hide help",
    readAloud: "Read this out loud",
    keyInfo: "Key information",
    yourTask: "Your task",
    needHelp: "I need help",
    readAloudShort: "Read aloud",
    optional: "Optional",
    dragHint: "Move this card to another corner. Drag it, or use the arrow keys.",
    snapBack: "Put the card back in the corner",
    collapse: "Hide the rest of this card",
    expand: "Show the rest of this card",
    allDoneLine: "You finished everything.",
    seeAwards: "See awards",
    comingSoonLine: "Nothing new yet. Check back soon.",
    pickDoorKicker: "A new door",
    pickDoorLine: "College, or the front desk.",
    pickCollege: "Prep for college",
    pickFrontDesk: "Try the front desk",
    otherDoorKicker: "The other door",
    otherDoorLine: "You can try the other path now.",
    tryCollege: "Try the college path",
    tryFrontDesk: "Try the front desk",
    hqOtherHint: "Or try the other door later.",
  },
  es: {
    jobOf: (n, total) => (total <= 1 ? "" : `Tarea ${n} de ${total}`),
    doneKicker: "Listo",
    dayDoneKicker: "Día terminado",
    dayDoneLine: "Terminaste este día.",
    startTomorrow: "Empezar mañana",
    nextJob: "Siguiente tarea",
    oneJobLeft: "Listo. Queda una tarea más por hoy.",
    jobsLeft: (n) => `Listo. Quedan ${n} tareas.`,
    doItAgain: "Hazlo otra vez",
    showMe: "Muéstrame",
    hide: "Ocultar",
    help: "Ayuda con este trabajo",
    hideHelp: "Ocultar ayuda",
    readAloud: "Léelo en voz alta",
    keyInfo: "Información clave",
    yourTask: "Tu tarea",
    needHelp: "Necesito ayuda",
    readAloudShort: "Leer en voz alta",
    optional: "Opcional",
    dragHint: "Mueve esta tarjeta a otra esquina. Arrástrala o usa las flechas.",
    snapBack: "Regresa la tarjeta a la esquina",
    collapse: "Ocultar el resto de esta tarjeta",
    expand: "Mostrar el resto de esta tarjeta",
    allDoneLine: "Terminaste todo.",
    seeAwards: "Ver premios",
    comingSoonLine: "Nada nuevo todavía. Vuelve pronto.",
    pickDoorKicker: "Una puerta nueva",
    pickDoorLine: "Universidad, o la recepción.",
    pickCollege: "Prepárate para la universidad",
    pickFrontDesk: "Prueba la recepción",
    otherDoorKicker: "La otra puerta",
    otherDoorLine: "Ahora puedes probar el otro camino.",
    tryCollege: "Probar el camino de universidad",
    tryFrontDesk: "Probar la recepción",
    hqOtherHint: "O prueba la otra puerta después.",
  },
};

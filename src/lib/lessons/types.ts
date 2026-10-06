import type { Localized } from "@/lib/task-types";
import type { SkillTag } from "./skills";

/** How much the Job Card spells out: every click, or only the goal. */
export type LessonMode = "guided" | "independent";
export const LESSON_MODES: readonly LessonMode[] = ["guided", "independent"];

/** Shown only in teacher preview. Support is chosen by computer experience, not English level. */
export type TeacherGuide = {
  skills: Localized[];
  prepare: Localized[];
  stickingPoints: Localized[];
  followUp: Localized[];
  peerHelp: Localized;
  /**
   * The same skill in other jobs. The task stays at the cafe or clinic, so
   * this is how a learner from a warehouse or a hotel sees their own work.
   * The intro shows the settings; the guide shows the examples too.
   */
  atWork?: WorkExample[];
};

/** One other job where this lesson's skill shows up. */
export type WorkExample = { setting: Localized; example: Localized };

/**
 * Someone the task names, so "Email Renata" says who Renata is. `role` is the
 * short tag ("Your manager"); `who` is one plain sentence of what they are to
 * you, because a lesson learner never met them in Story mode.
 */
export type LessonPerson = { name: string; role: Localized; who: Localized };

/**
 * The scene a lesson opens on. Story mode builds this up over many tasks; a
 * lesson learner arrives cold, so the intro screen sets it up in a few
 * sentences and the Job Card's Key information keeps the people on screen
 * afterwards.
 */
export type LessonScene = {
  /** Who the learner is here, e.g. "You are a server at Harborside Cafe." */
  you: Localized;
  people: LessonPerson[];
  /** What is needed today, and why. A fact, not a step: the Job Card has the steps. */
  need: Localized;
};

/** One fact the learner has to copy or check while working (a password, a date). */
export type LessonFact = {
  label: Localized;
  value: string | Localized;
  /** Bold the value — a start time, a net pay, an hours-worked figure. */
  emphasize?: boolean;
};

/** One choice in a `LessonCheckQuestion`. Exactly one per question is `correct`. */
export type LessonCheckChoice = { text: Localized; correct: boolean };

/**
 * One multiple-choice recall question for the comprehension check shown
 * after a lesson finishes. Ungraded and skippable — it never gates "Back to
 * lessons" or "Practice again" — so it stays a short, low-stakes reflection
 * on what the task just taught, not a second test of the workplace skill.
 */
export type LessonCheckQuestion = {
  question: Localized;
  choices: LessonCheckChoice[];
};

/**
 * What makes a game task a classroom lesson. A task becomes a lesson just by
 * getting one of these on its `TaskDescriptor`, so lessons roll out one task
 * at a time. (Named `LessonMeta` because `task-types.ts` already has an
 * unrelated `Lesson`.)
 */
export type LessonMeta = {
  /** Plain classroom name, e.g. "Get back into a locked account". */
  title: Localized;
  sequence?: import("./confidence").LessonSequence;
  summary: Localized;
  skills: SkillTag[];
  minutes: number;
  guide: TeacherGuide;
  /** Extra browser tabs, for a task that hops between apps. */
  tabs?: string[];
  scene: LessonScene;
  /** Facts the info card keeps on screen: a login, a persona's details. */
  reference?: LessonFact[];
  /** The name the task writes for "you" (a résumé heading), when the task needs one. */
  persona?: string;
  /**
   * One plain sentence the finish card shows under "Lesson complete": what
   * the learner can now do, or the habit to keep ("On a real W-4, you write
   * your own facts."). Facts, not praise.
   */
  takeaway?: Localized;
  /** 3-5 question comprehension check, shown once after the task completes. */
  check?: LessonCheckQuestion[];
};

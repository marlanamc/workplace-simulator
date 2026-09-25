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
};

/** Someone the task names, so "Email Renata" says who Renata is. */
export type LessonPerson = { name: string; role: Localized };

/**
 * The scene a lesson opens on. Story mode builds this up over many tasks; a
 * lesson learner arrives cold, so the intro screen says it in three lines and
 * the info card keeps the people on screen afterwards.
 */
export type LessonScene = {
  /** Who the learner is here, e.g. "You are a server at Harborside Cafe." */
  you: Localized;
  people: LessonPerson[];
  /** What is needed today, and why. A fact, not a step: the Job Card has the steps. */
  need: Localized;
};

/** One fact the learner has to copy or check while working (a password, a date). */
export type LessonFact = { label: Localized; value: string | Localized };

/**
 * What makes a game task a classroom lesson. A task becomes a lesson just by
 * getting one of these on its `TaskDescriptor`, so lessons roll out one task
 * at a time. (Named `LessonMeta` because `task-types.ts` already has an
 * unrelated `Lesson`.)
 */
export type LessonMeta = {
  /** Plain classroom name, e.g. "Get back into a locked account". */
  title: Localized;
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
};

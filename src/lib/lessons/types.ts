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
  /** Key into the seeded writing fixtures, for a task that reads earlier writing. */
  fixtures?: string;
};

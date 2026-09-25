"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { TaskKey } from "@/lib/desktop-content";
import type { Lang, Localized } from "@/lib/task-types";
import type { LessonFact, LessonMode, LessonScene } from "@/lib/lessons/types";
import type { LessonSave } from "@/app/lessons/useLessonSave";

/**
 * Present only inside a `/lessons/<task>` run. Outside a lesson `useLesson()`
 * is null and every reader behaves exactly as it does in Story mode.
 *
 * The Job Card reads it to say "Lesson · <title>" and to pick how much it
 * spells out; the Browser reads it to keep the learner on the lesson's tabs;
 * the Shelf reads it to drop the story-only controls.
 */
export interface LessonValue {
  taskKey: TaskKey;
  title: Localized;
  /** Who the learner is and who the task names, for the info card. */
  scene: LessonScene;
  reference: LessonFact[];
  /** The name the task writes for "you", when it needs one. */
  persona?: string;
  mode: LessonMode;
  /** Change support mid-task. The task keeps its place. */
  setMode: (mode: LessonMode) => void;
  /** Teacher preview: the guide bar is showing and nothing is saved. */
  preview: boolean;
  /** Browser tabs this lesson may show. The first is where it opens. */
  tabs: string[];
  /** Leave the lesson (back to the library). */
  onFinish: (lang?: Lang) => void;
  /** Start the same lesson again from a clean slate. */
  onRestart: () => void;
  /** Where this lesson's finishes are kept, for the card's finish line. */
  save: Pick<LessonSave, "status" | "retry" | "signIn">;
}

const LessonContext = createContext<LessonValue | null>(null);

export function LessonProvider({ value, children }: { value: LessonValue; children: ReactNode }) {
  return <LessonContext.Provider value={value}>{children}</LessonContext.Provider>;
}

export function useLesson(): LessonValue | null {
  return useContext(LessonContext);
}

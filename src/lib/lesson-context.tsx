"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { TaskKey } from "@/lib/desktop-content";
import type { Localized } from "@/lib/task-types";
import type { LessonMode } from "@/lib/lessons/types";

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
  mode: LessonMode;
  /** Browser tabs this lesson may show. The first is where it opens. */
  tabs: string[];
  /** Leave the lesson (back to the library). */
  onFinish: () => void;
  /** Start the same lesson again from a clean slate. */
  onRestart: () => void;
}

const LessonContext = createContext<LessonValue | null>(null);

export function LessonProvider({ value, children }: { value: LessonValue; children: ReactNode }) {
  return <LessonContext.Provider value={value}>{children}</LessonContext.Provider>;
}

export function useLesson(): LessonValue | null {
  return useContext(LessonContext);
}

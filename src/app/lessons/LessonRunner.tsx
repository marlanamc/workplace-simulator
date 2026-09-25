"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import type { TaskKey } from "@/lib/desktop-content";
import type { Lang } from "@/lib/task-types";
import type { LessonMode } from "@/lib/lessons/types";
import { draftLessonFor, lessonByKey, seedForLesson } from "@/lib/lessons/catalog";
import { LESSON_COPY } from "@/lib/lessons/copy";
import { WindowManagerProvider } from "@/lib/window-manager";
import { JobCardProvider } from "@/lib/job-card-context";
import { useProgress } from "@/lib/progress-context";
import Desktop from "@/components/desktop/Desktop";
import LessonProgressProvider from "./LessonProgressProvider";

const noop = () => {};

function LessonDesktop() {
  const { lang } = useProgress();
  return <Desktop displayName={LESSON_COPY.guest[lang]} />;
}

/**
 * One game task on its own: the real desktop, browser, and Job Card, with
 * progress kept in memory. The server page has already checked that
 * `taskKey` is a lesson.
 */
export default function LessonRunner({
  taskKey,
  initialMode,
  initialLang,
  draft = false,
}: {
  taskKey: TaskKey;
  /** A task with no lesson block yet, opened by the smoke sweep. */
  draft?: boolean;
  initialMode: LessonMode;
  initialLang: Lang;
}) {
  const router = useRouter();
  const entry = (lessonByKey(taskKey) ?? (draft ? draftLessonFor(taskKey) : undefined))!;
  const seed = useMemo(() => seedForLesson(taskKey)!, [taskKey]);

  const lesson = useMemo(
    () => ({
      taskKey,
      title: entry.title,
      mode: initialMode,
      tabs: entry.tabs,
      onFinish: () => router.push(initialLang === "es" ? "/lessons?lang=es" : "/lessons"),
    }),
    [taskKey, entry, initialMode, router, initialLang],
  );

  return (
    <WindowManagerProvider jumpTab={entry.tabs[0]} jumpSection={entry.section}>
      <LessonProgressProvider seed={seed} lesson={lesson} initialLang={initialLang}>
        {/* The first-run card beats belong to the game, not to a lesson. */}
        <JobCardProvider introSeen onIntroDone={noop}>
          <LessonDesktop />
        </JobCardProvider>
      </LessonProgressProvider>
    </WindowManagerProvider>
  );
}

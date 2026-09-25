"use client";

import { useCallback, useMemo, useRef, useState } from "react";
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
import { useLessonSave } from "./useLessonSave";
import TeacherPreviewBar, { PREVIEW_BAR_H } from "./TeacherPreviewBar";
import type { TeacherGuide } from "@/lib/lessons/types";

const noop = () => {};

function LessonDesktop({ preview, guide }: { preview: boolean; guide: TeacherGuide }) {
  const { lang } = useProgress();
  return (
    <Desktop
      displayName={LESSON_COPY.guest[lang]}
      topInset={preview ? PREVIEW_BAR_H : 0}
      afterCard={preview ? <TeacherPreviewBar guide={guide} /> : null}
    />
  );
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
  preview = false,
  transfer = false,
  draft = false,
}: {
  taskKey: TaskKey;
  /** A task with no lesson block yet, opened by the smoke sweep. */
  draft?: boolean;
  initialMode: LessonMode;
  initialLang: Lang;
  preview?: boolean;
  /** Back from sign-in: carry this browser's attempts into the account. */
  transfer?: boolean;
}) {
  const router = useRouter();
  const entry = (lessonByKey(taskKey) ?? (draft ? draftLessonFor(taskKey) : undefined))!;
  const seed = useMemo(() => seedForLesson(taskKey)!, [taskKey]);
  const [mode, setModeState] = useState(initialMode);
  const modeRef = useRef(mode);
  // A smoke-sweep draft is not a real lesson, so it has nowhere to save.
  const save = useLessonSave(taskKey, { preview: preview || draft, transfer, mode });
  const { recordFinish } = save;
  const onLessonComplete = useCallback(() => recordFinish(modeRef.current), [recordFinish]);
  // Support changes in place: the URL follows, so a copied link keeps it,
  // but nothing reloads and the task keeps its step.
  const setMode = useCallback((next: LessonMode) => {
    setModeState(next);
    modeRef.current = next;
    const url = new URL(window.location.href);
    url.searchParams.set("mode", next);
    window.history.replaceState(null, "", url);
  }, []);

  const lesson = useMemo(
    () => ({
      taskKey,
      title: entry.title,
      mode,
      setMode,
      preview,
      save: { status: save.status, retry: save.retry, signIn: save.signIn },
      tabs: entry.tabs,
      onFinish: () => router.push(initialLang === "es" ? "/lessons?lang=es" : "/lessons"),
    }),
    [taskKey, entry, mode, setMode, preview, save.status, save.retry, save.signIn, router, initialLang],
  );

  return (
    <WindowManagerProvider jumpTab={entry.tabs[0]} jumpSection={entry.section}>
      <LessonProgressProvider seed={seed} lesson={lesson} initialLang={initialLang} onLessonComplete={onLessonComplete}>
        {/* The first-run card beats belong to the game, not to a lesson. */}
        <JobCardProvider introSeen onIntroDone={noop}>
          <LessonDesktop preview={preview} guide={entry.guide} />
        </JobCardProvider>
      </LessonProgressProvider>
    </WindowManagerProvider>
  );
}

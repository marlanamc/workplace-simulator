"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { TaskKey } from "@/lib/desktop-content";
import type { Lang } from "@/lib/task-types";
import type { LessonMode } from "@/lib/lessons/types";
import { draftLessonFor, lessonByKey, seedForLesson } from "@/lib/lessons/catalog";
import { libraryReturn } from "@/lib/lessons/library";
import { LESSON_COPY } from "@/lib/lessons/copy";
import { WindowManagerProvider } from "@/lib/window-manager";
import { JobCardProvider } from "@/lib/job-card-context";
import { useProgress } from "@/lib/progress-context";
import Desktop from "@/components/desktop/Desktop";
import LessonProgressProvider from "./LessonProgressProvider";
import { useLessonSave } from "./useLessonSave";
import TeacherPreviewBar, { PREVIEW_BAR_H } from "./TeacherPreviewBar";
import LessonIntro from "./LessonIntro";
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
  returnTo,
}: {
  taskKey: TaskKey;
  returnTo?: string;
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
  // The scene comes first. A smoke-sweep draft has no scene worth reading,
  // and a learner back from signing in has already read it.
  const [started, setStarted] = useState(draft || transfer);
  const [infoOpen, setInfoOpen] = useState(false);
  const modeRef = useRef(mode);
  // A smoke-sweep draft is not a real lesson, so it has nowhere to save.
  const save = useLessonSave(taskKey, { preview: preview || draft, transfer, mode, returnTo });
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
      scene: entry.scene,
      reference: entry.reference ?? [],
      persona: entry.persona,
      mode,
      setMode,
      infoOpen,
      setInfoOpen,
      preview,
      save: { status: save.status, retry: save.retry, signIn: save.signIn },
      tabs: entry.tabs,
      onFinish: (lang = initialLang) => router.push(libraryReturn(returnTo, lang)),
    }),
    [taskKey, entry, mode, setMode, infoOpen, preview, save.status, save.retry, save.signIn, router, initialLang, returnTo],
  );

  return (
    <WindowManagerProvider jumpTab={entry.tabs[0]} jumpSection={entry.section}>
      <LessonProgressProvider seed={seed} lesson={lesson} initialLang={initialLang} onLessonComplete={onLessonComplete}>
        {started ? (
          /* The first-run card beats belong to the game, not to a lesson. */
          <JobCardProvider introSeen onIntroDone={noop}>
            <LessonDesktop preview={preview} guide={entry.guide} />
          </JobCardProvider>
        ) : (
          <LessonIntro
            title={entry.title}
            scene={entry.scene}
            reference={entry.reference ?? []}
            onStart={() => setStarted(true)}
          />
        )}
      </LessonProgressProvider>
    </WindowManagerProvider>
  );
}

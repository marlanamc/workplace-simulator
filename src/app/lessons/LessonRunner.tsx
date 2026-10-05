"use client";
import { practiceScenario } from "@/lib/tasks/confidence/classroom";

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

import { scenarioHref, isConfidenceKey, type LessonScenario } from "@/lib/lessons/confidence";
import { CONFIDENCE_SCENARIOS } from "@/lib/tasks/confidence/content";

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
  scenario = "classroom",
  initialLang,
  preview = false,
  transfer = false,
  draft = false,
  returnTo,
}: {
  taskKey: TaskKey;
  scenario?: LessonScenario;
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
  const scenarioData = isConfidenceKey(taskKey) && taskKey !== "account-recovery" ? practiceScenario(taskKey, scenario) : taskKey === "account-recovery" && scenario !== "classroom" ? CONFIDENCE_SCENARIOS[taskKey][scenario] : null;
  // Classroom practice uses the lesson's own workplace and people ("Email
  // Maria" needs to say who Maria is); the try and home examples are made-up
  // settings with their own. Today's need is always the scenario's request,
  // except the first mail reply, whose request is Maria's email itself.
  const classroom = scenario === "classroom";
  const scene = scenarioData
    ? {
        you: scenarioData.you ?? (classroom ? entry.scene.you : { en: "You are practicing with fictional information.", es: "Estás practicando con datos ficticios." }),
        people: scenarioData.people ?? (classroom ? entry.scene.people : []),
        need: classroom && taskKey === "mail-reply" ? entry.scene.need : scenarioData.request,
      }
    : entry.scene;
  const reference = scenarioData ? (scenarioData.expected.password ? [{ label: { en: "Email", es: "Correo" }, value: scenarioData.expected.email }, { label: { en: "Practice password", es: "Contraseña de práctica" }, value: scenarioData.expected.password }] : []) : entry.reference ?? [];
  const seed = useMemo(() => seedForLesson(taskKey)!, [taskKey]);
  const [mode, setModeState] = useState(initialMode);
  // The scene comes first. A smoke-sweep draft has no scene worth reading,
  // and a learner back from signing in has already read it.
  const [started, setStarted] = useState(draft || transfer);
  const [infoOpen, setInfoOpen] = useState(false);
  const modeRef = useRef(mode);
  // A smoke-sweep draft is not a real lesson, so it has nowhere to save.
  const save = useLessonSave(taskKey, { preview: preview || draft, transfer, mode, returnTo, scenario });
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

  const lesson = {
      taskKey,
      title: entry.title,
      scene,
      reference,
      scenario,
      sequence: entry.sequence,
      changeScenario: (next: LessonScenario, lang: Lang) => router.push(scenarioHref(taskKey, next, lang, mode, preview)),
      persona: entry.persona,
      takeaway: scenarioData ? entry.sequence?.reflection : entry.takeaway,
      mode,
      setMode,
      infoOpen,
      setInfoOpen,
      preview,
      save: { status: save.status, retry: save.retry, signIn: save.signIn },
      tabs: entry.tabs,
      onFinish: (lang = initialLang) => router.push(libraryReturn(returnTo, lang)),
    };

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
            scene={scene}
            reference={reference}
            atWork={entry.guide.atWork}
            onStart={() => setStarted(true)}
            onBack={(lang) => router.push(libraryReturn(returnTo, lang))}
            persona={entry.persona}
          />
        )}
      </LessonProgressProvider>
    </WindowManagerProvider>
  );
}

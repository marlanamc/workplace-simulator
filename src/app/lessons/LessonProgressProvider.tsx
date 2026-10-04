"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { TaskKey } from "@/lib/desktop-content";
import type { Lang, SubmissionContent } from "@/lib/task-types";
import type { OpeningReply } from "@/lib/tasks/mail/opening";
import { ProgressContext, type ProgressValue } from "@/lib/progress-context";
import { LessonProvider, type LessonValue } from "@/lib/lesson-context";
import { POINTS_PER_TASK, TRACKS, isTrackComplete } from "@/lib/tracks-content";
import { rungFor, type RungMap } from "@/lib/release-ladder";
import type { StoryFlags } from "@/lib/story-beats";
import type { LessonSeed } from "@/lib/lessons/catalog";

import { isConfidenceKey } from "@/lib/lessons/confidence";
import { FOLLOWUP_ROUNDS } from "@/lib/tasks/lesson-followups/content";

const NO_RUNGS: RungMap = {};
const noop = () => {};

/**
 * The same `ProgressValue` the game's `ProgressProvider` supplies, kept
 * entirely in memory for one lesson. Nothing here calls a server action: a
 * lesson has no learner account behind it, so finishing the task never
 * writes a `task_completions` row and never plays a celebration.
 *
 * It also supplies the lesson context, because "Practice again" has to reset
 * this provider's state.
 */
export default function LessonProgressProvider({
  seed,
  lesson,
  initialLang,
  initialWriting = {},
  onLessonComplete,
  children,
}: {
  seed: LessonSeed;
  lesson: Omit<LessonValue, "onRestart">;
  initialLang: Lang;
  /** Earlier writing a task reads (a résumé reads the job application). */
  initialWriting?: Record<string, SubmissionContent>;
  onLessonComplete?: (taskKey: TaskKey) => void;
  children: ReactNode;
}) {
  const [completedTaskKeys, setCompletedTaskKeys] = useState<TaskKey[]>(seed.completedTaskKeys);
  const completedRef = useRef(seed.completedTaskKeys);
  const [practiceRound, setPracticeRound] = useState<number | null>(null);
  const practiceRoundRef = useRef<number | null>(null);
  const [writing, setWriting] = useState(initialWriting);
  const [openingReplies, setOpeningReplies] = useState<OpeningReply[]>([]);
  const [storyFlags, setStoryFlags] = useState<StoryFlags>(seed.storyFlags);
  const [progressEpoch, setProgressEpoch] = useState(0);
  const [lang, setLang] = useState<Lang>(initialLang);
  const [bigText, setBigText] = useState(false);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const markComplete = useCallback(
    async (taskKey: TaskKey, _badgeKey?: string, submission?: SubmissionContent) => {
      if (submission) setWriting((prev) => ({ ...prev, [taskKey]: submission }));
      if (completedRef.current.includes(taskKey)) return true;
      if (taskKey === lesson.taskKey && !isConfidenceKey(taskKey) && (!lesson.scenario || lesson.scenario === "classroom") && FOLLOWUP_ROUNDS[taskKey]?.length) {
        if (practiceRoundRef.current === null) {
          practiceRoundRef.current = 0;
          setPracticeRound(0);
        }
        return true;
      }
      completedRef.current = [...completedRef.current, taskKey];
      setCompletedTaskKeys(completedRef.current);
      onLessonComplete?.(taskKey);
      return true;
    },
    [onLessonComplete, lesson.taskKey, lesson.scenario],
  );

  // Practice again: back to exactly where the lesson started. Bumping the
  // epoch remounts the Browser, so every task's own step state starts fresh
  // too, including tasks whose done screen is derived from completions.
  const restart = useCallback(() => {
    completedRef.current = seed.completedTaskKeys;
    setCompletedTaskKeys(seed.completedTaskKeys);
    setWriting(initialWriting);
    setOpeningReplies([]);
    practiceRoundRef.current = null;
    setPracticeRound(null);
    setStoryFlags(seed.storyFlags);
    setProgressEpoch((n) => n + 1);
  }, [seed, initialWriting]);

  const setStoryFlag = useCallback((key: string, value: string) => {
    setStoryFlags((prev) => ({ ...prev, [key]: value }));
  }, []);

  const saveOpeningReply = useCallback(async (reply: OpeningReply) => {
    setOpeningReplies((prev) => [...prev.filter((r) => r.messageId !== reply.messageId), reply]);
    return true;
  }, []);

  const value = useMemo<ProgressValue>(
    () => ({
      courseRoute: seed.courseRoute,
      chooseCourseRoute: async () => {},
      routeSaving: false,
      saveError: false,
      saving: false,
      retrySave: noop,
      writing,
      openingReplies,
      setOpeningReplies,
      saveOpeningReply,
      learnerId: `lesson:${lesson.taskKey}`,
      displayName: "",
      completedTaskKeys,
      points: completedTaskKeys.length * POINTS_PER_TASK,
      justEarnedPoints: null,
      certificateTrackKeys: TRACKS.filter((t) => isTrackComplete(t, completedTaskKeys)).map((t) => t.key),
      celebrateTrack: null,
      celebrateLevel: null,
      celebrateReturning: false,
      // Pinned to the lesson's track, so finishing never moves the desktop on.
      currentTrack: seed.track,
      bridgePath: seed.bridgePath,
      progressEpoch,
      storyFlags,
      setStoryFlag,
      markComplete,
      restartLevel: restart,
      dismissCelebration: noop,
      dismissLevelCelebration: noop,
      mariaNoteTaskKey: null,
      dismissMariaNote: noop,
      lang,
      setLang,
      bigText,
      setBigText,
      rungMap: NO_RUNGS,
      // Rung 1 is full guidance; Guided/Independent is the teacher's choice, not the ladder's.
      getRung: (skillKey: string) => rungFor(NO_RUNGS, skillKey),
      recordSkillRun: noop,
      pendingFeedback: [],
      dismissFeedback: noop,
    }),
    [seed, lesson.taskKey, writing, openingReplies, saveOpeningReply, completedTaskKeys, progressEpoch, storyFlags, setStoryFlag, markComplete, restart, lang, bigText],
  );

  const completePracticeRound = useCallback((expectedIndex: number) => {
    const index = practiceRoundRef.current;
    const rounds = FOLLOWUP_ROUNDS[lesson.taskKey];
    if (index === null || index !== expectedIndex || !rounds || completedRef.current.includes(lesson.taskKey)) return;
    if (index + 1 < rounds.length) {
      practiceRoundRef.current = index + 1;
      setPracticeRound(index + 1);
      return;
    }
    completedRef.current = [...completedRef.current, lesson.taskKey];
    setCompletedTaskKeys(completedRef.current);
    // Keep the final reviewed response visible until Practice again.
    practiceRoundRef.current = null;
    onLessonComplete?.(lesson.taskKey);
  }, [lesson.taskKey, onLessonComplete]);

  const lessonValue = useMemo<LessonValue>(() => ({ ...lesson,
    ...(practiceRound !== null ? {
      scene: {
        you: { en: "You are handling a new workplace situation.", es: "Estás atendiendo una nueva situación de trabajo." },
        people: [],
        need: FOLLOWUP_ROUNDS[lesson.taskKey]![practiceRound].goal,
      },
      reference: [{ label: { en: "Current situation", es: "Situación actual" }, value: FOLLOWUP_ROUNDS[lesson.taskKey]![practiceRound].title }],
    } : {}),
    practiceRound, completePracticeRound, onFinish: () => lesson.onFinish(lang), onRestart: restart }), [lesson, practiceRound, completePracticeRound, restart, lang]);

  return (
    <ProgressContext.Provider value={value}>
      <LessonProvider value={lessonValue}>{children}</LessonProvider>
    </ProgressContext.Provider>
  );
}

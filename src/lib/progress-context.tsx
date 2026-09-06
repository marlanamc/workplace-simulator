"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import type { TaskKey } from "@/lib/desktop-content";
import type { Lang } from "@/lib/task-types";
import {
  POINTS_PER_TASK,
  activeTrack,
  findTrackForTask,
  isTrackComplete,
  levelForTrack,
  isLevelComplete,
  nextCourseLevel,
  taskKeysForLevel,
  type Track,
  type Level,
} from "@/lib/tracks-content";
import {
  completeTask,
  awardCertificate,
  persistBridgePath,
  persistCourseRoute,
  recordWritingSubmission,
  markMyFeedbackSeen,
  restartLevelProgress,
  syncSkillRun,
  type Confidence,
} from "@/app/actions";
import { routeBridgePath, type CourseRoute } from "@/lib/course-route";
import type { SubmissionContent, TeacherFeedback } from "@/lib/task-types";
import { BRIDGE_PATH_FLAG, type BridgePath } from "@/lib/bridge-path";
import { storyFlagKeysForTasks, storyMailAfter, type StoryFlags } from "@/lib/story-beats";
import { applyGapDecay, recordCleanRun, recordMissedRun, rungFor, type Rung, type RungMap } from "@/lib/release-ladder";
import { DEVICE_KEY, learnerKey, storage } from "@/lib/storage";

const loadStoryFlags = (learnerId: string): StoryFlags =>
  storage.getJSON<StoryFlags>(learnerKey.storyFlags(learnerId), {});

const saveStoryFlags = (learnerId: string, flags: StoryFlags) =>
  storage.setJSON(learnerKey.storyFlags(learnerId), flags);

/** Merge a server-known bridge path onto stored flags without mutating either. */
const withBridgePath = (flags: StoryFlags, bridgePath?: BridgePath | null): StoryFlags =>
  bridgePath ? { ...flags, [BRIDGE_PATH_FLAG]: bridgePath } : flags;

const loadStoredLang = (): Lang => (storage.getString(DEVICE_KEY.lang) === "es" ? "es" : "en");

const loadStoredFlag = (key: string): boolean => storage.getString(key) === "true";

const loadRungMap = (learnerId: string): RungMap =>
  storage.getJSON<RungMap>(learnerKey.rungs(learnerId), {});

const saveRungMap = (learnerId: string, map: RungMap) =>
  storage.setJSON(learnerKey.rungs(learnerId), map);

type PendingSave = { taskKey: TaskKey; badgeKey?: string; submission?: SubmissionContent; confidence?: Confidence };
interface ProgressValue {
  courseRoute: CourseRoute | null;
  chooseCourseRoute: (route: CourseRoute) => Promise<void>;
  routeSaving: boolean;
  saveError: boolean;
  saving: boolean;
  retrySave: () => void;
  writing: Record<string, SubmissionContent>;

  learnerId: string;
  displayName: string;
  completedTaskKeys: TaskKey[];
  points: number;
  justEarnedPoints: number | null;
  certificateTrackKeys: string[];
  celebrateTrack: Track | null;
  celebrateLevel: Level | null;
  currentTrack: Track;
  bridgePath: BridgePath | null;
  progressEpoch: number;
  storyFlags: StoryFlags;
  setStoryFlag: (key: string, value: string) => void;
  markComplete: (
    taskKey: TaskKey,
    badgeKey?: string,
    submission?: SubmissionContent,
    confidence?: Confidence,
  ) => void;
  restartLevel: (level: Level) => void;
  dismissCelebration: () => void;
  dismissLevelCelebration: () => void;
  mariaNoteTaskKey: TaskKey | null;
  dismissMariaNote: () => void;
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** "Bigger text" mode: task windows render ~15% larger. */
  bigText: boolean;
  setBigText: (on: boolean) => void;
  rungMap: RungMap;
  getRung: (skillKey: string) => Rung;
  recordSkillRun: (skillKey: string, opts: { clean: boolean }) => void;
  /** Teacher notes on earlier writing that the learner hasn't opened yet. */
  pendingFeedback: TeacherFeedback[];
  /** Mark one note as seen: removes it here and records it server-side. */
  dismissFeedback: (id: string) => void;
}

const ProgressContext = createContext<ProgressValue | null>(null);

export function ProgressProvider({
  learnerId,
  displayName,
  initialCompletedTaskKeys,
  initialCertificateTrackKeys,
  initialBridgePath,
  initialCourseRoute = null,
  initialWriting = {},
  initialFeedback = [],
  initialRungs = {},
  children,
}: {
  learnerId: string;
  displayName: string;
  initialCompletedTaskKeys: TaskKey[];
  initialCertificateTrackKeys: string[];
  initialBridgePath?: BridgePath | null;
  initialCourseRoute?: CourseRoute | null;
  initialWriting?: Record<string, SubmissionContent>;
  initialFeedback?: TeacherFeedback[];
  /** Server-persisted skill rungs. Authoritative over the localStorage cache on load. */
  initialRungs?: RungMap;
  children: ReactNode;
}) {
  const [courseRoute, setCourseRoute] = useState<CourseRoute | null>(initialCourseRoute);
  const [routeSaving, setRouteSaving] = useState(false);
  const [routeError, setRouteError] = useState(false);
  const routeAttempt = useRef<CourseRoute | null>(null);
  const [writing, setWriting] = useState(initialWriting);
  const queueKey = `workplace:pending-saves:${learnerId}`;
  const [pending, setPending] = useState<PendingSave[]>(() => storage.getJSON<PendingSave[]>(queueKey, []));
  const pendingRef = useRef(pending);
  const [savingCount, setSavingCount] = useState(0);
  const inFlight = useRef(new Set<TaskKey>());
  const [completedTaskKeys, setCompletedTaskKeys] = useState<TaskKey[]>(initialCompletedTaskKeys);
  const completedRef = useRef(initialCompletedTaskKeys);
  const [certificateTrackKeys, setCertificateTrackKeys] = useState<string[]>(initialCertificateTrackKeys);
  const [justEarnedPoints, setJustEarnedPoints] = useState<number | null>(null);
  const [celebrateTrack, setCelebrateTrack] = useState<Track | null>(null);
  const [celebrateLevel, setCelebrateLevel] = useState<Level | null>(null);
  const [progressEpoch, setProgressEpoch] = useState(0);
  const chooseCourseRoute = useCallback(async (route: CourseRoute) => {
    routeAttempt.current = route;
    setRouteSaving(true);
    setRouteError(false);
    try {
      const result = await persistCourseRoute(route);
      if (!result.ok) throw new Error('Route not saved');
      setCourseRoute(route);
      setProgressEpoch((n) => n + 1);
      setCelebrateLevel(null);
      setCelebrateTrack(null);
    } catch { setRouteError(true); }
    finally { setRouteSaving(false); }
  }, []);
  // 1. Hydration: story flags are localStorage-only. Reading them in a useState
  // initializer makes SSR paint Welcome/ActIntro while the client skips them.
  // Same pattern as LoginForm — server snapshot is empty (+ bridge path from
  // the DB); after hydrate, localStorage wins via isClient.
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [storyFlagsOverride, setStoryFlags] = useState<StoryFlags | null>(null);
  const storedStoryFlags = withBridgePath(
    isClient ? loadStoryFlags(learnerId) : {},
    initialBridgePath,
  );
  const storyFlags = storyFlagsOverride ?? storedStoryFlags;
  const [rungMap, setRungMap] = useState<RungMap>(() => {
    // Server rungs win over the local cache per skill; skills only present locally
    // (an offline run not yet synced) are kept.
    const merged = { ...loadRungMap(learnerId), ...initialRungs };
    const decayed = applyGapDecay(merged, new Date().toISOString());
    saveRungMap(learnerId, decayed);
    return decayed;
  });
  // A ref mirror of rungMap so a skill run can compute the next map and fire its
  // side effects (localStorage + server sync) *outside* a setState updater — the
  // StrictMode double-fire rule this file already follows for completions.
  const rungMapRef = useRef(rungMap);
  useEffect(() => {
    rungMapRef.current = rungMap;
  }, [rungMap]);
  // Skills a task self-reported this session via `useSkillGuidance` (mail,
  // shift-review, account-recovery, schedule). `markComplete` records an
  // automatic clean run for every other task so all ~35 feed the ladder, and
  // this set keeps it from double-counting the ones that report their own
  // clean/missed nuance.
  const reportedSkillsRef = useRef<Set<string>>(new Set());

  const applySkillRun = useCallback((skillKey: string, clean: boolean) => {
    reportedSkillsRef.current.add(skillKey);
    const now = new Date().toISOString();
    const prev = rungMapRef.current;
    const next = clean ? recordCleanRun(prev, skillKey, now) : recordMissedRun(prev, skillKey, now);
    if (next === prev) return;
    rungMapRef.current = next;
    setRungMap(next);
    saveRungMap(learnerId, next);
    const state = next[skillKey];
    if (state) syncSkillRun(skillKey, state);
  }, [learnerId]);

  const [langOverride, setLangState] = useState<Lang | null>(null);
  const lang = langOverride ?? (isClient ? loadStoredLang() : "en");
  const [bigTextOverride, setBigTextState] = useState<boolean | null>(null);
  const bigText = bigTextOverride ?? (isClient ? loadStoredFlag(DEVICE_KEY.bigText) : false);
  const [mariaNoteTaskKey, setMariaNoteTaskKey] = useState<TaskKey | null>(null);
  const [pendingFeedback, setPendingFeedback] = useState<TeacherFeedback[]>(initialFeedback);
  const pointsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissFeedback = useCallback((id: string) => {
    setPendingFeedback((prev) => prev.filter((f) => f.id !== id));
    markMyFeedbackSeen(id);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    storage.setString(DEVICE_KEY.lang, next);
  }, []);

  const setBigText = useCallback((on: boolean) => {
    setBigTextState(on);
    storage.setString(DEVICE_KEY.bigText, String(on));
  }, []);

  // Keep the document language in sync so screen readers pick the right voice
  // for Spanish content (the server layout can only ever render lang="en").
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setStoryFlag = useCallback((key: string, value: string) => {
    setStoryFlags((prev) => {
      const next = { ...withBridgePath(prev ?? loadStoryFlags(learnerId), initialBridgePath), [key]: value };
      saveStoryFlags(learnerId, next);
      return next;
    });
    if (key === BRIDGE_PATH_FLAG && (value === "a" || value === "b")) {
      persistBridgePath(value);
    }
  }, [learnerId, initialBridgePath]);

  // Every state write and side effect here runs *outside* the state updaters —
  // no server action or setState nested inside a setCompletedTaskKeys(prev =>)
  // callback, which would double-fire under StrictMode. The `includes` guard
  // makes a repeat call a no-op.
  const markComplete = useCallback(async (
    taskKey: TaskKey,
    badgeKey?: string,
    submission?: SubmissionContent,
    confidence?: Confidence,
  ) => {
    if (inFlight.current.has(taskKey)) return;
    const item = { taskKey, badgeKey, submission, confidence };
    pendingRef.current = [...pendingRef.current.filter((p) => p.taskKey !== taskKey), item];
    setPending(pendingRef.current);
    storage.setJSON(queueKey, pendingRef.current);
    inFlight.current.add(taskKey);
    setSavingCount((n) => n + 1);
    try {
      if (submission) {
        const saved = await recordWritingSubmission(taskKey, submission);
        if (!saved.ok) throw new Error('Writing not saved');
        setWriting((prev) => ({ ...prev, [taskKey]: submission }));
      }
      const saved = await completeTask(taskKey, badgeKey, confidence);
      if (!saved.ok) throw new Error('Completion not saved');
      const awardedTrack = findTrackForTask(taskKey);
      if (awardedTrack && isTrackComplete(awardedTrack, [...completedRef.current, taskKey])) {
        const awarded = await awardCertificate(awardedTrack.key);
        if (!awarded.ok) throw new Error('Award not saved');
      }
      pendingRef.current = pendingRef.current.filter((p) => p.taskKey !== taskKey);
      setPending(pendingRef.current);
      storage.setJSON(queueKey, pendingRef.current);
    } catch {
      return; // Retain the payload and expose Retry in the Job Card, including after reload.
    } finally {
      inFlight.current.delete(taskKey);
      setSavingCount((n) => n - 1);
    }

    if (completedRef.current.includes(taskKey)) return;
    const next = [...completedRef.current, taskKey];
    completedRef.current = next;
    setCompletedTaskKeys(next);

    const track = findTrackForTask(taskKey);
    if (track && isTrackComplete(track, next)) {
      setCertificateTrackKeys((c) => (c.includes(track.key) ? c : [...c, track.key]));


      // A level-up moment (when this was the level's last track) takes
      // priority over the smaller per-track celebration - only one modal
      // shows for a task completion that finishes both at once.
      const level = levelForTrack(track.key);
      const path = routeBridgePath(courseRoute);
      const upcoming = isLevelComplete(level, next, path) ? nextCourseLevel(level, courseRoute) : null;
      if (upcoming?.levelUp) setCelebrateLevel(upcoming);
      else setCelebrateTrack(track);
    }

    if (storyMailAfter(taskKey)) setMariaNoteTaskKey(taskKey);

    setJustEarnedPoints(POINTS_PER_TASK);
    if (pointsTimer.current) clearTimeout(pointsTimer.current);
    pointsTimer.current = setTimeout(() => setJustEarnedPoints(null), 2200);



    // Every task feeds the release ladder. Tasks that ran `useSkillGuidance`
    // already reported their own clean/missed run; the rest get an automatic
    // clean run here (the ladder "only loosens, never punishes").
    if (!reportedSkillsRef.current.has(taskKey)) applySkillRun(taskKey, true);
  }, [courseRoute, applySkillRun, queueKey]);

  const restartLevel = useCallback((level: Level) => {
    const path = routeBridgePath(courseRoute);
    const taskKeys = new Set(taskKeysForLevel(level, path));
    const trackKeys = new Set(path && level.pathTracks ? [level.pathTracks[path]] : level.trackKeys);
    completedRef.current = completedRef.current.filter((k) => !taskKeys.has(k));
    setCompletedTaskKeys(completedRef.current);
    setCertificateTrackKeys((prev) => prev.filter((k) => !trackKeys.has(k)));

    const clearedFlags = { ...storyFlags };
    for (const flag of storyFlagKeysForTasks(taskKeys)) delete clearedFlags[flag];
    setStoryFlags(clearedFlags);
    saveStoryFlags(learnerId, clearedFlags);

    setCelebrateTrack(null);
    setCelebrateLevel(null);
    setMariaNoteTaskKey(null);
    setProgressEpoch((n) => n + 1);
    restartLevelProgress(level.key);
  }, [learnerId, storyFlags, courseRoute]);

  const getRung = useCallback((skillKey: string) => rungFor(rungMap, skillKey), [rungMap]);

  const recordSkillRun = useCallback((skillKey: string, opts: { clean: boolean }) => {
    applySkillRun(skillKey, opts.clean);
  }, [applySkillRun]);

  const dismissCelebration = useCallback(() => setCelebrateTrack(null), []);
  const dismissLevelCelebration = useCallback(() => setCelebrateLevel(null), []);
  const dismissMariaNote = useCallback(() => setMariaNoteTaskKey(null), []);

  // One object identity per real state change. Without this every provider
  // render (a points tick, a celebration) hands every `useProgress()` consumer
  // a brand-new value and re-renders all of them.
  const value = useMemo<ProgressValue>(
    () => ({
      courseRoute, chooseCourseRoute, routeSaving,
      saveError: isClient && (routeError || (pending.length > 0 && savingCount === 0)),
      saving: savingCount > 0,
      writing,
      retrySave: async () => {
        if (routeError && routeAttempt.current) void chooseCourseRoute(routeAttempt.current);
        for (const item of [...pendingRef.current]) await markComplete(item.taskKey, item.badgeKey, item.submission, item.confidence);
      },
      learnerId,
      displayName,
      completedTaskKeys,
      points: completedTaskKeys.length * POINTS_PER_TASK,
      justEarnedPoints,
      certificateTrackKeys,
      celebrateTrack,
      celebrateLevel,
      currentTrack: activeTrack(completedTaskKeys, routeBridgePath(courseRoute), courseRoute),
      bridgePath: routeBridgePath(courseRoute),
      progressEpoch,
      storyFlags,
      setStoryFlag,
      markComplete,
      restartLevel,
      dismissCelebration,
      dismissLevelCelebration,
      mariaNoteTaskKey,
      dismissMariaNote,
      lang,
      setLang,
      bigText,
      setBigText,
      rungMap,
      getRung,
      recordSkillRun,
      pendingFeedback,
      dismissFeedback,
    }),
    [
      courseRoute, chooseCourseRoute, routeSaving, routeError, pending, savingCount, writing, isClient,
      learnerId,
      displayName,
      completedTaskKeys,
      justEarnedPoints,
      certificateTrackKeys,
      celebrateTrack,
      celebrateLevel,
      progressEpoch,
      storyFlags,
      setStoryFlag,
      markComplete,
      restartLevel,
      dismissCelebration,
      dismissLevelCelebration,
      mariaNoteTaskKey,
      dismissMariaNote,
      lang,
      setLang,
      bigText,
      setBigText,
      rungMap,
      getRung,
      recordSkillRun,
      pendingFeedback,
      dismissFeedback,
    ],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}

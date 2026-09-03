"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { TaskKey } from "@/lib/desktop-content";
import type { Lang } from "@/lib/task-types";
import {
  POINTS_PER_TASK,
  activeTrack,
  findTrackForTask,
  isTrackComplete,
  levelForTrack,
  isLevelComplete,
  nextLevel,
  taskKeysForLevel,
  type Track,
  type Level,
} from "@/lib/tracks-content";
import { completeTask, awardCertificate, persistBridgePath, restartLevelProgress } from "@/app/actions";
import { BRIDGE_PATH_FLAG, inferBridgePath, type BridgePath } from "@/lib/bridge-path";
import { storyFlagKeysForTasks, storyMailAfter, type StoryFlags } from "@/lib/story-beats";
import { applyGapDecay, recordCleanRun, recordMissedRun, rungFor, type Rung, type RungMap } from "@/lib/release-ladder";
import { DEVICE_KEY, learnerKey, storage } from "@/lib/storage";

const loadStoryFlags = (learnerId: string): StoryFlags =>
  storage.getJSON<StoryFlags>(learnerKey.storyFlags(learnerId), {});

const saveStoryFlags = (learnerId: string, flags: StoryFlags) =>
  storage.setJSON(learnerKey.storyFlags(learnerId), flags);

const loadStoredLang = (): Lang => (storage.getString(DEVICE_KEY.lang) === "es" ? "es" : "en");

const loadStoredFlag = (key: string): boolean => storage.getString(key) === "true";

const loadRungMap = (learnerId: string): RungMap =>
  storage.getJSON<RungMap>(learnerKey.rungs(learnerId), {});

const saveRungMap = (learnerId: string, map: RungMap) =>
  storage.setJSON(learnerKey.rungs(learnerId), map);

interface ProgressValue {
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
  markComplete: (taskKey: TaskKey, badgeKey?: string) => void;
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
}

const ProgressContext = createContext<ProgressValue | null>(null);

export function ProgressProvider({
  learnerId,
  displayName,
  initialCompletedTaskKeys,
  initialCertificateTrackKeys,
  initialBridgePath,
  children,
}: {
  learnerId: string;
  displayName: string;
  initialCompletedTaskKeys: TaskKey[];
  initialCertificateTrackKeys: string[];
  initialBridgePath?: BridgePath | null;
  children: ReactNode;
}) {
  const [completedTaskKeys, setCompletedTaskKeys] = useState<TaskKey[]>(initialCompletedTaskKeys);
  const [certificateTrackKeys, setCertificateTrackKeys] = useState<string[]>(initialCertificateTrackKeys);
  const [justEarnedPoints, setJustEarnedPoints] = useState<number | null>(null);
  const [celebrateTrack, setCelebrateTrack] = useState<Track | null>(null);
  const [celebrateLevel, setCelebrateLevel] = useState<Level | null>(null);
  const [progressEpoch, setProgressEpoch] = useState(0);
  const [storyFlags, setStoryFlags] = useState<StoryFlags>(() => {
    const stored = loadStoryFlags(learnerId);
    if (initialBridgePath) return { ...stored, [BRIDGE_PATH_FLAG]: initialBridgePath };
    return stored;
  });
  const [rungMap, setRungMap] = useState<RungMap>(() => {
    const loaded = loadRungMap(learnerId);
    const decayed = applyGapDecay(loaded, new Date().toISOString());
    if (decayed !== loaded) saveRungMap(learnerId, decayed);
    return decayed;
  });
  const [lang, setLangState] = useState<Lang>(() => loadStoredLang());
  const [bigText, setBigTextState] = useState<boolean>(() => loadStoredFlag(DEVICE_KEY.bigText));
  const [mariaNoteTaskKey, setMariaNoteTaskKey] = useState<TaskKey | null>(null);
  const pointsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      const next = { ...prev, [key]: value };
      saveStoryFlags(learnerId, next);
      return next;
    });
    if (key === BRIDGE_PATH_FLAG && (value === "a" || value === "b")) {
      persistBridgePath(value);
    }
  }, [learnerId]);

  // Every state write and side effect here runs *outside* the state updaters —
  // no server action or setState nested inside a setCompletedTaskKeys(prev =>)
  // callback, which would double-fire under StrictMode. The `includes` guard
  // makes a repeat call a no-op.
  const markComplete = useCallback((taskKey: TaskKey, badgeKey?: string) => {
    if (completedTaskKeys.includes(taskKey)) return;
    const next = [...completedTaskKeys, taskKey];
    setCompletedTaskKeys(next);

    const track = findTrackForTask(taskKey);
    if (track && isTrackComplete(track, next)) {
      setCertificateTrackKeys((c) => (c.includes(track.key) ? c : [...c, track.key]));
      awardCertificate(track.key);

      // A level-up moment (when this was the level's last track) takes
      // priority over the smaller per-track celebration - only one modal
      // shows for a task completion that finishes both at once.
      const level = levelForTrack(track.key);
      const path = inferBridgePath(next, storyFlags[BRIDGE_PATH_FLAG]);
      const upcoming = isLevelComplete(level, next, path) ? nextLevel(level) : null;
      if (upcoming?.levelUp) setCelebrateLevel(upcoming);
      else setCelebrateTrack(track);
    }

    if (storyMailAfter(taskKey)) setMariaNoteTaskKey(taskKey);

    setJustEarnedPoints(POINTS_PER_TASK);
    if (pointsTimer.current) clearTimeout(pointsTimer.current);
    pointsTimer.current = setTimeout(() => setJustEarnedPoints(null), 2200);

    completeTask(taskKey, badgeKey);
  }, [completedTaskKeys, storyFlags]);

  const restartLevel = useCallback((level: Level) => {
    const path = inferBridgePath(completedTaskKeys, storyFlags[BRIDGE_PATH_FLAG]);
    const taskKeys = new Set(taskKeysForLevel(level, path));
    const trackKeys = new Set(path && level.pathTracks ? [level.pathTracks[path]] : level.trackKeys);
    setCompletedTaskKeys((prev) => prev.filter((k) => !taskKeys.has(k)));
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
  }, [learnerId, storyFlags, completedTaskKeys]);

  const getRung = useCallback((skillKey: string) => rungFor(rungMap, skillKey), [rungMap]);

  const recordSkillRun = useCallback((skillKey: string, opts: { clean: boolean }) => {
    const now = new Date().toISOString();
    const next = opts.clean
      ? recordCleanRun(rungMap, skillKey, now)
      : recordMissedRun(rungMap, skillKey, now);
    setRungMap(next);
    saveRungMap(learnerId, next);
  }, [learnerId, rungMap]);

  const dismissCelebration = useCallback(() => setCelebrateTrack(null), []);
  const dismissLevelCelebration = useCallback(() => setCelebrateLevel(null), []);
  const dismissMariaNote = useCallback(() => setMariaNoteTaskKey(null), []);

  // One object identity per real state change. Without this every provider
  // render (a points tick, a celebration) hands every `useProgress()` consumer
  // a brand-new value and re-renders all of them.
  const value = useMemo<ProgressValue>(
    () => ({
      learnerId,
      displayName,
      completedTaskKeys,
      points: completedTaskKeys.length * POINTS_PER_TASK,
      justEarnedPoints,
      certificateTrackKeys,
      celebrateTrack,
      celebrateLevel,
      currentTrack: activeTrack(completedTaskKeys, inferBridgePath(completedTaskKeys, storyFlags[BRIDGE_PATH_FLAG])),
      bridgePath: inferBridgePath(completedTaskKeys, storyFlags[BRIDGE_PATH_FLAG]),
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
    }),
    [
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
    ],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}

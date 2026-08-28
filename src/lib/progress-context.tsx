"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
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
import { completeTask, awardCertificate, restartLevelProgress } from "@/app/actions";
import { storyFlagKeysForTasks, storyMailAfter, type StoryFlags } from "@/lib/story-beats";
import { applyGapDecay, recordCleanRun, recordMissedRun, rungFor, type Rung, type RungMap } from "@/lib/release-ladder";

function flagsStorageKey(learnerId: string) {
  return `ws-story-flags:${learnerId}`;
}

function loadStoryFlags(learnerId: string): StoryFlags {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(flagsStorageKey(learnerId));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as StoryFlags;
  } catch {
    return {};
  }
}

function saveStoryFlags(learnerId: string, flags: StoryFlags) {
  try {
    window.localStorage.setItem(flagsStorageKey(learnerId), JSON.stringify(flags));
  } catch {
    // Private browsing can block localStorage. The flag still lives in memory this session.
  }
}

// Device-level settings (not per learner): a shared classroom computer set to
// Spanish or bigger text should stay that way for the next person who needs it.
const LANG_STORAGE_KEY = "ws-lang";
const BIG_TEXT_STORAGE_KEY = "ws-big-text";

function loadStoredLang(): Lang {
  if (typeof window === "undefined") return "en";
  try {
    return window.localStorage.getItem(LANG_STORAGE_KEY) === "es" ? "es" : "en";
  } catch {
    return "en";
  }
}

function loadStoredFlag(key: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
}

function saveSetting(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Private browsing can block localStorage. The setting still lives in memory this session.
  }
}

function rungMapStorageKey(learnerId: string) {
  return `ws-rungs:${learnerId}`;
}

function loadRungMap(learnerId: string): RungMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(rungMapStorageKey(learnerId));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as RungMap;
  } catch {
    return {};
  }
}

function saveRungMap(learnerId: string, map: RungMap) {
  try {
    window.localStorage.setItem(rungMapStorageKey(learnerId), JSON.stringify(map));
  } catch {
    // Private browsing can block localStorage. The rung still lives in memory this session.
  }
}

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
  children,
}: {
  learnerId: string;
  displayName: string;
  initialCompletedTaskKeys: TaskKey[];
  initialCertificateTrackKeys: string[];
  children: ReactNode;
}) {
  const [completedTaskKeys, setCompletedTaskKeys] = useState<TaskKey[]>(initialCompletedTaskKeys);
  const [certificateTrackKeys, setCertificateTrackKeys] = useState<string[]>(initialCertificateTrackKeys);
  const [justEarnedPoints, setJustEarnedPoints] = useState<number | null>(null);
  const [celebrateTrack, setCelebrateTrack] = useState<Track | null>(null);
  const [celebrateLevel, setCelebrateLevel] = useState<Level | null>(null);
  const [progressEpoch, setProgressEpoch] = useState(0);
  const [storyFlags, setStoryFlags] = useState<StoryFlags>(() => loadStoryFlags(learnerId));
  const [rungMap, setRungMap] = useState<RungMap>(() => {
    const loaded = loadRungMap(learnerId);
    const decayed = applyGapDecay(loaded, new Date().toISOString());
    if (decayed !== loaded) saveRungMap(learnerId, decayed);
    return decayed;
  });
  const [lang, setLangState] = useState<Lang>(() => loadStoredLang());
  const [bigText, setBigTextState] = useState<boolean>(() => loadStoredFlag(BIG_TEXT_STORAGE_KEY));
  const [mariaNoteTaskKey, setMariaNoteTaskKey] = useState<TaskKey | null>(null);
  const pointsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    saveSetting(LANG_STORAGE_KEY, next);
  }, []);

  const setBigText = useCallback((on: boolean) => {
    setBigTextState(on);
    saveSetting(BIG_TEXT_STORAGE_KEY, String(on));
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
  }, [learnerId]);

  const markComplete = useCallback((taskKey: TaskKey, badgeKey?: string) => {
    setCompletedTaskKeys((prev) => {
      if (prev.includes(taskKey)) return prev;
      const next = [...prev, taskKey];

      const track = findTrackForTask(taskKey);
      if (track && isTrackComplete(track, next)) {
        setCertificateTrackKeys((c) => (c.includes(track.key) ? c : [...c, track.key]));
        awardCertificate(track.key);

        // A level-up moment (when this was the level's last track) takes
        // priority over the smaller per-track celebration - only one
        // modal shows for a task completion that finishes both at once.
        const level = levelForTrack(track.key);
        const upcoming = isLevelComplete(level, next) ? nextLevel(level) : null;
        if (upcoming?.levelUp) {
          setCelebrateLevel(upcoming);
        } else {
          setCelebrateTrack(track);
        }
      }

      return next;
    });

    if (storyMailAfter(taskKey)) setMariaNoteTaskKey(taskKey);

    setJustEarnedPoints(POINTS_PER_TASK);
    if (pointsTimer.current) clearTimeout(pointsTimer.current);
    pointsTimer.current = setTimeout(() => setJustEarnedPoints(null), 2200);

    completeTask(taskKey, badgeKey);
  }, []);

  const restartLevel = useCallback((level: Level) => {
    const taskKeys = new Set(taskKeysForLevel(level));
    const trackKeys = new Set(level.trackKeys);
    setCompletedTaskKeys((prev) => prev.filter((k) => !taskKeys.has(k)));
    setCertificateTrackKeys((prev) => prev.filter((k) => !trackKeys.has(k)));
    setStoryFlags((prev) => {
      const next = { ...prev };
      for (const flag of storyFlagKeysForTasks(taskKeys)) delete next[flag];
      saveStoryFlags(learnerId, next);
      return next;
    });
    setCelebrateTrack(null);
    setCelebrateLevel(null);
    setMariaNoteTaskKey(null);
    setProgressEpoch((n) => n + 1);
    restartLevelProgress(level.key);
  }, [learnerId]);

  const getRung = useCallback((skillKey: string) => rungFor(rungMap, skillKey), [rungMap]);

  const recordSkillRun = useCallback((skillKey: string, opts: { clean: boolean }) => {
    const now = new Date().toISOString();
    setRungMap((prev) => {
      const next = opts.clean ? recordCleanRun(prev, skillKey, now) : recordMissedRun(prev, skillKey, now);
      saveRungMap(learnerId, next);
      return next;
    });
  }, [learnerId]);

  const dismissCelebration = useCallback(() => setCelebrateTrack(null), []);
  const dismissLevelCelebration = useCallback(() => setCelebrateLevel(null), []);
  const dismissMariaNote = useCallback(() => setMariaNoteTaskKey(null), []);

  return (
    <ProgressContext.Provider
      value={{
        learnerId,
        displayName,
        completedTaskKeys,
        points: completedTaskKeys.length * POINTS_PER_TASK,
        justEarnedPoints,
        certificateTrackKeys,
        celebrateTrack,
        celebrateLevel,
        currentTrack: activeTrack(completedTaskKeys),
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
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}

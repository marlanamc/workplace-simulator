"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import type { TaskKey } from "@/lib/desktop-content";
import {
  POINTS_PER_TASK,
  activeTrack,
  findTrackForTask,
  isTrackComplete,
  levelForTrack,
  isLevelComplete,
  nextLevel,
  type Track,
  type Level,
} from "@/lib/tracks-content";
import { completeTask, awardCertificate } from "@/app/actions";

interface ProgressValue {
  learnerId: string;
  completedTaskKeys: TaskKey[];
  points: number;
  justEarnedPoints: number | null;
  certificateTrackKeys: string[];
  celebrateTrack: Track | null;
  celebrateLevel: Level | null;
  currentTrack: Track;
  markComplete: (taskKey: TaskKey, badgeKey?: string) => void;
  dismissCelebration: () => void;
  dismissLevelCelebration: () => void;
}

const ProgressContext = createContext<ProgressValue | null>(null);

export function ProgressProvider({
  learnerId,
  initialCompletedTaskKeys,
  initialCertificateTrackKeys,
  children,
}: {
  learnerId: string;
  initialCompletedTaskKeys: TaskKey[];
  initialCertificateTrackKeys: string[];
  children: ReactNode;
}) {
  const [completedTaskKeys, setCompletedTaskKeys] = useState<TaskKey[]>(initialCompletedTaskKeys);
  const [certificateTrackKeys, setCertificateTrackKeys] = useState<string[]>(initialCertificateTrackKeys);
  const [justEarnedPoints, setJustEarnedPoints] = useState<number | null>(null);
  const [celebrateTrack, setCelebrateTrack] = useState<Track | null>(null);
  const [celebrateLevel, setCelebrateLevel] = useState<Level | null>(null);
  const pointsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const markComplete = useCallback((taskKey: TaskKey, badgeKey?: string) => {
    setCompletedTaskKeys((prev) => {
      if (prev.includes(taskKey)) return prev;
      const next = [...prev, taskKey];

      const track = findTrackForTask(taskKey);
      if (track && isTrackComplete(track, next)) {
        setCertificateTrackKeys((c) => (c.includes(track.key) ? c : [...c, track.key]));
        awardCertificate(track.key);

        // A level-up moment (when this was the level's last track) takes
        // priority over the smaller per-track celebration — only one
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

    setJustEarnedPoints(POINTS_PER_TASK);
    if (pointsTimer.current) clearTimeout(pointsTimer.current);
    pointsTimer.current = setTimeout(() => setJustEarnedPoints(null), 2200);

    completeTask(taskKey, badgeKey);
  }, []);

  const dismissCelebration = useCallback(() => setCelebrateTrack(null), []);
  const dismissLevelCelebration = useCallback(() => setCelebrateLevel(null), []);

  return (
    <ProgressContext.Provider
      value={{
        learnerId,
        completedTaskKeys,
        points: completedTaskKeys.length * POINTS_PER_TASK,
        justEarnedPoints,
        certificateTrackKeys,
        celebrateTrack,
        celebrateLevel,
        currentTrack: activeTrack(completedTaskKeys),
        markComplete,
        dismissCelebration,
        dismissLevelCelebration,
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

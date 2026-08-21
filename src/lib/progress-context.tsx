"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import type { TaskKey } from "@/lib/desktop-content";
import { POINTS_PER_TASK, activeTrack, findTrackForTask, isTrackComplete, type Track } from "@/lib/tracks-content";
import { completeTask, awardCertificate } from "@/app/actions";

interface ProgressValue {
  completedTaskKeys: TaskKey[];
  points: number;
  justEarnedPoints: number | null;
  certificateTrackKeys: string[];
  celebrateTrack: Track | null;
  currentTrack: Track;
  markComplete: (taskKey: TaskKey, badgeKey?: string) => void;
  dismissCelebration: () => void;
}

const ProgressContext = createContext<ProgressValue | null>(null);

export function ProgressProvider({
  initialCompletedTaskKeys,
  initialCertificateTrackKeys,
  children,
}: {
  initialCompletedTaskKeys: TaskKey[];
  initialCertificateTrackKeys: string[];
  children: ReactNode;
}) {
  const [completedTaskKeys, setCompletedTaskKeys] = useState<TaskKey[]>(initialCompletedTaskKeys);
  const [certificateTrackKeys, setCertificateTrackKeys] = useState<string[]>(initialCertificateTrackKeys);
  const [justEarnedPoints, setJustEarnedPoints] = useState<number | null>(null);
  const [celebrateTrack, setCelebrateTrack] = useState<Track | null>(null);
  const pointsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const markComplete = useCallback((taskKey: TaskKey, badgeKey?: string) => {
    setCompletedTaskKeys((prev) => {
      if (prev.includes(taskKey)) return prev;
      const next = [...prev, taskKey];

      const track = findTrackForTask(taskKey);
      if (track && isTrackComplete(track, next)) {
        setCertificateTrackKeys((c) => (c.includes(track.key) ? c : [...c, track.key]));
        setCelebrateTrack(track);
        awardCertificate(track.key);
      }

      return next;
    });

    setJustEarnedPoints(POINTS_PER_TASK);
    if (pointsTimer.current) clearTimeout(pointsTimer.current);
    pointsTimer.current = setTimeout(() => setJustEarnedPoints(null), 2200);

    completeTask(taskKey, badgeKey);
  }, []);

  const dismissCelebration = useCallback(() => setCelebrateTrack(null), []);

  return (
    <ProgressContext.Provider
      value={{
        completedTaskKeys,
        points: completedTaskKeys.length * POINTS_PER_TASK,
        justEarnedPoints,
        certificateTrackKeys,
        celebrateTrack,
        currentTrack: activeTrack(completedTaskKeys),
        markComplete,
        dismissCelebration,
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

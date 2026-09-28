"use client";

import { useState, useSyncExternalStore, type Dispatch, type SetStateAction } from 'react';
import { useProgress } from './progress-context';
import { useLesson } from './lesson-context';
import { storage } from './storage';
import type { TaskKey } from './desktop-content';
import { readDraft } from './task-draft';

const subscribe = (notify: () => void) => {
  window.addEventListener('storage', notify);
  window.addEventListener('workplace-draft', notify);
  return () => {
    window.removeEventListener('storage', notify);
    window.removeEventListener('workplace-draft', notify);
  };
};

/** Unsaved story work stays on this device, scoped to the signed-in learner.
 * Lessons remain in memory. The server snapshot uses the seed so hydration
 * does not depend on localStorage. Replay/Studio clear the learner's drafts. */
export function useTaskDraft<T>(task: TaskKey, field: string, initial: T | (() => T)): [T, Dispatch<SetStateAction<T>>] {
  const { learnerId } = useProgress();
  const lesson = useLesson();
  const [seed] = useState(initial);
  const [override, setOverride] = useState<{ value: T } | null>(null);
  const key = `ws-task-draft:${learnerId}:${task}:${field}`;
  const raw = useSyncExternalStore(subscribe, () => lesson ? null : storage.getString(key), () => null);
  const saved = readDraft(raw, seed);
  const value = override ? override.value : saved;
  const setValue: Dispatch<SetStateAction<T>> = (next) => {
    const updated = typeof next === 'function' ? (next as (previous: T) => T)(value) : next;
    setOverride({ value: updated });
    if (!lesson) {
      storage.setJSON(key, { value: updated });
      window.dispatchEvent(new Event('workplace-draft'));
    }
  };
  return [value, setValue];
}

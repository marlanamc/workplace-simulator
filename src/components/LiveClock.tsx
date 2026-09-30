"use client";

import { useSyncExternalStore } from "react";
import type { Lang } from "@/lib/desktop-content";
import { storyEpochFor, storyTimeAt } from "@/lib/story-dates";
import { useProgress } from "@/lib/progress-context";
import { storyClockFor } from "@/lib/story-calendar";
import { levelForTrack, nextTaskInTrack } from "@/lib/tracks-content";

/** Shared ticker so the desktop widget and the shelf stay on the same minute. */
const listeners = new Set<() => void>();
let interval: ReturnType<typeof setInterval> | null = null;

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  if (interval === null) {
    interval = setInterval(emit, 1000);
  }
  return () => {
    listeners.delete(onStoreChange);
    if (listeners.size === 0 && interval !== null) {
      clearInterval(interval);
      interval = null;
    }
  };
}

function minuteStamp() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}-${d.getMinutes()}`;
}

function useNow() {
  useSyncExternalStore(subscribe, minuteStamp, minuteStamp);
  return new Date();
}

export function formatClock(now: Date, lang: Lang) {
  const locale = lang === "es" ? "es" : "en-US";
  const timeParts = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(now);
  const hour = timeParts.find((p) => p.type === "hour")?.value ?? "";
  const minute = timeParts.find((p) => p.type === "minute")?.value ?? "";
  const dayPeriod = timeParts.find((p) => p.type === "dayPeriod")?.value ?? "";
  return {
    time: dayPeriod ? `${hour}:${minute} ${dayPeriod}` : `${hour}:${minute}`,
    date: new Intl.DateTimeFormat(locale, {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(now),
    dateShort: new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
    }).format(now),
  };
}

/**
 * When each story time was first shown, so the story clock ticks forward
 * from the scene's time ("Thursday, 3:40 PM") at real speed. A cache, not
 * state: the first render of a new story time starts it at zero minutes.
 * Browser only (see storyClock).
 */
const storyEpochs = new Map<string, number>();

function storyClock(now: Date, startsAt: string): string {
  // The server renders the scene's own time. Its cache would outlive every
  // page it served, so it rendered minutes ahead ("9:42" for a 9:40 scene),
  // and the clock keeps its server text until the next minute: the shelf
  // then read ahead of a phone opened later (Wave 5 F-13).
  if (typeof window === "undefined") return startsAt;
  let epoch = storyEpochs.get(startsAt);
  if (epoch === undefined) {
    // From the top of the real minute (see storyEpochFor). Counted from the
    // moment of first render, a clock drawn later (a phone opened in a task)
    // could read a minute behind the shelf.
    epoch = storyEpochFor(now.getTime());
    storyEpochs.set(startsAt, epoch);
  }
  return storyTimeAt(startsAt, epoch, now.getTime());
}

/**
 * The clock the learner sees. Pass `startsAt` (the story's time for this
 * sitting) and it reads the story's time, not the learner's real time, so
 * the desktop agrees with the scene. Without it, it is a real clock.
 */
export function useLiveClock(lang: Lang, startsAt?: string) {
  const now = useNow();
  const clock = formatClock(now, lang);
  return startsAt ? { ...clock, time: storyClock(now, startsAt) } : clock;
}

export function DesktopClock({ lang, startsAt }: { lang: Lang; startsAt?: string }) {
  const clock = useLiveClock(lang, startsAt);
  return (
    <div className="text-white" style={{ textShadow: "0 2px 18px rgba(0,0,0,0.35)" }}>
      <div
        suppressHydrationWarning
        className="text-[72px] font-normal leading-none tracking-[-0.03em] tabular-nums"
      >
        {clock.time}
      </div>
    </div>
  );
}

export function ShelfClock({ lang, startsAt }: { lang: Lang; startsAt?: string }) {
  const clock = useLiveClock(lang, startsAt);
  return (
    <span className="flex flex-col items-end leading-none">
      <span suppressHydrationWarning data-testid="shelf-clock" className="text-[13px] font-medium tabular-nums">
        {clock.time}
      </span>
    </span>
  );
}

/**
 * A phone's status-bar clock ("9:41", no AM/PM), on the same story time as
 * the shelf. The phones on Day 2 read 8:14 and 4:12 while the desktop read
 * 9:57 (Wave 5 F-13).
 */
export function PhoneClock() {
  const { lang, currentTrack, completedTaskKeys } = useProgress();
  const startsAt = storyClockFor(levelForTrack(currentTrack.key), nextTaskInTrack(currentTrack, completedTaskKeys));
  const clock = useLiveClock(lang, startsAt);
  return <span suppressHydrationWarning data-testid="phone-clock">{clock.time.replace(/\s*(AM|PM|a\.\s?m\.|p\.\s?m\.)$/i, "")}</span>;
}

export function QuickSettingsClock({ lang, startsAt }: { lang: Lang; startsAt?: string }) {
  const clock = useLiveClock(lang, startsAt);
  return <span suppressHydrationWarning>{clock.time}</span>;
}

"use client";

import { useSyncExternalStore } from "react";
import type { Lang } from "@/lib/desktop-content";

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
  return {
    time: `${hour}:${minute}`,
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

export function useLiveClock(lang: Lang) {
  return formatClock(useNow(), lang);
}

export function DesktopClock({ lang }: { lang: Lang }) {
  const clock = useLiveClock(lang);
  return (
    <div className="text-white" style={{ textShadow: "0 2px 18px rgba(0,0,0,0.35)" }}>
      <div
        suppressHydrationWarning
        className="text-[72px] font-normal leading-none tracking-[-0.03em] tabular-nums"
      >
        {clock.time}
      </div>
      <div
        suppressHydrationWarning
        className="mt-2 text-[20px] font-normal leading-snug text-white/90"
      >
        {clock.date}
      </div>
    </div>
  );
}

export function ShelfClock({ lang }: { lang: Lang }) {
  const clock = useLiveClock(lang);
  return (
    <span className="flex flex-col items-end leading-none">
      <span suppressHydrationWarning className="text-[13px] font-medium tabular-nums">
        {clock.time}
      </span>
      <span suppressHydrationWarning className="mt-0.5 text-[10px] text-white/70">
        {clock.dateShort}
      </span>
    </span>
  );
}

export function QuickSettingsClock({ lang }: { lang: Lang }) {
  const clock = useLiveClock(lang);
  return (
    <span suppressHydrationWarning>
      {clock.date} · {clock.time}
    </span>
  );
}

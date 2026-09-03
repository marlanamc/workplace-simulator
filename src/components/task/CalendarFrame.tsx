"use client";

import type { ReactNode } from "react";

/**
 * A compact Google Calendar surface — the header with the tear-off "31" mark
 * and the app name, a one-week day strip, and event chips that open a detail
 * card. `CalendarTask` owns the full month grid tied to the story calendar;
 * this is the smaller read-one-event surface for tasks like
 * `ops-report-packet` that just need the learner to open a calendar entry.
 */

export function CalendarMark() {
  return (
    <span className="flex h-8 w-8 flex-col overflow-hidden rounded-[6px] border border-[#dadce0] bg-white shadow-sm">
      <span className="h-2 bg-[#ea4335]" />
      <span className="flex flex-1 items-center justify-center text-[13px] font-medium leading-none text-[#3c4043]">
        31
      </span>
    </span>
  );
}

export function CalendarFrame({
  appName = "Calendar",
  children,
}: {
  appName?: string;
  children: ReactNode;
}) {
  return (
    <div
      className="flex h-full min-h-0 flex-col bg-white text-[14px] text-[#3c4043]"
      style={{ fontFamily: "Roboto, Arial, sans-serif" }}
    >
      <div className="flex items-center gap-3 px-3 py-2">
        <CalendarMark />
        <span className="text-[22px] font-normal text-[#5f6368]">{appName}</span>
      </div>
      {children}
    </div>
  );
}

export interface WeekDay {
  label: string;
  date: number;
  today?: boolean;
}

export interface CalEvent {
  key: string;
  /** Index into the week's days (0-6). */
  dayIndex: number;
  time: string;
  title: string;
  /** Chip color; defaults to Calendar blue. */
  color?: string;
  onOpen: () => void;
}

/** A one-week column strip with event chips. */
export function WeekStrip({ days, events }: { days: WeekDay[]; events: CalEvent[] }) {
  return (
    <div className="overflow-x-auto px-3 pb-3">
      <div className="grid min-w-[560px] grid-cols-7 border-t border-[#dadce0]">
        {days.map((d, i) => (
          <div key={i} className="flex flex-col border-r border-[#dadce0] last:border-r-0">
            <div className="border-b border-[#dadce0] py-2 text-center">
              <div className="text-[11px] font-medium uppercase text-[#70757a]">{d.label}</div>
              <div
                className={`mx-auto mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-[13px] ${
                  d.today ? "bg-[#1a73e8] font-medium text-white" : "text-[#3c4043]"
                }`}
              >
                {d.date}
              </div>
            </div>
            <div className="flex min-h-[96px] flex-col gap-1 p-1">
              {events
                .filter((e) => e.dayIndex === i)
                .map((e) => (
                  <button
                    key={e.key}
                    onClick={e.onOpen}
                    className="truncate rounded px-1.5 py-1 text-left text-[11px] font-medium text-white cursor-pointer"
                    style={{ background: e.color ?? "#1a73e8" }}
                  >
                    {e.time} {e.title}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** The event detail card that opens when a chip is clicked. */
export function EventCard({
  title,
  when,
  organizer,
  body,
  accent = "#1a73e8",
  onClose,
  closeLabel = "Close",
  children,
}: {
  title: string;
  when: string;
  organizer?: string;
  body?: string;
  accent?: string;
  onClose: () => void;
  closeLabel?: string;
  children?: ReactNode;
}) {
  return (
    <div className="absolute inset-0 z-10 flex items-start justify-center bg-black/20 pt-12">
      <div className="w-[min(100%-2rem,420px)] overflow-hidden rounded-3xl bg-white shadow-[0_4px_8px_3px_rgba(60,64,67,.15)]">
        <div className="h-2" style={{ background: accent }} />
        <div className="px-6 pb-5 pt-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <h2 className="text-[22px] font-normal text-[#3c4043]">{title}</h2>
            <button
              onClick={onClose}
              aria-label={closeLabel}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#5f6368] hover:bg-[#f1f3f4] cursor-pointer"
            >
              ×
            </button>
          </div>
          <p className="text-[14px] text-[#3c4043]">{when}</p>
          {organizer && <p className="mt-1 text-[13px] text-[#5f6368]">{organizer}</p>}
          {body && <p className="mt-3 text-[14px] leading-relaxed text-[#3c4043]">{body}</p>}
          {children && <div className="mt-4">{children}</div>}
        </div>
      </div>
    </div>
  );
}

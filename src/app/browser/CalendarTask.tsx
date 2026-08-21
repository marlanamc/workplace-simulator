"use client";

import { useState } from "react";
import { useWindowManager } from "@/lib/window-manager";
import { useProgress } from "@/lib/progress-context";
import {
  MEETING,
  CALENDAR_COPY,
  STARTERS,
  LESSONS,
  CONFIDENCE_OPTIONS,
  WRONG_ACCEPT_HINT,
} from "@/lib/tasks/calendar/content";
import { useNudge } from "@/lib/use-nudge";
import ConfidenceCheck from "@/components/task/ConfidenceCheck";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import AppHeaderTools from "@/components/task/AppHeaderTools";

type View = "home" | "invite" | "compose" | "done";

type Cell = { day: number; other: boolean };

// August 2026: the 1st is a Saturday. Show Jul 26–31 and Sep 1–5 in gray.
const MONTH_CELLS: Cell[] = [
  { day: 26, other: true },
  { day: 27, other: true },
  { day: 28, other: true },
  { day: 29, other: true },
  { day: 30, other: true },
  { day: 31, other: true },
  ...Array.from({ length: 31 }, (_, i) => ({ day: i + 1, other: false })),
  { day: 1, other: true },
  { day: 2, other: true },
  { day: 3, other: true },
  { day: 4, other: true },
  { day: 5, other: true },
];
const TODAY = 21;
const EVENT_DAY = 26;

const SHIFTS = [17, 18, 19, 20, 21, 22, 24, 25, 27, 28, 29, 31];

function CalendarMark() {
  return (
    <span className="flex h-8 w-8 flex-col overflow-hidden rounded-[6px] border border-[#dadce0] bg-white shadow-sm">
      <span className="h-2 bg-[#ea4335]" />
      <span className="flex flex-1 items-center justify-center text-[13px] font-medium leading-none text-[#3c4043]">
        31
      </span>
    </span>
  );
}

export default function CalendarTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("calendar") ? "done" : "home");
  const [body, setBody] = useState("");
  const [confidence, setConfidence] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const { nudge, say } = useNudge();
  const { minimizeActive } = useWindowManager();

  const c = CALENDAR_COPY[lang];
  const T = (en: string, es: string) => (lang === "en" ? en : es);

  const wrongAccept = () => say(WRONG_ACCEPT_HINT[lang]);
  const wrongNo = () =>
    say(
      T(
        "Don't just decline — Maria still needs a huddle. Propose a new time instead.",
        "No solo rechaces — Maria igual necesita la reunión. Propón otro horario."
      )
    );
  const wrongMaybe = () =>
    say(
      T(
        "Maybe leaves Maria waiting. You're off that day — propose a new time.",
        "Quizá deja a Maria esperando. Ese día no trabajas — propón otro horario."
      )
    );
  const wrongShift = () =>
    say(
      T(
        "That's one of your work shifts. Open the meeting on Aug 26 — Weekly Lead Huddle.",
        "Ese es uno de tus turnos. Abre la reunión del 26 de ago — Weekly Lead Huddle."
      )
    );
  const notYet = () =>
    say(
      T(
        "Creating new events is a skill for later — for now, open the invite you already have.",
        "Crear eventos nuevos es una destreza para más adelante — por ahora, abre la invitación que ya tienes."
      )
    );

  const trySend = () => {
    if (!body.trim()) {
      return say(
        T("Write a short message first — even one sentence is fine.", "Primero escribe un mensaje corto — una oración está bien.")
      );
    }
    setView("done");
    markComplete("calendar", "handle_meeting_invite");
  };

  const discard = () => {
    setView("invite");
    setBody("");
  };

  const restart = () => {
    setView("home");
    setBody("");
    setConfidence(null);
  };

  const showingCal = view !== "done";

  return (
    <div className="flex h-full min-h-0 flex-col bg-white text-[14px] text-[#3c4043]" style={{ fontFamily: "Roboto, Arial, sans-serif" }}>
      <div className="flex items-center gap-3 px-3 py-2">
        <div className="flex w-[220px] shrink-0 items-center gap-3 px-2">
          <CalendarMark />
          <span className="text-[22px] font-normal text-[#5f6368]">Calendar</span>
        </div>
        <div className="flex h-12 flex-1 items-center gap-3 rounded-full bg-[#e9eef6] px-4 text-[#444746]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <span className="text-[16px]">{c.searchPlaceholder}</span>
        </div>
        <AppHeaderTools
          helpLabel={c.helpBtn}
          onHelp={() => setHelp(true)}
        />
      </div>

      {view === "done" ? (
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="mx-auto flex max-w-[640px] flex-col gap-5">
            <TaskDoneCard
              kicker={c.sentKicker}
              title={c.doneTitle}
              body={c.doneBody}
              badgeNumber="07"
              badgeName={c.badgeName}
              badgeWhere={c.badgeWhere}
            />
            <ConfidenceCheck
              question={c.confidenceQ}
              options={CONFIDENCE_OPTIONS[lang]}
              selected={confidence}
              onSelect={setConfidence}
            />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={restart}
                className="inline-flex min-h-[40px] items-center rounded-full bg-[#0b57d0] px-5 text-[14px] font-medium text-white hover:bg-[#0b57d0]/90 cursor-pointer"
              >
                {c.tryAgain}
              </button>
              <button
                onClick={minimizeActive}
                className="inline-flex min-h-[40px] items-center rounded-full border border-[#747775] px-5 text-[14px] font-medium hover:bg-[#f8f9fa] cursor-pointer"
              >
                {c.backToDesk}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative flex min-h-0 flex-1">
          <div className="flex w-[220px] shrink-0 flex-col gap-4 px-3 pt-1">
            <button
              onClick={notYet}
              className="flex h-14 items-center gap-3 rounded-2xl bg-white px-4 text-[14px] font-medium text-[#3c4043] shadow-[0_1px_2px_0_rgba(60,64,67,.3),0_1px_3px_1px_rgba(60,64,67,.15)] hover:bg-[#f8f9fa] cursor-pointer"
            >
              <span className="text-[22px] leading-none text-[#c5221f]">+</span>
              {c.create}
            </button>

            <div>
              <div className="mb-1 flex items-center justify-between px-1 text-[12px] text-[#3c4043]">
                <span className="font-medium">{c.monthLabel}</span>
                <span className="flex gap-0.5">
                  <button onClick={notYet} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-[#f1f3f4] cursor-pointer" aria-label="Previous month">‹</button>
                  <button onClick={notYet} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-[#f1f3f4] cursor-pointer" aria-label="Next month">›</button>
                </span>
              </div>
              <div className="grid grid-cols-7 text-center text-[10px] text-[#70757a]">
                {c.weekdayLabels.map((d) => (
                  <div key={d} className="py-0.5">{d[0]}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 text-center text-[11px]">
                {MONTH_CELLS.map((cell, i) => (
                  <div key={i} className="flex items-center justify-center py-[1px]">
                    <span
                      className={`flex h-[22px] w-[22px] items-center justify-center rounded-full ${
                        !cell.other && cell.day === TODAY
                          ? "bg-[#1a73e8] text-white"
                          : cell.other
                            ? "text-[#bdc1c6]"
                            : "text-[#3c4043]"
                      }`}
                    >
                      {cell.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-1 px-2 text-[12px] font-medium text-[#5f6368]">{c.myCalendars}</div>
              <CalCheck color="#1a73e8" label={T("Jordan Diaz", "Jordan Diaz")} />
              <CalCheck color="#0b8043" label={c.workShifts} />
              <CalCheck color="#8e24aa" label={c.cafeCalendar} />
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex flex-wrap items-center gap-2 px-2 py-1">
              <button
                onClick={notYet}
                className="inline-flex h-9 items-center rounded-full border border-[#dadce0] px-4 text-[14px] font-medium text-[#3c4043] hover:bg-[#f8f9fa] cursor-pointer"
              >
                {c.todayBtn}
              </button>
              <div className="flex items-center text-[#5f6368]">
                <button onClick={notYet} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#f1f3f4] cursor-pointer" aria-label="Previous month">‹</button>
                <button onClick={notYet} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#f1f3f4] cursor-pointer" aria-label="Next month">›</button>
              </div>
              <h1 className="text-[22px] font-normal text-[#3c4043]">{c.monthLabel}</h1>
              <div className="flex-1" />
              <div className="flex items-center rounded-lg border border-[#dadce0] text-[13px] text-[#3c4043]">
                {[c.viewDay, c.viewWeek, c.viewMonth].map((v, i) => (
                  <button
                    key={v}
                    onClick={notYet}
                    className={`h-8 px-3 cursor-pointer ${
                      i === 2 ? "bg-[#e8f0fe] font-medium text-[#1967d2]" : "hover:bg-[#f1f3f4]"
                    } ${i === 0 ? "rounded-l-lg" : ""} ${i === 2 ? "rounded-r-lg" : ""}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-7 border-t border-[#dadce0] text-center text-[11px] font-medium text-[#70757a]">
              {c.weekdayLabels.map((d) => (
                <div key={d} className="py-2">{d}</div>
              ))}
            </div>
            <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-6">
              {MONTH_CELLS.map((cell, i) => {
                const inMonth = !cell.other;
                const isToday = inMonth && cell.day === TODAY;
                const hasMeeting = inMonth && cell.day === EVENT_DAY;
                const hasShift = inMonth && SHIFTS.includes(cell.day);
                return (
                  <div
                    key={i}
                    className="flex flex-col gap-0.5 border-b border-r border-[#dadce0] p-1"
                  >
                    <span
                      className={`self-center flex h-6 w-6 items-center justify-center rounded-full text-[12px] ${
                        isToday
                          ? "bg-[#1a73e8] font-medium text-white"
                          : inMonth
                            ? "text-[#3c4043]"
                            : "text-[#bdc1c6]"
                      }`}
                    >
                      {cell.day}
                    </span>
                    {hasShift && (
                      <button
                        onClick={wrongShift}
                        className="truncate rounded px-1 py-0.5 text-left text-[11px] font-medium text-white cursor-pointer"
                        style={{ background: "#0b8043" }}
                      >
                        {T("Opening", "Apertura")}
                      </button>
                    )}
                    {hasMeeting && (
                      <button
                        onClick={() => setView("invite")}
                        className="truncate rounded px-1 py-0.5 text-left text-[11px] font-medium text-white cursor-pointer"
                        style={{ background: "#1a73e8" }}
                      >
                        {MEETING.time.split(" – ")[0]} {MEETING.title}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {showingCal && (view === "invite" || view === "compose") && (
            <div className="absolute inset-0 z-10 flex items-start justify-center bg-black/20 pt-16">
              {view === "invite" && (
                <div className="w-[min(100%-2rem,420px)] overflow-hidden rounded-3xl bg-white shadow-[0_4px_8px_3px_rgba(60,64,67,.15)]">
                  <div className="h-2 bg-[#1a73e8]" />
                  <div className="px-6 pb-5 pt-4">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h2 className="text-[22px] font-normal text-[#3c4043]">{MEETING.title}</h2>
                      <button
                        onClick={() => setView("home")}
                        aria-label={T("Close", "Cerrar")}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-[#5f6368] hover:bg-[#f1f3f4] cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-[14px] text-[#3c4043]">
                      {MEETING.day}, {MEETING.date} · {MEETING.time}
                    </p>
                    <p className="mt-1 text-[13px] text-[#5f6368]">
                      {c.invitedBy}: {MEETING.organizer}
                    </p>
                    <p className="mt-3 text-[14px] leading-relaxed text-[#3c4043]">{MEETING.description}</p>
                    <p className="mt-3 text-[13px] text-[#c5221f]">{c.scheduleNote}</p>

                    <div className="mt-4 text-[12px] font-medium text-[#5f6368]">{c.going}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        onClick={wrongAccept}
                        className="min-h-[40px] rounded-full border border-[#dadce0] px-4 text-[14px] font-medium hover:bg-[#f8f9fa] cursor-pointer"
                      >
                        {c.accept}
                      </button>
                      <button
                        onClick={wrongNo}
                        className="min-h-[40px] rounded-full border border-[#dadce0] px-4 text-[14px] font-medium hover:bg-[#f8f9fa] cursor-pointer"
                      >
                        {c.no}
                      </button>
                      <button
                        onClick={wrongMaybe}
                        className="min-h-[40px] rounded-full border border-[#dadce0] px-4 text-[14px] font-medium hover:bg-[#f8f9fa] cursor-pointer"
                      >
                        {c.maybe}
                      </button>
                    </div>
                    <button
                      onClick={() => setView("compose")}
                      className="mt-3 inline-flex min-h-[40px] items-center text-[14px] font-medium text-[#0b57d0] hover:underline cursor-pointer"
                    >
                      {c.proposeTime}
                    </button>
                  </div>
                </div>
              )}

              {view === "compose" && (
                <div className="w-[min(100%-2rem,480px)] overflow-hidden rounded-3xl bg-white shadow-[0_4px_8px_3px_rgba(60,64,67,.15)]">
                  <div className="flex items-center justify-between bg-[#f2f6fc] px-5 py-3">
                    <span className="text-[14px] font-medium text-[#3c4043]">{c.proposeTime}</span>
                    <button
                      onClick={discard}
                      aria-label={c.discard}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[#5f6368] hover:bg-black/5 cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                  <div className="px-5 pt-3">
                    <div className="flex gap-3 border-b border-[#e0e3e8] py-2 text-[13px]">
                      <span className="w-14 shrink-0 text-[#5f6368]">{c.to}</span>
                      <span>maria.delgado@harborsidecafe.com</span>
                    </div>
                    <div className="flex gap-3 border-b border-[#e0e3e8] py-2 text-[13px]">
                      <span className="w-14 shrink-0 text-[#5f6368]">{c.subjectLabel}</span>
                      <span>{c.subject}</span>
                    </div>
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder={c.writeHere}
                      className="min-h-[110px] w-full resize-y border-none py-3 text-[14px] leading-relaxed outline-none placeholder:text-[#767676]"
                    />
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="text-[12px] text-[#5f6368]">{c.startersLabel}:</span>
                      {STARTERS[lang].map((s, i) => (
                        <button
                          key={i}
                          onClick={() => setBody((b) => (b ? b + " " : "") + s)}
                          className="min-h-[32px] rounded-full border border-[#dadce0] px-3 text-[12px] text-[#0b57d0] hover:bg-[#f2f6fc] cursor-pointer"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 pb-4">
                      <button
                        onClick={trySend}
                        className="inline-flex min-h-[36px] items-center rounded-full bg-[#0b57d0] px-6 text-[14px] font-medium text-white hover:bg-[#0b57d0]/90 cursor-pointer"
                      >
                        {c.send}
                      </button>
                      <button
                        onClick={discard}
                        className="min-h-[36px] px-3 text-[13px] text-[#5f6368] cursor-pointer"
                      >
                        {c.discard}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <HelpDrawer
        open={help}
        onClose={() => setHelp(false)}
        kicker={c.lessonKicker}
        lesson={LESSONS[lang][view === "compose" || view === "done" ? 1 : 0]}
        tipLabel={c.tipLabel}
        gotItLabel={c.gotIt}
        askPersonLabel={c.askPerson}
      />

      <NudgeToast text={nudge} bottom={32} />
    </div>
  );
}

function CalCheck({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-full px-2 py-1.5 text-[13px] text-[#3c4043]">
      <span className="flex h-4 w-4 items-center justify-center rounded-[2px]" style={{ background: color }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="white" aria-hidden>
          <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
        </svg>
      </span>
      {label}
    </div>
  );
}

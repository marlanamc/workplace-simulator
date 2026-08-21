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
import type { Lang } from "@/lib/task-types";
import { useNudge } from "@/lib/use-nudge";
import ConfidenceCheck from "@/components/task/ConfidenceCheck";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import { TASK_ICONS, CircleGlyph } from "@/lib/icons";
import TaskDoneCard from "@/components/task/TaskDoneCard";

type View = "home" | "invite" | "compose" | "done";

// August 2026, laid out Sun-Sat. Aug 1 falls on a Saturday.
const AUG_1_WEEKDAY = 6;
const MONTH_CELLS: (number | null)[] = [
  ...Array.from({ length: AUG_1_WEEKDAY }, () => null),
  ...Array.from({ length: 31 }, (_, i) => i + 1),
];
while (MONTH_CELLS.length % 7 !== 0) MONTH_CELLS.push(null);
const TODAY = 21;
const EVENT_DAY = 26;

export default function CalendarTask() {
  const [lang, setLang] = useState<Lang>("en");
  const { markComplete, completedTaskKeys } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("calendar") ? "done" : "home");
  const [body, setBody] = useState("");
  const [confidence, setConfidence] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const { nudge, say } = useNudge();
  const { minimizeActive } = useWindowManager();

  const c = CALENDAR_COPY[lang];

  const wrongAccept = () => say(WRONG_ACCEPT_HINT[lang]);
  const notYet = () =>
    say(
      lang === "en"
        ? "Creating new events is a skill for later — for now, open the invite you already have."
        : "Crear eventos nuevos es una destreza para más adelante — por ahora, abre la invitación que ya tienes."
    );

  const trySend = () => {
    if (!body.trim()) {
      return say(
        lang === "en"
          ? "Write a short message first — even one sentence is fine."
          : "Primero escribe un mensaje corto — una oración está bien."
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

  return (
    <div className="flex h-full min-h-0 flex-col bg-[var(--surface-muted)] text-[15px] text-[var(--text-primary)]">
      <div className="flex items-center gap-3 border-b border-[var(--border)] bg-white px-4 py-3">
        <CircleGlyph icon={TASK_ICONS.calendar} color="#34a853" size={28} />
        <span className="text-[18px] font-medium text-[#5f6368]">Hcal</span>
        <div className="flex-1" />
        <button
          onClick={() => setHelp(true)}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-[var(--warning-tint)] px-3.5 text-[13px] font-medium text-[var(--warning)] hover:brightness-95 cursor-pointer"
        >
          ? {c.helpBtn}
        </button>
        <button
          onClick={() => setLang(lang === "en" ? "es" : "en")}
          className="inline-flex min-h-[40px] items-center rounded-full border border-[var(--border)] px-3.5 text-[13px] font-medium text-[var(--text-primary)] hover:bg-[var(--surface-muted)] cursor-pointer"
        >
          {c.langBtn}
        </button>
      </div>

      <div className={`relative mx-auto min-h-0 w-full flex-1 overflow-y-auto p-6 ${view === "home" ? "max-w-[760px]" : "max-w-[640px]"}`}>
      {view === "home" && (
        <div className="rounded-xl border border-[var(--border)] bg-white">
          <div className="flex flex-wrap items-center gap-3 border-b border-[var(--border)] px-4 py-3">
            <button
              onClick={notYet}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-white px-4 text-[14px] font-medium text-[#3c4043] shadow-sm border border-[var(--border)] hover:bg-[var(--surface-muted)] cursor-pointer"
            >
              <span className="text-[18px] leading-none text-[#34a853]">+</span> {c.create}
            </button>
            <div className="flex items-center gap-1 text-[#5f6368]">
              <button onClick={notYet} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--surface-muted)] cursor-pointer" aria-label="Previous month">‹</button>
              <button onClick={notYet} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--surface-muted)] cursor-pointer" aria-label="Next month">›</button>
            </div>
            <span className="text-[19px] text-[#3c4043]">{c.monthLabel}</span>
            <div className="flex-1" />
            <div className="flex items-center gap-1 rounded-full border border-[var(--border)] p-0.5 text-[13px] text-[#3c4043]">
              {[c.viewDay, c.viewWeek, c.viewMonth].map((v, i) => (
                <button
                  key={v}
                  onClick={notYet}
                  className={`rounded-full px-3 py-1 cursor-pointer ${i === 2 ? "bg-[var(--surface-muted)] font-medium" : "hover:bg-[var(--surface-muted)]"}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-7 border-b border-[var(--border)] text-center text-[11px] font-medium uppercase tracking-wide text-[#5f6368]">
            {c.weekdayLabels.map((d) => (
              <div key={d} className="border-r border-[var(--border)] py-2 last:border-r-0">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {MONTH_CELLS.map((day, i) => (
              <div
                key={i}
                className="flex h-[76px] flex-col gap-1 border-b border-r border-[var(--border)] p-1.5 [&:nth-child(7n)]:border-r-0"
              >
                {day !== null && (
                  <>
                    <span
                      className={`self-start rounded-full px-1.5 text-[12px] ${
                        day === TODAY ? "bg-[#1a73e8] text-white font-medium" : "text-[#3c4043]"
                      }`}
                    >
                      {day}
                    </span>
                    {day === EVENT_DAY && (
                      <button
                        onClick={() => setView("invite")}
                        className="truncate rounded px-1.5 py-0.5 text-left text-[11px] font-medium text-white cursor-pointer"
                        style={{ background: "#1a73e8" }}
                      >
                        {MEETING.time.split(" – ")[0]} {MEETING.title}
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "invite" && (
        <div className="rounded-xl border border-[var(--border)] bg-white p-5">
          <div className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-[var(--accent)]">
            {MEETING.day}, {MEETING.date} · {MEETING.time}
          </div>
          <h3 className="mb-2 text-[19px] font-medium">{MEETING.title}</h3>
          <p className="mb-3 text-[13px] text-[var(--text-tertiary)]">
            {c.invitedBy}: {MEETING.organizer}
          </p>
          <p className="mb-4 max-w-[55ch] text-[15px] leading-relaxed text-[var(--text-secondary)]">
            {MEETING.description}
          </p>

          <div className="mb-4 rounded-lg border border-[var(--warning-tint)] bg-[var(--warning-tint)] px-3.5 py-2.5 text-[13px] font-medium text-[var(--warning)]">
            ⚠ {c.scheduleNote}
          </div>

          <div className="flex flex-wrap gap-2 border-t border-[var(--border)] pt-4">
            <button
              onClick={wrongAccept}
              className="min-h-[44px] rounded-full border border-[var(--border)] px-4 text-[14px] font-medium text-[var(--text-primary)] hover:bg-[var(--surface-muted)] cursor-pointer"
            >
              {c.accept}
            </button>
            <button
              onClick={() => setView("compose")}
              className="min-h-[44px] rounded-full bg-[var(--accent)] px-4 text-[14px] font-medium text-white hover:bg-[var(--accent-hover)] cursor-pointer"
            >
              {c.proposeTime}
            </button>
          </div>
        </div>
      )}

      {view === "compose" && (
        <div className="rounded-xl border border-[var(--border)] bg-white p-5">
          <div className="mb-3 flex gap-3 border-b border-[var(--border)] pb-2.5 text-[14px]">
            <span className="w-14 shrink-0 text-[var(--text-tertiary)]">{c.to}</span>
            <span>maria.delgado@harborsidecafe.com</span>
          </div>
          <div className="mb-3 flex gap-3 border-b border-[var(--border)] pb-2.5 text-[14px]">
            <span className="w-14 shrink-0 text-[var(--text-tertiary)]">{c.subjectLabel}</span>
            <span>{c.subject}</span>
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={c.writeHere}
            className="min-h-[130px] w-full resize-y border-none py-3 text-[16px] leading-relaxed outline-none placeholder:text-[var(--text-tertiary)]"
          />
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-medium text-[var(--text-tertiary)]">{c.startersLabel}:</span>
            {STARTERS[lang].map((s, i) => (
              <button
                key={i}
                onClick={() => setBody((b) => (b ? b + " " : "") + s)}
                className="min-h-[38px] rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 text-[13px] font-medium text-[var(--accent)] hover:bg-[var(--accent-tint)] cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-4">
            <button
              onClick={trySend}
              className="inline-flex min-h-[46px] items-center rounded-full bg-[var(--accent)] px-6 text-[15px] font-medium text-white hover:bg-[var(--accent-hover)] cursor-pointer"
            >
              {c.send}
            </button>
            <button
              onClick={discard}
              className="min-h-[40px] px-2 text-[14px] text-[var(--text-tertiary)] cursor-pointer"
            >
              {c.discard}
            </button>
          </div>
        </div>
      )}

      {view === "done" && (
        <div className="flex flex-col gap-5">
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
              className="inline-flex min-h-[46px] items-center rounded-full bg-[var(--accent)] px-5 text-[15px] font-medium text-white hover:bg-[var(--accent-hover)] cursor-pointer"
            >
              {c.tryAgain}
            </button>
            <button
              onClick={minimizeActive}
              className="inline-flex min-h-[46px] items-center rounded-full border border-[var(--border)] px-5 text-[15px] font-medium text-[var(--text-primary)] hover:bg-[var(--surface-muted)] cursor-pointer"
            >
              {c.backToDesk}
            </button>
          </div>
        </div>
      )}
      </div>

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

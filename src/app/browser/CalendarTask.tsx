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
import TaskDoneCard from "@/components/task/TaskDoneCard";

type View = "invite" | "compose" | "done";

export default function CalendarTask() {
  const [lang, setLang] = useState<Lang>("en");
  const [view, setView] = useState<View>("invite");
  const [body, setBody] = useState("");
  const [confidence, setConfidence] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const { nudge, say } = useNudge();
  const { minimizeActive } = useWindowManager();
  const { markComplete } = useProgress();

  const c = CALENDAR_COPY[lang];

  const wrongAccept = () => say(WRONG_ACCEPT_HINT[lang]);

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
    setView("invite");
    setBody("");
    setConfidence(null);
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-[var(--surface-muted)] text-[15px] text-[var(--text-primary)]">
      <div className="flex items-center gap-3 border-b border-[var(--border)] bg-white px-4 py-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#188038] text-[13px] text-white">
          📅
        </span>
        <span className="text-[15px] font-medium">{c.heading}</span>
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

      <div className="relative mx-auto min-h-0 w-full max-w-[640px] flex-1 overflow-y-auto p-6">
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
        lesson={LESSONS[lang][view === "invite" ? 0 : 1]}
        tipLabel={c.tipLabel}
        gotItLabel={c.gotIt}
        askPersonLabel={c.askPerson}
      />

      <NudgeToast text={nudge} bottom={32} />
    </div>
  );
}

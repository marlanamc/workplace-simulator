"use client";

import { useState } from "react";
import { useWindowManager } from "@/lib/window-manager";
import { useProgress } from "@/lib/progress-context";
import {
  INCIDENT_COPY,
  DEFAULTS,
  STARTERS,
  LESSONS,
  EVENT_INTRO,
  CONFIDENCE_OPTIONS,
} from "@/lib/tasks/incident/content";
import type { Lang } from "@/lib/task-types";
import { useNudge } from "@/lib/use-nudge";
import ConfidenceCheck from "@/components/task/ConfidenceCheck";
import EventIntroCard from "@/components/task/EventIntroCard";
import { TASK_ICONS, CircleGlyph } from "@/lib/icons";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import TaskDoneCard from "@/components/task/TaskDoneCard";

type View = "intro" | "form" | "done";

export default function IncidentTask() {
  const [lang, setLang] = useState<Lang>("en");
  const { markComplete, completedTaskKeys } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("incident") ? "done" : "intro");
  const [when, setWhen] = useState(DEFAULTS.en.when);
  const [where, setWhere] = useState(DEFAULTS.en.where);
  const [what, setWhat] = useState("");
  const [confidence, setConfidence] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const { nudge, say } = useNudge();
  const { minimizeActive } = useWindowManager();

  const c = INCIDENT_COPY[lang];

  const trySubmit = () => {
    if (!when.trim() || !where.trim()) {
      return say(
        lang === "en"
          ? "Fill in when and where it happened before you submit."
          : "Completa cuándo y dónde pasó antes de enviar."
      );
    }
    if (what.trim().length < 15) {
      return say(
        lang === "en"
          ? "Write a sentence or two about what happened, in order."
          : "Escribe una o dos oraciones sobre qué pasó, en orden."
      );
    }
    setView("done");
    markComplete("incident", "write_incident_report");
  };

  const restart = () => {
    setView("form");
    setWhen(DEFAULTS[lang].when);
    setWhere(DEFAULTS[lang].where);
    setWhat("");
    setConfidence(null);
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-[var(--surface-muted)] text-[15px] text-[var(--text-primary)]">
      <div className="flex items-center gap-3 border-b border-[var(--border)] bg-white px-4 py-3">
        <CircleGlyph icon={TASK_ICONS.incident} color="#7248b9" size={28} />
        <span className="text-[18px] font-medium text-[#5f6368]">Hforms</span>
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

      <div className="min-h-0 flex-1 overflow-y-auto p-6">
        {view === "intro" && (
          <EventIntroCard {...EVENT_INTRO[lang]} icon={TASK_ICONS.incident} onContinue={() => setView("form")} />
        )}

        {view === "form" && (
          <div className="mx-auto flex max-w-[640px] flex-col gap-5">
            <div className="rounded-xl border border-[var(--warning-tint)] bg-[var(--warning-tint)] p-4">
              <div className="text-[12px] font-semibold uppercase tracking-wide text-[var(--warning)]">
                {c.scenarioKicker}
              </div>
              <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--text-primary)]">{c.scenario}</p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-white p-5">
              <div className="mb-4 flex flex-wrap gap-4">
                <div className="min-w-[180px] flex-1">
                  <label className="mb-1 block text-[12px] font-medium text-[var(--text-tertiary)]">
                    {c.whenLabel}
                  </label>
                  <input
                    value={when}
                    onChange={(e) => setWhen(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-[14px] outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div className="min-w-[180px] flex-1">
                  <label className="mb-1 block text-[12px] font-medium text-[var(--text-tertiary)]">
                    {c.whereLabel}
                  </label>
                  <input
                    value={where}
                    onChange={(e) => setWhere(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-[14px] outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              <label className="mb-1 block text-[12px] font-medium text-[var(--text-tertiary)]">
                {c.whatLabel}
              </label>
              <textarea
                value={what}
                onChange={(e) => setWhat(e.target.value)}
                placeholder={c.writeHere}
                className="min-h-[130px] w-full resize-y rounded-lg border border-[var(--border)] p-3 text-[16px] leading-relaxed outline-none focus:border-[var(--accent)] placeholder:text-[var(--text-tertiary)]"
              />
              <div className="mb-4 mt-2 flex flex-wrap items-center gap-2">
                <span className="text-[12px] font-medium text-[var(--text-tertiary)]">{c.startersLabel}:</span>
                {STARTERS[lang].map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setWhat((w) => (w ? w + " " : "") + s)}
                    className="min-h-[38px] rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 text-[13px] font-medium text-[var(--accent)] hover:bg-[var(--accent-tint)] cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
                <div className="text-[13px] text-[var(--text-tertiary)]">
                  {c.submitTo}: <span className="font-medium text-[var(--text-primary)]">Maria Delgado, Shift Supervisor</span>
                </div>
                <button
                  onClick={trySubmit}
                  className="inline-flex min-h-[46px] items-center rounded-full bg-[var(--accent)] px-6 text-[15px] font-medium text-white hover:bg-[var(--accent-hover)] cursor-pointer"
                >
                  {c.submit}
                </button>
              </div>
            </div>
          </div>
        )}

        {view === "done" && (
          <div className="mx-auto flex max-w-[640px] flex-col gap-5">
            <TaskDoneCard
              kicker={c.sentKicker}
              title={c.doneTitle}
              body={c.doneBody}
              badgeNumber="05"
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
        lesson={LESSONS[lang][0]}
        tipLabel={c.tipLabel}
        gotItLabel={c.gotIt}
        askPersonLabel={c.askPerson}
      />

      <NudgeToast text={nudge} bottom={32} />
    </div>
  );
}

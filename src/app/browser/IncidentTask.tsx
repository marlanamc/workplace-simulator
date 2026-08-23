"use client";

import { useState, type ReactNode } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  INCIDENT_COPY,
  DEFAULTS,
  STARTERS,
  LESSONS,
  EVENT_INTRO,
  CONFIDENCE_OPTIONS,
} from "@/lib/tasks/incident/content";
import { useNudge } from "@/lib/use-nudge";
import ConfidenceCheck from "@/components/task/ConfidenceCheck";
import EventIntroCard from "@/components/task/EventIntroCard";
import { TASK_ICONS } from "@/lib/icons";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import AppHeaderTools from "@/components/task/AppHeaderTools";
import NeedAStart from "@/components/task/NeedAStart";

type View = "intro" | "form" | "done";

const PURPLE = "#673ab7";

export default function IncidentTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("incident") ? "done" : "intro");
  const [when, setWhen] = useState(DEFAULTS.en.when);
  const [where, setWhere] = useState(DEFAULTS.en.where);
  const [what, setWhat] = useState("");
  const [confidence, setConfidence] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const { nudge, say } = useNudge();

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
    <div className="flex h-full min-h-0 flex-col bg-[#f0ebf8] text-[14px] text-[#202124]" style={{ fontFamily: "Roboto, Arial, sans-serif" }}>
      <div className="flex items-center gap-3 border-b border-[#dadce0] bg-white px-4 py-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-[4px]" style={{ background: PURPLE }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" fill="#d1c4e9" />
            <path d="M8 13h8v1.5H8zm0 3h5v1.5H8z" />
          </svg>
        </span>
        <span className="text-[18px] text-[#5f6368]">Forms</span>
        <div className="flex-1" />
        <AppHeaderTools
          helpLabel={c.helpBtn}
          onHelp={() => setHelp(true)}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {view === "intro" && (
          <div className="p-6">
            <EventIntroCard {...EVENT_INTRO[lang]} icon={TASK_ICONS.incident} onContinue={() => setView("form")} />
          </div>
        )}

        {view === "form" && (
          <div className="mx-auto flex w-full max-w-[640px] flex-col gap-3 px-4 py-6">
            <div className="overflow-hidden rounded-lg bg-white shadow-[0_1px_2px_rgba(0,0,0,.15)]">
              <div className="h-[10px]" style={{ background: PURPLE }} />
              <div className="px-6 pb-5 pt-4">
                <h1 className="text-[32px] font-normal leading-tight text-[#202124]">{c.heading}</h1>
                <p className="mt-2 text-[14px] leading-relaxed text-[#444746]">{c.scenario}</p>
                <p className="mt-3 text-[13px] text-[#d93025]">
                  * {lang === "en" ? "Required" : "Obligatorio"}
                </p>
              </div>
            </div>

            <QuestionCard label={c.whenLabel} required>
              <input
                value={when}
                onChange={(e) => setWhen(e.target.value)}
                className="w-full border-0 border-b border-[#e0e0e0] bg-transparent py-2 text-[16px] outline-none focus:border-b-2 focus:border-[#673ab7]"
              />
            </QuestionCard>

            <QuestionCard label={c.whereLabel} required>
              <input
                value={where}
                onChange={(e) => setWhere(e.target.value)}
                className="w-full border-0 border-b border-[#e0e0e0] bg-transparent py-2 text-[16px] outline-none focus:border-b-2 focus:border-[#673ab7]"
              />
            </QuestionCard>

            <QuestionCard label={c.whatLabel} required>
              <textarea
                value={what}
                onChange={(e) => setWhat(e.target.value)}
                placeholder={c.writeHere}
                className="min-h-[96px] w-full resize-y border-0 border-b border-[#e0e0e0] bg-transparent py-2 text-[16px] leading-relaxed outline-none placeholder:text-[#80868b] focus:border-b-2 focus:border-[#673ab7]"
              />
              <div className="mt-3">
                <NeedAStart
                  lang={lang}
                  starters={STARTERS[lang]}
                  onPick={(s) => setWhat((w) => (w ? w + " " : "") + s)}
                  chipClassName="min-h-[32px] rounded-full border border-[#dadce0] px-3 text-[12px] text-[#673ab7] hover:bg-[#f0ebf8] cursor-pointer"
                />
              </div>
            </QuestionCard>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={trySubmit}
                className="inline-flex min-h-[40px] items-center rounded px-6 text-[14px] font-medium text-white cursor-pointer hover:brightness-95"
                style={{ background: PURPLE }}
              >
                {c.submit}
              </button>
              <p className="text-[12px] text-[#5f6368]">
                {c.submitTo} Maria Delgado
              </p>
            </div>
            <p className="text-[12px] text-[#5f6368]">
              {lang === "en"
                ? "Never submit passwords through this form."
                : "Nunca envíes contraseñas en este formulario."}
            </p>
          </div>
        )}

        {view === "done" && (
          <div className="mx-auto flex max-w-[640px] flex-col gap-5 p-6">
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
            <TaskDoneActions
              tryAgainLabel={c.tryAgain}
              backToDeskLabel={c.backToDesk}
              onTryAgain={restart}
            />
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
      />

      <NudgeToast text={nudge} bottom={32} />
    </div>
  );
}

function QuestionCard({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg bg-white px-6 py-5 shadow-[0_1px_2px_rgba(0,0,0,.15)]">
      <div className="mb-3 text-[16px] text-[#202124]">
        {label}
        {required && <span className="ml-0.5 text-[#d93025]">*</span>}
      </div>
      {children}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  STATUS_REPORT_COPY,
  EVENT_INTRO,
  HINTS,
  STARTERS,
  CC_PICKS,
  CC_EMAIL,
  CC_NAME,
  LESSONS,
  CONFIDENCE_OPTIONS,
  emailMentionsTotal,
} from "@/lib/tasks/status-report/content";
import { STATUS_ROWS, STATUS_TOTAL, isValidSumFormula } from "@/lib/tasks/status-sheet";
import { useNudge } from "@/lib/use-nudge";
import ConfidenceCheck from "@/components/task/ConfidenceCheck";
import EventIntroCard from "@/components/task/EventIntroCard";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import { TAB_ICONS, TASK_ICONS } from "@/lib/icons";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import AppHeaderTools from "@/components/task/AppHeaderTools";
import NeedAStart from "@/components/task/NeedAStart";

type View = "intro" | "home" | "sheet" | "compose" | "done";

export default function StatusReportTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("status-report") ? "done" : "intro");
  const [formula, setFormula] = useState("");
  const [selectedTotal, setSelectedTotal] = useState(true);
  const [body, setBody] = useState("");
  const [ccOpen, setCcOpen] = useState(false);
  const [cc, setCc] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const { nudge, say } = useNudge();
  const c = STATUS_REPORT_COPY[lang];
  const sumOk = isValidSumFormula(formula);

  const tryEmail = () => {
    if (!sumOk) return say(HINTS[lang].formula);
    setView("compose");
  };

  const trySend = () => {
    if (!body.trim()) return say(HINTS[lang].empty);
    if (cc !== CC_EMAIL) return say(HINTS[lang].cc);
    if (!emailMentionsTotal(body)) return say(HINTS[lang].total);
    setView("done");
    markComplete("status-report", "author_sum_and_cc");
  };

  const restart = () => {
    setView("home");
    setFormula("");
    setBody("");
    setCc(null);
    setCcOpen(false);
    setConfidence(null);
  };

  const notYet = () =>
    say(lang === "en" ? "Open your copy, status-week-of-aug-24." : "Abre tu copia, status-week-of-aug-24.");

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-white text-[14px] text-[#202124]" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div className="flex items-center gap-3 border-b border-[#e0e0e0] px-4 py-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#0f9d58] text-white">
          {(() => {
            const Icon = TAB_ICONS.spreadsheet;
            return <Icon size={18} strokeWidth={2.25} />;
          })()}
        </span>
        <span className="text-[18px] text-[#3c4043]">{view === "home" || view === "intro" ? c.appName : c.sheetName}</span>
        <div className="flex-1" />
        <AppHeaderTools helpLabel={c.helpBtn} onHelp={() => setHelp(true)} />
      </div>

      {view === "sheet" && (
        <div className="flex items-center gap-2 border-b border-[#e0e0e0] px-3 py-1.5">
          <span className="min-w-[40px] rounded border border-[#e0e0e0] px-2 py-1 text-center text-[12px] font-medium">
            {selectedTotal ? "B7" : "A1"}
          </span>
          <span className="text-[13px] italic text-[#5f6368]">fx</span>
          {selectedTotal ? (
            <input
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              placeholder="=SUM("
              spellCheck={false}
              className="flex-1 border-l border-[#e0e0e0] px-2 py-1 text-[13px] outline-none"
            />
          ) : (
            <span className="flex-1 border-l border-[#e0e0e0] px-2 py-1 text-[13px]">{c.dayHeader}</span>
          )}
        </div>
      )}

      {view === "intro" && (
        <div className="min-h-0 flex-1 overflow-auto px-6">
          <EventIntroCard {...EVENT_INTRO[lang]} icon={TASK_ICONS["status-report"]} onContinue={() => setView("home")} />
        </div>
      )}

      {view === "home" && (
        <div className="min-h-0 flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-[760px]">
            <h3 className="mb-3 text-[14px] font-medium">{c.recentHeading}</h3>
            <button
              onClick={() => setView("sheet")}
              className="flex w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-white p-4 text-left hover:bg-[var(--surface-muted)] cursor-pointer"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-[#0f9d58] text-white">
                {(() => {
                  const Icon = TAB_ICONS.spreadsheet;
                  return <Icon size={18} strokeWidth={2.25} />;
                })()}
              </span>
              <span>
                <span className="block text-[14px] font-medium">{c.sheetName}</span>
                <span className="block text-[12px] text-[var(--text-tertiary)]">{c.openedLabel}</span>
              </span>
            </button>
            <button onClick={notYet} className="mt-3 text-[12px] text-[#5f6368] cursor-pointer">
              {c.blankLabel}
            </button>
          </div>
        </div>
      )}

      {view === "sheet" && (
        <div className="min-h-0 flex-1 overflow-auto p-4">
          <div className="inline-block border border-[#c0c0c0] text-[13px]">
            <div className="flex">
              <div className="h-6 w-8 border-b border-r border-[#c0c0c0] bg-[#f8f9fa]" />
              {["A", "B"].map((col) => (
                <div key={col} className="flex h-6 w-[140px] items-center justify-center border-b border-r border-[#c0c0c0] bg-[#f8f9fa] text-[12px] text-[#5f6368]">
                  {col}
                </div>
              ))}
            </div>
            <div className="flex">
              <div className="flex h-7 w-8 items-center justify-center border-b border-r border-[#c0c0c0] bg-[#f8f9fa] text-[12px]">1</div>
              <button onClick={() => setSelectedTotal(false)} className="flex h-7 w-[140px] items-center border-b border-r border-[#c0c0c0] bg-[#f8f9fa] px-1.5 font-medium cursor-pointer">{c.dayHeader}</button>
              <div className="flex h-7 w-[140px] items-center border-b border-r border-[#c0c0c0] bg-[#f8f9fa] px-1.5 font-medium">{c.countHeader}</div>
            </div>
            {STATUS_ROWS.map((row, i) => (
              <div key={row.key} className="flex">
                <div className="flex h-7 w-8 items-center justify-center border-b border-r border-[#c0c0c0] bg-[#f8f9fa] text-[12px]">{i + 2}</div>
                <div className="flex h-7 w-[140px] items-center border-b border-r border-[#c0c0c0] px-1.5">{lang === "en" ? row.day : row.dayEs}</div>
                <div className="flex h-7 w-[140px] items-center border-b border-r border-[#c0c0c0] px-1.5">{row.value}</div>
              </div>
            ))}
            <div className="flex">
              <div className="flex h-7 w-8 items-center justify-center border-b border-r border-[#c0c0c0] bg-[#f8f9fa] text-[12px]">7</div>
              <div className="flex h-7 w-[140px] items-center border-b border-r border-[#c0c0c0] px-1.5 font-medium">{c.totalLabel}</div>
              <button
                onClick={() => setSelectedTotal(true)}
                className="flex h-7 w-[140px] items-center border-b border-r border-[#c0c0c0] bg-[#fef7e0] px-1.5 text-left font-medium cursor-pointer"
                style={{ boxShadow: selectedTotal ? "inset 0 0 0 2px #1a73e8" : undefined }}
              >
                {sumOk ? STATUS_TOTAL : formula.trim() ? "#ERROR?" : ""}
              </button>
            </div>
          </div>
          <p className="mt-3 text-[13px] text-[#5f6368]">{c.writeFormula}</p>
          <button
            onClick={tryEmail}
            className="mt-3 inline-flex min-h-[44px] items-center rounded-full bg-[var(--accent)] px-5 text-[15px] font-medium text-white cursor-pointer"
          >
            {c.emailCta}
          </button>
        </div>
      )}

      {view === "compose" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 p-6">
          <div className="w-full max-w-[520px] rounded-xl bg-white p-5 shadow-2xl">
            <div className="mb-3 flex gap-3 border-b border-[var(--border)] pb-2.5 text-[14px]">
              <span className="w-10 shrink-0 text-[var(--text-tertiary)]">{c.to}</span>
              <span>maria.delgado@harborsidecafe.com</span>
            </div>
            <div className="mb-3 flex items-center gap-3 border-b border-[var(--border)] pb-2.5 text-[14px]">
              <span className="w-10 shrink-0 text-[var(--text-tertiary)]">{c.cc}</span>
              {cc ? (
                <span className="rounded-full bg-[#e8f0fe] px-2 py-0.5 text-[13px] text-[#0b57d0]">{CC_NAME}</span>
              ) : (
                <button onClick={() => setCcOpen((v) => !v)} className="text-[13px] font-medium text-[#0b57d0] cursor-pointer">
                  {c.ccAdd}
                </button>
              )}
            </div>
            {ccOpen && !cc && (
              <div className="mb-3 flex flex-col gap-1">
                {CC_PICKS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => {
                      if (!p.ok) return say(HINTS[lang].cc);
                      setCc(p.email);
                      setCcOpen(false);
                    }}
                    className="rounded-lg border border-[#dadce0] px-3 py-2 text-left text-[13px] hover:bg-[#f8f9fa] cursor-pointer"
                  >
                    <span className="font-medium">{p.name}</span>
                    <span className="ml-2 text-[#5f6368]">{p.email}</span>
                  </button>
                ))}
              </div>
            )}
            <div className="mb-3 flex gap-3 border-b border-[var(--border)] pb-2.5 text-[14px]">
              <span className="w-10 shrink-0 text-[var(--text-tertiary)]">{c.subjectLabel}</span>
              <span>{c.subject}</span>
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={c.writeHere}
              className="min-h-[130px] w-full resize-y py-3 text-[16px] leading-relaxed outline-none"
            />
            <NeedAStart lang={lang} starters={STARTERS[lang]} onPick={(s) => setBody((b) => (b ? `${b} ` : "") + s)} />
            <div className="mt-4 flex gap-2 border-t border-[var(--border)] pt-4">
              <button onClick={trySend} className="inline-flex min-h-[46px] items-center rounded-full bg-[var(--accent)] px-6 text-[15px] font-medium text-white cursor-pointer">
                {c.send}
              </button>
              <button onClick={() => { setView("sheet"); setBody(""); }} className="min-h-[40px] px-2 text-[14px] text-[var(--text-tertiary)] cursor-pointer">
                {c.discard}
              </button>
            </div>
          </div>
        </div>
      )}

      {view === "done" && (
        <div className="absolute inset-0 overflow-y-auto bg-[var(--surface-muted)] p-6">
          <div className="mx-auto flex max-w-[640px] flex-col gap-5">
            <TaskDoneCard
              kicker={c.sentKicker}
              title={c.doneTitle}
              body={c.doneBody}
              badgeNumber="11"
              badgeName={c.badgeName}
              badgeWhere={c.badgeWhere}
            />
            <ConfidenceCheck question={c.confidenceQ} options={CONFIDENCE_OPTIONS[lang]} selected={confidence} onSelect={setConfidence} />
            <TaskDoneActions tryAgainLabel={c.tryAgain} backToDeskLabel={c.backToDesk} onTryAgain={restart} />
          </div>
        </div>
      )}

      <HelpDrawer
        open={help}
        onClose={() => setHelp(false)}
        kicker={c.lessonKicker}
        lesson={LESSONS[lang][view === "compose" || view === "done" ? 1 : 0]}
        tipLabel={c.tipLabel}
        gotItLabel={c.gotIt}
      />
      <NudgeToast text={nudge} bottom={32} />
    </div>
  );
}

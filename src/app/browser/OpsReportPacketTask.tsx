"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  OPS_COPY,
  SHEET_ROWS,
  CALENDAR_ITEM,
  PLANTED_WEEK_TOTAL,
  SUMMARY_STARTERS,
  MAIL_STARTERS,
  LESSONS,
  RIGHT_NOW_LABEL,
  RIGHT_NOW_STEPS,
  summaryPullsBoth,
} from "@/lib/tasks/ops-report-packet/content";
import { useNudge } from "@/lib/use-nudge";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import TaskHub from "@/components/task/TaskHub";
import NeedAStart from "@/components/task/NeedAStart";
import { TASK_ICONS } from "@/lib/icons";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import RightNowBar from "@/components/task/RightNowBar";
import { Table2, Calendar, FileText, Send } from "lucide-react";

type View = "hub" | "sheet" | "calendar" | "docs" | "mail" | "done";

export default function OpsReportPacketTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(
    completedTaskKeys.includes("ops-report-packet") ? "done" : "hub",
  );
  const [confirmed, setConfirmed] = useState(false);
  const [noted, setNoted] = useState(false);
  const [summary, setSummary] = useState("");
  const [summarySaved, setSummarySaved] = useState(false);
  const [message, setMessage] = useState("");
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const c = OPS_COPY[lang];

  const stepIndex =
    view === "hub" ? 0 : view === "sheet" ? 1 : view === "calendar" ? 2 : view === "docs" ? 3 : 4;

  const finishIfReady = (sheet: boolean, cal: boolean, docs: boolean, sent: boolean) => {
    if (sheet && cal && docs && sent) {
      setView("done");
      markComplete("ops-report-packet", "weekly_report_packet");
    } else {
      setView("hub");
    }
  };

  const saveSheet = () => {
    if (!confirmed) return say(c.needConfirm);
    finishIfReady(true, noted, summarySaved, false);
  };

  const saveCalendar = () => {
    if (!noted) return say(c.needNoted);
    finishIfReady(confirmed, true, summarySaved, false);
  };

  const saveDocs = () => {
    if (!summaryPullsBoth(summary)) return say(c.needSummary);
    setSummarySaved(true);
    finishIfReady(confirmed, noted, true, false);
  };

  const sendPacket = () => {
    if (!confirmed || !noted || !summarySaved) return say(c.needSend);
    finishIfReady(confirmed, noted, summarySaved, true);
  };

  const restart = () => {
    setView("hub");
    setConfirmed(false);
    setNoted(false);
    setSummary("");
    setSummarySaved(false);
    setMessage("");
  };

  if (view === "done") {
    return (
      <div className="flex h-full min-h-0 flex-col bg-white" style={{ fontFamily: "Roboto, Arial, sans-serif" }}>
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="mx-auto flex max-w-[640px] flex-col gap-5">
            <TaskDoneCard kicker={c.sentKicker} />
            <TaskDoneActions kicker={c.sentKicker} tryAgainLabel={c.tryAgain} backToDeskLabel={c.backToDesk} onTryAgain={restart} />
          </div>
        </div>
        <NudgeToast text={nudge} onDismiss={dismiss} />
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-[#f8f9fa] text-[14px] text-[#202124]" style={{ fontFamily: "Roboto, Arial, sans-serif" }}>
      <div className="flex items-center gap-3 border-b border-[#e0e0e0] bg-white px-4 py-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded bg-[#0f9d58] text-white">
          {(() => {
            const Icon = TASK_ICONS["ops-report-packet"];
            return <Icon size={18} strokeWidth={2.25} />;
          })()}
        </span>
        <span className="text-[18px] text-[#3c4043]">{c.appName}</span>
      </div>

      <RightNowBar
        icon={TASK_ICONS["ops-report-packet"]}
        stepIndex={stepIndex}
        steps={RIGHT_NOW_STEPS}
        lang={lang}
        rightNowLabel={RIGHT_NOW_LABEL}
        onHelp={() => setHelp(true)}
      />

      {view === "hub" && (
        <div className="min-h-0 flex-1 overflow-auto">
          <TaskHub
            heading={c.hubHeading}
            items={[
              { key: "sheet", color: "#0f9d58", icon: Table2, title: c.sheetTitle, body: c.sheetBody, done: confirmed, cta: c.sheetCta, onOpen: () => setView("sheet") },
              { key: "calendar", color: "#34a853", icon: Calendar, title: c.calTitle, body: c.calBody, done: noted, cta: c.calCta, onOpen: () => setView("calendar") },
              { key: "docs", color: "#1a73e8", icon: FileText, title: c.docsTitle, body: c.docsBody, done: summarySaved, cta: c.docsCta, onOpen: () => setView("docs") },
              { key: "mail", color: "#ea4335", icon: Send, title: c.mailTitle, body: c.mailBody, done: false, cta: c.mailCta, onOpen: () => setView("mail") },
            ]}
          />
        </div>
      )}

      {view === "sheet" && (
        <div className="min-h-0 flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-[480px]">
            <div className="text-[12px] font-medium uppercase tracking-wide text-[#5f6368]">{c.sheetHeader}</div>
            <div className="mt-3 inline-block border border-[#c0c0c0] text-[13px]">
              {SHEET_ROWS.map((row) => (
                <div key={row.label.en} className="flex">
                  <div className="w-[120px] border-b border-r border-[#c0c0c0] px-2 py-1.5">{row.label[lang]}</div>
                  <div className="w-[100px] border-b border-[#c0c0c0] px-2 py-1.5 text-right tabular-nums">${row.value}</div>
                </div>
              ))}
              <div className="flex bg-[#f8f9fa] font-medium">
                <div className="w-[120px] border-r border-[#c0c0c0] px-2 py-1.5">{c.totalLabel}</div>
                <div className="w-[100px] px-2 py-1.5 text-right tabular-nums">${PLANTED_WEEK_TOTAL.toLocaleString("en-US")}</div>
              </div>
            </div>
            <label className="mt-4 flex items-center gap-2 text-[14px] cursor-pointer">
              <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
              {c.confirmTotal}
            </label>
            <div className="mt-4 flex gap-3">
              <button onClick={saveSheet} className="inline-flex min-h-[44px] items-center rounded-full bg-accent px-5 text-[15px] font-medium text-white cursor-pointer">
                {lang === "en" ? "Done here" : "Listo aquí"}
              </button>
              <button onClick={() => setView("hub")} className="text-[13px] text-[#5f6368] cursor-pointer">←</button>
            </div>
          </div>
        </div>
      )}

      {view === "calendar" && (
        <div className="min-h-0 flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-[420px]">
            <div className="text-[12px] font-medium uppercase tracking-wide text-[#5f6368]">{c.calHeader}</div>
            <div className="mt-3 overflow-hidden rounded-2xl border border-[#dadce0] bg-white">
              <div className="h-2 bg-[#d93025]" />
              <p className="px-5 py-4 text-[14px] leading-relaxed">{CALENDAR_ITEM[lang]}</p>
            </div>
            <label className="mt-4 flex items-center gap-2 text-[14px] cursor-pointer">
              <input type="checkbox" checked={noted} onChange={(e) => setNoted(e.target.checked)} />
              {c.calNoted}
            </label>
            <div className="mt-4 flex gap-3">
              <button onClick={saveCalendar} className="inline-flex min-h-[44px] items-center rounded-full bg-accent px-5 text-[15px] font-medium text-white cursor-pointer">
                {lang === "en" ? "Done here" : "Listo aquí"}
              </button>
              <button onClick={() => setView("hub")} className="text-[13px] text-[#5f6368] cursor-pointer">←</button>
            </div>
          </div>
        </div>
      )}

      {view === "docs" && (
        <div className="min-h-0 flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-[560px]">
            <label className="text-[12px] font-medium uppercase tracking-wide text-[#5f6368]">{c.docsLabel}</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder={c.docsPlaceholder}
              rows={5}
              className="mt-2 w-full resize-y rounded-xl border border-[#dadce0] p-3 text-[15px] leading-relaxed outline-none focus:border-[#1a73e8]"
            />
            <div className="mt-2">
              <NeedAStart lang={lang} starters={SUMMARY_STARTERS[lang]} onPick={(s) => setSummary((b) => (b ? `${b} ` : "") + s)} />
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={saveDocs} className="inline-flex min-h-[44px] items-center rounded-full bg-accent px-5 text-[15px] font-medium text-white cursor-pointer">
                {c.docsSave}
              </button>
              <button onClick={() => setView("hub")} className="text-[13px] text-[#5f6368] cursor-pointer">←</button>
            </div>
          </div>
        </div>
      )}

      {view === "mail" && (
        <div className="min-h-0 flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-[560px]">
            <div className="text-[13px] text-[#5f6368]">{c.mailTo}</div>
            <div className="mt-1 text-[15px] font-medium">{c.mailSubject}</div>
            <label className="mt-4 block text-[12px] font-medium uppercase tracking-wide text-[#5f6368]">{c.mailLabel}</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={c.mailPlaceholder}
              rows={3}
              className="mt-2 w-full resize-y rounded-xl border border-[#dadce0] p-3 text-[15px] leading-relaxed outline-none focus:border-[#1a73e8]"
            />
            <div className="mt-2">
              <NeedAStart lang={lang} starters={MAIL_STARTERS[lang]} onPick={(s) => setMessage((b) => (b ? `${b} ` : "") + s)} />
            </div>
            {summarySaved && (
              <div className="mt-3 rounded-lg border border-[#dadce0] bg-white px-3 py-2 text-[13px] text-[#5f6368]">
                {lang === "en" ? "Attached: Weekly summary" : "Adjunto: Resumen semanal"}
              </div>
            )}
            <div className="mt-4 flex gap-3">
              <button onClick={sendPacket} className="inline-flex min-h-[44px] items-center rounded-full bg-accent px-5 text-[15px] font-medium text-white cursor-pointer">
                {c.send}
              </button>
              <button onClick={() => setView("hub")} className="text-[13px] text-[#5f6368] cursor-pointer">←</button>
            </div>
          </div>
        </div>
      )}

      <HelpDrawer
        open={help}
        onClose={() => setHelp(false)}
        kicker={c.lessonKicker}
        lesson={LESSONS[lang][0]}
        tipLabel={c.tipLabel}
        gotItLabel={c.gotIt}
      />
      <NudgeToast text={nudge} onDismiss={dismiss} />
    </div>
  );
}

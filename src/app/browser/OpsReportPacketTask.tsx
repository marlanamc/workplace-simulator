"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  OPS_COPY,
  SHEET_ROWS,
  WEEK_DAYS,
  CALENDAR_EVENT,
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
import { SheetsFrame, ReadOnlyGrid } from "@/components/task/SheetsFrame";
import { CalendarFrame, WeekStrip, EventCard } from "@/components/task/CalendarFrame";
import DocsEditor from "@/components/task/DocsEditor";
import GmailCompose from "@/components/task/GmailCompose";
import { Table2, Calendar, FileText, Send } from "lucide-react";

type View = "hub" | "sheet" | "calendar" | "docs" | "mail" | "done";

const TOTAL_ROW = SHEET_ROWS.length + 2; // header is row 1, six days rows 2-7, total row 8

export default function OpsReportPacketTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(
    completedTaskKeys.includes("ops-report-packet") ? "done" : "hub",
  );
  const [confirmed, setConfirmed] = useState(false);
  const [noted, setNoted] = useState(false);
  const [eventOpen, setEventOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [summarySaved, setSummarySaved] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: string }>({ row: TOTAL_ROW, col: "B" });
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
    setEventOpen(false);
    setSummary("");
    setSummarySaved(false);
    setMessage("");
    setSelectedCell({ row: TOTAL_ROW, col: "B" });
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

  const backToHub = (
    <button
      onClick={() => setView("hub")}
      className="text-[13px] font-medium text-[#0b57d0] cursor-pointer hover:underline"
    >
      ← {c.backHub}
    </button>
  );

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-[#f8f9fa] text-[14px] text-[#202124]" style={{ fontFamily: "Roboto, Arial, sans-serif" }}>
      {view === "hub" && (
        <div className="flex items-center gap-3 border-b border-[#e0e0e0] bg-white px-4 py-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded bg-[#0f9d58] text-white">
            {(() => {
              const Icon = TASK_ICONS["ops-report-packet"];
              return <Icon size={18} strokeWidth={2.25} />;
            })()}
          </span>
          <span className="text-[18px] text-[#3c4043]">{c.appName}</span>
        </div>
      )}

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
        <div className="min-h-0 flex-1 overflow-hidden">
          <SheetsFrame fileName={c.sheetFileName}>
            <ReadOnlyGrid
              columns={[
                { key: "A", width: 120, header: c.dayCol },
                { key: "B", width: 110, header: c.salesCol },
              ]}
              rows={[
                ...SHEET_ROWS.map((r, i) => ({
                  row: i + 2,
                  cells: { A: r.label[lang], B: `$${r.value}` },
                })),
                {
                  row: TOTAL_ROW,
                  total: true,
                  cells: { A: c.totalLabel, B: `$${PLANTED_WEEK_TOTAL.toLocaleString("en-US")}` },
                },
              ]}
              formulaFor={(row, col) =>
                row === TOTAL_ROW && col === "B" ? `=SUM(B2:B${TOTAL_ROW - 1})` : undefined
              }
              selected={selectedCell}
              onSelect={setSelectedCell}
            />
            <div className="border-t border-[#e0e0e0] bg-white px-4 py-3">
              <label className="flex items-center gap-2 text-[14px] cursor-pointer">
                <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
                {c.confirmTotal}
              </label>
              <div className="mt-3 flex items-center gap-4">
                <button onClick={saveSheet} className="inline-flex min-h-[40px] items-center rounded-lg bg-[#1a73e8] px-5 text-[14px] font-medium text-white cursor-pointer">
                  {lang === "en" ? "Done here" : "Listo aquí"}
                </button>
                {backToHub}
              </div>
            </div>
          </SheetsFrame>
        </div>
      )}

      {view === "calendar" && (
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <CalendarFrame appName={c.calAppName}>
            <WeekStrip
              days={WEEK_DAYS.map((d, i) => ({ label: d.label[lang], date: d.date, today: i === 0 }))}
              events={[
                {
                  key: "morning-open",
                  dayIndex: CALENDAR_EVENT.dayIndex,
                  time: CALENDAR_EVENT.time[lang],
                  title: CALENDAR_EVENT.title[lang],
                  color: "#d93025",
                  onOpen: () => setEventOpen(true),
                },
              ]}
            />
            <div className="border-t border-[#dadce0] bg-white px-4 py-3">
              <label className="flex items-center gap-2 text-[14px] cursor-pointer">
                <input type="checkbox" checked={noted} onChange={(e) => setNoted(e.target.checked)} />
                {c.calNoted}
              </label>
              <div className="mt-3 flex items-center gap-4">
                <button onClick={saveCalendar} className="inline-flex min-h-[40px] items-center rounded-lg bg-[#1a73e8] px-5 text-[14px] font-medium text-white cursor-pointer">
                  {lang === "en" ? "Done here" : "Listo aquí"}
                </button>
                {backToHub}
              </div>
            </div>
          </CalendarFrame>
          {eventOpen && (
            <EventCard
              title={CALENDAR_EVENT.title[lang]}
              when={CALENDAR_EVENT.detailWhen[lang]}
              body={CALENDAR_EVENT.detailBody[lang]}
              accent="#d93025"
              onClose={() => setEventOpen(false)}
            >
              <button
                onClick={() => {
                  setNoted(true);
                  setEventOpen(false);
                }}
                className="inline-flex min-h-[40px] items-center rounded-full bg-[#1a73e8] px-5 text-[14px] font-medium text-white cursor-pointer"
              >
                {c.calNoteCta}
              </button>
            </EventCard>
          )}
        </div>
      )}

      {view === "docs" && (
        <div className="min-h-0 flex-1 overflow-hidden">
          <DocsEditor
            docTitle={c.docsFileName}
            body={summary}
            onBody={setSummary}
            placeholder={c.docsPlaceholder}
            lang={lang}
          >
            <NeedAStart lang={lang} starters={SUMMARY_STARTERS[lang]} onPick={(s) => setSummary((b) => (b ? `${b} ` : "") + s)} />
            <div className="mt-4 flex items-center gap-4">
              <button onClick={saveDocs} className="inline-flex min-h-[40px] items-center rounded-lg bg-[#1a73e8] px-5 text-[14px] font-medium text-white cursor-pointer">
                {c.docsSave}
              </button>
              {backToHub}
            </div>
          </DocsEditor>
        </div>
      )}

      {view === "mail" && (
        <div className="min-h-0 flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-[560px]">
            <GmailCompose
              to={c.mailToValue}
              subject={c.mailSubjectValue}
              body={message}
              onBody={setMessage}
              placeholder={c.mailPlaceholder}
              toLabel={c.toLabel}
              subjectLabel={c.subjectLabel}
              sendLabel={c.send}
              onSend={sendPacket}
              attachment={
                summarySaved
                  ? { name: c.attachmentName, kind: "DOC", size: "18 KB", color: "#1a73e8" }
                  : null
              }
            >
              <NeedAStart lang={lang} starters={MAIL_STARTERS[lang]} onPick={(s) => setMessage((b) => (b ? `${b} ` : "") + s)} />
            </GmailCompose>
            <div className="mt-3">
              {backToHub}
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

"use client";

import SheetEmailMenu from "@/components/task/SheetEmailMenu";

import { useEffect, useState } from "react";
import { Undo2 } from "lucide-react";
import { useTaskDraft } from "@/lib/use-task-draft";
import {
  CELLS_ARE_SET,
  UNDO_FIRST,
  UNDO_LABEL,
  UNDO_STEPS,
  UNDO_TARGET,
  UNDONE_STATUS,
  afterDelete,
  afterUndo,
  cellShows,
  isDeleteKey,
  isUndoShortcut,
  type RowKey,
  type UndoStage,
} from "@/lib/tasks/status-report/undo";
import { useProgress } from "@/lib/progress-context";
import { CAST } from "@/lib/cast";
import {
  STATUS_REPORT_COPY,
  HINTS,
  STARTERS,
  CC_PICKS,
  CC_EMAIL,
  CC_NAME,
  LESSONS,
  emailMentionsTotal,
  describeSubmission,
  RIGHT_NOW_STEPS,
  RIGHT_NOW_LABEL,
} from "@/lib/tasks/status-report/content";
import { COPY_NAME, STATUS_ROWS, totalCellShows, totalProblem } from "@/lib/tasks/status-sheet";
import { useNudge } from "@/lib/use-nudge";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import { TAB_ICONS, TASK_ICONS } from "@/lib/icons";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import RightNowBar from "@/components/task/RightNowBar";
import NeedAStart from "@/components/task/NeedAStart";
import ShowMeHighlight from "@/components/task/ShowMeHighlight";
import { useShowMe, SHOW_ME_POINTER } from "@/lib/use-show-me";

type View = "home" | "sheet" | "compose" | "done";

export default function StatusReportTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("status-report") ? "done" : "home");
  const [formula, setFormula] = useState("");
  const [selectedTotal, setSelectedTotal] = useState(true);
  // Day 12's Undo practice (Wave 4). Kept as a draft, so a reload does not repeat it.
  const [undoStage, setUndoStage] = useTaskDraft<UndoStage>("status-report", "undo-stage", "delete");
  const [cleared, setCleared] = useTaskDraft<RowKey | null>("status-report", "undo-cleared", null);
  const [selectedRow, setSelectedRow] = useState<RowKey | null>(null);
  const [undoneNote, setUndoneNote] = useState(false);
  const [body, setBody] = useState("");
  const [ccOpen, setCcOpen] = useState(false);
  const [cc, setCc] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const showMe = useShowMe();
  const c = STATUS_REPORT_COPY[lang];

  const deleteSelected = () => {
    const next = afterDelete(undoStage, cleared, selectedRow);
    if (next.stage === undoStage) return;
    showMe.clear();
    setCleared(next.cleared);
    setUndoStage(next.stage);
  };

  const undo = () => {
    const next = afterUndo(undoStage, cleared);
    if (next.stage === undoStage) return;
    showMe.clear();
    setCleared(next.cleared);
    setUndoStage(next.stage);
    setSelectedRow(null);
    setSelectedTotal(true);
    setUndoneNote(true);
  };

  // Ctrl+Z works anywhere on the sheet, the way it does in Sheets. Only while
  // there is something to undo, so the formula box keeps its own Undo.
  useEffect(() => {
    if (view !== "sheet" || undoStage !== "undo") return;
    const onKey = (e: KeyboardEvent) => {
      if (!isUndoShortcut(e)) return;
      e.preventDefault();
      undo();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const tryEmail = () => {
    if (undoStage !== "done") return say(UNDO_FIRST[lang]);
    const problem = totalProblem(formula);
    if (problem) return say(HINTS[lang][problem]);
    setView("compose");
  };

  const trySend = () => {
    if (!body.trim()) return say(HINTS[lang].empty);
    if (cc !== CC_EMAIL) return say(HINTS[lang].cc);
    if (!emailMentionsTotal(body)) return say(HINTS[lang].total);
    setView("done");
    markComplete("status-report", "author_sum_and_cc", describeSubmission({ formula, body }, lang));
  };

  const restart = () => {
    setView("home");
    setUndoStage("delete");
    setCleared(null);
    setUndoneNote(false);
    setFormula("");
    setBody("");
    setCc(null);
    setCcOpen(false);
  };

  const showMeId =
    view === "home" ? "open-file" : view === "sheet" && undoStage === "delete" ? "friday-cell" : view === "sheet" && undoStage === "undo" ? "undo-button" : null;

  const notYet = () =>
    say(lang === "en" ? `Open your copy, ${COPY_NAME}.` : `Abre tu copia, ${COPY_NAME}.`);

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-white text-[14px] text-[#202124]" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div className="flex items-center gap-3 border-b border-[#e0e0e0] px-4 py-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#0f9d58] text-white">
          {(() => {
            const Icon = TAB_ICONS.spreadsheet;
            return <Icon size={18} strokeWidth={2.25} />;
          })()}
        </span>
        <span className="text-[18px] text-[#3c4043]">{view === "home" ? c.appName : c.sheetName}</span>
        <div className="flex-1" />
      </div>

      {(view === "sheet" || view === "compose") && <SheetEmailMenu lang={lang} onEmail={tryEmail} />}

      {view !== "done" && (
        <RightNowBar
          icon={TASK_ICONS["status-report"]}
          stepIndex={view === "home" ? 0 : view === "compose" ? 4 : undoStage === "delete" ? 1 : undoStage === "undo" ? 2 : 3}
          steps={RIGHT_NOW_STEPS}
          // The Undo practice is spelled out even in Act II: it is asked for, not discovered.
          goal={view === "sheet" && undoStage !== "done" ? UNDO_STEPS[undoStage] : undefined}
          lang={lang}
          rightNowLabel={RIGHT_NOW_LABEL}
          onShowMe={showMeId ? () => showMe.toggleFor(showMeId) : undefined}
          showMeActive={showMe.targetId === showMeId}
          onHelp={() => setHelp(true)}
        />
      )}
      <ShowMeHighlight targetId={showMe.targetId} label={SHOW_ME_POINTER[lang]} onDismiss={showMe.clear} />

      {view === "sheet" && (
        <div className="flex items-center gap-2 border-b border-[#e0e0e0] px-3 py-1">
          <button
            type="button"
            data-testid="sheet-undo"
            data-showme="undo-button"
            data-card-avoid
            aria-label={UNDO_LABEL[lang]}
            title={UNDO_LABEL[lang]}
            onClick={undo}
            className="flex h-8 w-8 items-center justify-center rounded text-[#444746] hover:bg-[#f1f3f4] cursor-pointer"
          >
            <Undo2 size={18} strokeWidth={2} aria-hidden />
          </button>
          {undoneNote && <span role="status" className="text-[12px] text-[#137333]">{UNDONE_STATUS[lang]}</span>}
        </div>
      )}

      {view === "sheet" && (
        <div className="flex items-center gap-2 border-b border-[#e0e0e0] px-3 py-1.5">
          <span className="min-w-[40px] rounded border border-[#e0e0e0] px-2 py-1 text-center text-[12px] font-medium">
            {selectedRow ? `B${STATUS_ROWS.findIndex((r) => r.key === selectedRow) + 2}` : selectedTotal ? "B7" : "A1"}
          </span>
          <span className="text-[13px] italic text-[#5f6368]">fx</span>
          {selectedRow ? (
            <span className="flex-1 border-l border-[#e0e0e0] px-2 py-1 text-[13px]">{cellShows(selectedRow, cleared)}</span>
          ) : selectedTotal ? (
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

      {view === "home" && (
        <div className="min-h-0 flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-[760px]">
            <h3 className="mb-3 text-[14px] font-medium">{c.recentHeading}</h3>
            <button
              onClick={() => setView("sheet")}
              data-showme="open-file"
              className="flex w-full items-center gap-3 rounded-xl border border-border bg-white p-4 text-left hover:bg-surface-muted cursor-pointer"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-[#0f9d58] text-white">
                {(() => {
                  const Icon = TAB_ICONS.spreadsheet;
                  return <Icon size={18} strokeWidth={2.25} />;
                })()}
              </span>
              <span>
                <span className="block text-[14px] font-medium">{c.sheetName}</span>
                <span className="block text-[12px] text-text-tertiary">{c.openedLabel}</span>
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
              <button onClick={() => { setSelectedRow(null); setSelectedTotal(false); }} className="flex h-7 w-[140px] items-center border-b border-r border-[#c0c0c0] bg-[#f8f9fa] px-1.5 font-medium cursor-pointer">{c.dayHeader}</button>
              <div className="flex h-7 w-[140px] items-center border-b border-r border-[#c0c0c0] bg-[#f8f9fa] px-1.5 font-medium">{c.countHeader}</div>
            </div>
            {STATUS_ROWS.map((row, i) => (
              <div key={row.key} className="flex">
                <div className="flex h-7 w-8 items-center justify-center border-b border-r border-[#c0c0c0] bg-[#f8f9fa] text-[12px]">{i + 2}</div>
                <div className="flex h-7 w-[140px] items-center border-b border-r border-[#c0c0c0] px-1.5">{lang === "en" ? row.day : row.dayEs}</div>
                <button
                  type="button"
                  data-testid={`status-cell-${row.key}`}
                  data-showme={row.key === UNDO_TARGET ? "friday-cell" : undefined}
                  aria-label={`B${i + 2}`}
                  onClick={() => {
                    if (undoStage !== "delete") return say(CELLS_ARE_SET[lang]);
                    showMe.clear();
                    setSelectedTotal(false);
                    setSelectedRow(row.key);
                  }}
                  onKeyDown={(e) => {
                    if (isDeleteKey(e.key) && selectedRow === row.key) {
                      e.preventDefault();
                      deleteSelected();
                    }
                  }}
                  className="flex h-7 w-[140px] items-center border-b border-r border-[#c0c0c0] px-1.5 text-left cursor-pointer"
                  style={{ boxShadow: selectedRow === row.key ? "inset 0 0 0 2px #1a73e8" : undefined }}
                >
                  {cellShows(row.key, cleared)}
                </button>
              </div>
            ))}
            <div className="flex">
              <div className="flex h-7 w-8 items-center justify-center border-b border-r border-[#c0c0c0] bg-[#f8f9fa] text-[12px]">7</div>
              <div className="flex h-7 w-[140px] items-center border-b border-r border-[#c0c0c0] px-1.5 font-medium">{c.totalLabel}</div>
              <button
                data-testid="status-total-cell"
                onClick={() => { setSelectedRow(null); setSelectedTotal(true); }}
                className="flex h-7 w-[140px] items-center border-b border-r border-[#c0c0c0] bg-[#fef7e0] px-1.5 text-left font-medium cursor-pointer"
                style={{ boxShadow: selectedTotal ? "inset 0 0 0 2px #1a73e8" : undefined }}
              >
                {totalCellShows(formula)}
              </button>
            </div>
          </div>

        </div>
      )}

      {view === "compose" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 p-6">
          <div className="w-full max-w-[520px] rounded-xl bg-white p-5 shadow-2xl">
            <div className="mb-3 flex gap-3 border-b border-border pb-2.5 text-[14px]">
              <span className="w-10 shrink-0 text-text-tertiary">{c.to}</span>
              <span>{CAST.renata.email}</span>
            </div>
            <div className="mb-3 flex items-center gap-3 border-b border-border pb-2.5 text-[14px]">
              <span className="w-10 shrink-0 text-text-tertiary">{c.cc}</span>
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
            <div className="mb-3 flex gap-3 border-b border-border pb-2.5 text-[14px]">
              <span className="w-10 shrink-0 text-text-tertiary">{c.subjectLabel}</span>
              <span>{c.subject}</span>
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={c.writeHere}
              className="min-h-[130px] w-full resize-y py-3 text-[16px] leading-relaxed outline-none"
            />
            <NeedAStart lang={lang} starters={STARTERS[lang]} onPick={(s) => setBody((b) => (b ? `${b} ` : "") + s)} />
            <div className="mt-4 flex gap-2 border-t border-border pt-4">
              <button onClick={trySend} className="inline-flex min-h-[46px] items-center rounded-full bg-accent px-6 text-[15px] font-medium text-white cursor-pointer">
                {c.send}
              </button>
              <button onClick={() => { setView("sheet"); setBody(""); }} className="min-h-[40px] px-2 text-[14px] text-text-tertiary cursor-pointer">
                {c.discard}
              </button>
            </div>
          </div>
        </div>
      )}

      {view === "done" && (
        <div className="absolute inset-0 overflow-y-auto bg-surface-muted p-6">
          <div className="mx-auto flex max-w-[640px] flex-col gap-5">
            <TaskDoneCard
              kicker={c.sentKicker}
              title={c.doneTitle}
              body={c.doneBody}
              badgeNumber="11"
              badgeName={c.badgeName}
              badgeWhere={c.badgeWhere}
            />
            <TaskDoneActions kicker={c.sentKicker} tryAgainLabel={c.tryAgain} backToDeskLabel={c.backToDesk} onTryAgain={restart} />
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
      <NudgeToast text={nudge} onDismiss={dismiss} />
    </div>
  );
}

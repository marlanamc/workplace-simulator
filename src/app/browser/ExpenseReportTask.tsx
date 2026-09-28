"use client";

import { useState } from "react";
import { useTaskDraft } from "@/lib/use-task-draft";
import { useProgress } from "@/lib/progress-context";
import {
  EXPENSE_COPY,
  EXPENSE_ROWS,
  MISSING_KEY,
  RECEIPT_FILES,
  LESSONS,
  RIGHT_NOW_LABEL,
  RIGHT_NOW_STEPS,
  TYPO_KEY,
  expenseReadyToSubmit,
  expenseReceiptMatches,
  expenseSubmitCorrection,
  initialSheetAmount,
  rowAmountMatchesReceipt,
} from "@/lib/tasks/expense-report/content";
import { useNudge } from "@/lib/use-nudge";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import { TAB_ICONS, TASK_ICONS } from "@/lib/icons";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import RightNowBar from "@/components/task/RightNowBar";
import ShowMeHighlight from "@/components/task/ShowMeHighlight";
import { useShowMe, SHOW_ME_POINTER } from "@/lib/use-show-me";

type View = "home" | "sheet" | "done";

function SheetsIcon() {
  const Icon = TAB_ICONS.spreadsheet;
  return <Icon size={18} strokeWidth={2.25} />;
}

export default function ExpenseReportTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("expense-report") ? "done" : "home");
  // Drafts survive a trip to the Drive tab and back, where the receipts are.
  const [receipts, setReceipts] = useTaskDraft<Record<string, string>>("expense-report", "receipts", {});
  const [total, setTotal] = useTaskDraft("expense-report", "total", "");
  const matched = Object.keys(receipts).filter(key => expenseReceiptMatches(key, receipts[key]));
  const [flagged, setFlagged] = useTaskDraft<string | null>("expense-report", "flagged", null);
  // The one sheet amount that can be edited: the row typed with its digits
  // swapped. It starts as typed, so the sheet looks the way it came in.
  const typedStart = String(initialSheetAmount(TYPO_KEY) ?? "");
  const [typoAmount, setTypoAmount] = useTaskDraft("expense-report", "typoAmount", typedStart);
  // How many times the learner has heard that a row does not match its
  // receipt. The first correction names no row; later ones point at it.
  const [mismatchTries, setMismatchTries] = useState(0);
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const showMe = useShowMe();
  const c = EXPENSE_COPY[lang];

  const trySubmit = () => {
    const correction = expenseSubmitCorrection({ flagged, receipts, typoAmount, total, mismatchTries });
    if (correction) {
      if (correction === "rowMismatch" || correction === "rowMismatchNamed") setMismatchTries((n) => n + 1);
      return say(c[correction]);
    }
    setView("done");
    markComplete("expense-report", "flag_missing_receipt");
  };

  const restart = () => {
    setView("home");
    setReceipts({});
    setTotal('');
    setFlagged(null);
    setTypoAmount(typedStart);
    setMismatchTries(0);
  };

  const notYet = () => say(c.notToday);

  const rowsChecked = expenseReadyToSubmit(flagged, matched) && !receipts[MISSING_KEY] && rowAmountMatchesReceipt(TYPO_KEY, typoAmount);
  const stepIndex = view === "home" ? 0 : rowsChecked ? 2 : 1;

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-white text-[14px] text-[#202124]" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div className="flex items-center gap-3 border-b border-[#e0e0e0] px-4 py-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#0f9d58] text-white">
          <SheetsIcon />
        </span>
        <span className="text-[18px] text-[#3c4043]">{view === "home" ? c.appName : c.sheetName}</span>
      </div>

      {view !== "done" && (
        <RightNowBar
          icon={TASK_ICONS["expense-report"]}
          stepIndex={stepIndex}
          steps={RIGHT_NOW_STEPS}
          lang={lang}
          rightNowLabel={RIGHT_NOW_LABEL}
          onShowMe={view === "home" ? () => showMe.toggleFor("open-file") : undefined}
          showMeActive={showMe.targetId === "open-file"}
          onHelp={() => setHelp(true)}
        />
      )}
      <ShowMeHighlight targetId={showMe.targetId} label={SHOW_ME_POINTER[lang]} onDismiss={showMe.clear} />

      {view === "home" && (
        <div className="min-h-0 flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-[760px]">
            <h3 className="mb-3 text-[14px] font-medium text-[#3c4043]">{c.startNewHeading}</h3>
            <button onClick={notYet} className="mb-8 flex flex-col items-center gap-2 cursor-pointer">
              <span className="flex h-[92px] w-[72px] items-center justify-center rounded border border-border bg-white text-[26px] text-[#0f9d58] shadow-sm">+</span>
              <span className="text-[12px] text-[#3c4043]">{c.blankLabel}</span>
            </button>
            <h3 className="mb-3 text-[14px] font-medium text-[#3c4043]">{c.recentHeading}</h3>
            <button
              onClick={() => setView("sheet")}
              data-showme="open-file"
              className="flex w-full items-center gap-3 rounded-xl border border-border bg-white p-4 text-left hover:bg-surface-muted cursor-pointer"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-[#0f9d58] text-white">
                <SheetsIcon />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-medium text-[#3c4043]">{c.sheetName}</span>
                <span className="block text-[12px] text-text-tertiary">{c.openedLabel}</span>
              </span>
            </button>
          </div>
        </div>
      )}

      {view === "sheet" && (
        <div className="min-h-0 flex-1 overflow-auto p-4">
          <div className="overflow-x-auto">
            <table data-card-avoid className="min-w-[640px] border-collapse text-[13px]">
              <thead>
                <tr className="bg-[#f8f9fa] text-left text-[12px] text-[#5f6368]">
                  <th className="border border-[#c0c0c0] px-2 py-1.5 font-medium">{c.merchantHeader}</th>
                  <th className="border border-[#c0c0c0] px-2 py-1.5 font-medium">{c.categoryHeader}</th>
                  <th className="border border-[#c0c0c0] px-2 py-1.5 font-medium">{c.amountHeader}</th>
                  <th className="border border-[#c0c0c0] px-2 py-1.5 font-medium">{c.receiptHeader}</th>
                  <th className="border border-[#c0c0c0] px-2 py-1.5 font-medium" />
                </tr>
              </thead>
              <tbody>
                {EXPENSE_ROWS.map((row) => {
                  const isFlagged = flagged === row.key;
                  return (
                    <tr key={row.key} className="bg-white">
                      <td className="border border-[#c0c0c0] px-2 py-1.5">{row.merchant[lang]}</td>
                      <td className="border border-[#c0c0c0] px-2 py-1.5">{row.category[lang]}</td>
                      <td className="border border-[#c0c0c0] px-1 py-0.5 tabular-nums">
                        {/* Every amount looks like the same sheet cell, so the
                            one that can change does not give itself away. */}
                        <span className="flex items-center gap-0.5">
                          <span aria-hidden>$</span>
                          <input
                            data-card-avoid
                            aria-label={`${row.merchant[lang]} · ${c.amountHeader}`}
                            inputMode="decimal"
                            readOnly={row.key !== TYPO_KEY}
                            value={row.key === TYPO_KEY ? typoAmount : String(row.amount)}
                            onChange={row.key === TYPO_KEY ? (e) => setTypoAmount(e.target.value) : undefined}
                            className="min-h-11 w-[72px] border border-transparent bg-transparent px-1 tabular-nums focus:border-[#1a73e8] focus:outline-none"
                          />
                        </span>
                      </td>
                      <td className="border border-[#c0c0c0] px-2 py-1.5 text-[#5f6368]">
                        <select aria-label={`${row.merchant[lang]} · ${c.receiptHeader}`} value={receipts[row.key] ?? ''}
                          onChange={e => setReceipts(prev => ({ ...prev, [row.key]: e.target.value }))} className="min-h-11 max-w-[180px] border border-[#dadce0] p-1">
                          <option value="">{c.chooseReceipt}</option>
                          {RECEIPT_FILES.map(f => <option key={f.key} value={f.name}>{f.name}</option>)}
                        </select>
                      </td>
                      <td className="border border-[#c0c0c0] px-2 py-1.5">
                        <button
                          type="button"
                          aria-label={`${c.flag} · ${row.merchant[lang]}`}
                          aria-pressed={isFlagged}
                          onClick={() => { setFlagged(isFlagged ? null : row.key); if (row.key !== MISSING_KEY) say(c.hasReceipt); }}
                          className="min-h-11 rounded-full border border-[#dadce0] px-3 text-[12px] font-medium cursor-pointer"
                        >
                          {isFlagged ? c.flagged : c.flag}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <label className="mt-4 block">
            <span className="block">{c.totalLabel}</span>
            <input data-card-avoid inputMode="decimal" value={total} onChange={e => setTotal(e.target.value)} className="min-h-11 rounded border border-[#747775] px-3" />
          </label>
          <button
            type="button"
            data-card-avoid
            onClick={trySubmit}
            className="mt-4 inline-flex min-h-[40px] items-center rounded-lg bg-[#0f9d58] px-5 text-[14px] font-medium text-white cursor-pointer"
          >
            {c.submit}
          </button>
        </div>
      )}

      {view === "done" && (
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="mx-auto flex max-w-[640px] flex-col gap-5">
            <TaskDoneCard kicker={c.sentKicker} />
            <TaskDoneActions kicker={c.sentKicker} tryAgainLabel={c.tryAgain} backToDeskLabel={c.backToDesk} onTryAgain={restart} />
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

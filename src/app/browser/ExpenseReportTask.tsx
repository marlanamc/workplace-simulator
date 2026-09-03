"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  EXPENSE_COPY,
  EXPENSE_ROWS,
  MISSING_KEY,
  LESSONS,
  RIGHT_NOW_LABEL,
  RIGHT_NOW_STEPS,
  expenseReadyToSubmit,
} from "@/lib/tasks/expense-report/content";
import { useNudge } from "@/lib/use-nudge";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import { TAB_ICONS, TASK_ICONS } from "@/lib/icons";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import RightNowBar from "@/components/task/RightNowBar";

type View = "home" | "sheet" | "done";

function SheetsIcon() {
  const Icon = TAB_ICONS.spreadsheet;
  return <Icon size={18} strokeWidth={2.25} />;
}

export default function ExpenseReportTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("expense-report") ? "done" : "home");
  const [matched, setMatched] = useState<string[]>([]);
  const [flagged, setFlagged] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const c = EXPENSE_COPY[lang];

  const toggleMatch = (key: string) => {
    if (key === MISSING_KEY) {
      setFlagged((v) => (v === key ? null : key));
      return;
    }
    setMatched((rows) => (rows.includes(key) ? rows.filter((k) => k !== key) : [...rows, key]));
  };

  const trySubmit = () => {
    if (flagged !== MISSING_KEY) return say(c.submitBlind);
    if (!expenseReadyToSubmit(flagged, matched)) return say(c.needMatch);
    setView("done");
    markComplete("expense-report", "flag_missing_receipt");
  };

  const restart = () => {
    setView("home");
    setMatched([]);
    setFlagged(null);
  };

  const notYet = () =>
    say(lang === "en" ? "That's not today's sheet. Open September expenses." : "Esa no es la hoja de hoy. Abre Gastos de septiembre.");

  const stepIndex = view === "home" ? 0 : 1;

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
          onHelp={() => setHelp(true)}
        />
      )}

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
          <div className="mb-4 max-w-[480px] rounded-sm border border-[#f9ab00] bg-[#fef7e0] px-3 py-2.5 text-[13px] leading-relaxed text-[#3c4043]">
            <div className="text-[11px] font-bold uppercase tracking-wide text-[#b06000]">{c.noteHeading}</div>
            <p className="mt-1">{c.noteBody}</p>
            <p className="mt-1 text-[#5f6368]">{c.receiptsHint}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[640px] border-collapse text-[13px]">
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
                  const missing = row.key === MISSING_KEY;
                  const isMatched = matched.includes(row.key);
                  const isFlagged = flagged === row.key;
                  return (
                    <tr key={row.key} className={missing ? "bg-[#fce8e6]" : "bg-white"}>
                      <td className="border border-[#c0c0c0] px-2 py-1.5">{row.merchant[lang]}</td>
                      <td className="border border-[#c0c0c0] px-2 py-1.5">{row.category[lang]}</td>
                      <td className="border border-[#c0c0c0] px-2 py-1.5 tabular-nums">${row.amount}</td>
                      <td className="border border-[#c0c0c0] px-2 py-1.5 text-[#5f6368]">
                        {row.receipt ?? c.noReceipt}
                      </td>
                      <td className="border border-[#c0c0c0] px-2 py-1.5">
                        <button
                          type="button"
                          onClick={() => toggleMatch(row.key)}
                          className="min-h-[32px] rounded-full px-3 text-[12px] font-medium cursor-pointer"
                          style={{
                            background: missing
                              ? isFlagged ? "#c5221f" : "#fce8e6"
                              : isMatched ? "#e6f4ea" : "#e8f0fe",
                            color: missing
                              ? isFlagged ? "#fff" : "#c5221f"
                              : isMatched ? "#137333" : "#1967d2",
                          }}
                        >
                          {missing ? (isFlagged ? c.flagged : c.flag) : isMatched ? c.matched : c.match}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <button
            type="button"
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

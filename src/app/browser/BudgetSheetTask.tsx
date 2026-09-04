"use client";

import { useState, type CSSProperties } from "react";
import { useProgress } from "@/lib/progress-context";
import { CAST } from "@/lib/cast";
import {
  BUDGET_SHEET_COPY,
  BUDGET_ROWS,
  OVER_KEY,
  statusFor,
  statusFormula,
  STARTERS,
  LESSONS,
  EMPTY_EMAIL_HINT,
  WRONG_EMAIL_HINT,
  emailFlagsOver,
  RIGHT_NOW_STEPS,
  RIGHT_NOW_LABEL,
} from "@/lib/tasks/budget-sheet/content";
import { useNudge } from "@/lib/use-nudge";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import { TAB_ICONS, TASK_ICONS } from "@/lib/icons";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import RightNowBar from "@/components/task/RightNowBar";
import NeedAStart from "@/components/task/NeedAStart";

type View = "home" | "sheet" | "compose" | "done";
type Col = "A" | "B" | "C" | "D";
type Cell = { row: number; col: Col };

const COLS: Col[] = ["A", "B", "C", "D"];
const HEADER_ROW = 1;
const FIRST_DATA_ROW = 2;
const COL_WIDTH: Record<Col, number> = { A: 140, B: 88, C: 88, D: 88 };

function SheetsIcon() {
  const Icon = TAB_ICONS.spreadsheet;
  return <Icon size={18} strokeWidth={2.25} />;
}

function cellRef(cell: Cell) {
  return `${cell.col}${cell.row}`;
}

export default function BudgetSheetTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("budget-sheet") ? "done" : "home");
  const [selected, setSelected] = useState<Cell>({ row: FIRST_DATA_ROW + 1, col: "D" });
  const [openedOver, setOpenedOver] = useState(false);
  const [body, setBody] = useState("");
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const c = BUDGET_SHEET_COPY[lang];
  const maxActual = Math.max(...BUDGET_ROWS.map((r) => r.actual));

  const select = (cell: Cell) => {
    setSelected(cell);
    const idx = cell.row - FIRST_DATA_ROW;
    const row = BUDGET_ROWS[idx];
    if (cell.col === "D" && row && statusFor(row.actual, row.budget) === "over") {
      setOpenedOver(true);
    }
  };

  const tryEmail = () => {
    if (!openedOver) return say(c.readFirst);
    setView("compose");
  };

  const trySend = () => {
    if (!body.trim()) return say(EMPTY_EMAIL_HINT[lang]);
    if (!emailFlagsOver(body)) return say(WRONG_EMAIL_HINT[lang]);
    setView("done");
    markComplete("budget-sheet", "read_budget_if_and_chart");
  };

  const restart = () => {
    setView("home");
    setSelected({ row: FIRST_DATA_ROW + 1, col: "D" });
    setOpenedOver(false);
    setBody("");
  };

  const notYet = () =>
    say(lang === "en" ? "That's not today's sheet. Open Cafe budget — week of Sep 1." : "Esa no es la hoja de hoy. Abre Presupuesto del café — sem. 1 sep.");

  const formulaBarContent = (() => {
    if (selected.row === HEADER_ROW) {
      if (selected.col === "A") return c.categoryHeader;
      if (selected.col === "B") return c.budgetHeader;
      if (selected.col === "C") return c.actualHeader;
      return c.statusHeader;
    }
    const row = BUDGET_ROWS[selected.row - FIRST_DATA_ROW];
    if (!row) return "";
    if (selected.col === "A") return row.label[lang];
    if (selected.col === "B") return String(row.budget);
    if (selected.col === "C") return String(row.actual);
    return statusFormula(selected.row);
  })();

  const headerFor = (col: Col) =>
    col === "A" ? c.categoryHeader : col === "B" ? c.budgetHeader : col === "C" ? c.actualHeader : c.statusHeader;

  const renderRowLabel = (row: number) => (
    <div
      className={`flex shrink-0 items-center justify-center border-b border-r border-[#c0c0c0] text-[12px] ${
        selected.row === row ? "bg-[#d2e3fc] text-[#1a73e8]" : "bg-[#f8f9fa] text-[#5f6368]"
      }`}
      style={{ width: 32, height: 26 }}
    >
      {row}
    </div>
  );

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-white text-[14px] text-[#202124]" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div className="flex items-center gap-3 border-b border-[#e0e0e0] px-4 py-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#0f9d58] text-white">
          <SheetsIcon />
        </span>
        <span className="text-[18px] text-[#3c4043]">{view === "home" ? c.appName : c.sheetName}</span>
        <div className="flex-1" />
      </div>

      {view !== "done" && (
        <RightNowBar
          icon={TASK_ICONS["budget-sheet"]}
          stepIndex={view === "home" ? 0 : view === "sheet" ? 1 : 2}
          steps={RIGHT_NOW_STEPS}
          lang={lang}
          rightNowLabel={RIGHT_NOW_LABEL}
          onHelp={() => setHelp(true)}
        />
      )}

      {view === "sheet" && (
        <>
          <div className="flex items-center gap-2 border-b border-[#e0e0e0] px-3 py-1.5">
            <span className="min-w-[40px] rounded border border-[#e0e0e0] px-2 py-1 text-center text-[12px] font-medium text-[#3c4043]">
              {cellRef(selected)}
            </span>
            <span className="text-[13px] italic text-[#5f6368]">fx</span>
            <span className="flex-1 truncate border-l border-[#e0e0e0] px-2 py-1 text-[13px] text-[#202124]">
              {formulaBarContent}
            </span>
          </div>
        </>
      )}

      {view === "home" && (
        <div className="min-h-0 flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-[760px]">
            <h3 className="mb-3 text-[14px] font-medium text-[#3c4043]">{c.startNewHeading}</h3>
            <div className="mb-8 flex flex-wrap gap-4">
              {[
                { label: c.blankLabel, bg: "white", accent: "#0f9d58" },
                { label: c.templateBudget, bg: "#e8f0fe", accent: "#1a73e8" },
                { label: c.templateSchedule, bg: "#fce8e6", accent: "#ea4335" },
              ].map((t) => (
                <button key={t.label} onClick={notYet} className="flex flex-col items-center gap-2 cursor-pointer">
                  <span
                    className="flex h-[92px] w-[72px] items-center justify-center rounded border border-border shadow-sm hover:shadow-md"
                    style={{ background: t.bg }}
                  >
                    <span className="text-[26px]" style={{ color: t.accent }}>
                      {t.label === c.blankLabel ? "+" : "⊞"}
                    </span>
                  </span>
                  <span className="text-[12px] text-[#3c4043]">{t.label}</span>
                </button>
              ))}
            </div>
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
        <div className="min-h-0 flex-1 overflow-auto">
          <div className="p-4">
            <div className="mb-4 max-w-[440px] rounded-sm border border-[#f9ab00] bg-[#fef7e0] px-3 py-2.5 text-[13px] leading-relaxed text-[#3c4043]">
              <div className="text-[11px] font-bold uppercase tracking-wide text-[#b06000]">{c.noteHeading}</div>
              <p className="mt-1">{c.noteBody}</p>
            </div>

            <div className="flex flex-wrap items-start gap-6">
              <div className="inline-block border border-[#c0c0c0]" style={{ fontSize: 13 }}>
                <div className="flex">
                  <div className="flex shrink-0 items-center justify-center border-b border-r border-[#c0c0c0] bg-[#f8f9fa]" style={{ width: 32, height: 24 }} />
                  {COLS.map((col) => (
                    <div
                      key={col}
                      className={`flex shrink-0 items-center justify-center border-b border-r border-[#c0c0c0] text-[12px] font-medium ${
                        selected.col === col ? "bg-[#d2e3fc] text-[#1a73e8]" : "bg-[#f8f9fa] text-[#5f6368]"
                      }`}
                      style={{ width: COL_WIDTH[col], height: 24 }}
                    >
                      {col}
                    </div>
                  ))}
                </div>
                <div className="flex">
                  {renderRowLabel(HEADER_ROW)}
                  {COLS.map((col) => (
                    <button
                      key={col}
                      onClick={() => select({ row: HEADER_ROW, col })}
                      className="shrink-0 border-b border-r border-[#c0c0c0] bg-[#f8f9fa] px-1.5 text-left text-[12px] font-medium cursor-pointer"
                      style={{
                        width: COL_WIDTH[col],
                        height: 26,
                        boxShadow: selected.row === HEADER_ROW && selected.col === col ? "inset 0 0 0 2px #1a73e8" : undefined,
                      }}
                    >
                      {headerFor(col)}
                    </button>
                  ))}
                </div>
                {BUDGET_ROWS.map((row, i) => {
                  const r = FIRST_DATA_ROW + i;
                  const over = statusFor(row.actual, row.budget) === "over";
                  return (
                    <div key={row.key} className="flex">
                      {renderRowLabel(r)}
                      {COLS.map((col) => {
                        const isSelected = selected.row === r && selected.col === col;
                        const status = statusFor(row.actual, row.budget);
                        let text = "";
                        if (col === "A") text = row.label[lang];
                        else if (col === "B") text = String(row.budget);
                        else if (col === "C") text = String(row.actual);
                        else text = status === "over" ? c.overLabel : c.underLabel;
                        const cellStyle: CSSProperties = {
                          width: COL_WIDTH[col],
                          height: 26,
                          background: col === "D" && over ? "#fce8e6" : "white",
                          color: col === "D" && over ? "#c5221f" : "#202124",
                          boxShadow: isSelected ? "inset 0 0 0 2px #1a73e8" : undefined,
                        };
                        return (
                          <button
                            key={col}
                            onClick={() => select({ row: r, col })}
                            className="shrink-0 border-b border-r border-[#c0c0c0] px-1.5 text-left text-[13px] cursor-pointer"
                            style={cellStyle}
                          >
                            {text}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              <div className="min-w-[220px] rounded-xl border border-[#dadce0] bg-[#f8f9fa] p-4">
                <div className="mb-3 text-[12px] font-medium text-[#5f6368]">{c.chartTitle}</div>
                <svg viewBox="0 0 220 140" className="h-[140px] w-[220px]" aria-hidden>
                  {BUDGET_ROWS.map((row, i) => {
                    const h = Math.max(8, (row.actual / maxActual) * 100);
                    const x = 20 + i * 50;
                    const over = row.key === OVER_KEY;
                    return (
                      <g key={row.key}>
                        <rect x={x} y={110 - h} width={28} height={h} fill={over ? "#c5221f" : "#1a73e8"} rx={2} />
                        <text x={x + 14} y={128} textAnchor="middle" fontSize="9" fill="#5f6368">
                          {row.label[lang].slice(0, 6)}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            <button
              onClick={tryEmail}
              className="mt-4 inline-flex min-h-[44px] items-center rounded-full bg-accent px-5 text-[15px] font-medium text-white hover:bg-accent-hover cursor-pointer"
            >
              {c.emailCta}
            </button>
          </div>
        </div>
      )}

      {view === "compose" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 p-6">
          <div className="w-full max-w-[520px] rounded-xl bg-white p-5 shadow-2xl">
            <div className="mb-3 flex gap-3 border-b border-border pb-2.5 text-[14px]">
              <span className="w-14 shrink-0 text-text-tertiary">{c.to}</span>
              <span>{CAST.renata.email}</span>
            </div>
            <div className="mb-3 flex gap-3 border-b border-border pb-2.5 text-[14px]">
              <span className="w-14 shrink-0 text-text-tertiary">{c.subjectLabel}</span>
              <span>{c.subject}</span>
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={c.writeHere}
              className="min-h-[130px] w-full resize-y border-none py-3 text-[16px] leading-relaxed outline-none placeholder:text-text-tertiary"
            />
            <div className="mb-4">
              <NeedAStart
                lang={lang}
                starters={STARTERS[lang]}
                onPick={(s) => setBody((b) => (b ? `${b} ` : "") + s)}
                chipClassName="min-h-[38px] rounded-full border border-border bg-surface-muted px-3 text-[13px] font-medium text-accent hover:bg-accent-tint cursor-pointer"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
              <button
                onClick={trySend}
                className="inline-flex min-h-[46px] items-center rounded-full bg-accent px-6 text-[15px] font-medium text-white hover:bg-accent-hover cursor-pointer"
              >
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
              badgeNumber="17"
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
        lesson={LESSONS[lang][0]}
        tipLabel={c.tipLabel}
        gotItLabel={c.gotIt}
      />
      <NudgeToast text={nudge} onDismiss={dismiss} />
    </div>
  );
}

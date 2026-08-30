"use client";

import { useState, type CSSProperties } from "react";
import { useProgress } from "@/lib/progress-context";
import { CAST } from "@/lib/cast";
import {
  TIP_ROWS,
  SPREADSHEET_COPY,
  WRONG_ENTRY_HINT,
  STARTERS,
  LESSONS,
  RIGHT_NOW_STEPS,
  RIGHT_NOW_LABEL,
} from "@/lib/tasks/spreadsheet/content";
import { useNudge } from "@/lib/use-nudge";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import { TAB_ICONS, TASK_ICONS } from "@/lib/icons";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import AppHeaderTools from "@/components/task/AppHeaderTools";
import RightNowBar from "@/components/task/RightNowBar";
import NeedAStart from "@/components/task/NeedAStart";

type View = "home" | "sheet" | "compose" | "done";
type CellCol = "A" | "B" | "C" | "D" | "E";
type Cell = { row: number; col: CellCol };

const DECORATIVE_COLS: CellCol[] = ["C", "D", "E"];
const HEADER_ROW = 1;
const FIRST_DATA_ROW = 2;
const TOTAL_ROW = FIRST_DATA_ROW + TIP_ROWS.length; // row 7
const LAST_DATA_ROW = TOTAL_ROW - 1;
const money = (n: number) => `$${n.toFixed(2)}`;

function colWidth(col: CellCol) {
  if (col === "A") return 160;
  if (col === "B") return 110;
  return 90;
}

function cellRef(cell: Cell) {
  return `${cell.col}${cell.row}`;
}

export default function SpreadsheetTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("spreadsheet") ? "done" : "home");
  const [entries, setEntries] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Cell>({ row: FIRST_DATA_ROW, col: "B" });
  const [body, setBody] = useState("");
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();

  const c = SPREADSHEET_COPY[lang];

  // The sheet's live total - it recalculates every time a cell changes,
  // same as a real spreadsheet formula would.
  const liveSheetTotal = TIP_ROWS.reduce((sum, r) => {
    const typed = parseFloat(entries[r.key] ?? "");
    return sum + (Number.isFinite(typed) ? typed : 0);
  }, 0);

  const setEntry = (key: string, value: string) => {
    setEntries((prev) => ({ ...prev, [key]: value }));
  };

  const tryEmailTotal = () => {
    if (TIP_ROWS.some((r) => !entries[r.key]?.trim())) {
      return say(c.fillAllFirst);
    }
    const allMatch = TIP_ROWS.every((r) => {
      const typed = parseFloat(entries[r.key] ?? "");
      return Math.abs(typed - r.given) < 0.005;
    });
    if (!allMatch) {
      return say(WRONG_ENTRY_HINT[lang]);
    }
    setView("compose");
  };

  const trySend = () => {
    if (!body.trim()) {
      return say(
        lang === "en"
          ? "Write a short message first. Even one sentence is fine."
          : "Primero escribe un mensaje corto. Una oración está bien."
      );
    }
    setView("done");
    markComplete("spreadsheet", "enter_data_and_share_total");
  };

  const discard = () => {
    setView("sheet");
    setBody("");
  };

  const restart = () => {
    setView("home");
    setEntries({});
    setBody("");
  };

  const notYet = () =>
    say(
      lang === "en"
        ? "That's not part of today's task. Open the Weekly Tip Tracker instead."
        : "Eso no es parte de la tarea de hoy. Abre el Registro semanal de propinas en su lugar."
    );

  // What the formula bar shows for whichever cell is selected.
  const formulaBarContent = (() => {
    if (selected.col === "A") {
      if (selected.row === HEADER_ROW) return "Day";
      if (selected.row === TOTAL_ROW) return "Total";
      const r = TIP_ROWS[selected.row - FIRST_DATA_ROW];
      return r?.day ?? "";
    }
    if (selected.col === "B") {
      if (selected.row === HEADER_ROW) return "Tips";
      if (selected.row === TOTAL_ROW) return `=SUM(B${FIRST_DATA_ROW}:B${LAST_DATA_ROW})`;
      const r = TIP_ROWS[selected.row - FIRST_DATA_ROW];
      return r ? entries[r.key] ?? "" : "";
    }
    return "";
  })();

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-white text-[14px] text-[#202124]" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      {/* ── Sheets-style header bar ─────────────────────────────── */}
      <div className="flex items-center gap-3 border-b border-[#e0e0e0] px-4 py-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#0f9d58] text-white">
          {(() => {
            const Icon = TAB_ICONS.spreadsheet;
            return <Icon size={18} strokeWidth={2.25} />;
          })()}
        </span>
        <span className="text-[18px] text-[#3c4043]">{view === "home" ? c.appName : c.sheetName}</span>
        <div className="flex-1" />
        <AppHeaderTools
          helpLabel={c.helpBtn}
          onHelp={() => setHelp(true)}
        />
      </div>

      {view !== "done" && (
        <RightNowBar
          icon={TASK_ICONS.spreadsheet}
          stepIndex={view === "home" ? 0 : view === "sheet" ? 1 : 2}
          steps={RIGHT_NOW_STEPS}
          lang={lang}
          rightNowLabel={RIGHT_NOW_LABEL}
          onHelp={() => setHelp(true)}
        />
      )}

      {view === "sheet" && (
        <>
          {/* ── decorative Sheets toolbar ────────────────────────────── */}
          <div className="flex items-center gap-3 border-b border-[#e0e0e0] bg-[#f9fbfd] px-4 py-1.5 text-[#5f6368]">
            {["↶", "↷", "🖨", "🖌"].map((g) => (
              <span key={g} className="flex h-6 w-6 items-center justify-center rounded text-[13px] hover:bg-[#eceff1]" aria-hidden>
                {g}
              </span>
            ))}
            <span className="mx-1 h-4 w-px bg-[#dadce0]" aria-hidden />
            <span className="rounded px-1.5 py-0.5 text-[12px] hover:bg-[#eceff1]">100%</span>
            <span className="mx-1 h-4 w-px bg-[#dadce0]" aria-hidden />
            {["B", "I", "U"].map((g) => (
              <span key={g} className="flex h-6 w-6 items-center justify-center rounded text-[12px] font-bold italic hover:bg-[#eceff1]" aria-hidden>
                {g}
              </span>
            ))}
            <span className="mx-1 h-4 w-px bg-[#dadce0]" aria-hidden />
            {["⊞", "≡", "↔"].map((g) => (
              <span key={g} className="flex h-6 w-6 items-center justify-center rounded text-[13px] hover:bg-[#eceff1]" aria-hidden>
                {g}
              </span>
            ))}
          </div>

          {/* ── formula bar ──────────────────────────────────────────── */}
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
                <button
                  key={t.label}
                  onClick={notYet}
                  className="flex flex-col items-center gap-2 cursor-pointer"
                >
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
                {(() => {
                  const Icon = TAB_ICONS.spreadsheet;
                  return <Icon size={18} strokeWidth={2.25} />;
                })()}
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
          {/* ── source document: not part of the sheet, something to copy from ── */}
          <div
            className="mb-4 inline-block max-w-[280px] rounded-sm bg-[#fffdf5] p-4 text-[13px] shadow-[0_1px_3px_rgba(0,0,0,0.15)]"
            style={{ fontFamily: "'Courier New', monospace", transform: "rotate(-0.4deg)" }}
          >
            <div className="mb-2 border-b border-dashed border-[#d8d2b8] pb-1.5 text-[11px] font-bold uppercase tracking-wide text-[#8a7f5c]">
              {c.slipHeading}
            </div>
            {TIP_ROWS.map((r) => (
              <div key={r.key} className="flex justify-between py-0.5 text-[#4a4636]">
                <span>{r.day}</span>
                <span>{money(r.given)}</span>
              </div>
            ))}
          </div>

          {/* ── the actual spreadsheet grid ──────────────────────── */}
          <div className="inline-block border border-[#c0c0c0]" style={{ fontSize: 13 }}>
            {/* column header row */}
            <div className="flex">
              <div
                className="flex shrink-0 items-center justify-center border-b border-r border-[#c0c0c0] bg-[#f8f9fa]"
                style={{ width: 32, height: 24 }}
              />
              {(["A", "B", ...DECORATIVE_COLS] as CellCol[]).map((col) => (
                <div
                  key={col}
                  className={`flex shrink-0 items-center justify-center border-b border-r border-[#c0c0c0] text-[12px] font-medium ${
                    selected.col === col ? "bg-[#d2e3fc] text-[#1a73e8]" : "bg-[#f8f9fa] text-[#5f6368]"
                  }`}
                  style={{ width: colWidth(col), height: 24 }}
                >
                  {col}
                </div>
              ))}
            </div>

            {/* data rows */}
            {Array.from({ length: TOTAL_ROW }, (_, i) => i + 1).map((row) => {
              const isHeader = row === HEADER_ROW;
              const isTotal = row === TOTAL_ROW;
              const tipRow = !isHeader && !isTotal ? TIP_ROWS[row - FIRST_DATA_ROW] : undefined;
              return (
                <div key={row} className="flex">
                  <div
                    className={`flex shrink-0 items-center justify-center border-b border-r border-[#c0c0c0] text-[12px] ${
                      selected.row === row ? "bg-[#d2e3fc] text-[#1a73e8]" : "bg-[#f8f9fa] text-[#5f6368]"
                    }`}
                    style={{ width: 32, height: 26 }}
                  >
                    {row}
                  </div>
                  {(["A", "B", ...DECORATIVE_COLS] as CellCol[]).map((col) => {
                    const isSelected = selected.row === row && selected.col === col;
                    const bold = isHeader || isTotal;
                    const bg = isHeader ? "#f8f9fa" : isTotal && col === "B" ? "#fef7e0" : "white";
                    const cellStyle: CSSProperties = {
                      width: colWidth(col),
                      height: 26,
                      background: bg,
                      boxShadow: isSelected ? "inset 0 0 0 2px #1a73e8" : undefined,
                    };
                    if (col === "A") {
                      return (
                        <button
                          key={col}
                          onClick={() => setSelected({ row, col })}
                          className={`shrink-0 border-b border-r border-[#c0c0c0] px-1.5 text-left text-[13px] cursor-pointer ${bold ? "font-medium" : ""}`}
                          style={cellStyle}
                        >
                          {isHeader ? "Day" : isTotal ? "Total" : tipRow?.day}
                        </button>
                      );
                    }
                    if (col === "B") {
                      if (isHeader) {
                        return (
                          <button
                            key={col}
                            onClick={() => setSelected({ row, col })}
                            className="shrink-0 border-b border-r border-[#c0c0c0] px-1.5 text-left text-[13px] font-medium cursor-pointer"
                            style={cellStyle}
                          >
                            Tips
                          </button>
                        );
                      }
                      if (isTotal) {
                        return (
                          <button
                            key={col}
                            onClick={() => setSelected({ row, col })}
                            className="shrink-0 border-b border-r border-[#c0c0c0] px-1.5 text-left text-[13px] font-semibold cursor-pointer"
                            style={cellStyle}
                          >
                            {money(liveSheetTotal)}
                          </button>
                        );
                      }
                      return (
                        <input
                          key={col}
                          value={tipRow ? entries[tipRow.key] ?? "" : ""}
                          onFocus={() => setSelected({ row, col })}
                          onChange={(e) => tipRow && setEntry(tipRow.key, e.target.value)}
                          placeholder="0.00"
                          inputMode="decimal"
                          className="shrink-0 border-b border-r border-[#c0c0c0] px-1.5 text-[13px] outline-none"
                          style={cellStyle}
                        />
                      );
                    }
                    return (
                      <button
                        key={col}
                        onClick={() => setSelected({ row, col })}
                        className="shrink-0 border-b border-r border-[#c0c0c0] cursor-pointer"
                        style={cellStyle}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>

          <button
            onClick={tryEmailTotal}
            className="mt-4 inline-flex min-h-[44px] items-center rounded-full bg-accent px-5 text-[15px] font-medium text-white hover:bg-accent-hover cursor-pointer"
          >
            {c.emailTotal}
          </button>
        </div>
      </div>
      )}

      {view === "compose" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 p-6">
          <div className="w-full max-w-[520px] rounded-xl bg-white p-5 shadow-2xl">
            <div className="mb-3 flex gap-3 border-b border-border pb-2.5 text-[14px]">
              <span className="w-14 shrink-0 text-text-tertiary">{c.to}</span>
              <span>{CAST.maria.email}</span>
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
              onPick={(s) => setBody((b) => (b ? b + " " : "") + s)}
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
              <button
                onClick={discard}
                className="min-h-[40px] px-2 text-[14px] text-text-tertiary cursor-pointer"
              >
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
              badgeNumber="09"
              badgeName={c.badgeName}
              badgeWhere={c.badgeWhere}
            />

            <TaskDoneActions
              kicker={c.sentKicker}
              tryAgainLabel={c.tryAgain}
              backToDeskLabel={c.backToDesk}
              onTryAgain={restart}
            />
          </div>
        </div>
      )}

      <HelpDrawer
        open={help}
        onClose={() => setHelp(false)}
        kicker={c.lessonKicker}
        lesson={LESSONS[lang][view === "compose" ? 1 : 0]}
        tipLabel={c.tipLabel}
        gotItLabel={c.gotIt}
      />

      <NudgeToast text={nudge} onDismiss={dismiss} />
    </div>
  );
}

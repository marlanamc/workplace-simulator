"use client";

import SheetEmailMenu from "@/components/task/SheetEmailMenu";

import { useRef, useState, type CSSProperties } from "react";
import { useProgress } from "@/lib/progress-context";
import { CAST } from "@/lib/cast";
import {
  BUDGET_SHEET_COPY,
  BUDGET_ROWS,
  OVER_KEY,
  statusFor,
  statusFormula,
  dollars,
  TOTAL_ROW,
  BUDGET_TOTAL,
  ACTUAL_TOTAL,
  STARTERS,
  LESSONS,
  EMPTY_EMAIL_HINT,
  WRONG_EMAIL_HINT,
  emailFlagsOver,
  RIGHT_NOW_STEPS,
  RIGHT_NOW_LABEL,
  SENT_LABELS,
  OVER_AMOUNT,
  BUDGET_SHEET_NAME,
} from "@/lib/tasks/budget-sheet/content";
import { CELL_FOCUS, SentEmailRecap, pickStarter } from "./sheet-lesson-parts";
import { handleGridKey } from "@/lib/sheet-grid-keys";
import { useNudge } from "@/lib/use-nudge";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import { TAB_ICONS, TASK_ICONS } from "@/lib/icons";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import RightNowBar from "@/components/task/RightNowBar";
import NeedAStart from "@/components/task/NeedAStart";
import ShowMeHighlight from "@/components/task/ShowMeHighlight";
import { useShowMe, SHOW_ME_LOOK, SHOW_ME_POINTER } from "@/lib/use-show-me";

type View = "home" | "sheet" | "compose" | "done";
type Col = "A" | "B" | "C" | "D" | "E";
type Cell = { row: number; col: Col };

const COLS: Col[] = ["A", "B", "C", "D", "E"];
const HEADER_ROW = 1;
const FIRST_DATA_ROW = 2;
const COL_WIDTH: Record<Col, number> = { A: 168, B: 84, C: 84, D: 180, E: 236 };
/** The last line's row; the Total row's SUMs run from row 2 to here. */
const LAST_DATA_ROW = FIRST_DATA_ROW + BUDGET_ROWS.length - 1;
/** Every drawn row, top to bottom, for arrow-key movement. */
const GRID_ROWS = [HEADER_ROW, ...BUDGET_ROWS.map((_, i) => FIRST_DATA_ROW + i), TOTAL_ROW];

// One slot per budget line, so the chart fits however many lines there are.
const CHART_PAD = 10;
const CHART_SLOT = 52;
const CHART_BAR = 24;
const CHART_W = CHART_PAD * 2 + CHART_SLOT * BUDGET_ROWS.length;

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
  const [selected, setSelected] = useState<Cell>({ row: HEADER_ROW, col: "A" });
  const [openedOver, setOpenedOver] = useState(false);
  const [body, setBody] = useState("");
  const [missed, setMissed] = useState(false);
  const bodyBox = useRef<HTMLTextAreaElement | null>(null);
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const showMe = useShowMe();
  const c = BUDGET_SHEET_COPY[lang];
  const overRow = BUDGET_ROWS.find((r) => r.key === OVER_KEY)!;
  const chartMax = Math.max(...BUDGET_ROWS.flatMap((r) => [r.actual, r.budget]));
  const stepIndex = view === "home" ? 0 : view === "sheet" ? (openedOver ? 2 : 1) : 3;
  // Step 2 points at the evidence (the Status column), not at the answer cell.
  const showMeIds = ["open-file", "status-column", "email-cta", "compose-body"];

  const select = (cell: Cell) => {
    setSelected(cell);
    const idx = cell.row - FIRST_DATA_ROW;
    const row = BUDGET_ROWS[idx];
    if (cell.col === "D" && row && statusFor(row.actual, row.budget) === "over") {
      setOpenedOver(true);
    }
  };

  const tryEmail = () => {
    showMe.clear();
    if (!openedOver) return say(c.readFirst);
    setView("compose");
    requestAnimationFrame(() => bodyBox.current?.focus());
  };

  const trySend = () => {
    if (!body.trim()) {
      setMissed(true);
      return say(EMPTY_EMAIL_HINT[lang]);
    }
    if (!emailFlagsOver(body)) {
      setMissed(true);
      return say(WRONG_EMAIL_HINT[lang]);
    }
    setView("done");
    markComplete("budget-sheet", "read_budget_if_and_chart");
  };

  const restart = () => {
    setView("home");
    setSelected({ row: HEADER_ROW, col: "A" });
    setOpenedOver(false);
    setBody("");
    setMissed(false);
  };

  const notYet = () =>
    say(lang === "en" ? `That's not today's sheet. Open ${BUDGET_SHEET_NAME.en}.` : `Esa no es la hoja de hoy. Abre ${BUDGET_SHEET_NAME.es}.`);

  const formulaBarContent = (() => {
    if (selected.row === HEADER_ROW) return headerFor(selected.col);
    if (selected.row === TOTAL_ROW) {
      if (selected.col === "A") return c.totalLabel;
      if (selected.col === "B" || selected.col === "C") return `=SUM(${selected.col}${FIRST_DATA_ROW}:${selected.col}${LAST_DATA_ROW})`;
      return "";
    }
    const row = BUDGET_ROWS[selected.row - FIRST_DATA_ROW];
    if (!row) return "";
    if (selected.col === "A") return row.label[lang];
    if (selected.col === "B") return String(row.budget);
    if (selected.col === "C") return String(row.actual);
    if (selected.col === "E") return row.note[lang];
    return statusFormula(selected.row, lang);
  })();

  function headerFor(col: Col) {
    if (col === "A") return c.categoryHeader;
    if (col === "B") return c.budgetHeader;
    if (col === "C") return c.actualHeader;
    if (col === "D") return c.statusHeader;
    return c.notesHeader;
  }

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

      {(view === "sheet" || view === "compose") && <SheetEmailMenu lang={lang} onEmail={tryEmail} showMeId="email-cta" />}

      {view !== "done" && (
        <RightNowBar
          icon={TASK_ICONS["budget-sheet"]}
          stepIndex={stepIndex}
          steps={RIGHT_NOW_STEPS}
          lang={lang}
          rightNowLabel={RIGHT_NOW_LABEL}
          onShowMe={() => showMe.toggleFor(showMeIds[stepIndex])}
          showMeActive={showMe.targetId === showMeIds[stepIndex]}
          onHelp={() => setHelp(true)}
        />
      )}
      <ShowMeHighlight targetId={showMe.targetId} label={SHOW_ME_POINTER[lang]} onDismiss={showMe.clear} />

      {(view === "sheet" || view === "compose") && (
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

      {/* The sheet stays under the compose box: the numbers are what the
          learner is writing about. */}
      {(view === "sheet" || view === "compose") && (
        <div className="min-h-0 flex-1 overflow-auto">
          <div className="p-4">
            <div className="mb-4 max-w-[440px] rounded-sm border border-[#f9ab00] bg-[#fef7e0] px-3 py-2.5 text-[13px] leading-relaxed text-[#3c4043]">
              <div className="text-[11px] font-bold uppercase tracking-wide text-[#b06000]">{c.noteHeading}</div>
              <p className="mt-1">{c.noteBody}</p>
            </div>

            <div className="flex flex-wrap items-start gap-6">
              <div
                className="inline-block border border-[#c0c0c0]"
                style={{ fontSize: 13 }}
                onKeyDown={(e) => handleGridKey(e, selected, GRID_ROWS, COLS, (cell) => { showMe.clear(); select(cell); })}
              >
                {/* The two header rows stay on screen while the sheet
                    scrolls, so Budget and Actual are always labeled. */}
                <div className="sticky top-0 z-10">
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
                      tabIndex={selected.row === HEADER_ROW && selected.col === col ? 0 : -1}
                      data-grid-cell={`${HEADER_ROW}:${col}`}
                      data-showme={col === "D" ? "status-column" : undefined}
                      data-showme-look={col === "D" ? SHOW_ME_LOOK[lang] : undefined}
                      onClick={() => select({ row: HEADER_ROW, col })}
                      className={`shrink-0 border-b border-r border-[#c0c0c0] bg-[#f8f9fa] px-1.5 text-left text-[12px] font-medium cursor-pointer ${CELL_FOCUS}`}
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
                </div>
                {BUDGET_ROWS.map((row, i) => {
                  const r = FIRST_DATA_ROW + i;
                  return (
                    <div key={row.key} className="flex">
                      {renderRowLabel(r)}
                      {COLS.map((col) => {
                        const isSelected = selected.row === r && selected.col === col;
                        const status = statusFor(row.actual, row.budget);
                        let text = "";
                        if (col === "A") text = row.label[lang];
                        else if (col === "B") text = dollars(row.budget);
                        else if (col === "C") text = dollars(row.actual);
                        else if (col === "D") text = status === "over" ? c.overLabel : c.withinLabel;
                        else text = row.note[lang];
                        // No red fill on the "over" cell: finding it means
                        // reading the words and numbers, not spotting a color.
                        const cellStyle: CSSProperties = {
                          width: COL_WIDTH[col],
                          height: 26,
                          background: "white",
                          color: "#202124",
                          boxShadow: isSelected ? "inset 0 0 0 2px #1a73e8" : undefined,
                        };
                        return (
                          <button
                            key={col}
                            tabIndex={isSelected ? 0 : -1}
                            data-grid-cell={`${r}:${col}`}
                            onClick={() => { showMe.clear(); select({ row: r, col }); }}
                            className={`shrink-0 truncate border-b border-r border-[#c0c0c0] px-1.5 text-[13px] cursor-pointer ${CELL_FOCUS} ${
                              col === "B" || col === "C" ? "text-right tabular-nums" : col === "E" ? "text-left text-[#5f6368]" : "text-left"
                            }`}
                            style={cellStyle}
                          >
                            {text}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
                {/* The Total row adds up B and C. It has no Status: the
                    question is which line went over, not the whole week. */}
                <div className="flex">
                  {renderRowLabel(TOTAL_ROW)}
                  {COLS.map((col) => {
                    const text = col === "A" ? c.totalLabel : col === "B" ? dollars(BUDGET_TOTAL) : col === "C" ? dollars(ACTUAL_TOTAL) : "";
                    return (
                      <button
                        key={col}
                        tabIndex={selected.row === TOTAL_ROW && selected.col === col ? 0 : -1}
                        data-grid-cell={`${TOTAL_ROW}:${col}`}
                        onClick={() => { showMe.clear(); select({ row: TOTAL_ROW, col }); }}
                        className={`shrink-0 border-b border-r border-t-2 border-[#c0c0c0] border-t-[#5f6368] bg-[#f8f9fa] px-1.5 text-[13px] font-bold cursor-pointer ${CELL_FOCUS} ${
                          col === "B" || col === "C" ? "text-right tabular-nums" : "text-left"
                        }`}
                        style={{
                          width: COL_WIDTH[col],
                          height: 26,
                          boxShadow: selected.row === TOTAL_ROW && selected.col === col ? "inset 0 0 0 2px #1a73e8" : undefined,
                        }}
                      >
                        {text}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="min-w-[220px] rounded-xl border border-[#dadce0] bg-[#f8f9fa] p-4">
                <div className="mb-3 text-[12px] font-medium text-[#5f6368]">{c.chartTitle}</div>
                {/* Each bar is what was spent; the dashed line across it is its
                    budget. The one bar that passes its line is the answer. */}
                <svg viewBox={`0 0 ${CHART_W} 150`} className="h-[150px]" style={{ width: CHART_W }} aria-hidden>
                  {BUDGET_ROWS.map((row, i) => {
                    const h = Math.max(4, (row.actual / chartMax) * 100);
                    const budgetY = 110 - (row.budget / chartMax) * 100;
                    const x = CHART_PAD + i * CHART_SLOT + (CHART_SLOT - CHART_BAR) / 2;
                    // Every bar the same color: the learner compares each bar with its dashed line.
                    return (
                      <g key={row.key}>
                        <rect x={x} y={110 - h} width={CHART_BAR} height={h} fill="#1a73e8" rx={2} />
                        <line x1={x - 5} x2={x + CHART_BAR + 5} y1={budgetY} y2={budgetY} stroke="#202124" strokeWidth="1.5" strokeDasharray="4 3" />
                        <text x={x + CHART_BAR / 2} y={126} textAnchor="middle" fontSize="10" fill="#3c4043">
                          {row.chart[lang]}
                        </text>
                      </g>
                    );
                  })}
                  <line x1="22" x2="42" y1="144" y2="144" stroke="#202124" strokeWidth="1.5" strokeDasharray="4 3" />
                  <text x="48" y="147" fontSize="10" fill="#3c4043">{c.budgetHeader}</text>
                </svg>
              </div>
            </div>


          </div>
        </div>
      )}

      {view === "compose" && (
        // Docked right with a light scrim, so the table stays readable while writing.
        // The scrim lets clicks and scrolling through, so the learner can
        // scroll back to a row while the message is open.
        <div className="pointer-events-none absolute inset-0 flex items-center justify-end bg-black/15 p-6">
          <div className="pointer-events-auto w-full max-w-[400px] rounded-xl bg-white p-5 shadow-2xl">
            <div className="mb-3 flex gap-3 border-b border-border pb-2.5 text-[14px]">
              <span className="w-14 shrink-0 text-text-tertiary">{c.to}</span>
              <span>{CAST.renata.email}</span>
            </div>
            <div className="mb-3 flex gap-3 border-b border-border pb-2.5 text-[14px]">
              <span className="w-14 shrink-0 text-text-tertiary">{c.subjectLabel}</span>
              <span>{c.subject}</span>
            </div>
            <textarea
              ref={bodyBox}
              data-showme="compose-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={c.writeHere}
              className="min-h-[130px] w-full resize-y border-none py-3 text-[16px] leading-relaxed outline-none placeholder:text-text-tertiary"
            />
            <div className="mb-4">
              <NeedAStart
                lang={lang}
                starters={STARTERS[lang]}
                missed={missed}
                onPick={(s) => pickStarter(bodyBox, body, s, setBody)}
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
              {/* Back to the sheet keeps the draft: the learner often leaves only to look. */}
              <button onClick={() => setView("sheet")} className="min-h-[40px] px-2 text-[14px] text-text-tertiary cursor-pointer">
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
            {body.trim() ? (
              <SentEmailRecap
                heading={SENT_LABELS[lang].heading}
                toLabel={c.to}
                to={CAST.renata.email}
                subjectLabel={c.subjectLabel}
                subject={c.subject}
                body={body}
                fact={{
                  label: SENT_LABELS[lang].over,
                  value: `${overRow.label[lang]}: ${dollars(overRow.actual)} − ${dollars(overRow.budget)} = ${dollars(OVER_AMOUNT)}`,
                }}
              />
            ) : null}
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

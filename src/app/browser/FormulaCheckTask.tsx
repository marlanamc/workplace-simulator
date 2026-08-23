"use client";

import { useState, type CSSProperties } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  FORMULA_CHECK_COPY,
  STARTERS,
  LESSONS,
  EVENT_INTRO,
  WRONG_SUM_FORMULA,
  AVERAGE_FORMULA,
  WRONG_EMAIL_HINT,
  EMPTY_EMAIL_HINT,
  rangeCoversCrew,
  parseRange,
  emailMentionsFix,
} from "@/lib/tasks/formula-check/content";
import {
  CREW,
  CORRECT_COVER,
  DAYS,
  DAY_LABELS,
  GAP_DAY,
  GAP_SHIFT_LABEL,
  hoursFor,
  type DayKey,
} from "@/lib/tasks/crew-week";
import { useNudge } from "@/lib/use-nudge";
import EventIntroCard from "@/components/task/EventIntroCard";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import { TAB_ICONS, TASK_ICONS } from "@/lib/icons";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import AppHeaderTools from "@/components/task/AppHeaderTools";
import NeedAStart from "@/components/task/NeedAStart";

type View = "intro" | "home" | "sheet" | "compose" | "done";
type CellCol = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
type Cell = { row: number; col: CellCol };

const COLS: CellCol[] = ["A", "B", "C", "D", "E", "F", "G", "H"];
const HEADER_ROW = 1;
const FIRST_DATA_ROW = 2;
const LAST_CREW_ROW = FIRST_DATA_ROW + CREW.length - 1;
const TOTAL_ROW = LAST_CREW_ROW + 1;
const AVERAGE_ROW = TOTAL_ROW + 1;
const DAY_COLS: CellCol[] = ["B", "C", "D", "E", "F", "G"];

function dayForCol(col: CellCol): DayKey | null {
  const i = DAY_COLS.indexOf(col);
  return i >= 0 ? DAYS[i] : null;
}

function colWidth(col: CellCol) {
  if (col === "A") return 132;
  if (col === "H") return 88;
  return 68;
}

function cellRef(cell: Cell) {
  return `${cell.col}${cell.row}`;
}

function SheetsIcon() {
  const Icon = TAB_ICONS.spreadsheet;
  return <Icon size={18} strokeWidth={2.25} />;
}

function evalHoursFormula(formula: string, hours: number[]): number | null {
  const range = parseRange(formula);
  if (!range) return null;
  const start = Math.max(range.start, FIRST_DATA_ROW);
  const end = Math.min(range.end, LAST_CREW_ROW);
  if (end < start) return null;
  let sum = 0;
  let n = 0;
  for (let r = start; r <= end; r++) {
    sum += hours[r - FIRST_DATA_ROW] ?? 0;
    n++;
  }
  if (/average/i.test(formula)) return n ? Math.round((sum / n) * 10) / 10 : 0;
  return sum;
}

export default function FormulaCheckTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("formula-check") ? "done" : "intro");
  const [sumFormula, setSumFormula] = useState(WRONG_SUM_FORMULA);
  const [averageFormula, setAverageFormula] = useState(AVERAGE_FORMULA);
  const [selected, setSelected] = useState<Cell>({ row: TOTAL_ROW, col: "H" });
  const [body, setBody] = useState("");
  const [help, setHelp] = useState(false);
  const { nudge, say } = useNudge();

  const c = FORMULA_CHECK_COPY[lang];
  const days = DAY_LABELS[lang];
  const hours = CREW.map((m) => hoursFor(m, m.key === CORRECT_COVER));
  const sumValue = evalHoursFormula(sumFormula, hours);
  const averageValue = evalHoursFormula(averageFormula, hours);
  const selectedFormula = selected.row === TOTAL_ROW ? sumFormula : selected.row === AVERAGE_ROW ? averageFormula : null;
  const highlight = selected.col === "H" && selectedFormula ? parseRange(selectedFormula) : null;

  const tryEmail = () => {
    if (!rangeCoversCrew(sumFormula, "sum")) return say(c.fixFirst);
    if (!rangeCoversCrew(averageFormula, "average")) {
      return say(
        lang === "en"
          ? "AVERAGE should include every name too. Set it to H2:H6."
          : "AVERAGE también debe incluir todos los nombres. Ponlo en H2:H6."
      );
    }
    setView("compose");
  };

  const trySend = () => {
    if (!body.trim()) return say(EMPTY_EMAIL_HINT[lang]);
    if (!emailMentionsFix(body)) return say(WRONG_EMAIL_HINT[lang]);
    setView("done");
    markComplete("formula-check", "fix_a_formula_range");
  };

  const restart = () => {
    setView("home");
    setSumFormula(WRONG_SUM_FORMULA);
    setAverageFormula(AVERAGE_FORMULA);
    setBody("");
    setSelected({ row: TOTAL_ROW, col: "H" });
  };

  const notYet = () =>
    say(
      lang === "en"
        ? "That's not today's sheet. Open Crew Week — Aug 24."
        : "Esa no es la hoja de hoy. Abre Semana del equipo — 24 ago."
    );

  const onFormulaChange = (value: string) => {
    if (selected.row === TOTAL_ROW) setSumFormula(value);
    if (selected.row === AVERAGE_ROW) setAverageFormula(value);
  };

  const formulaBarContent = (() => {
    if (selected.col === "H" && selected.row === TOTAL_ROW) return sumFormula;
    if (selected.col === "H" && selected.row === AVERAGE_ROW) return averageFormula;
    if (selected.row === HEADER_ROW) {
      if (selected.col === "A") return c.nameHeader;
      if (selected.col === "H") return c.hoursHeader;
      const day = dayForCol(selected.col);
      return day ? days[day] : "";
    }
    if (selected.row === TOTAL_ROW) return c.totalLabel;
    if (selected.row === AVERAGE_ROW) return c.averageLabel;
    const member = CREW[selected.row - FIRST_DATA_ROW];
    if (!member) return "";
    if (selected.col === "A") return member.name;
    if (selected.col === "H") return String(hours[selected.row - FIRST_DATA_ROW]);
    const day = dayForCol(selected.col);
    if (!day) return "";
    if (day === GAP_DAY && member.key === CORRECT_COVER) return GAP_SHIFT_LABEL;
    return member.shifts[day].label;
  })();

  const formulaEditable = selected.col === "H" && (selected.row === TOTAL_ROW || selected.row === AVERAGE_ROW);

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
        <span className="text-[18px] text-[#3c4043]">{view === "home" || view === "intro" ? c.appName : c.sheetName}</span>
        <div className="flex-1" />
        <AppHeaderTools helpLabel={c.helpBtn} onHelp={() => setHelp(true)} />
      </div>

      {view === "sheet" && (
        <>
          <div className="flex items-center gap-3 border-b border-[#e0e0e0] bg-[#f9fbfd] px-4 py-1.5 text-[#5f6368]">
            {["↶", "↷", "🖨", "🖌"].map((g) => (
              <span key={g} className="flex h-6 w-6 items-center justify-center rounded text-[13px]" aria-hidden>
                {g}
              </span>
            ))}
            <span className="mx-1 h-4 w-px bg-[#dadce0]" aria-hidden />
            {["B", "I", "U"].map((g) => (
              <span key={g} className="flex h-6 w-6 items-center justify-center rounded text-[12px] font-bold" aria-hidden>
                {g}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 border-b border-[#e0e0e0] px-3 py-1.5">
            <span className="min-w-[40px] rounded border border-[#e0e0e0] px-2 py-1 text-center text-[12px] font-medium text-[#3c4043]">
              {cellRef(selected)}
            </span>
            <span className="text-[13px] italic text-[#5f6368]">fx</span>
            {formulaEditable ? (
              <input
                value={formulaBarContent}
                onChange={(e) => onFormulaChange(e.target.value)}
                className="flex-1 border-l border-[#e0e0e0] bg-white px-2 py-1 text-[13px] text-[#202124] outline-none"
                spellCheck={false}
              />
            ) : (
              <span className="flex-1 truncate border-l border-[#e0e0e0] px-2 py-1 text-[13px] text-[#202124]">
                {formulaBarContent}
              </span>
            )}
          </div>
        </>
      )}

      {view === "intro" && (
        <div className="min-h-0 flex-1 overflow-auto px-6">
          <EventIntroCard {...EVENT_INTRO[lang]} icon={TASK_ICONS["formula-check"]} onContinue={() => setView("home")} />
        </div>
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
                    className="flex h-[92px] w-[72px] items-center justify-center rounded border border-[var(--border)] shadow-sm hover:shadow-md"
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
              className="flex w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-white p-4 text-left hover:bg-[var(--surface-muted)] cursor-pointer"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-[#0f9d58] text-white">
                <SheetsIcon />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-medium text-[#3c4043]">{c.sheetName}</span>
                <span className="block text-[12px] text-[var(--text-tertiary)]">{c.openedLabel}</span>
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

            <div className="inline-block border border-[#c0c0c0]" style={{ fontSize: 13 }}>
              <div className="flex">
                <div className="flex shrink-0 items-center justify-center border-b border-r border-[#c0c0c0] bg-[#f8f9fa]" style={{ width: 32, height: 24 }} />
                {COLS.map((col) => (
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

              <div className="flex">
                {renderRowLabel(HEADER_ROW)}
                {COLS.map((col) => {
                  const label = col === "A" ? c.nameHeader : col === "H" ? c.hoursHeader : days[dayForCol(col)!];
                  return (
                    <button
                      key={col}
                      onClick={() => setSelected({ row: HEADER_ROW, col })}
                      className="shrink-0 border-b border-r border-[#c0c0c0] bg-[#f8f9fa] px-1.5 text-left text-[12px] font-medium cursor-pointer"
                      style={{
                        width: colWidth(col),
                        height: 26,
                        boxShadow: selected.row === HEADER_ROW && selected.col === col ? "inset 0 0 0 2px #1a73e8" : undefined,
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {CREW.map((member, i) => {
                const row = FIRST_DATA_ROW + i;
                const inRange = highlight ? row >= highlight.start && row <= highlight.end : false;
                return (
                  <div key={member.key} className="flex">
                    {renderRowLabel(row)}
                    {COLS.map((col) => {
                      const isSelected = selected.row === row && selected.col === col;
                      const day = dayForCol(col);
                      const hoursHighlight = col === "H" && inRange;
                      const cellStyle: CSSProperties = {
                        width: colWidth(col),
                        height: 26,
                        background: hoursHighlight ? "#d9ead3" : "white",
                        boxShadow: isSelected ? "inset 0 0 0 2px #1a73e8" : undefined,
                      };
                      let text = "";
                      if (col === "A") text = member.name;
                      else if (col === "H") text = String(hours[i]);
                      else if (day === GAP_DAY && member.key === CORRECT_COVER) text = GAP_SHIFT_LABEL;
                      else text = member.shifts[day!].label;
                      return (
                        <button
                          key={col}
                          onClick={() => setSelected({ row, col })}
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

              {([
                { row: TOTAL_ROW, label: c.totalLabel, value: sumValue },
                { row: AVERAGE_ROW, label: c.averageLabel, value: averageValue },
              ] as const).map((meta) => (
                <div key={meta.row} className="flex">
                  {renderRowLabel(meta.row)}
                  {COLS.map((col) => {
                    const isSelected = selected.row === meta.row && selected.col === col;
                    const isTotalHours = col === "H";
                    const cellStyle: CSSProperties = {
                      width: colWidth(col),
                      height: 26,
                      background: isTotalHours ? "#fef7e0" : "white",
                      boxShadow: isSelected ? "inset 0 0 0 2px #1a73e8" : undefined,
                    };
                    return (
                      <button
                        key={col}
                        onClick={() => setSelected({ row: meta.row, col })}
                        className="shrink-0 border-b border-r border-[#c0c0c0] px-1.5 text-left text-[13px] font-medium cursor-pointer"
                        style={cellStyle}
                      >
                        {col === "A" ? meta.label : col === "H" ? (meta.value === null ? "#ERROR?" : meta.value) : ""}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <button
              onClick={tryEmail}
              className="mt-4 inline-flex min-h-[44px] items-center rounded-full bg-[var(--accent)] px-5 text-[15px] font-medium text-white hover:bg-[var(--accent-hover)] cursor-pointer"
            >
              {c.emailCta}
            </button>
          </div>
        </div>
      )}

      {view === "compose" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 p-6">
          <div className="w-full max-w-[520px] rounded-xl bg-white p-5 shadow-2xl">
            <div className="mb-3 flex gap-3 border-b border-[var(--border)] pb-2.5 text-[14px]">
              <span className="w-14 shrink-0 text-[var(--text-tertiary)]">{c.to}</span>
              <span>maria.delgado@harborsidecafe.com</span>
            </div>
            <div className="mb-3 flex gap-3 border-b border-[var(--border)] pb-2.5 text-[14px]">
              <span className="w-14 shrink-0 text-[var(--text-tertiary)]">{c.subjectLabel}</span>
              <span>{c.subject}</span>
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={c.writeHere}
              className="min-h-[130px] w-full resize-y border-none py-3 text-[16px] leading-relaxed outline-none placeholder:text-[var(--text-tertiary)]"
            />
            <div className="mb-4">
              <NeedAStart
                lang={lang}
                starters={STARTERS[lang]}
                onPick={(s) => setBody((b) => (b ? `${b} ` : "") + s)}
                chipClassName="min-h-[38px] rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 text-[13px] font-medium text-[var(--accent)] hover:bg-[var(--accent-tint)] cursor-pointer"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-4">
              <button
                onClick={trySend}
                className="inline-flex min-h-[46px] items-center rounded-full bg-[var(--accent)] px-6 text-[15px] font-medium text-white hover:bg-[var(--accent-hover)] cursor-pointer"
              >
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
              badgeNumber="14"
              badgeName={c.badgeName}
              badgeWhere={c.badgeWhere}
            />
            <TaskDoneActions tryAgainLabel={c.tryAgain} backToDeskLabel={c.backToDesk} onTryAgain={restart} />
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
      <NudgeToast text={nudge} />
    </div>
  );
}

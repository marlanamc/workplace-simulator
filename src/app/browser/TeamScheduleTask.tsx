"use client";

import { useState, type CSSProperties } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  TEAM_SCHEDULE_COPY,
  STARTERS,
  LESSONS,
  CONFIDENCE_OPTIONS,
  EVENT_INTRO,
  WRONG_EMAIL_HINT,
  EMPTY_EMAIL_HINT,
  emailMentionsShift,
} from "@/lib/tasks/team-schedule/content";
import {
  CREW,
  CORRECT_COVER,
  DAYS,
  DAY_LABELS,
  GAP_DAY,
  GAP_HOURS,
  GAP_SHIFT_LABEL,
  hoursFor,
  type DayKey,
} from "@/lib/tasks/crew-week";
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
type CellCol = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
type Cell = { row: number; col: CellCol };

const COLS: CellCol[] = ["A", "B", "C", "D", "E", "F", "G", "H"];
const HEADER_ROW = 1;
const FIRST_DATA_ROW = 2;
const DAY_COLS: CellCol[] = ["B", "C", "D", "E", "F", "G"];

function colForDay(day: DayKey): CellCol {
  return DAY_COLS[DAYS.indexOf(day)];
}

function dayForCol(col: CellCol): DayKey | null {
  const i = DAY_COLS.indexOf(col);
  return i >= 0 ? DAYS[i] : null;
}

function colWidth(col: CellCol) {
  if (col === "A") return 132;
  if (col === "H") return 72;
  return 68;
}

function cellRef(cell: Cell) {
  return `${cell.col}${cell.row}`;
}

function SheetsIcon() {
  const Icon = TAB_ICONS.spreadsheet;
  return <Icon size={18} strokeWidth={2.25} />;
}

export default function TeamScheduleTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("team-schedule") ? "done" : "intro");
  const [coverKey, setCoverKey] = useState<string | null>(null);
  const [selected, setSelected] = useState<Cell>({ row: FIRST_DATA_ROW, col: "G" });
  const [body, setBody] = useState("");
  const [confidence, setConfidence] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const { nudge, say } = useNudge();

  const c = TEAM_SCHEDULE_COPY[lang];
  const days = DAY_LABELS[lang];
  const jordan = CREW.find((m) => m.key === CORRECT_COVER)!;

  const tryEmail = () => {
    if (coverKey !== CORRECT_COVER) {
      const picked = CREW.find((m) => m.key === coverKey);
      return say(picked ? picked.saturdayHint[lang] : c.fillFirst);
    }
    setView("compose");
  };

  const trySend = () => {
    if (!body.trim()) return say(EMPTY_EMAIL_HINT[lang]);
    if (!emailMentionsShift(body)) return say(WRONG_EMAIL_HINT[lang]);
    setView("done");
    markComplete("team-schedule", "build_a_crew_schedule");
  };

  const restart = () => {
    setView("home");
    setCoverKey(null);
    setBody("");
    setConfidence(null);
  };

  const notYet = () =>
    say(
      lang === "en"
        ? "That's not today's sheet. Open Crew Week — Aug 24."
        : "Esa no es la hoja de hoy. Abre Semana del equipo — 24 ago."
    );

  const assignCover = (key: string, label: string) => {
    const person = CREW.find((m) => m.key === key);
    if (!person) return;
    if (!label) {
      setCoverKey((prev) => (prev === key ? null : prev));
      return;
    }
    setCoverKey(key);
    if (key !== CORRECT_COVER) say(person.saturdayHint[lang]);
  };

  const formulaBarContent = (() => {
    if (selected.row === HEADER_ROW) {
      if (selected.col === "A") return c.nameHeader;
      if (selected.col === "H") return c.hoursHeader;
      const day = dayForCol(selected.col);
      return day ? days[day] : "";
    }
    const member = CREW[selected.row - FIRST_DATA_ROW];
    if (!member) return "";
    if (selected.col === "A") return member.name;
    if (selected.col === "H") return String(hoursFor(member, coverKey === CORRECT_COVER && member.key === CORRECT_COVER));
    const day = dayForCol(selected.col);
    if (!day) return "";
    if (day === GAP_DAY && coverKey === member.key) return GAP_SHIFT_LABEL;
    return member.shifts[day].label;
  })();

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
            <span className="flex-1 truncate border-l border-[#e0e0e0] px-2 py-1 text-[13px] text-[#202124]">
              {formulaBarContent}
            </span>
          </div>
        </>
      )}

      {view === "intro" && (
        <div className="min-h-0 flex-1 overflow-auto px-6">
          <EventIntroCard {...EVENT_INTRO[lang]} icon={TASK_ICONS["team-schedule"]} onContinue={() => setView("home")} />
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
            <div className="mb-4 max-w-[420px] rounded-sm border border-[#f9ab00] bg-[#fef7e0] px-3 py-2.5 text-[13px] leading-relaxed text-[#3c4043]">
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
                <div
                  className={`flex shrink-0 items-center justify-center border-b border-r border-[#c0c0c0] text-[12px] ${
                    selected.row === HEADER_ROW ? "bg-[#d2e3fc] text-[#1a73e8]" : "bg-[#f8f9fa] text-[#5f6368]"
                  }`}
                  style={{ width: 32, height: 26 }}
                >
                  1
                </div>
                {COLS.map((col) => {
                  const label =
                    col === "A" ? c.nameHeader : col === "H" ? c.hoursHeader : days[dayForCol(col)!];
                  const isSat = col === colForDay(GAP_DAY);
                  return (
                    <button
                      key={col}
                      onClick={() => setSelected({ row: HEADER_ROW, col })}
                      className={`shrink-0 border-b border-r border-[#c0c0c0] px-1.5 text-left text-[12px] font-medium cursor-pointer ${
                        isSat ? "text-[#b06000]" : ""
                      }`}
                      style={{
                        width: colWidth(col),
                        height: 26,
                        background: selected.row === HEADER_ROW && selected.col === col ? undefined : "#f8f9fa",
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
                const covered = coverKey === member.key;
                const hours = hoursFor(member, covered && member.key === CORRECT_COVER) + (covered && member.key !== CORRECT_COVER ? GAP_HOURS : 0);
                return (
                  <div key={member.key} className="flex">
                    <div
                      className={`flex shrink-0 items-center justify-center border-b border-r border-[#c0c0c0] text-[12px] ${
                        selected.row === row ? "bg-[#d2e3fc] text-[#1a73e8]" : "bg-[#f8f9fa] text-[#5f6368]"
                      }`}
                      style={{ width: 32, height: 28 }}
                    >
                      {row}
                    </div>
                    {COLS.map((col) => {
                      const isSelected = selected.row === row && selected.col === col;
                      const day = dayForCol(col);
                      const isGapCell = day === GAP_DAY && !member.shifts[GAP_DAY].locked;
                      const cellStyle: CSSProperties = {
                        width: colWidth(col),
                        height: 28,
                        background: isGapCell ? "#fef7e0" : "white",
                        boxShadow: isSelected ? "inset 0 0 0 2px #1a73e8" : undefined,
                      };
                      if (col === "A") {
                        return (
                          <button
                            key={col}
                            onClick={() => setSelected({ row, col })}
                            className="shrink-0 border-b border-r border-[#c0c0c0] px-1.5 text-left text-[13px] cursor-pointer"
                            style={cellStyle}
                          >
                            {member.name}
                          </button>
                        );
                      }
                      if (col === "H") {
                        return (
                          <button
                            key={col}
                            onClick={() => setSelected({ row, col })}
                            className={`shrink-0 border-b border-r border-[#c0c0c0] px-1.5 text-left text-[13px] cursor-pointer ${
                              hours > 40 ? "font-semibold text-[#c5221f]" : ""
                            }`}
                            style={cellStyle}
                          >
                            {hours}
                          </button>
                        );
                      }
                      const shift = member.shifts[day!];
                      if (isGapCell) {
                        return (
                          <select
                            key={col}
                            value={covered ? GAP_SHIFT_LABEL : ""}
                            onFocus={() => setSelected({ row, col })}
                            onChange={(e) => assignCover(member.key, e.target.value)}
                            className="shrink-0 border-b border-r border-[#c0c0c0] bg-[#fef7e0] px-0.5 text-[12px] outline-none cursor-pointer"
                            style={cellStyle}
                          >
                            <option value="">{c.pickShift}</option>
                            <option value={GAP_SHIFT_LABEL}>{GAP_SHIFT_LABEL}</option>
                          </select>
                        );
                      }
                      return (
                        <button
                          key={col}
                          onClick={() => {
                            setSelected({ row, col });
                            if (day === GAP_DAY && shift.locked) say(member.saturdayHint[lang]);
                          }}
                          className="shrink-0 border-b border-r border-[#c0c0c0] px-1.5 text-left text-[13px] cursor-pointer"
                          style={cellStyle}
                        >
                          {shift.label}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
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
              <span>{jordan.email}</span>
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
              badgeNumber="13"
              badgeName={c.badgeName}
              badgeWhere={c.badgeWhere}
            />
            <ConfidenceCheck
              question={c.confidenceQ}
              options={CONFIDENCE_OPTIONS[lang]}
              selected={confidence}
              onSelect={setConfidence}
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
      <NudgeToast text={nudge} bottom={32} />
    </div>
  );
}

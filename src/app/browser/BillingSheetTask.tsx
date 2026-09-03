"use client";

import { useState, type CSSProperties } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  BILLING_COPY,
  BILLING_ROWS,
  REFERENCE,
  MISMATCH_KEY,
  STARTERS,
  LESSONS,
  EMPTY_EMAIL_HINT,
  WRONG_EMAIL_HINT,
  OFFICE_EMAIL,
  emailFlagsMismatch,
  RIGHT_NOW_STEPS,
  RIGHT_NOW_LABEL,
} from "@/lib/tasks/billing-sheet/content";
import { useNudge } from "@/lib/use-nudge";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import { TAB_ICONS, TASK_ICONS } from "@/lib/icons";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import RightNowBar from "@/components/task/RightNowBar";
import NeedAStart from "@/components/task/NeedAStart";

type View = "home" | "sheet" | "compose" | "done";
type Col = "A" | "B" | "C";
type Cell = { row: number; col: Col };

const COLS: Col[] = ["A", "B", "C"];
const HEADER_ROW = 1;
const FIRST_DATA_ROW = 2;
const COL_WIDTH: Record<Col, number> = { A: 160, B: 88, C: 88 };

function SheetsIcon() {
  const Icon = TAB_ICONS.spreadsheet;
  return <Icon size={18} strokeWidth={2.25} />;
}

export default function BillingSheetTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("billing-sheet") ? "done" : "home");
  const [selected, setSelected] = useState<Cell>({ row: FIRST_DATA_ROW, col: "A" });
  const [openedMismatch, setOpenedMismatch] = useState(false);
  const [body, setBody] = useState("");
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const c = BILLING_COPY[lang];

  const select = (cell: Cell) => {
    setSelected(cell);
    const row = BILLING_ROWS[cell.row - FIRST_DATA_ROW];
    if (row?.key === MISMATCH_KEY) setOpenedMismatch(true);
  };

  const tryEmail = () => {
    if (!openedMismatch) return say(c.readFirst);
    setView("compose");
  };

  const trySend = () => {
    if (!body.trim()) return say(EMPTY_EMAIL_HINT[lang]);
    if (!emailFlagsMismatch(body)) return say(WRONG_EMAIL_HINT[lang]);
    setView("done");
    markComplete("billing-sheet", "flag_billing_mismatch");
  };

  const restart = () => {
    setView("home");
    setSelected({ row: FIRST_DATA_ROW, col: "A" });
    setOpenedMismatch(false);
    setBody("");
  };

  const notYet = () =>
    say(lang === "en" ? "That's not today's sheet. Open Visit charges — Monday." : "Esa no es la hoja de hoy. Abre Cargos de visita — lunes.");

  const headerFor = (col: Col) =>
    col === "A" ? c.patientHeader : col === "B" ? c.codeHeader : c.chargeHeader;

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
          icon={TASK_ICONS["billing-sheet"]}
          stepIndex={view === "home" ? 0 : view === "sheet" ? 1 : 2}
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
          <div className="mb-4 max-w-[440px] rounded-sm border border-[#f9ab00] bg-[#fef7e0] px-3 py-2.5 text-[13px] leading-relaxed text-[#3c4043]">
            <div className="text-[11px] font-bold uppercase tracking-wide text-[#b06000]">{c.noteHeading}</div>
            <p className="mt-1">{c.noteBody}</p>
          </div>
          <div className="mb-5 max-w-[360px] rounded-xl border border-[#dadce0] bg-[#f8f9fa] p-3">
            <div className="mb-2 text-[12px] font-medium text-[#5f6368]">{c.refHeading}</div>
            {REFERENCE.map((r) => (
              <div key={r.code} className="flex justify-between py-0.5 text-[13px]">
                <span>{r.code} · {r.label[lang]}</span>
                <span className="tabular-nums">${r.charge}</span>
              </div>
            ))}
          </div>
          <div className="inline-block border border-[#c0c0c0]" style={{ fontSize: 13 }}>
            <div className="flex">
              <div className="flex shrink-0 items-center justify-center border-b border-r border-[#c0c0c0] bg-[#f8f9fa]" style={{ width: 32, height: 24 }} />
              {COLS.map((col) => (
                <div key={col} className="flex shrink-0 items-center justify-center border-b border-r border-[#c0c0c0] bg-[#f8f9fa] text-[12px] font-medium text-[#5f6368]" style={{ width: COL_WIDTH[col], height: 24 }}>
                  {col}
                </div>
              ))}
            </div>
            <div className="flex">
              <div className="flex shrink-0 items-center justify-center border-b border-r border-[#c0c0c0] bg-[#f8f9fa] text-[12px]" style={{ width: 32, height: 26 }}>{HEADER_ROW}</div>
              {COLS.map((col) => (
                <div key={col} className="flex shrink-0 items-center border-b border-r border-[#c0c0c0] bg-[#f8f9fa] px-1.5 text-[12px] font-medium" style={{ width: COL_WIDTH[col], height: 26 }}>
                  {headerFor(col)}
                </div>
              ))}
            </div>
            {BILLING_ROWS.map((row, i) => {
              const r = FIRST_DATA_ROW + i;
              const mismatch = row.key === MISMATCH_KEY;
              return (
                <div key={row.key} className="flex">
                  <div className={`flex shrink-0 items-center justify-center border-b border-r border-[#c0c0c0] text-[12px] ${selected.row === r ? "bg-[#d2e3fc] text-[#1a73e8]" : "bg-[#f8f9fa] text-[#5f6368]"}`} style={{ width: 32, height: 26 }}>
                    {r}
                  </div>
                  {COLS.map((col) => {
                    const isSelected = selected.row === r && selected.col === col;
                    const text = col === "A" ? row.patient : col === "B" ? row.code : `$${row.charge}`;
                    const cellStyle: CSSProperties = {
                      width: COL_WIDTH[col],
                      height: 26,
                      background: mismatch && col === "C" ? "#fce8e6" : "white",
                      color: mismatch && col === "C" ? "#c5221f" : "#202124",
                      boxShadow: isSelected ? "inset 0 0 0 2px #1a73e8" : undefined,
                    };
                    return (
                      <button
                        key={col}
                        type="button"
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
          <div>
            <button
              type="button"
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
              <span>{OFFICE_EMAIL}</span>
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
            <NeedAStart
              lang={lang}
              starters={STARTERS[lang]}
              onPick={(s) => setBody((b) => (b ? `${b} ` : "") + s)}
              chipClassName="min-h-[38px] rounded-full border border-border bg-surface-muted px-3 text-[13px] font-medium text-accent hover:bg-accent-tint cursor-pointer"
            />
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
              <button type="button" onClick={trySend} className="inline-flex min-h-[46px] items-center rounded-full bg-accent px-6 text-[15px] font-medium text-white cursor-pointer">
                {c.send}
              </button>
              <button type="button" onClick={() => { setView("sheet"); setBody(""); }} className="min-h-[40px] px-2 text-[14px] text-text-tertiary cursor-pointer">
                {c.discard}
              </button>
            </div>
          </div>
        </div>
      )}

      {view === "done" && (
        <div className="absolute inset-0 overflow-y-auto bg-surface-muted p-6">
          <div className="mx-auto flex max-w-[640px] flex-col gap-5">
            <TaskDoneCard kicker={c.sentKicker} />
            <TaskDoneActions kicker={c.sentKicker} tryAgainLabel={c.tryAgain} backToDeskLabel={c.backToDesk} onTryAgain={restart} />
          </div>
        </div>
      )}

      <HelpDrawer open={help} onClose={() => setHelp(false)} kicker={c.lessonKicker} lesson={LESSONS[lang][0]} tipLabel={c.tipLabel} gotItLabel={c.gotIt} />
      <NudgeToast text={nudge} onDismiss={dismiss} />
    </div>
  );
}

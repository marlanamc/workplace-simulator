"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  MAKE_COPY_COPY,
  HINTS,
  LESSONS,
  RIGHT_NOW_STEPS,
  RIGHT_NOW_LABEL,
} from "@/lib/tasks/make-a-copy/content";
import { COPY_NAME, STATUS_ROWS, normalizeCopyName } from "@/lib/tasks/status-sheet";
import { useNudge } from "@/lib/use-nudge";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import { TAB_ICONS, TASK_ICONS } from "@/lib/icons";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import AppHeaderTools from "@/components/task/AppHeaderTools";
import RightNowBar from "@/components/task/RightNowBar";

type View = "home" | "template" | "copy" | "done";

export default function MakeACopyTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("make-a-copy") ? "done" : "home");
  const [fileOpen, setFileOpen] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [copyName, setCopyName] = useState("Copy of Weekly Status Template");
  const [typed, setTyped] = useState("");
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const c = MAKE_COPY_COPY[lang];

  const tryCopy = () => {
    if (normalizeCopyName(copyName) !== COPY_NAME) return say(HINTS.name[lang]);
    setDialog(false);
    setFileOpen(false);
    setView("copy");
  };

  const tryTypeOnTemplate = () => say(HINTS.typeTemplate[lang]);

  const onTyped = (value: string) => {
    setTyped(value);
    if (value.trim()) {
      setView("done");
      markComplete("make-a-copy", "make_a_copy_view_only");
    }
  };

  const restart = () => {
    setView("home");
    setFileOpen(false);
    setDialog(false);
    setCopyName("Copy of Weekly Status Template");
    setTyped("");
  };

  const notYet = () =>
    say(lang === "en" ? "Open the Weekly Status Template Maria shared." : "Abre la Plantilla de estado semanal que compartió Maria.");

  const sheetName = view === "copy" ? COPY_NAME : view === "template" ? c.templateName : c.appName;

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-white text-[14px] text-[#202124]" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div className="flex items-center gap-3 border-b border-[#e0e0e0] px-4 py-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#0f9d58] text-white">
          {(() => {
            const Icon = TAB_ICONS.spreadsheet;
            return <Icon size={18} strokeWidth={2.25} />;
          })()}
        </span>
        <span className="min-w-0 flex-1 truncate text-[18px] text-[#3c4043]">{sheetName}</span>
        {view !== "done" && (
          <RightNowBar
            icon={TASK_ICONS["make-a-copy"]}
            stepIndex={view === "home" ? 0 : view === "template" ? 1 : 2}
            steps={RIGHT_NOW_STEPS}
            lang={lang}
            rightNowLabel={RIGHT_NOW_LABEL}
            onHelp={() => setHelp(true)}
          />
        )}

        {(view === "template" || view === "copy") && (
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${view === "template" ? "bg-[#fef7e0] text-[#b06000]" : "bg-[#e6f4ea] text-[#137333]"}`}>
            {view === "template" ? c.viewOnly : lang === "en" ? "Can edit" : "Puede editar"}
          </span>
        )}
        <AppHeaderTools helpLabel={c.helpBtn} onHelp={() => setHelp(true)} />
      </div>

      {(view === "template" || view === "copy") && (
        <div className="relative flex items-center gap-1 border-b border-[#e0e0e0] px-2 py-1 text-[13px] text-[#3c4043]">
          <button
            onClick={() => setFileOpen((v) => !v)}
            className={`rounded px-2 py-1 cursor-pointer ${fileOpen ? "bg-[#e8f0fe] text-[#1967d2]" : "hover:bg-[#f1f3f4]"}`}
          >
            {c.fileMenu}
          </button>
          {["Edit", "View", "Insert"].map((m) => (
            <span key={m} className="rounded px-2 py-1 text-[#5f6368]">{m}</span>
          ))}
          {fileOpen && (
            <div className="absolute left-2 top-full z-20 w-[220px] rounded-lg border border-[#dadce0] bg-white py-1 shadow-lg">
              <button onClick={() => { setFileOpen(false); setDialog(true); }} className="flex h-9 w-full items-center px-3 text-left hover:bg-[#f1f3f4] cursor-pointer">
                {c.makeCopy}
              </button>
              <button onClick={() => { setFileOpen(false); say(HINTS.share[lang]); }} className="flex h-9 w-full items-center px-3 text-left hover:bg-[#f1f3f4] cursor-pointer">
                {c.share}
              </button>
              <button onClick={() => { setFileOpen(false); say(HINTS.download[lang]); }} className="flex h-9 w-full items-center px-3 text-left hover:bg-[#f1f3f4] cursor-pointer">
                {c.download}
              </button>
            </div>
          )}
        </div>
      )}

      {view === "home" && (
        <div className="min-h-0 flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-[760px]">
            <h3 className="mb-3 text-[14px] font-medium text-[#3c4043]">{c.startNewHeading}</h3>
            <div className="mb-8 flex flex-wrap gap-4">
              {[c.blankLabel, c.templateBudget, c.templateSchedule].map((label) => (
                <button key={label} onClick={notYet} className="flex flex-col items-center gap-2 cursor-pointer">
                  <span className="flex h-[92px] w-[72px] items-center justify-center rounded border border-[var(--border)] bg-white text-[26px] text-[#0f9d58] shadow-sm">+</span>
                  <span className="text-[12px] text-[#3c4043]">{label}</span>
                </button>
              ))}
            </div>
            <h3 className="mb-3 text-[14px] font-medium text-[#3c4043]">{c.recentHeading}</h3>
            <button
              onClick={() => setView("template")}
              className="flex w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-white p-4 text-left hover:bg-[var(--surface-muted)] cursor-pointer"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-[#0f9d58] text-white">
                {(() => {
                  const Icon = TAB_ICONS.spreadsheet;
                  return <Icon size={18} strokeWidth={2.25} />;
                })()}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-medium">{c.templateName}</span>
                <span className="block text-[12px] text-[var(--text-tertiary)]">{c.openedLabel}</span>
              </span>
            </button>
          </div>
        </div>
      )}

      {(view === "template" || view === "copy") && (
        <div className="min-h-0 flex-1 overflow-auto p-4">
          {view === "copy" && (
            <div className="mb-3 max-w-[420px] rounded-sm border border-[#137333] bg-[#e6f4ea] px-3 py-2 text-[13px] text-[#137333]">
              {c.typeHint}
            </div>
          )}
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
              <div className="flex h-7 w-8 items-center justify-center border-b border-r border-[#c0c0c0] bg-[#f8f9fa] text-[12px] text-[#5f6368]">1</div>
              <div className="flex h-7 w-[140px] items-center border-b border-r border-[#c0c0c0] bg-[#f8f9fa] px-1.5 font-medium">Day</div>
              <div className="flex h-7 w-[140px] items-center border-b border-r border-[#c0c0c0] bg-[#f8f9fa] px-1.5 font-medium">Tickets</div>
            </div>
            {STATUS_ROWS.map((row, i) => (
              <div key={row.key} className="flex">
                <div className="flex h-7 w-8 items-center justify-center border-b border-r border-[#c0c0c0] bg-[#f8f9fa] text-[12px] text-[#5f6368]">{i + 2}</div>
                <div className="flex h-7 w-[140px] items-center border-b border-r border-[#c0c0c0] px-1.5">{lang === "en" ? row.day : row.dayEs}</div>
                {view === "copy" && i === 0 ? (
                  <input
                    value={typed}
                    onChange={(e) => onTyped(e.target.value)}
                    placeholder={String(row.value)}
                    className="h-7 w-[140px] border-b border-r border-[#c0c0c0] px-1.5 outline-none"
                  />
                ) : (
                  <button
                    onClick={view === "template" ? tryTypeOnTemplate : undefined}
                    className="flex h-7 w-[140px] items-center border-b border-r border-[#c0c0c0] px-1.5 text-left cursor-pointer"
                  >
                    {row.value}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {dialog && (
        <div className="absolute inset-0 z-30 flex items-start justify-center bg-black/32 pt-16">
          <div className="w-[min(100%-2rem,420px)] rounded-3xl bg-white p-6 shadow-[0_4px_8px_3px_rgba(60,64,67,.15)]">
            <h2 className="mb-4 text-[22px] font-normal">{c.copyTitle}</h2>
            <label className="mb-1 block text-[12px] text-[#5f6368]">{c.nameLabel}</label>
            <input
              autoFocus
              value={copyName}
              onChange={(e) => setCopyName(e.target.value)}
              className="w-full rounded border border-[#747775] px-3 py-2 text-[14px] outline-none focus:border-2 focus:border-[#0b57d0]"
            />
            <p className="mt-2 text-[12px] text-[#5f6368]">{c.nameHint}</p>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setDialog(false)} className="h-10 rounded-full px-4 text-[14px] font-medium text-[#0b57d0] cursor-pointer">
                {c.cancel}
              </button>
              <button onClick={tryCopy} className="h-10 rounded-full bg-[#0b57d0] px-6 text-[14px] font-medium text-white cursor-pointer">
                {c.makeCopyCta}
              </button>
            </div>
          </div>
        </div>
      )}

      {view === "done" && (
        <div className="absolute inset-0 overflow-y-auto bg-[var(--surface-muted)] p-6">
          <div className="mx-auto flex max-w-[640px] flex-col gap-5">
            <TaskDoneCard
              kicker={c.typedKicker}
              title={c.doneTitle}
              body={c.doneBody}
              badgeNumber="10"
              badgeName={c.badgeName}
              badgeWhere={c.badgeWhere}
            />
            <TaskDoneActions kicker={c.typedKicker} tryAgainLabel={c.tryAgain} backToDeskLabel={c.backToDesk} onTryAgain={restart} />
          </div>
        </div>
      )}

      <HelpDrawer
        open={help}
        onClose={() => setHelp(false)}
        kicker={c.lessonKicker}
        lesson={LESSONS[lang][view === "copy" || view === "done" ? 1 : 0]}
        tipLabel={c.tipLabel}
        gotItLabel={c.gotIt}
      />
      <NudgeToast text={nudge} onDismiss={dismiss} />
    </div>
  );
}

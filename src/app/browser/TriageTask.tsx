"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  TRIAGE_COPY,
  HINTS,
  LESSONS,
  RIGHT_NOW_STEPS,
  RIGHT_NOW_LABEL,
} from "@/lib/tasks/triage/content";
import { useNudge } from "@/lib/use-nudge";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import TaskHub from "@/components/task/TaskHub";
import { TASK_ICONS } from "@/lib/icons";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import AppHeaderTools from "@/components/task/AppHeaderTools";
import RightNowBar from "@/components/task/RightNowBar";
import { Calendar, FolderOpen } from "lucide-react";

type View = "hub" | "calendar" | "files" | "done";

export default function TriageTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("triage") ? "done" : "hub");
  const [calDone, setCalDone] = useState(false);
  const [fileDone, setFileDone] = useState(false);
  const [permission, setPermission] = useState<"view" | "edit" | null>(null);
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const c = TRIAGE_COPY[lang];
  const h = HINTS[lang];

  const finishIfReady = (nextCal: boolean, nextFile: boolean) => {
    if (nextCal && nextFile) {
      setView("done");
      markComplete("triage", "handle_two_requests");
    } else {
      setView("hub");
    }
  };

  const proposeTime = () => {
    setCalDone(true);
    finishIfReady(true, fileDone);
  };

  const tryShare = () => {
    if (permission === "edit") return say(h.edit);
    if (permission !== "view") {
      return say(lang === "en" ? "Choose Viewer." : "Elige Lector.");
    }
    setFileDone(true);
    finishIfReady(calDone, true);
  };

  const restart = () => {
    setView("hub");
    setCalDone(false);
    setFileDone(false);
    setPermission(null);
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-white text-[14px] text-[#202124]" style={{ fontFamily: "Roboto, Arial, sans-serif" }}>
      <div className="flex items-center gap-3 border-b border-[#e0e0e0] px-4 py-2.5">
        <span className="text-[18px] text-[#3c4043]">
          {view === "calendar" ? "Calendar" : view === "files" ? "Drive" : lang === "en" ? "Today" : "Hoy"}
        </span>
        <div className="flex-1" />
        <AppHeaderTools helpLabel={c.helpBtn} onHelp={() => setHelp(true)} />
      </div>

      {view !== "done" && (
        <RightNowBar
          icon={TASK_ICONS.triage}
          stepIndex={view === "hub" ? 0 : view === "calendar" ? 1 : 2}
          stepCount={RIGHT_NOW_STEPS.length}
          instruction={RIGHT_NOW_STEPS[view === "hub" ? 0 : view === "calendar" ? 1 : 2]}
          lang={lang}
          rightNowLabel={RIGHT_NOW_LABEL}
          onHelp={() => setHelp(true)}
        />
      )}

      {view === "hub" && (
        <div className="min-h-0 flex-1 overflow-auto">
          <TaskHub
            heading={c.hubHeading}
            items={[
              {
                key: "cal",
                color: "#34a853",
                icon: Calendar,
                title: c.calTitle,
                body: c.calBody,
                done: calDone,
                cta: c.calCta,
                onOpen: () => setView("calendar"),
              },
              {
                key: "file",
                color: "#fbbc04",
                icon: FolderOpen,
                title: c.fileTitle,
                body: c.fileBody,
                done: fileDone,
                cta: c.fileCta,
                onOpen: () => setView("files"),
              },
            ]}
          />
        </div>
      )}

      {view === "calendar" && (
        <div className="min-h-0 flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-[420px] overflow-hidden rounded-3xl border border-[#dadce0] bg-white shadow-sm">
            <div className="h-2 bg-[#1a73e8]" />
            <div className="px-6 pb-5 pt-4">
              <h2 className="text-[22px] font-normal">{c.meetingTitle}</h2>
              <p className="mt-1 text-[14px]">{c.meetingWhen}</p>
              <p className="mt-3 text-[13px] text-[#c5221f]">{c.meetingNote}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => say(h.accept)} className="min-h-[40px] rounded-full border border-[#dadce0] px-4 text-[14px] font-medium cursor-pointer">
                  {c.accept}
                </button>
                <button onClick={() => say(h.no)} className="min-h-[40px] rounded-full border border-[#dadce0] px-4 text-[14px] font-medium cursor-pointer">
                  {c.no}
                </button>
              </div>
              <button
                onClick={proposeTime}
                className="mt-3 inline-flex min-h-[40px] items-center text-[14px] font-medium text-[#0b57d0] cursor-pointer"
              >
                {c.propose} · {c.slotLabel}
              </button>
              <button onClick={() => setView("hub")} className="mt-4 block text-[13px] text-[#5f6368] cursor-pointer">
                ← {c.hubHeading}
              </button>
            </div>
          </div>
        </div>
      )}

      {view === "files" && (
        <div className="min-h-0 flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-[480px]">
            <button
              onClick={() => say(h.file)}
              className="mb-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-[#f1f3f4] cursor-pointer"
            >
              <span className="flex h-6 w-5 items-center justify-center rounded-[2px] bg-[#ea4335] text-[8px] font-bold text-white">PDF</span>
              <span>{c.fileWrong}.pdf</span>
            </button>
            <div className="rounded-xl border border-[#dadce0] p-4">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-6 w-5 items-center justify-center rounded-[2px] bg-[#ea4335] text-[8px] font-bold text-white">PDF</span>
                <span className="font-medium">{c.fileName}.pdf</span>
              </div>
              <p className="mb-3 text-[13px] text-[#444746]">{c.shareWith}</p>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setPermission("view")}
                  className={`flex min-h-[44px] items-center justify-between rounded-lg border px-3 text-[14px] cursor-pointer ${
                    permission === "view" ? "border-[#0b57d0] bg-[#e8f0fe]" : "border-[#dadce0]"
                  }`}
                >
                  {c.canView}
                </button>
                <button
                  onClick={() => setPermission("edit")}
                  className={`flex min-h-[44px] items-center justify-between rounded-lg border px-3 text-[14px] cursor-pointer ${
                    permission === "edit" ? "border-[#0b57d0] bg-[#e8f0fe]" : "border-[#dadce0]"
                  }`}
                >
                  {c.canEdit}
                </button>
              </div>
              <button onClick={tryShare} className="mt-4 inline-flex h-10 items-center rounded-full bg-[#0b57d0] px-6 text-[14px] font-medium text-white cursor-pointer">
                {c.share}
              </button>
            </div>
            <button onClick={() => setView("hub")} className="mt-4 text-[13px] text-[#5f6368] cursor-pointer">
              ← {c.hubHeading}
            </button>
          </div>
        </div>
      )}

      {view === "done" && (
        <div className="min-h-0 flex-1 overflow-y-auto bg-[var(--surface-muted)] p-6">
          <div className="mx-auto flex max-w-[640px] flex-col gap-5">
            <TaskDoneCard
              kicker={c.sentKicker}
              title={c.doneTitle}
              body={c.doneBody}
              badgeNumber="12"
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

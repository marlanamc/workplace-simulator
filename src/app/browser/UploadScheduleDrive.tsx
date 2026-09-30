"use client";

import { useState } from "react";
import { ChevronRight, Folder, Home, Plus, Upload, FolderPlus } from "lucide-react";
import { useProgress } from "@/lib/progress-context";
import { useNudge } from "@/lib/use-nudge";
import { SHOW_ME_POINTER, useShowMe } from "@/lib/use-show-me";
import { useJobCardOptional } from "@/lib/job-card-context";
import { FOLDER_ICONS, TASK_ICONS } from "@/lib/icons";
import { FILES_COPY, FOLDER_LABEL, MESSY_FILES } from "@/lib/tasks/files/content";
import {
  SCHEDULE_DOWNLOADED_FLAG,
  GOAL,
  LESSONS,
  NEXT_SCHEDULE_NAME,
  PICKER_PAGES,
  RIGHT_NOW_LABEL,
  RIGHT_NOW_STEPS,
  UPLOAD_COPY,
  UPLOAD_FOLDER,
  downloadsFor,
  uploadCorrection,
  uploadProblem,
  uploadStartProblem,
} from "@/lib/tasks/upload-schedule/content";
import { PdfSheet } from "@/components/task/PdfSheet";
import PickerModal from "@/components/task/PickerModal";
import RightNowBar from "@/components/task/RightNowBar";
import ShowMeHighlight from "@/components/task/ShowMeHighlight";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import DriveMark from "./DriveMark";

const FOLDERS = Object.keys(FOLDER_LABEL);

/**
 * Day 10's first job in Drive: upload next week's schedule (downloaded from
 * Renata's email in Mail) into the Schedules folder. A file goes to the
 * folder that is open, the way Drive works, so the folder is part of the
 * skill. The picker opens on Downloads and shows each page, so the learner
 * tells next week from this week by reading.
 */
export default function UploadScheduleDrive() {
  const { markComplete, completedTaskKeys, lang, storyFlags, displayName } = useProgress();
  const downloaded = storyFlags[SCHEDULE_DOWNLOADED_FLAG] === "true";
  const [done, setDone] = useState(completedTaskKeys.includes("upload-schedule"));
  const [folder, setFolder] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const [picker, setPicker] = useState(false);
  const [pick, setPick] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const showMe = useShowMe();
  const clearCorrection = useJobCardOptional()?.clearCorrection;
  const c = UPLOAD_COPY[lang];
  const fc = FILES_COPY[lang];

  const inSchedules = folder === UPLOAD_FOLDER;
  const stepIndex = !downloaded ? 0 : picker ? 4 : inSchedules ? 3 : 2;
  const showMeId = picker
    ? "upload-list"
    : menu
      ? "file-upload"
      : inSchedules
        ? "drive-new"
        : "folder-Schedules";

  const openFolder = (f: string | null) => {
    showMe.clear();
    clearCorrection?.();
    setMenu(false);
    setFolder(f);
  };

  const startUpload = () => {
    showMe.clear();
    setMenu(false);
    const problem = uploadStartProblem(folder);
    if (problem) return say(uploadCorrection(problem, folder)[lang]);
    setPick(null);
    setPicker(true);
  };

  const finishUpload = (key: string) => {
    const problem = uploadProblem(key, folder, downloaded);
    if (problem === "wrong-file") {
      const item = downloadsFor(downloaded).find((i) => i.key === key);
      return say((item?.wrongHint ?? uploadCorrection(problem, folder))[lang]);
    }
    if (problem) return say(uploadCorrection(problem, folder)[lang]);
    setPicker(false);
    setPick(null);
    setDone(true);
    markComplete("upload-schedule", "download_and_upload");
  };

  const restart = () => {
    setDone(false);
    setFolder(null);
    setMenu(false);
    setPicker(false);
    setPick(null);
  };

  // Schedules shows what is really there: next week's file only once uploaded.
  const rows = MESSY_FILES.filter(
    (f) => f.folder === folder && (f.key !== "sched-sept" || done),
  );

  return (
    <div className="flex h-full min-h-0 flex-col bg-white text-[14px] text-[#1f1f1f]" style={{ fontFamily: "Roboto, Arial, sans-serif" }}>
      <div className="flex items-center gap-3 px-3 py-2">
        <div className="flex w-[220px] shrink-0 items-center gap-2 px-2">
          <DriveMark />
          <span className="text-[22px] font-normal text-[#5f6368]">Drive</span>
        </div>
      </div>

      {!done && (
        <RightNowBar
          icon={TASK_ICONS["upload-schedule"]}
          taskKey="upload-schedule"
          stepIndex={stepIndex}
          steps={RIGHT_NOW_STEPS}
          goal={GOAL}
          lang={lang}
          rightNowLabel={RIGHT_NOW_LABEL}
          onShowMe={downloaded ? () => showMe.toggleFor(showMeId) : undefined}
          showMeActive={showMe.targetId === showMeId}
          onHelp={() => setHelp(true)}
        />
      )}

      {done ? (
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="mx-auto flex max-w-[640px] flex-col gap-5">
            <TaskDoneCard kicker={c.doneKicker} title={c.doneTitle} body={c.doneBody} badgeName={c.badgeName} badgeWhere={c.badgeWhere} />
            {/* The result itself: the file, in the folder it went to. */}
            <div data-testid="upload-done-result" className="flex items-center gap-3 rounded-xl border border-[#dadce0] px-4 py-3">
              <span className="flex h-6 w-5 shrink-0 items-center justify-center rounded-[2px] bg-[#ea4335] text-[8px] font-bold text-white">PDF</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-medium">{NEXT_SCHEDULE_NAME}</span>
                <span className="block text-[12px] text-[#5f6368]">{fc.sharedFolderName} › {FOLDER_LABEL[UPLOAD_FOLDER][lang]}</span>
              </span>
            </div>
            <TaskDoneActions taskKey="upload-schedule" kicker={c.doneKicker} tryAgainLabel={c.tryAgain} backToDeskLabel={c.backToDesk} onTryAgain={restart} />
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1">
          <div className="relative flex w-[220px] shrink-0 flex-col gap-0.5 px-3 pt-1">
            <button
              type="button"
              data-showme="drive-new"
              data-card-avoid
              aria-expanded={menu}
              aria-haspopup="menu"
              onClick={() => { showMe.clear(); setMenu((m) => !m); }}
              className="mb-3 flex h-14 items-center gap-3 rounded-2xl bg-white px-4 text-[14px] font-medium text-[#1f1f1f] shadow-[0_1px_2px_0_rgba(60,64,67,.3),0_1px_3px_1px_rgba(60,64,67,.15)] hover:bg-[#f8f9fa] cursor-pointer"
            >
              <Plus size={20} strokeWidth={2} className="text-[#444746]" />
              {fc.newBtn}
            </button>
            {menu && (
              <div role="menu" className="absolute left-3 top-16 z-20 w-[220px] rounded-lg bg-white py-2 shadow-[0_4px_8px_3px_rgba(60,64,67,.15)]">
                <button type="button" role="menuitem" onClick={() => { setMenu(false); say(c.newFolderNote); }}
                  className="flex h-11 w-full items-center gap-3 px-4 text-left text-[14px] hover:bg-[#f1f3f4] cursor-pointer">
                  <FolderPlus size={18} className="text-[#444746]" /> {c.newFolder}
                </button>
                <button type="button" role="menuitem" data-showme="file-upload" data-card-avoid onClick={startUpload}
                  className="flex h-11 w-full items-center gap-3 px-4 text-left text-[14px] hover:bg-[#f1f3f4] cursor-pointer">
                  <Upload size={18} className="text-[#444746]" /> {c.fileUpload}
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() => openFolder(null)}
              className={`flex h-10 items-center gap-3 rounded-full px-4 text-[14px] cursor-pointer ${folder === null ? "bg-[#c2e7ff] font-medium text-[#041e49]" : "text-[#444746] hover:bg-[#e8eaed]"}`}
            >
              <Home size={18} /> {fc.sharedFolderName}
            </button>
          </div>

          <div className="relative min-w-0 flex-1 overflow-y-auto px-4 pb-6 pt-2">
            <nav aria-label={lang === "en" ? "Folder path" : "Ruta de la carpeta"} className="mb-3 mt-2 flex items-center gap-1 text-[16px]">
              <button type="button" onClick={() => openFolder(null)} className={`rounded-full px-2 py-1 cursor-pointer hover:bg-[#f1f3f4] ${folder ? "text-[#444746]" : "font-medium"}`}>
                {fc.sharedFolderName}
              </button>
              {folder && (
                <>
                  <ChevronRight size={16} className="text-[#5f6368]" aria-hidden />
                  <span className="px-2 py-1 font-medium" aria-current="page">{FOLDER_LABEL[folder]?.[lang] ?? folder}</span>
                </>
              )}
            </nav>

            {folder === null ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {FOLDERS.map((f) => {
                  const Icon = FOLDER_ICONS[f] ?? Folder;
                  return (
                    <button
                      key={f}
                      type="button"
                      data-showme={`folder-${f}`}
                      onClick={() => openFolder(f)}
                      className="flex items-center gap-3 rounded-xl bg-[#f0f4f9] px-4 py-3 text-left hover:bg-[#e8eaed] cursor-pointer"
                    >
                      <Icon size={20} strokeWidth={2} className="shrink-0 text-[#5f6368]" />
                      <span className="truncate text-[14px] font-medium">{FOLDER_LABEL[f]?.[lang] ?? f}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-[1fr_120px_88px] gap-2 border-b border-[#e0e3e8] px-3 py-2 text-[12px] font-medium text-[#444746]">
                  <span>{c.colName}</span>
                  <span>{lang === "en" ? "Owner" : "Propietario"}</span>
                  <span className="text-right">{c.colDate}</span>
                </div>
                {rows.map((f) => (
                  <div key={f.key} className="grid grid-cols-[1fr_120px_88px] items-center gap-2 px-3 py-2.5">
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex h-6 w-5 shrink-0 items-center justify-center rounded-[2px] bg-[#ea4335] text-[8px] font-bold text-white">PDF</span>
                      <span className="truncate text-[14px]">{f.name}</span>
                    </span>
                    <span className="truncate text-[13px] text-[#444746]">Renata Silva</span>
                    <span className="text-right text-[13px] text-[#444746]">{f.date}</span>
                  </div>
                ))}
                {rows.length === 0 && (
                  <p className="px-3 py-8 text-[14px] text-[#5f6368]">{lang === "en" ? "This folder is empty." : "Esta carpeta está vacía."}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {picker && (
        <PickerModal
          title={c.pickerTitle}
          categoryLabel={c.downloads}
          columnLabels={[c.colName, c.colDate]}
          items={downloadsFor(downloaded)}
          onCancel={() => { setPicker(false); setPick(null); }}
          cancelLabel={c.cancel}
          preview={{
            selectedKey: pick,
            onFocus: (item) => {
              // A new page in the preview: an old correction no longer describes it.
              if (item.key !== pick) {
                dismiss();
                clearCorrection?.();
              }
              setPick(item.key);
            },
            render: (item) => (
              <div className="self-start">
                <PdfSheet doc={PICKER_PAGES[item.key]} scale={0.5} employeeName={displayName} />
              </div>
            ),
            empty: c.pickerEmpty,
            confirmLabel: c.upload,
            showMeList: "upload-list",
            showMeConfirm: "upload-confirm",
          }}
          onSelect={(item) => finishUpload(item.key)}
        />
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
      <ShowMeHighlight targetId={showMe.targetId} label={SHOW_ME_POINTER[lang]} onDismiss={showMe.clear} />
    </div>
  );
}

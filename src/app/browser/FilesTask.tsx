"use client";

import ScheduleLink from "@/components/task/ScheduleLink";

import { useMemo, useState, type ReactNode } from "react";
import type { PdfDocument } from "@/lib/pdf-content";
import { useProgress } from "@/lib/progress-context";
import { useJobCardOptional } from "@/lib/job-card-context";
import {
  FILES,
  MESSY_FILES,
  FILES_COPY,
  RENAME_TARGET,
  renameProblem,
  RENAME_HINTS,
  fileMatchesQuery,
  FOLDER_LABEL,
  NEW_BUTTON_NOTE,
  MY_DRIVE_EMPTY,
  DONE_SHARED_WITH,
  OPEN_ONE_POINTER,
  RIGHT_NOW_LABEL,
  RIGHT_NOW_STEPS,
  MY_DRIVE_STEP,
  WRONG_EDIT_HINT,
  COMMENT_HINT,
  LESSONS,
  CHECK_OTHER_WEEK,
  FILE_PAGES,
  PREVIEW_COPY,
  type DriveFile,
} from "@/lib/tasks/files/content";
import { PdfSheet } from "@/components/task/PdfSheet";
import RightNowBar from "@/components/task/RightNowBar";
import ShowMeHighlight from "@/components/task/ShowMeHighlight";
import { SHOW_ME_POINTER, useShowMe } from "@/lib/use-show-me";
import SettingsPopover from "@/components/task/SettingsPopover";
import { levelForTrack } from "@/lib/tracks-content";
import { useNudge } from "@/lib/use-nudge";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import { FOLDER_ICONS, TASK_ICONS } from "@/lib/icons";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import { Folder, Home, Plus, Users } from "lucide-react";
import OfficeDriveTask from "./OfficeDriveTask";
import { RECEIPT_FILES, RECEIPTS_COPY } from "@/lib/tasks/expense-report/content";

type View = "home" | "mine" | "browse" | "preview" | "rename" | "share" | "done";

const FOLDERS = ["Schedules", "Forms", "Manager Memos"];

function DriveMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
      <path fill="#0f9d58" d="M1.5 21 8.25 21 15.5 8 8.75 8z" />
      <path fill="#4285f4" d="M15.5 8 22.5 21 15.75 21 8.75 8z" />
      <path fill="#fbbc04" d="M8.25 21 15.75 21 12 14.5z" />
    </svg>
  );
}

export default function FilesTask() {
  const { currentTrack } = useProgress();
  if (currentTrack.key === "office-drive") return <OfficeDriveTask />;
  if (currentTrack.key === "expense-report") return <ReceiptsDrive />;
  return <CafeFilesTask />;
}

function ReceiptsDrive() {
  const { lang } = useProgress();
  const c = RECEIPTS_COPY[lang];
  return (
    <div className="flex h-full min-h-0 flex-col bg-white text-[14px] text-[#1f1f1f]" style={{ fontFamily: "Roboto, Arial, sans-serif" }}>
      <div className="flex items-center gap-3 px-3 py-2">
        <div className="flex w-[220px] shrink-0 items-center gap-2 px-2">
          <DriveMark />
          <span className="text-[22px] font-normal text-[#5f6368]">Drive</span>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
        <h2 className="text-[16px] font-medium">{c.heading}</h2>
        <p className="mt-1 max-w-[480px] text-[13px] text-[#5f6368]">{c.body}</p>
        <div className="mt-4 flex flex-col">
          {RECEIPT_FILES.map((f) => (
            <div key={f.key} className="flex items-center gap-3 border-b border-[#e8eaed] py-3">
              <Folder size={18} className="shrink-0 text-[#5f6368]" />
              <span className="min-w-0 flex-1 font-medium">{f.name}</span>
              <span className="text-[13px] text-[#3c4043]">
                {c.shows}: {f.merchant[lang]} · {f.date} · ${f.amount.toFixed(2)}
              </span>
              <span className="text-[12px] text-[#5f6368]">{f.folder}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[13px] text-[#5f6368]">{c.back}</p>
      </div>
    </div>
  );
}

function CafeFilesTask() {
  const { markComplete, completedTaskKeys, lang, currentTrack, bigText, setBigText } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("files") ? "done" : "home");
  const [query, setQuery] = useState("");
  const [folder, setFolder] = useState<string | null>(null);
  // The file open in the preview. Opening one is looking, never a mistake.
  const [previewKey, setPreviewKey] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [permission, setPermission] = useState<"view" | "edit" | null>(null);
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const showMe = useShowMe();
  // Moving to another file or folder makes an old correction wrong ("That page
  // says DRAFT" over a page with no draft), so navigation clears it.
  const clearCorrection = useJobCardOptional()?.clearCorrection;

  // Messy mode (Level.messy): more near-duplicate decoys - real-world
  // friction added on purpose, not a new mechanic. See MESSY_FILES.
  const messy = levelForTrack(currentTrack.key).messy ?? false;
  const fileList = messy ? MESSY_FILES : FILES;

  const c = FILES_COPY[lang];
  const listOpen = view === "browse" || view === "preview" || view === "rename" || view === "share";
  const previewing = fileList.find((f) => f.key === previewKey) ?? null;
  const previewWrong = view === "preview" && previewing !== null && !previewing.isTarget;
  const stepIndex =
    view === "home" || view === "mine"
      ? 0
      : view === "browse"
        ? 1
        : view === "preview"
          ? previewWrong
            ? 1
            : 2
          : view === "rename"
            ? 3
            : 4;
  // Step 1 points at a schedule to open, not at the answer: reading the page is the skill.
  const showMeId = previewWrong
    ? "preview-close"
    : view === "mine"
      ? "nav-shared"
      : ["shared-drive", "a-schedule", "preview-rename", "rename-input", "can-view"][stepIndex];

  const filtered = useMemo(
    () => fileList.filter((f) => (!folder || f.folder === folder) && fileMatchesQuery(f, query)),
    [fileList, query, folder],
  );
  const firstSchedule = filtered.find((f) => f.folder === "Schedules")?.key;

  const onShowMe = () => {
    // After a search that found nothing, Show me would light up nothing: clear it first.
    if (showMeId === "a-schedule" && !firstSchedule) {
      setQuery("");
      setFolder(null);
    }
    showMe.toggleFor(showMeId);
  };

  const openFile = (f: DriveFile) => {
    showMe.clear();
    clearCorrection?.();
    setPreviewKey(f.key);
    setView("preview");
  };

  // Renaming is the choice, so this is where a wrong file gets a correction.
  // Always: the learner has already read the page, and a Rename that does
  // nothing would leave them guessing. Messy mode's friction is the extra
  // near-duplicates, not silence.
  const pickFile = (f: DriveFile) => {
    showMe.clear();
    if (!f.isTarget) {
      if (f.wrongHint) say(f.wrongHint[lang]);
      return;
    }
    setRenameValue(f.name.replace(/\.pdf$/, ""));
    setView("rename");
  };

  const tryRename = () => {
    showMe.clear();
    const problem = renameProblem(renameValue, previewing?.name ?? "");
    if (problem) return say(RENAME_HINTS[problem][lang]);
    setView("share");
  };

  const tryShare = () => {
    showMe.clear();
    if (permission === "edit") {
      return say(WRONG_EDIT_HINT[lang]);
    }
    if (permission !== "view") {
      return say(
        lang === "en"
          ? "Choose an access level first."
          : "Primero elige un nivel de acceso."
      );
    }
    setView("done");
    markComplete("files", "share_with_right_access");
  };

  const openFolder = (f: string | null) => {
    showMe.clear();
    clearCorrection?.();
    setFolder(f);
    setView("browse");
  };

  const openMyDrive = () => {
    showMe.clear();
    clearCorrection?.();
    setView("mine");
  };

  const newNote = () => say(NEW_BUTTON_NOTE[lang]);

  const restart = () => {
    setView("home");
    setQuery("");
    setFolder(null);
    setPreviewKey(null);
    setRenameValue("");
    setPermission(null);
  };

  // `shared` marks Shared with me: Show me's way out of My Drive.
  const navItem = (active: boolean, onClick: () => void, icon: ReactNode, label: string, shared = false) => (
    <button
      data-showme={shared ? "nav-shared" : undefined}
      onClick={onClick}
      className={`flex h-10 items-center gap-3 rounded-full px-4 text-[14px] cursor-pointer ${
        active ? "bg-[#c2e7ff] font-medium text-[#041e49]" : "text-[#444746] hover:bg-[#e8eaed]"
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div
      className="flex h-full min-h-0 flex-col bg-white text-[14px] text-[#1f1f1f]"
      style={{ fontFamily: "Roboto, Arial, sans-serif" }}
    >
      <div className="flex items-center gap-3 px-3 py-2">
        <div className="flex w-[220px] shrink-0 items-center gap-2 px-2">
          <DriveMark />
          <span className="text-[22px] font-normal text-[#5f6368]">Drive</span>
        </div>
        <div className="flex h-12 flex-1 items-center gap-3 rounded-full bg-[#e9eef6] px-4 text-[#444746]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (view === "home") setView("browse");
            }}
            placeholder={c.searchPlaceholder}
            className="h-full w-full bg-transparent text-[16px] outline-none placeholder:text-[#444746]"
          />
        </div>
        <SettingsPopover
          bigText={bigText}
          onToggleBigText={() => setBigText(!bigText)}
          label={lang === "en" ? "Bigger text" : "Letra más grande"}
        />
      </div>

      {view !== "done" && (
        <RightNowBar
          icon={TASK_ICONS.files}
          stepIndex={stepIndex}
          steps={RIGHT_NOW_STEPS}
          goal={view === "rename" ? RIGHT_NOW_STEPS[3] : undefined}
          lang={lang}
          rightNowLabel={RIGHT_NOW_LABEL}
          instruction={previewWrong ? CHECK_OTHER_WEEK : view === "mine" ? MY_DRIVE_STEP : undefined}
          onShowMe={onShowMe}
          showMeActive={showMe.targetId === showMeId}
          onHelp={() => setHelp(true)}
        />
      )}

      {view === "done" ? (
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="mx-auto flex max-w-[640px] flex-col gap-5">
            <TaskDoneCard
              kicker={c.sentKicker}
              title={c.doneTitle}
              body={c.doneBody}
              badgeNumber="08"
              badgeName={c.badgeName}
              badgeWhere={c.badgeWhere}
            />
            {/* The result itself: the file under its new name, shared view-only with Jordan. */}
            <div data-testid="files-done-result" className="flex items-center gap-3 rounded-xl border border-[#dadce0] px-4 py-3">
              <span className="flex h-6 w-5 shrink-0 items-center justify-center rounded-[2px] bg-[#ea4335] text-[8px] font-bold text-white">
                PDF
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-medium">{RENAME_TARGET}.pdf</span>
                <span className="block text-[12px] text-[#5f6368]">{DONE_SHARED_WITH[lang]}</span>
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0f9d58] text-[11px] font-medium text-white">JK</span>
            </div>
            <ScheduleLink lang={lang} />
            <TaskDoneActions
              kicker={c.sentKicker}
              tryAgainLabel={c.tryAgain}
              backToDeskLabel={c.backToDesk}
              onTryAgain={restart}
            />
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1">
          <div className="flex w-[220px] shrink-0 flex-col gap-0.5 px-3 pt-1">
            <button
              onClick={newNote}
              className="mb-3 flex h-14 items-center gap-3 rounded-2xl bg-white px-4 text-[14px] font-medium text-[#1f1f1f] shadow-[0_1px_2px_0_rgba(60,64,67,.3),0_1px_3px_1px_rgba(60,64,67,.15)] hover:bg-[#f8f9fa] cursor-pointer"
            >
              <Plus size={20} strokeWidth={2} className="text-[#444746]" />
              {c.newBtn}
            </button>
            {navItem(view === "home", () => { clearCorrection?.(); setView("home"); }, <Home size={18} />, c.navHome)}
            {navItem(view === "mine", openMyDrive, <Folder size={18} />, c.navMyDrive)}
            {navItem(listOpen, () => openFolder(null), <Users size={18} />, c.navShared, true)}
          </div>

          <div className="relative min-w-0 flex-1 overflow-y-auto px-4 pb-6 pt-2">
            {view === "home" && (
              <>
                <h2 className="mb-3 mt-2 text-[16px] font-medium">{c.foldersHeading}</h2>
                <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {FOLDERS.map((f) => {
                    const Icon = FOLDER_ICONS[f];
                    return (
                      <button
                        key={f}
                        onClick={() => openFolder(f)}
                        className="flex items-center gap-3 rounded-xl bg-[#f0f4f9] px-4 py-3 text-left hover:bg-[#e8eaed] cursor-pointer"
                      >
                        {Icon ? <Icon size={20} strokeWidth={2} className="shrink-0 text-[#5f6368]" /> : <Folder size={20} className="text-[#5f6368]" />}
                        <span className="truncate text-[14px] font-medium">{FOLDER_LABEL[f]?.[lang] ?? f}</span>
                      </button>
                    );
                  })}
                </div>
                <h2 className="mb-3 text-[16px] font-medium">{c.sharedHeading}</h2>
                <button
                  data-showme="shared-drive"
                  onClick={() => openFolder(null)}
                  className="flex w-full max-w-[420px] items-center gap-3 rounded-xl bg-[#f0f4f9] px-4 py-3 text-left hover:bg-[#e8eaed] cursor-pointer"
                >
                  <Users size={20} className="text-[#1a73e8]" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-medium">{c.sharedFolderName}</span>
                    <span className="block text-[12px] text-[#5f6368]">{c.sharedFrom}</span>
                  </span>
                </button>
              </>
            )}

            {view === "mine" && (
              <p className="px-3 py-8 text-[14px] text-[#5f6368]">{MY_DRIVE_EMPTY[lang]}</p>
            )}

            {listOpen && (
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-1 text-[13px] text-[#444746]">
                  <button
                    onClick={() => openFolder(null)}
                    className={`h-8 rounded-full px-3 cursor-pointer ${folder === null ? "bg-[#e8f0fe] font-medium text-[#0b57d0]" : "hover:bg-[#f1f3f4]"}`}
                  >
                    {c.allFolders}
                  </button>
                  {FOLDERS.map((f) => (
                    <button
                      key={f}
                      onClick={() => openFolder(f)}
                      className={`h-8 rounded-full px-3 cursor-pointer ${folder === f ? "bg-[#e8f0fe] font-medium text-[#0b57d0]" : "hover:bg-[#f1f3f4]"}`}
                    >
                      {FOLDER_LABEL[f]?.[lang] ?? f}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-[1fr_120px_88px] gap-2 border-b border-[#e0e3e8] px-3 py-2 text-[12px] font-medium text-[#444746]">
                  <span>{lang === "en" ? "Name" : "Nombre"}</span>
                  <span>{lang === "en" ? "Owner" : "Propietario"}</span>
                  <span className="text-right">{lang === "en" ? "Date" : "Fecha"}</span>
                </div>
                {filtered.map((f) => (
                  <button
                    key={f.key}
                    data-showme={f.key === firstSchedule ? "a-schedule" : undefined}
                    onClick={() => openFile(f)}
                    className="grid w-full grid-cols-[1fr_120px_88px] items-center gap-2 rounded-xl px-3 py-2.5 text-left hover:bg-[#f1f3f4] cursor-pointer"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex h-6 w-5 shrink-0 items-center justify-center rounded-[2px] bg-[#ea4335] text-[8px] font-bold text-white">
                        PDF
                      </span>
                      <span className="truncate text-[14px]">{f.name}</span>
                    </span>
                    <span className="truncate text-[13px] text-[#444746]">Renata Silva</span>
                    <span className="text-right text-[13px] text-[#444746]">{f.date}</span>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="px-3 py-8 text-[14px] text-[#5f6368]">
                    {lang === "en" ? "No files match." : "No hay archivos que coincidan."}
                  </p>
                )}
              </div>
            )}

            {view === "preview" && previewing && FILE_PAGES[previewing.key] && (
              <FilePreview
                file={previewing}
                page={FILE_PAGES[previewing.key]}
                copy={PREVIEW_COPY[lang]}
                onClose={() => {
                  showMe.clear();
                  clearCorrection?.();
                  setView("browse");
                }}
                onRename={() => pickFile(previewing)}
              />
            )}

            {view === "rename" && (
              <DriveDialog
                title={lang === "en" ? "Rename" : "Cambiar nombre"}
                onCancel={() => setView("preview")}
                cancelLabel={lang === "en" ? "Cancel" : "Cancelar"}
                confirmLabel={c.renameContinue}
                onConfirm={tryRename}
              >
                <input
                  autoFocus
                  data-showme="rename-input"
                  aria-label={c.renameLabel}
                  // The old name starts selected, as in Drive: typing replaces it.
                  onFocus={(e) => e.currentTarget.select()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      tryRename();
                    }
                  }}
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  placeholder={c.renamePlaceholder}
                  className="w-full rounded border border-[#747775] px-3 py-2 text-[14px] outline-none focus:border-[#0b57d0] focus:border-2"
                />
              </DriveDialog>
            )}

            {view === "share" && (
              <DriveDialog
                title={`${c.share} "${RENAME_TARGET}.pdf"`}
                onCancel={() => setView("rename")}
                cancelLabel={lang === "en" ? "Cancel" : "Cancelar"}
                confirmLabel={c.share}
                onConfirm={tryShare}
              >
                <ScheduleLink lang={lang} />
                {/* Real Drive: you add the person first, then pick their role. */}
                <label className="mb-1 block text-[12px] font-medium text-[#5f6368]">{c.addPeople}</label>
                <div className="mb-3 flex items-center gap-2 rounded-lg border border-[#dadce0] px-3 py-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0f9d58] text-[11px] font-medium text-white">
                    JK
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[14px]">Jordan Kim</span>
                    <span className="block truncate text-[12px] text-[#5f6368]">jordan.kim@harborsidecafe.com</span>
                  </span>
                </div>
                <p className="mb-2 text-[13px] text-[#444746]">
                  {c.shareWith} <span className="font-medium">Jordan Kim</span>
                </p>
                <div className="flex flex-col gap-1">
                  <button
                    data-showme="can-view"
                    onClick={() => { showMe.clear(); setPermission("view"); }}
                    className={`flex min-h-[44px] items-center justify-between rounded-lg border px-3 text-left text-[14px] cursor-pointer ${
                      permission === "view" ? "border-[#0b57d0] bg-[#e8f0fe]" : "border-[#dadce0] hover:bg-[#f8f9fa]"
                    }`}
                  >
                    <span>{c.canView}</span>
                    <span className="text-[12px] text-[#5f6368]">{lang === "en" ? "Viewer" : "Lector"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => say(COMMENT_HINT[lang])}
                    className="flex min-h-[44px] items-center justify-between rounded-lg border border-[#dadce0] px-3 text-left text-[14px] text-[#5f6368] hover:bg-[#f8f9fa] cursor-pointer"
                  >
                    <span>{c.canComment}</span>
                    <span className="text-[12px]">{lang === "en" ? "Commenter" : "Comentador"}</span>
                  </button>
                  <button
                    onClick={() => setPermission("edit")}
                    className={`flex min-h-[44px] items-center justify-between rounded-lg border px-3 text-left text-[14px] cursor-pointer ${
                      permission === "edit" ? "border-[#0b57d0] bg-[#e8f0fe]" : "border-[#dadce0] hover:bg-[#f8f9fa]"
                    }`}
                  >
                    <span>{c.canEdit}</span>
                    <span className="text-[12px] text-[#5f6368]">{lang === "en" ? "Editor" : "Editor"}</span>
                  </button>
                </div>
              </DriveDialog>
            )}
          </div>
        </div>
      )}

      <HelpDrawer
        open={help}
        onClose={() => setHelp(false)}
        kicker={c.lessonKicker}
        lesson={LESSONS[lang][view === "share" ? 1 : view === "rename" ? 2 : 0]}
        tipLabel={c.tipLabel}
        gotItLabel={c.gotIt}
      />

      <NudgeToast text={nudge} onDismiss={dismiss} />
      <ShowMeHighlight
        targetId={showMe.targetId}
        label={showMe.targetId === "a-schedule" ? OPEN_ONE_POINTER[lang] : SHOW_ME_POINTER[lang]}
        onDismiss={showMe.clear}
      />
    </div>
  );
}

/**
 * Drive's file preview: the page itself, with Rename in the toolbar. It
 * covers the file list, the way Drive's does, and scrolls if the learner
 * wants the rest of the page.
 */
function FilePreview({
  file,
  page,
  copy,
  onClose,
  onRename,
}: {
  file: DriveFile;
  page: { doc: PdfDocument; stamp?: string };
  copy: { rename: string; close: string; owner: string };
  onClose: () => void;
  onRename: () => void;
}) {
  return (
    <div data-testid="drive-preview" className="absolute inset-0 z-10 flex flex-col bg-[#303134]">
      <div className="flex items-center gap-3 px-4 py-2 text-white">
        <span className="flex h-6 w-5 shrink-0 items-center justify-center rounded-[2px] bg-[#ea4335] text-[8px] font-bold">PDF</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-medium">{file.name}</span>
          <span className="block text-[12px] text-white/70">{copy.owner}</span>
        </span>
        <button
          data-showme="preview-close"
          onClick={onClose}
          className="h-10 rounded-full px-4 text-[14px] font-medium text-white hover:bg-white/10 cursor-pointer"
        >
          {copy.close}
        </button>
        <button
          data-showme="preview-rename"
          onClick={onRename}
          className="h-10 rounded-full bg-[#a8c7fa] px-5 text-[14px] font-medium text-[#062e6f] hover:bg-[#c2e7ff] cursor-pointer"
        >
          {copy.rename}
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto px-4 pb-4">
        <div className="flex justify-center">
          <PdfSheet doc={page.doc} scale={0.66} stamp={page.stamp} />
        </div>
      </div>
    </div>
  );
}

function DriveDialog({
  title,
  children,
  onCancel,
  onConfirm,
  cancelLabel,
  confirmLabel,
}: {
  title: string;
  children: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  cancelLabel: string;
  confirmLabel: string;
}) {
  return (
    <div className="absolute inset-0 z-10 flex items-start justify-center bg-black/32 pt-16">
      <div className="w-[min(100%-2rem,420px)] rounded-3xl bg-white p-6 shadow-[0_4px_8px_3px_rgba(60,64,67,.15)]">
        <h2 className="mb-4 text-[22px] font-normal">{title}</h2>
        {children}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="h-10 rounded-full px-4 text-[14px] font-medium text-[#0b57d0] hover:bg-[#f2f6fc] cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="h-10 rounded-full bg-[#0b57d0] px-6 text-[14px] font-medium text-white hover:bg-[#0b57d0]/90 cursor-pointer"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

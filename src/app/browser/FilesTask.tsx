"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  FILES,
  MESSY_FILES,
  FILES_COPY,
  RENAME_TARGET,
  normalizeRename,
  RIGHT_NOW_LABEL,
  RIGHT_NOW_STEPS,
  WRONG_RENAME_HINT,
  WRONG_EDIT_HINT,
  LESSONS,
  EVENT_INTRO,
  type DriveFile,
} from "@/lib/tasks/files/content";
import RightNowBar from "@/components/task/RightNowBar";
import SettingsPopover from "@/components/task/SettingsPopover";
import { speakFromClick } from "@/lib/read-aloud";
import { levelForTrack } from "@/lib/tracks-content";
import { useNudge } from "@/lib/use-nudge";
import EventIntroCard from "@/components/task/EventIntroCard";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import { FOLDER_ICONS, TASK_ICONS } from "@/lib/icons";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import AppHeaderTools from "@/components/task/AppHeaderTools";
import { Folder, Home, Plus, Users } from "lucide-react";

type View = "intro" | "home" | "browse" | "rename" | "share" | "done";

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
  const { markComplete, completedTaskKeys, lang, currentTrack, speakAloud, setSpeakAloud, bigText, setBigText } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("files") ? "done" : "intro");
  const [query, setQuery] = useState("");
  const [folder, setFolder] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [permission, setPermission] = useState<"view" | "edit" | null>(null);
  const [help, setHelp] = useState(false);
  // A plain ref, not state: this only gates whether a toast fires, so it
  // doesn't need to trigger a re-render on its own.
  const messyWrongCount = useRef(0);
  const { nudge, say } = useNudge();

  // Messy mode (Level.messy): more near-duplicate decoys, and coaching that
  // speaks up less often - real-world friction added on purpose, not a new
  // mechanic. See MESSY_FILES for the extra decoys.
  const messy = levelForTrack(currentTrack.key).messy ?? false;
  const fileList = messy ? MESSY_FILES : FILES;

  const c = FILES_COPY[lang];
  const listOpen = view === "browse" || view === "rename" || view === "share";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return fileList.filter((f) => {
      if (folder && f.folder !== folder) return false;
      if (q && !f.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [fileList, query, folder]);

  const pickFile = (f: DriveFile) => {
    if (!f.isTarget) {
      if (!f.wrongHint) return;
      if (!messy) {
        say(f.wrongHint[lang]);
        return;
      }
      // Only every other wrong pick gets a coaching toast - a wrong click
      // just does the wrong thing the rest of the time, same as it would
      // on a real work account.
      messyWrongCount.current += 1;
      if (messyWrongCount.current % 2 === 0) say(f.wrongHint[lang]);
      return;
    }
    setRenameValue(f.name.replace(/\.pdf$/, ""));
    setView("rename");
  };

  const tryRename = () => {
    if (normalizeRename(renameValue) !== RENAME_TARGET) {
      return say(WRONG_RENAME_HINT[lang]);
    }
    setView("share");
  };

  const tryShare = () => {
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

  const openFolder = (f: string) => {
    setFolder(f);
    setView("browse");
  };

  const notYet = () =>
    say(
      lang === "en"
        ? "That's not part of today's task. Open the shared folder instead."
        : "Eso no es parte de la tarea de hoy. Abre la carpeta compartida en su lugar."
    );

  const restart = () => {
    setView("home");
    setQuery("");
    setFolder(null);
    setRenameValue("");
    setPermission(null);
    messyWrongCount.current = 0;
  };

  const navItem = (active: boolean, onClick: () => void, icon: ReactNode, label: string) => (
    <button
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
      style={{ fontFamily: "Roboto, Arial, sans-serif", zoom: bigText ? 1.15 : undefined }}
      onClick={(e) => {
        if (speakAloud) speakFromClick(e.target, lang);
      }}
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
        <AppHeaderTools
          helpLabel={c.helpBtn}
          onHelp={() => setHelp(true)}
        />
        <SettingsPopover
          speak={speakAloud}
          onToggleSpeak={() => setSpeakAloud(!speakAloud)}
          bigText={bigText}
          onToggleBigText={() => setBigText(!bigText)}
          labels={{
            readAloud: lang === "en" ? "Read aloud" : "Leer en voz alta",
            biggerText: lang === "en" ? "Bigger text" : "Letra más grande",
          }}
        />
      </div>

      {view !== "intro" && view !== "done" && (
        <RightNowBar
          icon={TASK_ICONS.files}
          stepIndex={view === "rename" ? 1 : view === "share" ? 2 : 0}
          stepCount={RIGHT_NOW_STEPS.length}
          instruction={RIGHT_NOW_STEPS[view === "rename" ? 1 : view === "share" ? 2 : 0]}
          lang={lang}
          rightNowLabel={RIGHT_NOW_LABEL}
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
            <TaskDoneActions
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
              onClick={notYet}
              className="mb-3 flex h-14 items-center gap-3 rounded-2xl bg-white px-4 text-[14px] font-medium text-[#1f1f1f] shadow-[0_1px_2px_0_rgba(60,64,67,.3),0_1px_3px_1px_rgba(60,64,67,.15)] hover:bg-[#f8f9fa] cursor-pointer"
            >
              <Plus size={20} strokeWidth={2} className="text-[#444746]" />
              {c.newBtn}
            </button>
            {navItem(view === "home", () => setView("home"), <Home size={18} />, c.navHome)}
            {navItem(false, notYet, <Folder size={18} />, c.navMyDrive)}
            {navItem(listOpen, () => { setFolder(null); setView("browse"); }, <Users size={18} />, c.navShared)}
          </div>

          <div className="relative min-w-0 flex-1 overflow-y-auto px-4 pb-6 pt-2">
            {view === "intro" && (
              <EventIntroCard {...EVENT_INTRO[lang]} icon={TASK_ICONS.files} onContinue={() => setView("home")} />
            )}

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
                        <span className="truncate text-[14px] font-medium">{f}</span>
                      </button>
                    );
                  })}
                </div>
                <h2 className="mb-3 text-[16px] font-medium">{c.sharedHeading}</h2>
                <button
                  onClick={() => { setFolder(null); setView("browse"); }}
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

            {listOpen && (
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-1 text-[13px] text-[#444746]">
                  <button
                    onClick={() => setFolder(null)}
                    className={`h-8 rounded-full px-3 cursor-pointer ${folder === null ? "bg-[#e8f0fe] font-medium text-[#0b57d0]" : "hover:bg-[#f1f3f4]"}`}
                  >
                    {c.allFolders}
                  </button>
                  {FOLDERS.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFolder(f)}
                      className={`h-8 rounded-full px-3 cursor-pointer ${folder === f ? "bg-[#e8f0fe] font-medium text-[#0b57d0]" : "hover:bg-[#f1f3f4]"}`}
                    >
                      {f}
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
                    onClick={() => pickFile(f)}
                    className="grid w-full grid-cols-[1fr_120px_88px] items-center gap-2 rounded-xl px-3 py-2.5 text-left hover:bg-[#f1f3f4] cursor-pointer"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex h-6 w-5 shrink-0 items-center justify-center rounded-[2px] bg-[#ea4335] text-[8px] font-bold text-white">
                        PDF
                      </span>
                      <span className="truncate text-[14px]">{f.name}</span>
                    </span>
                    <span className="truncate text-[13px] text-[#444746]">Maria Delgado</span>
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

            {view === "rename" && (
              <DriveDialog
                title={lang === "en" ? "Rename" : "Cambiar nombre"}
                onCancel={() => setView("browse")}
                cancelLabel={lang === "en" ? "Cancel" : "Cancelar"}
                confirmLabel={c.renameContinue}
                onConfirm={tryRename}
              >
                <p className="mb-2 text-[12px] text-[#5f6368]">{c.renameHint}</p>
                <input
                  autoFocus
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  placeholder={c.renamePlaceholder}
                  className="w-full rounded border border-[#747775] px-3 py-2 text-[14px] outline-none focus:border-[#0b57d0] focus:border-2"
                />
              </DriveDialog>
            )}

            {view === "share" && (
              <DriveDialog
                title={`${c.share} "${renameValue}.pdf"`}
                onCancel={() => setView("rename")}
                cancelLabel={lang === "en" ? "Cancel" : "Cancelar"}
                confirmLabel={c.share}
                onConfirm={tryShare}
              >
                <p className="mb-3 text-[13px] text-[#444746]">
                  {c.shareWith} <span className="font-medium">Jordan Kim</span>
                </p>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setPermission("view")}
                    className={`flex min-h-[44px] items-center justify-between rounded-lg border px-3 text-left text-[14px] cursor-pointer ${
                      permission === "view" ? "border-[#0b57d0] bg-[#e8f0fe]" : "border-[#dadce0] hover:bg-[#f8f9fa]"
                    }`}
                  >
                    <span>{c.canView}</span>
                    <span className="text-[12px] text-[#5f6368]">{lang === "en" ? "Viewer" : "Lector"}</span>
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
        lesson={LESSONS[lang][view === "share" ? 1 : 0]}
        tipLabel={c.tipLabel}
        gotItLabel={c.gotIt}
      />

      <NudgeToast text={nudge} />
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

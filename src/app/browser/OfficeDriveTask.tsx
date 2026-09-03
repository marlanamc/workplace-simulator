"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useProgress } from "@/lib/progress-context";
import {
  HQ_FILES,
  HQ_FOLDERS,
  HQ_DRIVE_COPY,
  SHARE_WITH,
  WRONG_EDIT_HINT,
  NEED_PERMISSION_HINT,
  LESSONS,
  RIGHT_NOW_LABEL,
  RIGHT_NOW_STEPS,
  isCurrentHqFile,
  shareIsViewOnly,
  type HqDriveFile,
} from "@/lib/tasks/office-drive/content";
import RightNowBar from "@/components/task/RightNowBar";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import { FOLDER_ICONS, TASK_ICONS } from "@/lib/icons";
import TaskDoneCard from "@/components/task/TaskDoneCard";
import TaskDoneActions from "@/components/task/TaskDoneActions";
import { Folder, Home, Plus, Users } from "lucide-react";
import { useNudge } from "@/lib/use-nudge";

type View = "home" | "browse" | "share" | "done";

function DriveMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
      <path fill="#0f9d58" d="M1.5 21 8.25 21 15.5 8 8.75 8z" />
      <path fill="#4285f4" d="M15.5 8 22.5 21 15.75 21 8.75 8z" />
      <path fill="#fbbc04" d="M8.25 21 15.75 21 12 14.5z" />
    </svg>
  );
}

export default function OfficeDriveTask() {
  const { markComplete, completedTaskKeys, lang } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("office-drive") ? "done" : "home");
  const [query, setQuery] = useState("");
  const [folder, setFolder] = useState<string | null>(null);
  const [picked, setPicked] = useState<HqDriveFile | null>(null);
  const [permission, setPermission] = useState<"view" | "edit" | null>(null);
  const [help, setHelp] = useState(false);
  const { nudge, say, dismiss } = useNudge();
  const c = HQ_DRIVE_COPY[lang];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return HQ_FILES.filter((f) => {
      if (folder && f.folder !== folder) return false;
      if (q && !f.name.toLowerCase().includes(q) && !f.folder.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, folder]);

  const pickFile = (f: HqDriveFile) => {
    if (!f.isTarget) {
      if (f.wrongHint) say(f.wrongHint[lang]);
      return;
    }
    setPicked(f);
    setPermission(null);
    setView("share");
  };

  const tryShare = () => {
    if (!picked || !isCurrentHqFile(picked.key)) {
      return say(
        lang === "en"
          ? "Share the current Q3 file, not a copy or last quarter."
          : "Comparte el archivo actual del T3, no una copia ni el trimestre pasado.",
      );
    }
    if (permission === "edit") return say(WRONG_EDIT_HINT[lang]);
    if (!shareIsViewOnly(permission)) return say(NEED_PERMISSION_HINT[lang]);
    setView("done");
    markComplete("office-drive", "share_current_hq_file");
  };

  const restart = () => {
    setView("home");
    setQuery("");
    setFolder(null);
    setPicked(null);
    setPermission(null);
  };

  const notYet = () =>
    say(
      lang === "en"
        ? "That's not part of today's task. Search or open Q3 2026."
        : "Eso no es parte de la tarea de hoy. Busca o abre Q3 2026.",
    );

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

  const listOpen = view === "browse" || view === "share";

  return (
    <div className="flex h-full min-h-0 flex-col bg-white text-[14px] text-[#1f1f1f]" style={{ fontFamily: "Roboto, Arial, sans-serif" }}>
      <div className="flex items-center gap-3 px-3 py-2">
        <div className="flex w-[220px] shrink-0 items-center gap-2 px-2">
          <DriveMark />
          <span className="text-[22px] font-normal text-[#5f6368]">{c.appName}</span>
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
      </div>

      {view !== "done" && (
        <RightNowBar
          icon={TASK_ICONS["office-drive"]}
          stepIndex={view === "share" ? 1 : 0}
          steps={RIGHT_NOW_STEPS}
          lang={lang}
          rightNowLabel={RIGHT_NOW_LABEL}
          onHelp={() => setHelp(true)}
        />
      )}

      {view === "done" ? (
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="mx-auto flex max-w-[640px] flex-col gap-5">
            <TaskDoneCard kicker={c.sentKicker} />
            <TaskDoneActions kicker={c.sentKicker} tryAgainLabel={c.tryAgain} backToDeskLabel={c.backToDesk} onTryAgain={restart} />
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
            {navItem(view === "home", () => { setFolder(null); setView("home"); }, <Home size={18} />, c.navHome)}
            {navItem(listOpen, () => { setFolder(null); setView("browse"); }, <Users size={18} />, c.navShared)}
          </div>

          <div className="relative min-w-0 flex-1 overflow-y-auto px-4 pb-6 pt-2">
            {view === "home" && (
              <>
                <h2 className="mb-3 mt-2 text-[16px] font-medium">{c.foldersHeading}</h2>
                <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {HQ_FOLDERS.map((f) => {
                    const Icon = FOLDER_ICONS[f] ?? Folder;
                    return (
                      <button
                        key={f}
                        onClick={() => {
                          setFolder(f);
                          setView("browse");
                        }}
                        className="flex items-center gap-3 rounded-xl bg-[#f0f4f9] px-4 py-3 text-left hover:bg-[#e8eaed] cursor-pointer"
                      >
                        <Icon size={20} strokeWidth={2} className="shrink-0 text-[#5f6368]" />
                        <span className="truncate text-[14px] font-medium">{f}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {listOpen && (
              <>
                <h2 className="mb-3 mt-2 text-[16px] font-medium">
                  {folder ?? (query.trim() ? c.filesHeading : c.navShared)}
                </h2>
                <div className="flex flex-col">
                  {filtered.map((f) => (
                    <button
                      key={f.key}
                      onClick={() => pickFile(f)}
                      className="flex items-center gap-3 border-b border-[#e8eaed] px-1 py-3 text-left hover:bg-[#f8f9fa] cursor-pointer"
                    >
                      <Folder size={18} className="shrink-0 text-[#5f6368]" />
                      <span className="min-w-0 flex-1 truncate font-medium">{f.name}</span>
                      <span className="shrink-0 text-[12px] text-[#5f6368]">{f.folder}</span>
                      <span className="w-16 shrink-0 text-right text-[12px] text-[#5f6368]">{f.date}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {view === "share" && picked && (
              <div className="absolute inset-0 z-10 flex items-start justify-center bg-black/32 pt-16">
                <div className="w-[min(100%-2rem,420px)] rounded-3xl bg-white p-6 shadow-[0_4px_8px_3px_rgba(60,64,67,.15)]">
                  <h2 className="mb-4 text-[22px] font-normal">
                    {c.share} &quot;{picked.name}&quot;
                  </h2>
                  <label className="mb-1 block text-[12px] font-medium text-[#5f6368]">{c.addPeople}</label>
                  <div className="mb-3 flex items-center gap-2 rounded-lg border border-[#dadce0] px-3 py-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#7248b9] text-[11px] font-medium text-white">
                      DO
                    </span>
                    <span className="text-[14px]">{SHARE_WITH}</span>
                  </div>
                  <p className="mb-2 text-[13px] text-[#444746]">
                    {c.shareWith} <span className="font-medium">{SHARE_WITH}</span>
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
                    <div className="flex min-h-[44px] items-center justify-between rounded-lg border border-[#dadce0] px-3 text-left text-[14px] text-[#9aa0a6]">
                      <span>{c.canComment}</span>
                      <span className="text-[12px]">{lang === "en" ? "Commenter" : "Comentador"}</span>
                    </div>
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
                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      onClick={() => setView("browse")}
                      className="h-10 rounded-full px-4 text-[14px] font-medium text-[#0b57d0] hover:bg-[#f2f6fc] cursor-pointer"
                    >
                      {lang === "en" ? "Cancel" : "Cancelar"}
                    </button>
                    <button
                      onClick={tryShare}
                      className="h-10 rounded-full bg-[#0b57d0] px-6 text-[14px] font-medium text-white hover:bg-[#0b57d0]/90 cursor-pointer"
                    >
                      {c.share}
                    </button>
                  </div>
                </div>
              </div>
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
      <NudgeToast text={nudge} onDismiss={dismiss} />
    </div>
  );
}

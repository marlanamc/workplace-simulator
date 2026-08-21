"use client";

import { useMemo, useState } from "react";
import { useWindowManager } from "@/lib/window-manager";
import { useProgress } from "@/lib/progress-context";
import {
  FILES,
  FILES_COPY,
  RENAME_TARGET,
  WRONG_RENAME_HINT,
  WRONG_EDIT_HINT,
  LESSONS,
  CONFIDENCE_OPTIONS,
  type DriveFile,
} from "@/lib/tasks/files/content";
import type { Lang } from "@/lib/task-types";
import { useNudge } from "@/lib/use-nudge";
import ConfidenceCheck from "@/components/task/ConfidenceCheck";
import HelpDrawer from "@/components/task/HelpDrawer";
import NudgeToast from "@/components/task/NudgeToast";
import { TAB_ICONS, FOLDER_ICONS, CircleGlyph } from "@/lib/icons";
import TaskDoneCard from "@/components/task/TaskDoneCard";

type View = "home" | "browse" | "rename" | "share" | "done";

const FOLDERS = ["Schedules", "Forms", "Manager Memos"];

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-").replace(/\.pdf$/, "");
}

export default function FilesTask() {
  const [lang, setLang] = useState<Lang>("en");
  const { markComplete, completedTaskKeys } = useProgress();
  const [view, setView] = useState<View>(completedTaskKeys.includes("files") ? "done" : "home");
  const [query, setQuery] = useState("");
  const [folder, setFolder] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [permission, setPermission] = useState<"view" | "edit" | null>(null);
  const [confidence, setConfidence] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const { nudge, say } = useNudge();
  const { minimizeActive } = useWindowManager();

  const c = FILES_COPY[lang];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FILES.filter((f) => {
      if (folder && f.folder !== folder) return false;
      if (q && !f.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, folder]);

  const pickFile = (f: DriveFile) => {
    if (!f.isTarget) {
      if (f.wrongHint) say(f.wrongHint[lang]);
      return;
    }
    setRenameValue(f.name.replace(/\.pdf$/, ""));
    setView("rename");
  };

  const tryRename = () => {
    if (normalize(renameValue) !== RENAME_TARGET) {
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
        ? "That's not part of today's task — open the shared folder instead."
        : "Eso no es parte de la tarea de hoy — abre la carpeta compartida en su lugar."
    );

  const restart = () => {
    setView("home");
    setQuery("");
    setFolder(null);
    setRenameValue("");
    setPermission(null);
    setConfidence(null);
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-[var(--surface-muted)] text-[15px] text-[var(--text-primary)]">
      <div className="flex items-center gap-3 border-b border-[var(--border)] bg-white px-4 py-3">
        <CircleGlyph icon={TAB_ICONS.files} color="#fbbc04" size={28} />
        <span className="text-[18px] font-medium text-[#5f6368]">Hdrive</span>
        <div className="flex-1" />
        <button
          onClick={() => setHelp(true)}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-[var(--warning-tint)] px-3.5 text-[13px] font-medium text-[var(--warning)] hover:brightness-95 cursor-pointer"
        >
          ? {c.helpBtn}
        </button>
        <button
          onClick={() => setLang(lang === "en" ? "es" : "en")}
          className="inline-flex min-h-[40px] items-center rounded-full border border-[var(--border)] px-3.5 text-[13px] font-medium text-[var(--text-primary)] hover:bg-[var(--surface-muted)] cursor-pointer"
        >
          {c.langBtn}
        </button>
      </div>

      <div className={`relative mx-auto min-h-0 w-full flex-1 overflow-y-auto p-6 ${view === "home" ? "max-w-[720px]" : "max-w-[640px]"}`}>
        {view === "home" && (
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <button
                onClick={notYet}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-5 text-[14px] font-medium text-[#3c4043] shadow-sm border border-[var(--border)] hover:bg-[var(--surface-muted)] cursor-pointer"
              >
                <span className="text-[18px] leading-none text-[#fbbc04]">+</span> {c.newBtn}
              </button>
              <div className="flex items-center gap-1 rounded-full border border-[var(--border)] p-0.5 text-[13px] text-[#3c4043]">
                {[c.navHome, c.navMyDrive, c.navShared].map((v, i) => (
                  <button
                    key={v}
                    onClick={i === 2 ? () => setView("browse") : notYet}
                    className={`rounded-full px-3 py-1 cursor-pointer ${i === 0 ? "bg-[var(--surface-muted)] font-medium" : "hover:bg-[var(--surface-muted)]"}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <h3 className="mb-3 text-[15px] font-medium text-[#3c4043]">{c.foldersHeading}</h3>
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {FOLDERS.map((f) => (
                <button
                  key={f}
                  onClick={() => openFolder(f)}
                  className="flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-white p-4 text-left hover:bg-[var(--surface-muted)] cursor-pointer"
                >
                  {(() => {
                    const Icon = FOLDER_ICONS[f];
                    return Icon ? <Icon size={20} strokeWidth={2.1} className="shrink-0 text-[#5f6368]" /> : null;
                  })()}
                  <span className="truncate text-[14px] font-medium text-[#3c4043]">{f}</span>
                </button>
              ))}
            </div>

            <h3 className="mb-3 text-[15px] font-medium text-[#3c4043]">{c.sharedHeading}</h3>
            <button
              onClick={() => setView("browse")}
              className="flex w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-white p-4 text-left hover:bg-[var(--surface-muted)] cursor-pointer"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-tint)] text-[16px]">
                🗂
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-medium text-[#3c4043]">{c.sharedFolderName}</span>
                <span className="block text-[12px] text-[var(--text-tertiary)]">{c.sharedFrom}</span>
              </span>
            </button>
          </div>
        )}

        {view !== "home" && (
          <div className="mb-4 rounded-xl border border-[var(--warning-tint)] bg-[var(--warning-tint)] px-4 py-3">
            <div className="text-[12px] font-semibold uppercase tracking-wide text-[var(--warning)]">
              {c.scenarioKicker}
            </div>
            <p className="mt-1 text-[14px] leading-relaxed text-[var(--text-primary)]">{c.scenario}</p>
          </div>
        )}

        {view === "browse" && (
          <div className="rounded-xl border border-[var(--border)] bg-white">
            <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border)] p-3">
              <button
                onClick={() => setFolder(null)}
                className={`min-h-[36px] rounded-full px-3 text-[13px] font-medium cursor-pointer ${
                  folder === null ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-muted)]"
                }`}
              >
                {c.allFolders}
              </button>
              {FOLDERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFolder(f)}
                  className={`min-h-[36px] rounded-full px-3 text-[13px] font-medium cursor-pointer ${
                    folder === f ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-muted)]"
                  }`}
                >
                  {f}
                </button>
              ))}
              <div className="flex-1" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={c.searchPlaceholder}
                className="min-h-[36px] w-[180px] rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3.5 text-[13px] outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              {filtered.map((f, i) => (
                <button
                  key={f.key}
                  onClick={() => pickFile(f)}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-[var(--surface-muted)] cursor-pointer ${i !== 0 ? "border-t border-[var(--border)]" : ""}`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="shrink-0 rounded bg-[var(--danger)] px-1.5 py-0.5 text-[10px] font-bold text-white">
                      PDF
                    </span>
                    <span className="truncate text-[14px]">{f.name}</span>
                    <span className="shrink-0 text-[12px] text-[var(--text-tertiary)]">{f.folder}</span>
                  </span>
                  <span className="shrink-0 text-[13px] text-[var(--text-tertiary)]">{f.date}</span>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="px-4 py-6 text-[14px] text-[var(--text-tertiary)]">
                  {lang === "en" ? "No files match." : "No hay archivos que coincidan."}
                </p>
              )}
            </div>
          </div>
        )}

        {view === "rename" && (
          <div className="rounded-xl border border-[var(--border)] bg-white p-5">
            <label className="mb-1 block text-[13px] font-medium text-[var(--text-secondary)]">
              {c.renameLabel}
            </label>
            <p className="mb-3 text-[12px] text-[var(--text-tertiary)]">{c.renameHint}</p>
            <input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              placeholder={c.renamePlaceholder}
              className="mb-4 w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-[14px] outline-none focus:border-[var(--accent)]"
            />
            <button
              onClick={tryRename}
              className="inline-flex min-h-[46px] items-center rounded-full bg-[var(--accent)] px-6 text-[15px] font-medium text-white hover:bg-[var(--accent-hover)] cursor-pointer"
            >
              {c.renameContinue}
            </button>
          </div>
        )}

        {view === "share" && (
          <div className="rounded-xl border border-[var(--border)] bg-white p-5">
            <div className="mb-4 text-[14px]">
              <span className="text-[var(--text-tertiary)]">{c.shareWith}: </span>
              <span className="font-medium">Jordan Diaz · New Hire</span>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                onClick={() => setPermission("view")}
                className={`min-h-[44px] rounded-full border px-4 text-[14px] font-medium cursor-pointer ${
                  permission === "view"
                    ? "border-[var(--accent)] bg-[var(--accent-tint)] text-[var(--accent)]"
                    : "border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-muted)]"
                }`}
              >
                {c.canView}
              </button>
              <button
                onClick={() => setPermission("edit")}
                className={`min-h-[44px] rounded-full border px-4 text-[14px] font-medium cursor-pointer ${
                  permission === "edit"
                    ? "border-[var(--accent)] bg-[var(--accent-tint)] text-[var(--accent)]"
                    : "border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-muted)]"
                }`}
              >
                {c.canEdit}
              </button>
            </div>
            <button
              onClick={tryShare}
              className="inline-flex min-h-[46px] items-center rounded-full bg-[var(--accent)] px-6 text-[15px] font-medium text-white hover:bg-[var(--accent-hover)] cursor-pointer"
            >
              {c.share}
            </button>
          </div>
        )}

        {view === "done" && (
          <div className="flex flex-col gap-5">
            <TaskDoneCard
              kicker={c.sentKicker}
              title={c.doneTitle}
              body={c.doneBody}
              badgeNumber="08"
              badgeName={c.badgeName}
              badgeWhere={c.badgeWhere}
            />

            <ConfidenceCheck
              question={c.confidenceQ}
              options={CONFIDENCE_OPTIONS[lang]}
              selected={confidence}
              onSelect={setConfidence}
            />

            <div className="flex flex-wrap gap-2">
              <button
                onClick={restart}
                className="inline-flex min-h-[46px] items-center rounded-full bg-[var(--accent)] px-5 text-[15px] font-medium text-white hover:bg-[var(--accent-hover)] cursor-pointer"
              >
                {c.tryAgain}
              </button>
              <button
                onClick={minimizeActive}
                className="inline-flex min-h-[46px] items-center rounded-full border border-[var(--border)] px-5 text-[15px] font-medium text-[var(--text-primary)] hover:bg-[var(--surface-muted)] cursor-pointer"
              >
                {c.backToDesk}
              </button>
            </div>
          </div>
        )}
      </div>

      <HelpDrawer
        open={help}
        onClose={() => setHelp(false)}
        kicker={c.lessonKicker}
        lesson={LESSONS[lang][view === "share" ? 1 : 0]}
        tipLabel={c.tipLabel}
        gotItLabel={c.gotIt}
        askPersonLabel={c.askPerson}
      />

      <NudgeToast text={nudge} bottom={32} />
    </div>
  );
}

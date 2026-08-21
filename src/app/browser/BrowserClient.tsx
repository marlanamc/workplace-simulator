"use client";

import { useState } from "react";
import MailClient from "../mail/MailClient";
import PortalPage from "./PortalPage";
import CalendarTask from "./CalendarTask";
import FilesTask from "./FilesTask";
import HandbookTask from "./HandbookTask";
import IncidentTask from "./IncidentTask";
import { SHELF_HEIGHT } from "@/components/Shelf";
import WindowControls from "@/components/WindowControls";
import { useWindowManager } from "@/lib/window-manager";
import { useProgress } from "@/lib/progress-context";
import { LEVELS, levelForTrack } from "@/lib/tracks-content";
import { useNudge } from "@/lib/use-nudge";
import NudgeToast from "@/components/task/NudgeToast";

type TabKey = "mail" | "portal" | "calendar" | "files" | "handbook" | "incident" | "newtab";

interface TabDef {
  key: TabKey;
  label: string;
  url: string;
  icon: string;
  color: string;
  /** Which level this tab belongs to — only tabs matching the level currently being viewed show up. */
  levelKey: string;
  /** Whether this tab can be closed by the user */
  closeable?: boolean;
}

const BASE_TABS: TabDef[] = [
  { key: "mail",     label: "Hmail",  url: "hmail.harborsidecafe.com",  icon: "M",  color: "#ea4335", levelKey: "level1" },
  { key: "portal",   label: "Hportal",url: "hportal.harborsidecafe.com",icon: "▦",  color: "#8430ce", levelKey: "level1" },
  { key: "incident", label: "Hforms", url: "hforms.harborsidecafe.com", icon: "📝", color: "#7248b9", levelKey: "level1" },
  { key: "handbook", label: "Hdocs",  url: "hdocs.harborsidecafe.com",  icon: "📄", color: "#4285f4", levelKey: "level1" },
  { key: "calendar", label: "Hcal",   url: "hcal.harborsidecafe.com",   icon: "📅", color: "#34a853", levelKey: "level2" },
  { key: "files",    label: "Hdrive", url: "hdrive.harborsidecafe.com", icon: "△",  color: "#fbbc04", levelKey: "level2" },
];

/** The 4-color Chrome circle logo */
function ChromeLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-label="Chrome" fill="none">
      <path d="M24 8 A16 16 0 0 1 37.9 30 L30.4 26 A8 8 0 0 0 24 16 Z" fill="#ea4335" />
      <path d="M37.9 30 A16 16 0 0 1 10.1 30 L17.6 26 A8 8 0 0 0 30.4 26 Z" fill="#34a853" />
      <path d="M10.1 30 A16 16 0 0 1 24 8 L24 16 A8 8 0 0 0 17.6 26 Z" fill="#4285f4" />
      <circle cx="24" cy="24" r="8" fill="#fbbc04" />
      <circle cx="24" cy="24" r="5.5" fill="white" />
    </svg>
  );
}

/** Chrome-style tombstone tab */
function ChromeTab({
  tab,
  isActive,
  canClose,
  onClick,
  onClose,
}: {
  tab: TabDef;
  isActive: boolean;
  canClose: boolean;
  onClick: () => void;
  onClose: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={tab.label}
      className="relative flex min-w-0 w-44 shrink-0 items-center gap-2 px-3 pt-2 pb-0 cursor-pointer group"
      style={{ height: 36 }}
    >
      {/* tombstone background */}
      <span
        className="absolute inset-0 rounded-t-lg"
        style={{
          background: isActive ? "white" : "transparent",
          boxShadow: isActive ? "inset 0 1px 0 rgba(0,0,0,0.08)" : undefined,
        }}
      />
      {/* curved corner notches for active tab */}
      {isActive && (
        <>
          <span
            className="pointer-events-none absolute -left-2 bottom-0 h-3 w-3"
            style={{ background: "white", borderBottomRightRadius: "100%", boxShadow: "3px 0 0 0 #dee1e6" }}
          />
          <span
            className="pointer-events-none absolute -right-2 bottom-0 h-3 w-3"
            style={{ background: "white", borderBottomLeftRadius: "100%", boxShadow: "-3px 0 0 0 #dee1e6" }}
          />
        </>
      )}
      {/* favicon */}
      <span
        className="relative z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm text-white text-[9px] font-bold"
        style={{ background: tab.key === "newtab" ? "#e8eaed" : tab.color }}
      >
        {tab.key === "newtab" ? "" : tab.icon}
      </span>
      {/* label */}
      <span
        className={`relative z-10 flex-1 truncate text-left text-[13px] ${
          isActive ? "font-medium text-[#202124]" : "text-[#3c4043] group-hover:text-[#202124]"
        }`}
      >
        {tab.label}
      </span>
      {/* close ✕ — only visible for closeable tabs */}
      {canClose && (
        <span
          role="button"
          aria-label={`Close ${tab.label}`}
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className={`relative z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] transition-opacity cursor-pointer ${
            isActive ? "opacity-60 hover:opacity-100 hover:bg-black/10" : "opacity-0 group-hover:opacity-60 hover:opacity-100"
          } text-[#5f6368]`}
        >
          ✕
        </span>
      )}
    </button>
  );
}

/** Chrome new tab page — minimal but recognisable */
function NewTabPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 bg-[#f5f6fa]">
      <ChromeLogo size={64} />
      <div className="flex w-[560px] max-w-full items-center gap-3 rounded-full border border-[#dadce0] bg-white px-5 py-3 shadow-sm text-[15px] text-[#5f6368]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 text-[#4285f4]">
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        Search or type a web address
      </div>
      <p className="text-[13px] text-[#80868b]">This is a practice browser — use the bookmarks bar above to open your apps.</p>
    </div>
  );
}

export default function BrowserClient() {
  const { browserTab, browserTabToken } = useWindowManager();
  const { currentTrack } = useProgress();
  const { nudge, say } = useNudge(3500);

  const progressLevelKey = levelForTrack(currentTrack.key).key;
  const isLevel2 = progressLevelKey === "level2";

  const defaultTab =
    (LEVELS.find((l) => l.key === progressLevelKey)?.firstTabKey as TabKey | undefined) ?? "mail";

  // Level 1: pre-open all curriculum tabs so students can see them right away.
  // Level 2: start with a blank New Tab — students must find and click a bookmark
  //          themselves, which is the point of the exercise.
  const NEWTAB_STUB: TabDef = {
    key: "newtab" as TabKey,
    label: "New Tab",
    url: "newtab",
    icon: "",
    color: "#e8eaed",
    levelKey: progressLevelKey,
    closeable: true,
  };
  const [openTabs, setOpenTabs] = useState<TabDef[]>(
    isLevel2
      ? [NEWTAB_STUB]
      : BASE_TABS.filter((t) => t.levelKey === progressLevelKey)
  );
  const [activeTab, setActiveTab] = useState<TabKey>(
    isLevel2
      ? ("newtab" as TabKey)
      : BASE_TABS.some((t) => t.key === browserTab)
      ? (browserTab as TabKey)
      : defaultTab
  );

  // Deep-link handling from launcher / shelf navigator
  const [lastToken, setLastToken] = useState(browserTabToken);
  const [lastBrowserTab, setLastBrowserTab] = useState(browserTab);
  if (browserTabToken !== lastToken) {
    setLastToken(browserTabToken);
    const explicitTabRequested = browserTab !== lastBrowserTab;
    setLastBrowserTab(browserTab);
    const newLevelKey = levelForTrack(currentTrack.key).key;
    const newIsLevel2 = newLevelKey === "level2";
    if (explicitTabRequested && BASE_TABS.some((t) => t.key === browserTab)) {
      setActiveTab(browserTab as TabKey);
      // Ensure that tab is open in our tab list
      const tabDef = BASE_TABS.find((t) => t.key === browserTab);
      if (tabDef && !openTabs.some((t) => t.key === browserTab)) {
        setOpenTabs((prev) => [...prev, tabDef]);
      }
    } else {
      const activeLevelKey = BASE_TABS.find((t) => t.key === activeTab)?.levelKey;
      const correctLevel = newIsLevel2 ? "level2" : "level1";
      if (activeLevelKey !== correctLevel) {
        setOpenTabs(BASE_TABS.filter((t) => t.levelKey === correctLevel));
        setActiveTab(defaultTab);
      }
    }
  }

  const active = [...openTabs].find((t) => t.key === activeTab)
    ?? openTabs[0];

  // ── Tab actions ────────────────────────────────────────────
  const openNewTab = () => {
    if (!isLevel2) {
      say("Opening new tabs is a Level 2 skill — you'll unlock it once you reach Shift Lead!");
      return;
    }
    // Add a new-tab placeholder if not already open
    const newTabId = `newtab-${Date.now()}` as TabKey;
    const newTabDef: TabDef = {
      key: "newtab",
      label: "New Tab",
      url: "newtab",
      icon: "",
      color: "#e8eaed",
      levelKey: "level2",
      closeable: true,
    };
    setOpenTabs((prev) => [...prev, { ...newTabDef, key: newTabId }]);
    setActiveTab(newTabId);
  };

  const closeTab = (key: TabKey) => {
    if (!isLevel2) return;
    const idx = openTabs.findIndex((t) => t.key === key);
    const remaining = openTabs.filter((t) => t.key !== key);
    if (remaining.length === 0) {
      // Never leave the student with zero tabs — open a fresh New Tab
      const freshNewTab: TabDef = {
        key: `newtab-${Date.now()}` as TabKey,
        label: "New Tab",
        url: "newtab",
        icon: "",
        color: "#e8eaed",
        levelKey: "level2",
        closeable: true,
      };
      setOpenTabs([freshNewTab]);
      setActiveTab(freshNewTab.key as TabKey);
      return;
    }
    setOpenTabs(remaining);
    if (activeTab === key) {
      const nextIdx = Math.min(idx, remaining.length - 1);
      setActiveTab(remaining[nextIdx].key as TabKey);
    }
  };

  // Each tab is closeable in level 2 IF it's a "newtab" placeholder
  // OR if there's more than one tab open
  const canCloseTab = (tab: TabDef) =>
    isLevel2 && (tab.key === "newtab" || tab.closeable || openTabs.length > 1);

  return (
    <div
      className="flex flex-col"
      style={{ height: `calc(100vh - ${SHELF_HEIGHT}px)`, background: "#dee1e6" }}
    >
      {/* ── Top Chrome bar ─────────────────────────────────────── */}
      <div className="flex items-end bg-[#dee1e6] px-2 pt-2 gap-0" style={{ height: 40 }}>
        {/* Chrome logo */}
        <div className="flex items-center justify-center px-2 pb-1 shrink-0">
          <ChromeLogo size={22} />
        </div>

        {/* Tab strip */}
        <div className="flex items-end flex-1 gap-0 overflow-x-auto min-w-0" style={{ height: 36 }}>
          {openTabs.map((t) => (
            <ChromeTab
              key={t.key}
              tab={t}
              isActive={t.key === activeTab}
              canClose={canCloseTab(t)}
              onClick={() => setActiveTab(t.key as TabKey)}
              onClose={() => closeTab(t.key as TabKey)}
            />
          ))}
          {/* New tab button */}
          <button
            className={`flex h-7 w-7 mb-1 ml-1 shrink-0 items-center justify-center rounded-full text-[20px] font-light transition-colors cursor-pointer ${
              isLevel2
                ? "text-[#3c4043] hover:bg-black/10"
                : "text-[#3c4043]/40 cursor-default"
            }`}
            aria-label="New tab"
            title={isLevel2 ? "New tab" : "Unlock in Level 2"}
            onClick={openNewTab}
          >
            +
          </button>
        </div>

        {/* Window controls */}
        <div className="shrink-0 pb-1">
          <WindowControls appKey="browser" />
        </div>
      </div>

      {/* ── Toolbar ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 bg-[#f1f3f4] px-3 py-1.5 border-b border-[#c8cace]">
        <button className="flex h-8 w-8 items-center justify-center rounded-full text-[#5f6368] hover:bg-black/8 cursor-pointer" aria-label="Back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-full text-[#c8cace] cursor-default" aria-label="Forward" disabled>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 11h12.17l-5.59-5.59L12 4l8 8-8 8-1.41-1.41L16.17 13H4v-2z" />
          </svg>
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-full text-[#5f6368] hover:bg-black/8 cursor-pointer" aria-label="Reload">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4C7.58 4 4 7.58 4 12s3.58 8 8 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
          </svg>
        </button>

        {/* Address bar */}
        <div className="flex flex-1 items-center gap-2 rounded-full bg-white border border-[#dadce0] px-3 py-1.5 text-[14px] text-[#202124] hover:shadow-sm transition-shadow">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#188038" className="shrink-0">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
          </svg>
          <span className="flex-1 truncate text-[13px]">
            {active?.key === "newtab" ? "New Tab" : active?.url ?? ""}
          </span>
          <button className="shrink-0 text-[#5f6368] hover:text-[#1a73e8] transition-colors cursor-pointer" title="Bookmark" aria-label="Bookmark this tab">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        </div>

        <button className="flex h-8 w-8 items-center justify-center rounded-full text-[#5f6368] hover:bg-black/8 cursor-pointer" aria-label="Chrome menu">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      </div>

      {/* ── Bookmarks bar — always shows every tab so students can always find their apps ── */}
      <div className="flex items-center gap-0.5 bg-[#f1f3f4] px-3 py-1 border-b border-[#c8cace]">
        {BASE_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => {
              // If not already open, open it as a new tab
              if (!openTabs.some((ot) => ot.key === t.key)) {
                setOpenTabs((prev) => [...prev, t]);
              }
              setActiveTab(t.key as TabKey);
            }}
            className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-[12px] font-medium cursor-pointer transition-colors ${
              active?.key === t.key
                ? "bg-[#dadce0] text-[#202124]"
                : "text-[#3c4043] hover:bg-[#e8eaed]"
            }`}
          >
            <span
              className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm text-white text-[7px] font-bold"
              style={{ background: t.color }}
            >
              {t.icon}
            </span>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Page content ─────────────────────────────────────────── */}
      <div className="min-h-0 flex-1 overflow-hidden bg-white">
        {active?.key === "mail"     && <MailClient />}
        {active?.key === "portal"   && <PortalPage />}
        {active?.key === "calendar" && <CalendarTask />}
        {active?.key === "files"    && <FilesTask />}
        {active?.key === "incident" && <IncidentTask />}
        {active?.key === "handbook" && <HandbookTask />}
        {(active?.key === "newtab" || active?.key?.startsWith("newtab-")) && <NewTabPage />}
      </div>

      <NudgeToast text={nudge} bottom={SHELF_HEIGHT + 20} />
    </div>
  );
}

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

type TabKey = "mail" | "portal" | "calendar" | "files" | "handbook" | "incident";

interface TabDef {
  key: TabKey;
  label: string;
  url: string;
  icon: string;
  color: string;
  /** Which level this tab belongs to — only tabs matching the level currently being viewed show up. */
  levelKey: string;
}

const TABS: TabDef[] = [
  { key: "mail", label: "WorkMail", url: "mail.harborsidecafe.com", icon: "✉", color: "#1a73e8", levelKey: "level1" },
  { key: "portal", label: "Employee Portal", url: "portal.harborsidecafe.com", icon: "▦", color: "#8430ce", levelKey: "level1" },
  { key: "incident", label: "Incident Report", url: "incidents.harborsidecafe.com", icon: "⚠", color: "#b06000", levelKey: "level1" },
  { key: "handbook", label: "Handbook", url: "handbook.harborsidecafe.com", icon: "▤", color: "#3c4043", levelKey: "level1" },
  { key: "calendar", label: "Calendar", url: "calendar.harborsidecafe.com", icon: "📅", color: "#188038", levelKey: "level2" },
  { key: "files", label: "Shared Drive", url: "drive.harborsidecafe.com", icon: "🗂", color: "#1a73e8", levelKey: "level2" },
];

export default function BrowserClient() {
  const { browserTab, browserTabToken } = useWindowManager();
  const { currentTrack } = useProgress();
  const progressLevelKey = levelForTrack(currentTrack.key).key;
  const defaultTab =
    (LEVELS.find((l) => l.key === progressLevelKey)?.firstTabKey as TabKey | undefined) ?? "mail";

  const [activeTab, setActiveTab] = useState<TabKey>(
    TABS.some((t) => t.key === browserTab) ? (browserTab as TabKey) : defaultTab
  );

  // Every time the Browser is freshly (re)opened — a deep link naming an exact
  // tab (from the launcher, a task CTA, or the shelf's level navigator), or a
  // generic "Open Browser" click — re-check which tab it should land on.
  // Adjusted during render (React's recommended pattern), not in an effect,
  // and gated on the token so this only runs on an actual open, never on
  // every render while the Browser stays mounted through a task's own
  // completion screen (which would yank it away before "Back to desktop").
  const [lastToken, setLastToken] = useState(browserTabToken);
  const [lastBrowserTab, setLastBrowserTab] = useState(browserTab);
  if (browserTabToken !== lastToken) {
    setLastToken(browserTabToken);
    const explicitTabRequested = browserTab !== lastBrowserTab;
    setLastBrowserTab(browserTab);
    if (explicitTabRequested && TABS.some((t) => t.key === browserTab)) {
      // A deep link named an exact tab — honor it even if it belongs to a
      // level other than current progress (e.g. the shelf navigator
      // revisiting a past level on purpose).
      setActiveTab(browserTab as TabKey);
    } else {
      // A generic reopen with no tab named — keep the current tab if it
      // still belongs to the learner's current level, otherwise it's a
      // stale tab left over from a level since moved past, so land on
      // that level's first tab instead.
      const activeLevelKey = TABS.find((t) => t.key === activeTab)?.levelKey;
      setActiveTab(activeLevelKey === progressLevelKey ? activeTab : defaultTab);
    }
  }

  const active = TABS.find((t) => t.key === activeTab)!;
  // Only show tabs from whichever level the active tab belongs to — a
  // learner in Level 2 shouldn't see Level 1's tabs cluttering the strip.
  // Revisiting an earlier level (via the shelf's navigator) swaps this
  // whole set, the same way switching tabs within a level already works.
  const visibleTabs = TABS.filter((t) => t.levelKey === active.levelKey);

  return (
    <div className="flex flex-col bg-[#dee1e6]" style={{ height: `calc(100vh - ${SHELF_HEIGHT}px)` }}>
      {/* tab strip */}
      <div className="flex items-end gap-1 bg-[#dee1e6] px-2 pt-2">
        {visibleTabs.map((t) => {
          const isActive = t.key === activeTab;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex max-w-[200px] items-center gap-2 rounded-t-lg px-3 py-2 text-[13px] font-medium cursor-pointer ${
                isActive ? "bg-white text-[var(--text-primary)]" : "text-[#3c4043] hover:bg-white/40"
              }`}
            >
              <span
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded text-white"
                style={{ background: t.color, fontSize: 9 }}
              >
                {t.icon}
              </span>
              <span className="truncate">{t.label}</span>
            </button>
          );
        })}
        <div className="flex-1" />
        <WindowControls appKey="browser" />
      </div>

      {/* address bar */}
      <div className="flex items-center gap-2 bg-white px-3 py-2 shadow-[0_1px_0_rgba(0,0,0,0.06)]">
        <span className="text-[15px] text-[#5f6368]">←</span>
        <span className="text-[15px] text-[#c6ccd1]">→</span>
        <span className="text-[15px] text-[#5f6368]">⟳</span>
        <div className="flex flex-1 items-center gap-2 rounded-full bg-[var(--surface-muted)] px-3.5 py-1.5 text-[13px] text-[#3c4043]">
          <span className="text-[#1e8e3e]" aria-hidden>🔒</span>
          {active.url}
        </div>
      </div>

      {/* bookmarks bar */}
      <div className="flex items-center gap-1 border-b border-[#c6ccd1] bg-white px-3 py-1.5">
        {visibleTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="flex items-center gap-1.5 rounded px-2 py-1 text-[12px] font-medium text-[#3c4043] hover:bg-[var(--surface-muted)] cursor-pointer"
          >
            <span
              className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm text-white"
              style={{ background: t.color, fontSize: 8 }}
            >
              {t.icon}
            </span>
            {t.label}
          </button>
        ))}
      </div>

      {/* content */}
      <div className="min-h-0 flex-1 overflow-hidden bg-white">
        {activeTab === "mail" && <MailClient />}
        {activeTab === "portal" && <PortalPage />}
        {activeTab === "calendar" && <CalendarTask />}
        {activeTab === "files" && <FilesTask />}
        {activeTab === "incident" && <IncidentTask />}
        {activeTab === "handbook" && <HandbookTask />}
      </div>
    </div>
  );
}

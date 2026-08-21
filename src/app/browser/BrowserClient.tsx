"use client";

import { useState } from "react";
import MailClient from "../mail/MailClient";
import PortalPage from "./PortalPage";
import HandbookTask from "./HandbookTask";
import IncidentTask from "./IncidentTask";
import { SHELF_HEIGHT } from "@/components/Shelf";
import WindowControls from "@/components/WindowControls";
import { useWindowManager } from "@/lib/window-manager";

type TabKey = "mail" | "portal" | "handbook" | "incident";

interface TabDef {
  key: TabKey;
  label: string;
  url: string;
  icon: string;
  color: string;
}

const TABS: TabDef[] = [
  { key: "mail", label: "WorkMail", url: "mail.harborsidecafe.com", icon: "✉", color: "#1a73e8" },
  { key: "portal", label: "Employee Portal", url: "portal.harborsidecafe.com", icon: "▦", color: "#8430ce" },
  { key: "incident", label: "Incident Report", url: "incidents.harborsidecafe.com", icon: "⚠", color: "#b06000" },
  { key: "handbook", label: "Handbook", url: "handbook.harborsidecafe.com", icon: "▤", color: "#3c4043" },
];

export default function BrowserClient() {
  const { browserTab, browserTabToken } = useWindowManager();
  const [activeTab, setActiveTab] = useState<TabKey>(
    TABS.some((t) => t.key === browserTab) ? (browserTab as TabKey) : "mail"
  );

  // A deep link (e.g. "Employee Portal" from the launcher) requests a tab —
  // jump to it even if Browser is already open on a different tab. Adjusted
  // during render (React's recommended pattern), not in an effect.
  const [lastToken, setLastToken] = useState(browserTabToken);
  if (browserTabToken !== lastToken) {
    setLastToken(browserTabToken);
    if (TABS.some((t) => t.key === browserTab)) {
      setActiveTab(browserTab as TabKey);
    }
  }

  const active = TABS.find((t) => t.key === activeTab)!;

  return (
    <div className="flex flex-col bg-[#dee1e6]" style={{ height: `calc(100vh - ${SHELF_HEIGHT}px)` }}>
      {/* tab strip */}
      <div className="flex items-end gap-1 bg-[#dee1e6] px-2 pt-2">
        {TABS.map((t) => {
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
        {TABS.map((t) => (
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
        {activeTab === "incident" && <IncidentTask />}
        {activeTab === "handbook" && <HandbookTask />}
      </div>
    </div>
  );
}

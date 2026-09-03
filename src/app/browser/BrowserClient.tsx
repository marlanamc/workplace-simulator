"use client";

import { useEffect, useRef, useState } from "react";
import MailClient from "../mail/MailClient";
import TourTask from "./TourTask";
import { TAB_COMPONENTS } from "./tab-components";
import { SHELF_RESERVE } from "@/components/Shelf";
import WindowControls from "@/components/WindowControls";
import { useWindowManager } from "@/lib/window-manager";
import { useProgress } from "@/lib/progress-context";
import { LEVELS, levelForTrack, nextTaskInTrack } from "@/lib/tracks-content";
import { TAB_META, TAB_COLORS, bookmarkTabKeys } from "@/lib/tabs";
import { newTabHint } from "@/lib/shift-spine";
import { useNudge } from "@/lib/use-nudge";
import NudgeToast from "@/components/task/NudgeToast";
import { TAB_ICONS } from "@/lib/icons";
import TourWalkthrough from "@/components/task/TourWalkthrough";
import { TOUR_STEPS } from "@/lib/tasks/tour/content";

type TabKey = "tour" | "mail" | "portal" | "calendar" | "files" | "spreadsheet" | "make-a-copy" | "status-report" | "triage" | "team-schedule" | "formula-check" | "team-meeting" | "priority-call" | "college-offer" | "budget-sheet" | "college-portal" | "coursework" | "library" | "front-desk" | "billing-sheet" | "zoom" | "handbook" | "incident" | "account-recovery" | "newtab";

function isNewTabKey(key: string | undefined) {
  return key === "newtab" || Boolean(key?.startsWith("newtab-"));
}

interface TabDef {
  key: TabKey;
  label: string;
  url: string;
  color: string;
  /** Which level this tab belongs to - only tabs matching the level currently being viewed show up. */
  levelKey: string;
  /** Whether this tab can be closed by the user */
  closeable?: boolean;
}

/** The openable tabs, from the shared tab registry (`@/lib/tabs`). */
const BASE_TABS: TabDef[] = TAB_META.map((t) => ({
  key: t.key as TabKey,
  label: t.label,
  url: t.url,
  color: t.color,
  levelKey: t.levelKey,
}));

/** Chrome-style tab - active tab is the same white as the toolbar, so they read as one piece. */
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
  const newTab = isNewTabKey(tab.key);
  const Icon = TAB_ICONS[tab.key];
  // The close control is a real sibling <button>, never nested inside the
  // tab's button (invalid HTML and unreachable by keyboard).
  return (
    <div
      className={`group relative flex h-[34px] min-w-[72px] max-w-[240px] flex-1 items-center ${
        isActive ? "z-10" : "z-0"
      }`}
    >
      {isActive ? (
        <span className="absolute inset-0 rounded-t-[10px] bg-white" />
      ) : (
        <span className="absolute inset-[3px_2px] rounded-lg group-hover:bg-black/[0.08]" />
      )}
      <button
        onClick={onClick}
        title={tab.label}
        className="relative z-10 flex h-full min-w-0 flex-1 items-center gap-2 pl-3 pr-1 cursor-pointer"
      >
        <span
          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] text-white"
          style={{ background: newTab ? "#dadce0" : tab.color }}
        >
          {!newTab && Icon && <Icon size={11} strokeWidth={2.5} />}
        </span>
        <span
          className={`min-w-0 flex-1 truncate text-left text-[13px] ${
            isActive ? "text-[#202124]" : "text-[#474747]"
          }`}
        >
          {tab.label}
        </span>
      </button>
      {canClose && (
        <button
          aria-label={`Close ${tab.label}`}
          onClick={onClose}
          className={`relative z-10 mr-2 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[11px] text-[#5f6368] cursor-pointer hover:bg-black/10 ${
            isActive ? "opacity-70" : "opacity-0 group-hover:opacity-70"
          }`}
        >
          ✕
        </button>
      )}
    </div>
  );
}

function GoogleWordmark() {
  return (
    <div
      className="select-none text-[68px] font-medium leading-none tracking-[-0.04em]"
      aria-label="Google"
    >
      <span className="text-[#4285f4]">G</span>
      <span className="text-[#ea4335]">o</span>
      <span className="text-[#fbbc05]">o</span>
      <span className="text-[#4285f4]">g</span>
      <span className="text-[#34a853]">l</span>
      <span className="text-[#ea4335]">e</span>
    </div>
  );
}

function NewTabPage() {
  const { lang, currentTrack, completedTaskKeys } = useProgress();
  const nextKey = nextTaskInTrack(currentTrack, completedTaskKeys);
  const hint = newTabHint(levelForTrack(currentTrack.key), nextKey, lang);
  return (
    <div className="flex h-full flex-col items-center bg-white pt-[12vh]">
      <GoogleWordmark />
      <div className="mt-8 flex w-[min(584px,92%)] items-center gap-3 rounded-full bg-white px-5 py-[13px] text-[16px] text-[#5f6368] shadow-[0_1px_6px_rgba(32,33,36,0.28)]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 text-[#9aa0a6]">
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
        Search Google or type a URL
      </div>
      <p className="mt-10 text-[13px] text-[#70757a]">{hint}</p>
    </div>
  );
}

export default function BrowserClient() {
  const { browserTab, browserTabToken, browserTabExplicit, setBrowserTab } = useWindowManager();
  const { lang, currentTrack, completedTaskKeys, bridgePath } = useProgress();
  const { nudge, say, dismiss } = useNudge();
  const [tourWalkthroughStep, setTourWalkthroughStep] = useState<number | null>(null);
  const [tourWalkthroughDone, setTourWalkthroughDone] = useState(false);
  const [tourHelpOpen, setTourHelpOpen] = useState(false);

  const progressLevelKey = levelForTrack(currentTrack.key).key;
  const jumpDef =
    browserTabExplicit && BASE_TABS.some((t) => t.key === browserTab)
      ? BASE_TABS.find((t) => t.key === browserTab)
      : undefined;
  const initialLevelKey = jumpDef?.levelKey ?? progressLevelKey;
  const initialLevelDef = LEVELS.find((l) => l.key === initialLevelKey);
  const initialFreeTabbing = initialLevelDef?.freeTabbing ?? false;
  const defaultTab = (initialLevelDef?.firstTabKey as TabKey | undefined) ?? "mail";

  // Levels without freeTabbing: pre-open all of that level's curriculum tabs
  // so students can see them right away. Levels with freeTabbing: start on a
  // blank New Tab - students must find and click a bookmark themselves,
  // which is the point of the exercise. A studio/Levels jump names a tab and
  // opens that one instead, even in a free-tabbing level.
  const makeNewTabStub = (levelKey: string): TabDef => ({
    key: "newtab" as TabKey,
    label: "New Tab",
    url: "newtab",
    color: "#e8eaed",
    levelKey,
    closeable: true,
  });
  // A level's firstTabKey is sometimes a tab shared with an earlier level
  // (e.g. Portal now hosts both the First Week and Payday & Trouble levels'
  // tasks) - TAB_LEVEL_KEYS only records one owning level per tab, so a
  // plain levelKey match can miss it. Always include the level's own
  // firstTabKey tab even when its recorded levelKey points elsewhere.
  const tabsForLevel = (levelKey: string, firstTabKey?: string): TabDef[] => {
    const matched = BASE_TABS.filter((t) => t.levelKey === levelKey);
    if (firstTabKey && !matched.some((t) => t.key === firstTabKey)) {
      const shared = BASE_TABS.find((t) => t.key === firstTabKey);
      if (shared) return [...matched, shared];
    }
    return matched;
  };
  const [openTabs, setOpenTabs] = useState<TabDef[]>(() => {
    if (jumpDef) return [jumpDef];
    return initialFreeTabbing
      ? [makeNewTabStub(initialLevelKey)]
      : tabsForLevel(initialLevelKey, initialLevelDef?.firstTabKey);
  });
  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    if (jumpDef) return jumpDef.key;
    return initialFreeTabbing ? ("newtab" as TabKey) : defaultTab;
  });

  const viewedLevelKey =
    openTabs.find((t) => t.key === activeTab)?.levelKey ??
    BASE_TABS.find((t) => t.key === activeTab)?.levelKey ??
    progressLevelKey;
  const viewedLevelDef = LEVELS.find((l) => l.key === viewedLevelKey);
  const freeTabbing = viewedLevelDef?.freeTabbing ?? false;
  const visibleBookmarks = bookmarkTabKeys(viewedLevelKey, completedTaskKeys, bridgePath);

  // Deep-link handling from launcher / shelf navigator / Levels dropdown.
  // `browserTabExplicit` (from window-manager) tells "go to this exact tab"
  // (a CTA, a Recent item, the Levels navigator) apart from a bare re-open
  // (pinned shelf icon) that should just resync to current progress -
  // relying on whether the *value* changed doesn't work, since re-picking
  // the same level/tab twice in a row is a real, common case.
  const [lastToken, setLastToken] = useState(browserTabToken);
  if (browserTabToken !== lastToken) {
    setLastToken(browserTabToken);
    if (browserTabExplicit && BASE_TABS.some((t) => t.key === browserTab)) {
      const tabDef = BASE_TABS.find((t) => t.key === browserTab)!;
      const activeLevelKey = BASE_TABS.find((t) => t.key === activeTab)?.levelKey;
      setActiveTab(browserTab as TabKey);
      if (activeLevelKey !== tabDef.levelKey) {
        // Jumping to a different level's tab - start clean instead of
        // mixing tab strips from two different levels together.
        setOpenTabs([tabDef]);
      } else if (!openTabs.some((t) => t.key === browserTab)) {
        setOpenTabs((prev) => [...prev, tabDef]);
      }
    } else {
      const newLevelKey = levelForTrack(currentTrack.key).key;
      const newLevelDef = LEVELS.find((l) => l.key === newLevelKey);
      const activeLevelKey = BASE_TABS.find((t) => t.key === activeTab)?.levelKey;
      if (activeLevelKey !== newLevelKey) {
        if (newLevelDef?.freeTabbing) {
          setOpenTabs([makeNewTabStub(newLevelKey)]);
          setActiveTab("newtab");
        } else {
          setOpenTabs(tabsForLevel(newLevelKey, newLevelDef?.firstTabKey));
          setActiveTab((newLevelDef?.firstTabKey as TabKey | undefined) ?? "mail");
        }
      }
    }
  }

  // Mirror the actually-active tab back to window-manager on every internal
  // switch (bookmark click, ChromeTab click, etc.) - not just deep links -
  // so other UI (the Objectives panel) can always tell what's on screen.
  useEffect(() => {
    setBrowserTab(activeTab);
  }, [activeTab, setBrowserTab]);

  const active = [...openTabs].find((t) => t.key === activeTab)
    ?? openTabs[0];

  // The walkthrough starts when the Welcome tab opens, not when a modal's
  // button is pressed - the Job Card already sent the learner here, and a
  // second "start" button on arrival is a second voice.
  const [walkthroughOffered, setWalkthroughOffered] = useState(false);
  if (
    active?.key === "tour" &&
    !completedTaskKeys.includes("tour") &&
    !walkthroughOffered &&
    tourWalkthroughStep === null
  ) {
    setWalkthroughOffered(true);
    setTourWalkthroughStep(0);
  }

  // ── Tab actions ────────────────────────────────────────────
  // A stable counter (not Date.now()) for unique new-tab keys - several can
  // open within the same millisecond, and this stays a pure render.
  const newTabCounter = useRef(0);
  const nextNewTabId = () => `newtab-${++newTabCounter.current}` as TabKey;

  const openNewTab = () => {
    if (!freeTabbing) {
      say(
        lang === "en"
          ? "New tabs unlock a little later. For now, everything you need is already open."
          : "Las pestañas nuevas se desbloquean un poco más adelante. Por ahora, todo lo que necesitas ya está abierto.",
      );
      return;
    }
    // Add a new-tab placeholder if not already open
    const newTabId = nextNewTabId();
    const newTabDef: TabDef = {
      key: "newtab",
      label: "New Tab",
      url: "newtab",
        color: "#e8eaed",
      levelKey: viewedLevelKey,
      closeable: true,
    };
    setOpenTabs((prev) => [...prev, { ...newTabDef, key: newTabId }]);
    setActiveTab(newTabId);
  };

  const closeTab = (key: TabKey) => {
    if (!freeTabbing) return;
    const idx = openTabs.findIndex((t) => t.key === key);
    const remaining = openTabs.filter((t) => t.key !== key);
    if (remaining.length === 0) {
      // Never leave the student with zero tabs - open a fresh New Tab
      const freshNewTab: TabDef = {
        key: nextNewTabId(),
        label: "New Tab",
        url: "newtab",
            color: "#e8eaed",
        levelKey: viewedLevelKey,
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

  // Each tab is closeable in a freeTabbing level IF it's a "newtab" placeholder
  // OR if there's more than one tab open
  const canCloseTab = (tab: TabDef) =>
    freeTabbing && (isNewTabKey(tab.key) || tab.closeable || openTabs.length > 1);

  const goToBookmark = (t: TabDef) => {
    if (openTabs.some((ot) => ot.key === t.key)) {
      setActiveTab(t.key);
      return;
    }
    setOpenTabs((prev) => prev.map((ot) => (ot.key === activeTab ? t : ot)));
    setActiveTab(t.key);
  };

  const showingNewTab = isNewTabKey(active?.key);

  return (
    <div
      className="relative flex min-h-0 flex-1 flex-col bg-[#dee1e6]"
    >
      {/* ── Top Chrome bar ─────────────────────────────────────── */}
      <div className="flex items-end bg-[#dee1e6] pl-2 pr-1 pt-1.5">
        <div className="flex min-w-0 flex-1 items-end overflow-x-auto">
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
          <button
            className={`mb-[3px] ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[20px] font-light cursor-pointer ${
              freeTabbing
                ? "text-[#3c4043] hover:bg-black/10"
                : "text-[#3c4043]/40 cursor-default"
            }`}
            aria-label="New tab"
            title="New tab"
            onClick={openNewTab}
          >
            +
          </button>
        </div>

        <div className="mb-0.5 shrink-0">
          <WindowControls appKey="browser" />
        </div>
      </div>

      {/* ── Toolbar ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 bg-white px-2 py-1.5">
        <button className="flex h-8 w-8 items-center justify-center rounded-full text-[#5f6368] hover:bg-black/[0.06] cursor-pointer" aria-label="Back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-full text-[#c8cace] cursor-default" aria-label="Forward" disabled>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 11h12.17l-5.59-5.59L12 4l8 8-8 8-1.41-1.41L16.17 13H4v-2z" />
          </svg>
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-full text-[#5f6368] hover:bg-black/[0.06] cursor-pointer" aria-label="Reload">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4C7.58 4 4 7.58 4 12s3.58 8 8 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
          </svg>
        </button>

        <div className="flex h-9 flex-1 items-center gap-2 rounded-full bg-[#e9eef6] px-3 text-[14px] text-[#202124]">
          {showingNewTab ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#5f6368" className="shrink-0">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#188038" className="shrink-0">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
            </svg>
          )}
          <span className={`flex-1 truncate text-[14px] ${showingNewTab ? "text-[#5f6368]" : "text-[#202124]"}`}>
            {showingNewTab ? "Search Google or type a URL" : active?.url ?? ""}
          </span>
          {!showingNewTab && (
            <span className="shrink-0 text-[#f9ab00]" title="Bookmarked" aria-label="Bookmarked">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </span>
          )}
        </div>

        <button className="flex h-8 w-8 items-center justify-center rounded-full text-[#5f6368] hover:bg-black/[0.06] cursor-pointer" aria-label="Chrome menu">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-0.5 border-b border-[#dadce0] bg-white px-3 py-[3px]">
        {BASE_TABS.filter((t) => visibleBookmarks.has(t.key)).map((t) => (
          <button
            key={t.key}
            data-testid={`bookmark-${t.key}`}
            onClick={() => goToBookmark(t)}
            className={`flex items-center gap-1.5 rounded-md px-2 py-[5px] text-[13px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8] ${
              active?.key === t.key
                ? "bg-[#e8eaed] text-[#202124]"
                : "text-[#3c4043] hover:bg-[#f1f3f4]"
            }`}
          >
            <span
              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] text-white"
              style={{ background: t.color }}
            >
              {(() => {
                const Icon = TAB_ICONS[t.key];
                return Icon ? <Icon size={10} strokeWidth={2.5} /> : null;
              })()}
            </span>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Page content ─────────────────────────────────────────── */}
      <div className="relative min-h-0 flex-1 overflow-hidden bg-white">
        {active?.key === "tour"     && (
          <TourTask
            startAtHelp={tourWalkthroughDone}
            walkthroughRunning={tourWalkthroughStep !== null}
            helpOpen={tourHelpOpen}
            onOpenHelp={() => setTourHelpOpen(true)}
            onCloseHelp={() => setTourHelpOpen(false)}
            onStartWalkthrough={() => {
              setTourWalkthroughDone(false);
              setTourWalkthroughStep(0);
              setTourHelpOpen(false);
            }}
          />
        )}
        {active?.key === "mail"     && <MailClient welcomeWalkthroughActive={tourWalkthroughStep !== null} />}
        {(() => {
          if (!active || active.key === "tour" || active.key === "mail") return null;
          const TabComponent = TAB_COMPONENTS[active.key];
          return TabComponent ? <TabComponent /> : null;
        })()}
        {showingNewTab && <NewTabPage />}
      </div>

      {tourWalkthroughStep !== null && (
        <TourWalkthrough
          steps={TOUR_STEPS[lang]}
          stepIndex={tourWalkthroughStep}
          tabColors={TAB_COLORS}
          onHelp={() => setTourHelpOpen(true)}
          onAdvance={() => {
            const steps = TOUR_STEPS[lang];
            const next = tourWalkthroughStep + 1;
            if (next >= steps.length) {
              setTourWalkthroughStep(null);
              setTourWalkthroughDone(true);
              // Wrap-up ("I'm ready") lives on the welcome packet. The ?
              // they just tapped is on the card, so this tab switch is only
              // so TourTask can report that last beat.
              const tourDef = BASE_TABS.find((t) => t.key === "tour")!;
              setOpenTabs([tourDef]);
              setActiveTab("tour");
              return;
            }
            setTourWalkthroughStep(next);
          }}
        />
      )}

      <NudgeToast text={nudge} bottom={SHELF_RESERVE + 16} onDismiss={dismiss} />
    </div>
  );
}

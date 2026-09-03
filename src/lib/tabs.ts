/**
 * The browser tabs — one row per Chrome-style tab the learner can open.
 *
 * A "tab" is where a task is done (Mail, Sheets, Portal…). Several tasks can
 * share one tab (four mail tasks, four Portal sections), so tabs are their
 * own registry, keyed by tab key, separate from the per-task registry in
 * `tasks/registry.ts`. `TAB_LEVEL_KEYS` — which level owns each tab — is
 * derived from this list and re-exported by `tracks-content`.
 *
 * The Lucide glyph for each tab lives in `lib/icons.ts` (`TAB_ICONS`); the
 * component that renders each tab lives in `app/browser/tab-components.tsx`
 * (client-only, kept out of this RSC-safe data module).
 */

export interface TabMeta {
  key: string;
  /** Short name on the tab strip and the bookmark bar. */
  label: string;
  /** Fake address shown in the omnibox. */
  url: string;
  /** Brand color for the tab's favicon square. */
  color: string;
  /**
   * The level that owns this tab. Only tabs whose level matches the one
   * being viewed appear on the bookmark bar. One owning level per tab — a
   * tab shared across levels (Portal) records its first, and BrowserClient
   * pulls in a level's `firstTabKey` explicitly.
   */
  levelKey: string;
}

const SHEETS = { url: "sheets.harborsidecafe.com", color: "#0f9d58", label: "Sheets" } as const;

export const TAB_META: TabMeta[] = [
  { key: "tour", label: "Welcome", url: "welcome.harborsidecafe.com", color: "#c45c26", levelKey: "level0" },
  { key: "mail", label: "Mail", url: "mail.harborsidecafe.com", color: "#ea4335", levelKey: "level1" },
  { key: "calendar", label: "Calendar", url: "calendar.harborsidecafe.com", color: "#34a853", levelKey: "level4" },
  { key: "files", label: "Drive", url: "drive.harborsidecafe.com", color: "#fbbc04", levelKey: "level5" },
  { key: "handbook", label: "Docs", url: "docs.harborsidecafe.com", color: "#4285f4", levelKey: "level3b" },
  { key: "spreadsheet", ...SHEETS, levelKey: "level6" },
  { key: "make-a-copy", ...SHEETS, levelKey: "level7" },
  { key: "status-report", ...SHEETS, levelKey: "level7" },
  { key: "triage", label: "Today", url: "today.harborsidecafe.com", color: "#d93025", levelKey: "level8" },
  { key: "team-schedule", ...SHEETS, levelKey: "level9" },
  { key: "formula-check", ...SHEETS, levelKey: "level10" },
  { key: "team-meeting", label: "Huddle", url: "calendar.harborsidecafe.com", color: "#34a853", levelKey: "level11" },
  { key: "priority-call", label: "Floor", url: "today.harborsidecafe.com", color: "#d93025", levelKey: "level12" },
  { key: "college-offer", label: "Offer", url: "mail.harborsidecafe.com", color: "#ea4335", levelKey: "level13" },
  { key: "budget-sheet", ...SHEETS, levelKey: "level14" },
  { key: "college-portal", label: "College", url: "portal.bhcc.edu/apply", color: "#00897b", levelKey: "level16" },
  { key: "coursework", label: "Coursework", url: "classroom.bhcc.edu", color: "#1a73e8", levelKey: "level18" },
  { key: "library", label: "Library", url: "library.bhcc.edu/search", color: "#5f6368", levelKey: "level19" },
  { key: "front-desk", label: "Front Desk", url: "desk.harborsidehealth.com", color: "#00897b", levelKey: "level16" },
  { key: "billing-sheet", ...SHEETS, levelKey: "level18" },
  { key: "expense-report", label: "Sheets", url: "sheets.harborsidehq.com", color: "#0f9d58", levelKey: "level22" },
  { key: "slides", label: "Slides", url: "slides.harborsidehq.com", color: "#f9ab00", levelKey: "level23" },
  { key: "zoom", label: "Zoom", url: "zoom.harborsidehq.com/join", color: "#2D8CFF", levelKey: "level21" },
  { key: "incident", label: "Forms", url: "forms.harborsidecafe.com", color: "#7248b9", levelKey: "level3b" },
  { key: "account-recovery", label: "Sign In", url: "accounts.harborsidecafe.com", color: "#5f6368", levelKey: "level3c" },
  { key: "portal", label: "Portal", url: "portal.harborsidecafe.com", color: "#8430ce", levelKey: "level2" },
];

export const TAB_META_BY_KEY: Record<string, TabMeta> = Object.fromEntries(
  TAB_META.map((t) => [t.key, t]),
);

/** Which level owns each tab. Derived — edit `TAB_META`, not this. */
export const TAB_LEVEL_KEYS: Record<string, string> = Object.fromEntries(
  TAB_META.map((t) => [t.key, t.levelKey]),
);

/** Brand color per tab key, for favicon squares. */
export const TAB_COLORS: Record<string, string> = Object.fromEntries(
  TAB_META.map((t) => [t.key, t.color]),
);

/**
 * The five Sheets-flavored tabs. They share a label, so at most one shows on
 * the bookmark bar at a time — whichever the current level needs.
 */
const SHEET_TABS = ["spreadsheet", "make-a-copy", "status-report", "team-schedule", "formula-check", "budget-sheet", "billing-sheet", "expense-report"];

/** Tabs that appear on the bookmark bar only while their own level is in view. */
const GATED_TABS: Record<string, string> = {
  triage: "level8",
  "team-meeting": "level11",
  "priority-call": "level12",
  "college-offer": "level13",
  zoom: "level21",
  slides: "level23",
};

/** Act V tools: only on their path, and only on the days that need them. */
const PATH_GATED_TABS: Record<string, { path: "a" | "b"; levels: readonly string[] }> = {
  "college-portal": { path: "a", levels: ["level16", "level17"] },
  coursework: { path: "a", levels: ["level18"] },
  library: { path: "a", levels: ["level19"] },
  "front-desk": { path: "b", levels: ["level16", "level17", "level18", "level19"] },
};

/**
 * Which bookmarks show on the bar for the level currently being viewed.
 *
 * Non-gated tabs (Mail, Calendar, Drive, Docs, Portal…) always show. The
 * Sheets group collapses to one entry: the variant this level uses, or
 * `spreadsheet` as the default on levels that don't have their own. On
 * level 7 the entry swaps from "make a copy" to "status report" once the
 * copy is made. The three one-off tabs only show on their own level.
 */
export function bookmarkTabKeys(
  viewedLevelKey: string,
  completedTaskKeys: readonly string[],
  path?: "a" | "b" | null,
): Set<string> {
  const sheetForLevel: Record<string, string> = {
    level6: "spreadsheet",
    level7: completedTaskKeys.includes("make-a-copy") ? "status-report" : "make-a-copy",
    level9: "team-schedule",
    level10: "formula-check",
    level14: "budget-sheet",
    level18: path === "b" ? "billing-sheet" : "spreadsheet",
    level22: "expense-report",
  };
  const activeSheet = sheetForLevel[viewedLevelKey] ?? "spreadsheet";
  return new Set(
    TAB_META.filter((t) => {
      const pathGate = PATH_GATED_TABS[t.key];
      if (pathGate) {
        return path === pathGate.path && pathGate.levels.includes(viewedLevelKey);
      }
      if (SHEET_TABS.includes(t.key)) return t.key === activeSheet;
      if (t.key in GATED_TABS) return GATED_TABS[t.key] === viewedLevelKey;
      return true;
    }).map((t) => t.key),
  );
}

"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { AppKey } from "@/lib/desktop-content";

interface AppWindowState {
  minimized: boolean;
}

interface WindowManagerState {
  apps: Partial<Record<AppKey, AppWindowState>>;
  active: AppKey | null;
  browserTab: string;
  /**
   * Whether the current `browserTab` was explicitly requested (a CTA, the
   * Levels navigator, a recent item — the caller named a specific tab) vs.
   * just a bare re-open (pinned shelf icon, generic launcher open) that
   * should resync to whatever the learner's actual progress level is.
   * Read by BrowserClient to tell "go here" apart from "reopen where I was."
   */
  browserTabExplicit: boolean;
  browserTabToken: number;
  pdfDocId: string | null;
  pdfDocToken: number;
}

interface WindowManagerValue extends WindowManagerState {
  openApp: (key: AppKey, opts?: { tab?: string; docId?: string }) => void;
  toggleFromShelf: (key: AppKey) => void;
  closeApp: (key: AppKey) => void;
  minimizeActive: () => void;
  isOpen: (key: AppKey) => boolean;
  /** BrowserClient reports its actually-active tab here on every internal switch (bookmark click, etc.), independent of the explicit-deep-link token/flag above — this is what other UI (the Objectives panel) reads to know what's on screen right now. */
  setBrowserTab: (tab: string) => void;
}

const WindowManagerContext = createContext<WindowManagerValue | null>(null);

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WindowManagerState>({
    apps: {},
    active: null,
    browserTab: "mail",
    browserTabExplicit: false,
    browserTabToken: 0,
    pdfDocId: null,
    pdfDocToken: 0,
  });

  const openApp = useCallback((key: AppKey, opts?: { tab?: string; docId?: string }) => {
    setState((s) => {
      // A "fresh open" (the Browser wasn't already the visible app) is when the
      // Browser should re-check which tab it's showing against current progress —
      // not on every render while it stays open and mounted through a task's own
      // completion screen.
      const isFreshBrowserOpen = key === "browser" && s.active !== "browser";
      return {
        ...s,
        apps: { ...s.apps, [key]: { minimized: false } },
        active: key,
        browserTab: key === "browser" && opts?.tab ? opts.tab : s.browserTab,
        browserTabExplicit: key === "browser" ? !!opts?.tab : s.browserTabExplicit,
        browserTabToken:
          key === "browser" && (opts?.tab || isFreshBrowserOpen) ? s.browserTabToken + 1 : s.browserTabToken,
        pdfDocId: key === "pdf" && opts?.docId ? opts.docId : s.pdfDocId,
        pdfDocToken: key === "pdf" && opts?.docId ? s.pdfDocToken + 1 : s.pdfDocToken,
      };
    });
  }, []);

  /** Pinned-shelf-icon click: launch if closed, minimize if active, restore/focus otherwise. */
  const toggleFromShelf = useCallback((key: AppKey) => {
    setState((s) => {
      const entry = s.apps[key];
      // Restoring the Browser from closed or minimized is also a "fresh open" —
      // bump the token so BrowserClient re-checks its tab against current
      // progress, same as opening it via a CTA or deep link. No explicit tab
      // was named, so this always resyncs to current progress, not a specific spot.
      const isFreshBrowserReopen = key === "browser" && (!entry || entry.minimized);
      const browserTabToken = isFreshBrowserReopen ? s.browserTabToken + 1 : s.browserTabToken;
      const browserTabExplicit = isFreshBrowserReopen ? false : s.browserTabExplicit;
      if (!entry) return { ...s, apps: { ...s.apps, [key]: { minimized: false } }, active: key, browserTabToken, browserTabExplicit };
      if (s.active === key && !entry.minimized) {
        return { ...s, apps: { ...s.apps, [key]: { minimized: true } }, active: null };
      }
      return { ...s, apps: { ...s.apps, [key]: { minimized: false } }, active: key, browserTabToken, browserTabExplicit };
    });
  }, []);

  const setBrowserTab = useCallback((tab: string) => {
    setState((s) => (s.browserTab === tab ? s : { ...s, browserTab: tab }));
  }, []);

  const closeApp = useCallback((key: AppKey) => {
    setState((s) => {
      const apps = { ...s.apps };
      delete apps[key];
      return { ...s, apps, active: s.active === key ? null : s.active };
    });
  }, []);

  const minimizeActive = useCallback(() => {
    setState((s) => {
      if (!s.active) return s;
      return { ...s, apps: { ...s.apps, [s.active]: { minimized: true } }, active: null };
    });
  }, []);

  const isOpen = useCallback((key: AppKey) => !!state.apps[key], [state.apps]);

  return (
    <WindowManagerContext.Provider
      value={{ ...state, openApp, toggleFromShelf, closeApp, minimizeActive, isOpen, setBrowserTab }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager() {
  const ctx = useContext(WindowManagerContext);
  if (!ctx) throw new Error("useWindowManager must be used within WindowManagerProvider");
  return ctx;
}

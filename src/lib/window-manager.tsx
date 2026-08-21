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
}

const WindowManagerContext = createContext<WindowManagerValue | null>(null);

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WindowManagerState>({
    apps: {},
    active: null,
    browserTab: "mail",
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
      if (!entry) return { ...s, apps: { ...s.apps, [key]: { minimized: false } }, active: key };
      if (s.active === key && !entry.minimized) {
        return { ...s, apps: { ...s.apps, [key]: { minimized: true } }, active: null };
      }
      return { ...s, apps: { ...s.apps, [key]: { minimized: false } }, active: key };
    });
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
      value={{ ...state, openApp, toggleFromShelf, closeApp, minimizeActive, isOpen }}
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

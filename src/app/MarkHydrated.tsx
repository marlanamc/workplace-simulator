"use client";

import { useEffect } from "react";

/**
 * Marks the document interactive the moment React finishes hydrating.
 *
 * Every page here is server-rendered, so its buttons are painted — and, as far
 * as the browser or a test is concerned, clickable — a beat before React
 * attaches their handlers. A click in that window is dropped silently: nothing
 * happens and nothing says why. That is what made the browser suite flaky; a
 * route button clicked 0.6s after the desktop loaded did nothing at all, and
 * the test then waited out its timeout for a screen that was never coming.
 *
 * Effects run after the hydration commit, so this attribute appears exactly
 * when the page starts listening. `e2e/interactive.ts` waits for it.
 */
export function MarkHydrated() {
  useEffect(() => {
    document.documentElement.dataset.hydrated = "true";
  }, []);

  return null;
}

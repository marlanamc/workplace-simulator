"use client";

import { useSyncExternalStore } from "react";
import { DOCK_QUERY, NARROW_DOCK_QUERY } from "@/lib/job-card-placement";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(DOCK_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
const read = () => window.matchMedia(DOCK_QUERY).matches;

/**
 * True when the Story Job Card is docked beside the app window (below 1440px
 * wide), so the window is narrower than the screen. An app with
 * a wide layout uses this to switch to its narrow one, the same layout it
 * already uses in a lesson. False on the server and in the first render, so
 * hydration stays clean.
 */
export function useDocked(): boolean {
  return useSyncExternalStore(subscribe, read, () => false);
}

function subscribeNarrow(onChange: () => void) {
  const query = window.matchMedia(NARROW_DOCK_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
const readNarrow = () => window.matchMedia(NARROW_DOCK_QUERY).matches;

/**
 * True when the card is docked AND the screen is small enough (below 1100px)
 * that the app window beside it is too narrow for a multi-column layout. At
 * 1366 the docked window is about 1000px, so apps keep their normal layout.
 */
export function useNarrowDocked(): boolean {
  return useSyncExternalStore(subscribeNarrow, readNarrow, () => false);
}

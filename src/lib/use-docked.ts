"use client";

import { useSyncExternalStore } from "react";
import { DOCK_QUERY } from "@/lib/job-card-placement";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(DOCK_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
const read = () => window.matchMedia(DOCK_QUERY).matches;

/**
 * True when the Story Job Card is docked beside the app window (below about
 * 1100px wide), so the window is only a few hundred pixels wide. An app with
 * a wide layout uses this to switch to its narrow one, the same layout it
 * already uses in a lesson. False on the server and in the first render, so
 * hydration stays clean.
 */
export function useDocked(): boolean {
  return useSyncExternalStore(subscribe, read, () => false);
}

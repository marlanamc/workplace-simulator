/** The PDF Reader's zoom limits and step, in percent. */
export const ZOOM_MIN = 60;
export const ZOOM_MAX = 150;
export const ZOOM_STEP = 10;

/** A letter page at 100%: 8.5in at 96px per inch (PdfSheet's LETTER). */
const PAGE_PX = 8.5 * 96;

/**
 * The zoom a page opens at in a pane this wide: 100%, or less when the pane
 * is narrower, so the page is not cut off at the side (Phase 3 N-9: the Day 6
 * stub opened wider than the Reader beside the docked Job Card, and Net pay
 * was off screen). Never below ZOOM_MIN, where the words stop being readable;
 * the pane scrolls sideways past that. `padding` is the pane's space around
 * the page, both sides together.
 */
export function fitZoom(paneWidth: number, padding: number): number {
  const fit = Math.floor(((paneWidth - padding) / PAGE_PX) * 100);
  return Math.max(ZOOM_MIN, Math.min(100, fit));
}

/** One press of + or −, from wherever the zoom is now. */
export function stepZoom(current: number, dir: 1 | -1): number {
  return Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, current + dir * ZOOM_STEP));
}

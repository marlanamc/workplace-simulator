/** A screen rectangle, as `getBoundingClientRect()` gives it. */
export interface Box {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/**
 * The part of a Show me target the learner can actually see: the target cut
 * down by every pane that scrolls or clips it, and by the screen. A page in
 * the file picker's preview is taller (and at 911, wider) than the preview,
 * so its full rectangle ran past Attach and off the screen, and over the file
 * names beside it (Phase 3 N-8). Returns null when none of it is showing.
 */
export function visibleBox(target: Box, clips: Box[]): Box | null {
  let { left, top, right, bottom } = target;
  for (const c of clips) {
    left = Math.max(left, c.left);
    top = Math.max(top, c.top);
    right = Math.min(right, c.right);
    bottom = Math.min(bottom, c.bottom);
  }
  return right > left && bottom > top ? { left, top, right, bottom } : null;
}

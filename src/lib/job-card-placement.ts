/**
 * Where the Job Card parks, as pure functions so the choice can be tested
 * without a browser.
 *
 * The card has four parking spots. The learner picks one (by dragging, or
 * with the arrow keys), and that choice is remembered on this device. But the
 * card is never allowed to sit on the thing the learner has to press: when
 * the chosen corner would cover a Show me target (`[data-showme]`), the card
 * parks in the nearest corner that covers nothing. Show me marks every
 * control a step can be about, so "no target under the card" is the same as
 * "the next click is never hidden".
 */

export type Corner = "bl" | "br" | "tl" | "tr";
export const CORNERS: readonly Corner[] = ["bl", "br", "tl", "tr"];
/** Where a new learner finds the card. */
export const HOME_CORNER: Corner = "bl";

export interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface Size {
  width: number;
  height: number;
}

/** Air around the card: `edge` from the sides and top, `bottom` from the
 *  bottom (it clears the shelf). */
export interface Insets {
  edge: number;
  bottom: number;
}

export function isCorner(value: unknown): value is Corner {
  return typeof value === "string" && (CORNERS as readonly string[]).includes(value);
}

/** The box the card would fill parked in `corner`. */
export function cornerBox(corner: Corner, card: Size, viewport: Size, insets: Insets): Box {
  return {
    left: corner[1] === "l" ? insets.edge : viewport.width - insets.edge - card.width,
    top: corner[0] === "t" ? insets.edge : viewport.height - insets.bottom - card.height,
    width: card.width,
    height: card.height,
  };
}

/** Strict: boxes that only touch along an edge do not overlap. */
export function overlaps(a: Box, b: Box): boolean {
  return (
    a.left < b.left + b.width &&
    b.left < a.left + a.width &&
    a.top < b.top + b.height &&
    b.top < a.top + a.height
  );
}

/**
 * The corners to try, nearest move first: the learner's own corner, then
 * across the same edge (left ↔ right, the shortest trip and the one the eye
 * follows most easily), then up or down the same side, then the far corner.
 */
export function cornerOrder(preferred: Corner): Corner[] {
  const v = preferred[0];
  const h = preferred[1];
  const flipV = v === "t" ? "b" : "t";
  const flipH = h === "l" ? "r" : "l";
  return [preferred, `${v}${flipH}`, `${flipV}${h}`, `${flipV}${flipH}`] as Corner[];
}

/**
 * The corner the card should sit in: the learner's own corner if it covers
 * no target, otherwise the nearest one that covers none, otherwise the one
 * that covers the fewest (a screen with controls in all four corners still
 * gets the least-bad spot, and the learner can still move it).
 *
 * `lesser` are controls worth keeping clear but never at the cost of a
 * target: the window's own Minimize and Close. A corner that covers one
 * target always loses to a corner that covers any number of these.
 */
export function chooseCorner({
  preferred,
  card,
  viewport,
  insets,
  targets,
  lesser = [],
}: {
  preferred: Corner;
  card: Size;
  viewport: Size;
  insets: Insets;
  targets: readonly Box[];
  lesser?: readonly Box[];
}): Corner {
  const LESSER_LIMIT = 1000;
  let best = preferred;
  let lowest = Infinity;
  for (const corner of cornerOrder(preferred)) {
    const box = cornerBox(corner, card, viewport, insets);
    const covered = targets.filter((t) => overlaps(box, t)).length;
    const minor = Math.min(LESSER_LIMIT - 1, lesser.filter((t) => overlaps(box, t)).length);
    const score = covered * LESSER_LIMIT + minor;
    if (score < lowest) {
      best = corner;
      lowest = score;
    }
    if (score === 0) break;
  }
  return best;
}

/** The card's corner after an arrow key, or null for any other key. */
export function nudgedCorner(corner: Corner, key: string): Corner | null {
  if (key === "ArrowLeft") return `${corner[0]}l` as Corner;
  if (key === "ArrowRight") return `${corner[0]}r` as Corner;
  if (key === "ArrowUp") return `t${corner[1]}` as Corner;
  if (key === "ArrowDown") return `b${corner[1]}` as Corner;
  return null;
}

/** The corner nearest to where a drag let go of the card. */
export function cornerNearest(center: { x: number; y: number }, viewport: Size): Corner {
  return `${center.y < viewport.height / 2 ? "t" : "b"}${center.x < viewport.width / 2 ? "l" : "r"}` as Corner;
}

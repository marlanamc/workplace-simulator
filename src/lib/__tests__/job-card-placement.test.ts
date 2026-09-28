import { describe, expect, it } from "vitest";
import {
  chooseCorner,
  cornerBox,
  cornerNearest,
  cornerOrder,
  isCorner,
  nudgedCorner,
  overlaps,
  type Box,
  type Corner,
} from "@/lib/job-card-placement";

// A Chromebook at 100% (1366x768) and at 150% text (911x512), with the
// card's real insets: 24px from the sides and top, 72px from the bottom
// (the 48px shelf plus 24px of air).
const LAPTOP = { width: 1366, height: 768 };
const ZOOMED = { width: 911, height: 512 };
const INSETS = { edge: 24, bottom: 72 };
const CARD = { width: 420, height: 300 };
const SMALL_CARD = { width: 340, height: 250 };

const box = (left: number, top: number, width = 120, height = 40): Box => ({ left, top, width, height });

describe("cornerBox", () => {
  it("parks the card inside the screen, clear of the shelf", () => {
    expect(cornerBox("bl", CARD, LAPTOP, INSETS)).toEqual({ left: 24, top: 768 - 72 - 300, width: 420, height: 300 });
    expect(cornerBox("br", CARD, LAPTOP, INSETS)).toEqual({ left: 1366 - 24 - 420, top: 396, width: 420, height: 300 });
    expect(cornerBox("tl", CARD, LAPTOP, INSETS)).toEqual({ left: 24, top: 24, width: 420, height: 300 });
    expect(cornerBox("tr", CARD, LAPTOP, INSETS)).toEqual({ left: 922, top: 24, width: 420, height: 300 });
  });
});

describe("overlaps", () => {
  it("counts a shared area, not a shared edge", () => {
    expect(overlaps(box(0, 0, 100, 100), box(50, 50, 100, 100))).toBe(true);
    expect(overlaps(box(0, 0, 100, 100), box(100, 0, 100, 100))).toBe(false);
    expect(overlaps(box(0, 0, 100, 100), box(0, 100, 100, 100))).toBe(false);
  });
});

describe("cornerOrder", () => {
  it("tries the learner's corner, then across, then up or down, then the far corner", () => {
    expect(cornerOrder("bl")).toEqual(["bl", "br", "tl", "tr"]);
    expect(cornerOrder("tr")).toEqual(["tr", "tl", "br", "bl"]);
  });
});

describe("chooseCorner", () => {
  const choose = (preferred: Corner, targets: Box[], card = CARD, viewport = LAPTOP) =>
    chooseCorner({ preferred, card, viewport, insets: INSETS, targets });

  it("stays in the learner's corner when nothing is under it", () => {
    expect(choose("bl", [])).toBe("bl");
    expect(choose("tr", [box(600, 300)])).toBe("tr");
  });

  it("moves across to the other side when the button to press is under the card", () => {
    // Day 3's Clock In button: low on the left, under a bottom-left card.
    expect(choose("bl", [box(60, 600)])).toBe("br");
  });

  it("goes up the same side when both bottom corners have a target", () => {
    expect(choose("bl", [box(60, 600), box(1200, 600)])).toBe("tl");
  });

  it("takes the far corner when it is the only clear one", () => {
    expect(choose("bl", [box(60, 600), box(1200, 600), box(60, 100)])).toBe("tr");
  });

  it("settles for the corner covering the fewest when none is clear", () => {
    const targets = [box(60, 600), box(100, 650), box(1200, 600), box(1200, 100), box(60, 100), box(100, 150)];
    // bl covers 2, br 1, tl 2, tr 1: br is nearer than tr.
    expect(choose("bl", targets)).toBe("br");
  });

  it("finds a clear corner for a short screen and a compact card", () => {
    // 150% text: the password field sits low and left, like Day 8.
    expect(choose("bl", [box(40, 280, 300, 44)], SMALL_CARD, ZOOMED)).toBe("br");
  });

  it("keeps the window's Minimize and Close clear, but never over a target", () => {
    const windowControls = [box(1250, 10, 100, 36)];
    // A learner who parked the card top right does not lose the window controls.
    expect(chooseCorner({ preferred: "tr", card: CARD, viewport: LAPTOP, insets: INSETS, targets: [], lesser: windowControls })).toBe("tl");
    // But a target always outranks them: with only top right clear of
    // targets, the card covers the controls, not the button to press.
    const targets = [box(60, 600), box(1200, 600), box(60, 100)];
    expect(chooseCorner({ preferred: "bl", card: CARD, viewport: LAPTOP, insets: INSETS, targets, lesser: windowControls })).toBe("tr");
  });

  it("ignores targets well away from every corner", () => {
    expect(choose("br", [box(600, 350, 100, 40)])).toBe("br");
  });
});

describe("learner moves", () => {
  it("arrow keys step to the neighbouring corner and ignore other keys", () => {
    expect(nudgedCorner("bl", "ArrowRight")).toBe("br");
    expect(nudgedCorner("bl", "ArrowUp")).toBe("tl");
    expect(nudgedCorner("tr", "ArrowLeft")).toBe("tl");
    expect(nudgedCorner("tr", "ArrowDown")).toBe("br");
    expect(nudgedCorner("bl", "Enter")).toBeNull();
  });

  it("a drag lands in the quarter of the screen it was let go in", () => {
    expect(cornerNearest({ x: 100, y: 100 }, LAPTOP)).toBe("tl");
    expect(cornerNearest({ x: 1000, y: 700 }, LAPTOP)).toBe("br");
  });

  it("only a real corner survives a round trip through storage", () => {
    expect(isCorner("tr")).toBe(true);
    expect(isCorner("middle")).toBe(false);
    expect(isCorner(null)).toBe(false);
  });
});

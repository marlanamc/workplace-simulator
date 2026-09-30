import { describe, expect, it } from "vitest";
import {
  chooseCorner,
  cornerBox,
  cornerNearest,
  cornerOrder,
  DOCK_MAX_WIDTH,
  isCorner,
  isDockedWidth,
  nudgedCorner,
  overlaps,
  scrollGutter,
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
    expect(chooseCorner({ preferred: "tr", card: CARD, viewport: LAPTOP, insets: INSETS, targets: [], avoid: windowControls })).toBe("tl");
    // But a target always outranks them: with only top right clear of
    // targets, the card covers the controls, not the button to press.
    const targets = [box(60, 600), box(1200, 600), box(60, 100)];
    expect(chooseCorner({ preferred: "bl", card: CARD, viewport: LAPTOP, insets: INSETS, targets, avoid: windowControls })).toBe("tr");
  });

  it("keeps the learner's corner over ordinary buttons, and weighs them only when it has to move", () => {
    const pageButtons = [box(60, 600), box(160, 600)];
    // Nothing that matters is under the learner's corner: it stays, even
    // though another corner would cover fewer buttons.
    expect(chooseCorner({ preferred: "bl", card: CARD, viewport: LAPTOP, insets: INSETS, targets: [], lesser: pageButtons })).toBe("bl");
    // Forced off top right by the window controls, it skips the bookmarks
    // (top left) and the corner with a Next button (bottom right) for the
    // bottom-left corner that hides nothing.
    const windowControls = [box(1250, 10, 100, 36)];
    const bookmarks = [box(20, 60, 90, 28)];
    const next = [box(1150, 610, 100, 40)];
    expect(
      chooseCorner({
        preferred: "tr",
        card: CARD,
        viewport: LAPTOP,
        insets: INSETS,
        targets: [],
        avoid: [...windowControls, ...bookmarks],
        lesser: next,
      }),
    ).toBe("bl");
  });

  // Phase 3 F-3: at 1366 the card sat on Day 2's Wed–Sat day and time labels
  // while its correction said "Look at Thursday". Text the step asks the
  // learner to read (`data-card-read`) now moves the card like a control:
  // below a target, above the bookmarks and window controls.
  it("moves off what the step asks the learner to read", () => {
    // The Day 2 schedule at 1366: day labels down the left, Request a swap
    // buttons (targets) down the right, the phone calendar right of centre.
    const labels = [330, 380, 430, 480, 530, 580, 630].map((y) => box(40, y, 300, 30));
    const swaps = [330, 380, 430, 480, 530, 580, 630].map((y) => box(1060, y, 110, 30));
    const phone = [box(1100, 180, 240, 330)];
    const windowControls = [box(1250, 10, 100, 36)];
    const bookmarks = [box(20, 90, 260, 28)];
    const pick = (read: Box[]) =>
      chooseCorner({ preferred: "bl", card: CARD, viewport: LAPTOP, insets: INSETS, targets: swaps, read, avoid: [...windowControls, ...bookmarks] });
    // Without the labels marked, the card keeps its corner over Thursday.
    expect(pick([])).toBe("bl");
    // With them marked it goes up the same side, over the bookmarks, not
    // over the buttons to press or the phone.
    expect(pick([...labels, ...phone])).toBe("tl");
  });

  it("hides as little of the reading as it can: two clipped labels, not the whole phone", () => {
    // Spanish, after a wrong try: the card is tall. Top left clips the ends of
    // the Mon and Tue labels; top right would sit on the whole phone calendar.
    // Only Thursday's Request a swap is the step's target; the rest are
    // ordinary buttons.
    const tall = { width: 420, height: 390 };
    const rows = [330, 380, 430, 480, 530, 580, 630];
    const labels = rows.map((y) => box(40, y, 300, 30));
    const thursdaySwap = [box(920, 480, 110, 30)];
    const otherSwaps = rows.filter((y) => y !== 480).map((y) => box(920, y, 110, 30));
    const phone = [box(1085, 150, 240, 330)];
    expect(
      chooseCorner({
        preferred: "bl",
        card: tall,
        viewport: LAPTOP,
        insets: INSETS,
        targets: thursdaySwap,
        read: [...labels, ...phone],
        avoid: [box(1250, 10, 100, 36)],
        lesser: otherSwaps,
      }),
    ).toBe("tl");
  });

  it("still covers something to read before it covers the button to press", () => {
    const reading = [box(60, 600, 300, 30)];
    const targets = [box(1200, 600), box(60, 100), box(1200, 100)];
    expect(chooseCorner({ preferred: "bl", card: CARD, viewport: LAPTOP, insets: INSETS, targets, read: reading })).toBe("bl");
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

describe("isDockedWidth (Wave 5 F-3, F-16, F-17)", () => {
  it("docks at Chromebook 150% text and floats at 100%", () => {
    expect(isDockedWidth(ZOOMED.width)).toBe(true);
    expect(isDockedWidth(LAPTOP.width)).toBe(false);
  });
  it("switches exactly at the breakpoint the CSS uses", () => {
    expect(isDockedWidth(DOCK_MAX_WIDTH)).toBe(true);
    expect(isDockedWidth(DOCK_MAX_WIDTH + 1)).toBe(false);
    expect(isDockedWidth(1100)).toBe(false);
  });
});

describe("scrollGutter (Wave 5 F-2, F-25: the runaway gutter)", () => {
  // A Portal page on a short, wide screen: the window's clip, and the page's
  // scroll area under the tabs, filling the rest of the window.
  const VIEW = { width: 1280, height: 512 };
  const clip = { left: 8, top: 8, width: 1264, height: 448 };
  const AREA_TOP = 180;
  const ALLOTTED = clip.top + clip.height - AREA_TOP; // 276
  const card = cornerBox("bl", SMALL_CARD, VIEW, INSETS); // top 190
  const base = { clip, card, edge: 24, paddingTop: 24, scrolls: true, minHeight: VIEW.height * 0.4 };
  const areaOf = (height: number): Box => ({ left: 8, top: AREA_TOP, width: 1264, height });

  it("leaves room to scroll the last control clear of the card", () => {
    const px = scrollGutter({ ...base, area: areaOf(ALLOTTED) });
    expect(px).toBeGreaterThan(0);
    expect(px).toBeLessThanOrEqual(ALLOTTED - 24);
  });

  it("settles on one value when its own padding makes the area taller", () => {
    // What the browser does: the padding is applied, a flex child cannot be
    // shorter than its padding, so the area grows; then it is measured again.
    let height = ALLOTTED;
    const seen: number[] = [];
    for (let pass = 0; pass < 50; pass++) {
      const px = scrollGutter({ ...base, area: areaOf(height) });
      seen.push(px);
      height = Math.max(ALLOTTED, base.paddingTop + px);
    }
    expect(new Set(seen).size).toBe(1);
    expect(height).toBe(ALLOTTED);
  });

  it("stays bounded even when it starts from an area that already ran away", () => {
    for (const height of [ALLOTTED * 2, 131_874, 1_024_861]) {
      const px = scrollGutter({ ...base, area: areaOf(height) });
      expect(px).toBeLessThanOrEqual(ALLOTTED - base.paddingTop);
      expect(scrollGutter({ ...base, area: areaOf(ALLOTTED) })).toBe(px);
    }
  });

  it("never asks for more padding than the area has room for, even with a tall card", () => {
    const tall = cornerBox("bl", { width: 340, height: 420 }, VIEW, INSETS); // top above the area
    const px = scrollGutter({ ...base, card: tall, area: areaOf(ALLOTTED) });
    expect(base.paddingTop + px).toBeLessThan(ALLOTTED);
  });

  it("gives no gutter when the card is not over the area", () => {
    expect(scrollGutter({ ...base, card: null, area: areaOf(ALLOTTED) })).toBe(0);
    const beside = { ...card, left: 2000 };
    expect(scrollGutter({ ...base, card: beside, area: areaOf(ALLOTTED) })).toBe(0);
    const below = { ...card, top: clip.top + clip.height + 1 };
    expect(scrollGutter({ ...base, card: below, area: areaOf(ALLOTTED) })).toBe(0);
  });

  it("gives no gutter to a small list box or a page that does not scroll", () => {
    expect(scrollGutter({ ...base, area: { ...areaOf(120), top: 300 } })).toBe(0);
    expect(scrollGutter({ ...base, scrolls: false, area: areaOf(ALLOTTED) })).toBe(0);
  });
});

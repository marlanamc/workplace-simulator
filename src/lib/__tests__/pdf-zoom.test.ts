import { describe, expect, it } from "vitest";
import { fitZoom, stepZoom, ZOOM_MAX, ZOOM_MIN } from "@/lib/pdf-zoom";

describe("fitZoom (Phase 3 N-9)", () => {
  it("opens a wide pane at 100%, never larger", () => {
    expect(fitZoom(1100, 56)).toBe(100);
    expect(fitZoom(872, 56)).toBe(100);
  });

  it("opens a narrow pane at the width it has, so the page is not cut at the side", () => {
    // The Reader beside the docked card at 911x512, Downloads moved above.
    const z = fitZoom(557, 32);
    expect(z).toBeLessThan(100);
    expect((8.5 * 96 * z) / 100 + 32).toBeLessThanOrEqual(557);
  });

  it("stops at the smallest readable size", () => {
    expect(fitZoom(300, 56)).toBe(ZOOM_MIN);
    expect(fitZoom(0, 56)).toBe(ZOOM_MIN);
  });
});

describe("stepZoom", () => {
  it("steps from a fitted zoom and stays inside the limits", () => {
    expect(stepZoom(64, 1)).toBe(74);
    expect(stepZoom(64, -1)).toBe(ZOOM_MIN);
    expect(stepZoom(145, 1)).toBe(ZOOM_MAX);
  });
});

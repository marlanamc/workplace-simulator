import { describe, expect, it } from "vitest";
import { visibleBox } from "@/lib/show-me-rect";

const screen = { left: 0, top: 0, right: 1366, bottom: 768 };

describe("visibleBox (Phase 3 N-8)", () => {
  it("keeps a target that is fully in view as it is", () => {
    const button = { left: 100, top: 200, right: 180, bottom: 240 };
    expect(visibleBox(button, [screen])).toEqual(button);
  });

  it("cuts a page taller than its preview pane down to the pane", () => {
    const pane = { left: 830, top: 170, right: 1330, bottom: 590 };
    const page = { left: 840, top: 180, right: 1320, bottom: 1400 };
    expect(visibleBox(page, [pane, screen])).toEqual({ left: 840, top: 180, right: 1320, bottom: 590 });
  });

  it("cuts a page scrolled sideways off the file names beside the pane", () => {
    const pane = { left: 580, top: 120, right: 890, bottom: 480 };
    const page = { left: 480, top: 130, right: 1000, bottom: 800 };
    expect(visibleBox(page, [pane, { left: 0, top: 0, right: 911, bottom: 512 }])).toEqual({ left: 580, top: 130, right: 890, bottom: 480 });
  });

  it("uses the tightest of nested panes", () => {
    const outer = { left: 0, top: 100, right: 900, bottom: 700 };
    const inner = { left: 50, top: 300, right: 800, bottom: 500 };
    expect(visibleBox({ left: 0, top: 0, right: 1000, bottom: 1000 }, [outer, inner])).toEqual({ left: 50, top: 300, right: 800, bottom: 500 });
  });

  it("returns null when none of the target is showing", () => {
    const pane = { left: 0, top: 0, right: 500, bottom: 400 };
    expect(visibleBox({ left: 0, top: 450, right: 100, bottom: 490 }, [pane])).toBeNull();
    expect(visibleBox({ left: 600, top: 10, right: 700, bottom: 50 }, [pane])).toBeNull();
  });
});

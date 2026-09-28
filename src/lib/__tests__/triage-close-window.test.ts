import { describe, expect, it } from "vitest";
import {
  CLOSE_FIRST,
  CLOSE_FLAG,
  CLOSE_LINES,
  closeStage,
  mustCloseFirst,
  stageAfterBrowserClosed,
  stageAfterRequest,
} from "@/lib/tasks/triage/close-window";
import { storyFlagKeysForTasks } from "@/lib/story-beats";

/** Wave 4, everyday recovery: Day 13's asked-for closed window. */
describe("Day 13 closed window", () => {
  it("asks for the close after the first request, whichever it is, and only once", () => {
    expect(stageAfterRequest("none", true, false)).toBe("ask");
    expect(stageAfterRequest("none", false, true)).toBe("ask");
    expect(stageAfterRequest("none", false, false)).toBe("none");
    expect(stageAfterRequest("closed", true, false)).toBe("closed");
  });

  it("counts a close only while the card asks for it, on Day 13", () => {
    expect(stageAfterBrowserClosed("triage", "ask")).toBe("closed");
    expect(stageAfterBrowserClosed("triage", "none")).toBe("none");
    expect(stageAfterBrowserClosed("make-a-copy", "ask")).toBe("ask");
  });

  it("holds the second request until the browser was closed", () => {
    expect(mustCloseFirst("ask")).toBe(true);
    expect(mustCloseFirst("closed")).toBe(false);
    expect(mustCloseFirst("none")).toBe(false);
    expect(closeStage("junk")).toBe("none");
  });

  it("is cleared when Day 13 is replayed", () => {
    expect(storyFlagKeysForTasks(["triage"])).toContain(CLOSE_FLAG);
  });

  it("has every line in both languages", () => {
    for (const line of [...Object.values(CLOSE_LINES), CLOSE_FIRST]) {
      expect(line.en).not.toBe(line.es);
      expect(line.es.trim()).not.toBe("");
    }
  });
});

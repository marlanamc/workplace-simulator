import { describe, expect, it } from "vitest";
import { bookmarkToPulse } from "@/lib/bookmark-pulse";

describe("bookmarkToPulse", () => {
  const bar = new Set(["mail", "calendar", "files"]);

  it("flashes the task's bookmark when the learner is on a New Tab", () => {
    expect(bookmarkToPulse([undefined, "calendar", "calendar"], bar, "newtab")).toBe("calendar");
  });

  it("takes the first candidate that is on the bookmarks bar", () => {
    expect(bookmarkToPulse(["portal", "mail"], bar, "newtab")).toBe("mail");
  });

  it("flashes nothing when that tab is already in front", () => {
    expect(bookmarkToPulse(["calendar"], bar, "calendar")).toBeNull();
  });

  it("flashes nothing when the bar has no bookmark for the task", () => {
    expect(bookmarkToPulse(["slides", null, undefined], bar, "newtab")).toBeNull();
  });
});

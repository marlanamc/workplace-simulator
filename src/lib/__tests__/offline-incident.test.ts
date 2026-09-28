import { describe, expect, it } from "vitest";
import {
  OFFLINE_FLAG,
  OFFLINE_GOAL,
  OFFLINE_PAGE,
  OFFLINE_STEPS,
  STILL_OFFLINE,
  WIFI_TILE,
  offlineIncidentActive,
  offlineStage,
  reloadResult,
  wifiOff,
} from "@/lib/tasks/handbook/offline";
import { storyFlagKeysForTasks } from "@/lib/story-beats";

/** Wave 4, everyday recovery: Day 7's practice Wi-Fi drop. */
describe("Day 7 offline incident", () => {
  it("runs only in Story, only while the handbook is next, until the page reloads", () => {
    expect(offlineIncidentActive("handbook", undefined, false)).toBe(true);
    expect(offlineIncidentActive("handbook", "wifi", false)).toBe(true);
    expect(offlineIncidentActive("handbook", "done", false)).toBe(false);
    expect(offlineIncidentActive("incident", undefined, false)).toBe(false);
    expect(offlineIncidentActive("account-recovery", undefined, false)).toBe(false);
    expect(offlineIncidentActive("handbook", undefined, true)).toBe(false);
  });

  it("shows Wi-Fi off only until the learner turns it on", () => {
    expect(wifiOff("handbook", undefined, false)).toBe(true);
    expect(wifiOff("handbook", "wifi", false)).toBe(false);
    expect(wifiOff("handbook", "done", false)).toBe(false);
    expect(wifiOff(null, undefined, false)).toBe(false);
  });

  it("loads the page on Reload only after the Wi-Fi is back", () => {
    expect(reloadResult(undefined)).toBe("still-offline");
    expect(reloadResult("wifi")).toBe("loaded");
    // Reloading first is not a mistake that resets anything: the stage stays put.
    expect(offlineStage(undefined)).toBe("off");
    expect(offlineStage("junk")).toBe("off");
  });

  it("is cleared when Day 7 is replayed", () => {
    expect(storyFlagKeysForTasks(["incident", "handbook"])).toContain(OFFLINE_FLAG);
  });

  it("has every line in both languages", () => {
    for (const line of [...OFFLINE_STEPS, OFFLINE_GOAL, STILL_OFFLINE]) {
      expect(line.en.trim()).not.toBe("");
      expect(line.es.trim()).not.toBe("");
      expect(line.es).not.toBe(line.en);
    }
    for (const lang of ["en", "es"] as const) {
      expect(OFFLINE_PAGE[lang].title).toBeTruthy();
      expect(OFFLINE_PAGE[lang].practice).toBeTruthy();
      expect(WIFI_TILE[lang].connectedTo).toBeTruthy();
    }
  });
});

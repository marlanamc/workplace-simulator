"use client";

import { setProgressPreset } from "@/app/actions";
import { BRIDGE_PATH_FLAG, type BridgePath } from "@/lib/bridge-path";
import { learnerKey, storage } from "@/lib/storage";
import { ACTS } from "@/lib/tracks-content";

/**
 * Studio time machine: set this account's progress to a preset, clear device
 * story state so intros re-show, and open the learner desktop.
 */
export async function jumpToPreset(
  learnerId: string,
  presetKey: string,
  path?: BridgePath,
): Promise<boolean> {
  const result = await setProgressPreset(presetKey);
  if (!result.ok) return false;
  storage.remove(learnerKey.storyFlags(learnerId));
  storage.remove(learnerKey.rungs(learnerId));
  if (path) {
    storage.setJSON(learnerKey.storyFlags(learnerId), { [BRIDGE_PATH_FLAG]: path });
  }
  // Full navigation on purpose: router.push() would keep the cached RSC
  // payload and the desktop would render the pre-rewind progress.
  // `arrive` seeds the same level-up card a real learner sees when this day
  // begins (Act intros are handled separately via cleared story flags).
  const arrive = arriveLevelKey(presetKey);
  const qs = new URLSearchParams({ from: "studio" });
  if (arrive) qs.set("arrive", arrive);
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.assign(`/?${qs.toString()}`);
  return true;
}

/** Level key for a day/preset jump; null for "all" / route-picker presets. */
export function arriveLevelKey(presetKey: string): string | null {
  if (presetKey === "all" || presetKey === "core-complete") return null;
  const colon = presetKey.indexOf(":");
  return colon === -1 ? presetKey : presetKey.slice(0, colon);
}

/**
 * Preset that lands on the first screen of an act: SimulatorWelcome for Act I,
 * ActIntro for II–VII. Bridge acts default to College (path a) so tracks resolve.
 */
export function presetForAct(actKey: string): { presetKey: string; path?: BridgePath } | null {
  const act = ACTS.find((a) => a.key === actKey);
  if (!act) return null;
  const first = act.levelKeys[0];
  if (actKey === "act5") {
    return { presetKey: `${first}:a`, path: "a" };
  }
  return { presetKey: first };
}

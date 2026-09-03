import type { TaskKey } from "@/lib/desktop-content";

/** Act V door. A learner plays one path; the other stays optional extra. */
export type BridgePath = "a" | "b";

export const BRIDGE_PATH_FLAG = "bridge-path";

/** Stored on the learner so a refresh and a Studio jump hydrate the same door. */
export const BRIDGE_PATH_BADGE_PREFIX = "bridge-path:";

export function bridgePathBadge(path: BridgePath): string {
  return `${BRIDGE_PATH_BADGE_PREFIX}${path}`;
}

export const BRIDGE_PATH_BADGES = [bridgePathBadge("a"), bridgePathBadge("b")] as const;

export function bridgePathFromBadgeKeys(badgeKeys: readonly string[]): BridgePath | null {
  if (badgeKeys.includes(bridgePathBadge("a"))) return "a";
  if (badgeKeys.includes(bridgePathBadge("b"))) return "b";
  return null;
}

export const PATH_A_TASKS: TaskKey[] = [
  "enrollment",
  "financial-aid",
  "coursework",
  "research",
];

export const PATH_B_TASKS: TaskKey[] = [
  "appointment-scheduling",
  "patient-intake",
  "billing-sheet",
  "confidentiality-call",
];

export const ACT_6_TASKS: TaskKey[] = [
  "office-drive",
  "multi-person-scheduling",
  "video-call",
  "expense-report",
  "slide-deck",
];

const PATH_A_SET = new Set<string>(PATH_A_TASKS);
const PATH_B_SET = new Set<string>(PATH_B_TASKS);
const ACT_6_SET = new Set<string>(ACT_6_TASKS);

export function isAct5Task(key: string): boolean {
  return PATH_A_SET.has(key) || PATH_B_SET.has(key);
}

export function isAct6Task(key: string): boolean {
  return ACT_6_SET.has(key);
}

export function pathOfTask(key: string): BridgePath | null {
  if (PATH_A_SET.has(key)) return "a";
  if (PATH_B_SET.has(key)) return "b";
  return null;
}

export function tasksForPath(path: BridgePath): TaskKey[] {
  return path === "a" ? PATH_A_TASKS : PATH_B_TASKS;
}

export function pathIsComplete(path: BridgePath, completedTaskKeys: readonly string[]): boolean {
  return tasksForPath(path).every((k) => completedTaskKeys.includes(k));
}

/**
 * Prefer the stored flag. If it's missing (Studio jump, older session),
 * infer from whichever Act V tasks are already done.
 */
export function inferBridgePath(
  completedTaskKeys: readonly string[],
  flag?: string | null,
): BridgePath | null {
  if (flag === "a" || flag === "b") return flag;
  if (PATH_A_TASKS.some((k) => completedTaskKeys.includes(k))) return "a";
  if (PATH_B_TASKS.some((k) => completedTaskKeys.includes(k))) return "b";
  return null;
}

export type BridgePickerKind = "choose" | "other";

export function isAct6Complete(completedTaskKeys: readonly string[]): boolean {
  return ACT_6_TASKS.every((k) => completedTaskKeys.includes(k));
}

/** After Act IV: pick a door. After one path: offer the other — until HQ is done. */
export function needsBridgePicker(
  completedTaskKeys: readonly string[],
  flag?: string | null,
): BridgePickerKind | null {
  const aDone = pathIsComplete("a", completedTaskKeys);
  const bDone = pathIsComplete("b", completedTaskKeys);
  if (aDone && bDone) return null;
  // After Act VI the other door stays in Studio / My Job, not on the Job Card.
  if (isAct6Complete(completedTaskKeys)) return null;
  const path = inferBridgePath(completedTaskKeys, flag);
  if (!path && !aDone && !bDone) return "choose";
  if (path === "a" && aDone && !bDone) return "other";
  if (path === "b" && bDone && !aDone) return "other";
  if (!path && aDone && !bDone) return "other";
  if (!path && bDone && !aDone) return "other";
  return null;
}

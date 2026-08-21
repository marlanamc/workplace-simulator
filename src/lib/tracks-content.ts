import type { AppKey, TaskKey } from "./desktop-content";

export const POINTS_PER_TASK = 100;

export interface Track {
  key: string;
  title: string;
  subtitle: string;
  taskKeys: TaskKey[];
}

export const TRACKS: Track[] = [
  {
    key: "starter",
    title: "Getting Started",
    subtitle: "Your first jobs on shift",
    taskKeys: ["mail"],
  },
  {
    key: "schedules",
    title: "Schedules & Documents",
    subtitle: "Keep the shift running smoothly",
    taskKeys: ["schedule", "timeclock", "paystub"],
  },
  {
    key: "judgment",
    title: "Judgment & Follow-Through",
    subtitle: "Handle it like a lead",
    taskKeys: ["incident", "handbook"],
  },
];

export interface TaskInfo {
  label: string;
  description: string;
  /** False for tasks the app doesn't grade yet — shown as "not built yet," not "locked." */
  built: boolean;
}

export const TASK_INFO: Record<TaskKey, TaskInfo> = {
  mail: {
    label: "Answer your supervisor",
    description: "Reply to Maria's email and attach the safety report.",
    built: true,
  },
  schedule: {
    label: "Request a shift swap",
    description: "Find a scheduling conflict and ask for a change the right way.",
    built: true,
  },
  timeclock: {
    label: "Clock out for the day",
    description: "Clock out and check that your hours look right.",
    built: true,
  },
  paystub: {
    label: "Read a pay stub",
    description: "Find your net pay and confirm the hours match.",
    built: true,
  },
  incident: {
    label: "File an incident report",
    description: "Write up what happened, in order, for your lead.",
    built: true,
  },
  handbook: {
    label: "Look something up",
    description: "Find an answer in the employee handbook under pressure.",
    built: true,
  },
};

export function findTrackForTask(taskKey: TaskKey): Track | undefined {
  return TRACKS.find((t) => t.taskKeys.includes(taskKey));
}

export function isTrackComplete(track: Track, completedTaskKeys: TaskKey[]): boolean {
  return track.taskKeys.every((k) => completedTaskKeys.includes(k));
}

/** The first track that isn't fully complete yet — where a learner should focus. */
export function activeTrack(completedTaskKeys: TaskKey[]): Track {
  return TRACKS.find((t) => !isTrackComplete(t, completedTaskKeys)) ?? TRACKS[TRACKS.length - 1];
}

/** The first not-yet-done task in a track, or null if the track is fully complete. */
export function nextTaskInTrack(track: Track, completedTaskKeys: TaskKey[]): TaskKey | null {
  return track.taskKeys.find((k) => !completedTaskKeys.includes(k)) ?? null;
}

export function allTracksComplete(completedTaskKeys: TaskKey[]): boolean {
  return TRACKS.every((t) => isTrackComplete(t, completedTaskKeys));
}

/** Where a task actually lives, so the desktop's "do this next" card can open the right thing. */
export const TASK_LOCATIONS: Record<TaskKey, { appKey: AppKey; tab?: string; ctaLabel: string }> = {
  mail: { appKey: "browser", tab: "mail", ctaLabel: "Open WorkMail" },
  schedule: { appKey: "browser", tab: "portal", ctaLabel: "Open Employee Portal" },
  timeclock: { appKey: "browser", tab: "portal", ctaLabel: "Open Employee Portal" },
  paystub: { appKey: "browser", tab: "portal", ctaLabel: "Open Employee Portal" },
  incident: { appKey: "browser", tab: "incident", ctaLabel: "Open Incident Report" },
  handbook: { appKey: "browser", tab: "handbook", ctaLabel: "Open Handbook" },
};

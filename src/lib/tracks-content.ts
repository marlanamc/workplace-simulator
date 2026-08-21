import type { AppKey, TaskKey } from "./desktop-content";

export const POINTS_PER_TASK = 100;

export interface Track {
  key: string;
  title: string;
  subtitle: string;
  taskKeys: TaskKey[];
  /** The desktop wallpaper while this is the learner's current track — a visual cue that the workspace has grown with them. */
  wallpaper: string;
}

export const TRACKS: Track[] = [
  {
    key: "starter",
    title: "Getting Started",
    subtitle: "Your first jobs on shift",
    taskKeys: ["mail"],
    wallpaper: "linear-gradient(155deg, #3f6fd1 0%, #6b7fe0 45%, #a679d8 78%, #c98fd6 100%)",
  },
  {
    key: "schedules",
    title: "Schedules & Documents",
    subtitle: "Keep the shift running smoothly",
    taskKeys: ["schedule", "timeclock", "paystub"],
    wallpaper: "linear-gradient(155deg, #1e8e7e 0%, #2fa696 42%, #5cc0ab 75%, #9adfc4 100%)",
  },
  {
    key: "judgment",
    title: "Judgment & Follow-Through",
    subtitle: "Handle it like a lead",
    taskKeys: ["incident", "handbook"],
    wallpaper: "linear-gradient(155deg, #a34a1f 0%, #c06a2f 42%, #d99248 75%, #eec27a 100%)",
  },
  {
    key: "growing",
    title: "Growing at Work",
    subtitle: "New tools that come with the promotion",
    taskKeys: ["calendar", "files", "spreadsheet"],
    wallpaper: "linear-gradient(155deg, #43266e 0%, #6d3f9e 42%, #9a5fc9 75%, #d4af65 100%)",
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
  calendar: {
    label: "Handle a meeting invite",
    description: "Spot a conflict with your schedule and propose a different time.",
    built: true,
  },
  files: {
    label: "Share a file the right way",
    description: "Find the right file in a shared drive and share it with the right access.",
    built: false,
  },
  spreadsheet: {
    label: "Read and trust a total",
    description: "Enter numbers into a shared sheet and check that the total is right.",
    built: false,
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

/**
 * Where a task actually lives, so the desktop's "do this next" card can open
 * the right thing. Only built tasks get an entry — an unbuilt next task
 * shows a "coming soon" state instead of a button.
 *
 * From Track 4 on, the card stops naming the exact tab (no `tab`, and a
 * generic ctaLabel) — a deliberate step down in hand-holding. The bookmark
 * is still right there in the Browser's tab strip; finding it is the task.
 */
export const TASK_LOCATIONS: Partial<Record<TaskKey, { appKey: AppKey; tab?: string; ctaLabel: string }>> = {
  mail: { appKey: "browser", tab: "mail", ctaLabel: "Open WorkMail" },
  schedule: { appKey: "browser", tab: "portal", ctaLabel: "Open Employee Portal" },
  timeclock: { appKey: "browser", tab: "portal", ctaLabel: "Open Employee Portal" },
  paystub: { appKey: "browser", tab: "portal", ctaLabel: "Open Employee Portal" },
  incident: { appKey: "browser", tab: "incident", ctaLabel: "Open Incident Report" },
  handbook: { appKey: "browser", tab: "handbook", ctaLabel: "Open Handbook" },
  calendar: { appKey: "browser", ctaLabel: "Open Browser" },
};

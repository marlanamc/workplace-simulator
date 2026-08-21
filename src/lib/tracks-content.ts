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
  {
    key: "growing",
    title: "Growing at Work",
    subtitle: "New tools that come with the promotion",
    taskKeys: ["calendar", "files", "spreadsheet"],
  },
];

export interface Level {
  key: string;
  title: string;
  /** Which tracks (by Track.key) belong to this level — the environment/wallpaper stays constant across all of them. */
  trackKeys: string[];
  wallpaper: string;
  /** The Browser tab to land on when a learner opens or revisits this level. */
  firstTabKey: string;
}

/**
 * A level bundles several tracks into one shared environment — one job
 * title, one moment in the story. Finishing every track in a level is what
 * moves a learner into the next one (new emails, new schedule, a new
 * wallpaper) — nothing changes between tracks *within* the same level.
 */
export const LEVELS: Level[] = [
  {
    key: "level1",
    title: "Level 1: New Hire",
    trackKeys: ["starter", "schedules", "judgment"],
    wallpaper: "linear-gradient(155deg, #3f6fd1 0%, #6b7fe0 45%, #a679d8 78%, #c98fd6 100%)",
    firstTabKey: "mail",
  },
  {
    key: "level2",
    title: "Level 2: Shift Lead",
    trackKeys: ["growing"],
    wallpaper: "linear-gradient(155deg, #43266e 0%, #6d3f9e 42%, #9a5fc9 75%, #d4af65 100%)",
    firstTabKey: "calendar",
  },
];

export function levelForTrack(trackKey: string): Level {
  return LEVELS.find((l) => l.trackKeys.includes(trackKey)) ?? LEVELS[LEVELS.length - 1];
}

/** Levels the learner has actually reached — their current level and every one before it. */
export function unlockedLevels(completedTaskKeys: TaskKey[]): Level[] {
  const currentIndex = LEVELS.findIndex((l) => l.key === levelForTrack(activeTrack(completedTaskKeys).key).key);
  return LEVELS.slice(0, currentIndex + 1);
}

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
    built: true,
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
  files: { appKey: "browser", ctaLabel: "Open Browser" },
};

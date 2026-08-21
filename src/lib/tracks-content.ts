import type { AppKey, TaskKey } from "./desktop-content";

export const POINTS_PER_TASK = 100;

export interface Track {
  key: string;
  title: string;
  subtitle: string;
  taskKeys: TaskKey[];
  /** Emoji shown in the in-game awards case for this track. */
  awardEmoji: string;
}

export const TRACKS: Track[] = [
  {
    key: "starter",
    title: "Getting Started",
    subtitle: "Your first jobs on shift",
    taskKeys: ["mail"],
    awardEmoji: "☕",
  },
  {
    key: "schedules",
    title: "Schedules & Documents",
    subtitle: "Keep the shift running well",
    taskKeys: ["schedule", "timeclock", "paystub"],
    awardEmoji: "🗓️",
  },
  {
    key: "judgment",
    title: "Think It Through",
    subtitle: "Handle it like a team lead",
    taskKeys: ["incident", "handbook"],
    awardEmoji: "🧭",
  },
  {
    key: "calendar",
    title: "The Calendar",
    subtitle: "Meetings that fit your shift",
    taskKeys: ["calendar"],
    awardEmoji: "📅",
  },
  {
    key: "files",
    title: "Shared Files",
    subtitle: "Send the right file, the right way",
    taskKeys: ["files"],
    awardEmoji: "📁",
  },
  {
    key: "spreadsheet",
    title: "The Numbers",
    subtitle: "Enter them, then check the total",
    taskKeys: ["spreadsheet"],
    awardEmoji: "📊",
  },
];

/** The celebratory "you leveled up" moment shown once, right when a learner steps into this level. */
export interface LevelUpCopy {
  emoji: string;
  kicker: string;
  title: string;
  body: string;
  cta: string;
}

export interface Level {
  key: string;
  title: string;
  /** Which tracks (by Track.key) belong to this level - the environment stays constant across all of them. */
  trackKeys: string[];
  /** The Browser tab to land on when a learner opens or revisits this level. */
  firstTabKey: string;
  /**
   * Whether this level lets the learner open/close tabs freely and starts
   * them on a blank New Tab (finding the right bookmark is the exercise).
   * Levels without this pre-open every one of their tabs and land the
   * learner directly on `firstTabKey` - no tab-hunting required yet.
   */
  freeTabbing?: boolean;
  /**
   * Copy for the level-up celebration shown when a learner finishes every
   * track in the *previous* level. Optional - a level without this doesn't
   * get a dedicated celebration moment (the wallpaper/environment still
   * changes either way).
   */
  levelUp?: LevelUpCopy;
}

/**
 * A level bundles several tracks into one shared environment - one job
 * title, one moment in the story. Finishing every track in a level is what
 * moves a learner into the next one (new emails, new schedule). The
 * desktop room stays put across every level in the same act.
 */
export const LEVELS: Level[] = [
  {
    key: "level1",
    title: "Level 1: New Hire, Day One",
    trackKeys: ["starter"],
    firstTabKey: "mail",
  },
  {
    key: "level2",
    title: "Level 2: Settling In",
    trackKeys: ["schedules"],
    firstTabKey: "portal",
    levelUp: {
      emoji: "🎉",
      kicker: "Day one: complete",
      title: "You survived Day One!",
      body: "Maria noticed. Your first email is done. Next up: your schedule, your hours, and your pay.",
      cta: "Let's keep going",
    },
  },
  {
    key: "level3",
    title: "Level 3: When Something Happens",
    trackKeys: ["judgment"],
    firstTabKey: "incident",
    levelUp: {
      emoji: "✅",
      kicker: "The portal: done",
      title: "You can run the basics now.",
      body: "You can read a schedule, clock out, and check your pay. Next, something goes wrong on the floor.",
      cta: "Keep going",
    },
  },
  {
    key: "level4",
    title: "Level 4: The Calendar",
    trackKeys: ["calendar"],
    firstTabKey: "calendar",
    freeTabbing: true,
    levelUp: {
      emoji: "⭐",
      kicker: "A new job",
      title: "You are a Shift Lead now!",
      body: "Maria saw you handle the hard calls. These tools are what a lead uses in a cafe, a store, a job site, or a front desk.",
      cta: "Let's go",
    },
  },
  {
    key: "level5",
    title: "Level 5: Shared Files",
    trackKeys: ["files"],
    firstTabKey: "files",
    freeTabbing: true,
    levelUp: {
      emoji: "📁",
      kicker: "Next tool",
      title: "Now: shared files.",
      body: "A lead sends the right file, with the right access. Same move at a cafe, a store, or a job site.",
      cta: "Keep going",
    },
  },
  {
    key: "level6",
    title: "Level 6: The Numbers",
    trackKeys: ["spreadsheet"],
    firstTabKey: "spreadsheet",
    freeTabbing: true,
    levelUp: {
      emoji: "📊",
      kicker: "Next tool",
      title: "Now: the numbers.",
      body: "Enter them. Then check the total. Do not just copy it. Leads catch mistakes.",
      cta: "Keep going",
    },
  },
];

/** A group of levels sharing one job title, story arc, and desktop place. */
export interface Act {
  key: string;
  title: string;
  levelKeys: string[];
  /** Which room the Chromebook is sitting in for this act. */
  scene: DesktopScene;
}

/** Places the learner's desktop looks out on. Built acts get a full scene; later acts reuse the closest room until they're painted. */
export type DesktopScene = "harborside-open" | "harborside-shift";

/**
 * Only lists acts that have at least one level actually built in `LEVELS` -
 * add an act's entry here as its first level ships, same incremental
 * pattern as everything else in this file. The full 7-act roadmap lives in
 * `curriculum/00-scope-and-sequence.md`.
 */
export const ACTS: Act[] = [
  { key: "act1", title: "Act I: New Hire", levelKeys: ["level1", "level2", "level3"], scene: "harborside-open" },
  { key: "act2", title: "Act II: Shift Lead", levelKeys: ["level4", "level5", "level6"], scene: "harborside-shift" },
];

export function actForLevel(level: Level): Act | undefined {
  return ACTS.find((a) => a.levelKeys.includes(level.key));
}

export function sceneForLevel(level: Level): DesktopScene {
  return actForLevel(level)?.scene ?? "harborside-open";
}

/**
 * Which level each Browser tab belongs to. Single source of truth for
 * BrowserClient's tab strip *and* for other UI (e.g. the Objectives panel)
 * that needs to know which level's checklist matches whatever tab is
 * currently open.
 */
export const TAB_LEVEL_KEYS: Record<string, string> = {
  mail: "level1",
  portal: "level2",
  incident: "level3",
  handbook: "level3",
  calendar: "level4",
  files: "level5",
  spreadsheet: "level6",
};

export function levelForTrack(trackKey: string): Level {
  return LEVELS.find((l) => l.trackKeys.includes(trackKey)) ?? LEVELS[LEVELS.length - 1];
}

export function taskKeysForLevel(level: Level): TaskKey[] {
  return level.trackKeys.flatMap((tk) => TRACKS.find((t) => t.key === tk)?.taskKeys ?? []);
}

/** Highest level the learner has reached, even if they replayed an earlier one. */
export function furthestLevelIndex(completedTaskKeys: TaskKey[]): number {
  let max = 0;
  LEVELS.forEach((level, i) => {
    if (taskKeysForLevel(level).some((k) => completedTaskKeys.includes(k))) {
      max = Math.max(max, i);
    }
    if (i > 0 && isLevelComplete(LEVELS[i - 1], completedTaskKeys)) {
      max = Math.max(max, i);
    }
  });
  return max;
}

/** Levels the learner has actually reached - their furthest level and every one before it. */
export function unlockedLevels(completedTaskKeys: TaskKey[]): Level[] {
  return LEVELS.slice(0, furthestLevelIndex(completedTaskKeys) + 1);
}

/** Whether every track in a level is fully done. */
export function isLevelComplete(level: Level, completedTaskKeys: TaskKey[]): boolean {
  return level.trackKeys.every((tk) => {
    const track = TRACKS.find((t) => t.key === tk);
    return track ? isTrackComplete(track, completedTaskKeys) : false;
  });
}

/** The level right after this one, or null if this is the last level. */
export function nextLevel(level: Level): Level | null {
  const idx = LEVELS.findIndex((l) => l.key === level.key);
  return idx >= 0 ? LEVELS[idx + 1] ?? null : null;
}

export interface TaskInfo {
  label: string;
  description: string;
  /** One-line dispatch for the desktop briefing - what just happened, not a tutorial. */
  dispatch: string;
  /** False for tasks the app doesn't grade yet - shown as "not built yet," not "locked." */
  built: boolean;
}

export const TASK_INFO: Record<TaskKey, TaskInfo> = {
  mail: {
    label: "Answer your supervisor",
    description: "Reply to Maria's email and attach the safety report.",
    dispatch: "Maria already needs something. First shift, first email.",
    built: true,
  },
  schedule: {
    label: "Request a shift swap",
    description: "Find a scheduling conflict and ask for a change the right way.",
    dispatch: "Two shifts overlap. Somebody has to swap.",
    built: true,
  },
  timeclock: {
    label: "Clock out for the day",
    description: "Clock out and check that your hours look right.",
    dispatch: "End of day. Clock out, then check the hours.",
    built: true,
  },
  paystub: {
    label: "Read a pay stub",
    description: "Find your net pay and confirm the hours match.",
    dispatch: "Payday. Make sure the numbers actually match.",
    built: true,
  },
  incident: {
    label: "File an incident report",
    description: "Write up what happened, in order, for your lead.",
    dispatch: "Someone slipped. Write it up before you forget.",
    built: true,
  },
  handbook: {
    label: "Look something up",
    description: "Find an answer in the employee handbook, even when you feel rushed.",
    dispatch: "They need an answer. The handbook is on your desk.",
    built: true,
  },
  calendar: {
    label: "Handle a meeting invite",
    description: "Spot a conflict with your schedule and propose a different time.",
    dispatch: "The meeting is at the same time as your shift. Pick a time that works.",
    built: true,
  },
  files: {
    label: "Share a file the right way",
    description: "Find the right file in a shared drive and share it with the right access.",
    dispatch: "They need the file. Share the file, not the whole folder.",
    built: true,
  },
  spreadsheet: {
    label: "Enter data and share a total",
    description: "Enter this week's numbers into a shared sheet and email the total to your lead.",
    dispatch: "This week's numbers. Total them and send it up.",
    built: true,
  },
};

export function findTrackForTask(taskKey: TaskKey): Track | undefined {
  return TRACKS.find((t) => t.taskKeys.includes(taskKey));
}

export function isTrackComplete(track: Track, completedTaskKeys: TaskKey[]): boolean {
  return track.taskKeys.every((k) => completedTaskKeys.includes(k));
}

/**
 * Act II used to be one trophy (`growing`). Learners who already earned it
 * should still see trophies after that track split into calendar / files /
 * spreadsheet.
 */
export function normalizeCertificateTrackKeys(
  keys: string[],
  completedTaskKeys: TaskKey[],
): string[] {
  const next = new Set(keys.filter((k) => k !== "growing"));
  if (keys.includes("growing")) {
    for (const task of ["calendar", "files", "spreadsheet"] as const) {
      if (completedTaskKeys.includes(task)) next.add(task);
    }
  }
  return [...next];
}

/** The first track that isn't fully complete yet - where a learner should focus. */
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
 * the right thing. Only built tasks get an entry - an unbuilt next task
 * shows a "coming soon" state instead of a button.
 *
 * From Track 4 on, the card stops naming the exact tab (no `tab`, and a
 * generic ctaLabel) - a deliberate step down in hand-holding. The bookmark
 * is still right there in the Browser's tab strip; finding it is the task.
 */
export const TASK_LOCATIONS: Partial<Record<TaskKey, { appKey: AppKey; tab?: string; ctaLabel: string }>> = {
  mail: { appKey: "browser", tab: "mail", ctaLabel: "Open Mail" },
  schedule: { appKey: "browser", tab: "portal", ctaLabel: "Open Portal" },
  timeclock: { appKey: "browser", tab: "portal", ctaLabel: "Open Portal" },
  paystub: { appKey: "browser", tab: "portal", ctaLabel: "Open Portal" },
  incident: { appKey: "browser", tab: "incident", ctaLabel: "Open Forms" },
  handbook: { appKey: "browser", tab: "handbook", ctaLabel: "Open Docs" },
  calendar: { appKey: "browser", ctaLabel: "Open Browser" },
  files: { appKey: "browser", ctaLabel: "Open Browser" },
  spreadsheet: { appKey: "browser", ctaLabel: "Open Browser" },
};

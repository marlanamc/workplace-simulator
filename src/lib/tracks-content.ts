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
    key: "orientation",
    title: "How this works",
    subtitle: "Find the lights before the shift",
    taskKeys: ["tour"],
    awardEmoji: "💡",
  },
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
  {
    key: "reporting",
    title: "Reporting In",
    subtitle: "Copy the template, then send the number",
    taskKeys: ["make-a-copy", "status-report"],
    awardEmoji: "📝",
  },
  {
    key: "triage",
    title: "Covering More Ground",
    subtitle: "Two things open. Drop neither.",
    taskKeys: ["triage"],
    awardEmoji: "🔔",
  },
  {
    key: "team-schedule",
    title: "Scheduling the Team",
    subtitle: "Write the week for the crew",
    taskKeys: ["team-schedule"],
    awardEmoji: "📋",
  },
  {
    key: "formula-check",
    title: "Weekly Numbers",
    subtitle: "Open the formula, not just the total",
    taskKeys: ["formula-check"],
    awardEmoji: "🧮",
  },
  {
    key: "team-meeting",
    title: "First Team Meeting",
    subtitle: "You call the huddle",
    taskKeys: ["team-meeting"],
    awardEmoji: "🗣️",
  },
  {
    key: "priority-call",
    title: "Under Pressure",
    subtitle: "Three things. All of them.",
    taskKeys: ["priority-call"],
    awardEmoji: "🚨",
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
    key: "level0",
    title: "Level 0: How this works",
    trackKeys: ["orientation"],
    firstTabKey: "tour",
  },
  {
    key: "level1",
    title: "Level 1: New Hire, Day One",
    trackKeys: ["starter"],
    firstTabKey: "mail",
    levelUp: {
      emoji: "👋",
      kicker: "Ready for the floor",
      title: "You know how this computer works.",
      body: "Nothing here is real. Help is the question mark. Next is the blue button. Maria already emailed you.",
      cta: "Open my first job",
    },
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
      body: "Maria saw you handle the hard calls. From here on, you open your own apps from the bookmarks bar. Start with Calendar.",
      cta: "Open Calendar from the bookmarks",
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
  {
    key: "level7",
    title: "Level 7: Reporting In",
    trackKeys: ["reporting"],
    firstTabKey: "make-a-copy",
    freeTabbing: true,
    levelUp: {
      emoji: "📝",
      kicker: "Next tool",
      title: "Now: report up.",
      body: "Maria shared a template. It is view only. Copy it. Then write the total yourself.",
      cta: "Open Sheets",
    },
  },
  {
    key: "level8",
    title: "Level 8: Covering More Ground",
    trackKeys: ["triage"],
    firstTabKey: "triage",
    freeTabbing: true,
    levelUp: {
      emoji: "🔔",
      kicker: "A new kind of day",
      title: "Two things at once.",
      body: "A meeting on your close. A file request from Sam. Handle both. Order is yours.",
      cta: "See what's open",
    },
  },
  {
    key: "level9",
    title: "Level 9: Scheduling the Team",
    trackKeys: ["team-schedule"],
    firstTabKey: "team-schedule",
    freeTabbing: true,
    levelUp: {
      emoji: "⭐",
      kicker: "A new job",
      title: "You are a Shift Supervisor now!",
      body: "You decide for the crew now, not only for yourself. Saturday close has nobody on it.",
      cta: "Open the schedule",
    },
  },
  {
    key: "level10",
    title: "Level 10: Weekly Numbers",
    trackKeys: ["formula-check"],
    firstTabKey: "formula-check",
    freeTabbing: true,
    levelUp: {
      emoji: "🧮",
      kicker: "Next up",
      title: "Now: check the week's numbers.",
      body: "The hours total looks fine. Open the formula. One range is pointing at the wrong rows.",
      cta: "Open Sheets",
    },
  },
  {
    key: "level11",
    title: "Level 11: First Team Meeting",
    trackKeys: ["team-meeting"],
    firstTabKey: "team-meeting",
    freeTabbing: true,
    levelUp: {
      emoji: "🗣️",
      kicker: "You call it now",
      title: "Lead your first huddle.",
      body: "Create the invite. Pick a time nobody is on shift. Write two or three bullets so it has a point.",
      cta: "Set it up",
    },
  },
  {
    key: "level12",
    title: "Level 12: Under Pressure",
    trackKeys: ["priority-call"],
    firstTabKey: "priority-call",
    freeTabbing: true,
    levelUp: {
      emoji: "🚨",
      kicker: "The floor is loud",
      title: "Three things at once.",
      body: "A complaint. A hole in tonight's close. A meeting on your shift. Name the first move. Then finish all three.",
      cta: "Look at all three",
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
export type DesktopScene = "harborside-open" | "harborside-shift" | "harborside-floor";

/**
 * Only lists acts that have at least one level actually built in `LEVELS` -
 * add an act's entry here as its first level ships, same incremental
 * pattern as everything else in this file. The full 7-act roadmap lives in
 * `curriculum/00-scope-and-sequence.md`.
 */
export const ACTS: Act[] = [
  { key: "act1", title: "Act I: New Hire", levelKeys: ["level0", "level1", "level2", "level3"], scene: "harborside-open" },
  { key: "act2", title: "Act II: Shift Lead", levelKeys: ["level4", "level5", "level6", "level7", "level8"], scene: "harborside-shift" },
  { key: "act3", title: "Act III: Shift Supervisor", levelKeys: ["level9", "level10", "level11", "level12"], scene: "harborside-floor" },
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
  tour: "level0",
  mail: "level1",
  portal: "level2",
  incident: "level3",
  handbook: "level3",
  calendar: "level4",
  files: "level5",
  spreadsheet: "level6",
  "make-a-copy": "level7",
  "status-report": "level7",
  triage: "level8",
  "team-schedule": "level9",
  "formula-check": "level10",
  "team-meeting": "level11",
  "priority-call": "level12",
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
  tour: {
    label: "Learn how this computer works",
    description: "Find Help, your shift list, and the Next button before the first real job.",
    dispatch: "This is a practice computer. Let's see how it works.",
    built: true,
  },
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
    description: "Find the right person's stub, then confirm net pay and hours.",
    dispatch: "Yours takes two weeks. Practice on Alex Chen's stub.",
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
  "make-a-copy": {
    label: "Copy a view-only template",
    description: "Make your own copy of Maria's status sheet so you do not change the master.",
    dispatch: "The template is view only. Copy it before you type.",
    built: true,
  },
  "status-report": {
    label: "Send a status report",
    description: "Write a SUM on your copy and cc a co-lead on the email.",
    dispatch: "Your copy is waiting. Write the total. Cc Jordan.",
    built: true,
  },
  triage: {
    label: "Handle two things at once",
    description: "A calendar conflict and a file request. Close both.",
    dispatch: "Two things are already waiting. Drop neither.",
    built: true,
  },
  "team-schedule": {
    label: "Fill Saturday close",
    description: "Build part of the week's crew schedule and cover the open shift.",
    dispatch: "Saturday close has nobody on it. Pick someone with room.",
    built: true,
  },
  "formula-check": {
    label: "Fix the hours formula",
    description: "Open the SUM, see which rows it adds, and fix the missing name.",
    dispatch: "The hours total looks fine. The formula does not.",
    built: true,
  },
  "team-meeting": {
    label: "Lead your first huddle",
    description: "Create a meeting invite and write a short agenda.",
    dispatch: "The crew needs 15 minutes on next week's schedule.",
    built: true,
  },
  "priority-call": {
    label: "Three things at once",
    description: "A complaint, a coverage gap, and a meeting on your close.",
    dispatch: "Three things just landed. Name the first move.",
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

const ORIENTATION_TRACK = "orientation";

/** True once the learner has started the actual job (not only the how-this-works tour). */
function hasStartedJob(completedTaskKeys: TaskKey[]): boolean {
  return completedTaskKeys.some((k) => k !== "tour");
}

/** The first track that isn't fully complete yet - where a learner should focus. */
export function activeTrack(completedTaskKeys: TaskKey[]): Track {
  // People who already have job progress should not be pulled back to Level 0.
  const tracks = hasStartedJob(completedTaskKeys)
    ? TRACKS.filter((t) => t.key !== ORIENTATION_TRACK)
    : TRACKS;
  return tracks.find((t) => !isTrackComplete(t, completedTaskKeys)) ?? TRACKS[TRACKS.length - 1];
}

/** The first not-yet-done task in a track, or null if the track is fully complete. */
export function nextTaskInTrack(track: Track, completedTaskKeys: TaskKey[]): TaskKey | null {
  return track.taskKeys.find((k) => !completedTaskKeys.includes(k)) ?? null;
}

export function allTracksComplete(completedTaskKeys: TaskKey[]): boolean {
  return TRACKS.every((t) => isTrackComplete(t, completedTaskKeys));
}

/** Employee Portal sub-page. Schedule, Time Clock, and Pay Stubs share one Browser tab. */
export type PortalSection = "schedule" | "timeclock" | "paystubs";

export type TaskLocation = {
  appKey: AppKey;
  tab?: string;
  section?: PortalSection;
  ctaLabel: string;
};

export type TaskHandoff = {
  taskKey: TaskKey;
  location: TaskLocation;
};

/**
 * Where a task actually lives, so the desktop's "do this next" card can open
 * the right thing. Only built tasks get an entry - an unbuilt next task
 * shows a "coming soon" state instead of a button.
 *
 * From Track 4 on, the card does not name a `tab` — the Browser opens on a
 * New Tab so finding the bookmark stays the exercise. The CTA still names
 * which bookmark to click.
 */
export const TASK_LOCATIONS: Partial<Record<TaskKey, TaskLocation>> = {
  tour: { appKey: "browser", tab: "tour", ctaLabel: "Open Welcome" },
  mail: { appKey: "browser", tab: "mail", ctaLabel: "Open Mail" },
  schedule: { appKey: "browser", tab: "portal", section: "schedule", ctaLabel: "Open Portal" },
  timeclock: { appKey: "browser", tab: "portal", section: "timeclock", ctaLabel: "Open Portal" },
  paystub: { appKey: "browser", tab: "portal", section: "paystubs", ctaLabel: "Open Portal" },
  incident: { appKey: "browser", tab: "incident", ctaLabel: "Open Forms" },
  handbook: { appKey: "browser", tab: "handbook", ctaLabel: "Open Docs" },
  calendar: { appKey: "browser", ctaLabel: "Open Calendar from the bookmarks" },
  files: { appKey: "browser", ctaLabel: "Open Drive from the bookmarks" },
  spreadsheet: { appKey: "browser", ctaLabel: "Open Sheets from the bookmarks" },
  "make-a-copy": { appKey: "browser", ctaLabel: "Open Sheets from the bookmarks" },
  "status-report": { appKey: "browser", ctaLabel: "Open Sheets from the bookmarks" },
  triage: { appKey: "browser", ctaLabel: "Open Today from the bookmarks" },
  "team-schedule": { appKey: "browser", ctaLabel: "Open Sheets from the bookmarks" },
  "formula-check": { appKey: "browser", ctaLabel: "Open Sheets from the bookmarks" },
  "team-meeting": { appKey: "browser", ctaLabel: "Open Huddle from the bookmarks" },
  "priority-call": { appKey: "browser", ctaLabel: "Open Floor from the bookmarks" },
};

/** The next built task a learner should open, or null if none is ready. */
export function nextHandoff(completedTaskKeys: TaskKey[]): TaskHandoff | null {
  const next = nextTaskInTrack(activeTrack(completedTaskKeys), completedTaskKeys);
  if (!next) return null;
  const location = TASK_LOCATIONS[next];
  if (!location) return null;
  return { taskKey: next, location };
}

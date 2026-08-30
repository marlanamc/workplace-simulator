import type { TaskKey } from "./desktop-content";
import type { Localized } from "./task-types";
import { TASK_LIST, type PortalSection, type TaskLocation } from "./tasks/registry";

export type { PortalSection, TaskLocation };

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
    taskKeys: ["mail-reply", "mail-attach"],
    awardEmoji: "☕",
  },
  {
    key: "first-week",
    title: "The First Week",
    subtitle: "Life happens on a schedule too",
    taskKeys: ["schedule"],
    awardEmoji: "🗓️",
  },
  {
    key: "payday-trouble",
    title: "Payday",
    subtitle: "Money, hours, and a normal shift",
    taskKeys: ["timeclock", "paystub", "shift-review"],
    awardEmoji: "💳",
  },
  {
    key: "mail-etiquette",
    title: "One More Thing",
    subtitle: "The shape every short work email follows",
    taskKeys: ["mail-etiquette"],
    awardEmoji: "📧",
  },
  {
    key: "sick-day",
    title: "The Sick Call",
    subtitle: "Give notice well, not just on time",
    taskKeys: ["call-out-sick"],
    awardEmoji: "🤒",
  },
  {
    key: "judgment",
    title: "Think It Through",
    subtitle: "Handle it like a team lead",
    taskKeys: ["incident", "handbook"],
    awardEmoji: "🧭",
  },
  {
    key: "account-security",
    title: "Locked Out",
    subtitle: "Get back in, the right way",
    taskKeys: ["account-recovery"],
    awardEmoji: "🔐",
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

/**
 * The celebratory "you leveled up" moment shown once, right when a learner
 * steps into this level. These are the story's chapter cards: read in order
 * they tell one arc — hired, trusted, promoted — with Maria as the
 * through-line, so no level ever feels like clicking buttons for no reason.
 */
export interface LevelUpCopy {
  emoji: string;
  kicker: Localized<string>;
  title: Localized<string>;
  body: Localized<string>;
  cta: Localized<string>;
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
  /**
   * Marks this level as deliberately harder-mode: real-world friction added
   * on purpose (a signed-out interstitial, several plausible-looking files
   * with no highlight, softer/less-frequent coaching) rather than a new
   * skill. A task component checks its own current level for this flag (the
   * same `levelForTrack(currentTrack.key)` lookup `MyJobPanel`/`ShiftBriefing`
   * already use) and swaps in its messier content variant when true - see
   * `FilesTask.tsx` for the reference implementation. Additive: a task with
   * no messy variant built yet just ignores the flag.
   */
  messy?: boolean;
  /**
   * This level introduces no new skill - it's a fresh consolidation pass
   * over these already-taught task keys (spaced practice, not a new lesson).
   * Primarily documentation for now; `level3`'s `shift-review` job is the
   * template future review levels should follow.
   */
  reviewOf?: TaskKey[];
}

/**
 * A level bundles several tracks into one shared environment - one job
 * title, one moment in the story. Finishing every track in a level is what
 * moves a learner into the next one (new emails, new schedule). The
 * desktop room stays put across every level in the same act.
 */
/**
 * Levels where the learner is still being taught the loop: desktop briefs you,
 * you do the job, you come back to the desktop. Finishing a job in one of
 * these returns to the desktop rather than jumping straight into the next app,
 * so the desktop stays a place they recognize. From level4 on — the same point
 * TASK_LOCATIONS stops naming a `tab` — we trust them and jump directly.
 */
const EARLY_LEVEL_KEYS = new Set(["level0", "level1", "level2", "level3", "level3a", "level3a2", "level3b", "level3c"]);

export function isEarlyLevel(level: Level): boolean {
  return EARLY_LEVEL_KEYS.has(level.key);
}

export const LEVELS: Level[] = [
  {
    key: "level0",
    title: "How this works",
    trackKeys: ["orientation"],
    firstTabKey: "tour",
  },
  {
    key: "level1",
    title: "Day One",
    trackKeys: ["starter"],
    // Still the Mail app - Day One is 2 jobs in the same inbox (welcome
    // thank-you, then safety report with attach). If a future build
    // splits mail into separate simulated moments, revisit this.
    firstTabKey: "mail",
    levelUp: {
      emoji: "👋",
      kicker: { en: "Ready for the floor", es: "Listo para el piso" },
      title: { en: "You know how this computer works.", es: "Ya sabes cómo funciona esta computadora." },
      body: {
        en: "Maria Delgado runs the cafe, and she already emailed you.",
        es: "Maria Delgado dirige el café, y ya te envió un correo.",
      },
      cta: { en: "Open my first task", es: "Abrir mi primera tarea" },
    },
  },
  {
    key: "level2",
    title: "The First Week",
    trackKeys: ["first-week"],
    firstTabKey: "portal",
    levelUp: {
      emoji: "🎉",
      kicker: { en: "Day one: complete", es: "Primer día: completo" },
      title: { en: "Maria noticed you.", es: "Maria se fijó en ti." },
      body: {
        en: "Your schedule is posted now.",
        es: "Tu horario ya está publicado.",
      },
      cta: { en: "See my schedule", es: "Ver mi horario" },
    },
  },
  {
    key: "level3",
    title: "Payday",
    trackKeys: ["payday-trouble"],
    firstTabKey: "portal",
    // shift-review deliberately teaches nothing new - it's a fresh pass over
    // these three already-taught jobs. Template for future review levels.
    reviewOf: ["schedule", "timeclock", "paystub"],
    levelUp: {
      emoji: "✅",
      kicker: { en: "The first week: done", es: "La primera semana: hecha" },
      title: { en: "You made it through week one.", es: "Sobreviviste la primera semana." },
      body: {
        en: "Today is payday — time to check your hours.",
        es: "Hoy es día de pago — toca revisar tus horas.",
      },
      cta: { en: "Check my pay", es: "Revisar mi pago" },
    },
  },
  {
    key: "level3a",
    title: "One More Thing",
    trackKeys: ["mail-etiquette"],
    firstTabKey: "mail",
    levelUp: {
      emoji: "📧",
      kicker: { en: "Friday afternoon", es: "Viernes por la tarde" },
      title: { en: "One more thing before you go.", es: "Una cosa más antes de irte." },
      body: {
        en: "Darnell asked you something on Day One. Maria wants you to close the loop.",
        es: "Darnell te preguntó algo el primer día. Maria quiere que le respondas.",
      },
      cta: { en: "Write to Darnell", es: "Escribirle a Darnell" },
    },
  },
  {
    key: "level3a2",
    title: "The Sick Call",
    trackKeys: ["sick-day"],
    firstTabKey: "mail",
    levelUp: {
      emoji: "🤒",
      kicker: { en: "Monday morning", es: "Lunes por la mañana" },
      title: { en: "You woke up sick.", es: "Te despertaste enfermo." },
      body: {
        en: "You're on the schedule at 10. Write Maria before your shift, not after it starts.",
        es: "Hoy tienes turno a las 10. Escríbele a Maria antes de tu turno, no después.",
      },
      cta: { en: "Write to Maria", es: "Escribirle a Maria" },
    },
  },
  {
    key: "level3b",
    title: "When Something Happens",
    trackKeys: ["judgment"],
    firstTabKey: "incident",
    levelUp: {
      emoji: "⭐",
      kicker: { en: "A promotion", es: "Un ascenso" },
      title: { en: "You are a Shift Lead now!", es: "¡Ahora eres líder de turno!" },
      body: {
        en: "New title, new pay — and someone slipped on the floor.",
        es: "Nuevo puesto, nueva paga — y alguien se resbaló en el piso.",
      },
      cta: { en: "Handle it", es: "Encargarme" },
    },
  },
  {
    key: "level3c",
    title: "Locked Out",
    trackKeys: ["account-security"],
    firstTabKey: "account-recovery",
    levelUp: {
      emoji: "🔐",
      kicker: { en: "Monday morning", es: "Lunes por la mañana" },
      title: { en: "You're locked out.", es: "Tu cuenta está bloqueada." },
      body: {
        en: "It happens to every lead — stay calm and sign back in.",
        es: "Le pasa a todo líder — con calma, vuelve a entrar.",
      },
      cta: { en: "Get back in", es: "Volver a entrar" },
    },
  },
  {
    key: "level4",
    title: "The Calendar",
    trackKeys: ["calendar"],
    firstTabKey: "calendar",
    freeTabbing: true,
    levelUp: {
      emoji: "📅",
      kicker: { en: "A lead plans ahead", es: "Un líder planea" },
      title: { en: "Maria put you on the calendar.", es: "Maria te puso en el calendario." },
      body: {
        en: "A meeting invite landed right on top of your shift.",
        es: "Llegó una invitación a reunión justo encima de tu turno.",
      },
      cta: { en: "Open Calendar from the bookmarks", es: "Abrir Calendar desde los marcadores" },
    },
  },
  {
    key: "level5",
    title: "Shared Files",
    trackKeys: ["files"],
    firstTabKey: "files",
    freeTabbing: true,
    // Messy mode's proof-of-concept lands here rather than waiting for "after
    // Act II" (the doc's looser framing) - Files is the one already-built
    // task the doc names outright ("four files look right, no highlight").
    messy: true,
    levelUp: {
      emoji: "📁",
      kicker: { en: "Monday", es: "Lunes" },
      title: { en: "Jordan starts today.", es: "Jordan empieza hoy." },
      body: {
        en: "Maria asked you to send Jordan this week's schedule.",
        es: "Maria te pidió enviarle a Jordan el horario de esta semana.",
      },
      cta: { en: "Find the file", es: "Buscar el archivo" },
    },
  },
  {
    key: "level6",
    title: "The Numbers",
    trackKeys: ["spreadsheet"],
    firstTabKey: "spreadsheet",
    freeTabbing: true,
    levelUp: {
      emoji: "📊",
      kicker: { en: "Closing time", es: "Hora de cierre" },
      title: { en: "Maria trusts you with the numbers.", es: "Maria te confía los números." },
      body: {
        en: "This week's totals are yours to enter and to check.",
        es: "Los totales de esta semana son tuyos: escríbelos y revísalos.",
      },
      cta: { en: "Open the numbers", es: "Abrir los números" },
    },
  },
  {
    key: "level7",
    title: "Reporting In",
    trackKeys: ["reporting"],
    firstTabKey: "make-a-copy",
    freeTabbing: true,
    levelUp: {
      emoji: "📝",
      kicker: { en: "Reporting up", es: "Reportar hacia arriba" },
      title: { en: "Your first report to Maria.", es: "Tu primer reporte para Maria." },
      body: {
        en: "Her template is view only, so make your own copy.",
        es: "Su plantilla es de solo ver, así que haz tu propia copia.",
      },
      cta: { en: "Open the template", es: "Abrir la plantilla" },
    },
  },
  {
    key: "level8",
    title: "Covering More Ground",
    trackKeys: ["triage"],
    firstTabKey: "triage",
    freeTabbing: true,
    levelUp: {
      emoji: "🔔",
      kicker: { en: "A real shift", es: "Un turno de verdad" },
      title: { en: "Two things at once.", es: "Dos cosas a la vez." },
      body: {
        en: "Nobody tells you which one to do first.",
        es: "Nadie te dice cuál va primero.",
      },
      cta: { en: "See what's open", es: "Ver qué hay pendiente" },
    },
  },
  {
    key: "level9",
    title: "Scheduling the Team",
    trackKeys: ["team-schedule"],
    firstTabKey: "team-schedule",
    freeTabbing: true,
    levelUp: {
      emoji: "⭐",
      kicker: { en: "A promotion", es: "Un ascenso" },
      title: { en: "You are a Shift Supervisor now!", es: "¡Ahora eres supervisor de turno!" },
      body: {
        en: "You run the crew now, and Saturday close has nobody.",
        es: "Ahora diriges al equipo, y el cierre del sábado no tiene a nadie.",
      },
      cta: { en: "Open the schedule", es: "Abrir el horario" },
    },
  },
  {
    key: "level10",
    title: "Weekly Numbers",
    trackKeys: ["formula-check"],
    firstTabKey: "formula-check",
    freeTabbing: true,
    levelUp: {
      emoji: "🧮",
      kicker: { en: "Trust, then check", es: "Confía, luego revisa" },
      title: { en: "The total looks fine. It isn't.", es: "El total se ve bien. No lo está." },
      body: {
        en: "Someone's hours got left out of the week's total.",
        es: "Las horas de alguien quedaron fuera del total de la semana.",
      },
      cta: { en: "Open the sheet", es: "Abrir la hoja" },
    },
  },
  {
    key: "level11",
    title: "First Team Meeting",
    trackKeys: ["team-meeting"],
    firstTabKey: "team-meeting",
    freeTabbing: true,
    levelUp: {
      emoji: "🗣️",
      kicker: { en: "Your meeting now", es: "Ahora es tu reunión" },
      title: { en: "You call the huddle.", es: "Tú convocas la reunión." },
      body: {
        en: "Pick a time when nobody is on shift.",
        es: "Elige una hora en que nadie esté en turno.",
      },
      cta: { en: "Set it up", es: "Organizarla" },
    },
  },
  {
    key: "level12",
    title: "Under Pressure",
    trackKeys: ["priority-call"],
    firstTabKey: "priority-call",
    freeTabbing: true,
    levelUp: {
      emoji: "🚨",
      kicker: { en: "The floor is loud", es: "El piso está a tope" },
      title: { en: "Three things at once.", es: "Tres cosas a la vez." },
      body: {
        en: "Breathe, name the first move, then finish all three.",
        es: "Respira, di cuál va primero, y termina las tres.",
      },
      cta: { en: "Look at all three", es: "Ver las tres" },
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
  { key: "act1", title: "Act I: New Hire", levelKeys: ["level0", "level1", "level2", "level3", "level3a", "level3a2"], scene: "harborside-open" },
  { key: "act2", title: "Act II: Shift Lead", levelKeys: ["level3b", "level3c", "level4", "level5", "level6", "level7", "level8"], scene: "harborside-shift" },
  { key: "act3", title: "Act III: Shift Supervisor", levelKeys: ["level9", "level10", "level11", "level12"], scene: "harborside-floor" },
];

export function actForLevel(level: Level): Act | undefined {
  return ACTS.find((a) => a.levelKeys.includes(level.key));
}

export function sceneForLevel(level: Level): DesktopScene {
  return actForLevel(level)?.scene ?? "harborside-open";
}

export { TAB_LEVEL_KEYS } from "./tabs";

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

/**
 * The completions a learner would have at the MOMENT a level begins: every
 * task from every earlier level, none from this one or later. Powers the
 * Studio progress presets — one test account teleporting to any point in
 * the game. Returns [] for an unknown level key (a fresh account).
 */
export function taskKeysBeforeLevel(levelKey: string): TaskKey[] {
  const idx = LEVELS.findIndex((l) => l.key === levelKey);
  if (idx <= 0) return [];
  return LEVELS.slice(0, idx).flatMap(taskKeysForLevel);
}

/** Track keys fully finished before a level begins — the certificates that preset should hold. */
export function trackKeysBeforeLevel(levelKey: string): string[] {
  const idx = LEVELS.findIndex((l) => l.key === levelKey);
  if (idx <= 0) return [];
  return LEVELS.slice(0, idx).flatMap((l) => l.trackKeys);
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
  label: Localized<string>;
  /** One-line dispatch for the desktop briefing - what just happened, not a tutorial. */
  dispatch: Localized<string>;
  /** False for tasks the app doesn't grade yet - shown as "not built yet," not "locked." */
  built: boolean;
}

/**
 * Label + dispatch + built flag per task, derived from the task registry
 * (`src/lib/tasks/registry.ts`). Kept as a named export because several
 * screens read `TASK_INFO[key].label` / `.dispatch` directly.
 */
export const TASK_INFO: Record<TaskKey, TaskInfo> = Object.fromEntries(
  TASK_LIST.map((d) => [d.key, { label: d.label, dispatch: d.dispatch, built: d.built }]),
) as Record<TaskKey, TaskInfo>;

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

/** One "stop" per task, in curriculum order - the path bar the home screen and My Job panel both show. */
export interface PathStop {
  taskKey: TaskKey;
  color: string;
}

/**
 * Colors a stop by where the learner stands relative to it: done (green),
 * the very next task (amber - "in progress"), everything else (muted).
 * Shared by ShiftBriefing and MyJobPanel so the path bar is drawn once.
 */
export function pathStops(completedTaskKeys: TaskKey[]): PathStop[] {
  const allTaskKeys = LEVELS.flatMap(taskKeysForLevel);
  const nextKey = allTaskKeys.find((k) => !completedTaskKeys.includes(k));
  return allTaskKeys.map((taskKey) => ({
    taskKey,
    color: completedTaskKeys.includes(taskKey)
      ? "var(--success)"
      : taskKey === nextKey
        ? "var(--warning)"
        : "var(--border)",
  }));
}

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
export const TASK_LOCATIONS: Partial<Record<TaskKey, TaskLocation>> = Object.fromEntries(
  TASK_LIST.flatMap((d) => (d.location ? [[d.key, d.location] as const] : [])),
);

/** The next built task a learner should open, or null if none is ready. */
export function nextHandoff(completedTaskKeys: TaskKey[]): TaskHandoff | null {
  const next = nextTaskInTrack(activeTrack(completedTaskKeys), completedTaskKeys);
  if (!next) return null;
  const location = TASK_LOCATIONS[next];
  if (!location) return null;
  return { taskKey: next, location };
}

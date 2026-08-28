import type { AppKey, TaskKey } from "./desktop-content";
import type { Localized } from "./task-types";

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
    taskKeys: ["schedule", "swap-request", "call-out-sick"],
    awardEmoji: "🗓️",
  },
  {
    key: "payday-trouble",
    title: "Payday & Trouble",
    subtitle: "Money, hours, and a normal shift",
    taskKeys: ["timeclock", "paystub", "shift-review"],
    awardEmoji: "💳",
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
const EARLY_LEVEL_KEYS = new Set(["level0", "level1", "level2", "level3", "level3b", "level3c"]);

export function isEarlyLevel(level: Level): boolean {
  return EARLY_LEVEL_KEYS.has(level.key);
}

export const LEVELS: Level[] = [
  {
    key: "level0",
    title: "Level 0: How this works",
    trackKeys: ["orientation"],
    firstTabKey: "tour",
  },
  {
    key: "level1",
    title: "Level 1: Day One",
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
        en: "Your manager is Maria Delgado — she runs the cafe, and she already emailed you your first job. Remember: the ? is Help, and next is always the blue button.",
        es: "Tu gerente es Maria Delgado — ella dirige el café, y ya te envió tu primer trabajo por correo. Recuerda: el ? es Ayuda, y lo siguiente siempre es el botón azul.",
      },
      cta: { en: "Open my first job", es: "Abrir mi primer trabajo" },
    },
  },
  {
    key: "level2",
    title: "Level 2: The First Week",
    trackKeys: ["first-week"],
    firstTabKey: "portal",
    levelUp: {
      emoji: "🎉",
      kicker: { en: "Day one: complete", es: "Primer día: completo" },
      title: { en: "Maria noticed you.", es: "Maria se fijó en ti." },
      body: {
        en: "You thanked Maria and sent the file she needed. Your schedule is posted now. This week, things come up on it: a swap to ask for, and a day you can't come in.",
        es: "Le agradeciste a Maria y le enviaste el archivo que necesitaba. Tu horario ya está publicado. Esta semana pasan cosas en él: un cambio que pedir, y un día en que no puedes ir.",
      },
      cta: { en: "See my schedule", es: "Ver mi horario" },
    },
  },
  {
    key: "level3",
    title: "Level 3: Payday & Trouble",
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
        en: "You read the schedule, fixed a swap, and spoke up when you couldn't come in. Today is payday — time to check your hours and your money. Nobody checks them for you.",
        es: "Leíste el horario, arreglaste un cambio, y avisaste cuando no podías ir. Hoy es día de pago — toca revisar tus horas y tu dinero. Nadie los revisa por ti.",
      },
      cta: { en: "Check my pay", es: "Revisar mi pago" },
    },
  },
  {
    key: "level3b",
    title: "Level 3b: When Something Happens",
    trackKeys: ["judgment"],
    firstTabKey: "incident",
    levelUp: {
      emoji: "⭐",
      kicker: { en: "A promotion", es: "Un ascenso" },
      title: { en: "You are a Shift Lead now!", es: "¡Ahora eres líder de turno!" },
      body: {
        en: "Maria saw how you handled your first weeks — new title, new pay. And the job changes right away: someone slipped on the floor this morning, and the lead writes it up.",
        es: "Maria vio cómo manejaste tus primeras semanas — nuevo puesto, nueva paga. Y el trabajo cambia de inmediato: alguien se resbaló esta mañana, y el líder lo escribe.",
      },
      cta: { en: "Handle it", es: "Encargarme" },
    },
  },
  {
    key: "level3c",
    title: "Level 3c: Locked Out",
    trackKeys: ["account-security"],
    firstTabKey: "account-recovery",
    levelUp: {
      emoji: "🔐",
      kicker: { en: "Monday morning", es: "Lunes por la mañana" },
      title: { en: "You're locked out.", es: "Tu cuenta está bloqueada." },
      body: {
        en: "It happens to every lead eventually. Stay calm, sign back in — and be careful: not every email with a \"code\" in it is real.",
        es: "Le pasa a todo líder tarde o temprano. Con calma, vuelve a entrar — y ojo: no todo correo con un \"código\" es real.",
      },
      cta: { en: "Get back in", es: "Volver a entrar" },
    },
  },
  {
    key: "level4",
    title: "Level 4: The Calendar",
    trackKeys: ["calendar"],
    firstTabKey: "calendar",
    freeTabbing: true,
    levelUp: {
      emoji: "📅",
      kicker: { en: "A lead plans ahead", es: "Un líder planea" },
      title: { en: "Maria put you on the calendar.", es: "Maria te puso en el calendario." },
      body: {
        en: "Leads plan their week instead of just working it. A meeting invite just landed — right on top of your shift. From now on, you open your own apps from the bookmarks bar.",
        es: "Los líderes planean su semana, no solo la trabajan. Acaba de llegar una invitación a reunión — justo encima de tu turno. Desde ahora, abres tus propias apps desde la barra de marcadores.",
      },
      cta: { en: "Open Calendar from the bookmarks", es: "Abrir Calendar desde los marcadores" },
    },
  },
  {
    key: "level5",
    title: "Level 5: Shared Files",
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
        en: "A new hire — and this time, you're the one helping them land. Maria asked you to send Jordan this week's schedule. The right file, with the right access.",
        es: "Alguien nuevo — y esta vez, tú eres quien lo recibe. Maria te pidió enviarle a Jordan el horario de esta semana. El archivo correcto, con el acceso correcto.",
      },
      cta: { en: "Find the file", es: "Buscar el archivo" },
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
      kicker: { en: "Closing time", es: "Hora de cierre" },
      title: { en: "Maria trusts you with the numbers.", es: "Maria te confía los números." },
      body: {
        en: "This week's totals are yours now. Enter them, then check the total yourself — don't just trust the machine. Leads catch mistakes before they travel.",
        es: "Los totales de esta semana son tuyos. Escríbelos y revisa el total tú mismo — no le creas todo a la máquina. Los líderes atrapan errores antes de que viajen.",
      },
      cta: { en: "Open the numbers", es: "Abrir los números" },
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
      kicker: { en: "Reporting up", es: "Reportar hacia arriba" },
      title: { en: "Your first report to Maria.", es: "Tu primer reporte para Maria." },
      body: {
        en: "Maria shared her status template with you. It's view only on purpose — make your own copy first, then write the total yourself and send it up.",
        es: "Maria compartió su plantilla de reporte contigo. Es de solo ver a propósito — primero haz tu propia copia, luego escribe el total tú mismo y envíalo.",
      },
      cta: { en: "Open the template", es: "Abrir la plantilla" },
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
      kicker: { en: "A real shift", es: "Un turno de verdad" },
      title: { en: "Two things at once.", es: "Dos cosas a la vez." },
      body: {
        en: "A meeting landed on your close, and Sam needs a file. Nobody tells you which to do first — deciding the order is the job now.",
        es: "Una reunión cayó sobre tu cierre, y Sam necesita un archivo. Nadie te dice cuál va primero — decidir el orden ya es parte del trabajo.",
      },
      cta: { en: "See what's open", es: "Ver qué hay pendiente" },
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
      kicker: { en: "A promotion", es: "Un ascenso" },
      title: { en: "You are a Shift Supervisor now!", es: "¡Ahora eres supervisor de turno!" },
      body: {
        en: "Maria moved up to run two cafes — and she picked you to run this floor's crew. You decide for the team now, not only for yourself. First problem: Saturday close has nobody on it.",
        es: "Maria subió a dirigir dos cafés — y te eligió a ti para dirigir el equipo de este piso. Ahora decides por el equipo, no solo por ti. Primer problema: el cierre del sábado no tiene a nadie.",
      },
      cta: { en: "Open the schedule", es: "Abrir el horario" },
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
      kicker: { en: "Trust, then check", es: "Confía, luego revisa" },
      title: { en: "The total looks fine. It isn't.", es: "El total se ve bien. No lo está." },
      body: {
        en: "A supervisor reads the formula, not just the number. Someone's hours got left out of the week's total — open the formula and find who.",
        es: "Un supervisor lee la fórmula, no solo el número. Las horas de alguien quedaron fuera del total de la semana — abre la fórmula y descubre de quién.",
      },
      cta: { en: "Open the sheet", es: "Abrir la hoja" },
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
      kicker: { en: "Your meeting now", es: "Ahora es tu reunión" },
      title: { en: "You call the huddle.", es: "Tú convocas la reunión." },
      body: {
        en: "The crew needs 15 minutes on next week's schedule — and calling that meeting is your job now. Pick a time nobody is on shift, and give it a point.",
        es: "El equipo necesita 15 minutos para el horario de la próxima semana — y convocar esa reunión ahora te toca a ti. Elige una hora en que nadie esté en turno, y dale un propósito.",
      },
      cta: { en: "Set it up", es: "Organizarla" },
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
      kicker: { en: "The floor is loud", es: "El piso está a tope" },
      title: { en: "Three things at once.", es: "Tres cosas a la vez." },
      body: {
        en: "A customer complaint. A hole in tonight's close. A meeting on your shift. Breathe, name the first move — then finish all three. This is the day the job was building toward.",
        es: "Una queja de un cliente. Un hueco en el cierre de hoy. Una reunión sobre tu turno. Respira, decide el primer paso — y termina las tres. Este es el día para el que el trabajo te preparaba.",
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
  { key: "act1", title: "Act I: New Hire", levelKeys: ["level0", "level1", "level2", "level3"], scene: "harborside-open" },
  { key: "act2", title: "Act II: Shift Lead", levelKeys: ["level3b", "level3c", "level4", "level5", "level6", "level7", "level8"], scene: "harborside-shift" },
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
  incident: "level3b",
  handbook: "level3b",
  "account-recovery": "level3c",
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

export const TASK_INFO: Record<TaskKey, TaskInfo> = {
  tour: {
    label: { en: "Learn how this computer works", es: "Aprende cómo funciona esta computadora" },
    dispatch: {
      en: "This is a practice computer. Let's see how it works.",
      es: "Esta es una computadora de práctica. Veamos cómo funciona.",
    },
    built: true,
  },
  mail: {
    label: { en: "Answer your supervisor", es: "Contesta a tu supervisora" },
    dispatch: {
      en: "Maria already needs something. First shift, first email.",
      es: "Maria ya necesita algo. Primer turno, primer correo.",
    },
    built: true,
  },
  "mail-read": {
    label: { en: "Read your supervisor's email", es: "Lee el correo de tu supervisora" },
    dispatch: {
      en: "Maria already needs something. Find it and read it.",
      es: "Maria ya necesita algo. Encuéntralo y léelo.",
    },
    built: true,
  },
  "mail-reply": {
    label: { en: "Thank your manager", es: "Agradece a tu gerente" },
    dispatch: {
      en: "Maria says welcome. Write her a short thank-you.",
      es: "Maria te da la bienvenida. Escríbele un agradecimiento corto.",
    },
    built: true,
  },
  "mail-attach": {
    label: { en: "Send the report with the file", es: "Envía el reporte con el archivo" },
    dispatch: {
      en: "Maria needs the July safety report. Read what she asks, then attach it.",
      es: "Maria necesita el reporte de julio. Lee qué pide y adjúntalo.",
    },
    built: true,
  },
  schedule: {
    label: { en: "Find your shift", es: "Encuentra tu turno" },
    dispatch: {
      en: "New week. Find where you're on the schedule.",
      es: "Semana nueva. Encuentra dónde estás en el horario.",
    },
    built: true,
  },
  "swap-request": {
    label: { en: "Ask for a shift swap", es: "Pide un cambio de turno" },
    dispatch: {
      en: "Two shifts overlap. Somebody has to swap.",
      es: "Dos turnos chocan. Alguien tiene que cambiar.",
    },
    built: true,
  },
  "call-out-sick": {
    label: { en: "Tell Maria you can't come in", es: "Dile a Maria que no puedes ir" },
    dispatch: {
      en: "You're sick tomorrow. Tell Maria before your shift.",
      es: "Estás enfermo mañana. Avísale a Maria antes de tu turno.",
    },
    built: true,
  },
  timeclock: {
    label: { en: "Clock out for the day", es: "Marca tu salida del día" },
    dispatch: {
      en: "End of day. Clock out, then check the hours.",
      es: "Fin del día. Marca la salida y revisa las horas.",
    },
    built: true,
  },
  paystub: {
    label: { en: "Read a pay stub", es: "Lee un talón de pago" },
    dispatch: {
      en: "Yours takes two weeks. Practice on Alex Chen's stub.",
      es: "El tuyo tarda dos semanas. Practica con el de Alex Chen.",
    },
    built: true,
  },
  "shift-review": {
    label: { en: "A normal shift", es: "Un turno normal" },
    dispatch: {
      en: "A normal shift. Nothing new - just do the job.",
      es: "Un turno normal. Nada nuevo: solo haz el trabajo.",
    },
    built: true,
  },
  "account-recovery": {
    label: { en: "Get back into a locked account", es: "Recupera una cuenta bloqueada" },
    dispatch: {
      en: "You're signed out. Get back in before your shift.",
      es: "Tu sesión se cerró. Vuelve a entrar antes de tu turno.",
    },
    built: true,
  },
  incident: {
    label: { en: "File an incident report", es: "Llena un reporte de incidente" },
    dispatch: {
      en: "Someone slipped. Write it up before you forget.",
      es: "Alguien se resbaló. Escríbelo antes de que se te olvide.",
    },
    built: true,
  },
  handbook: {
    label: { en: "Look something up", es: "Busca una respuesta" },
    dispatch: {
      en: "They need an answer. The handbook is on your desk.",
      es: "Necesitan una respuesta. El manual está en tu escritorio.",
    },
    built: true,
  },
  calendar: {
    label: { en: "Handle a meeting invite", es: "Maneja una invitación a reunión" },
    dispatch: {
      en: "The meeting is at the same time as your shift. Pick a time that works.",
      es: "La reunión es a la misma hora que tu turno. Elige una hora que funcione.",
    },
    built: true,
  },
  files: {
    label: { en: "Share a file the right way", es: "Comparte un archivo de la forma correcta" },
    dispatch: {
      en: "They need the file. Share the file, not the whole folder.",
      es: "Necesitan el archivo. Comparte el archivo, no toda la carpeta.",
    },
    built: true,
  },
  spreadsheet: {
    label: { en: "Enter data and share a total", es: "Escribe los números y envía el total" },
    dispatch: {
      en: "This week's numbers. Total them and send it up.",
      es: "Los números de esta semana. Súmalos y envía el total.",
    },
    built: true,
  },
  "make-a-copy": {
    label: { en: "Copy a view-only template", es: "Copia una plantilla de solo ver" },
    dispatch: {
      en: "The template is view only. Copy it before you type.",
      es: "La plantilla es de solo ver. Cópiala antes de escribir.",
    },
    built: true,
  },
  "status-report": {
    label: { en: "Send a status report", es: "Envía un reporte de avance" },
    dispatch: {
      en: "Your copy is waiting. Write the total. Cc Jordan.",
      es: "Tu copia está lista. Escribe el total. Pon a Jordan en Cc.",
    },
    built: true,
  },
  triage: {
    label: { en: "Handle two things at once", es: "Maneja dos cosas a la vez" },
    dispatch: {
      en: "Two things are already waiting. Drop neither.",
      es: "Dos cosas ya están esperando. No dejes caer ninguna.",
    },
    built: true,
  },
  "team-schedule": {
    label: { en: "Fill Saturday close", es: "Cubre el cierre del sábado" },
    dispatch: {
      en: "Saturday close has nobody on it. Pick someone with room.",
      es: "El cierre del sábado no tiene a nadie. Elige a alguien con espacio.",
    },
    built: true,
  },
  "formula-check": {
    label: { en: "Fix the hours formula", es: "Arregla la fórmula de horas" },
    dispatch: {
      en: "The hours total looks fine. The formula does not.",
      es: "El total de horas se ve bien. La fórmula no.",
    },
    built: true,
  },
  "team-meeting": {
    label: { en: "Lead your first huddle", es: "Dirige tu primera reunión de equipo" },
    dispatch: {
      en: "The crew needs 15 minutes on next week's schedule.",
      es: "El equipo necesita 15 minutos para el horario de la próxima semana.",
    },
    built: true,
  },
  "priority-call": {
    label: { en: "Three things at once", es: "Tres cosas a la vez" },
    dispatch: {
      en: "Three things just landed. Name the first move.",
      es: "Tres cosas acaban de llegar. Decide el primer paso.",
    },
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

/** Employee Portal sub-page. Schedule, Time Clock, and Pay Stubs share one Browser tab. */
export type PortalSection = "schedule" | "timeclock" | "paystubs" | "swap-request" | "call-out-sick" | "shift-review";

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
  "mail-read": { appKey: "browser", tab: "mail", ctaLabel: "Open Mail" },
  "mail-reply": { appKey: "browser", tab: "mail", ctaLabel: "Open Mail" },
  "mail-attach": { appKey: "browser", tab: "mail", ctaLabel: "Open Mail" },
  schedule: { appKey: "browser", tab: "portal", section: "schedule", ctaLabel: "Open Portal" },
  "swap-request": { appKey: "browser", tab: "portal", section: "swap-request", ctaLabel: "Open Portal" },
  "call-out-sick": { appKey: "browser", tab: "portal", section: "call-out-sick", ctaLabel: "Open Portal" },
  timeclock: { appKey: "browser", tab: "portal", section: "timeclock", ctaLabel: "Open Portal" },
  paystub: { appKey: "browser", tab: "portal", section: "paystubs", ctaLabel: "Open Portal" },
  "shift-review": { appKey: "browser", tab: "portal", section: "shift-review", ctaLabel: "Open Portal" },
  "account-recovery": { appKey: "browser", tab: "account-recovery", ctaLabel: "Open Sign In" },
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

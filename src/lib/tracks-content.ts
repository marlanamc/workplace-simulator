import type { TaskKey } from "./desktop-content";
import type { Localized } from "./task-types";
import { TASK_LIST, type PortalSection, type TaskLocation } from "./tasks/registry";
import {
  inferBridgePath,
  isAct5Task,
  isAct6Task,
  isAct7Task,
  isAct6Complete,
  pathOfTask,
  pathIsComplete,
  type BridgePath,
} from "./bridge-path";

export type { BridgePath };

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
  {
    key: "college-offer",
    title: "An Offer",
    subtitle: "Read it, accept it, make it fit",
    taskKeys: ["college-offer"],
    awardEmoji: "🎓",
  },
  {
    key: "budget-sheet",
    title: "The Budget",
    subtitle: "Read the IF, then the chart",
    taskKeys: ["budget-sheet"],
    awardEmoji: "📈",
  },
  {
    key: "reply-all",
    title: "Reply-All",
    subtitle: "Who actually needs this",
    taskKeys: ["reply-all"],
    awardEmoji: "📬",
  },
  {
    key: "enrollment",
    title: "Getting Ready",
    subtitle: "Find the deadline. Then apply.",
    taskKeys: ["enrollment"],
    awardEmoji: "🏫",
  },
  {
    key: "appointment-scheduling",
    title: "Getting Ready",
    subtitle: "Book the visit without a clash",
    taskKeys: ["appointment-scheduling"],
    awardEmoji: "🗓️",
  },
  {
    key: "financial-aid",
    title: "The Paperwork",
    subtitle: "Find the amount and the date",
    taskKeys: ["financial-aid"],
    awardEmoji: "📄",
  },
  {
    key: "patient-intake",
    title: "The Paperwork",
    subtitle: "File it. Do not overshare.",
    taskKeys: ["patient-intake"],
    awardEmoji: "🩺",
  },
  {
    key: "coursework",
    title: "Staying On Top of It",
    subtitle: "Read the syllabus. Submit on time.",
    taskKeys: ["coursework"],
    awardEmoji: "📚",
  },
  {
    key: "billing-sheet",
    title: "Staying On Top of It",
    subtitle: "Match the code to the charge",
    taskKeys: ["billing-sheet"],
    awardEmoji: "💵",
  },
  {
    key: "research",
    title: "Finding a Real Answer",
    subtitle: "Cite the source that holds up",
    taskKeys: ["research"],
    awardEmoji: "🔎",
  },
  {
    key: "confidentiality-call",
    title: "Finding a Real Answer",
    subtitle: "Stay polite. Do not confirm.",
    taskKeys: ["confidentiality-call"],
    awardEmoji: "📞",
  },
  {
    key: "office-drive",
    title: "Welcome to HQ",
    subtitle: "Find the current file. Then share it.",
    taskKeys: ["office-drive"],
    awardEmoji: "🏢",
  },
  {
    key: "get-everyone-in-the-room",
    title: "Get Everyone in the Room",
    subtitle: "Find a time. Then join the meeting.",
    taskKeys: ["multi-person-scheduling", "video-call"],
    awardEmoji: "🤝",
  },
  {
    key: "expense-report",
    title: "The Expense Report",
    subtitle: "Match the receipts. Flag what is missing.",
    taskKeys: ["expense-report"],
    awardEmoji: "🧾",
  },
  {
    key: "slide-deck",
    title: "Presenting to the Team",
    subtitle: "Three slides. One real number.",
    taskKeys: ["slide-deck"],
    awardEmoji: "📊",
  },
  {
    key: "meeting-minutes",
    title: "Run the Meeting",
    subtitle: "Agenda, notes, follow-up — the whole loop",
    taskKeys: ["meeting-minutes"],
    awardEmoji: "📋",
  },
  {
    key: "performance-review",
    title: "The Review",
    subtitle: "One strength, one area to grow",
    taskKeys: ["performance-review"],
    awardEmoji: "📝",
  },
  {
    key: "ops-report-packet",
    title: "Put It All Together",
    subtitle: "Every app, one packet",
    taskKeys: ["ops-report-packet"],
    awardEmoji: "📦",
  },
  {
    key: "portfolio-reflection",
    title: "Where You've Been",
    subtitle: "Look back at the whole program",
    taskKeys: ["portfolio-reflection"],
    awardEmoji: "🎓",
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
  /** When true, clocking out is the primary action — for natural session end points. */
  stoppingPoint?: boolean;
}

export interface Level {
  key: string;
  title: string;
  /** Which tracks (by Track.key) belong to this level - the environment stays constant across all of them. */
  trackKeys: string[];
  /** The Browser tab to land on when a learner opens or revisits this level. */
  firstTabKey: string;
  /**
   * Act V: this level lists both path tracks. Completion and Job Card
   * counts use only the chosen door. `firstTabKey` stays the Path A tab
   * for the integrity check; `pathFirstTab` picks the real landing tab.
   */
  pathTracks?: { a: string; b: string };
  pathFirstTab?: { a: string; b: string };
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
        en: "You replied and sent the report. Clock out for today — your progress is saved. Next time you sign in, your schedule will be waiting.",
        es: "Respondiste y enviaste el reporte. Marca salida por hoy — tu progreso está guardado. La próxima vez que entres, tu horario estará aquí.",
      },
      cta: { en: "See my schedule", es: "Ver mi horario" },
      stoppingPoint: true,
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
      emoji: "💳",
      kicker: { en: "Payday", es: "Día de pago" },
      title: { en: "You can check hours and pay.", es: "Ya puedes revisar horas y pago." },
      body: {
        en: "That is what a new hire has to do. One more thing before you go — Darnell is waiting.",
        es: "Eso es lo que tiene que hacer un empleado nuevo. Una cosa más antes de irte — Darnell te espera.",
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
        es: "Los totales de esta semana te toca escribirlos y revisarlos a ti.",
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
      kicker: { en: "Reporting up", es: "Informar a tu jefa" },
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
      kicker: { en: "It's busy on the floor", es: "Hay mucho movimiento" },
      title: { en: "Three things at once.", es: "Tres cosas a la vez." },
      body: {
        en: "Breathe. Say which one you'll do first, then finish all three.",
        es: "Respira. Di cuál vas a hacer primero, y luego termina las tres.",
      },
      cta: { en: "Look at all three", es: "Ver las tres" },
    },
  },
  {
    key: "level13",
    title: "An Offer",
    trackKeys: ["college-offer"],
    firstTabKey: "college-offer",
    freeTabbing: true,
    levelUp: {
      emoji: "🎓",
      kicker: { en: "A promotion", es: "Un ascenso" },
      title: { en: "You are an Assistant Manager now!", es: "¡Ahora eres asistente de gerencia!" },
      body: {
        en: "Harborside will pay for a class. Read the offer, then make it fit your week.",
        es: "Harborside pagará una clase. Lee la oferta y haz que quepa en tu semana.",
      },
      cta: { en: "Read the offer", es: "Leer la oferta" },
    },
  },
  {
    key: "level14",
    title: "The Budget",
    trackKeys: ["budget-sheet"],
    firstTabKey: "budget-sheet",
    freeTabbing: true,
    levelUp: {
      emoji: "📈",
      kicker: { en: "The numbers have a story", es: "Los números cuentan algo" },
      title: { en: "One category is over.", es: "Una categoría se pasó." },
      body: {
        en: "Open the formula. Then look at the chart. They should say the same thing.",
        es: "Abre la fórmula. Luego mira el gráfico. Deben decir lo mismo.",
      },
      cta: { en: "Open the sheet", es: "Abrir la hoja" },
    },
  },
  {
    key: "level15",
    title: "Reply-All",
    trackKeys: ["reply-all"],
    firstTabKey: "mail",
    freeTabbing: true,
    levelUp: {
      emoji: "📬",
      kicker: { en: "HQ is on the thread", es: "HQ está en el hilo" },
      title: { en: "Not everyone needs your answer.", es: "No todos necesitan tu respuesta." },
      body: {
        en: "Read the whole thread. Reply to the person who asked — not the whole list.",
        es: "Lee todo el hilo. Responde a quien preguntó — no a toda la lista.",
      },
      cta: { en: "Open Mail", es: "Abrir correo" },
    },
  },
  {
    key: "level16",
    title: "Getting Ready",
    trackKeys: ["enrollment", "appointment-scheduling"],
    firstTabKey: "college-portal",
    pathTracks: { a: "enrollment", b: "appointment-scheduling" },
    pathFirstTab: { a: "college-portal", b: "front-desk" },
    freeTabbing: true,
    levelUp: {
      emoji: "🚪",
      kicker: { en: "A new door", es: "Una puerta nueva" },
      title: { en: "College, or the front desk.", es: "Universidad, o la recepción." },
      body: {
        en: "Pick one. You can come back for the other later.",
        es: "Elige una. Puedes volver a la otra después.",
      },
      cta: { en: "Pick a door", es: "Elige una puerta" },
    },
  },
  {
    key: "level17",
    title: "The Paperwork",
    trackKeys: ["financial-aid", "patient-intake"],
    firstTabKey: "college-portal",
    pathTracks: { a: "financial-aid", b: "patient-intake" },
    pathFirstTab: { a: "college-portal", b: "front-desk" },
    freeTabbing: true,
    levelUp: {
      emoji: "📋",
      kicker: { en: "The paper has the answer", es: "El papel tiene la respuesta" },
      title: { en: "Read it before you file it.", es: "Léelo antes de archivarlo." },
      body: {
        en: "The number and the deadline are on the page. So is who is allowed to see it.",
        es: "El número y la fecha están en la página. También quién puede verlo.",
      },
      cta: { en: "Open the paperwork", es: "Abrir el papeleo" },
    },
  },
  {
    key: "level18",
    title: "Staying On Top of It",
    trackKeys: ["coursework", "billing-sheet"],
    firstTabKey: "coursework",
    pathTracks: { a: "coursework", b: "billing-sheet" },
    pathFirstTab: { a: "coursework", b: "billing-sheet" },
    freeTabbing: true,
    levelUp: {
      emoji: "⏰",
      kicker: { en: "The date matters", es: "La fecha importa" },
      title: { en: "Check it. Then send it.", es: "Revísalo. Luego envíalo." },
      body: {
        en: "Both a due date and a wrong charge need someone who checks twice before they act.",
        es: "Tanto una fecha de entrega como un cargo equivocado necesitan a alguien que revise dos veces antes de actuar.",
      },
      cta: { en: "Open today's work", es: "Abrir el trabajo de hoy" },
    },
  },
  {
    key: "level19",
    title: "Finding a Real Answer",
    trackKeys: ["research", "confidentiality-call"],
    firstTabKey: "library",
    pathTracks: { a: "research", b: "confidentiality-call" },
    pathFirstTab: { a: "library", b: "front-desk" },
    freeTabbing: true,
    levelUp: {
      emoji: "🔎",
      kicker: { en: "Use your judgment, don't guess", es: "Usa tu criterio, no adivines" },
      title: { en: "The one that sounds right is the hard one.", es: "El que suena bien es el difícil." },
      body: {
        en: "Cite a source you can trust. Do not confirm anything you cannot check.",
        es: "Cita una fuente en la que puedas confiar. No confirmes nada que no puedas comprobar.",
      },
      cta: { en: "Do the last job", es: "Haz el último trabajo" },
    },
  },
  {
    key: "level20",
    title: "Welcome to HQ",
    trackKeys: ["office-drive"],
    firstTabKey: "files",
    freeTabbing: true,
    levelUp: {
      emoji: "🏢",
      kicker: { en: "A different building", es: "Otro edificio" },
      title: { en: "Welcome to HQ.", es: "Bienvenida a HQ." },
      body: {
        en: "The drive is bigger here. Search first, then read the file name twice. Share the current file, not last quarter's.",
        es: "Aquí el drive es más grande. Busca primero, luego lee el nombre del archivo dos veces. Comparte el archivo actual, no el del trimestre pasado.",
      },
      cta: { en: "Open Drive", es: "Abrir Drive" },
    },
  },
  {
    key: "level21",
    title: "Get Everyone in the Room",
    trackKeys: ["get-everyone-in-the-room"],
    firstTabKey: "calendar",
    freeTabbing: true,
    levelUp: {
      emoji: "🤝",
      kicker: { en: "Four calendars", es: "Cuatro calendarios" },
      title: { en: "Find the time that is open for everyone.", es: "Encuentra la hora que está libre para todos." },
      body: {
        en: "Then join the meeting you just booked. Keep your mic off and ask your question in the chat.",
        es: "Luego únete a la reunión que acabas de agendar. Deja el micrófono apagado y haz tu pregunta en el chat.",
      },
      cta: { en: "Open Calendar", es: "Abrir Calendar" },
    },
  },
  {
    key: "level22",
    title: "The Expense Report",
    trackKeys: ["expense-report"],
    firstTabKey: "expense-report",
    freeTabbing: true,
    levelUp: {
      emoji: "🧾",
      kicker: { en: "Do not submit it blind", es: "No lo envíes sin revisar" },
      title: { en: "One row has no receipt.", es: "Una fila no tiene recibo." },
      body: {
        en: "Match the rows you can. Flag the one that is missing a receipt. That is the whole task.",
        es: "Empareja las filas que puedas. Marca la que no tiene recibo. Esa es toda la tarea.",
      },
      cta: { en: "Open the sheet", es: "Abrir la hoja" },
    },
  },
  {
    key: "level23",
    title: "Presenting to the Team",
    trackKeys: ["slide-deck"],
    firstTabKey: "slides",
    freeTabbing: true,
    levelUp: {
      emoji: "📊",
      kicker: { en: "Three slides", es: "Tres diapositivas" },
      title: { en: "A title, a number, a takeaway.", es: "Un título, un número, una idea." },
      body: {
        en: "Use the expense total that is already on the slide. Present it. Do not add a fourth slide.",
        es: "Usa el total de gastos que ya está en la diapositiva. Preséntalo. No agregues una cuarta diapositiva.",
      },
      cta: { en: "Open Slides", es: "Abrir Diapositivas" },
    },
  },
  {
    key: "level24",
    title: "Run the Meeting",
    trackKeys: ["meeting-minutes"],
    firstTabKey: "meeting-minutes",
    freeTabbing: true,
    levelUp: {
      emoji: "⭐",
      kicker: { en: "A promotion", es: "Un ascenso" },
      title: { en: "You are a Team Lead now!", es: "¡Ahora eres Team Lead!" },
      body: {
        en: "New title, and for the first time you run the room instead of just showing up. There is a meeting this morning — it is yours to run.",
        es: "Nuevo puesto, y por primera vez tú diriges la sala en vez de solo asistir. Hay una reunión esta mañana — te toca dirigirla.",
      },
      cta: { en: "Start the agenda", es: "Empezar la agenda" },
    },
  },
  {
    key: "level25",
    title: "The Review",
    trackKeys: ["performance-review"],
    firstTabKey: "performance-review",
    freeTabbing: true,
    levelUp: {
      emoji: "📝",
      kicker: { en: "Feedback is part of the job now", es: "Dar retroalimentación ahora es parte del trabajo" },
      title: { en: "One of your team is up for review.", es: "Toca la evaluación de alguien de tu equipo." },
      body: {
        en: "Read their month. Name one real strength and one real area to grow — honest, and kind at the same time.",
        es: "Lee cómo les fue este mes. Nombra una fortaleza real y un área real para mejorar — con honestidad y con amabilidad a la vez.",
      },
      cta: { en: "Open the review", es: "Abrir la evaluación" },
    },
  },
  {
    key: "level26",
    title: "Put It All Together",
    trackKeys: ["ops-report-packet"],
    firstTabKey: "ops-report-packet",
    freeTabbing: true,
    levelUp: {
      emoji: "📦",
      kicker: { en: "Everything at once", es: "Todo a la vez" },
      title: { en: "The full weekly report is yours this week.", es: "El reporte semanal completo te toca esta semana." },
      body: {
        en: "A number from Sheets, a note from Calendar, a short write-up in Docs, sent as one packet. Nothing new — just every piece together.",
        es: "Un número de Sheets, una nota de Calendar, un resumen corto en Docs, enviado como un solo paquete. Nada nuevo — solo todas las piezas juntas.",
      },
      cta: { en: "Open the numbers", es: "Abrir los números" },
    },
  },
  {
    key: "level27",
    title: "Where You've Been",
    trackKeys: ["portfolio-reflection"],
    firstTabKey: "portfolio-reflection",
    freeTabbing: true,
    levelUp: {
      emoji: "🎓",
      kicker: { en: "The whole way here", es: "Todo el camino hasta aquí" },
      title: { en: "Look at everything you can do now.", es: "Mira todo lo que ya puedes hacer." },
      body: {
        en: "From answering one email on day one to running a full weekly report as a Team Lead. Take a few minutes to look back and write it down.",
        es: "Desde contestar un correo el primer día hasta hacer un reporte semanal completo como Team Lead. Tómate unos minutos para mirar atrás y escribirlo.",
      },
      cta: { en: "Look back", es: "Mirar atrás" },
      stoppingPoint: true,
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
  { key: "act4", title: "Act IV: Assistant Manager", levelKeys: ["level13", "level14", "level15"], scene: "harborside-floor" },
  { key: "act5", title: "Act V: Bridge", levelKeys: ["level16", "level17", "level18", "level19"], scene: "harborside-floor" },
  { key: "act6", title: "Act VI: Office Administrator", levelKeys: ["level20", "level21", "level22", "level23"], scene: "harborside-floor" },
  { key: "act7", title: "Act VII: Team Lead", levelKeys: ["level24", "level25", "level26", "level27"], scene: "harborside-floor" },
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

export function taskKeysForLevel(level: Level, path?: BridgePath | null): TaskKey[] {
  const keys = path && level.pathTracks ? [level.pathTracks[path]] : level.trackKeys;
  return keys.flatMap((tk) => TRACKS.find((t) => t.key === tk)?.taskKeys ?? []);
}

export function firstTabForLevel(level: Level, path?: BridgePath | null): string {
  if (path && level.pathFirstTab) return level.pathFirstTab[path];
  return level.firstTabKey;
}

/** Highest level the learner has reached, even if they replayed an earlier one. */
export function furthestLevelIndex(completedTaskKeys: TaskKey[], path?: BridgePath | null): number {
  const inferred = path ?? inferBridgePath(completedTaskKeys);
  let max = 0;
  LEVELS.forEach((level, i) => {
    if (taskKeysForLevel(level, inferred).some((k) => completedTaskKeys.includes(k))) {
      max = Math.max(max, i);
    }
    if (i > 0 && isLevelComplete(LEVELS[i - 1], completedTaskKeys, inferred)) {
      max = Math.max(max, i);
    }
  });
  return max;
}

/** Levels the learner has actually reached - their furthest level and every one before it. */
export function unlockedLevels(completedTaskKeys: TaskKey[], path?: BridgePath | null): Level[] {
  return LEVELS.slice(0, furthestLevelIndex(completedTaskKeys, path) + 1);
}

/**
 * The completions a learner would have at the MOMENT a level begins: every
 * task from every earlier level, none from this one or later. Powers the
 * Studio progress presets — one test account teleporting to any point in
 * the game. Returns [] for an unknown level key (a fresh account).
 */
export function taskKeysBeforeLevel(levelKey: string, path?: BridgePath | null): TaskKey[] {
  const idx = LEVELS.findIndex((l) => l.key === levelKey);
  if (idx <= 0) return [];
  return LEVELS.slice(0, idx).flatMap((l) => taskKeysForLevel(l, path));
}

/** Track keys fully finished before a level begins — the certificates that preset should hold. */
export function trackKeysBeforeLevel(levelKey: string, path?: BridgePath | null): string[] {
  const idx = LEVELS.findIndex((l) => l.key === levelKey);
  if (idx <= 0) return [];
  return LEVELS.slice(0, idx).flatMap((l) => (path && l.pathTracks ? [l.pathTracks[path]] : l.trackKeys));
}

/** Whether the relevant tracks in a level are fully done. */
export function isLevelComplete(
  level: Level,
  completedTaskKeys: TaskKey[],
  path?: BridgePath | null,
): boolean {
  const inferred = path ?? inferBridgePath(completedTaskKeys);
  if (level.pathTracks && !inferred) return false;
  const keys = inferred && level.pathTracks ? [level.pathTracks[inferred]] : level.trackKeys;
  return keys.every((tk) => {
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
 * The learner's earned trophies, grouped by act in curriculum order — for a
 * "look back at everything you've done" view. `portfolio-reflection` and the
 * awards case both need the same derivation. Only acts with at least one
 * earned track are returned.
 */
export function earnedAwardsByAct(
  certificateTrackKeys: readonly string[],
): { act: Act; tracks: Track[] }[] {
  const earned = new Set(certificateTrackKeys);
  return ACTS.map((act) => {
    const trackKeys: string[] = [];
    for (const levelKey of act.levelKeys) {
      const level = LEVELS.find((l) => l.key === levelKey);
      if (!level) continue;
      const keys = level.pathTracks
        ? [level.pathTracks.a, level.pathTracks.b]
        : level.trackKeys;
      for (const tk of keys) {
        if (!trackKeys.includes(tk)) trackKeys.push(tk);
      }
    }
    const tracks = trackKeys
      .map((tk) => TRACKS.find((t) => t.key === tk))
      .filter((t): t is Track => Boolean(t) && earned.has(t!.key));
    return { act, tracks };
  }).filter((row) => row.tracks.length > 0);
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
export function activeTrack(completedTaskKeys: TaskKey[], path?: BridgePath | null): Track {
  // People who already have job progress should not be pulled back to Level 0.
  const inferred = path ?? inferBridgePath(completedTaskKeys);
  let tracks = hasStartedJob(completedTaskKeys)
    ? TRACKS.filter((t) => t.key !== ORIENTATION_TRACK)
    : TRACKS;
  if (inferred) {
    tracks = tracks.filter((t) => {
      const taskPath = t.taskKeys[0] ? pathOfTask(t.taskKeys[0]) : null;
      return !taskPath || taskPath === inferred;
    });
    // The office path is linear: Act V door, then HQ (Act VI), then Team Lead
    // (Act VII). HQ waits until one Act V door is finished; Act VII waits until
    // HQ is finished.
    if (!pathIsComplete(inferred, completedTaskKeys)) {
      tracks = tracks.filter((t) => !t.taskKeys.some((k) => isAct6Task(k) || isAct7Task(k)));
    } else if (!isAct6Complete(completedTaskKeys)) {
      tracks = tracks.filter((t) => !t.taskKeys.some((k) => isAct7Task(k)));
    }
  } else {
    tracks = tracks.filter((t) => !t.taskKeys.some((k) => isAct5Task(k) || isAct6Task(k) || isAct7Task(k)));
  }
  return tracks.find((t) => !isTrackComplete(t, completedTaskKeys)) ?? tracks.at(-1) ?? TRACKS[TRACKS.length - 1];
}

/** The first not-yet-done task in a track, or null if the track is fully complete. */
export function nextTaskInTrack(track: Track, completedTaskKeys: TaskKey[]): TaskKey | null {
  return track.taskKeys.find((k) => !completedTaskKeys.includes(k)) ?? null;
}

export function allTracksComplete(completedTaskKeys: TaskKey[]): boolean {
  // Act VII (Team Lead) is the optional office-path capstone — the curriculum
  // is complete and honest at the end of Act VI, so it does not gate the
  // all-done state. The "do this next" button still walks through it.
  const trunk = TRACKS.filter((t) => !t.taskKeys.some((k) => isAct5Task(k) || isAct7Task(k)));
  if (!trunk.every((t) => isTrackComplete(t, completedTaskKeys))) return false;
  return pathIsComplete("a", completedTaskKeys) || pathIsComplete("b", completedTaskKeys);
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
export function pathStops(completedTaskKeys: TaskKey[], path?: BridgePath | null): PathStop[] {
  const inferred = path ?? inferBridgePath(completedTaskKeys);
  const allTaskKeys = LEVELS.flatMap((l) => taskKeysForLevel(l, inferred));
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
export function nextHandoff(completedTaskKeys: TaskKey[], path?: BridgePath | null): TaskHandoff | null {
  const next = nextTaskInTrack(activeTrack(completedTaskKeys, path), completedTaskKeys);
  if (!next) return null;
  const location = TASK_LOCATIONS[next];
  if (!location) return null;
  return { taskKey: next, location };
}

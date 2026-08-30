import type { AppKey, TaskKey } from "@/lib/desktop-content";
import type { Localized } from "@/lib/task-types";

/**
 * The task registry — one entry per task, one place to edit.
 *
 * Every per-task fact a screen needs (its label, the story beat it lands on,
 * the bookmark it opens, the "do this next" button copy, the named skill on
 * its badge) lives here. The older lookup tables — `TASK_INFO`,
 * `TASK_LOCATIONS`, `SKILLS`, `BOOKMARK_LABEL`, `HANDOFF_CTA`, `SHIFT_MOMENT`,
 * `JOB_CARD_LINE` — are now thin views derived from this record, so adding a
 * task means adding one `TASKS` entry, not touching six files that
 * `content-integrity.test.ts` then scolds you for missing.
 *
 * Keep this file data-only: no React, no imports from `tracks-content` (which
 * imports *this*). Types shared with the level spine (`TaskLocation`,
 * `PortalSection`) live here and are re-exported from `tracks-content`.
 */

/** Employee Portal sub-page. Schedule, Time Clock, and Pay Stubs share one Browser tab. */
export type PortalSection = "schedule" | "timeclock" | "paystubs" | "swap-request" | "shift-review";

export type TaskLocation = {
  appKey: AppKey;
  tab?: string;
  section?: PortalSection;
  ctaLabel: string;
};

export interface TaskDescriptor {
  key: TaskKey;
  /** False for tasks the app doesn't grade yet — shown as "not built yet," not "locked." */
  built: boolean;
  /**
   * True for keys kept only so a learner's historical DB row stays a valid
   * completion. No Level or Track routes here; the reachable-task checks in
   * `content-integrity.test.ts` skip them (they come from `TRACKS`).
   */
  retired?: boolean;
  /** Task name shown in menus, the desktop task list, and the Job Card header. */
  label: Localized;
  /** One-line dispatch for the desktop briefing — what just happened, not a tutorial. */
  dispatch: Localized;
  /** The named skill shown on this task's own done-screen badge (see `firstPersonSkill`). */
  skill: string;
  /** Bookmark-bar label for this task's home — matches BrowserClient's tab definitions. */
  bookmarkLabel: string;
  /**
   * Done-screen "Next" button copy, keyed by the task it opens. Act I names
   * the place; Act II+ names the bookmark, since finding it on the bar stays
   * the exercise.
   */
  handoffCta: Localized;
  /**
   * One line of clock time for the desktop briefing — the story, not the
   * skill. Time only ever moves forward: read top to bottom these are the
   * days of the learner's employment in order. `story-coherence.test.ts`
   * enforces the weekday ordering.
   */
  shiftMoment: Localized;
  /**
   * Where the task actually lives, so the desktop's "do this next" card can
   * open the right thing. Omit for a task that isn't built yet — the card
   * shows a "coming soon" state instead of a button. From Act II on the
   * `tab` is dropped so the Browser opens on a New Tab and finding the
   * bookmark stays the exercise.
   */
  location?: TaskLocation;
  /** Short Job Card instruction line (under six words). Falls back to `dispatch`. */
  jobCardLine?: Localized;
  /** The Job Card's green finish line. Falls back to the generic done copy. */
  jobCardDoneLine?: Localized;
}

const browser = (ctaLabel: string, tab?: string, section?: PortalSection): TaskLocation => ({
  appKey: "browser",
  ...(tab ? { tab } : {}),
  ...(section ? { section } : {}),
  ctaLabel,
});

export const TASKS: Record<TaskKey, TaskDescriptor> = {
  tour: {
    key: "tour",
    built: true,
    label: { en: "Learn how this computer works", es: "Aprende cómo funciona esta computadora" },
    dispatch: {
      en: "This is a practice computer. Let's see how it works.",
      es: "Esta es una computadora de práctica. Veamos cómo funciona.",
    },
    skill: "Find Help, your shift list, and Next",
    bookmarkLabel: "Welcome",
    handoffCta: { en: "Open the Web Browser", es: "Abrir el navegador web" },
    shiftMoment: { en: "Before the shift. Take a minute.", es: "Antes del turno. Tómate un minuto." },
    location: browser("Open the Web Browser", "tour"),
    jobCardLine: { en: "Look around this computer.", es: "Conoce esta computadora." },
  },

  // Retired: the old bundled Day-One task (find + reply + attach in one job).
  // Day One now asks for the three granular jobs below instead.
  mail: {
    key: "mail",
    built: true,
    retired: true,
    label: { en: "Answer your supervisor", es: "Contesta a tu supervisora" },
    dispatch: {
      en: "Maria already needs something. First shift, first email.",
      es: "Maria ya necesita algo. Primer turno, primer correo.",
    },
    skill: "Reply with an attachment",
    bookmarkLabel: "Mail",
    handoffCta: { en: "Open Mail", es: "Abrir correo" },
    shiftMoment: { en: "Tuesday, 8:14 AM. First shift.", es: "Martes, 8:14 AM. Primer turno." },
    location: browser("Open Mail", "mail"),
  },

  // Retired: split into mail-reply / mail-attach.
  "mail-read": {
    key: "mail-read",
    built: true,
    retired: true,
    label: { en: "Read your supervisor's email", es: "Lee el correo de tu supervisora" },
    dispatch: {
      en: "Maria already needs something. Find it and read it.",
      es: "Maria ya necesita algo. Encuéntralo y léelo.",
    },
    skill: "Find and read a message from a manager",
    bookmarkLabel: "Mail",
    handoffCta: { en: "Open Mail", es: "Abrir correo" },
    shiftMoment: { en: "Tuesday, 8:14 AM. First shift.", es: "Martes, 8:14 AM. Primer turno." },
    location: browser("Open Mail", "mail"),
  },

  "mail-reply": {
    key: "mail-reply",
    built: true,
    label: { en: "Thank your manager", es: "Agradece a tu gerente" },
    dispatch: {
      en: "Maria says welcome. Write her a short thank-you.",
      es: "Maria te da la bienvenida. Escríbele un agradecimiento corto.",
    },
    skill: "Write a short thank-you to my manager",
    bookmarkLabel: "Mail",
    handoffCta: { en: "Open Mail", es: "Abrir correo" },
    shiftMoment: {
      en: "Tuesday, 8:14 AM. Maria says welcome.",
      es: "Martes, 8:14 AM. Maria te da la bienvenida.",
    },
    location: browser("Open Mail", "mail"),
    jobCardLine: { en: "Maria said welcome. Write her back.", es: "Maria te dio la bienvenida. Contéstale." },
    jobCardDoneLine: { en: "Sent. One task left.", es: "Enviado. Queda una tarea." },
  },

  "mail-attach": {
    key: "mail-attach",
    built: true,
    label: { en: "Send the report with the file", es: "Envía el reporte con el archivo" },
    dispatch: {
      en: "Maria needs the July safety report. Read what she asks, then attach it.",
      es: "Maria necesita el reporte de julio. Lee qué pide y adjúntalo.",
    },
    skill: "Send a reply with a file attached",
    bookmarkLabel: "Mail",
    handoffCta: { en: "Next: Send the report", es: "Siguiente: Envía el reporte" },
    shiftMoment: { en: "Tuesday, 8:20 AM. She needs a file.", es: "Martes, 8:20 AM. Necesita un archivo." },
    location: browser("Open Mail", "mail"),
    jobCardLine: { en: "Maria needs the July safety report.", es: "Maria necesita el reporte de julio." },
    jobCardDoneLine: { en: "Sent, with the file.", es: "Enviado, con el archivo." },
  },

  schedule: {
    key: "schedule",
    built: true,
    label: { en: "Ask for a shift swap", es: "Pide un cambio de turno" },
    dispatch: {
      en: "New week. Check your shifts against your own calendar.",
      es: "Semana nueva. Compara tus turnos con tu propio calendario.",
    },
    skill: "Find a shift conflict and ask for a swap",
    bookmarkLabel: "Portal",
    handoffCta: { en: "Next: Open Portal", es: "Siguiente: Abrir Portal" },
    shiftMoment: {
      en: "Wednesday morning. Next week is posted.",
      es: "Miércoles por la mañana. Ya está la próxima semana.",
    },
    location: browser("Open Portal", "portal", "schedule"),
  },

  // Retired: folded into `schedule` — finding the clash and asking for the
  // swap are one task now.
  "swap-request": {
    key: "swap-request",
    built: true,
    retired: true,
    label: { en: "Ask for a shift swap", es: "Pide un cambio de turno" },
    dispatch: {
      en: "Two shifts overlap. Somebody has to swap.",
      es: "Dos turnos chocan. Alguien tiene que cambiar.",
    },
    skill: "Ask for a shift swap in writing",
    bookmarkLabel: "Portal",
    handoffCta: { en: "Next: Ask for a swap", es: "Siguiente: Pide un cambio" },
    shiftMoment: {
      en: "Wednesday, 9:30 AM. Two shifts overlap.",
      es: "Miércoles, 9:30 AM. Dos turnos se cruzan.",
    },
    location: browser("Open Portal", "portal", "swap-request"),
  },

  timeclock: {
    key: "timeclock",
    built: true,
    label: { en: "Clock out for the day", es: "Marca tu salida del día" },
    dispatch: {
      en: "End of day. Clock out, then check the hours.",
      es: "Fin del día. Marca la salida y revisa las horas.",
    },
    skill: "Check your hours and speak up",
    bookmarkLabel: "Portal",
    handoffCta: { en: "Next: Clock out", es: "Siguiente: Marcar salida" },
    shiftMoment: { en: "Friday, end of shift.", es: "Viernes, fin del turno." },
    location: browser("Open Portal", "portal", "timeclock"),
  },

  paystub: {
    key: "paystub",
    built: true,
    label: { en: "Read a pay stub", es: "Lee un talón de pago" },
    dispatch: {
      en: "Yours takes two weeks. Practice on Alex Chen's stub.",
      es: "El tuyo tarda dos semanas. Practica con el de Alex Chen.",
    },
    skill: "Read a pay stub",
    bookmarkLabel: "Portal",
    handoffCta: { en: "Next: Check a pay stub", es: "Siguiente: Revisar un recibo" },
    shiftMoment: {
      en: "Friday, 5:40 PM. Payday for the crew.",
      es: "Viernes, 5:40 PM. Día de pago del equipo.",
    },
    location: browser("Open Portal", "portal", "paystubs"),
  },

  "shift-review": {
    key: "shift-review",
    built: true,
    label: { en: "A normal shift", es: "Un turno normal" },
    dispatch: {
      en: "A normal shift. Nothing new - just do the job.",
      es: "Un turno normal. Nada nuevo: solo haz el trabajo.",
    },
    skill: "Handle a normal shift, start to finish",
    bookmarkLabel: "Portal",
    handoffCta: { en: "Next: A normal shift", es: "Siguiente: Un turno normal" },
    shiftMoment: { en: "Friday, 6 PM. One last walk-through.", es: "Viernes, 6 PM. Un último repaso." },
    location: browser("Open Portal", "portal", "shift-review"),
  },

  "mail-etiquette": {
    key: "mail-etiquette",
    built: true,
    label: { en: "Write to a coworker", es: "Escríbele a un compañero" },
    dispatch: {
      en: "Before you go, close the loop with Darnell.",
      es: "Antes de irte, respóndele a Darnell.",
    },
    skill: "Write a work email that gets straight to the point",
    bookmarkLabel: "Mail",
    handoffCta: { en: "Next: Write to Darnell", es: "Siguiente: Escríbele a Darnell" },
    shiftMoment: {
      en: "Friday, 6:20 PM. One more thing before you go.",
      es: "Viernes, 6:20 PM. Una cosa más antes de irte.",
    },
    location: browser("Open Mail", "mail"),
  },

  "call-out-sick": {
    key: "call-out-sick",
    built: true,
    label: { en: "Tell Maria you can't come in", es: "Dile a Maria que no puedes ir" },
    dispatch: {
      en: "You're sick and you're on at 10. Write Maria now.",
      es: "Estás enfermo y entras a las 10. Escríbele a Maria ya.",
    },
    skill: "Tell my manager I can't come in",
    bookmarkLabel: "Mail",
    handoffCta: { en: "Next: Tell Maria", es: "Siguiente: Avísale a Maria" },
    shiftMoment: { en: "Monday, 6:12 AM. You feel sick.", es: "Lunes, 6:12 AM. Te sientes mal." },
    location: browser("Open Mail", "mail"),
  },

  "account-recovery": {
    key: "account-recovery",
    built: true,
    label: { en: "Get back into a locked account", es: "Recupera una cuenta bloqueada" },
    dispatch: {
      en: "You're signed out. Get back in before your shift.",
      es: "Tu sesión se cerró. Vuelve a entrar antes de tu turno.",
    },
    skill: "Get back into a locked account",
    bookmarkLabel: "Sign In",
    handoffCta: { en: "Next: Sign back in", es: "Siguiente: Vuelve a entrar" },
    shiftMoment: {
      en: "Wednesday morning. You're signed out.",
      es: "Miércoles por la mañana. Cerraste sesión.",
    },
    location: browser("Open Sign In", "account-recovery"),
  },

  incident: {
    key: "incident",
    built: true,
    label: { en: "File an incident report", es: "Llena un reporte de incidente" },
    dispatch: {
      en: "Someone slipped. Write it up before you forget.",
      es: "Alguien se resbaló. Escríbelo antes de que se te olvide.",
    },
    skill: "Write an incident report",
    bookmarkLabel: "Forms",
    handoffCta: { en: "Next: Open Forms", es: "Siguiente: Abrir Formularios" },
    shiftMoment: { en: "Tuesday. The floor is busy.", es: "Martes. El piso está lleno." },
    location: browser("Open Forms", "incident"),
  },

  handbook: {
    key: "handbook",
    built: true,
    label: { en: "Look something up", es: "Busca una respuesta" },
    dispatch: {
      en: "They need an answer. The handbook is on your desk.",
      es: "Necesitan una respuesta. El manual está en tu escritorio.",
    },
    skill: "Look something up when you feel rushed",
    bookmarkLabel: "Docs",
    handoffCta: { en: "Next: Open Docs", es: "Siguiente: Abrir Docs" },
    shiftMoment: { en: "Tuesday night.", es: "Martes por la noche." },
    location: browser("Open Docs", "handbook"),
  },

  calendar: {
    key: "calendar",
    built: true,
    label: { en: "Handle a meeting invite", es: "Maneja una invitación a reunión" },
    dispatch: {
      en: "The meeting is at the same time as your shift. Pick a time that works.",
      es: "La reunión es a la misma hora que tu turno. Elige una hora que funcione.",
    },
    skill: "Handle a meeting invite the right way",
    bookmarkLabel: "Calendar",
    handoffCta: {
      en: "Open Calendar from the bookmarks",
      es: "Abre Calendar en los marcadores",
    },
    shiftMoment: { en: "Next week. You are a lead now.", es: "La semana que viene. Ya eres líder." },
    location: browser("Open Calendar from the bookmarks"),
  },

  files: {
    key: "files",
    built: true,
    label: { en: "Share a file the right way", es: "Comparte un archivo de la forma correcta" },
    dispatch: {
      en: "They need the file. Share the file, not the whole folder.",
      es: "Necesitan el archivo. Comparte el archivo, no toda la carpeta.",
    },
    skill: "Share a file with the right access",
    bookmarkLabel: "Drive",
    handoffCta: { en: "Open Drive from the bookmarks", es: "Abre Drive en los marcadores" },
    shiftMoment: {
      en: "Monday morning. Jordan starts today.",
      es: "Lunes por la mañana. Jordan empieza hoy.",
    },
    location: browser("Open Drive from the bookmarks"),
  },

  spreadsheet: {
    key: "spreadsheet",
    built: true,
    label: { en: "Enter data and share a total", es: "Escribe los números y envía el total" },
    dispatch: {
      en: "This week's numbers. Total them and send it up.",
      es: "Los números de esta semana. Súmalos y envía el total.",
    },
    skill: "Read and trust a spreadsheet total",
    bookmarkLabel: "Sheets",
    handoffCta: { en: "Open Sheets from the bookmarks", es: "Abre Sheets en los marcadores" },
    shiftMoment: {
      en: "Friday afternoon. Counts are due.",
      es: "Viernes por la tarde. Hay que entregar las cuentas.",
    },
    location: browser("Open Sheets from the bookmarks"),
  },

  "make-a-copy": {
    key: "make-a-copy",
    built: true,
    label: { en: "Copy a view-only template", es: "Copia una plantilla de solo ver" },
    dispatch: {
      en: "The template is view only. Copy it before you type.",
      es: "La plantilla es de solo ver. Cópiala antes de escribir.",
    },
    skill: "Copy a view-only file before you type",
    bookmarkLabel: "Sheets",
    handoffCta: { en: "Open Sheets from the bookmarks", es: "Abre Sheets en los marcadores" },
    shiftMoment: { en: "Monday. Maria shared a template.", es: "Lunes. Maria compartió una plantilla." },
    location: browser("Open Sheets from the bookmarks"),
  },

  "status-report": {
    key: "status-report",
    built: true,
    label: { en: "Send a status report", es: "Envía un reporte de avance" },
    dispatch: {
      en: "Your copy is waiting. Write the total. Cc Jordan.",
      es: "Tu copia está lista. Escribe el total. Pon a Jordan en Cc.",
    },
    skill: "Write a SUM and cc a co-lead",
    bookmarkLabel: "Sheets",
    handoffCta: { en: "Open Sheets from the bookmarks", es: "Abre Sheets en los marcadores" },
    shiftMoment: { en: "Monday, 11 AM. Your copy is ready.", es: "Lunes, 11 AM. Tu copia está lista." },
    location: browser("Open Sheets from the bookmarks"),
  },

  triage: {
    key: "triage",
    built: true,
    label: { en: "Handle two things at once", es: "Maneja dos cosas a la vez" },
    dispatch: {
      en: "Two things are already waiting. Drop neither.",
      es: "Dos cosas ya están esperando. No dejes caer ninguna.",
    },
    skill: "Handle two requests at once",
    bookmarkLabel: "Today",
    handoffCta: { en: "Open Today from the bookmarks", es: "Abre Today en los marcadores" },
    shiftMoment: {
      en: "Tuesday, 9:04 AM. Two things waiting.",
      es: "Martes, 9:04 AM. Dos cosas esperando.",
    },
    location: browser("Open Today from the bookmarks"),
  },

  "team-schedule": {
    key: "team-schedule",
    built: true,
    label: { en: "Fill Saturday close", es: "Cubre el cierre del sábado" },
    dispatch: {
      en: "Saturday close has nobody on it. Pick someone with room.",
      es: "El cierre del sábado no tiene a nadie. Elige a alguien con espacio.",
    },
    skill: "Build a crew schedule",
    bookmarkLabel: "Sheets",
    handoffCta: { en: "Open Sheets from the bookmarks", es: "Abre Sheets en los marcadores" },
    shiftMoment: {
      en: "Monday. You write the crew week now.",
      es: "Lunes. Ahora tú escribes la semana del equipo.",
    },
    location: browser("Open Sheets from the bookmarks"),
  },

  "formula-check": {
    key: "formula-check",
    built: true,
    label: { en: "Fix the hours formula", es: "Arregla la fórmula de horas" },
    dispatch: {
      en: "The hours total looks fine. The formula does not.",
      es: "El total de horas se ve bien. La fórmula no.",
    },
    skill: "Fix a formula range",
    bookmarkLabel: "Sheets",
    handoffCta: { en: "Open Sheets from the bookmarks", es: "Abre Sheets en los marcadores" },
    shiftMoment: {
      en: "Friday. Hours are due for payroll.",
      es: "Viernes. Hay que entregar las horas para la nómina.",
    },
    location: browser("Open Sheets from the bookmarks"),
  },

  "team-meeting": {
    key: "team-meeting",
    built: true,
    label: { en: "Lead your first huddle", es: "Dirige tu primera reunión de equipo" },
    dispatch: {
      en: "The crew needs 15 minutes on next week's schedule.",
      es: "El equipo necesita 15 minutos para el horario de la próxima semana.",
    },
    skill: "Create a meeting with an agenda",
    bookmarkLabel: "Huddle",
    handoffCta: { en: "Open Huddle from the bookmarks", es: "Abre Huddle en los marcadores" },
    shiftMoment: {
      en: "Tuesday. You call the huddle now.",
      es: "Martes. Ahora tú llamas a la reunión.",
    },
    location: browser("Open Huddle from the bookmarks"),
  },

  "priority-call": {
    key: "priority-call",
    built: true,
    label: { en: "Three things at once", es: "Tres cosas a la vez" },
    dispatch: {
      en: "Three things just landed. Name the first move.",
      es: "Tres cosas acaban de llegar. Decide el primer paso.",
    },
    skill: "Handle three asks at once",
    bookmarkLabel: "Floor",
    handoffCta: { en: "Open Floor from the bookmarks", es: "Abre Floor en los marcadores" },
    shiftMoment: {
      en: "Thursday, 3:40 PM. The floor is loud.",
      es: "Jueves, 3:40 PM. El piso está fuerte.",
    },
    location: browser("Open Floor from the bookmarks"),
  },
};

/** All task descriptors in registry order. */
export const TASK_LIST: TaskDescriptor[] = Object.values(TASKS);

export function taskDescriptor(key: TaskKey): TaskDescriptor {
  return TASKS[key];
}

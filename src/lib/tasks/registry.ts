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
      en: "Your schedule is posted. Check it against your calendar.",
      es: "Tu horario ya está publicado. Compáralo con tu calendario.",
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
      en: "Your first paycheck is not here yet. Practice on Alex Chen's stub.",
      es: "Tu primer cheque todavía no está. Practica con el de Alex Chen.",
    },
    skill: "Read a pay stub",
    bookmarkLabel: "Portal",
    handoffCta: { en: "Next: Check a pay stub", es: "Siguiente: Revisar un recibo" },
    shiftMoment: {
      en: "Friday, 5:40 PM. Payday for the crew.",
      es: "Viernes, 5:40 PM. Día de pago del equipo.",
    },
    location: browser("Open Portal", "portal", "paystubs"),
    jobCardLine: { en: "Open Alex Chen's pay stub.", es: "Abre el recibo de Alex Chen." },
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

  "college-offer": {
    key: "college-offer",
    built: true,
    label: { en: "Read and accept the offer", es: "Lee y acepta la oferta" },
    dispatch: {
      en: "Harborside will pay for a class. Read the offer, then make it fit your week.",
      es: "Harborside pagará una clase. Lee la oferta y haz que quepa en tu semana.",
    },
    skill: "Accept an offer and put it on a full calendar",
    bookmarkLabel: "Offer",
    handoffCta: { en: "Open Offer from the bookmarks", es: "Abre Oferta en los marcadores" },
    shiftMoment: {
      en: "Monday. The offer is in your inbox.",
      es: "Lunes. La oferta está en tu bandeja.",
    },
    location: browser("Open Offer from the bookmarks"),
    jobCardLine: { en: "Read the offer. Then make it fit.", es: "Lee la oferta. Luego haz que quepa." },
  },

  "budget-sheet": {
    key: "budget-sheet",
    built: true,
    label: { en: "Flag what is over budget", es: "Marca lo que se pasó del presupuesto" },
    dispatch: {
      en: "One category is over. Open the formula, then tell Maria.",
      es: "Una categoría se pasó. Abre la fórmula y avísale a Maria.",
    },
    skill: "Read a budget IF and a chart",
    bookmarkLabel: "Sheets",
    handoffCta: { en: "Open Sheets from the bookmarks", es: "Abre Sheets en los marcadores" },
    shiftMoment: {
      en: "Wednesday. This week's budget is in.",
      es: "Miércoles. Ya está el presupuesto de esta semana.",
    },
    location: browser("Open Sheets from the bookmarks"),
    jobCardLine: { en: "Find what is over budget.", es: "Encuentra qué se pasó del presupuesto." },
  },

  "reply-all": {
    key: "reply-all",
    built: true,
    label: { en: "Reply to the right people", es: "Responde a las personas correctas" },
    dispatch: {
      en: "HQ asked a question. Not everyone on the thread needs your answer.",
      es: "HQ hizo una pregunta. No todos en el hilo necesitan tu respuesta.",
    },
    skill: "Choose reply instead of reply-all",
    bookmarkLabel: "Mail",
    handoffCta: { en: "Open Mail from the bookmarks", es: "Abre Correo en los marcadores" },
    shiftMoment: {
      en: "Friday. A long thread from HQ.",
      es: "Viernes. Un hilo largo de HQ.",
    },
    location: browser("Open Mail from the bookmarks"),
    jobCardLine: { en: "Reply to who asked. Not everyone.", es: "Responde a quien preguntó. No a todos." },
  },

  enrollment: {
    key: "enrollment",
    built: true,
    label: { en: "Apply before the deadline", es: "Aplica antes de la fecha" },
    dispatch: {
      en: "The college portal has a deadline and a list. Find both. Then write.",
      es: "El portal de la universidad tiene una fecha y una lista. Encuentra las dos. Luego escribe.",
    },
    skill: "Navigate a college portal under a deadline",
    bookmarkLabel: "College",
    handoffCta: { en: "Open College from the bookmarks", es: "Abre Universidad en los marcadores" },
    shiftMoment: {
      en: "Monday. The application is open.",
      es: "Lunes. La solicitud está abierta.",
    },
    location: browser("Open College from the bookmarks"),
    jobCardLine: { en: "Find the deadline. Then apply.", es: "Encuentra la fecha. Luego aplica." },
  },

  "appointment-scheduling": {
    key: "appointment-scheduling",
    built: true,
    label: { en: "Book the visit without a clash", es: "Agenda la cita sin un choque" },
    dispatch: {
      en: "A patient asked for a time that is already taken. Offer the open slot.",
      es: "Un paciente pidió una hora que ya está ocupada. Ofrece el hueco libre.",
    },
    skill: "Book an appointment without double-booking",
    bookmarkLabel: "Front Desk",
    handoffCta: { en: "Open Front Desk from the bookmarks", es: "Abre Recepción en los marcadores" },
    shiftMoment: {
      en: "Monday. The morning list is in.",
      es: "Lunes. Ya está la lista de la mañana.",
    },
    location: browser("Open Front Desk from the bookmarks"),
    jobCardLine: { en: "Spot the clash. Offer the open slot.", es: "Mira el choque. Ofrece el hueco." },
  },

  "financial-aid": {
    key: "financial-aid",
    built: true,
    label: { en: "Read the award letter", es: "Lee la carta de ayuda" },
    dispatch: {
      en: "The award letter is in the portal. Find the amount and the accept-by date.",
      es: "La carta de ayuda está en el portal. Encuentra el monto y la fecha para aceptar.",
    },
    skill: "Find the amount and deadline on an award letter",
    bookmarkLabel: "College",
    handoffCta: { en: "Open College from the bookmarks", es: "Abre Universidad en los marcadores" },
    shiftMoment: {
      en: "Wednesday. The award letter arrived.",
      es: "Miércoles. Llegó la carta de ayuda.",
    },
    location: browser("Open College from the bookmarks"),
    jobCardLine: { en: "Find the amount and the date.", es: "Encuentra el monto y la fecha." },
  },

  "patient-intake": {
    key: "patient-intake",
    built: true,
    label: { en: "File the intake. Do not overshare.", es: "Archiva el ingreso. No compartas de más." },
    dispatch: {
      en: "A new patient form is in. File it. A coworker will ask to see it.",
      es: "Hay un formulario de un paciente nuevo. Archívalo. Un compañero va a pedir verlo.",
    },
    skill: "Judge who may see a patient form",
    bookmarkLabel: "Front Desk",
    handoffCta: { en: "Open Front Desk from the bookmarks", es: "Abre Recepción en los marcadores" },
    shiftMoment: {
      en: "Wednesday. A new patient just checked in.",
      es: "Miércoles. Un paciente nuevo acaba de llegar.",
    },
    location: browser("Open Front Desk from the bookmarks"),
    jobCardLine: { en: "File it. Do not overshare.", es: "Archívalo. No compartas de más." },
  },

  coursework: {
    key: "coursework",
    built: true,
    label: { en: "Submit the assignment on time", es: "Entrega la tarea a tiempo" },
    dispatch: {
      en: "The syllabus has a due date. Read it. Write a short answer. Submit.",
      es: "El temario tiene una fecha. Léelo. Escribe una respuesta corta. Entrégala.",
    },
    skill: "Read a syllabus and submit on time",
    bookmarkLabel: "Coursework",
    handoffCta: { en: "Open Coursework from the bookmarks", es: "Abre Curso en los marcadores" },
    shiftMoment: {
      en: "Thursday. Something is due tonight.",
      es: "Jueves. Algo se entrega esta noche.",
    },
    location: browser("Open Coursework from the bookmarks"),
    jobCardLine: { en: "Read the due date. Then submit.", es: "Lee la fecha. Luego entrega." },
  },

  "billing-sheet": {
    key: "billing-sheet",
    built: true,
    label: { en: "Flag the billing mismatch", es: "Marca el error de facturación" },
    dispatch: {
      en: "One visit code does not match its charge. Find it and tell the office.",
      es: "Un código de visita no coincide con el cargo. Encuéntralo y avisa a la oficina.",
    },
    skill: "Match visit codes to charges",
    bookmarkLabel: "Sheets",
    handoffCta: { en: "Open Sheets from the bookmarks", es: "Abre Sheets en los marcadores" },
    shiftMoment: {
      en: "Thursday. Today's billing sheet is in.",
      es: "Jueves. Ya está la hoja de facturación.",
    },
    location: browser("Open Sheets from the bookmarks"),
    jobCardLine: { en: "Find the charge that does not match.", es: "Encuentra el cargo que no cuadra." },
  },

  research: {
    key: "research",
    built: true,
    label: { en: "Cite a source that holds up", es: "Cita una fuente que se sostenga" },
    dispatch: {
      en: "Four results came back. Pick the one you would cite, and say why.",
      es: "Salieron cuatro resultados. Elige el que citarías, y di por qué.",
    },
    skill: "Tell a credible source from an unreliable one",
    bookmarkLabel: "Library",
    handoffCta: { en: "Open Library from the bookmarks", es: "Abre Biblioteca en los marcadores" },
    shiftMoment: {
      en: "Friday. You need one source.",
      es: "Viernes. Necesitas una fuente.",
    },
    location: browser("Open Library from the bookmarks"),
    jobCardLine: { en: "Pick the source you would cite.", es: "Elige la fuente que citarías." },
  },

  "confidentiality-call": {
    key: "confidentiality-call",
    built: true,
    label: { en: "Do not confirm over the phone", es: "No confirmes por teléfono" },
    dispatch: {
      en: "Someone called claiming to be family. You cannot verify who they are.",
      es: "Alguien llamó diciendo ser familia. No puedes verificar quién es.",
    },
    skill: "Decline a plausible request for private information",
    bookmarkLabel: "Front Desk",
    handoffCta: { en: "Open Front Desk from the bookmarks", es: "Abre Recepción en los marcadores" },
    shiftMoment: {
      en: "Friday. The phone is ringing.",
      es: "Viernes. Está sonando el teléfono.",
    },
    location: browser("Open Front Desk from the bookmarks"),
    jobCardLine: { en: "Stay polite. Do not confirm.", es: "Sé amable. No confirmes." },
  },
};

/** All task descriptors in registry order. */
export const TASK_LIST: TaskDescriptor[] = Object.values(TASKS);

export function taskDescriptor(key: TaskKey): TaskDescriptor {
  return TASKS[key];
}

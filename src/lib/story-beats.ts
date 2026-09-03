import type { TaskKey } from "@/lib/desktop-content";
import { CAST, inboxSender } from "@/lib/cast";
import { firstName, mailGreeting, signatureFor } from "@/lib/mail-greeting";
import type { Lang, Localized } from "@/lib/task-types";
import { LEVELS, taskKeysForLevel } from "@/lib/tracks-content";
import { TASK_LIST } from "@/lib/tasks/registry";

export const HUDDLE_TIME_FLAG = "huddleTime";
/** Set when the learner flags a hours mismatch and Mail should open to compose. */
export const TIMECLOCK_MAIL_FLAG = "timeclock-mail-open";

export type StoryFlags = Record<string, string>;

export type InboxRow = {
  key: string;
  from: string;
  initials: string;
  color: string;
  time: string;
  isTarget?: boolean;
  unread?: boolean;
  story?: boolean;
  subject: Localized;
  preview: Localized;
  wrongHint?: Localized;
  body?: Record<Lang, string[]>;
  unlockAfter: TaskKey;
};

/**
 * Done-screen "Next" button, keyed by the task it opens, and one line of
 * clock time per task for the desktop briefing. Both derived from the task
 * registry (`src/lib/tasks/registry.ts`).
 *
 * On `shiftMoment`: **time only ever moves forward.** Read the registry top
 * to bottom, these are the days of the learner's employment in order, and
 * each level (see `dayNumber`) is one workday. `story-coherence.test.ts`
 * enforces the weekday ordering; when you add a task give it a moment at or
 * after the task above it, and never reuse a weekday for a different level.
 */
export const HANDOFF_CTA: Record<TaskKey, Localized> = Object.fromEntries(
  TASK_LIST.map((d) => [d.key, d.handoffCta]),
) as Record<TaskKey, Localized>;

export const SHIFT_MOMENT: Record<TaskKey, Localized> = Object.fromEntries(
  TASK_LIST.map((d) => [d.key, d.shiftMoment]),
) as Record<TaskKey, Localized>;

const MARIA = inboxSender(CAST.maria);

export function extractHuddleTime(text: string): "10am" | "2pm" {
  if (/\b2\s*(p\.?m\.?|pm)\b/i.test(text) || /\b14:00\b/.test(text)) return "2pm";
  return "10am";
}

function huddleReply(flags: StoryFlags): Pick<InboxRow, "subject" | "preview" | "body"> {
  if (flags[HUDDLE_TIME_FLAG] === "2pm") {
    return {
      subject: { en: "Thursday at 2 PM works", es: "El jueves a las 2 PM funciona" },
      preview: { en: "See you at the huddle.", es: "Nos vemos en la reunión." },
      body: {
        en: [
          "Thursday at 2 PM works. See you at the huddle.",
          "Thank you for catching that.",
          "Monday, Jordan starts. Share the file, not the folder.",
        ],
        es: [
          "El jueves a las 2 PM funciona. Nos vemos en la reunión.",
          "Gracias por darte cuenta.",
          "El lunes empieza Jordan. Comparte el archivo, no la carpeta.",
        ],
      },
    };
  }
  return {
    subject: { en: "Thursday at 10 AM works", es: "El jueves a las 10 AM funciona" },
    preview: { en: "See you at the huddle.", es: "Nos vemos en la reunión." },
    body: {
        en: [
          "Thursday at 10 AM works. See you at the huddle.",
          "Thank you for catching that.",
          "Monday, Jordan starts. Share the file, not the folder.",
        ],
        es: [
          "El jueves a las 10 AM funciona. Nos vemos en la reunión.",
          "Gracias por darte cuenta.",
          "El lunes empieza Jordan. Comparte el archivo, no la carpeta.",
        ],
    },
  };
}

const STORY_MAILS: InboxRow[] = [
  {
    key: "story-mail",
    ...MARIA,
    time: "8:22 AM",
    unread: true,
    story: true,
    // Fires after the last Day One mail job (welcome thank-you + safety attach).
    unlockAfter: "mail-attach",
    subject: { en: "Got it. Thank you", es: "Lo tengo. Gracias" },
    preview: { en: "Thanks for sending this so fast.", es: "Gracias por enviarlo tan rápido." },
    body: {
      en: [
        "Got it. Thank you for sending the July report so fast.",
        "See you on the floor.",
        "Next I need you to check your schedule.",
      ],
      es: [
        "Lo tengo. Gracias por enviar el reporte de julio tan rápido.",
        "Nos vemos en el piso.",
        "Ahora te necesito en el horario. Dos turnos se cruzan.",
      ],
    },
  },
  {
    key: "story-schedule",
    ...MARIA,
    time: "10:04 AM",
    unread: true,
    story: true,
    unlockAfter: "schedule",
    subject: { en: "Thursday swap", es: "Cambio del jueves" },
    preview: { en: "You're on the later shift Thursday.", es: "El jueves estás en el turno de tarde." },
    body: {
      en: [
        "Approved. You're on 2 to 10 Thursday, so go to your appointment.",
        "Thanks for catching it when the schedule went up instead of that morning.",
        "When the day ends, clock out and check your hours.",
      ],
      es: [
        "Aprobado. El jueves entras de 2 a 10, así que ve a tu cita.",
        "Gracias por verlo cuando salió el horario y no esa misma mañana.",
        "Al final del día, marca salida y revisa tus horas.",
      ],
    },
  },
  {
    key: "story-timeclock",
    ...MARIA,
    time: "6:41 PM",
    unread: true,
    story: true,
    unlockAfter: "timeclock",
    subject: { en: "Your hours note", es: "Tu nota de horas" },
    preview: { en: "I'll look at the punch.", es: "Voy a revisar el registro." },
    body: {
      en: [
        "Got your note about the hours. I'll look at the punch and fix it if it is wrong.",
        "Friday is payday. Practice on Alex Chen's stub.",
      ],
      es: [
        "Recibí tu nota sobre las horas. Voy a revisar el registro y lo corrijo si está mal.",
        "El viernes es día de pago. Practica con el recibo de Alex Chen.",
      ],
    },
  },
  {
    key: "story-paystub",
    ...inboxSender(CAST.hr),
    time: "Fri",
    unread: true,
    story: true,
    unlockAfter: "paystub",
    subject: { en: "Alex's numbers check out", es: "Los números de Alex cuadran" },
    preview: { en: "You opened the right stub.", es: "Abriste el recibo correcto." },
    body: {
      en: [
        "You opened Alex Chen's stub, not the first name on the list.",
        "When yours lands in two weeks, read it the same way. If something looks off, write Maria.",
        "Monday is a normal shift, start to finish. Run it.",
      ],
      es: [
        "Abriste el recibo de Alex Chen, no el primer nombre de la lista.",
        "Cuando llegue el tuyo en dos semanas, léelo igual. Si algo se ve mal, escríbele a Maria.",
        "El lunes es un turno normal, de principio a fin. Hazlo.",
      ],
    },
  },
  {
    key: "story-call-out-sick",
    ...MARIA,
    time: "6:31 AM",
    unread: true,
    story: true,
    unlockAfter: "call-out-sick",
    subject: { en: "Feel better", es: "Que te mejores" },
    preview: { en: "I've got the shift covered.", es: "Ya cubrí el turno." },
    body: {
      en: [
        "Got it, and I have the shift covered. Rest today.",
        "You wrote before the shift instead of after it started, which is the part that matters. Two hours' notice is the rule here.",
        "When you're back, something may go wrong on the floor. Write it up if it does.",
      ],
      es: [
        "Recibido, y ya cubrí el turno. Descansa hoy.",
        "Escribiste antes del turno y no después de que empezara, que es lo que importa. Aquí la regla son dos horas de aviso.",
        "Cuando regreses, puede pasar algo en el piso. Escríbelo si pasa.",
      ],
    },
  },
  {
    key: "story-incident",
    ...MARIA,
    time: "2:18 PM",
    unread: true,
    story: true,
    unlockAfter: "incident",
    subject: { en: "Incident logged", es: "Incidente registrado" },
    preview: { en: "I have the write-up. Thank you.", es: "Tengo el reporte. Gracias." },
    body: {
      en: [
        "I have the write-up about the slip. Thank you.",
        "I'll follow up with the floor.",
        "The handbook is on your desk if they ask you something.",
      ],
      es: [
        "Tengo el reporte del resbalón. Gracias.",
        "Voy a dar seguimiento en el piso.",
        "El manual está en tu escritorio si te preguntan algo.",
      ],
    },
  },
  {
    key: "story-handbook",
    ...MARIA,
    time: "8:51 PM",
    unread: true,
    story: true,
    unlockAfter: "handbook",
    subject: { en: "You looked it up", es: "Lo buscaste" },
    preview: { en: "That's what the handbook is for.", es: "Para eso es el manual." },
    body: {
      en: [
        "You found the answer in the handbook instead of guessing. That is exactly what it is for.",
        "Next week you are a lead. The calendar is yours. Open it from the bookmarks bar.",
      ],
      es: [
        "Encontraste la respuesta en el manual en vez de adivinar. Para eso es.",
        "La semana que viene eres líder. El calendario es tuyo. Ábrelo en la barra de marcadores.",
      ],
    },
  },
  {
    key: "story-calendar",
    ...MARIA,
    time: "9:06 AM",
    unread: true,
    story: true,
    unlockAfter: "calendar",
    subject: { en: "Thursday at 10 AM works", es: "El jueves a las 10 AM funciona" },
    preview: { en: "See you at the huddle.", es: "Nos vemos en la reunión." },
  },
  {
    key: "story-files",
    ...MARIA,
    time: "11:12 AM",
    unread: true,
    story: true,
    unlockAfter: "files",
    subject: { en: "Jordan has the file", es: "Jordan ya tiene el archivo" },
    preview: { en: "View only. That's what I wanted.", es: "Solo ver. Eso es lo que quería." },
    body: {
      en: [
        "Jordan has this week's schedule, view only. That's exactly what I wanted.",
        "Friday the counts are due. Total them yourself.",
      ],
      es: [
        "Jordan ya tiene el horario de esta semana, solo para ver. Eso es justo lo que quería.",
        "El viernes hay que entregar las cuentas. Súmalas tú.",
      ],
    },
  },
  {
    key: "story-spreadsheet",
    ...MARIA,
    time: "4:03 PM",
    unread: true,
    story: true,
    unlockAfter: "spreadsheet",
    subject: { en: "Tip total", es: "Total de propinas" },
    preview: { en: "Got the number. I'll add it to pay.", es: "Tengo el número. Lo sumo al pago." },
    body: {
      en: [
        "Got the total. I'll add it to this week's pay.",
        "I shared a template. It is view only. Copy it first.",
      ],
      es: [
        "Tengo el total. Lo sumo al pago de esta semana.",
        "Compartí una plantilla. Es solo ver. Cópiala primero.",
      ],
    },
  },
  {
    key: "story-make-a-copy",
    ...MARIA,
    time: "9:18 AM",
    unread: true,
    story: true,
    unlockAfter: "make-a-copy",
    subject: { en: "Your copy, not the master", es: "Tu copia, no el original" },
    preview: { en: "That's the move. Work in yours.", es: "Ese es el paso. Trabaja en la tuya." },
    body: {
      en: ["You copied the template. The master is still clean.", "Now put this week's numbers in your copy."],
      es: ["Copiaste la plantilla. El original sigue limpio.", "Ahora pon los números de esta semana en tu copia."],
    },
  },
  {
    key: "story-status-report",
    ...MARIA,
    time: "11:02 AM",
    unread: true,
    story: true,
    unlockAfter: "status-report",
    subject: { en: "Got the total — and Jordan did too", es: "Tengo el total — y Jordan también" },
    preview: { en: "That's how a status email should look.", es: "Así debe verse un correo de estado." },
    body: {
      en: [
        "Got the SUM. Jordan is on the thread. That's how a status email should look.",
        "Tuesday will be two things at once. Drop neither.",
      ],
      es: [
        "Tengo el SUM. Jordan está en el hilo. Así debe verse un correo de estado.",
        "El martes serán dos cosas a la vez. No sueltes ninguna.",
      ],
    },
  },
  {
    key: "story-triage",
    ...MARIA,
    time: "10:11 AM",
    unread: true,
    story: true,
    unlockAfter: "triage",
    subject: { en: "Friday 10 AM works", es: "El viernes a las 10 AM funciona" },
    preview: { en: "And Sam has the file. Thank you.", es: "Y Sam ya tiene el archivo. Gracias." },
    body: {
      en: [
        "Friday 10 AM works for inventory.",
        "Sam has the allergen list, view only. You didn't drop either one.",
        "You write the crew week now. Saturday close is open.",
      ],
      es: [
        "El viernes a las 10 AM funciona para inventario.",
        "Sam tiene la lista de alérgenos, solo ver. No soltaste ninguna.",
        "Ahora tú escribes la semana del equipo. El cierre del sábado está abierto.",
      ],
    },
  },
  {
    key: "story-team-schedule",
    ...inboxSender(CAST.jordan),
    time: "11:40 AM",
    unread: true,
    story: true,
    unlockAfter: "team-schedule",
    subject: { en: "Saturday close", es: "Cierre del sábado" },
    preview: { en: "Got it. I'll take 4–10.", es: "Listo. Yo hago el 4–10." },
    body: {
      en: [
        "Got it. I'll take Saturday close, 4–10.",
        "Thank you for asking the person with room.",
        "Friday, check the hours formula before payroll.",
      ],
      es: [
        "Listo. Yo hago el cierre del sábado, 4–10.",
        "Gracias por preguntarle a quien tenía espacio.",
        "El viernes, revisa la fórmula de horas antes de nómina.",
      ],
    },
  },
  {
    key: "story-formula-check",
    ...MARIA,
    time: "3:12 PM",
    unread: true,
    story: true,
    unlockAfter: "formula-check",
    subject: { en: "Hours total", es: "Total de horas" },
    preview: { en: "Casey was missing. Good catch.", es: "Faltaba Casey. Buen ojo." },
    body: {
      en: [
        "The SUM was one row short. Casey was missing.",
        "The new total is the one I'll send to payroll. Thank you.",
        "You call the huddle now. Short agenda.",
      ],
      es: [
        "El SUM se quedó corto una fila. Faltaba Casey.",
        "El total nuevo es el que mando a nómina. Gracias.",
        "Ahora tú llamas la reunión. Agenda corta.",
      ],
    },
  },
  {
    key: "story-team-meeting",
    ...MARIA,
    time: "10:04 AM",
    unread: true,
    story: true,
    unlockAfter: "team-meeting",
    subject: { en: "See you Thursday", es: "Nos vemos el jueves" },
    preview: { en: "Short agenda. That's a real huddle.", es: "Agenda corta. Eso es una reunión de verdad." },
    body: {
      en: [
        "Thursday 10 AM. I saw the agenda.",
        "Two or three bullets. That's a huddle a lead can run.",
        "Thursday will be loud. Three things at once.",
      ],
      es: [
        "Jueves 10 AM. Vi la agenda.",
        "Dos o tres puntos. Eso es una reunión que un líder puede dirigir.",
        "El jueves va a estar fuerte. Tres cosas a la vez.",
      ],
    },
  },
  {
    key: "story-priority-call",
    ...MARIA,
    time: "6:02 PM",
    unread: true,
    story: true,
    unlockAfter: "priority-call",
    subject: { en: "You held the floor", es: "Aguantaste el piso" },
    preview: { en: "There's an Assistant Manager opening.", es: "Hay una vacante de asistente de gerencia." },
    body: {
      en: [
        "Dana got a real answer. Thursday close is covered. Saturday 10 AM works for me.",
        "There's an Assistant Manager opening. I want you to read the offer when you're ready.",
      ],
      es: [
        "Dana recibió una respuesta real. El cierre del jueves está cubierto. El sábado a las 10 AM me funciona.",
        "Hay una vacante de asistente de gerencia. Quiero que leas la oferta cuando estés listo.",
      ],
    },
  },
  {
    key: "story-college-offer",
    ...MARIA,
    time: "4:18 PM",
    unread: true,
    story: true,
    unlockAfter: "college-offer",
    subject: { en: "Class is on the calendar", es: "La clase ya está en el calendario" },
    preview: { en: "We'll sort Tuesday close before the semester.", es: "Arreglamos el cierre del martes antes del semestre." },
    body: {
      en: [
        "You accepted the offer and put the class on a week that already had a close.",
        "We'll sort Tuesday before the semester starts. That is the whole point of saying it now.",
        "Wednesday I need you to read this week's budget. One category is over.",
      ],
      es: [
        "Aceptaste la oferta y pusiste la clase en una semana que ya tenía un cierre.",
        "Arreglamos el martes antes de que empiece el semestre. Ese es el punto de decirlo ahora.",
        "El miércoles necesito que leas el presupuesto de esta semana. Una categoría se pasó.",
      ],
    },
  },
  {
    key: "story-budget-sheet",
    ...MARIA,
    time: "3:40 PM",
    unread: true,
    story: true,
    unlockAfter: "budget-sheet",
    subject: { en: "Labor was the one", es: "Mano de obra era esa" },
    preview: { en: "You read the IF. HQ will write next.", es: "Leíste el IF. HQ escribe después." },
    body: {
      en: [
        "Labor was over. You opened the formula instead of guessing from the total.",
        "I flagged it upstairs. HQ will write the cafe a question on Friday.",
        "Read the whole thread before you answer. Not every message needs everyone.",
      ],
      es: [
        "Mano de obra se pasó. Abriste la fórmula en vez de adivinar por el total.",
        "Lo subí. HQ le va a escribir al café el viernes.",
        "Lee todo el hilo antes de responder. No todo mensaje necesita a todos.",
      ],
    },
  },
  {
    key: "story-reply-all",
    ...MARIA,
    time: "5:12 PM",
    unread: true,
    story: true,
    unlockAfter: "reply-all",
    subject: { en: "You sent it to Dana", es: "Se lo enviaste a Dana" },
    preview: { en: "That is how an Assistant Manager writes.", es: "Así escribe un asistente de gerencia." },
    body: {
      en: [
        "Dana got a clear yes. The rest of the thread did not need it.",
        "You edited the draft before you sent it. That pause is the job.",
        "More is coming. For today, this is a real week as Assistant Manager.",
      ],
      es: [
        "Dana recibió un sí claro. El resto del hilo no lo necesitaba.",
        "Editaste el borrador antes de enviarlo. Esa pausa es el trabajo.",
        "Vendrá más. Por hoy, esta fue una semana de verdad como asistente de gerencia.",
      ],
    },
  },
];

export function storyMailAfter(taskKey: TaskKey): InboxRow | undefined {
  return STORY_MAILS.find((m) => m.unlockAfter === taskKey);
}

const CLOSING: Record<Lang, string> = { en: "Thanks,", es: "Gracias," };

/**
 * A story email as the learner reads it: greeted by name at the top, closed at
 * the bottom. The middle lines are the beat itself and stay verbatim. Modeling
 * the full greeting-body-closing shape is the point — a learner who only ever
 * sees bare paragraphs never learns what a work email looks like.
 *
 * The typed name after the closing is left off for anyone who has a signature
 * block, since that block already names them; a sender without one still types
 * their first name, the way a quick note from a coworker actually arrives.
 */
export function storyBodyFor(row: InboxRow, lang: Lang, displayName: string): string[] {
  if (!row.body) return [];
  const signed = signatureFor(row.from) ? [] : [firstName(row.from)];
  return [mailGreeting(lang, displayName), ...row.body[lang], CLOSING[lang], ...signed];
}

export function noteIsFromMaria(taskKey: TaskKey): boolean {
  return storyMailAfter(taskKey)?.from === MARIA.from;
}

const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

/** Higher = newer. Clock times count as today; dated labels sit further back. */
export function inboxTimeRank(time: string): number {
  const t = time.trim();
  const clock = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (clock) {
    let hours = Number(clock[1]);
    const minutes = Number(clock[2]);
    const ap = clock[3].toUpperCase();
    if (ap === "PM" && hours !== 12) hours += 12;
    if (ap === "AM" && hours === 12) hours = 0;
    return 4_000_000 + hours * 60 + minutes;
  }
  if (/^yesterday$/i.test(t)) return 3_000_000;
  const weekday = WEEKDAYS.indexOf(t.toLowerCase());
  if (weekday >= 0) return 2_000_000 + weekday;
  const dated = t.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})$/i);
  if (dated) {
    const month = MONTHS[dated[1].slice(0, 3).toLowerCase()] ?? 0;
    return 1_000_000 + month * 32 + Number(dated[2]);
  }
  return 0;
}

export function sortInboxByTime<T extends { time: string }>(rows: T[]): T[] {
  return rows
    .map((row, index) => ({ row, index }))
    .sort((a, b) => {
      const diff = inboxTimeRank(b.row.time) - inboxTimeRank(a.row.time);
      return diff !== 0 ? diff : a.index - b.index;
    })
    .map(({ row }) => row);
}

/** Newest completed beat first, so the inbox feels like time is moving. */
export function storyMailsFor(completedTaskKeys: TaskKey[], flags: StoryFlags): InboxRow[] {
  const unlocked = STORY_MAILS.filter((m) => completedTaskKeys.includes(m.unlockAfter));
  unlocked.sort(
    (a, b) => completedTaskKeys.indexOf(b.unlockAfter) - completedTaskKeys.indexOf(a.unlockAfter),
  );
  return unlocked.map((mail) => {
    if (mail.key !== "story-calendar") return mail;
    const reply = huddleReply(flags);
    return { ...mail, ...reply };
  });
}

/** Every task in the order the game hands them out. */
const CURRICULUM_ORDER: TaskKey[] = LEVELS.flatMap(taskKeysForLevel);

/**
 * The inbox as it looked at a moment in the story. While a mail task is
 * being done — including a REPLAY of an early level — only story mails
 * unlocked by tasks that come BEFORE it in the curriculum appear. Without
 * this, a learner replaying Day One faces a dozen future Maria emails and
 * "find Maria's email" stops making sense. Pass null when no mail task is
 * active (just browsing) to get everything unlocked so far.
 */
export function storyMailsUpTo(
  activeTaskKey: TaskKey | null,
  completedTaskKeys: TaskKey[],
  flags: StoryFlags,
): InboxRow[] {
  const unlocked = storyMailsFor(completedTaskKeys, flags);
  if (!activeTaskKey) return unlocked;
  const cutoff = CURRICULUM_ORDER.indexOf(activeTaskKey);
  if (cutoff === -1) return unlocked;
  return unlocked.filter((m) => {
    const i = CURRICULUM_ORDER.indexOf(m.unlockAfter);
    return i !== -1 && i < cutoff;
  });
}

export function storyFlagKeysForTasks(taskKeys: Iterable<TaskKey>): string[] {
  const keys: string[] = [];
  for (const task of taskKeys) {
    if (task === "calendar") keys.push(HUDDLE_TIME_FLAG);
    if (task === "timeclock") keys.push(TIMECLOCK_MAIL_FLAG);
  }
  return keys;
}

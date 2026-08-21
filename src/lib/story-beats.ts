import type { TaskKey } from "@/lib/desktop-content";
import type { Lang, Localized } from "@/lib/task-types";

export const HUDDLE_TIME_FLAG = "huddleTime";

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

/** One line of clock time for the desktop briefing. The story, not the skill name. */
export const SHIFT_MOMENT: Record<TaskKey, Localized> = {
  mail: { en: "Tuesday, 8:14 AM. First shift.", es: "Martes, 8:14 AM. Primer turno." },
  schedule: { en: "Tuesday morning.", es: "Martes por la mañana." },
  timeclock: { en: "Tuesday, end of shift.", es: "Martes, fin del turno." },
  paystub: { en: "Friday. Payday.", es: "Viernes. Día de pago." },
  incident: { en: "Wednesday. The floor is busy.", es: "Miércoles. El piso está lleno." },
  handbook: { en: "Thursday night.", es: "Jueves por la noche." },
  calendar: { en: "Next week. You are a lead now.", es: "La semana que viene. Ya eres líder." },
  files: { en: "Monday morning. Jordan starts today.", es: "Lunes por la mañana. Jordan empieza hoy." },
  spreadsheet: { en: "Friday afternoon. Counts are due.", es: "Viernes por la tarde. Hay que entregar las cuentas." },
};

const MARIA = {
  from: "Maria Delgado",
  initials: "MD",
  color: "#1a73e8",
};

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
        en: ["Thursday at 2 PM works. See you at the huddle.", "Thank you for catching that."],
        es: ["El jueves a las 2 PM funciona. Nos vemos en la reunión.", "Gracias por darte cuenta."],
      },
    };
  }
  return {
    subject: { en: "Thursday at 10 AM works", es: "El jueves a las 10 AM funciona" },
    preview: { en: "See you at the huddle.", es: "Nos vemos en la reunión." },
    body: {
      en: ["Thursday at 10 AM works. See you at the huddle.", "Thank you for catching that."],
      es: ["El jueves a las 10 AM funciona. Nos vemos en la reunión.", "Gracias por darte cuenta."],
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
    unlockAfter: "mail",
    subject: { en: "Got it. Thank you", es: "Lo tengo. Gracias" },
    preview: { en: "Thanks for sending this so fast.", es: "Gracias por enviarlo tan rápido." },
    body: {
      en: ["Got it. Thank you for sending the July report so fast.", "See you on the floor."],
      es: ["Lo tengo. Gracias por enviar el reporte de julio tan rápido.", "Nos vemos en el piso."],
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
    preview: { en: "I moved you off the overlap.", es: "Te quité del cruce de turnos." },
    body: {
      en: ["I moved you off the overlap on Thursday. You are on the later shift now.", "Thanks for flagging it."],
      es: ["Te quité del cruce de turnos del jueves. Ahora estás en el turno más tarde.", "Gracias por avisar."],
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
      en: ["Got your note about the hours. I'll look at the punch and fix it if it is wrong."],
      es: ["Recibí tu nota sobre las horas. Voy a revisar el registro y lo corrijo si está mal."],
    },
  },
  {
    key: "story-paystub",
    from: "Harborside HR",
    initials: "HR",
    color: "#9334e6",
    time: "Fri",
    unread: true,
    story: true,
    unlockAfter: "paystub",
    subject: { en: "We logged your pay check", es: "Registramos tu revisión de pago" },
    preview: { en: "Your hours match this week's stub.", es: "Tus horas coinciden con el recibo de esta semana." },
    body: {
      en: ["Thanks for checking your stub. The hours match this week.", "If something looks off next time, write Maria the same way."],
      es: ["Gracias por revisar tu recibo. Las horas coinciden esta semana.", "Si algo se ve mal la próxima vez, escríbele a Maria igual."],
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
      en: ["I have the write-up about the slip. Thank you.", "I'll follow up with the floor."],
      es: ["Tengo el reporte del resbalón. Gracias.", "Voy a dar seguimiento en el piso."],
    },
  },
  {
    key: "story-handbook",
    ...MARIA,
    time: "8:51 PM",
    unread: true,
    story: true,
    unlockAfter: "handbook",
    subject: { en: "Get some rest", es: "Descansa" },
    preview: { en: "Text me at least 2 hours before if you can't come in.", es: "Envíame un mensaje al menos 2 horas antes si no puedes venir." },
    body: {
      en: [
        "Get some rest.",
        "If you still feel sick tomorrow, text me at least 2 hours before your shift. I'll cover it.",
      ],
      es: [
        "Descansa.",
        "Si mañana sigues enfermo, envíame un mensaje al menos 2 horas antes de tu turno. Yo lo cubro.",
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
      en: ["Jordan has this week's schedule, view only. That's what I wanted.", "Thank you."],
      es: ["Jordan ya tiene el horario de esta semana, solo para ver. Eso es lo que quería.", "Gracias."],
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
      en: ["Got the total. I'll add it to this week's pay.", "Thank you."],
      es: ["Tengo el total. Lo sumo al pago de esta semana.", "Gracias."],
    },
  },
];

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

export function storyFlagKeysForTasks(taskKeys: Iterable<TaskKey>): string[] {
  const keys: string[] = [];
  for (const task of taskKeys) {
    if (task === "calendar") keys.push(HUDDLE_TIME_FLAG);
  }
  return keys;
}

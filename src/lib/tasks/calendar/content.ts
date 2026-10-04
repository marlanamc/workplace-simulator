import type { EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";
import {
  HUDDLE_DAY,
  cardDate,
  longDate,
  mondayOf,
  monthLabel,
  shiftBlockFor,
  shiftSpan,
  storyDate,
  storyWeekday,
} from "@/lib/story-dates";

/** "Wednesday, September 16" / "miércoles 16 de septiembre": the day the huddle lands on. */
const HUDDLE_LONG = { en: longDate(HUDDLE_DAY, "en"), es: longDate(HUDDLE_DAY, "es") };

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "📅",
    kicker: "Next week",
    headline: "Renata sent you a meeting invite.",
    body: `The Weekly Lead Huddle is on ${HUDDLE_LONG.en}. Check it against your work shifts before you answer.`,
    cta: "Open Calendar",
  },
  es: {
    emoji: "📅",
    kicker: "La semana que viene",
    headline: "Renata te mandó una invitación a una reunión.",
    body: `La reunión semanal de líderes es el ${HUDDLE_LONG.es}. Compárala con tus turnos antes de responder.`,
    cta: "Abrir Calendar",
  },
};

export const HUDDLE_TIMES = [
  {
    key: "10am" as const,
    label: { en: "Thu 10:00 AM", es: "Jue 10:00 AM" },
    starter: {
      en: "Could we do Thursday at 10 AM instead?",
      es: "¿Podríamos el jueves a las 10 AM?",
    },
    /** What a lesson's chip inserts: only the time words, so the learner writes the sentence. */
    words: { en: "Thursday at 10 AM", es: "el jueves a las 10 AM" },
  },
  {
    key: "2pm" as const,
    label: { en: "Thu 2:00 PM", es: "Jue 2:00 PM" },
    starter: {
      en: "Could we do Thursday at 2 PM instead?",
      es: "¿Podríamos el jueves a las 2 PM?",
    },
    words: { en: "Thursday at 2 PM", es: "el jueves a las 2 PM" },
  },
];

/** The invite itself. Localized, so a Spanish screen does not show English data. */
export const MEETING = {
  title: { en: "Weekly Lead Huddle", es: "Reunión semanal de líderes" } as Localized,
  organizer: { en: "Renata Silva · General Manager", es: "Renata Silva · Gerente general" } as Localized,
  when: { en: `${cardDate(HUDDLE_DAY, "en")} · 9:00 AM – 9:30 AM`, es: `${cardDate(HUDDLE_DAY, "es")} · 9:00 AM – 9:30 AM` } as Localized,
  chipTime: "9:00 AM",
  description: {
    en: "A short weekly check-in with the shift leads. Counts, callouts, and anything coming up.",
    es: "Una reunión corta cada semana con los líderes de turno. Conteos, ausencias y lo que viene.",
  } as Localized,
};

export const CALENDAR_COPY: Record<Lang, {
  heading: string;
  helpBtn: string;
  langBtn: string;
  create: string;
  todayBtn: string;
  searchPlaceholder: string;
  myCalendars: string;
  workShifts: string;
  cafeCalendar: string;
  monthLabel: string;
  viewDay: string;
  viewWeek: string;
  viewMonth: string;
  weekdayLabels: string[];
  invitedBy: string;
  scheduleNote: string;
  going: string;
  accept: string;
  no: string;
  maybe: string;
  proposeTime: string;
  whatTime: string;
  to: string;
  subjectLabel: string;
  subject: string;
  writeHere: string;
  startersLabel: string;
  send: string;
  discard: string;
  sentKicker: string;
  doneTitle: string;
  doneBody: string;
  badgeName: string;
  badgeWhere: string;
  tryAgain: string;
  backToDesk: string;
  lessonKicker: string;
  tipLabel: string;
  gotIt: string;
  askPerson: string;
}> = {
  en: {
    heading: "Calendar",
    helpBtn: "Help me with this step",
    langBtn: "Español",
    create: "Create",
    todayBtn: "Today",
    searchPlaceholder: "Search for people",
    myCalendars: "My calendars",
    workShifts: "Work shifts",
    cafeCalendar: "Harborside Cafe",
    monthLabel: monthLabel(HUDDLE_DAY, "en"),
    viewDay: "Day",
    viewWeek: "Week",
    viewMonth: "Month",
    weekdayLabels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    invitedBy: "Organizer",
    scheduleNote: "You're not scheduled to work this day.",
    going: "Going?",
    accept: "Yes",
    no: "No",
    maybe: "Maybe",
    proposeTime: "Propose a new time",
    whatTime: "What time works?",
    to: "To",
    subjectLabel: "Subject",
    subject: "Re: Weekly Lead Huddle. Different time?",
    writeHere: "Write your message here…",
    startersLabel: "Sentence starters",
    send: "Send",
    discard: "Discard",
    sentKicker: "Message sent",
    doneTitle: "You noticed a scheduling conflict before it became a problem.",
    doneBody: "Renata got your note about the huddle landing on your day off. Checking your calendar against your schedule, every time, stops you from coming in on a day you didn't plan to work.",
    badgeName: "Handle a meeting invite correctly",
    badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
    askPerson: "Ask a person instead",
  },
  es: {
    heading: "Calendario",
    helpBtn: "Ayúdame con este paso",
    langBtn: "English",
    create: "Crear",
    todayBtn: "Hoy",
    searchPlaceholder: "Buscar personas",
    myCalendars: "Mis calendarios",
    workShifts: "Turnos",
    cafeCalendar: "Harborside Cafe",
    monthLabel: monthLabel(HUDDLE_DAY, "es"),
    viewDay: "Día",
    viewWeek: "Semana",
    viewMonth: "Mes",
    weekdayLabels: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
    invitedBy: "Organizador",
    scheduleNote: "No tienes turno ese día.",
    going: "¿Asistirás?",
    accept: "Sí",
    no: "No",
    maybe: "Quizá",
    proposeTime: "Proponer otro horario",
    whatTime: "¿Qué hora te funciona?",
    to: "Para",
    subjectLabel: "Asunto",
    subject: "Re: Reunión semanal de líderes. ¿Otro horario?",
    writeHere: "Escribe tu mensaje aquí…",
    startersLabel: "Frases de ayuda",
    send: "Enviar",
    discard: "Descartar",
    sentKicker: "Mensaje enviado",
    doneTitle: "Notaste un conflicto de horario antes de que fuera un problema.",
    doneBody: "Renata recibió tu nota sobre la reunión en tu día libre. Revisar tu calendario contra tu horario, siempre, evita que vengas a trabajar un día que no planeabas.",
    badgeName: "Manejar una invitación a una reunión correctamente",
    badgeWhere: "Cuenta para: Oficina · Servicio de alimentos",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
    askPerson: "Mejor preguntar a una persona",
  },
};

/** Said only after a wrong answer: this is where the lesson gives the conclusion. */
export const WRONG_ACCEPT_HINT: Record<Lang, string> = {
  en: `Look at your green work shifts. ${HUDDLE_LONG.en} has no shift. That is your day off (a day you do not work). Click Propose a new time. It means: ask for a different time.`,
  es: `Mira tus turnos verdes. El ${HUDDLE_LONG.es} no tiene turno. Es tu día libre (un día que no trabajas). Haz clic en Proponer otro horario. Quiere decir: pedir otro horario.`,
};

/**
 * Frames with blanks, not finished answers: one click plus Send must not
 * pass. The learner still has to read the calendar to fill the day and time.
 */
export const STARTERS: Record<Lang, string[]> = {
  en: [
    "Hi Renata, I do not work on ___.",
    "Could we meet on ___ at ___?",
    "I can also join by phone, if that is better.",
    "Let me know what works. Thank you.",
  ],
  es: [
    "Hola Renata, el ___ no trabajo.",
    "¿Podemos reunirnos el ___ a las ___?",
    "También me puedo unir por teléfono, si es mejor.",
    "Avísame qué te funciona. Gracias.",
  ],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Reading a meeting invite",
      s: [
        "Look at the day and time of the meeting, not only who sent it.",
        "Look at your shifts. Green shows the days you work. A day with no green shift is a day off.",
        "If the meeting is on a day you do not work, do not just say yes. Ask for a different time.",
      ],
      tip: "It is the same skill as checking a work schedule.",
    },
    {
      t: "Proposing a different time",
      s: [
        "Say that the time does not work, and why.",
        "Say a day you work and a time in your shift. For example: Friday at 11 AM.",
        "Propose a new time means: ask for a different day and time.",
        "Keep it short. One or two sentences is enough.",
      ],
      tip: "You do not need to fix the whole schedule. A clear message is enough.",
    },
  ],
  es: [
    {
      t: "Leer una invitación a una reunión",
      s: [
        "Mira el día y la hora de la reunión, no solo quién la envió.",
        "Mira tus turnos. El verde muestra los días que trabajas. Un día sin turno verde es un día libre.",
        "Si la reunión es un día que no trabajas, no digas que sí sin más. Pide otro horario.",
      ],
      tip: "Es la misma habilidad que revisar un horario de trabajo.",
    },
    {
      t: "Proponer otro horario",
      s: [
        "Di que ese horario no te funciona, y por qué.",
        "Di un día que trabajas y una hora dentro de tu turno. Por ejemplo: el viernes a las 11 AM.",
        "Proponer otro horario quiere decir: pedir otro día y otra hora.",
        "Que sea corto. Una o dos oraciones son suficientes.",
      ],
      tip: "No tienes que arreglar todo el horario. Un mensaje claro es suficiente.",
    },
  ],
};

/** The persistent "what to do right now" line, one per step of this job. */
export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: `Find the meeting on ${HUDDLE_LONG.en}. Click it.`,
    es: `Busca la reunión del ${HUDDLE_LONG.es}. Haz clic en ella.`,
  },
  // Ask for a comparison. The conclusion comes only as a
  // correction after a wrong choice (WRONG_ACCEPT_HINT).
  { en: "Compare the meeting date with your work shifts. Answer the invitation.", es: "Compara la fecha de la reunión con tus turnos. Responde a la invitación." },
  { en: "Write Renata a day and time when you work. Then click Send.", es: "Escribe a Renata un día y una hora en que trabajas. Después haz clic en Enviar." },
];

/** A shift's start and end, so a chip on the calendar says "Shift 10 AM–6 PM", like the info card. */
export function shiftSpanFor(start: string): string {
  const block = shiftBlockFor(start);
  return block ? shiftSpan(block) : start;
}

export const SHIFT_WORD: Localized = { en: "Shift", es: "Turno" };

// --- Grading the reply ------------------------------------------------------
// The reply must name a day the learner works in the week of the huddle and a
// time. Kept here as pure functions so the phrase table can test them.

/**
 * The week of the huddle (Sep 14–20, 2026), by weekday (0 = Sunday). Start
 * and end hours on a 24-hour clock; null is a day off. Matches SHIFT_TIMES in
 * story-dates.ts (a test keeps them in step).
 */
export const HUDDLE_WEEK_SHIFTS: ({ start: number; end: number } | null)[] = [
  null, // Sun 20
  { start: 7, end: 15 }, // Mon 14
  { start: 7, end: 15 }, // Tue 15
  null, // Wed 16: the huddle
  { start: 10, end: 18 }, // Thu 17
  { start: 10, end: 18 }, // Fri 18
  { start: 8, end: 16 }, // Sat 19
];

/** The Monday of the huddle week, as a story day. */
export const HUDDLE_WEEK_MONDAY = mondayOf(HUDDLE_DAY);

const DAY_NAMES: Record<Lang, string[]> = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
};

const DAY_PATTERNS: RegExp[] = [
  /\bsun(day)?\b|\bdomingo\b/g,
  /\bmon(day)?\b|\blunes\b/g,
  /\btue(s|sday)?\b|\btu?e?sday\b|\bmartes\b/g,
  /\bwed(s|nesday)?\b|\bwe?n\w*day\b|\bmiercoles\b|\bmie\b/g,
  /\bthu(r|rs|rsday|sday)?\b|\bth\w*sday\b|\bjueves\b|\bjue\b/g,
  /\bfri(day)?\b|\bfriay\b|\bviernes\b|\bvie\b/g,
  /\bsat(urday)?\b|\bsabado\b|\bsab\b/g,
];

// A date the learner types ("Sep 17", "the 17th") is read in the huddle's
// month, September 2026.
const HUDDLE_MONTH_FIRST = HUDDLE_DAY - (storyDate(HUDDLE_DAY).getDate() - 1);
const huddleMonthWeekday = (day: number) => storyWeekday(HUDDLE_MONTH_FIRST + day - 1);

const DATE_PATTERNS: RegExp[] = [
  /\bsep(?:t(?:ember)?)?\.?\s*(\d{1,2})(?:st|nd|rd|th)?\b/g,
  /\b(\d{1,2})\s*(?:de\s+)?sept?iembre\b/g,
  /\b9\/(\d{1,2})\b/g,
  /\bthe\s+(\d{1,2})(?:st|nd|rd|th)\b/g,
  /\b(\d{1,2})(?:st|nd|rd|th)\b/g,
];

const NEGATION_BEFORE = /(\bnot\b|n't\b|\bcannot\b|\bno\b|\boff\b|\binstead of\b|\brather than\b|\ben vez del?\b|\ben lugar del?\b|\bnunca\b)/;
const NEGATION_AFTER = /^[\s,]*(?:is|es|=)?\s*(?:my|mi)?\s*(?:day off|dia libre|libre|off\b|not\b|isn't|is not|no\b|doesn't|does not|don't|do not)/;
// A new idea starts here, so an earlier "not" does not reach past it.
const CLAUSE_BREAK = /[.,;!?¿¡]|\bbut\b|\bpero\b|\bhow about\b|\bwhat about\b|\binstead\b|\bmaybe\b|\bcan we\b|\bcould we\b|\bpodemos\b|\bpodriamos\b|\bpuede ser\b/g;

function plain(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[’`]/g, "'");
}

type DayMention = { weekday: number; start: number; end: number; negated: boolean };

function dayMentions(t: string): DayMention[] {
  const found: { weekday: number; start: number; end: number }[] = [];
  DAY_PATTERNS.forEach((re, weekday) => {
    for (const m of t.matchAll(re)) found.push({ weekday, start: m.index!, end: m.index! + m[0].length });
  });
  for (const re of DATE_PATTERNS) {
    for (const m of t.matchAll(re)) {
      const day = Number(m[1]);
      if (day < 1 || day > 31) continue;
      if (found.some((f) => m.index! < f.end && f.start < m.index! + m[0].length)) continue;
      found.push({ weekday: huddleMonthWeekday(day), start: m.index!, end: m.index! + m[0].length });
    }
  }
  found.sort((a, b) => a.start - b.start);
  return found.map((f, i) => {
    let from = i > 0 ? found[i - 1].end : 0;
    for (const b of t.slice(0, f.start).matchAll(CLAUSE_BREAK)) from = Math.max(from, b.index! + b[0].length);
    const before = t.slice(Math.max(from, f.start - 40), f.start);
    const after = t.slice(f.end, f.end + 30);
    return { ...f, negated: NEGATION_BEFORE.test(before) || NEGATION_AFTER.test(after) };
  });
}

/** Removes dates so "Sep 17" is not read as 17 o'clock. */
function withoutDates(t: string): string {
  return DATE_PATTERNS.reduce((acc, re) => acc.replace(re, " "), t);
}

type TimeMention = { hour: number | null };

/** The first time of day in the text: an hour when there is one, or a part of the day. */
function timeMention(t: string): TimeMention | null {
  const s = withoutDates(t);
  const re = /\b(\d{1,2})(?!\d)(?::(\d{2}))?\s*(a\.?\s?m\b\.?|p\.?\s?m\b\.?|h\b|o'?clock|de la manana|de la tarde|de la noche|en la manana|en la tarde|por la manana|por la tarde)?/g;
  for (const m of s.matchAll(re)) {
    let hour = Number(m[1]);
    const minutes = m[2] ? Number(m[2]) : 0;
    const suffix = (m[3] ?? "").replace(/[^a-z]/g, "");
    if (hour > 23 || minutes > 59) continue;
    // A bare number counts as a time only after "at" / "a las", or with a clock word or a colon.
    if (!m[2] && !suffix && !/\b(at|a las|a la|around|by)\s*$/.test(s.slice(0, m.index))) continue;
    const pm = suffix.startsWith("pm") || /tarde|noche/.test(suffix);
    const am = suffix.startsWith("am") || /manana/.test(suffix);
    if (pm && hour < 12) hour += 12;
    else if (am && hour === 12) hour = 0;
    // No AM/PM: 1 to 6 means afternoon, the way people say it at work.
    else if (!am && !pm && hour >= 1 && hour <= 6) hour += 12;
    return { hour: hour + minutes / 60 };
  }
  if (/\b(noon|midday|mediodia)\b/.test(s)) return { hour: 12 };
  if (/\b(morning|afternoon|evening|lunch|la manana|la tarde|temprano|early|late)\b/.test(s)) return { hour: null };
  return null;
}

export type HuddleReplyProblem = "empty" | "blank" | "dayOff" | "noDay" | "noTime" | "outsideShift";
export type HuddleReplyCheck = { ok: true; weekday: number } | { ok: false; problem: HuddleReplyProblem; weekday?: number };

/**
 * Passes a reply that proposes a day the learner works and a time in that
 * shift. A day off (Wednesday, Sunday) only counts against the reply when it
 * is proposed: "I don't work Wednesday. Thursday at 10?" passes.
 */
export function checkHuddleReply(body: string): HuddleReplyCheck {
  const t = plain(body).trim();
  if (!t) return { ok: false, problem: "empty" };
  if (/_{2,}/.test(t)) return { ok: false, problem: "blank" };
  const proposed = dayMentions(t).filter((d) => !d.negated);
  const workday = proposed.find((d) => HUDDLE_WEEK_SHIFTS[d.weekday]);
  if (!workday) {
    const off = proposed.find((d) => !HUDDLE_WEEK_SHIFTS[d.weekday]);
    return off ? { ok: false, problem: "dayOff", weekday: off.weekday } : { ok: false, problem: "noDay" };
  }
  const time = timeMention(t);
  if (!time) return { ok: false, problem: "noTime", weekday: workday.weekday };
  const shift = HUDDLE_WEEK_SHIFTS[workday.weekday]!;
  if (time.hour !== null && (time.hour < shift.start || time.hour >= shift.end)) {
    return { ok: false, problem: "outsideShift", weekday: workday.weekday };
  }
  return { ok: true, weekday: workday.weekday };
}

/** Kept for callers that only ask "is there a day or time in it?". */
export function proposesATime(body: string): boolean {
  return checkHuddleReply(body).ok;
}

function clock(hour: number): string {
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h} ${hour < 12 ? "AM" : "PM"}`;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** The correction for a reply that did not pass. Names the missing part. */
export function huddleReplyHint(check: HuddleReplyCheck, lang: Lang): string {
  if (check.ok) return "";
  const day = check.weekday !== undefined ? DAY_NAMES[lang][check.weekday] : "";
  const shift = check.weekday !== undefined ? HUDDLE_WEEK_SHIFTS[check.weekday] : null;
  const en = lang === "en";
  switch (check.problem) {
    case "empty":
      return en ? "Write a short message first. Even one sentence is fine." : "Primero escribe un mensaje corto. Una oración está bien.";
    case "blank":
      return en ? "Fill in each ___ with your own words: a day you work and a time." : "Cambia cada ___ por tus palabras: un día que trabajas y una hora.";
    case "dayOff":
      return en
        ? `${day} is your day off. Name a day you work, and a time.`
        : `El ${day} es tu día libre. Di un día que trabajas y una hora.`;
    case "noDay":
      return en
        ? "Say which day. Name a day you work: a day with a green shift."
        : "Di qué día. Nombra un día que trabajas: un día con turno verde.";
    case "noTime":
      return en ? `Good day. Now add a time, like "${day} at 11 AM".` : `Buen día. Ahora agrega una hora, como "el ${day} a las 11 AM".`;
    case "outsideShift":
      return en
        ? `On ${day} you work ${clock(shift!.start)} to ${clock(shift!.end)}. Pick a time in your shift.`
        : `${cap(day)} trabajas de ${clock(shift!.start)} a ${clock(shift!.end)}. Elige una hora dentro de tu turno.`;
  }
}

/** Kept for the Story path's older wording. */
export const NEEDS_TIME_HINT: Localized = {
  en: "Say a day you work and a time for the meeting. You can click Thu 10:00 AM or Thu 2:00 PM.",
  es: "Di un día que trabajas y una hora para la reunión. Puedes hacer clic en Jue 10:00 AM o Jue 2:00 PM.",
};

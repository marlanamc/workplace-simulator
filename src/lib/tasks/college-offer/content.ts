import { acceptance, affirms, hasBlank, isQuestion, looksLikeRealText, mentionsTime, normalizeReply } from "@/lib/grading/meaning";
import type { EventIntroCopy, Lang, Lesson, Localized, SubmissionContent } from "@/lib/task-types";
import {
  SHIFT_BLOCKS,
  SPRING_TERM_NO_CLASS_DAY,
  SPRING_TERM_REGISTER_BY,
  SPRING_TERM_START,
  STORY_DAY_BY_LEVEL,
  WEEKDAY_SHORT,
  clockMinutes,
  longDate,
  shiftDashPeriod,
  storyWeekday,
  yearDate,
  type ShiftKind,
} from "@/lib/story-dates";

/**
 * Day 18 (level13): Harborside will pay for one spring class at Bunker Hill
 * Community College. Nothing on screen says which section works or that it
 * clashes with a shift. The learner reads HR's rules, compares the BHCC
 * schedule with their own spring shifts, asks Renata for a change, puts the
 * class on the calendar, and tells HR the section.
 *
 * Every rule below is a pure function so it can be tested without React.
 */

// ── Dates ───────────────────────────────────────────────────────────────

/** The offer arrives on the Assistant Manager's first Monday: October 12, 2026. */
export const OFFER_DAY = STORY_DAY_BY_LEVEL.level13;
/** BHCC's last day to register for spring: Friday, December 11, 2026. */
export const REGISTER_BY = SPRING_TERM_REGISTER_BY;
/** Martin Luther King Jr. Day, Monday, January 18, 2027. No classes. */
export const NO_CLASS_DAY = SPRING_TERM_NO_CLASS_DAY;
/** The first day of the Spring 2027 term: Tuesday, January 19, 2027. */
export const TERM_START = SPRING_TERM_START;
/** The Monday of the first week of the term, the week the calendar shows. */
export const TERM_WEEK_MONDAY = NO_CLASS_DAY;

// ── The learner's spring shifts ─────────────────────────────────────────

/** 1 = Monday … 6 = Saturday, 0 = Sunday (as `Date.getDay()`). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface WeeklyShift {
  weekday: Weekday;
  kind: ShiftKind;
}

/**
 * The Assistant Manager's spring schedule. It repeats every week. Tuesday is
 * a close, as it was in the fall; Thursday is off. Nothing here says which
 * class section it clashes with. The learner compares it with the schedule.
 */
export const SPRING_SHIFTS: readonly WeeklyShift[] = [
  { weekday: 1, kind: "open" },
  { weekday: 2, kind: "close" },
  { weekday: 3, kind: "open" },
  { weekday: 5, kind: "close" },
  { weekday: 6, kind: "weekend" },
];

/**
 * The schedule after Renata approves the change: Tuesday becomes an open, and
 * the close moves to Thursday. Same hours in the week.
 */
export const APPROVED_SHIFTS: readonly WeeklyShift[] = [
  { weekday: 1, kind: "open" },
  { weekday: 2, kind: "open" },
  { weekday: 3, kind: "open" },
  { weekday: 4, kind: "close" },
  { weekday: 5, kind: "close" },
  { weekday: 6, kind: "weekend" },
];

export function shiftsFor(approved: boolean): readonly WeeklyShift[] {
  return approved ? APPROVED_SHIFTS : SPRING_SHIFTS;
}

export const SHIFT_NAMES: Record<ShiftKind, Localized> = {
  open: { en: "Open", es: "Apertura" },
  mid: { en: "Mid", es: "Medio turno" },
  weekend: { en: "Shift", es: "Turno" },
  late: { en: "Late", es: "Tarde" },
  close: { en: "Close", es: "Cierre" },
};

/** "4–10 PM", "7 AM–3 PM": the chip label for a shift. */
export function shiftLabel(kind: ShiftKind): string {
  return shiftDashPeriod(SHIFT_BLOCKS[kind]);
}

// ── The BHCC schedule ───────────────────────────────────────────────────

export type SectionKey = "01" | "02" | "03";

export interface ClassSection {
  key: SectionKey;
  crn: string;
  weekdays: Weekday[];
  start: string;
  end: string;
  mode: Localized;
  where: Localized;
  seatsOpen: number;
  capacity: number;
  waitlist: number;
}

export const SECTIONS: readonly ClassSection[] = [
  {
    key: "01",
    crn: "20314",
    weekdays: [1, 3],
    start: "9:00 AM",
    end: "10:15 AM",
    mode: { en: "In person", es: "En persona" },
    where: { en: "Charlestown Campus, B-212", es: "Campus Charlestown, B-212" },
    seatsOpen: 12,
    capacity: 30,
    waitlist: 0,
  },
  {
    key: "02",
    crn: "20327",
    weekdays: [2],
    start: "5:00 PM",
    end: "7:45 PM",
    mode: { en: "In person", es: "En persona" },
    where: { en: "Chelsea Campus, Room 104", es: "Campus Chelsea, salón 104" },
    seatsOpen: 6,
    capacity: 30,
    waitlist: 0,
  },
  {
    key: "03",
    crn: "20352",
    weekdays: [4],
    start: "6:00 PM",
    end: "8:45 PM",
    mode: { en: "Online, live", es: "En línea, en vivo" },
    where: { en: "Zoom", es: "Zoom" },
    seatsOpen: 0,
    capacity: 30,
    waitlist: 4,
  },
];

/** The section that can work: it has seats, and one shift change makes it fit. */
export const RIGHT_SECTION: SectionKey = "02";

export function sectionByKey(key: string | null): ClassSection | undefined {
  return SECTIONS.find((s) => s.key === key);
}

/** "Mon/Wed" / "Lun/Mié". */
export function sectionDays(section: ClassSection, lang: Lang): string {
  return section.weekdays.map((d) => WEEKDAY_SHORT[lang][d]).join("/");
}

/** "5:00–7:45 PM", "9:00–10:15 AM". */
export function sectionTime(section: ClassSection): string {
  const a = section.start.slice(-2);
  const b = section.end.slice(-2);
  return a === b ? `${section.start.slice(0, -3)}–${section.end}` : `${section.start}–${section.end}`;
}

/** The weekdays a section meets during one of these shifts. */
export function sectionClashes(section: ClassSection, shifts: readonly WeeklyShift[]): Weekday[] {
  const from = clockMinutes(section.start);
  const to = clockMinutes(section.end);
  return section.weekdays.filter((day) =>
    shifts.some((s) => {
      if (s.weekday !== day) return false;
      const block = SHIFT_BLOCKS[s.kind];
      return from < clockMinutes(block.end) && clockMinutes(block.start) < to;
    }),
  );
}

export type SectionVerdict = "ok" | "full" | "clashes";

/**
 * Which section can work, read from the schedule and the shifts. A full
 * section is out: a waitlist is not a seat. A section that meets during two
 * shifts a week is out: that is two changes, every week. Section 02 has
 * seats and meets during one shift, which one approved change can fix.
 */
export function sectionVerdict(key: string): SectionVerdict {
  const section = sectionByKey(key);
  if (!section) return "clashes";
  if (section.seatsOpen === 0) return "full";
  return sectionClashes(section, SPRING_SHIFTS).length > 1 ? "clashes" : "ok";
}

/** What the Job Card says after a pick that cannot work. Only after the try. */
export const SECTION_CORRECTIONS: Record<Exclude<SectionVerdict, "ok">, Localized> = {
  full: {
    en: "Section 03 is full. It has 0 seats open. A waitlist is not a seat, so you may not get in before the term starts. Look for a section with open seats.",
    es: "La sección 03 está llena. Tiene 0 lugares libres. Una lista de espera no es un lugar, y puede que no entres antes de que empiece el semestre. Busca una sección con lugares libres.",
  },
  clashes: {
    en: "Section 01 meets Monday and Wednesday, 9:00 to 10:15 AM. Look at your calendar: you open the cafe those mornings, 7 AM to 3 PM. That is two shifts every week. Look for a section that is easier to fit.",
    es: "La sección 01 es lunes y miércoles, de 9:00 a 10:15 AM. Mira tu calendario: abres el café esas mañanas, de 7 AM a 3 PM. Son dos turnos cada semana. Busca una sección más fácil de acomodar.",
  },
};

export function sectionCorrection(key: string): Localized | null {
  const verdict = sectionVerdict(key);
  if (verdict === "ok") return null;
  return SECTION_CORRECTIONS[verdict];
}

// ── The message to Renata ───────────────────────────────────────────────

/** Names the class day or the class time: "Tuesday", "Tue", "martes", "5 PM", "7:45". */
export function namesClassTime(body: string): boolean {
  const t = normalizeReply(body);
  if (/\b(tuesdays?|tues?|martes)\b/.test(t)) return true;
  return mentionsTime(t, 5) || mentionsTime(t, 7, 45) || mentionsTime(t, 17);
}

/**
 * A request, in honest beginner English or Spanish: a question ("Can I
 * change my shift?"), please, or I need / I want / I would like a change.
 * "I don't want to change" is not a request.
 */
const REQUEST =
  /\b(please|pls|por favor|can (i|we|you|someone)|could (i|we|you|someone)|may i|is it (ok|okay|possible)|would it be (ok|okay|possible)|(i )?(would like|'d like|want|need|ask|asking|request|requesting)( to)?( [\w']+){0,3} (change|move|switch|swap|trade|off|cover|different|another|new)|change my|move my|switch my|swap my|puedo|podemos|podria|podrias|puedes|puede|quisiera|me gustaria|necesito( [\w']+){0,3} (cambiar|cambio|mover|libre)|quiero( [\w']+){0,3} (cambiar|cambio|mover)|pido|solicito|es posible|cambiar mi|mover mi|cambiarme)\b/;

export function makesRequest(body: string): boolean {
  const t = normalizeReply(body);
  if (!looksLikeRealText(t, 2)) return false;
  return isQuestion(t) || affirms(t, REQUEST);
}

export type RenataVerdict = "ok" | "empty" | "blank" | "no-class-time" | "no-request";

/**
 * Renata makes the schedule, so the message has two jobs: say when the class
 * is (the day or the time), and ask for a change. Spelling does not matter.
 */
export function renataRequestVerdict(body: string): RenataVerdict {
  if (!body.trim()) return "empty";
  if (hasBlank(body)) return "blank";
  if (!namesClassTime(body)) return "no-class-time";
  if (!makesRequest(body)) return "no-request";
  return "ok";
}

export const RENATA_CORRECTIONS: Record<Exclude<RenataVerdict, "ok">, Localized> = {
  empty: {
    en: "Write a short message first. Even one sentence is fine.",
    es: "Primero escribe un mensaje corto. Una oración está bien.",
  },
  blank: {
    en: "Fill in the blank (___) before you send.",
    es: "Completa el espacio (___) antes de enviar.",
  },
  "no-class-time": {
    en: "Tell Renata when your class meets, the day or the time. Then she knows which shift is the problem.",
    es: "Dile a Renata cuándo es tu clase, el día o la hora. Así sabe qué turno es el problema.",
  },
  "no-request": {
    en: "Ask Renata for the change. For example: Can I change my shift?",
    es: "Pídele el cambio a Renata. Por ejemplo: ¿Puedo cambiar mi turno?",
  },
};

/** Sent to HR by mistake: HR pays, but the manager makes the schedule. */
export const SHIFT_REQUEST_TO_HR: Localized = {
  en: "HR pays for the class, but Renata makes the schedule. Send the shift question to Renata.",
  es: "RR.HH. paga la clase, pero Renata hace el horario. Envíale la pregunta del turno a Renata.",
};

// ── The reply to HR ─────────────────────────────────────────────────────

const NUMBER_WORDS: Record<SectionKey, string> = { "01": "0?1|one|uno", "02": "0?2|two|dos", "03": "0?3|three|tres" };

/** Names this section: "Section 02", "section 2", "sec. two", "#2", "02", or its CRN. */
export function namesSection(body: string, key: SectionKey): boolean {
  const t = normalizeReply(body);
  const section = sectionByKey(key);
  if (section && new RegExp(`(?<!\\d)${section.crn}(?!\\d)`).test(t)) return true;
  const n = NUMBER_WORDS[key];
  const labeled = new RegExp(`(?:\\b(?:section|seccion|sec|class|clase|number|numero|num)\\.?\\s*#?\\s*|#\\s*)(?:${n})(?![\\d:.]?\\d)\\b`);
  if (labeled.test(t)) return true;
  return new RegExp(`(?<![\\d:.$/-])${key}(?![\\d:/-])`).test(t);
}

export type HrReplyVerdict = "ok" | "empty" | "blank" | "declines" | "unsure" | "no-answer" | "no-section" | "wrong-section";

/**
 * The reply HR asked for: a clear yes, and the section. "I do not accept"
 * does not accept, however many times it says "accept". Naming a section
 * that cannot work (01, or the full 03) is not the section.
 */
export function hrReplyVerdict(body: string): HrReplyVerdict {
  if (!body.trim()) return "empty";
  if (hasBlank(body)) return "blank";
  const answer = acceptance(body);
  if (answer === "declines") return "declines";
  if (answer === "unsure") return "unsure";
  if (answer !== "accepts") return "no-answer";
  if (namesSection(body, RIGHT_SECTION)) return "ok";
  if (namesSection(body, "01") || namesSection(body, "03")) return "wrong-section";
  return "no-section";
}

/** Only the yes-or-no half: does this reply accept the offer? */
export function replyAcceptsOffer(body: string): boolean {
  return acceptance(body) === "accepts";
}

export const HR_REPLY_CORRECTIONS: Record<Exclude<HrReplyVerdict, "ok">, Localized> = {
  empty: RENATA_CORRECTIONS.empty,
  blank: RENATA_CORRECTIONS.blank,
  declines: {
    en: "Your reply says no. To take the class, say you accept.",
    es: "Tu respuesta dice que no. Para tomar la clase, di que aceptas.",
  },
  unsure: {
    en: "Give a clear answer. Say yes, you accept the offer.",
    es: "Da una respuesta clara. Di que sí, que aceptas la oferta.",
  },
  "no-answer": {
    en: "Say that you accept the offer. For example: Thank you. I accept.",
    es: "Di que aceptas la oferta. Por ejemplo: Gracias. Acepto.",
  },
  "no-section": {
    en: "HR asked for the section you will take. Write the section number or the CRN.",
    es: "RR.HH. pidió la sección que vas a tomar. Escribe el número de sección o el CRN.",
  },
  "wrong-section": {
    en: "That section does not work for you. Name the section you chose in the BHCC schedule.",
    es: "Esa sección no te funciona. Escribe la sección que elegiste en el horario de BHCC.",
  },
};

// ── The calendar event ──────────────────────────────────────────────────

export interface ClassEventInput {
  title: string;
  weekday: string;
  start: string;
  end: string;
  startsOn: string;
  repeats: boolean;
}

export const EVENT_WEEKDAYS: Weekday[] = [1, 2, 3, 4, 5, 6];
export const EVENT_STARTS = ["9:00 AM", "4:00 PM", "5:00 PM", "6:00 PM"] as const;
export const EVENT_ENDS = ["10:15 AM", "7:00 PM", "7:45 PM", "8:45 PM", "10:00 PM"] as const;
/** Story days offered as the first day. Only the first Tuesday of the term is right. */
export const EVENT_START_DAYS = [REGISTER_BY, NO_CLASS_DAY, TERM_START, TERM_START + 7] as const;

export type ClassEventVerdict = "ok" | "title" | "other-section" | "day" | "time" | "deadline" | "holiday" | "late-start" | "starts" | "repeats";

/** The class the learner chose, on the calendar: Tuesday 5:00–7:45 PM, weekly, from January 19, 2027. */
export function classEventVerdict(input: ClassEventInput): ClassEventVerdict {
  if (!looksLikeRealText(input.title)) return "title";
  const section = sectionByKey(RIGHT_SECTION)!;
  const other = SECTIONS.find(
    (s) => s.key !== RIGHT_SECTION && s.weekdays.includes(Number(input.weekday) as Weekday) && s.start === input.start,
  );
  if (other) return "other-section";
  if (!section.weekdays.includes(Number(input.weekday) as Weekday)) return "day";
  if (input.start !== section.start || input.end !== section.end) return "time";
  const first = Number(input.startsOn);
  if (first === REGISTER_BY) return "deadline";
  if (first === NO_CLASS_DAY) return "holiday";
  if (first > TERM_START && storyWeekday(first) === 2) return "late-start";
  if (first !== TERM_START) return "starts";
  if (!input.repeats) return "repeats";
  return "ok";
}

export const EVENT_CORRECTIONS: Record<Exclude<ClassEventVerdict, "ok">, Localized> = {
  title: {
    en: "Give the event a name, like the class name.",
    es: "Ponle un nombre al evento, como el nombre de la clase.",
  },
  "other-section": {
    en: "That is the time of another section. Put the section you chose on your calendar.",
    es: "Esa es la hora de otra sección. Pon en tu calendario la sección que elegiste.",
  },
  day: {
    en: "Check the day. Look at your section in the BHCC schedule.",
    es: "Revisa el día. Mira tu sección en el horario de BHCC.",
  },
  time: {
    en: "Check the start and end time. Look at your section in the BHCC schedule.",
    es: "Revisa la hora de inicio y de fin. Mira tu sección en el horario de BHCC.",
  },
  deadline: {
    en: "December 11 is the last day to register. Classes start later. Look at the BHCC schedule for the first day of classes.",
    es: "El 11 de diciembre es el último día para inscribirte. Las clases empiezan después. Mira en el horario de BHCC el primer día de clases.",
  },
  holiday: {
    en: "January 18 is a Monday, and BHCC has no classes that day. Your class meets on a different day.",
    es: "El 18 de enero es lunes, y BHCC no tiene clases ese día. Tu clase es otro día.",
  },
  "late-start": {
    en: "That is the second week. Start on the first class, so you do not miss it.",
    es: "Esa es la segunda semana. Empieza en la primera clase, para no perderla.",
  },
  starts: {
    en: "Check the first day. Look at the BHCC schedule for the first day of classes.",
    es: "Revisa el primer día. Mira en el horario de BHCC el primer día de clases.",
  },
  repeats: {
    en: "The class meets every week. Check Repeats weekly.",
    es: "La clase es cada semana. Marca Se repite cada semana.",
  },
};

// ── Progress ────────────────────────────────────────────────────────────

export interface OfferProgress {
  offerRead: boolean;
  section: string | null;
  renataSent: boolean;
  eventSaved: boolean;
  hrSent: boolean;
}

/** The Job Card step: the first thing not done yet, in the order a careful person works. */
export function stepIndexFor(p: OfferProgress): number {
  if (!p.offerRead) return 0;
  if (p.section !== RIGHT_SECTION) return 1;
  if (!p.renataSent) return 2;
  if (!p.eventSaved) return 3;
  return 4;
}

export type OfferGap = "section" | "renata" | "event" | "hr";

/** What still stands between the learner and the finish, or null when all four are done. */
export function offerGap(p: OfferProgress): OfferGap | null {
  if (p.section !== RIGHT_SECTION) return "section";
  if (!p.renataSent) return "renata";
  if (!p.eventSaved) return "event";
  if (!p.hrSent) return "hr";
  return null;
}

/** The Job Card's line when Finish is pressed too early. */
export const GAP_CORRECTIONS: Record<OfferGap, Localized> = {
  section: {
    en: "Choose a section in the BHCC schedule first.",
    es: "Primero elige una sección en el horario de BHCC.",
  },
  renata: {
    en: "Compare your section with your shifts in Calendar. Then read the offer's rules again.",
    es: "Compara tu sección con tus turnos en Calendar. Luego lee otra vez las reglas de la oferta.",
  },
  event: {
    en: "Put your class on your calendar first.",
    es: "Primero pon tu clase en tu calendario.",
  },
  hr: {
    en: "Reply to HR's offer first.",
    es: "Primero responde a la oferta de RR.HH.",
  },
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
/** Neutral: each line names the job, never the answer. */
export const RIGHT_NOW_STEPS: Localized[] = [
  { en: "Read HR's offer.", es: "Lee la oferta de RR.HH." },
  { en: "Find a class section that can work.", es: "Encuentra una sección de la clase que pueda funcionar." },
  { en: "Check your section against your shifts and the offer's rules.", es: "Compara tu sección con tus turnos y con las reglas de la oferta." },
  { en: "Plan your calendar.", es: "Organiza tu calendario." },
  { en: "Reply to HR.", es: "Responde a RR.HH." },
];

// ── Copy ────────────────────────────────────────────────────────────────

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "🎓",
    kicker: "Monday. The offer is in.",
    headline: "Harborside will pay for a class.",
    body: "Read the offer. Then find a class that works with your job.",
    cta: "Read the offer",
  },
  es: {
    emoji: "🎓",
    kicker: "Lunes. Ya está la oferta.",
    headline: "Harborside pagará una clase.",
    body: "Lee la oferta. Luego encuentra una clase que funcione con tu trabajo.",
    cta: "Leer la oferta",
  },
};

/** HR's offer. The rules, never the answer. */
export const OFFER_LETTER: Record<Lang, { intro: string; rulesHeading: string; rules: string[]; link: string; linkBody: string; signoff: string }> = {
  en: {
    intro: "Congratulations on your new role. Harborside Cafe will pay the tuition for one Business Essentials class (BUS 101) at Bunker Hill Community College in the Spring 2027 term.",
    rulesHeading: "The rules:",
    rules: [
      `Register by ${longDate(REGISTER_BY, "en")}, ${yearDate(REGISTER_BY, "en").split(", ")[1]}.`,
      "The class cannot be during your scheduled shifts, unless your manager approves a shift change.",
      "Keep a passing grade (C or better).",
      "Reply to this email with the section you will take.",
    ],
    link: "BHCC Spring 2027 schedule: BUS 101",
    linkBody: "The spring sections are here.",
    signoff: "Harborside HR",
  },
  es: {
    intro: "Felicitaciones por tu nuevo puesto. Harborside Cafe pagará la matrícula de una clase de Business Essentials (BUS 101) en Bunker Hill Community College en el semestre de primavera 2027.",
    rulesHeading: "Las reglas:",
    rules: [
      `Inscríbete a más tardar el ${longDate(REGISTER_BY, "es")} de ${yearDate(REGISTER_BY, "es").split(" de ").pop()}.`,
      "La clase no puede ser durante tus turnos, a menos que tu gerente apruebe un cambio de turno.",
      "Mantén una nota de aprobado (C o más).",
      "Responde a este correo con la sección que vas a tomar.",
    ],
    link: "Horario de BHCC primavera 2027: BUS 101",
    linkBody: "Aquí están las secciones de primavera.",
    signoff: "RR.HH. de Harborside",
  },
};

/** The BHCC schedule page's own words. */
export const SCHEDULE_COPY: Record<Lang, {
  college: string;
  title: string;
  course: string;
  facts: string[];
  cols: { section: string; crn: string; days: string; time: string; mode: string; where: string; seats: string; pick: string };
  seatsOf: (open: number, cap: number) => string;
  full: string;
  waitlist: (n: number) => string;
  pick: string;
  picked: string;
}> = {
  en: {
    college: "Bunker Hill Community College",
    title: "Course Schedule · Spring 2027",
    course: "BUS 101 · Business Essentials · 3 credits",
    facts: [
      `Last day to register: ${longDate(REGISTER_BY, "en")}, 2026`,
      `First day of classes: ${longDate(TERM_START, "en")}, 2027`,
      `No classes: ${longDate(NO_CLASS_DAY, "en")} (Martin Luther King Jr. Day)`,
    ],
    cols: { section: "Section", crn: "CRN", days: "Days", time: "Time", mode: "Format", where: "Where", seats: "Seats open", pick: "" },
    seatsOf: (open, cap) => `${open} of ${cap}`,
    full: "Full",
    waitlist: (n) => `Waitlist: ${n}`,
    pick: "Select",
    picked: "Selected",
  },
  es: {
    college: "Bunker Hill Community College",
    title: "Horario de clases · Primavera 2027",
    course: "BUS 101 · Business Essentials · 3 créditos",
    facts: [
      `Último día para inscribirte: ${longDate(REGISTER_BY, "es")} de 2026`,
      `Primer día de clases: ${longDate(TERM_START, "es")} de 2027`,
      `Sin clases: ${longDate(NO_CLASS_DAY, "es")} (Día de Martin Luther King Jr.)`,
    ],
    cols: { section: "Sección", crn: "CRN", days: "Días", time: "Hora", mode: "Formato", where: "Lugar", seats: "Lugares libres", pick: "" },
    seatsOf: (open, cap) => `${open} de ${cap}`,
    full: "Llena",
    waitlist: (n) => `Lista de espera: ${n}`,
    pick: "Elegir",
    picked: "Elegida",
  },
};

/** Renata's answer once she has the request. Information, not instruction. */
export const RENATA_REPLY: Record<Lang, { subject: string; body: string[] }> = {
  en: {
    subject: "Re: Spring schedule",
    body: [
      "Thanks for asking before registration closes.",
      `Yes, I approve the change. Starting the week of ${longDate(TERM_WEEK_MONDAY, "en").split(", ")[1]}, you open on Tuesdays, ${shiftLabel("open")}. You close on Thursdays instead, ${shiftLabel("close")}.`,
      "I updated your calendar.",
    ],
  },
  es: {
    subject: "Re: Horario de primavera",
    body: [
      "Gracias por preguntar antes de que cierre la inscripción.",
      `Sí, apruebo el cambio. Desde la semana del ${longDate(TERM_WEEK_MONDAY, "es").replace(/^\S+ /, "")}, abres los martes, ${shiftLabel("open")}. Y cierras los jueves, ${shiftLabel("close")}.`,
      "Ya actualicé tu calendario.",
    ],
  },
};

export const COLLEGE_OFFER_COPY: Record<Lang, {
  appHome: string;
  appMail: string;
  appSchedule: string;
  appCalendar: string;
  hubHeading: string;
  mailTitle: string;
  mailBody: string;
  mailCta: string;
  schedTitle: string;
  schedBody: string;
  schedCta: string;
  calTitle: string;
  calBody: string;
  calCta: string;
  finishCta: string;
  inbox: string;
  compose: string;
  from: string;
  subject: string;
  toMe: string;
  reply: string;
  to: string;
  chooseTo: string;
  subjectLabel: string;
  subjectPh: string;
  writeHere: string;
  send: string;
  discard: string;
  back: string;
  sentLabel: string;
  weekHeading: string;
  weekNote: string;
  addEvent: string;
  eventHeading: string;
  eventTitleLabel: string;
  eventTitlePh: string;
  dayLabel: string;
  startLabel: string;
  endLabel: string;
  firstDayLabel: string;
  choose: string;
  repeatsLabel: string;
  saveEvent: string;
  cancel: string;
  classChip: string;
  repeatsEvery: string;
  close: string;
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
  submissionRenata: string;
  submissionHr: string;
}> = {
  en: {
    appHome: "Offer",
    appMail: "Mail",
    appSchedule: "BHCC Schedule",
    appCalendar: "Calendar",
    hubHeading: "A class paid by Harborside",
    mailTitle: "Mail",
    mailBody: "HR's offer and your messages.",
    mailCta: "Open Mail",
    schedTitle: "BHCC Spring 2027 schedule",
    schedBody: "The BUS 101 sections for spring.",
    schedCta: "Open the schedule",
    calTitle: "Calendar",
    calBody: "Your work shifts for the spring.",
    calCta: "Open Calendar",
    finishCta: "Finish",
    inbox: "Inbox",
    compose: "Compose",
    from: "Harborside HR",
    subject: "Tuition offer: one spring class at BHCC",
    toMe: "to me",
    reply: "Reply",
    to: "To",
    chooseTo: "Choose a person",
    subjectLabel: "Subject",
    subjectPh: "Subject",
    writeHere: "Write your message…",
    send: "Send",
    discard: "Discard",
    back: "Back",
    sentLabel: "Sent",
    weekHeading: `Week of ${longDate(TERM_WEEK_MONDAY, "en").split(", ")[1]}, 2027`,
    weekNote: "Your spring shifts. They repeat every week.",
    addEvent: "Create event",
    eventHeading: "New event",
    eventTitleLabel: "Title",
    eventTitlePh: "Add a title",
    dayLabel: "Day",
    startLabel: "Starts",
    endLabel: "Ends",
    firstDayLabel: "First day",
    choose: "Choose",
    repeatsLabel: "Repeats weekly",
    saveEvent: "Save",
    cancel: "Cancel",
    classChip: "Class",
    repeatsEvery: "Repeats every week",
    close: "Close",
    sentKicker: "Class planned",
    doneTitle: "You found a class that works with your job.",
    doneBody: "You chose Section 02, a section with open seats. You asked Renata to change the shift on your class day before registration closes. You put the class on your calendar every week from January 19. You told HR you accept, and which section you will take.",
    badgeName: "Choose a class section and plan work around it",
    badgeWhere: "Counts toward: Assistant Manager",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
    submissionRenata: "Message to Renata",
    submissionHr: "Reply to HR",
  },
  es: {
    appHome: "Oferta",
    appMail: "Correo",
    appSchedule: "Horario BHCC",
    appCalendar: "Calendar",
    hubHeading: "Una clase pagada por Harborside",
    mailTitle: "Correo",
    mailBody: "La oferta de RR.HH. y tus mensajes.",
    mailCta: "Abrir Correo",
    schedTitle: "Horario de BHCC primavera 2027",
    schedBody: "Las secciones de BUS 101 para la primavera.",
    schedCta: "Abrir el horario",
    calTitle: "Calendar",
    calBody: "Tus turnos de trabajo para la primavera.",
    calCta: "Abrir Calendar",
    finishCta: "Terminar",
    inbox: "Recibidos",
    compose: "Redactar",
    from: "RR.HH. de Harborside",
    subject: "Oferta de matrícula: una clase de primavera en BHCC",
    toMe: "para mí",
    reply: "Responder",
    to: "Para",
    chooseTo: "Elige una persona",
    subjectLabel: "Asunto",
    subjectPh: "Asunto",
    writeHere: "Escribe tu mensaje…",
    send: "Enviar",
    discard: "Descartar",
    back: "Volver",
    sentLabel: "Enviado",
    weekHeading: `Semana del ${longDate(TERM_WEEK_MONDAY, "es").replace(/^\S+ /, "")} de 2027`,
    weekNote: "Tus turnos de primavera. Se repiten cada semana.",
    addEvent: "Crear evento",
    eventHeading: "Evento nuevo",
    eventTitleLabel: "Título",
    eventTitlePh: "Agrega un título",
    dayLabel: "Día",
    startLabel: "Empieza",
    endLabel: "Termina",
    firstDayLabel: "Primer día",
    choose: "Elige",
    repeatsLabel: "Se repite cada semana",
    saveEvent: "Guardar",
    cancel: "Cancelar",
    classChip: "Clase",
    repeatsEvery: "Se repite cada semana",
    close: "Cerrar",
    sentKicker: "Clase organizada",
    doneTitle: "Encontraste una clase que funciona con tu trabajo.",
    doneBody: "Elegiste la sección 02, una sección con lugares libres. Le pediste a Renata que cambie el turno del día de tu clase antes de que cierre la inscripción. Pusiste la clase en tu calendario cada semana desde el 19 de enero. Le dijiste a RR.HH. que aceptas y qué sección vas a tomar.",
    badgeName: "Elegir una sección de clase y organizar el trabajo alrededor",
    badgeWhere: "Cuenta para: Assistant Manager",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
    submissionRenata: "Mensaje a Renata",
    submissionHr: "Respuesta a RR.HH.",
  },
};

/** Starters leave the facts blank, so the first try is the learner's own reading. */
export const HR_STARTERS: Record<Lang, string[]> = {
  en: [
    "Thank you for the offer. I accept.",
    "I will take Section ___ (CRN ___).",
    "I will register before the deadline.",
  ],
  es: [
    "Gracias por la oferta. Acepto.",
    "Voy a tomar la sección ___ (CRN ___).",
    "Me voy a inscribir antes de la fecha límite.",
  ],
};

export const RENATA_STARTERS: Record<Lang, string[]> = {
  en: [
    "Hi Renata, I want to take a BHCC class this spring.",
    "The class meets on ___ from ___ to ___.",
    "Can I change my ___ shift, starting in January?",
  ],
  es: [
    "Hola Renata, quiero tomar una clase en BHCC esta primavera.",
    "La clase es los ___ de ___ a ___.",
    "¿Puedo cambiar mi turno del ___, desde enero?",
  ],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Pick a class that fits your job",
      s: [
        "Read every rule in the offer. Write down the deadline and what HR needs back.",
        "For each section, check three things: the days, the time, and the seats open. A full section with a waitlist is not a seat.",
        "Compare each section with your shifts. If a class is during a shift, the offer says who must approve a change. Ask before registration closes.",
        "Put the class on your calendar from the first day of classes, every week. Then tell HR your section number or CRN.",
      ],
      tip: "This is a short taste of college registration. Real programs like Bunker Hill's Transitions to College can help with the rest.",
    },
  ],
  es: [
    {
      t: "Elige una clase que quepa con tu trabajo",
      s: [
        "Lee cada regla de la oferta. Anota la fecha límite y lo que RR.HH. necesita de vuelta.",
        "En cada sección, revisa tres cosas: los días, la hora y los lugares libres. Una sección llena con lista de espera no es un lugar.",
        "Compara cada sección con tus turnos. Si una clase es durante un turno, la oferta dice quién tiene que aprobar un cambio. Pregunta antes de que cierre la inscripción.",
        "Pon la clase en tu calendario desde el primer día de clases, cada semana. Luego dile a RR.HH. tu número de sección o el CRN.",
      ],
      tip: "Esto es una pequeña muestra de la inscripción en la universidad. Programas reales como Transitions to College de Bunker Hill pueden ayudar con el resto.",
    },
  ],
};

/** What the teacher sees: the shift request to Renata and the reply to HR. */
export function describeSubmission(input: { renata: string; reply: string }, lang: Lang): SubmissionContent {
  const c = COLLEGE_OFFER_COPY[lang];
  return {
    lang,
    fields: [
      { label: c.submissionRenata, value: input.renata },
      { label: c.submissionHr, value: input.reply },
    ],
  };
}

/** Send pressed before a recipient is chosen. */
export const NO_RECIPIENT: Localized = {
  en: "Choose who gets this message in the To box.",
  es: "Elige en Para quién recibe este mensaje.",
};

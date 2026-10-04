import type { Lang, Lesson, Localized } from "@/lib/task-types";

export const REQUESTED_SLOT = "10:00";
export const OPEN_SLOT = "11:30";
export const PATIENT = { en: "Maya Ansari", es: "Maya Ansari" };

export type SlotStatus = "checked-in" | "confirmed" | "open" | "blocked";

/**
 * The provider's day sheet, as a front desk sees it. 11:30 is the one Open
 * time. 12:30 looks empty but is Blocked for a staff meeting: an empty row
 * is not the same as a free one.
 */
export const SLOTS: readonly { time: string; taken: boolean; name: string | null; visit: Localized | null; status: SlotStatus }[] = [
  { time: "9:00", taken: true, name: "Ana Costa", visit: { en: "Annual physical", es: "Examen anual" }, status: "checked-in" },
  { time: "9:30", taken: true, name: "Luis Moreno", visit: { en: "Flu shot", es: "Vacuna contra la gripe" }, status: "checked-in" },
  { time: "10:00", taken: true, name: "Walter Nguyen", visit: { en: "Blood pressure check", es: "Control de presión" }, status: "confirmed" },
  { time: "10:30", taken: true, name: "Priya Shah", visit: { en: "New patient", es: "Paciente nuevo" }, status: "confirmed" },
  { time: "11:00", taken: true, name: "Dana Lee", visit: { en: "Follow-up", es: "Seguimiento" }, status: "confirmed" },
  { time: "11:30", taken: false, name: null, visit: null, status: "open" },
  { time: "12:00", taken: true, name: "Grace Okoye", visit: { en: "Sick visit", es: "Consulta por enfermedad" }, status: "confirmed" },
  { time: "12:30", taken: true, name: null, visit: { en: "Staff meeting", es: "Reunión del personal" }, status: "blocked" },
];

export const PROVIDER = "Dr. Ruth Adeyemi";

/** What Maya's booked row says on the finish screen: the visit her message asked for. */
export const BOOKED_VISIT: Localized = { en: "Follow-up, cough", es: "Seguimiento, tos" };

/**
 * The paper message a coworker left at the desk. It stays on screen while
 * the learner reads the day sheet and writes the text back.
 */
export const PHONE_MESSAGE = {
  caller: PATIENT.en,
  dob: "03/12/1998",
  phone: "(617) 555-0142",
  time: "8:47 AM",
  takenBy: "Elena",
  message: {
    en: "Cough for a week. Wants a follow-up today at 10:00. Please text her back.",
    es: "Tiene tos desde hace una semana. Quiere un seguimiento hoy a las 10:00. Por favor mándale un mensaje de texto.",
  },
};

export const APPOINTMENT_COPY: Record<Lang, {
  slipTitle: string;
  slipCaller: string;
  slipDob: string;
  slipPhone: string;
  slipTime: string;
  slipTakenBy: string;
  slipMessage: string;
  sheetDay: string;
  colTime: string;
  colPatient: string;
  colVisit: string;
  colStatus: string;
  checkedIn: string;
  confirmed: string;
  blockedLabel: string;
  blocked: string;
  helpBtn: string;
  clinic: string;
  offerCta: string;
  confirmHeading: string;
  writeHere: string;
  send: string;
  needSlot: string;
  taken: string;
  empty: string;
  weak: string;
  bare: string;
  takenTime: string;
  blank: string;
  doneHeading: string;
  doneTextLabel: string;
  sentKicker: string;
  tryAgain: string;
  backToDesk: string;
  lessonKicker: string;
  tipLabel: string;
  gotIt: string;
  booked: string;
  open: string;
  reasonLabel: string;
  chooseReason: string;
  wrongReason: string;
  takenBy: (name: string) => string;
}> = {
  en: {
    slipTitle: "While you were out",
    slipCaller: "Caller",
    slipDob: "Date of birth",
    slipPhone: "Phone",
    slipTime: "Time",
    slipTakenBy: "Taken by",
    slipMessage: "Message",
    sheetDay: "Monday",
    colTime: "Time",
    colPatient: "Patient",
    colVisit: "Visit",
    colStatus: "Status",
    checkedIn: "Checked in",
    confirmed: "Confirmed",
    blockedLabel: "Blocked",
    blocked: "12:30 is blocked for a staff meeting. No patients then. Look for the time that says Open.",
    helpBtn: "Help me with this step",
    clinic: "Harborside Health · Front desk",
    offerCta: "Offer the open time",
    confirmHeading: "Text message to Maya · (617) 555-0142",
    writeHere: "Tell Maya the time you can give her…",
    send: "Send confirmation",
    needSlot: "Click the time that says Open first.",
    taken: "Look for the time that says Open.",
    empty: "Write a short confirmation first.",
    weak: "Your text needs the new time. Which time on the schedule says Open? Write that time.",
    bare: "Write a short sentence, not only the time. For example: You can come at 11:30 today.",
    takenTime: "Your text says 11:30 is taken. 11:30 is the open time. Tell Maya she can come at 11:30.",
    blank: "Your text still has ___ in it. Write the time there.",
    doneHeading: "Maya's new appointment",
    doneTextLabel: "Your text to Maya",
    sentKicker: "Confirmation sent",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
    booked: "Booked",
    open: "Open",
    reasonLabel: "Why can't Maya have 10:00?",
    chooseReason: "Choose a reason",
    wrongReason: "Look at 10:00 on the schedule. Whose name is there?",
    takenBy: (name) => `${name} already has that time. Look for the time that says Open.`,
  },
  es: {
    slipTitle: "Mensaje telefónico",
    slipCaller: "Llamó",
    slipDob: "Fecha de nacimiento",
    slipPhone: "Teléfono",
    slipTime: "Hora",
    slipTakenBy: "Lo tomó",
    slipMessage: "Mensaje",
    sheetDay: "Lunes",
    colTime: "Hora",
    colPatient: "Paciente",
    colVisit: "Consulta",
    colStatus: "Estado",
    checkedIn: "Ya llegó",
    confirmed: "Confirmada",
    blockedLabel: "Bloqueada",
    blocked: "Las 12:30 están bloqueadas por una reunión del personal. No hay pacientes a esa hora. Busca la hora que dice Libre.",
    helpBtn: "Ayúdame con este paso",
    clinic: "Harborside Health · Recepción",
    offerCta: "Ofrecer la hora libre",
    confirmHeading: "Mensaje de texto para Maya · (617) 555-0142",
    writeHere: "Dile a Maya la hora que le puedes dar…",
    send: "Enviar confirmación",
    needSlot: "Primero haz clic en la hora que dice Libre.",
    taken: "Busca la hora que dice Libre.",
    empty: "Primero escribe una confirmación corta.",
    weak: "A tu mensaje le falta la hora nueva. ¿Qué hora de la agenda dice Libre? Escribe esa hora.",
    bare: "Escribe una oración corta, no solo la hora. Por ejemplo: Puedes venir hoy a las 11:30.",
    takenTime: "Tu mensaje dice que las 11:30 están ocupadas. Las 11:30 son la hora libre. Dile a Maya que puede venir a las 11:30.",
    blank: "Tu mensaje todavía tiene ___. Escribe ahí la hora.",
    doneHeading: "La nueva cita de Maya",
    doneTextLabel: "Tu mensaje para Maya",
    sentKicker: "Confirmación enviada",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
    booked: "Ocupada",
    open: "Libre",
    reasonLabel: "¿Por qué Maya no puede tener las 10:00?",
    chooseReason: "Elige una razón",
    wrongReason: "Mira las 10:00 en la agenda. ¿Qué nombre dice?",
    takenBy: (name) => `${name} ya tiene esa hora. Busca la hora que dice Libre.`,
  },
};

/**
 * Frames: the time is the blank, because finding it on the schedule is the
 * skill. A text that still has ___ in it is sent back.
 */
export const STARTERS: Record<Lang, string[]> = {
  en: [
    "Hi Maya, 10:00 is taken. I can do ___ today.",
    "___ is open. Does that work for you?",
    "See you at ___. Thank you!",
  ],
  es: [
    "Hola Maya, las 10:00 están ocupadas. Te puedo dar las ___ hoy.",
    "Las ___ están libres. ¿Te sirve?",
    "Nos vemos a las ___. ¡Gracias!",
  ],
};

/** What the text to Maya is missing, in the order the correction names it. */
export type ConfirmationProblem = "empty" | "blank" | "weak" | "bare" | "takenTime";

const strip = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

/**
 * 11:30 the ways people write it: 11:30, 11.30, 11 30, 1130, 11h30,
 * 11:30am, eleven thirty, half past eleven, once y media, 11 y 30.
 */
const OPEN_TIME =
  /(?<![\d:])11\s*[:.h]?\s*30(?!\d)|(?<![\d:])11\s*(y|and)\s*(30|media|treinta)\b|\b(eleven|once)\s*(y\s*|and\s*)?(thirty|media|treinta)\b|\b11\s+thirty\b|\bhalf past (eleven|11)\b/g;

/** Words that say a time cannot be had. */
const TAKEN =
  /\b(taken|booked|full|busy|unavailable|not (available|open|free)|isn't (available|open|free)|is not (available|open|free)|can't|cannot|ocupad[ao]s?|llen[ao]s?|no (esta|estan|hay) (libre|libres|disponible|disponibles)|no se puede|no puedo|tampoco)\b/;

/** "11:30 is not taken" is an offer, not a clash. */
const NOT_TAKEN = /\b(not|isn't|no (esta|estan))\s+(taken|booked|ocupad[ao]s?)\b/;

/**
 * A text back to Maya that offers the open time. Any usual way of writing
 * 11:30 counts. It has to be a message, not only the number ("1130"), and
 * it must not call 11:30 taken ("Sorry Maya, 11:30 is taken too.").
 */
export function confirmationProblem(body: string): ConfirmationProblem | null {
  const raw = body.trim();
  if (!raw) return "empty";
  if (/_{2,}/.test(raw)) return "blank";
  const t = strip(raw);
  if (!t.match(OPEN_TIME)) return "weak";
  // Judge each clause that names 11:30: "10:00 is taken, but 11:30 is
  // open" is fine; "11:30 is taken too" is not.
  const clauses = t.split(/[.!?;,\n]|\bbut\b|\bpero\b|\bsino\b|\b(?:because|porque|and|so|then|instead|entonces|asi que|en cambio)\b/);
  const offered = clauses.filter((cl) => cl.match(OPEN_TIME));
  if (offered.length > 0 && offered.every((cl) => TAKEN.test(cl) && !NOT_TAKEN.test(cl))) return "takenTime";
  if (!/[a-zñ]{2,}/.test(t.replace(OPEN_TIME, " ").replace(/\b(am|pm|a\.m|p\.m)\b/g, " "))) return "bare";
  return null;
}

export function confirmationOffersOpenSlot(body: string): boolean {
  return confirmationProblem(body) === null;
}

/** The Job Card correction for each problem. */
export function confirmationCorrection(problem: ConfirmationProblem, lang: Lang): string {
  return APPOINTMENT_COPY[lang][problem];
}

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Check the schedule before you say yes",
      s: [
        "Someone already has the time Maya asked for. If you say yes, two people have the same time.",
        "Find a time that says Open. You can give her that one.",
        "Your message has to say the new time, not only \"see you soon.\"",
      ],
      tip: "Always look at the schedule before you say yes to a time.",
    },
  ],
  es: [
    {
      t: "Revisa la agenda antes de decir que sí",
      s: [
        "Otra persona ya tiene la hora que pidió Maya. Si dices que sí, dos personas tienen la misma hora.",
        "Busca una hora que diga Libre. Esa se la puedes dar.",
        "Tu mensaje tiene que decir la hora nueva, no solo \"nos vemos.\"",
      ],
      tip: "Siempre mira la agenda antes de decir que sí a una hora.",
    },
  ],
};

/** Show me's bubble on a reading step: it points at evidence, not something to click. */

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  { en: "Check the schedule at Maya’s requested time. Select the reason it is unavailable.", es: "Revisa la agenda a la hora que pidió Maya. Selecciona la razón por la que no está disponible." },
  { en: "Select an available appointment time.", es: "Selecciona una hora disponible para la cita." },
  { en: "Click Offer the open time.", es: "Haz clic en Ofrecer la hora libre." },
  {
    en: "Write Maya the new time. Then click Send confirmation.",
    es: "Escríbele a Maya la hora nueva. Después haz clic en Enviar confirmación.",
  },
];

/**
 * Every reason names something real on the day sheet, so only reading the
 * 10:00 row finds the answer: two neighbours' names (9:30 and 10:30) and the
 * staff meeting (12:30). Each wrong one says where that fact really is.
 */
export const CONFLICT_OPTIONS: { key: string; label: Localized; hint: Localized }[] = [
  {
    key: "luis",
    label: { en: "Luis Moreno already has 10:00", es: "Luis Moreno ya tiene las 10:00" },
    hint: { en: "Luis Moreno has 9:30. Look at the 10:00 row. Whose name is there?", es: "Luis Moreno tiene las 9:30. Mira la fila de las 10:00. ¿Qué nombre dice?" },
  },
  {
    key: "booked",
    label: { en: "Walter Nguyen already has 10:00", es: "Walter Nguyen ya tiene las 10:00" },
    hint: { en: "", es: "" },
  },
  {
    key: "priya",
    label: { en: "Priya Shah already has 10:00", es: "Priya Shah ya tiene las 10:00" },
    hint: { en: "Priya Shah has 10:30. Look at the 10:00 row. Whose name is there?", es: "Priya Shah tiene las 10:30. Mira la fila de las 10:00. ¿Qué nombre dice?" },
  },
  {
    key: "meeting",
    label: { en: "There is a staff meeting at 10:00", es: "Hay una reunión del personal a las 10:00" },
    hint: { en: "The staff meeting is at 12:30. Look at the 10:00 row. Whose name is there?", es: "La reunión del personal es a las 12:30. Mira la fila de las 10:00. ¿Qué nombre dice?" },
  },
];
export function conflictIdentified(key: string): boolean { return key === "booked"; }

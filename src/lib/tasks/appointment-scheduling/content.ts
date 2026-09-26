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
    weak: "Say the open time, 11:30, so she knows when to come in.",
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
    weak: "Di la hora libre, 11:30, para que sepa a qué hora venir.",
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

export const STARTERS: Record<Lang, string[]> = {
  en: [
    "Hi Maya, 10:00 is taken. I can do 11:30 today.",
    "11:30 is open. Does that work for you?",
    "See you at 11:30. Thank you!",
  ],
  es: [
    "Hola Maya, las 10:00 están ocupadas. Te puedo dar las 11:30 hoy.",
    "Las 11:30 están libres. ¿Te sirve?",
    "Nos vemos a las 11:30. ¡Gracias!",
  ],
};

export function confirmationOffersOpenSlot(body: string): boolean {
  const t = body.toLowerCase();
  return /11\s*[:.]?\s*30|11:30|11 30/.test(t);
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

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Look at 10:00 on the schedule. Then choose why Maya can't have it.",
    es: "Mira las 10:00 en la agenda. Después elige por qué Maya no puede tenerla.",
  },
  { en: "Click the time that says Open.", es: "Haz clic en la hora que dice Libre." },
  { en: "Click Offer the open time.", es: "Haz clic en Ofrecer la hora libre." },
  {
    en: "Write Maya the new time. Then click Send confirmation.",
    es: "Escríbele a Maya la hora nueva. Después haz clic en Enviar confirmación.",
  },
];

export const CONFLICT_OPTIONS = [
 { key: 'closed', label: { en: 'The clinic is closed at 10:00', es: 'La clínica está cerrada a las 10:00' } },
 { key: 'booked', label: { en: 'Walter Nguyen already has 10:00', es: 'Walter Nguyen ya tiene las 10:00' } },
 { key: 'duration', label: { en: 'The appointment needs two hours', es: 'La cita necesita dos horas' } },
];
export function conflictIdentified(key: string): boolean { return key === 'booked'; }

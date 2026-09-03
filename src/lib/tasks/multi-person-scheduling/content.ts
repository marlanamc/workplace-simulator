import type { Lang, Lesson, Localized } from "@/lib/task-types";

export const OPEN_SLOT = "2pm";

export const PEOPLE = [
  { key: "you", name: { en: "You", es: "Tú" }, color: "#1a73e8" },
  { key: "dana", name: { en: "Dana Ortiz", es: "Dana Ortiz" }, color: "#7248b9" },
  { key: "maria", name: { en: "Maria Delgado", es: "Maria Delgado" }, color: "#0b8043" },
  { key: "jordan", name: { en: "Jordan Kim", es: "Jordan Kim" }, color: "#e37400" },
] as const;

export const SLOTS = [
  { key: "10am", label: { en: "10:00 AM", es: "10:00 AM" }, busy: ["dana"] },
  { key: "11am", label: { en: "11:00 AM", es: "11:00 AM" }, busy: ["maria"] },
  { key: "1pm", label: { en: "1:00 PM", es: "1:00 PM" }, busy: ["jordan"] },
  { key: "2pm", label: { en: "2:00 PM", es: "2:00 PM" }, busy: [] },
  { key: "3pm", label: { en: "3:00 PM", es: "3:00 PM" }, busy: ["you", "dana"] },
] as const;

export function slotIsOpenForEveryone(key: string): boolean {
  return key === OPEN_SLOT;
}

export function personIsBusy(slotKey: string, personKey: string): boolean {
  const slot = SLOTS.find((s) => s.key === slotKey);
  return Boolean(slot && (slot.busy as readonly string[]).includes(personKey));
}

export const HQ_CAL_COPY: Record<Lang, {
  appName: string;
  heading: string;
  find: string;
  invite: string;
  clash: string;
  needSlot: string;
  sentKicker: string;
  tryAgain: string;
  backToDesk: string;
  lessonKicker: string;
  tipLabel: string;
  gotIt: string;
  busy: string;
  free: string;
  meetingTitle: string;
}> = {
  en: {
    appName: "Calendar",
    heading: "Wednesday — find a time",
    find: "Four calendars. One slot is open for everyone.",
    invite: "Invite everyone to this time",
    clash: "Someone is busy then. Find the slot that is open for all four.",
    needSlot: "Click the open slot first. It is the one with no busy bars.",
    sentKicker: "Invite sent",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
    busy: "Busy",
    free: "Open",
    meetingTitle: "HQ check-in",
  },
  es: {
    appName: "Calendar",
    heading: "Miércoles — encuentra un horario",
    find: "Cuatro calendarios. Un hueco está libre para todos.",
    invite: "Invitar a todos a esta hora",
    clash: "Alguien está ocupado entonces. Encuentra el hueco libre para los cuatro.",
    needSlot: "Haz clic primero en el hueco libre. Es el que no tiene barras ocupadas.",
    sentKicker: "Invitación enviada",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
    busy: "Ocupado",
    free: "Libre",
    meetingTitle: "Check-in de HQ",
  },
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Find the gap, not a maybe",
      s: [
        "A slot that works for three people still fails if the fourth is busy.",
        "Invite only the time with no busy bars on anyone's calendar.",
      ],
      tip: "If you can see a colored bar, that person cannot come.",
    },
  ],
  es: [
    {
      t: "Encuentra el hueco, no un quizás",
      s: [
        "Un horario que sirve para tres sigue fallando si el cuarto está ocupado.",
        "Invita solo la hora sin barras ocupadas en ningún calendario.",
      ],
      tip: "Si ves una barra de color, esa persona no puede.",
    },
  ],
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  { en: "Find the slot open for everyone.", es: "Encuentra el hueco libre para todos." },
  { en: "Invite everyone to that time.", es: "Invita a todos a esa hora." },
];

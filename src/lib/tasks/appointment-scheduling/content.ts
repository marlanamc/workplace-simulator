import type { Lang, Lesson, Localized } from "@/lib/task-types";

export const REQUESTED_SLOT = "10:00";
export const OPEN_SLOT = "11:30";
export const PATIENT = { en: "Maya Rivera", es: "Maya Rivera" };

export const SLOTS = [
  { time: "9:00", taken: true, name: "Alex Chen" },
  { time: "9:30", taken: true, name: "Jordan Kim" },
  { time: "10:00", taken: true, name: "Sam Ortiz" },
  { time: "10:30", taken: true, name: "Priya Shah" },
  { time: "11:00", taken: true, name: "Dana Lee" },
  { time: "11:30", taken: false, name: null },
  { time: "12:00", taken: true, name: "Casey Brooks" },
] as const;

export const APPOINTMENT_COPY: Record<Lang, {
  helpBtn: string;
  clinic: string;
  heading: string;
  request: string;
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
}> = {
  en: {
    helpBtn: "Help me with this step",
    clinic: "Harborside Health · Front desk",
    heading: "Monday morning",
    request: "Maya Rivera called. She wants 10:00 today. Check the schedule before you say yes.",
    offerCta: "Offer the open slot",
    confirmHeading: "Confirmation to Maya",
    writeHere: "Confirm the time you can actually give her…",
    send: "Send confirmation",
    needSlot: "Click the open slot first. 10:00 is already taken.",
    taken: "That time is already booked. Offer her the open one.",
    empty: "Write a short confirmation first.",
    weak: "Say the open time — 11:30 — so she knows when to come in.",
    sentKicker: "Confirmation sent",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
    booked: "Booked",
    open: "Open",
  },
  es: {
    helpBtn: "Ayúdame con este paso",
    clinic: "Harborside Health · Recepción",
    heading: "Lunes por la mañana",
    request: "Llamó Maya Rivera. Quiere las 10:00 hoy. Revisa la agenda antes de decir que sí.",
    offerCta: "Ofrecer el hueco libre",
    confirmHeading: "Confirmación para Maya",
    writeHere: "Confirma la hora que de verdad le puedes dar…",
    send: "Enviar confirmación",
    needSlot: "Haz clic en el hueco libre primero. Las 10:00 ya están ocupadas.",
    taken: "Esa hora ya está ocupada. Ofrécele la que está libre.",
    empty: "Primero escribe una confirmación corta.",
    weak: "Di la hora libre — 11:30 — para que sepa a qué hora venir.",
    sentKicker: "Confirmación enviada",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
    booked: "Ocupada",
    open: "Libre",
  },
};

export const STARTERS: Record<Lang, string[]> = {
  en: [
    "Hi Maya, 10:00 is taken. I can do 11:30 today.",
    "11:30 is open. Does that work?",
    "Hola Maya, las 10:00 están ocupadas. Te puedo dar las 11:30.",
  ],
  es: [
    "Hola Maya, las 10:00 están ocupadas. Te puedo dar las 11:30.",
    "Las 11:30 están libres. ¿Te sirve?",
    "Hi Maya, 10:00 is taken. I can do 11:30 today.",
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
        "The time Maya asked for is already booked. If you say yes, two people have the same slot.",
        "Give her the open slot instead — that is the one you can actually offer.",
        "Your confirmation has to say the new time, not just \"see you soon.\"",
      ],
      tip: "If you end up with two names on the same time, you booked it without checking.",
    },
  ],
  es: [
    {
      t: "Revisa la agenda antes de decir que sí",
      s: [
        "La hora que Maya pidió ya está ocupada. Si dices que sí, dos personas tienen el mismo espacio.",
        "Dale el hueco libre en su lugar — ese es el que de verdad le puedes ofrecer.",
        "Tu confirmación tiene que decir la hora nueva, no solo \"nos vemos.\"",
      ],
      tip: "Si terminas con dos nombres en la misma hora, la agendaste sin revisar.",
    },
  ],
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  { en: "Read what Maya asked for. Then check the schedule.", es: "Lee lo que pidió Maya. Luego revisa la agenda." },
  { en: "Click the open 11:30 slot.", es: "Haz clic en el hueco de las 11:30." },
  { en: "Send a confirmation that says 11:30.", es: "Envía una confirmación que diga las 11:30." },
];

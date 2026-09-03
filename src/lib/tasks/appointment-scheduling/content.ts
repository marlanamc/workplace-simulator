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
    request: "Maya Rivera called. She wants 10:00 today. Look at the book before you say yes.",
    offerCta: "Offer the open slot",
    confirmHeading: "Confirmation to Maya",
    writeHere: "Confirm the time you can actually give her…",
    send: "Send confirmation",
    needSlot: "Click the open slot first. 10:00 is already taken.",
    taken: "That time is already booked. Offer the open one.",
    empty: "Write a short confirmation first.",
    weak: "Name the open time — 11:30 — so she knows what to come for.",
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
    request: "Llamó Maya Rivera. Quiere las 10:00 hoy. Mira la agenda antes de decir que sí.",
    offerCta: "Ofrecer el hueco libre",
    confirmHeading: "Confirmación para Maya",
    writeHere: "Confirma la hora que de verdad le puedes dar…",
    send: "Enviar confirmación",
    needSlot: "Haz clic en el hueco libre primero. Las 10:00 ya están ocupadas.",
    taken: "Esa hora ya está ocupada. Ofrece la libre.",
    empty: "Primero escribe una confirmación corta.",
    weak: "Nombra la hora libre — 11:30 — para que sepa a qué venir.",
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
      t: "Look before you book",
      s: [
        "The requested time is already on the book. Saying yes double-books.",
        "The open slot is the one you can actually give.",
        "The confirmation has to name that time, not just say \"see you soon.\"",
      ],
      tip: "If two names sit on one time, you did not look.",
    },
  ],
  es: [
    {
      t: "Mira antes de agendar",
      s: [
        "La hora pedida ya está en la agenda. Decir que sí la dobla.",
        "El hueco libre es el que de verdad puedes dar.",
        "La confirmación tiene que nombrar esa hora, no solo decir \"nos vemos.\"",
      ],
      tip: "Si dos nombres caen en una hora, no miraste.",
    },
  ],
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  { en: "Read the request. Then look at the book.", es: "Lee el pedido. Luego mira la agenda." },
  { en: "Click the open 11:30 slot.", es: "Haz clic en el hueco de las 11:30." },
  { en: "Send a confirmation that names 11:30.", es: "Envía una confirmación que nombre las 11:30." },
];

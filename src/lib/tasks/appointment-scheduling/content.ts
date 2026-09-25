import type { Lang, Lesson, Localized } from "@/lib/task-types";

export const REQUESTED_SLOT = "10:00";
export const OPEN_SLOT = "11:30";
export const PATIENT = { en: "Maya Ansari", es: "Maya Ansari" };

export const SLOTS = [
  { time: "9:00", taken: true, name: "Ana Costa" },
  { time: "9:30", taken: true, name: "Luis Moreno" },
  { time: "10:00", taken: true, name: "Tomás Ortiz" },
  { time: "10:30", taken: true, name: "Priya Shah" },
  { time: "11:00", taken: true, name: "Dana Lee" },
  { time: "11:30", taken: false, name: null },
  { time: "12:00", taken: true, name: "Grace Okoye" },
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
  reasonLabel: string;
  chooseReason: string;
  wrongReason: string;
  takenBy: (name: string) => string;
}> = {
  en: {
    helpBtn: "Help me with this step",
    clinic: "Harborside Health · Front desk",
    heading: "Monday morning",
    request: "Maya Ansari called. She wants an appointment today at 10:00.",
    offerCta: "Offer the open time",
    confirmHeading: "Confirmation to Maya",
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
    helpBtn: "Ayúdame con este paso",
    clinic: "Harborside Health · Recepción",
    heading: "Lunes por la mañana",
    request: "Llamó Maya Ansari. Quiere una cita hoy a las 10:00.",
    offerCta: "Ofrecer la hora libre",
    confirmHeading: "Confirmación para Maya",
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
 { key: 'booked', label: { en: 'Tomás Ortiz already has 10:00', es: 'Tomás Ortiz ya tiene las 10:00' } },
 { key: 'duration', label: { en: 'The appointment needs two hours', es: 'La cita necesita dos horas' } },
];
export function conflictIdentified(key: string): boolean { return key === 'booked'; }

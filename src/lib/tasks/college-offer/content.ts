import type { EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "🎓",
    kicker: "Monday. The offer is in.",
    headline: "Harborside will pay for a class.",
    body: "Read the offer. Reply that you accept. Put the class on a week that already has a close.",
    cta: "Read the offer",
  },
  es: {
    emoji: "🎓",
    kicker: "Lunes. Ya está la oferta.",
    headline: "Harborside pagará una clase.",
    body: "Lee la oferta. Responde que aceptas. Pon la clase en una semana que ya tiene un cierre.",
    cta: "Leer la oferta",
  },
};

export const CLASS_SLOT = "tue-2pm";

export const SLOTS = [
  {
    key: "tue-2pm",
    label: { en: "Tue 2:00–4:00 PM, weekly", es: "Mar 2:00–4:00 PM, semanal" },
    ok: true,
    hint: { en: "", es: "" },
  },
  {
    key: "wed-10am",
    label: { en: "Wed 10:00 AM–12:00 PM, weekly", es: "Mié 10:00 AM–12:00 PM, semanal" },
    ok: false,
    hint: {
      en: "The offer says Tuesday 2 to 4. Put the real class time on the calendar.",
      es: "La oferta dice martes de 2 a 4. Pon la hora real de la clase en el calendario.",
    },
  },
  {
    key: "thu-6pm",
    label: { en: "Thu 6:00–8:00 PM, weekly", es: "Jue 6:00–8:00 PM, semanal" },
    ok: false,
    hint: {
      en: "That is a free evening. The class meets Tuesday afternoon.",
      es: "Esa es una noche libre. La clase es el martes por la tarde.",
    },
  },
] as const;

export const OFFER_LETTER: Record<Lang, string[]> = {
  en: [
    "Harborside Cafe will pay tuition for one Business Essentials class at Bunker Hill Community College this fall.",
    "The class meets Tuesdays, 2:00–4:00 PM, starting September 15. Stay employed here and keep a passing grade.",
    "Reply to this email if you accept. Then put the class on your work calendar — Tuesday close is already on that day.",
  ],
  es: [
    "Harborside Cafe pagará la matrícula de una clase de Business Essentials en Bunker Hill Community College este otoño.",
    "La clase es los martes, de 2:00 a 4:00 PM, desde el 15 de septiembre. Sigue empleado aquí y mantén una nota de aprobado.",
    "Responde a este correo si aceptas. Luego pon la clase en tu calendario de trabajo — el cierre del martes ya está ese día.",
  ],
};

export const COLLEGE_OFFER_COPY: Record<Lang, {
  hubHeading: string;
  mailTitle: string;
  mailBody: string;
  mailCta: string;
  calTitle: string;
  calBody: string;
  calCta: string;
  sendCta: string;
  sendNeed: string;
  from: string;
  subject: string;
  toMe: string;
  reply: string;
  to: string;
  writeHere: string;
  send: string;
  discard: string;
  eventTitle: string;
  whenLabel: string;
  repeatsLabel: string;
  shiftNote: string;
  saveEvent: string;
  overlapTo: string;
  overlapSubject: string;
  overlapWrite: string;
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
}> = {
  en: {
    hubHeading: "Make the offer fit the week",
    mailTitle: "Read the offer and reply",
    mailBody: "HR laid out the class, the day, and what they expect back. Accept it in your own words.",
    mailCta: "Open Mail",
    calTitle: "Put the class on the calendar",
    calBody: "Add it as a weekly event. Tuesday close is already there — say so before the semester starts.",
    calCta: "Open Calendar",
    sendCta: "Finish both, then close the job",
    sendNeed: "Accept the offer and put the class on the calendar first.",
    from: "Harborside HR",
    subject: "Offer: Business Essentials at BHCC",
    toMe: "to me",
    reply: "Reply",
    to: "To",
    writeHere: "Write that you accept…",
    send: "Send",
    discard: "Discard",
    eventTitle: "BHCC Business Essentials",
    whenLabel: "When",
    repeatsLabel: "Repeats weekly",
    shiftNote: "You already close Tuesday 2:00–8:00 PM.",
    saveEvent: "Save",
    overlapTo: "To",
    overlapSubject: "Tuesday class overlaps close",
    overlapWrite: "Tell Maria the class hits Tuesday close…",
    sentKicker: "Offer accepted",
    doneTitle: "You made work and class share a week.",
    doneBody: "You accepted the offer, put Tuesday 2 to 4 on a calendar that already had close, and told Maria before the semester. That is the whole skill.",
    badgeName: "Accept an offer and put it on a full calendar",
    badgeWhere: "Counts toward: Assistant Manager",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
  },
  es: {
    hubHeading: "Haz que la oferta quepa en la semana",
    mailTitle: "Lee la oferta y responde",
    mailBody: "RR.HH. explicó la clase, el día y lo que esperan. Acéptala con tus palabras.",
    mailCta: "Abrir correo",
    calTitle: "Pon la clase en el calendario",
    calBody: "Agrégala como evento semanal. El cierre del martes ya está — dilo antes de que empiece el semestre.",
    calCta: "Abrir Calendar",
    sendCta: "Termina las dos y cierra el trabajo",
    sendNeed: "Primero acepta la oferta y pon la clase en el calendario.",
    from: "RR.HH. de Harborside",
    subject: "Oferta: Business Essentials en BHCC",
    toMe: "para mí",
    reply: "Responder",
    to: "Para",
    writeHere: "Escribe que aceptas…",
    send: "Enviar",
    discard: "Descartar",
    eventTitle: "BHCC Business Essentials",
    whenLabel: "Cuándo",
    repeatsLabel: "Se repite cada semana",
    shiftNote: "Ya cierras el martes de 2:00 a 8:00 PM.",
    saveEvent: "Guardar",
    overlapTo: "Para",
    overlapSubject: "La clase del martes choca con el cierre",
    overlapWrite: "Dile a Maria que la clase choca con el cierre del martes…",
    sentKicker: "Oferta aceptada",
    doneTitle: "Hiciste que el trabajo y la clase compartan una semana.",
    doneBody: "Aceptaste la oferta, pusiste el martes de 2 a 4 en un calendario que ya tenía el cierre, y le avisaste a Maria antes del semestre. Esa es toda la destreza.",
    badgeName: "Aceptar una oferta y ponerla en un calendario lleno",
    badgeWhere: "Cuenta para: Asistente de gerencia",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
  },
};

export const STARTERS: Record<Lang, string[]> = {
  en: [
    "Hi, I accept the offer for the Business Essentials class.",
    "Thank you. I will take the Tuesday BHCC class.",
    "I accept. I will put the class on my calendar today.",
  ],
  es: [
    "Hola, acepto la oferta de la clase de Business Essentials.",
    "Gracias. Voy a tomar la clase de BHCC los martes.",
    "Acepto. Hoy pongo la clase en mi calendario.",
  ],
};

export const OVERLAP_STARTERS: Record<Lang, string[]> = {
  en: [
    "Hi Maria, the BHCC class is Tuesdays 2–4. That overlaps my Tuesday close.",
    "The class hits the same hours as Tuesday close. Can we move my shift before the semester?",
  ],
  es: [
    "Hola Maria, la clase de BHCC es martes de 2 a 4. Choca con mi cierre del martes.",
    "La clase cae a la misma hora que el cierre del martes. ¿Podemos mover mi turno antes del semestre?",
  ],
};

export const HINTS: Record<Lang, {
  accept: string;
  slot: string;
  repeats: string;
  overlap: string;
  empty: string;
}> = {
  en: {
    accept: "Say you accept, and name the class or BHCC.",
    slot: "Pick the Tuesday 2 to 4 class time from the offer.",
    repeats: "Check Repeats weekly. This is a class, not a one-time meeting.",
    overlap: "Tell Maria the class hits your Tuesday close.",
    empty: "Write a short message first. Even one sentence is fine.",
  },
  es: {
    accept: "Di que aceptas, y nombra la clase o BHCC.",
    slot: "Elige el horario del martes de 2 a 4 que dice la oferta.",
    repeats: "Marca Se repite cada semana. Es una clase, no una reunión de una vez.",
    overlap: "Dile a Maria que la clase choca con tu cierre del martes.",
    empty: "Primero escribe un mensaje corto. Una oración está bien.",
  },
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Read the offer, then make it real",
      s: [
        "A formal offer names what you get and what they expect. Read both.",
        "Accept in a short reply. Then put the real class time on the calendar you already use for shifts.",
        "If it overlaps a shift, say so now — not the first week of class.",
      ],
      tip: "This is a 15-minute taste of a college-style task, not a whole semester. Real programs like Bunker Hill's Transitions to College exist for that.",
    },
  ],
  es: [
    {
      t: "Lee la oferta y luego hazla real",
      s: [
        "Una oferta formal dice qué recibes y qué esperan. Lee las dos cosas.",
        "Acepta en una respuesta corta. Luego pon la hora real de la clase en el calendario que ya usas para los turnos.",
        "Si choca con un turno, dilo ahora — no la primera semana de clase.",
      ],
      tip: "Esto es un sabor de 15 minutos de una tarea de tipo universidad, no un semestre. Programas reales como Transitions to College de Bunker Hill existen para eso.",
    },
  ],
};

export function replyAcceptsOffer(body: string): boolean {
  const t = body.toLowerCase();
  const accepts = /accept|acepto|aceptar|yes|sí|si,|i'll take|voy a tomar|take the/.test(t);
  const namesClass = /class|clase|bhcc|bunker|essentials|college|universidad/.test(t);
  return accepts && namesClass;
}

export function overlapMentionsShift(body: string): boolean {
  const t = body.toLowerCase();
  return /shift|turno|close|cierre|tuesday|martes|overlap|choca|conflicto/.test(t);
}

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Start with the offer in Mail.",
    es: "Empieza con la oferta en el correo.",
  },
  {
    en: "Read the offer. Reply that you accept.",
    es: "Lee la oferta. Responde que aceptas.",
  },
  {
    en: "Put the Tuesday class on your calendar.",
    es: "Pon la clase del martes en tu calendario.",
  },
  {
    en: "Tell Maria it overlaps Tuesday close.",
    es: "Dile a Maria que choca con el cierre del martes.",
  },
];

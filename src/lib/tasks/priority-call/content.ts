import type { EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "🚨",
    kicker: "Thursday, 3:40 PM. It is busy out on the floor.",
    headline: "Three things just landed at once.",
    body: "A customer is unhappy. Tonight's close is short on people. Maria put a meeting on your close shift. None of them can wait. You decide which one comes first — then you do all three.",
    cta: "Look at all three",
  },
  es: {
    emoji: "🚨",
    kicker: "Jueves, 3:40 PM. Hay mucho movimiento en el local.",
    headline: "Acaban de caer tres cosas a la vez.",
    body: "Un cliente está molesto. Al cierre de esta noche le falta gente. Maria puso una reunión en tu turno de cierre. Ninguna puede esperar. Tú decides cuál va primero — y luego haces las tres.",
    cta: "Mirar las tres",
  },
};

export const PRIORITY_COPY: Record<Lang, {
  helpBtn: string;
  urgencyKicker: string;
  urgencyQ: string;
  urgencyPh: string;
  urgencyCta: string;
  hubHeading: string;
  mailTitle: string;
  mailBody: string;
  mailCta: string;
  coverTitle: string;
  coverBody: string;
  coverCta: string;
  calTitle: string;
  calBody: string;
  calCta: string;
  from: string;
  subject: string;
  customerBody: string[];
  replyPh: string;
  send: string;
  coverNote: string;
  hoursHeader: string;
  pickShift: string;
  meetingTitle: string;
  meetingWhen: string;
  meetingNote: string;
  accept: string;
  no: string;
  propose: string;
  slotLabel: string;
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
    helpBtn: "Help me with this step",
    urgencyKicker: "Before you click anything",
    urgencyQ: "What is most urgent, and why? Answer in one sentence.",
    urgencyPh: "The customer / the close / the meeting, because…",
    urgencyCta: "That's what I'll do first",
    hubHeading: "Still open",
    mailTitle: "Customer complaint",
    mailBody: "They got the wrong drink and waited a long time. Say you know it happened. Say what you will do about it. Do not promise a free drink or a refund.",
    mailCta: "Open Mail",
    coverTitle: "Tonight's close is short on people",
    coverBody: "Thursday 4–10 has nobody on it. Same as the Saturday gap: pick the person who has room in their week.",
    coverCta: "Open the sheet",
    calTitle: "Maria's 5 PM huddle",
    calBody: "That is in the middle of close. Propose a time that is not a shift.",
    calCta: "Open Calendar",
    from: "From",
    subject: "My order was wrong and I waited 20 minutes",
    customerBody: [
      "I came in at 3:10. I asked for oat milk. I got regular. I waited at the pickup counter.",
      "This is the second time this month. I want to know what you are going to do.",
      "— Dana Cole",
    ],
    replyPh: "Write a short, professional reply…",
    send: "Send",
    coverNote: "Thursday close 4–10 PM. One person. Check Hours.",
    hoursHeader: "Hours",
    pickShift: "Add 4–10…",
    meetingTitle: "Friday numbers — Maria",
    meetingWhen: "Thu, Aug 27 · 5:00–5:20 PM",
    meetingNote: "Close starts at 4. You cannot leave the floor at 5.",
    accept: "Yes",
    no: "No",
    propose: "Propose a new time",
    slotLabel: "Sat 10:00 AM",
    sentKicker: "All three done",
    doneTitle: "You kept the floor running and answered all three.",
    doneBody: "The customer got a real answer. Thursday's close has someone on it. Maria's huddle moved to a time that works. That is what a shift supervisor does. Maria left you a note about what comes next.",
    badgeName: "Handle three asks at once",
    badgeWhere: "Counts toward: Shift Supervisor",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
    askPerson: "Ask a person instead",
  },
  es: {
    helpBtn: "Ayúdame con este paso",
    urgencyKicker: "Antes de hacer clic en algo",
    urgencyQ: "¿Qué es lo más urgente, y por qué? Responde en una oración.",
    urgencyPh: "El cliente / el cierre / la reunión, porque…",
    urgencyCta: "Eso es lo que voy a hacer primero",
    hubHeading: "Siguen abiertas",
    mailTitle: "Queja de un cliente",
    mailBody: "Le dieron la bebida equivocada y esperó mucho tiempo. Dile que sabes lo que pasó. Dile qué vas a hacer al respecto. No prometas una bebida gratis ni un reembolso.",
    mailCta: "Abrir correo",
    coverTitle: "Al cierre de esta noche le falta gente",
    coverBody: "El jueves 4–10 no tiene a nadie. Es igual que el hueco del sábado: elige a la persona que tiene espacio en su semana.",
    coverCta: "Abrir la hoja",
    calTitle: "La reunión de Maria a las 5",
    calBody: "Eso es en medio del cierre. Propón una hora que no sea un turno.",
    calCta: "Abrir Calendar",
    from: "De",
    subject: "Mi pedido estaba mal y esperé 20 minutos",
    customerBody: [
      "Llegué a las 3:10. Pedí leche de avena. Me dieron regular. Esperé en el mostrador.",
      "Es la segunda vez este mes. Quiero saber qué van a hacer.",
      "— Dana Cole",
    ],
    replyPh: "Escribe una respuesta corta y profesional…",
    send: "Enviar",
    coverNote: "Cierre del jueves 4–10 PM. Una persona. Revisa Horas.",
    hoursHeader: "Horas",
    pickShift: "Agregar 4–10…",
    meetingTitle: "Números del viernes — Maria",
    meetingWhen: "Jue 27 ago · 5:00–5:20 PM",
    meetingNote: "El cierre empieza a las 4. No puedes salir del piso a las 5.",
    accept: "Sí",
    no: "No",
    propose: "Proponer otra hora",
    slotLabel: "Sáb 10:00 AM",
    sentKicker: "Las tres listas",
    doneTitle: "Mantuviste el local funcionando y respondiste las tres.",
    doneBody: "El cliente recibió una respuesta de verdad. El cierre del jueves ya tiene a alguien. La reunión de Maria se movió a una hora que funciona. Eso es lo que hace un supervisor de turno. Maria te dejó una nota sobre lo que sigue.",
    badgeName: "Atender tres pedidos a la vez",
    badgeWhere: "Cuenta para: Supervisor de turno",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
    askPerson: "Mejor preguntar a una persona",
  },
};

export const COVER = [
  { key: "alex", name: "Alex Chen", hours: 40, free: false, hint: { en: "Alex already has 40 hours.", es: "Alex ya tiene 40 horas." } },
  { key: "riley", name: "Riley Park", hours: 36, free: false, hint: { en: "Riley would go over 40.", es: "Riley pasaría de 40 horas." } },
  { key: "jordan", name: "Jordan Kim", hours: 24, free: true, hint: { en: "", es: "" } },
  { key: "sam", name: "Sam Rivera", hours: 32, free: false, hint: { en: "Sam already works Thursday morning.", es: "Sam ya trabaja el jueves por la mañana." } },
  { key: "casey", name: "Casey Brooks", hours: 28, free: false, hint: { en: "Casey asked for Thursday night off.", es: "Casey pidió el jueves por la noche libre." } },
] as const;

export const MAIL_STARTERS: Record<Lang, string[]> = {
  en: [
    "Hi Dana, I'm sorry about the wait and the wrong drink.",
    "I'll look at what happened on that order today.",
    "Thank you for telling us. — Harborside",
  ],
  es: [
    "Hola Dana, siento la espera y la bebida incorrecta.",
    "Voy a revisar qué pasó con ese pedido hoy.",
    "Gracias por avisarnos. — Harborside",
  ],
};

export const HINTS: Record<Lang, { urgency: string; overpromise: string; empty: string; cover: string; accept: string; no: string }> = {
  en: {
    urgency: "In one sentence, say what you will do first and why.",
    overpromise: "Don't promise a free drink or a refund here. Say you know it happened and that you will look into it.",
    empty: "Write a short reply first.",
    cover: "Pick Jordan. Jordan has room and is free Thursday night.",
    accept: "That's in the middle of close. Propose Saturday 10 AM.",
    no: "Maria still needs the huddle. Propose Saturday 10 AM.",
  },
  es: {
    urgency: "En una oración, di qué vas a hacer primero y por qué.",
    overpromise: "No prometas una bebida gratis ni un reembolso. Dile que sabes lo que pasó y que lo vas a revisar.",
    empty: "Primero escribe una respuesta corta.",
    cover: "Elige a Jordan. Jordan tiene espacio y está libre el jueves por la noche.",
    accept: "Eso es en medio del cierre. Propón el sábado a las 10 AM.",
    no: "Maria igual necesita la reunión. Propón el sábado a las 10 AM.",
  },
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Say which one you'll do first. Then finish all three",
      s: [
        "There is no trick to the order. A customer who is still here, a gap in tonight's close, and a meeting on your shift are all real problems.",
        "Say which one you will do first. Then handle the other two before you leave the computer.",
        "The customer reply is short and honest. Do not offer free food or a refund. Picking who covers the shift is the same as Level 9. Moving the meeting is the same as Level 4.",
      ],
      tip: "Three tasks at once is the most you should take on without a break. If it feels like too much, say so in the check-in. That helps — it is not a failure.",
    },
  ],
  es: [
    {
      t: "Di cuál vas a hacer primero. Luego termina las tres",
      s: [
        "No hay ningún truco en el orden. Un cliente que sigue ahí, un hueco en el cierre de esta noche y una reunión en tu turno son problemas reales, los tres.",
        "Di cuál vas a hacer primero. Luego atiende las otras dos antes de dejar la computadora.",
        "La respuesta al cliente es corta y honesta. No ofrezcas comida gratis ni un reembolso. Elegir quién cubre el turno es lo mismo que el Nivel 9. Mover la reunión es lo mismo que el Nivel 4.",
      ],
      tip: "Tres tareas a la vez es lo máximo que deberías tomar sin un descanso. Si se siente demasiado, dilo en el check-in. Eso ayuda, no es un fracaso.",
    },
  ],
};


/** Promising something the learner cannot authorize. The one hard "no". */
const OVERPROMISE =
  /\bfree\b|\brefund\b|\bcomp(ed)?\b|\bon the house\b|\bgratis\b|\breembolso\b|\bdevoluci[oó]n\b/;

/**
 * Acknowledging the customer, in either language. Deliberately wide: the job
 * is "say sorry and say you will look into it", and a learner who writes a
 * perfectly good reply in words we did not think of must not be told they
 * over-promised. Prefer letting a weak reply through over failing a real one.
 */
const ACKNOWLEDGES =
  /sorry|apolog|regret|understand|thank|look into|looking into|look at|check|fix|make (it|this) right|speak|talk|follow up|right away|perd[oó]n|siento|lamento|disculp|gracias|revis|entiendo|comprend|arregl|corrig|hablar[eé]?|enseguida/;

export function replyIsSafe(body: string) {
  const t = body.toLowerCase();
  if (OVERPROMISE.test(t)) return false;
  return ACKNOWLEDGES.test(t);
}

/** The persistent "what to do right now" line, one per step of this job. */
export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Three things landed at once. Choose what goes first.",
    es: "Cayeron tres cosas a la vez. Elige cuál va primero.",
  },
  {
    en: "Now work through all three. Do not forget any of them.",
    es: "Ahora resuelve las tres. No te olvides de ninguna.",
  },
  {
    en: "Handle the unhappy customer.",
    es: "Atiende al cliente molesto.",
  },
  {
    en: "Find someone to cover tonight's close.",
    es: "Busca a alguien que cubra el cierre de esta noche.",
  },
  {
    en: "Deal with the meeting on your close shift.",
    es: "Resuelve la reunión en tu turno de cierre.",
  },
];

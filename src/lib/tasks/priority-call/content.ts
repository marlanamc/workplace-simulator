import type { EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "🚨",
    kicker: "Thursday, 3:40 PM. The floor is loud.",
    headline: "Three things just landed at once.",
    body: "A customer is unhappy. Tonight's close is short. Maria put a meeting on your close. None of them can wait. You pick what is first — then you do all three.",
    cta: "Look at all three",
  },
  es: {
    emoji: "🚨",
    kicker: "Jueves, 3:40 PM. El piso está fuerte.",
    headline: "Acaban de caer tres cosas a la vez.",
    body: "Un cliente está molesto. El cierre de esta noche está corto. Maria puso una reunión en tu cierre. Ninguna puede esperar. Tú eliges cuál va primero — y luego haces las tres.",
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
    urgencyQ: "What is most urgent, and why? One sentence.",
    urgencyPh: "The customer / the close / the meeting, because…",
    urgencyCta: "That's my first move",
    hubHeading: "Still open",
    mailTitle: "Customer complaint",
    mailBody: "Wrong drink, long wait. Acknowledge it. Say what you will do. Do not promise a free anything.",
    mailCta: "Open Mail",
    coverTitle: "Tonight's close is short",
    coverBody: "Thursday 4–10 has nobody. Same judgment as the Saturday gap: pick the person with room.",
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
    sentKicker: "All three handled",
    doneTitle: "You held the floor. All three got an answer.",
    doneBody: "The customer was heard. Thursday close has a name. Maria's huddle moved. That is the Shift Supervisor job. Maria has a note for you about what comes next.",
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
    urgencyQ: "¿Qué es lo más urgente, y por qué? Una oración.",
    urgencyPh: "El cliente / el cierre / la reunión, porque…",
    urgencyCta: "Ese es mi primer paso",
    hubHeading: "Siguen abiertas",
    mailTitle: "Queja de un cliente",
    mailBody: "Bebida mal, espera larga. Reconócelo. Di qué vas a hacer. No prometas nada gratis.",
    mailCta: "Abrir correo",
    coverTitle: "El cierre de esta noche está corto",
    coverBody: "El jueves 4–10 no tiene a nadie. El mismo juicio del sábado: elige a quien tiene espacio.",
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
    sentKicker: "Las tres hechas",
    doneTitle: "Aguantaste el piso. Las tres tuvieron respuesta.",
    doneBody: "El cliente fue escuchado. El cierre del jueves tiene nombre. La reunión de Maria se movió. Ese es el trabajo de supervisor. Maria te dejó una nota sobre lo que sigue.",
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
    urgency: "One sentence. Name what you will do first, and why.",
    overpromise: "Don't promise a free drink or a refund here. Acknowledge it and say you will look into it.",
    empty: "Write a short reply first.",
    cover: "Pick Jordan. Jordan has room and is free Thursday night.",
    accept: "That's in the middle of close. Propose Saturday 10 AM.",
    no: "Maria still needs the huddle. Propose Saturday 10 AM.",
  },
  es: {
    urgency: "Una oración. Di qué harás primero, y por qué.",
    overpromise: "No prometas una bebida gratis ni un reembolso. Reconócelo y di que lo vas a revisar.",
    empty: "Primero escribe una respuesta corta.",
    cover: "Elige a Jordan. Jordan tiene espacio y está libre el jueves por la noche.",
    accept: "Eso es en medio del cierre. Propón el sábado a las 10 AM.",
    no: "Maria igual necesita la reunión. Propón el sábado a las 10 AM.",
  },
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Name the first move. Then finish all three",
      s: [
        "There is no trick order. A guest who is still here, a hole in tonight's close, and a meeting on your shift are all real.",
        "Say the first one out loud. Then handle the other two before you leave the computer.",
        "The customer reply is short and honest. Do not give away the cafe. The coverage pick is the same as Level 9. The meeting move is the same as Level 4.",
      ],
      tip: "Three is the ceiling for one sitting. If this feels like too much, say so in the check-in. That is useful, not a fail.",
    },
  ],
  es: [
    {
      t: "Nombra el primer paso. Luego termina las tres",
      s: [
        "No hay un orden trampa. Un cliente que sigue aquí, un hueco en el cierre de esta noche, y una reunión en tu turno son las tres reales.",
        "Di la primera en voz alta. Luego atiende las otras dos antes de dejar la computadora.",
        "La respuesta al cliente es corta y honesta. No regales el café. La cobertura es la misma del Nivel 9. Mover la reunión es lo mismo del Nivel 4.",
      ],
      tip: "Tres es el techo para una sentada. Si se siente demasiado, dilo en el check-in. Eso sirve, no es un fallo.",
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
    en: "Now work through all three. None of them gets dropped.",
    es: "Ahora resuelve las tres. Ninguna se queda sin hacer.",
  },
  {
    en: "Handle the unhappy customer.",
    es: "Atiende al cliente molesto.",
  },
  {
    en: "Cover tonight's short close.",
    es: "Cubre el cierre corto de esta noche.",
  },
  {
    en: "Deal with the meeting on your close shift.",
    es: "Resuelve la reunión en tu turno de cierre.",
  },
];

import { affirms, normalizeReply } from "@/lib/grading/meaning";
import type { EventIntroCopy, Lang, Lesson, Localized, SubmissionContent } from "@/lib/task-types";
import { STORY_DAY_BY_LEVEL, WEEKDAY_SHORT, cardDate, shortDate } from "@/lib/story-dates";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "🚨",
    kicker: "Thursday, 3:40 PM. It is busy out on the floor.",
    headline: "Three things just landed at once.",
    body: "A customer is unhappy. Tonight's close is short on people. Renata put a meeting on your close shift. None of them can wait. You decide which one comes first, then you do all three.",
    cta: "Look at all three",
  },
  es: {
    emoji: "🚨",
    kicker: "Jueves, 3:40 PM. Hay mucho movimiento en el local.",
    headline: "Acaban de caer tres cosas a la vez.",
    body: "Un cliente está molesto. Al cierre de esta noche le falta gente. Renata puso una reunión en tu turno de cierre. Ninguna puede esperar. Tú decides cuál va primero, y luego haces las tres.",
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
    urgencyQ: "Which do you do first? Why?",
    urgencyPh: "Optional: explain your choice in your own words…",
    urgencyCta: "That's what I'll do first",
    hubHeading: "Still open",
    mailTitle: "Customer complaint",
    mailBody: "A customer received the wrong drink after a long wait. Refunds need manager approval.",
    mailCta: "Open Mail",
    coverTitle: "Tonight's close is short on people",
    coverBody: "Thursday 4–10 PM has no coverage. The crew table lists hours and availability.",
    coverCta: "Open the sheet",
    calTitle: "Renata's 5 PM huddle",
    calBody: "Renata’s proposed meeting overlaps your closing shift.",
    calCta: "Open Calendar",
    from: "From",
    subject: "My order was wrong and I waited 20 minutes",
    customerBody: [
      "I came in at 3:10. I asked for oat milk. I got regular. I waited at the pickup counter.",
      "This is the second time this month. I want to know what you are going to do.",
      "Dana Cole",
    ],
    replyPh: "Write a short, professional reply…",
    send: "Send",
    coverNote: "Thursday close 4–10 PM. One person. Check Hours.",
    hoursHeader: "Hours",
    pickShift: "Add 4–10…",
    meetingTitle: "Friday numbers: Renata",
    meetingWhen: `${cardDate(STORY_DAY_BY_LEVEL.level12, "en")} · 5:00–5:20 PM`,
    meetingNote: "You close tonight, 4–10 PM.",
    accept: "Yes",
    no: "No",
    propose: "Propose a new time",
    sentKicker: "All three done",
    doneTitle: "You kept the floor running and answered all three.",
    doneBody: "The customer got a real answer. Thursday's close has someone on it. Renata's huddle moved to a time that works. That is what a shift supervisor does. Renata left you a note about what comes next.",
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
    urgencyQ: "¿Qué haces primero? ¿Por qué?",
    urgencyPh: "Opcional: explica tu elección con tus propias palabras…",
    urgencyCta: "Eso es lo que voy a hacer primero",
    hubHeading: "Siguen abiertas",
    mailTitle: "Queja de un cliente",
    mailBody: "Un cliente recibió la bebida equivocada después de una larga espera. Los reembolsos requieren aprobación de gerencia.",
    mailCta: "Abrir Correo",
    coverTitle: "Al cierre de esta noche le falta gente",
    coverBody: "El jueves de 4 a 10 PM no tiene cobertura. La tabla del equipo muestra horas y disponibilidad.",
    coverCta: "Abrir la hoja",
    calTitle: "La reunión de Renata a las 5",
    calBody: "La reunión propuesta por Renata coincide con tu turno de cierre.",
    calCta: "Abrir Calendar",
    from: "De",
    subject: "Mi pedido estaba mal y esperé 20 minutos",
    customerBody: [
      "Llegué a las 3:10. Pedí leche de avena. Me dieron leche normal. Esperé en el mostrador.",
      "Es la segunda vez este mes. Quiero saber qué van a hacer.",
      "Dana Cole",
    ],
    replyPh: "Escribe una respuesta corta y profesional…",
    send: "Enviar",
    coverNote: "Cierre del jueves 4–10 PM. Una persona. Revisa Horas.",
    hoursHeader: "Horas",
    pickShift: "Agregar 4–10…",
    meetingTitle: "Números del viernes: Renata",
    meetingWhen: `${WEEKDAY_SHORT.es[4]} ${shortDate(STORY_DAY_BY_LEVEL.level12, "es")} · 5:00–5:20 PM`,
    meetingNote: "Esta noche cierras, de 4 a 10 PM.",
    accept: "Sí",
    no: "No",
    propose: "Proponer otra hora",
    sentKicker: "Las tres listas",
    doneTitle: "Mantuviste el local funcionando y respondiste las tres.",
    doneBody: "El cliente recibió una respuesta de verdad. El cierre del jueves ya tiene a alguien. La reunión de Renata se movió a una hora que funciona. Eso es lo que hace quien supervisa un turno. Renata te dejó una nota sobre lo que sigue.",
    badgeName: "Atender tres pedidos a la vez",
    badgeWhere: "Cuenta para: Shift Supervisor",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
    askPerson: "Mejor preguntar a una persona",
  },
};

/**
 * The crew sheet for this week. `hours` is the week so far; the 4–10 PM close
 * adds 6. The right cover is free Thursday evening and stays at 40 or less.
 * Jordan's 30 is last week's 24 plus the Saturday close picked in Level 9.
 */
export const COVER_SHIFT_HOURS = 6;
export const COVER = [
  {
    key: "alex", name: "Alex Chen", hours: 40, freeThursday: true,
    thursday: { en: "Free after 4 PM", es: "Libre después de las 4 PM" },
    hint: { en: "Alex already has 40 hours. Six more is overtime.", es: "Alex ya tiene 40 horas. Seis más es tiempo extra." },
  },
  {
    key: "riley", name: "Riley Park", hours: 36, freeThursday: true,
    thursday: { en: "Free after 4 PM", es: "Libre después de las 4 PM" },
    hint: { en: "Riley has 36 hours. Six more is 42, over 40.", es: "Riley tiene 36 horas. Seis más son 42, más de 40." },
  },
  {
    key: "jordan", name: "Jordan Kim", hours: 30, freeThursday: true,
    thursday: { en: "Free after 4 PM", es: "Libre después de las 4 PM" },
    hint: { en: "", es: "" },
  },
  {
    key: "sam", name: "Sam Rivera", hours: 32, freeThursday: false,
    thursday: { en: "Working 8 AM–4 PM", es: "Trabaja de 8 AM a 4 PM" },
    hint: { en: "Sam works 8 AM–4 PM Thursday. A close after that is a 14-hour day.", es: "Sam trabaja de 8 AM a 4 PM el jueves. Un cierre después sería un día de 14 horas." },
  },
  {
    key: "casey", name: "Casey Brooks", hours: 28, freeThursday: false,
    thursday: { en: "Requested off", es: "Pidió el día libre" },
    hint: { en: "Casey requested Thursday off. Look at the Thursday column.", es: "Casey pidió el jueves libre. Mira la columna del jueves." },
  },
] as const;

/** A cover works when the person is free Thursday evening and stays at 40 hours or less. */
export function coverWorks(key: string): boolean {
  const person = COVER.find((p) => p.key === key);
  if (!person) return false;
  return person.freeThursday && person.hours + COVER_SHIFT_HOURS <= 40;
}

/** The column headers of the cover sheet. */
export const COVER_TABLE_COPY: Record<"name" | "thursday" | "addShift" | "reference", Localized> = {
  name: { en: "Name", es: "Nombre" },
  thursday: { en: "Thursday", es: "Jueves" },
  addShift: { en: "Add shift", es: "Agregar turno" },
  reference: { en: "Situation reference", es: "Referencia de la situación" },
};

/** Your own shifts, shown on Renata's invite so the new time is a real choice. */
export const YOUR_SHIFTS: Localized = {
  en: "Your shifts: Thu 4–10 PM · Fri 4–10 PM · Sat off",
  es: "Tus turnos: jue 4–10 PM · vie 4–10 PM · sáb libre",
};

export const MEETING_SLOTS = [
  {
    key: "thu7", label: { en: "Thu 7:00 PM", es: "Jue 7:00 PM" },
    hint: { en: "Thursday 7 PM is during your close. Look at your shifts.", es: "El jueves a las 7 PM es durante tu cierre. Mira tus turnos." },
  },
  {
    key: "fri5", label: { en: "Fri 5:00 PM", es: "Vie 5:00 PM" },
    hint: { en: "Friday 5 PM is during your Friday close. Look at your shifts.", es: "El viernes a las 5 PM es durante tu cierre del viernes. Mira tus turnos." },
  },
  { key: "sat10", label: { en: "Sat 10:00 AM", es: "Sáb 10:00 AM" }, hint: { en: "", es: "" } },
] as const;

/** The only new time outside your shifts is Saturday morning. */
export function meetingSlotWorks(key: string): boolean {
  return key === "sat10";
}

export const MAIL_STARTERS: Record<Lang, string[]> = {
  en: [
    "Hi Dana, I'm sorry about the wait and the wrong drink.",
    "I'll look at what happened on that order today.",
    "Thank you for telling us. Harborside",
  ],
  es: [
    "Hola Dana, siento la espera y la bebida incorrecta.",
    "Voy a revisar qué pasó con ese pedido hoy.",
    "Gracias por avisarnos. Harborside",
  ],
};

export const HINTS: Record<Lang, { urgency: string; overpromise: string; ack: string; empty: string; cover: string; accept: string; no: string }> = {
  en: {
    urgency: "Look at the times again. What is happening now? What starts soon? What can move to a new time?",
    overpromise: "Don't promise a free drink or a refund here. Say you know it happened and that you will look into it.",
    ack: "Tell Dana you know it happened. Say sorry, or say you will check on it.",
    empty: "Write a short reply first.",
    cover: "Look at Hours and Thursday. Pick someone who is free 4–10 PM and stays at 40 hours or less.",
    accept: "5 PM is during your close. Look at your shifts. Propose a new time.",
    no: "Renata still needs the meeting. Look at your shifts. Propose a new time.",
  },
  es: {
    urgency: "Mira las horas otra vez. ¿Qué está pasando ahora? ¿Qué empieza pronto? ¿Qué se puede mover a otra hora?",
    overpromise: "No prometas una bebida gratis ni un reembolso. Dile que sabes lo que pasó y que lo vas a revisar.",
    ack: "Dile a Dana que sabes lo que pasó. Pide perdón, o di que lo vas a revisar.",
    empty: "Primero escribe una respuesta corta.",
    cover: "Mira Horas y el jueves. Elige a alguien libre de 4 a 10 PM que quede con 40 horas o menos.",
    accept: "Las 5 PM es durante tu cierre. Mira tus turnos. Propón otra hora.",
    no: "Renata igual necesita la reunión. Mira tus turnos. Propón otra hora.",
  },
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Say which one you'll do first. Then finish all three",
      s: [
        "Both the waiting customer and the approaching staffing gap have a supported reason to come first. A customer who is still here, a gap in tonight's close, and a meeting on your shift are all real problems.",
        "Say which one you will do first. Then handle the other two before you leave the computer.",
        "The customer reply is short and honest. Do not offer free food or a refund. Picking who covers the shift is the same as Level 9. Moving the meeting is the same as Level 4.",
      ],
      tip: "Three tasks at once is the most you should take on without a break. If it feels like too much, say so in the check-in. That helps. It is not a failure.",
    },
  ],
  es: [
    {
      t: "Di cuál vas a hacer primero. Luego termina las tres",
      s: [
        "Tanto el cliente que espera como el próximo turno sin cubrir tienen motivos válidos para ir primero. Un cliente que sigue ahí, un hueco en el cierre de esta noche y una reunión en tu turno son problemas reales, los tres.",
        "Di cuál vas a hacer primero. Luego atiende las otras dos antes de dejar la computadora.",
        "La respuesta al cliente es corta y honesta. No ofrezcas comida gratis ni un reembolso. Elegir quién cubre el turno es lo mismo que el Nivel 9. Mover la reunión es lo mismo que el Nivel 4.",
      ],
      tip: "Tres tareas a la vez es lo máximo que deberías tomar sin un descanso. Si se siente demasiado, dilo en el check-in. Eso ayuda, no es un fracaso.",
    },
  ],
};


/** Promising something the learner cannot authorize. The one hard "no". */
const OVERPROMISE =
  /\bfree\b|\brefund\b|\bcomp(ed)?\b|\bon the house\b|\bgratis\b|\breembolso\b|\bdevolucion\b/;

/**
 * Acknowledging the customer, in either language. Deliberately wide: the job
 * is "say sorry and say you will look into it", and a learner who writes a
 * perfectly good reply in words we did not think of must not be told they
 * over-promised. Prefer letting a weak reply through over failing a real one.
 */
const ACKNOWLEDGES =
  /sorry|apolog|regret|understand|thank|look into|looking into|look at|check|fix|make (it|this) right|speak|talk|tell|ask|let .{1,20} know|find out|follow up|right away|new (drink|one|order)|remake|make (you )?(a|another)|perd[oó]n|siento|lamento|disculp|gracias|revis|entiendo|comprend|arregl|corrig|hablar[eé]?|dec[ií]r|dig[oa]|avis|pregunt|enseguida|otra (bebida|vez)|nueva/;

/** Why the customer reply is not sent yet, or "ok". */
export type CustomerReplyVerdict = "ok" | "empty" | "overpromise" | "no-ack";

/**
 * The one hard "no" is promising something a shift lead cannot give: a free
 * drink or a refund. A refusal of one ("I can't give a refund") is not a
 * promise. Otherwise, any honest acknowledgement passes: "ok sorry", "I will
 * tell the barista about the milk". A reply that acknowledges nothing is told
 * so, and is never accused of over-promising.
 */
export function customerReplyVerdict(body: string): CustomerReplyVerdict {
  if (!body.trim()) return "empty";
  // A wider window, so "I can't give you a refund" reads as the refusal it is.
  if (affirms(body, OVERPROMISE, 4)) return "overpromise";
  return ACKNOWLEDGES.test(normalizeReply(body)) ? "ok" : "no-ack";
}

export function replyIsSafe(body: string) {
  return customerReplyVerdict(body) === "ok";
}

/** What the teacher sees: the "what's most urgent" call and the customer reply. */
export function describeSubmission(
  input: { urgency: string; reply: string; priority?: string },
  lang: Lang,
): SubmissionContent {
  const c = PRIORITY_COPY[lang];
  return {
    lang,
    fields: [
      { label: c.urgencyQ, value: input.urgency },
      { label: c.subject, value: input.reply },
      ...(PRIORITY_OPTIONS.find((option) => option.key === input.priority) ? [{ label: PRIORITY_CHOICE_LABEL[lang], value: PRIORITY_OPTIONS.find((option) => option.key === input.priority)!.label[lang] }] : []),
    ],
  };
}

/** The persistent "what to do right now" line, one per step of this job. */
export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  { en: "Read the three requests. Choose which to do first and a reason supported by the information.", es: "Lee las tres solicitudes. Elige cuál hacer primero y una razón basada en la información." },
  { en: "Complete all three requests.", es: "Completa las tres solicitudes." },
  { en: "Reply to the customer and say you will check the problem. Do not promise a free item or refund. Then send your reply.", es: "Responde al cliente y di que vas a revisar el problema. No prometas un producto gratis ni un reembolso. Después envía tu respuesta." },
  { en: "Choose an available coworker to cover tonight’s closing shift.", es: "Elige a un compañero disponible para cubrir el turno de cierre de esta noche." },
  { en: "Compare the meeting time with your closing shift. Respond to the invitation.", es: "Compara la hora de la reunión con tu turno de cierre. Responde a la invitación." },
];


export const PRIORITY_REFERENCE: Localized = {
  en: "Thursday, 3:40 PM. Dana is waiting now. Dana got the wrong drink after a 20-minute wait. The 4 PM shift has nobody. Renata's meeting is at 5, during your shift. You will do all three.",
  es: "Jueves, 3:40 PM. Dana está esperando ahora. Le dieron la bebida equivocada después de esperar 20 minutos. El turno de las 4 PM no tiene a nadie. La reunión de Renata es a las 5, durante tu turno. Vas a hacer las tres cosas.",
};
export const PRIORITY_OPTIONS = [
  { key: "customer-wait", supported: true, label: { en: "Dana first. Dana is waiting now.", es: "Primero Dana. Dana está esperando ahora." } },
  { key: "cover-start", supported: true, label: { en: "The shift first. It starts at 4 and has nobody.", es: "Primero el turno. Empieza a las 4 y no tiene a nadie." } },
  { key: "manager-title", supported: false, label: { en: "The meeting first. Renata is the manager.", es: "Primero la reunión. Renata es la gerente." } },
  { key: "tomorrow", supported: false, label: { en: "None today. Do all three tomorrow.", es: "Ninguna hoy. Hacer las tres mañana." } },
];
export const PRIORITY_CHOICE_LABEL: Localized = {en:'Priority and reason',es:'Prioridad y motivo'};
export function priorityIsSupported(key: string): boolean { return PRIORITY_OPTIONS.some((option) => option.key === key && option.supported); }

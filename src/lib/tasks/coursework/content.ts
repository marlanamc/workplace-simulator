import type { Lang, Lesson, Localized, SubmissionContent } from "@/lib/task-types";

export const DUE = { en: "Friday, 11:59 PM", es: "Viernes, 11:59 PM" };

/**
 * The day the learner is working on it. Without a "today" the due date is a
 * matching exercise; with one, "how much time do you have?" is a reasoning
 * step. Story mode is on Thursday too ("Something is due tomorrow night").
 */
export const TODAY: Localized = { en: "Thursday", es: "jueves" };

export const COURSEWORK_COPY: Record<Lang, {
  helpBtn: string;
  course: string;
  heading: string;
  syllabus: string;
  dueLabel: string;
  assignment: string;
  prompt: string;
  writeHere: string;
  submit: string;
  needAck: string;
  wrongDeadline: string;
  todayLabel: string;
  timeLabel: string;
  chooseTime: string;
  needTime: string;
  empty: string;
  weak: string;
  noApology: string;
  noAction: string;
  refuses: string;
  blank: string;
  sentKicker: string;
  tryAgain: string;
  backToDesk: string;
  lessonKicker: string;
  tipLabel: string;
  gotIt: string;
  /** Google Classroom chrome. */
  tabs: [string, string, string];
  yourWork: string;
  assigned: string;
  turnedIn: string;
  points: string;
  deadlineLabel: string;
  chooseDeadline: string;
  instructionsLabel: string;
  emailLabel: string;
  emailFrom: string;
  emailSubject: string;
  emailBody: string;
  answerLabel: string;
  privateComments: string;
}> = {
  en: {
    helpBtn: "Help me with this step",
    course: "Workplace Writing 101",
    heading: "This week's assignment",
    syllabus: "In this homework, you work at a café. A customer sent the café the email below. Write back to her in 2 or 3 sentences. Late work is not accepted.",
    dueLabel: "Due",
    assignment: "How would you reply?",
    prompt: "Say you are sorry, and say one thing you will do to fix it.",
    writeHere: "Write your reply…",
    submit: "Submit assignment",
    needAck: "First choose the due date in When is it due? It is under the title, after Due.",
    wrongDeadline: "Look under the title, after Due. What day and what time does it say?",
    todayLabel: "Today",
    timeLabel: "How much time do you have?",
    chooseTime: "Choose one",
    needTime: "Today is Thursday. Choose how much time you have before it is due.",
    empty: "Write a short reply to Dana first.",
    weak: "Say sorry, and say one thing you will do. For example: I am sorry. I will make you a new latte.",
    noApology: "Your reply needs a sorry. Add a sentence like: I am sorry.",
    noAction: "You said sorry. Now say one thing you will do, like: I will make you a new latte.",
    refuses: "Your reply says you will not help. Dana is a customer. Say sorry, and say one thing you will do.",
    blank: "Your reply still has ___ in it. Write your own words there.",
    sentKicker: "Assignment submitted",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
    tabs: ["Stream", "Classwork", "People"],
    yourWork: "Your work",
    assigned: "Assigned",
    turnedIn: "Turned in",
    points: "100 points",
    deadlineLabel: "When is it due?",
    chooseDeadline: "Choose a day",
    instructionsLabel: "Instructions",
    emailLabel: "The customer's email",
    emailFrom: "From: Dana Price",
    emailSubject: "Subject: Wrong order again",
    emailBody: "I ordered a large latte this morning and got a small black coffee. This is the second time this week. Please fix this.",
    answerLabel: "Your reply to Dana",
    privateComments: "Private comments",
  },
  es: {
    helpBtn: "Ayúdame con este paso",
    course: "Escritura en el trabajo 101",
    heading: "Tarea de esta semana",
    syllabus: "En esta tarea, trabajas en un café. Una clienta le mandó al café el correo de abajo. Contéstale en 2 o 3 oraciones. No se acepta tarea tarde.",
    dueLabel: "Entrega",
    assignment: "¿Cómo responderías?",
    prompt: "Di que lo sientes, y di una cosa que vas a hacer para arreglarlo.",
    writeHere: "Escribe tu respuesta…",
    submit: "Entregar tarea",
    needAck: "Primero elige la fecha de entrega en ¿Cuándo se entrega? Está debajo del título, después de Entrega.",
    wrongDeadline: "Mira debajo del título, después de Entrega. ¿Qué día y qué hora dice?",
    todayLabel: "Hoy",
    timeLabel: "¿Cuánto tiempo tienes?",
    chooseTime: "Elige una opción",
    needTime: "Hoy es jueves. Elige cuánto tiempo tienes antes de la entrega.",
    empty: "Primero escribe una respuesta corta para Dana.",
    weak: "Di que lo sientes, y di una cosa que vas a hacer. Por ejemplo: Lo siento. Te voy a preparar un latte nuevo.",
    noApology: "A tu respuesta le falta una disculpa. Agrega una oración como: Lo siento.",
    noAction: "Ya dijiste que lo sientes. Ahora di una cosa que vas a hacer, por ejemplo: Te voy a preparar un latte nuevo.",
    refuses: "Tu respuesta dice que no vas a ayudar. Dana es una clienta. Di que lo sientes, y di una cosa que vas a hacer.",
    blank: "Tu respuesta todavía tiene ___. Escribe ahí tus propias palabras.",
    sentKicker: "Tarea entregada",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
    tabs: ["Novedades", "Trabajo en clase", "Personas"],
    yourWork: "Tu trabajo",
    assigned: "Asignada",
    turnedIn: "Entregada",
    points: "100 puntos",
    deadlineLabel: "¿Cuándo se entrega?",
    chooseDeadline: "Elige un día",
    instructionsLabel: "Instrucciones",
    emailLabel: "El correo de la clienta",
    emailFrom: "De: Dana Price",
    emailSubject: "Asunto: Otra vez el pedido mal",
    emailBody: "Pedí un latte grande esta mañana y me dieron un café negro pequeño. Es la segunda vez esta semana. Por favor, arréglenlo.",
    answerLabel: "Tu respuesta para Dana",
    privateComments: "Comentarios privados",
  },
};

/**
 * Frames, not answers: each line leaves the part that shows the skill (what
 * went wrong, what you will do) as a blank. The grader rejects a reply that
 * still has a blank in it, so one click plus Submit no longer passes.
 */
export const STARTERS: Record<Lang, string[]> = {
  en: [
    "Hi Dana, I am sorry that ___.",
    "I will ___.",
    "Next time you come in, ___.",
  ],
  es: [
    "Hola Dana, siento mucho que ___.",
    "Voy a ___.",
    "La próxima vez que vengas, ___.",
  ],
};

/** What the teacher sees: the assignment prompt and the learner's written reply. */
export function describeSubmission(body: string, lang: Lang): SubmissionContent {
  return { lang, fields: [{ label: COURSEWORK_COPY[lang].assignment, value: body }] };
}

/** What a reply to Dana is missing, in the order the correction names it. */
export type ReplyProblem = "empty" | "blank" | "refuses" | "noApology" | "noAction" | "weak";

const strip = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const APOLOGY = /\b(sorry|apolog\w*|excuse|forgive|siento|sentimos|disculp\w*|perdon\w*|lament\w*)\b/;

/** Promises that are negative in form but are still an action. */
const PROMISE = /\b(will not|won't|wont|never|doesn't|does not|no)\s+(\w+\s+){0,2}(happen|pase|pasar|vuelva a pasar)\b|\bnot happen again\b|\bno (vuelva|va) a pasar\b/;

/** Stock phrases with "no" in them that are friendly, not refusals. */
const FRIENDLY_NO = /\b(no problem|no worries|no hay problema|no te preocupes|no cost|sin costo|no charge)\b/g;

/**
 * Something the writer will do for Dana. Stems, so "I fix it", "I will
 * fix it", "we're fixing it" and "lo arreglo" all count; "look" alone does
 * not (only "look into"), so "I look at the sky every day" is no action.
 */
const ACTION =
  /\b(fix\w*|mak(e|es|ing)|made you|remak\w*|giv\w*|send\w*|replac\w*|refund\w*|call\w*|talk\w*|speak\w*|check\w*|look into|bring\w*|prepar\w*|chang\w*|correct\w*|help\w*|pay\w*|credit\w*|offer\w*|return\w*|contact\w*|follow\w* up|take care|solv\w*|resolv\w*|redo\w*|free|discount|new (latte|coffee|drink|order|one)|another (latte|coffee|drink|one)|arregl\w*|reemplaz\w*|reembols\w*|devolv\w*|devuelv\w*|cambi\w*|llam\w*|habl\w*|revis\w*|mand\w*|envi\w*|doy|dar|darte|damos|regal\w*|hacer|hago|haremos|corrij\w*|correg\w*|solucion\w*|resolv\w*|ayud\w*|gratis|descuento|nuev[oa]|otro (latte|cafe))\b/g;

const NEGATION = /^(not|never|no|nunca|ni|nothing|nada)$|n't$|^(wont|cant|dont|didnt|cannot)$/;

const RUDE = /\b(go away|leave me alone|shut up|not my problem|your problem|don't care|dont care|vete|dejame en paz|no es mi problema|no me importa|callate)\b/;

/** Actions in the text that are not negated ("I will not fix it" is no action). */
function actions(t: string): { any: boolean; negated: boolean } {
  let any = false;
  let negated = false;
  for (const m of t.matchAll(ACTION)) {
    const before = t.slice(0, m.index).split(/[.!?,;:\n]/).pop() ?? "";
    const words = before.split(/[^a-z']+/).filter(Boolean).slice(-4);
    if (words.some((w) => NEGATION.test(w))) negated = true;
    else any = true;
  }
  return { any, negated };
}

/**
 * A reply to Dana: says sorry, and says one thing the writer will do.
 * Short is fine ("Sorry. I fix it."); refusing is not ("I will not fix
 * it."), and neither is a sentence that only has a common word in it
 * ("I look at the sky every day.").
 */
export function replyProblem(body: string): ReplyProblem | null {
  const raw = body.trim();
  if (!raw) return "empty";
  if (/_{2,}/.test(raw)) return "blank";
  const t = strip(raw).replace(FRIENDLY_NO, " ");
  const apology = APOLOGY.test(t);
  const promise = PROMISE.test(t);
  const act = actions(t.replace(PROMISE, " "));
  if (RUDE.test(t) || (act.negated && !act.any && !promise)) return "refuses";
  const hasAction = act.any || promise;
  if (!apology && !hasAction) return "weak";
  if (!apology) return "noApology";
  if (!hasAction) return "noAction";
  return null;
}

export function responseIsComplete(body: string): boolean {
  return replyProblem(body) === null;
}

/** The Job Card correction for each problem. */
export function replyCorrection(problem: ReplyProblem, lang: Lang): string {
  return COURSEWORK_COPY[lang][problem];
}

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "The due date is part of the assignment",
      s: [
        "Before you write, find the due date. It is under the title of the assignment.",
        "Then look at Today at the top. Count how much time you have.",
        "Then read the instructions and the customer's email.",
        "A good reply is short: say sorry, and say one thing you will do.",
      ],
      tip: "Late work is not accepted in this class. Always look for the due date first.",
    },
  ],
  es: [
    {
      t: "La fecha de entrega es parte de la tarea",
      s: [
        "Antes de escribir, busca la fecha de entrega. Está debajo del título de la tarea.",
        "Después mira Hoy arriba. Cuenta cuánto tiempo tienes.",
        "Después lee las instrucciones y el correo de la clienta.",
        "Una buena respuesta es corta: di que lo sientes, y di una cosa que vas a hacer.",
      ],
      tip: "En esta clase no se acepta tarea tarde. Siempre busca primero la fecha de entrega.",
    },
  ],
};

/** Show me's bubble on a reading step: it points at evidence, not something to click. */
export const SHOW_ME_LOOK: Localized = { en: "Look here.", es: "Mira aquí." };

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Find the due date under the title. Choose it in When is it due?",
    es: "Busca la fecha de entrega debajo del título. Elígela en ¿Cuándo se entrega?",
  },
  {
    en: "Look at Today at the top. How much time do you have? Choose it.",
    es: "Mira Hoy arriba. ¿Cuánto tiempo tienes? Elígelo.",
  },
  {
    en: "Read Dana's email. Write a short reply: say sorry, and say what you will do. Then click Submit assignment.",
    es: "Lee el correo de Dana. Escribe una respuesta corta: di que lo sientes, y di qué vas a hacer. Después haz clic en Entregar tarea.",
  },
];

/**
 * Four due dates that differ in the day and the time, so only reading
 * "Due Friday, 11:59 PM" finds the right one (not a guess among three
 * "11:59 PM" lines).
 */
export const DEADLINE_OPTIONS = [
  { key: "thu", label: { en: "Thursday, 11:59 PM", es: "Jueves, 11:59 PM" } },
  { key: "fri-am", label: { en: "Friday, 9:00 AM", es: "Viernes, 9:00 AM" } },
  { key: "fri", label: { en: "Friday, 11:59 PM", es: "Viernes, 11:59 PM" } },
  { key: "sat-am", label: { en: "Saturday, 9:00 AM", es: "Sábado, 9:00 AM" } },
];
export function deadlineIsCorrect(key: string): boolean { return key === "fri"; }

/**
 * "Today is Thursday. It is due Friday night. How much time?" Each wrong
 * answer gets a question that points back at the two facts on screen.
 */
export const TIME_LEFT_OPTIONS: { key: string; label: Localized; hint: Localized }[] = [
  {
    key: "tonight",
    label: { en: "It is due tonight", es: "Se entrega esta noche" },
    hint: { en: "Tonight is Thursday night. The due date says Friday. Is that tonight?", es: "Esta noche es jueves en la noche. La entrega dice viernes. ¿Es esta noche?" },
  },
  {
    key: "tomorrow",
    label: { en: "It is due tomorrow night", es: "Se entrega mañana en la noche" },
    hint: { en: "", es: "" },
  },
  {
    key: "week",
    label: { en: "I have one week", es: "Tengo una semana" },
    hint: { en: "Today is Thursday. It is due this Friday. Is that one week?", es: "Hoy es jueves. Se entrega este viernes. ¿Eso es una semana?" },
  },
  {
    key: "late",
    label: { en: "It is already late", es: "Ya es tarde" },
    hint: { en: "Today is Thursday. Friday has not come yet. Is it late?", es: "Hoy es jueves. Todavía no llega el viernes. ¿Es tarde?" },
  },
];
export function timeLeftIsCorrect(key: string): boolean { return key === "tomorrow"; }

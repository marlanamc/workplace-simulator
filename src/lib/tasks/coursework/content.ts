import type { Lang, Lesson, Localized, SubmissionContent } from "@/lib/task-types";

export const DUE = { en: "Friday, 11:59 PM", es: "Viernes, 11:59 PM" };

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
  empty: string;
  weak: string;
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
    syllabus: "Read the customer's email below. Write a short reply, 2 or 3 sentences, like you would at work. Due Friday, 11:59 PM. Late work is not accepted.",
    dueLabel: "Due",
    assignment: "How would you reply?",
    prompt: "Say you are sorry, and say one thing you will do to fix it.",
    writeHere: "Write your reply…",
    submit: "Submit assignment",
    needAck: "First find the due date. It is under the title. Choose it in When is it due?",
    empty: "Write a short reply to Dana first.",
    weak: "Say sorry, and say one thing you will do. For example: I will make you a new latte.",
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
    syllabus: "Lee el correo del cliente abajo. Escribe una respuesta corta, de 2 o 3 oraciones, como lo harías en el trabajo. Entrega: viernes, 11:59 PM. No se acepta tarde.",
    dueLabel: "Entrega",
    assignment: "¿Cómo responderías?",
    prompt: "Di que lo sientes, y di una cosa que vas a hacer para arreglarlo.",
    writeHere: "Escribe tu respuesta…",
    submit: "Entregar tarea",
    needAck: "Primero busca la fecha de entrega. Está debajo del título. Elígela en ¿Cuándo se entrega?",
    empty: "Primero escribe una respuesta corta para Dana.",
    weak: "Di que lo sientes, y di una cosa que vas a hacer. Por ejemplo: Te voy a preparar un latte nuevo.",
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
    emailLabel: "El correo del cliente",
    emailFrom: "De: Dana Price",
    emailSubject: "Asunto: Otra vez el pedido mal",
    emailBody: "Pedí un latte grande esta mañana y me dieron un café negro pequeño. Es la segunda vez esta semana. Por favor, arréglenlo.",
    answerLabel: "Tu respuesta para Dana",
    privateComments: "Comentarios privados",
  },
};

export const STARTERS: Record<Lang, string[]> = {
  en: [
    "Hi Dana, I am sorry we got your order wrong.",
    "Next time you come in, I will make you a large latte for free.",
    "I will also talk to my manager so it does not happen again.",
  ],
  es: [
    "Hola Dana, siento mucho que nos equivocamos con tu pedido.",
    "La próxima vez que vengas, te preparo un latte grande gratis.",
    "También voy a hablar con mi gerente para que no vuelva a pasar.",
  ],
};

/** What the teacher sees: the assignment prompt and the learner's written reply. */
export function describeSubmission(body: string, lang: Lang): SubmissionContent {
  return { lang, fields: [{ label: COURSEWORK_COPY[lang].assignment, value: body }] };
}

/**
 * A real reply: a sentence or more that says sorry, thanks them, or says
 * what happens next. Many words count, because learners say it many ways
 * ("I will call you", "we can fix it", "te preparo otro").
 */
export function responseIsComplete(body: string): boolean {
  const t = body.trim();
  if (t.length < 20) return false;
  return /thank|gracias|sorry|apolog|siento|disculp|perd[oó]n|look|revis|follow|seguir|check|hablar|talk|manager|gerente|today|hoy|afternoon|tarde|will|i'll|we'll|can |call|llam|fix|arregl|replace|reemplaz|refund|reembols|new |nuev|free|gratis|voy a|vamos a|puedo|prepar|make/.test(
    t.toLowerCase(),
  );
}

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "The due date is part of the assignment",
      s: [
        "Before you write, find the due date. It is under the title of the assignment.",
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
        "Después lee las instrucciones y el correo del cliente.",
        "Una buena respuesta es corta: di que lo sientes, y di una cosa que vas a hacer.",
      ],
      tip: "En esta clase no se acepta tarea tarde. Siempre busca primero la fecha de entrega.",
    },
  ],
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Find the due date under the title. Choose it in When is it due?",
    es: "Busca la fecha de entrega debajo del título. Elígela en ¿Cuándo se entrega?",
  },
  {
    en: "Read Dana's email. Write a short reply: say sorry, and say what you will do.",
    es: "Lee el correo de Dana. Escribe una respuesta corta: di que lo sientes, y di qué vas a hacer.",
  },
  { en: "Click Submit assignment.", es: "Haz clic en Entregar tarea." },
];

export const DEADLINE_OPTIONS = [
  { key: 'thu', label: { en: 'Thursday, 11:59 PM', es: 'Jueves, 11:59 PM' } },
  { key: 'fri', label: { en: 'Friday, 11:59 PM', es: 'Viernes, 11:59 PM' } },
  { key: 'sat', label: { en: 'Saturday, 11:59 PM', es: 'Sábado, 11:59 PM' } },
];
export function deadlineIsCorrect(key: string): boolean { return key === 'fri'; }

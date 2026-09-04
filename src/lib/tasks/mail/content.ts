import { CAST, inboxSender } from "@/lib/cast";
import { mailGreeting } from "@/lib/mail-greeting";
import type { EventIntroCopy, Lang, Lesson, Localized, PickableItem } from "@/lib/task-types";

/** Placeholder line swapped for "Hi Ana," when the body is read for a learner. */
const GREETING = "__GREETING__";

/** Day One is 2 jobs in the same inbox: welcome thank-you, then safety report with a file. */
export type PlayableMailTask =
  | "mail-reply"
  | "mail-attach"
  | "mail-send-link"
  | "mail-etiquette"
  | "call-out-sick"
  | "reply-all";

/**
 * Every task Mail can run, in the order they're introduced. MailClient
 * derives which one is "next" from this list intersected with the curriculum
 * order, rather than a separate hand-maintained list - a mail task that
 * exists here but isn't reachable is a silent dead end, not a build error.
 */
export const PLAYABLE_MAIL_TASKS: PlayableMailTask[] = ["mail-reply", "mail-attach", "mail-send-link", "mail-etiquette", "call-out-sick", "reply-all"];

/**
 * Tasks where the learner writes to Maria (or a coworker) from scratch
 * rather than replying to something in the inbox. There is no email to open
 * first, so Mail starts on the compose window instead of the message list.
 */
export const COMPOSE_ONLY_TASKS: PlayableMailTask[] = ["mail-send-link", "mail-etiquette", "call-out-sick"];

/** Who the compose pane addresses — reply tasks pre-fill the manager; compose-only tasks pick their recipient. */
export const DANA_EMAIL = "dana.ortiz@harborsidecafe.com";
// reply-all is Act IV, so the manager on the thread is Renata, not Maria.
export const REPLY_ALL_RECIPIENTS = `${DANA_EMAIL}, ${CAST.renata.email}, priya.shah@harborsidecafe.com, ${CAST.jordan.email}`;

export const COMPOSE_RECIPIENT: Record<PlayableMailTask, string> = {
  "mail-reply": CAST.maria.email,
  "mail-attach": CAST.maria.email,
  "mail-send-link": CAST.jordan.email,
  "mail-etiquette": CAST.darnell.email,
  "call-out-sick": CAST.maria.email,
  "reply-all": DANA_EMAIL,
};

export function isComposeOnly(task: PlayableMailTask): boolean {
  return COMPOSE_ONLY_TASKS.includes(task);
}

export const EVENT_INTRO_BY_TASK: Record<PlayableMailTask, Record<Lang, EventIntroCopy>> = {
  "mail-reply": {
    en: {
      emoji: "📬",
      kicker: "Tuesday, 8:14 AM",
      headline: "Your manager says welcome.",
      body: "Maria Delgado runs Harborside Cafe. She sent a short hello and said to call if you need anything. Write her a thank-you back.",
      cta: "Open my inbox",
    },
    es: {
      emoji: "📬",
      kicker: "Martes, 8:14 AM",
      headline: "Tu gerente te da la bienvenida.",
      body: "Maria Delgado dirige Harborside Cafe. Te envió un saludo corto y dijo que la llames si necesitas algo. Escríbele un agradecimiento.",
      cta: "Abrir mi bandeja",
    },
  },
  "mail-send-link": {
    en: {
      emoji: "🔗",
      kicker: "Wednesday, 10:15 AM",
      headline: "Jordan needs this week's schedule.",
      body: "You just shared the file with Jordan. Now send a short email with the link, so Jordan can open it. Don't attach a copy — a copy goes stale the next time you change the schedule.",
      cta: "Write to Jordan",
    },
    es: {
      emoji: "🔗",
      kicker: "Miércoles, 10:15 AM",
      headline: "Jordan necesita el horario de esta semana.",
      body: "Acabas de compartir el archivo con Jordan. Ahora envía un correo corto con el enlace, para que Jordan lo pueda abrir. No adjuntes una copia — una copia queda vieja la próxima vez que cambies el horario.",
      cta: "Escribirle a Jordan",
    },
  },
  "mail-etiquette": {
    en: {
      emoji: "📧",
      kicker: "Friday, 6:20 PM",
      headline: "Before you go — answer Darnell.",
      body: "Maria says you found extra aprons in the storage room. Darnell asked about them on your first day. Let him know before you leave, so he's not still wondering Monday.",
      cta: "Write to Darnell",
    },
    es: {
      emoji: "📧",
      kicker: "Viernes, 6:20 PM",
      headline: "Antes de irte, respóndele a Darnell.",
      body: "Maria dice que encontraste delantales de más en el almacén. Darnell preguntó por ellos tu primer día. Avísale antes de irte, para que no siga esperando el lunes.",
      cta: "Escribirle a Darnell",
    },
  },
  "call-out-sick": {
    en: {
      emoji: "🤒",
      kicker: "Monday, 6:12 AM",
      headline: "You're sick. You're on at 10.",
      body: "You woke up sick and you're on the schedule this morning. Write Maria now, before your shift — not after it starts.",
      cta: "Write to Maria",
    },
    es: {
      emoji: "🤒",
      kicker: "Lunes, 6:12 AM",
      headline: "Estás enfermo. Entras a las 10.",
      body: "Te despertaste enfermo y hoy tienes turno. Escríbele a Maria ahora, antes de tu turno, no después de que empiece.",
      cta: "Escribirle a Maria",
    },
  },
  "mail-attach": {
    en: {
      emoji: "📎",
      kicker: "Tuesday, 8:20 AM",
      headline: "Maria needs a file.",
      body: "She asked for the July safety report today. First make sure you know what she needs. Then reply and attach the file.",
      cta: "Open my inbox",
    },
    es: {
      emoji: "📎",
      kicker: "Martes, 8:20 AM",
      headline: "Maria necesita un archivo.",
      body: "Pidió el reporte de seguridad de julio para hoy. Primero confirma qué necesita. Luego responde y adjunta el archivo.",
      cta: "Abrir mi bandeja",
    },
  },
  "reply-all": {
    en: {
      emoji: "📬",
      kicker: "Friday. HQ wrote.",
      headline: "Not everyone needs your answer.",
      body: "Read the whole thread. One message is FYI. One asks you a yes or no. Reply to the person who asked.",
      cta: "Open the thread",
    },
    es: {
      emoji: "📬",
      kicker: "Viernes. Escribió HQ.",
      headline: "No todos necesitan tu respuesta.",
      body: "Lee todo el hilo. Un mensaje es solo FYI. Otro te pide un sí o no. Responde a quien preguntó.",
      cta: "Abrir el hilo",
    },
  },
};

/** Comprehension check before the attach reply — "what does she need?" */
export const CONFIRM_COPY: Record<Lang, {
  question: string;
  options: { label: string; correct: boolean }[];
  correctReply: string;
  wrongReply: string;
  continueLabel: string;
  replyAfterLabel: string;
}> = {
  en: {
    question: "What does Maria need?",
    options: [
      { label: "The July safety report, today", correct: true },
      { label: "Help closing the cafe tonight", correct: false },
      { label: "A new work schedule", correct: false },
    ],
    correctReply: "That's it. She needs the July safety report, today.",
    wrongReply: "Read it again. Look for what she's asking for and when.",
    continueLabel: "Continue",
    replyAfterLabel: "Reply with the file",
  },
  es: {
    question: "¿Qué necesita Maria?",
    options: [
      { label: "El reporte de seguridad de julio, hoy", correct: true },
      { label: "Ayuda para cerrar el café esta noche", correct: false },
      { label: "Un nuevo horario de trabajo", correct: false },
    ],
    correctReply: "Así es. Necesita el reporte de seguridad de julio, hoy.",
    wrongReply: "Léelo otra vez. Busca qué pide y cuándo lo necesita.",
    continueLabel: "Continuar",
    replyAfterLabel: "Responder con el archivo",
  },
};

/** Per-job done-screen copy. */
export const DONE_COPY: Record<PlayableMailTask, Record<Lang, {
  kicker: string;
  body: string;
  badgeNumber: string;
  badgeWhere: string;
}>> = {
  "mail-reply": {
    en: {
      kicker: "Message sent",
      body: "You thanked Maria. Next she will ask for a file — read what she needs, then send it attached.",
      badgeNumber: "01",
      badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    },
    es: {
      kicker: "Mensaje enviado",
      body: "Le agradeciste a Maria. Después te pedirá un archivo: lee qué necesita y envíalo adjunto.",
      badgeNumber: "01",
      badgeWhere: "Cuenta para: Oficina · Servicio de alimentos",
    },
  },
  "mail-send-link": {
    en: {
      kicker: "Message sent",
      body: "Jordan can open the schedule from the link, and it will always be the current one. A link points at the live file; an attachment is a copy that stops matching the moment you edit the original.",
      badgeNumber: "09",
      badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    },
    es: {
      kicker: "Mensaje enviado",
      body: "Jordan puede abrir el horario desde el enlace, y siempre será el actual. Un enlace apunta al archivo vivo; un adjunto es una copia que deja de coincidir en cuanto editas el original.",
      badgeNumber: "09",
      badgeWhere: "Cuenta para: Oficina · Servicio de alimentos",
    },
  },
  "mail-etiquette": {
    en: {
      kicker: "Message sent",
      body: "Darnell got a clear answer to a question he'd been waiting on for days: the subject named it, the answer came first, then the detail he needed. That shape is most of what a short work email is.",
      badgeNumber: "05",
      badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    },
    es: {
      kicker: "Mensaje enviado",
      body: "Darnell recibió una respuesta clara a algo que llevaba días esperando: el asunto lo decía, la respuesta venía primero, y luego el detalle que necesitaba. Esa forma es casi todo lo que necesita un correo corto de trabajo.",
      badgeNumber: "05",
      badgeWhere: "Cuenta para: Oficina · Servicio de alimentos",
    },
  },
  "call-out-sick": {
    en: {
      kicker: "Message sent",
      body: "Maria has time to find coverage now, instead of finding out when your shift starts. That is the whole point of writing early.",
      badgeNumber: "06",
      badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    },
    es: {
      kicker: "Mensaje enviado",
      body: "Maria ahora tiene tiempo de buscar quién te cubra, en vez de enterarse cuando empiece tu turno. Ese es el punto de avisar temprano.",
      badgeNumber: "06",
      badgeWhere: "Cuenta para: Oficina · Servicio de alimentos",
    },
  },
  "mail-attach": {
    en: {
      kicker: "Message sent",
      body: "Maria got your reply and the file. In a real job, most asks from a manager look like this. A short answer, with the file attached.",
      badgeNumber: "02",
      badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    },
    es: {
      kicker: "Mensaje enviado",
      body: "Maria recibió tu respuesta y el archivo. En un trabajo real, así se responde a la mayoría de las peticiones de un gerente: una respuesta corta con el archivo adjunto.",
      badgeNumber: "02",
      badgeWhere: "Cuenta para: Oficina · Servicio de alimentos",
    },
  },
  "reply-all": {
    en: {
      kicker: "Message sent",
      body: "Dana got a clear yes. The rest of the thread did not. You edited the casual draft before you sent it.",
      badgeNumber: "18",
      badgeWhere: "Counts toward: Assistant Manager",
    },
    es: {
      kicker: "Mensaje enviado",
      body: "Dana recibió un sí claro. El resto del hilo no. Editaste el borrador informal antes de enviarlo.",
      badgeNumber: "18",
      badgeWhere: "Cuenta para: Asistente de gerencia",
    },
  },
};

export const SUBJECT_BY_TASK: Record<PlayableMailTask, Record<Lang, { subject: string; reSubject: string; preview: string }>> = {
  "mail-reply": {
    en: {
      subject: "Welcome to Harborside Cafe",
      reSubject: "Re: Welcome to Harborside Cafe",
      preview: "You're a new hire. This week you have 5 shifts on the floor.",
    },
    es: {
      subject: "Bienvenido a Harborside Cafe",
      reSubject: "Re: Bienvenido a Harborside Cafe",
      preview: "Eres personal nuevo. Esta semana tienes 5 turnos en el piso.",
    },
  },
  "mail-send-link": {
    en: {
      subject: "This week's schedule",
      reSubject: "This week's schedule",
      preview: "Sending Jordan the link to the shared schedule.",
    },
    es: {
      subject: "El horario de esta semana",
      reSubject: "El horario de esta semana",
      preview: "Enviarle a Jordan el enlace del horario compartido.",
    },
  },
  "mail-etiquette": {
    en: {
      subject: "Extra aprons",
      reSubject: "Extra aprons",
      preview: "Answering Darnell's question from Day One.",
    },
    es: {
      subject: "Delantales de más",
      reSubject: "Delantales de más",
      preview: "Respondiendo la pregunta de Darnell del primer día.",
    },
  },
  "call-out-sick": {
    en: {
      subject: "Can't come in today",
      reSubject: "Can't come in today",
      preview: "Telling Maria before the shift starts.",
    },
    es: {
      subject: "No puedo ir hoy",
      reSubject: "No puedo ir hoy",
      preview: "Avisarle a Maria antes de que empiece el turno.",
    },
  },
  "mail-attach": {
    en: {
      subject: "Need the July safety report today",
      reSubject: "Re: Need the July safety report today",
      preview: "Can you send me the July safety report today?",
    },
    es: {
      subject: "Necesito el reporte de seguridad de julio hoy",
      reSubject: "Re: Necesito el reporte de seguridad de julio hoy",
      preview: "¿Me puedes enviar hoy el reporte de seguridad de julio?",
    },
  },
  "reply-all": {
    en: {
      subject: "Friday delivery window",
      reSubject: "Re: Friday delivery window",
      preview: "Can your cafe take the 6 AM Friday delivery next week?",
    },
    es: {
      subject: "Ventana de entrega del viernes",
      reSubject: "Re: Ventana de entrega del viernes",
      preview: "¿Puede tu café recibir la entrega del viernes a las 6 AM?",
    },
  },
};

export const MAIL_COPY: Record<Lang, {
  practiceBanner: string;
  inbox: string;
  starred: string;
  sent: string;
  drafts: string;
  searchPlaceholder: string;
  compose: string;
  emptyPane: string;
  helpBtn: string;
  langBtn: string;
  reply: string;
  replyAll: string;
  forward: string;
  supervisor: string;
  to: string;
  subjectLabel: string;
  writeHere: string;
  startersLabel: string;
  send: string;
  attach: string;
  discard: string;
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
  pickerTitle: string;
  downloads: string;
  cancel: string;
  open: string;
  colName: string;
  colDate: string;
}> = {
  en: {
    practiceBanner: "Practice space. Nothing here is real.",
    inbox: "Inbox",
    starred: "Starred",
    sent: "Sent",
    drafts: "Drafts",
    searchPlaceholder: "Search mail",
    compose: "Compose",
    emptyPane: "Click an email on the left to open it.",
    helpBtn: "Help me with this step",
    langBtn: "Español",
    reply: "Reply",
    replyAll: "Reply all",
    forward: "Forward",
    supervisor: "Your supervisor",
    to: "To",
    subjectLabel: "Subject",
    writeHere: "Write your message here…",
    startersLabel: "Sentence starters",
    send: "Send",
    attach: "Attach file",
    discard: "Discard",
    sentKicker: "Message sent",
    doneTitle: "You answered your supervisor.",
    doneBody: "Maria got your reply and the file. In a real job, most asks from a manager look like this. A short answer, with the file attached.",
    badgeName: "Reply with an attachment",
    badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
    askPerson: "Ask a person instead",
    pickerTitle: "Choose a file to attach",
    downloads: "Downloads",
    cancel: "Cancel",
    open: "Open",
    colName: "Name",
    colDate: "Date modified",
  },
  es: {
    practiceBanner: "Espacio de práctica. Nada aquí es real.",
    inbox: "Recibidos",
    starred: "Destacados",
    sent: "Enviados",
    drafts: "Borradores",
    searchPlaceholder: "Buscar en el correo",
    compose: "Redactar",
    emptyPane: "Haz clic en un correo a la izquierda para abrirlo.",
    helpBtn: "Ayúdame con este paso",
    langBtn: "English",
    reply: "Responder",
    replyAll: "Responder a todos",
    forward: "Reenviar",
    supervisor: "Tu supervisora",
    to: "Para",
    subjectLabel: "Asunto",
    writeHere: "Escribe tu mensaje aquí…",
    startersLabel: "Frases de ayuda",
    send: "Enviar",
    attach: "Adjuntar archivo",
    discard: "Descartar",
    sentKicker: "Mensaje enviado",
    doneTitle: "Respondiste a tu supervisora.",
    doneBody: "Maria recibió tu respuesta y el archivo. En un trabajo real, así se responde a la mayoría de las peticiones de un gerente: una respuesta corta con el archivo adjunto.",
    badgeName: "Responder con un archivo adjunto",
    badgeWhere: "Cuenta para: Oficina · Servicio de alimentos",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
    askPerson: "Mejor preguntar a una persona",
    pickerTitle: "Elige un archivo para adjuntar",
    downloads: "Descargas",
    cancel: "Cancelar",
    open: "Abrir",
    colName: "Nombre",
    colDate: "Fecha",
  },
};

/**
 * Day One mail bodies. The greeting line is filled in per learner by
 * bodyForTask — Maria always opens by name, the way a real manager does.
 *
 * Bodies stop at the closing ("Thanks," / "See you on the floor,"). The name,
 * title, and contact details underneath are the signature block, rendered from
 * SIGNATURES so every email Maria sends ends the same way — which is the point
 * of a signature, and is not something to retype into each body.
 */
export const CASUAL_DRAFT: Record<Lang, string> = {
  en: "yeah that's fine lol",
  es: "sí está bien jaja",
};

export const REPLY_ALL_THREAD: {
  from: string;
  initials: string;
  color: string;
  time: string;
  to: Localized;
  fyi?: boolean;
  ask?: boolean;
  body: Localized<string[]>;
}[] = [
  {
    from: "Priya Shah",
    initials: "PS",
    color: "#00897b",
    time: "9:02 AM",
    to: { en: "to Cafe leads, HQ Ops", es: "para líderes del café, HQ Ops" },
    fyi: true,
    body: {
      en: [
        "Heads up only — the city is changing Friday truck windows next week.",
        "No action from cafe leads. I will send the new times when I have them.",
      ],
      es: [
        "Solo aviso — la ciudad cambia las ventanas de camiones del viernes la semana que viene.",
        "Los líderes del café no tienen que hacer nada. Envío los horarios nuevos cuando los tenga.",
      ],
    },
  },
  {
    from: "Jordan Kim",
    initials: "JK",
    color: "#0f9d58",
    time: "9:11 AM",
    to: { en: "to Priya Shah", es: "para Priya Shah" },
    fyi: true,
    body: {
      en: ["Got it, thanks Priya. We'll wait for the times."],
      es: ["Enterado, gracias Priya. Esperamos los horarios."],
    },
  },
  {
    from: "Dana Ortiz",
    initials: "DO",
    color: "#7248b9",
    time: "10:04 AM",
    to: { en: "to me, Renata Silva, Priya Shah, Jordan Kim", es: "para mí, Renata Silva, Priya Shah, Jordan Kim" },
    ask: true,
    body: {
      en: [
        "Quick ask for the Assistant Manager — can Harborside take a 6 AM Friday delivery next week?",
        "I only need a yes or no from you. Not a group vote.",
      ],
      es: [
        "Pregunta rápida para el asistente de gerencia — ¿puede Harborside recibir una entrega el viernes a las 6 AM?",
        "Solo necesito un sí o un no de ti. No una votación del grupo.",
      ],
    },
  },
];

export function casualDraftUntouched(body: string, lang: Lang): boolean {
  return body.trim().toLowerCase() === CASUAL_DRAFT[lang].toLowerCase();
}

export function stillSoundsCasual(body: string): boolean {
  return /\blol\b|jaja|yeah that's fine|sí está bien jaja|lmao|haha/.test(body.toLowerCase());
}

export function replyAllAnswersDana(body: string): boolean {
  const t = body.toLowerCase();
  const answers = /yes|no|sí|si\b|podemos|we can|we cannot|no podemos|take|recib/.test(t);
  const aboutDelivery = /friday|viernes|6|delivery|entrega|dock|muelle|am\b/.test(t);
  return answers && aboutDelivery && !stillSoundsCasual(body);
}

/** The email says "attached / adjunto" — the mistake this lesson teaches against. */
export function saysAttached(body: string): boolean {
  return /\battach(ed|ment|ing)?\b|\badjunt|\bse adjunta\b|\ben el adjunto\b/i.test(body);
}

/**
 * A "send the link" email that did its job: it points at the file (a URL, or
 * the words "link"/"enlace"), names what the file is, and does NOT tell Jordan
 * to open an attachment. Deliberately lenient — a learner who wrote a real
 * sentence with "here's the link to the schedule" passes.
 */
export function sendsLinkNotFile(body: string): boolean {
  const t = body.trim();
  if (t.split(/\s+/).filter(Boolean).length < 5) return false;
  if (saysAttached(t)) return false;
  const hasLink =
    /https?:\/\/|drive\.|docs\.|\.com\/|\blink\b|\benlace\b|\baccess\b|\bacceso\b|\bshared? (it|the file)\b|\bcompart/i.test(
      t,
    );
  const namesFile = /schedule|horario|file|archivo|sheet|hoja|it\b|this week/i.test(t);
  return hasLink && namesFile;
}

type ReadableMailTask = Exclude<
  PlayableMailTask,
  "call-out-sick" | "mail-etiquette" | "mail-send-link" | "reply-all"
>;

const BODY_TEMPLATE: Record<ReadableMailTask, Record<Lang, { plain: string[]; full: string[] }>> = {
  // Job 1: welcome note — thank-you reply, no file.
  "mail-reply": {
    en: {
      plain: [
        GREETING,
        "Welcome to Harborside Cafe. I'm glad you're here.",
        "You're a new hire. This week you have 5 shifts on the floor.",
        "Call or email me if you need anything.",
        "See you on the floor,",
      ],
      full: [
        GREETING,
        "Welcome to the Harborside Cafe team. I'm glad you're starting with us.",
        "You're a new hire. This week you have 5 shifts on the floor — that's all you need to focus on for now.",
        "If you need anything — schedule, login, or just a question — call or email me. I'm here.",
        "Looking forward to working with you.",
        "Thanks,",
      ],
    },
    es: {
      plain: [
        GREETING,
        "Bienvenido a Harborside Cafe. Me alegra que estés aquí.",
        "Eres personal nuevo. Esta semana tienes 5 turnos en el piso.",
        "Llámame o escríbeme si necesitas algo.",
        "Nos vemos en el piso,",
      ],
      full: [
        GREETING,
        "Bienvenido al equipo de Harborside Cafe. Me alegra que empieces con nosotros.",
        "Eres personal nuevo. Esta semana tienes 5 turnos en el piso — con eso te basta por ahora.",
        "Si necesitas algo — horario, acceso o solo una pregunta — llámame o escríbeme. Aquí estoy.",
        "Espero trabajar contigo.",
        "Gracias,",
      ],
    },
  },
  // Job 2: safety report — confirm what she needs, then attach.
  "mail-attach": {
    en: {
      plain: [
        GREETING,
        "Can you send me the July safety report today? Please attach the file to your reply.",
        "Thanks,",
      ],
      full: [
        GREETING,
        "Could you send me the July safety report today? I need to turn it in and I don't have a copy.",
        "Please attach the PDF to your reply so I can send it along.",
        "Thanks,",
      ],
    },
    es: {
      plain: [
        GREETING,
        "¿Me puedes enviar hoy el reporte de seguridad de julio? Por favor adjunta el archivo en tu respuesta.",
        "Gracias,",
      ],
      full: [
        GREETING,
        "¿Me puedes enviar hoy el reporte de seguridad de julio? Lo tengo que entregar y no tengo una copia.",
        "Por favor adjunta el PDF en tu respuesta para yo poder reenviarlo.",
        "Gracias,",
      ],
    },
  },
};

/**
 * The Day One email as this learner sees it: same words, addressed to them by
 * name. Both the plain and full versions get the greeting.
 */
export function bodyForTask(
  task: ReadableMailTask,
  lang: Lang,
  displayName: string,
): { plain: string[]; full: string[] } {
  const greeting = mailGreeting(lang, displayName);
  const swap = (lines: string[]) => lines.map((line) => (line === GREETING ? greeting : line));
  const template = BODY_TEMPLATE[task][lang];
  return { plain: swap(template.plain), full: swap(template.full) };
}

export const STARTERS: Record<PlayableMailTask, Record<Lang, string[]>> = {
  "mail-reply": {
    en: [
      "Hi Maria, thank you for the welcome.",
      "Thanks so much. I'm glad to be here.",
      "Thank you. I'll call if I need anything.",
      "Looking forward to working with you too.",
    ],
    es: [
      "Hola Maria, gracias por la bienvenida.",
      "Muchas gracias. Me alegra estar aquí.",
      "Gracias. Te llamo si necesito algo.",
      "También espero trabajar contigo.",
    ],
  },
  "mail-send-link": {
    en: [
      "Hi Jordan, here's the link to this week's schedule.",
      "You should have view access now. Let me know if it doesn't open.",
      "I'll keep it updated here, so always check the link, not an old copy.",
    ],
    es: [
      "Hola Jordan, aquí está el enlace del horario de esta semana.",
      "Ya deberías tener acceso para ver. Avísame si no abre.",
      "Lo voy a mantener actualizado aquí, así que revisa siempre el enlace, no una copia vieja.",
    ],
  },
  "mail-etiquette": {
    en: [
      "Hi Darnell, yes — we found extra aprons in the storage room.",
      "They're on the second shelf, past the cleaning supplies.",
      "Let me know if you need me to grab you one.",
      "See you Monday.",
    ],
    es: [
      "Hola Darnell, sí — encontramos delantales de más en el almacén.",
      "Están en el segundo estante, después de los productos de limpieza.",
      "Avísame si necesitas que te traiga uno.",
      "Nos vemos el lunes.",
    ],
  },
  "call-out-sick": {
    en: [
      "Hi Maria, I'm sick and can't come in today.",
      "I'm sorry for the short notice.",
      "I can work my next shift as scheduled.",
      "Let me know if you need anything from me.",
    ],
    es: [
      "Hola Maria, estoy enfermo y no puedo ir hoy.",
      "Perdón por avisar con tan poco tiempo.",
      "Puedo trabajar mi siguiente turno como estaba planeado.",
      "Avísame si necesitas algo de mí.",
    ],
  },
  "mail-attach": {
    en: [
      "Hi Maria, here is the July safety report.",
      "Yes, I can send it today.",
      "I attached the file to this email.",
      "Let me know if you need anything else.",
    ],
    es: [
      "Hola Maria, aquí está el reporte de seguridad de julio.",
      "Sí, puedo enviarlo hoy.",
      "Adjunté el archivo a este correo.",
      "Avísame si necesitas algo más.",
    ],
  },
  "reply-all": {
    en: [
      "Hi Dana, yes — we can take the 6 AM Friday delivery.",
      "We will have someone on the dock.",
      "Thank you for checking with us first.",
    ],
    es: [
      "Hola Dana, sí — podemos recibir la entrega del viernes a las 6 AM.",
      "Alguien estará en el muelle.",
      "Gracias por preguntarnos primero.",
    ],
  },
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    { t: "Which email is mine?", s: ["A real inbox has lots of mail. Look at the name on the left of each row. That is who sent it.", "Bold rows are emails you haven't opened yet. There may be more than one.", "Click the row from Maria Delgado. She is your manager."], tip: "Clicking an email never sends anything. It's safe to open and look." },
    { t: "Reading a work email", s: ["Look for what the person is asking you to do.", "Look for when they need it.", "Sometimes they just want a reply. Sometimes they want a file attached."], tip: "You can read it twice. Nobody sees how long you take." },
    { t: "Reply vs. Forward", s: ["Reply sends your message back to the person who wrote to you.", "Forward sends their email to somebody else.", "Maria wrote to you, so click Reply."], tip: "If you're answering the person who emailed you, it's always Reply." },
    { t: "Attaching a file", s: ["Click Attach file under your message.", "A window opens showing your files. Downloaded files are usually in Downloads.", "Click the file name safety-report-july.pdf to attach it."], tip: "Once it attaches, you'll see the file name in a green box. That means it worked." },
    { t: "Before you press Send", s: ["Is there a message in the box?", "Is the file attached? Do you see the green box?", "Then click Send. You can't break anything here."], tip: "In real email you can't unsend after a minute, so a quick check is a good habit." },
  ],
  es: [
    { t: "¿Cuál correo es el mío?", s: ["Una bandeja real tiene mucho correo. Mira el nombre a la izquierda de cada fila. Esa persona lo envió.", "Las filas en negrita son correos que no has abierto. Puede haber más de uno.", "Haz clic en el de Maria Delgado. Ella es tu gerente."], tip: "Abrir un correo no envía nada. Es seguro mirarlo." },
    { t: "Leer un correo del trabajo", s: ["Busca qué te pide hacer la persona.", "Busca cuándo lo necesita.", "A veces solo quiere una respuesta. A veces quiere un archivo adjunto."], tip: "Puedes leerlo dos veces. Nadie ve cuánto tiempo tomas." },
    { t: "Responder o Reenviar", s: ["Responder envía tu mensaje a la persona que te escribió.", "Reenviar manda su correo a otra persona.", "Maria te escribió a ti, así que haz clic en Responder."], tip: "Si contestas a quien te escribió, siempre es Responder." },
    { t: "Adjuntar un archivo", s: ["Haz clic en Adjuntar archivo debajo de tu mensaje.", "Se abre una ventana con tus archivos. Lo descargado suele estar en Descargas.", "Haz clic en safety-report-july.pdf para adjuntarlo."], tip: "Cuando se adjunta, verás el nombre en una caja verde. Eso significa que funcionó." },
    { t: "Antes de enviar", s: ["¿Hay un mensaje en la caja?", "¿Está el archivo adjunto? ¿Ves la caja verde?", "Entonces haz clic en Enviar. Aquí no puedes romper nada."], tip: "En el correo real no se puede cancelar después de un minuto; revisar es buena costumbre." },
  ],
};

const wrongHint = (en: string, es: string): Localized => ({ en, es });

/** A clutter email in the Day One inbox: never the target, always dismissible with a hint. */
interface DecoyEmail {
  key: string;
  from: string;
  initials: string;
  color: string;
  time: string;
  isTarget: false;
  unread?: boolean;
  subject: Localized;
  preview: Localized;
  wrongHint: Localized;
}

export const FILES: PickableItem[] = [
  { key: "photo-jobsite-0714.jpg", label: "photo-jobsite-0714.jpg", tagText: "JPG", tagColor: "#5f6368", columns: ["Jul 14"], isTarget: false,
    wrongHint: wrongHint("That's a photo, not the report. Look for the file with 'safety-report' in the name.", "Esa es una foto, no el reporte. Busca el archivo que dice 'safety-report'.") },
  { key: "safety-report-july.pdf", label: "safety-report-july.pdf", tagText: "PDF", tagColor: "#1e8e3e", columns: ["Aug 1"], isTarget: true, wrongHint: null },
  { key: "shift-swap-form.pdf", label: "shift-swap-form.pdf", tagText: "PDF", tagColor: "#1e8e3e", columns: ["Jul 22"], isTarget: false,
    wrongHint: wrongHint("Close, but that is the shift swap form. You need the safety report.", "Casi, pero ese es el formulario de cambio de turno. Necesitas el reporte de seguridad.") },
  { key: "safety-report-june.pdf", label: "safety-report-june.pdf", tagText: "PDF", tagColor: "#1e8e3e", columns: ["Jul 1"], isTarget: false,
    wrongHint: wrongHint("That one is June. She asked for July.", "Ese es de junio. Ella pidió el de julio.") },
];

/**
 * Clutter mail, one pool per task. A real work inbox is never empty, so every
 * mail job — not just Day One — has a few things in it that are not the job.
 *
 * Two rules keep the clutter honest:
 *  - Timestamps sit on the task's own day. A `mail-etiquette` decoy is dated to
 *    that Friday afternoon, not to Day One's "7:41 AM".
 *  - The wrong-click hint names what the job actually is, so the clutter never
 *    fights the task's framing (a compose-only job says "there's nothing to
 *    open here — click Compose").
 * Story mail (the manager's replies, filtered to the right day by
 * `storyMailsUpTo`) shows alongside these regardless.
 */
const DAY_ONE_DECOYS: DecoyEmail[] = [
  { key: "darnell", ...inboxSender(CAST.darnell), time: "7:41 AM", isTarget: false, unread: true,
    subject: { en: "Extra aprons?", es: "¿Delantales de más?" },
    preview: { en: "Do we still have extras in the back?", es: "¿Todavía hay extras atrás?" },
    wrongHint: wrongHint("Darnell is a coworker. Look for Maria Delgado.", "Darnell es un compañero. Busca a Maria Delgado.") },
  { key: "sched", from: "Harborside Schedule", initials: "HS", color: "#5f6368", time: "6:15 AM", isTarget: false, unread: true,
    subject: { en: "Your schedule for Aug 17–23", es: "Tu horario del 17–23 de ago" },
    preview: { en: "This week's shifts have been posted.", es: "Ya se publicaron los turnos de esta semana." },
    wrongHint: wrongHint("That's an automatic message about the schedule. Maria's email has her name on the left.", "Ese es un mensaje automático del horario. El correo de Maria tiene su nombre a la izquierda.") },
  { key: "hr", ...inboxSender(CAST.hr), time: "Yesterday", isTarget: false,
    subject: { en: "Your paystub is ready", es: "Tu recibo de pago está listo" },
    preview: { en: "View your paystub in the portal.", es: "Ve tu recibo en el portal." },
    wrongHint: wrongHint("That's from HR about pay. Today's task is the email from Maria Delgado.", "Eso es de RR.HH. sobre el pago. La tarea de hoy es el correo de Maria Delgado.") },
  { key: "it", from: "IT Helpdesk", initials: "IT", color: "#3c4043", time: "Yesterday", isTarget: false,
    subject: { en: "Reminder: update your password", es: "Recordatorio: cambia tu contraseña" },
    preview: { en: "Your password expires in 12 days.", es: "Tu contraseña vence en 12 días." },
    wrongHint: wrongHint("That's from IT. You can skip it for now. Find Maria Delgado.", "Eso es de sistemas. Puedes ignorarlo por ahora. Busca a Maria Delgado.") },
  { key: "team", from: "Cafe Team", initials: "CT", color: "#1e8e3e", time: "Mon", isTarget: false,
    subject: { en: "Break room fridge cleaning", es: "Limpieza del refrigerador" },
    preview: { en: "Please remove your food by Friday.", es: "Saca tu comida antes del viernes." },
    wrongHint: wrongHint("That's a team note about the fridge, not from your manager.", "Eso es una nota del equipo sobre el refrigerador, no de tu gerente.") },
  { key: "vendor", from: "Bean & Leaf Roasters", initials: "BL", color: "#7b4f2a", time: "Aug 18", isTarget: false,
    subject: { en: "Friday delivery window changed", es: "Cambió la entrega del viernes" },
    preview: { en: "Trucks will arrive after 10 AM.", es: "Los camiones llegarán después de las 10 AM." },
    wrongHint: wrongHint("That is a vendor, not your manager. Look for Maria Delgado.", "Eso es un proveedor, no tu gerente. Busca a Maria Delgado.") },
  { key: "promo", from: "Uniform Outlet", initials: "UO", color: "#c5221f", time: "Aug 12", isTarget: false,
    subject: { en: "15% off fall uniforms", es: "15% de descuento en uniformes" },
    preview: { en: "Sale ends Sunday. Use code FALL15.", es: "La oferta termina el domingo. Usa el código FALL15." },
    wrongHint: wrongHint("That's an ad. Work inboxes are full of these. Look for Maria Delgado.", "Eso es un anuncio. Las bandejas de trabajo están llenas de estos. Busca a Maria Delgado.") },
];

const NOT_A_JOB_EN =
  "Nothing here needs an answer right now. Your job is to write a new email — click Compose.";
const NOT_A_JOB_ES =
  "Nada de esto necesita respuesta ahora. Tu tarea es escribir un correo nuevo — haz clic en Redactar.";

/** Mid-week of the shared-files level: you just shared a file, now send the link. */
const SEND_LINK_DECOYS: DecoyEmail[] = [
  { key: "it-outage", from: "IT Helpdesk", initials: "IT", color: "#3c4043", time: "8:02 AM", isTarget: false,
    subject: { en: "Drive was slow this morning — fixed", es: "Drive estuvo lento esta mañana — resuelto" },
    preview: { en: "No action needed.", es: "No hay que hacer nada." },
    wrongHint: wrongHint("That's an IT status note. Your job is to send Jordan the link.", "Eso es un aviso de sistemas. Tu tarea es enviarle el enlace a Jordan.") },
  { key: "vendor-quote", from: "Bean & Leaf Roasters", initials: "BL", color: "#7b4f2a", time: "Yesterday", isTarget: false,
    subject: { en: "Updated wholesale price list", es: "Lista de precios mayoristas actualizada" },
    preview: { en: "Effective next month.", es: "Vigente el próximo mes." },
    wrongHint: wrongHint("That's the coffee vendor, not Jordan. Send Jordan the schedule link.", "Ese es el proveedor de café, no Jordan. Envíale a Jordan el enlace del horario.") },
  { key: "team-digest", from: "Cafe Team", initials: "CT", color: "#1e8e3e", time: "Mon", isTarget: false,
    subject: { en: "This week's notes", es: "Notas de esta semana" },
    preview: { en: "Patio tables, new cups, lost and found.", es: "Mesas del patio, vasos nuevos, objetos perdidos." },
    wrongHint: wrongHint("That's the weekly team note. You need to email Jordan the link.", "Esa es la nota semanal del equipo. Tienes que enviarle el enlace a Jordan.") },
];

/** Friday afternoon of week one — you're writing Darnell, not opening anything. */
const ETIQUETTE_DECOYS: DecoyEmail[] = [
  { key: "fridge", from: "Cafe Team", initials: "CT", color: "#1e8e3e", time: "1:12 PM", isTarget: false,
    subject: { en: "Fridge gets cleaned out Monday", es: "El refrigerador se vacía el lunes" },
    preview: { en: "Take your food home this weekend.", es: "Llévate tu comida este fin de semana." },
    wrongHint: wrongHint(NOT_A_JOB_EN, NOT_A_JOB_ES) },
  { key: "payroll-note", ...inboxSender(CAST.hr), time: "11:40 AM", isTarget: false,
    subject: { en: "Direct deposit posts Friday", es: "El depósito directo entra el viernes" },
    preview: { en: "Nothing to do. Just a heads up.", es: "No hay que hacer nada. Solo un aviso." },
    wrongHint: wrongHint(NOT_A_JOB_EN, NOT_A_JOB_ES) },
  { key: "it-survey", from: "IT Helpdesk", initials: "IT", color: "#3c4043", time: "Thu", isTarget: false,
    subject: { en: "2-minute survey: the new tablets", es: "Encuesta de 2 minutos: las tabletas nuevas" },
    preview: { en: "Optional. Closes next week.", es: "Opcional. Cierra la próxima semana." },
    wrongHint: wrongHint(NOT_A_JOB_EN, NOT_A_JOB_ES) },
];

/** Monday morning of week two, before your shift — you're writing Maria that you're sick. */
const SICK_CALL_DECOYS: DecoyEmail[] = [
  { key: "benefits", ...inboxSender(CAST.hr), time: "7:30 AM", isTarget: false,
    subject: { en: "Open enrollment starts next week", es: "La inscripción abierta empieza la próxima semana" },
    preview: { en: "You'll get the forms by email.", es: "Recibirás los formularios por correo." },
    wrongHint: wrongHint(NOT_A_JOB_EN, NOT_A_JOB_ES) },
  { key: "it-maint", from: "IT Helpdesk", initials: "IT", color: "#3c4043", time: "6:05 AM", isTarget: false,
    subject: { en: "Login system maintenance tonight", es: "Mantenimiento del sistema de acceso esta noche" },
    preview: { en: "11 PM to 1 AM. No action needed.", es: "De 11 PM a 1 AM. No hay que hacer nada." },
    wrongHint: wrongHint(NOT_A_JOB_EN, NOT_A_JOB_ES) },
  { key: "potluck", from: "Cafe Team", initials: "CT", color: "#1e8e3e", time: "Sat", isTarget: false,
    subject: { en: "Potluck sign-up for next Friday", es: "Lista para el potluck del próximo viernes" },
    preview: { en: "Add what you'll bring.", es: "Anota qué vas a traer." },
    wrongHint: wrongHint(NOT_A_JOB_EN, NOT_A_JOB_ES) },
];

/** Act IV, an HQ thread day. The reply-all thread is the only thing to open. */
const REPLY_ALL_DECOYS: DecoyEmail[] = [
  { key: "hq-newsletter", from: "Harborside HQ", initials: "HQ", color: "#8430ce", time: "8:15 AM", isTarget: false,
    subject: { en: "Company update: Q3 in review", es: "Novedades: resumen del T3" },
    preview: { en: "A read, not a to-do.", es: "Para leer, no para hacer." },
    wrongHint: wrongHint("That's the company newsletter. Open the delivery-window thread and answer Dana.", "Ese es el boletín de la empresa. Abre el hilo de la entrega y respóndele a Dana.") },
  { key: "facilities", from: "Facilities", initials: "FC", color: "#5f6368", time: "Yesterday", isTarget: false,
    subject: { en: "Sign replacement scheduled", es: "Cambio de letrero programado" },
    preview: { en: "Crew comes Thursday. No action.", es: "El equipo viene el jueves. No hay que hacer nada." },
    wrongHint: wrongHint("That's Facilities, not the thread from HQ. Reply to Dana about Friday's delivery.", "Eso es Mantenimiento, no el hilo de HQ. Respóndele a Dana sobre la entrega del viernes.") },
];

const DECOY_POOLS: Record<PlayableMailTask, DecoyEmail[]> = {
  "mail-reply": DAY_ONE_DECOYS,
  "mail-attach": DAY_ONE_DECOYS,
  "mail-send-link": SEND_LINK_DECOYS,
  "mail-etiquette": ETIQUETTE_DECOYS,
  "call-out-sick": SICK_CALL_DECOYS,
  "reply-all": REPLY_ALL_DECOYS,
};

type InboxEmail = DecoyEmail | {
  key: string;
  from: string;
  initials: string;
  color: string;
  time: string;
  isTarget: boolean;
  unread: boolean;
  subject: Localized;
  preview: Localized;
  wrongHint?: Localized;
};

/** Inbox rows for the active Day One job. Job 2 keeps the welcome mail as a non-target. */
export function emailsForTask(task: PlayableMailTask): InboxEmail[] {
  const welcomeMeta = SUBJECT_BY_TASK["mail-reply"];
  const safetyMeta = SUBJECT_BY_TASK["mail-attach"];
  const welcome: InboxEmail = {
    key: "maria-welcome",
    ...inboxSender(CAST.maria),
    time: "8:14 AM",
    isTarget: task === "mail-reply",
    unread: task === "mail-reply",
    subject: { en: welcomeMeta.en.subject, es: welcomeMeta.es.subject },
    preview: { en: welcomeMeta.en.preview, es: welcomeMeta.es.preview },
    wrongHint:
      task === "mail-attach"
        ? wrongHint(
            "That is her older welcome note. Open the newer one about the safety report.",
            "Esa es su nota de bienvenida anterior. Abre la más nueva sobre el reporte de seguridad.",
          )
        : undefined,
  };
  const safety: InboxEmail = {
    key: "maria-safety",
    ...inboxSender(CAST.maria),
    time: "8:20 AM",
    isTarget: true,
    unread: true,
    subject: { en: safetyMeta.en.subject, es: safetyMeta.es.subject },
    preview: { en: safetyMeta.en.preview, es: safetyMeta.es.preview },
  };
  // Every job's inbox carries a little clutter, dated to that job's own day
  // (see DECOY_POOLS). The target rows for a job come first, then its pool.
  // Story mail (the manager's replies, correctly filtered by day) still shows
  // via storyMailsUpTo regardless of what this function returns.
  const decoys = DECOY_POOLS[task] ?? [];
  if (task === "mail-reply") return [welcome, ...decoys];
  if (task === "mail-attach") return [safety, welcome, ...decoys];
  if (task === "reply-all") {
    const meta = SUBJECT_BY_TASK["reply-all"];
    return [
      {
        key: "hq-thread",
        from: "Dana Ortiz",
        initials: "DO",
        color: "#7248b9",
        time: "10:04 AM",
        isTarget: true,
        unread: true,
        subject: { en: meta.en.subject, es: meta.es.subject },
        preview: { en: meta.en.preview, es: meta.es.preview },
      },
      ...decoys,
    ];
  }
  // Compose-only jobs (mail-etiquette, call-out-sick, mail-send-link): nothing
  // to open, but the inbox still isn't empty.
  return decoys;
}

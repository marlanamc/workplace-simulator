import { CAST, inboxSender } from "@/lib/cast";
import { mailGreeting } from "@/lib/mail-greeting";
import type { EventIntroCopy, Lang, Lesson, Localized, PickableItem } from "@/lib/task-types";

/** Placeholder line swapped for "Hi Ana," when the body is read for a learner. */
const GREETING = "__GREETING__";

/** Day One is 2 jobs in the same inbox: welcome thank-you, then safety report with a file. */
export type PlayableMailTask = "mail-reply" | "mail-attach" | "mail-etiquette" | "call-out-sick" | "reply-all";

/**
 * Every task Mail can run, in the order they're introduced. MailClient
 * derives which one is "next" from this list intersected with the curriculum
 * order, rather than a separate hand-maintained list - a mail task that
 * exists here but isn't reachable is a silent dead end, not a build error.
 */
export const PLAYABLE_MAIL_TASKS: PlayableMailTask[] = ["mail-reply", "mail-attach", "mail-etiquette", "call-out-sick", "reply-all"];

/**
 * Tasks where the learner writes to Maria (or a coworker) from scratch
 * rather than replying to something in the inbox. There is no email to open
 * first, so Mail starts on the compose window instead of the message list.
 */
export const COMPOSE_ONLY_TASKS: PlayableMailTask[] = ["mail-etiquette", "call-out-sick"];

/** Who the compose pane addresses — reply tasks pre-fill Maria; compose-only tasks pick their recipient. */
export const DANA_EMAIL = "dana.ortiz@harborsidecafe.com";
export const REPLY_ALL_RECIPIENTS = `${DANA_EMAIL}, ${CAST.maria.email}, priya.shah@harborsidecafe.com, ${CAST.jordan.email}`;

export const COMPOSE_RECIPIENT: Record<PlayableMailTask, string> = {
  "mail-reply": CAST.maria.email,
  "mail-attach": CAST.maria.email,
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
    to: { en: "to me, Maria Delgado, Priya Shah, Jordan Kim", es: "para mí, Maria Delgado, Priya Shah, Jordan Kim" },
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

type ReadableMailTask = Exclude<PlayableMailTask, "call-out-sick" | "mail-etiquette" | "reply-all">;

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

const DECOY_EMAILS: DecoyEmail[] = [
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
  // The decoy clutter teaches "find the right email among a messy inbox" -
  // Day One's job. Later mail tasks open straight into compose (there's
  // nothing to find), so showing this same frozen Day One backdrop days or
  // weeks later just sits there getting more wrong: a decoy timestamped
  // "7:41 AM" doesn't age, and mail-etiquette explicitly says Darnell's
  // question is from days ago while its own row still claims this morning.
  // Story mail (Maria's replies, correctly filtered by day) still shows via
  // storyMailsUpTo regardless of what this function returns.
  if (task === "mail-reply") return [welcome, ...DECOY_EMAILS];
  if (task === "mail-attach") return [safety, welcome, ...DECOY_EMAILS];
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
    ];
  }
  return [];
}

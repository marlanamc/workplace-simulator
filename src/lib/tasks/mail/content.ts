import { mailGreeting } from "@/lib/mail-greeting";
import type { EventIntroCopy, Lang, Lesson, Localized, PickableItem } from "@/lib/task-types";

/** Placeholder line swapped for "Hi Ana," when the body is read for a learner. */
const GREETING = "__GREETING__";

/** Day One is 2 jobs in the same inbox: welcome thank-you, then safety report with a file. */
export type PlayableMailTask = "mail-reply" | "mail-attach" | "call-out-sick";

/**
 * Tasks where the learner writes to Maria from scratch rather than replying to
 * something in the inbox. There is no email to open first, so Mail starts on
 * the compose window instead of the message list.
 */
export const COMPOSE_ONLY_TASKS: PlayableMailTask[] = ["call-out-sick"];

export function isComposeOnly(task: PlayableMailTask): boolean {
  return COMPOSE_ONLY_TASKS.includes(task);
}

export const EVENT_INTRO_BY_TASK: Record<PlayableMailTask, Record<Lang, EventIntroCopy>> = {
  "mail-reply": {
    en: {
      emoji: "📬",
      kicker: "Day 1, 8:14 AM · Task 1 of 2",
      headline: "Your manager says welcome.",
      body: "Maria Delgado runs Harborside Cafe. She sent a short hello and said to call if you need anything. Write her a thank-you back.",
      cta: "Open my inbox",
    },
    es: {
      emoji: "📬",
      kicker: "Día 1, 8:14 AM · Tarea 1 de 2",
      headline: "Tu gerente te da la bienvenida.",
      body: "Maria Delgado dirige Harborside Cafe. Te envió un saludo corto y dijo que la llames si necesitas algo. Escríbele un agradecimiento.",
      cta: "Abrir mi bandeja",
    },
  },
  "call-out-sick": {
    en: {
      emoji: "🤒",
      kicker: "Thursday, 6:12 AM",
      headline: "You're sick. You're on at 10.",
      body: "You woke up sick and you're on the schedule this morning. Write Maria now, before your shift — not after it starts.",
      cta: "Write to Maria",
    },
    es: {
      emoji: "🤒",
      kicker: "Jueves, 6:12 AM",
      headline: "Estás enfermo. Entras a las 10.",
      body: "Te despertaste enfermo y hoy tienes turno. Escríbele a Maria ahora, antes de tu turno, no después de que empiece.",
      cta: "Escribirle a Maria",
    },
  },
  "mail-attach": {
    en: {
      emoji: "📎",
      kicker: "Day 1, 8:20 AM · Task 2 of 2",
      headline: "Maria needs a file.",
      body: "She asked for the July safety report today. First make sure you know what she needs. Then reply and attach the file.",
      cta: "Open my inbox",
    },
    es: {
      emoji: "📎",
      kicker: "Día 1, 8:20 AM · Tarea 2 de 2",
      headline: "Maria necesita un archivo.",
      body: "Pidió el reporte de seguridad de julio para hoy. Primero confirma qué necesita. Luego responde y adjunta el archivo.",
      cta: "Abrir mi bandeja",
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
  "call-out-sick": {
    en: {
      kicker: "Message sent",
      body: "Maria has time to find coverage now, instead of finding out when your shift starts. That is the whole point of writing early.",
      badgeNumber: "09",
      badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    },
    es: {
      kicker: "Mensaje enviado",
      body: "Maria ahora tiene tiempo de buscar quién te cubra, en vez de enterarse cuando empiece tu turno. Ese es el punto de avisar temprano.",
      badgeNumber: "09",
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
};

export const SUBJECT_BY_TASK: Record<PlayableMailTask, Record<Lang, { subject: string; reSubject: string; preview: string }>> = {
  "mail-reply": {
    en: {
      subject: "Welcome to Harborside Cafe",
      reSubject: "Re: Welcome to Harborside Cafe",
      preview: "Glad you're here. Call me if you need anything.",
    },
    es: {
      subject: "Bienvenido a Harborside Cafe",
      reSubject: "Re: Bienvenido a Harborside Cafe",
      preview: "Me alegra que estés aquí. Llámame si necesitas algo.",
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
type ReadableMailTask = Exclude<PlayableMailTask, "call-out-sick">;

const BODY_TEMPLATE: Record<ReadableMailTask, Record<Lang, { plain: string[]; full: string[] }>> = {
  // Job 1: welcome note — thank-you reply, no file.
  "mail-reply": {
    en: {
      plain: [
        GREETING,
        "Welcome to Harborside Cafe. I'm glad you're here.",
        "Call or email me if you need anything.",
        "See you on the floor,",
      ],
      full: [
        GREETING,
        "Welcome to the Harborside Cafe team. I'm glad you're starting with us.",
        "If you need anything — schedule, login, or just a question — call or email me. I'm here.",
        "Looking forward to working with you.",
        "Thanks,",
      ],
    },
    es: {
      plain: [
        GREETING,
        "Bienvenido a Harborside Cafe. Me alegra que estés aquí.",
        "Llámame o escríbeme si necesitas algo.",
        "Nos vemos en el piso,",
      ],
      full: [
        GREETING,
        "Bienvenido al equipo de Harborside Cafe. Me alegra que empieces con nosotros.",
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

export const FILES: PickableItem[] = [
  { key: "photo-jobsite-0714.jpg", label: "photo-jobsite-0714.jpg", tagText: "JPG", tagColor: "#5f6368", columns: ["Jul 14"], isTarget: false,
    wrongHint: wrongHint("That's a photo, not the report. Look for the file with 'safety-report' in the name.", "Esa es una foto, no el reporte. Busca el archivo que dice 'safety-report'.") },
  { key: "safety-report-july.pdf", label: "safety-report-july.pdf", tagText: "PDF", tagColor: "#1e8e3e", columns: ["Aug 1"], isTarget: true, wrongHint: null },
  { key: "shift-swap-form.pdf", label: "shift-swap-form.pdf", tagText: "PDF", tagColor: "#1e8e3e", columns: ["Jul 22"], isTarget: false,
    wrongHint: wrongHint("Close, but that is the shift swap form. You need the safety report.", "Casi, pero ese es el formulario de cambio de turno. Necesitas el reporte de seguridad.") },
  { key: "safety-report-june.pdf", label: "safety-report-june.pdf", tagText: "PDF", tagColor: "#1e8e3e", columns: ["Jul 1"], isTarget: false,
    wrongHint: wrongHint("That one is June. She asked for July.", "Ese es de junio. Ella pidió el de julio.") },
];

const DECOY_EMAILS = [
  { key: "darnell", from: "Darnell Washington", initials: "DW", color: "#e37400", time: "7:41 AM", isTarget: false, unread: true,
    subject: { en: "Extra aprons?", es: "¿Delantales de más?" },
    preview: { en: "Do we still have extras in the back?", es: "¿Todavía hay extras atrás?" },
    wrongHint: wrongHint("Darnell is a coworker. Look for Maria Delgado.", "Darnell es un compañero. Busca a Maria Delgado.") },
  { key: "sched", from: "Harborside Schedule", initials: "HS", color: "#5f6368", time: "6:15 AM", isTarget: false, unread: true,
    subject: { en: "Your schedule for Aug 17–23", es: "Tu horario del 17–23 de ago" },
    preview: { en: "This week's shifts have been posted.", es: "Ya se publicaron los turnos de esta semana." },
    wrongHint: wrongHint("That's an automatic message about the schedule. Maria's email has her name on the left.", "Ese es un mensaje automático del horario. El correo de Maria tiene su nombre a la izquierda.") },
  { key: "hr", from: "Harborside HR", initials: "HR", color: "#9334e6", time: "Yesterday", isTarget: false,
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

type InboxEmail = (typeof DECOY_EMAILS)[number] | {
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
    from: "Maria Delgado",
    initials: "MD",
    color: "#1a73e8",
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
    from: "Maria Delgado",
    initials: "MD",
    color: "#1a73e8",
    time: "8:20 AM",
    isTarget: true,
    unread: true,
    subject: { en: safetyMeta.en.subject, es: safetyMeta.es.subject },
    preview: { en: safetyMeta.en.preview, es: safetyMeta.es.preview },
  };
  if (task === "mail-reply") return [welcome, ...DECOY_EMAILS];
  return [safety, welcome, ...DECOY_EMAILS];
}

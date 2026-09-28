import { CAST, inboxSender } from "@/lib/cast";
import { mailGreeting } from "@/lib/mail-greeting";
import { HIRE_DAY, NIGHT_BEFORE, SHIFT_TIMES, STORY_DAY_BY_LEVEL, hourOnly } from "@/lib/story-dates";
import { OPENING_MESSAGES, openingLines } from "@/lib/tasks/mail/opening";
import type { EventIntroCopy, Lang, Lesson, Localized, PickableItem } from "@/lib/task-types";
import { affirms, looksLikeRealText, normalizeReply, saysCannotAttend, wordCount, yesNoAnswer } from "@/lib/grading/meaning";

/** Placeholder line swapped for "Hi Ana," when the body is read for a learner. */
const GREETING = "__GREETING__";

/** Day One practices three replies; the attachment task follows the schedule on Day Two. */
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
 * Tasks where the learner writes from scratch rather than replying to
 * something in the inbox. There is no email to open first, so Mail starts
 * on the compose window instead of the message list.
 */
export const COMPOSE_ONLY_TASKS: PlayableMailTask[] = ["mail-send-link", "call-out-sick"];

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

/**
 * The Job Card lines for Mail live with Mail's completion rules so that a
 * checked writing requirement cannot drift away from the learner direction.
 */
export const MAIL_JOB_CARD_STEPS: {
  openMail: Record<PlayableMailTask, Localized>;
  confirm: Localized;
  attach: Localized;
  attachPick: Localized;
  attachCheck: Localized;
  write: Localized;
  writeEtiquette: Localized;
  writeForTask: Partial<Record<PlayableMailTask, Localized>>;
  replyAllEdit: Localized;
  send: Localized;
} = {
  openMail: {
    "mail-reply": { en: "Open Maria's email.", es: "Abre el correo de Maria." },
    "mail-attach": {
      en: "Open Maria's email: Safety report for the district.",
      es: "Abre el correo de Maria: Reporte de seguridad para el distrito.",
    },
    // Compose-only jobs have no email to open, so their openMail lines are unused.
    "mail-send-link": { en: "Write to Jordan.", es: "Escríbele a Jordan." },
    "mail-etiquette": { en: "Open Darnell's email.", es: "Abre el correo de Darnell." },
    "call-out-sick": { en: "Write to Maria.", es: "Escríbele a Maria." },
    "reply-all": { en: "Open the HQ thread.", es: "Abre el hilo de HQ." },
  },
  confirm: { en: "What does she need? Pick one.", es: "¿Qué necesita? Elige una." },
  attach: { en: "Click Attach file.", es: "Haz clic en Adjuntar archivo." },
  // The picker shows each file's first page, so the learner checks the
  // month and the DRAFT stamp the way they would before sending a real file.
  attachPick: {
    en: "Click a file name to see its first page. Find the July report.",
    es: "Haz clic en el nombre de un archivo para ver su primera página. Busca el reporte de julio.",
  },
  attachCheck: {
    en: "Check the page: July 2026, and no DRAFT. Then click Attach.",
    es: "Revisa la página: July 2026 (julio de 2026) y sin DRAFT (borrador). Luego haz clic en Adjuntar.",
  },
  write: { en: "Write one short line.", es: "Escribe una línea corta." },
  // The question, not the answer. Where the aprons are is a fact of the
  // scene (the arrival card and the starter chips); a wrong reply names it.
  writeEtiquette: {
    en: "Tell Darnell where the extra aprons are.",
    es: "Dile a Darnell dónde están los delantales de más.",
  },
  writeForTask: {
    "mail-send-link": {
      en: "Tell Jordan this is the schedule and point to its link. Do not attach a copy.",
      es: "Dile a Jordan que es el horario y señala su enlace. No adjuntes una copia.",
    },
    "call-out-sick": {
      en: "Tell Maria you cannot work today's shift.",
      es: "Dile a Maria que no puedes trabajar el turno de hoy.",
    },
  },
  replyAllEdit: {
    en: "Make the draft professional. Say yes or no about Friday's 6 AM delivery.",
    es: "Haz profesional el borrador. Di sí o no sobre la entrega del viernes a las 6 AM.",
  },
  send: { en: "Click Send.", es: "Haz clic en Enviar." },
};

export const EVENT_INTRO_BY_TASK: Record<PlayableMailTask, Record<Lang, EventIntroCopy>> = {
  "mail-reply": {
    en: {
      emoji: "📬",
      kicker: "Monday, 6:02 PM",
      headline: "Your manager says welcome.",
      body: "Maria Delgado runs Harborside Cafe. She sent a short hello and said to call if you need anything. Write her a thank-you back.",
      cta: "Open my inbox",
    },
    es: {
      emoji: "📬",
      kicker: "Lunes, 6:02 PM",
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
      body: "You just shared the file with Jordan. Now send a short email with the link, so Jordan can open it. Don't attach a copy. A copy goes stale the next time you change the schedule.",
      cta: "Write to Jordan",
    },
    es: {
      emoji: "🔗",
      kicker: "Miércoles, 10:15 AM",
      headline: "Jordan necesita el horario de esta semana.",
      body: "Acabas de compartir el archivo con Jordan. Ahora envía un correo corto con el enlace, para que Jordan lo pueda abrir. No adjuntes una copia. Una copia queda vieja la próxima vez que cambies el horario.",
      cta: "Escribirle a Jordan",
    },
  },
  "mail-etiquette": {
    en: {
      emoji: "📧",
      kicker: "Saturday morning",
      headline: "Reply to your coworker, Darnell.",
      body: "Maria said you found extra aprons in the storage room. Darnell asked about them on your first day. Open his email and tell him where they are.",
      cta: "Open Darnell's email",
    },
    es: {
      emoji: "📧",
      kicker: "Sábado por la mañana",
      headline: "Responde a tu compañero, Darnell.",
      body: "Maria dijo que encontraste delantales de más en el almacén. Darnell preguntó por ellos tu primer día. Abre su correo y dile dónde están.",
      cta: "Abrir el correo de Darnell",
    },
  },
  "call-out-sick": {
    en: {
      emoji: "🤒",
      kicker: "Monday, 6:12 AM",
      headline: `You're sick. You're on at ${hourOnly(SHIFT_TIMES[STORY_DAY_BY_LEVEL.level3a2])}.`,
      body: "You woke up sick and you're on the schedule this morning. Write Maria now, before your shift, not after it starts.",
      cta: "Write to Maria",
    },
    es: {
      emoji: "🤒",
      kicker: "Lunes, 6:12 AM",
      headline: `Te sientes mal. Entras a las ${hourOnly(SHIFT_TIMES[STORY_DAY_BY_LEVEL.level3a2])}.`,
      body: "Te despertaste sintiéndote mal y hoy tienes turno. Escríbele a Maria ahora, antes de tu turno, no después de que empiece.",
      cta: "Escribirle a Maria",
    },
  },
  "mail-attach": {
    en: {
      emoji: "📎",
      kicker: "Wednesday, 10:10 AM",
      headline: "Maria needs a file.",
      body: "She asked for the July safety report today. First make sure you know what she needs. Then reply and attach the file.",
      cta: "Open my inbox",
    },
    es: {
      emoji: "📎",
      kicker: "Miércoles, 10:10 AM",
      headline: "Maria necesita un archivo.",
      body: "Pidió el reporte de seguridad de julio para hoy. Primero confirma qué necesita. Luego responde y adjunta el archivo.",
      cta: "Abrir mi bandeja",
    },
  },
  "reply-all": {
    en: {
      emoji: "📬",
      kicker: "Friday. HQ wrote.",
      headline: "A long thread from HQ.",
      body: "Several people are on this thread. Read all of it, then answer what was asked of you.",
      cta: "Open the thread",
    },
    es: {
      emoji: "📬",
      kicker: "Viernes. Escribió HQ.",
      headline: "Un hilo largo de HQ.",
      body: "Hay varias personas en este hilo. Léelo completo y luego responde lo que te pidieron.",
      cta: "Abrir el hilo",
    },
  },
};

/**
 * Comprehension check before the attach reply: "what does she need?" Every
 * option is a safety report due soon, so the subject line settles none of
 * them. Telling them apart takes the email: the month (first line), final vs.
 * draft (second paragraph), and when. The right one is not listed first.
 * Each wrong option carries a hint that sends the learner back to the line
 * that rules it out.
 */
export const CONFIRM_COPY: Record<Lang, {
  question: string;
  options: { label: string; correct: boolean; hint?: string }[];
  correctReply: string;
  wrongReply: string;
}> = {
  en: {
    question: "What does Maria need?",
    options: [
      { label: "The July draft report, by next week", correct: false, hint: "Read the second part again. Does she want the draft? And when does she need it?" },
      { label: "The final July report, today by 3 PM", correct: true },
      { label: "The June report, today by 3 PM", correct: false, hint: "Read her first line again. Which month does she ask for?" },
    ],
    correctReply: "That's it. She needs the final July report, today by 3 PM.",
    wrongReply: "Read it again. Look for what she's asking for and when.",
  },
  es: {
    question: "¿Qué necesita Maria?",
    options: [
      { label: "El borrador del reporte de julio, para la próxima semana", correct: false, hint: "Lee otra vez la segunda parte. ¿Quiere el borrador? ¿Y para cuándo lo necesita?" },
      { label: "El reporte final de julio, hoy antes de las 3 PM", correct: true },
      { label: "El reporte de junio, hoy antes de las 3 PM", correct: false, hint: "Lee otra vez su primera línea. ¿Qué mes pide?" },
    ],
    correctReply: "Así es. Necesita el reporte final de julio, hoy antes de las 3 PM.",
    wrongReply: "Léelo otra vez. Busca qué pide y cuándo lo necesita.",
  },
};

/** Why a mail-attach Send is refused, checked in the order the Job Card asks for things. */
export type AttachSendProblem = "not-attached-says-attached" | "not-attached" | "empty" | "blank";
export function attachSendProblem(body: string, attached: boolean): AttachSendProblem | null {
  if (!attached) return saysAttached(body) ? "not-attached-says-attached" : "not-attached";
  if (!body.trim()) return "empty";
  if (/_{2,}/.test(body)) return "blank";
  return null;
}
export const ATTACH_CORRECTIONS: Record<AttachSendProblem, Localized> = {
  "not-attached-says-attached": {
    en: "Your message says the file is attached, but nothing is attached yet. Click Attach file.",
    es: "Tu mensaje dice que el archivo está adjunto, pero todavía no hay nada adjunto. Haz clic en Adjuntar archivo.",
  },
  "not-attached": {
    en: "She asked for the file. Click Attach file.",
    es: "Ella pidió el archivo. Haz clic en Adjuntar archivo.",
  },
  empty: { en: "The file is attached. Now write one short line to Maria.", es: "El archivo ya está adjunto. Ahora escríbele una línea corta a Maria." },
  blank: { en: "Fill in the blank (___) with your own words.", es: "Completa el espacio (___) con tus propias palabras." },
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
      body: "You replied to Maria, confirmed your start time, and answered a coworker. Your three replies are saved.",
      badgeNumber: "01",
      badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    },
    es: {
      kicker: "Mensaje enviado",
      body: "Saludaste a Maria, confirmaste tu hora de entrada y le contestaste a un compañero. Tus tres respuestas están guardadas.",
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
      badgeWhere: "Cuenta para: Assistant Manager",
    },
  },
};

export const SUBJECT_BY_TASK: Record<PlayableMailTask, Record<Lang, { subject: string; reSubject: string; preview: string }>> = {
  "mail-reply": {
    en: {
      subject: "Welcome to Harborside Cafe",
      reSubject: "Re: Welcome to Harborside Cafe",
      preview: "You're on the schedule for 5 shifts this week.",
    },
    es: {
      subject: "Te damos la bienvenida a Harborside Cafe",
      reSubject: "Re: Te damos la bienvenida a Harborside Cafe",
      preview: "Esta semana tienes 5 turnos en el horario.",
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
      subject: "Extra aprons?",
      reSubject: "Re: Extra aprons?",
      preview: "Do we still have extras in the back?",
    },
    es: {
      subject: "¿Delantales de más?",
      reSubject: "Re: ¿Delantales de más?",
      preview: "¿Todavía hay extras atrás?",
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
      subject: "Safety report for the district",
      reSubject: "Re: Safety report for the district",
      preview: "Can you send me the July safety report today?",
    },
    es: {
      subject: "Reporte de seguridad para el distrito",
      reSubject: "Re: Reporte de seguridad para el distrito",
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
  pickerEmpty: string;
  attachConfirm: string;
}> = {
  en: {
    practiceBanner: "Practice space. Nothing here is real.",
    inbox: "Inbox",
    starred: "Starred",
    sent: "Sent",
    drafts: "Drafts",
    searchPlaceholder: "Search mail",
    compose: "Compose",
    emptyPane: "No email open.",
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
    doneBody: DONE_COPY["mail-attach"].en.body,
    badgeName: "Reply with an attachment",
    badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "I understand. Back to my task",
    askPerson: "Ask a person instead",
    pickerTitle: "Choose a file to attach",
    downloads: "Downloads",
    cancel: "Cancel",
    open: "Open",
    colName: "Name",
    colDate: "Date modified",
    pickerEmpty: "Click a file name to see its first page here.",
    attachConfirm: "Attach",
  },
  es: {
    practiceBanner: "Espacio de práctica. Nada aquí es real.",
    inbox: "Recibidos",
    starred: "Destacados",
    sent: "Enviados",
    drafts: "Borradores",
    searchPlaceholder: "Buscar en el correo",
    compose: "Redactar",
    emptyPane: "Ningún correo abierto.",
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
    doneBody: DONE_COPY["mail-attach"].es.body,
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
    pickerEmpty: "Haz clic en el nombre de un archivo para ver aquí su primera página.",
    attachConfirm: "Adjuntar",
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
        "Heads up only. The city is changing Friday truck windows next week.",
        "No action from cafe leads. I will send the new times when I have them.",
      ],
      es: [
        "Solo aviso. La ciudad cambia las ventanas de camiones del viernes la semana que viene.",
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
      en: ["I understand, thanks Priya. We'll wait for the times."],
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
        "Quick ask for the Assistant Manager. Can Harborside take a 6 AM Friday delivery next week?",
        "I only need a yes or no from you. Not a group vote.",
      ],
      es: [
        "Pregunta rápida para el asistente de gerencia. ¿Puede Harborside recibir una entrega el viernes a las 6 AM?",
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

/** Why a reply to Dana is not sent yet, or "ok". */
export type ReplyAllVerdict = "ok" | "empty" | "casual" | "unsure" | "no-answer" | "short";

/**
 * Dana asked one yes-or-no question: can Harborside take a 6 AM Friday
 * delivery? A yes or a no both answer her ("No podemos a las 6" is a real
 * answer). "I am not sure" and "I don't know" are not, and a one-word "ok"
 * is too thin for HQ.
 */
export function replyAllVerdict(body: string): ReplyAllVerdict {
  if (!body.trim()) return "empty";
  if (stillSoundsCasual(body)) return "casual";
  const answer = yesNoAnswer(body);
  if (answer === "unsure") return "unsure";
  if (answer === "none") return "no-answer";
  const aboutDelivery = /\b(friday|fri|viernes|delivery|deliveries|entrega|dock|muelle|truck|camion)\b|\b6\s*(am|a\.?\s?m\.?)?\b/.test(
    normalizeReply(body),
  );
  if (!aboutDelivery && wordCount(body) < 3) return "short";
  return "ok";
}

export function replyAllAnswersDana(body: string): boolean {
  return replyAllVerdict(body) === "ok";
}

/** The Job Card's correction for each reply-all verdict. */
export const REPLY_ALL_CORRECTIONS: Record<Exclude<ReplyAllVerdict, "ok" | "empty" | "casual">, Localized> = {
  unsure: {
    en: "Dana needs a clear yes or no. Can Harborside take the Friday 6 AM delivery?",
    es: "Dana necesita un sí o un no claro. ¿Puede Harborside recibir la entrega del viernes a las 6 AM?",
  },
  "no-answer": {
    en: "Answer Dana's question. Say yes or no about the Friday 6 AM delivery.",
    es: "Responde la pregunta de Dana. Di sí o no sobre la entrega del viernes a las 6 AM.",
  },
  short: {
    en: "Say it in a full sentence. Name the Friday delivery.",
    es: "Dilo en una oración completa. Nombra la entrega del viernes.",
  },
};

/**
 * Answers Darnell's actual question (where the extra aprons are) rather than
 * just acknowledging his message. Deliberately checks for the one concrete
 * fact this lesson is about, not exact phrasing — any sentence naming the
 * storage room passes in either language.
 */
export function mailEtiquetteAnswersDarnell(body: string): boolean {
  const t = body.trim().toLowerCase().replace(/\s+/g, " ");
  // A concise location answers the question; a supply order does not.
  return /\b(?:storage|store ?room|back room|supply room|almac[eé]n|bodega)\b/.test(t);
}

/** Why a sick-call email is not sent yet, or "ok". */
export type SickCallVerdict = "ok" | "empty" | "no-absence" | "no-day";

/**
 * States, in some form, that the learner cannot come in today, not just that
 * they're sick. Any beginner form counts: "I no come today", "i cant go to
 * work today", "I can not work", "No puedo ir hoy". Judged on meaning, not
 * word count or punctuation.
 */
export function sickCallVerdict(body: string): SickCallVerdict {
  if (!body.trim()) return "empty";
  if (!saysCannotAttend(body)) return "no-absence";
  const aboutShift = /\b(today|tonight|this morning|shift|work|job|turno|hoy|trabajo|trabajar|esta manana)\b/.test(
    normalizeReply(body),
  );
  return aboutShift ? "ok" : "no-day";
}

export function callOutSickSaysCannotAttend(body: string): boolean {
  return sickCallVerdict(body) === "ok";
}

/** The Job Card's correction. Each one names only what is missing. */
export const SICK_CALL_CORRECTIONS: Record<Exclude<SickCallVerdict, "ok" | "empty">, Localized> = {
  "no-absence": {
    en: "Tell Maria you cannot work today's shift. For example: I can't come in today.",
    es: "Dile a Maria que no puedes trabajar tu turno de hoy. Por ejemplo: Hoy no puedo ir.",
  },
  "no-day": {
    en: "Say when. Tell Maria it is today's shift.",
    es: "Di cuándo. Dile a Maria que es el turno de hoy.",
  },
};

const ATTACH = /\battach(ed|ment|ing)?\b|\badjunt\w*|\bse adjunta\b|\ben el adjunto\b/;

/**
 * The email says the file is attached: the mistake this lesson teaches
 * against. "I did not attach it" and "no attachment" say the opposite.
 */
export function saysAttached(body: string): boolean {
  return affirms(body, ATTACH);
}

/**
 * A "send the link" email that did its job: it points at the file (a URL, or
 * the words "link", "shared", "Drive", "enlace"), names what the file is, and
 * does NOT tell Jordan to open an attachment. Deliberately lenient: "I did
 * not attach it. It is shared in Drive." passes.
 */
export function sendsLinkNotFile(body: string): boolean {
  const t = body.trim();
  if (!looksLikeRealText(t, 3)) return false;
  if (saysAttached(t)) return false;
  const hasLink =
    /https?:\/\/|drive\.|docs\.|\.com\/|\blink\b|\benlace\b|\baccess\b|\bacceso\b|\bshared?\b|\bsharing\b|\bdrive\b|\bcompart/i.test(
      t,
    );
  const namesFile = /schedule|horario|file|archivo|sheet|hoja|\bit\b|\blo\b|this week|esta semana/i.test(t);
  return hasLink && namesFile;
}

type ReadableMailTask = Exclude<
  PlayableMailTask,
  "call-out-sick" | "mail-send-link" | "reply-all"
>;

const BODY_TEMPLATE: Record<ReadableMailTask, Record<Lang, { plain: string[]; full: string[] }>> = {
  // Job 1: welcome note — thank-you reply, no file.
  "mail-reply": {
    en: {
      plain: [
        GREETING,
        "Welcome to Harborside Cafe. I'm glad you're here.",
        "You're on the schedule for 5 shifts this week.",
        "Call or email me if you need anything.",
        "See you on the floor,",
      ],
      full: [
        GREETING,
        "Welcome to the Harborside Cafe team. I'm glad you're starting with us.",
        "You're on the schedule for 5 shifts this week. That's all you need to focus on for now.",
        "If you need anything (schedule, login, or just a question), call or email me. I'm here.",
        "Looking forward to working with you.",
        "Thanks,",
      ],
    },
    es: {
      plain: [
        GREETING,
        "Te damos la bienvenida a Harborside Cafe. Me alegra que estés aquí.",
        "Esta semana tienes 5 turnos en el horario.",
        "Llámame o escríbeme si necesitas algo.",
        "Nos vemos en el café,",
      ],
      full: [
        GREETING,
        "Te damos la bienvenida al equipo de Harborside Cafe. Me alegra que empieces con nosotros.",
        "Esta semana tienes 5 turnos en el horario. Con eso basta por ahora.",
        "Si necesitas algo (horario, acceso o solo una pregunta), llámame o escríbeme. Aquí estoy.",
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
        "Can you send me the July safety report today? The district office needs it by 3 PM, and I don't have a copy with me.",
        "It is in the Downloads folder on the cafe computer. Please send the final report, not the draft. The draft is missing two checks.",
        "Just attach the PDF to your reply.",
        "Thanks,",
      ],
      full: [
        GREETING,
        "Can you send me the July safety report today? The district office needs it by 3 PM, and I don't have a copy with me.",
        "It is in the Downloads folder on the cafe computer. Please send the final report, not the draft. The draft is missing two checks.",
        "Just attach the PDF to your reply.",
        "Thanks,",
      ],
    },
    es: {
      plain: [
        GREETING,
        "¿Me puedes enviar hoy el reporte de seguridad de julio? La oficina del distrito lo necesita antes de las 3 PM y no tengo una copia aquí.",
        "Está en la carpeta Descargas de la computadora del café. Por favor manda el reporte final, no el borrador. Al borrador le faltan dos revisiones.",
        "Solo adjunta el PDF a tu respuesta.",
        "Gracias,",
      ],
      full: [
        GREETING,
        "¿Me puedes enviar hoy el reporte de seguridad de julio? La oficina del distrito lo necesita antes de las 3 PM y no tengo una copia aquí.",
        "Está en la carpeta Descargas de la computadora del café. Por favor manda el reporte final, no el borrador. Al borrador le faltan dos revisiones.",
        "Solo adjunta el PDF a tu respuesta.",
        "Gracias,",
      ],
    },
  },
  // Saturday: Darnell's unanswered Day One question — reply with the location.
  "mail-etiquette": {
    en: {
      plain: [
        GREETING,
        "Do we still have extra aprons? I looked in the back this morning and didn't see any.",
        "If you find them, can you tell me where they are?",
        "Thanks,",
        "Darnell",
      ],
      full: [
        GREETING,
        "Do we still have extra aprons in the back? I checked by the sink this morning and didn't see any.",
        "If you find them, can you tell me where they are?",
        "Thanks,",
        "Darnell",
      ],
    },
    es: {
      plain: [
        GREETING,
        "¿Todavía hay delantales de más? Busqué atrás esta mañana y no vi ninguno.",
        "Si los encuentras, ¿me dices dónde están?",
        "Gracias,",
        "Darnell",
      ],
      full: [
        GREETING,
        "¿Todavía hay delantales de más atrás? Revisé junto al fregadero esta mañana y no vi ninguno.",
        "Si los encuentras, ¿me dices dónde están?",
        "Gracias,",
        "Darnell",
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
      "Hi Darnell, yes. We found extra aprons in the storage room.",
      "They're on the second shelf, past the cleaning supplies.",
      "Let me know if you need me to grab you one.",
      "See you Monday.",
    ],
    es: [
      "Hola Darnell, sí. Encontramos delantales de más en el almacén.",
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
      "Hola Maria, me siento mal y no puedo ir hoy.",
      "Perdón por avisar con tan poco tiempo.",
      "Puedo trabajar mi siguiente turno como estaba planeado.",
      "Avísame si necesitas algo de mí.",
    ],
  },
  "mail-attach": {
    // Frames, not answers: the learner names the report. "I attached the
    // file" is only offered once a file is attached (see attachStarters).
    en: [
      "Hi Maria, here is the ___ safety report.",
      "I attached the file to this email.",
      "Let me know if you need anything else.",
    ],
    es: [
      "Hola Maria, aquí está el reporte de seguridad de ___.",
      "Adjunté el archivo a este correo.",
      "Avísame si necesitas algo más.",
    ],
  },
  "reply-all": {
    en: [
      "Hi Dana, yes. We can take the 6 AM Friday delivery.",
      "We will have someone on the dock.",
      "Thank you for checking with us first.",
    ],
    es: [
      "Hola Dana, sí. Podemos recibir la entrega del viernes a las 6 AM.",
      "Alguien estará en el muelle.",
      "Gracias por preguntarnos primero.",
    ],
  },
};

/** The attach job's starters: a line saying "attached" only once it is true. */
export function attachStarters(lang: Lang, attached: boolean): string[] {
  const all = STARTERS["mail-attach"][lang];
  return attached ? all : all.filter((s) => !saysAttached(s));
}

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    { t: "Which email is mine?", s: ["A real inbox has lots of mail. Look at the name on the left of each row. That is who sent it.", "Bold rows are emails you haven't opened yet. There may be more than one.", "Click the row from Maria Delgado. She is your manager."], tip: "Clicking an email never sends anything. It's safe to open and look." },
    { t: "Reading a work email", s: ["Look for what the person is asking you to do.", "Look for when they need it.", "Sometimes they just want a reply. Sometimes they want a file attached."], tip: "You can read it twice. Nobody sees how long you take." },
    { t: "Reply vs. Forward", s: ["Reply sends your message back to the person who wrote to you.", "Forward sends their email to somebody else.", "Maria wrote to you, so click Reply."], tip: "If you're answering the person who emailed you, it's always Reply." },
    { t: "Attaching a file", s: ["Click Attach file under your message.", "A window opens with your Downloads. Click a file name, and its first page shows on the right.", "Look for July 2026 at the top and no DRAFT stamp. Then click Attach."], tip: "Once it attaches, you'll see the file name in a green box. That means it worked." },
    { t: "Before you press Send", s: ["Is there a message in the box?", "Is the file attached? Do you see the green box?", "Then click Send. You can't break anything here."], tip: "In real email you can't unsend after a minute, so a quick check is a good habit." },
  ],
  es: [
    { t: "¿Cuál correo es el mío?", s: ["Una bandeja real tiene mucho correo. Mira el nombre a la izquierda de cada fila. Esa persona lo envió.", "Las filas en negrita son correos que no has abierto. Puede haber más de uno.", "Haz clic en el de Maria Delgado. Ella es tu gerente."], tip: "Abrir un correo no envía nada. Es seguro mirarlo." },
    { t: "Leer un correo del trabajo", s: ["Busca qué te pide hacer la persona.", "Busca cuándo lo necesita.", "A veces solo quiere una respuesta. A veces quiere un archivo adjunto."], tip: "Puedes leerlo dos veces. Nadie ve cuánto tiempo tomas." },
    { t: "Responder o Reenviar", s: ["Responder envía tu mensaje a la persona que te escribió.", "Reenviar manda su correo a otra persona.", "Maria te escribió a ti, así que haz clic en Responder."], tip: "Si contestas a quien te escribió, siempre es Responder." },
    { t: "Adjuntar un archivo", s: ["Haz clic en Adjuntar archivo debajo de tu mensaje.", "Se abre una ventana con tus Descargas. Haz clic en el nombre de un archivo y su primera página aparece a la derecha.", "Busca July 2026 (julio de 2026) arriba y que no tenga el sello DRAFT (borrador). Luego haz clic en Adjuntar."], tip: "Cuando se adjunta, verás el nombre en una caja verde. Eso significa que funcionó." },
    { t: "Antes de enviar", s: ["¿Hay un mensaje en la caja?", "¿Está el archivo adjunto? ¿Ves la caja verde?", "Entonces haz clic en Enviar. Aquí no puedes romper nada."], tip: "En el correo real no se puede cancelar después de un minuto; revisar es buena costumbre." },
  ],
};

const wrongHint = (en: string, es: string): Localized => ({ en, es });

/**
 * A clutter email: never the target. One with a `body` opens read-only, the
 * way a real inbox does, and opening it is never corrected. Without one it
 * only shows the hint.
 */
interface DecoyEmail {
  key: string;
  from: string;
  initials: string;
  color: string;
  time: string;
  /** August day it was sent, when it isn't the task's own day. */
  sentOn?: number;
  isTarget: false;
  unread?: boolean;
  subject: Localized;
  preview: Localized;
  wrongHint: Localized;
  /** Shown as written: automatic mail has no "Hi" or typed name added. */
  body?: Record<Lang, string[]>;
  story?: boolean;
  notice?: boolean;
}

export const FILES: PickableItem[] = [
  { key: "photo-jobsite-0714.jpg", label: "photo-jobsite-0714.jpg", tagText: "JPG", tagColor: "#5f6368", columns: ["Jul 14"], isTarget: false,
    wrongHint: wrongHint("That's a photo, not the report. Maria needs the July safety report PDF.", "Esa es una foto, no el reporte. Maria necesita el PDF del reporte de seguridad de julio.") },
  { key: "safety-report-july-DRAFT.pdf", label: "safety-report-july-DRAFT.pdf", tagText: "PDF", tagColor: "#1e8e3e", columns: ["Jul 29"], isTarget: false,
    wrongHint: wrongHint("That page says DRAFT. Maria asked for the final report. Choose the July report without DRAFT.", "Esa página dice DRAFT (borrador). Maria pidió el reporte final. Elige el reporte de julio sin DRAFT.") },
  { key: "safety-report-july.pdf", label: "safety-report-july.pdf", tagText: "PDF", tagColor: "#1e8e3e", columns: ["Aug 1"], isTarget: true, wrongHint: null },
  { key: "shift-swap-form.pdf", label: "shift-swap-form.pdf", tagText: "PDF", tagColor: "#1e8e3e", columns: ["Jul 22"], isTarget: false,
    wrongHint: wrongHint("That page is the shift swap form. You need the safety report.", "Esa página es el formulario de cambio de turno. Necesitas el reporte de seguridad.") },
  { key: "safety-report-june.pdf", label: "safety-report-june.pdf", tagText: "PDF", tagColor: "#1e8e3e", columns: ["Jun 30"], isTarget: false,
    wrongHint: wrongHint("That page says June 2026. Maria asked for July.", "Esa página dice June 2026 (junio de 2026). Maria pidió el de julio.") },
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
 *    open here — click Compose"; a reply job names the sender to open).
 * Story mail (the manager's replies, filtered to the right day by
 * `storyMailsUpTo`) shows alongside these regardless.
 */
const DAY_ONE_DECOYS: DecoyEmail[] = [
  { key: "dairy", from: "Harbor Dairy", initials: "HD", color: "#1a73e8", time: "7:41 AM", isTarget: false, unread: true,
    subject: { en: "Milk delivery confirmation", es: "Confirmación de entrega de leche" },
    preview: { en: "Tomorrow's order is on the truck. No action needed.", es: "El pedido de mañana ya va en el camión. No hay que hacer nada." },
    body: {
      en: ["Hello Harborside Cafe,", "Your order for tomorrow is on the truck: 12 gallons of whole milk, 6 gallons of oat milk, and 4 quarts of cream.", "Delivery time: 6:30 to 7:00 AM, at the back door.", "Questions? Call dispatch at (617) 555-0190.", "Harbor Dairy Dispatch"],
      es: ["Hola, Harborside Cafe:", "Su pedido de mañana ya va en el camión: 12 galones de leche entera, 6 galones de leche de avena y 4 cuartos de crema.", "Hora de entrega: de 6:30 a 7:00 AM, por la puerta de atrás.", "¿Preguntas? Llame a despacho al (617) 555-0190.", "Despacho de Harbor Dairy"],
    },
    wrongHint: wrongHint("That is a vendor, not your manager. Look for Maria Delgado.", "Eso es un proveedor, no tu gerente. Busca a Maria Delgado.") },
  { key: "sched", from: "Harborside Schedule", initials: "HS", color: "#5f6368", time: "6:15 AM", isTarget: false, unread: true,
    subject: { en: "Your schedule for Aug 24–30", es: "Tu horario del 24–30 de ago" },
    preview: { en: "Next week's shifts have been posted.", es: "Ya se publicaron los turnos de la próxima semana." },
    body: {
      en: ["Your schedule for Aug 24 to 30 is posted. Open the Harborside app to see your shifts.", "Need to swap a shift? Ask your manager at least 48 hours before it starts.", "This is an automatic message. Please do not reply."],
      es: ["Tu horario del 24 al 30 de agosto ya está publicado. Abre la app de Harborside para ver tus turnos.", "¿Necesitas cambiar un turno? Pídeselo a tu gerente por lo menos 48 horas antes.", "Este es un mensaje automático. Por favor, no respondas."],
    },
    wrongHint: wrongHint("That's an automatic message about the schedule. Maria's email has her name on the left.", "Ese es un mensaje automático del horario. El correo de Maria tiene su nombre a la izquierda.") },
  { key: "hr", ...inboxSender(CAST.hr), time: "Yesterday", isTarget: false,
    subject: { en: "Your first payday", es: "Tu primer día de pago" },
    preview: { en: "Your first pay date is Friday, Aug 28.", es: "Tu primer día de pago es el viernes 28 de agosto." },
    body: {
      en: ["Welcome to Harborside!", "We pay every two weeks. Your first pay date is Friday, Aug 28. It pays your hours from Aug 18 to 28.", "On that day, sign in to the employee portal and click Pay to see your pay stub.", "Questions about your pay? Reply to this email or call (617) 555-0114."],
      es: ["¡Te damos la bienvenida a Harborside!", "Pagamos cada dos semanas. Tu primer día de pago es el viernes 28 de agosto. Paga tus horas del 18 al 28 de agosto.", "Ese día, entra al portal de empleados y haz clic en Pago para ver tu recibo.", "¿Preguntas sobre tu pago? Responde a este correo o llama al (617) 555-0114."],
    },
    wrongHint: wrongHint("That's from HR about pay. Today's task is the email from Maria Delgado.", "Eso es de RR.HH. sobre el pago. La tarea de hoy es el correo de Maria Delgado.") },
  { key: "it", from: "IT Helpdesk", initials: "IT", color: "#3c4043", time: "Yesterday", isTarget: false,
    subject: { en: "Reminder: update your password", es: "Recordatorio: cambia tu contraseña" },
    preview: { en: "Your password expires in 12 days.", es: "Tu contraseña vence en 12 días." },
    body: {
      en: ["Your Harborside password expires in 12 days.", "To change it, go to the sign-in page and click Forgot password.", "IT will never ask for your password by email or text. If someone does, do not answer. Tell your manager.", "IT Helpdesk · ext. 204"],
      es: ["Tu contraseña de Harborside vence en 12 días.", "Para cambiarla, ve a la página de inicio de sesión y haz clic en ¿Olvidaste tu contraseña?", "Sistemas nunca te va a pedir tu contraseña por correo ni por mensaje de texto. Si alguien te la pide, no contestes. Avísale a tu gerente.", "Sistemas · ext. 204"],
    },
    wrongHint: wrongHint("That's from IT. You can skip it for now. Find Maria Delgado.", "Eso es de sistemas. Puedes ignorarlo por ahora. Busca a Maria Delgado.") },
  { key: "team", from: "Cafe Team", initials: "CT", color: "#1e8e3e", time: "Mon", isTarget: false,
    subject: { en: "Break room fridge cleaning", es: "Limpieza del refrigerador" },
    preview: { en: "Please remove your food by Friday.", es: "Saca tu comida antes del viernes." },
    body: {
      en: ["Hi all,", "The break room fridge gets cleaned out on Friday at 3 PM.", "Food without a name and a date will be thrown away.", "Thanks! Cafe Team"],
      es: ["Hola a todos:", "El refrigerador del cuarto de descanso se limpia el viernes a las 3 PM.", "La comida sin nombre y sin fecha se va a tirar.", "¡Gracias! El equipo del café"],
    },
    wrongHint: wrongHint("That's a team note about the fridge, not from your manager.", "Eso es una nota del equipo sobre el refrigerador, no de tu gerente.") },
  { key: "vendor", from: "Bean & Leaf Roasters", initials: "BL", color: "#7b4f2a", time: "Aug 18", isTarget: false,
    subject: { en: "Friday delivery window changed", es: "Cambió la entrega del viernes" },
    preview: { en: "Trucks will arrive after 10 AM.", es: "Los camiones llegarán después de las 10 AM." },
    body: {
      en: ["Hello,", "Starting this Friday, our trucks will come between 10 AM and 12 PM, not 8 to 10 AM.", "Your weekly order stays the same.", "Bean & Leaf Roasters, Wholesale"],
      es: ["Hola:", "A partir de este viernes, nuestros camiones van a llegar entre las 10 AM y las 12 PM, no de 8 a 10 AM.", "Su pedido semanal sigue igual.", "Bean & Leaf Roasters, ventas al por mayor"],
    },
    wrongHint: wrongHint("That is a vendor, not your manager. Look for Maria Delgado.", "Eso es un proveedor, no tu gerente. Busca a Maria Delgado.") },
  { key: "promo", from: "Uniform Outlet", initials: "UO", color: "#c5221f", time: "Aug 12", isTarget: false,
    subject: { en: "15% off fall uniforms", es: "15% de descuento en uniformes" },
    preview: { en: "Sale ends Sunday. Use code FALL15.", es: "La oferta termina el domingo. Usa el código FALL15." },
    body: {
      en: ["FALL SALE: 15% off aprons, black work shirts, and non-slip shoes.", "Use code FALL15 at checkout. The sale ends Sunday.", "You get this email because you signed up at uniformoutlet.com. Unsubscribe"],
      es: ["OFERTA DE OTOÑO: 15% de descuento en delantales, camisas negras de trabajo y zapatos antideslizantes.", "Usa el código FALL15 al pagar. La oferta termina el domingo.", "Recibes este correo porque te registraste en uniformoutlet.com. Cancelar suscripción"],
    },
    wrongHint: wrongHint("That's an ad. Work inboxes are full of these. Look for Maria Delgado.", "Eso es un anuncio. Las bandejas de trabajo están llenas de estos. Busca a Maria Delgado.") },
];

/**
 * What a new hire's inbox already holds the evening before day one: account
 * setup and paperwork. Read, older than Maria's notes, and openable, so the
 * first inbox a learner sees is a real one without pulling focus.
 */
export const OPENING_CLUTTER: InboxEmail[] = ([
  { key: "it-setup", from: "IT Helpdesk", initials: "IT", color: "#3c4043", time: "9:30 AM", sentOn: NIGHT_BEFORE - 1, isTarget: false, unread: false,
    subject: { en: "Your Harborside account is ready", es: "Tu cuenta de Harborside está lista" },
    preview: { en: "Your email is set up. Sign in on your first day.", es: "Tu correo está listo. Entra el primer día." },
    wrongHint: wrongHint("That's from IT. Open Maria's email.", "Eso es de sistemas. Abre el correo de Maria."),
    body: {
      en: ["Welcome to Harborside!", "Your work email is set up. You will sign in on the cafe computer on your first day. Your manager will give you your password.", "IT will never ask for your password by email or text.", "IT Helpdesk · ext. 204"],
      es: ["¡Te damos la bienvenida a Harborside!", "Tu correo de trabajo ya está listo. Vas a entrar en la computadora del café tu primer día. Tu gerente te va a dar tu contraseña.", "Sistemas nunca te va a pedir tu contraseña por correo ni por mensaje de texto.", "Sistemas · ext. 204"],
    } },
  { key: "hr-paperwork", ...inboxSender(CAST.hr), time: "11:05 AM", sentOn: NIGHT_BEFORE - 1, isTarget: false, unread: false,
    subject: { en: "New hire paperwork: what to bring", es: "Papeles de ingreso: qué traer" },
    preview: { en: "A photo ID, and your bank details for direct deposit.", es: "Una identificación con foto y los datos de tu banco para el depósito directo." },
    wrongHint: wrongHint("That's from HR. Open Maria's email.", "Eso es de RR.HH. Abre el correo de Maria."),
    body: {
      en: ["Welcome to the team! On your first day you will fill out three forms: a W-4 for taxes, an I-9, and a direct deposit form.", "Please bring a photo ID and your bank's routing and account numbers. A voided check works too.", "Questions? Call (617) 555-0114."],
      es: ["¡Te damos la bienvenida al equipo! Tu primer día vas a llenar tres formularios: un W-4 para los impuestos, un I-9 y un formulario de depósito directo.", "Por favor trae una identificación con foto y los números de ruta y de cuenta de tu banco. Un cheque anulado también sirve.", "¿Preguntas? Llama al (617) 555-0114."],
    } },
] satisfies DecoyEmail[]).map(openable);

const NOT_A_JOB_EN =
  "Nothing here needs an answer right now. Your job is to write a new email. Click Compose.";
const NOT_A_JOB_ES =
  "Nada de esto necesita respuesta ahora. Tu tarea es escribir un correo nuevo. Haz clic en Redactar.";

/** Mid-week of the shared-files level: you just shared a file, now send the link. */
const SEND_LINK_DECOYS: DecoyEmail[] = [
  { key: "it-outage", from: "IT Helpdesk", initials: "IT", color: "#3c4043", time: "8:02 AM", isTarget: false,
    subject: { en: "Drive was slow this morning: fixed", es: "Drive estuvo lento esta mañana: resuelto" },
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

/** Saturday of week one — open Darnell's unanswered Day One question. */
const OPEN_DARNELL_EN = "That one is not the job. Open Darnell's email about extra aprons.";
const OPEN_DARNELL_ES = "Ese no es el trabajo. Abre el correo de Darnell sobre los delantales.";
const ETIQUETTE_DECOYS: DecoyEmail[] = [
  { key: "fridge", from: "Cafe Team", initials: "CT", color: "#1e8e3e", time: "9:12 AM", isTarget: false,
    subject: { en: "Fridge gets cleaned out Monday", es: "El refrigerador se vacía el lunes" },
    preview: { en: "Take your food home this weekend.", es: "Llévate tu comida este fin de semana." },
    wrongHint: wrongHint(OPEN_DARNELL_EN, OPEN_DARNELL_ES) },
  { key: "payroll-note", ...inboxSender(CAST.hr), time: "8:40 AM", isTarget: false,
    subject: { en: "Direct deposit posts Friday", es: "El depósito directo entra el viernes" },
    preview: { en: "Nothing to do. Just a heads up.", es: "No hay que hacer nada. Solo un aviso." },
    wrongHint: wrongHint(OPEN_DARNELL_EN, OPEN_DARNELL_ES) },
  { key: "it-survey", from: "IT Helpdesk", initials: "IT", color: "#3c4043", time: "Fri", isTarget: false,
    subject: { en: "2-minute survey: the new tablets", es: "Encuesta de 2 minutos: las tabletas nuevas" },
    preview: { en: "Optional. Closes next week.", es: "Opcional. Cierra la próxima semana." },
    wrongHint: wrongHint(OPEN_DARNELL_EN, OPEN_DARNELL_ES) },
];

/** Monday morning of week two, before your shift — you're writing Maria that you're sick. */
const SICK_CALL_DECOYS: DecoyEmail[] = [
  { key: "benefits", ...inboxSender(CAST.hr), time: "Fri", isTarget: false,
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
  sentOn?: number;
  isTarget: boolean;
  unread: boolean;
  subject: Localized;
  preview: Localized;
  wrongHint?: Localized;
  story?: boolean;
  body?: Record<Lang, string[]>;
};

/**
 * A decoy with a body opens read-only in Mail's story view. `notice` tells
 * that view to show the body as written, with no greeting added.
 */
function openable(decoy: DecoyEmail): InboxEmail {
  return decoy.body ? { ...decoy, story: true, notice: true } : decoy;
}

/** Saturday sitting — later than the same-day decoys so Darnell is on top. */
export const DARNELL_APRON_STAMP = {
  time: "9:48 AM",
  sentOn: STORY_DAY_BY_LEVEL.level3a,
} as const;

/** Inbox rows for the active Day One job. Job 2 keeps the welcome mail as a non-target. */
export function emailsForTask(task: PlayableMailTask): InboxEmail[] {
  const welcomeMeta = SUBJECT_BY_TASK["mail-reply"];
  const safetyMeta = SUBJECT_BY_TASK["mail-attach"];
  const welcome: InboxEmail = {
    key: "maria-welcome",
    ...inboxSender(CAST.maria),
    time: "8:14 AM",
    sentOn: HIRE_DAY,
    isTarget: task === "mail-reply",
    unread: task === "mail-reply",
    subject: { en: welcomeMeta.en.subject, es: welcomeMeta.es.subject },
    preview: { en: welcomeMeta.en.preview, es: welcomeMeta.es.preview },
  };
  const safety: InboxEmail = {
    key: "maria-safety",
    ...inboxSender(CAST.maria),
    time: "10:10 AM",
    sentOn: STORY_DAY_BY_LEVEL.level2,
    isTarget: true,
    unread: true,
    subject: { en: safetyMeta.en.subject, es: safetyMeta.es.subject },
    preview: { en: safetyMeta.en.preview, es: safetyMeta.es.preview },
  };
  // Every job's inbox carries a little clutter, dated to that job's own day
  // (see DECOY_POOLS). The target rows for a job come first, then its pool.
  // Story mail (the manager's replies, correctly filtered by day) still shows
  // via storyMailsUpTo regardless of what this function returns.
  const decoys = (DECOY_POOLS[task] ?? []).map(openable);
  if (task === "mail-reply") return [welcome, ...decoys];
  if (task === "mail-attach") {
    // Maria's welcome from the evening before Day One, as the learner got it
    // in mail-reply. It opens read-only: it is not the job, but it is hers.
    const opened = OPENING_MESSAGES[0];
    const earlierWelcome: InboxEmail = {
      key: "maria-welcome",
      ...inboxSender(CAST.maria),
      time: opened.time,
      sentOn: NIGHT_BEFORE,
      isTarget: false,
      unread: false,
      subject: opened.subject,
      preview: opened.body,
      story: true,
      body: { en: openingLines(opened, "en"), es: openingLines(opened, "es") },
    };
    return [safety, earlierWelcome, ...decoys];
  }
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
  if (task === "mail-etiquette") {
    const meta = SUBJECT_BY_TASK["mail-etiquette"];
    return [
      {
        key: "darnell-aprons",
        ...inboxSender(CAST.darnell),
        ...DARNELL_APRON_STAMP,
        isTarget: true,
        unread: true,
        subject: { en: meta.en.subject, es: meta.es.subject },
        preview: { en: meta.en.preview, es: meta.es.preview },
      },
      ...decoys,
    ];
  }
  // Compose-only jobs (call-out-sick, mail-send-link): nothing to open, but
  // the inbox still isn't empty.
  return decoys;
}

/** Compose jobs need their own Help, rather than the attachment lesson. */
export const COMPOSE_LESSONS: Partial<Record<PlayableMailTask, Record<Lang, Lesson>>> = {
  "mail-etiquette": {
    en: {
      t: "A clear work email",
      s: ["Open Darnell's email about extra aprons.", "Click Reply.", "Tell him the extra aprons are in the storage room. Use your own words."],
      tip: "A short, useful answer is enough. You do not need to copy a sentence starter exactly.",
    },
    es: {
      t: "Un correo de trabajo claro",
      s: ["Abre el correo de Darnell sobre los delantales.", "Haz clic en Responder.", "Dile que los delantales de más están en el almacén. Usa tus propias palabras."],
      tip: "Basta con una respuesta breve y útil. No necesitas copiar exactamente una frase de ayuda.",
    },
  },
  "call-out-sick": {
    en: {
      t: "Let Maria know you cannot come in",
      s: ["Check that the To line says Maria.", "Say you are sick and cannot work your shift today.", "Keep it short. You do not need to describe your symptoms."],
      tip: "This practice uses email. At your workplace, follow its call-out process and notice rules.",
    },
    es: {
      t: "Avísale a Maria que no puedes ir",
      s: ["Revisa que la línea Para diga Maria.", "Di que te sientes mal y no puedes trabajar tu turno de hoy.", "Sé breve. No necesitas describir tus síntomas."],
      tip: "Esta práctica usa correo. En tu trabajo, sigue su proceso y sus reglas para avisar de una ausencia.",
    },
  },
};

import type { EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "📧",
    kicker: "Wednesday, a little later",
    headline: "An email is waiting.",
    body: "Something in your inbox is not what it looks like. Read every message before you decide.",
    cta: "Open Mail",
  },
  es: {
    emoji: "📧",
    kicker: "Miércoles, un poco más tarde",
    headline: "Hay un correo esperando.",
    body: "Algo en tu bandeja de entrada no es lo que parece. Lee todos los mensajes antes de decidir.",
    cta: "Abrir correo",
  },
};

const wrongHint = (en: string, es: string): Localized => ({ en, es });

/** One message in the practice inbox. */
export interface InboxEmail {
  key: string;
  fromName: string;
  fromAddress: string;
  subject: Localized;
  /** One-line preview shown in the inbox list. */
  preview: Localized;
  /** Body paragraphs, in reading order. */
  body: Record<Lang, string[]>;
  signature?: Localized;
  when: Localized;
  /** The one message to report. */
  isTarget: boolean;
  /** Only the fake message has a fake "Verify Now" button in its body. */
  hasVerifyLink?: boolean;
  /** Shown when Report phishing is clicked on a real message. */
  wrongHint?: Localized;
}

/** The real company domain, for comparison against the fake one. */
export const REAL_DOMAIN = "harborsidecafe.com";
/** The lookalike domain the fake email sends from. */
export const FAKE_DOMAIN = "harborside-cafe-help.com";

/**
 * The practice inbox: four messages, newest first, the way a real inbox
 * lists them. Opening any message is free; only one of the four is the
 * phishing email to report. Harborside IT Support and Harborside Payroll are
 * fictional company accounts, not people, so they need no cast introduction.
 */
export const EMAILS: InboxEmail[] = [
  {
    key: "fake",
    fromName: "Harborside IT Support",
    fromAddress: `support@${FAKE_DOMAIN}`,
    subject: {
      en: "Urgent: Your Account Will Be Locked Today",
      es: "Urgente: Tu cuenta se bloqueará hoy",
    },
    preview: {
      en: "Your account access expires today. Verify now to keep it open.",
      es: "El acceso a tu cuenta vence hoy. Verifica ahora para mantenerla abierta.",
    },
    body: {
      en: [
        "Your Harborside account access expires today.",
        "If you do not verify now, your account will be locked.",
        "To confirm this is really you, reply to this email with your password.",
      ],
      es: [
        "El acceso a tu cuenta de Harborside vence hoy.",
        "Si no verificas ahora, tu cuenta quedará bloqueada.",
        "Para confirmar que de verdad eres tú, responde este correo con tu contraseña.",
      ],
    },
    signature: { en: "Harborside IT Support", es: "Soporte de TI de Harborside" },
    when: { en: "Today, 9:14 AM", es: "Hoy, 9:14 a. m." },
    isTarget: true,
    hasVerifyLink: true,
  },
  {
    key: "renata",
    fromName: "Renata Silva",
    fromAddress: `renata.silva@${REAL_DOMAIN}`,
    subject: {
      en: "Next week's shifts",
      es: "Turnos de la próxima semana",
    },
    preview: {
      en: "A quick note about next week's schedule.",
      es: "Un aviso rápido sobre el horario de la próxima semana.",
    },
    body: {
      en: [
        "Hi, just a quick note: next week's schedule goes up on Friday.",
        "If you need a specific day off, tell me by Thursday.",
      ],
      es: [
        "Hola, un aviso rápido: el horario de la próxima semana queda listo el viernes.",
        "Si necesitas un día libre en especial, avísame antes del jueves.",
      ],
    },
    signature: { en: "Renata", es: "Renata" },
    when: { en: "Yesterday, 4:02 PM", es: "Ayer, 4:02 p. m." },
    isTarget: false,
    wrongHint: wrongHint(
      "This one is real. It is from Renata, your manager, at her usual address. It only asks about next week's schedule, with no urgent threat and no request for a password. Keep looking for the email that is not really from Harborside.",
      "Este es real. Es de Renata, tu gerente, desde su dirección habitual. Solo pregunta sobre el horario de la próxima semana, sin ninguna amenaza urgente ni pedido de contraseña. Sigue buscando el correo que no es realmente de Harborside."
    ),
  },
  {
    key: "payroll",
    fromName: "Harborside Payroll",
    fromAddress: `payroll@${REAL_DOMAIN}`,
    subject: {
      en: "Pay stubs are posted",
      es: "Los recibos de pago ya están publicados",
    },
    preview: {
      en: "This period's pay stubs are now in the Employee Portal.",
      es: "Los recibos de pago de este periodo ya están en el Portal del empleado.",
    },
    body: {
      en: [
        "This period's pay stubs are now available in the Employee Portal, under Pay Stubs.",
        "No action is needed. This is only a notice.",
      ],
      es: [
        "Los recibos de pago de este periodo ya están disponibles en el Portal del empleado, en Recibos de pago.",
        "No se necesita ninguna acción. Este es solo un aviso.",
      ],
    },
    signature: { en: "Harborside Payroll", es: "Nómina de Harborside" },
    when: { en: "2 days ago", es: "Hace 2 días" },
    isTarget: false,
    wrongHint: wrongHint(
      "This one is real. It comes from Harborside's own payroll address, only tells you something, and has no link to click and no urgent threat. Keep looking for the email that is not really from Harborside.",
      "Este es real. Viene de la dirección de nómina de Harborside, solo te informa algo y no tiene ningún enlace ni amenaza urgente. Sigue buscando el correo que no es realmente de Harborside."
    ),
  },
  {
    key: "supply",
    fromName: "Cafe Supply Co.",
    fromAddress: "orders@cafesupplyco.com",
    subject: {
      en: "Your order #48217 has shipped",
      es: "Tu pedido #48217 fue enviado",
    },
    preview: {
      en: "Order #48217 is on its way.",
      es: "El pedido #48217 va en camino.",
    },
    body: {
      en: [
        "Order #48217 (napkins, coffee filters) has shipped.",
        "It should arrive in 3 to 5 business days. Thank you for your order.",
      ],
      es: [
        "El pedido #48217 (servilletas, filtros de café) fue enviado.",
        "Debería llegar en 3 a 5 días hábiles. Gracias por tu pedido.",
      ],
    },
    signature: { en: "Cafe Supply Co.", es: "Cafe Supply Co." },
    when: { en: "3 days ago", es: "Hace 3 días" },
    isTarget: false,
    wrongHint: wrongHint(
      "This one is real. It is an ordinary order confirmation, with no threat and nothing asked of you. Keep looking for the email that is not really from Harborside.",
      "Este es real. Es una confirmación de pedido normal, sin amenazas y sin pedirte nada. Sigue buscando el correo que no es realmente de Harborside."
    ),
  },
];

export function emailByKey(key: string): InboxEmail | undefined {
  return EMAILS.find((e) => e.key === key);
}

/**
 * The unsafe move, in three forms: clicking Reply on the fake message,
 * clicking its fake "Verify Now" button, or sending anything through the
 * reply box it opens. All three get the same correction, because the right
 * move is the same for all three: never reply or click, report it instead.
 */
export const PHISHING_REPLY_HINT: Localized = wrongHint(
  "Do not reply to this email and do not click its link. This message is not really from Harborside. Click Report phishing instead.",
  "No respondas a este correo ni hagas clic en su enlace. Este mensaje no es realmente de Harborside. Haz clic en Reportar phishing en su lugar."
);

export const INBOX_COPY: Record<Lang, {
  heading: string;
  backToInbox: string;
  replyLabel: string;
  reportLabel: string;
  verifyLabel: string;
  sendLabel: string;
  cancelLabel: string;
  replyPlaceholder: string;
  sentNote: string;
  doneKicker: string;
  doneBody: string;
  badgeName: string;
  badgeWhere: string;
  tryAgain: string;
  backToDesk: string;
}> = {
  en: {
    heading: "Inbox",
    backToInbox: "Back to inbox",
    replyLabel: "Reply",
    reportLabel: "Report phishing",
    verifyLabel: "Verify Now",
    sendLabel: "Send",
    cancelLabel: "Cancel",
    replyPlaceholder: "Write your reply...",
    sentNote: "Sent. This task is about finding the email that is not really from Harborside.",
    doneKicker: "Phishing email reported",
    doneBody: "Reporting tells your company about a fake email so they can warn others and block it. Never click a link or send a password to an email like this one again.",
    badgeName: "Spot a phishing email",
    badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
  },
  es: {
    heading: "Bandeja de entrada",
    backToInbox: "Volver a la bandeja de entrada",
    replyLabel: "Responder",
    reportLabel: "Reportar phishing",
    verifyLabel: "Verificar ahora",
    sendLabel: "Enviar",
    cancelLabel: "Cancelar",
    replyPlaceholder: "Escribe tu respuesta...",
    sentNote: "Enviado. Esta tarea es sobre encontrar el correo que no es realmente de Harborside.",
    doneKicker: "Correo de phishing reportado",
    doneBody: "Reportar le avisa a tu empresa sobre un correo falso para que pueda advertir a otros y bloquearlo. Nunca hagas clic en un enlace ni envíes tu contraseña a un correo así.",
    badgeName: "Identificar un correo de phishing",
    badgeWhere: "Cuenta para: Oficina · Servicio de alimentos",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
  },
};

/** The persistent "what to do right now" line. One step: the whole job is one decision. */
export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Open each email. Find the one that is not really from your workplace. Click Report phishing on that one.",
    es: "Abre cada correo. Busca el que no es realmente de tu trabajo. Haz clic en Reportar phishing en ese.",
  },
];

export const HELP_LESSON: Record<Lang, Lesson> = {
  en: {
    t: "Spotting a phishing email",
    s: [
      "Check the sender's full email address, not just the name shown. A display name can say anything.",
      "A real company email does not say your account will be locked today and does not ask you to reply with your password.",
      "A button like Verify Now can go to a fake page even when the email looks official.",
      "When you are not sure, do not click and do not reply. Report the email instead.",
    ],
    tip: "A password is something only you should know. No real company ever asks you to send it in an email.",
  },
  es: {
    t: "Identificar un correo de phishing",
    s: [
      "Revisa la dirección completa de quien envía el correo, no solo el nombre que aparece. Un nombre se puede escribir de cualquier forma.",
      "Un correo real de la empresa no dice que tu cuenta se bloqueará hoy ni te pide que respondas con tu contraseña.",
      "Un botón como Verificar ahora puede llevar a una página falsa aunque el correo se vea oficial.",
      "Cuando tengas dudas, no hagas clic ni respondas. Reporta el correo en su lugar.",
    ],
    tip: "Una contraseña es algo que solo tú debes saber. Ninguna empresa real te pide enviarla por correo.",
  },
};

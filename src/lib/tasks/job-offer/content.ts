import type { Lang, Lesson, Localized, SubmissionContent } from "@/lib/task-types";

/**
 * "The Offer" — the fifth step of the getting-hired arc. Harborside HQ makes
 * the offer. The learner reads the letter, picks the correct start date out of
 * it (the same "find the fact in the document" skill as the pay stub and the
 * financial-aid letter), and writes a short acceptance reply. Teacher-check on
 * the reply; the start date is app-checked.
 */

export const JOB_OFFER_COPY: Record<Lang, {
  appName: string;
  from: string;
  fromEmail: string;
  subject: string;
  letterHeading: string;
  startDateLabel: string;
  startDateHint: string;
  wrongDate: string;
  replyLabel: string;
  replyHint: string;
  send: string;
  needDate: string;
  needReply: string;
  sentKicker: string;
  doneTitle: string;
  doneBody: string;
  tryAgain: string;
  backToDesk: string;
  lessonKicker: string;
  tipLabel: string;
  gotIt: string;
}> = {
  en: {
    appName: "Mail — Offer",
    from: "Anita Raman",
    fromEmail: "anita.raman@harborsidehq.com",
    subject: "Offer — Office Administrator",
    letterHeading: "Offer of employment",
    startDateLabel: "When do you start? Pick the date from the letter.",
    startDateHint: "Read the letter again. The start date is in the second paragraph.",
    wrongDate: "That's not the date in the letter. Look at the second paragraph.",
    replyLabel: "Reply to Anita — accept the offer",
    replyHint: "Short and warm. Thank her, say you accept, and confirm the start date.",
    send: "Send reply",
    needDate: "Pick the start date from the letter first.",
    needReply: "Write a short reply accepting the offer.",
    sentKicker: "Offer accepted",
    doneTitle: "You accepted the offer.",
    doneBody: "You read the letter, found the start date, and sent a clear reply. You have the office job. Last thing before day one: the new-hire paperwork.",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
  },
  es: {
    appName: "Correo — Oferta",
    from: "Anita Raman",
    fromEmail: "anita.raman@harborsidehq.com",
    subject: "Oferta — Administrador de Oficina",
    letterHeading: "Oferta de empleo",
    startDateLabel: "¿Cuándo empiezas? Elige la fecha de la carta.",
    startDateHint: "Lee la carta otra vez. La fecha de inicio está en el segundo párrafo.",
    wrongDate: "Esa no es la fecha de la carta. Mira el segundo párrafo.",
    replyLabel: "Responde a Anita — acepta la oferta",
    replyHint: "Corto y amable. Agradécele, di que aceptas y confirma la fecha de inicio.",
    send: "Enviar respuesta",
    needDate: "Primero elige la fecha de inicio de la carta.",
    needReply: "Escribe una respuesta corta aceptando la oferta.",
    sentKicker: "Oferta aceptada",
    doneTitle: "Aceptaste la oferta.",
    doneBody: "Leíste la carta, encontraste la fecha de inicio y enviaste una respuesta clara. Tienes el puesto de oficina. Lo último antes del primer día: el papeleo de nuevo empleado.",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
  },
};

export const OFFER_LETTER: Record<Lang, string[]> = {
  en: [
    "Dear applicant, we're glad to offer you the Office Administrator role at Harborside HQ. The pay is $25.50 per hour, full time, with benefits after 60 days.",
    "Your first day is Monday, October 6. You'll report to me. Plan to arrive at 9:00 AM for orientation.",
    "Please reply to accept. Before your first day, complete the new-hire forms — HR will send them.",
  ],
  es: [
    "Estimado solicitante, nos alegra ofrecerte el puesto de Administrador de Oficina en Harborside HQ. El pago es de $25.50 por hora, tiempo completo, con beneficios después de 60 días.",
    "Tu primer día es el lunes 6 de octubre. Vas a reportarte conmigo. Planea llegar a las 9:00 AM para la orientación.",
    "Por favor responde para aceptar. Antes de tu primer día, completa los formularios de nuevo empleado — RR. HH. te los enviará.",
  ],
};

export const CORRECT_DATE_KEY = "oct-6";

export const DATE_CHOICES: { key: string; label: Localized; ok: boolean }[] = [
  { key: "oct-6", label: { en: "Monday, October 6", es: "Lunes 6 de octubre" }, ok: true },
  { key: "oct-9", label: { en: "Thursday, October 9", es: "Jueves 9 de octubre" }, ok: false },
  { key: "sep-6", label: { en: "Friday, September 6", es: "Viernes 6 de septiembre" }, ok: false },
];

export function replyLooksReal(reply: string): boolean {
  return reply.trim().split(/\s+/).filter(Boolean).length >= 8;
}

export const REPLY_STARTERS: Record<Lang, string[]> = {
  en: [
    "Thank you for the offer.",
    "I'm glad to accept the Office Administrator role.",
    "I'll be there Monday, October 6 at 9:00 AM.",
    "I'll watch for the new-hire forms from HR.",
  ],
  es: [
    "Gracias por la oferta.",
    "Me alegra aceptar el puesto de Administrador de Oficina.",
    "Estaré ahí el lunes 6 de octubre a las 9:00 AM.",
    "Estaré pendiente de los formularios de nuevo empleado de RR. HH.",
  ],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Reading an offer letter",
      s: [
        "An offer letter has the facts you need: the job title, the pay, the start date, and what to do next.",
        "Find the start date and write it down. Do not guess — read the exact line.",
        "Reply within a day or two. Thank them, say clearly that you accept, and repeat the start date so there's no mix-up.",
      ],
      tip: "Repeating the date back is not extra — it's how you both know you agree.",
    },
  ],
  es: [
    {
      t: "Leer una carta de oferta",
      s: [
        "Una carta de oferta tiene los datos que necesitas: el puesto, el pago, la fecha de inicio y qué hacer después.",
        "Encuentra la fecha de inicio y anótala. No adivines — lee la línea exacta.",
        "Responde en uno o dos días. Agradece, di claramente que aceptas y repite la fecha de inicio para que no haya confusión.",
      ],
      tip: "Repetir la fecha no es de más — es cómo ambos saben que están de acuerdo.",
    },
  ],
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Read the letter. Pick your start date from it.",
    es: "Lee la carta. Elige tu fecha de inicio de ella.",
  },
  {
    en: "Write a short reply accepting the offer, then send.",
    es: "Escribe una respuesta corta aceptando la oferta, luego envía.",
  },
];

/** What the teacher sees: the start date the learner picked and their acceptance reply. */
export function describeSubmission(
  fields: { dateKey: string; reply: string },
  lang: Lang,
): SubmissionContent {
  const c = JOB_OFFER_COPY[lang];
  const date = DATE_CHOICES.find((d) => d.key === fields.dateKey)?.label[lang] ?? fields.dateKey;
  return {
    lang,
    fields: [
      { label: c.startDateLabel, value: date },
      { label: c.replyLabel, value: fields.reply },
    ],
  };
}

import type { Localized } from "@/lib/task-types";
import { CAST } from "@/lib/cast";

/**
 * Wave 4, communication beyond email (Day 2). After the swap request is
 * filed, Maria answers by text: she moved the learner to the late Thursday
 * shift they asked for, and asks them to confirm. The learner replies in the
 * phone's Messages thread. Nothing about the schedule changes: the text
 * confirms what the learner asked for.
 *
 * The reply is checked for two things only: that it says yes (it works), and
 * that it names the day or the time, so Maria knows it was read. Short
 * beginner English and Spanish pass.
 */
export const MARIA_TEXT: Localized = {
  en: "Hi, it's Maria. I got your swap request. I moved you to Thursday, 2 PM to 10 PM. Can you reply so I know you saw it?",
  es: "Hola, soy Maria. Recibí tu pedido de cambio. Te pasé al jueves, de 2 PM a 10 PM. ¿Me respondes para saber que lo viste?",
};

export const MARIA_TEXT_FROM = CAST.maria.name;

export type TextReplyVerdict = "ok" | "empty" | "declines" | "no-yes" | "no-detail";

const DECLINE = /\b(no puedo|can ?not|can't|cant|cannot|won't|wont|not able|no me funciona|no funciona|doesn'?t work)\b/;
const YES = /\b(yes|yeah|yep|ok|okay|sure|works|good|fine|great|perfect|thanks|thank you|see you|i will|i'll|i can|s[ií]|claro|vale|bien|perfecto|gracias|funciona|puedo|ah[ií] estar[eé]|nos vemos)\b/;
const DETAIL = /\b(thu|thur|thurs|thursday|jueves|2|2pm|2:00|14|10|10pm|10:00|two|dos|late|tarde)\b/;

export function textReplyVerdict(reply: string): TextReplyVerdict {
  const t = reply.toLowerCase().normalize("NFC").trim();
  if (!t) return "empty";
  if (DECLINE.test(t)) return "declines";
  if (!YES.test(t)) return "no-yes";
  if (!DETAIL.test(t)) return "no-detail";
  return "ok";
}

export const TEXT_CORRECTIONS: Record<Exclude<TextReplyVerdict, "ok">, Localized> = {
  empty: {
    en: "Write a short reply to Maria. For example: Yes, Thursday 2 to 10 works.",
    es: "Escribe una respuesta corta para Maria. Por ejemplo: Sí, el jueves de 2 a 10 está bien.",
  },
  declines: {
    en: "Maria moved you to the late shift you asked for. It starts after your doctor visit. Tell her it works.",
    es: "Maria te pasó al turno de la tarde que pediste. Empieza después de tu cita con el doctor. Dile que te funciona.",
  },
  "no-yes": {
    en: "Tell Maria if the new time works for you. Start with Yes or OK.",
    es: "Dile a Maria si el nuevo horario te funciona. Empieza con Sí o OK.",
  },
  "no-detail": {
    en: "Say the day or the time too, so Maria knows you read it: Thursday, 2 PM.",
    es: "Di también el día o la hora, para que Maria sepa que lo leíste: jueves, 2 PM.",
  },
};

/** The Job Card lines for the text step (Act I spells out the clicks). */
export const TEXT_STEPS: Record<"read" | "reply", Localized> = {
  read: {
    en: "Maria sent you a text. Read it on your phone.",
    es: "Maria te mandó un mensaje de texto. Léelo en tu teléfono.",
  },
  reply: {
    en: "Reply to Maria. Say yes, and say the day or the time. Then click Send.",
    es: "Respóndele a Maria. Di que sí, y di el día o la hora. Después haz clic en Enviar.",
  },
};

export const TEXT_COPY: Localized<{
  heading: string;
  label: string;
  placeholder: string;
  send: string;
  sent: string;
  delivered: string;
}> = {
  en: { heading: "Maria", label: "Your phone · Messages", placeholder: "Text message", send: "Send", sent: "Text sent", delivered: "Delivered" },
  es: { heading: "Maria", label: "Tu teléfono · Mensajes", placeholder: "Mensaje de texto", send: "Enviar", sent: "Mensaje enviado", delivered: "Entregado" },
};

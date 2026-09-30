import type { Localized } from "@/lib/task-types";
import { CAST } from "@/lib/cast";
import { affirms, mentionsTime, reassured, saysCannotAttend, yesNoAnswer } from "@/lib/grading/meaning";

/**
 * Wave 4, communication beyond email (Day 2). After the swap request is
 * filed, Maria answers by text: she moved the learner to the late Thursday
 * shift they asked for, and says exactly what to text back (owner, 30 Sep:
 * "reply so I know you saw it" left beginners unsure what to write). The learner replies in the
 * phone's Messages thread. Nothing about the schedule changes: the text
 * confirms what the learner asked for.
 *
 * The reply is checked for two things only: that it says yes (it works), and
 * that it names the day or the time, so Maria knows it was read. Short
 * beginner English and Spanish pass.
 */
export const MARIA_TEXT: Localized = {
  en: "Hi, it's Maria. I got your swap request. I moved you to Thursday, 2 PM to 10 PM. Please text back: Yes, Thursday works.",
  es: "Hola, soy Maria. Recibí tu pedido de cambio. Te pasé al jueves, de 2 PM a 10 PM. Por favor respóndeme: Sí, el jueves está bien.",
};

export const MARIA_TEXT_FROM = CAST.maria.name;

export type TextReplyVerdict = "ok" | "empty" | "declines" | "no-yes" | "no-detail" | "wrong-day";

/**
 * Read with the shared reader (`meaning.ts`): accents off, so "Sí" and
 * "ahí estaré" count (Wave 5 F-1: JavaScript's `\b` does not see "í" as a
 * letter, and every accented yes was refused with "Start with Sí").
 */
const THURSDAY = /\b(thu|thur|thurs|thursday|thurday|thursay|thrusday|thursdy|thusday|thurdsay|jueves|juves|jeuves)\b/;
const OTHER_DAY =
  /\b(mon|monday|tue|tues|tuesday|wed|wednesday|fri|friday|sat|saturday|sun|sunday|lunes|martes|miercoles|viernes|sabado|domingo)\b/;
/** Beginner no's the shared reader does not catch: "i no can", "not ok". */
const REFUSES =
  /\b(no|not|don'?t|dont) can\b|\bnot (ok|okay|good|fine)\b|\bno (me )?(funciona|sirve)\b|\bno (esta|es) bien\b|\b(doesn'?t|does not|not) work\b/;
/** Yes words beyond the shared YES: "Thursday works", "gracias". */
const MORE_YES = /\b(good|works|thanks|thank you|thx|gracias|bien|funciona|me sirve|perfect|nice)\b/;

/**
 * Yes, and Thursday or 2 PM. A different day is the wrong shift ("yes,
 * Friday 10 AM" passed before, because any "10" counted); the end time alone
 * does not show she read the start.
 */
export function textReplyVerdict(reply: string): TextReplyVerdict {
  const t = reassured(reply);
  if (!t) return "empty";
  if (yesNoAnswer(reply) === "no" || saysCannotAttend(reply) || REFUSES.test(t)) return "declines";
  if (yesNoAnswer(reply) !== "yes" && !affirms(t, MORE_YES)) return "no-yes";
  const thursday = THURSDAY.test(t);
  if (!thursday && OTHER_DAY.test(t)) return "wrong-day";
  if (!thursday && !mentionsTime(t, 2) && !/\b14(:00)?\b/.test(t)) return "no-detail";
  return "ok";
}

export const TEXT_CORRECTIONS: Record<Exclude<TextReplyVerdict, "ok">, Localized> = {
  empty: {
    en: "Write a short reply to Maria: Yes, Thursday works.",
    es: "Escribe una respuesta corta para Maria: Sí, el jueves está bien.",
  },
  declines: {
    en: "Maria moved you to the late shift you asked for. It starts after your doctor visit. Tell her it works.",
    es: "Maria te pasó al turno de la tarde que pediste. Empieza después de tu cita con el doctor. Dile que te funciona.",
  },
  "no-yes": {
    en: "Tell Maria if the new time works for you. Start with Yes or OK.",
    es: "Dile a Maria si el nuevo horario te funciona. Empieza con Sí o OK.",
  },
  "wrong-day": {
    en: "Maria moved you to Thursday, not another day. Say Thursday or 2 PM.",
    es: "Maria te pasó al jueves, no a otro día. Di jueves o 2 PM.",
  },
  "no-detail": {
    en: "Say the day or the time too, so Maria knows you read it: Thursday, 2 PM.",
    es: "Di también el día o la hora, para que Maria sepa que lo leíste: jueves, 2 PM.",
  },
};

/** The Job Card lines for the text step (Act I spells out the clicks). */
export const TEXT_STEPS: Record<"read" | "reply", Localized> = {
  // Both lines give the reply Maria asks for, so the learner knows what to
  // write before they start typing (owner, 30 Sep).
  read: {
    en: "Maria sent you a text. Reply on your phone: Yes, Thursday works.",
    es: "Maria te mandó un mensaje de texto. Respóndele en tu teléfono: Sí, el jueves está bien.",
  },
  reply: {
    en: "Reply to Maria. Write: Yes, Thursday works. Then click Send.",
    es: "Respóndele a Maria. Escribe: Sí, el jueves está bien. Después haz clic en Enviar.",
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

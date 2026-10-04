import type { Localized } from "@/lib/task-types";

/**
 * Wave 4, communication beyond email (Day 14). Before the crew schedule, the
 * cafe phone has a voicemail for Renata from Casey Brooks: she asked for
 * Saturday off and wants Renata to call back and confirm. Renata is out, so
 * the learner writes her a phone message: who called, why, and the number
 * to call back. It agrees with the schedule, where Casey's Saturday is Off.
 *
 * The voicemail plays aloud (the browser's own speech, no network) and is
 * always shown as a transcript too: nothing depends on hearing it. Each
 * field is checked on its own, and short beginner English or Spanish passes.
 */
export const CALLBACK_NUMBER = "(555) 0137";
const CALLBACK_DIGITS = "0137";

/** What Casey says, in English, as a US workplace voicemail would be. */
export const VOICEMAIL_TEXT =
  "Hi Renata, it's Casey Brooks. I asked for Saturday off, for my sister's wedding. Can you call me back to confirm? My number is 555, 0137. Thanks.";

/** A Spanish reader gets the meaning beside the English transcript. */
export const VOICEMAIL_GLOSS: Localized = {
  en: "",
  es: "En español: Casey Brooks pidió el sábado libre para la boda de su hermana. Quiere que Renata la llame para confirmar. Su número es (555) 0137.",
};

export interface PhoneMessage {
  caller: string;
  reason: string;
  callback: string;
}

export type PhoneMessageProblem = "caller" | "reason" | "callback";

const fold = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** The first field that is missing or wrong, or null when the message is complete. */
export function phoneMessageProblem(m: PhoneMessage): PhoneMessageProblem | null {
  if (!/\bcasey\b|\bbrooks\b/.test(fold(m.caller))) return "caller";
  if (!/\b(sat|saturday|sabado|off|day off|libre|wedding|boda|confirm\w*)\b/.test(fold(m.reason))) return "reason";
  if (!m.callback.replace(/\D/g, "").endsWith(CALLBACK_DIGITS)) return "callback";
  return null;
}

export const PHONE_MESSAGE_CORRECTIONS: Record<PhoneMessageProblem, Localized> = {
  caller: {
    en: "Who called? Write the caller's name from the voicemail.",
    es: "¿Quién llamó? Escribe el nombre de la persona del mensaje de voz.",
  },
  reason: {
    en: "Why did Casey call? Write the reason in a few words: Saturday off.",
    es: "¿Por qué llamó Casey? Escribe el motivo en pocas palabras: el sábado libre.",
  },
  callback: {
    en: "Check the call-back number. Listen again or read the transcript: 555, 0137.",
    es: "Revisa el número para devolver la llamada. Escucha otra vez o lee la transcripción: 555, 0137.",
  },
};

/** Act III states the title only, so this new step is spelled out as the goal. */
export const VOICEMAIL_STEP: Localized = { en: "Listen to the voicemail or read its transcript. Send Renata a phone message with the caller’s name, reason for calling, and callback number.", es: "Escucha el mensaje de voz o lee la transcripción. Envía a Renata un recado con el nombre de quien llamó, el motivo y el número para devolver la llamada." };

/** The schedule email waits until Renata has her message. */
export const MESSAGE_FIRST: Localized = {
  en: "First pass on Casey's voicemail. Write Renata the phone message.",
  es: "Primero pasa el mensaje de voz de Casey. Escríbele el recado a Renata.",
};

export const VOICEMAIL_COPY: Localized<{
  phoneLabel: string;
  heading: string;
  from: string;
  length: string;
  play: string;
  transcript: string;
  formHeading: string;
  to: string;
  caller: string;
  reason: string;
  callback: string;
  send: string;
  sent: string;
}> = {
  en: {
    phoneLabel: "Cafe phone · Voicemail",
    heading: "Voicemail",
    from: "Casey Brooks",
    length: "0:14",
    play: "Play",
    transcript: "Transcript",
    formHeading: "Phone message",
    to: "For: Renata Silva",
    caller: "Who called",
    reason: "Why they called",
    callback: "Call back at",
    send: "Send to Renata",
    sent: "Phone message sent to Renata.",
  },
  es: {
    phoneLabel: "Teléfono del café · Buzón de voz",
    heading: "Buzón de voz",
    from: "Casey Brooks",
    length: "0:14",
    play: "Escuchar",
    transcript: "Transcripción",
    formHeading: "Recado telefónico",
    to: "Para: Renata Silva",
    caller: "Quién llamó",
    reason: "Por qué llamó",
    callback: "Devolver la llamada al",
    send: "Enviar a Renata",
    sent: "Recado enviado a Renata.",
  },
};

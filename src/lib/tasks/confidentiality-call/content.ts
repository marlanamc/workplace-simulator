import type { Lang, Lesson, Localized, SubmissionContent } from "@/lib/task-types";

export const CALL_COPY: Record<Lang, {
  helpBtn: string;
  clinic: string;
  heading: string;
  ringing: string;
  caller: string;
  script: string;
  pick: string;
  writeHere: string;
  send: string;
  empty: string;
  shareHint: string;
  rudeHint: string;
  weak: string;
  sentKicker: string;
  tryAgain: string;
  backToDesk: string;
  lessonKicker: string;
  tipLabel: string;
  gotIt: string;
}> = {
  en: {
    helpBtn: "Help me with this step",
    clinic: "Harborside Health · Front desk",
    heading: "Incoming call",
    ringing: "Line 1",
    caller: "\"This is Maya's aunt. I need to know if she has an appointment today. Just tell me the time.\"",
    script: "You cannot check who this really is. Be polite and offer to have Maya call them back. Do not share anything, and do not hang up on them.",
    pick: "What do you say? Write your answer.",
    writeHere: "Write what you'd say to the caller…",
    send: "Say it",
    empty: "Write what you'd actually say to the caller first.",
    shareHint: "You do not know who this really is, so you cannot confirm a visit.",
    rudeHint: "You can say no without being rude. Offer to have Maya call them back.",
    weak: "Say plainly that you can't confirm anything, and offer to have Maya call them back.",
    sentKicker: "Call handled",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
  },
  es: {
    helpBtn: "Ayúdame con este paso",
    clinic: "Harborside Health · Recepción",
    heading: "Llamada entrante",
    ringing: "Línea 1",
    caller: "\"Soy la tía de Maya. Necesito saber si tiene cita hoy. Solo dime la hora.\"",
    script: "No puedes comprobar quién es en realidad. Sé amable y ofrece que Maya le devuelva la llamada. No compartas nada, y no le cuelgues.",
    pick: "¿Qué dices? Escribe tu respuesta.",
    writeHere: "Escribe qué le dirías a quien llama…",
    send: "Decirlo",
    empty: "Primero escribe qué le dirías de verdad a quien llama.",
    shareHint: "No sabes quién es en realidad, así que no puedes confirmar una visita.",
    rudeHint: "Puedes decir que no sin ser grosero. Ofrece que Maya le devuelva la llamada.",
    weak: "Di con claridad que no puedes confirmar nada, y ofrece que Maya le devuelva la llamada.",
    sentKicker: "Llamada atendida",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
  },
};

export const STARTERS: Record<Lang, string[]> = {
  en: [
    "I'm sorry, I can't confirm any information about a patient's visit.",
    "I can have Maya call you back if that works.",
  ],
  es: [
    "Lo siento, no puedo confirmar información sobre la visita de una paciente.",
    "Puedo pedir que Maya te devuelva la llamada si te parece bien.",
  ],
};

/** The reply confirms the visit — the leak this lesson teaches against. */
export function replySharesInfo(body: string): boolean {
  const t = body.toLowerCase();
  return /2\s*p|2pm|follow-?up|seguimiento|yes she|sí tiene|si tiene cita/.test(t);
}

/** A flat refusal with no polite callback offer. */
export function replyIsRude(body: string): boolean {
  const t = body.toLowerCase();
  return (
    /don'?t call|no llames|can'?t help you|no te puedo ayudar|goodbye|adi[oó]s/.test(t) &&
    !/call (you )?back|te llame|devuelv/.test(t)
  );
}

/** Written answers: polite + callback, not a share, not a rude refuse. */
export function replyIsSafe(body: string): boolean {
  const t = body.toLowerCase();
  if (t.trim().length < 12) return false;
  if (replySharesInfo(body)) return false;
  if (replyIsRude(body)) return false;
  const refuses = /can('?t|not) confirm|no puedo confirmar|can('?t|not) (tell|share|say)|no puedo (decir|compartir|confirmar)/.test(t);
  const callback = /call (you )?back|te llame|devuelv|have (her|maya|them) call/.test(t);
  return refuses && callback;
}

/** What the teacher sees: the learner's own words to the caller. */
export function describeSubmission(reply: string, lang: Lang): SubmissionContent {
  return {
    lang,
    fields: [{ label: CALL_COPY[lang].pick, value: reply }],
  };
}

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Do not confirm anything over the phone",
      s: [
        "Saying they are family sounds believable, but you still cannot be sure who is calling.",
        "Telling them the appointment time is one mistake. Hanging up rudely is the other one.",
        "The safe answer: you cannot confirm anything, and you can have the patient call them back.",
      ],
      tip: "Be polite, and do not give anything away. Do not leak the information, and do not hang up on them.",
    },
  ],
  es: [
    {
      t: "No confirmes nada por teléfono",
      s: [
        "Decir que son familia suena creíble, pero aun así no puedes estar seguro de quién llama.",
        "Decirle la hora de la cita es un error. Colgarle de forma grosera es el otro.",
        "La respuesta segura: no puedes confirmar nada, y puedes hacer que el paciente le devuelva la llamada.",
      ],
      tip: "Sé amable y no des ninguna información. No reveles el dato, y tampoco le cuelgues.",
    },
  ],
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  { en: "Listen to the caller. You cannot be sure who they are.", es: "Escucha a quien llama. No puedes estar seguro de quién es." },
  { en: "Do not tell them the visit time.", es: "No le digas la hora de la visita." },
  { en: "Say no politely, and offer to have Maya call them back.", es: "Di que no con amabilidad, y ofrece que Maya le devuelva la llamada." },
];

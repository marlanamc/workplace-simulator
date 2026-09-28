import type { Lang, Lesson, Localized, SubmissionContent } from "@/lib/task-types";
import { REFUSES, sharesVisit } from "@/lib/tasks/clinic-privacy";

export const CALL_COPY: Record<Lang, {
  helpBtn: string;
  clinic: string;
  heading: string;
  ringing: string;
  caller: string;
  pick: string;
  writeHere: string;
  send: string;
  empty: string;
  shareHint: string;
  rudeHint: string;
  noCallback: string;
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
    pick: "What do you say? Write your answer.",
    writeHere: "Write what you'd say to the caller…",
    send: "Say it",
    empty: "Write what you'd actually say to the caller first.",
    shareHint: "You do not know who this really is, so you cannot confirm a visit.",
    rudeHint: "You can say no without being rude. Offer to have Maya call them back.",
    noCallback: "Good. You did not share anything. Now offer to have Maya call them back.",
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
    pick: "¿Qué dices? Escribe tu respuesta.",
    writeHere: "Escribe qué le dirías a quien llama…",
    send: "Decirlo",
    empty: "Primero escribe qué le dirías de verdad a quien llama.",
    shareHint: "No sabes quién es en realidad, así que no puedes confirmar una visita.",
    rudeHint: "Puedes decir que no sin ser descortés. Ofrece que Maya le devuelva la llamada.",
    noCallback: "Bien. No compartiste nada. Ahora ofrece que Maya le devuelva la llamada.",
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

/** The reply gives away Maya's visit: its time, its reason, or that it exists. */
export function replySharesInfo(body: string): boolean {
  return sharesVisit(body);
}

/** Says it cannot confirm or share, in beginner English too ("I can not give information"). */
export function replyRefuses(body: string): boolean {
  const t = body.toLowerCase().replace(/[’`]/g, "'");
  return REFUSES.test(t) || /private|privad[oa]|privacy|privacidad/.test(t);
}

/** Offers to have Maya call back: "I can have Maya call you back", "Maya will call you". */
export function replyOffersCallback(body: string): boolean {
  const t = body.toLowerCase().replace(/[’`]/g, "'");
  return /call (you |them |her )?back|call you|(te|le) (va a |puede )?llam|llamar(te|le)|devuelv|have (her|maya|them) call|(maya|she) (will|can) call/.test(t);
}

/** A flat refusal with no polite callback offer. */
export function replyIsRude(body: string): boolean {
  const t = body.toLowerCase();
  return (
    /don'?t call|no llames|can'?t help you|no te puedo ayudar|goodbye|adi[oó]s/.test(t) &&
    !/call (you )?back|te llame|devuelv/.test(t)
  );
}

export type CallVerdict = "empty" | "share" | "rude" | "noCallback" | "weak" | "ok";

/**
 * What the Job Card should say about a reply, in the order it matters: a leak
 * first, then rudeness, then whichever half of the answer is missing.
 */
export function callReplyVerdict(body: string): CallVerdict {
  if (!body.trim()) return "empty";
  if (replySharesInfo(body)) return "share";
  if (replyIsRude(body)) return "rude";
  if (body.trim().length < 12) return "weak";
  const refuses = replyRefuses(body);
  const callback = replyOffersCallback(body);
  if (refuses && callback) return "ok";
  if (refuses) return "noCallback";
  return "weak";
}

/** Written answers: polite + callback, not a share, not a rude refuse. */
export function replyIsSafe(body: string): boolean {
  return callReplyVerdict(body) === "ok";
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
        "Decir que son familia suena creíble, pero aun así no puedes saber con certeza quién llama.",
        "Decirle la hora de la cita es un error. Colgarle de forma grosera es el otro.",
        "La respuesta segura: no puedes confirmar nada, y puedes hacer que el paciente le devuelva la llamada.",
      ],
      tip: "Sé amable y no des ninguna información. No reveles el dato, y tampoco le cuelgues.",
    },
  ],
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
// One step, and it asks the question. What to say (no visit details, a
// callback) is the learner's call; CALL_COPY's corrections name it only after
// a reply misses it, and the Help lesson has it on request.
export const RIGHT_NOW_STEPS: Localized[] = [
  { en: "Answer the caller. You cannot check who they are.", es: "Responde a quien llama. No puedes comprobar quién es." },
];

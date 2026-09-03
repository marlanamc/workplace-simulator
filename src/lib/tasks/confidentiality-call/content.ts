import type { Lang, Lesson, Localized } from "@/lib/task-types";

export type CallChoice = "share" | "rude" | "safe";

export const CALL_CHOICES: { key: CallChoice; label: Localized }[] = [
  {
    key: "share",
    label: {
      en: "Yes, Maya has a 2 PM follow-up.",
      es: "Sí, Maya tiene un seguimiento a las 2 PM.",
    },
  },
  {
    key: "rude",
    label: {
      en: "I can't help you. Don't call again.",
      es: "No te puedo ayudar. No llames otra vez.",
    },
  },
  {
    key: "safe",
    label: {
      en: "I can't confirm that. I can have Maya call you back.",
      es: "No puedo confirmar eso. Puedo pedir que Maya te llame.",
    },
  },
];

export const CALL_COPY: Record<Lang, {
  helpBtn: string;
  clinic: string;
  heading: string;
  ringing: string;
  caller: string;
  script: string;
  pick: string;
  shareHint: string;
  rudeHint: string;
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
    script: "You cannot verify who this is. The graded move is polite, and offers a callback — not a share, and not a hang-up.",
    pick: "What do you say?",
    shareHint: "You cannot confirm a visit to someone you cannot verify.",
    rudeHint: "You can refuse without being rude. Offer to have Maya call them back.",
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
    script: "No puedes verificar quién es. El paso correcto es amable y ofrece una devolución — no compartir, y no colgar.",
    pick: "¿Qué dices?",
    shareHint: "No puedes confirmar una visita a alguien que no puedes verificar.",
    rudeHint: "Puedes rechazar sin ser grosero. Ofrece que Maya les devuelva la llamada.",
    sentKicker: "Llamada atendida",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
  },
};

/** Written answers: polite + callback, not a share, not a rude refuse. */
export function replyIsSafe(body: string): boolean {
  const t = body.toLowerCase();
  if (t.trim().length < 12) return false;
  const shares = /2\s*p|2pm|follow-?up|seguimiento|yes she|sí tiene|si tiene cita/.test(t);
  if (shares) return false;
  const rude = /don'?t call|no llames|can'?t help you|no te puedo ayudar|goodbye|adi[oó]s/.test(t) && !/call (you )?back|te llame|devuelv/.test(t);
  if (rude) return false;
  const refuses = /can('?t|not) confirm|no puedo confirmar|can('?t|not) (tell|share|say)|no puedo (decir|compartir|confirmar)/.test(t);
  const callback = /call (you )?back|te llame|devuelv|have (her|maya|them) call/.test(t);
  return refuses && callback;
}

export function choiceIsSafe(key: CallChoice): boolean {
  return key === "safe";
}

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Do not confirm over the phone",
      s: [
        "Family is a plausible story. You still cannot verify the caller.",
        "Sharing the time is the miss. Hanging up rude is the other miss.",
        "The safe line: you cannot confirm, and you can have the patient call them.",
      ],
      tip: "Polite and closed is the job. Not a leak, and not a slam.",
    },
  ],
  es: [
    {
      t: "No confirmes por teléfono",
      s: [
        "Familia es una historia creíble. Aun así no puedes verificar quién llama.",
        "Compartir la hora es el error. Colgar grosero es el otro.",
        "La línea segura: no puedes confirmar, y puedes pedir que el paciente les llame.",
      ],
      tip: "Amable y cerrado es el trabajo. Ni una filtración, ni un portazo.",
    },
  ],
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  { en: "Hear the caller. You cannot verify them.", es: "Escucha a quien llama. No puedes verificarlo." },
  { en: "Do not share the visit time.", es: "No compartas la hora de la visita." },
  { en: "Refuse politely and offer a callback.", es: "Rechaza con amabilidad y ofrece una devolución." },
];

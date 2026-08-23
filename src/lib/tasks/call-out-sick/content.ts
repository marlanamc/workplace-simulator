import type { ConfidenceOption, EventIntroCopy, Lang } from "@/lib/task-types";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "🤒",
    kicker: "Job 6 of 9",
    headline: "You're sick tomorrow. Tell Maria.",
    body: "You woke up sick and you're on the schedule tomorrow morning. Message Maria before your shift - not after it starts.",
    cta: "Write to Maria",
  },
  es: {
    emoji: "🤒",
    kicker: "Trabajo 6 de 9",
    headline: "Mañana estás enfermo. Avísale a Maria.",
    body: "Te despertaste enfermo y mañana en la mañana tienes turno. Escríbele a Maria antes de tu turno, no después de que empiece.",
    cta: "Escribirle a Maria",
  },
};

export const CALL_OUT_COPY: Record<Lang, {
  heading: string;
  subhead: string;
  helpBtn: string;
  to: string;
  subjectLabel: string;
  subject: string;
  writeHere: string;
  startersLabel: string;
  send: string;
  sentKicker: string;
  doneBody: string;
  badgeName: string;
  badgeWhere: string;
  confidenceQ: string;
  tryAgain: string;
  backToDesk: string;
}> = {
  en: {
    heading: "Message Maria",
    subhead: "Tell her you can't come in tomorrow, and why - short and clear.",
    helpBtn: "Help me with this step",
    to: "To",
    subjectLabel: "Subject",
    subject: "Can't come in tomorrow",
    writeHere: "Write your message here…",
    startersLabel: "Sentence starters",
    send: "Send",
    sentKicker: "Message sent",
    doneBody: "Maria has time to find coverage now instead of finding out when your shift starts. That's the whole point of calling out early.",
    badgeName: "Call out sick, in writing",
    badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    confidenceQ: "How do you feel about doing this at work tomorrow?",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
  },
  es: {
    heading: "Escríbele a Maria",
    subhead: "Dile que no puedes ir mañana, y por qué - corto y claro.",
    helpBtn: "Ayúdame con este paso",
    to: "Para",
    subjectLabel: "Asunto",
    subject: "No puedo ir mañana",
    writeHere: "Escribe tu mensaje aquí…",
    startersLabel: "Frases de ayuda",
    send: "Enviar",
    sentKicker: "Mensaje enviado",
    doneBody: "Maria ahora tiene tiempo de buscar quién te cubra, en vez de enterarse cuando empiece tu turno. Ese es el punto de avisar temprano.",
    badgeName: "Avisar que estás enfermo, por escrito",
    badgeWhere: "Cuenta para: Oficina · Servicio de alimentos",
    confidenceQ: "¿Cómo te sientes de hacer esto mañana en el trabajo?",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
  },
};

export const STARTERS: Record<Lang, string[]> = {
  en: ["Hi Maria, I'm sick and won't be able to come in tomorrow.", "I'm sorry for the short notice.", "I can work my next shift as scheduled.", "Let me know if you need anything from me."],
  es: ["Hola Maria, estoy enfermo y no podré ir mañana.", "Perdón por avisar con tan poco tiempo.", "Puedo trabajar mi siguiente turno como estaba planeado.", "Avísame si necesitas algo de mí."],
};

export const CONFIDENCE_OPTIONS: Record<Lang, ConfidenceOption[]> = {
  en: [
    { label: "Still unsure", reply: "That's honest. Do the task one more time, or come on Wednesday and we can do it together." },
    { label: "I could try", reply: "Good. Try it again without Help. That is how it will feel at work." },
    { label: "I can do this", reply: "You just did it with no help. Use the Next button below to keep going." },
  ],
  es: [
    { label: "Todavía dudo", reply: "Eso es honesto. Hazlo otra vez, o ven el miércoles y lo hacemos juntos." },
    { label: "Podría intentarlo", reply: "Bien. Inténtalo otra vez sin Ayuda. Así se siente en el trabajo." },
    { label: "Puedo hacerlo", reply: "Lo hiciste sin ayuda. Usa el botón de Siguiente abajo para seguir." },
  ],
};

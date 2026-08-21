import type { ConfidenceOption, Lang, Lesson } from "@/lib/task-types";

export const MEETING = {
  title: "Weekly Lead Huddle",
  organizer: "Maria Delgado · Cafe Manager",
  day: "Wed",
  date: "Aug 26",
  time: "9:00 AM – 9:30 AM",
  description: "Quick weekly check-in with the shift leads — inventory counts, any callouts, anything coming up.",
};

export const CALENDAR_COPY: Record<Lang, {
  heading: string;
  helpBtn: string;
  langBtn: string;
  create: string;
  monthLabel: string;
  viewDay: string;
  viewWeek: string;
  viewMonth: string;
  weekdayLabels: string[];
  invitedBy: string;
  scheduleNote: string;
  accept: string;
  proposeTime: string;
  to: string;
  subjectLabel: string;
  subject: string;
  writeHere: string;
  startersLabel: string;
  send: string;
  discard: string;
  sentKicker: string;
  doneTitle: string;
  doneBody: string;
  badgeName: string;
  badgeWhere: string;
  confidenceQ: string;
  tryAgain: string;
  backToDesk: string;
  lessonKicker: string;
  tipLabel: string;
  gotIt: string;
  askPerson: string;
}> = {
  en: {
    heading: "Calendar",
    helpBtn: "Help me with this step",
    langBtn: "Español",
    create: "Create",
    monthLabel: "August 2026",
    viewDay: "Day",
    viewWeek: "Week",
    viewMonth: "Month",
    weekdayLabels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    invitedBy: "Invited by",
    scheduleNote: "You're not scheduled to work this day.",
    accept: "Accept",
    proposeTime: "Propose a different time",
    to: "To",
    subjectLabel: "Subject",
    subject: "Re: Weekly Lead Huddle — different time?",
    writeHere: "Write your message here…",
    startersLabel: "Sentence starters",
    send: "Send",
    discard: "Discard",
    sentKicker: "Message sent",
    doneTitle: "You caught a scheduling conflict before it became a problem.",
    doneBody: "Maria got your note about the huddle landing on your day off. Checking your calendar against your schedule, every time, is what keeps this from turning into a surprise trip in on a day you didn't plan for.",
    badgeName: "Handle a meeting invite the right way",
    badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    confidenceQ: "How do you feel about handling a meeting invite that conflicts with your schedule?",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it — back to my task",
    askPerson: "Ask a person instead",
  },
  es: {
    heading: "Calendario",
    helpBtn: "Ayúdame con este paso",
    langBtn: "English",
    create: "Crear",
    monthLabel: "Agosto de 2026",
    viewDay: "Día",
    viewWeek: "Semana",
    viewMonth: "Mes",
    weekdayLabels: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
    invitedBy: "Invitado por",
    scheduleNote: "No estás programado para trabajar ese día.",
    accept: "Aceptar",
    proposeTime: "Proponer otro horario",
    to: "Para",
    subjectLabel: "Asunto",
    subject: "Re: Reunión semanal de líderes — ¿otro horario?",
    writeHere: "Escribe tu mensaje aquí…",
    startersLabel: "Frases de ayuda",
    send: "Enviar",
    discard: "Descartar",
    sentKicker: "Mensaje enviado",
    doneTitle: "Detectaste un conflicto de horario antes de que fuera un problema.",
    doneBody: "Maria recibió tu nota sobre la reunión en tu día libre. Revisar tu calendario contra tu horario, siempre, es lo que evita que esto se convierta en una sorpresa un día que no planeabas venir.",
    badgeName: "Manejar una invitación a una reunión correctamente",
    badgeWhere: "Cuenta para: Oficina · Servicio de alimentos",
    confidenceQ: "¿Cómo te sientes de manejar una invitación que choca con tu horario?",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido — volver a mi tarea",
    askPerson: "Mejor preguntar a una persona",
  },
};

export const WRONG_ACCEPT_HINT: Record<Lang, string> = {
  en: "Check your schedule first — you're not working that day. Propose a different time instead of just accepting.",
  es: "Revisa tu horario primero — no trabajas ese día. Propón otro horario en vez de solo aceptar.",
};

export const STARTERS: Record<Lang, string[]> = {
  en: [
    "Hi Maria, I'm not scheduled to work Wednesday.",
    "Could we move the huddle to a day I'm already in?",
    "I'm happy to call in instead, if that works better.",
    "Let me know what works — thank you.",
  ],
  es: [
    "Hola Maria, no estoy programado para trabajar el miércoles.",
    "¿Podríamos mover la reunión a un día que ya trabaje?",
    "Con gusto puedo llamar en vez de eso, si funciona mejor.",
    "Avísame qué funciona — gracias.",
  ],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Reading a meeting invite",
      s: [
        "Look at the day and time, not just who it's from.",
        "Check that day against your actual schedule.",
        "A meeting on a day you're not working is worth flagging, not just accepting.",
      ],
      tip: "This is the same move as checking a shift for a conflict — same skill, new tool.",
    },
    {
      t: "Proposing a different time",
      s: [
        "Say plainly that the time doesn't work and why.",
        "Suggest what would work instead, if you can.",
        "Keep it short — one or two sentences is plenty.",
      ],
      tip: "You don't need to solve it yourself — flagging it clearly is enough.",
    },
  ],
  es: [
    {
      t: "Leer una invitación a una reunión",
      s: [
        "Mira el día y la hora, no solo quién la envía.",
        "Compara ese día con tu horario real.",
        "Una reunión en un día que no trabajas vale la pena señalarla, no solo aceptarla.",
      ],
      tip: "Es el mismo movimiento que revisar un turno por un conflicto — misma habilidad, nueva herramienta.",
    },
    {
      t: "Proponer otro horario",
      s: [
        "Di claramente que ese horario no funciona y por qué.",
        "Sugiere qué funcionaría en su lugar, si puedes.",
        "Manténlo corto — una o dos oraciones es suficiente.",
      ],
      tip: "No tienes que resolverlo tú mismo — señalarlo claramente es suficiente.",
    },
  ],
};

export const CONFIDENCE_OPTIONS: Record<Lang, ConfidenceOption[]> = {
  en: [
    { label: "Still unsure", reply: "That's honest — do the task once more, or bring it to Wednesday drop-in and we'll do it together." },
    { label: "I could try", reply: "Good. Try it again without guided mode — that's how it will feel at work." },
    { label: "I can do this", reply: "You just did it with no help. Move on to the next task on your desktop." },
  ],
  es: [
    { label: "Todavía dudo", reply: "Eso es honesto — hazlo otra vez, o ven el miércoles y lo hacemos juntos." },
    { label: "Podría intentarlo", reply: "Bien. Inténtalo otra vez sin el modo guiado — así se siente en el trabajo." },
    { label: "Puedo hacerlo", reply: "Lo hiciste sin ayuda. Sigue con la siguiente tarea en tu escritorio." },
  ],
};

import type { Lang, Lesson, Localized } from "@/lib/task-types";

/**
 * Level 24 — Run the Meeting. The Team Lead promotion.
 *
 * Three parts, one after another: write a short agenda, jot 2-3 notes while a
 * scripted huddle plays out, then send a follow-up email that says who owes
 * what by when. The follow-up is the real point — a meeting with no clear
 * "who does what" afterward just drifts.
 *
 * Teacher-check: the app confirms each part is filled in, never judges the
 * wording. A lenient pass beats a false reject.
 */

export const MEETING_COPY: Record<Lang, {
  appName: string;
  helpBtn: string;
  hubHeading: string;
  agendaTitle: string;
  agendaBody: string;
  agendaCta: string;
  notesTitle: string;
  notesBody: string;
  notesCta: string;
  followupTitle: string;
  followupBody: string;
  followupCta: string;
  agendaLabel: string;
  agendaPlaceholder: string;
  agendaSave: string;
  meetingKicker: string;
  meetingWho: string;
  nextLine: string;
  meetingDone: string;
  notesLabel: string;
  notesPlaceholder: string;
  notesSave: string;
  followupTo: string;
  followupSubject: string;
  followupLabel: string;
  followupPlaceholder: string;
  send: string;
  needAgenda: string;
  needNotes: string;
  needFollowup: string;
  sentKicker: string;
  tryAgain: string;
  backToDesk: string;
  lessonKicker: string;
  tipLabel: string;
  gotIt: string;
}> = {
  en: {
    appName: "Meeting",
    helpBtn: "Help me with this step",
    hubHeading: "Run the meeting",
    agendaTitle: "Write the agenda",
    agendaBody: "Two or three points the huddle needs to cover. Not a speech.",
    agendaCta: "Write it",
    notesTitle: "Take notes in the meeting",
    notesBody: "Jot what gets decided. A few lines, not every word.",
    notesCta: "Start the meeting",
    followupTitle: "Send the follow-up",
    followupBody: "List each action, who owns it, and by when.",
    followupCta: "Write the email",
    agendaLabel: "Agenda — Monday huddle",
    agendaPlaceholder: "Type two or three points, one per line…",
    agendaSave: "Save the agenda",
    meetingKicker: "The huddle",
    meetingWho: "You, Alex, Jordan, Riley",
    nextLine: "Next",
    meetingDone: "That's the huddle. Write your notes.",
    notesLabel: "My notes",
    notesPlaceholder: "What got decided? A few short lines…",
    notesSave: "Save my notes",
    followupTo: "To: Alex, Jordan, Riley",
    followupSubject: "Subject: Monday huddle — what we decided",
    followupLabel: "Your message",
    followupPlaceholder: "One line per action: what, who, by when…",
    send: "Send",
    needAgenda: "Write at least two points, one per line.",
    needNotes: "Write a couple of lines on what got decided.",
    needFollowup: "List each action with a name and a day. One line each.",
    sentKicker: "Follow-up sent",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
  },
  es: {
    appName: "Reunión",
    helpBtn: "Ayúdame con este paso",
    hubHeading: "Dirige la reunión",
    agendaTitle: "Escribe la agenda",
    agendaBody: "Dos o tres puntos que la reunión necesita cubrir. No un discurso.",
    agendaCta: "Escribirla",
    notesTitle: "Toma notas en la reunión",
    notesBody: "Anota lo que se decide. Unas líneas, no cada palabra.",
    notesCta: "Empezar la reunión",
    followupTitle: "Envía el seguimiento",
    followupBody: "Anota cada tarea, quién la hace y para cuándo.",
    followupCta: "Escribir el correo",
    agendaLabel: "Agenda — reunión del lunes",
    agendaPlaceholder: "Escribe dos o tres puntos, uno por línea…",
    agendaSave: "Guardar la agenda",
    meetingKicker: "La reunión",
    meetingWho: "Tú, Alex, Jordan, Riley",
    nextLine: "Siguiente",
    meetingDone: "Esa fue la reunión. Escribe tus notas.",
    notesLabel: "Mis notas",
    notesPlaceholder: "¿Qué se decidió? Unas líneas cortas…",
    notesSave: "Guardar mis notas",
    followupTo: "Para: Alex, Jordan, Riley",
    followupSubject: "Asunto: Reunión del lunes — lo que decidimos",
    followupLabel: "Tu mensaje",
    followupPlaceholder: "Una línea por tarea: qué, quién, para cuándo…",
    send: "Enviar",
    needAgenda: "Escribe al menos dos puntos, uno por línea.",
    needNotes: "Escribe un par de líneas sobre lo que se decidió.",
    needFollowup: "Anota cada tarea con un nombre y un día. Una línea cada una.",
    sentKicker: "Seguimiento enviado",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
  },
};

/** The scripted huddle. Revealed one line at a time; the learner notes what matters. */
export const MEETING_SCRIPT: Record<Lang, string[]> = {
  en: [
    "You: Thanks for coming. Three things this week.",
    "You: First, Saturday close still has no one on it.",
    "Jordan: I can take Saturday close.",
    "You: Thanks, Jordan. Second, the supply order is late.",
    "Alex: I'll call the supplier this morning and get a date.",
    "You: Good. Last, the new hire starts Thursday.",
    "Riley: I'll do the Thursday morning training.",
    "You: That covers it. I'll send a summary.",
  ],
  es: [
    "Tú: Gracias por venir. Tres cosas esta semana.",
    "Tú: Primero, el cierre del sábado sigue sin nadie.",
    "Jordan: Yo puedo tomar el cierre del sábado.",
    "Tú: Gracias, Jordan. Segundo, el pedido de insumos está atrasado.",
    "Alex: Yo llamo al proveedor esta mañana y consigo una fecha.",
    "Tú: Bien. Por último, la persona nueva empieza el jueves.",
    "Riley: Yo hago la capacitación del jueves por la mañana.",
    "Tú: Con eso está. Voy a enviar un resumen.",
  ],
};

export const AGENDA_STARTERS: Record<Lang, string[]> = {
  en: ["Saturday close — who covers it", "Late supply order — next step", "New hire starts Thursday — training"],
  es: ["Cierre del sábado — quién lo cubre", "Pedido de insumos atrasado — siguiente paso", "Persona nueva empieza el jueves — capacitación"],
};

export const NOTE_STARTERS: Record<Lang, string[]> = {
  en: ["Jordan takes Saturday close.", "Alex calls the supplier this morning.", "Riley trains the new hire Thursday morning."],
  es: ["Jordan toma el cierre del sábado.", "Alex llama al proveedor esta mañana.", "Riley capacita a la persona nueva el jueves por la mañana."],
};

export const FOLLOWUP_STARTERS: Record<Lang, string[]> = {
  en: [
    "Saturday close: Jordan, this Saturday.",
    "Supplier call: Alex, by end of day Monday.",
    "New hire training: Riley, Thursday morning.",
  ],
  es: [
    "Cierre del sábado: Jordan, este sábado.",
    "Llamada al proveedor: Alex, antes de que termine el lunes.",
    "Capacitación de la persona nueva: Riley, el jueves por la mañana.",
  ],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "A meeting needs a start, a middle, and a follow-up",
      s: [
        "The agenda is two or three points, written before the meeting. It keeps the huddle short.",
        "During the meeting, note what gets decided — not every word, just the decisions and who agreed to what.",
        "The follow-up email is the part people skip. List each action, the person who owns it, and the day it's due.",
      ],
      tip: "If your follow-up email doesn't say a name and a day for each item, the meeting will drift. That one email is the whole point of this lesson.",
    },
  ],
  es: [
    {
      t: "Una reunión necesita un inicio, un medio y un seguimiento",
      s: [
        "La agenda son dos o tres puntos, escritos antes de la reunión. Mantiene la reunión corta.",
        "Durante la reunión, anota lo que se decide — no cada palabra, solo las decisiones y quién aceptó qué.",
        "El correo de seguimiento es la parte que la gente se salta. Anota cada tarea, la persona que la hace y el día en que se entrega.",
      ],
      tip: "Si tu correo de seguimiento no dice un nombre y un día para cada punto, la reunión se va a diluir. Ese correo es todo el sentido de esta lección.",
    },
  ],
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  { en: "Three parts: agenda, notes, follow-up.", es: "Tres partes: agenda, notas, seguimiento." },
  { en: "Write a short agenda for the meeting.", es: "Escribe una agenda corta para la reunión." },
  { en: "The meeting is starting. Note what gets decided.", es: "La reunión está empezando. Anota lo que se decide." },
  { en: "Send a follow-up. Name who owns each action, and when.", es: "Envía un seguimiento. Di quién hace cada tarea, y cuándo." },
];

/** Count of non-empty lines that read as agenda points. */
export function bulletCount(text: string): number {
  return text
    .split("\n")
    .map((l) => l.replace(/^[\s*\-•·]+/, "").trim())
    .filter(Boolean).length;
}

export function agendaLooksReady(text: string): boolean {
  return bulletCount(text) >= 2;
}

/** ≥2 non-empty lines, or one substantial line. Deliberately loose. */
export function notesLookReal(text: string): boolean {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length >= 2) return true;
  return (lines[0]?.split(/\s+/).filter(Boolean).length ?? 0) >= 8;
}

const OWNER =
  /\b(alex|jordan|riley|sam|casey|maria|i\b|i'?ll|me\b|yo\b|[A-Z][a-z]{2,})\b/;
const WHEN =
  /\b(mon|tue|wed|thu|fri|sat|sun|monday|tuesday|wednesday|thursday|friday|saturday|sunday|today|tomorrow|by |end of day|eod|this week|next week|lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bado|domingo|hoy|ma[ñn]ana|antes del|antes de que|para el|esta semana|\d{1,2}\/\d{1,2}|\d{1,2}\s?(am|pm))\b/i;

/**
 * The follow-up should read as a structured list: each line an action with a
 * person and a time. We check for both signals, with a "long enough and has a
 * colon or dash" fallback so a real list phrased in words we didn't predict
 * still passes.
 */
export function followupHasOwnersAndDates(text: string): boolean {
  const t = text.trim();
  const words = t.split(/\s+/).filter(Boolean).length;
  if (words < 8) return false;
  if (OWNER.test(t) && WHEN.test(t)) return true;
  return words >= 20 && /[:\-–—]/.test(t);
}

export interface MeetingMinutesInput {
  agenda: string;
  notes: string;
  followup: string;
}

export function meetingMinutesPasses(input: MeetingMinutesInput): boolean {
  return (
    agendaLooksReady(input.agenda) &&
    notesLookReal(input.notes) &&
    followupHasOwnersAndDates(input.followup)
  );
}

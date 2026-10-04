import { looksLikeRealText, normalizeReply, wordCount } from "@/lib/grading/meaning";
import type { Lang, Lesson, Localized, SubmissionContent } from "@/lib/task-types";

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
  followupToValue: string;
  followupSubjectValue: string;
  toLabel: string;
  subjectLabel: string;
  followupLabel: string;
  followupPlaceholder: string;
  send: string;
  backHub: string;
  transcriptLabel: string;
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
    followupBody: "The crew should leave knowing what they agreed to do.",
    followupCta: "Write the email",
    agendaLabel: "Agenda: Monday huddle",
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
    followupSubject: "Subject: Monday huddle, what we decided",
    followupToValue: "Alex, Jordan, Riley",
    followupSubjectValue: "Monday huddle: what we decided",
    toLabel: "To",
    subjectLabel: "Subject",
    followupLabel: "Your message",
    followupPlaceholder: "One line per action: what, who, by when…",
    send: "Send",
    backHub: "Back to the meeting",
    transcriptLabel: "Huddle transcript",
    needAgenda: "Write at least two points, one per line.",
    needNotes: "Write a couple of lines on what got decided.",
    needFollowup: "Check the transcript’s final decisions. In the action list, select the final owner and day for every action.",
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
    followupBody: "El equipo debe saber qué acordó hacer.",
    followupCta: "Escribir el correo",
    agendaLabel: "Agenda: reunión del lunes",
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
    followupSubject: "Asunto: Reunión del lunes, lo que decidimos",
    followupToValue: "Alex, Jordan, Riley",
    followupSubjectValue: "Reunión del lunes: lo que decidimos",
    toLabel: "Para",
    subjectLabel: "Asunto",
    followupLabel: "Tu mensaje",
    followupPlaceholder: "Una línea por tarea: qué, quién, para cuándo…",
    send: "Enviar",
    backHub: "Volver a la reunión",
    transcriptLabel: "Transcripción de la reunión",
    needAgenda: "Escribe al menos dos puntos, uno por línea.",
    needNotes: "Escribe un par de líneas sobre lo que se decidió.",
    needFollowup: "Revisa las decisiones finales en la transcripción. En la lista de acciones, elige el responsable y el día finales de cada tarea.",
    sentKicker: "Seguimiento enviado",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
  },
};

/** The people in the room, for the Meet-style participant strip. */
export const ATTENDEES: { name: string; initials: string; color: string }[] = [
  { name: "Alex", initials: "A", color: "#1a73e8" },
  { name: "Jordan", initials: "J", color: "#e8710a" },
  { name: "Riley", initials: "R", color: "#188038" },
];

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
    "Riley: Correction. I am away Thursday. Alex will handle the training Friday morning instead.",
    "Alex: Confirmed. I will train the new hire Friday morning.",
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
    "Riley: Corrección. No estaré el jueves. Alex hará la capacitación el viernes por la mañana.",
    "Alex: Confirmado. Capacitaré a la persona nueva el viernes por la mañana.",
    "Tú: Con eso está. Voy a enviar un resumen.",
  ],
};

export const AGENDA_STARTERS: Record<Lang, string[]> = {
  en: ["Saturday close: who covers it", "Late supply order: next step", "New hire starts Thursday: training"],
  es: ["Cierre del sábado: quién lo cubre", "Pedido de insumos atrasado: siguiente paso", "Persona nueva empieza el jueves: capacitación"],
};

export const NOTE_STARTERS: Record<Lang, string[]> = {
  en: ["Jordan takes Saturday close.", "Alex calls the supplier this morning.", "Training owner and day changed. Check the final decision."],
  es: ["Jordan toma el cierre del sábado.", "Alex llama al proveedor esta mañana.", "Cambió el responsable y el día de capacitación. Revisa la decisión final."],
};

export const FOLLOWUP_STARTERS: Record<Lang, string[]> = {
  en: [
    "Saturday close: Jordan, this Saturday.",
    "Supplier call: Alex, by end of day Monday.",
    "Here are the final assignments from our huddle.",
  ],
  es: [
    "Cierre del sábado: Jordan, este sábado.",
    "Llamada al proveedor: Alex, antes de que termine el lunes.",
    "Estas son las asignaciones finales de nuestra reunión.",
  ],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "A meeting needs a start, a middle, and a follow-up",
      s: [
        "The agenda is two or three points, written before the meeting. It keeps the huddle short.",
        "During the meeting, note what gets decided, not every word, just the decisions and who agreed to what.",
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
        "Durante la reunión, anota lo que se decide, no cada palabra, solo las decisiones y quién aceptó qué.",
        "El correo de seguimiento es la parte que la gente se salta. Anota cada tarea, la persona que la hace y el día en que se entrega.",
      ],
      tip: "Si tu correo de seguimiento no dice un nombre y un día para cada punto, la reunión se va a diluir. Ese correo es todo el sentido de esta lección.",
    },
  ],
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  { en: "Write an agenda, take meeting notes, and send a follow-up.", es: "Escribe los puntos para tratar, toma notas de la reunión y envía un correo de seguimiento." },
  { en: "Write at least two agenda items, one per line. Save the agenda.", es: "Escribe al menos dos puntos para tratar, uno por línea. Guarda la agenda." },
  { en: "Read the meeting transcript. Write notes about the decisions. Save your notes.", es: "Lee la transcripción de la reunión. Escribe notas sobre las decisiones. Guarda tus notas." },
  { en: "Select the final person responsible and day for each action. Write a follow-up with the actions, people, and dates. Then click Send.", es: "Selecciona el responsable y el día finales de cada acción. Escribe un correo de seguimiento con las acciones, las personas y las fechas. Después haz clic en Enviar." },
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

/** Something from the huddle: a person, a day, or one of the three topics. */
const HUDDLE_FACT =
  /\b(alex|jordan|riley|saturday|sat|friday|fri|thursday|thu|monday|mon|close|closing|supplier|supply|suply|order|call|train\w*|new hire|new person|sabado|viernes|jueves|lunes|cierre|proveedor|insumos|pedido|llam\w*|capacit\w*|persona nueva)\b/;

/**
 * ≥2 lines, or one substantial line, and about the huddle. "ok / ok" is not
 * notes; "jordan sat close / alex call supplier" is. Spelling is never judged.
 */
export function notesLookReal(text: string): boolean {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const enough = lines.length >= 2 || wordCount(lines[0] ?? "") >= 8;
  return enough && looksLikeRealText(text, 3) && HUDDLE_FACT.test(normalizeReply(text));
}

/** A person who owns an action. Only names from the huddle, or "I". */
const OWNER = /\b(alex|jordan|riley|sam|casey)\b/;
const WHEN =
  /\b(mon|tue|wed|thu|fri|sat|sun|monday|tuesday|wednesday|thursday|friday|saturday|sunday|today|tomorrow|by|end of day|eod|this week|next week|lunes|martes|miercoles|jueves|viernes|sabado|domingo|hoy|manana|antes del|antes de que|para el|esta semana)\b|\b\d{1,2}\/\d{1,2}\b|\b\d{1,2}\s?(am|pm)\b/;

/** Why the follow-up email is not sent yet, or "ok". */
export type FollowupVerdict = "ok" | "empty" | "no-owner" | "no-date";

/**
 * The follow-up is the point of the task: it says who owes what by when.
 * An empty email, or one with no name or no day in it, is not a follow-up,
 * whatever the action list below it says.
 */
export function followupVerdict(text: string): FollowupVerdict {
  const t = normalizeReply(text);
  if (!looksLikeRealText(t, 3)) return "empty";
  if (!OWNER.test(t)) return "no-owner";
  if (!WHEN.test(t)) return "no-date";
  return "ok";
}

export function followupHasOwnersAndDates(text: string): boolean {
  return followupVerdict(text) === "ok";
}

/** The Job Card's correction for each follow-up verdict. */
export const FOLLOWUP_CORRECTIONS: Record<Exclude<FollowupVerdict, "ok">, Localized> = {
  empty: {
    en: "Write the follow-up email. One line for each job: who does it, and what day.",
    es: "Escribe el correo de seguimiento. Una línea por tarea: quién la hace y qué día.",
  },
  "no-owner": {
    en: "Say who does each job. Use their names.",
    es: "Di quién hace cada tarea. Usa sus nombres.",
  },
  "no-date": {
    en: "Say when each job is due. Add a day.",
    es: "Di para cuándo es cada tarea. Agrega un día.",
  },
};

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

/** What the teacher sees for this submission. */
export function describeSubmission(input: MeetingMinutesInput, lang: Lang): SubmissionContent {
  const c = MEETING_COPY[lang];
  return {
    lang,
    fields: [
      { label: c.agendaLabel, value: input.agenda },
      { label: c.notesLabel, value: input.notes },
      { label: `${c.followupLabel}: ${c.followupSubjectValue}`, value: input.followup },
    ],
  };
}

export const ACTION_ITEMS = [
 { key: 'close', label: { en: 'Saturday close', es: 'Cierre del sábado' }, owner: 'Jordan', day: 'sat' },
 { key: 'supplier', label: { en: 'Supplier call', es: 'Llamada al proveedor' }, owner: 'Alex', day: 'mon' },
 { key: 'training', label: { en: 'New hire training', es: 'Capacitación de la persona nueva' }, owner: 'Alex', day: 'fri' },
];
export const ACTION_DAYS = [
 { key: 'mon', label: { en: 'Monday', es: 'Lunes' } },
 { key: 'thu', label: { en: 'Thursday', es: 'Jueves' } },
 { key: 'fri', label: { en: 'Friday', es: 'Viernes' } },
 { key: 'sat', label: { en: 'Saturday', es: 'Sábado' } },
];
export type ActionCommitments = Record<string, { owner: string; day: string }>;
export function commitmentsMatchHuddle(values: ActionCommitments): boolean {
  return ACTION_ITEMS.every((item) => values[item.key]?.owner === item.owner && values[item.key]?.day === item.day);
}
/**
 * Once the learner has started the action list, the Job Card's correction
 * names the first action whose owner or day is off. Null before that (the
 * general instruction covers it) and when every action matches.
 */
export function commitmentCorrection(values: ActionCommitments, lang: Lang): string | null {
  if (!Object.values(values).some((v) => v?.owner || v?.day)) return null;
  const item = ACTION_ITEMS.find((i) => values[i.key]?.owner !== i.owner || values[i.key]?.day !== i.day);
  if (!item) return null;
  return lang === "en"
    ? `Check "${item.label.en}" in the action list: who does it, and what day? Use the final decision in the transcript.`
    : `Revisa "${item.label.es}" en la lista de acciones: ¿quién la hace y qué día? Usa la decisión final de la transcripción.`;
}
export function formatCommitments(values: ActionCommitments, lang: Lang): string {
 return ACTION_ITEMS.map((item) => `${item.label[lang]}: ${values[item.key]?.owner ?? ''}, ${ACTION_DAYS.find((d) => d.key === values[item.key]?.day)?.label[lang] ?? ''}`).join('\n');
}

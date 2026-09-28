import type { Lang, Lesson, Localized, SubmissionContent } from "@/lib/task-types";
import { REFUSES, sharesVisit } from "@/lib/tasks/clinic-privacy";
import { normalizeReply } from "@/lib/grading/meaning";

export const PATIENT = { name: "Maya Ansari", dob: "03/12/1998", reason: { en: "Follow-up", es: "Seguimiento" } };

export const INTAKE_COPY: Record<Lang, {
  helpBtn: string;
  clinic: string;
  heading: string;
  nameLabel: string;
  dobLabel: string;
  reasonLabel: string;
  file: string;
  needFields: string;
  coworkerAsk: string;
  careTeamAsk: string;
  coworkerName: string;
  careTeamName: string;
  writeHere: string;
  send: string;
  empty: string;
  weak: string;
  shared: string;
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
    heading: "New patient intake",
    nameLabel: "Full name",
    dobLabel: "Date of birth",
    reasonLabel: "Reason for visit",
    file: "File intake",
    needFields: "Fill name, date of birth, and reason first.",
    coworkerAsk: "Hey, can I peek at that form? I just want to see why she's here.",
    careTeamAsk: "May I collect Maya’s chart when it is ready?",
    coworkerName: "Tomás Ortiz · kitchen (not care team)",
    careTeamName: "Nurse Elena · care team",
    writeHere: "Reply to Tomás…",
    send: "Send reply",
    empty: "Write a short reply to Tomás first.",
    weak: "Say no, and that the form is only for the care team. Do not tell Tomás why she is here.",
    shared: "Do not tell Tomás the reason for the visit. Just say you cannot share it.",
    sentKicker: "Intake filed",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
  },
  es: {
    helpBtn: "Ayúdame con este paso",
    clinic: "Harborside Health · Recepción",
    heading: "Ingreso de paciente nuevo",
    nameLabel: "Nombre completo",
    dobLabel: "Fecha de nacimiento",
    reasonLabel: "Motivo de la visita",
    file: "Archivar ingreso",
    needFields: "Llena nombre, fecha de nacimiento y motivo primero.",
    coworkerAsk: "Oye, ¿puedo ver ese formulario? Solo quiero saber por qué está aquí.",
    careTeamAsk: "¿Puedo recoger el expediente de Maya cuando esté listo?",
    coworkerName: "Tomás Ortiz · cocina (no es equipo de cuidado)",
    careTeamName: "Enfermera Elena · equipo de cuidado",
    writeHere: "Responde a Tomás…",
    send: "Enviar respuesta",
    empty: "Primero escribe una respuesta corta a Tomás.",
    weak: "Di que no, y que el formulario es solo para el equipo de cuidado. No le digas a Tomás por qué está aquí.",
    shared: "No le digas a Tomás el motivo de la visita. Solo dile que no lo puedes compartir.",
    sentKicker: "Ingreso archivado",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
  },
};

export const STARTERS: Record<Lang, string[]> = {
  en: [
    "I can't share that. It stays with the care team.",
    "Sorry Tomás,\nI'm not allowed to show patient forms.",
  ],
  es: [
    "No puedo compartirlo. Se queda con el equipo de cuidado.",
    "Perdón Tomás,\nNo puedo mostrar formularios de pacientes.",
  ],
};

/** The box on the intake form that does not match Maya's paper form, or "ok". */
export type IntakeFormVerdict = "ok" | "missing" | "name" | "dob" | "reason";

const MONTH_NAMES = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

/** 03/12/1998 as typed: 3/12/1998, 03-12-98, March 12, 1998, 12 de marzo de 1998. */
export function dobMatches(typed: string, expected = PATIENT.dob): boolean {
  const [m, d, y] = expected.split("/").map(Number);
  const t = normalizeReply(typed);
  const nums = (t.match(/\d+/g) ?? []).map(Number);
  const year = nums.find((n) => n === y || n === y % 100);
  if (year === undefined) return false;
  const [a, b] = nums.filter((n) => n !== year);
  if (a === m && b === d) return true;
  const monthNamed = new RegExp(`\\b(${MONTH_NAMES[m - 1]}|${MONTH_NAMES[m - 1].slice(0, 3)}|${MESES[m - 1]})\\b`).test(t);
  return monthNamed && nums.includes(d);
}

/**
 * The form has to match Maya's paper form, not just be filled in: "x / x /
 * x" is not an intake. Case, accents, spacing, and the date format are
 * never held against the learner.
 */
export function intakeFormVerdict(fields: { name: string; dob: string; reason: string }): IntakeFormVerdict {
  if (!fields.name.trim() || !fields.dob.trim() || !fields.reason.trim()) return "missing";
  const name = normalizeReply(fields.name);
  if (!PATIENT.name.toLowerCase().split(" ").every((part) => name.includes(part))) return "name";
  if (!dobMatches(fields.dob)) return "dob";
  const reason = normalizeReply(fields.reason);
  if (!/\bfollow\s*-?\s*up\b|\bfollowup\b|\bseguimiento\b/.test(reason)) return "reason";
  return "ok";
}

export const INTAKE_FORM_CORRECTIONS: Record<Exclude<IntakeFormVerdict, "ok" | "missing">, Localized> = {
  name: {
    en: "Check the name. Copy it from Maya's paper form.",
    es: "Revisa el nombre. Cópialo del formulario en papel de Maya.",
  },
  dob: {
    en: "Check the date of birth. Copy it from Maya's paper form.",
    es: "Revisa la fecha de nacimiento. Cópiala del formulario en papel de Maya.",
  },
  reason: {
    en: "Check the reason for the visit. Copy it from Maya's paper form.",
    es: "Revisa el motivo de la visita. Cópialo del formulario en papel de Maya.",
  },
};

/** The source the learner copies from, shown above the intake boxes. */
export const PAPER_FORM_LABEL: Localized = { en: "Maya's paper form", es: "Formulario en papel de Maya" };

/** What the teacher sees: how the learner declined the coworker's request. */
export function describeSubmission(reply: string, lang: Lang, recipient?: string): SubmissionContent {
  const choice = RECIPIENT_OPTIONS.find((option) => option.key === recipient);
  return { lang, fields: [{ label: INTAKE_COPY[lang].coworkerName, value: reply },
    ...(choice ? [{ label: RECIPIENT_LABEL[lang], value: choice.label[lang] }] : [])] };
}

/** The reply to Tomás gives away why Maya is here. */
export function declineSharesVisit(body: string): boolean {
  return sharesVisit(body);
}

export function declineIsSafe(body: string): boolean {
  const t = body.toLowerCase().replace(/[’`]/g, "'");
  if (t.trim().length < 12) return false;
  if (declineSharesVisit(body)) return false;
  return REFUSES.test(t) || /care team|equipo de cuidado|privacy|privacidad|private|privad[oa]|only for|solo (es )?para/.test(t);
}

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Fill it in and file it. Do not pass it around.",
      s: [
        "Fill in the form and file it. That is your job here.",
        "A coworker who is not on the care team does not get to look at it.",
        "The nurse is different. She is on the care team, so she can take the chart. Tomás cannot.",
      ],
      tip: "If you told Tomás the reason for the visit in your reply, you shared too much.",
    },
  ],
  es: [
    {
      t: "Llénalo y archívalo. No lo andes pasando.",
      s: [
        "Llena el formulario y archívalo. Ese es tu trabajo aquí.",
        "Un compañero que no está en el equipo de cuidado no puede verlo.",
        "La enfermera es distinta. Ella sí está en el equipo de cuidado, así que puede llevar el expediente. Tomás no.",
      ],
      tip: "Si le dijiste a Tomás el motivo de la visita en tu respuesta, compartiste de más.",
    },
  ],
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  { en: "Fill in the intake form and file it.", es: "Llena el formulario de ingreso y archívalo." },
  { en: "Compare both requests with the verified assignment. Choose who may receive the chart.", es: "Compara ambos pedidos con la asignación verificada. Elige quién puede recibir el expediente." },
  { en: "Tell Tomás no, without sharing the reason for the visit.", es: "Dile que no a Tomás, sin compartir el motivo de la visita." },
];


export const VERIFIED_ASSIGNMENT: Localized = {
 en: "Fictional clinic assignment record: Nurse Elena’s identity and assignment to Maya Ansari’s care team have been verified. Tomás Ortiz works in the kitchen and has no care assignment for Maya. This is simplified practice.",
 es: "Registro ficticio de la clínica: se verificaron la identidad de la enfermera Elena y su asignación al equipo de atención de Maya Ansari. Tomás Ortiz trabaja en la cocina y no tiene una asignación de atención para Maya. Esta es una práctica simplificada.",
};
export const RECIPIENT_LABEL: Localized = { en: 'Who may receive this chart?', es: '¿Quién puede recibir este expediente?' };
export const RECIPIENT_HINT: Localized = { en: 'Compare the verified assignment with both requests. A request alone does not establish access.', es: 'Compara la asignación verificada con ambos pedidos. Pedir acceso no demuestra autorización.' };
export const RECIPIENT_OPTIONS = [
 {key:'nurse',label:{en:'Nurse Elena only',es:'Solo la enfermera Elena'}},
 {key:'coworker',label:{en:'Tomás Ortiz only',es:'Solo Tomás Ortiz'}},
 {key:'both',label:{en:'Both people',es:'Ambas personas'}},
 {key:'neither',label:{en:'Neither person',es:'Ninguna persona'}},
];
export function recipientIsAuthorized(key: string): boolean { return key === 'nurse'; }

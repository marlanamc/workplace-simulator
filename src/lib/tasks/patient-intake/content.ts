import type { Lang, Lesson, Localized, SubmissionContent } from "@/lib/task-types";

export const PATIENT = { name: "Maya Rivera", dob: "03/12/1998", reason: { en: "Follow-up", es: "Seguimiento" } };

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
    coworkerName: "Sam Ortiz · kitchen (not care team)",
    careTeamName: "Nurse Jordan · care team",
    writeHere: "Reply to Sam…",
    send: "Send reply",
    empty: "Write a short reply to Sam first.",
    weak: "Say no, and that the form is only for the care team. Do not tell Sam why she is here.",
    shared: "Do not tell Sam the reason for the visit. Just say you cannot share it.",
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
    coworkerName: "Sam Ortiz · cocina (no es equipo de cuidado)",
    careTeamName: "Enfermera Jordan · equipo de cuidado",
    writeHere: "Responde a Sam…",
    send: "Enviar respuesta",
    empty: "Primero escribe una respuesta corta a Sam.",
    weak: "Di que no, y que el formulario es solo para el equipo de cuidado. No le digas a Sam por qué está aquí.",
    shared: "No le digas a Sam el motivo de la visita. Solo dile que no lo puedes compartir.",
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
    "Sorry Sam — I'm not allowed to show patient forms.",
    "No puedo compartirlo. Se queda con el equipo de cuidado.",
  ],
  es: [
    "No puedo compartirlo. Se queda con el equipo de cuidado.",
    "Perdón Sam — no puedo mostrar formularios de pacientes.",
    "I can't share that. It stays with the care team.",
  ],
};

/** What the teacher sees: how the learner declined the coworker's request. */
export function describeSubmission(reply: string, lang: Lang, recipient?: string): SubmissionContent {
  const choice = RECIPIENT_OPTIONS.find((option) => option.key === recipient);
  return { lang, fields: [{ label: INTAKE_COPY[lang].coworkerName, value: reply },
    ...(choice ? [{ label: RECIPIENT_LABEL[lang], value: choice.label[lang] }] : [])] };
}

export function declineIsSafe(body: string): boolean {
  const t = body.toLowerCase();
  if (t.trim().length < 12) return false;
  const shares = /follow-?up|seguimiento|she's here|esta aqu[ií]|why she|por qu[eé] est/.test(t);
  if (shares) return false;
  return /can'?t|cannot|no puedo|not allowed|no (me )?est[aá] permitido|care team|equipo de cuidado|privacy|privacidad/.test(t);
}

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Fill it in and file it. Do not pass it around.",
      s: [
        "Fill in the form and file it. That is your job here.",
        "A coworker who is not on the care team does not get to look at it.",
        "The nurse is different — she is on the care team, so she can take the chart. Sam cannot.",
      ],
      tip: "If you told Sam the reason for the visit in your reply, you shared too much.",
    },
  ],
  es: [
    {
      t: "Llénalo y archívalo. No lo andes pasando.",
      s: [
        "Llena el formulario y archívalo. Ese es tu trabajo aquí.",
        "Un compañero que no está en el equipo de cuidado no puede verlo.",
        "La enfermera es distinta — ella sí está en el equipo de cuidado, así que puede llevar el expediente. Sam no.",
      ],
      tip: "Si le dijiste a Sam el motivo de la visita en tu respuesta, compartiste de más.",
    },
  ],
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  { en: "Fill in the intake form and file it.", es: "Llena el formulario de ingreso y archívalo." },
  { en: "Compare both requests with the verified assignment. Choose who may receive the chart.", es: "Compara ambos pedidos con la asignación verificada. Elige quién puede recibir el expediente." },
  { en: "Tell Sam no, without sharing the reason for the visit.", es: "Dile que no a Sam, sin compartir el motivo de la visita." },
];


export const VERIFIED_ASSIGNMENT: Localized = {
 en: "Fictional clinic assignment record: Nurse Jordan’s identity and assignment to Maya Rivera’s care team have been verified. Sam Ortiz works in the kitchen and has no care assignment for Maya. This is simplified practice.",
 es: "Registro ficticio de la clínica: se verificaron la identidad de la enfermera Jordan y su asignación al equipo de atención de Maya Rivera. Sam Ortiz trabaja en la cocina y no tiene una asignación de atención para Maya. Esta es una práctica simplificada.",
};
export const RECIPIENT_LABEL: Localized = { en: 'Who may receive this chart?', es: '¿Quién puede recibir este expediente?' };
export const RECIPIENT_HINT: Localized = { en: 'Compare the verified assignment with both requests. A request alone does not establish access.', es: 'Compara la asignación verificada con ambos pedidos. Pedir acceso no demuestra autorización.' };
export const RECIPIENT_OPTIONS = [
 {key:'nurse',label:{en:'Nurse Jordan only',es:'Solo la enfermera Jordan'}},
 {key:'coworker',label:{en:'Sam Ortiz only',es:'Solo Sam Ortiz'}},
 {key:'both',label:{en:'Both people',es:'Ambas personas'}},
 {key:'neither',label:{en:'Neither person',es:'Ninguna persona'}},
];
export function recipientIsAuthorized(key: string): boolean { return key === 'nurse'; }

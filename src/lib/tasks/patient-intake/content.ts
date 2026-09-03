import type { Lang, Lesson, Localized } from "@/lib/task-types";

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
    careTeamAsk: "I'm on Maya's care team. I can take the chart when you're done.",
    coworkerName: "Sam Ortiz · kitchen (not care team)",
    careTeamName: "Nurse Jordan · care team",
    writeHere: "Reply to Sam…",
    send: "Send reply",
    empty: "Write a short reply to Sam first.",
    weak: "Say no, and that it is only for the care team. Do not share why she is here.",
    shared: "Do not tell Sam the reason. Decline, and stop there.",
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
    careTeamAsk: "Estoy en el equipo de Maya. Puedo llevar la ficha cuando termines.",
    coworkerName: "Sam Ortiz · cocina (no es equipo de cuidado)",
    careTeamName: "Enfermera Jordan · equipo de cuidado",
    writeHere: "Responde a Sam…",
    send: "Enviar respuesta",
    empty: "Primero escribe una respuesta corta a Sam.",
    weak: "Di que no, y que es solo para el equipo de cuidado. No compartas por qué está aquí.",
    shared: "No le digas a Sam el motivo. Rechaza, y para ahí.",
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

export function declineIsSafe(body: string): boolean {
  const t = body.toLowerCase();
  if (t.trim().length < 12) return false;
  const shares = /follow-?up|seguimiento|she's here|esta aqu[ií]|why she|por qu[eé] est/.test(t);
  if (shares) return false;
  return /can'?t|cannot|no puedo|not allowed|no (me )?est[aá] permitido|care team|equipo de cuidado|privacy|privacidad|sorry|perd[oó]n/.test(t);
}

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "File it. Do not pass it around.",
      s: [
        "Complete the form and file it. That is the job.",
        "A coworker who is not on the care team does not get a peek.",
        "The nurse on the care team is the contrast — they may take the chart. Sam may not.",
      ],
      tip: "If you named the reason in the reply to Sam, you overshared.",
    },
  ],
  es: [
    {
      t: "Archívalo. No lo pases.",
      s: [
        "Completa el formulario y archívalo. Ese es el trabajo.",
        "Un compañero que no está en el equipo de cuidado no puede mirar.",
        "La enfermera del equipo es el contraste — ella sí puede llevar la ficha. Sam no.",
      ],
      tip: "Si nombraste el motivo en la respuesta a Sam, compartiste de más.",
    },
  ],
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  { en: "Fill the intake and file it.", es: "Llena el ingreso y archívalo." },
  { en: "Read both asks. Only one is the care team.", es: "Lee los dos pedidos. Solo uno es el equipo." },
  { en: "Decline Sam without sharing the reason.", es: "Rechaza a Sam sin compartir el motivo." },
];

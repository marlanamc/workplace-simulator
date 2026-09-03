import type { Lang, Lesson, Localized } from "@/lib/task-types";

export const MISMATCH_KEY = "ekg";
export const CORRECT_CHARGE = 85;
export const WRONG_CHARGE = 185;
export const OFFICE_EMAIL = "pat.okonkwo@harborsidehealth.com";

export const REFERENCE = [
  { code: "99213", label: { en: "Office visit", es: "Consulta" }, charge: 145 },
  { code: "90471", label: { en: "Immunization", es: "Vacuna" }, charge: 40 },
  { code: "93000", label: { en: "EKG", es: "EKG" }, charge: 85 },
  { code: "36415", label: { en: "Blood draw", es: "Extracción de sangre" }, charge: 22 },
] as const;

export const BILLING_ROWS = [
  { key: "visit", patient: "Maya Rivera", code: "99213", charge: 145 },
  { key: "shot", patient: "Alex Chen", code: "90471", charge: 40 },
  { key: "ekg", patient: "Pat Okonkwo", code: "93000", charge: 185 },
  { key: "labs", patient: "Jordan Kim", code: "36415", charge: 22 },
] as const;

export const BILLING_COPY: Record<Lang, {
  helpBtn: string;
  appName: string;
  sheetName: string;
  startNewHeading: string;
  blankLabel: string;
  recentHeading: string;
  openedLabel: string;
  noteHeading: string;
  noteBody: string;
  refHeading: string;
  patientHeader: string;
  codeHeader: string;
  chargeHeader: string;
  emailCta: string;
  readFirst: string;
  to: string;
  subjectLabel: string;
  subject: string;
  writeHere: string;
  send: string;
  discard: string;
  sentKicker: string;
  tryAgain: string;
  backToDesk: string;
  lessonKicker: string;
  tipLabel: string;
  gotIt: string;
}> = {
  en: {
    helpBtn: "Help me with this step",
    appName: "Sheets",
    sheetName: "Visit charges — Monday",
    startNewHeading: "Start a new spreadsheet",
    blankLabel: "Blank",
    recentHeading: "Recent spreadsheets",
    openedLabel: "Opened today",
    noteHeading: "Office note",
    noteBody: "Match each visit code to the reference list. One charge is wrong. Email Pat which row, and what it should be.",
    refHeading: "Reference charges",
    patientHeader: "Patient",
    codeHeader: "Code",
    chargeHeader: "Charge",
    emailCta: "Email the office manager",
    readFirst: "Click the row that does not match the reference list first.",
    to: "To",
    subjectLabel: "Subject",
    subject: "Billing mismatch — Monday sheet",
    writeHere: "Name the row and the correct charge…",
    send: "Send",
    discard: "Discard",
    sentKicker: "Message sent",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
  },
  es: {
    helpBtn: "Ayúdame con este paso",
    appName: "Hojas",
    sheetName: "Cargos de visita — lunes",
    startNewHeading: "Iniciar una nueva hoja de cálculo",
    blankLabel: "En blanco",
    recentHeading: "Hojas de cálculo recientes",
    openedLabel: "Abierta hoy",
    noteHeading: "Nota de la oficina",
    noteBody: "Compara cada código con la lista. Un cargo está mal. Escríbele a Pat qué fila, y cuál debería ser.",
    refHeading: "Cargos de referencia",
    patientHeader: "Paciente",
    codeHeader: "Código",
    chargeHeader: "Cargo",
    emailCta: "Escribirle a la oficina",
    readFirst: "Haz clic primero en la fila que no cuadra con la lista.",
    to: "Para",
    subjectLabel: "Asunto",
    subject: "Error de facturación — hoja del lunes",
    writeHere: "Nombra la fila y el cargo correcto…",
    send: "Enviar",
    discard: "Descartar",
    sentKicker: "Mensaje enviado",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
  },
};

export const EMPTY_EMAIL_HINT: Record<Lang, string> = {
  en: "Write a short message first. Even one sentence is fine.",
  es: "Primero escribe un mensaje corto. Una oración está bien.",
};

export const WRONG_EMAIL_HINT: Record<Lang, string> = {
  en: "Name the mismatch (EKG / 93000 / Okonkwo) and the correct charge ($85).",
  es: "Nombra el error (EKG / 93000 / Okonkwo) y el cargo correcto ($85).",
};

export const STARTERS: Record<Lang, string[]> = {
  en: [
    "Pat, the EKG for Okonkwo is $185. The list says $85.",
    "93000 should be $85, not $185.",
    "Pat, el EKG de Okonkwo está en $185. La lista dice $85.",
  ],
  es: [
    "Pat, el EKG de Okonkwo está en $185. La lista dice $85.",
    "El 93000 debería ser $85, no $185.",
    "Pat, the EKG for Okonkwo is $185. The list says $85.",
  ],
};

export function emailFlagsMismatch(body: string): boolean {
  const t = body.toLowerCase();
  const namesRow = /ekg|93000|okonkwo/.test(t);
  const withoutWrong = t.replace(/185/g, "");
  const namesCharge = /85/.test(withoutWrong);
  return namesRow && namesCharge;
}

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "The list is the source",
      s: [
        "Each visit code has one charge on the reference list.",
        "Click the row that does not match before you write.",
        "The email has to name the row and the correct charge, not just \"something looks off.\"",
      ],
      tip: "If you cannot point at the cell, you have not found it yet.",
    },
  ],
  es: [
    {
      t: "La lista es la fuente",
      s: [
        "Cada código de visita tiene un cargo en la lista.",
        "Haz clic en la fila que no cuadra antes de escribir.",
        "El correo tiene que nombrar la fila y el cargo correcto, no solo \"algo se ve mal.\"",
      ],
      tip: "Si no puedes señalar la celda, todavía no lo encontraste.",
    },
  ],
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  { en: "Open today's billing sheet.", es: "Abre la hoja de facturación de hoy." },
  { en: "Click the row that does not match the list.", es: "Haz clic en la fila que no cuadra con la lista." },
  { en: "Email Pat the row and the correct charge.", es: "Escríbele a Pat la fila y el cargo correcto." },
];

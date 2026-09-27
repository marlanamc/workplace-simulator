import { normalizeReply } from "@/lib/grading/meaning";
import { mentionsAmount } from "@/lib/text-facts";
import type { Lang, Lesson, Localized } from "@/lib/task-types";
import { openFileStep } from "../open-file-step";

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
  { key: "visit", patient: "Maya Ansari", code: "99213", charge: 145 },
  { key: "shot", patient: "Nadia Halloran", code: "90471", charge: 40 },
  { key: "ekg", patient: "Pat Okonkwo", code: "93000", charge: 185 },
  { key: "labs", patient: "Omar Whitfield", code: "36415", charge: 22 },
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
    sheetName: "Visit charges: Monday",
    startNewHeading: "Start a new spreadsheet",
    blankLabel: "Blank",
    recentHeading: "Recent spreadsheets",
    openedLabel: "Opened today",
    noteHeading: "Office note",
    noteBody: "Check each visit code against the reference list. One charge is wrong. Email Pat to tell them which row it is and what the charge should be.",
    refHeading: "Reference charges",
    patientHeader: "Patient",
    codeHeader: "Code",
    chargeHeader: "Charge",
    emailCta: "Email the office manager",
    readFirst: "First, click the row that does not match the reference list.",
    to: "To",
    subjectLabel: "Subject",
    subject: "Billing mismatch: Monday sheet",
    writeHere: "Say which row is wrong and what the charge should be…",
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
    sheetName: "Cargos de visita: lunes",
    startNewHeading: "Iniciar una nueva hoja de cálculo",
    blankLabel: "En blanco",
    recentHeading: "Hojas de cálculo recientes",
    openedLabel: "Abierta hoy",
    noteHeading: "Nota de la oficina",
    noteBody: "Compara cada código de visita con la lista de referencia. Un cargo está mal. Escríbele a Pat para decirle qué fila es y cuál debería ser el cargo.",
    refHeading: "Cargos de referencia",
    patientHeader: "Paciente",
    codeHeader: "Código",
    chargeHeader: "Cargo",
    emailCta: "Escribirle a la oficina",
    readFirst: "Primero, haz clic en la fila que no cuadra con la lista de referencia.",
    to: "Para",
    subjectLabel: "Asunto",
    subject: "Error de facturación: hoja del lunes",
    writeHere: "Di qué fila está mal y cuál debería ser el cargo…",
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

/** The sheet row the wrong charge sits on: header is row 1, data starts on row 2. */
export const MISMATCH_ROW = BILLING_ROWS.findIndex((row) => row.key === MISMATCH_KEY) + 2;

const ROW_WORDS: Record<number, string> = {
  2: "two|second|dos|segunda", 3: "three|third|tres|tercera", 4: "four|fourth|cuatro|cuarta", 5: "five|fifth|cinco|quinta",
};

/** Why the email to Pat is not sent yet, or "ok". */
export type BillingEmailVerdict = "ok" | "empty" | "no-row" | "no-charge";

/**
 * The office note asks for "which row it is and what the charge should be".
 * The row can be named any way a person would: "row 4", "fila 4", the code
 * (93000), the service (EKG), or the patient. The charge is $85, and "185"
 * never counts as saying 85.
 */
export function billingEmailVerdict(body: string): BillingEmailVerdict {
  if (!body.trim()) return "empty";
  const t = normalizeReply(body);
  const row = BILLING_ROWS.find((r) => r.key === MISMATCH_KEY)!;
  const lastName = row.patient.split(" ").pop()!.toLowerCase();
  const rowWord = ROW_WORDS[MISMATCH_ROW] ?? String(MISMATCH_ROW);
  const namesRow =
    new RegExp(`\\b(ekg|ecg|${row.code}|${lastName})\\b`).test(t) ||
    new RegExp(`\\b(row|fila|line|linea)\\s*#?\\s*(${MISMATCH_ROW}|${rowWord})\\b`).test(t) ||
    new RegExp(`\\b(${rowWord})\\s+(row|fila|line|linea)\\b`).test(t);
  if (!namesRow) return "no-row";
  return mentionsAmount(t, CORRECT_CHARGE) ? "ok" : "no-charge";
}

export function emailFlagsMismatch(body: string): boolean {
  return billingEmailVerdict(body) === "ok";
}

/** The Job Card's correction for each verdict. It names what is missing, not the answer. */
export const BILLING_EMAIL_CORRECTIONS: Record<Exclude<BillingEmailVerdict, "ok">, Localized> = {
  empty: {
    en: "Write a short message first. Even one sentence is fine.",
    es: "Primero escribe un mensaje corto. Una oración está bien.",
  },
  "no-row": {
    en: "Say which row is wrong. Use the row number, the code, or the patient's name.",
    es: "Di qué fila está mal. Usa el número de la fila, el código o el nombre del paciente.",
  },
  "no-charge": {
    en: "Say what the charge should be. Check the reference list.",
    es: "Di cuál debería ser el cargo. Revisa la lista de referencia.",
  },
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "The reference list has the right prices",
      s: [
        "Every visit code has one correct charge on the reference list.",
        "Find the row that does not match, and click it, before you write the email.",
        "Your email has to say which row is wrong and what the charge should be, not just \"something looks off.\"",
      ],
      tip: "If you cannot point at the exact cell that is wrong, keep looking.",
    },
  ],
  es: [
    {
      t: "La lista de referencia tiene los precios correctos",
      s: [
        "Cada código de visita tiene un cargo correcto en la lista de referencia.",
        "Encuentra la fila que no cuadra, y haz clic en ella, antes de escribir el correo.",
        "Tu correo tiene que decir qué fila está mal y cuál debería ser el cargo, no solo \"algo se ve mal.\"",
      ],
      tip: "Si no puedes señalar la celda exacta que está mal, sigue buscando.",
    },
  ],
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  openFileStep(BILLING_COPY, (c) => c.sheetName),
  { en: "Click the row that does not match the list.", es: "Haz clic en la fila que no cuadra con la lista." },
  { en: "Email Pat the row and the correct charge.", es: "Escríbele a Pat la fila y el cargo correcto." },
];

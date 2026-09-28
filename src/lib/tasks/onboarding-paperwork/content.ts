import type { Lang, Lesson, Localized } from "@/lib/task-types";
import type { TaskKey } from "@/lib/desktop-content";
import { readCount } from "@/lib/grading-jobs";

/**
 * "New-Hire Paperwork" — the last step of the getting-hired arc, before day one
 * at HQ. Three real forms the learner fills in: the W-4 (tax withholding), the
 * I-9 Section 1 (work authorization), and a direct-deposit form. Objective — the
 * app checks the format (a status is chosen, the routing number is 9 digits, the
 * form is signed and dated). No teacher review; no submission saved.
 */

export const PAPERWORK_TASK_ORDER: TaskKey[] = ["w4-form", "i9-section1", "direct-deposit"];

export const PAPERWORK_SHELL: Record<Lang, {
  needRequired: string;
  needSignature: string;
  needRouting: string;
  sentKicker: string;
  tryAgain: string;
  backToDesk: string;
  lessonKicker: string;
  tipLabel: string;
  gotIt: string;
  requiredLabel: string;
  signLabel: string;
  dateLabel: string;
  datePlaceholder: string;
  /** An empty signature box must not look signed: no name as a grey placeholder. */
  signPlaceholder: string;
  signShort: string;
}> = {
  en: {
    needRequired: "Fill in every box marked required before you submit.",
    needSignature: "Sign with the employee's full name, the same name at the top of the form.",
    needRouting: "A routing number is exactly 9 digits. Check it again.",
    sentKicker: "Form submitted",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
    requiredLabel: "Required",
    signLabel: "Signature (type the employee's full name)",
    dateLabel: "Date",
    datePlaceholder: "MM/DD/YYYY",
    signPlaceholder: "Type the full name",
    signShort: "Signature",
  },
  es: {
    needRequired: "Llena cada casilla marcada como obligatoria antes de enviar.",
    needSignature: "Firma con el nombre completo del empleado, el mismo nombre que está arriba del formulario.",
    needRouting: "Un número de ruta tiene exactamente 9 dígitos. Revísalo otra vez.",
    sentKicker: "Formulario enviado",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
    requiredLabel: "Obligatorio",
    signLabel: "Firma (escribe el nombre completo del empleado)",
    dateLabel: "Fecha",
    datePlaceholder: "MM/DD/AAAA",
    signPlaceholder: "Escribe el nombre completo",
    signShort: "Firma",
  },
};

/* ---------------- W-4 ---------------- */

export const W4_COPY: Record<Lang, {
  formName: string;
  title: string;
  blurb: string;
  nameLabel: string;
  statusLabel: string;
  dependentsLabel: string;
  dependentsHint: string;
  dependentsShort: string;
  submit: string;
  doneTitle: string;
  doneBody: string;
}> = {
  en: {
    formName: "Form W-4",
    title: "Employee's Withholding Certificate",
    blurb: "This form tells payroll how much tax to hold back from each paycheck.",
    nameLabel: "Employee name",
    statusLabel: "Filing status",
    dependentsLabel: "Total dependent and other credits ($)",
    dependentsHint: "If none, enter 0.",
    dependentsShort: "Credits ($)",
    submit: "Submit W-4",
    doneTitle: "W-4 submitted.",
    doneBody: "Payroll now knows Robin's filing status.",
  },
  es: {
    formName: "Formulario W-4",
    title: "Certificado de Retenciones del Empleado",
    blurb: "Este formulario le dice a nómina cuánto impuesto retener de cada cheque.",
    nameLabel: "Nombre del empleado",
    statusLabel: "Estado civil para impuestos",
    dependentsLabel: "Total de créditos por dependientes y otros créditos ($)",
    dependentsHint: "Si no hay, escribe 0.",
    dependentsShort: "Créditos ($)",
    submit: "Enviar W-4",
    doneTitle: "W-4 enviado.",
    doneBody: "Nómina ya conoce el estado civil para impuestos de Robin.",
  },
};

export const W4_STATUS_OPTIONS: { key: string; label: Localized }[] = [
  { key: "single", label: { en: "Single, or married filing separately", es: "Soltero/a, o casado/a declarando por separado" } },
  { key: "joint", label: { en: "Married filing jointly", es: "Casado/a declarando en conjunto" } },
  { key: "hoh", label: { en: "Head of household", es: "Cabeza de familia" } },
];

/* ---------------- I-9 Section 1 ---------------- */

export const I9_COPY: Record<Lang, {
  formName: string;
  title: string;
  blurb: string;
  nameLabel: string;
  dobLabel: string;
  addressLabel: string;
  statusLabel: string;
  submit: string;
  doneTitle: string;
  doneBody: string;
}> = {
  en: {
    formName: "Form I-9, Section 1",
    title: "Employment Eligibility Verification",
    blurb: "Everyone hired in the U.S. fills this out. It says you're allowed to work here. You'll show ID documents on your first day.",
    nameLabel: "Full legal name",
    dobLabel: "Date of birth",
    addressLabel: "Home address",
    statusLabel: "I attest that I am:",
    submit: "Submit I-9",
    doneTitle: "I-9 submitted.",
    doneBody: "Bring your ID documents on your first day. Next: direct deposit.",
  },
  es: {
    formName: "Formulario I-9, Sección 1",
    title: "Verificación de Elegibilidad de Empleo",
    blurb: "Todos los que son contratados en EE. UU. llenan esto. Dice que tienes permiso para trabajar aquí. Mostrarás documentos de identidad en tu primer día.",
    nameLabel: "Nombre legal completo",
    dobLabel: "Fecha de nacimiento",
    addressLabel: "Domicilio",
    statusLabel: "Declaro que soy:",
    submit: "Enviar I-9",
    doneTitle: "I-9 enviado.",
    doneBody: "Trae tus documentos de identidad tu primer día. Sigue: depósito directo.",
  },
};

export const I9_STATUS_OPTIONS: { key: string; label: Localized }[] = [
  { key: "citizen", label: { en: "A citizen of the United States", es: "Ciudadano/a de los Estados Unidos" } },
  { key: "national", label: { en: "A noncitizen national of the United States", es: "Nacional no ciudadano/a de los Estados Unidos" } },
  { key: "lpr", label: { en: "A lawful permanent resident", es: "Residente permanente legal" } },
  { key: "authorized", label: { en: "A noncitizen authorized to work", es: "No ciudadano/a autorizado/a para trabajar" } },
];

/* ---------------- Direct deposit ---------------- */

export const DEPOSIT_COPY: Record<Lang, {
  formName: string;
  title: string;
  blurb: string;
  bankLabel: string;
  routingLabel: string;
  routingHint: string;
  accountLabel: string;
  accountTypeLabel: string;
  submit: string;
  doneTitle: string;
  doneBody: string;
}> = {
  en: {
    formName: "Direct Deposit Authorization",
    title: "Send my pay to my bank",
    blurb: "Direct deposit puts your pay straight into your account on payday. No check to cash.",
    bankLabel: "Bank name",
    routingLabel: "Routing number",
    routingHint: "9 digits. It's the first number on the bottom of a check, on the left.",
    accountLabel: "Account number",
    accountTypeLabel: "Account type",
    submit: "Submit direct deposit",
    doneTitle: "Direct deposit set up.",
    doneBody: "You entered Robin's practice bank details. These forms do not change any real bank account. Your first day at HQ is next.",
  },
  es: {
    formName: "Autorización de Depósito Directo",
    title: "Enviar mi pago a mi banco",
    blurb: "El depósito directo pone tu pago directo en tu cuenta el día de pago. Sin cheque que cobrar.",
    bankLabel: "Nombre del banco",
    routingLabel: "Número de ruta",
    routingHint: "9 dígitos. Es el primer número abajo de un cheque, a la izquierda.",
    accountLabel: "Número de cuenta",
    accountTypeLabel: "Tipo de cuenta",
    submit: "Enviar depósito directo",
    doneTitle: "Depósito directo configurado.",
    doneBody: "Ingresaste los datos bancarios de práctica de Robin. Estos formularios no cambian ninguna cuenta real. Sigue tu primer día en la oficina central.",
  },
};

export const ACCOUNT_TYPE_OPTIONS: { key: string; label: Localized }[] = [
  { key: "checking", label: { en: "Checking", es: "Corriente" } },
  { key: "savings", label: { en: "Savings", es: "Ahorros" } },
];

/* ---------------- graders ---------------- */

export function signatureMatches(signature: string, displayName: string): boolean {
  const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
  return norm(signature).length > 0 && norm(signature) === norm(displayName);
}

export function dateLooksFilled(date: string): boolean {
  return date.trim().length >= 6;
}

export function routingIsValid(routing: string): boolean {
  return /^\d{9}$/.test(routing.trim());
}

/* ---------------- lessons ---------------- */

export const LESSONS: Record<string, Record<Lang, Lesson>> = {
  "w4-form": {
    en: {
      t: "What is a W-4?",
      s: [
        "It tells your job how much tax to hold back from each paycheck.",
        "Filing status (single, married, head of household) is the main choice. Choose the one for the person on the form.",
        "Step 3 is the total dollar amount of dependent and other credits. Robin has none, so this practice total is $0.",
        "In this practice, the person is Robin Avery. Read Robin's facts and decide for Robin, not for you.",
      ],
      tip: "On your own W-4 at a real job, you choose what is true for you. You can change it later.",
    },
    es: {
      t: "¿Qué es un W-4?",
      s: [
        "Le dice a tu trabajo cuánto impuesto retener de cada cheque.",
        "El estado civil para impuestos (soltero, casado, cabeza de familia) es la decisión principal. Elige el de la persona del formulario.",
        "El Paso 3 es el monto total en dólares de créditos por dependientes y otros créditos. Robin no tiene ninguno, así que el total de práctica es $0.",
        "En esta práctica, la persona es Robin Avery. Lee los datos de Robin y decide por Robin, no por ti.",
      ],
      tip: "En tu propio W-4 en un trabajo real, eliges lo que es verdad para ti. Lo puedes cambiar después.",
    },
  },
  "i9-section1": {
    en: {
      t: "What is an I-9?",
      s: [
        "It's how you show you're allowed to work in the United States. Everyone who gets hired fills it out.",
        "Section 1 is the part you fill in yourself: your name, birth date, address, and your work-authorization status.",
        "On your first day you'll bring ID documents (like a passport, or a driver's license plus a Social Security card) so HR can check them.",
      ],
      tip: "Fill it in exactly as your ID reads: same name, same spelling.",
    },
    es: {
      t: "¿Qué es un I-9?",
      s: [
        "Es cómo muestras que tienes permiso para trabajar en los Estados Unidos. Todos los que son contratados lo llenan.",
        "La Sección 1 es la parte que llenas tú: tu nombre, fecha de nacimiento, domicilio y tu estado de autorización de trabajo.",
        "Tu primer día traerás documentos de identidad (como un pasaporte, o una licencia de conducir más una tarjeta de Seguro Social) para que RR. HH. los revise.",
      ],
      tip: "Llénalo exactamente como dice tu identificación: mismo nombre, misma ortografía.",
    },
  },
  "direct-deposit": {
    en: {
      t: "Setting up direct deposit",
      s: [
        "Direct deposit sends your pay straight to your bank account on payday. No check to cash, no trip to the bank.",
        "You need two numbers from your bank: the routing number (9 digits, same for everyone at that bank) and your account number.",
        "On a paper check, the routing number is the first group of 9 digits along the bottom, on the left. Your bank's app shows both numbers too.",
      ],
      tip: "Double-check the account number digit by digit. A wrong one sends your pay nowhere.",
    },
    es: {
      t: "Configurar el depósito directo",
      s: [
        "El depósito directo envía tu pago directo a tu cuenta bancaria el día de pago. Sin cheque que cobrar, sin ir al banco.",
        "Necesitas dos números de tu banco: el número de ruta (9 dígitos, igual para todos en ese banco) y tu número de cuenta.",
        "En un cheque de papel, el número de ruta es el primer grupo de 9 dígitos abajo, a la izquierda. La app de tu banco también muestra ambos números.",
      ],
      tip: "Revisa el número de cuenta dígito por dígito. Uno equivocado manda tu pago a ningún lado.",
    },
  },
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Fill in every required box, then sign and date it.",
    es: "Llena cada casilla obligatoria, luego fírmalo y ponle la fecha.",
  },
];

export const PRACTICE_PROFILE = {
  name: 'Robin Avery', dob: '04/12/1990', address: '123 Practice Lane', date: '10/01/2026',
  status: 'single', dependents: '0', workStatus: 'citizen', bank: 'Practice Bank', routing: '000000000', account: '1234567890', accountType: 'checking',
};
export const PRACTICE_REFERENCE: Localized = {
 en: 'Fictional applicant: Robin Avery. Born 04/12/1990. Address: 123 Practice Lane. Form date: 10/01/2026. Single; no dependents or other credits; Step 3 total $0. U.S. citizen. Practice Bank; routing 000000000; account 1234567890; checking. These are simplified practice forms, not real submissions.',
 es: 'Persona ficticia: Robin Avery. Fecha de nacimiento: 04/12/1990 (mes/día/año). Dirección: 123 Practice Lane. Fecha del formulario: 10/01/2026. No está casado/a; sin dependientes ni otros créditos; total del Paso 3 $0. Ciudadanía de EE. UU. Practice Bank; ruta 000000000; cuenta 1234567890; cuenta corriente. Son formularios simplificados de práctica, no trámites reales.',
};
/**
 * Two month/day/year dates are the same day however they are written:
 * 10/1/2026, 10/01/2026, 10-01-2026, 10.01.26.
 */
export function sameDate(typed: string, expected: string): boolean {
  const parts = (v: string) => {
    const m = v.trim().match(/^(\d{1,2})\s*[/.-]\s*(\d{1,2})\s*[/.-]\s*(\d{2}|\d{4})$/);
    if (!m) return null;
    const year = m[3].length === 2 ? 2000 + Number(m[3]) : Number(m[3]);
    return `${Number(m[1])}/${Number(m[2])}/${year}`;
  };
  const a = parts(typed);
  return a !== null && a === parts(expected);
}

/** Step 3 is a dollar amount on the 2026 W-4, not a dependent count.
 * Keep the legacy field key for saved practice data. */
export function readW4CreditAmount(value: string): number | null {
  const text = value.trim().replace(/^\$\s*/, '');
  if (/^\d+(?:[.,]\d{1,2})?$/.test(text)) return Number(text.replace(',', '.'));
  return readCount(text) === 0 ? 0 : null;
}

type PracticeKey = keyof typeof PRACTICE_PROFILE;

function fieldMatches(key: PracticeKey, value: string): boolean {
  if (key === "date" || key === "dob") return sameDate(value, PRACTICE_PROFILE[key]);
  if (key === "dependents") return readW4CreditAmount(value) === Number(PRACTICE_PROFILE.dependents);
  return value.trim().toLowerCase().replace(/\s+/g, " ") === PRACTICE_PROFILE[key].toLowerCase();
}

export function practiceFieldsMatch(values: Partial<typeof PRACTICE_PROFILE>): boolean {
  return Object.entries(values).every(([key, value]) => fieldMatches(key as PracticeKey, String(value)));
}

/** The first field that does not match Robin's facts, so a correction can name it. */
export function firstMismatch(values: Partial<typeof PRACTICE_PROFILE>): PracticeKey | null {
  const hit = Object.entries(values).find(([key, value]) => !fieldMatches(key as PracticeKey, String(value)));
  return hit ? (hit[0] as PracticeKey) : null;
}

/** What to say when a W-4 box does not match Robin's facts. */
export const W4_FIELD_HINT: Partial<Record<PracticeKey, Localized>> = {
  status: {
    en: "Robin is not married and has no children. Choose \"Single, or married filing separately\".",
    es: "Robin no está casado/a y no tiene hijos. Elige \"Soltero/a, o casado/a declarando por separado\".",
  },
  dependents: {
    en: "Check Step 3. Robin has no dependents or other credits, so the credit amount is $0.",
    es: "Revisa el Paso 3. Robin no tiene dependientes ni otros créditos, así que el monto es $0.",
  },
  date: {
    en: "Check the Date box. Write the form date from Robin's facts: 10/01/2026 (month/day/year: October 1).",
    es: "Revisa la casilla Fecha. Escribe la fecha del formulario de los datos de Robin: 10/01/2026 (mes/día/año: 1 de octubre).",
  },
};

/**
 * A wrong filing status is corrected the moment it is chosen, at the field,
 * and says why that option does not fit Robin, so the learner decides again
 * from the facts rather than being handed the answer.
 */
export const W4_STATUS_WRONG: Record<string, Localized> = {
  joint: {
    en: "Married filing jointly is for a married couple. Robin is not married. Read Robin's facts and choose again.",
    es: "Casado/a declarando en conjunto es para una pareja casada. Robin no está casado/a. Lee los datos de Robin y elige otra vez.",
  },
  hoh: {
    en: "Head of household is for someone who pays for a home for a child or another family member. Robin has no children. Choose again.",
    es: "Cabeza de familia es para quien paga una casa para un hijo u otro familiar. Robin no tiene hijos. Elige otra vez.",
  },
};

export type W4Field = "status" | "dependents" | "signature" | "date";

/** Each empty box, named, so the correction says where to look. */
export const W4_EMPTY_HINT: Record<W4Field, Localized> = {
  status: {
    en: "Step 1: choose Robin's filing status.",
    es: "Paso 1: elige el estado civil de Robin.",
  },
  dependents: {
    en: "Step 3: enter Robin's dependent and other credits in dollars. Robin's total is $0.",
    es: "Paso 3: escribe los créditos de Robin en dólares. El total de Robin es $0.",
  },
  signature: {
    en: "Step 5: the Signature box is empty. Type Robin's full name there.",
    es: "Paso 5: la casilla Firma está vacía. Escribe ahí el nombre completo de Robin.",
  },
  date: {
    en: "Step 5: the Date box is empty. Type the form date from Robin's facts.",
    es: "Paso 5: la casilla Fecha está vacía. Escribe la fecha del formulario de los datos de Robin.",
  },
};

export const W4_NOT_A_COUNT: Localized = {
  en: "Step 3 needs a dollar amount, such as 0 or $0.00.",
  es: "El Paso 3 necesita un monto en dólares, como 0 o $0.00.",
};

export const W4_SIGNATURE_HINT: Localized = {
  en: "Check the Signature box. Sign with Robin's full name, the same name at the top of the form: Robin Avery.",
  es: "Revisa la casilla Firma. Firma con el nombre completo de Robin, el mismo que está arriba del formulario: Robin Avery.",
};

export interface W4Values {
  status: string | null;
  dependents: string;
  signature: string;
  date: string;
}

/**
 * The first problem on the W-4, top to bottom: an empty box before a wrong
 * one in the same step, and every message names its box.
 */
export function w4Problem(v: W4Values): { field: W4Field; hint: Localized } | null {
  if (!v.status) return { field: "status", hint: W4_EMPTY_HINT.status };
  if (v.status !== PRACTICE_PROFILE.status) return { field: "status", hint: W4_STATUS_WRONG[v.status] ?? W4_FIELD_HINT.status! };
  if (!v.dependents.trim()) return { field: "dependents", hint: W4_EMPTY_HINT.dependents };
  if (readW4CreditAmount(v.dependents) === null) return { field: "dependents", hint: W4_NOT_A_COUNT };
  if (!fieldMatches("dependents", v.dependents)) return { field: "dependents", hint: W4_FIELD_HINT.dependents! };
  if (!v.signature.trim()) return { field: "signature", hint: W4_EMPTY_HINT.signature };
  if (!signatureMatches(v.signature, PRACTICE_PROFILE.name)) return { field: "signature", hint: W4_SIGNATURE_HINT };
  if (!v.date.trim()) return { field: "date", hint: W4_EMPTY_HINT.date };
  if (!fieldMatches("date", v.date)) return { field: "date", hint: W4_FIELD_HINT.date! };
  return null;
}

/** Where the card is: it moves on only when a box is right, not just filled. */
export function w4StepIndex(v: W4Values): number {
  const problem = w4Problem(v);
  if (!problem) return 2;
  return problem.field === "status" ? 0 : problem.field === "dependents" ? 1 : 2;
}

export const REFERENCE_HINT: Localized = {
  en: "Compare the form with Robin's facts.",
  es: "Compara el formulario con los datos de Robin.",
};

/** The W-4's own steps, so the card moves as the form fills. */
export const W4_STEPS: Localized[] = [
  {
    en: "Read Robin's facts at the top. Choose the filing status that fits Robin.",
    es: "Lee los datos de Robin arriba. Elige el estado civil que corresponde a Robin.",
  },
  {
    en: "Enter Robin's total credits in Step 3. This box is a dollar amount, not a count of people.",
    es: "Escribe el total de créditos de Robin en el Paso 3. Esta casilla es un monto en dólares, no un número de personas.",
  },
  {
    en: "Sign with Robin's full name. Write the form date. Then click Submit W-4.",
    es: "Firma con el nombre completo de Robin. Escribe la fecha del formulario. Después haz clic en Enviar W-4.",
  },
];

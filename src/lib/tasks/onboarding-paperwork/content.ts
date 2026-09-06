import type { Lang, Lesson, Localized } from "@/lib/task-types";
import type { TaskKey } from "@/lib/desktop-content";

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
}> = {
  en: {
    needRequired: "Fill in every box marked required before you submit.",
    needSignature: "Sign with your full name, the same name at the top of the form.",
    needRouting: "A routing number is exactly 9 digits. Check it again.",
    sentKicker: "Form submitted",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
    requiredLabel: "Required",
    signLabel: "Signature (type your full name)",
    dateLabel: "Date",
    datePlaceholder: "MM/DD/YYYY",
  },
  es: {
    needRequired: "Llena cada casilla marcada como obligatoria antes de enviar.",
    needSignature: "Firma con tu nombre completo, el mismo nombre que está arriba del formulario.",
    needRouting: "Un número de ruta tiene exactamente 9 dígitos. Revísalo otra vez.",
    sentKicker: "Formulario enviado",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
    requiredLabel: "Obligatorio",
    signLabel: "Firma (escribe tu nombre completo)",
    dateLabel: "Fecha",
    datePlaceholder: "MM/DD/AAAA",
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
  submit: string;
  doneTitle: string;
  doneBody: string;
}> = {
  en: {
    formName: "Form W-4",
    title: "Employee's Withholding Certificate",
    blurb: "This form tells payroll how much tax to hold back from each paycheck.",
    nameLabel: "Your name",
    statusLabel: "Filing status",
    dependentsLabel: "Number of dependents (children or others you support)",
    dependentsHint: "If none, enter 0.",
    submit: "Submit W-4",
    doneTitle: "W-4 submitted.",
    doneBody: "Payroll now knows your filing status. Next: the I-9.",
  },
  es: {
    formName: "Formulario W-4",
    title: "Certificado de Retenciones del Empleado",
    blurb: "Este formulario le dice a nómina cuánto impuesto retener de cada cheque.",
    nameLabel: "Tu nombre",
    statusLabel: "Estado civil para impuestos",
    dependentsLabel: "Número de dependientes (hijos u otras personas que mantienes)",
    dependentsHint: "Si no tienes, escribe 0.",
    submit: "Enviar W-4",
    doneTitle: "W-4 enviado.",
    doneBody: "Nómina ya conoce tu estado civil para impuestos. Sigue: el I-9.",
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
    doneBody: "Your pay will land in your account each payday. That's all the paperwork. Day one is next.",
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
    doneBody: "Tu pago llegará a tu cuenta cada día de pago. Eso es todo el papeleo. Sigue el primer día.",
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
        "Your filing status (single, married, head of household) is the main choice. Pick the one that's true for you.",
        "A dependent is someone you support, usually a child. If you have none, enter 0. You can change this form later any time.",
      ],
      tip: "Not sure about status? \"Single\" is the safe default and you can update it.",
    },
    es: {
      t: "¿Qué es un W-4?",
      s: [
        "Le dice a tu trabajo cuánto impuesto retener de cada cheque.",
        "Tu estado civil para impuestos (soltero, casado, cabeza de familia) es la decisión principal. Elige el que sea verdad para ti.",
        "Un dependiente es alguien que mantienes, normalmente un hijo. Si no tienes, escribe 0. Puedes cambiar este formulario después en cualquier momento.",
      ],
      tip: "¿No estás seguro del estado? \"Soltero\" es lo seguro por defecto y lo puedes actualizar.",
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
  name: 'Alex Rivera', dob: '04/12/1990', address: '123 Practice Lane', date: '10/01/2026',
  status: 'single', dependents: '0', workStatus: 'citizen', bank: 'Practice Bank', routing: '000000000', account: '1234567890', accountType: 'checking',
};
export const PRACTICE_REFERENCE: Localized = {
 en: 'Fictional applicant: Alex Rivera. Born 04/12/1990. Address: 123 Practice Lane. Form date: 10/01/2026. Single; no dependents. U.S. citizen. Practice Bank; routing 000000000; account 1234567890; checking. These are simplified practice forms, not real submissions.',
 es: 'Solicitante ficticio: Alex Rivera. Nació el 04/12/1990 (mes/día/año). Dirección: 123 Practice Lane. Fecha del formulario: 10/01/2026. Soltero; sin dependientes. Ciudadano de EE. UU. Practice Bank; ruta 000000000; cuenta 1234567890; cuenta corriente. Son formularios simplificados de práctica, no trámites reales.',
};
export function practiceFieldsMatch(values: Partial<typeof PRACTICE_PROFILE>): boolean {
 return Object.entries(values).every(([key, value]) => String(value).trim().toLowerCase().replace(/\s+/g, ' ') === PRACTICE_PROFILE[key as keyof typeof PRACTICE_PROFILE].toLowerCase());
}

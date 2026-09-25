import type { Localized } from "@/lib/task-types";
import { MODES, type Mode, type PracticeActivity } from "./types";
export type PasswordStage =
  "signin" | "code" | "newPassword" | "signinAgain" | "signedIn" | "complete";
export type AccountId = "sam" | "maya";
/**
 * Nothing a learner types into a password field is saved — only which account
 * they chose and the code, both fictional. That is why the new password must be
 * the practice one: a later reload can check it without storing it.
 */
export type PasswordDraft = {
  version: 1;
  stage: PasswordStage;
  mode: Mode;
  account: AccountId | "";
  code: string;
};
const STAGES: readonly PasswordStage[] = [
  "signin",
  "code",
  "newPassword",
  "signinAgain",
  "signedIn",
  "complete",
];
export const CODE = "730418";
export const PRACTICE_PASSWORD = "Blue-Harbor-27";
export const ACCOUNTS: { id: AccountId; name: string; email: string }[] = [
  { id: "sam", name: "Sam Okafor", email: "sam.okafor@example.com" },
  { id: "maya", name: "Maya Torres", email: "maya.torres@example.com" },
];
/** The phone's texts; the learner has to read past an ad's coupon code to find the real one. */
export const TEXTS = [
  {
    from: "Pizza Palace",
    body: "Use code 2024 for 20% off tonight!",
    time: "3 min ago",
  },
  {
    from: "Riverside Learning",
    body: `Your verification code is ${CODE}. Do not share this code with anyone.`,
    time: "Just now",
  },
  { from: "Sam", body: "Did you finish the homework?", time: "Just now" },
];
export const blankPassword = (mode: Mode = "guided"): PasswordDraft => ({
  version: 1,
  stage: "signin",
  mode,
  account: "",
  code: "",
});
export function accountError(d: PasswordDraft): Localized | null {
  if (d.account === "maya") return null;
  return d.account === "sam"
    ? {
        en: "This is Sam’s account, not Maya’s. Click Use another account and choose maya.torres@example.com.",
        es: "Esta es la cuenta de Sam, no la de Maya. Haz clic en Use another account y elige maya.torres@example.com.",
      }
    : {
        en: "Choose Maya’s account first.",
        es: "Primero elige la cuenta de Maya.",
      };
}
export function codeError(d: PasswordDraft): Localized | null {
  const c = d.code.replace(/\s/g, "");
  if (c === CODE) return null;
  if (c === "2024")
    return {
      en: "2024 is a coupon from a pizza ad. Your code comes from Riverside Learning.",
      es: "2024 es un cupón de un anuncio de pizza. Tu código viene de Riverside Learning.",
    };
  return {
    en: "Check the text from Riverside Learning. The code has 6 numbers.",
    es: "Revisa el mensaje de Riverside Learning. El código tiene 6 números.",
  };
}
/** Live checklist under the new-password field. */
export const RULES: { label: string; ok: (p: string) => boolean }[] = [
  { label: "At least 8 characters", ok: (p) => p.length >= 8 },
  { label: "At least one number", ok: (p) => /\d/.test(p) },
  { label: "At least one letter", ok: (p) => /[a-z]/i.test(p) },
];
export function newPasswordErrors(
  password: string,
  confirm: string,
): Localized[] {
  if (RULES.some((r) => !r.ok(password)))
    return [
      {
        en: "This password does not follow all the rules yet. Look at the list under the box.",
        es: "Esta contraseña todavía no cumple todas las reglas. Mira la lista debajo del cuadro.",
      },
    ];
  const out: Localized[] = [];
  if (password !== PRACTICE_PASSWORD)
    out.push({
      en: `Good password! For this practice, please use ${PRACTICE_PASSWORD} — never a real password.`,
      es: `¡Buena contraseña! Para esta práctica, usa ${PRACTICE_PASSWORD} — nunca una contraseña real.`,
    });
  if (confirm !== password)
    out.push({
      en: "The two passwords are different. Type the same password in both boxes.",
      es: "Las dos contraseñas son diferentes. Escribe la misma contraseña en los dos cuadros.",
    });
  return out;
}
export function signinAgainError(password: string): Localized | null {
  return password === PRACTICE_PASSWORD
    ? null
    : {
        en: `That is not the new password. Type ${PRACTICE_PASSWORD} exactly — capital letters matter.`,
        es: `Esa no es la nueva contraseña. Escribe ${PRACTICE_PASSWORD} exactamente — las mayúsculas importan.`,
      };
}
export function parsePassword(value: unknown): PasswordDraft | null {
  if (!value || typeof value !== "object") return null;
  const d = value as PasswordDraft;
  if (
    d.version !== 1 ||
    !STAGES.includes(d.stage) ||
    !MODES.includes(d.mode) ||
    !["", "sam", "maya"].includes(d.account) ||
    typeof d.code !== "string" ||
    d.code.length > 20
  )
    return null;
  const clean: PasswordDraft = {
    version: 1,
    stage: d.stage,
    mode: d.mode,
    account: d.account,
    code: d.code,
  };
  const at = STAGES.indexOf(d.stage);
  if (at >= STAGES.indexOf("code") && accountError(clean)) return null;
  if (at >= STAGES.indexOf("newPassword") && codeError(clean)) return null;
  return clean;
}
export const password: PracticeActivity<PasswordDraft> = {
  id: "password",
  version: 1,
  eyebrow: { en: "ACCOUNTS · PASSWORDS", es: "CUENTAS · CONTRASEÑAS" },
  title: { en: "Forgot your password", es: "Olvidaste tu contraseña" },
  summary: {
    en: "Choose the right account, reset a forgotten password with a text code, sign in, and sign out.",
    es: "Elige la cuenta correcta, cambia una contraseña olvidada con un código por mensaje, entra y cierra sesión.",
  },
  minutes: {
    en: "About 5–10 minutes · No account needed",
    es: "Aproximadamente 5–10 minutos · Sin cuenta",
  },
  stages: STAGES,
  blank: blankPassword,
  parseDraft: parsePassword,
  instructions: {
    signin: {
      en: "Choose Maya’s account. Her password does not work — click Forgot password?",
      es: "Elige la cuenta de Maya. Su contraseña no funciona — haz clic en Forgot password?",
    },
    code: {
      en: "Read the texts on Maya’s phone. Find the code from Riverside Learning and type it in.",
      es: "Lee los mensajes en el teléfono de Maya. Busca el código de Riverside Learning y escríbelo.",
    },
    newPassword: {
      en: `Make a new password. Type ${PRACTICE_PASSWORD} in both boxes, then click Save password.`,
      es: `Crea una contraseña nueva. Escribe ${PRACTICE_PASSWORD} en los dos cuadros y haz clic en Save password.`,
    },
    signinAgain: {
      en: "Sign in with the new password.",
      es: "Inicia sesión con la contraseña nueva.",
    },
    signedIn: {
      en: "Check the name in the top corner — it shows whose account is open. Then click it and sign out.",
      es: "Mira el nombre en la esquina de arriba — muestra de quién es la cuenta abierta. Luego haz clic y cierra sesión.",
    },
    complete: {
      en: "You reset the password and signed out. On a shared computer, always sign out when you finish.",
      es: "Cambiaste la contraseña y cerraste sesión. En una computadora compartida, siempre cierra sesión al terminar.",
    },
  },
  help: {
    signin: {
      en: "The list shows accounts used on this computer. Read the email under each name. If the account is not yours, click Use another account.",
      es: "La lista muestra las cuentas usadas en esta computadora. Lee el correo debajo de cada nombre. Si la cuenta no es tuya, haz clic en Use another account.",
    },
    code: {
      en: "A verification code proves the account is yours. Never tell this code to anyone — a real company will not ask for it.",
      es: "Un código de verificación demuestra que la cuenta es tuya. Nunca le digas este código a nadie — una empresa real no te lo pedirá.",
    },
    newPassword: {
      en: "The list under the box turns green when a rule is met. You type the password twice so a typo does not lock you out.",
      es: "La lista debajo del cuadro se pone verde cuando se cumple una regla. Escribes la contraseña dos veces para que un error no te deje afuera.",
    },
    signinAgain: {
      en: "Passwords must match exactly: capital letters, numbers, and the dashes. Click Show password to check what you typed.",
      es: "La contraseña debe ser exacta: mayúsculas, números y guiones. Haz clic en Show password para ver lo que escribiste.",
    },
    signedIn: {
      en: "The round picture with a letter is the account button. Click it to see the name, the email, and Sign out.",
      es: "El círculo con una letra es el botón de la cuenta. Haz clic para ver el nombre, el correo y Sign out.",
    },
    complete: {
      en: "Write new passwords somewhere safe at home, not on a paper next to the computer.",
      es: "Guarda las contraseñas nuevas en un lugar seguro en casa, no en un papel junto a la computadora.",
    },
  },
  goal: {
    en: "Maya forgot her password. Reset it, sign in to her account, then sign out.",
    es: "Maya olvidó su contraseña. Cámbiala, entra a su cuenta y luego cierra sesión.",
  },
  details: [
    { label: { en: "Name", es: "Nombre" }, value: "Maya Torres" },
    { label: { en: "Email", es: "Correo" }, value: "maya.torres@example.com" },
    {
      label: { en: "Old password", es: "Contraseña vieja" },
      value: { en: "Maya forgot it", es: "Maya la olvidó" },
    },
    {
      label: {
        en: "New practice password",
        es: "Contraseña nueva de práctica",
      },
      value: PRACTICE_PASSWORD,
    },
  ],
  guide: {
    skills: [
      {
        en: "Choose the right account on a shared computer",
        es: "Elegir la cuenta correcta en una computadora compartida",
      },
      {
        en: "Use Forgot password? instead of guessing",
        es: "Usar Forgot password? en vez de adivinar",
      },
      {
        en: "Find a verification code in text messages — and ignore look-alikes",
        es: "Encontrar un código de verificación en los mensajes — e ignorar los parecidos",
      },
      {
        en: "Make a password that follows the rules and type it twice",
        es: "Crear una contraseña que cumpla las reglas y escribirla dos veces",
      },
      {
        en: "See whose account is open, and sign out",
        es: "Ver de quién es la cuenta abierta y cerrar sesión",
      },
    ],
    prepare: [
      {
        en: "Tell students: never type a real password in practice. The activity gives a fictional one and saves no passwords.",
        es: "Diles: nunca escriban una contraseña real en la práctica. La actividad da una ficticia y no guarda contraseñas.",
      },
      {
        en: "Choose support by computer experience, not English level: new computer users start with Guided.",
        es: "Elige el apoyo según la experiencia con computadoras, no el nivel de inglés: quienes usan poco la computadora empiezan con Con guía.",
      },
      {
        en: "Afterward, show how your program’s real Chromebook or Google sign-in looks.",
        es: "Después, muestra cómo se ve el inicio de sesión real de Chromebook o Google de tu programa.",
      },
    ],
    stickingPoints: [
      {
        en: "Clicking Sam’s account because it is first. Ask: whose email is this?",
        es: "Hacer clic en la cuenta de Sam porque está primero. Pregunta: ¿de quién es este correo?",
      },
      {
        en: "Typing 2024 from the pizza ad. Talk about who sent each message.",
        es: "Escribir 2024 del anuncio de pizza. Habla de quién envió cada mensaje.",
      },
      {
        en: "Capital letters and dashes in the password. Show password helps.",
        es: "Las mayúsculas y los guiones en la contraseña. Show password ayuda.",
      },
      { en: "Leaving without signing out.", es: "Irse sin cerrar sesión." },
    ],
    followUp: [
      {
        en: "How do you know which account is open on a computer or phone?",
        es: "¿Cómo sabes qué cuenta está abierta en una computadora o teléfono?",
      },
      {
        en: "Someone calls and asks for your code. What do you do?",
        es: "Alguien te llama y te pide tu código. ¿Qué haces?",
      },
      {
        en: "Where can you keep your passwords safe?",
        es: "¿Dónde puedes guardar tus contraseñas de forma segura?",
      },
    ],
    peerHelp: {
      en: "Students who finish early can sit beside a classmate and point to the screen — the classmate does the clicking and typing.",
      es: "Quienes terminen antes pueden sentarse junto a un compañero y señalar la pantalla — el compañero hace los clics y escribe.",
    },
  },
};

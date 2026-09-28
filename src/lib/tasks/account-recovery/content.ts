import type { EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "🔒",
    kicker: "Wednesday morning",
    headline: "You're signed out. Get back in.",
    body: "The work account signed you out. Sign back in, then find the code it texts you - it won't let you in without it.",
    cta: "Open Sign In",
  },
  es: {
    emoji: "🔒",
    kicker: "Miércoles por la mañana",
    headline: "Cerraste sesión. Vuelve a entrar.",
    body: "La cuenta de trabajo cerró tu sesión. Vuelve a entrar, luego busca el código que te envía por mensaje de texto - no te dejará entrar sin él.",
    cta: "Abrir inicio de sesión",
  },
};

const wrongHint = (en: string, es: string): Localized => ({ en, es });

/** A text on the learner's phone. */
export interface RecoveryText {
  key: string;
  from: string;
  body: Localized;
  when: Localized;
  isTarget: boolean;
  wrongHint?: Localized;
}

/**
 * Texts on the phone beside the sign-in page, once the account has sent the
 * code. Two of them carry a 6-digit number and both say "Google", so the
 * learner has to judge which one is real: who sent it, and whether it asks
 * them to reply with the code. The coworker's text asks for the code too.
 * The texts stay on screen, so the code is still readable while it is typed.
 * Newest first, the way a phone lists them.
 */
export const TEXTS: RecoveryText[] = [
  {
    key: "fake",
    from: "+1 (555) 014-2297",
    body: {
      en: "Google Alert: someone is using your account! Your code is 915482. Reply with the code now, or we will close your account.",
      es: "Alerta de Google: ¡alguien está usando tu cuenta! Tu código es 915482. Responde con el código ahora o cerraremos tu cuenta.",
    },
    when: { en: "Now", es: "Ahora" },
    isTarget: false,
    wrongHint: wrongHint(
      "That text is fake. It comes from a phone number, not from Google, and it asks you to reply with the code. Google never asks that. Look for the text from Google.",
      "Ese mensaje es falso. Viene de un número de teléfono, no de Google, y te pide que respondas con el código. Google nunca pide eso. Busca el mensaje de Google."
    ),
  },
  {
    key: "code",
    from: "Google",
    body: {
      en: "Your Google verification code is 482915. Do not share it with anyone.",
      es: "Tu código de verificación de Google es 482915. No se lo compartas a nadie.",
    },
    when: { en: "Now", es: "Ahora" },
    isTarget: true,
  },
  {
    key: "friend",
    from: "Sam",
    body: {
      en: "Hi! It's Sam from work. Can you send me the code you just got? I need it for the schedule.",
      es: "¡Hola! Soy Sam, del trabajo. ¿Me mandas el código que te acaba de llegar? Lo necesito para el horario.",
    },
    when: { en: "2 min ago", es: "hace 2 min" },
    isTarget: false,
    wrongHint: wrongHint(
      "That text is from Sam, a coworker. Sam wants your code. Never give your code to anyone, not even a coworker. Look for the text from Google.",
      "Ese mensaje es de Sam, un compañero. Sam quiere tu código. Nunca le des tu código a nadie, ni a un compañero. Busca el mensaje de Google."
    ),
  },
];

/** The number in the fake text: typing it is the unsafe choice. */
export const FAKE_CODE = "915482";

/**
 * Fictional password supplied on the lesson info card or Story Job Card.
 */
export const LESSON_PASSWORD = "Harbor2026";

/**
 * "Locked out" means the password is checked (finding #18): only the practice
 * password gets through, in Story and in a lesson. Spaces around it are
 * forgiven; capital letters are not, because a real sign-in does not forgive them.
 */
export function practicePasswordMatches(typed: string): boolean {
  return typed.trim() === LESSON_PASSWORD;
}

/**
 * Story mode has no info card. From Act II the Job Card shows a task's goal,
 * not each click, so the password rides on the sign-in step's goal.
 */
export const STORY_SIGNIN_GOAL: Localized = {
  en: "Sign in with the practice password Harbor2026.",
  es: "Entra con la contraseña de práctica Harbor2026.",
};

/** Story correction for a wrong password (a lesson points at the info card). */
export const STORY_WRONG_PASSWORD: Localized = {
  en: "Use the practice password Harbor2026, with a capital H.",
  es: "Usa la contraseña de práctica Harbor2026, con H mayúscula.",
};

/** Spaces and dashes are not part of a code: "482 915" is the same code. */
function digitsOf(typed: string): string {
  return typed.replace(/[\s-]+/g, "");
}

export function codeMatches(typed: string): boolean {
  return digitsOf(typed) === CODE;
}

export type CodeCheck = "ok" | "empty" | "fake" | "wrong";

/**
 * Grades the code box. An empty box is reported first, then the fake text's
 * number (the safety mistake, which gets its own correction), then anything
 * else that is not the code.
 */
export function checkCode(typed: string): CodeCheck {
  const digits = digitsOf(typed);
  if (!digits) return "empty";
  if (digits === CODE) return "ok";
  if (digits === FAKE_CODE) return "fake";
  return "wrong";
}

export const CODE = "482915";

export const RECOVERY_COPY: Record<Lang, {
  heading: string;
  usernameLabel: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  showPassword: string;
  signIn: string;
  emptyPassword: string;
  wrongPassword: string;
  codeSentTitle: string;
  codeSentBody: string;
  codeLabel: string;
  codePlaceholder: string;
  submitCode: string;
  phoneHeading: string;
  phoneEmpty: string;
  phoneLabel: string;
  wrongCode: string;
  emptyCode: string;
  fakeCode: string;
  sentKicker: string;
  doneBody: string;
  badgeName: string;
  badgeWhere: string;
  tryAgain: string;
  backToDesk: string;
  /** Google sign-in chrome. */
  signInTitle: string;
  continueTo: string;
  verifyTitle: string;
}> = {
  en: {
    heading: "Google",
    usernameLabel: "Username",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    showPassword: "Show password",
    signIn: "Sign in",
    emptyPassword: "Type your password first. Then click Sign in.",
    wrongPassword: "That is not the password. Look at your info card. Type it the same way: a big H, then arbor2026.",
    codeSentTitle: "We sent you a code",
    codeSentBody: "We sent a text message with a 6-digit code to your phone.",
    codeLabel: "Enter the 6-digit code",
    codePlaceholder: "000000",
    submitCode: "Verify",
    phoneHeading: "Messages",
    phoneEmpty: "No new messages",
    phoneLabel: "Your phone",
    wrongCode: "That is not the code. Look at the text from Google on your phone. Type its 6 numbers.",
    emptyCode: "The box is empty. Type the 6 numbers from the text from Google.",
    fakeCode: "That code is from the fake text. It came from a phone number and asked you to reply. Type the code from the text from Google.",
    sentKicker: "Signed back in",
    doneBody: "Getting signed out happens to everyone. Type your password, find the real code from the account, and never give that code to anyone.",
    badgeName: "Get back into a locked account",
    badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    signInTitle: "Sign in",
    continueTo: "to continue to Harborside Cafe",
    verifyTitle: "Check your phone",
  },
  es: {
    heading: "Google",
    usernameLabel: "Usuario",
    passwordLabel: "Contraseña",
    passwordPlaceholder: "Escribe tu contraseña",
    showPassword: "Mostrar contraseña",
    signIn: "Iniciar sesión",
    emptyPassword: "Primero escribe tu contraseña. Después haz clic en Iniciar sesión.",
    wrongPassword: "Esa no es la contraseña. Mira tu tarjeta de información. Escríbela igual: una H mayúscula, después arbor2026.",
    codeSentTitle: "Te enviamos un código",
    codeSentBody: "Te enviamos un mensaje de texto con un código de 6 números a tu teléfono.",
    codeLabel: "Escribe el código de 6 números",
    codePlaceholder: "000000",
    submitCode: "Verificar",
    phoneHeading: "Mensajes",
    phoneEmpty: "No hay mensajes nuevos",
    phoneLabel: "Tu teléfono",
    wrongCode: "Ese no es el código. Mira el mensaje de Google en tu teléfono. Escribe sus 6 números.",
    emptyCode: "La casilla está vacía. Escribe los 6 números del mensaje de Google.",
    fakeCode: "Ese código es del mensaje falso. Vino de un número de teléfono y te pedía responder. Escribe el código del mensaje de Google.",
    sentKicker: "Sesión iniciada",
    doneBody: "A todos se les cierra la sesión alguna vez. Escribe tu contraseña, busca el código real de la cuenta y nunca le des ese código a nadie.",
    badgeName: "Volver a entrar a una cuenta bloqueada",
    badgeWhere: "Cuenta para: Oficina · Servicio de alimentos",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    signInTitle: "Iniciar sesión",
    continueTo: "para ir a Harborside Cafe",
    verifyTitle: "Revisa tu teléfono",
  },
};

/** The persistent "what to do right now" line, one per step of this job. */
export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Type the practice password Harbor2026. Then click Sign in.",
    es: "Escribe la contraseña de práctica Harbor2026. Después haz clic en Iniciar sesión.",
  },
  {
    en: "Look at your phone. See who sent each text. Click the real text from Google.",
    es: "Mira tu teléfono. Fíjate quién envió cada mensaje. Haz clic en el mensaje real de Google.",
  },
  {
    en: "Type the 6 numbers from that text. Then click Verify.",
    es: "Escribe los 6 números de ese mensaje. Después haz clic en Verificar.",
  },
];

/** Step 1 in a lesson, where the password is on the info card. */
export const LESSON_FIRST_STEP: Localized = {
  en: "Type the password from your info card. Then click Sign in.",
  es: "Escribe la contraseña de tu tarjeta de información. Después haz clic en Iniciar sesión.",
};

export const HELP_LESSON: Record<Lang, Lesson> = {
  en: {
    t: "Getting back in after you are signed out",
    s: [
      "Type your password.",
      "The account sends a text message with a code to your phone. It takes a few seconds.",
      "Find the real code. Look at who sent the text. The real code comes from the account, not from a phone number or a coworker.",
      "A real code text never asks you to reply with the code. If a text asks for your code, it is a trick.",
      "Type the numbers exactly as they appear. Never give the code to anyone.",
    ],
    tip: "This happens to everyone. It is not a mistake. Work accounts do this to keep you safe.",
  },
  es: {
    t: "Volver a entrar cuando se cierra tu sesión",
    s: [
      "Escribe tu contraseña.",
      "La cuenta te envía un mensaje de texto con un código al teléfono. Tarda unos segundos.",
      "Busca el código real. Mira quién envió el mensaje. El código real viene de la cuenta, no de un número de teléfono ni de un compañero.",
      "Un mensaje con un código real nunca te pide que respondas con el código. Si un mensaje te pide tu código, es una trampa.",
      "Escribe los números tal como aparecen. Nunca le des el código a nadie.",
    ],
    tip: "Esto le pasa a cualquiera. No es un error. Las cuentas del trabajo hacen esto para protegerte.",
  },
};

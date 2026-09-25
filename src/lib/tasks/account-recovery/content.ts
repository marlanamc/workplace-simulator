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
 * code. The learner has to pick the real one out of the ad and the coworker's
 * text: the same "read the whole list" skill as picking a file or an email.
 * They stay on screen, so the code is still readable while it is typed.
 */
export const TEXTS: RecoveryText[] = [
  {
    key: "promo",
    from: "Cafe Rewards",
    body: { en: "Buy 5 coffees, get 1 free. This week only!", es: "Compra 5 cafés y llévate 1 gratis. ¡Solo esta semana!" },
    when: { en: "2 min ago", es: "hace 2 min" },
    isTarget: false,
    wrongHint: wrongHint(
      "That text is an ad. Your code comes from Harborside Accounts.",
      "Ese mensaje es un anuncio. Tu código viene de Harborside Accounts."
    ),
  },
  {
    key: "code",
    from: "Harborside Accounts",
    body: { en: "Your verification code is 482915", es: "Tu código de verificación es 482915" },
    when: { en: "Now", es: "Ahora" },
    isTarget: true,
  },
  {
    key: "friend",
    from: "Sam",
    body: { en: "Running 5 min late, see you at open", es: "Llego 5 min tarde, nos vemos al abrir" },
    when: { en: "1 min ago", es: "hace 1 min" },
    isTarget: false,
    wrongHint: wrongHint(
      "That text is from Sam, a coworker. Your code comes from Harborside Accounts.",
      "Ese mensaje es de Sam, un compañero. Tu código viene de Harborside Accounts."
    ),
  },
];

/**
 * The password a lesson learner is given on their info card. Story mode has no
 * card, so there any password gets through; a lesson checks this one, because
 * typing a password exactly is the skill.
 */
export const LESSON_PASSWORD = "Harbor2026";

/** Spaces are not part of a code: "482 915" is the same code. */
export function codeMatches(typed: string): boolean {
  return typed.replace(/\s+/g, "") === CODE;
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
    heading: "Harborside Accounts",
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
    wrongCode: "That is not the code. Look at the text from Harborside Accounts on your phone. Type its 6 numbers.",
    sentKicker: "Signed back in",
    doneBody: "Getting signed out happens to everyone. Now you know the steps: type your password, find the real code, and type it in.",
    badgeName: "Get back into a locked account",
    badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    signInTitle: "Sign in",
    continueTo: "to continue to Harborside Cafe",
    verifyTitle: "Check your phone",
  },
  es: {
    heading: "Harborside Accounts",
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
    wrongCode: "Ese no es el código. Mira el mensaje de Harborside Accounts en tu teléfono. Escribe sus 6 números.",
    sentKicker: "Sesión iniciada",
    doneBody: "A todos se les cierra la sesión alguna vez. Ahora conoces los pasos: escribir tu contraseña, buscar el código real y escribirlo.",
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
    en: "Type your password. Then click Sign in.",
    es: "Escribe tu contraseña. Después haz clic en Iniciar sesión.",
  },
  {
    en: "Look at your phone. Click the text from Harborside Accounts.",
    es: "Mira tu teléfono. Haz clic en el mensaje de Harborside Accounts.",
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
    t: "Getting back into a locked account",
    s: [
      "Type your password.",
      "The account sends a text message with a code to your phone. It takes a few seconds.",
      "Find the real code. It comes from the account, not from an ad or a friend.",
      "Type the numbers exactly as they appear.",
    ],
    tip: "This happens to everyone. It is not a mistake. Work accounts do this to keep you safe.",
  },
  es: {
    t: "Volver a entrar a una cuenta bloqueada",
    s: [
      "Escribe tu contraseña.",
      "La cuenta te envía un mensaje de texto con un código al teléfono. Tarda unos segundos.",
      "Busca el código real. Viene de la cuenta, no de un anuncio ni de un amigo.",
      "Escribe los números tal como aparecen.",
    ],
    tip: "Esto le pasa a cualquiera. No es un error. Las cuentas del trabajo hacen esto para protegerte.",
  },
};

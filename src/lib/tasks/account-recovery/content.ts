import type { ConfidenceOption, EventIntroCopy, Lang, Localized, PickableItem } from "@/lib/task-types";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "🔒",
    kicker: "Monday morning",
    headline: "You're signed out. Get back in.",
    body: "The work account logged you out over the weekend. Sign back in, then find the code it texts you - it won't let you in without it.",
    cta: "Open Sign In",
  },
  es: {
    emoji: "🔒",
    kicker: "Lunes por la mañana",
    headline: "Cerraste sesión. Vuelve a entrar.",
    body: "La cuenta de trabajo cerró tu sesión durante el fin de semana. Vuelve a entrar, luego busca el código que te envía por mensaje de texto - no te dejará entrar sin él.",
    cta: "Abrir inicio de sesión",
  },
};

const wrongHint = (en: string, es: string): Localized => ({ en, es });

/** Fake texts a learner has to sort through to find the real verification code - same "read the whole list" skill as picking a file or an email. */
export const TEXTS: PickableItem[] = [
  {
    key: "promo",
    label: "Cafe Rewards: Buy 5 get 1 free this week only!",
    columns: ["2 min ago"],
    isTarget: false,
    wrongHint: wrongHint(
      "That's an ad. Your code is a 6-digit number, sent from Harborside Accounts.",
      "Eso es un anuncio. Tu código es un número de 6 dígitos, enviado por Harborside Accounts."
    ),
  },
  {
    key: "code",
    label: "Harborside Accounts: Your verification code is 482915",
    columns: ["1 min ago"],
    isTarget: true,
  },
  {
    key: "friend",
    label: "Sam: running 5 min late, see you at open",
    columns: ["Just now"],
    isTarget: false,
    wrongHint: wrongHint(
      "That's a text from a coworker, not your code.",
      "Ese es un mensaje de un compañero, no tu código."
    ),
  },
];

export const CODE = "482915";

export const RECOVERY_COPY: Record<Lang, {
  heading: string;
  subhead: string;
  helpBtn: string;
  usernameLabel: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  signIn: string;
  codeSentTitle: string;
  codeSentBody: string;
  findCodeBtn: string;
  codeLabel: string;
  codePlaceholder: string;
  submitCode: string;
  pickerTitle: string;
  categoryLabel: string;
  columnLabel: string;
  cancel: string;
  wrongCode: string;
  sentKicker: string;
  doneBody: string;
  badgeName: string;
  badgeWhere: string;
  confidenceQ: string;
  tryAgain: string;
  backToDesk: string;
}> = {
  en: {
    heading: "Harborside Accounts",
    subhead: "Sign back in to your work account.",
    helpBtn: "Help me with this step",
    usernameLabel: "Username",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    signIn: "Sign in",
    codeSentTitle: "We texted you a code",
    codeSentBody: "Check your phone's messages. Find the one from Harborside Accounts, not an ad or a text from a coworker.",
    findCodeBtn: "Check my texts",
    codeLabel: "Enter the 6-digit code",
    codePlaceholder: "000000",
    submitCode: "Verify",
    pickerTitle: "Messages",
    categoryLabel: "Texts",
    columnLabel: "When",
    cancel: "Close",
    wrongCode: "That's not the code from the text. Type the 6 digits exactly as they appeared.",
    sentKicker: "Signed back in",
    doneBody: "Getting locked out happens to everyone. Now you know the steps: sign in, find the real code, type it in.",
    badgeName: "Get back into a locked account",
    badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    confidenceQ: "How do you feel about doing this on your own phone?",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
  },
  es: {
    heading: "Harborside Accounts",
    subhead: "Vuelve a iniciar sesión en tu cuenta de trabajo.",
    helpBtn: "Ayúdame con este paso",
    usernameLabel: "Usuario",
    passwordLabel: "Contraseña",
    passwordPlaceholder: "Escribe tu contraseña",
    signIn: "Iniciar sesión",
    codeSentTitle: "Te enviamos un código por mensaje",
    codeSentBody: "Revisa los mensajes de tu teléfono. Busca el de Harborside Accounts, no un anuncio ni un mensaje de un compañero.",
    findCodeBtn: "Revisar mis mensajes",
    codeLabel: "Escribe el código de 6 dígitos",
    codePlaceholder: "000000",
    submitCode: "Verificar",
    pickerTitle: "Mensajes",
    categoryLabel: "Textos",
    columnLabel: "Cuándo",
    cancel: "Cerrar",
    wrongCode: "Ese no es el código del mensaje. Escribe los 6 dígitos exactamente como aparecieron.",
    sentKicker: "Sesión iniciada",
    doneBody: "Quedarse fuera le pasa a cualquiera. Ahora conoces los pasos: iniciar sesión, buscar el código real, escribirlo.",
    badgeName: "Volver a entrar a una cuenta bloqueada",
    badgeWhere: "Cuenta para: Oficina · Servicio de alimentos",
    confidenceQ: "¿Cómo te sientes de hacer esto en tu propio teléfono?",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
  },
};

export const CONFIDENCE_OPTIONS: Record<Lang, ConfidenceOption[]> = {
  en: [
    { label: "Still unsure", reply: "That's honest. Do the task one more time, or come on Wednesday and we can do it together." },
    { label: "I could try", reply: "Good. Try it again without Help. That is how it will feel at work." },
    { label: "I can do this", reply: "You just did it with no help. Use the Next button below to keep going." },
  ],
  es: [
    { label: "Todavía dudo", reply: "Eso es honesto. Hazlo otra vez, o ven el miércoles y lo hacemos juntos." },
    { label: "Podría intentarlo", reply: "Bien. Inténtalo otra vez sin Ayuda. Así se siente en el trabajo." },
    { label: "Puedo hacerlo", reply: "Lo hiciste sin ayuda. Usa el botón de Siguiente abajo para seguir." },
  ],
};

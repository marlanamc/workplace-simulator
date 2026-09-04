import type { EventIntroCopy, Lang, Lesson } from "@/lib/task-types";

/** First-day welcome, personalized with the learner's first name. */
export function tourEventIntro(lang: Lang, displayName: string): EventIntroCopy {
  const name = displayName.trim() || (lang === "en" ? "friend" : "amiga");
  if (lang === "es") {
    return {
      emoji: "☕",
      kicker: "Tu primer día",
      headline: `¡Bienvenida ${name}!`,
      subheadline: "Eres personal nuevo en Harborside Cafe. Esta semana tienes 5 turnos. Me alegra que estés aquí.",
      body: "Tómate tu tiempo para aprender cómo funciona. No puedes romper nada.",
      cta: "Enséñame",
    };
  }
  return {
    emoji: "☕",
    kicker: "Your first day",
    headline: `Welcome ${name}!`,
      subheadline: "You're a new hire at Harborside Cafe. This week you have 5 shifts. Glad you're here.",
      body: "Take your time learning how things work. You cannot break anything.",
    cta: "Show me around",
  };
}

/** @deprecated Prefer tourEventIntro(lang, displayName). Kept for type-shape checks. */
export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: tourEventIntro("en", "friend"),
  es: tourEventIntro("es", "amiga"),
};

export const TOUR_COPY: Record<Lang, {
  packetKicker: string;
  packetTitle: string;
  helpBtn: string;
  helpLead: string;
  helpInvite: string;
  helpOpened: string;
  helpReady: string;
  sentKicker: string;
  doneTitle: string;
  doneBody: string;
  badgeName: string;
  badgeWhere: string;
  tryAgain: string;
  backToDesk: string;
  lessonKicker: string;
  tipLabel: string;
  gotIt: string;
  askPerson: string;
}> = {
  en: {
    packetKicker: "Harborside Cafe · New hire",
    packetTitle: "Welcome. How this computer works.",
    helpBtn: "Help me with this step",
    helpLead: "Now try Help.",
    helpInvite: "Open it if you want a look, or move on if you already know. Help never counts against you.",
    helpOpened: "Good. Come back any time you get lost.",
    helpReady: "I'm ready for the task",
    sentKicker: "You're set",
    doneTitle: "You found the lights.",
    doneBody: "Head back to the desktop and we will finish the tour there.",
    badgeName: "Find your way around",
    badgeWhere: "Counts toward: getting started",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
    askPerson: "Ask a person instead",
  },
  es: {
    packetKicker: "Harborside Cafe · Personal nuevo",
    packetTitle: "Bienvenida. Cómo funciona esta computadora.",
    helpBtn: "Ayúdame con este paso",
    helpLead: "Ahora prueba Ayuda.",
    helpInvite: "Ábrela si quieres verla, o sigue adelante si ya sabes. Ayuda nunca cuenta en tu contra.",
    helpOpened: "Bien. Vuelve aquí cada vez que te pierdas.",
    helpReady: "Estoy listo para la tarea",
    sentKicker: "Listo",
    doneTitle: "Encontraste las luces.",
    doneBody: "Botón blanco en el escritorio: el siguiente trabajo. Signo de interrogación: Ayuda. El maletín en la barra de abajo: tu lista de este turno. Siguiente siempre es el botón azul.",
    badgeName: "Orientarte",
    badgeWhere: "Cuenta para: empezar",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Ya. Volver a mi tarea",
    askPerson: "Preguntarle a una persona",
  },
};

export type TourStep = {
  instruction: string;
  /** Bookmark chip to spotlight via `data-testid="bookmark-{key}"`. */
  targetTabKey?: string;
  /** Non-bookmark target via `data-testid`. Click advances (the card's ?). */
  targetTestId?: string;
  /**
   * Look beat: stay on this app and advance only when they tap the button.
   * Use after opening Mail/Calendar so they notice what the app is for.
   */
  continueLabel?: string;
};


export const TOUR_STEPS: Record<Lang, TourStep[]> = {
  en: [
    {
      instruction:
        "On a real computer, you type a web address in the bar at the top and use the back arrow to go back. Here, you get around with the bookmarks on the row below it.",
      continueLabel: "Show me the bookmarks",
    },
    { instruction: "Click Mail.", targetTabKey: "mail" },
    {
      instruction: "This is your work email. Messages from your manager, coworkers, and vendors show up here.",
      targetTestId: "mail-app-title",
      continueLabel: "Got it",
    },
    { instruction: "Now click Calendar.", targetTabKey: "calendar" },
    {
      instruction: "This is your work calendar. Meetings and your work shifts show up here.",
      targetTabKey: "calendar",
      continueLabel: "Got it",
    },
    {
      instruction: "Tap the ? on this card if you get lost. It explains this job.",
      targetTestId: "job-card-help",
    },
  ],
  es: [
    {
      instruction:
        "En una computadora de verdad, escribes una dirección web en la barra de arriba y usas la flecha para regresar. Aquí te mueves con los marcadores de la fila de abajo.",
      continueLabel: "Muéstrame los marcadores",
    },
    { instruction: "Haz clic en Correo.", targetTabKey: "mail" },
    {
      instruction: "Este es tu correo del trabajo. Aquí llegan mensajes de tu gerente, compañeros y proveedores.",
      targetTestId: "mail-app-title",
      continueLabel: "Entendido",
    },
    { instruction: "Ahora haz clic en Calendario.", targetTabKey: "calendar" },
    {
      instruction: "Este es tu calendario del trabajo. Aquí aparecen las reuniones y tus turnos de trabajo.",
      targetTabKey: "calendar",
      continueLabel: "Entendido",
    },
    {
      instruction: "Toca el ? en esta tarjeta si te pierdes. Explica este trabajo.",
      targetTestId: "job-card-help",
    },
  ],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Where to look",
      s: [
        "The blue card in the corner says what to do next.",
        "Lost? Tap the ? on this card.",
        "Card in the way? Drag it, or tap the arrow to hide it.",
      ],
      tip: "The card is always current. When in doubt, read it.",
    },
  ],
  es: [
    {
      t: "Dónde mirar",
      s: [
        "La tarjeta azul de la esquina dice qué hacer.",
        "¿Te perdiste? Toca el ? en esta tarjeta.",
        "¿Te estorba? Arrástrala, o toca la flecha para ocultarla.",
      ],
      tip: "La tarjeta siempre está al día. Si dudas, léela.",
    },
  ],
};

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
  /**
   * Ring `targetTestId` even though this is a look beat. Default off: a look
   * beat right after a tab-switching click step measures a stale position
   * (see TourWalkthrough). Only safe for a look beat with nothing before it
   * that could have moved the target, e.g. the very first step.
   */
  ringOnLook?: boolean;
};


export const TOUR_STEPS: Record<Lang, TourStep[]> = {
  en: [
    {
      instruction: "These are your bookmarks. Each one opens an app you use for work.",
      targetTestId: "bookmarks-row",
      continueLabel: "Show me",
      ringOnLook: true,
    },
    { instruction: "Click Mail.", targetTabKey: "mail" },
    {
      instruction: "This is your work email. Messages from your manager, coworkers, and vendors show up here.",
      targetTestId: "mail-app-title",
      continueLabel: "Got it",
    },
    {
      instruction: "Tap the ? on this card if you get lost. It explains this job.",
      targetTestId: "job-card-help",
    },
  ],
  es: [
    {
      instruction: "Estos son tus marcadores. Cada uno abre una app que usas para el trabajo.",
      targetTestId: "bookmarks-row",
      continueLabel: "Muéstramelos",
      ringOnLook: true,
    },
    { instruction: "Haz clic en Correo.", targetTabKey: "mail" },
    {
      instruction: "Este es tu correo del trabajo. Aquí llegan mensajes de tu gerente, compañeros y proveedores.",
      targetTestId: "mail-app-title",
      continueLabel: "Entendido",
    },
    {
      instruction: "Toca el ? en esta tarjeta si te pierdes. Explica este trabajo.",
      targetTestId: "job-card-help",
    },
  ],
};

/**
 * Level 4, once: a 1-step callback to the Calendar bookmark shown on Day
 * One's tour but not used since. Reminds, doesn't re-teach - the spotlight
 * ring is the whole reminder. From Act II on, the Job Card shows the task's
 * own goal line instead of a reported step's line (see JobCard.tsx), so
 * `instruction` here never actually renders; it exists only to satisfy
 * TourStep and TourWalkthrough's reportStep call.
 */
export const CALENDAR_REMINDER_FLAG = "calendar-reminder-seen";
export const CALENDAR_REMINDER_STEPS: Record<Lang, TourStep[]> = {
  en: [
    {
      instruction: "Remember Calendar from your first day? Click it.",
      targetTabKey: "calendar",
    },
  ],
  es: [
    {
      instruction: "¿Recuerdas Calendar de tu primer día? Haz clic ahí.",
      targetTabKey: "calendar",
    },
  ],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Where to look",
      s: [
        "This blue card in the corner tells you what to do next.",
        "Lost? Tap the ? on this card.",
        "Card in the way? Drag it, or tap the arrow to shrink it.",
      ],
      tip: "This card always tells you what to do next. Read it if you are not sure.",
    },
  ],
  es: [
    {
      t: "Dónde mirar",
      s: [
        "Esta tarjeta azul de la esquina te dice qué hacer.",
        "¿Te perdiste? Toca el ? en esta tarjeta.",
        "¿Te estorba? Arrástrala, o toca la flecha para encogerla.",
      ],
      tip: "Esta tarjeta siempre te dice qué hacer. Léela si no estás segura.",
    },
  ],
};

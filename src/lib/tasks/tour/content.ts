import type { ConfidenceOption, EventIntroCopy, Lang, Lesson } from "@/lib/task-types";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "💻",
    kicker: "Before you clock in",
    headline: "This is a practice computer.",
    body: "Nothing here is real. You cannot break it. Take one minute to find the lights, then the job starts.",
    cta: "Show me around",
  },
  es: {
    emoji: "💻",
    kicker: "Antes de marcar entrada",
    headline: "Esta es una computadora de práctica.",
    body: "Nada aquí es real. No la puedes romper. Tómate un minuto para encontrar las luces. Luego empieza el trabajo.",
    cta: "Enséñame",
  },
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
  confidenceQ: string;
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
    helpLead: "Now try Help. Click the ? at the top right.",
    helpInvite: "Try it if you want. It will not count against you. Use it any time you feel stuck.",
    helpOpened: "Good. That is Help. Use it any time you feel stuck.",
    helpReady: "I'm ready for the job",
    sentKicker: "You're set",
    doneTitle: "You found the lights.",
    doneBody: "White button on the desktop: next job. Question mark: Help. Target on the bottom bar: your list for this shift. Next is always the blue button.",
    badgeName: "Find your way around",
    badgeWhere: "Counts toward: getting started",
    confidenceQ: "Do you know where to look if you get stuck?",
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
    helpLead: "Ahora prueba Ayuda. Haz clic en el ? de arriba a la derecha.",
    helpInvite: "Pruébalo si quieres. No cuenta en tu contra. Úsala cada vez que te trabes.",
    helpOpened: "Bien. Eso es Ayuda. Úsala cada vez que te trabes.",
    helpReady: "Estoy listo para el trabajo",
    sentKicker: "Listo",
    doneTitle: "Encontraste las luces.",
    doneBody: "Botón blanco en el escritorio: el siguiente trabajo. Signo de interrogación: Ayuda. Diana en la barra de abajo: tu lista de este turno. Siguiente siempre es el botón azul.",
    badgeName: "Orientarte",
    badgeWhere: "Cuenta para: empezar",
    confidenceQ: "¿Sabes dónde mirar si te trabas?",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Ya. Volver a mi tarea",
    askPerson: "Preguntarle a una persona",
  },
};

export const TOUR_STEPS: Record<Lang, { instruction: string; targetTabKey: string }[]> = {
  en: [
    { instruction: "Click Mail.", targetTabKey: "mail" },
    { instruction: "Now click Calendar.", targetTabKey: "calendar" },
  ],
  es: [
    { instruction: "Haz clic en Correo.", targetTabKey: "mail" },
    { instruction: "Ahora haz clic en Calendario.", targetTabKey: "calendar" },
  ],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Where to look",
      s: [
        "The big white button on your desktop opens the next job.",
        "Inside a job, the ? at the top right is Help. Use it any time.",
        "The target on the bottom bar is your list for this shift. Open it if you forget what to do.",
        "When you finish, the blue button is Next. It takes you to the right place.",
      ],
      tip: "If you get lost, go back to the desktop. The briefing always names the next job.",
    },
  ],
  es: [
    {
      t: "Dónde mirar",
      s: [
        "El botón blanco grande en tu escritorio abre el siguiente trabajo.",
        "Dentro de un trabajo, el ? de arriba a la derecha es Ayuda. Úsalo cuando quieras.",
        "La diana en la barra de abajo es tu lista de este turno. Ábrela si se te olvida qué hacer.",
        "Cuando termines, el botón azul es Siguiente. Te lleva al lugar correcto.",
      ],
      tip: "Si te pierdes, vuelve al escritorio. El aviso siempre nombra el siguiente trabajo.",
    },
  ],
};

export const CONFIDENCE_OPTIONS: Record<Lang, ConfidenceOption[]> = {
  en: [
    { label: "Still unsure", reply: "That's honest. Open Help with the ? any time. Or do this page one more time." },
    { label: "I could try", reply: "Good. If you get stuck, click the ?. Then use the blue Next button." },
    { label: "I can do this", reply: "You just did it. Use the Next button below. Maria already emailed you." },
  ],
  es: [
    { label: "Todavía dudo", reply: "Eso es honesto. Abre Ayuda con el ? cuando quieras. O haz esta página otra vez." },
    { label: "Podría intentarlo", reply: "Bien. Si te trabas, haz clic en el ?. Luego usa el botón azul de Siguiente." },
    { label: "Puedo hacerlo", reply: "Lo acabas de hacer. Usa el botón de Siguiente abajo. Maria ya te envió un correo." },
  ],
};

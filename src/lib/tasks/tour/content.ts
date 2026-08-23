import type { EventIntroCopy, Lang, Lesson } from "@/lib/task-types";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "☕",
    kicker: "Your first day",
    headline: "Welcome to Harborside Cafe!",
    body: "You got the job. This is your work computer — a practice one. Nothing here is real. You cannot break it. Let's find the lights before your shift starts.",
    cta: "Show me around",
  },
  es: {
    emoji: "☕",
    kicker: "Tu primer día",
    headline: "Te damos la bienvenida a Harborside Cafe.",
    body: "Conseguiste el trabajo. Esta es tu computadora de trabajo — una de práctica. Nada aquí es real. No la puedes romper. Vamos a encontrar las luces antes de que empiece tu turno.",
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
    doneBody: "White button on the desktop: next job. Question mark: Help. The briefcase on the bottom bar: your list for this shift. Next is always the blue button.",
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
    helpLead: "Ahora prueba Ayuda. Haz clic en el ? de arriba a la derecha.",
    helpInvite: "Pruébalo si quieres. No cuenta en tu contra. Úsala cada vez que te trabes.",
    helpOpened: "Bien. Eso es Ayuda. Úsala cada vez que te trabes.",
    helpReady: "Estoy listo para el trabajo",
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
        "The briefcase on the bottom bar is My job — your list for this shift. Open it if you forget what to do.",
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
        "El maletín en la barra de abajo es Mi trabajo: tu lista de este turno. Ábrelo si se te olvida qué hacer.",
        "Cuando termines, el botón azul es Siguiente. Te lleva al lugar correcto.",
      ],
      tip: "Si te pierdes, vuelve al escritorio. El aviso siempre nombra el siguiente trabajo.",
    },
  ],
};


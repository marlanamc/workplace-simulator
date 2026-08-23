import type { EventIntroCopy, Lang, Lesson, Localized } from "@/lib/task-types";

export const EVENT_INTRO: Record<Lang, EventIntroCopy> = {
  en: {
    emoji: "🤒",
    kicker: "Uh oh",
    headline: "You feel sick and you are not sure what to do.",
    body: "Tomorrow you have a shift, but you don't think you can make it. Before you guess, check the handbook for how to call out sick.",
    cta: "Check the handbook",
  },
  es: {
    emoji: "🤒",
    kicker: "Uy no",
    headline: "Te sientes enferma/o y no sabes qué hacer.",
    body: "Tu turno es mañana, pero no crees que puedas ir. Antes de adivinar, revisa el manual para ver cómo avisar que estás enfermo.",
    cta: "Revisar el manual",
  },
};

export interface CheckOption {
  label: string;
  isTarget: boolean;
  wrongHint?: Localized;
}

export const SCENARIO_CHECK: Record<Lang, { scenario: string; question: string; options: CheckOption[] }> = {
  en: {
    scenario: "Jordan, I heard you might not make it tomorrow. The handbook says how early you have to tell us. Can you check and tell me? I need to cover your shift.",
    question: "How early do I have to call if I can't come in?",
    options: [
      {
        label: "At least 2 hours before",
        isTarget: true,
      },
      {
        label: "30 minutes before",
        isTarget: false,
        wrongHint: {
          en: "That's how long a meal break is, not how early you must call out. Check the \"Calling out sick\" article again.",
          es: "Esa es la duración de un descanso para comer, no la ventana para avisar. Revisa otra vez el artículo \"Cómo avisar si estás enfermo\".",
        },
      },
      {
        label: "Anytime before midnight",
        isTarget: false,
        wrongHint: {
          en: "The handbook gives an exact number of hours. Look at the \"Calling out sick\" article again.",
          es: "El manual da un número exacto de horas. Revisa otra vez el artículo \"Cómo avisar si estás enfermo\".",
        },
      },
    ],
  },
  es: {
    scenario: "Jordan, oí que tal vez no puedas venir mañana. El manual dice con cuánta anticipación hay que avisarnos. ¿Puedes revisar y decirme? Necesito cubrir tu turno.",
    question: "¿Con cuánta anticipación tengo que llamar si no puedo ir?",
    options: [
      {
        label: "Al menos 2 horas antes",
        isTarget: true,
      },
      {
        label: "30 minutos antes",
        isTarget: false,
        wrongHint: {
          en: "That's how long a meal break is, not how early you must call out. Check the \"Calling out sick\" article again.",
          es: "Esa es la duración de un descanso para comer, no la ventana para avisar. Revisa otra vez el artículo \"Cómo avisar si estás enfermo\".",
        },
      },
      {
        label: "En cualquier momento antes de la medianoche",
        isTarget: false,
        wrongHint: {
          en: "The handbook gives an exact number of hours. Look at the \"Calling out sick\" article again.",
          es: "El manual da un número exacto de horas. Revisa otra vez el artículo \"Cómo avisar si estás enfermo\".",
        },
      },
    ],
  },
};

export const HANDBOOK_TASK_COPY: Record<Lang, {
  scenarioKicker: string;
  helpBtn: string;
  langBtn: string;
  answerLabel: string;
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
    scenarioKicker: "Today's situation",
    helpBtn: "Help me with this step",
    langBtn: "Español",
    answerLabel: "Once you've found it",
    sentKicker: "Checked",
    doneTitle: "You found the real answer instead of guessing.",
    doneBody: "The handbook had the real rule. Checking it was faster than guessing wrong.",
    badgeName: "Look something up when you feel rushed",
    badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
    askPerson: "Ask a person instead",
  },
  es: {
    scenarioKicker: "La situación de hoy",
    helpBtn: "Ayúdame con este paso",
    langBtn: "English",
    answerLabel: "Cuando lo encuentres",
    sentKicker: "Revisado",
    doneTitle: "Encontraste la respuesta real en vez de adivinar.",
    doneBody: "El manual tenía la política exacta. Revisarlo tomó menos tiempo que adivinar mal.",
    badgeName: "Buscar algo bajo presión",
    badgeWhere: "Cuenta para: Oficina · Servicio de alimentos",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
    askPerson: "Mejor preguntar a una persona",
  },
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Finding the right article",
      s: [
        "Use the search box, or scan the section labels on the left.",
        "Match the words in the story to the article title. \"Sick\" points to \"Calling out sick.\"",
        "Read the whole article before you answer. The exact number or rule is usually in the first line or two.",
      ],
      tip: "Guessing feels faster, but checking takes less time than fixing a guess that was wrong.",
    },
  ],
  es: [
    {
      t: "Encontrar el artículo correcto",
      s: [
        "Usa la caja de búsqueda, o revisa las secciones a la izquierda.",
        "Relaciona las palabras de la situación con el título del artículo. \"Enfermo\" apunta a \"Cómo avisar si estás enfermo\".",
        "Lee todo el artículo antes de responder. El número o la regla exacta suele estar en las primeras líneas.",
      ],
      tip: "Adivinar parece más rápido, pero revisar toma menos tiempo que arreglar una respuesta equivocada.",
    },
  ],
};


import type { ConfidenceOption, Lang, Lesson, Localized } from "@/lib/task-types";

export interface CheckOption {
  label: string;
  isTarget: boolean;
  wrongHint?: Localized;
}

export const SCENARIO_CHECK: Record<Lang, { scenario: string; question: string; options: CheckOption[] }> = {
  en: {
    scenario: "You're feeling sick and don't think you can work tomorrow's shift. Search or browse the Handbook for the call-out policy, then answer the question below.",
    question: "How soon before your shift should you call or text your shift lead?",
    options: [
      {
        label: "At least 2 hours before",
        isTarget: true,
      },
      {
        label: "30 minutes before",
        isTarget: false,
        wrongHint: {
          en: "That's how long a meal break is, not the call-out window. Check the \"Calling out sick\" article again.",
          es: "Esa es la duración de un descanso para comer, no la ventana para avisar. Revisa otra vez el artículo \"Cómo avisar si estás enfermo\".",
        },
      },
      {
        label: "Anytime before midnight",
        isTarget: false,
        wrongHint: {
          en: "The handbook gives an exact number of hours — look at the \"Calling out sick\" article again.",
          es: "El manual da un número exacto de horas — revisa otra vez el artículo \"Cómo avisar si estás enfermo\".",
        },
      },
    ],
  },
  es: {
    scenario: "Te sientes enferma/o y crees que no podrás trabajar tu turno de mañana. Busca en el Manual la política de cómo avisar, y luego responde la pregunta.",
    question: "¿Con cuánto tiempo antes de tu turno debes llamar o enviar un mensaje a tu líder de turno?",
    options: [
      {
        label: "Al menos 2 horas antes",
        isTarget: true,
      },
      {
        label: "30 minutos antes",
        isTarget: false,
        wrongHint: {
          en: "That's how long a meal break is, not the call-out window. Check the \"Calling out sick\" article again.",
          es: "Esa es la duración de un descanso para comer, no la ventana para avisar. Revisa otra vez el artículo \"Cómo avisar si estás enfermo\".",
        },
      },
      {
        label: "En cualquier momento antes de la medianoche",
        isTarget: false,
        wrongHint: {
          en: "The handbook gives an exact number of hours — look at the \"Calling out sick\" article again.",
          es: "El manual da un número exacto de horas — revisa otra vez el artículo \"Cómo avisar si estás enfermo\".",
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
  confidenceQ: string;
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
    doneBody: "The handbook had the exact policy — checking it took less time than guessing wrong would have cost you.",
    badgeName: "Look something up under pressure",
    badgeWhere: "Counts toward: Office Ready · Food Service Ready",
    confidenceQ: "How do you feel about looking something up instead of guessing?",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it — back to my task",
    askPerson: "Ask a person instead",
  },
  es: {
    scenarioKicker: "La situación de hoy",
    helpBtn: "Ayúdame con este paso",
    langBtn: "English",
    answerLabel: "Cuando lo encuentres",
    sentKicker: "Revisado",
    doneTitle: "Encontraste la respuesta real en vez de adivinar.",
    doneBody: "El manual tenía la política exacta — revisarlo tomó menos tiempo del que te habría costado adivinar mal.",
    badgeName: "Buscar algo bajo presión",
    badgeWhere: "Cuenta para: Oficina · Servicio de alimentos",
    confidenceQ: "¿Cómo te sientes de buscar algo en vez de adivinar?",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido — volver a mi tarea",
    askPerson: "Mejor preguntar a una persona",
  },
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "Finding the right article",
      s: [
        "Use the search box, or scan the section labels on the left.",
        "Match the words in the scenario to the article title — \"sick\" points to \"Calling out sick.\"",
        "Read the whole article before answering — the exact number or rule is usually in the first line or two.",
      ],
      tip: "Guessing feels faster, but checking takes less time than fixing a guess that was wrong.",
    },
  ],
  es: [
    {
      t: "Encontrar el artículo correcto",
      s: [
        "Usa la caja de búsqueda, o revisa las secciones a la izquierda.",
        "Relaciona las palabras de la situación con el título del artículo — \"enfermo\" apunta a \"Cómo avisar si estás enfermo\".",
        "Lee todo el artículo antes de responder — el número o la regla exacta suele estar en las primeras líneas.",
      ],
      tip: "Adivinar parece más rápido, pero revisar toma menos tiempo que arreglar una respuesta equivocada.",
    },
  ],
};

export const CONFIDENCE_OPTIONS: Record<Lang, ConfidenceOption[]> = {
  en: [
    { label: "Still unsure", reply: "That's honest — do the task once more, or bring it to Wednesday drop-in and we'll do it together." },
    { label: "I could try", reply: "Good. Try it again without guided mode — that's how it will feel at work." },
    { label: "I can do this", reply: "You just did it with no help — you've now used every app in the simulator. Nice work." },
  ],
  es: [
    { label: "Todavía dudo", reply: "Eso es honesto — hazlo otra vez, o ven el miércoles y lo hacemos juntos." },
    { label: "Podría intentarlo", reply: "Bien. Inténtalo otra vez sin el modo guiado — así se siente en el trabajo." },
    { label: "Puedo hacerlo", reply: "Lo hiciste sin ayuda — ya usaste todas las apps del simulador. Buen trabajo." },
  ],
};

import type { Lang, Lesson, Localized } from "@/lib/task-types";

/**
 * Level 25 — The Review. Write a short, honest performance note for one team
 * member: one real strength, one real area to grow, in a tone that is
 * constructive, not harsh or vague.
 *
 * The most personally vulnerable lesson since Level 2's incident report.
 * Teacher-check: the app checks that both halves are written and specific
 * enough — it does NOT try to detect "harsh". That is unscoreable, and a
 * false reject here is the most damaging in the program.
 */

export interface ReviewProfile {
  name: string;
  role: Localized;
  wins: Localized[];
  issue: Localized;
}

export const PROFILE: ReviewProfile = {
  name: "Sam Rivera",
  role: { en: "Barista, on the team 8 months", es: "Barista, 8 meses en el equipo" },
  wins: [
    { en: "Trained two new hires this month and stayed patient with both.", es: "Capacitó a dos personas nuevas este mes y tuvo paciencia con las dos." },
    { en: "Caught a delivery that was short three boxes and flagged it same day.", es: "Notó una entrega que venía corta por tres cajas y lo reportó el mismo día." },
    { en: "Covered two close shifts on short notice.", es: "Cubrió dos cierres avisando con poco tiempo." },
  ],
  issue: {
    en: "Runs late for the morning open about once a week — usually 10 to 15 minutes.",
    es: "Llega tarde a la apertura de la mañana como una vez por semana — casi siempre de 10 a 15 minutos.",
  },
};

export const REVIEW_COPY: Record<Lang, {
  appName: string;
  helpBtn: string;
  formTitle: string;
  profileKicker: string;
  winsLabel: string;
  issueLabel: string;
  strengthLabel: string;
  strengthPlaceholder: string;
  areaLabel: string;
  areaPlaceholder: string;
  submit: string;
  needStrength: string;
  needArea: string;
  vagueStrength: string;
  sentKicker: string;
  tryAgain: string;
  backToDesk: string;
  lessonKicker: string;
  tipLabel: string;
  gotIt: string;
}> = {
  en: {
    appName: "Review",
    helpBtn: "Help me with this step",
    formTitle: "Monthly review — one team member",
    profileKicker: "This month",
    winsLabel: "What went well",
    issueLabel: "One thing to watch",
    strengthLabel: "A strength",
    strengthPlaceholder: "Something specific they actually did…",
    areaLabel: "An area to grow",
    areaPlaceholder: "What needs to change, and what better would look like…",
    submit: "Submit the review",
    needStrength: "Name one specific thing they did well — not just \"good job\".",
    needArea: "Say what needs to change, and what better would look like.",
    vagueStrength: "Be specific. Point at something they actually did this month.",
    sentKicker: "Review submitted",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
  },
  es: {
    appName: "Evaluación",
    helpBtn: "Ayúdame con este paso",
    formTitle: "Evaluación del mes — una persona del equipo",
    profileKicker: "Este mes",
    winsLabel: "Lo que salió bien",
    issueLabel: "Algo para observar",
    strengthLabel: "Una fortaleza",
    strengthPlaceholder: "Algo concreto que de verdad hizo…",
    areaLabel: "Un área para mejorar",
    areaPlaceholder: "Qué necesita cambiar, y cómo se vería mejor…",
    submit: "Enviar la evaluación",
    needStrength: "Nombra algo concreto que hizo bien — no solo \"buen trabajo\".",
    needArea: "Di qué necesita cambiar, y cómo se vería mejor.",
    vagueStrength: "Sé concreto. Señala algo que de verdad hizo este mes.",
    sentKicker: "Evaluación enviada",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
  },
};

export const STRENGTH_STARTERS: Record<Lang, string[]> = {
  en: [
    "This month, Sam trained two new hires and kept their patience the whole time.",
    "Sam caught a short delivery the same day it came in.",
  ],
  es: [
    "Este mes, Sam capacitó a dos personas nuevas y mantuvo la paciencia todo el tiempo.",
    "Sam notó una entrega corta el mismo día que llegó.",
  ],
};

export const AREA_STARTERS: Record<Lang, string[]> = {
  en: [
    "The morning open needs Sam there by 6. Being on time every day would help the whole shift start clean.",
    "Sam runs about 10 minutes late once a week. I'd like that at zero.",
  ],
  es: [
    "La apertura de la mañana necesita a Sam ahí a las 6. Llegar a tiempo todos los días ayudaría a que el turno empiece bien.",
    "Sam llega como 10 minutos tarde una vez por semana. Me gustaría que eso llegue a cero.",
  ],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "One real strength, one real area to grow",
      s: [
        "Skip \"good job\" and \"needs improvement\". Both are too vague to use.",
        "For the strength, point at something concrete they did this month.",
        "For the area to grow, be clear about what needs to change — and say what better would look like, so it reads as help, not just a complaint.",
      ],
      tip: "There is no single right wording here. Fair and specific beats polished. If this feels hard, that's normal — being honest about someone else in writing is genuinely difficult.",
    },
  ],
  es: [
    {
      t: "Una fortaleza real, un área real para mejorar",
      s: [
        "Evita \"buen trabajo\" y \"necesita mejorar\". Las dos son demasiado vagas para servir.",
        "Para la fortaleza, señala algo concreto que hizo este mes.",
        "Para el área para mejorar, sé claro sobre qué necesita cambiar — y di cómo se vería mejor, para que se lea como ayuda y no solo como una queja.",
      ],
      tip: "Aquí no hay una sola forma correcta de decirlo. Justo y concreto vale más que pulido. Si se siente difícil, es normal — ser honesto por escrito sobre otra persona de verdad cuesta.",
    },
  ],
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  { en: "Read the team member's profile.", es: "Lee el perfil de la persona del equipo." },
  { en: "Write one specific strength — something they actually did.", es: "Escribe una fortaleza concreta — algo que de verdad hizo." },
  { en: "Write one area to grow, and what better looks like. Then submit.", es: "Escribe un área para mejorar, y cómo se ve mejor. Luego envía." },
];

const VAGUE_STRENGTH = /^(good job|great job|great work|good work|nice work|hard worker|team player|buen trabajo|muy bien|excelente|gran trabajo|trabaja bien)\.?$/i;

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function strengthIsSpecific(text: string): boolean {
  return wordCount(text) >= 4 && !VAGUE_STRENGTH.test(text.trim());
}

export function areaToGrowIsConstructive(text: string): boolean {
  return wordCount(text) >= 4;
}

export interface PerformanceReviewInput {
  strength: string;
  area: string;
}

export function performanceReviewPasses(input: PerformanceReviewInput): boolean {
  return strengthIsSpecific(input.strength) && areaToGrowIsConstructive(input.area);
}

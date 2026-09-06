import type { Lang, Lesson, Localized, SubmissionContent } from "@/lib/task-types";
import { WORK_HISTORY } from "@/lib/tasks/job-application/content";

/**
 * "Your Résumé" — the third step of the getting-hired arc. The learner turns
 * the completed simulated roles recorded for their selected path
 * into a one-page résumé: a short summary, one accomplishment bullet for each
 * of the top two roles, and the skills they've shown. Teacher-check: the app
 * confirms every part is filled; it does not grade the writing.
 */

export { WORK_HISTORY };

export const RESUME_COPY: Record<Lang, {
  appName: string;
  heading: string;
  intro: string;
  contactLabel: string;
  summaryLabel: string;
  summaryHint: string;
  experienceLabel: string;
  bulletHint: string;
  skillsLabel: string;
  skillsHint: string;
  previewLabel: string;
  save: string;
  needSummary: string;
  needBullets: string;
  needSkills: string;
  sentKicker: string;
  doneTitle: string;
  doneBody: string;
  tryAgain: string;
  backToDesk: string;
  lessonKicker: string;
  tipLabel: string;
  gotIt: string;
}> = {
  en: {
    appName: "Docs: Résumé",
    heading: "Build your résumé",
    intro: "Your completed simulated roles are listed. Add a summary line, one accomplishment for each of your last two roles, and the skills you've shown.",
    contactLabel: "Contact",
    summaryLabel: "Summary: one or two sentences",
    summaryHint: "Describe the skills you practiced here. This résumé is a simulation, not a record of paid employment.",
    experienceLabel: "Experience",
    bulletHint: "One thing you did well in this role. Start with an action word: ran, checked, trained, fixed.",
    skillsLabel: "Skills",
    skillsHint: "Check the ones you've actually done.",
    previewLabel: "Preview",
    save: "Save résumé",
    needSummary: "Write a summary line before you save.",
    needBullets: "Add one accomplishment for each of your top two roles.",
    needSkills: "Check at least three skills you've shown.",
    sentKicker: "Résumé saved",
    doneTitle: "You have a one-page résumé.",
    doneBody: "Summary, your two most recent roles with an accomplishment each, and your skills. That's all a first résumé needs.",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
  },
  es: {
    appName: "Docs: Currículum",
    heading: "Arma tu currículum",
    intro: "Tus puestos simulados completados están en la lista. Agrega una línea de resumen, un logro por cada uno de tus últimos dos puestos, y las habilidades que has mostrado.",
    contactLabel: "Contacto",
    summaryLabel: "Resumen: una o dos oraciones",
    summaryHint: "Describe las habilidades que practicaste aquí. Este currículum es una simulación, no un historial de empleo real.",
    experienceLabel: "Experiencia",
    bulletHint: "Una cosa que hiciste bien en este puesto. Empieza con un verbo: manejé, revisé, capacité, arreglé.",
    skillsLabel: "Habilidades",
    skillsHint: "Marca las que de verdad has hecho.",
    previewLabel: "Vista previa",
    save: "Guardar currículum",
    needSummary: "Escribe una línea de resumen antes de guardar.",
    needBullets: "Agrega un logro por cada uno de tus dos puestos principales.",
    needSkills: "Marca al menos tres habilidades que hayas mostrado.",
    sentKicker: "Currículum guardado",
    doneTitle: "Tienes un currículum de una página.",
    doneBody: "Resumen, tus dos puestos más recientes con un logro cada uno, y tus habilidades. Eso es todo lo que necesita un primer currículum.",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
  },
};

/** The roles that get an accomplishment bullet (most recent two). */
export const BULLET_ROLES = WORK_HISTORY.slice(0, 2);

export const SKILL_CHOICES: { key: string; label: Localized }[] = [
  { key: "scheduling", label: { en: "Staff scheduling", es: "Horarios de personal" } },
  { key: "spreadsheets", label: { en: "Spreadsheets and formulas", es: "Hojas de cálculo y fórmulas" } },
  { key: "email", label: { en: "Professional email", es: "Correo profesional" } },
  { key: "calendars", label: { en: "Calendars and meetings", es: "Calendarios y reuniones" } },
  { key: "drive", label: { en: "Shared drives and files", es: "Drives y archivos compartidos" } },
  { key: "budget", label: { en: "Budget tracking", es: "Seguimiento de presupuesto" } },
  { key: "training", label: { en: "Training new staff", es: "Capacitar personal nuevo" } },
  { key: "customer", label: { en: "Customer service", es: "Servicio al cliente" } },
];

export function summaryLooksReal(summary: string): boolean {
  return summary.trim().split(/\s+/).filter(Boolean).length >= 6;
}

export function bulletLooksReal(bullet: string): boolean {
  return bullet.trim().split(/\s+/).filter(Boolean).length >= 4;
}

export const SUMMARY_STARTERS: Record<Lang, string[]> = {
  en: [
    "I practiced workplace tools in the Harborside simulator.",
    "I practiced checking schedules and sharing accurate information.",
    "Comfortable with email, calendars, and spreadsheets.",
    "Looking for a full-time office role.",
  ],
  es: [
    "Practiqué herramientas de trabajo en el simulador Harborside.",
    "Practiqué revisar horarios y compartir información correcta.",
    "Cómodo con correo, calendarios y hojas de cálculo.",
    "Busco un puesto de oficina de tiempo completo.",
  ],
};

export const BULLET_STARTERS: Record<Lang, string[]> = {
  en: ['Found a schedule conflict and requested a swap in the simulator.', 'Entered figures and reported a spreadsheet total.', 'Shared a current file with view-only access.', 'Sent a clear message to a simulated coworker.'],
  es: ['Encontré un conflicto de horario y pedí un cambio en el simulador.', 'Ingresé cifras y reporté el total de una hoja de cálculo.', 'Compartí un archivo actual con acceso de solo lectura.', 'Envié un mensaje claro a un compañero simulado.'],
};

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      t: "A first résumé is short",
      s: [
        "One page. A summary line, your last two or three jobs, and your skills. That's it.",
        "For each job, write one thing you did well, not your whole job description. Start with an action word: ran, checked, trained, fixed, built.",
        "Use the jobs you have. \"Team Member\" and \"Shift Lead\" at a cafe are real experience and they count.",
      ],
      tip: "Numbers help: \"trained 4 new hires\" beats \"trained new hires.\"",
    },
  ],
  es: [
    {
      t: "Un primer currículum es corto",
      s: [
        "Una página. Una línea de resumen, tus últimos dos o tres trabajos, y tus habilidades. Eso es todo.",
        "Para cada trabajo, escribe una cosa que hiciste bien, no toda la descripción del puesto. Empieza con un verbo: manejé, revisé, capacité, arreglé, armé.",
        "Usa los trabajos que tienes. \"Miembro del equipo\" y \"Líder de turno\" en un café son experiencia real y cuentan.",
      ],
      tip: "Los números ayudan: \"capacité a 4 empleados nuevos\" es mejor que \"capacité a empleados nuevos.\"",
    },
  ],
};

export const RIGHT_NOW_LABEL: Localized = { en: "Right now", es: "Ahora mismo" };
export const RIGHT_NOW_STEPS: Localized[] = [
  {
    en: "Write a summary line, then one accomplishment for each of your top two roles.",
    es: "Escribe una línea de resumen, luego un logro por cada uno de tus dos puestos principales.",
  },
  {
    en: "Check the skills you've shown, then save.",
    es: "Marca las habilidades que has mostrado, luego guarda.",
  },
];

/** What the teacher sees: the summary, the two bullets, and the skills claimed. */
export function describeSubmission(
  fields: { summary: string; bullets: string[]; skills: string[] },
  lang: Lang,
  roles = BULLET_ROLES,
): SubmissionContent {
  const c = RESUME_COPY[lang];
  const skillText = SKILL_CHOICES.filter((s) => fields.skills.includes(s.key))
    .map((s) => s.label[lang])
    .join(", ");
  return {
    lang,
    fields: [
      { label: c.summaryLabel, value: fields.summary },
      ...roles.map((role, i) => ({
        label: role.title[lang],
        value: fields.bullets[i] ?? "",
      })),
      { label: c.skillsLabel, value: skillText },
    ],
  };
}

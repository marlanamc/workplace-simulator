import type { Lang, Lesson, Localized, SubmissionContent } from "@/lib/task-types";
import { JOB_SEEKER, WORK_HISTORY } from "@/lib/tasks/job-application/content";
import { hasBlank, looksLikeKeyboardMash, plain, realWordCount } from "@/lib/grading-jobs";

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
  namePlaceholder: string;
  needBulletFor: (role: string) => string;
  educationLabel: string;
  needSummaryReal: string;
  needSummaryBlank: string;
  needBulletReal: (role: string) => string;
  needBulletBlank: (role: string) => string;
  needBulletSame: (role: string) => string;
}> = {
  en: {
    appName: "Docs: Résumé",
    heading: "Build your résumé",
    intro: "Your jobs are listed below. Write a short summary, one thing you did well at each job, and choose your skills.",
    contactLabel: "Contact",
    summaryLabel: "Summary: one or two sentences",
    summaryHint: "For example: I am a shift lead who trains new workers and keeps the schedule organized.",
    experienceLabel: "Experience",
    bulletHint: "One thing you did well in this role. Start with an action word: ran, checked, trained, fixed.",
    skillsLabel: "Skills",
    skillsHint: "Choose the ones you have done.",
    previewLabel: "Preview",
    save: "Save résumé",
    needSummary: "Write a summary in the first box: 1 or 2 sentences about you as a worker.",
    needBullets: "Write one thing you did well at each job.",
    needSkills: "Check at least three skills you've shown.",
    sentKicker: "Résumé saved",
    doneTitle: "You have a one-page résumé.",
    doneBody: "Summary, your two most recent roles with an accomplishment each, and your skills. That's all a first résumé needs.",
    tryAgain: "Do it again",
    backToDesk: "Back to desktop",
    lessonKicker: "2-minute lesson",
    tipLabel: "Tip",
    gotIt: "Got it. Back to my task",
    namePlaceholder: "Your name",
    needBulletFor: (role) => `Write one thing you did well as ${role}, like "Trained new workers."`,
    educationLabel: "Education",
    needSummaryReal: "Some of the summary is not words. Write 1 or 2 sentences about you as a worker.",
    needSummaryBlank: "Fill in the blank ___ in the summary with your own words.",
    needBulletReal: (role) => `Some of the ${role} line is not words. Write one thing you did well in that job.`,
    needBulletBlank: (role) => `Fill in the blank ___ in the ${role} line with your own words.`,
    needBulletSame: (role) => `The ${role} line is the same as the other job's. Write a different thing you did as ${role}.`,
  },
  es: {
    appName: "Docs: Currículum",
    heading: "Arma tu currículum",
    intro: "Tus empleos están abajo. Escribe un resumen corto, una cosa que hiciste bien en cada empleo, y elige tus habilidades.",
    contactLabel: "Contacto",
    summaryLabel: "Resumen: una o dos oraciones",
    summaryHint: "Por ejemplo: Soy líder de turno, entreno a trabajadores nuevos y mantengo el horario organizado.",
    experienceLabel: "Experiencia",
    bulletHint: "Una cosa que hiciste bien en este puesto. Empieza con un verbo: manejé, revisé, capacité, arreglé.",
    skillsLabel: "Habilidades",
    skillsHint: "Elige las que ya has hecho.",
    previewLabel: "Vista previa",
    save: "Guardar currículum",
    needSummary: "Escribe un resumen en la primera casilla: 1 o 2 oraciones sobre ti como trabajador.",
    needBullets: "Escribe una cosa que hiciste bien en cada empleo.",
    needSkills: "Marca al menos tres habilidades que hayas mostrado.",
    sentKicker: "Currículum guardado",
    doneTitle: "Tienes un currículum de una página.",
    doneBody: "Resumen, tus dos puestos más recientes con un logro cada uno, y tus habilidades. Eso es todo lo que necesita un primer currículum.",
    tryAgain: "Hacerlo otra vez",
    backToDesk: "Volver al escritorio",
    lessonKicker: "Lección de 2 minutos",
    tipLabel: "Consejo",
    gotIt: "Entendido. Volver a mi tarea",
    namePlaceholder: "Tu nombre",
    needBulletFor: (role) => `Escribe una cosa que hiciste bien como ${role}, como "Entrené a trabajadores nuevos."`,
    educationLabel: "Estudios",
    needSummaryReal: "Parte del resumen no son palabras. Escribe 1 o 2 oraciones sobre ti como trabajador.",
    needSummaryBlank: "Llena el espacio ___ del resumen con tus propias palabras.",
    needBulletReal: (role) => `Parte de la línea de ${role} no son palabras. Escribe una cosa que hiciste bien en ese empleo.`,
    needBulletBlank: (role) => `Llena el espacio ___ de la línea de ${role} con tus propias palabras.`,
    needBulletSame: (role) => `La línea de ${role} es igual a la del otro empleo. Escribe otra cosa que hiciste como ${role}.`,
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

/** "I am a shift lead." is a summary; the card asks for 1 or 2 sentences. */
export const SUMMARY_MIN_WORDS = 4;
/** A résumé line is a short phrase: "Trained new workers." */
export const BULLET_MIN_WORDS = 3;

export type TextProblem = "empty" | "blank" | "mash" | "short";

function textProblem(text: string, minWords: number): TextProblem | null {
  if (!text.trim()) return "empty";
  if (hasBlank(text)) return "blank";
  if (looksLikeKeyboardMash(text)) return "mash";
  if (realWordCount(text) < minWords) return "short";
  return null;
}

export function summaryProblem(summary: string): TextProblem | null {
  return textProblem(summary, SUMMARY_MIN_WORDS);
}

export function summaryLooksReal(summary: string): boolean {
  return summaryProblem(summary) === null;
}

export function bulletLooksReal(bullet: string): boolean {
  return textProblem(bullet, BULLET_MIN_WORDS) === null;
}

export type BulletProblem = TextProblem | "same";

/**
 * The first job line that falls short, top to bottom. A line copied from the
 * job's duties passes ("Trained new workers."); the same line under both
 * jobs does not, because each job needs its own.
 */
export function bulletProblem(bullets: string[]): { index: number; kind: BulletProblem } | null {
  for (let i = 0; i < bullets.length; i++) {
    const kind = textProblem(bullets[i] ?? "", BULLET_MIN_WORDS);
    if (kind) return { index: i, kind };
  }
  for (let i = 1; i < bullets.length; i++) {
    if (bullets.slice(0, i).some((b) => plain(b) === plain(bullets[i]))) return { index: i, kind: "same" };
  }
  return null;
}

export function summaryHint(problem: TextProblem, lang: Lang): string {
  const c = RESUME_COPY[lang];
  return problem === "blank" ? c.needSummaryBlank : problem === "mash" ? c.needSummaryReal : c.needSummary;
}

export function bulletHint(problem: BulletProblem, role: string, lang: Lang): string {
  const c = RESUME_COPY[lang];
  switch (problem) {
    case "blank":
      return c.needBulletBlank(role);
    case "mash":
      return c.needBulletReal(role);
    case "same":
      return c.needBulletSame(role);
    default:
      return c.needBulletFor(role);
  }
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

/**
 * A lesson learner writes as Sam, from the lesson's two cafe jobs. Frames with
 * a blank, so a click is a way in and never the finished line.
 */
export const LESSON_SUMMARY_STARTERS: Record<Lang, string[]> = {
  en: [
    "I am a ___ at Harborside Cafe.",
    "I am good at ___.",
    "I am looking for a ___ job.",
  ],
  es: [
    "Soy ___ en Harborside Cafe.",
    "Se me da bien ___.",
    "Busco un trabajo de ___.",
  ],
};

/**
 * One list per job, in the order of `LESSON_HISTORY`: each frame starts
 * with an action word from that job's own duties, so the Team Member line
 * never gets a Shift Lead duty.
 */
export const LESSON_BULLET_STARTERS_BY_ROLE: Record<Lang, string[]>[] = [
  {
    en: ["Trained ___ new workers.", "Made the weekly schedule for ___.", "Fixed ___ in the schedule."],
    es: ["Entrené a ___ trabajadores nuevos.", "Hice el horario semanal para ___.", "Arreglé ___ en el horario."],
  },
  {
    en: ["Served ___ customers a day.", "Typed ___ in a spreadsheet.", "Answered ___ every day."],
    es: ["Atendí a ___ clientes al día.", "Escribí ___ en una hoja de cálculo.", "Contesté ___ todos los días."],
  },
];

/** Every lesson bullet frame, for the checks that each language stays itself. */
export const LESSON_BULLET_STARTERS: Record<Lang, string[]> = {
  en: LESSON_BULLET_STARTERS_BY_ROLE.flatMap((r) => r.en),
  es: LESSON_BULLET_STARTERS_BY_ROLE.flatMap((r) => r.es),
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
    en: "Write a short summary: 1 or 2 sentences about you as a worker.",
    es: "Escribe un resumen corto: 1 o 2 oraciones sobre ti como trabajador.",
  },
  {
    en: "For each job, write one thing you did well. Start with a word like trained, fixed, or served.",
    es: "Para cada empleo, escribe una cosa que hiciste bien. Empieza con una palabra como entrené, arreglé o atendí.",
  },
  {
    en: "Choose at least three skills you have shown. Then click Save résumé.",
    es: "Elige al menos tres habilidades que has demostrado. Después haz clic en Guardar currículum.",
  },
];

/** A lesson learner is playing Sam, so the card says whose résumé it is. */
export const LESSON_RIGHT_NOW_STEPS: Localized[] = [
  {
    en: `Write a short summary as ${JOB_SEEKER.first}: 1 or 2 sentences about you as a worker.`,
    es: `Escribe un resumen corto como ${JOB_SEEKER.first}: 1 o 2 oraciones sobre ti como trabajador.`,
  },
  {
    en: "For each job, write one different thing you did well. Start with a word like trained, fixed, or served.",
    es: "Para cada empleo, escribe una cosa distinta que hiciste bien. Empieza con una palabra como entrené, arreglé o atendí.",
  },
  RIGHT_NOW_STEPS[2],
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

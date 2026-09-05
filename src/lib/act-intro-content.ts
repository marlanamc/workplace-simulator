import type { SkillTile } from "@/components/welcome-shell";
import { CAST } from "@/lib/cast";
import type { Lang, Localized } from "@/lib/task-types";

/**
 * The full-page orientation shown once, before each act after the first — the
 * bigger sibling of `LEVELS[].levelUp`. It names the new role, the manager who
 * takes over, what changed in the story, and the handful of new skills this act
 * builds. Act I keeps its own screen (`SimulatorWelcome`); this covers II–VII.
 *
 * Shown once per act, gated on a story flag (localStorage, per learner) exactly
 * like `WELCOME_FLAG`. Replaying a level from `MyJobPanel` does not re-show it.
 */

export const actIntroFlag = (actKey: string) => `act-intro-seen:${actKey}`;

export type ActIntroActKey = "act2" | "act3" | "act4" | "act5" | "act6" | "act7";

export interface ActIntro {
  actLabel: Localized;
  role: Localized;
  roleLine: Localized;
  manager: Localized;
  bridge: Localized;
  skillsTitle: Localized;
  skills: SkillTile[];
  start: Localized;
}

/** "Your new manager is {name}, the {title}." — pulled from CAST so names never drift. */
function managerLine(castKey: keyof typeof CAST): Localized {
  const m = CAST[castKey];
  const title = m.title;
  return {
    en: title ? `Your new manager is ${m.name}, the ${title.en}.` : `Your new manager is ${m.name}.`,
    es: title
      ? `Tu nueva jefa es ${m.name}, la ${title.es}.`
      : `Tu nueva jefa es ${m.name}.`,
  };
}

const NEW_SKILLS_TITLE: Localized = { en: "New skills you'll build:", es: "Nuevas habilidades que vas a construir:" };

export const ACT_INTROS: Record<ActIntroActKey, ActIntro> = {
  act2: {
    actLabel: { en: "Act II", es: "Acto II" },
    role: { en: "You're a Shift Lead now", es: "Ahora eres líder de turno" },
    roleLine: {
      en: "You lead a shift, not just work one. People ask you what to do.",
      es: "Diriges un turno, no solo trabajas en él. La gente te pregunta qué hacer.",
    },
    manager: managerLine("renata"),
    bridge: {
      en: "You know the cafe computer. Now you use the tools a lead uses — the calendar, shared files, and the weekly numbers.",
      es: "Ya conoces la computadora del café. Ahora usas las herramientas de un líder: el calendario, los archivos compartidos y los números de la semana.",
    },
    skillsTitle: NEW_SKILLS_TITLE,
    skills: [
      { label: { en: "Incident reports", es: "Reportes de incidentes" }, icon: "incident", color: "#b06000", tint: "#fef0dc" },
      { label: { en: "Calendar", es: "Calendario" }, icon: "schedule", color: "#1a73e8", tint: "#e8f0fe" },
      { label: { en: "Shared files", es: "Archivos compartidos" }, icon: "files", color: "#188038", tint: "#f1efe9" },
      { label: { en: "Spreadsheets", es: "Hojas de cálculo" }, icon: "spreadsheet", color: "#0f9d58", tint: "#e6f4ea" },
      { label: { en: "Two things at once", es: "Dos cosas a la vez" }, icon: "priority", color: "#c5221f", tint: "#fce8e6" },
    ],
    start: { en: "Start Act II", es: "Comenzar el Acto II" },
  },

  act3: {
    actLabel: { en: "Act III", es: "Acto III" },
    role: { en: "You're a Shift Supervisor now", es: "Ahora eres supervisor de turno" },
    roleLine: {
      en: "You decide for the whole crew, not just for yourself.",
      es: "Decides por todo el equipo, no solo por ti.",
    },
    manager: {
      en: `${CAST.renata.name} still runs the cafe. She hands you more of the week.`,
      es: `${CAST.renata.name} sigue dirigiendo el café. Te deja más de la semana a ti.`,
    },
    bridge: {
      en: "The jobs get bigger: you write the schedule for the crew, and you handle more than one problem at a time.",
      es: "Los trabajos son más grandes: escribes el horario del equipo y manejas más de un problema a la vez.",
    },
    skillsTitle: NEW_SKILLS_TITLE,
    skills: [
      { label: { en: "Team schedule", es: "Horario del equipo" }, icon: "schedule", color: "#1a73e8", tint: "#e8f0fe" },
      { label: { en: "Check a formula", es: "Revisar una fórmula" }, icon: "spreadsheet", color: "#0f9d58", tint: "#e6f4ea" },
      { label: { en: "Call a meeting", es: "Convocar una reunión" }, icon: "meeting", color: "#8430ce", tint: "#f1e9fb" },
      { label: { en: "Three things at once", es: "Tres cosas a la vez" }, icon: "priority", color: "#c5221f", tint: "#fce8e6" },
    ],
    start: { en: "Start Act III", es: "Comenzar el Acto III" },
  },

  act4: {
    actLabel: { en: "Act IV", es: "Acto IV" },
    role: { en: "You're an Assistant Manager now", es: "Ahora eres asistente de gerencia" },
    roleLine: {
      en: "You read the formal mail, the budget, and the whole email thread before you answer.",
      es: "Lees el correo formal, el presupuesto y todo el hilo del correo antes de responder.",
    },
    manager: {
      en: `${CAST.renata.name} is still your manager, and Harborside will pay for a class.`,
      es: `${CAST.renata.name} sigue siendo tu jefa, y Harborside pagará una clase.`,
    },
    bridge: {
      en: "This is the last stop if the cafe is where you want to stay. The skills are about reading carefully before you act.",
      es: "Esta es la última parada si el café es donde quieres quedarte. Las habilidades son leer con cuidado antes de actuar.",
    },
    skillsTitle: NEW_SKILLS_TITLE,
    skills: [
      { label: { en: "Formal offer letters", es: "Cartas de oferta formales" }, icon: "mail", color: "#ea4335", tint: "#fce8e6" },
      { label: { en: "Budgets and charts", es: "Presupuestos y gráficos" }, icon: "spreadsheet", color: "#0f9d58", tint: "#e6f4ea" },
      { label: { en: "Reply or reply-all", es: "Responder o responder a todos" }, icon: "team", color: "#2d8cff", tint: "#e8f2ff" },
    ],
    start: { en: "Start Act IV", es: "Comenzar el Acto IV" },
  },

  act5: {
    actLabel: { en: "Act V", es: "Acto V" },
    role: { en: "Pick a path", es: "Elige un camino" },
    roleLine: {
      en: "You can try one path, both, or skip this act. Nothing here is required.",
      es: "Puedes probar un camino, los dos, o saltarte este acto. Nada aquí es obligatorio.",
    },
    manager: {
      en: `Path A: ${CAST.marcus.name}, a college advisor. Path B: ${CAST.thuy.name}, a front desk supervisor.`,
      es: `Camino A: ${CAST.marcus.name}, un asesor universitario. Camino B: ${CAST.thuy.name}, una supervisora de recepción.`,
    },
    bridge: {
      en: "One path is about getting ready for college. The other is a front desk at a health clinic. You choose after this screen.",
      es: "Un camino es prepararte para la universidad. El otro es una recepción en una clínica de salud. Eliges después de esta pantalla.",
    },
    skillsTitle: { en: "What each path builds:", es: "Lo que construye cada camino:" },
    skills: [
      { label: { en: "College portal", es: "Portal universitario" }, icon: "college", color: "#8430ce", tint: "#f1e9fb" },
      { label: { en: "Award letters", es: "Cartas de ayuda" }, icon: "mail", color: "#ea4335", tint: "#fce8e6" },
      { label: { en: "Appointments", es: "Citas" }, icon: "schedule", color: "#1a73e8", tint: "#e8f0fe" },
      { label: { en: "Intake forms", es: "Formularios de admisión" }, icon: "incident", color: "#b06000", tint: "#fef0dc" },
      { label: { en: "A careful answer", es: "Una respuesta cuidadosa" }, icon: "review", color: "#1e8e3e", tint: "#e6f4ea" },
    ],
    start: { en: "Start Act V", es: "Comenzar el Acto V" },
  },

  act6: {
    actLabel: { en: "Act VI", es: "Acto VI" },
    role: { en: "Moving to the office", es: "Te mueves a la oficina" },
    roleLine: {
      en: "Harborside HQ has an Office Administrator opening. First you apply for it — a posting, an application, a résumé, an interview. Then you start the job.",
      es: "Harborside HQ tiene una vacante de Administrador de Oficina. Primero aplicas: un anuncio, una solicitud, un currículum, una entrevista. Luego empiezas el trabajo.",
    },
    manager: managerLine("anita"),
    bridge: {
      en: "You've earned this with your cafe work. Once you're hired, the tools are ones you know — Drive, Calendar, Sheets — used at office scale.",
      es: "Te lo ganaste con tu trabajo en el café. Cuando te contraten, las herramientas son las que conoces — Drive, Calendario, Sheets — a escala de oficina.",
    },
    skillsTitle: NEW_SKILLS_TITLE,
    skills: [
      { label: { en: "Read a job posting", es: "Leer un anuncio de empleo" }, icon: "review", color: "#1a73e8", tint: "#e8f0fe" },
      { label: { en: "Fill an application", es: "Llenar una solicitud" }, icon: "review", color: "#673ab7", tint: "#f1e9fb" },
      { label: { en: "Search a big drive", es: "Buscar en un drive grande" }, icon: "files", color: "#188038", tint: "#f1efe9" },
      { label: { en: "Schedule and join a call", es: "Agendar y unirte a una llamada" }, icon: "meeting", color: "#8430ce", tint: "#f1e9fb" },
      { label: { en: "A short slide deck", es: "Una presentación corta" }, icon: "slides", color: "#b06000", tint: "#fef0dc" },
    ],
    start: { en: "Start Act VI", es: "Comenzar el Acto VI" },
  },

  act7: {
    actLabel: { en: "Act VII", es: "Acto VII" },
    role: { en: "You're a Team Lead now", es: "Ahora eres Team Lead" },
    roleLine: {
      en: "You run the room. Every skill from before comes back together.",
      es: "Diriges la sala. Cada habilidad de antes vuelve a juntarse.",
    },
    manager: {
      en: `${CAST.anita.name} is still your manager. This is the last part of the story so far.`,
      es: `${CAST.anita.name} sigue siendo tu jefa. Esta es la última parte de la historia hasta ahora.`,
    },
    bridge: {
      en: "Nothing here is a brand-new tool. You run a meeting start to finish, write a fair review, and send one full weekly report.",
      es: "Nada aquí es una herramienta nueva. Diriges una reunión de principio a fin, escribes una evaluación justa y envías un reporte semanal completo.",
    },
    skillsTitle: { en: "What you'll put together:", es: "Lo que vas a juntar:" },
    skills: [
      { label: { en: "Run a meeting", es: "Dirigir una reunión" }, icon: "meeting", color: "#8430ce", tint: "#f1e9fb" },
      { label: { en: "Performance reviews", es: "Evaluaciones de desempeño" }, icon: "review", color: "#1e8e3e", tint: "#e6f4ea" },
      { label: { en: "One report packet", es: "Un paquete de reporte" }, icon: "expenses", color: "#b06000", tint: "#fef0dc" },
      { label: { en: "Look back", es: "Mirar atrás" }, icon: "college", color: "#1a73e8", tint: "#e8f0fe" },
    ],
    start: { en: "Start Act VII", es: "Comenzar el Acto VII" },
  },
};

export function actIntroFor(actKey: string): ActIntro | undefined {
  return (ACT_INTROS as Record<string, ActIntro>)[actKey];
}

/** The manager text, evaluated in the learner's language. */
export function actIntroManager(intro: ActIntro, lang: Lang): string {
  return intro.manager[lang];
}

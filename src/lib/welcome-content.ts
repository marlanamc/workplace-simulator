import type { SkillTile } from "@/components/welcome-shell";
import type { Localized } from "@/lib/task-types";

export const WELCOME_FLAG = "simulator-welcome-seen";

export const WELCOME_COPY = {
  title: { en: "Welcome to the Workplace Simulator", es: "Te damos la bienvenida al Simulador de Trabajo" },
  purposeLine1: {
    en: "Practice computer skills for work.",
    es: "Practica habilidades de computación para el trabajo.",
  },
  purposeLine2: {
    en: "Make mistakes, try again, and learn.",
    es: "Comete errores, vuelve a intentarlo y aprende.",
  },
  skillsTitle: { en: "You will practice:", es: "Vas a practicar:" },
  jobTitle: { en: "Your first job: Harborside Cafe", es: "Tu primer trabajo: Harborside Cafe" },
  jobLine1: {
    en: "You will complete small tasks.",
    es: "Vas a completar tareas pequeñas.",
  },
  jobLine2: {
    en: "You can ask for help and try again.",
    es: "Puedes pedir ayuda y volver a intentarlo.",
  },
  start: { en: "Start my first day", es: "Comenzar mi primer día" },
  reassurance: {
    en: "You will not lose points for mistakes.",
    es: "No vas a perder puntos por errores.",
  },
} satisfies Record<string, Localized>;

/** Each skill wears the color of the app it maps to inside the sim, which
 *  mimics Google Workspace + Zoom: Gmail red, Google Calendar blue, the Drive
 *  tri-color mark, Sheets green, Zoom blue. `tint` is the soft tile behind the
 *  icon; `files` renders the multi-color Drive logo instead of a tinted glyph. */
export const WELCOME_SKILLS: SkillTile[] = [
  { label: { en: "Email", es: "Correo" }, icon: "mail", color: "#ea4335", tint: "#fce8e6" },
  { label: { en: "Schedules", es: "Horarios" }, icon: "schedule", color: "#1a73e8", tint: "#e8f0fe" },
  { label: { en: "Files", es: "Archivos" }, icon: "files", color: "#188038", tint: "#f1efe9" },
  { label: { en: "Spreadsheets", es: "Hojas de cálculo" }, icon: "spreadsheet", color: "#0f9d58", tint: "#e6f4ea" },
  { label: { en: "Team communication", es: "Comunicación en equipo" }, icon: "team", color: "#2d8cff", tint: "#e8f2ff" },
];

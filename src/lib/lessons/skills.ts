import type { Localized } from "@/lib/task-types";

/** The small set of skills a teacher filters the lesson library by. */
export const SKILL_TAGS = [
  "accounts",
  "email",
  "files",
  "forms",
  "spreadsheets",
  "documents",
  "scheduling",
  "calls-meetings",
  "job-search",
  "workplace-systems",
] as const;
export type SkillTag = (typeof SKILL_TAGS)[number];

export const SKILL_LABELS: Record<SkillTag, Localized> = {
  accounts: { en: "Accounts and passwords", es: "Cuentas y contraseñas" },
  email: { en: "Email", es: "Correo electrónico" },
  files: { en: "Files and folders", es: "Archivos y carpetas" },
  forms: { en: "Forms", es: "Formularios" },
  spreadsheets: { en: "Spreadsheets", es: "Hojas de cálculo" },
  documents: { en: "Documents", es: "Documentos" },
  scheduling: { en: "Calendars and scheduling", es: "Calendarios y horarios" },
  "calls-meetings": { en: "Calls and meetings", es: "Llamadas y reuniones" },
  "job-search": { en: "Looking for a job", es: "Buscar trabajo" },
  "workplace-systems": { en: "Work websites", es: "Sitios web del trabajo" },
};

export function isSkillTag(value: unknown): value is SkillTag {
  return SKILL_TAGS.some((t) => t === value);
}

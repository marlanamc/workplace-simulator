import {
  Briefcase,
  CalendarDays,
  ClipboardList,
  FileText,
  FolderOpen,
  KeyRound,
  LayoutGrid,
  Mail,
  Table2,
  Video,
  type LucideIcon,
} from "lucide-react";
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

/** Signal-flag colors for topic tiles: `solid` for discs and bars, `tint` for backgrounds, `deep` for text on the tint. */
export const TOPIC_COLORS = {
  red: { solid: "#c8322a", tint: "#fbe3df", deep: "#8e1f19" },
  yellow: { solid: "#e8a90f", tint: "#fdf1cc", deep: "#7a5500" },
  blue: { solid: "#1f5fae", tint: "#dde9f8", deep: "#153f75" },
  navy: { solid: "#14294d", tint: "#dfe4ee", deep: "#14294d" },
  teal: { solid: "#11807e", tint: "#d6efec", deep: "#0b5654" },
  orange: { solid: "#d9621c", tint: "#fce5d4", deep: "#8f3c0c" },
} as const;
export type TopicColors = (typeof TOPIC_COLORS)[keyof typeof TOPIC_COLORS];

/** How each skill looks as a topic in the library. A new skill must pick a color and an icon. */
export const SKILL_LOOK: Record<SkillTag, { colors: TopicColors; icon: LucideIcon }> = {
  accounts: { colors: TOPIC_COLORS.yellow, icon: KeyRound },
  email: { colors: TOPIC_COLORS.blue, icon: Mail },
  files: { colors: TOPIC_COLORS.teal, icon: FolderOpen },
  forms: { colors: TOPIC_COLORS.red, icon: ClipboardList },
  spreadsheets: { colors: TOPIC_COLORS.navy, icon: Table2 },
  documents: { colors: TOPIC_COLORS.orange, icon: FileText },
  scheduling: { colors: TOPIC_COLORS.red, icon: CalendarDays },
  "calls-meetings": { colors: TOPIC_COLORS.teal, icon: Video },
  "job-search": { colors: TOPIC_COLORS.blue, icon: Briefcase },
  "workplace-systems": { colors: TOPIC_COLORS.navy, icon: LayoutGrid },
};

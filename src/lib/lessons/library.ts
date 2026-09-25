import type { Lang, Localized } from "@/lib/task-types";
import { LESSONS, type LessonEntry } from "./catalog";
import { isSkillTag, SKILL_LABELS, type SkillTag } from "./skills";

/** One-tap searches under the search bar. Each searches for its own label. */
export const QUICK_SEARCHES: Localized[] = [
  { en: "Email", es: "Correo" },
  { en: "Password", es: "Contraseña" },
  { en: "Spreadsheet", es: "Hoja de cálculo" },
  { en: "Job", es: "Empleo" },
  { en: "W-4", es: "W-4" },
];

export const normalizeSearch = (value: string) => value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
export const cleanSearch = (value: string) => value.trim().slice(0, 200);

/** Small words that would match almost every lesson. Dropped unless they are the whole search. */
const STOP_WORDS = new Set(
  "a an the to of and or in on for my how do i el la los las un una unos de del y o en con por para mi como que".split(" "),
);

/** A learner's word, and other words that mean the same thing in the lessons. */
const SYNONYMS: Record<string, string[]> = {
  password: ["contrasena", "code", "codigo"],
  contrasena: ["password", "code", "codigo"],
  job: ["empleo"],
  empleo: ["job"],
  correo: ["email"],
  email: ["correo"],
};

const searchText = (lesson: LessonEntry) =>
  normalizeSearch(
    [
      lesson.title.en,
      lesson.title.es,
      lesson.summary.en,
      lesson.summary.es,
      ...lesson.skills.flatMap((tag) => [tag, SKILL_LABELS[tag].en, SKILL_LABELS[tag].es]),
    ].join(" "),
  );

/**
 * Lessons that match any word of the search, in either language, accents and
 * case ignored. More matching words rank first; ties keep the game's order.
 * An empty search returns every lesson in the skill.
 */
export function searchLessons(skill: SkillTag | null, query: string): LessonEntry[] {
  const inSkill = skill ? LESSONS.filter((l) => l.skills.includes(skill)) : LESSONS;
  const all = normalizeSearch(cleanSearch(query)).split(/\s+/).filter(Boolean);
  if (all.length === 0) return inSkill;
  const words = all.some((w) => !STOP_WORDS.has(w)) ? all.filter((w) => !STOP_WORDS.has(w)) : all;
  const groups = words.map((w) => [w, ...(SYNONYMS[w] ?? [])]);
  return inSkill
    .map((lesson, order) => {
      const text = searchText(lesson);
      return { lesson, order, score: groups.filter((g) => g.some((w) => text.includes(w))).length };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .map((m) => m.lesson);
}

/** `teacher` shows the teacher preview links; students never see them by default. */
export function libraryHref(lang: Lang, skill: SkillTag | null = null, query = "", teacher = false) {
  const params = new URLSearchParams();
  if (lang === "es") params.set("lang", lang);
  if (skill) params.set("skill", skill);
  if (cleanSearch(query)) params.set("q", cleanSearch(query));
  if (teacher) params.set("teacher", "1");
  return `/lessons${params.size ? `?${params}` : ""}`;
}

/** Only library routes and supported filters may survive a return link. */
export function libraryReturn(raw?: string | null, lang?: Lang) {
  try {
    if (!raw?.startsWith("/lessons")) return libraryHref(lang ?? "en");
    const url = new URL(raw, "https://library.invalid");
    if (url.origin !== "https://library.invalid" || url.pathname !== "/lessons") return libraryHref(lang ?? "en");
    const skill = url.searchParams.get("skill");
    return libraryHref(
      lang ?? (url.searchParams.get("lang") === "es" ? "es" : "en"),
      isSkillTag(skill) ? skill : null,
      url.searchParams.get("q") ?? "",
      url.searchParams.get("teacher") === "1",
    );
  } catch {
    return libraryHref(lang ?? "en");
  }
}

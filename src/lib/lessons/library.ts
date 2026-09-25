import type { Lang } from "@/lib/task-types";
import { LESSONS } from "./catalog";
import { isSkillTag, SKILL_LABELS, type SkillTag } from "./skills";

export const STARTER_LESSONS = ["account-recovery", "mail-reply", "w4-form"] as const;
export const normalizeSearch = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
export const cleanSearch = (value: string) => value.trim().slice(0, 200);

export function searchLessons(lang: Lang, skill: SkillTag | null, query: string) {
  const words = normalizeSearch(cleanSearch(query)).split(/\s+/).filter(Boolean);
  return LESSONS.filter((lesson) => {
    if (skill && !lesson.skills.includes(skill)) return false;
    const text = normalizeSearch([lesson.title[lang], lesson.summary[lang], ...lesson.skills.map((tag) => SKILL_LABELS[tag][lang])].join(" "));
    return words.every((word) => text.includes(word));
  });
}

export function libraryHref(lang: Lang, skill: SkillTag | null = null, query = "") {
  const params = new URLSearchParams();
  if (lang === "es") params.set("lang", lang);
  if (skill) params.set("skill", skill);
  if (cleanSearch(query)) params.set("q", cleanSearch(query));
  return `/lessons${params.size ? `?${params}` : ""}`;
}

/** Only library routes and supported filters may survive a return link. */
export function libraryReturn(raw?: string | null, lang?: Lang) {
  try {
    if (!raw?.startsWith("/lessons")) return libraryHref(lang ?? "en");
    const url = new URL(raw, "https://library.invalid");
    if (url.origin !== "https://library.invalid" || url.pathname !== "/lessons") return libraryHref(lang ?? "en");
    const skill = url.searchParams.get("skill");
    return libraryHref(lang ?? (url.searchParams.get("lang") === "es" ? "es" : "en"), isSkillTag(skill) ? skill : null, url.searchParams.get("q") ?? "");
  } catch {
    return libraryHref(lang ?? "en");
  }
}

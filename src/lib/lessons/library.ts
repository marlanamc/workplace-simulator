import { pathwayByKey } from "./pathways";
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

/** Accents, case, and hyphens ignored: "W4", "w-4" and "W-4" are one word. */
export const normalizeSearch = (value: string) =>
  value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/(\w)-(\w)/g, "$1$2").trim();
export const cleanSearch = (value: string) => value.trim().slice(0, 200);

/** Small words that would match almost every lesson. Dropped unless they are the whole search. */
const STOP_WORDS = new Set(
  "a an the to of and or in on for my how do i el la los las un una unos de del y o en con por para mi como que".split(" "),
);

/** A learner's word, and other words that mean the same thing in the lessons. */
const SYNONYMS: Record<string, string[]> = {
  password: ["contrasena", "code", "codigo", "sign in"],
  contrasena: ["password", "code", "codigo", "sesion"],
  login: ["sign in", "password", "account", "sesion", "contrasena"],
  signin: ["sign in", "password", "account"],
  sesion: ["sign in", "password", "contrasena"],
  account: ["cuenta", "sign in", "password"],
  cuenta: ["account", "sesion", "contrasena"],
  phone: ["text", "code", "telefono", "mensaje"],
  telefono: ["phone", "text", "mensaje", "codigo"],
  text: ["mensaje", "code"],
  job: ["empleo", "work", "hire"],
  empleo: ["job", "trabajo"],
  trabajo: ["job", "empleo", "work"],
  work: ["job", "trabajo"],
  correo: ["email"],
  email: ["correo"],
  mail: ["email", "correo"],
  tax: ["w4", "impuesto"],
  impuesto: ["w4", "tax"],
  w4: ["tax", "impuesto"],
  money: ["total", "budget", "dinero", "presupuesto"],
  dinero: ["total", "budget", "money", "presupuesto"],
  excel: ["spreadsheet", "sheet", "hoja"],
  calendar: ["calendario", "meeting", "invite", "reunion"],
  calendario: ["calendar", "meeting", "invite", "reunion"],
  meeting: ["calendar", "reunion"],
  file: ["archivo", "drive"],
  archivo: ["file", "drive"],
  appointment: ["cita"],
  cita: ["appointment"],
  resume: ["curriculum"],
  curriculum: ["resume"],
};

/** "passwords" → "password", "taxes" → "tax", "citas" → "cita". */
const singular = (w: string) =>
  w.length > 4 && w.endsWith("es") && !w.endsWith("ses") ? [w.slice(0, -2), w.slice(0, -1)]
  : w.length > 3 && w.endsWith("s") ? [w.slice(0, -1)]
  : [];

/** One letter missing, extra, or swapped ("pasword", "calender"). Only for longer words, so short ones stay exact. */
function nearMiss(a: string, b: string) {
  if (a.length < 5 || Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else {
      i++;
      j++;
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

const matches = (text: string, words: string[]) =>
  words.some((w) => text.includes(w)) ||
  words.some((w) => text.split(/[^a-z0-9]+/).some((token) => nearMiss(w, token)));

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
  const groups = words.map((w) => {
    // A typo of a word we know ("pasword") searches as that word.
    const known = Object.keys(SYNONYMS).filter((k) => nearMiss(w, k));
    const forms = [w, ...singular(w), ...known];
    return [...forms, ...forms.flatMap((f) => SYNONYMS[f] ?? [])];
  });
  return inSkill
    .map((lesson, order) => {
      const text = searchText(lesson);
      return { lesson, order, score: groups.filter((g) => matches(text, g)).length };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .map((m) => m.lesson);
}

/** `teacher` shows the teacher preview links; students never see them by default. */
export function libraryHref(lang: Lang, skill: SkillTag | null = null, query = "", teacher = false, pathway?: string) {
  const params = new URLSearchParams();
  if (lang === "es") params.set("lang", lang);
  if (skill) params.set("skill", skill);
  if (cleanSearch(query)) params.set("q", cleanSearch(query));
  if (teacher) params.set("teacher", "1");
  if (!skill && !cleanSearch(query) && pathwayByKey(pathway)) params.set("pathway", pathway!);
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
      url.searchParams.get("pathway") ?? undefined,
    );
  } catch {
    return libraryHref(lang ?? "en");
  }
}

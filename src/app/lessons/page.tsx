import Link from "next/link";
import { LESSONS } from "@/lib/lessons/catalog";
import { TASK_ICONS } from "@/lib/icons";
import { STARTER_LESSONS, searchLessons, libraryHref, cleanSearch } from "@/lib/lessons/library";
import { LESSON_COPY, TEACHER_COPY } from "@/lib/lessons/copy";
import { SKILL_LABELS, SKILL_TAGS, isSkillTag, type SkillTag } from "@/lib/lessons/skills";

export const metadata = {
  title: "Lessons",
  description: "Short practice with real computer tasks, on the same practice computer as the game.",
};

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const FILTER_COPY = {
  search: { en: "Search lessons", es: "Buscar lecciones" },
  searchButton: { en: "Search", es: "Buscar" },
  clear: { en: "Clear filters", es: "Quitar filtros" },
  starters: { en: "Start here", es: "Empieza aquí" },
  starterIntro: { en: "Choose any lesson to try. No account needed.", es: "Elige una lección para probar. No necesitas una cuenta." },
  browse: { en: "Browse lessons", es: "Explorar lecciones" },
  empty: { en: "No lessons match your search. Try another word or clear the filters.", es: "Ninguna lección coincide con tu búsqueda. Prueba otra palabra o quita los filtros." },
  all: { en: "All", es: "Todas" },
  filterLabel: { en: "Show lessons about", es: "Mostrar lecciones de" },
  one: { en: "1 lesson", es: "1 lección" },
  count: { en: "{n} lessons", es: "{n} lecciones" },
  footer: {
    en: "Lessons use made-up names and details. A lesson does not change a student's progress in the game.",
    es: "Las lecciones usan nombres y datos inventados. Una lección no cambia el progreso del estudiante en el juego.",
  },
};

/** The public lesson library: filter by skill, start a lesson, or open the teacher preview. */
export default async function LessonsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string | string[]; skill?: string | string[]; q?: string | string[] }>;
}) {
  const query = await searchParams;
  const lang = first(query.lang) === "es" ? "es" : "en";
  const rawSkill = first(query.skill);
  const skill: SkillTag | null = isSkillTag(rawSkill) ? rawSkill : null;
  const queryText = cleanSearch(first(query.q) ?? "");
  const lessons = searchLessons(lang, skill, queryText);
  // Only offer filters that have a lesson behind them.
  const tags = SKILL_TAGS.filter((t) => LESSONS.some((l) => l.skills.includes(t)));

  const href = (opts: { lang?: "en" | "es"; skill?: SkillTag | null }) =>
    libraryHref(opts.lang ?? lang, opts.skill === undefined ? skill : opts.skill, queryText);
  const lessonHref = (key: string, preview = false) => {
    const params = new URLSearchParams();
    if (lang === "es") params.set("lang", lang);
    if (preview) params.set("preview", "1");
    params.set("returnTo", libraryHref(lang, skill, queryText));
    return `/lessons/${key}?${params}`;
  };

  return (
    <main lang={lang} className="mx-auto w-full max-w-[960px] px-4 py-8 text-[#202124] sm:px-10">
      <header className="flex items-center justify-between gap-4 border-b border-[#dadce0] pb-5">
        <h1 className="m-0 text-[28px] font-medium">{LESSON_COPY.library[lang]}</h1>
        <Link href={href({ lang: lang === "es" ? "en" : "es" })} className="text-[16px] text-[#0b57d0]">
          {lang === "es" ? "English" : "Español"}
        </Link>
      </header>
      <p className="mt-5 max-w-[640px] text-[18px] leading-relaxed text-[#3c4043]">{LESSON_COPY.libraryIntro[lang]}</p>

      {!skill && !queryText && (
        <section aria-labelledby="starter-heading" className="mt-8 border-b border-[#dadce0] pb-8">
          <h2 id="starter-heading" className="text-[22px] font-medium">{FILTER_COPY.starters[lang]}</h2>
          <p className="mt-1 text-[#5f6368]">{FILTER_COPY.starterIntro[lang]}</p>
          <ul className="mt-4 grid list-none gap-4 p-0 sm:grid-cols-3">
            {STARTER_LESSONS.map((key) => {
              const lesson = LESSONS.find((entry) => entry.taskKey === key)!;
              const Icon = TASK_ICONS[key];
              return <li key={key} className="flex flex-col border-l-2 border-[#d3e3fd] pl-4">
                <Icon size={26} className="mb-3 text-[#0b57d0]" aria-hidden />
                <h3 className="text-[18px] font-medium">{lesson.title[lang]}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#3c4043]">{lesson.summary[lang]}</p>
                <p className="mt-2 text-[13px] text-[#5f6368]">{LESSON_COPY.minutes[lang].replace("{n}", String(lesson.minutes))}</p>
                <Link href={lessonHref(key)} aria-label={`${LESSON_COPY.start[lang]}: ${lesson.title[lang]}`} className="mt-auto inline-flex min-h-12 items-center pt-2 font-medium text-[#0b57d0] hover:underline">{LESSON_COPY.start[lang]} →</Link>
              </li>;
            })}
          </ul>
        </section>
      )}
      <section aria-labelledby="browse-heading" className="mt-8">
        <h2 id="browse-heading" className="text-[22px] font-medium">{FILTER_COPY.browse[lang]}</h2>
        <form action="/lessons" method="get" className="mt-4">
          {lang === "es" && <input type="hidden" name="lang" value="es" />}
          {skill && <input type="hidden" name="skill" value={skill} />}
          <label htmlFor="lesson-search" className="block text-[14px] font-medium">{FILTER_COPY.search[lang]}</label>
          <div className="mt-2 flex flex-wrap gap-2">
            <input key={queryText} id="lesson-search" name="q" type="search" maxLength={200} defaultValue={queryText} className="min-h-12 min-w-0 flex-1 rounded-lg border border-[#9aa0a6] bg-white px-3 text-[16px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b57d0]" />
            <button type="submit" className="min-h-12 rounded-lg bg-[#0b57d0] px-5 font-medium text-white hover:bg-[#0842a0]">{FILTER_COPY.searchButton[lang]}</button>
          </div>
        </form>
        <nav aria-label={FILTER_COPY.filterLabel[lang]} className="mt-6">
          <p className="m-0 mb-2 text-[14px] font-medium text-[#5f6368]">{FILTER_COPY.filterLabel[lang]}</p>
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {[null, ...tags].map((t) => {
              const current = t === skill;
              return (
                <li key={t ?? "all"}>
                  <Link
                    href={href({ skill: t })}
                    aria-current={current ? "page" : undefined}
                    data-testid={`skill-filter-${t ?? "all"}`}
                    className={`inline-flex min-h-10 items-center rounded-full border px-4 text-[15px] ${
                      current ? "border-[#0b57d0] bg-[#e8f0fe] font-medium text-[#0b57d0]" : "border-[#dadce0] text-[#3c4043] hover:bg-[#f1f3f4]"
                    }`}
                  >
                    {t ? SKILL_LABELS[t][lang] : FILTER_COPY.all[lang]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <p className="mt-6 mb-0 text-[14px] text-[#5f6368]" aria-live="polite">
          {lessons.length === 1 ? FILTER_COPY.one[lang] : FILTER_COPY.count[lang].replace("{n}", String(lessons.length))}
        </p>
        {(skill || queryText) && <Link href={libraryHref(lang)} className="inline-flex min-h-11 items-center text-[#0b57d0] hover:underline">{FILTER_COPY.clear[lang]}</Link>}
        {lessons.length === 0 && <p className="my-8 text-[18px] text-[#3c4043]">{FILTER_COPY.empty[lang]}</p>}
        <ul className="mt-3 flex list-none flex-col divide-y divide-[#dadce0] p-0">
          {lessons.map((l) => {
            const Icon = TASK_ICONS[l.taskKey];
            return (
            <li
              key={l.taskKey}
              data-testid={`lesson-card-${l.taskKey}`}
              className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between"
            >
              <div className="min-w-0">
                <h3 className="m-0 flex items-center gap-3 text-[20px] font-medium"><Icon size={23} className="shrink-0 text-[#0b57d0]" aria-hidden />{l.title[lang]}</h3>
                <p className="mt-1 mb-0 text-[16px] leading-snug text-[#3c4043]">{l.summary[lang]}</p>
                <p className="mt-2 mb-0 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-[#5f6368]">
                  <span>{LESSON_COPY.minutes[lang].replace("{n}", String(l.minutes))}</span>
                  {l.skills.map((s) => (
                    <span key={s} className="rounded-full bg-[#f1f3f4] px-2.5 py-0.5">{SKILL_LABELS[s][lang]}</span>
                  ))}
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-2 md:items-end">
                <Link
                  href={lessonHref(l.taskKey)}
                  aria-label={`${LESSON_COPY.start[lang]}: ${l.title[lang]}`}
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#0b57d0] px-6 text-[16px] font-medium text-white hover:bg-[#0842a0]"
                >
                  {LESSON_COPY.start[lang]}
                </Link>
                <Link
                  href={lessonHref(l.taskKey, true)}
                  aria-label={`${TEACHER_COPY.previewLink[lang]}: ${l.title[lang]}`}
                  className="inline-flex min-h-10 items-center justify-center px-2 text-[15px] text-[#0b57d0] hover:underline"
                >
                  {TEACHER_COPY.previewLink[lang]}
                </Link>
              </div>
            </li>
          ); })}
        </ul>
      </section>
      <footer className="mt-8 border-t border-[#dadce0] pt-4 text-[14px] text-[#5f6368]">{FILTER_COPY.footer[lang]}</footer>
    </main>
  );
}

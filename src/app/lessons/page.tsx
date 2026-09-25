import Link from "next/link";
import { LESSONS, lessonsBySkill } from "@/lib/lessons/catalog";
import { LESSON_COPY, TEACHER_COPY } from "@/lib/lessons/copy";
import { SKILL_LABELS, SKILL_TAGS, isSkillTag, type SkillTag } from "@/lib/lessons/skills";

export const metadata = {
  title: "Lessons",
  description: "Short practice with real computer tasks, on the same practice computer as the game.",
};

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const FILTER_COPY = {
  all: { en: "All", es: "Todas" },
  filterLabel: { en: "Show lessons about", es: "Mostrar lecciones de" },
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
  searchParams: Promise<{ lang?: string | string[]; skill?: string | string[] }>;
}) {
  const query = await searchParams;
  const lang = first(query.lang) === "es" ? "es" : "en";
  const rawSkill = first(query.skill);
  const skill: SkillTag | null = isSkillTag(rawSkill) ? rawSkill : null;
  const lessons = lessonsBySkill(skill);
  // Only offer filters that have a lesson behind them.
  const tags = SKILL_TAGS.filter((t) => LESSONS.some((l) => l.skills.includes(t)));

  const href = (opts: { lang?: string; skill?: SkillTag | null }) => {
    const p = new URLSearchParams();
    const l = opts.lang ?? lang;
    const s = opts.skill === undefined ? skill : opts.skill;
    if (l === "es") p.set("lang", "es");
    if (s) p.set("skill", s);
    const q = p.toString();
    return q ? `/lessons?${q}` : "/lessons";
  };
  const langQ = lang === "es" ? "lang=es" : "";

  return (
    <main lang={lang} className="mx-auto w-full max-w-[960px] px-4 py-8 text-[#202124] sm:px-10">
      <header className="flex items-center justify-between gap-4 border-b border-[#dadce0] pb-5">
        <h1 className="m-0 text-[28px] font-medium">{LESSON_COPY.library[lang]}</h1>
        <Link href={href({ lang: lang === "es" ? "en" : "es" })} className="text-[16px] text-[#0b57d0]">
          {lang === "es" ? "English" : "Español"}
        </Link>
      </header>
      <p className="mt-5 max-w-[640px] text-[18px] leading-relaxed text-[#3c4043]">{LESSON_COPY.libraryIntro[lang]}</p>

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
        {FILTER_COPY.count[lang].replace("{n}", String(lessons.length))}
      </p>
      <ul className="mt-3 flex list-none flex-col gap-4 p-0">
        {lessons.map((l) => (
          <li
            key={l.taskKey}
            data-testid={`lesson-card-${l.taskKey}`}
            className="flex flex-col gap-4 rounded-2xl border border-[#dadce0] bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <h2 className="m-0 text-[20px] font-medium">{l.title[lang]}</h2>
              <p className="mt-1 mb-0 text-[16px] leading-snug text-[#3c4043]">{l.summary[lang]}</p>
              <p className="mt-2 mb-0 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-[#5f6368]">
                <span>{LESSON_COPY.minutes[lang].replace("{n}", String(l.minutes))}</span>
                {l.skills.map((s) => (
                  <span key={s} className="rounded-full bg-[#f1f3f4] px-2.5 py-0.5">{SKILL_LABELS[s][lang]}</span>
                ))}
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:items-end">
              <Link
                href={`/lessons/${l.taskKey}${langQ ? `?${langQ}` : ""}`}
                aria-label={`${LESSON_COPY.start[lang]}: ${l.title[lang]}`}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#0b57d0] px-6 text-[16px] font-medium text-white hover:bg-[#0842a0]"
              >
                {LESSON_COPY.start[lang]}
              </Link>
              <Link
                href={`/lessons/${l.taskKey}?preview=1${langQ ? `&${langQ}` : ""}`}
                aria-label={`${TEACHER_COPY.previewLink[lang]}: ${l.title[lang]}`}
                className="inline-flex min-h-10 items-center justify-center px-2 text-[15px] text-[#0b57d0] hover:underline"
              >
                {TEACHER_COPY.previewLink[lang]}
              </Link>
            </div>
          </li>
        ))}
      </ul>
      <footer className="mt-8 border-t border-[#dadce0] pt-4 text-[14px] text-[#5f6368]">{FILTER_COPY.footer[lang]}</footer>
    </main>
  );
}

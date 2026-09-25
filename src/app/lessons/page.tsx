import Link from "next/link";
import { Atkinson_Hyperlegible_Next } from "next/font/google";
import { Anchor, Search, Volume2 } from "lucide-react";
import { LESSONS, type LessonEntry } from "@/lib/lessons/catalog";
import { TASK_ICONS } from "@/lib/icons";
import { QUICK_SEARCHES, searchLessons, libraryHref, cleanSearch } from "@/lib/lessons/library";
import { fill, LESSON_COPY, LIBRARY_COPY } from "@/lib/lessons/copy";
import { SKILL_LABELS, SKILL_LOOK, SKILL_TAGS, isSkillTag, type SkillTag } from "@/lib/lessons/skills";
import { LibraryDoneProvider, ListenButton, TopicProgress } from "./LibraryDone";
import { LibraryLessonList, type LibraryRow } from "./LibraryLessonList";

export const metadata = {
  title: "Lessons",
  description: "Short practice with real computer tasks, on the same practice computer as the game.",
};

const atkinson = Atkinson_Hyperlegible_Next({ subsets: ["latin"], weight: ["400", "500", "700", "800"] });

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const WAVE_LINES =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='28' viewBox='0 0 120 28'%3E%3Cpath d='M0 14 Q15 4 30 14 T60 14 T90 14 T120 14' fill='none' stroke='%23ffffff' stroke-opacity='.07' stroke-width='2'/%3E%3C/svg%3E\")";
const WAVE_EDGE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='44' viewBox='0 0 240 44' preserveAspectRatio='none'%3E%3Cpath d='M0 22 Q30 6 60 22 T120 22 T180 22 T240 22 V44 H0Z' fill='%232f6fb3' fill-opacity='.55'/%3E%3Cpath d='M0 30 Q30 16 60 30 T120 30 T180 30 T240 30 V44 H0Z' fill='%23f7f3ea'/%3E%3C/svg%3E\") repeat-x bottom/240px 30px";

const inSkill = (skill: SkillTag) => LESSONS.filter((l) => l.skills.includes(skill));

/**
 * The public lesson library. Three views from the URL, so it works without
 * JavaScript: topics (`/lessons`), one topic (`?skill=`), and search (`?q=`,
 * optionally inside a topic). Done badges are added on the client.
 */
export default async function LessonsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string | string[]; skill?: string | string[]; q?: string | string[]; teacher?: string | string[] }>;
}) {
  const query = await searchParams;
  const lang = first(query.lang) === "es" ? "es" : "en";
  const rawSkill = first(query.skill);
  const skill: SkillTag | null = isSkillTag(rawSkill) ? rawSkill : null;
  const queryText = cleanSearch(first(query.q) ?? "");
  const teacher = first(query.teacher) === "1";
  const view = queryText ? "search" : skill ? "topic" : "home";
  // Only offer topics that have a lesson behind them.
  const tags = SKILL_TAGS.filter((t) => inSkill(t).length > 0);

  const here = libraryHref(lang, skill, queryText, teacher);
  const lessonHref = (key: string, preview = false) => {
    const params = new URLSearchParams();
    if (lang === "es") params.set("lang", lang);
    if (preview) params.set("preview", "1");
    params.set("returnTo", here);
    return `/lessons/${key}?${params}`;
  };
  const row = (l: LessonEntry, withIcon: boolean): LibraryRow => {
    const topic = skill && l.skills.includes(skill) ? skill : l.skills[0];
    const look = topic ? SKILL_LOOK[topic] : null;
    const Icon = TASK_ICONS[l.taskKey];
    return {
      lessonKey: l.taskKey,
      title: l.title[lang],
      minutes: l.minutes,
      href: lessonHref(l.taskKey),
      previewHref: teacher ? lessonHref(l.taskKey, true) : undefined,
      ...(withIcon && look && topic
        ? {
            icon: <Icon size={30} />,
            solid: look.colors.solid,
            chip: { label: SKILL_LABELS[topic][lang], tint: look.colors.tint, deep: look.colors.deep },
          }
        : {}),
    };
  };

  const results = view === "search" ? searchLessons(skill, queryText) : [];
  const topicLessons = skill ? inSkill(skill) : [];
  const resultsLine = fill(
    LIBRARY_COPY[skill ? (results.length === 1 ? "oneResultIn" : "resultsIn") : results.length === 1 ? "oneResult" : "results"][lang],
    { n: results.length, q: queryText, topic: skill ? SKILL_LABELS[skill][lang] : "" },
  );
  const spoken =
    view === "search"
      ? [resultsLine, ...results.map((l) => l.title[lang])].join(". ")
      : view === "topic" && skill
        ? [SKILL_LABELS[skill][lang], ...topicLessons.map((l) => l.title[lang])].join(". ")
        : `${LIBRARY_COPY.ask[lang]} ${LIBRARY_COPY.chooseTopic[lang]}: ${tags.map((t) => SKILL_LABELS[t][lang]).join(", ")}`;

  const Ask = view === "home" ? "h1" : "p";

  return (
    <LibraryDoneProvider lessonKeys={LESSONS.map((l) => l.taskKey)}>
      <div lang={lang} className={`harbor ${atkinson.className} flex min-h-screen flex-1 flex-col bg-harbor-sail text-harbor-ink antialiased`}>
        <header
          className="relative bg-harbor-navy px-5 pt-3.5 pb-12 text-white"
          style={{ backgroundImage: WAVE_LINES }}
        >
          <div className="mx-auto flex max-w-[1040px] flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {view === "home" ? (
                <div className="flex items-center gap-3">
                  <span className="flex size-12 items-center justify-center rounded-full bg-harbor-signal text-harbor-navy">
                    <Anchor size={26} aria-hidden />
                  </span>
                  <span className="text-[25px] font-extrabold tracking-[-0.01em]">{LESSON_COPY.library[lang]}</span>
                </div>
              ) : (
                <Link
                  href={libraryHref(lang, null, "", teacher)}
                  className="flex min-h-14 items-center gap-2.5 rounded-full bg-white pr-6 pl-[18px] text-[19px] font-extrabold text-harbor-navy hover:bg-[#e4ecf7]"
                >
                  <span className="text-[26px] leading-none" aria-hidden>
                    ←
                  </span>
                  {LIBRARY_COPY.back[lang]}
                </Link>
              )}
              <div className="ml-auto flex shrink-0 flex-wrap gap-2.5">
                <ListenButton lang={lang} text={spoken}>
                  <Volume2 size={22} aria-hidden />
                  {LIBRARY_COPY.listen[lang]}
                </ListenButton>
                <Link
                  href={libraryHref(lang === "es" ? "en" : "es", skill, queryText, teacher)}
                  lang={lang === "es" ? "en" : "es"}
                  className="flex min-h-13 items-center rounded-full border-2 border-white/50 px-5 text-[17px] font-bold text-white hover:bg-white/12"
                >
                  {LIBRARY_COPY.otherLang[lang]}
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Ask className="m-0 text-[clamp(24px,3.4vw,34px)] leading-[1.08] font-extrabold tracking-[-0.02em] text-balance">
                {LIBRARY_COPY.ask[lang]}
              </Ask>
              <form
                action="/lessons"
                method="get"
                role="search"
                className="flex items-center gap-2 rounded-[22px] bg-white py-1.5 pr-1.5 pl-5 shadow-[0_5px_0_var(--harbor-deep)]"
              >
                {lang === "es" && <input type="hidden" name="lang" value="es" />}
                {skill && <input type="hidden" name="skill" value={skill} />}
                {teacher && <input type="hidden" name="teacher" value="1" />}
                <Search size={28} className="shrink-0 text-harbor-muted-3" aria-hidden />
                <label htmlFor="lesson-search" className="sr-only">
                  {LIBRARY_COPY.search[lang]}
                </label>
                <input
                  key={queryText}
                  id="lesson-search"
                  name="q"
                  type="search"
                  maxLength={200}
                  defaultValue={queryText}
                  placeholder={LIBRARY_COPY.searchHint[lang]}
                  className="min-h-13 min-w-0 flex-1 border-none bg-transparent text-[20px] text-harbor-ink placeholder:text-harbor-muted-3"
                />
                <button
                  type="submit"
                  className="min-h-13 shrink-0 cursor-pointer rounded-2xl bg-harbor-signal px-7 text-[20px] font-extrabold text-harbor-ink hover:bg-harbor-signal-hover"
                >
                  {LIBRARY_COPY.searchButton[lang]}
                </button>
              </form>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-[17px] text-harbor-header-muted">{LIBRARY_COPY.try[lang]}</span>
                {QUICK_SEARCHES.map((s) => (
                  <Link
                    key={s.en}
                    href={libraryHref(lang, null, s[lang], teacher)}
                    className="flex min-h-11 items-center rounded-full bg-white/14 px-[18px] text-[17px] font-bold text-white hover:bg-white/26"
                  >
                    {s[lang]}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div aria-hidden className="absolute right-0 -bottom-px left-0 h-[30px]" style={{ background: WAVE_EDGE }} />
        </header>

        <main className="mx-auto flex w-full max-w-[1080px] flex-1 flex-col gap-9 px-5 pt-4 pb-14">
          {view === "home" && (
            <section aria-labelledby="topics-heading" className="flex flex-col gap-[18px]">
              <h2 id="topics-heading" className="m-0 text-[30px] font-extrabold tracking-[-0.01em]">
                {LIBRARY_COPY.chooseTopic[lang]}
              </h2>
              <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,240px),1fr))] gap-[18px] p-0">
                {tags.map((t) => {
                  const { colors, icon: Icon } = SKILL_LOOK[t];
                  return (
                    <li key={t} className="flex">
                      <Link
                        href={libraryHref(lang, t, "", teacher)}
                        data-testid={`skill-filter-${t}`}
                        className="flex min-h-[250px] flex-1 flex-col items-start gap-4 rounded-3xl px-[22px] pt-5 pb-[22px] text-harbor-ink no-underline"
                        style={{ background: colors.tint, boxShadow: `0 0 0 2px ${colors.solid}33, 0 5px 0 ${colors.solid}55` }}
                      >
                        <span
                          className="flex size-[68px] items-center justify-center rounded-full text-white shadow-[0_0_0_4px_#fff]"
                          style={{ background: colors.solid }}
                        >
                          <Icon size={34} aria-hidden />
                        </span>
                        <span className="text-[23px] leading-[1.15] font-extrabold tracking-[-0.01em] text-balance">
                          {SKILL_LABELS[t][lang]}
                        </span>
                        <TopicProgress
                          lang={lang}
                          lessonKeys={inSkill(t).map((l) => l.taskKey)}
                          solid={colors.solid}
                          deep={colors.deep}
                          size="tile"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {view === "topic" && skill && (
            <div className="flex flex-col gap-6">
              <section
                className="flex flex-wrap items-center gap-6 rounded-[28px] px-[30px] pt-[26px] pb-[30px]"
                style={{ background: SKILL_LOOK[skill].colors.tint, boxShadow: `0 0 0 2px ${SKILL_LOOK[skill].colors.solid}33` }}
              >
                {(() => {
                  const Icon = SKILL_LOOK[skill].icon;
                  return (
                    <span
                      className="flex size-[100px] shrink-0 items-center justify-center rounded-full text-white shadow-[0_0_0_5px_#fff]"
                      style={{ background: SKILL_LOOK[skill].colors.solid }}
                    >
                      <Icon size={50} aria-hidden />
                    </span>
                  );
                })()}
                <div className="flex flex-[1_1_260px] flex-col gap-3">
                  <h1 className="m-0 text-[clamp(30px,4.5vw,44px)] leading-[1.1] font-extrabold tracking-[-0.02em]">
                    {SKILL_LABELS[skill][lang]}
                  </h1>
                  <TopicProgress
                    lang={lang}
                    lessonKeys={topicLessons.map((l) => l.taskKey)}
                    solid={SKILL_LOOK[skill].colors.solid}
                    size="hero"
                  />
                </div>
              </section>
              <LibraryLessonList lang={lang} rows={topicLessons.map((l) => row(l, false))} numbered />
            </div>
          )}

          {view === "search" && (
            <div className="flex flex-col gap-[22px]">
              <h1 aria-live="polite" className="m-0 text-[32px] font-extrabold tracking-[-0.01em]">
                {resultsLine}
              </h1>
              {results.length > 0 ? (
                <LibraryLessonList lang={lang} rows={results.map((l) => row(l, true))} numbered={false} />
              ) : (
                <div className="flex flex-col items-start gap-[18px] rounded-3xl bg-harbor-sand-panel p-7">
                  <p className="m-0 text-[21px] leading-normal">{LIBRARY_COPY.empty[lang]}</p>
                  <Link
                    href={libraryHref(lang, null, "", teacher)}
                    className="flex min-h-15 items-center rounded-full bg-harbor-navy px-[30px] text-[19px] font-extrabold text-white"
                  >
                    {LIBRARY_COPY.seeTopics[lang]}
                  </Link>
                </div>
              )}
            </div>
          )}

          <footer className="flex flex-wrap items-center gap-3.5 border-t-2 border-dashed border-harbor-sand-strong pt-[18px] text-[16px] leading-normal text-harbor-muted-2">
            <Anchor size={22} className="shrink-0 text-[#8a7b5c]" aria-hidden />
            <span className="flex-[1_1_260px]">{LIBRARY_COPY.footer[lang]}</span>
            <Link
              href={libraryHref(lang, skill, queryText, !teacher)}
              className="flex min-h-11 items-center font-bold text-[#1d4f91] hover:text-harbor-ink"
            >
              {teacher ? LIBRARY_COPY.hideTeacher[lang] : LIBRARY_COPY.forTeachers[lang]}
            </Link>
          </footer>
        </main>
      </div>
    </LibraryDoneProvider>
  );
}

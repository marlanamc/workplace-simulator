import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionLearnerId } from "@/lib/auth";
import {
  CATALOG_ACTS,
  catalogStats,
  firstPlayableHref,
  lessonIsBuilt,
  playHref,
} from "@/lib/curriculum-catalog";

export const metadata: Metadata = {
  title: "Studio · Workplace Simulator",
};

export default async function StudioPage() {
  const learnerId = await getSessionLearnerId();
  if (!learnerId) redirect("/login?next=/studio");

  const stats = catalogStats();

  return (
    <div className="min-h-screen bg-[#16171a] text-[#e8eaed]">
      <header className="sticky top-0 z-10 border-b border-white/8 bg-[#16171a]/92 backdrop-blur-md">
        <div className="mx-auto flex max-w-[920px] flex-col gap-4 px-5 py-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-[22px] font-medium leading-tight">Studio</h1>
              <p className="mt-1 max-w-[540px] text-[14px] leading-relaxed text-[#9aa0a6]">
                Every level in the curriculum. Open anything that is built. The rest
                stay here as stubs until they ship. This page skips learner locks. Don&apos;t
                send students here.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-[13px] tabular-nums text-[#9aa0a6]">
                <span className="font-medium text-[#81c995]">{stats.built}</span> playable
                <span className="mx-1.5 text-white/20">·</span>
                {stats.written} not built yet
              </p>
              <Link
                href="/"
                className="inline-flex h-9 items-center rounded-full bg-white/10 px-3.5 text-[13px] font-medium text-white hover:bg-white/20"
              >
                Learner desktop
              </Link>
            </div>
          </div>
          <nav className="flex flex-wrap gap-1.5" aria-label="Acts">
            {CATALOG_ACTS.map((act) => (
              <a
                key={act.key}
                href={`#${act.key}`}
                className="rounded-full px-3 py-1 text-[12px] font-medium text-white/80 hover:bg-white/10 hover:text-white"
                style={{ boxShadow: `inset 0 0 0 1px ${act.color}55` }}
              >
                {act.title.replace(/^Act /, "")}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-[920px] flex-col gap-10 px-5 py-8">
        <section className="rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4">
          <h2 className="text-[15px] font-medium">Track 0: Foundations</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-[#9aa0a6]">
            Happens on a real Chromebook before anyone opens the app. Turn on the
            device, use the mouse, type, and download from Classroom. Not a level in the app.
          </p>
        </section>

        {CATALOG_ACTS.map((act) => {
          const actLessons = act.levels.flatMap((l) => l.lessons);
          const actBuilt = actLessons.filter(lessonIsBuilt).length;
          return (
            <section key={act.key} id={act.key} className="scroll-mt-28">
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <div>
                  <h2 className="text-[18px] font-medium" style={{ color: act.color }}>
                    {act.title}
                  </h2>
                  <p className="mt-0.5 text-[13px] text-[#9aa0a6]">{act.jobTitle}</p>
                </div>
                <p className="shrink-0 text-[12px] tabular-nums text-[#9aa0a6]">
                  {actBuilt}/{actLessons.length} built
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {act.levels.map((level) => {
                  const openHref = firstPlayableHref(level);
                  const isElective = level.lessons.some((l) => l.path);
                  return (
                    <article
                      key={level.key}
                      className="rounded-2xl border border-white/8 bg-white/[0.04] p-4"
                    >
                      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2.5">
                            <span
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-white"
                              style={{ background: act.color }}
                            >
                              {level.n}
                            </span>
                            <h3 className="text-[16px] font-medium leading-tight">
                              {level.title}
                            </h3>
                          </div>
                          <p className="mt-1 pl-[38px] font-mono text-[11px] text-[#80868b]">
                            curriculum/{level.folder}
                          </p>
                        </div>
                        {openHref ? (
                          <Link
                            href={openHref}
                            className="inline-flex h-9 shrink-0 items-center rounded-full bg-white px-3.5 text-[13px] font-medium text-[#202124] hover:bg-[#e8eaed]"
                          >
                            Open level
                          </Link>
                        ) : (
                          <span className="inline-flex h-9 shrink-0 items-center rounded-full bg-white/6 px-3.5 text-[13px] text-[#9aa0a6]">
                            Not built yet
                          </span>
                        )}
                      </div>

                      <ul className="flex flex-col gap-1">
                        {level.lessons.map((lesson) => {
                          const built = lessonIsBuilt(lesson);
                          const href = playHref(lesson);
                          const pathLabel =
                            lesson.path === "a"
                              ? "Path A"
                              : lesson.path === "b"
                                ? "Path B"
                                : null;
                          return (
                            <li
                              key={lesson.taskKey}
                              className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl px-2 py-2 hover:bg-white/[0.04]"
                            >
                              <span className="w-8 shrink-0 text-center text-[12px] tabular-nums text-[#80868b]">
                                {lesson.n}
                              </span>
                              <code className="w-[168px] shrink-0 truncate text-[12px] text-[#c4c7c5]">
                                {lesson.taskKey}
                              </code>
                              <span className="min-w-[140px] flex-1 text-[13px] leading-snug text-[#bdc1c6]">
                                {pathLabel && isElective && (
                                  <span className="mr-1.5 text-[11px] font-medium text-white/50">
                                    {pathLabel}
                                  </span>
                                )}
                                {lesson.skill}
                              </span>
                              <span className="w-[92px] shrink-0 text-[12px] text-[#80868b]">
                                {lesson.app}
                              </span>
                              {href ? (
                                <Link
                                  href={href}
                                  className="shrink-0 rounded-full bg-[#81c995]/15 px-2.5 py-1 text-[12px] font-medium text-[#81c995] hover:bg-[#81c995]/25"
                                >
                                  Open
                                </Link>
                              ) : built ? (
                                <span className="shrink-0 text-[12px] text-[#81c995]">Built</span>
                              ) : (
                                <span className="w-[52px] shrink-0 text-right text-[12px] text-[#80868b]">
                                  Stub
                                </span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}

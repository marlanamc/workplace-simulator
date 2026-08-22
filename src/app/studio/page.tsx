import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { redirect } from "next/navigation";
import { getSessionLearnerId } from "@/lib/auth";
import {
  AFTER_ACT_2_PATHS,
  CATALOG_ACTS,
  TRACK0_LESSONS,
  catalogStats,
  firstPlayableHref,
  lessonIsBuilt,
  lessonNeedsTeacher,
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
                Acts I and II are the shared trunk. Early levels are scaffolded;
                the app can check the click. Later, they write their own emails
                and formulas, and those come to you. Open anything that is built.
                This page skips learner locks. Don&apos;t send students here.
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
            Real Chromebook, before the simulator. Skip any skill they already have.
            Lesson 0.5 is login safety: passwords, PIN, and a fake email. How the
            app itself works is Level 0 in Act I, not Track 0.
          </p>
          <ul className="mt-3 flex flex-col divide-y divide-white/6">
            {TRACK0_LESSONS.map((lesson) => (
              <li key={lesson.n} className="flex items-start justify-between gap-3 py-2 first:pt-0 last:pb-0">
                <p className="text-[13px] leading-snug text-[#e8eaed]">{lesson.skill}</p>
                <p className="shrink-0 text-[12px] text-[#80868b]">
                  <span className="tabular-nums">{lesson.n}</span>
                  <span className="mx-1.5 text-white/20">·</span>
                  {lesson.where}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-3 font-mono text-[11px] text-[#80868b]">
            curriculum/track-0/05-lesson-login-safety.md
          </p>
        </section>

        {CATALOG_ACTS.map((act) => {
          const actLessons = act.levels.flatMap((l) => l.lessons);
          const actBuilt = actLessons.filter(lessonIsBuilt).length;
          const pathLabel =
            act.path === "trunk"
              ? "Shared trunk"
              : act.path === "stay"
                ? "Stay and lead"
                : act.path === "bridge"
                  ? "Open after Act II"
                  : "Office path";
          return (
            <Fragment key={act.key}>
            <section id={act.key} className="scroll-mt-28">
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <div>
                  <h2 className="text-[18px] font-medium" style={{ color: act.color }}>
                    {act.title}
                  </h2>
                  <p className="mt-0.5 text-[12px] font-medium text-white/45">{pathLabel}</p>
                  <p className="mt-1 max-w-[640px] text-[13px] leading-relaxed text-[#9aa0a6]">
                    {act.blurb}
                  </p>
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

                      <ul className="flex flex-col divide-y divide-white/6">
                        {level.lessons.map((lesson) => {
                          const built = lessonIsBuilt(lesson);
                          const href = playHref(lesson);
                          const teacherCheck = lessonNeedsTeacher(lesson);
                          const pathLabel =
                            lesson.path === "a"
                              ? "Path A"
                              : lesson.path === "b"
                                ? "Path B"
                                : null;
                          return (
                            <li
                              key={lesson.taskKey}
                              className="flex items-start justify-between gap-3 px-1 py-2.5 first:pt-0 last:pb-0"
                            >
                              <div className="min-w-0">
                                <p className="text-[13px] leading-snug text-[#e8eaed]">
                                  {pathLabel && isElective && (
                                    <span className="mr-1.5 text-[11px] font-medium text-white/50">
                                      {pathLabel}
                                    </span>
                                  )}
                                  {lesson.skill}
                                </p>
                                <p className="mt-0.5 text-[12px] text-[#80868b]">
                                  <span className="tabular-nums">{lesson.n}</span>
                                  <span className="mx-1.5 text-white/20">·</span>
                                  <code className="text-[11px] text-[#9aa0a6]">{lesson.taskKey}</code>
                                  <span className="mx-1.5 text-white/20">·</span>
                                  {lesson.app}
                                  <span className="mx-1.5 text-white/20">·</span>
                                  {teacherCheck ? (
                                    <span className="text-[#fdd663]">You check</span>
                                  ) : (
                                    <span>App checks</span>
                                  )}
                                </p>
                              </div>
                              {href ? (
                                <Link
                                  href={href}
                                  className="mt-0.5 shrink-0 rounded-full bg-[#81c995]/15 px-2.5 py-1 text-[12px] font-medium text-[#81c995] hover:bg-[#81c995]/25"
                                >
                                  Open
                                </Link>
                              ) : built ? (
                                <span className="mt-0.5 shrink-0 text-[12px] text-[#81c995]">Built</span>
                              ) : (
                                <span className="mt-0.5 shrink-0 text-[12px] text-[#80868b]">
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
            {act.key === "act2" && (
              <section className="rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4">
                <h2 className="text-[15px] font-medium">After Act II, pick a door</h2>
                <p className="mt-1 text-[13px] leading-relaxed text-[#9aa0a6]">
                  Busy students can stop here and already be more employable. The three
                  paths below are equal. Nobody has to climb the cafe ladder first.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {AFTER_ACT_2_PATHS.map((path) => (
                    <a
                      key={path.id}
                      href={path.href}
                      className="rounded-xl border border-white/8 bg-white/[0.04] p-3 hover:bg-white/[0.07]"
                    >
                      <p className="text-[14px] font-medium text-[#e8eaed]">{path.title}</p>
                      <p className="mt-1 text-[12px] leading-relaxed text-[#9aa0a6]">{path.body}</p>
                    </a>
                  ))}
                </div>
              </section>
            )}
            </Fragment>
          );
        })}
      </main>
    </div>
  );
}

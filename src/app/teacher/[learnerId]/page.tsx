import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { getSessionLearnerId } from "@/lib/auth";
import { getBadges, getCompletions, getLearnerById, getLearnerSubmissions } from "@/lib/db/queries";
import SubmissionCard from "../SubmissionCard";
import ProgressStrip from "../ProgressStrip";
import { studentProgress } from "../progress";

export const metadata: Metadata = {
  title: "Student progress · Workplace Simulator",
};

export default async function StudentProgressPage({
  params,
}: {
  params: Promise<{ learnerId: string }>;
}) {
  const { learnerId: studentId } = await params;

  const myId = await getSessionLearnerId();
  if (!myId) redirect("/login?next=/teacher");
  const me = await getLearnerById(myId);
  if (!me || me.role !== "teacher") redirect("/");

  const student = await getLearnerById(studentId);
  if (!student || student.classCode !== me.classCode) notFound();

  const [completions, badges, submissions] = await Promise.all([
    getCompletions(studentId),
    getBadges(studentId),
    getLearnerSubmissions(studentId),
  ]);

  const progress = studentProgress(
    completions.map((c) => c.taskKey),
    badges.map((b) => b.badgeKey),
  );

  return (
    <div className="min-h-screen bg-[#16171a] text-[#e8eaed]">
      <header className="sticky top-0 z-10 border-b border-white/8 bg-[#16171a]/92 px-5 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-[760px] flex-col gap-3">
          <Link
            href="/teacher"
            className="inline-flex w-fit items-center gap-1.5 text-[13px] font-medium text-[#9aa0a6] hover:text-white"
          >
            <ArrowLeft size={15} strokeWidth={2.25} />
            Your class
          </Link>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-[22px] font-medium leading-tight">{student.displayName}</h1>
              <p className="mt-1 text-[13px] text-[#9aa0a6]">{progress.whereLabel}</p>
            </div>
            <div className="flex items-center gap-3">
              <ProgressStrip acts={progress.acts} />
              <span className="tabular-nums text-[13px] text-[#9aa0a6]">
                {progress.tasksDone}/{progress.tasksTotal} tasks
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-[760px] flex-col gap-8 px-5 py-8">
        {/* The full curriculum map, act by act */}
        <section className="flex flex-col gap-4">
          {progress.map.map(({ act, levels }) => {
            if (act.state === "off-path") return null;
            const levelsWithLessons = levels.filter((l) => l.lessons.length > 0);
            if (levelsWithLessons.length === 0) return null;
            return (
              <div key={act.key} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-[15px] font-medium" style={{ color: act.color }}>
                    {act.title}
                  </h2>
                  <span className="shrink-0 text-[12px] tabular-nums text-[#9aa0a6]">
                    {act.done}/{act.total}
                  </span>
                </div>
                <div className="mt-3 flex flex-col gap-2.5">
                  {levelsWithLessons.map((level) => (
                    <div key={level.key}>
                      <div className="text-[11px] font-medium uppercase tracking-wide text-[#80868b]">
                        {level.title}
                      </div>
                      <ul className="mt-1 flex flex-col gap-1">
                        {level.lessons.map((lesson) => (
                          <li key={lesson.taskKey} className="flex items-center gap-2 text-[13px]">
                            <span
                              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                              style={{
                                background: lesson.done ? act.color : "transparent",
                                boxShadow: lesson.done ? undefined : "inset 0 0 0 1.5px rgba(255,255,255,0.25)",
                              }}
                            >
                              {lesson.done && <Check size={11} strokeWidth={3} className="text-[#16171a]" />}
                            </span>
                            <span className={lesson.done ? "text-[#e8eaed]" : "text-[#9aa0a6]"}>
                              {lesson.skill}
                            </span>
                            {lesson.teacherCheck && (
                              <span className="text-[11px] text-[#fdd663]">· you check</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* What they've written */}
        <section>
          <h2 className="text-[16px] font-medium">
            Writing
            <span className="ml-2 text-[13px] font-normal text-[#9aa0a6]">{submissions.length}</span>
          </h2>
          {submissions.length === 0 ? (
            <p className="mt-2 text-[13px] text-[#9aa0a6]">
              Nothing yet — later tasks the app can&apos;t grade will show up here as {student.displayName} writes them.
            </p>
          ) : (
            <div className="mt-3 flex flex-col gap-3">
              {submissions.map((s) => (
                <SubmissionCard key={s.id} submission={s} dim={Boolean(s.teacherNote)} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

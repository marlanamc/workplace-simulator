import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionLearnerId } from "@/lib/auth";
import { getClassRoster, getClassSubmissions, getLearnerById } from "@/lib/db/queries";
import SubmissionCard from "./SubmissionCard";
import ProgressStrip from "./ProgressStrip";
import { studentProgress } from "./progress";

export const metadata: Metadata = {
  title: "Teacher · Workplace Simulator",
};

export default async function TeacherPage() {
  const learnerId = await getSessionLearnerId();
  if (!learnerId) redirect("/login?next=/teacher");
  const me = await getLearnerById(learnerId);
  if (!me || me.role !== "teacher") redirect("/");

  const [roster, submissions] = await Promise.all([
    getClassRoster(me.classCode),
    getClassSubmissions(me.classCode),
  ]);

  const needsReview = submissions.filter((s) => !s.teacherNote);
  const reviewed = submissions.filter((s) => s.teacherNote);
  const pendingByLearner = new Map<string, number>();
  for (const s of needsReview) {
    pendingByLearner.set(s.learnerId, (pendingByLearner.get(s.learnerId) ?? 0) + 1);
  }

  const students = roster
    .filter((p) => p.role !== "teacher")
    .map((p) => ({
      ...p,
      progress: studentProgress(
        p.completions.map((c) => c.taskKey),
        p.badges.map((b) => b.badgeKey),
      ),
      pending: pendingByLearner.get(p.id) ?? 0,
    }));

  return (
    <div className="min-h-screen bg-[#16171a] text-[#e8eaed]">
      <header className="sticky top-0 z-10 border-b border-white/8 bg-[#16171a]/92 px-5 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-[960px] flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-medium leading-tight">Your class</h1>
            <p className="mt-1 text-[13px] text-[#9aa0a6]">
              Class code <span className="font-mono text-[#e8eaed]">{me.classCode}</span>. Track where each
              student is, and read and comment on what they wrote in the later tasks. Your notes reach the
              student the next time they open the simulator — nothing is blocked in the meantime.
            </p>
          </div>
          <Link
            href="/studio"
            className="inline-flex h-9 items-center rounded-full bg-white/10 px-3.5 text-[13px] font-medium text-white hover:bg-white/20"
          >
            Studio
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-[960px] flex-col gap-10 px-5 py-8">
        {/* Roster */}
        <section>
          <h2 className="text-[16px] font-medium">Students</h2>
          {students.length === 0 ? (
            <p className="mt-2 text-[13px] text-[#9aa0a6]">
              No students have signed in with class code {me.classCode} yet.
            </p>
          ) : (
            <div className="mt-3 overflow-x-auto rounded-2xl border border-white/8">
              <table className="w-full min-w-[620px] text-left text-[13px]">
                <thead className="bg-white/[0.03] text-[#9aa0a6]">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Name</th>
                    <th className="px-4 py-2.5 font-medium">Where they are</th>
                    <th className="px-4 py-2.5 font-medium">Progress</th>
                    <th className="px-4 py-2.5 font-medium">Waiting on you</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/6">
                  {students.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.02]">
                      <td className="px-4 py-2.5">
                        <Link
                          href={`/teacher/${p.id}`}
                          className="font-medium text-[#8ab4f8] hover:underline"
                        >
                          {p.displayName}
                        </Link>
                      </td>
                      <td className="px-4 py-2.5 text-[#9aa0a6]">{p.progress.whereLabel}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-3">
                          <ProgressStrip acts={p.progress.acts} />
                          <span className="tabular-nums text-[12px] text-[#80868b]">
                            {p.progress.tasksDone}/{p.progress.tasksTotal}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 tabular-nums">
                        {p.pending > 0 ? (
                          <span className="text-[#fdd663]">{p.pending}</span>
                        ) : (
                          <span className="text-[#80868b]">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Needs review */}
        <section>
          <h2 className="text-[16px] font-medium">
            Needs your review
            <span className="ml-2 text-[13px] font-normal text-[#9aa0a6]">{needsReview.length}</span>
          </h2>
          {needsReview.length === 0 ? (
            <p className="mt-2 text-[13px] text-[#9aa0a6]">
              Nothing waiting. New writing shows up here as students submit it.
            </p>
          ) : (
            <div className="mt-3 flex flex-col gap-3">
              {needsReview.map((s) => (
                <SubmissionCard key={s.id} submission={s} who={s.learnerName} />
              ))}
            </div>
          )}
        </section>

        {/* Already reviewed */}
        {reviewed.length > 0 && (
          <section>
            <h2 className="text-[16px] font-medium">
              Reviewed
              <span className="ml-2 text-[13px] font-normal text-[#9aa0a6]">{reviewed.length}</span>
            </h2>
            <div className="mt-3 flex flex-col gap-3">
              {reviewed.map((s) => (
                <SubmissionCard key={s.id} submission={s} who={s.learnerName} dim />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

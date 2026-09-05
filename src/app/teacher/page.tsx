import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionLearnerId } from "@/lib/auth";
import { getClassRoster, getClassSubmissions, getLearnerById } from "@/lib/db/queries";
import type { SubmissionContent } from "@/lib/task-types";
import type { TaskKey } from "@/lib/desktop-content";
import { SKILLS } from "@/lib/skills";
import { activeTrack, actForLevel, levelForTrack } from "@/lib/tracks-content";
import { bridgePathFromBadgeKeys } from "@/lib/bridge-path";
import NoteForm from "./NoteForm";

export const metadata: Metadata = {
  title: "Teacher · Workplace Simulator",
};

function taskTitle(taskKey: string): string {
  return SKILLS[taskKey as TaskKey] ?? taskKey;
}

function whereInStory(completions: { taskKey: string }[], badgeKeys: string[]): string {
  const done = Array.from(new Set(completions.map((c) => c.taskKey))) as TaskKey[];
  if (done.length === 0) return "Just started";
  const path = bridgePathFromBadgeKeys(badgeKeys);
  const track = activeTrack(done, path);
  const level = levelForTrack(track.key);
  const act = actForLevel(level);
  const actLabel = act ? act.title.replace(/:.*$/, "") : "";
  return actLabel ? `${actLabel} · ${level.title}` : level.title;
}

function fmtDate(d: Date): string {
  return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

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

  return (
    <div className="min-h-screen bg-[#16171a] text-[#e8eaed]">
      <header className="sticky top-0 z-10 border-b border-white/8 bg-[#16171a]/92 px-5 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-[960px] flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-medium leading-tight">Your class</h1>
            <p className="mt-1 text-[13px] text-[#9aa0a6]">
              Class code <span className="font-mono text-[#e8eaed]">{me.classCode}</span>. Everything students
              wrote in the later tasks lands here for you to read and comment on. Your notes reach the student
              the next time they open the simulator — nothing is blocked in the meantime.
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
        {/* Needs review */}
        <section>
          <h2 className="text-[16px] font-medium">
            Needs your review
            <span className="ml-2 text-[13px] font-normal text-[#9aa0a6]">{needsReview.length}</span>
          </h2>
          {needsReview.length === 0 ? (
            <p className="mt-2 text-[13px] text-[#9aa0a6]">Nothing waiting. New writing shows up here as students submit it.</p>
          ) : (
            <div className="mt-3 flex flex-col gap-3">
              {needsReview.map((s) => (
                <article key={s.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <span className="text-[14px] font-medium">{s.learnerName}</span>
                      <span className="mx-2 text-white/20">·</span>
                      <span className="text-[13px] text-[#9aa0a6]">{taskTitle(s.taskKey)}</span>
                    </div>
                    <span className="text-[12px] text-[#80868b]">{fmtDate(s.submittedAt)}</span>
                  </div>
                  <SubmissionBody content={s.content as SubmissionContent} />
                  <NoteForm submissionId={s.id} existingNote={s.teacherNote} />
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Roster */}
        <section>
          <h2 className="text-[16px] font-medium">Students</h2>
          <div className="mt-3 overflow-x-auto rounded-2xl border border-white/8">
            <table className="w-full min-w-[520px] text-left text-[13px]">
              <thead className="bg-white/[0.03] text-[#9aa0a6]">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Name</th>
                  <th className="px-4 py-2.5 font-medium">Where they are</th>
                  <th className="px-4 py-2.5 font-medium">Tasks done</th>
                  <th className="px-4 py-2.5 font-medium">Waiting on you</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/6">
                {roster
                  .filter((p) => p.role !== "teacher")
                  .map((p) => {
                    const doneCount = new Set(p.completions.map((c) => c.taskKey)).size;
                    const pending = pendingByLearner.get(p.id) ?? 0;
                    return (
                      <tr key={p.id}>
                        <td className="px-4 py-2.5 font-medium text-[#e8eaed]">{p.displayName}</td>
                        <td className="px-4 py-2.5 text-[#9aa0a6]">
                          {whereInStory(p.completions, p.badges.map((b) => b.badgeKey))}
                        </td>
                        <td className="px-4 py-2.5 tabular-nums text-[#9aa0a6]">{doneCount}</td>
                        <td className="px-4 py-2.5 tabular-nums">
                          {pending > 0 ? <span className="text-[#fdd663]">{pending}</span> : <span className="text-[#80868b]">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                {roster.filter((p) => p.role !== "teacher").length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-[#9aa0a6]">
                      No students have signed in with class code {me.classCode} yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
                <article key={s.id} className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <span className="text-[14px] font-medium">{s.learnerName}</span>
                      <span className="mx-2 text-white/20">·</span>
                      <span className="text-[13px] text-[#9aa0a6]">{taskTitle(s.taskKey)}</span>
                    </div>
                    <span className="text-[12px] text-[#80868b]">
                      {s.seenAt ? `Read ${fmtDate(s.seenAt)}` : "Not opened yet"}
                    </span>
                  </div>
                  <SubmissionBody content={s.content as SubmissionContent} />
                  <NoteForm submissionId={s.id} existingNote={s.teacherNote} />
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function SubmissionBody({ content }: { content: SubmissionContent }) {
  return (
    <dl className="mt-3 flex flex-col gap-2.5">
      {content.fields.map((f, i) => (
        <div key={i}>
          <dt className="text-[11px] font-medium uppercase tracking-wide text-[#80868b]">{f.label}</dt>
          <dd className="mt-0.5 whitespace-pre-wrap text-[14px] leading-relaxed text-[#e8eaed]">
            {f.value.trim() || <span className="text-[#80868b]">(left blank)</span>}
          </dd>
        </div>
      ))}
      {content.lang === "es" && (
        <p className="text-[11px] text-[#80868b]">Written in Spanish.</p>
      )}
    </dl>
  );
}

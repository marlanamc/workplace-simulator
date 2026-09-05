import type { SubmissionContent } from "@/lib/task-types";
import type { TaskKey } from "@/lib/desktop-content";
import { SKILLS } from "@/lib/skills";
import NoteForm from "./NoteForm";

export function taskTitle(taskKey: string): string {
  return SKILLS[taskKey as TaskKey] ?? taskKey;
}

export function fmtDate(d: Date | string): string {
  return new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

interface SubmissionRow {
  id: string;
  taskKey: string;
  content: unknown;
  submittedAt: Date | string;
  teacherNote: string | null;
  seenAt: Date | string | null;
}

/** One student submission: what they wrote + your note. Shared by the queue and the per-student page. */
export default function SubmissionCard({
  submission,
  who,
  dim = false,
}: {
  submission: SubmissionRow;
  /** Student name, when the card isn't already under a student heading. */
  who?: string;
  dim?: boolean;
}) {
  const content = submission.content as SubmissionContent;
  return (
    <article className={`rounded-2xl border border-white/8 p-4 ${dim ? "bg-white/[0.02]" : "bg-white/[0.03]"}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          {who && (
            <>
              <span className="text-[14px] font-medium">{who}</span>
              <span className="mx-2 text-white/20">·</span>
            </>
          )}
          <span className="text-[13px] text-[#9aa0a6]">{taskTitle(submission.taskKey)}</span>
        </div>
        <span className="text-[12px] text-[#80868b]">
          {submission.teacherNote
            ? submission.seenAt
              ? `Read ${fmtDate(submission.seenAt)}`
              : "Not opened yet"
            : fmtDate(submission.submittedAt)}
        </span>
      </div>

      <dl className="mt-3 flex flex-col gap-2.5">
        {content.fields.map((f, i) => (
          <div key={i}>
            <dt className="text-[11px] font-medium uppercase tracking-wide text-[#80868b]">{f.label}</dt>
            <dd className="mt-0.5 whitespace-pre-wrap text-[14px] leading-relaxed text-[#e8eaed]">
              {f.value.trim() || <span className="text-[#80868b]">(left blank)</span>}
            </dd>
          </div>
        ))}
        {content.lang === "es" && <p className="text-[11px] text-[#80868b]">Written in Spanish.</p>}
      </dl>

      <NoteForm submissionId={submission.id} existingNote={submission.teacherNote} />
    </article>
  );
}

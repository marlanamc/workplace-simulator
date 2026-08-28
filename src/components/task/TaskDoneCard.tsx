/**
 * A finished job is a quiet moment, not a screen to read. The Job Card holds
 * the sentence and the one button; this is just the check the learner sees in
 * place of the work they were doing.
 *
 * The skill recap that used to live here (title, body, badge number, "Counts
 * toward…") is banked into the awards case silently instead of being handed
 * to the learner to read — see the Job Card handoff.
 */
export default function TaskDoneCard({
  kicker,
}: {
  kicker: string;
  title?: string;
  body?: string;
  badgeNumber?: string;
  badgeName?: string;
  badgeWhere?: string;
  compact?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-[var(--success-tint)] px-4 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--success)] text-white">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <div className="text-[13px] font-semibold uppercase tracking-wide text-[var(--success)]">{kicker}</div>
    </div>
  );
}

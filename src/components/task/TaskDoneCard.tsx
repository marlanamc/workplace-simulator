/**
 * Per-task completion is a quiet moment - a check, a skill name, and Next.
 * Confetti stays reserved for bigger certificate/promotion celebrations.
 */
export default function TaskDoneCard({
  kicker,
  title,
  body,
  badgeNumber,
  badgeName,
  badgeWhere,
}: {
  kicker: string;
  title: string;
  body: string;
  badgeNumber: string;
  badgeName: string;
  badgeWhere: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 rounded-xl bg-[var(--success-tint)] px-4 py-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--success)] text-white">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div className="text-[13px] font-semibold uppercase tracking-wide text-[var(--success)]">{kicker}</div>
      </div>

      <div className="mt-4">
        <h2 className="text-[24px] font-medium leading-tight">{title}</h2>
        <p className="mt-2 max-w-[60ch] text-[16px] leading-relaxed text-[var(--text-secondary)]">{body}</p>
      </div>

      <div className="mt-5 flex items-center gap-4 rounded-xl border border-[var(--warning-tint)] bg-[var(--warning-tint)] p-4">
        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-[#3c4043] leading-tight text-white">
          <span className="text-[9px] tracking-wide">SKILL</span>
          <span className="text-[19px] font-semibold">{badgeNumber}</span>
        </div>
        <div>
          <div className="text-[16px] font-medium">{badgeName}</div>
          <div className="mt-0.5 text-[13px] text-[var(--text-secondary)]">{badgeWhere}</div>
        </div>
      </div>
    </div>
  );
}

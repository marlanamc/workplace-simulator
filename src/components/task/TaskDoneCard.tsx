import Confetti from "./Confetti";

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
    <div className="relative">
      <Confetti count={22} />
      <div>
        <div className="text-[12px] font-semibold uppercase tracking-wide text-[var(--success)]">{kicker}</div>
        <h2 className="mt-1.5 text-[24px] font-medium leading-tight">{title}</h2>
        <p className="mt-2 max-w-[60ch] text-[16px] leading-relaxed text-[var(--text-secondary)]">{body}</p>
      </div>

      <div className="mt-5 flex items-center gap-4 rounded-xl border border-[var(--warning-tint)] bg-[var(--warning-tint)] p-4">
        <div className="animate-pop-in flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-[#3c4043] leading-tight text-white">
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

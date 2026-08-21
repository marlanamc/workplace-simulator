import type { LucideIcon } from "lucide-react";

/** An Oregon-Trail-style "here's what just happened" event card shown before a task starts. */
export default function EventIntroCard({
  icon: Icon,
  kicker,
  headline,
  body,
  cta,
  onContinue,
}: {
  icon: LucideIcon;
  kicker: string;
  headline: string;
  body: string;
  cta: string;
  onContinue: () => void;
  /** Kept so task copy can still spread EVENT_INTRO without a type error. */
  emoji?: string;
}) {
  return (
    <div className="mx-auto flex max-w-[520px] flex-col items-center gap-3 py-10 text-center animate-fade-up">
      <Icon size={52} strokeWidth={1.6} className="animate-pop-in text-[var(--text-primary)]" aria-hidden />
      <div className="text-[12px] font-semibold uppercase tracking-wide text-[var(--warning)]">{kicker}</div>
      <h2 className="max-w-[46ch] text-[24px] font-medium leading-tight">{headline}</h2>
      <p className="max-w-[52ch] text-[16px] leading-relaxed text-[var(--text-secondary)]">{body}</p>
      <button
        onClick={onContinue}
        className="mt-2 inline-flex min-h-[48px] items-center rounded-full bg-[var(--accent)] px-7 text-[16px] font-medium text-white hover:bg-[var(--accent-hover)] cursor-pointer"
      >
        {cta}
      </button>
    </div>
  );
}

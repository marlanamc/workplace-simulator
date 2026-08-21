import type { Lesson } from "@/lib/task-types";

export default function HelpDrawer({
  open,
  onClose,
  kicker,
  lesson,
  tipLabel,
  gotItLabel,
  askPersonLabel,
}: {
  open: boolean;
  onClose: () => void;
  kicker: string;
  lesson: Lesson;
  tipLabel: string;
  gotItLabel: string;
  askPersonLabel: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end bg-black/40">
      <div className="flex h-full w-full max-w-[420px] flex-col gap-5 overflow-y-auto bg-white p-6 animate-slide-in">
        <div className="flex items-start gap-3">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-wide text-[var(--warning)]">
              {kicker}
            </div>
            <h3 className="mt-1.5 text-[20px] font-medium leading-tight">{lesson.t}</h3>
          </div>
          <div className="flex-1" />
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[16px] text-[var(--text-secondary)] cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {lesson.s.map((text, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-[var(--border)] bg-white p-3.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--warning-tint)] text-[13px] font-semibold text-[var(--warning)]">
                {i + 1}
              </span>
              <span className="text-[15px] leading-relaxed">{text}</span>
            </div>
          ))}
        </div>

        <div className="rounded-lg bg-[var(--surface-muted)] p-4 text-[14px] leading-relaxed text-[var(--text-secondary)]">
          <span className="font-semibold text-[var(--text-primary)]">{tipLabel}: </span>
          {lesson.tip}
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={onClose}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--accent)] text-[15px] font-medium text-white hover:bg-[var(--accent-hover)] cursor-pointer"
          >
            {gotItLabel}
          </button>
          <button
            onClick={onClose}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--border)] text-[14px] font-medium text-[var(--text-secondary)] cursor-pointer"
          >
            {askPersonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

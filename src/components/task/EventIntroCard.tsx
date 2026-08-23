import type { LucideIcon } from "lucide-react";

/**
 * Story beat before a task: warm Harborside paper card, not a blank white slab.
 * Same shape for every job so the cafe feel stays consistent.
 */
export default function EventIntroCard({
  icon: Icon,
  kicker,
  headline,
  subheadline,
  body,
  cta,
  onContinue,
}: {
  icon: LucideIcon;
  kicker: string;
  headline: string;
  subheadline?: string;
  body: string;
  cta: string;
  onContinue: () => void;
  /** Kept so task copy can still spread EVENT_INTRO without a type error. */
  emoji?: string;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[480px] flex-col items-center py-6 animate-fade-up">
      <div
        className="relative w-full overflow-hidden rounded-[28px] px-8 pb-9 pt-10 text-center"
        style={{
          background: "linear-gradient(165deg, #fff9f1 0%, #f4e8d8 55%, #ebe0ce 100%)",
          border: "1px solid #dfd0bc",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.75), 0 20px 48px rgba(60, 36, 16, 0.14)",
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-[5px]"
          style={{ background: "linear-gradient(90deg, #a34c1f 0%, #c45c26 50%, #8a4b2a 100%)" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full opacity-[0.14]"
          style={{ background: "radial-gradient(circle, #c45c26 0%, transparent 70%)" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-8 h-44 w-44 rounded-full opacity-[0.1]"
          style={{ background: "radial-gradient(circle, #8a4b2a 0%, transparent 70%)" }}
          aria-hidden
        />

        <span
          className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full text-white animate-pop-in"
          style={{
            background: "linear-gradient(145deg, #d46a30 0%, #a34c1f 100%)",
            boxShadow: "0 10px 24px rgba(163, 76, 31, 0.35)",
          }}
        >
          <Icon size={30} strokeWidth={1.75} aria-hidden />
        </span>

        <p className="relative text-[12px] font-bold uppercase tracking-[0.16em] text-[#a34c1f]">
          {kicker}
        </p>
        <h2 className="relative mx-auto mt-3 max-w-[24ch] text-[30px] font-medium leading-[1.12] tracking-[-0.02em] text-[#1c1410]">
          {headline}
          {subheadline ? (
            <>
              <br />
              <span className="mt-1 inline-block text-[22px] font-medium leading-snug tracking-[-0.015em] text-[#3d2a1a]">
                {subheadline}
              </span>
            </>
          ) : null}
        </h2>
        <p className="relative mx-auto mt-4 max-w-[36ch] text-[16px] leading-relaxed text-[#6a4e32]">
          {body}
        </p>
        <button
          type="button"
          onClick={onContinue}
          className="relative mt-7 inline-flex min-h-[50px] items-center rounded-full bg-[#c45c26] px-8 text-[16px] font-medium text-white shadow-[0_8px_20px_rgba(163,76,31,0.32)] hover:bg-[#a34c1f] cursor-pointer"
        >
          {cta}
        </button>
      </div>
    </div>
  );
}

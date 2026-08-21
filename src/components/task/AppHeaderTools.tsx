"use client";

/** Quiet header tools - Google apps put Help up here, not a yellow chip. Language lives in the shelf. */
export default function AppHeaderTools({
  helpLabel,
  onHelp,
}: {
  helpLabel: string;
  onHelp: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center">
      <button
        type="button"
        onClick={onHelp}
        title={helpLabel}
        aria-label={helpLabel}
        className="flex h-10 w-10 items-center justify-center rounded-full text-[#444746] hover:bg-black/[0.06] cursor-pointer"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#747775] text-[13px] font-medium">
          ?
        </span>
      </button>
    </div>
  );
}

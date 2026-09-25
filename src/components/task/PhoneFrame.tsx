import type { ReactNode } from "react";

const PHONE_TYPE =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif';

/**
 * A phone held beside a task: bezel, side buttons, notch, and status bar,
 * with whatever screen the task needs inside. Shown next to the work (never
 * in a modal) so the learner can read it while typing.
 */
export default function PhoneFrame({
  label,
  time = "8:14",
  children,
}: {
  /** Caption under the phone. */
  label?: string;
  time?: string;
  children: ReactNode;
}) {
  return (
    <figure className="mx-auto w-[236px]">
      <div className="relative">
        <div
          aria-hidden
          className="absolute -left-[3px] top-[58px] h-[16px] w-[3px] rounded-l-[2px] bg-[#5c5c60]"
        />
        <div
          aria-hidden
          className="absolute -left-[3px] top-[86px] h-[32px] w-[3px] rounded-l-[2px] bg-[#5c5c60]"
        />
        <div
          aria-hidden
          className="absolute -left-[3px] top-[124px] h-[32px] w-[3px] rounded-l-[2px] bg-[#5c5c60]"
        />
        <div
          aria-hidden
          className="absolute -right-[3px] top-[100px] h-[56px] w-[3px] rounded-r-[2px] bg-[#5c5c60]"
        />

        <div
          className="rounded-[42px] p-[8px] shadow-[0_18px_40px_rgba(0,0,0,0.28),0_4px_10px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.28),inset_0_-1px_0_rgba(0,0,0,0.55)]"
          style={{
            background:
              "linear-gradient(160deg, #4a4a4e 0%, #1c1c1e 22%, #111113 100%)",
          }}
        >
          <div
            className="relative overflow-hidden rounded-[34px] bg-[#f2f2f7] text-[#1d1d1f] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.45)]"
            style={{ fontFamily: PHONE_TYPE }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[8px] z-10 h-[24px] w-[78px] -translate-x-1/2 rounded-full bg-black"
            />

            <div
              aria-hidden
              className="flex h-[40px] items-end justify-between px-[16px] pb-[5px] text-[11px] font-semibold tracking-tight"
            >
              <span>{time}</span>
              <span className="flex items-center gap-[5px]">
                <SignalIcon />
                <WifiIcon />
                <BatteryIcon />
              </span>
            </div>

            {children}

            <div aria-hidden className="flex justify-center pb-[8px] pt-[2px]">
              <div className="h-[4px] w-[96px] rounded-full bg-[#1d1d1f]/25" />
            </div>
          </div>
        </div>
      </div>
      {label && (
        <figcaption className="mt-2 text-center text-[13px] font-semibold leading-snug text-text-primary">
          {label}
        </figcaption>
      )}
    </figure>
  );
}

function SignalIcon() {
  return (
    <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
      <rect x="0" y="7" width="3" height="4" rx="0.6" />
      <rect x="4.2" y="5" width="3" height="6" rx="0.6" />
      <rect x="8.4" y="2.5" width="3" height="8.5" rx="0.6" />
      <rect x="12.6" y="0" width="3" height="11" rx="0.6" opacity="0.28" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
      <path
        d="M1.2 4.4c3.2-3.1 8.4-3.1 11.6 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M3.2 6.6c2.1-2 5.5-2 7.6 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="7" cy="9.3" r="1.15" fill="currentColor" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="24" height="11" viewBox="0 0 24 11" fill="none">
      <rect
        x="0.6"
        y="0.6"
        width="20"
        height="9.8"
        rx="2.2"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect x="2.2" y="2.2" width="13.5" height="6.6" rx="1.2" fill="currentColor" />
      <path d="M22 3.4v4.2a1.6 1.6 0 0 0 0-4.2Z" fill="currentColor" opacity="0.45" />
    </svg>
  );
}

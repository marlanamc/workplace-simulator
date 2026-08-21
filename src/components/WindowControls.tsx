"use client";

import { useRouter } from "next/navigation";
import { useNudge } from "@/lib/use-nudge";
import NudgeToast from "@/components/task/NudgeToast";
import { SHELF_HEIGHT } from "@/components/Shelf";

function MinimizeIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden>
      <rect x="1.5" y="5.2" width="8" height="1.1" fill="currentColor" />
    </svg>
  );
}

function MaximizeIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden>
      <rect x="1.5" y="1.5" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden>
      <path d="M1.5 1.5 L9.5 9.5 M9.5 1.5 L1.5 9.5" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
    </svg>
  );
}

/** The minimize/maximize/close trio real app windows have, for visual realism. */
export default function WindowControls({ dark = false }: { dark?: boolean }) {
  const router = useRouter();
  const { nudge, say } = useNudge();
  const iconColor = dark ? "text-white/70" : "text-[#5f6368]";

  return (
    <>
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => say("Nothing to minimize to here — click the shelf to switch apps.")}
          aria-label="Minimize"
          className={`flex h-8 w-9 items-center justify-center hover:bg-black/8 cursor-pointer ${iconColor}`}
        >
          <MinimizeIcon />
        </button>
        <button
          onClick={() => say("This window is already full screen.")}
          aria-label="Maximize"
          className={`flex h-8 w-9 items-center justify-center hover:bg-black/8 cursor-pointer ${iconColor}`}
        >
          <MaximizeIcon />
        </button>
        <button
          onClick={() => router.push("/")}
          aria-label="Close"
          className={`flex h-8 w-9 items-center justify-center hover:bg-[#e81123] hover:text-white cursor-pointer ${iconColor}`}
        >
          <CloseIcon />
        </button>
      </div>
      <NudgeToast text={nudge} bottom={SHELF_HEIGHT + 20} />
    </>
  );
}

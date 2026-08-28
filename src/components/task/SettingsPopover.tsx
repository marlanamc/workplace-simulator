"use client";

import { useState } from "react";

function Toggle({ on }: { on: boolean }) {
  return (
    <span className={`h-5 w-9 rounded-full ${on ? "bg-[var(--accent)]" : "bg-[var(--border)]"} relative transition-colors`}>
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${on ? "left-[18px]" : "left-0.5"}`} />
    </span>
  );
}

export default function SettingsPopover({
  bigText,
  onToggleBigText,
  label,
}: {
  bigText: boolean;
  onToggleBigText: () => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={label}
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[15px] font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] cursor-pointer"
      >
        Aa
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-30 w-60 rounded-xl border border-[var(--border)] bg-white p-2 shadow-lg animate-fade-up">
          <button
            onClick={onToggleBigText}
            role="switch"
            aria-checked={bigText}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[15px] hover:bg-[var(--surface-muted)] cursor-pointer"
          >
            <span>{label}</span>
            <Toggle on={bigText} />
          </button>
        </div>
      )}
    </div>
  );
}

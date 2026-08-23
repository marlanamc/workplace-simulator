"use client";

import { useState } from "react";

function Toggle({ on }: { on: boolean }) {
  return (
    <span className={`h-5 w-9 rounded-full ${on ? "bg-[var(--accent)]" : "bg-[var(--border)]"} relative transition-colors`}>
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${on ? "left-[18px]" : "left-0.5"}`} />
    </span>
  );
}

function Row({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={on}
      className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[15px] hover:bg-[var(--surface-muted)] cursor-pointer"
    >
      <span>{label}</span>
      <Toggle on={on} />
    </button>
  );
}

export default function SettingsPopover({
  plain,
  onTogglePlain,
  speak,
  onToggleSpeak,
  bigText,
  onToggleBigText,
  labels,
}: {
  /** "Simple words" only exists for tasks with a plain-language content variant. */
  plain?: boolean;
  onTogglePlain?: () => void;
  speak: boolean;
  onToggleSpeak: () => void;
  bigText: boolean;
  onToggleBigText: () => void;
  labels: { simpleWords?: string; readAloud: string; biggerText: string };
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Reading settings"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[15px] font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] cursor-pointer"
      >
        Aa
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-30 w-60 rounded-xl border border-[var(--border)] bg-white p-2 shadow-lg animate-fade-up">
          {onTogglePlain && labels.simpleWords && (
            <Row label={labels.simpleWords} on={Boolean(plain)} onToggle={onTogglePlain} />
          )}
          <Row label={labels.readAloud} on={speak} onToggle={onToggleSpeak} />
          <Row label={labels.biggerText} on={bigText} onToggle={onToggleBigText} />
        </div>
      )}
    </div>
  );
}

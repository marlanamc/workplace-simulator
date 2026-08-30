"use client";

import { Send, Printer } from "lucide-react";
import type { Lang, Localized } from "@/lib/task-types";

export interface BridgeOutCopy {
  kicker: Localized<string>;
  title: Localized<string>;
  steps: Localized<string>[];
  footer: Localized<string>;
  doneCta: Localized<string>;
  printCta: Localized<string>;
  notYetCta: Localized<string>;
}

/**
 * The doc's own "single highest-value addition": once a skill reaches rung 4
 * (independent, no more prompting), nudge the learner to do it once for
 * real - a skill practiced only in the simulator stays in the simulator.
 * Shown once per skill (the caller checks storyFlags before rendering this).
 */
export default function BridgeOutCard({
  copy,
  lang,
  onDidItForReal,
  onNotYet,
}: {
  copy: BridgeOutCopy;
  lang: Lang;
  onDidItForReal: () => void;
  onNotYet: () => void;
}) {
  return (
    <div className="rounded-xl border-t-4 border-accent bg-surface p-5 shadow-[0_1px_3px_rgba(60,64,67,.15)]">
      <div className="text-[13px] font-semibold uppercase tracking-wide text-accent-hover">
        {copy.kicker[lang]}
      </div>
      <h3 className="mt-1.5 text-[19px] font-medium leading-snug">{copy.title[lang]}</h3>

      <div className="mt-4 flex flex-col gap-2.5">
        {copy.steps.map((step, i) => (
          <div key={i} className="flex items-start gap-3 text-[15px] leading-snug">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-accent text-[12px] font-bold text-accent">
              {i + 1}
            </span>
            <span>{step[lang]}</span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[14px] leading-relaxed text-text-secondary">{copy.footer[lang]}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onDidItForReal}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-accent px-5 text-[15px] font-medium text-white hover:bg-accent-hover cursor-pointer"
        >
          <Send size={16} strokeWidth={2.25} aria-hidden />
          {copy.doneCta[lang]}
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-border px-4 text-[14px] font-medium text-text-primary hover:bg-surface-muted cursor-pointer"
        >
          <Printer size={16} strokeWidth={2.25} aria-hidden />
          {copy.printCta[lang]}
        </button>
        <button
          type="button"
          onClick={onNotYet}
          className="inline-flex min-h-[44px] items-center px-3 text-[14px] text-text-secondary hover:text-text-primary cursor-pointer"
        >
          {copy.notYetCta[lang]}
        </button>
      </div>
    </div>
  );
}

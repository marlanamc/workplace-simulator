"use client";

import type { RefObject } from "react";

/**
 * Small pieces the three sheet jobs (spreadsheet, formula-check,
 * budget-sheet) share: the finish screen's copy of what was sent, and the
 * starter-frame insert.
 */

/** A starter frame's blank. Picking the frame selects it, so typing fills it in. */
export const FRAME_BLANK = "___";

/**
 * Adds a sentence starter to the draft, then puts the caret in the box:
 * on the frame's blank when it has one ("The total is $___."), else at the
 * end. Runs from the chip's click, so moving focus here is an event effect.
 */
export function pickStarter(
  box: RefObject<HTMLTextAreaElement | null>,
  body: string,
  starter: string,
  setBody: (next: string) => void,
) {
  const next = (body ? `${body} ` : "") + starter;
  setBody(next);
  requestAnimationFrame(() => {
    const el = box.current;
    if (!el) return;
    el.focus();
    const blank = next.lastIndexOf(FRAME_BLANK);
    if (blank >= 0) el.setSelectionRange(blank, blank + FRAME_BLANK.length);
    else el.setSelectionRange(next.length, next.length);
  });
}

/** Cell focus ring for keyboard users. The selected-cell border stays for mouse users. */
export const CELL_FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1a73e8]";

/** The finish screen shows the message the learner sent, so the result is on screen, not only "Message sent". */
export function SentEmailRecap({
  heading,
  toLabel,
  to,
  subjectLabel,
  subject,
  body,
  fact,
}: {
  heading: string;
  toLabel: string;
  to: string;
  subjectLabel: string;
  subject: string;
  body: string;
  /** One line of what the sheet shows now, e.g. "Total on the sheet: $241.50". */
  fact?: { label: string; value: string };
}) {
  return (
    <section className="rounded-xl border border-border bg-white p-4 text-[14px]" data-testid="sent-recap">
      <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-text-tertiary">{heading}</h3>
      {fact ? (
        <p className="mb-3 rounded-lg bg-[#fef7e0] px-3 py-2 text-[14px]">
          <span className="text-text-tertiary">{fact.label}: </span>
          <span className="font-semibold tabular-nums">{fact.value}</span>
        </p>
      ) : null}
      <div className="flex gap-3 border-b border-border pb-2">
        <span className="w-16 shrink-0 text-text-tertiary">{toLabel}</span>
        <span className="min-w-0 break-words">{to}</span>
      </div>
      <div className="flex gap-3 border-b border-border py-2">
        <span className="w-16 shrink-0 text-text-tertiary">{subjectLabel}</span>
        <span className="min-w-0">{subject}</span>
      </div>
      <p className="whitespace-pre-wrap pt-3 text-[15px] leading-relaxed">{body}</p>
    </section>
  );
}

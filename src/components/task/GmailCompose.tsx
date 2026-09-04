"use client";

import type { ReactNode } from "react";
import { Paperclip } from "lucide-react";

/**
 * The Gmail compose card — the bordered, rounded panel with a To row, a
 * Subject row, a body textarea, a Send button, and (optionally) an attach
 * control with a file chip. Lifted out of `MailClient` so any task that ends
 * in "send an email" (`meeting-minutes` follow-up, `ops-report-packet`,
 * `status-report`, the sheet tasks) shows the same compose surface the learner
 * met on Day One, not a bare textarea.
 *
 * State stays with the caller — this is presentational.
 */

export interface ComposeAttachment {
  name: string;
  /** e.g. "PDF", "DOC". Rendered as the little colored badge. */
  kind: string;
  size: string;
  /** Badge color; defaults to Gmail red. */
  color?: string;
  onRemove?: () => void;
}

export default function GmailCompose({
  to,
  subject,
  body,
  onBody,
  placeholder,
  toLabel,
  subjectLabel,
  sendLabel,
  onSend,
  discardLabel,
  onDiscard,
  attachLabel,
  onAttach,
  attachment,
  removeAttachLabel = "Remove attachment",
  children,
}: {
  to: string;
  subject: string;
  body: string;
  onBody: (value: string) => void;
  placeholder: string;
  toLabel: string;
  subjectLabel: string;
  sendLabel: string;
  onSend: () => void;
  discardLabel?: string;
  onDiscard?: () => void;
  /** When set, an "Attach file" button shows next to Send. */
  attachLabel?: string;
  onAttach?: () => void;
  attachment?: ComposeAttachment | null;
  removeAttachLabel?: string;
  /** Extra controls (e.g. sentence starters) rendered under the body. */
  children?: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e0e3e8] shadow-[0_1px_3px_rgba(60,64,67,.15)]">
      <div className="flex items-center gap-2 border-b border-[#e0e3e8] px-4 py-2 text-[13px]">
        <span className="w-14 shrink-0 text-[#5f6368]">{toLabel}</span>
        <span>{to}</span>
      </div>
      <div className="flex items-center gap-2 border-b border-[#e0e3e8] px-4 py-2 text-[13px]">
        <span className="w-14 shrink-0 text-[#5f6368]">{subjectLabel}</span>
        <span>{subject}</span>
      </div>
      <textarea
        value={body}
        onChange={(e) => onBody(e.target.value)}
        placeholder={placeholder}
        className="min-h-[120px] w-full resize-y border-none px-4 py-3 text-[14px] leading-relaxed outline-none placeholder:text-[#767676]"
      />
      {children && <div className="flex flex-wrap items-center gap-2 px-4 pb-2">{children}</div>}
      {attachment && (
        <div className="mx-4 mb-2 inline-flex items-center gap-2 rounded-lg border border-[#d3e3fd] bg-[#f8fbff] px-3 py-2">
          <span
            className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
            style={{ background: attachment.color ?? "#ea4335" }}
          >
            {attachment.kind}
          </span>
          <span className="text-[13px] font-medium">{attachment.name}</span>
          <span className="text-[12px] text-[#5f6368]">{attachment.size}</span>
          {attachment.onRemove && (
            <button
              onClick={attachment.onRemove}
              aria-label={removeAttachLabel}
              className="ml-1 text-[16px] text-[#5f6368] cursor-pointer"
            >
              ×
            </button>
          )}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-1 px-3 py-2">
        <button
          onClick={onSend}
          className="inline-flex min-h-[36px] items-center rounded-full bg-[#0b57d0] px-6 text-[14px] font-medium text-white hover:bg-[#0b57d0]/90 cursor-pointer"
        >
          {sendLabel}
        </button>
        {attachLabel && onAttach && (
          <button
            onClick={onAttach}
            className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium text-[#444746] hover:bg-[#f2f6fc] cursor-pointer"
          >
            <Paperclip size={18} strokeWidth={2} />
            {attachLabel}
          </button>
        )}
        <div className="flex-1" />
        {discardLabel && onDiscard && (
          <button
            onClick={onDiscard}
            className="min-h-[36px] px-3 text-[13px] text-[#5f6368] hover:bg-[#f2f6fc] rounded-full cursor-pointer"
          >
            {discardLabel}
          </button>
        )}
      </div>
    </div>
  );
}

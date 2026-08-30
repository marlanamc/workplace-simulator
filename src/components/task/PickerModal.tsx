"use client";

import { useEffect } from "react";
import type { PickableItem } from "@/lib/task-types";

export default function PickerModal({
  title,
  categoryLabel,
  columnLabels,
  items,
  onSelect,
  onCancel,
  cancelLabel,
}: {
  title: string;
  categoryLabel: string;
  columnLabels: string[];
  items: PickableItem[];
  onSelect: (item: PickableItem) => void;
  onCancel: () => void;
  cancelLabel: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-6"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex w-full max-w-[560px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-5 py-3.5">
          <span className="text-[15px] font-medium">{title}</span>
          <div className="flex-1" />
          <button
            onClick={onCancel}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[16px] text-text-secondary hover:bg-surface-muted cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="flex items-center justify-between border-b border-border px-5 py-2 text-[12px] font-medium text-text-tertiary">
          <span>{categoryLabel}</span>
          <div className="flex gap-8">
            {columnLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {items.map((item) => (
            <button
              key={item.key}
              onClick={() => onSelect(item)}
              className="flex w-full items-center justify-between gap-3 border-b border-surface-muted px-5 py-3 text-left hover:bg-surface-muted cursor-pointer"
            >
              <span className="flex min-w-0 items-center gap-3">
                {item.tagText && (
                  <span
                    className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
                    style={{ background: item.tagColor }}
                  >
                    {item.tagText}
                  </span>
                )}
                <span className="truncate text-[14px]">{item.label}</span>
              </span>
              {item.columns?.map((col, i) => (
                <span key={i} className="shrink-0 text-[13px] text-text-tertiary">
                  {col}
                </span>
              ))}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3">
          <button
            onClick={onCancel}
            className="min-h-[42px] rounded-full border border-border px-4 text-[14px] font-medium text-text-primary cursor-pointer"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { PickableItem } from "@/lib/task-types";
import { useProgress } from "@/lib/progress-context";
import { fileDateLabel } from "@/lib/story-dates";

/**
 * A file name that wraps at its own joins ("food-handler-" / "certificate-2022.pdf")
 * instead of being cut to "food-handle…". Look-alike files differ only at the
 * end of the name, so the end is the part that must show (Phase 3 N-3).
 */
function FileName({ name }: { name: string }) {
  const parts = name.split(/(?<=[-_.])/);
  return (
    <span data-file-name className="min-w-0 text-[14px] leading-snug [overflow-wrap:anywhere]">
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && <wbr />}
        </span>
      ))}
    </span>
  );
}

/** Space kept between the floating Job Card and the picker beside it. */
const BESIDE_GAP = 24;
/** Narrower than this, the picker stays centered and the card moves. */
const BESIDE_MIN_WIDTH = 760;

/**
 * A file picker. With `preview`, it works like a real one: clicking a name
 * only selects it and shows the file on the right, and the choice is made
 * with the confirm button. Looking is free; only the choice is checked.
 */
export default function PickerModal({
  title,
  categoryLabel,
  columnLabels,
  items,
  onSelect,
  onCancel,
  cancelLabel,
  preview,
}: {
  title: string;
  categoryLabel: string;
  columnLabels: string[];
  items: PickableItem[];
  onSelect: (item: PickableItem) => void;
  onCancel: () => void;
  cancelLabel: string;
  preview?: {
    selectedKey: string | null;
    onFocus: (item: PickableItem) => void;
    render: (item: PickableItem) => ReactNode;
    /** Shown before any file is selected. */
    empty: string;
    confirmLabel: string;
    /**
     * `data-showme` ids, so the Job Card's Show me can point here. The list
     * id marks the whole file list, not the right file: Show me helps the
     * learner find where to look, not what to choose.
     */
    showMeList?: string;
    showMeConfirm?: string;
  };
}) {
  // The date column is picker chrome, so it follows the learner's language.
  const { lang } = useProgress();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  // Keyboard users land in the list, not back on the page behind the dialog.
  const list = useRef<HTMLDivElement>(null);
  useEffect(() => {
    list.current?.querySelector<HTMLElement>("button")?.focus();
  }, []);

  // The floating Job Card stays on screen while the picker is open, so the
  // picker sits in the room beside it instead of under it (the card covered
  // the last file, or the page the learner must read). This is the floating
  // card's version of the dock: a docked card or a lesson rail already makes
  // room through --app-left. With too little room, the card moves instead.
  const overlay = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = overlay.current;
    const card = document.querySelector<HTMLElement>("[data-job-card]");
    if (!el || !card) return;
    const place = () => {
      el.style.paddingLeft = "";
      el.style.paddingRight = "";
      if (card.classList.contains("job-card-docked") || card.classList.contains("lesson-rail-card")) return;
      const box = card.getBoundingClientRect();
      const room = el.getBoundingClientRect();
      if (box.width === 0) return;
      const onLeft = box.left + box.width / 2 < room.left + room.width / 2;
      const free = onLeft ? room.right - box.right - BESIDE_GAP * 2 : box.left - room.left - BESIDE_GAP * 2;
      if (free < BESIDE_MIN_WIDTH) return;
      if (onLeft) el.style.paddingLeft = `${box.right - room.left + BESIDE_GAP}px`;
      else el.style.paddingRight = `${room.right - box.left + BESIDE_GAP}px`;
    };
    place();
    const moves = new MutationObserver(place);
    moves.observe(card, { attributes: true, attributeFilter: ["data-corner", "class", "style"] });
    const size = new ResizeObserver(place);
    size.observe(card);
    window.addEventListener("resize", place);
    return () => {
      moves.disconnect();
      size.disconnect();
      window.removeEventListener("resize", place);
    };
  }, []);

  const selected = preview ? items.find((i) => i.key === preview.selectedKey) ?? null : null;

  return (
    <div
      ref={overlay}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-6"
      // Centered over the app window, not the whole screen: a lesson keeps a
      // left column for its cards, and the picker should not slide under them.
      style={{ left: "var(--app-left, 0px)" }}
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`flex max-h-full w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-fade-up ${preview ? "max-w-[860px]" : "max-w-[560px]"}`}
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
        {/* Short screens (150% zoom) shrink the list and page, so Attach stays on screen. */}
        <div className="flex min-h-0 flex-1">
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between border-b border-border px-5 py-2 text-[12px] font-medium text-text-tertiary">
              <span>{categoryLabel}</span>
              <div className="flex gap-8">
                {columnLabels.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
            </div>
            <div ref={list} data-showme={preview?.showMeList} className={`overflow-y-auto ${preview ? "max-h-[min(420px,calc(100dvh-190px))]" : "max-h-[300px]"}`}>
              {items.map((item) => {
                const isSelected = selected?.key === item.key;
                return (
                  <button
                    key={item.key}
                    aria-pressed={preview ? isSelected : undefined}
                    onClick={() => (preview ? preview.onFocus(item) : onSelect(item))}
                    // Beginners double-click files, as on a desktop. In a
                    // real picker that opens (here: attaches) the file.
                    onDoubleClick={() => preview && onSelect(item)}
                    className={`flex w-full items-center justify-between gap-3 border-b border-surface-muted px-5 py-3 text-left cursor-pointer ${
                      isSelected ? "bg-[#c2e7ff]/60" : "hover:bg-surface-muted"
                    }`}
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
                      <FileName name={item.label} />
                    </span>
                    {item.columns?.map((col, i) => (
                      <span key={i} className="shrink-0 text-[13px] text-text-tertiary">
                        {fileDateLabel(col, lang)}
                      </span>
                    ))}
                  </button>
                );
              })}
            </div>
          </div>
          {preview && (
            <div
              data-testid="picker-preview"
              // Big enough to read the month and see a stamp: the point of
              // looking is to tell near-identical files apart.
              className="flex h-[min(420px,calc(100dvh-190px))] w-[min(540px,58%)] shrink-0 justify-center overflow-auto border-l border-border bg-[#525659] p-3"
            >
              {selected ? (
                preview.render(selected)
              ) : (
                <p className="m-0 self-center px-4 text-center text-[14px] leading-snug text-white/85">{preview.empty}</p>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3">
          <button
            onClick={onCancel}
            className="min-h-[42px] rounded-full border border-border px-4 text-[14px] font-medium text-text-primary cursor-pointer"
          >
            {cancelLabel}
          </button>
          {preview && (
            <button
              data-showme={preview.showMeConfirm}
              disabled={!selected}
              onClick={() => selected && onSelect(selected)}
              className="min-h-[42px] rounded-full bg-[#0b57d0] px-6 text-[14px] font-medium text-white enabled:cursor-pointer disabled:opacity-40"
            >
              {preview.confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

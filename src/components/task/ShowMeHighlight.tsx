"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { MoveUp } from "lucide-react";

/**
 * Points at a real on-screen element by id. Mark the target with
 * `data-showme="<id>"`. The dim/ring/bubble never capture clicks — the real
 * control stays clickable — and any pointer down or Escape dismisses.
 */
export default function ShowMeHighlight({
  targetId,
  label,
  onDismiss,
}: {
  targetId: string | null;
  label: string;
  onDismiss?: () => void;
}) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [oval, setOval] = useState(false);
  // Portal needs document.body — same client gate as LoginForm / ProgressProvider.
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    const measure = () => {
      if (!targetId) {
        setRect(null);
        setOval(false);
        return;
      }
      const el =
        document.querySelector(`[data-showme="${targetId}"][data-showme-primary]`) ??
        document.querySelector(`[data-showme="${targetId}"]`);
      setRect(el ? el.getBoundingClientRect() : null);
      setOval(Boolean(el?.hasAttribute("data-showme-oval")));
    };

    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [targetId]);

  useEffect(() => {
    if (!targetId || !onDismiss) return;
    const dismiss = () => onDismiss();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    // Capture so we clear even if a child stops bubbling; the same click
    // still reaches the real target underneath (this layer is click-through).
    window.addEventListener("pointerdown", dismiss, true);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", dismiss, true);
      window.removeEventListener("keydown", onKey);
    };
  }, [targetId, onDismiss]);

  if (!isClient || !targetId || !rect) return null;

  const padX = oval ? 10 : 6;
  const padY = oval ? 8 : 6;
  // Keep the ring symmetric around the target. Clamping one edge (e.g. against
  // the shelf) made the cutout look lopsided.
  const hole = {
    left: rect.left - padX,
    top: rect.top - padY,
    width: rect.width + padX * 2,
    height: rect.height + padY * 2,
  };
  const radius = oval ? "rounded-full" : "rounded-xl";
  // Near the shelf, keep the bubble snug so it reads as attached to the pin.
  const nearShelf = rect.bottom > window.innerHeight - 80;
  const bubbleAbove = rect.top > 120;
  const bubbleGap = nearShelf ? 8 : 16;
  const bubbleTop = bubbleAbove ? rect.top - bubbleGap : rect.bottom + bubbleGap;
  const bubbleCenterX = rect.left + rect.width / 2;

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[70]" aria-hidden>
      {/* Dim the screen with a cutout over the real control. */}
      <div
        className={`absolute ${radius}`}
        style={{
          ...hole,
          boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.6)",
        }}
      />
      <div className={`animate-showme-pulse absolute ${radius}`} style={hole} />
      <div
        className={`absolute flex items-center gap-2 rounded-xl bg-[#202124] px-4 py-3 text-white shadow-[0_12px_30px_rgba(0,0,0,0.4)] animate-fade-up ${
          bubbleAbove ? "-translate-x-1/2 -translate-y-full" : "-translate-x-1/2"
        }`}
        style={{
          left: bubbleCenterX,
          top: bubbleTop,
        }}
      >
        <MoveUp size={20} strokeWidth={2.25} aria-hidden className={bubbleAbove ? "rotate-180" : ""} />
        <span className="text-[16px] font-medium leading-tight">{label}</span>
      </div>
    </div>,
    document.body,
  );
}

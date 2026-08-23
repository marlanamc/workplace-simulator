"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const measure = () => {
      if (!targetId) {
        setRect(null);
        return;
      }
      const el = document.querySelector(`[data-showme="${targetId}"]`);
      setRect(el ? el.getBoundingClientRect() : null);
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

  if (!targetId || !rect) return null;

  const hole = {
    left: rect.left - 6,
    top: rect.top - 6,
    width: rect.width + 12,
    height: rect.height + 12,
  };
  const bubbleAbove = rect.top > 120;
  const bubbleTop = bubbleAbove ? rect.top - 16 : rect.bottom + 16;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70]" aria-hidden>
      {/* Dim the screen with a cutout over the real control. */}
      <div
        className="absolute rounded-xl"
        style={{
          ...hole,
          boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.6)",
        }}
      />
      <div className="animate-showme-pulse absolute rounded-xl" style={hole} />
      <div
        className={`absolute flex items-center gap-2 rounded-xl bg-[#202124] px-4 py-3 text-white shadow-[0_12px_30px_rgba(0,0,0,0.4)] animate-fade-up ${
          bubbleAbove ? "-translate-y-full" : ""
        }`}
        style={{
          left: Math.max(16, rect.left + rect.width / 2 - 120),
          top: bubbleTop,
        }}
      >
        <MoveUp size={20} strokeWidth={2.25} aria-hidden className={bubbleAbove ? "rotate-180" : ""} />
        <span className="text-[16px] font-medium leading-tight">{label}</span>
      </div>
    </div>
  );
}

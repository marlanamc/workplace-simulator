"use client";

import { useEffect, useState } from "react";
import { MoveUp } from "lucide-react";

/**
 * Points at a real on-screen element by id, generalizing TourWalkthrough's
 * dim-scrim-plus-bubble beyond "which tab is selected" to any task target.
 * Mark the real target with `data-showme="<id>"`; this reads its rect live
 * (mount + resize/scroll) so the ring tracks it if the layout shifts.
 */
export default function ShowMeHighlight({
  targetId,
  label,
}: {
  targetId: string | null;
  label: string;
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

  if (!targetId || !rect) return null;

  const bubbleAbove = rect.top > 120;
  const bubbleTop = bubbleAbove ? rect.top - 16 : rect.bottom + 16;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] bg-black/60">
      <div
        className="animate-showme-pulse absolute rounded-xl"
        style={{
          left: rect.left - 6,
          top: rect.top - 6,
          width: rect.width + 12,
          height: rect.height + 12,
        }}
      />
      <div
        className={`absolute flex items-center gap-2 rounded-xl bg-[#202124] px-4 py-3 text-white shadow-[0_12px_30px_rgba(0,0,0,0.4)] animate-fade-up ${
          bubbleAbove ? "-translate-y-full" : ""
        }`}
        style={{
          left: Math.max(16, rect.left + rect.width / 2 - 120),
          top: bubbleTop,
        }}
      >
        {/* The arrow points AT the target: bubble above the target → arrow down. */}
        <MoveUp size={20} strokeWidth={2.25} aria-hidden className={bubbleAbove ? "rotate-180" : ""} />
        <span className="text-[16px] font-medium leading-tight">{label}</span>
      </div>
    </div>
  );
}

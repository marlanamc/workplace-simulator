"use client";

import { useEffect, useState } from "react";

/**
 * Desktop-level spotlight for the My tasks pin. TourWalkthrough lives inside
 * the browser window and cannot ring a shelf control.
 */
export default function ListIntroSpotlight() {
  const [hole, setHole] = useState<{ left: number; top: number; width: number; height: number } | null>(null);

  useEffect(() => {
    const measure = () => {
      const el = document.querySelector('[data-testid="shelf-my-job"]');
      if (!el) {
        setHole(null);
        return;
      }
      const r = el.getBoundingClientRect();
      const pad = 6;
      // Keep the entire border inside the viewport, including at the shelf's bottom edge.
      const left = Math.max(4, r.left - pad);
      const top = Math.max(4, r.top - pad);
      const right = Math.min(window.innerWidth - 4, r.right + pad);
      const bottom = Math.min(window.innerHeight - 4, r.bottom + pad);
      setHole({ left, top, width: right - left, height: bottom - top });
    };
    const raf = requestAnimationFrame(measure);
    const t = window.setTimeout(measure, 80);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, []);

  if (!hole) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70]" aria-hidden>
      <div
        data-testid="task-list-spotlight"
        className="absolute rounded-xl border-[3px] border-[#e87400]"
        style={{ ...hole, boxShadow: "0 0 0 9999px rgba(28, 20, 16, 0.38)" }}
      />
    </div>
  );
}

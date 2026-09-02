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
      setHole({
        left: r.left - pad,
        top: r.top - pad,
        width: r.width + pad * 2,
        height: r.height + pad * 2,
      });
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
        className="absolute rounded-xl"
        style={{ ...hole, boxShadow: "0 0 0 9999px rgba(28, 20, 16, 0.38)" }}
      />
      <div className="animate-showme-pulse-compact absolute rounded-xl" style={hole} />
    </div>
  );
}

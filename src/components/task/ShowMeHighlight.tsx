"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { MoveUp } from "lucide-react";
import { useJobCardOptional } from "@/lib/job-card-context";
import { visibleBox, type Box } from "@/lib/show-me-rect";

/**
 * Points at a real on-screen element by id. Mark the target with
 * `data-showme="<id>"`. The dim/ring/bubble never capture clicks — the real
 * control stays clickable — and any pointer down or Escape dismisses.
 *
 * A target that is something to read, not click (the line of an email that
 * answers a question, the 10:00 row), also carries
 * `data-showme-look={SHOW_ME_LOOK[lang]}`, and the bubble says that
 * ("Look here.") instead of "Click it."
 *
 * The ring belongs to the step it was asked for. When the Job Card moves to
 * a new step (the choice was made, the stub was closed) it goes, even when
 * the step was done from the keyboard and no pointer press dismissed it; and
 * a target that leaves the page takes the ring with it (Phase 3 N-1).
 *
 * The ring is drawn around the part of the target that can be seen. A target
 * bigger than the pane it scrolls in (a page in the picker's preview) is cut
 * to that pane and to the screen, so the ring never runs over the controls
 * beside it or off the screen (Phase 3 N-8).
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
  const [rect, setRect] = useState<Box | null>(null);
  const [oval, setOval] = useState(false);
  const [look, setLook] = useState<string | null>(null);
  // The card step the ring was lit on. A new step means the pointer is stale.
  const step = useJobCardOptional()?.step ?? null;
  const stepKey = step ? `${step.id}|${step.stepIndex}|${step.line.en}` : null;
  const [litOn, setLitOn] = useState<{ targetId: string | null; stepKey: string | null }>({ targetId, stepKey });
  if (litOn.targetId !== targetId) setLitOn({ targetId, stepKey });
  const stale = targetId !== null && litOn.targetId === targetId && litOn.stepKey !== stepKey;
  // Portal needs document.body — same client gate as LoginForm / ProgressProvider.
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    const findTarget = () => {
      if (!targetId) return null;
      // Inactive tabs can keep duplicate targets mounted but hidden.
      const matches = [...document.querySelectorAll(`[data-showme="${targetId}"]`)]
        .filter((element) => element.getClientRects().length > 0);
      return matches.find((element) => element.hasAttribute("data-showme-primary")) ?? matches[0] ?? null;
    };
    const measure = () => {
      if (!targetId) {
        setRect(null);
        setOval(false);
        setLook(null);
        return;
      }
      const el = findTarget();
      setRect(el ? seenPart(el) : null);
      setOval(Boolean(el?.hasAttribute("data-showme-oval")));
      setLook(el?.getAttribute("data-showme-look") || null);
    };

    // A target below the fold (Reply under a long email, a compose box that
    // opened under the reading pane) would otherwise get a ring on the shelf.
    // Bring it to the middle of its scroll container first; the scroll
    // listener below re-measures as it moves.
    const target = findTarget();
    // Always scroll the nearest ancestors too: a target can be inside the
    // viewport while clipped by a shorter nested pane.
    target?.scrollIntoView({ block: "nearest", inline: "nearest" });

    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    // The target can move or vanish without a scroll or resize (a window
    // closes, a pane re-renders). Re-measure after DOM changes, once a frame.
    let pending = 0;
    const observer = targetId
      ? new MutationObserver(() => {
          if (pending) return;
          pending = requestAnimationFrame(() => {
            pending = 0;
            measure();
          });
        })
      : null;
    observer?.observe(document.body, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(pending);
      observer?.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [targetId]);

  // Tell the task its pointer is put away, so its card button reads Show me
  // again and a return to the old step does not bring the ring back.
  useEffect(() => {
    if (stale) onDismiss?.();
  }, [stale, onDismiss]);

  useEffect(() => {
    if (!targetId || !onDismiss) return;
    const dismiss = () => onDismiss();
    const onPointer = (event: PointerEvent) => {
      // Let the card toggle once on click. Clearing on pointerdown first
      // would make its Hide click immediately turn the highlight back on.
      if (event.target instanceof Element && event.target.closest("[data-showme-toggle]")) return;
      dismiss();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    // Capture so we clear even if a child stops bubbling; the same click
    // still reaches the real target underneath (this layer is click-through).
    window.addEventListener("pointerdown", onPointer, true);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer, true);
      window.removeEventListener("keydown", onKey);
    };
  }, [targetId, onDismiss]);

  if (!isClient || !targetId || !rect || stale) return null;

  const width = rect.right - rect.left;
  const height = rect.bottom - rect.top;
  const padX = oval ? 10 : 6;
  const padY = oval ? 8 : 6;
  // Keep the ring symmetric around the target. Clamping one edge (e.g. against
  // the shelf) made the cutout look lopsided.
  const hole = {
    left: rect.left - padX,
    top: rect.top - padY,
    width: width + padX * 2,
    height: height + padY * 2,
  };
  const radius = oval ? "rounded-full" : "rounded-xl";
  // Near the shelf, keep the bubble snug so it reads as attached to the pin.
  const nearShelf = rect.bottom > window.innerHeight - 80;
  const bubbleAbove = rect.top > 120;
  const bubbleGap = nearShelf ? 8 : 16;
  const bubbleTop = bubbleAbove ? rect.top - bubbleGap : rect.bottom + bubbleGap;
  const bubbleCenterX = rect.left + width / 2;

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
        <span className="text-[16px] font-medium leading-tight">{look ?? label}</span>
      </div>
    </div>,
    document.body,
  );
}

/** The target's rectangle, cut by every ancestor that scrolls or clips it and by the screen. */
function seenPart(el: Element): Box | null {
  const clips: Box[] = [{ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }];
  for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
    const style = getComputedStyle(a);
    if (style.overflowX !== "visible" || style.overflowY !== "visible") clips.push(a.getBoundingClientRect());
  }
  return visibleBox(el.getBoundingClientRect(), clips);
}

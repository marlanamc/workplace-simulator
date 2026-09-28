"use client";

import { useEffect, useRef } from "react";
import { useProgress } from "@/lib/progress-context";
import { useWindowManager } from "@/lib/window-manager";
import { CORE_FINALE, LEVELS, levelUpCardFor, levelUpCopyFor, levelUpShowsConfetti, nextHandoff } from "@/lib/tracks-content";
import { DESKTOP_COPY } from "@/lib/desktop-content";
import { HANDOFF_CTA } from "@/lib/story-beats";
import Confetti from "@/components/task/Confetti";
import { logout } from "@/app/actions";

/**
 * The end of a level: what just changed in the story, and a real choice about
 * what happens next. A learner who has finished a day should not have to
 * decide whether closing the laptop counts as quitting - "Stop for today
 * (your work is saved)" is a legitimate way to end, and their progress is
 * already saved either way. It does not say "clock out": Act I teaches real
 * clocking in and out, and this button signs the learner out of the computer.
 *
 * It is a modal: focus moves into it when it opens and Tab stays inside it,
 * so a keyboard learner never walks the dimmed page behind it. It is also the
 * day's premise, and it is kept until it is answered (see progress-context's
 * pending arrival), so a stray click on the dimmed page does not close it.
 * Escape presses the continue button: it opens the task rather than dropping
 * the learner on a desktop with no scene.
 */
const FIRST_FREE_TABBING_KEY = LEVELS.find((l) => l.freeTabbing)?.key;

export default function LevelUpCelebration() {
  const { celebrateLevel, dismissLevelCelebration, completedTaskKeys, lang, setLang, bridgePath, courseRoute, saving, saveError } = useProgress();
  const { openApp, minimizeActive } = useWindowManager();
  const dialogRef = useRef<HTMLDivElement>(null);
  // Act II+ openers normally defer to ActIntro and never get recorded here
  // (see levelUpCardFor). A stoppingPoint card is the stop-for-today pause
  // before that screen (end of Act I → Day 6 complete).
  const open = Boolean(celebrateLevel?.levelUp && !saving && !saveError && levelUpCardFor(celebrateLevel));

  // Focus and the Tab loop are the browser's, not React's: an effect is the
  // place to take them over, and to give them back when the card closes.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    // Keep going, not Stop for today: a quick Enter should never sign
    // someone out.
    dialog.querySelector<HTMLElement>("[data-celebration-continue]")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dialog.querySelector<HTMLElement>("[data-celebration-continue]")?.click();
        return;
      }
      if (e.key !== "Tab") return;
      const buttons = Array.from(dialog.querySelectorAll<HTMLElement>("button:not([disabled])"));
      if (buttons.length === 0) return;
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      const current = document.activeElement;
      const inside = current instanceof Node && dialog.contains(current);
      if (e.shiftKey && (!inside || current === first)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (!inside || current === last)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open || !celebrateLevel?.levelUp) return null;
  const levelUp = levelUpCopyFor(celebrateLevel, bridgePath)!;
  const kicker = levelUp.kicker[lang];
  const title = levelUp.title[lang];
  const body = levelUp.body[lang];
  const handoff = nextHandoff(completedTaskKeys, bridgePath, courseRoute);
  const cta =
    celebrateLevel.freeTabbing && handoff
      ? HANDOFF_CTA[handoff.taskKey][lang]
      : levelUp.cta[lang];

  const keepGoing = () => {
    const handoff = nextHandoff(completedTaskKeys, bridgePath, courseRoute);
    dismissLevelCelebration();
    // Act II's end: back to the desktop, where the Job Card lists the directions.
    if (celebrateLevel.key === CORE_FINALE.key) { minimizeActive(); return; }
    if (!handoff) return;
    openApp(handoff.location.appKey, {
      tab: handoff.location.tab,
      section: handoff.location.section,
    });
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-6"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="level-up-title"
        className="relative w-full max-w-[460px] overflow-hidden rounded-2xl bg-white p-8 text-center shadow-2xl animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {levelUpShowsConfetti(levelUp) && <Confetti count={22} />}
        <div className="relative z-10">
        <button type="button" onClick={() => setLang(lang === "en" ? "es" : "en")} className="mb-2 min-h-10 rounded-full px-3 text-[14px] text-text-secondary hover:bg-surface-muted">{lang === "en" ? "Español" : "English"}</button>
        <div className="mx-auto animate-pop-in text-[48px] leading-none" aria-hidden>
          {levelUp.emoji}
        </div>
        <div className="mt-3 text-[12px] font-semibold uppercase tracking-wide text-warning">{kicker}</div>
        <h2 id="level-up-title" className="mt-2 text-[26px] font-medium leading-tight">{title}</h2>
        <p className="mt-3 text-[16px] leading-relaxed text-text-secondary">{body}</p>
        {/* Once, on the first level where the learner opens their own apps
            (Day 9). Every later freeTabbing level already knows the bar. */}
        {celebrateLevel.key === FIRST_FREE_TABBING_KEY ? (
          <p className="mt-4 rounded-xl bg-surface-muted px-4 py-3 text-[14px] leading-snug text-text-primary">
            {DESKTOP_COPY[lang].bookmarkOnramp}
          </p>
        ) : null}
        {levelUp.stoppingPoint ? (
          <>
            <form action={logout}>
              <button
                type="submit"
                className="mt-7 inline-flex min-h-[50px] w-full items-center justify-center rounded-full bg-accent px-6 text-[16px] font-medium text-white hover:bg-accent-hover cursor-pointer"
              >
                {DESKTOP_COPY[lang].clockOut}
              </button>
            </form>
            <button
              data-celebration-continue
              onClick={keepGoing}
              className="mt-2 inline-flex min-h-[50px] w-full items-center justify-center rounded-full px-6 text-[16px] font-medium text-text-secondary hover:bg-surface-muted cursor-pointer"
            >
              {cta}
            </button>
          </>
        ) : (
          <>
            <button
              data-celebration-continue
              onClick={keepGoing}
              className="mt-7 inline-flex min-h-[50px] w-full items-center justify-center rounded-full bg-accent px-6 text-[16px] font-medium text-white hover:bg-accent-hover cursor-pointer"
            >
              {cta}
            </button>
            <form action={logout}>
              <button
                type="submit"
                className="mt-2 inline-flex min-h-[50px] w-full items-center justify-center rounded-full px-6 text-[16px] font-medium text-text-secondary hover:bg-surface-muted cursor-pointer"
              >
                {DESKTOP_COPY[lang].clockOut}
              </button>
            </form>
          </>
        )}
        </div>
      </div>
    </div>
  );
}

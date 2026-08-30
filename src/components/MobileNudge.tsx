"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "mobileNudgeDismissed";
// Below this width, mouse/keyboard interactions (right-click, drag, window
// management) that this simulator is built around get too cramped to use.
const SMALL_SCREEN_PX = 820;

export default function MobileNudge() {
  const [shouldShow, setShouldShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isSmallScreen = () => window.innerWidth < SMALL_SCREEN_PX;
    const update = () => setShouldShow(isSmallScreen());
    update();
    window.addEventListener("resize", update);

    const checkDismissed = () => {
      try {
        if (sessionStorage.getItem(DISMISS_KEY) === "1") setDismissed(true);
      } catch {
        // sessionStorage unavailable (e.g. private mode) - just show the nudge every time
      }
    };
    checkDismissed();

    return () => window.removeEventListener("resize", update);
  }, []);

  if (!shouldShow || dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore - worst case the nudge reappears next reload
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-6">
      <div className="w-full max-w-[380px] rounded-2xl bg-white p-7 text-center shadow-2xl animate-fade-up">
        <div className="mb-4 text-[40px]">💻</div>
        <h2 className="mb-2 text-[20px] font-medium leading-tight text-text-primary">
          Built for a computer
        </h2>
        <p className="mb-6 text-[15px] leading-relaxed text-text-secondary">
          This practice space uses real computer skills: mouse clicks, right-click menus, and windows.
          You will get more out of it on a laptop or desktop. Ask staff about a rental if you need one.
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={dismiss}
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-surface-muted px-6 text-[15px] font-medium text-text-secondary hover:bg-border cursor-pointer"
          >
            Continue on this device
          </button>
        </div>
      </div>
    </div>
  );
}

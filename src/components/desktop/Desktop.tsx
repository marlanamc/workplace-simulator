"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { DesktopClock } from "@/components/LiveClock";
import DesktopIdentity from "@/components/DesktopIdentity";
import DesktopWallpaper from "@/components/DesktopWallpaper";
import Shelf, { SHELF_INSET, SHELF_RESERVE } from "@/components/Shelf";
import JobCard from "@/components/task/JobCard";
import LessonInfoCard, { LESSON_RAIL_CLASS } from "@/components/lesson/LessonInfoCard";
import { deskIdentityFor } from "@/lib/desk-identity";
import { actForLevel, levelForTrack, sceneForLevel } from "@/lib/tracks-content";
import { useWindowManager } from "@/lib/window-manager";
import { useProgress } from "@/lib/progress-context";
import { useLesson } from "@/lib/lesson-context";
import BrowserClient from "@/app/browser/BrowserClient";
import PdfReaderClient from "@/app/pdf-reader/PdfReaderClient";

/** Wraps a window's content so it replays a subtle "open" animation each time
 *  it becomes the active window (first open or restore from minimize), while
 *  staying mounted (and its state intact) whenever it's minimized in the background. */
function AppWindow({
  active,
  topOffset,
  bigText,
  children,
}: {
  active: boolean;
  topOffset: number;
  bigText: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const wasActive = useRef(false);

  useEffect(() => {
    if (active && !wasActive.current && ref.current) {
      const el = ref.current;
      el.classList.remove("animate-window-in");
      void el.offsetWidth; // force reflow so the animation restarts
      el.classList.add("animate-window-in");
    }
    wasActive.current = active;
  }, [active]);

  return (
    <div
      ref={ref}
      className={active ? "fixed flex flex-col overflow-hidden rounded-[12px] shadow-[0_12px_40px_rgba(0,0,0,0.28)]" : "hidden"}
      style={
        active
          ? {
              top: topOffset,
              // A lesson keeps a left column for its info card and the Job Card on wide screens (--app-left).
              left: `var(--app-left, ${SHELF_INSET}px)`,
              right: SHELF_INSET,
              bottom: SHELF_RESERVE + 8,
              zoom: bigText ? 1.15 : undefined,
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}

/**
 * The computer itself: wallpaper, lock-screen clock, the app windows, the
 * shelf, and the Job Card. Story mode (`DesktopClient`) and Lesson mode
 * (`LessonRunner`) both render this; whatever only the story has (My Job,
 * awards, celebrations, teacher notes) comes in through the two slots.
 */
export default function Desktop({
  displayName,
  topInset = 0,
  myJob,
  beforeShelf,
  afterCard,
}: {
  displayName: string;
  /** Room kept free above the desktop for a bar (Studio jump, teacher preview). */
  topInset?: number;
  /** The shelf's My tasks pin. Omitted in a lesson, which has no task list. */
  myJob?: { open: boolean; onOpenChange: (open: boolean) => void };
  /** Panels and celebrations that sit under the shelf. */
  beforeShelf?: ReactNode;
  /** Toasts and overlays that sit above the Job Card. */
  afterCard?: ReactNode;
}) {
  const { lang, currentTrack, progressEpoch, bridgePath, bigText } = useProgress();
  const { apps, active } = useWindowManager();
  const lesson = useLesson();

  const anyAppActive = active !== null;

  const currentLevel = levelForTrack(currentTrack.key);
  const actKey = actForLevel(currentLevel)?.key ?? "act1";
  const identity = deskIdentityFor(actKey, bridgePath);
  const scene = sceneForLevel(currentLevel);
  const windowTop = topInset ? topInset + 8 : 8;

  // Wallpaper follows the act (the room), not the individual level. The
  // outgoing scene stays mounted just long enough to fade out over the new
  // one. Adjusted during render (React's recommended pattern), not in an effect.
  const [lastScene, setLastScene] = useState(scene);
  const [outgoingScene, setOutgoingScene] = useState<typeof scene | null>(null);
  const [wallpaperFadeKey, setWallpaperFadeKey] = useState(0);
  if (lastScene !== scene) {
    setOutgoingScene(lastScene);
    setWallpaperFadeKey((k) => k + 1);
    setLastScene(scene);
  }

  return (
    <div
      className={`relative min-h-screen overflow-hidden text-[15px] ${lesson ? LESSON_RAIL_CLASS : ""}`}
      style={{ color: "var(--text-primary)" }}
    >
      {/* wallpaper - the room of the current act, so New Hire is the cafe floor */}
      <div className="fixed inset-0 -z-10">
        <DesktopWallpaper scene={scene} />
      </div>
      {outgoingScene && (
        <div
          key={wallpaperFadeKey}
          className="fixed inset-0 -z-10 animate-wallpaper-fade-out pointer-events-none"
          onAnimationEnd={() => setOutgoingScene(null)}
        >
          <DesktopWallpaper scene={outgoingScene} />
        </div>
      )}

      {/* desktop content - hidden while an app window is active, but never unmounted */}
      <div
        className={anyAppActive ? "hidden" : "flex min-h-screen flex-col"}
        aria-hidden={anyAppActive}
        style={{ paddingBottom: SHELF_RESERVE, paddingTop: topInset }}
      >
        {/* Lock-screen clock plus a quiet identity plaque. The Job Card still
            says what to do; this only orients who they are in the story. */}
        <div className={`flex flex-1 items-start px-10 pt-10 ${lesson ? "xl:pl-[480px]" : ""}`}>
          <div className="flex w-full max-w-[400px] flex-col">
            <DesktopClock lang={lang} />
            <DesktopIdentity name={displayName} identity={identity} lang={lang} />
          </div>
        </div>
      </div>

      {/* app windows - mounted once opened, visible only while active, so
          minimizing preserves state (e.g. which mail step you're on) */}
      {apps.browser && (
        <AppWindow active={active === "browser"} topOffset={windowTop} bigText={bigText}>
          <BrowserClient key={progressEpoch} />
        </AppWindow>
      )}
      {apps.pdf && (
        <AppWindow active={active === "pdf"} topOffset={windowTop} bigText={bigText}>
          {/* A lesson restart resets the reader too; Story mode keeps it mounted. */}
          <PdfReaderClient key={lesson ? progressEpoch : undefined} />
        </AppWindow>
      )}

      {lesson && <LessonInfoCard top={windowTop} />}
      {beforeShelf}
      <Shelf displayName={displayName} myJob={myJob} />
      {/* The one instruction voice. Above the app windows, below the Help
          drawer and pickers, present on every screen. */}
      <JobCard />
      {afterCard}
    </div>
  );
}

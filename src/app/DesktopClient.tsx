"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { type TaskKey } from "@/lib/desktop-content";
import { DesktopClock } from "@/components/LiveClock";
import { levelForTrack, sceneForLevel } from "@/lib/tracks-content";
import DesktopWallpaper from "@/components/DesktopWallpaper";
import Shelf, { SHELF_INSET, SHELF_RESERVE } from "@/components/Shelf";
import ObjectivesPanel from "@/components/ObjectivesPanel";
import AwardsCase from "@/components/AwardsCase";
import ShiftBriefing from "@/components/ShiftBriefing";
import TrackCelebration from "@/components/TrackCelebration";
import LevelUpCelebration from "@/components/LevelUpCelebration";
import MobileNudge from "@/components/MobileNudge";
import { WindowManagerProvider, useWindowManager } from "@/lib/window-manager";
import { ProgressProvider, useProgress } from "@/lib/progress-context";
import BrowserClient from "./browser/BrowserClient";
import PdfReaderClient from "./pdf-reader/PdfReaderClient";

/** Wraps a window's content so it replays a subtle "open" animation each time
 *  it becomes the active window (first open or restore from minimize), while
 *  staying mounted (and its state intact) whenever it's minimized in the background. */
function AppWindow({
  active,
  topOffset,
  children,
}: {
  active: boolean;
  topOffset: number;
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
          ? { top: topOffset, left: SHELF_INSET, right: SHELF_INSET, bottom: SHELF_RESERVE + 8 }
          : undefined
      }
    >
      {children}
    </div>
  );
}

function DesignerJumpBanner() {
  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex h-9 items-center justify-between gap-3 bg-[#202124] px-4 text-[13px] text-white">
      <p className="min-w-0 truncate text-white/80">
        Studio jump. Learner locks are off for this session.
      </p>
      <Link
        href="/studio"
        className="shrink-0 rounded-full bg-white/12 px-2.5 py-1 font-medium text-white hover:bg-white/20"
      >
        Back to studio
      </Link>
    </div>
  );
}

function DesktopShell({
  displayName,
  fromStudio,
}: {
  displayName: string;
  fromStudio: boolean;
}) {
  const { lang, currentTrack, dismissCelebration, progressEpoch } = useProgress();
  const [objectivesOpen, setObjectivesOpen] = useState(false);
  const [awardsOpen, setAwardsOpen] = useState(false);
  const { apps, active } = useWindowManager();

  const anyAppActive = active !== null;
  const currentLevel = levelForTrack(currentTrack.key);
  const scene = sceneForLevel(currentLevel);
  const windowTop = fromStudio ? 44 : 8;

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
      className="relative min-h-screen overflow-hidden text-[15px]"
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
        style={{ paddingBottom: SHELF_RESERVE, paddingTop: fromStudio ? 36 : 0 }}
      >
        <div className="flex flex-1 items-start px-10 pt-10">
          <div className="flex w-full max-w-[400px] flex-col gap-10">
            <DesktopClock lang={lang} />

            <ShiftBriefing
              lang={lang}
              onSeeAwards={() => {
                setObjectivesOpen(false);
                setAwardsOpen(true);
              }}
            />
          </div>
        </div>
      </div>

      {/* app windows - mounted once opened, visible only while active, so
          minimizing preserves state (e.g. which mail step you're on) */}
      {apps.browser && (
        <AppWindow active={active === "browser"} topOffset={windowTop}>
          <BrowserClient key={progressEpoch} />
        </AppWindow>
      )}
      {apps.pdf && (
        <AppWindow active={active === "pdf"} topOffset={windowTop}>
          <PdfReaderClient />
        </AppWindow>
      )}

      <ObjectivesPanel
        open={objectivesOpen}
        onOpenChange={setObjectivesOpen}
        onOpenAwards={() => {
          setObjectivesOpen(false);
          setAwardsOpen(true);
        }}
      />
      <AwardsCase
        open={awardsOpen}
        onOpenChange={setAwardsOpen}
      />
      <TrackCelebration
        onSeeAward={() => {
          dismissCelebration();
          setObjectivesOpen(false);
          setAwardsOpen(true);
        }}
      />
      <LevelUpCelebration />
      <Shelf
        displayName={displayName}
        objectivesOpen={objectivesOpen}
        onObjectivesOpenChange={(open) => {
          setObjectivesOpen(open);
          if (open) setAwardsOpen(false);
        }}
        awardsOpen={awardsOpen}
        onAwardsOpenChange={(open) => {
          setAwardsOpen(open);
          if (open) setObjectivesOpen(false);
        }}
      />
      <MobileNudge />
      {fromStudio && <DesignerJumpBanner />}
    </div>
  );
}

export default function DesktopClient(props: {
  learnerId: string;
  displayName: string;
  completedTaskKeys: TaskKey[];
  certificateTrackKeys: string[];
  jumpTab?: string;
  fromStudio?: boolean;
}) {
  return (
    <WindowManagerProvider jumpTab={props.jumpTab}>
      <ProgressProvider
        learnerId={props.learnerId}
        initialCompletedTaskKeys={props.completedTaskKeys}
        initialCertificateTrackKeys={props.certificateTrackKeys}
      >
        <DesktopShell displayName={props.displayName} fromStudio={!!props.fromStudio} />
      </ProgressProvider>
    </WindowManagerProvider>
  );
}

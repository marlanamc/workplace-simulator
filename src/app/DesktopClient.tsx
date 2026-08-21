"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { APP_DEFS, DESKTOP_COPY, type Lang, type TaskKey } from "@/lib/desktop-content";
import { TASK_INFO, TASK_LOCATIONS, TRACKS, levelForTrack, nextTaskInTrack } from "@/lib/tracks-content";
import Shelf, { AppIcon, SHELF_HEIGHT } from "@/components/Shelf";
import ObjectivesPanel from "@/components/ObjectivesPanel";
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
function AppWindow({ active, children }: { active: boolean; children: ReactNode }) {
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
    <div ref={ref} className={active ? "fixed inset-0 h-full" : "hidden"}>
      {children}
    </div>
  );
}

function DesktopShell({ displayName }: { displayName: string }) {
  const [lang] = useState<Lang>("en");
  const { apps, active, openApp } = useWindowManager();
  const { completedTaskKeys, points, currentTrack, learnerId } = useProgress();

  const c = DESKTOP_COPY[lang];
  const focusApp = APP_DEFS[0];
  const totalTaskCount = TRACKS.reduce((n, t) => n + t.taskKeys.length, 0);
  const nextTaskKey = nextTaskInTrack(currentTrack, completedTaskKeys);
  const nextTaskLocation = nextTaskKey ? TASK_LOCATIONS[nextTaskKey] : null;
  // A next task only "counts" for the focus card once it's actually built —
  // otherwise (a real state once Track 4/5 fill in over time) show a
  // generic "more coming soon" card instead of a task with no way to start it.
  const nextTaskInfo = nextTaskKey && nextTaskLocation ? TASK_INFO[nextTaskKey] : null;
  const comingSoon = nextTaskKey !== null && nextTaskInfo === null;

  const anyAppActive = active !== null;
  const currentLevel = levelForTrack(currentTrack.key);

  // Wallpaper shifts with the learner's current level (not track — the
  // environment stays constant across every track inside one level). A
  // gradient can't be CSS-transitioned directly, so the old one is kept
  // mounted just long enough to fade out over the new one underneath.
  // Adjusted during render (React's recommended pattern), not in an effect.
  const [lastWallpaper, setLastWallpaper] = useState(currentLevel.wallpaper);
  const [outgoingWallpaper, setOutgoingWallpaper] = useState<string | null>(null);
  const [wallpaperFadeKey, setWallpaperFadeKey] = useState(0);
  if (lastWallpaper !== currentLevel.wallpaper) {
    setOutgoingWallpaper(lastWallpaper);
    setWallpaperFadeKey((k) => k + 1);
    setLastWallpaper(currentLevel.wallpaper);
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden text-[15px]"
      style={{ color: "var(--text-primary)" }}
    >
      {/* wallpaper — shifts with the learner's current level, so the workspace visibly grows with them */}
      <div className="fixed inset-0 -z-10" style={{ background: currentLevel.wallpaper }} />
      {outgoingWallpaper && (
        <div
          key={wallpaperFadeKey}
          className="fixed inset-0 -z-10 animate-wallpaper-fade-out pointer-events-none"
          style={{ background: outgoingWallpaper }}
        />
      )}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,241,199,0.55) 0%, rgba(255,241,199,0.18) 22%, transparent 42%)",
        }}
      />

      {/* desktop content — hidden while an app window is active, but never unmounted */}
      <div
        className={anyAppActive ? "hidden" : "flex min-h-screen flex-col"}
        style={{ paddingBottom: SHELF_HEIGHT }}
      >
        <div className="flex items-center px-5 py-4">
          <div className="flex items-center gap-2 text-[12px] font-medium tracking-wide text-white/85 uppercase">
            {c.practiceBanner}
          </div>
        </div>

        {/* single focus card — one task, one action */}
        <div className="flex-1 flex items-center justify-center px-5 pb-8">
          <div className="w-full max-w-[420px] rounded-2xl bg-white p-7 flex flex-col gap-5 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_20px_44px_rgba(20,20,50,0.28)] animate-fade-up">
            <div className="flex items-center gap-3">
              <AppIcon icon={focusApp.icon} color={focusApp.color} size={44} />
              <div>
                <div className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-wide text-[var(--accent)]">
                  {nextTaskInfo ? c.nextLabel : comingSoon ? "" : "🎉"}
                </div>
                <div className="text-[21px] font-medium leading-tight text-[var(--text-primary)]">
                  {nextTaskInfo ? nextTaskInfo.label : comingSoon ? c.comingSoonHeadline : c.allDoneHeadline}
                </div>
              </div>
            </div>

            <p className="text-[15px] leading-relaxed text-[var(--text-secondary)]">
              {nextTaskInfo ? nextTaskInfo.description : comingSoon ? c.comingSoonBody : c.allDoneBody}
            </p>

            {nextTaskLocation && (
              <button
                onClick={() => openApp(nextTaskLocation.appKey, { tab: nextTaskLocation.tab })}
                className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[var(--accent)] px-6 text-[16px] font-medium text-white hover:bg-[var(--accent-hover)] cursor-pointer"
              >
                {nextTaskLocation.ctaLabel}
              </button>
            )}
            {!nextTaskKey && (
              <a
                href={`/certificate/${learnerId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[var(--accent)] px-6 text-[16px] font-medium text-white hover:bg-[var(--accent-hover)]"
              >
                {c.allDoneCta}
              </a>
            )}

            <div className="flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                <div
                  className="h-full rounded-full bg-[var(--accent)]"
                  style={{ width: `${Math.round((completedTaskKeys.length / totalTaskCount) * 100)}%` }}
                />
              </div>
              <span className="whitespace-nowrap text-[13px] font-medium text-[var(--text-tertiary)]">
                {points} pts
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* app windows — mounted once opened, visible only while active, so
          minimizing preserves state (e.g. which mail step you're on) */}
      {apps.browser && (
        <AppWindow active={active === "browser"}>
          <BrowserClient />
        </AppWindow>
      )}
      {apps.pdf && (
        <AppWindow active={active === "pdf"}>
          <PdfReaderClient />
        </AppWindow>
      )}

      <ObjectivesPanel />
      <TrackCelebration />
      <LevelUpCelebration />
      <Shelf displayName={displayName} />
      <MobileNudge />
    </div>
  );
}

export default function DesktopClient(props: {
  learnerId: string;
  displayName: string;
  completedTaskKeys: TaskKey[];
  certificateTrackKeys: string[];
}) {
  return (
    <WindowManagerProvider>
      <ProgressProvider
        learnerId={props.learnerId}
        initialCompletedTaskKeys={props.completedTaskKeys}
        initialCertificateTrackKeys={props.certificateTrackKeys}
      >
        <DesktopShell displayName={props.displayName} />
      </ProgressProvider>
    </WindowManagerProvider>
  );
}

"use client";
import type { CourseRoute } from "@/lib/course-route";
import type { SubmissionContent } from "@/lib/task-types";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { type TaskKey } from "@/lib/desktop-content";
import type { BridgePath } from "@/lib/bridge-path";
import type { TeacherFeedback } from "@/lib/task-types";
import type { RungMap } from "@/lib/release-ladder";
import { actForLevel, isLevelComplete, levelForTrack } from "@/lib/tracks-content";
import Desktop from "@/components/desktop/Desktop";
import MyJobPanel from "@/components/MyJobPanel";
import AwardsCase from "@/components/AwardsCase";
import TrackCelebration from "@/components/TrackCelebration";
import LevelUpCelebration from "@/components/LevelUpCelebration";
import MobileNudge from "@/components/MobileNudge";
import MariaNoteToast from "@/components/MariaNoteToast";
import TeacherNotesToast from "@/components/TeacherNotesToast";
import TeacherNotesPanel from "@/components/TeacherNotesPanel";
import SimulatorWelcome from "@/components/SimulatorWelcome";
import ActIntro from "@/components/ActIntro";
import { WELCOME_FLAG } from "@/lib/welcome-content";
import { actIntroFlag } from "@/lib/act-intro-content";
import ListIntroSpotlight from "@/components/task/ListIntroSpotlight";
import { LIST_INTRO_FLAG, shouldShowListIntro } from "@/lib/job-card-content";
import { WindowManagerProvider } from "@/lib/window-manager";
import { ProgressProvider, useProgress } from "@/lib/progress-context";
import { JobCardProvider } from "@/lib/job-card-context";

function DesignerJumpBanner() {
  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex h-9 items-center justify-between gap-3 bg-[#202124] px-4 text-[13px] text-white">
      <p className="min-w-0 truncate text-white/80">
        Studio jump. Same locks as a learner on this day.
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

/** Remembers, per learner, that the first-run Job Card beats have played. */
const INTRO_FLAG = "job-card-intro-seen";

function JobCardHost({ children }: { children: ReactNode }) {
  const { storyFlags, setStoryFlag, completedTaskKeys, currentTrack, bridgePath, celebrateLevel } = useProgress();
  if (completedTaskKeys.length === 0 && storyFlags[INTRO_FLAG] !== "true" && storyFlags[WELCOME_FLAG] !== "true") {
    return <SimulatorWelcome onContinue={() => setStoryFlag(WELCOME_FLAG, "true")} />;
  }

  // Before each later act: the orientation screen (new role, new manager, new
  // skills). Fires the moment `currentTrack` crosses into an act's first level
  // — once per act, and never again on replay. `act.key !== "act1"` keeps a
  // brand-new learner (currentTrack = orientation) on `SimulatorWelcome`; a
  // Studio time-machine jump wipes story flags, so this also (correctly)
  // re-shows the intro for the act you land in.
  // Wait out any clock-out celebration first (e.g. end of Act I) so the day
  // can end before the next act's full-page intro. Only a `stoppingPoint` card
  // actually renders at an act boundary: `LevelUpCelebration` returns null for
  // an act-opening level precisely so it can defer to this screen. Waiting on a
  // card that renders nothing would strand the learner on a finished desktop
  // with neither the celebration nor the intro.
  const currentLevel = levelForTrack(currentTrack.key);
  const act = actForLevel(currentLevel);
  if (
    act &&
    act.key !== "act1" &&
    act.levelKeys[0] === currentLevel.key &&
    !isLevelComplete(currentLevel, completedTaskKeys, bridgePath) &&
    storyFlags[actIntroFlag(act.key)] !== "true" &&
    !celebrateLevel?.levelUp?.stoppingPoint
  ) {
    return <ActIntro act={act} onContinue={() => setStoryFlag(actIntroFlag(act.key), "true")} />;
  }

  return (
    <JobCardProvider
      // A returning learner has already met the card; only a genuinely fresh
      // start gets the intro beats.
      introSeen={storyFlags[INTRO_FLAG] === "true" || completedTaskKeys.length > 0}
      onIntroDone={() => setStoryFlag(INTRO_FLAG, "true")}
    >
      {children}
    </JobCardProvider>
  );
}

function DesktopShell({
  displayName,
  fromStudio,
}: {
  displayName: string;
  fromStudio: boolean;
}) {
  const { currentTrack, dismissCelebration, completedTaskKeys, storyFlags, setStoryFlag, celebrateLevel, celebrateTrack } = useProgress();
  const [myJobOpen, setMyJobOpen] = useState(false);
  const [awardsOpen, setAwardsOpen] = useState(false);
  const [teacherNotesOpen, setTeacherNotesOpen] = useState(false);

  const currentLevel = levelForTrack(currentTrack.key);
  const showListIntro = shouldShowListIntro({
    storyFlags,
    completedTaskKeys,
    levelKey: currentLevel.key,
    celebrating: Boolean(celebrateLevel?.levelUp || celebrateTrack),
  });

  return (
    <Desktop
      displayName={displayName}
      topInset={fromStudio ? 36 : 0}
      myJob={{
        open: myJobOpen,
        onOpenChange: (open) => {
          setMyJobOpen(open);
          if (open) setAwardsOpen(false);
          if (open && showListIntro) setStoryFlag(LIST_INTRO_FLAG, "true");
        },
      }}
      beforeShelf={
        <>
          <MyJobPanel
            open={myJobOpen}
            onOpenChange={setMyJobOpen}
            onOpenAwards={() => {
              setMyJobOpen(false);
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
              setMyJobOpen(false);
              setAwardsOpen(true);
            }}
          />
          <LevelUpCelebration />
        </>
      }
      afterCard={
        <>
          {showListIntro ? <ListIntroSpotlight /> : null}
          <MariaNoteToast />
          <TeacherNotesToast onOpen={() => setTeacherNotesOpen(true)} />
          <TeacherNotesPanel open={teacherNotesOpen} onClose={() => setTeacherNotesOpen(false)} />
          <MobileNudge />
          {fromStudio && <DesignerJumpBanner />}
        </>
      }
    />
  );
}

export default function DesktopClient(props: {
  learnerId: string;
  displayName: string;
  completedTaskKeys: TaskKey[];
  certificateTrackKeys: string[];
  initialCourseRoute?: CourseRoute | null;
  initialOpeningReplies?: import("@/lib/tasks/mail/opening").OpeningReply[];
  initialWriting?: Record<string, SubmissionContent>;
  initialBridgePath?: BridgePath | null;
  initialFeedback?: TeacherFeedback[];
  initialRungs?: RungMap;
  jumpTab?: string;
  fromStudio?: boolean;
  /** Studio day jump: seed the arrival level-up card for this level key. */
  arriveLevelKey?: string;
}) {
  // A brand-new learner lands on the desktop, not inside a browser window.
  // The Job Card introduces itself on an empty screen, and *its* button opens
  // the Browser - so the first thing they ever do is the loop the rest of the
  // product runs on. Auto-opening the tour used to put a full browser window,
  // a bookmark bar, and a welcome modal on screen one, all talking at once.
  return (
    <WindowManagerProvider jumpTab={props.jumpTab}>
      <ProgressProvider
        learnerId={props.learnerId}
        displayName={props.displayName}
        initialCompletedTaskKeys={props.completedTaskKeys}
        initialCertificateTrackKeys={props.certificateTrackKeys}
        initialCourseRoute={props.initialCourseRoute}
        initialWriting={props.initialWriting}
        initialOpeningReplies={props.initialOpeningReplies}
        initialBridgePath={props.initialBridgePath}
        initialFeedback={props.initialFeedback}
        initialRungs={props.initialRungs}
        initialArriveLevelKey={props.arriveLevelKey ?? null}
      >
        <JobCardHost>
          <DesktopShell displayName={props.displayName} fromStudio={!!props.fromStudio} />
        </JobCardHost>
      </ProgressProvider>
    </WindowManagerProvider>
  );
}

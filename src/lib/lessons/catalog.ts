import type { TaskKey } from "@/lib/desktop-content";
import { TASKS } from "@/lib/tasks/registry";
import {
  LEVELS,
  TASK_LOCATIONS,
  TRACKS,
  courseLevels,
  taskKeysForLevel,
  type Level,
  type Track,
} from "@/lib/tracks-content";
import { routeBridgePath, routeForLevel, type CourseRoute } from "@/lib/course-route";
import type { BridgePath } from "@/lib/bridge-path";
import { BRIDGE_PATH_FLAG } from "@/lib/bridge-path";
import { jumpTabForTask } from "@/lib/curriculum-catalog";
import { WELCOME_FLAG } from "@/lib/welcome-content";
import { actIntroFlag } from "@/lib/act-intro-content";
import { ACTS } from "@/lib/tracks-content";
import { LIST_INTRO_FLAG } from "@/lib/job-card-content";
import { CALENDAR_REMINDER_FLAG } from "@/lib/tasks/tour/content";
import type { StoryFlags } from "@/lib/story-beats";
import type { PortalSection } from "@/lib/tasks/registry";
import type { LessonMeta } from "./types";
import type { SkillTag } from "./skills";

export type LessonEntry = LessonMeta & {
  taskKey: TaskKey;
  /** The browser tabs this lesson may show. The first is where it opens. */
  tabs: string[];
  /** Employee Portal sub-page, for a task that lives inside the Portal tab. */
  section?: PortalSection;
};

/** The browser tab a task opens on. Act II+ locations drop `tab`, so the catalog is the fallback. */
export function lessonTabFor(taskKey: TaskKey): string | undefined {
  return TASK_LOCATIONS[taskKey]?.tab ?? jumpTabForTask(taskKey);
}

/** Every task with a `lesson` block, in the game's order. */
export const LESSONS: LessonEntry[] = Object.values(TASKS).flatMap((t) => {
  if (!t.lesson || t.retired) return [];
  const home = lessonTabFor(t.key);
  const tabs = [...new Set([...(home ? [home] : []), ...(t.lesson.tabs ?? [])])];
  return [{ ...t.lesson, taskKey: t.key, tabs, section: TASK_LOCATIONS[t.key]?.section }];
});

const BY_KEY = new Map(LESSONS.map((l) => [l.taskKey as string, l]));

export function lessonByKey(key: string): LessonEntry | undefined {
  return BY_KEY.get(key);
}

export function lessonsBySkill(skill: SkillTag | null): LessonEntry[] {
  return skill ? LESSONS.filter((l) => l.skills.includes(skill)) : LESSONS;
}

/** Where a task sits in the game: its level, its track, and the Act V door it needs. */
function placeTask(taskKey: TaskKey): { level: Level; track: Track; path: BridgePath | null } | null {
  for (const level of LEVELS) {
    const pathTrack = level.pathTracks
      ? (Object.entries(level.pathTracks) as [BridgePath, string][]).find(([, tk]) =>
          TRACKS.find((t) => t.key === tk)?.taskKeys.includes(taskKey),
        )
      : undefined;
    const trackKey = pathTrack?.[1] ?? level.trackKeys.find((tk) => TRACKS.find((t) => t.key === tk)?.taskKeys.includes(taskKey));
    const track = trackKey ? TRACKS.find((t) => t.key === trackKey) : undefined;
    if (track) return { level, track, path: pathTrack?.[0] ?? null };
  }
  return null;
}

export type LessonSeed = {
  /** Everything a learner would have done by the moment this task begins. */
  completedTaskKeys: TaskKey[];
  courseRoute: CourseRoute | null;
  bridgePath: BridgePath | null;
  /** The track the lesson's task belongs to. Pinned, so finishing never moves the desktop on. */
  track: Track;
  storyFlags: StoryFlags;
};

/**
 * The progress a lesson starts from: every earlier level done, plus the
 * earlier tasks in this one, so `nextTaskInTrack(activeTrack(...))` is the
 * lesson's task. Mirrors the Studio progress presets (`setProgressPreset`).
 */
export function seedForLesson(taskKey: TaskKey): LessonSeed | null {
  const placed = placeTask(taskKey);
  if (!placed) return null;
  const { level, track, path } = placed;
  const courseRoute = routeForLevel(level.key, path);
  const bridgePath = routeBridgePath(courseRoute);
  const levels = courseLevels(courseRoute);
  const before = levels.slice(0, Math.max(0, levels.findIndex((l) => l.key === level.key)));
  const inLevel = taskKeysForLevel(level, bridgePath);
  const completedTaskKeys = [
    ...before.flatMap((l) => taskKeysForLevel(l, bridgePath)),
    ...inLevel.slice(0, Math.max(0, inLevel.indexOf(taskKey))),
  ];
  // Every first-run screen already seen: a lesson opens straight on the task.
  const storyFlags: StoryFlags = {
    [WELCOME_FLAG]: "true",
    "job-card-intro-seen": "true",
    [LIST_INTRO_FLAG]: "true",
    [CALENDAR_REMINDER_FLAG]: "true",
    ...Object.fromEntries(ACTS.map((a) => [actIntroFlag(a.key), "true"])),
    ...(bridgePath ? { [BRIDGE_PATH_FLAG]: bridgePath } : {}),
  };
  return { completedTaskKeys, courseRoute, bridgePath, track, storyFlags };
}

import { courseRouteFromBadges, routeBridgePath, routeIncludesLevel } from "@/lib/course-route";
import { bridgePathFromBadgeKeys, type BridgePath } from "@/lib/bridge-path";
import type { TaskKey } from "@/lib/desktop-content";
import { SKILLS } from "@/lib/skills";
import { taskNeedsTeacherReview } from "@/lib/curriculum-catalog";
import { ACTS, LEVELS, actLabel, activeTrack, actForLevel, levelForTrack, taskKeysForLevel } from "@/lib/tracks-content";

/**
 * Built from the same runtime source the simulator itself plays from
 * (`ACTS`/`LEVELS`/`taskKeysForLevel` in tracks-content.ts) rather than the
 * `/studio` curriculum catalog — that catalog still lists a few retired
 * bucket task keys (e.g. Act I's old combined "mail" job), which would never
 * match a real learner's completions and make their progress look stuck.
 */

export interface ActProgress {
  key: string;
  numeral: string;
  title: string;
  shortTitle: string;
  color: string;
  done: number;
  total: number;
  state: "done" | "current" | "upcoming" | "off-path";
}

export interface LevelProgress {
  key: string;
  title: string;
  lessons: { taskKey: string; skill: string; done: boolean; teacherCheck: boolean }[];
}

export interface StudentProgress {
  path: BridgePath | null;
  whereActKey: string | null;
  whereLabel: string;
  tasksDone: number;
  tasksTotal: number;
  acts: ActProgress[];
  map: { act: ActProgress; levels: LevelProgress[] }[];
}


/** A rough color per act, since the runtime `ACTS` (unlike the studio catalog) doesn't carry one. */
const ACT_COLORS: Record<string, string> = {
  act1: "#1a73e8",
  act2: "#e37400",
  act3: "#1e8e3e",
  act4: "#8430ce",
  act5: "#00897b",
  act6: "#c5221f",
  act7: "#e8a317",
};

export function studentProgress(
  completedTaskKeys: string[],
  badgeKeys: string[],
): StudentProgress {
  const done = new Set(completedTaskKeys);
  const route = courseRouteFromBadges(badgeKeys);
  const path = routeBridgePath(route) ?? bridgePathFromBadgeKeys(badgeKeys);

  let whereActKey: string | null = null;
  let whereLabel = "Just started";
  if (done.size > 0) {
    const track = activeTrack(Array.from(done) as TaskKey[], path, route);
    const level = levelForTrack(track.key);
    const act = actForLevel(level);
    whereActKey = act?.key ?? null;
    whereLabel = act ? `Act ${act.numeral} · ${level.title.en}` : level.title.en;
  }

  let tasksDone = 0;
  let tasksTotal = 0;
  let seenCurrent = false;

  const map = ACTS.map((act) => {
    const levels: LevelProgress[] = act.levelKeys.filter((key) => routeIncludesLevel(route, key)).map((levelKey) => {
      const level = LEVELS.find((l) => l.key === levelKey);
      const taskKeys = level ? taskKeysForLevel(level, path) : [];
      return {
        key: levelKey,
        title: level?.title.en ?? levelKey,
        lessons: taskKeys.map((tk) => ({
          taskKey: tk,
          skill: SKILLS[tk]?.en ?? tk,
          done: done.has(tk),
          teacherCheck: taskNeedsTeacherReview(tk),
        })),
      };
    });
    const allLessons = levels.flatMap((l) => l.lessons);
    const actDone = allLessons.filter((l) => l.done).length;
    tasksDone += actDone;
    tasksTotal += allLessons.length;

    let state: ActProgress["state"];
    if (allLessons.length === 0) {
      state = "off-path";
    } else if (whereActKey === act.key) {
      state = "current";
      seenCurrent = true;
    } else if (!seenCurrent && actDone === allLessons.length) {
      state = "done";
    } else if (!seenCurrent && actDone > 0) {
      state = "current";
      seenCurrent = true;
    } else {
      state = "upcoming";
    }

    const actProg: ActProgress = {
      key: act.key,
      numeral: act.numeral,
      title: actLabel(act, "en"),
      shortTitle: act.role.en,
      color: ACT_COLORS[act.key] ?? "#8ab4f8",
      done: actDone,
      total: allLessons.length,
      state,
    };
    return { act: actProg, levels };
  });

  return {
    path,
    whereActKey,
    whereLabel,
    tasksDone,
    tasksTotal,
    acts: map.map((m) => m.act),
    map,
  };
}

// Rung 2 needs two clean runs with no help asked before advancing; rung 3
// needs only one, per the release ladder's "moves up when" rules.
const CLEAN_RUNS_TO_ADVANCE: Partial<Record<Rung, number>> = { 2: 2, 3: 1 };
const GAP_DECAY_MS = 21 * 24 * 60 * 60 * 1000;

export type Rung = 1 | 2 | 3 | 4;

export interface SkillRungState {
  rung: Rung;
  cleanRunStreak: number;
  missStreak: number;
  lastPracticedAt: string;
}

export type RungMap = Record<string, SkillRungState>;

function stateFor(map: RungMap, skillKey: string): SkillRungState {
  return map[skillKey] ?? { rung: 1, cleanRunStreak: 0, missStreak: 0, lastPracticedAt: "" };
}

export function rungFor(map: RungMap, skillKey: string): Rung {
  return stateFor(map, skillKey).rung;
}

// These are pure functions over a caller-supplied `now`, never `Date.now()`/`new Date()`
// internally, so the ladder's transition logic stays deterministic and testable — the
// convention this repo already follows for shared logic (see NEXT_SESSION.md).
export function recordCleanRun(map: RungMap, skillKey: string, now: string): RungMap {
  const prev = stateFor(map, skillKey);
  let rung = prev.rung;
  let cleanRunStreak = prev.cleanRunStreak + 1;

  if (rung === 1) {
    rung = 2;
    cleanRunStreak = 0;
  } else {
    const threshold = CLEAN_RUNS_TO_ADVANCE[rung];
    if (threshold !== undefined && cleanRunStreak >= threshold) {
      rung = (rung + 1) as Rung;
      cleanRunStreak = 0;
    }
  }

  return {
    ...map,
    [skillKey]: { rung, cleanRunStreak, missStreak: 0, lastPracticedAt: now },
  };
}

export function recordMissedRun(map: RungMap, skillKey: string, now: string): RungMap {
  const prev = stateFor(map, skillKey);
  const missStreak = prev.missStreak + 1;

  if (missStreak >= 2) {
    const rung = Math.max(1, prev.rung - 1) as Rung;
    return {
      ...map,
      [skillKey]: { rung, cleanRunStreak: 0, missStreak: 0, lastPracticedAt: now },
    };
  }

  return {
    ...map,
    [skillKey]: { ...prev, missStreak, lastPracticedAt: now },
  };
}

export function applyGapDecay(map: RungMap, now: string): RungMap {
  const nowMs = new Date(now).getTime();
  let changed = false;
  const next: RungMap = {};

  for (const [skillKey, state] of Object.entries(map)) {
    const lastMs = new Date(state.lastPracticedAt).getTime();
    if (state.rung > 1 && Number.isFinite(lastMs) && nowMs - lastMs >= GAP_DECAY_MS) {
      changed = true;
      next[skillKey] = { rung: (state.rung - 1) as Rung, cleanRunStreak: 0, missStreak: 0, lastPracticedAt: state.lastPracticedAt };
    } else {
      next[skillKey] = state;
    }
  }

  return changed ? next : map;
}

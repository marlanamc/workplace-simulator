import { describe, it, expect } from 'vitest';
import { COURSE_ROUTES, routeBridgePath, courseRouteFromBadges, routeForLevel } from '../course-route';
import { courseLevels, taskKeysForLevel, nextHandoff, coreComplete, courseComplete, unlockedCourseLevels, nextCourseLevel } from '../tracks-content';
import type { TaskKey } from '../desktop-content';
import { practicedHistory } from '../tasks/job-application/content';

const core = courseLevels(null).flatMap((l) => taskKeysForLevel(l));
describe('core plus optional course routes', () => {
  it('stops after the core without assigning an optional act', () => {
    expect(coreComplete(core)).toBe(true);
    expect(nextHandoff(core, null, null)).toBeNull();
    expect(nextHandoff(core, null, 'pause')).toBeNull();
  });
  it.each(COURSE_ROUTES)('walks every %s task exactly once with no skipped credit', (route) => {
    const done: TaskKey[] = [];
    const path = routeBridgePath(route);
    const expected = courseLevels(route).flatMap((l) => taskKeysForLevel(l, path));
    for (let i = 0; i < expected.length; i++) {
      const next = nextHandoff(done, path, route);
      expect(next?.taskKey).toBe(expected[i]);
      done.push(next!.taskKey);
    }
    expect(new Set(done).size).toBe(expected.length);
    expect(courseComplete(done, route)).toBe(true);
    expect(nextHandoff(done, path, route)).toBeNull();
    if (route === 'office') {
      expect(done).not.toContain('college-offer');
      expect(done).not.toContain('enrollment');
      expect(done).not.toContain('priority-call');
    }
  });
  it('switches routes without losing earned work or opening skipped management levels', () => {
    const done = [...core, 'job-posting'] as TaskKey[];
    expect(nextHandoff(done, 'b', 'healthcare')?.taskKey).toBe('appointment-scheduling');
    expect(nextHandoff(done, null, 'office')?.taskKey).toBe('job-application');
    expect(unlockedCourseLevels(done, 'office').map((l) => l.key)).not.toContain('level9');
    expect(done).toContain('job-posting');
    expect(done).not.toContain('appointment-scheduling');
  });
  it('ends celebrations at route boundaries and derives Studio routes', () => {
    const last = courseLevels('healthcare').at(-1)!;
    expect(nextCourseLevel(last, 'healthcare')).toBeNull();
    expect(routeForLevel('level19h1')).toBe('office');
    expect(routeForLevel('level16', 'b')).toBe('healthcare');
    expect(courseRouteFromBadges(['track:mail', 'course-route:office'])).toBe('office');
    expect(courseRouteFromBadges(['course-route:unknown'])).toBeNull();
  });
  it('does not credit management employment on a direct office route', () => {
    const history = practicedHistory(core);
    expect(history.map((h) => h.title.en)).not.toContain('Assistant Manager');
    expect(history.every((h) => h.span.en === 'Simulated practice')).toBe(true);
  });
});

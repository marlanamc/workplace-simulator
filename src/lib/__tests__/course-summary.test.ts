import { describe, expect, it } from 'vitest';
import { COURSE_ROUTES, routeBridgePath, type CourseRoute } from '../course-route';
import { LEVELS, courseLevels, taskKeysForLevel } from '../tracks-content';
import { firstPersonSkill } from '../skills';
import type { TaskKey } from '../desktop-content';
import type { Lang } from '../task-types';
import {
  ENDING_COPY,
  HONEST_LINE,
  SECTION_HEADINGS,
  buildCourseSummary,
  formatCourseSummary,
  summarySections,
  workdaysFinished,
} from '../portfolio-summary';

const LANGS: Lang[] = ['en', 'es'];
const NOW = new Date('2026-09-28T15:00:00Z');
const orientation = new Set(taskKeysForLevel(LEVELS[0]));

/** Everything a learner finishes walking one route from the start. */
function finishedOn(route: CourseRoute): TaskKey[] {
  return courseLevels(route === 'pause' ? null : route).flatMap((l) => taskKeysForLevel(l, routeBridgePath(route)));
}
/** The skills the summary should list for those tasks. */
function expectedSkills(done: TaskKey[], lang: Lang): Set<string> {
  return new Set(done.filter((k) => !orientation.has(k) && k !== 'portfolio-reflection').map((k) => firstPersonSkill(k, lang)));
}

describe('the summary a learner keeps at the end of a route', () => {
  for (const route of COURSE_ROUTES) {
    it.each(LANGS)(`lists exactly the skills finished on ${route} (%s)`, (lang) => {
      const done = finishedOn(route);
      const items = summarySections(done, lang).flatMap((s) => s.items);
      expect(new Set(items)).toEqual(expectedSkills(done, lang));
      // Every line appears once, even when two tasks teach the same skill.
      expect(items.length).toBe(new Set(items).size);
    });
  }

  it('never lists a skill from a route the learner did not take', () => {
    const done = finishedOn('healthcare');
    const items = summarySections(done, 'en').flatMap((s) => s.items);
    expect(items).not.toContain(firstPersonSkill('enrollment', 'en'));
    expect(items).not.toContain(firstPersonSkill('team-schedule', 'en'));
    expect(items).not.toContain(firstPersonSkill('job-application', 'en'));
    expect(summarySections(done, 'en').map((s) => s.key)).toEqual(['start', 'shift', 'frontDesk']);
    expect(summarySections(finishedOn('college'), 'en').map((s) => s.key)).toEqual(['start', 'shift', 'college']);
    expect(summarySections(finishedOn('lead'), 'en').map((s) => s.key)).toEqual(['start', 'shift', 'lead']);
    expect(summarySections(finishedOn('office'), 'en').map((s) => s.key)).toEqual(['start', 'shift', 'hired', 'office', 'teamLead']);
  });

  it('keeps both routes when a learner finishes one and then another', () => {
    const done = [...new Set([...finishedOn('lead'), ...finishedOn('college')])];
    expect(summarySections(done, 'en').map((s) => s.key)).toEqual(['start', 'shift', 'lead', 'college']);
  });

  it.each(LANGS)('uses plain headings, never bare act numbers (%s)', (lang) => {
    const done = [...new Set(COURSE_ROUTES.flatMap(finishedOn))];
    const text = formatCourseSummary(buildCourseSummary({ displayName: 'Ana', classCode: 'HARBOR-27', now: NOW, timeZone: 'UTC', completedTaskKeys: done, lang }));
    expect(text).not.toMatch(/\bActo? (I|II|III|IV|V|VI|VII)\b/);
    for (const heading of Object.values(SECTION_HEADINGS)) expect(text).toContain(heading[lang]);
  });

  it.each(LANGS)('carries the name, class code, date, and the honest line (%s)', (lang) => {
    const summary = buildCourseSummary({ displayName: ' Ana López ', classCode: 'HARBOR-27', now: NOW, timeZone: 'UTC', completedTaskKeys: finishedOn('lead'), lang });
    const text = formatCourseSummary(summary);
    expect(text).toContain('Ana López');
    expect(text).toContain('HARBOR-27');
    expect(text).toContain(lang === 'en' ? 'September 28, 2026' : '28 de septiembre de 2026');
    expect(text).toContain(HONEST_LINE[lang]);
    expect(text).toContain(lang === 'en' ? 'not employment history' : 'no es historial de empleo');
    expect(text).toContain(firstPersonSkill('team-schedule', lang));
  });

  it('takes the date it is given and leaves it off when there is none', () => {
    const later = buildCourseSummary({ displayName: 'Ana', now: new Date('2027-01-05T12:00:00Z'), timeZone: 'UTC', completedTaskKeys: [], lang: 'en' });
    expect(formatCourseSummary(later)).toContain('January 5, 2027');
    const undated = buildCourseSummary({ displayName: 'Ana', completedTaskKeys: [], lang: 'en' });
    expect(undated.details.map((d) => d.label)).not.toContain('Date');
  });

  it('writes every item as a first-person skill, never a story instruction', () => {
    const done = [...new Set(COURSE_ROUTES.flatMap(finishedOn))];
    for (const item of summarySections(done, 'en').flatMap((s) => s.items)) {
      expect(item).toMatch(/^I can .+\.$/);
      expect(item, item).not.toMatch(/\b(you|your|Maria)\b/i);
    }
    for (const item of summarySections(done, 'es').flatMap((s) => s.items)) {
      expect(item).toMatch(/^Puedo .+\.$/);
      expect(item, item).not.toMatch(/^(Dile|Díle|Haz|Escribe|Envía|Abre|Responde|Lee|Busca|Llena|Pide|Revisa|Mira|Avisa)\b/);
      expect(item, item).not.toMatch(/\bMaria\b/);
    }
  });

  it('counts finished days of work, not the night before or getting hired', () => {
    const core = finishedOn('pause');
    const coreDays = workdaysFinished(core);
    expect(coreDays).toBe(courseLevels(null).filter((l) => l.key !== 'level0' && l.key !== 'level1').length);
    expect(workdaysFinished(finishedOn('office'))).toBe(
      courseLevels('office').filter((l) => l.key !== 'level0' && l.key !== 'level1' && !l.preHire).length,
    );
    expect(workdaysFinished([])).toBe(0);
  });

  it.each(LANGS)('says what was finished in the Job Card ending lines (%s)', (lang) => {
    expect(ENDING_COPY.routeLine('healthcare', 16, lang)).toContain('16');
    expect(ENDING_COPY.coreLine(12, lang)).toContain('12');
    expect(ENDING_COPY.stopLine(20, lang)).toContain('20');
    expect(ENDING_COPY.summaryHint[lang]).toBeTruthy();
  });
});

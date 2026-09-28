import { describe, expect, it } from 'vitest';
import { COURSE_ROUTE_DESCRIPTIONS, COURSE_ROUTE_TAGS, COURSE_ROUTES, ROUTE_CHOOSER_LINES, changeDirectionPlacement, routeChoiceState, routeChooserMode } from '../course-route';
import { actIntroFlag, actIntroFor } from '../act-intro-content';
import { CORE_FINALE, courseFinaleFor, courseLevels, levelByArrivalKey, LEVELS, levelUpCardFor, levelUpCopyFor } from '../tracks-content';
import { storyMailAfter } from '../story-beats';
import { welcomeHomeFor } from '../welcome-home-content';

describe('route orientation', () => {
  it('describes the actual number of additional story sittings in both languages', () => {
    for (const route of COURSE_ROUTES.filter(r => r !== 'pause')) {
      const days = courseLevels(route).length - courseLevels(null).length;
      for (const lang of ['en', 'es'] as const) {
        expect(COURSE_ROUTE_DESCRIPTIONS[route][lang]).toMatch(new RegExp(`^${days} `));
      }
    }
  });
  it('introduces each bridge path independently and keeps the welcome tab consistent', () => {
    expect(actIntroFlag('act5', 'a')).not.toBe(actIntroFlag('act5', 'b'));
    for (const path of ['a', 'b'] as const) {
      const intro = actIntroFor('act5', path)!;
      expect(welcomeHomeFor('act5', path).bridge).toEqual(intro.bridge);
      expect(intro.manager.en).toContain(path === 'a' ? 'Marcus' : 'Thuy');
      expect(intro.manager.en).not.toContain(path === 'a' ? 'Thuy' : 'Marcus');
    }
  });
  it('gives each bridge route its own premise in both languages', () => {
    for (const level of LEVELS.filter(l => l.pathTracks)) {
      const college = levelUpCopyFor(level, 'a')!;
      const clinic = levelUpCopyFor(level, 'b')!;
      for (const lang of ['en', 'es'] as const) {
        expect(college.body[lang]).toBeTruthy();
        expect(clinic.body[lang]).toBeTruthy();
        expect(college.body[lang]).not.toEqual(clinic.body[lang]);
      }
      expect(college.body.en).not.toMatch(/patient|clinic|visit information/);
      expect(clinic.body.en).not.toMatch(/college|syllabus|class assignment/);
    }
  });
});

describe('route chooser', () => {
  it('opens with a first-choice line that does not imply an earlier choice', () => {
    expect(routeChooserMode(null, true)).toBe('first');
    expect(ROUTE_CHOOSER_LINES.first.en).not.toMatch(/another|finished this part/i);
    expect(ROUTE_CHOOSER_LINES.first.es).not.toMatch(/otro camino/);
  });
  it('mid-direction asks to change and says finished work stays saved', () => {
    expect(routeChooserMode('office', false)).toBe('change');
    expect(ROUTE_CHOOSER_LINES.change.en).toBe('Change your direction? Your finished work stays saved.');
    expect(ROUTE_CHOOSER_LINES.change.en).not.toMatch(/You have finished/);
    expect(routeChooserMode('office', true)).toBe('another');
    expect(routeChooserMode('pause', true)).toBe('another');
  });
  it('keeps Change direction inside Help until a direction ends', () => {
    expect(changeDirectionPlacement(null, true)).toBe('none');
    for (const route of ['lead', 'healthcare', 'office', 'college'] as const) {
      expect(changeDirectionPlacement(route, false)).toBe('help');
      expect(changeDirectionPlacement(route, true)).toBe('link');
    }
    expect(changeDirectionPlacement('pause', true)).toBe('link');
  });
  it('disables finished directions and the one in progress, never Stop here', () => {
    expect(routeChoiceState('lead', 'office', true)).toBe('finished');
    expect(routeChoiceState('office', 'office', false)).toBe('current');
    expect(routeChoiceState('college', 'office', false)).toBe('open');
    expect(routeChoiceState('pause', 'pause', true)).toBe('open');
  });
  it('tags every button with its story days, in both languages', () => {
    for (const route of COURSE_ROUTES.filter(r => r !== 'pause')) {
      const days = courseLevels(route).length - courseLevels(null).length;
      for (const lang of ['en', 'es'] as const) {
        expect(COURSE_ROUTE_TAGS[route][lang]).toMatch(new RegExp(`^${days} `));
        expect(COURSE_ROUTE_TAGS[route][lang].length).toBeLessThanOrEqual(32);
      }
    }
  });
});

describe('Act II end moment', () => {
  it('gives the last core day a finale card only before a direction is chosen', () => {
    const last = courseLevels(null).at(-1)!;
    expect(courseFinaleFor(last, null)).toBe(CORE_FINALE);
    expect(courseFinaleFor(last, 'lead')).toBeNull();
    expect(courseFinaleFor(LEVELS[2], null)).toBeNull();
    expect(levelUpCardFor(CORE_FINALE)).toBe(CORE_FINALE);
    expect(levelByArrivalKey(CORE_FINALE.key)).toBe(CORE_FINALE);
    expect(levelByArrivalKey(last.key)).toBe(last);
    for (const lang of ['en', 'es'] as const) expect(CORE_FINALE.levelUp!.body[lang]).toBeTruthy();
  });
});

describe('route-specific story copy', () => {
  it('never tells an Act V learner they may skip the act they chose', () => {
    for (const path of [null, 'a', 'b'] as const) {
      expect(actIntroFor('act5', path)!.roleLine.en).not.toMatch(/skip|Nothing here is required/);
    }
  });
  it('explains the college class and the clinic workplace', () => {
    expect(actIntroFor('act5', 'a')!.roleLine.en).toMatch(/pay for one class/);
    expect(actIntroFor('act5', 'a')!.roleLine.en).toMatch(/Marcus/);
    expect(actIntroFor('act5', 'b')!.roleLine.en).toMatch(/not part of the cafe/);
  });
  it('says whose team Act VII is, before and at the act', () => {
    const slides = storyMailAfter('slide-deck')!;
    expect(slides.body!.en.join(' ')).toMatch(/In the spring, the cafe crew will need a Team Lead/);
    expect(slides.body!.en.join(' ')).not.toMatch(/choose another direction|Starting Monday/);
    expect(slides.body!.es.join(' ')).not.toMatch(/Desde el lunes/);
    expect(slides.body!.es.length).toBe(slides.body!.en.length);
    expect(actIntroFor('act7')!.roleLine.en).toMatch(/cafe crew/);
    // The act names the time that passed at HQ.
    expect(actIntroFor('act7')!.roleLine.en).toMatch(/April.*six months/);
    expect(actIntroFor('act7')!.roleLine.es).toMatch(/abril.*seis meses/);
  });
  it('does not send College or Front desk learners to HQ', () => {
    for (const task of ['research', 'confidentiality-call'] as const) {
      const mail = storyMailAfter(task)!;
      expect(mail.body!.en.join(' ')).not.toMatch(/Anita|HQ/);
      expect(mail.body!.es.join(' ')).not.toMatch(/Anita|HQ|oficina central/);
    }
  });
});

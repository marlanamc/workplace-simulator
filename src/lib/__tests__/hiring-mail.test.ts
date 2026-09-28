import { describe, expect, it } from 'vitest';
import { hiringMailsFor, hiringMailForTask } from '../hiring-mail';
import { TASKS } from '../tasks/registry';
import { sentOnForTask } from '../story-calendar';

describe('Story hiring messages', () => {
  it('does not announce an offer or forms while the learner prepares an interview', () => {
    expect(hiringMailsFor('resume-build', ['job-application'])).toEqual([]);
    expect(hiringMailsFor('interview-practice', ['job-application', 'resume-build']).map(m => m.task)).toEqual(['interview-practice']);
    expect(hiringMailsFor('job-offer', ['interview-practice']).map(m => m.task)).toEqual(['interview-practice', 'job-offer']);
  });
  it('does not introduce hiring messages on another route', () => {
    expect(hiringMailsFor('patient-intake', ['schedule', 'mail-send-link'])).toEqual([]);
    expect(hiringMailsFor('financial-aid', ['enrollment'])).toEqual([]);
  });
  it('keeps earned messages and uses their own story dates', () => {
    const keys = ['interview-practice', 'job-offer', 'w4-form'] as const;
    const mails = hiringMailsFor('office-drive', keys);
    expect(mails).toHaveLength(3);
    for (const mail of mails) {
      expect(mail.sentOn).toBe(sentOnForTask(mail.task));
      expect(mail.body?.en.length).toBeGreaterThan(0);
      expect(mail.body?.es.length).toBeGreaterThan(0);
      expect(mail.action.label.en).toBeTruthy();
      expect(mail.action.label.es).toBeTruthy();
      expect(TASKS[mail.task].location?.tab).toBe('mail');
    }
  });
  it('does not turn unrelated tasks into hiring mail', () => {
    expect(hiringMailForTask('mail-reply')).toBeUndefined();
    expect(hiringMailForTask(null)).toBeUndefined();
  });
});

import { describe, expect, it } from 'vitest';
import { FIRST_REPLY_GUIDANCE, FIRST_REPLY_EXAMPLE, OPENING_MESSAGES, nextOpeningIndex, openingInstruction, openingReplyAccepted } from '../tasks/mail/opening';
import { LEVELS, taskKeysForLevel, nextHandoff } from '../tracks-content';
import { SHIFT_TIMES } from '../story-calendar';

describe('opening reply practice', () => {
  it('keeps first-reply structure guidance throughout composition in both languages', () => {
    expect(OPENING_MESSAGES[0].subject).toEqual({ en: 'Welcome to Harborside Cafe', es: 'Bienvenido a Harborside Cafe' });
    for (const lang of ['en', 'es'] as const) {
      for (const hasText of [false, true]) for (const explicit of [false, true]) {
        expect(openingInstruction(0, 'compose', hasText, explicit)[lang]).toBe(FIRST_REPLY_GUIDANCE[lang]);
        expect(openingInstruction(1, 'compose', hasText, explicit)[lang]).not.toBe(FIRST_REPLY_GUIDANCE[lang]);
        expect(openingInstruction(2, 'compose', hasText, explicit)[lang]).not.toBe(FIRST_REPLY_GUIDANCE[lang]);
      }
      expect(FIRST_REPLY_EXAMPLE[lang]).toContain('\nAna');
      expect(openingInstruction(0, 'read', false, false)[lang]).not.toBe(FIRST_REPLY_GUIDANCE[lang]);
    }
    expect(openingReplyAccepted('welcome', 'x')).toBe(true);
    expect(openingReplyAccepted('welcome', '   ')).toBe(false);
  });
  it('resumes the first missing reply, never counting duplicates or later replies as earlier ones', () => {
    expect(nextOpeningIndex([])).toBe(0);
    expect(nextOpeningIndex([{messageId:'welcome'}, {messageId:'welcome'}])).toBe(1);
    expect(nextOpeningIndex([{messageId:'cups'}])).toBe(0);
    expect(nextOpeningIndex(OPENING_MESSAGES.map(m => ({messageId:m.id})))).toBe(3);
  });
  it('requires three distinct localized purposes, with tomorrow matching the schedule', () => {
    expect(new Set(OPENING_MESSAGES.map(m => m.subject.en)).size).toBe(3);
    for (const m of OPENING_MESSAGES) for (const lang of ['en','es'] as const) {
      expect(m.subject[lang]).toBeTruthy(); expect(m.objective[lang]).toBeTruthy();
      expect(openingReplyAccepted(m.id, m.starter[lang])).toBe(true);
    }
    expect(SHIFT_TIMES[19]).toBe('10:00 AM');
    expect(OPENING_MESSAGES[1].body.en).toContain('10 AM');
  });
  it.each(['Hi!', 'Hola', 'Thank you', 'Gracias'])('accepts a brief welcome: %s', text => {
    expect(openingReplyAccepted('welcome',text)).toBe(true);
  });
  it.each(['Yes', 'OK', "I'll be there", 'See you tomorrow!', 'Sí', 'Allí estaré', 'Nos vemos mañana', 'Confirmado'])('accepts confirmation: %s', text => {
    expect(openingReplyAccepted('start-time',text)).toBe(true);
  });
  it.each(['No', "I won't be there", 'No puedo ir', 'Where is it?', 'Coffee'])('rejects missing or negative confirmation: %s', text => {
    expect(openingReplyAccepted('start-time',text)).toBe(false);
  });
  it.each(['Under the counter.', 'On the shelf beneath the counter', 'I will put it under the counter', 'Debajo del mostrador', 'En el estante bajo la barra', 'La dejare debajo del mostrador'])('accepts a short location: %s', text => {
    expect(openingReplyAccepted('cups',text)).toBe(true);
  });
  it.each(['In the storage room', 'On the counter', 'En el almacén', 'No están debajo del mostrador', "I won't put it under the counter", 'I cannot leave it under the counter', ''])('rejects the wrong location: %s', text => {
    expect(openingReplyAccepted('cups',text)).toBe(false);
  });
  it('reads as the night before the first shift, asking nothing a new hire could not know', () => {
    // Every message lands the evening before Day One, so none of them may
    // depend on having already worked a shift.
    for (const m of OPENING_MESSAGES) expect(m.time).toMatch(/PM$/);
    expect(OPENING_MESSAGES[0].body.en).toContain('tomorrow');
    // Darnell states where the bag goes; the learner confirms it back rather
    // than supplying a cafe fact they have had no chance to learn.
    const bag = OPENING_MESSAGES[2];
    expect(bag.body.en).toContain('under the counter');
    expect(bag.body.es).toContain('debajo del mostrador');
    expect(bag.body.en).not.toMatch(/where do we keep/i);
  });
  it('fades to an objective and restores step instructions on request', () => {
    expect(openingInstruction(0,'read',false,false).en).toBe('Click Reply.');
    expect(openingInstruction(2,'read',false,false)).toEqual(OPENING_MESSAGES[2].objective);
    expect(openingInstruction(2,'read',false,true).en).toBe('Click Reply.');
  });
  it('keeps one scored opening task and moves the attachment after the schedule', () => {
    expect(taskKeysForLevel(LEVELS[1])).toEqual(['mail-reply']);
    expect(taskKeysForLevel(LEVELS[2])).toEqual(['schedule','mail-attach']);
    expect(nextHandoff(['tour','mail-reply'])?.taskKey).toBe('schedule');
    expect(nextHandoff(['tour','mail-reply','mail-attach'])?.taskKey).toBe('schedule');
    expect(nextHandoff(['tour','mail-reply','schedule'])?.taskKey).toBe('mail-attach');
  });
});

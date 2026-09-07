import { describe, expect, it } from 'vitest';
import {
  emailsForTask,
  isComposeOnly,
  mailEtiquetteAnswersDarnell,
  SUBJECT_BY_TASK,
} from '../tasks/mail/content';
import { CAST } from '../cast';
import { inboxSortKey } from '../story-calendar';

describe("coworker reply: Darnell's question is in the inbox", () => {
  it('is a reply, not a fresh compose', () => {
    expect(isComposeOnly('mail-etiquette')).toBe(false);
  });

  it("puts Darnell's Day One apron question in the inbox as the only target", () => {
    const inbox = emailsForTask('mail-etiquette');
    const targets = inbox.filter((m) => m.isTarget);
    expect(targets).toHaveLength(1);
    expect(targets[0].from).toBe(CAST.darnell.name);
    expect(targets[0].subject.en).toBe('Extra aprons?');
    expect(targets[0].subject.es).toBe('¿Delantales de más?');
    expect(SUBJECT_BY_TASK['mail-etiquette'].en.reSubject).toBe('Re: Extra aprons?');
    expect(SUBJECT_BY_TASK['mail-etiquette'].es.reSubject).toBe('Re: ¿Delantales de más?');
  });

  it('sorts Darnell above the same-day clutter, not as Tuesday leftover mail', () => {
    const inbox = emailsForTask('mail-etiquette');
    const target = inbox.find((m) => m.isTarget);
    expect(target).toBeDefined();
    const today = 22;
    for (const row of inbox.filter((m) => !m.isTarget)) {
      expect(inboxSortKey(target!, today)).toBeGreaterThan(inboxSortKey(row, today));
    }
  });
});

describe('coworker reply: a storage location rather than padding', () => {
  it.each([
    'In the storage room.',
    'They are in storage.',
    'Check the storeroom.',
    'In the store room.',
    'In the back room.',
    'In the supply room.',
    'En el almacén.',
    'Están en la bodega.',
    'En el almacen.',
    'In the storage\nroom.',
  ])('accepts a concise location: %s', (text) => {
    expect(mailEtiquetteAnswersDarnell(text)).toBe(true);
  });
  it.each([
    '',
    'Thank you, I will check that for you.',
    'Gracias, voy a revisar eso para ti.',
    'I placed a supply order this morning.',
    'I can supply the aprons tomorrow morning.',
    'We are supplying fresh aprons next week.',
    'Dejé los delantales en la cocina hoy.',
    'I left the aprons in the kitchen.',
  ])('rejects unrelated text and location substrings: %s', (text) => {
    expect(mailEtiquetteAnswersDarnell(text)).toBe(false);
  });
});

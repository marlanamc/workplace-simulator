import { describe, expect, it } from 'vitest';
import { callOutSickSaysCannotAttend } from '../tasks/mail/content';

describe('absence messages: meaning without a word quota', () => {
  it.each([
    "I can't work today.",
    'I can’t work today.',
    'I cannot come today.',
    'I am unable to work today.',
    'I’m sick and can’t come in today.',
    'No puedo trabajar hoy.',
    'Hoy no puedo asistir.',
    'No podré ir hoy.',
    'No voy a poder trabajar mi turno.',
    'I cannot\nwork today.',
  ])('accepts a clear absence: %s', (text) => {
    expect(callOutSickSaysCannotAttend(text)).toBe(true);
  });
  it.each([
    '',
    'I feel sick today.',
    'Estoy enferma hoy.',
    'I can work today.',
    'Puedo trabajar hoy.',
    'I cannot find my schedule today.',
    'No puedo encontrar el horario de hoy.',
    'I cannot come.',
  ])('still requires an absence and shift context: %s', (text) => {
    expect(callOutSickSaysCannotAttend(text)).toBe(false);
  });
});

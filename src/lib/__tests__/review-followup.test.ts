import { describe, expect, it } from 'vitest';
import { CORRECT_WEEK_TOTAL } from '../tasks/crew-week';
import { emailMentionsFix } from '../tasks/formula-check/content';
import { emailFlagsOver } from '../tasks/budget-sheet/content';

describe('remaining review concerns: report objective facts', () => {
 it.each([
  `Casey was missing. The total is ${CORRECT_WEEK_TOTAL}.`,
  `La suma omitía la última fila. Total: ${CORRECT_WEEK_TOTAL}.`,
  `Ahora el rango incluye a todos. Total: ${CORRECT_WEEK_TOTAL}.`,
 ])('accepts the corrected total and explanation: %s', (body) => expect(emailMentionsFix(body)).toBe(true));
 it.each([
  'I fixed the range.', 'Ya corregí el rango.',
  `The total is ${CORRECT_WEEK_TOTAL}.`,
  `Casey was missing; the total is 1${CORRECT_WEEK_TOTAL}.`,
 ])('rejects missing explanation or wrong total: %s', (body) => expect(emailMentionsFix(body)).toBe(false));
 it.each(['Labor is $450 over budget.', 'La nómina excedió el presupuesto por 450.', 'Mano de obra: diferencia de 450,00.'])('accepts the category and difference: %s', (body) => expect(emailFlagsOver(body)).toBe(true));
 it.each(['Labor is over.', 'La nómina se pasó.', 'Labor was 1450 over.', 'Labor actual: 2850.', 'Supplies were 450 over.'])('rejects a missing or wrong budget fact: %s', (body) => expect(emailFlagsOver(body)).toBe(false));
});

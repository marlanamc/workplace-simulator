import { describe, expect, it } from 'vitest';
import { parseRange, rangeCoversCrew, sumProblem } from '../tasks/formula-check/content';

describe('bounded formula input', () => {
  it.each(['=SUM(H2:H999999999)', '=SUMA(H999999999:H2)', '=AVERAGE(H2:H99999999999999999999)', '=SUM(H0:H6)', '=H2+H3+H4+H5+H6+H6'])('rejects %s without expanding unbounded ranges or removing duplicate terms', formula => {
    expect(parseRange(formula)).toBeNull();
    expect(rangeCoversCrew(formula, 'sum')).toBe(false);
  });
  it('keeps ordinary complete formulas and useful adjacent-row diagnostics', () => {
    expect(rangeCoversCrew('=H6+H2+H3+H4+H5', 'sum')).toBe(true);
    expect(rangeCoversCrew('=SUMA(H6:H2)', 'sum')).toBe(true);
    expect(sumProblem('=SUM(H2:H7)')).toBe('too-far');
    expect(sumProblem('=SUM(H2:H5)')).toBe('missing-last');
  });
});

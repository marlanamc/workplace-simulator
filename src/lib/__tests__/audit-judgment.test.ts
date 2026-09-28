import { describe, expect, it } from 'vitest';
import { EXPENSE_ROWS, PLANTED_TOTAL, RECEIPT_FILES, expenseReceiptMatches, expenseTotalIsCorrect } from '../tasks/expense-report/content';
import { TRIAGE_SLOTS, triageSlotWorks } from '../tasks/triage/content';

describe('audit judgment tasks', () => {
  it('matches receipts to their own expense rather than accepting any selected file', () => {
    for (const row of EXPENSE_ROWS) {
      for (const receipt of EXPENSE_ROWS.filter(r => r.receipt)) {
        expect(expenseReceiptMatches(row.key, receipt.receipt!)).toBe(row.receipt === receipt.receipt);
      }
    }
    expect(expenseReceiptMatches('unknown', 'receipt-0912-a.pdf')).toBe(false);
    expect(expenseReceiptMatches('dinner', 'receipt-0912-a.pdf')).toBe(false);
  });
  it('makes matching need the receipt itself: neutral file names, two same-day travel receipts', () => {
    for (const file of RECEIPT_FILES) {
      expect(file.name.toLowerCase()).not.toContain(file.merchant.en.toLowerCase().split(' ')[0]);
    }
    const sameDay = RECEIPT_FILES.filter((f) => f.date === 'Sep 12');
    expect(sameDay).toHaveLength(2);
    expect(new Set(sameDay.map((f) => f.amount)).size).toBe(2);
    expect(RECEIPT_FILES.map((f) => f.key)).not.toEqual(EXPENSE_ROWS.filter((r) => r.receipt).map((r) => r.key));
  });
  it('requires the receipted total and rejects the full total and embedded digits', () => {
    expect(EXPENSE_ROWS.filter(r => r.receipt).reduce((sum, r) => sum + r.amount, 0)).toBe(PLANTED_TOTAL);
    for (const total of ['188', '$188.00', '188,00']) expect(expenseTotalIsCorrect(total)).toBe(true);
    for (const total of ['', '283', '1880', '188 dollars', '188.01']) expect(expenseTotalIsCorrect(total)).toBe(false);
  });
  it('requires a time when both calendars are free', () => {
    expect(TRIAGE_SLOTS).toHaveLength(3);
    expect(triageSlotWorks('fri10')).toBe(true);
    for (const slot of ['', 'thu16', 'fri14', 'other']) expect(triageSlotWorks(slot)).toBe(false);
  });
});

import { SHARED_SCHEDULE_URL, includesScheduleUrl } from '../schedule-link';
import { weeklyTotalMatches } from '../tasks/ops-report-packet/content';
it('requires the actual shared schedule URL, not the word link or an unrelated URL', () => {
  expect(includesScheduleUrl(`Here is the schedule: ${SHARED_SCHEDULE_URL}.`)).toBe(true);
  for (const body of ['Here is the link', 'https://example.com', `${SHARED_SCHEDULE_URL}/wrong`]) expect(includesScheduleUrl(body)).toBe(false);
});
it('checks the weekly report amount', () => {
  for (const value of ['4820', '4,820', '$4,820.00']) expect(weeklyTotalMatches(value)).toBe(true);
  for (const value of ['', '482', '4820abc', '4821']) expect(weeklyTotalMatches(value)).toBe(false);
});


import { statusFor, statusFormula } from '../tasks/budget-sheet/content';
it('does not call spending below budget when it exactly matches the limit', () => {
  expect(statusFor(300, 300)).toBe('within');
  expect(statusFor(299, 300)).toBe('within');
  expect(statusFor(301, 300)).toBe('over');
  expect(statusFormula(6, 'en')).toContain('within budget');
  expect(statusFormula(6, 'es')).toContain('dentro del presupuesto');
});


import { PDF_DOCUMENTS } from '../pdf-content';
import { NET_PAY_CHECK, PAY_STUBS } from '../tasks/paystub/content';
it('keeps the sample pay stub, net-pay choices and deductions consistent', () => {
  const stub = PDF_DOCUMENTS.find(doc => doc.id === 'paystub-first');
  if (stub?.kind !== 'paystub') throw new Error('Missing first pay stub');
  const amount = (text: string) => Number(text.replace(/[^\d.-]/g, ''));
  const gross = amount(stub.grossPay);
  expect(amount(stub.deductions.find(row => row.label === 'Social Security / Medicare')!.amount)).toBeCloseTo(-gross * 0.0765, 2);
  expect(gross + stub.deductions.reduce((sum, row) => sum + amount(row.amount), 0)).toBeCloseTo(amount(stub.netPay), 2);
  expect(PAY_STUBS[0].net).toBe(stub.netPay);
  for (const lang of ['en', 'es'] as const) {
    expect(NET_PAY_CHECK[lang].options.find(option => option.isTarget)?.label).toBe(stub.netPay);
  }
});

import { CREW } from '../tasks/crew-week';
import { SLOTS, crewWorkingAt, shiftHours, slotIsFree } from '../tasks/team-meeting/content';
describe('team-meeting huddle time is checked against the crew sheet', () => {
  it('reads crew-sheet cells as 24-hour shifts', () => {
    expect(shiftHours('8–4')).toEqual({ start: 8, end: 16 });
    expect(shiftHours('12–4')).toEqual({ start: 12, end: 16 });
    expect(shiftHours('2–10')).toEqual({ start: 14, end: 22 });
    expect(shiftHours('')).toBeNull();
    expect(shiftHours('Off')).toBeNull();
  });
  it('has exactly one free slot, and it is the one marked right', () => {
    expect(SLOTS.filter((s) => slotIsFree(s.key)).map((s) => s.key)).toEqual(['thu']);
    for (const slot of SLOTS) expect(slotIsFree(slot.key)).toBe(slot.ok);
    expect(slotIsFree('nope')).toBe(false);
  });
  it('names in each wrong-slot hint exactly the crew on shift then, in both languages', () => {
    const first = CREW.map((p) => p.name.split(' ')[0]);
    for (const slot of SLOTS.filter((s) => !s.ok)) {
      const working = crewWorkingAt(slot.day, slot.hour).sort();
      expect(working.length).toBeGreaterThan(0);
      for (const lang of ['en', 'es'] as const) {
        const named = first.filter((n) => slot.hint[lang].includes(n)).sort();
        expect(named).toEqual(working);
      }
    }
  });
});

import { COVER, COVER_SHIFT_HOURS, HINTS as PRIORITY_HINTS_ALL, MEETING_SLOTS, PRIORITY_COPY, PRIORITY_REFERENCE, coverWorks, meetingSlotWorks } from '../tasks/priority-call/content';
import { hoursFor } from '../tasks/crew-week';
describe('priority-call choices depend on facts the learner can see', () => {
  it('has exactly one cover who is free Thursday evening and stays at 40 hours', () => {
    expect(COVER.filter((p) => coverWorks(p.key)).map((p) => p.key)).toEqual(['jordan']);
    for (const p of COVER) {
      const fits = p.freeThursday && p.hours + COVER_SHIFT_HOURS <= 40;
      expect(coverWorks(p.key)).toBe(fits);
      expect(p.thursday.en).toBeTruthy();
      expect(p.thursday.es).toBeTruthy();
      if (!fits) { expect(p.hint.en).toBeTruthy(); expect(p.hint.es).toBeTruthy(); }
    }
    expect(COVER.find((p) => p.key === 'casey')!.thursday.en).toMatch(/requested off/i);
    expect(coverWorks('nobody')).toBe(false);
  });
  it("keeps Jordan's hours from the Saturday close picked earlier", () => {
    const jordan = CREW.find((p) => p.key === 'jordan')!;
    expect(COVER.find((p) => p.key === 'jordan')!.hours).toBe(hoursFor(jordan, true));
  });
  it('offers three new meeting times, and only the one outside your shifts works', () => {
    expect(MEETING_SLOTS).toHaveLength(3);
    expect(MEETING_SLOTS.filter((s) => meetingSlotWorks(s.key)).map((s) => s.key)).toEqual(['sat10']);
    for (const lang of ['en', 'es'] as const) {
      // The Yes/No corrections point at the shifts; they do not name the answer.
      for (const hint of [PRIORITY_HINTS_ALL[lang].accept, PRIORITY_HINTS_ALL[lang].no]) expect(hint).not.toMatch(/Sat|Sáb|sábado/i);
    }
  });
  it('asks the priority question in plain words and does not state the answer', () => {
    expect(PRIORITY_COPY.en.urgencyQ).toBe('Which do you do first? Why?');
    expect(PRIORITY_REFERENCE.en).toContain('Dana is waiting now');
    expect(PRIORITY_REFERENCE.en).not.toMatch(/supported|immediate consequence/i);
  });
});

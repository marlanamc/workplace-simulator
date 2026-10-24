import { describe, expect, it } from 'vitest';
import { preparePendingSave, type PendingSave } from '../pending-save';
const request: PendingSave = { taskKey: 'portfolio-reflection', submission: { lang: 'en', fields: [{ label: 'Reflection', value: 'I learned to write clearly.' }] } };
describe('writing attempt identity', () => {
  it('keeps an ID when completion fails and the serialized queue is retried', () => {
    const pending = preparePendingSave([], request);
    const restored = JSON.parse(JSON.stringify([pending]));
    expect(preparePendingSave(restored, request).submissionAttemptId).toBe(pending.submissionAttemptId);
  });
  it('assigns a fresh ID to an intentional identical revision after success', () => {
    const first = preparePendingSave([], request);
    expect(preparePendingSave([], request).submissionAttemptId).not.toBe(first.submissionAttemptId);
  });
  it('gives changed writing and legacy pending records new IDs', () => {
    const pending = preparePendingSave([], request);
    expect(preparePendingSave([pending], { ...request, submission: { lang: 'es', fields: [] } }).submissionAttemptId).not.toBe(pending.submissionAttemptId);
    expect(preparePendingSave([request], request).submissionAttemptId).toMatch(/^[0-9a-f-]{36}$/);
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ session: vi.fn(), submissions: vi.fn(), save: vi.fn(), setting: vi.fn() }));
vi.mock('@/lib/auth', () => ({ getSessionLearnerId: mocks.session }));
vi.mock('@/lib/db/queries', () => ({ getLearnerSubmissions: mocks.submissions, recordSubmission: mocks.save, replaceSettingBadge: mocks.setting }));
vi.mock('next/navigation', () => ({redirect: vi.fn()}));
import { getMyWriting, recordWritingSubmission, persistCourseRoute } from '@/app/actions';

beforeEach(() => { vi.clearAllMocks(); mocks.session.mockResolvedValue('signed-in-learner'); });
describe('session-owned saved work', () => {
 it('loads only the signed-in learner and returns the newest submission per task', async () => {
  const newest = {lang:'en',fields:[{label:'Example',value:'New example'}]};
  mocks.submissions.mockResolvedValue([{taskKey:'job-posting',content:newest},{taskKey:'job-posting',content:{fields:[]}}]);
  expect(await getMyWriting()).toEqual({'job-posting':newest});
  expect(mocks.submissions).toHaveBeenCalledWith('signed-in-learner');
 });
 it('does not query another learner or silently return empty work when signed out', async () => {
  mocks.session.mockResolvedValue(null);
  await expect(getMyWriting()).rejects.toThrow();
  expect(mocks.submissions).not.toHaveBeenCalled();
 });
 it('propagates persistence failures rather than reporting a successful save', async () => {
  mocks.save.mockRejectedValue(new Error('Offline'));
  await expect(recordWritingSubmission('portfolio-reflection',{lang:'en',fields:[]})).rejects.toThrow('Offline');
 });
 it('stores a route atomically in the session-owned record and rejects invalid values', async () => {
  expect(await persistCourseRoute('office')).toEqual({ok:true});
  expect(mocks.setting.mock.calls[0][0]).toBe('signed-in-learner');
  expect(mocks.setting.mock.calls[0][2]).toBe('course-route:office');
  // Runtime input is untrusted even though TypeScript callers use the union.
  expect(await persistCourseRoute('bogus' as 'office')).toEqual({ok:false});
  expect(mocks.setting).toHaveBeenCalledTimes(1);
 });
});

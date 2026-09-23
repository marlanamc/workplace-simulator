import { beforeEach, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({session:vi.fn(), read:vi.fn(), save:vi.fn(), completions:vi.fn(), complete:vi.fn(), badge:vi.fn()}));
vi.mock('@/lib/auth', () => ({getSessionLearnerId:mocks.session}));
vi.mock('@/lib/db/queries', () => ({getOpeningReplies:mocks.read,saveOpeningReply:mocks.save,getCompletions:mocks.completions,recordCompletion:mocks.complete,awardBadge:mocks.badge}));
vi.mock('next/navigation', () => ({redirect:vi.fn()}));
import { recordOpeningReply, completeTask } from '@/app/actions';
import { OPENING_MESSAGES, type OpeningReply } from '../tasks/mail/opening';
beforeEach(() => { vi.resetAllMocks(); mocks.session.mockResolvedValue('current-learner'); mocks.read.mockResolvedValue([]); mocks.completions.mockResolvedValue([]); });
const welcome: OpeningReply = {messageId:'welcome',response:'Hi!',lang:'en'};
it('saves only for the authenticated learner and accepts a retry', async () => {
  expect(await recordOpeningReply(welcome)).toEqual({ok:true});
  expect(mocks.save).toHaveBeenCalledWith('current-learner',welcome);
  mocks.read.mockResolvedValue([welcome]);
  expect(await recordOpeningReply(welcome)).toEqual({ok:true});
});
it('rejects unauthenticated writes and forged/out-of-order inputs', async () => {
  mocks.session.mockResolvedValue(null);
  expect(await recordOpeningReply(welcome)).toEqual({ok:false});
  mocks.session.mockResolvedValue('current-learner');
  expect(await recordOpeningReply({...welcome,messageId:'cups',response:'Under the counter'})).toEqual({ok:false});
  expect(await recordOpeningReply({...welcome,lang:'bad' as 'en'})).toEqual({ok:false});
  expect(mocks.save).not.toHaveBeenCalled();
});
it('propagates failures without reporting success', async () => {
  mocks.save.mockRejectedValue(new Error('Offline'));
  await expect(recordOpeningReply(welcome)).rejects.toThrow('Offline');
});
it('requires all replies before awarding new completion', async () => {
  expect(await completeTask('mail-reply')).toEqual({ok:false});
  expect(mocks.complete).not.toHaveBeenCalled();
  mocks.read.mockResolvedValue(OPENING_MESSAGES.map(m => ({messageId:m.id,response:m.starter.en,lang:'en'})));
  expect(await completeTask('mail-reply')).toEqual({ok:true});
  expect(mocks.complete).toHaveBeenCalledOnce();
});
it('preserves legacy completion without requiring or fabricating new replies', async () => {
  mocks.completions.mockResolvedValue([{taskKey:'mail-reply'}]);
  expect(await completeTask('mail-reply')).toEqual({ok:true});
  expect(mocks.read).not.toHaveBeenCalled(); expect(mocks.complete).not.toHaveBeenCalled();
});

import { describe, expect, it } from 'vitest';
import { RECIPIENT_OPTIONS, recipientIsAuthorized, describeSubmission as intakeSubmission } from '../tasks/patient-intake/content';
import { PRIORITY_OPTIONS, priorityIsSupported, describeSubmission as prioritySubmission } from '../tasks/priority-call/content';
import { REVIEW_EVIDENCE, restoreReviewDraft, performanceReviewPasses, describeSubmission as reviewSubmission } from '../tasks/performance-review/content';
import { formatPortfolioSummary } from '../portfolio-summary';
import { TRACKS, TASK_INFO } from '../tracks-content';

describe('decisions grounded in the scenario', () => {
 it.each(RECIPIENT_OPTIONS)('grades recipient $key', (option) => {
  expect(recipientIsAuthorized(option.key)).toBe(option.key === 'nurse');
  expect(option.label.en).toBeTruthy(); expect(option.label.es).toBeTruthy();
 });
 it('does not accept absent or invented authorization', () => {
  expect(recipientIsAuthorized('')).toBe(false); expect(recipientIsAuthorized('claims-care-team')).toBe(false);
 });
 it.each(PRIORITY_OPTIONS)('grades the issue/reason pairing $key', (option) => {
  expect(priorityIsSupported(option.key)).toBe(['customer-wait','cover-start'].includes(option.key));
  expect(option.label.en).toBeTruthy(); expect(option.label.es).toBeTruthy();
 });
 it('does not treat an arbitrary sentence as a supported priority choice', () => expect(priorityIsSupported('the manager is very important')).toBe(false));
 it.each(['en','es'] as const)('saves the decisions alongside writing (%s)', (lang) => {
  expect(intakeSubmission('My reply',lang,'nurse').fields[1].value).toBe(RECIPIENT_OPTIONS[0].label[lang]);
  expect(prioritySubmission({urgency:'',reply:'My reply',priority:'cover-start'},lang).fields[2].value).toBe(PRIORITY_OPTIONS[1].label[lang]);
  expect(reviewSubmission({strength:'A thoughtful draft about training',area:'Arrive before the opening shift',evidence:'training'},lang).fields[2].value).toBe(REVIEW_EVIDENCE[0].label[lang]);
 });
 it('requires profile evidence while allowing different draft phrasing', () => {
  const drafts={strength:'Su paciencia ayuda a todos',area:'Llegar antes de la apertura'};
  expect(performanceReviewPasses(drafts)).toBe(false);
  expect(performanceReviewPasses({...drafts,evidence:'invented'})).toBe(false);
  for (const option of REVIEW_EVIDENCE) expect(performanceReviewPasses({...drafts,evidence:option.key})).toBe(true);
 });
 it('preserves older submission layouts when no decision was previously saved', () => {
  expect(intakeSubmission('Old reply','en').fields).toHaveLength(1);
  expect(prioritySubmission({urgency:'Old reason',reply:'Old reply'},'es').fields.map((field) => field.value)).toEqual(['Old reason','Old reply']);
  expect(reviewSubmission({strength:'Old strength',area:'Old area'},'en').fields.map((field) => field.value)).toEqual(['Old strength','Old area']);
 });
});

describe('one accurate text artifact for clipboard and download', () => {
 it.each(['en','es'] as const)('includes saved reflection text and only earned tasks (%s)', (lang) => {
  const track=TRACKS.find((track) => track.taskKeys.includes('mail-reply'))!;
  const text=formatPortfolioSummary({lang,certificateTrackKeys:[track.key],completedTaskKeys:['mail-reply'],answers:['Aprendí a compartir archivos.','Second answer','Third answer','Fourth answer']});
  expect(text).toContain('Aprendí a compartir archivos.');
  expect(text).toContain(TASK_INFO['mail-reply'].label[lang]);
  expect(text).not.toContain(TASK_INFO['mail-attach'].label[lang]);
  expect(text).not.toContain(TASK_INFO['priority-call'].label[lang]);
  expect(text).toContain(lang === 'en' ? 'not employment history' : 'no es historial de empleo');
  expect(text).toContain(lang === 'en' ? 'Act I' : 'Acto I');
 });
 it('does not fabricate awards without completed tasks', () => {
  const text=formatPortfolioSummary({lang:'en',certificateTrackKeys:TRACKS.map((track)=>track.key),completedTaskKeys:[],answers:[]});
  expect(text).not.toContain('Act I');
  expect(text).not.toContain(TASK_INFO['job-application'].label.en);
 });
});


describe('review writing compatibility', () => {
 it.each(['en','es'] as const)('restores older two-field writing without inventing evidence (%s)', (lang) => {
  expect(restoreReviewDraft({lang,fields:[{label:'Old strength',value:'Original strength'},{label:'Old area',value:'Original area'}]})).toEqual({strength:'Original strength',area:'Original area',evidence:''});
 });
 it.each(['en','es'] as const)('restores the new evidence independently of current interface language (%s)', (lang) => {
  const input={strength:'A real draft',area:'Another real draft',evidence:'delivery'};
  expect(restoreReviewDraft(reviewSubmission(input,lang))).toEqual(input);
 });
});

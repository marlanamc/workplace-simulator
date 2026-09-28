/** A simulated Drive URL, never a live external document or learner secret. */
export const SHARED_SCHEDULE_URL = 'https://drive.harborsidecafe.com/files/weekly-schedule';
export function includesScheduleUrl(body: string): boolean {
  return body.split(/\s+/).some(word => word.replace(/[),.!?;]+$/, '') === SHARED_SCHEDULE_URL);
}

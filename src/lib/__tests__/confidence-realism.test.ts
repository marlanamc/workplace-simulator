import { describe, expect, it } from 'vitest';
import { practiceScenario } from '@/lib/tasks/confidence/classroom';
import { assessPractice } from '@/lib/tasks/confidence/content';

describe('practice feedback assesses an already-performed app action', () => {
  it('rejects wrong attachments in a sent snapshot and accepts a corrected follow-up', () => {
    const s=practiceScenario('mail-attach','try');
    expect(assessPractice('mail-attach','try',s,{recipient:s.recipient!,file:'blank'})).not.toBeNull();
    expect(assessPractice('mail-attach','try',s,{recipient:s.recipient!,file:'signed'})).toBeNull();
  });
  it('requires restricted sharing with the requested person, not extra recipients', () => {
    const s=practiceScenario('files','home');
    const correct={...s.expected,recipient:s.recipient!,recipients:s.recipient!,scope:'restricted'};
    expect(assessPractice('files','home',s,correct)).toBeNull();
    expect(assessPractice('files','home',s,{...correct,recipients:`${s.recipient},wrong@example.test`})).not.toBeNull();
    expect(assessPractice('files','home',s,{...correct,scope:'anyone'})).not.toBeNull();
    expect(assessPractice('files','home',s,{...correct,permission:'view'})).not.toBeNull();
  });
  it('checks the whole calendar duration and supported alternative classroom times', () => {
    const s=practiceScenario('calendar','classroom');
    expect(assessPractice('calendar','classroom',s,{...s.expected,recipient:s.recipient!,time:'14:00',end:'14:30'})).toBeNull();
    expect(assessPractice('calendar','classroom',s,{...s.expected,recipient:s.recipient!,end:'10:15'})).not.toBeNull();
    const h=practiceScenario('calendar','home');
    expect(assessPractice('calendar','home',h,{...h.expected,recipient:h.recipient!,end:'13:00'})).toBeNull();
  });
  it('does not invent a student-editable submission deadline', () => {
    const s=practiceScenario('coursework','try');
    expect(assessPractice('coursework','try',s,{file:'complete'})).toBeNull();
    expect(assessPractice('coursework','try',s,{file:'draft'})).not.toBeNull();
  });
  it('checks sheet rows and the sent email, not just an unchanged total', () => {
    const s=practiceScenario('spreadsheet','try');
    const v={B2:'12',B3:'8',recipient:s.recipient!,body:'The total is 20.'};
    expect(assessPractice('spreadsheet','try',s,v)).toBeNull();
    expect(assessPractice('spreadsheet','try',s,{...v,B2:'8',B3:'12'})).not.toBeNull();
    expect(assessPractice('spreadsheet','try',s,{...v,body:'The total is 999.'})).not.toBeNull();
  });
});

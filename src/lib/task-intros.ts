import type { EventIntroCopy, Lang } from "@/lib/task-types";
import type { TaskKey } from "@/lib/desktop-content";

import { EVENT_INTRO as accountRecovery } from "@/lib/tasks/account-recovery/content";
import { EVENT_INTRO as calendar } from "@/lib/tasks/calendar/content";
import { EVENT_INTRO as callOutSick } from "@/lib/tasks/call-out-sick/content";
import { EVENT_INTRO as files } from "@/lib/tasks/files/content";
import { EVENT_INTRO as formulaCheck } from "@/lib/tasks/formula-check/content";
import { EVENT_INTRO as handbook } from "@/lib/tasks/handbook/content";
import { EVENT_INTRO as incident } from "@/lib/tasks/incident/content";
import { EVENT_INTRO_BY_TASK as mailIntros } from "@/lib/tasks/mail/content";
import { EVENT_INTRO as makeACopy } from "@/lib/tasks/make-a-copy/content";
import { EVENT_INTRO as paystub } from "@/lib/tasks/paystub/content";
import { EVENT_INTRO as priorityCall } from "@/lib/tasks/priority-call/content";
import { EVENT_INTRO as schedule } from "@/lib/tasks/schedule/content";
import { EVENT_INTRO as shiftReview } from "@/lib/tasks/shift-review/content";
import { EVENT_INTRO as spreadsheet } from "@/lib/tasks/spreadsheet/content";
import { EVENT_INTRO as statusReport } from "@/lib/tasks/status-report/content";
import { EVENT_INTRO as swapRequest } from "@/lib/tasks/swap-request/content";
import { EVENT_INTRO as teamMeeting } from "@/lib/tasks/team-meeting/content";
import { EVENT_INTRO as teamSchedule } from "@/lib/tasks/team-schedule/content";
import { EVENT_INTRO as timeclock } from "@/lib/tasks/timeclock/content";
import { EVENT_INTRO as tour } from "@/lib/tasks/tour/content";
import { EVENT_INTRO as triage } from "@/lib/tasks/triage/content";

/**
 * Every task's story beat in one place, so the desktop briefing can set the
 * scene for whatever comes next without importing 20 content modules.
 *
 * These used to render inside the app as a full-screen card whose button said
 * "Open Calendar" while the learner was already sitting on Calendar. The copy
 * is unchanged; only where it is shown moved. The desktop is the one screen
 * where that button can honestly open something.
 *
 * NOTE: nothing imports this today — the Job Card's own INTRO_BEATS took over
 * the "set the scene" job. Kept because the per-task bilingual copy it
 * aggregates is still written and still accurate; delete it (and the
 * EVENT_INTRO exports it pulls) if per-task intros are settled as gone.
 */
export const TASK_INTRO: Record<TaskKey, Record<Lang, EventIntroCopy>> = {
  tour,
  // The retired bundled Day-One job. Kept so a historical completion still
  // resolves; it reuses the first granular job's beat.
  mail: mailIntros["mail-reply"],
  "mail-read": mailIntros["mail-reply"],
  "mail-reply": mailIntros["mail-reply"],
  "mail-attach": mailIntros["mail-attach"],
  schedule,
  "swap-request": swapRequest,
  "call-out-sick": callOutSick,
  timeclock,
  paystub,
  "shift-review": shiftReview,
  "account-recovery": accountRecovery,
  incident,
  handbook,
  calendar,
  files,
  spreadsheet,
  "make-a-copy": makeACopy,
  "status-report": statusReport,
  triage,
  "team-schedule": teamSchedule,
  "formula-check": formulaCheck,
  "team-meeting": teamMeeting,
  "priority-call": priorityCall,
};

/** The scene-setting body for a task, or null if it has none. */
export function introBody(taskKey: TaskKey, lang: Lang): string | null {
  return TASK_INTRO[taskKey]?.[lang]?.body ?? null;
}

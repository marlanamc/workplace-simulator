import type { TaskKey } from "./desktop-content";

/** The named skill shown on a task's own done-screen badge. */
export const SKILLS: Record<TaskKey, string> = {
  tour: "Find Help, your shift list, and Next",
  mail: "Reply with an attachment",
  "mail-read": "Find and read a message from a manager",
  "mail-reply": "Answer my boss in my own words",
  "mail-attach": "Send a reply with a file attached",
  schedule: "Find my shift on a schedule",
  "swap-request": "Ask for a shift swap in writing",
  "call-out-sick": "Tell my manager I can't come in",
  timeclock: "Check your hours and speak up",
  paystub: "Read a pay stub",
  "shift-review": "Handle a normal shift, start to finish",
  "account-recovery": "Get back into a locked account",
  incident: "Write an incident report",
  handbook: "Look something up when you feel rushed",
  calendar: "Handle a meeting invite the right way",
  files: "Share a file with the right access",
  spreadsheet: "Read and trust a spreadsheet total",
  "make-a-copy": "Copy a view-only file before you type",
  "status-report": "Write a SUM and cc a co-lead",
  triage: "Handle two requests at once",
  "team-schedule": "Build a crew schedule",
  "formula-check": "Fix a formula range",
  "team-meeting": "Create a meeting with an agenda",
  "priority-call": "Handle three asks at once",
};

/** SKILLS as a first-person statement ("Reply with an attachment" -> "I can reply with an attachment."), for the done screen and awards case. */
export function firstPersonSkill(taskKey: TaskKey): string {
  const skill = SKILLS[taskKey];
  return `I can ${skill.charAt(0).toLowerCase()}${skill.slice(1)}.`;
}

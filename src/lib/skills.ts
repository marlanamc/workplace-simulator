import type { TaskKey } from "./desktop-content";

/** The named skill shown on a task's own done-screen badge. */
export const SKILLS: Record<TaskKey, string> = {
  tour: "Find Help, your shift list, and Next",
  mail: "Reply with an attachment",
  schedule: "Request a schedule change",
  timeclock: "Check your hours and speak up",
  paystub: "Read a pay stub",
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

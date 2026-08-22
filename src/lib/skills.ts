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
};

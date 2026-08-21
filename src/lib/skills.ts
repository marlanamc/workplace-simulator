import type { TaskKey } from "./desktop-content";

/** The named skill shown on a task's own done-screen badge — same name on the certificate. */
export const SKILLS: Record<TaskKey, string> = {
  mail: "Reply with an attachment",
  schedule: "Request a schedule change",
  timeclock: "Check your hours and speak up",
  paystub: "Read a pay stub",
  incident: "Write an incident report",
  handbook: "Look something up under pressure",
};

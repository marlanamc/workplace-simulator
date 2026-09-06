import { describe, expect, it } from "vitest";
import type { Lang, SubmissionContent } from "@/lib/task-types";
import { TEACHER_CHECK_TASKS } from "@/lib/curriculum-catalog";

import { describeSubmission as performanceReview } from "@/lib/tasks/performance-review/content";
import { describeSubmission as meetingMinutes } from "@/lib/tasks/meeting-minutes/content";
import { describeSubmission as opsReportPacket } from "@/lib/tasks/ops-report-packet/content";
import { describeSubmission as portfolioReflection } from "@/lib/tasks/portfolio-reflection/content";
import { describeSubmission as slideDeck } from "@/lib/tasks/slide-deck/content";
import { describeSubmission as coursework } from "@/lib/tasks/coursework/content";
import { describeSubmission as research } from "@/lib/tasks/research/content";
import { describeSubmission as teamMeeting } from "@/lib/tasks/team-meeting/content";
import { describeSubmission as priorityCall } from "@/lib/tasks/priority-call/content";
import { describeSubmission as statusReport } from "@/lib/tasks/status-report/content";
import { describeSubmission as teamSchedule } from "@/lib/tasks/team-schedule/content";
import { describeSubmission as collegeOffer } from "@/lib/tasks/college-offer/content";
import { describeSubmission as enrollment } from "@/lib/tasks/enrollment/content";
import { describeSubmission as patientIntake } from "@/lib/tasks/patient-intake/content";
import { describeSubmission as confidentialityCall } from "@/lib/tasks/confidentiality-call/content";
import { describeSubmission as jobPosting } from "@/lib/tasks/job-posting/content";
import { describeSubmission as jobApplication } from "@/lib/tasks/job-application/content";
import { describeSubmission as resumeBuild } from "@/lib/tasks/resume-build/content";
import { describeSubmission as interviewPractice } from "@/lib/tasks/interview-practice/content";
import { describeSubmission as jobOffer } from "@/lib/tasks/job-offer/content";
import { describeSubmission as incident } from "@/lib/tasks/incident/content";

/**
 * Every task the app marks "You check" (`TEACHER_CHECK_TASKS`) must produce a
 * teacher-readable submission on a real passing answer. `mail-send-link`,
 * `reply-all`, `mail-etiquette`, and `call-out-sick` are captured inline in
 * MailClient (subject + body), so they are listed here as covered without a
 * standalone `describeSubmission`.
 */
const CAPTURED: Record<string, ((lang: Lang) => SubmissionContent) | "inline-in-mail"> = {
  "job-posting": (lang) =>
    jobPosting(["customer-facing", "scheduling", "tools", "budget"], "I ran shift schedules and a weekly budget as Assistant Manager.", lang),
  "job-application": (lang) =>
    jobApplication({ availability: "full", why: "I grew from new hire to assistant manager and I'm ready for an office role." }, lang),
  "resume-build": (lang) =>
    resumeBuild(
      {
        summary: "Assistant Manager with three years at Harborside Cafe, strong with schedules and budgets.",
        bullets: [
          "Ran the weekly crew schedule and filled coverage gaps.",
          "Checked the weekly budget and flagged overspending.",
        ],
        skills: ["scheduling", "budget", "training"],
      },
      lang,
    ),
  "interview-practice": (lang) =>
    interviewPractice(
      {
        answers: {
          "about-you": "I started at Harborside Cafe two years ago and worked up to assistant manager.",
          "why-role": "I like keeping a team organized and I already use these tools every day.",
          problem: "One Saturday the closing shift had nobody, so I found someone with spare hours and told my manager.",
          weakness: "Long emails still take me time, so I use templates and ask a coworker to check important ones.",
        },
        askBack: "What would a good first three months look like?",
      },
      lang,
    ),
  "job-offer": (lang) =>
    jobOffer(
      { dateKey: "oct-6", reply: "Thank you for the offer. I accept the Office Administrator role and I'll be there Monday, October 6." },
      lang,
    ),
  "performance-review": (lang) =>
    performanceReview({ strength: "Sam trained two new hires this month", area: "Be on time for the morning open every day" }, lang),
  "meeting-minutes": (lang) =>
    meetingMinutes({ agenda: "Saturday close\nSupply order\nNew hire", notes: "Jordan takes Saturday.\nAlex calls the supplier.", followup: "Saturday close: Jordan, this Saturday. Supplier: Alex, Monday." }, lang),
  "ops-report-packet": (lang) =>
    opsReportPacket({ summary: "Sales were 4820 dollars this week and the Monday open needs coverage.", message: "Weekly report attached, see the summary." }, lang),
  "portfolio-reflection": (lang) =>
    portfolioReflection(["I learned to send a link", "The review was hard", "I feel ready", "Next I want a job"], lang),
  "slide-deck": (lang) => slideDeck({ title: "Q3 travel spend", takeaway: "We came in under budget", coworkerAnswer: "We need the missing receipt" }, lang),
  coursework: (lang) => coursework("Thank you for telling me. I will look into this today and follow up.", lang),
  research: (lang) => research("database", "It is from the library database and names its authors.", lang),
  "team-meeting": (lang) => teamMeeting({ title: "Schedule huddle", agenda: "Coverage gap\nTime off requests" }, lang),
  "priority-call": (lang) =>
    priorityCall({ urgency: "The customer is still here, so I handle that first.", reply: "I'm sorry about the wait. I will look into it today." }, lang),
  "status-report": (lang) => statusReport({ formula: "=SUM(B2:B6)", body: "Here is the week of Aug 24 status. Total was 412." }, lang),
  "team-schedule": (lang) => teamSchedule("You're on Saturday close, 4 to 10.", lang),
  "college-offer": (lang) =>
    collegeOffer({ reply: "I accept the offer for the Business Essentials class.", overlap: "The Tuesday class overlaps my close shift." }, lang),
  enrollment: (lang) => enrollment("I want to enroll in the Business program at BHCC to move into an office role.", lang),
  "patient-intake": (lang) => patientIntake("I can't share that. Only the care team can see intake forms.", lang),
  "confidentiality-call": (lang) =>
    confidentialityCall("I can't confirm that. I can have Maya call you back.", lang),
  incident: (lang) => incident("Today, 2:15 PM", "Front entrance", "A customer slipped and no one was hurt. I cleaned up the spill and told my shift lead right away.", lang),
  "mail-send-link": "inline-in-mail",
  "reply-all": "inline-in-mail",
  "mail-etiquette": "inline-in-mail",
  "call-out-sick": "inline-in-mail",
};

describe("submission capture", () => {
  it("covers every teacher-check task", () => {
    for (const taskKey of TEACHER_CHECK_TASKS) {
      expect(CAPTURED[taskKey], `no capture wired for ${taskKey}`).toBeDefined();
    }
  });

  const langs: Lang[] = ["en", "es"];
  for (const [taskKey, build] of Object.entries(CAPTURED)) {
    if (build === "inline-in-mail") continue;
    for (const lang of langs) {
      it(`${taskKey} (${lang}) produces a readable submission`, () => {
        const out = build(lang);
        expect(out.lang).toBe(lang);
        expect(out.fields.length).toBeGreaterThan(0);
        for (const f of out.fields) {
          expect(f.label.trim().length).toBeGreaterThan(0);
          expect(f.value.trim().length).toBeGreaterThan(0);
        }
      });
    }
  }
});

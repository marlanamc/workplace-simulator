import type { TaskKey } from "@/lib/desktop-content";
import type { Lang } from "@/lib/task-types";

/**
 * Sentences a learner actually typed in the Story Mode Audit (27 Sep 2026),
 * with what the task *should* do with them. Today many of these are graded the
 * wrong way round; `curriculum/story-audit-tracker.md` says which fix owns each.
 *
 * Grading tests import this list rather than restating the sentences, so the
 * audit's evidence and the tests cannot drift apart. `field` names the box
 * when a task has more than one.
 */
export type AuditSentence = {
  task: TaskKey;
  /** The audit's day label, so a failure points back to the report. */
  day: string;
  lang: Lang;
  field?: string;
  text: string;
  expect: "accept" | "reject";
  why: string;
};

export const STORY_AUDIT_SENTENCES: AuditSentence[] = [
  // ── Rejected today, but correct ────────────────────────────────────────
  { task: "call-out-sick", day: "Day 5", lang: "en", text: "I am sick. I no come today.", expect: "accept", why: "Says sick and not coming, in beginner English." },
  { task: "call-out-sick", day: "Day 5", lang: "en", text: "i cant go to work today", expect: "accept", why: "Says not coming today." },
  { task: "incident", day: "Day 7", lang: "en", text: "he is ok, i mop the floor and say sorry", expect: "accept", why: "True facts: customer is fine, floor cleaned, apology given." },
  { task: "mail-send-link", day: "Day 10", lang: "en", text: "I did not attach it. It is shared in Drive.", expect: "accept", why: "Explains the file is shared, not attached." },
  { task: "team-meeting", day: "Day 16", lang: "en", field: "title", text: "team meeting next week", expect: "accept", why: "A plain, accurate meeting title." },
  { task: "team-meeting", day: "Day 16", lang: "en", field: "agenda", text: "talk about schedule and saturday", expect: "accept", why: "One honest agenda line about the schedule." },
  { task: "priority-call", day: "Day 17", lang: "en", text: "I will tell the barista about the milk", expect: "accept", why: "Promises no free drink; the correction wrongly says it does." },
  { task: "college-offer", day: "Day 18", lang: "en", text: "yes ok thank you", expect: "accept", why: "A clear yes." },
  { task: "enrollment", day: "Day 21 A", lang: "en", text: "I like to learn english and work in hospital", expect: "accept", why: "An honest reason for the application." },
  { task: "billing-sheet", day: "Day 23 B", lang: "en", text: "row 4 is wrong. It should be $85.", expect: "accept", why: "Names the row and the right charge." },
  { task: "confidentiality-call", day: "Day 24 B", lang: "en", text: "Sorry, I can not give information. Maya will call you.", expect: "accept", why: "Shares nothing and offers a callback." },
  { task: "confidentiality-call", day: "Day 24 B", lang: "en", text: "I can not give information", expect: "accept", why: "Shares nothing." },
  { task: "job-offer", day: "Day 28", lang: "en", text: "October 6th", expect: "accept", why: "The right start date, written with an ordinal." },
  { task: "job-offer", day: "Day 28", lang: "en", text: "6th of October", expect: "accept", why: "The right start date, day first." },
  { task: "job-offer", day: "Day 28", lang: "en", field: "reply", text: "ok i come monday", expect: "accept", why: "A clear acceptance with the day." },
  { task: "ops-report-packet", day: "Day 36", lang: "en", text: "Thursday morning open no person", expect: "accept", why: "Names the coverage gap without the phrase \"coverage gap\"." },
  { task: "portfolio-reflection", day: "Day 37", lang: "en", text: "email / computer / no scared / is good", expect: "accept", why: "The card says a few words each is fine." },

  // ── Accepted today, but wrong ──────────────────────────────────────────
  { task: "timeclock", day: "Day 3", lang: "en", text: "hi maria. clock is wrong", expect: "reject", why: "No times; Maria cannot fix the punch." },
  { task: "incident", day: "Day 7", lang: "en", text: "The customer was badly hurt. I did not clean anything and did not tell anyone.", expect: "reject", why: "Every fact is false." },
  { task: "college-offer", day: "Day 18", lang: "en", text: "I do not accept the class", expect: "reject", why: "A no, graded as accepting." },
  { task: "reply-all", day: "Day 20", lang: "en", text: "I am not sure", expect: "reject", why: "Not a yes or a no." },
  { task: "enrollment", day: "Day 21 A", lang: "en", text: "asdf college asdf asdf asdf", expect: "reject", why: "Nonsense around a keyword." },
  { task: "patient-intake", day: "Day 22 B", lang: "en", field: "form", text: "x / x / x", expect: "reject", why: "Nothing copied from the paper form." },
  { task: "patient-intake", day: "Day 22 B", lang: "en", field: "decline", text: "Sorry Tomas, she is here for her cough. I cant show the form.", expect: "reject", why: "Gives away the reason for the visit." },
  { task: "confidentiality-call", day: "Day 24 B", lang: "en", text: "Maya comes at 11:30 today. I cannot tell you more, but I will have Maya call you back.", expect: "reject", why: "Confirms the appointment time to an unverified caller." },
  { task: "interview-practice", day: "Day 27", lang: "en", text: "money money money money money money", expect: "reject", why: "Word count is not an answer." },
  { task: "multi-person-scheduling", day: "Day 31", lang: "en", field: "question", text: "hi", expect: "reject", why: "Not a question." },
  { task: "meeting-minutes", day: "Day 34", lang: "en", field: "followup", text: "", expect: "reject", why: "The follow-up email is the point of the task." },
  { task: "meeting-minutes", day: "Day 34", lang: "en", field: "notes", text: "ok / ok", expect: "reject", why: "No decisions or owners." },
  { task: "ops-report-packet", day: "Day 36", lang: "en", text: "Everything fine. 4820 thursday morning need", expect: "reject", why: "Says everything is fine while a shift is uncovered." },
];

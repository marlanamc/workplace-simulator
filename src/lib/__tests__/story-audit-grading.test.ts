import { describe, expect, it } from "vitest";
import { STORY_AUDIT_SENTENCES, type AuditSentence } from "./fixtures/story-audit-sentences";
import {
  acceptance,
  affirms,
  denies,
  isQuestion,
  looksLikeRealText,
  mentionsDate,
  mentionsTime,
  saysCannotAttend,
  yesNoAnswer,
} from "@/lib/grading/meaning";
import { SICK_CALL_CORRECTIONS, callOutSickSaysCannotAttend, replyAllAnswersDana, replyAllVerdict, sendsLinkNotFile, sickCallVerdict } from "@/lib/tasks/mail/content";
import { CLOCK_NOTE_CORRECTIONS, clockNoteVerdict } from "@/lib/tasks/timeclock/content";
import { INCIDENT_CORRECTIONS, incidentNarrativeIsComplete, incidentVerdict } from "@/lib/tasks/incident/content";
import { agendaIsReady, titleIsAboutSchedule } from "@/lib/tasks/team-meeting/content";
import { customerReplyVerdict, replyIsSafe, HINTS as PRIORITY_HINTS } from "@/lib/tasks/priority-call/content";
import { offerReplyVerdict, replyAcceptsOffer } from "@/lib/tasks/college-offer/content";
import { DEADLINE, DEADLINE_CHOICES, deadlinePickIsRight, statementShowsInterest } from "@/lib/tasks/enrollment/content";
import { intakeFormVerdict } from "@/lib/tasks/patient-intake/content";
import { MISMATCH_ROW, billingEmailVerdict, emailFlagsMismatch } from "@/lib/tasks/billing-sheet/content";
import { answerLooksReal, firstWeakAnswer, QUESTIONS } from "@/lib/tasks/interview-practice/content";
import { namesStartDate, offerAcceptVerdict, replyLooksReal } from "@/lib/tasks/job-offer/content";
import { chatAsksQuestion } from "@/lib/tasks/video-call/content";
import { commitmentCorrection, followupHasOwnersAndDates, followupVerdict, notesLookReal } from "@/lib/tasks/meeting-minutes/content";
import { opsReportPacketPasses, packetMessageIsReady, summaryNamesGap, summaryVerdict } from "@/lib/tasks/ops-report-packet/content";
import { firstUnanswered, reflectionComplete } from "@/lib/tasks/portfolio-reflection/content";
import { AREA_CORRECTIONS, areaVerdict, performanceReviewPasses } from "@/lib/tasks/performance-review/content";

/**
 * Story Mode Audit #5. Every learner sentence the audit quoted (plus Spanish
 * ones for each rewired check) runs through the real grading function for its
 * task and box. The two clinic privacy checks (patient-intake decline,
 * confidentiality-call) are covered by clinic-privacy.test.ts.
 *
 * Boxes with several parts are written "a / b / c" in the fixture.
 */
const parts = (text: string) => text.split(" / ");
const lines = (text: string) => parts(text).join("\n");

type Grader = (text: string) => boolean;

const GRADERS: Record<string, Grader> = {
  "call-out-sick": callOutSickSaysCannotAttend,
  timeclock: (t) => clockNoteVerdict(t) === "ok",
  incident: incidentNarrativeIsComplete,
  "mail-send-link": sendsLinkNotFile,
  "team-meeting/title": titleIsAboutSchedule,
  "team-meeting/agenda": (t) => agendaIsReady(lines(t)),
  "priority-call": replyIsSafe,
  "college-offer": replyAcceptsOffer,
  "reply-all": replyAllAnswersDana,
  enrollment: statementShowsInterest,
  "patient-intake/form": (t) => {
    const [name, dob, reason] = parts(t);
    return intakeFormVerdict({ name: name ?? "", dob: dob ?? "", reason: reason ?? "" }) === "ok";
  },
  "billing-sheet": emailFlagsMismatch,
  "interview-practice": answerLooksReal,
  // The date the audit typed, judged by the reply's date check.
  "job-offer": namesStartDate,
  "job-offer/reply": replyLooksReal,
  "video-call/question": chatAsksQuestion,
  "meeting-minutes/followup": followupHasOwnersAndDates,
  "meeting-minutes/notes": (t) => notesLookReal(lines(t)),
  // The gap half of the summary; the full summary is tested below with the total.
  "ops-report-packet": summaryNamesGap,
  "portfolio-reflection": (t) => reflectionComplete(parts(t)),
};

const covered = (s: AuditSentence) =>
  !(s.task === "confidentiality-call" || (s.task === "patient-intake" && s.field === "decline"));
const graderFor = (s: AuditSentence) => GRADERS[s.field ? `${s.task}/${s.field}` : s.task];
const sentences = STORY_AUDIT_SENTENCES.filter(covered);

describe("every audit sentence is graded the way the audit says", () => {
  it("has a grader for every sentence", () => {
    const missing = sentences.filter((s) => !graderFor(s)).map((s) => `${s.task}/${s.field ?? ""}`);
    expect(missing).toEqual([]);
  });

  it.each(sentences.map((s) => [s.day, s.task, s.field ?? "", s.lang, s.expect, s.text, s] as const))(
    "%s %s %s (%s): %s %j",
    (_day, _task, _field, _lang, expected, text, s) => {
      expect(graderFor(s)(text), s.why).toBe(expected === "accept");
    },
  );

  it("has a Spanish accept and reject for every rewired check", () => {
    const keys = new Set(sentences.map((s) => (s.field ? `${s.task}/${s.field}` : s.task)));
    for (const key of keys) {
      const es = sentences.filter((s) => s.lang === "es" && (s.field ? `${s.task}/${s.field}` : s.task) === key);
      if (key === "meeting-minutes/notes" || key === "patient-intake/form" || key === "job-offer") continue;
      expect(new Set(es.map((s) => s.expect)), key).toEqual(new Set(["accept", "reject"]));
    }
  });
});

describe("the shared reader: negation, beginner forms, dates, junk", () => {
  it.each([
    "I no come today",
    "i cant go to work today",
    "I can not work today",
    "I won't be there today",
    "I dont come today",
    "Hoy no puedo ir",
    "No voy a trabajar hoy",
    "I need to stay home today",
  ])("says cannot attend: %j", (t) => expect(saysCannotAttend(t)).toBe(true));

  it.each(["I can come today", "I cannot find my schedule", "I am sick", "Estoy enferma"])("does not: %j", (t) =>
    expect(saysCannotAttend(t)).toBe(false),
  );

  it("reads a word as negated only in its own clause", () => {
    expect(denies("I did not clean anything", /clean/)).toBe(true);
    expect(affirms("I did not slip, but I cleaned the floor", /clean/)).toBe(true);
    expect(affirms("No, he is fine", /fine/)).toBe(true);
    expect(affirms("Nobody was hurt", /hurt/)).toBe(false);
  });

  it.each([
    ["Yes, we can.", "yes"],
    ["No podemos a las 6.", "no"],
    ["Sorry, no.", "no"],
    ["I am not sure", "unsure"],
    ["I don't know about the delivery", "unsure"],
    ["Thanks!", "none"],
  ] as const)("yes/no/unsure: %j → %s", (t, answer) => expect(yesNoAnswer(t)).toBe(answer));

  it.each([
    ["yes ok thank you", "accepts"],
    ["I accept the class", "accepts"],
    ["Acepto", "accepts"],
    ["I do not accept the class", "declines"],
    ["No, thank you", "declines"],
    ["No problem, I accept", "accepts"],
    ["I will think about it", "unsure"],
  ] as const)("accept or decline: %j → %s", (t, answer) => expect(acceptance(t)).toBe(answer));

  it.each(["October 6th", "6th of October", "Oct 6", "Oct. 6", "october the 6th", "10/6", "10/06/2026", "6 de octubre", "el seis de octubre", "October sixth"])(
    "names October 6: %j",
    (t) => expect(mentionsDate(t, { month: 10, day: 6 })).toBe(true),
  );

  it.each(["October 9", "September 6", "16 October", "10/16"])("does not name October 6: %j", (t) =>
    expect(mentionsDate(t, { month: 10, day: 6 })).toBe(false),
  );

  it.each(["7", "7:00", "7am", "7 a.m.", "at seven", "a las 7", "a las siete", "07:00"])("names 7:00: %j", (t) =>
    expect(mentionsTime(`I got here ${t}`, 7)).toBe(true),
  );

  it.each(["7:30", "8:15", "17:00", "7 minutes late", "$7"])("does not name 7:00: %j", (t) =>
    expect(mentionsTime(`It was ${t}`, 7)).toBe(false),
  );

  it.each(["money money money money money money", "I am good I am good", "asdf college asdf asdf asdf", "jjjj kkkk", "x"])(
    "junk is not real text: %j",
    (t) => expect(looksLikeRealText(t, 1)).toBe(false),
  );

  it.each(["email", "no scared", "is good", "BHCC", "Total 4820", "yo"])("short honest text is: %j", (t) =>
    expect(looksLikeRealText(t, 1)).toBe(true),
  );

  it.each(["When is the report due?", "can i get the slides", "I have a question about Friday", "¿Puedo hablar?"])(
    "a question: %j",
    (t) => expect(isQuestion(t)).toBe(true),
  );
  it.each(["hi", "hi?", "ok", "hello everyone"])("not a question: %j", (t) => expect(isQuestion(t)).toBe(false));
});

describe("each correction names what is missing", () => {
  it("Day 5 never tells a learner who said they can't come that they only said sick", () => {
    expect(sickCallVerdict("I am sick. I no come today.")).toBe("ok");
    expect(sickCallVerdict("I feel sick today.")).toBe("no-absence");
    expect(sickCallVerdict("I cannot come.")).toBe("no-day");
    expect(SICK_CALL_CORRECTIONS["no-absence"].en).not.toMatch(/not just/);
  });

  it("Day 3 asks for the arrival time", () => {
    expect(clockNoteVerdict("hi maria. clock is wrong")).toBe("no-time");
    expect(clockNoteVerdict("I got here at 7:00 AM, but I clocked in at 8:15 AM.")).toBe("ok");
    expect(CLOCK_NOTE_CORRECTIONS["no-time"].en).toMatch(/7:00/);
  });

  it.each([
    ["The customer was badly hurt. I did not clean anything and did not tell anyone.", "false-injury"],
    ["He is ok. I did not clean anything.", "false-action"],
    ["I mopped the floor and put out a sign.", "no-injury"],
    ["No one was hurt.", "no-action"],
    ["A customer slipped near the front door. No one was injured. I cleaned up the spill and put out a wet floor sign.", "ok"],
    ["Nadie se lastimó. Limpié el derrame y puse un letrero.", "ok"],
  ] as const)("Day 7 incident %j → %s", (t, v) => {
    expect(incidentVerdict(t)).toBe(v);
    if (v !== "ok") expect(INCIDENT_CORRECTIONS[v].es).toBeTruthy();
  });

  it("Day 17 tells a reply that promises nothing free to acknowledge, not to stop over-promising", () => {
    expect(customerReplyVerdict("ok sorry")).toBe("ok");
    expect(customerReplyVerdict("I can't give you a refund, but I will check on it.")).toBe("ok");
    expect(customerReplyVerdict("Hi Dana.")).toBe("no-ack");
    expect(customerReplyVerdict("Sorry! Have a free drink on us.")).toBe("overpromise");
    expect(PRIORITY_HINTS.en.ack).not.toMatch(/free/);
  });

  it("Day 18 and Day 28 tell a no, a maybe, and a missing date apart", () => {
    expect(offerReplyVerdict("I do not accept the class")).toBe("declines");
    expect(offerReplyVerdict("maybe")).toBe("unsure");
    expect(offerAcceptVerdict("I accept. See you October 6th.")).toBe("ok");
    expect(offerAcceptVerdict("I will start on the 6th of October, I accept")).toBe("ok");
    expect(offerAcceptVerdict("I accepted! see you october 6")).toBe("ok");
    expect(offerAcceptVerdict("ok i come tuesday")).toBe("ok");
    expect(offerAcceptVerdict("I accept, thank you.")).toBe("no-date");
    expect(offerAcceptVerdict("I accept and will start October 9.")).toBe("wrong-date");
  });

  it("Day 20 asks a not-sure reply for a clear yes or no", () => {
    expect(replyAllVerdict("I am not sure")).toBe("unsure");
    expect(replyAllVerdict("ok")).toBe("short");
    expect(replyAllVerdict("Yes, we can.")).toBe("ok");
  });

  it("Day 21 A checks the deadline step against the page's date", () => {
    const right = DEADLINE_CHOICES.filter((c) => c.ok);
    expect(right).toHaveLength(1);
    expect(right[0].label).toEqual(DEADLINE);
    expect(DEADLINE_CHOICES.length).toBeGreaterThanOrEqual(2);
    expect(new Set(DEADLINE_CHOICES.map((c) => c.label.en)).size).toBe(DEADLINE_CHOICES.length);
    for (const c of DEADLINE_CHOICES) expect(deadlinePickIsRight(c.key)).toBe(c.ok);
    expect(deadlinePickIsRight("nonsense")).toBe(false);
  });

  it.each([
    [{ name: "x", dob: "x", reason: "x" }, "name"],
    [{ name: "Maya Ansari", dob: "12/03/1998", reason: "Follow-up" }, "dob"],
    [{ name: "Maya Ansari", dob: "March 12, 1998", reason: "cough" }, "reason"],
    [{ name: "maya  ansari", dob: "03-12-98", reason: "follow up" }, "ok"],
    [{ name: "", dob: "", reason: "" }, "missing"],
  ] as const)("Day 22 B intake form %j → %s", (fields, v) => expect(intakeFormVerdict(fields)).toBe(v));

  it("Day 23 B names the row or the charge, whichever is missing", () => {
    expect(MISMATCH_ROW).toBe(4);
    expect(billingEmailVerdict("row 4 is wrong. It should be $85.")).toBe("ok");
    expect(billingEmailVerdict("It should be $85.")).toBe("no-row");
    expect(billingEmailVerdict("Okonkwo is $185.")).toBe("no-charge");
  });

  it("Day 27 names which interview answer needs more", () => {
    const answers = Object.fromEntries(QUESTIONS.map((q) => [q.key, "I like working with people and learning new things."]));
    expect(firstWeakAnswer(answers)).toBe(-1);
    expect(firstWeakAnswer({ ...answers, [QUESTIONS[2].key]: "money money money money money money" })).toBe(2);
  });

  it("Day 34 fails an empty follow-up and names what is missing", () => {
    expect(followupVerdict("")).toBe("empty");
    expect(followupVerdict("Here are the final assignments from our huddle.")).toBe("no-owner");
    expect(followupVerdict("Jordan takes Saturday close. Alex calls the supplier.")).toBe("ok");
    expect(followupVerdict("Jordan does close and Alex calls the supplier.")).toBe("no-date");
    expect(commitmentCorrection({}, "en")).toBeNull();
    expect(commitmentCorrection({ close: { owner: "Jordan", day: "sat" }, supplier: { owner: "Alex", day: "mon" }, training: { owner: "Riley", day: "thu" } }, "en")).toMatch(/New hire training/);
  });

  it("Day 35 checks the growth line lightly and catches name-calling", () => {
    expect(areaVerdict("Sam is late some mornings.")).toBe("ok");
    expect(areaVerdict("Llegar a tiempo a la apertura.")).toBe("ok");
    expect(areaVerdict("Sam should smile more at customers.")).toBe("off-topic");
    expect(areaVerdict("Sam is lazy in the morning.")).toBe("harsh");
    expect(performanceReviewPasses({ evidence: "training", strength: "Sam is lazy and bad.", area: "Sam is late to the open." })).toBe(false);
    expect(AREA_CORRECTIONS["off-topic"].en).toMatch(/morning open/);
  });

  it.each([
    ["This week total is $4,820. Thursday morning open no person.", "ok"],
    ["Sales $4,820. Thursday open: no worker yet.", "ok"],
    ["total 4820 thursday morning nobody", "ok"],
    ["This week $4,820. Thursday morning open is empty.", "ok"],
    ["Everything fine. 4820 thursday morning need", "all-fine"],
    ["Thursday morning open no person.", "no-total"],
    ["Total $4,820 this week.", "no-gap"],
  ] as const)("Day 36 summary %j → %s", (t, v) => expect(summaryVerdict(t)).toBe(v));

  it("Day 36 will not send an empty packet email", () => {
    const base = { sheetTotalConfirmed: true, calendarNoted: true, packetSent: true, summary: "Total $4,820. Thursday morning has nobody." };
    expect(packetMessageIsReady("")).toBe(false);
    expect(opsReportPacketPasses({ ...base, message: "" })).toBe(false);
    expect(opsReportPacketPasses({ ...base, message: "Hi Anita, here is the report." })).toBe(true);
  });

  it("Day 37 names the question that is still blank", () => {
    expect(firstUnanswered(["email", "", "no scared", "is good"])).toBe(1);
    expect(firstUnanswered(["email", "computer", "no scared", "is good"])).toBe(-1);
  });
});

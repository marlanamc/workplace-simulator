import { describe, expect, it } from "vitest";
import { STORY_AUDIT_SENTENCES } from "./fixtures/story-audit-sentences";
import { confirmsVisit, mentionsVisitFact, sharesVisit } from "@/lib/tasks/clinic-privacy";
import { declineIsSafe, declineSharesVisit } from "@/lib/tasks/patient-intake/content";
import { callReplyVerdict, replyIsSafe } from "@/lib/tasks/confidentiality-call/content";
import { OPEN_SLOT } from "@/lib/tasks/appointment-scheduling/content";

/**
 * Story Mode Audit #4. Both clinic privacy tasks passed replies that gave
 * Maya's visit away ("she is here for her cough", "Maya comes at 11:30
 * today"), and rejected honest refusals ("I can not give information").
 */

const intake = STORY_AUDIT_SENTENCES.filter((s) => s.task === "patient-intake" && s.field === "decline");
const call = STORY_AUDIT_SENTENCES.filter((s) => s.task === "confidentiality-call");

describe("the audit's sentences", () => {
  it.each(intake.map((s) => [s.expect, s.lang, s.text] as const))("intake reply to Tomás: %s (%s) %j", (expected, _lang, text) => {
    expect(declineIsSafe(text)).toBe(expected === "accept");
  });

  it.each(call.map((s) => [s.expect, s.lang, s.text] as const))("call reply: %s (%s) %j", (expected, _lang, text) => {
    expect(replyIsSafe(text)).toBe(expected === "accept");
  });

  it("covers both tasks in both languages", () => {
    for (const set of [intake, call]) {
      expect(new Set(set.map((s) => s.lang))).toEqual(new Set(["en", "es"]));
    }
  });
});

describe("what counts as giving the visit away", () => {
  it("takes Maya's time from the booking the learner made", () => {
    expect(mentionsVisitFact(`She comes at ${OPEN_SLOT}.`)).toBe(true);
    expect(mentionsVisitFact("Her visit is at 11.30")).toBe(true);
  });

  it.each([
    "She is here for her cough.",
    "It's a follow up visit.",
    "Es por su tos.",
    "Viene para seguimiento.",
    "Yes, Maya has a 2 PM follow-up.",
    "Yes, she is coming today.",
    "She's here for a checkup.",
    "Maya is booked this morning.",
  ])("a fact or a confirmation leaks: %j", (text) => {
    expect(sharesVisit(text)).toBe(true);
  });

  it.each([
    "I can't tell you if she has an appointment.",
    "I cannot say whether Maya is coming.",
    "No puedo decir si tiene cita.",
    "Yes, I can have Maya call you back.",
    "I can't share why she is here.",
    "I'm sorry, I can't confirm any information about a patient's visit.",
    "Lo siento, no puedo confirmar información sobre la visita de una paciente.",
  ])("a refusal that mentions the question does not: %j", (text) => {
    expect(sharesVisit(text)).toBe(false);
  });

  it("a confirmation before the refusal still leaks", () => {
    expect(confirmsVisit("She has an appointment, but I can't tell you when.")).toBe(true);
  });
});

describe("the Job Card's correction names what is missing", () => {
  it.each([
    ["", "empty"],
    ["Maya comes at 11:30 today. I will have Maya call you back.", "share"],
    ["I can't help you. Don't call again.", "rude"],
    ["I can not give information", "noCallback"],
    ["Maya will call you", "weak"],
    ["Sorry, I can not give information. Maya will call you.", "ok"],
  ] as const)("%j → %s", (text, verdict) => {
    expect(callReplyVerdict(text)).toBe(verdict);
  });

  it("tells the intake learner they shared the reason, not only that the reply is weak", () => {
    expect(declineSharesVisit("Sorry Tomas, she is here for her cough. I cant show the form.")).toBe(true);
  });
});

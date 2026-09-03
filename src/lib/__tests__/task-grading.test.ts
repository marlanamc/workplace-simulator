import { describe, expect, it } from "vitest";
import { CORRECT_WEEK_TOTAL } from "@/lib/tasks/crew-week";
import { emailMentionsFix, parseRange, rangeCoversCrew } from "@/lib/tasks/formula-check/content";
import { replyIsSafe } from "@/lib/tasks/priority-call/content";
import { agendaBulletCount, titleIsAboutSchedule } from "@/lib/tasks/team-meeting/content";
import { replyAcceptsOffer, overlapMentionsShift } from "@/lib/tasks/college-offer/content";
import { emailFlagsOver } from "@/lib/tasks/budget-sheet/content";
import { casualDraftUntouched, stillSoundsCasual, replyAllAnswersDana } from "@/lib/tasks/mail/content";

/**
 * The graders: every pure function that decides whether a learner's typed
 * answer passes. Sibling to task-forgiveness.test.ts, same reason to exist —
 * a learner working alone cannot argue with a wrong "no", so the cost of a
 * false rejection is much higher here than the cost of a lenient pass.
 *
 * Each block therefore pins BOTH directions: real answers that must be
 * accepted (including in Spanish, and including phrasings we did not seed
 * the vocabulary with), and the specific mistake the task is teaching about,
 * which must still be caught.
 */

describe("priority call: the reply to an unhappy customer", () => {
  // The lesson is "acknowledge it and say you will look into it" - NOT
  // "use one of these eight words". These all do the job.
  it.each([
    "I'm sorry about that, let me check with my manager.",
    "My apologies, I will speak to my supervisor right away.",
    "I apologize for the wait. I will look into what happened.",
    "I understand your frustration and will fix this.",
    "Thanks for letting us know, I'll follow up today.",
    "Lo siento mucho, voy a revisar eso ahora.",
    "Lo lamento, hablaré con mi supervisor.",
    "Disculpe la espera, lo voy a corregir.",
    "Entiendo, y lo arreglo enseguida.",
  ])("accepts a real acknowledgement: %j", (reply) => {
    expect(replyIsSafe(reply)).toBe(true);
  });

  // The one thing this task is actually teaching: a shift lead cannot
  // authorize a giveaway.
  it.each([
    "Here is a free coffee for the trouble",
    "I'll give you a refund right now",
    "Your next drink is on the house",
    "I can comp that for you",
    "Te damos un reembolso",
    "Lo siento, tu próxima bebida es gratis",
  ])("rejects an over-promise: %j", (reply) => {
    expect(replyIsSafe(reply)).toBe(false);
  });

  it("an over-promise is still rejected when it is wrapped in an apology", () => {
    // The apology must not buy back the giveaway - order of checks matters.
    expect(replyIsSafe("Sorry! Have a free drink on us.")).toBe(false);
    expect(replyIsSafe("Lo siento mucho, es gratis.")).toBe(false);
  });

  it("rejects a reply that acknowledges nothing", () => {
    expect(replyIsSafe("asdf")).toBe(false);
    expect(replyIsSafe("ok")).toBe(false);
  });
});

describe("formula check: does the range cover the whole crew", () => {
  it.each([
    "=SUM(H2:H6)",
    "=sum(h2:h6)",
    "  =SUM( H2 : H6 )  ",
    "=SUM(H6:H2)", // backwards range still covers the crew
  ])("accepts %j as a SUM over the crew", (formula) => {
    expect(rangeCoversCrew(formula, "sum")).toBe(true);
  });

  it.each([
    "=SUM(H3:H6)", // the classic bug: misses the first crew row
    "=SUM(H2:H5)", // misses the last one - the whole point of the lesson
    "=SUM(H2:H7)", // reaches past the crew into the total row
  ])("rejects %j, which does not cover exactly rows 2-6", (formula) => {
    expect(rangeCoversCrew(formula, "sum")).toBe(false);
  });

  it("does not accept a SUM where an AVERAGE was asked for, or the reverse", () => {
    expect(rangeCoversCrew("=SUM(H2:H6)", "average")).toBe(false);
    expect(rangeCoversCrew("=AVERAGE(H2:H6)", "sum")).toBe(false);
    expect(rangeCoversCrew("=AVERAGE(H2:H6)", "average")).toBe(true);
  });

  it("rejects anything that is not a formula at all", () => {
    for (const junk of ["", "SUM(H2:H6)", "=SUM(H2:H6", "42", "=TOTAL(H2:H6)"]) {
      expect(rangeCoversCrew(junk, "sum"), junk).toBe(false);
    }
  });

  it("parseRange reports the range it found, normalized low-to-high", () => {
    expect(parseRange("=SUM(H2:H6)")).toEqual({ start: 2, end: 6 });
    expect(parseRange("=AVERAGE(H6:H2)")).toEqual({ start: 2, end: 6 });
    expect(parseRange("not a formula")).toBeNull();
  });
});

describe("formula check: does the email explain the fix", () => {
  it("accepts an email carrying the corrected total", () => {
    expect(emailMentionsFix(`Hi Maria, the corrected total is ${CORRECT_WEEK_TOTAL}.`)).toBe(true);
  });

  it("accepts an email that names what went wrong instead of the number", () => {
    expect(emailMentionsFix("Casey was missing from the range.")).toBe(true);
    expect(emailMentionsFix("Faltaba una persona en el rango.")).toBe(true);
  });

  it("rejects an email that says neither", () => {
    expect(emailMentionsFix("Hi Maria, all done, thanks!")).toBe(false);
  });
});

describe("team meeting: title and agenda", () => {
  it.each([
    "Schedule huddle",
    "Coverage for next week",
    "Reunión de horario",
    "Cobertura del sábado",
  ])("accepts a title that is about the schedule: %j", (title) => {
    expect(titleIsAboutSchedule(title)).toBe(true);
  });

  it("rejects a title that could be about anything", () => {
    expect(titleIsAboutSchedule("Quick chat")).toBe(false);
    expect(titleIsAboutSchedule("")).toBe(false);
  });

  it("counts agenda bullets regardless of which bullet character is used", () => {
    expect(agendaBulletCount("- one\n- two")).toBe(2);
    expect(agendaBulletCount("* one\n• two\nthree")).toBe(3);
  });

  it("ignores blank lines and stray bullets, so padding does not fake a full agenda", () => {
    // The task gates on >= 2 bullets; whitespace must not clear that bar.
    expect(agendaBulletCount("- one\n\n\n")).toBe(1);
    expect(agendaBulletCount("\n\n")).toBe(0);
    expect(agendaBulletCount("-\n-\n")).toBe(0);
  });
});

describe("college offer: accept and flag the overlap", () => {
  it.each([
    "I accept the offer for the Business Essentials class.",
    "Yes, I'll take the Tuesday BHCC class.",
    "Acepto la clase de Business Essentials.",
    "Sí, voy a tomar la clase en BHCC.",
  ])("accepts a real acceptance: %j", (body) => {
    expect(replyAcceptsOffer(body)).toBe(true);
  });

  it("rejects a reply that does not accept or name the class", () => {
    expect(replyAcceptsOffer("Thanks!")).toBe(false);
    expect(replyAcceptsOffer("I accept.")).toBe(false);
    expect(replyAcceptsOffer("asdf")).toBe(false);
  });

  it.each([
    "The class overlaps my Tuesday close.",
    "Can we move my Tuesday shift before the semester?",
    "La clase choca con el cierre del martes.",
    "El turno del martes entra en conflicto.",
  ])("accepts an overlap note: %j", (body) => {
    expect(overlapMentionsShift(body)).toBe(true);
  });

  it("rejects an overlap note that never names the conflict", () => {
    expect(overlapMentionsShift("Looks good, thanks")).toBe(false);
  });
});

describe("budget sheet: flag the over category", () => {
  it.each([
    "Labor is over budget by $450.",
    "Labor actual is 2850 against 2400.",
    "Mano de obra se pasó por 450.",
    "La nómina está over.",
  ])("accepts a real flag: %j", (body) => {
    expect(emailFlagsOver(body)).toBe(true);
  });

  it("rejects an email that names neither labor nor the overage", () => {
    expect(emailFlagsOver("Hi Maria, the budget looks fine.")).toBe(false);
    expect(emailFlagsOver("Supplies look high.")).toBe(false);
  });
});

describe("reply-all: audience and tone", () => {
  it("rejects the planted casual draft", () => {
    expect(casualDraftUntouched("yeah that's fine lol", "en")).toBe(true);
    expect(casualDraftUntouched("sí está bien jaja", "es")).toBe(true);
    expect(stillSoundsCasual("yeah that's fine lol")).toBe(true);
  });

  it.each([
    "Hi Dana, yes — we can take the 6 AM Friday delivery.",
    "Yes, Friday at 6 AM works. Someone will be on the dock.",
    "Hola Dana, sí, podemos recibir la entrega del viernes a las 6 AM.",
    "No podemos a las 6. Can we do 8 AM Friday?",
  ])("accepts a professional answer: %j", (body) => {
    expect(replyAllAnswersDana(body)).toBe(true);
  });

  it("rejects a casual or empty answer", () => {
    expect(replyAllAnswersDana("yeah that's fine lol")).toBe(false);
    expect(replyAllAnswersDana("ok")).toBe(false);
    expect(replyAllAnswersDana("Thanks!")).toBe(false);
  });
});

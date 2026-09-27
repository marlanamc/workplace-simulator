import { describe, expect, it } from "vitest";
import {
  APPOINTMENT_COPY,
  CONFLICT_OPTIONS,
  confirmationProblem,
  confirmationOffersOpenSlot,
  conflictIdentified,
  STARTERS as APPT_STARTERS,
} from "@/lib/tasks/appointment-scheduling/content";
import {
  COURSEWORK_COPY,
  DEADLINE_OPTIONS,
  deadlineIsCorrect,
  replyProblem,
  responseIsComplete,
  STARTERS as COURSEWORK_STARTERS,
  TIME_LEFT_OPTIONS,
  timeLeftIsCorrect,
} from "@/lib/tasks/coursework/content";

/**
 * Must-pass / must-fail phrase tables for the Front Desk appointment lesson
 * and the Coursework lesson, from the learner-view audit. Honest beginner
 * English and Spanish pass; the wrong answers the audit found passing fail,
 * each with the problem the Job Card correction names.
 */

describe("appointment: the text to Maya offers 11:30", () => {
  it.each([
    "Hi Maya, 10:00 is taken. I can do 11:30 today.",
    "Come at 1130",
    "You can come at 11h30.",
    "11.30 is ok?",
    "11 30 is free",
    "See you at 11:30am!",
    "Can you come at eleven thirty?",
    "Half past eleven is open.",
    "Maya, 10:00 is booked, but 11:30 is open.",
    "10:00 is full. 11:30 is free.",
    "Sorry Maya, 10 is taken, so 11:30?",
    "11:30 is not taken. Come then.",
    "Hola Maya, puedes venir a las once y media.",
    "Te doy las 11 y media.",
    "Las 10:00 están ocupadas. Las 11:30 están libres.",
    "Puedes venir a las once y treinta?",
  ])("passes %j", (body) => {
    expect(confirmationProblem(body)).toBeNull();
    expect(confirmationOffersOpenSlot(body)).toBe(true);
  });

  it.each([
    ["", "empty"],
    ["   ", "empty"],
    ["Sorry Maya, 11:30 is taken too.", "takenTime"],
    ["11:30 is booked. Sorry.", "takenTime"],
    ["Lo siento, las 11:30 también están ocupadas.", "takenTime"],
    ["1130", "bare"],
    ["11:30", "bare"],
    ["11:30 am", "bare"],
    ["See you soon", "weak"],
    ["10:00 works", "weak"],
    ["Come at 12:30.", "weak"],
    ["See you at 21:30", "weak"],
    ["See you at ___. Thank you!", "blank"],
    ["Hi Maya, 10:00 is taken. I can do ___ today.", "blank"],
  ])("fails %j as %s", (body, problem) => {
    expect(confirmationProblem(body)).toBe(problem);
  });

  it("every problem has a correction in both languages", () => {
    for (const p of ["empty", "blank", "weak", "bare", "takenTime"] as const) {
      expect(APPOINTMENT_COPY.en[p]).not.toBe("");
      expect(APPOINTMENT_COPY.es[p]).not.toBe("");
    }
  });

  it("the starters are frames: none of them gives the time", () => {
    for (const lang of ["en", "es"] as const) {
      for (const line of APPT_STARTERS[lang]) {
        expect(line).not.toMatch(/11\s*[:.]?\s*30/);
        expect(confirmationOffersOpenSlot(line)).toBe(false);
      }
    }
  });

  it("the reasons need the 10:00 row: more than one names a person, each wrong one says where it is", () => {
    const naming = CONFLICT_OPTIONS.filter((o) => /Luis|Walter|Priya|Ana|Dana|Grace/.test(o.label.en));
    expect(naming.length).toBeGreaterThan(1);
    expect(CONFLICT_OPTIONS.filter((o) => conflictIdentified(o.key))).toHaveLength(1);
    expect(conflictIdentified("booked")).toBe(true);
    for (const o of CONFLICT_OPTIONS.filter((x) => !conflictIdentified(x.key))) {
      expect(o.hint.en).toMatch(/10:00/);
      expect(o.hint.es).toMatch(/10:00/);
    }
  });
});

describe("coursework: the reply says sorry and one thing you will do", () => {
  it.each([
    "Sorry. I fix it.",
    "Sorry Dana. I will make you a new latte.",
    "I am sorry. Next time the latte is free.",
    "Sorry! No problem, I will fix your order.",
    "I'm sorry we got it wrong. It will not happen again.",
    "We apologize. We will give you a refund.",
    "Sorry, I will talk to my manager.",
    "sorry i make new coffee for you",
    "Lo siento. Lo arreglo.",
    "Lo siento, te preparo otro café mañana.",
    "Perdón Dana. Te damos un latte gratis.",
    "Disculpa. Voy a hablar con mi gerente para que no vuelva a pasar.",
  ])("passes %j", (body) => {
    expect(replyProblem(body)).toBeNull();
    expect(responseIsComplete(body)).toBe(true);
  });

  it.each([
    ["", "empty"],
    ["No. I will not fix it. Go away.", "refuses"],
    ["Sorry, I will not fix it.", "refuses"],
    ["Sorry but I can't help you.", "refuses"],
    ["Lo siento, no lo voy a arreglar.", "refuses"],
    ["I look at the sky every day.", "weak"],
    ["ok", "weak"],
    ["Thanks!", "weak"],
    ["Thank you for telling me. I will look into this today and write you back.", "noApology"],
    ["I will call the customer and fix it.", "noApology"],
    ["Gracias por avisar. Voy a revisar esto hoy y te escribo.", "noApology"],
    ["I am so sorry.", "noAction"],
    ["Lo siento mucho, Dana.", "noAction"],
    ["Hi Dana, I am sorry that ___. I will ___.", "blank"],
  ])("fails %j as %s", (body, problem) => {
    expect(replyProblem(body)).toBe(problem);
  });

  it("every problem has a correction in both languages", () => {
    for (const p of ["empty", "blank", "weak", "noApology", "noAction", "refuses"] as const) {
      expect(COURSEWORK_COPY.en[p]).not.toBe("");
      expect(COURSEWORK_COPY.es[p]).not.toBe("");
    }
  });

  it("the starters are frames that do not pass on their own", () => {
    for (const lang of ["en", "es"] as const) {
      expect(responseIsComplete(COURSEWORK_STARTERS[lang].join(" "))).toBe(false);
    }
  });

  it("the due dates differ in day and time, so a guess among 11:59 PMs is gone", () => {
    const times = new Set(DEADLINE_OPTIONS.map((o) => o.label.en.split(", ")[1]));
    expect(times.size).toBeGreaterThan(1);
    expect(DEADLINE_OPTIONS.filter((o) => deadlineIsCorrect(o.key))).toHaveLength(1);
  });

  it("how much time is left has one right answer, and each wrong one gets a hint", () => {
    expect(TIME_LEFT_OPTIONS.filter((o) => timeLeftIsCorrect(o.key)).map((o) => o.key)).toEqual(["tomorrow"]);
    for (const o of TIME_LEFT_OPTIONS.filter((x) => !timeLeftIsCorrect(x.key))) {
      expect(o.hint.en).not.toBe("");
      expect(o.hint.es).not.toBe("");
    }
  });
});

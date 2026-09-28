import { describe, expect, it } from "vitest";
import {
  APPROVED_SHIFTS,
  COLLEGE_OFFER_COPY,
  EVENT_CORRECTIONS,
  EVENT_START_DAYS,
  GAP_CORRECTIONS,
  HR_REPLY_CORRECTIONS,
  HR_STARTERS,
  NO_CLASS_DAY,
  OFFER_LETTER,
  REGISTER_BY,
  RENATA_CORRECTIONS,
  RENATA_REPLY,
  RENATA_STARTERS,
  RIGHT_NOW_STEPS,
  SCHEDULE_COPY,
  SECTIONS,
  SECTION_CORRECTIONS,
  SPRING_SHIFTS,
  TERM_START,
  classEventVerdict,
  describeSubmission,
  hrReplyVerdict,
  makesRequest,
  namesClassTime,
  namesSection,
  offerGap,
  renataRequestVerdict,
  sectionByKey,
  sectionClashes,
  sectionCorrection,
  sectionTime,
  sectionVerdict,
  stepIndexFor,
  type ClassEventInput,
  type OfferProgress,
} from "@/lib/tasks/college-offer/content";
import { STORY_DAY_BY_LEVEL, storyDate, storyWeekday } from "@/lib/story-dates";
import type { Lang } from "@/lib/task-types";

const LANGS: Lang[] = ["en", "es"];

describe("college offer: dates are a real spring registration", () => {
  it("registers in the fall and starts on Tuesday, January 19, 2027", () => {
    expect(storyDate(REGISTER_BY).toDateString()).toBe(new Date(2026, 11, 11).toDateString());
    expect(storyWeekday(REGISTER_BY)).toBe(5);
    expect(storyDate(TERM_START).toDateString()).toBe(new Date(2027, 0, 19).toDateString());
    expect(storyWeekday(NO_CLASS_DAY)).toBe(1);
    expect(STORY_DAY_BY_LEVEL.level13).toBeLessThan(REGISTER_BY);
    expect(REGISTER_BY).toBeLessThan(TERM_START);
  });

  it("puts the dates in the offer and the schedule, in both languages", () => {
    expect(OFFER_LETTER.en.rules[0]).toBe("Register by Friday, December 11, 2026.");
    expect(OFFER_LETTER.es.rules[0]).toBe("Inscríbete a más tardar el viernes 11 de diciembre de 2026.");
    expect(SCHEDULE_COPY.en.facts.join(" ")).toContain("Tuesday, January 19, 2027");
    expect(SCHEDULE_COPY.es.facts.join(" ")).toContain("martes 19 de enero de 2027");
  });

  it("never states the answer in the offer, the schedule, or the Job Card steps", () => {
    for (const lang of LANGS) {
      const text = [
        ...Object.values(OFFER_LETTER[lang]).flat(),
        ...SCHEDULE_COPY[lang].facts,
        ...RIGHT_NOW_STEPS.map((s) => s[lang]),
        COLLEGE_OFFER_COPY[lang].calBody,
        COLLEGE_OFFER_COPY[lang].weekNote,
        COLLEGE_OFFER_COPY[lang].schedBody,
      ].join(" ");
      expect(text).not.toMatch(/overlap|choca|conflict|Section 02|sección 02|20327|close|cierre/i);
    }
  });

  it("keeps starters free of the answer", () => {
    for (const lang of LANGS) {
      const text = [...HR_STARTERS[lang], ...RENATA_STARTERS[lang]].join(" ");
      expect(text).not.toMatch(/02|20327|5:00|7:45|tuesday|martes/i);
    }
  });
});

describe("college offer: choosing a section", () => {
  it("reads the clash from the shifts and the schedule", () => {
    expect(sectionClashes(sectionByKey("01")!, SPRING_SHIFTS)).toEqual([1, 3]);
    expect(sectionClashes(sectionByKey("02")!, SPRING_SHIFTS)).toEqual([2]);
    expect(sectionClashes(sectionByKey("03")!, SPRING_SHIFTS)).toEqual([]);
    // After Renata's change, Section 02 fits.
    expect(sectionClashes(sectionByKey("02")!, APPROVED_SHIFTS)).toEqual([]);
  });

  it("section 01 clashes, 03 is full, 02 can work", () => {
    expect(sectionVerdict("01")).toBe("clashes");
    expect(sectionVerdict("03")).toBe("full");
    expect(sectionVerdict("02")).toBe("ok");
    expect(sectionVerdict("99")).toBe("clashes");
  });

  it.each(LANGS)("explains a wrong pick after the try (%s)", (lang) => {
    expect(sectionCorrection("02")).toBeNull();
    expect(sectionCorrection("01")?.[lang]).toMatch(lang === "en" ? /Monday and Wednesday.*open/ : /lunes y miércoles.*abres/);
    expect(sectionCorrection("03")?.[lang]).toMatch(lang === "en" ? /full.*waitlist is not a seat/i : /llena.*lista de espera no es un lugar/i);
    expect(SECTION_CORRECTIONS.full[lang]).toBeTruthy();
  });

  it("shows section times the way a schedule does", () => {
    expect(sectionTime(sectionByKey("01")!)).toBe("9:00–10:15 AM");
    expect(sectionTime(sectionByKey("02")!)).toBe("5:00–7:45 PM");
    expect(SECTIONS.find((s) => s.key === "03")!.seatsOpen).toBe(0);
  });
});

describe("college offer: the message to Renata", () => {
  it.each([
    "Hi Renata, my class is Tuesday 5 to 7:45. Can I change my Tuesday shift?",
    "I need change my tuesday close for school",
    "Please can I work open on tuesdays? class is 5pm",
    "My class is at 5:00 PM. Could we move my shift?",
    "Hola Renata, mi clase es el martes de 5 a 7:45. ¿Puedo cambiar mi turno?",
    "Necesito cambiar mi cierre del martes, por favor.",
  ])("accepts an honest request: %j", (body) => {
    expect(renataRequestVerdict(body)).toBe("ok");
  });

  it("names what is missing", () => {
    expect(renataRequestVerdict("")).toBe("empty");
    expect(renataRequestVerdict("The class meets on ___ from ___ to ___.")).toBe("blank");
    expect(renataRequestVerdict("Can I change my shift please?")).toBe("no-class-time");
    expect(renataRequestVerdict("My class is on Tuesday.")).toBe("no-request");
    expect(renataRequestVerdict("I don't want to change my Tuesday shift.")).toBe("no-request");
    expect(renataRequestVerdict("Mi clase es el martes.")).toBe("no-request");
  });

  it("has helpers that read day, time and request", () => {
    expect(namesClassTime("tues")).toBe(true);
    expect(namesClassTime("at 7:45")).toBe(true);
    expect(namesClassTime("on Thursday")).toBe(false);
    expect(makesRequest("Can I switch shifts?")).toBe(true);
    expect(makesRequest("asdf")).toBe(false);
  });

  it.each(LANGS)("has every correction in %s", (lang) => {
    for (const c of Object.values(RENATA_CORRECTIONS)) expect(c[lang]).toBeTruthy();
  });
});

describe("college offer: the reply to HR", () => {
  it.each([
    "I accept. I will take Section 02.",
    "Thank you! I accept the offer. Section 2, CRN 20327.",
    "yes ok thank you, section two",
    "Acepto. Voy a tomar la sección 02.",
    "Gracias, acepto la oferta. CRN 20327.",
  ])("accepts a yes that names Section 02: %j", (body) => {
    expect(hrReplyVerdict(body)).toBe("ok");
  });

  it("tells a no, a maybe, a missing section and a wrong section apart", () => {
    expect(hrReplyVerdict("")).toBe("empty");
    expect(hrReplyVerdict("I will take Section ___ (CRN ___).")).toBe("blank");
    expect(hrReplyVerdict("I do not accept the class. Section 02.")).toBe("declines");
    expect(hrReplyVerdict("maybe section 02")).toBe("unsure");
    expect(hrReplyVerdict("Section 02.")).toBe("no-answer");
    expect(hrReplyVerdict("yes ok thank you")).toBe("no-section");
    expect(hrReplyVerdict("I accept. Section 03 please.")).toBe("wrong-section");
    expect(hrReplyVerdict("Acepto la sección 01.")).toBe("wrong-section");
  });

  it("does not read a clock time as a section", () => {
    expect(namesSection("class at 5:02", "02")).toBe(false);
    expect(namesSection("#2", "02")).toBe(true);
    expect(namesSection("sec. 03", "03")).toBe(true);
  });

  it.each(LANGS)("has every correction in %s", (lang) => {
    for (const c of Object.values(HR_REPLY_CORRECTIONS)) expect(c[lang]).toBeTruthy();
  });
});

describe("college offer: the calendar event", () => {
  const right: ClassEventInput = {
    title: "BUS 101",
    weekday: "2",
    start: "5:00 PM",
    end: "7:45 PM",
    startsOn: String(TERM_START),
    repeats: true,
  };

  it("accepts Tuesday 5:00–7:45 PM, weekly, from January 19", () => {
    expect(classEventVerdict(right)).toBe("ok");
    expect(EVENT_START_DAYS).toContain(TERM_START);
  });

  it("names each wrong field", () => {
    expect(classEventVerdict({ ...right, title: "" })).toBe("title");
    expect(classEventVerdict({ ...right, weekday: "4", start: "6:00 PM", end: "8:45 PM" })).toBe("other-section");
    expect(classEventVerdict({ ...right, weekday: "3" })).toBe("day");
    expect(classEventVerdict({ ...right, end: "7:00 PM" })).toBe("time");
    expect(classEventVerdict({ ...right, startsOn: String(REGISTER_BY) })).toBe("deadline");
    expect(classEventVerdict({ ...right, startsOn: String(NO_CLASS_DAY) })).toBe("holiday");
    expect(classEventVerdict({ ...right, startsOn: String(TERM_START + 7) })).toBe("late-start");
    expect(classEventVerdict({ ...right, startsOn: "" })).toBe("starts");
    expect(classEventVerdict({ ...right, repeats: false })).toBe("repeats");
  });

  it.each(LANGS)("has every correction in %s", (lang) => {
    for (const c of Object.values(EVENT_CORRECTIONS)) expect(c[lang]).toBeTruthy();
  });
});

describe("college offer: progress and finish", () => {
  const none: OfferProgress = { offerRead: false, section: null, renataSent: false, eventSaved: false, hrSent: false };
  const all: OfferProgress = { offerRead: true, section: "02", renataSent: true, eventSaved: true, hrSent: true };

  it("steps through the Job Card lines in order", () => {
    expect(stepIndexFor(none)).toBe(0);
    expect(stepIndexFor({ ...none, offerRead: true })).toBe(1);
    expect(stepIndexFor({ ...none, offerRead: true, section: "02" })).toBe(2);
    expect(stepIndexFor({ ...all, eventSaved: false, hrSent: false })).toBe(3);
    expect(stepIndexFor({ ...all, hrSent: false })).toBe(4);
    expect(RIGHT_NOW_STEPS).toHaveLength(5);
  });

  it("finishes only when all four are done, in any order", () => {
    expect(offerGap(all)).toBeNull();
    expect(offerGap({ ...all, offerRead: false })).toBeNull();
    expect(offerGap({ ...all, section: "03" })).toBe("section");
    expect(offerGap({ ...all, renataSent: false })).toBe("renata");
    expect(offerGap({ ...all, eventSaved: false })).toBe("event");
    expect(offerGap({ ...all, hrSent: false })).toBe("hr");
    for (const lang of LANGS) for (const c of Object.values(GAP_CORRECTIONS)) expect(c[lang]).toBeTruthy();
  });

  it.each(LANGS)("keeps both messages for the teacher (%s)", (lang) => {
    const s = describeSubmission({ renata: "Can I change Tuesday?", reply: "I accept. Section 02." }, lang);
    expect(s.fields.map((f) => f.value)).toEqual(["Can I change Tuesday?", "I accept. Section 02."]);
    expect(RENATA_REPLY[lang].body.length).toBeGreaterThan(0);
  });
});

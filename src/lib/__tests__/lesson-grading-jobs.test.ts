import { describe, expect, it } from "vitest";
import { hasBlank, looksLikeKeyboardMash, readCount, sameEmail, samePhone } from "@/lib/grading-jobs";
import { fitProblem, pickProblem, STARTERS as POSTING_STARTERS, LESSONS as POSTING_HELP } from "@/lib/tasks/job-posting/content";
import {
  availabilityFits,
  contactProblem,
  JOB_APPLICATION_COPY,
  JOB_SEEKER,
  LESSONS as APP_HELP,
  LESSON_RIGHT_NOW_STEPS as APP_LESSON_STEPS,
  RIGHT_NOW_STEPS as APP_STEPS,
  STARTERS as APP_STARTERS,
  whyProblem,
} from "@/lib/tasks/job-application/content";
import {
  bulletProblem,
  LESSON_BULLET_STARTERS_BY_ROLE,
  LESSON_SUMMARY_STARTERS,
  summaryProblem,
} from "@/lib/tasks/resume-build/content";
import { PAPERWORK_SHELL, w4Problem, w4StepIndex } from "@/lib/tasks/onboarding-paperwork/content";
import { TASKS } from "@/lib/tasks/registry";

/**
 * Must-pass / must-fail phrase tables for the hiring lessons (job-posting,
 * job-application, resume-build) and the W-4, from the learner-view audit:
 * word counts alone let "asdf asdf asdf asdf" through and sent back honest
 * short lines like "I led team" and "Trained new workers.".
 */

describe("keyboard-mash filter", () => {
  it.each(["asdf asdf asdf asdf", "qwerty uiop", "jjjjj kkkk", "sdfg hjkl zxcv", "work work work work", "xcvb nm"])(
    "flags %j",
    (text) => expect(looksLikeKeyboardMash(text)).toBe(true),
  );
  it.each([
    "I led team",
    "Trained new workers.",
    "I answer the crew's email.",
    "I want strengths and rhythm at work.",
    "Point of sale and schedules",
    "Arreglé el horario y entrené a trabajadores nuevos.",
  ])("reads %j as words", (text) => expect(looksLikeKeyboardMash(text)).toBe(false));

  it("sees an unfilled starter blank", () => {
    expect(hasBlank("I am good at ___.")).toBe(true);
    expect(hasBlank("I am good at schedules.")).toBe(false);
  });
});

describe("job-posting fit line", () => {
  it.each([
    "I led team",
    "I led a team as a shift lead.",
    "Trained new workers.",
    "I fixed the schedule.",
    "i good with email and calendar",
    "I talk with customers every day",
    "Dirigí un equipo.",
    "Arreglé el horario del café.",
    "At Harborside Cafe, I trained new workers.",
  ])("accepts %j", (fit) => expect(fitProblem(fit)).toBeNull());

  it.each([
    ["", "empty"],
    ["asdf asdf asdf asdf", "mash"],
    ["At Harborside Cafe, I ___.", "blank"],
    ["I good", "short"],
    ["I look at the sky every day.", "offTopic"],
    ["I am a nice person", "offTopic"],
  ] as const)("rejects %j as %s", (fit, problem) => expect(fitProblem(fit)).toBe(problem));

  it("does not accept a checked degree box: the character has none", () => {
    expect(pickProblem(["customer-facing", "scheduling", "tools", "degree"])).toBe("degree");
    expect(pickProblem(["customer-facing", "scheduling"])).toBe("few");
    expect(pickProblem(["customer-facing", "scheduling", "tools"])).toBeNull();
  });

  it("help no longer quotes words the posting does not have", () => {
    const help = [...POSTING_HELP.en[0].s, ...POSTING_HELP.es[0].s].join(" ");
    expect(help).not.toMatch(/equivalent|equivalente/);
    expect(help).toMatch(/preferred/);
  });
});

describe("job-application", () => {
  it.each([
    "I want this job because I like office work.",
    "I am good at organizing and I want to learn.",
    "I want steady hours for my family.",
    "Quiero este trabajo porque me gusta organizar.",
  ])("accepts why %j", (why) => expect(whyProblem(why)).toBeNull());

  it.each([
    ["", "empty"],
    ["asdf asdf asdf asdf asdf asdf", "mash"],
    ["I want this job because ___.", "blank"],
    ["I need a job", "short"],
  ] as const)("rejects why %j as %s", (why, problem) => expect(whyProblem(why)).toBe(problem));

  it("the card, hint, correction and help all ask for one or two sentences", () => {
    for (const lang of ["en", "es"] as const) {
      const said = [
        APP_STEPS[1][lang],
        APP_LESSON_STEPS[2][lang],
        JOB_APPLICATION_COPY[lang].whyHint,
        JOB_APPLICATION_COPY[lang].needWhy,
        APP_HELP[lang][0].tip,
      ].join(" ");
      expect(said).not.toMatch(/2 or 3|two or three|2 o 3|dos o tres|6 words|6 palabras/i);
    }
    expect(APP_HELP.en[0].tip).toMatch(/One or two sentences/);
  });

  const good = { name: JOB_SEEKER.name, phone: JOB_SEEKER.phone, email: JOB_SEEKER.email, start: JOB_SEEKER.start };
  it.each([
    { name: "sam rivera" },
    { name: "  Sam  Rivera. " },
    { phone: "617-555-0142" },
    { phone: "617 555 0142" },
    { phone: "6175550142" },
    { phone: "+1 (617) 555-0142" },
    { email: "Sam.Rivera@mail.com " },
    { start: "11/16/2026" },
    { start: "11-16-2026" },
    { start: "11/16/26" },
  ])("accepts contact %j", (patch) => expect(contactProblem({ ...good, ...patch })).toBeNull());

  it.each([
    [{ name: "" }, "name", "empty"],
    [{ name: "Sam" }, "name", "wrong"],
    [{ phone: "617-555-0124" }, "phone", "wrong"],
    [{ email: "sam.rivera@gmail.com" }, "email", "wrong"],
    [{ start: "16/11/2026" }, "start", "wrong"],
    [{ start: "" }, "start", "empty"],
  ] as const)("names the contact box for %j", (patch, field, kind) =>
    expect(contactProblem({ ...good, ...patch })).toEqual({ field, kind }),
  );

  it("an empty box is reported before a wrong one", () => {
    expect(contactProblem({ ...good, name: "Pat", email: "" })).toEqual({ field: "email", kind: "empty" });
  });

  it("availability must fit a full-time job in a lesson; Story takes any choice", () => {
    expect(availabilityFits("full", true)).toBe(true);
    expect(availabilityFits("either", true)).toBe(true);
    expect(availabilityFits("part", true)).toBe(false);
    expect(availabilityFits("part", false)).toBe(true);
    expect(availabilityFits(null, false)).toBe(false);
  });

  it("phone and email compare forgivingly", () => {
    expect(samePhone("(617) 555 0142", "617.555.0142")).toBe(true);
    expect(sameEmail("A@B.COM", "a@b.com")).toBe(true);
  });
});

describe("resume-build", () => {
  it.each(["I am a shift lead.", "I am a shift lead at Harborside Cafe.", "Soy líder de turno en el café."])(
    "accepts summary %j",
    (text) => expect(summaryProblem(text)).toBeNull(),
  );
  it.each([
    ["asdf asdf asdf asdf", "mash"],
    ["I am a ___ at Harborside Cafe.", "blank"],
    ["Shift lead", "short"],
  ] as const)("rejects summary %j as %s", (text, problem) => expect(summaryProblem(text)).toBe(problem));

  it.each([
    [["Trained new workers.", "Served customers every day."]],
    [["Fixed the weekly schedule.", "Typed tips in a spreadsheet."]],
    [["Entrené a trabajadores nuevos.", "Atendí a clientes."]],
  ])("accepts bullets %j", (bullets) => expect(bulletProblem(bullets)).toBeNull());

  it.each([
    [["asdf asdf asdf asdf", "Served customers every day."], 0, "mash"],
    [["Trained new workers.", "Typed ___ in a spreadsheet."], 1, "blank"],
    [["Trained new workers.", ""], 1, "empty"],
    [["Trained workers", "Served customers."], 0, "short"],
    [["Trained new workers.", "trained new workers"], 1, "same"],
  ] as const)("rejects bullets %j at %i as %s", (bullets, index, kind) =>
    expect(bulletProblem([...bullets])).toEqual({ index, kind }),
  );

  it("each job's starters come from that job's own duties", () => {
    expect(LESSON_BULLET_STARTERS_BY_ROLE[0].en.join(" ")).not.toMatch(/Served|customers|tips/);
    expect(LESSON_BULLET_STARTERS_BY_ROLE[1].en.join(" ")).not.toMatch(/Trained|schedule/);
  });
});

describe("starters are frames with a blank, never a finished answer", () => {
  const lists: [string, Record<"en" | "es", string[]>][] = [
    ["job-posting", POSTING_STARTERS],
    ["job-application", APP_STARTERS],
    ["resume summary", LESSON_SUMMARY_STARTERS],
    ...LESSON_BULLET_STARTERS_BY_ROLE.map((r, i) => [`resume bullets ${i}`, r] as [string, Record<"en" | "es", string[]>]),
  ];
  it.each(lists)("%s", (_name, starters) => {
    for (const line of [...starters.en, ...starters.es]) expect(hasBlank(line), line).toBe(true);
  });
});

describe("hiring lessons talk about the character, not the learner", () => {
  it.each(["job-posting", "job-application", "resume-build"] as const)("%s names Sam", (key) => {
    const lesson = TASKS[key].lesson!;
    expect(lesson.persona).toBe(JOB_SEEKER.name);
    expect(lesson.scene.you.en).toMatch(/You are playing Sam/);
    expect(lesson.takeaway?.en).toBeTruthy();
    expect(lesson.takeaway?.es).toBeTruthy();
  });
});

describe("w4-form", () => {
  const done = { status: "single", dependents: "0", signature: "Robin Avery", date: "10/01/2026" };

  it.each([
    { dependents: "none" },
    { dependents: "zero" },
    { dependents: "Cero" },
    { dependents: "ninguno" },
    { dependents: " 0 " },
    { date: "10/1/2026" },
    { date: "10-01-2026" },
    { signature: "robin avery" },
  ])("accepts %j", (patch) => expect(w4Problem({ ...done, ...patch })).toBeNull());

  it("names the empty box, top to bottom", () => {
    expect(w4Problem({ ...done, status: null })?.hint.en).toMatch(/Step 1.*filing status/);
    expect(w4Problem({ ...done, dependents: "" })?.hint.en).toMatch(/Step 3.*dependents/);
    expect(w4Problem({ ...done, signature: "" })?.hint.en).toMatch(/Signature box is empty/);
    expect(w4Problem({ ...done, date: "" })?.hint.en).toMatch(/Date box is empty/);
    expect(w4Problem({ status: null, dependents: "", signature: "", date: "" })?.field).toBe("status");
  });

  it("explains a wrong filing status from Robin's facts", () => {
    expect(w4Problem({ ...done, status: "hoh" })?.hint.en).toMatch(/Robin has no children/);
    expect(w4Problem({ ...done, status: "joint" })?.hint.en).toMatch(/Robin is not married/);
  });

  it("the card does not move on past a wrong answer", () => {
    expect(w4StepIndex({ ...done, status: "hoh" })).toBe(0);
    expect(w4StepIndex({ ...done, dependents: "2" })).toBe(1);
    expect(w4StepIndex({ ...done, signature: "" })).toBe(2);
  });

  it("rejects a wrong count, a non-count, a day-first date and another name", () => {
    expect(w4Problem({ ...done, dependents: "2" })?.field).toBe("dependents");
    expect(w4Problem({ ...done, dependents: "kids" })?.hint.en).toMatch(/needs a number/);
    expect(w4Problem({ ...done, date: "01/10/2026" })?.hint.es).toMatch(/1 de octubre/);
    expect(w4Problem({ ...done, signature: "Maria Lopez" })?.field).toBe("signature");
  });

  it("the empty signature box does not show a name", () => {
    for (const lang of ["en", "es"] as const) expect(PAPERWORK_SHELL[lang].signPlaceholder).not.toMatch(/Robin/);
  });

  it("the info card describes Robin instead of giving the answers, and glosses the date in Spanish", () => {
    const lesson = TASKS["w4-form"].lesson!;
    const values = lesson.reference!.map((f) => (typeof f.value === "string" ? f.value : `${f.value.en} ${f.value.es}`)).join(" ");
    expect(values).not.toMatch(/Single|Soltero/);
    expect(values).toMatch(/1 de octubre/);
    expect(lesson.takeaway?.en).toMatch(/On your own W-4/);
    expect(lesson.guide.stickingPoints.map((p) => p.en).join(" ")).not.toMatch(/copy it exactly/i);
  });

  it("readCount reads words and digits", () => {
    expect(readCount("none")).toBe(0);
    expect(readCount("2")).toBe(2);
    expect(readCount("dos")).toBe(2);
    expect(readCount("kids")).toBeNull();
  });
});

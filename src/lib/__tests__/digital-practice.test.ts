import { describe, it, expect } from "vitest";
import { blank, errors, parseDraft, instructions } from "../practice/content";
import { ACTIVITIES, practiceReturn } from "../practice/activities";
import {
  assignment,
  attachmentErrors,
  blankAssignment,
  commentError,
  parseAssignment,
} from "../practice/assignment";
import {
  PRACTICE_PASSWORD,
  blankPassword,
  codeError,
  newPasswordErrors,
  parsePassword,
  signinAgainError,
} from "../practice/password";
import type { PracticeActivity, BaseDraft } from "../practice/types";
const valid = {
  ...blank(),
  firstName: " Maya ",
  lastName: "TORRES",
  email: "Maya.Torres@example.com ",
  session: "tuesday",
};
describe("standalone practice validation", () => {
  it("accepts capitalization and surrounding spaces", () =>
    expect(errors(valid)).toEqual({}));
  it("rejects missing details and wrong sessions", () => {
    expect(Object.keys(errors(blank()))).toHaveLength(4);
    expect(errors({ ...valid, session: "saturday" })).toHaveProperty("session");
  });
  it("does not accept an invalid review or completed draft", () => {
    expect(parseDraft({ ...blank(), stage: "complete" })).toBeNull();
    expect(parseDraft({ ...blank(), stage: "review" })).toBeNull();
    expect(parseDraft({ ...valid, stage: "complete" })).not.toBeNull();
  });
  it("rejects malformed, oversized, or unsupported saved state", () => {
    for (const v of [
      null,
      {},
      false,
      { ...valid, version: 2 },
      { ...valid, mode: "expert" },
      { ...valid, email: 2 },
      { ...valid, firstName: "x".repeat(201) },
    ])
      expect(parseDraft(v)).toBeNull();
  });
  it("strips injected owner and game credit properties", () =>
    expect(
      parseDraft({ ...valid, learnerId: "other", badges: ["test"] }),
    ).toEqual(valid));
  it("includes both help languages at every step", () => {
    for (const v of Object.values(instructions)) {
      expect(v.en.length).toBeGreaterThan(10);
      expect(v.es.length).toBeGreaterThan(10);
    }
  });
});
describe("safe practice login returns", () => {
  it("preserves existing teacher and studio destinations", () => {
    expect(practiceReturn("/teacher")).toBe("/teacher");
    expect(practiceReturn("/studio")).toBe("/studio");
  });
  it("returns to any registered activity", () =>
    expect(practiceReturn("/practice/assignment?lang=es")).toBe(
      "/practice/assignment?lang=es",
    ));
  it("keeps only supported practice options", () =>
    expect(
      practiceReturn(
        "/practice/workshop?mode=independent&lang=es&transfer=1&preview=1&owner=other",
      ),
    ).toBe("/practice/workshop?mode=independent&lang=es&transfer=1"));
  it("rejects external redirects and unknown routes", () => {
    for (const s of [
      "https://evil.test/practice/workshop",
      "//evil.test/practice/workshop",
      "/practice/missing",
      "/teacher?next=evil",
    ])
      expect(practiceReturn(s)).toBe("/");
  });
});

describe("turn in homework", () => {
  const turnedIn = {
    ...blankAssignment(),
    stage: "turnedIn" as const,
    attached: ["schedule" as const],
  };
  it("needs exactly the current schedule attached", () => {
    expect(attachmentErrors(blankAssignment())).toHaveLength(1);
    expect(attachmentErrors(turnedIn)).toEqual([]);
    const old = attachmentErrors({ ...turnedIn, attached: ["schedule-old"] });
    expect(old.map((m) => m.en).join(" ")).toMatch(/last month/);
    expect(old).toHaveLength(1);
    expect(
      attachmentErrors({ ...turnedIn, attached: ["schedule", "photo"] }),
    ).toHaveLength(1);
  });
  it("asks for a full-sentence comment", () => {
    expect(commentError({ ...turnedIn, comment: "Monday" })).not.toBeNull();
    expect(
      commentError({ ...turnedIn, comment: "My busiest day is Friday." }),
    ).toBeNull();
  });
  it("rejects saved states that skip a step or carry unknown files", () => {
    expect(
      parseAssignment({ ...blankAssignment(), stage: "turnedIn" }),
    ).toBeNull();
    expect(parseAssignment({ ...turnedIn, stage: "complete" })).toBeNull();
    expect(
      parseAssignment({ ...turnedIn, attached: ["virus.exe"] }),
    ).toBeNull();
    expect(
      parseAssignment({ ...turnedIn, attached: ["schedule", "schedule"] }),
    ).toBeNull();
    expect(
      parseAssignment({ ...turnedIn, comment: "x".repeat(501) }),
    ).toBeNull();
    expect(parseAssignment({ ...turnedIn, learnerId: "other" })).toEqual(
      turnedIn,
    );
  });
});
describe("every practice activity", () => {
  const all = ACTIVITIES as PracticeActivity<BaseDraft>[];
  it("has unique ids and a blank draft its own parser accepts", () => {
    expect(new Set(all.map((a) => a.id)).size).toBe(all.length);
    for (const a of all) expect(a.parseDraft(a.blank())).toEqual(a.blank());
  });
  it("is fully bilingual, including the teacher guide", () => {
    for (const a of all) {
      const texts = [
        a.title,
        a.summary,
        a.eyebrow,
        a.minutes,
        a.goal,
        a.guide.peerHelp,
        ...a.stages.flatMap((s) => [a.instructions[s], a.help[s]]),
        ...a.details.map((d) => d.label),
        ...a.guide.skills,
        ...a.guide.prepare,
        ...a.guide.stickingPoints,
        ...a.guide.followUp,
      ];
      for (const t of texts) {
        expect(t.en.trim(), a.id).not.toBe("");
        expect(t.es.trim(), a.id).not.toBe("");
      }
    }
  });
  it("includes the homework activity", () => expect(all).toContain(assignment));
});

describe("forgot your password", () => {
  const maya = { ...blankPassword(), account: "maya" as const };
  it("only moves on with Maya's account and the real code", () => {
    expect(
      parsePassword({ ...blankPassword(), account: "sam", stage: "code" }),
    ).toBeNull();
    expect(parsePassword({ ...maya, stage: "code" })).not.toBeNull();
    expect(
      parsePassword({ ...maya, stage: "newPassword", code: "2024" }),
    ).toBeNull();
    expect(
      parsePassword({ ...maya, stage: "complete", code: " 730418 " }),
    ).not.toBeNull();
  });
  it("accepts the code with or without Google's G- prefix", () => {
    expect(codeError({ ...maya, code: "G-730418" })).toBeNull();
    expect(codeError({ ...maya, code: "730418" })).toBeNull();
  });
  it("names the ad's coupon code as a look-alike", () =>
    expect(codeError({ ...maya, code: "2024" })?.en).toMatch(/coupon/));
  it("checks the rules first, then the practice password and the match", () => {
    expect(newPasswordErrors("short1", "short1")[0].en).toMatch(/too weak/);
    expect(newPasswordErrors("MyOwnPass9", "MyOwnPass9")[0].en).toMatch(
      /never a real password/,
    );
    expect(newPasswordErrors(PRACTICE_PASSWORD, "blue-harbor-27")).toHaveLength(
      1,
    );
    expect(newPasswordErrors(PRACTICE_PASSWORD, PRACTICE_PASSWORD)).toEqual([]);
    expect(signinAgainError("blue-harbor-27")).not.toBeNull();
    expect(signinAgainError(PRACTICE_PASSWORD)).toBeNull();
  });
  it("never saves a password, even if one is injected", () => {
    const saved = parsePassword({
      ...maya,
      password: "secret",
      newPassword: "x",
    });
    expect(saved).toEqual(maya);
  });
});

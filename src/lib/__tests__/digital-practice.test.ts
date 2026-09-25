import { describe, it, expect } from "vitest";
import {
  blank,
  errors,
  parseDraft,
  practiceReturn,
  instructions,
} from "../practice/content";
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

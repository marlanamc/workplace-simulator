import { describe, expect, it } from "vitest";
import { practiceEmailMatches } from "@/lib/tasks/account-recovery/content";
import { confidenceProblem, CONFIDENCE_SCENARIOS } from "@/lib/tasks/confidence/content";

describe("fictional sign-in email", () => {
  it("accepts surrounding spaces and case, but requires the complete address", () => {
    expect(practiceEmailMatches(" YOU@HARBORSIDECAFE.COM ")).toBe(true);
    for (const typed of ["", "you", "you@harborsidecafe.co", "you @harborsidecafe.com", "other@harborsidecafe.com"]) expect(practiceEmailMatches(typed)).toBe(false);
  });
  it("requires each fresh scenario's own email even with the right password and code", () => {
    for (const s of Object.values(CONFIDENCE_SCENARIOS["account-recovery"])) {
      expect(confidenceProblem(s, { ...s.expected, email: "" })).not.toBeNull();
      expect(confidenceProblem(s, { ...s.expected, email: "you@harborsidecafe.com" })).not.toBeNull();
      expect(confidenceProblem(s, { ...s.expected, email: s.expected.email.toUpperCase() })).toBeNull();
    }
  });
});

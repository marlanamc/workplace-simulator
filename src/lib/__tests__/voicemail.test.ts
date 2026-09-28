import { describe, expect, it } from "vitest";
import {
  MESSAGE_FIRST,
  PHONE_MESSAGE_CORRECTIONS,
  VOICEMAIL_GLOSS,
  VOICEMAIL_STEP,
  VOICEMAIL_TEXT,
  phoneMessageProblem,
} from "@/lib/tasks/team-schedule/voicemail";
import { CREW } from "@/lib/tasks/crew-week";

/** Wave 4, communication beyond email: Day 14's phone message from a voicemail. */
describe("Day 14 phone message", () => {
  const good = { caller: "Casey Brooks", reason: "Saturday off. Please call to confirm.", callback: "(555) 0137" };

  it.each([
    good,
    { caller: "casey", reason: "sat off", callback: "555 0137" },
    { caller: "Casey", reason: "wedding", callback: "5550137" },
    { caller: "Casey Brooks", reason: "el sábado libre", callback: "555-0137" },
    { caller: "Brooks", reason: "confirmar la boda", callback: "0137" },
  ])("passes a short, complete message: %o", (m) => {
    expect(phoneMessageProblem(m)).toBeNull();
  });

  it("names the first missing field", () => {
    expect(phoneMessageProblem({ ...good, caller: "Renata" })).toBe("caller");
    expect(phoneMessageProblem({ ...good, reason: "call her" })).toBe("reason");
    expect(phoneMessageProblem({ ...good, callback: "555 0173" })).toBe("callback");
    expect(phoneMessageProblem({ caller: "", reason: "", callback: "" })).toBe("caller");
  });

  it("agrees with the schedule: Casey's Saturday is Off", () => {
    expect(CREW.find((m) => m.key === "casey")!.shifts.sat.label).toBe("Off");
    expect(VOICEMAIL_TEXT).toContain("Saturday off");
  });

  it("has every line in both languages, and a Spanish gloss", () => {
    for (const line of [VOICEMAIL_STEP, MESSAGE_FIRST, ...Object.values(PHONE_MESSAGE_CORRECTIONS)]) {
      expect(line.en).not.toBe(line.es);
      expect(line.es.trim()).not.toBe("");
    }
    expect(VOICEMAIL_GLOSS.es).toContain("0137");
  });
});

import { describe, expect, it } from "vitest";
import {
  CAST,
  CAFE_DOMAIN,
  CAFE_NAME,
  COLLEGE_NAME,
  HEALTH_NAME,
  HQ_NAME,
  castByName,
  inboxSender,
} from "@/lib/cast";
import { SIGNATURES, signatureFor } from "@/lib/mail-greeting";

const DOMAIN_BY_ORG: Record<string, string> = {
  [CAFE_NAME]: "harborsidecafe.com",
  [HEALTH_NAME]: "harborsidehealth.com",
  [HQ_NAME]: "harborsidehq.com",
  [COLLEGE_NAME]: "bhcc.edu",
};

describe("cast", () => {
  it("every member has a well-formed email and 2-letter initials", () => {
    for (const m of Object.values(CAST)) {
      expect(m.email, `${m.name} email`).toMatch(/^[^@]+@[^@]+\.[a-z]+$/);
      expect(m.initials, `${m.name} initials`).toMatch(/^[A-Z]{2}$/);
    }
  });

  it("a member's email domain matches their org", () => {
    for (const m of Object.values(CAST)) {
      if (!m.org) {
        // No org set — the cafe is the default home for coworkers.
        expect(m.email.endsWith(`@${CAFE_DOMAIN}`), `${m.name} email`).toBe(true);
        continue;
      }
      const expected = DOMAIN_BY_ORG[m.org];
      expect(expected, `${m.org} has a known domain`).toBeDefined();
      expect(m.email.endsWith(`@${expected}`), `${m.name} email on ${m.org}`).toBe(true);
    }
  });

  it("names are unique", () => {
    const names = Object.values(CAST).map((m) => m.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("castByName round-trips", () => {
    expect(castByName("Maria Delgado")).toBe(CAST.maria);
    expect(castByName("nobody")).toBeUndefined();
  });

  it("inboxSender picks exactly from / initials / color", () => {
    expect(inboxSender(CAST.jordan)).toEqual({
      from: "Jordan Kim",
      initials: "JK",
      color: CAST.jordan.color,
    });
  });
});

describe("mail signatures derive from the cast", () => {
  it("one signature per member with a title, none without", () => {
    for (const m of Object.values(CAST)) {
      if (m.title) {
        expect(signatureFor(m.name), `${m.name} should sign`).toBeDefined();
        expect(SIGNATURES[m.name].email).toBe(m.email);
      } else {
        expect(signatureFor(m.name), `${m.name} should not sign`).toBeUndefined();
      }
    }
  });
});

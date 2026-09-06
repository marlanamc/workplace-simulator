import { describe, expect, it } from "vitest";
import { CAFE_NAME, COLLEGE_NAME, HEALTH_NAME, HQ_NAME } from "@/lib/cast";
import { deskIdentityFor } from "@/lib/desk-identity";
import { ACTS } from "@/lib/tracks-content";

describe("deskIdentityFor", () => {
  it("names cafe roles for Acts I–IV", () => {
    expect(deskIdentityFor("act1").title.en).toBe("New Hire");
    expect(deskIdentityFor("act1").company).toBe(CAFE_NAME);
    expect(deskIdentityFor("act2").title.en).toBe("Shift Lead");
    expect(deskIdentityFor("act3").title.es).toBe("Supervisor de turno");
    expect(deskIdentityFor("act4").company).toBe(CAFE_NAME);
  });

  it("follows the Act V path when chosen", () => {
    expect(deskIdentityFor("act5").company).toBe(CAFE_NAME);
    expect(deskIdentityFor("act5", "a").company).toBe(COLLEGE_NAME);
    expect(deskIdentityFor("act5", "b").title.en).toBe("Front Desk");
    expect(deskIdentityFor("act5", "b").company).toBe(HEALTH_NAME);
  });

  it("moves to HQ for Acts VI–VII", () => {
    expect(deskIdentityFor("act6").company).toBe(HQ_NAME);
    expect(deskIdentityFor("act7").title.en).toBe("Team Lead");
  });

  it("covers every built act", () => {
    for (const act of ACTS) {
      const id = deskIdentityFor(act.key);
      expect(id.title.en.trim()).not.toBe("");
      expect(id.title.es.trim()).not.toBe("");
      expect(id.company.trim()).not.toBe("");
    }
  });
});

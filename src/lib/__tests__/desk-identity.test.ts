import { describe, expect, it } from "vitest";
import { CAFE_NAME, COLLEGE_NAME, HEALTH_NAME, HQ_NAME } from "@/lib/cast";
import { deskIdentityFor } from "@/lib/desk-identity";
import { ACTS } from "@/lib/tracks-content";

describe("deskIdentityFor", () => {
  it("names cafe roles for Acts I–IV", () => {
    expect(deskIdentityFor("act1").title.en).toBe("New Hire");
    expect(deskIdentityFor("act1").company).toBe(CAFE_NAME);
    expect(deskIdentityFor("act2").title.en).toBe("Shift Lead");
    expect(deskIdentityFor("act3").title.es).toBe("Supervisión de turno");
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

  it("keeps the cafe role while the learner is still applying to HQ", () => {
    const applying = deskIdentityFor("act6", null, true);
    expect(applying.company).toBe(CAFE_NAME);
    expect(applying.title.en).toBe("Shift Lead");
    expect(applying.title.en).not.toMatch(/Office Administrator/);
    const earned = deskIdentityFor("act6", null, true, { en: "Assistant Manager", es: "Asistente de gerencia" });
    expect(earned.title.en).toBe("Assistant Manager");
    expect(deskIdentityFor("act6", null, false).title.en).toBe("Office Administrator");
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

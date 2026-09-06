import { describe, expect, it } from "vitest";
import { ACTS } from "@/lib/tracks-content";
import { ACT_INTROS } from "@/lib/act-intro-content";
import { welcomeHomeFor } from "@/lib/welcome-home-content";

describe("welcomeHomeFor", () => {
  it("returns Act I home with cafe practice skills", () => {
    const home = welcomeHomeFor("act1");
    expect(home.role.en).toMatch(/new hire/i);
    expect(home.manager.en).toMatch(/Maria/);
    expect(home.skills.length).toBeGreaterThanOrEqual(3);
    expect(home.packetTitle.en).toContain("Act I");
  });

  it("reuses each later act intro's role, manager, bridge, and skills", () => {
    for (const act of ACTS.filter((a) => a.key !== "act1")) {
      const home = welcomeHomeFor(act.key);
      const intro = ACT_INTROS[act.key as keyof typeof ACT_INTROS];
      expect(home.role).toEqual(intro.role);
      expect(home.manager).toEqual(intro.manager);
      expect(home.bridge).toEqual(intro.bridge);
      expect(home.skills).toEqual(intro.skills);
      expect(home.packetTitle.en).toContain(intro.actLabel.en);
    }
  });

  it("falls back to Act I for an unknown act key", () => {
    expect(welcomeHomeFor("act99").role.en).toEqual(welcomeHomeFor("act1").role.en);
  });
});

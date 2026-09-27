import { describe, expect, it } from "vitest";
import { CODE, FAKE_CODE, RECOVERY_COPY, TEXTS, checkCode } from "@/lib/tasks/account-recovery/content";

describe("account-recovery code box", () => {
  it.each(["482915", "482 915", " 482915 ", "482-915"])("accepts the real code %j", (typed) => {
    expect(checkCode(typed)).toBe("ok");
  });

  // An empty box says it is empty before it says the code is wrong.
  it.each(["", "   "])("reports %j as empty", (typed) => {
    expect(checkCode(typed)).toBe("empty");
  });

  // The number from the lookalike text is the safety mistake, with its own correction.
  it.each(["915482", "915 482"])("flags the fake text's number %j", (typed) => {
    expect(checkCode(typed)).toBe("fake");
  });

  it.each(["482916", "Your verification code is 482915", "48291"])("rejects %j", (typed) => {
    expect(checkCode(typed)).toBe("wrong");
  });
});

describe("account-recovery texts", () => {
  it("has a convincing lookalike: two texts carry a code and both say Google", () => {
    const withCode = TEXTS.filter((t) => /\d{6}/.test(t.body.en));
    expect(withCode).toHaveLength(2);
    expect(withCode.every((t) => t.body.en.includes("Google") && t.body.es.includes("Google"))).toBe(true);
    expect(TEXTS.find((t) => t.isTarget)?.body.en).toContain(CODE);
    expect(TEXTS.find((t) => t.key === "fake")?.body.en).toContain(FAKE_CODE);
  });

  it("names the evidence in every wrong-text correction", () => {
    for (const t of TEXTS.filter((x) => !x.isTarget)) {
      expect(t.wrongHint?.en).toMatch(/phone number|coworker/);
      expect(t.wrongHint?.es).toMatch(/número de teléfono|compañero/);
    }
  });

  it("has the empty and fake corrections in both languages", () => {
    for (const lang of ["en", "es"] as const) {
      expect(RECOVERY_COPY[lang].emptyCode).toBeTruthy();
      expect(RECOVERY_COPY[lang].fakeCode).toBeTruthy();
    }
  });
});

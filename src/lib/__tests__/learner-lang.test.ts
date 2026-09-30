import { describe, expect, it } from "vitest";
import { asLang, langToSaveAtSignIn, resolveLang } from "@/lib/learner-lang";

describe("the learner's language follows the account (Wave 5 F-20)", () => {
  it("reads only a real language from storage", () => {
    expect(asLang("es")).toBe("es");
    expect(asLang("en")).toBe("en");
    for (const junk of [null, undefined, "", "ES", "spanish", "fr", 1, {}]) expect(asLang(junk)).toBeNull();
  });

  it("puts a Spanish learner in Spanish on a fresh, English Chromebook", () => {
    expect(resolveLang({ chosenNow: null, account: "es", device: "en" })).toBe("es");
    expect(resolveLang({ chosenNow: null, account: "es", device: null })).toBe("es");
  });

  it("lets a switch made just now win, and keeps a device choice for a learner with no saved language", () => {
    expect(resolveLang({ chosenNow: "en", account: "es", device: "es" })).toBe("en");
    expect(resolveLang({ chosenNow: null, account: null, device: "es" })).toBe("es");
    expect(resolveLang({ chosenNow: null, account: null, device: null })).toBe("en");
  });

  it("saves the login page's choice on a new account", () => {
    expect(langToSaveAtSignIn({ isNew: true, account: null, loginPage: "es" })).toBe("es");
    expect(langToSaveAtSignIn({ isNew: true, account: null, loginPage: null })).toBe("en");
  });

  it("never lets a shared Chromebook's login page overwrite an account's language", () => {
    // The last learner on this Chromebook left the login page in English.
    expect(langToSaveAtSignIn({ isNew: false, account: "es", loginPage: "en" })).toBeNull();
    expect(langToSaveAtSignIn({ isNew: false, account: "en", loginPage: "es" })).toBeNull();
  });

  it("gives an account from before this the language they sign in with", () => {
    expect(langToSaveAtSignIn({ isNew: false, account: null, loginPage: "es" })).toBe("es");
    expect(langToSaveAtSignIn({ isNew: false, account: null, loginPage: null })).toBeNull();
  });
});

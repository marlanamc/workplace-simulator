import { describe, expect, it } from "vitest";
import { LEVELS, taskKeysForLevel } from "@/lib/tracks-content";
import { storyBodyFor, storyMailsFor } from "@/lib/story-beats";
import {
  firstName,
  mailGreeting,
  signatureFor,
  signatureLines,
  SIGNATURES,
} from "@/lib/mail-greeting";
import { bodyForTask } from "@/lib/tasks/mail/content";
import type { Lang } from "@/lib/task-types";

/**
 * Every email a learner reads models the shape of a real work email: it opens
 * by greeting them by name, and it closes with a sign-off. This is the first
 * thing learners copy when they write their own reply, so a bare "Hi," or a
 * body that just stops is a content bug, not a style preference.
 */

const LANGS: Lang[] = ["en", "es"];
// Only tasks that HAVE an email to read; call-out-sick is composed from scratch.
const MAIL_TASKS = ["mail-reply", "mail-attach"] as const;
const ALL_TASKS = LEVELS.flatMap((l) => taskKeysForLevel(l));

describe("mailGreeting", () => {
  it("uses the learner's first name only", () => {
    expect(mailGreeting("en", "Ana Ramirez")).toBe("Hi Ana,");
    expect(mailGreeting("es", "Ana Ramirez")).toBe("Hola Ana,");
  });

  it("falls back to a warm generic when there is no name", () => {
    expect(mailGreeting("en", "   ")).toBe("Hi there,");
    expect(mailGreeting("es", "")).toBe("Hola,");
  });
});

describe("signature blocks", () => {
  it("Maria signs as the manager, with a way to reach her", () => {
    const sig = signatureFor("Maria Delgado");
    expect(sig).toBeDefined();
    expect(sig!.title.en).toBe("Cafe Manager");
    expect(sig!.title.es).toBe("Gerente del café");
    expect(sig!.phone).toBeTruthy();
  });

  it("every signature is complete in both languages", () => {
    for (const [key, sig] of Object.entries(SIGNATURES)) {
      expect(sig.name, key).toBe(key);
      expect(sig.org, key).toBeTruthy();
      expect(sig.email, key).toMatch(/^[^@\s]+@[^@\s]+\.[a-z]+$/);
      for (const lang of LANGS) {
        expect(sig.title[lang], `${key} title (${lang})`).toBeTruthy();
      }
    }
  });

  it("renders as speakable lines, skipping a phone nobody published", () => {
    expect(signatureLines(signatureFor("Maria Delgado")!, "en")).toEqual([
      "Maria Delgado",
      "Cafe Manager, Harborside Cafe",
      "maria.delgado@harborsidecafe.com",
      "(555) 0142",
    ]);
    expect(signatureLines(signatureFor("Harborside HR")!, "es")).toEqual([
      "Harborside HR",
      "Recursos Humanos, Harborside Cafe",
      "hr@harborsidecafe.com",
    ]);
  });

  it("every story-mail sender that is a person has a signature", () => {
    for (const mail of storyMailsFor(ALL_TASKS, {}).filter((m) => m.body)) {
      expect(signatureFor(mail.from), `no signature for "${mail.from}"`).toBeDefined();
    }
  });
});

describe("Day One mail bodies", () => {
  for (const task of MAIL_TASKS) {
    for (const lang of LANGS) {
      it(`${task} (${lang}) greets the learner by name and ends on a closing`, () => {
        const { plain, full } = bodyForTask(task, lang, "Ana Ramirez");
        for (const version of [plain, full]) {
          expect(version[0]).toBe(mailGreeting(lang, "Ana Ramirez"));
          // Ends on a closing line, not mid-thought. The name underneath is
          // the signature block's job, so the body must not retype it.
          expect(version[version.length - 1]).toMatch(/,$/);
          expect(version).not.toContain("Maria");
          expect(version).not.toContain("Maria Delgado");
        }
      });

      it(`${task} (${lang}) never leaves a bare greeting`, () => {
        const { plain, full } = bodyForTask(task, lang, "Ana Ramirez");
        for (const line of [...plain, ...full]) {
          expect(line).not.toBe("Hi,");
          expect(line).not.toBe("Hola,");
        }
      });
    }
  }
});

describe("story mail bodies", () => {
  for (const lang of LANGS) {
    it(`every story mail (${lang}) opens with a greeting and closes`, () => {
      const mails = storyMailsFor(ALL_TASKS, {}).filter((m) => m.body);
      expect(mails.length).toBeGreaterThan(5);
      const closing = lang === "en" ? "Thanks," : "Gracias,";
      for (const mail of mails) {
        const lines = storyBodyFor(mail, lang, "Ana Ramirez");
        expect(lines[0], `story mail "${mail.key}"`).toBe(mailGreeting(lang, "Ana Ramirez"));
        expect(lines, `story mail "${mail.key}"`).toContain(closing);
      }
    });

    it(`a sender with a signature block does not also type their name (${lang})`, () => {
      for (const mail of storyMailsFor(ALL_TASKS, {}).filter((m) => m.body)) {
        const lines = storyBodyFor(mail, lang, "Ana Ramirez");
        const last = lines[lines.length - 1];
        if (signatureFor(mail.from)) {
          expect(last, `story mail "${mail.key}"`).toBe(lang === "en" ? "Thanks," : "Gracias,");
        } else {
          expect(last, `story mail "${mail.key}"`).toBe(firstName(mail.from));
        }
      }
    });

    it(`no story mail thanks the learner twice in a row (${lang})`, () => {
      const thanks = lang === "en" ? "Thank you." : "Gracias.";
      for (const mail of storyMailsFor(ALL_TASKS, {}).filter((m) => m.body)) {
        const lines = storyBodyFor(mail, lang, "Ana Ramirez");
        const closingAt = lines.lastIndexOf(lang === "en" ? "Thanks," : "Gracias,");
        expect(lines[closingAt - 1], `story mail "${mail.key}"`).not.toBe(thanks);
      }
    });
  }
});

import { describe, expect, it } from "vitest";
import { bagVerdict, startTimeVerdict } from "@/lib/tasks/mail/reply-grading";
import { OPENING_CORRECTIONS, OPENING_MESSAGES, openingReplyAccepted, openingReplyVerdict, openingInstruction } from "@/lib/tasks/mail/opening";
import {
  ATTACH_CORRECTIONS,
  CONFIRM_COPY,
  MAIL_JOB_CARD_STEPS,
  SUBJECT_BY_TASK,
  STARTERS,
  attachSendProblem,
  attachStarters,
  saysAttached,
} from "@/lib/tasks/mail/content";

/** mail-reply, message 2: "Your shift tomorrow starts at 10 AM. Can you confirm you will be here?" */
describe("mail-reply: confirming 10 AM", () => {
  it.each([
    "I can come",
    "Of course",
    "Sounds good",
    "No te preocupes, ahí estaré",
    "No te preocupes",
    "Yes",
    "ok",
    "yes i wil be ther",
    "I'll be there at 10",
    "Yes, see you at 10 AM!",
    "No problem, I will be there.",
    "Yes, I will not be late.",
    "I can't wait! See you tomorrow.",
    "Hi Maria, I will be there at 10 AM. Ana",
    "Sí, claro. Ahí estaré a las 10 a. m.",
    "Claro que sí, nos vemos mañana",
    "Por supuesto",
    "Puedo ir",
    "Sin problema",
    "Yes, I'm not new to cafes. I will be there.",
  ])("accepts %j", (text) => {
    expect(startTimeVerdict(text)).toBe("ok");
    expect(openingReplyAccepted("start-time", text)).toBe(true);
  });

  it.each([
    ["Yes, but I will be 10 minutes late", "late"],
    ["ok but a little late", "late"],
    ["Sí, pero llego tarde", "late"],
    ["No", "declines"],
    ["No, sorry", "declines"],
    ["I can't come", "declines"],
    ["I won't be there", "declines"],
    ["I will not come tomorrow", "declines"],
    ["Sorry, I'm sick", "declines"],
    ["No puedo ir", "declines"],
    ["No voy a poder", "declines"],
    ["Yes, I will be there at 11", "other-time"],
    ["See you at 10:30 am", "other-time"],
    ["Maybe", "unclear"],
    ["Where is it?", "unclear"],
    ["Coffee", "unclear"],
    ["Hi Maria, I ___ be there at 10 AM.", "blank"],
    ["   ", "empty"],
  ] as const)("rejects %j as %s", (text, reason) => {
    expect(startTimeVerdict(text)).toBe(reason);
  });
});

/** mail-reply, message 3: Darnell asks where the learner will put the bag. */
describe("mail-reply: where the bag goes", () => {
  it.each([
    "On the shelf",
    "Under the counter.",
    "undr the conter",
    "I will put it on the shelf, no problem",
    "Don't worry, I'll put it under the counter.",
    "Thanks! I will not forget. It goes on the shelf.",
    "Debajo del mostrador",
    "No te preocupes, la dejo en el estante.",
  ])("accepts %j", (text) => {
    expect(bagVerdict(text)).toBe("ok");
  });

  it.each([
    ["In the storage room", "wrong-place"],
    ["On the counter", "wrong-place"],
    ["OK thanks", "wrong-place"],
    ["I won't put it under the counter", "negated"],
    ["I cannot leave it under the counter", "negated"],
    ["No están debajo del mostrador", "negated"],
    ["Hi Darnell, I will put my bag ___.", "blank"],
  ] as const)("rejects %j as %s", (text, reason) => {
    expect(bagVerdict(text)).toBe(reason);
  });
});

describe("mail-reply: corrections and starters", () => {
  it("names what is missing, in both languages, for every refusal", () => {
    for (const [reason, copy] of Object.entries(OPENING_CORRECTIONS)) {
      expect(copy.en, reason).toBeTruthy();
      expect(copy.es, reason).toBeTruthy();
      expect(copy.en).not.toBe(copy.es);
    }
    expect(OPENING_CORRECTIONS.late.en).toMatch(/late/);
    expect(OPENING_CORRECTIONS.declines.en).toMatch(/can't come/);
  });

  it("offers frames that do not pass until the blank is filled", () => {
    for (const m of OPENING_MESSAGES.slice(1)) {
      for (const lang of ["en", "es"] as const) {
        expect(m.frame[lang]).toContain("___");
        expect(openingReplyVerdict(m.id, m.frame[lang])).toBe("blank");
      }
    }
    expect(openingReplyAccepted("start-time", "Hi Maria, I will be there at 10 AM.")).toBe(true);
    expect(openingReplyAccepted("cups", "Hi Darnell, I will put my bag on the shelf.")).toBe(true);
    expect(openingReplyAccepted("start-time", "Hola Maria, estaré allí a las 10 a. m.")).toBe(true);
    expect(openingReplyAccepted("cups", "Hola Darnell, voy a dejar mi bolsa debajo del mostrador.")).toBe(true);
  });

  it("does not say Click Send over a reply that was just refused", () => {
    // MailClient passes "ready to send" (text that differs from the refused text).
    expect(openingInstruction(1, "compose", false, true)).toEqual(OPENING_MESSAGES[1].objective);
    expect(openingInstruction(1, "compose", true, true).en).toBe("Click Send.");
  });
});

describe("mail-attach: the comprehension question", () => {
  it("does not list the right answer first, in either language", () => {
    for (const lang of ["en", "es"] as const) {
      const options = CONFIRM_COPY[lang].options;
      expect(options.filter((o) => o.correct)).toHaveLength(1);
      expect(options[0].correct).toBe(false);
      for (const o of options.filter((x) => !x.correct)) expect(o.hint, o.label).toBeTruthy();
    }
  });

  it("keeps the subject line from settling the question", () => {
    for (const lang of ["en", "es"] as const) {
      const subject = SUBJECT_BY_TASK["mail-attach"][lang].subject.toLowerCase();
      expect(subject).not.toMatch(/certificate|certificado|practice|práctica|today|hoy|week|semana/);
      expect(MAIL_JOB_CARD_STEPS.openMail["mail-attach"][lang].toLowerCase()).not.toMatch(/certificate|certificado|practice|práctica|today|hoy/);
      // Every option is from the food handler training, so the subject rules none of them out.
      for (const o of CONFIRM_COPY[lang].options) expect(o.label.toLowerCase()).toMatch(/food handler|manipulador de alimentos/);
    }
  });
});

describe("mail-attach: sending", () => {
  it("catches 'I attached the file' before a file is attached", () => {
    expect(attachSendProblem("I attached the file to this email.", false)).toBe("not-attached-says-attached");
    expect(attachSendProblem("Adjunté el archivo a este correo.", false)).toBe("not-attached-says-attached");
    expect(attachSendProblem("Hi Maria, here it is.", false)).toBe("not-attached");
    expect(attachSendProblem("", false)).toBe("not-attached");
    expect(attachSendProblem("", true)).toBe("empty");
    expect(attachSendProblem("Hi Maria, here is my ___ certificate.", true)).toBe("blank");
    expect(attachSendProblem("Hi Maria, here is my food handler certificate.", true)).toBeNull();
    for (const c of Object.values(ATTACH_CORRECTIONS)) expect(c.en && c.es).toBeTruthy();
  });

  it("only offers the 'attached' starter once something is attached", () => {
    for (const lang of ["en", "es"] as const) {
      expect(attachStarters(lang, false).some(saysAttached)).toBe(false);
      expect(attachStarters(lang, true)).toEqual(STARTERS["mail-attach"][lang]);
      // The report starter is a frame, not the answer.
      expect(STARTERS["mail-attach"][lang][0]).toContain("___");
    }
  });
});

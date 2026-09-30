import { describe, expect, it } from "vitest";
import { mailDraftFor, mailDraftKey, readMailDraft } from "@/lib/mail-draft";

const good = { view: "compose", step: 3, body: "here is report", attached: true, confirmPick: "The July report", replyAudience: null };
const raw = (v: unknown) => JSON.stringify(v);

describe("Mail drafts (Wave 5 F-7, F-23: a reload keeps the reply)", () => {
  it("reads back what was saved", () => {
    expect(readMailDraft(raw(good))).toEqual(good);
  });

  it("keeps accents, line breaks and Spanish text exactly", () => {
    const body = "Hola Maria,\nestoy enferma. No puedo ir hoy. Sí, lo siento.";
    expect(readMailDraft(raw({ ...good, body }))?.body).toBe(body);
  });

  it("is one draft per learner and per job", () => {
    expect(mailDraftKey("a", "mail-etiquette")).not.toBe(mailDraftKey("b", "mail-etiquette"));
    expect(mailDraftKey("a", "mail-etiquette")).not.toBe(mailDraftKey("a", "call-out-sick"));
    // Studio and Replay clear every `ws-task-draft:<learner>:<task>:` key.
    expect(mailDraftKey("a", "call-out-sick").startsWith("ws-task-draft:a:call-out-sick:")).toBe(true);
  });

  it("never lets a broken or foreign draft into Mail", () => {
    for (const bad of [
      null,
      "",
      "not json",
      "null",
      "[]",
      raw({ ...good, view: "done" }),
      raw({ ...good, view: "story" }),
      raw({ ...good, view: "empty" }),
      raw({ ...good, step: -1 }),
      raw({ ...good, step: 9 }),
      raw({ ...good, step: "3" }),
      raw({ ...good, body: 42 }),
      raw({ ...good, attached: "yes" }),
      raw({ ...good, confirmPick: 3 }),
      raw({ ...good, replyAudience: "everyone" }),
      raw({ value: "a useTaskDraft value, not a mail draft" }),
    ]) {
      expect(readMailDraft(bad), String(bad)).toBeNull();
    }
  });

  it("saves only screens worth coming back to, and leaves the draft alone on the inbox", () => {
    expect(mailDraftFor({ ...good, view: "compose" })?.view).toBe("compose");
    expect(mailDraftFor({ ...good, view: "read" })?.view).toBe("read");
    expect(mailDraftFor({ ...good, view: "confirm" })?.view).toBe("confirm");
    // Back to the inbox, into a story email, or finished: nothing new is saved,
    // so the reply they had started is still there when they come back.
    expect(mailDraftFor({ ...good, view: "empty" })).toBeNull();
    expect(mailDraftFor({ ...good, view: "story" })).toBeNull();
    expect(mailDraftFor({ ...good, view: "done" })).toBeNull();
  });

  it("saves a step that always reads back (the finished step 5 is clamped)", () => {
    const saved = mailDraftFor({ ...good, step: 5 })!;
    expect(saved.step).toBe(4);
    expect(readMailDraft(raw(saved))).toEqual(saved);
  });
});

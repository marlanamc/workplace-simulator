import { describe, expect, it } from "vitest";
import { MARIA_TEXT, TEXT_CORRECTIONS, TEXT_STEPS, textReplyVerdict } from "@/lib/tasks/swap-request/manager-text";
import { ATTACH_CORRECTIONS, CONFIRM_COPY, FILES, LESSONS, STARTERS, SUBJECT_BY_TASK, attachSendProblem, bodyForTask } from "@/lib/tasks/mail/content";
import { DOWNLOAD_PREVIEWS, PDF_DOCUMENTS, type CertificateDoc } from "@/lib/pdf-content";
import { STORY_DAY_BY_LEVEL, storyDate } from "@/lib/story-dates";
import { LEVELS } from "@/lib/tracks-content";
import { TASKS } from "@/lib/tasks/registry";
import type { Lang } from "@/lib/task-types";

/**
 * The owner's Act I notes (30 Sep): Maria's Day 2 text says exactly what to
 * reply; the Night Before ends "Your new manager got your replies."; and a new
 * hire sends their own food handler certificate on Day 2, not the district
 * safety report. These tests try to break each one.
 */

const LANGS: Lang[] = ["en", "es"];

describe("Day 2: Maria's text says what to reply", () => {
  /** The reply Maria asks for, after the colon. */
  const modelReply = (lang: Lang) => MARIA_TEXT[lang].split(": ").pop()!;

  it.each(LANGS)("the reply Maria asks for passes, as written and as a beginner types it (%s)", (lang) => {
    const model = modelReply(lang);
    expect(textReplyVerdict(model)).toBe("ok");
    expect(textReplyVerdict(model.toLowerCase())).toBe("ok");
    // No accents, no punctuation.
    expect(textReplyVerdict(model.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[.,]/g, ""))).toBe("ok");
  });

  it.each(LANGS)("the card line and Maria's text ask for the same words (%s)", (lang) => {
    expect(TEXT_STEPS.read[lang]).toContain(modelReply(lang));
    expect(TEXT_STEPS.reply[lang]).toContain(modelReply(lang));
    expect(TEXT_CORRECTIONS.empty[lang]).toContain(modelReply(lang));
  });

  it("still passes other right answers and refuses wrong ones", () => {
    for (const ok of ["ok thursday 2pm", "yes thurday", "Sí, el jueves", "si jueves 2 pm", "Yes, Thursday is fine."]) {
      expect(textReplyVerdict(ok), ok).toBe("ok");
    }
    expect(textReplyVerdict("Yes, Friday works.")).toBe("wrong-day");
    expect(textReplyVerdict("Sí, el viernes está bien.")).toBe("wrong-day");
    expect(textReplyVerdict("No, Thursday does not work.")).toBe("declines");
    expect(textReplyVerdict("Thursday works")).not.toBe("declines");
  });
});

describe("The Night Before ends with the manager getting the replies", () => {
  const nightBefore = LEVELS.find((l) => l.key === "level2")!.levelUp!;
  it("names what happened, not that Maria 'noticed' the learner", () => {
    expect(nightBefore.title.en).toBe("Your new manager got your replies.");
    expect(nightBefore.title.es).toBe("Tu nueva jefa recibió tus respuestas.");
    for (const lang of LANGS) expect(nightBefore.title[lang]).not.toMatch(/noticed|se fijó/i);
  });
});

describe("Day 2: the new hire sends their food handler certificate", () => {
  const day2 = storyDate(STORY_DAY_BY_LEVEL.level2);
  const certificate = (key: string) => {
    const preview = DOWNLOAD_PREVIEWS[key];
    expect(preview?.kind, key).toBe("pdf");
    const doc = (preview as { doc: CertificateDoc }).doc;
    expect(doc.kind, key).toBe("certificate");
    return doc;
  };
  const expires = (doc: CertificateDoc) => new Date(doc.fields.find((f) => f.label === "Expires")!.value);

  it("the one right file is the current certificate, and it has not expired on Day 2", () => {
    const targets = FILES.filter((f) => f.isTarget);
    expect(targets.map((f) => f.key)).toEqual(["food-handler-certificate.pdf"]);
    const doc = certificate("food-handler-certificate.pdf");
    expect(doc.title).toBe("Food Handler Certificate");
    expect(expires(doc).getTime()).toBeGreaterThan(day2.getTime());
    // Issued before the Night Before: "from your training last week".
    expect(new Date(doc.fields.find((f) => f.label === "Issued")!.value).getTime()).toBeLessThan(day2.getTime());
  });

  it("the look-alikes are each wrong for a reason the page shows", () => {
    const old = certificate("food-handler-certificate-2022.pdf");
    expect(old.title).toBe("Food Handler Certificate");
    expect(expires(old).getTime()).toBeLessThan(day2.getTime());
    const practice = DOWNLOAD_PREVIEWS["food-handler-practice-test.pdf"];
    expect(practice?.kind === "pdf" && practice.stamp).toBe("PRACTICE");
    expect(certificate("food-handler-practice-test.pdf").title).toMatch(/Practice Test/);
    expect(certificate("food-handler-practice-test.pdf").fields.some((f) => f.label === "Expires")).toBe(false);
    // Every wrong file has a correction, in both languages, and a preview.
    for (const f of FILES.filter((f) => !f.isTarget)) {
      expect(f.wrongHint?.en, f.key).toBeTruthy();
      expect(f.wrongHint?.es, f.key).toBeTruthy();
      expect(DOWNLOAD_PREVIEWS[f.key], f.key).toBeDefined();
    }
  });

  it("the question has one right answer, not listed first, and each wrong one points back at the email", () => {
    for (const lang of LANGS) {
      const options = CONFIRM_COPY[lang].options;
      expect(options.filter((o) => o.correct)).toHaveLength(1);
      expect(options[0].correct).toBe(false);
      for (const o of options.filter((o) => !o.correct)) expect(o.hint, o.label).toMatch(/Read|Lee/);
    }
  });

  it.each(LANGS)("Maria's email says everything the question and the picker check (%s)", (lang) => {
    const email = bodyForTask("mail-attach", lang, "Ana").plain.join(" ");
    const [certificateWord, practiceWord, whenWord, expiredWord] =
      lang === "en" ? ["food handler certificate", "practice test", "3 PM", "expired"] : ["certificado de manipulador de alimentos", "examen de práctica", "3 PM", "vencido"];
    for (const word of [certificateWord, practiceWord, whenWord, expiredWord]) expect(email).toContain(word);
  });

  it("the Spanish lines name the English words printed on the page", () => {
    const help = LESSONS.es.find((l) => l.t === "Adjuntar un archivo")!.s.join(" ");
    for (const word of ["Food Handler Certificate", "Expires"]) expect(help).toContain(word);
  });

  it("the reply frame still has a blank to fill, and a filled one sends", () => {
    for (const lang of LANGS) {
      const frame = STARTERS["mail-attach"][lang][0];
      expect(attachSendProblem(frame, true)).toBe("blank");
      expect(attachSendProblem(frame.replace("___", lang === "en" ? "food handler" : "manipulador de alimentos"), true)).toBeNull();
    }
    expect(ATTACH_CORRECTIONS.blank.en).toBeTruthy();
  });

  it("nothing in the story or the lesson still asks a new hire for the district safety report", () => {
    const texts = [
      ...LANGS.flatMap((lang) => [SUBJECT_BY_TASK["mail-attach"][lang].subject, SUBJECT_BY_TASK["mail-attach"][lang].preview, ...bodyForTask("mail-attach", lang, "Ana").plain]),
      ...LANGS.flatMap((lang) => CONFIRM_COPY[lang].options.map((o) => o.label)),
      ...FILES.flatMap((f) => [f.key, f.wrongHint?.en ?? "", f.wrongHint?.es ?? ""]),
      ...PDF_DOCUMENTS.map((d) => d.name),
      JSON.stringify(TASKS["mail-attach"]),
    ].join(" \n ");
    expect(texts).not.toMatch(/safety report|reporte de seguridad|district|distrito|July report|reporte de julio/i);
  });
});

import { describe, expect, it } from "vitest";
import { startTimeVerdict, bagVerdict } from "@/lib/tasks/mail/reply-grading";
import { textReplyVerdict, TEXT_CORRECTIONS } from "@/lib/tasks/swap-request/manager-text";
import { attachSendProblem, mailEtiquetteAnswersDarnell, saysAttached, sickCallVerdict } from "@/lib/tasks/mail/content";
import { clockNoteVerdict } from "@/lib/tasks/timeclock/content";
import { shiftSummaryIsComplete } from "@/lib/tasks/shift-review/content";

/**
 * Act I fix-up, Phase 1 step 4: every Act I writing check, attacked with
 * what real beginners type. Four kinds of attack, each in English and
 * Spanish: accents (and none), negation, misspellings, and plausible wrong
 * answers. A false "no" is the worst outcome, since a learner working alone
 * cannot argue with it; a false "yes" teaches the wrong thing.
 */

describe("The Night Before: Maria's 10 AM question", () => {
  it.each([
    "Yes, I will be there at 10.",
    "yes i come 10 am",
    "Sí, ahí estaré a las 10.",
    "si, ahi estare",
    "Claro que sí. Nos vemos mañana.",
    "No problem, I can come.",
    "ok see you tomorow",
  ])("accepts: %s", (reply) => expect(startTimeVerdict(reply)).toBe("ok"));

  it.each([
    ["I can't come tomorrow.", "declines"],
    ["i no can come", "declines"],
    ["No puedo ir mañana.", "declines"],
    ["Yes, but I'll be 10 minutes late.", "late"],
    ["Sí, pero llego tarde.", "late"],
    ["yes at 11", "other-time"],
    ["Sí, a las 9.", "other-time"],
    ["maybe", "unclear"],
    ["No estoy segura.", "unclear"],
  ])("does not accept: %s", (reply, verdict) => expect(startTimeVerdict(reply)).toBe(verdict));
});

describe("The Night Before: Darnell's bag question", () => {
  it.each([
    "I will put it on the shelf under the counter.",
    "under the conter",
    "Debajo del mostrador.",
    "la dejo en el estante",
  ])("accepts: %s", (reply) => expect(bagVerdict(reply)).toBe("ok"));

  it.each([
    ["I will not put it under the counter.", "negated"],
    ["No la voy a dejar debajo del mostrador.", "negated"],
    ["In my car.", "wrong-place"],
    ["En la cocina.", "wrong-place"],
  ])("does not accept: %s", (reply, verdict) => expect(bagVerdict(reply)).toBe(verdict));
});

describe("Day 2: the text to Maria (Wave 5 F-1)", () => {
  it.each([
    // Accents: every one of these was refused with "Start with Sí".
    "Sí, el jueves",
    "Sí jueves",
    "Sí, ahí estaré el jueves",
    "Sí, a las 2.",
    "Sí, el jueves de 2 a 10 está bien.",
    // No accents, and beginner English.
    "si jueves",
    "yes thursday 2 ok",
    "ok thursday",
    "Thank you Maria. See you Thursday.",
    "thursday works",
    "yes 2 pm",
    "yes, 14:00",
    // Misspelled day: it was refused with "Say the day or the time too".
    "yes thurday",
    "yes thrusday",
    "ok thursay",
    "si juves",
    "No problem, Thursday is fine.",
  ])("accepts: %s", (reply) => expect(textReplyVerdict(reply)).toBe("ok"));

  it.each([
    // A different day is the wrong shift; it passed because "10" counted.
    ["yes, Friday 10 AM", "wrong-day"],
    ["yes see you monday 10", "wrong-day"],
    ["Sí, el viernes.", "wrong-day"],
    // A beginner no, and a negated yes.
    ["ok but i no can thursday", "declines"],
    ["I can't work Thursday", "declines"],
    ["No puedo el jueves", "declines"],
    ["not ok thursday", "declines"],
    ["El jueves no me funciona.", "declines"],
    // Not sure is not yes.
    ["maybe thursday", "no-yes"],
    ["Tal vez el jueves", "no-yes"],
    ["Thursday 2 PM", "no-yes"],
    // A yes with nothing that shows she read it; the end time alone does not.
    ["ok thanks", "no-detail"],
    ["Sí, gracias", "no-detail"],
    ["yes until 10", "no-detail"],
    ["   ", "empty"],
  ])("does not accept: %s", (reply, verdict) => expect(textReplyVerdict(reply)).toBe(verdict));

  it("has a correction for every verdict, in both languages", () => {
    for (const line of Object.values(TEXT_CORRECTIONS)) {
      expect(line.en.trim()).not.toBe("");
      expect(line.es.trim()).not.toBe("");
      expect(line.en).not.toBe(line.es);
    }
  });
});

describe("Day 2: the attachment email", () => {
  it("sends once the file is attached and one line is written, in any words", () => {
    expect(attachSendProblem("here is report", true)).toBeNull();
    expect(attachSendProblem("aquí está el reporte", true)).toBeNull();
  });
  it("catches saying it is attached before it is, but not a negated attach", () => {
    expect(attachSendProblem("The report is attached.", false)).toBe("not-attached-says-attached");
    expect(attachSendProblem("Te adjunto el reporte.", false)).toBe("not-attached-says-attached");
    expect(saysAttached("I did not attach it yet.")).toBe(false);
    expect(attachSendProblem("here is report", false)).toBe("not-attached");
    expect(attachSendProblem("   ", true)).toBe("empty");
  });
});

describe("Day 3: the note about the clock-in", () => {
  it.each([
    "hi maria i come 7. clock say 8:15. sorry",
    "I got here at 7:00 AM.",
    "i arrive 7am",
    "I came at seven.",
    "hola maria llegué a las 7 pero el reloj dice 8:15",
    "Llegué a las siete.",
    "llegue 7:00",
  ])("accepts: %s", (note) => expect(clockNoteVerdict(note)).toBe("ok"));

  it.each([
    "hi maria. clock is wrong",
    "El reloj está mal.",
    "I came at 8:15.",
    "I came at 7:30.",
    "I was 7 minutes late.",
    "",
  ])("asks for the arrival time: %s", (note) => expect(clockNoteVerdict(note)).not.toBe("ok"));
});

describe("Day 3: the shift note", () => {
  it.each([
    // Every one of the first four was refused before: `\b11\b` never ends before "am".
    ["It was busy at 11am.", "en"],
    ["Busy at 11AM today", "en"],
    ["a las 11h hubo mucha gente", "es"],
    ["Se puso ocupado a las 11.00.", "es"],
    ["It was busy at 11 AM.", "en"],
    ["it was bussy at 11", "en"],
    ["Rush around eleven.", "en"],
    ["Se puso ocupado a las once.", "es"],
    ["Estuvo tranquilo, pero a las 11 se llenó.", "es"],
    ["It was calm, but at 11 it got busy.", "en"],
  ] as const)("accepts: %s", (note, lang) => expect(shiftSummaryIsComplete(note, lang)).toBe(true));

  it.each([
    ["It was not busy at 11.", "en"],
    ["A las 11 no estuvo ocupado.", "es"],
    ["It cost $11 for lunch.", "en"],
    ["I took an 11 minute break.", "en"],
    ["It got busy once around lunch today.", "en"],
    ["The shift ran smoothly today.", "en"],
    ["11 am", "en"],
  ] as const)("does not accept: %s", (note, lang) => expect(shiftSummaryIsComplete(note, lang)).toBe(false));
});

describe("Day 4: where the extra aprons are", () => {
  it.each([
    "hi darnell. apron is in storage room",
    "In the storage room.",
    "They are in the stockroom.",
    "storag room",
    "in the store room",
    "Hola Darnell, están en el almacén.",
    "estan en el almacen",
    "En el depósito.",
    "No, they are in the storage room.",
  ])("accepts: %s", (reply) => expect(mailEtiquetteAnswersDarnell(reply)).toBe(true));

  it.each([
    "They are not in the storage room.",
    "No están en el almacén.",
    "ok gracias",
    "yes we have",
    "I left the aprons in the kitchen.",
    "I placed a supply order this morning.",
  ])("does not accept: %s", (reply) => expect(mailEtiquetteAnswersDarnell(reply)).toBe(false));
});

describe("Day 5: the sick call", () => {
  it.each([
    "I am sick. I no come today.",
    "i cant come tody",
    "hi maria i am sick. i can't come to work",
    "Hola Maria, estoy enferma. No puedo ir hoy.",
    "no puedo trabajar esta mañana",
    "I won't be able to work my shift.",
  ])("accepts: %s", (reply) => expect(sickCallVerdict(reply)).toBe("ok"));

  it.each([
    // Tomorrow is not today's shift; it passed because it named "work".
    ["I can't come to work tomorrow.", "no-day"],
    ["No puedo ir a trabajar mañana.", "no-day"],
    ["I cannot come.", "no-day"],
    // Sick, but not saying they will not come.
    ["hi maria i am sick", "no-absence"],
    ["Hola Maria, estoy enferma.", "no-absence"],
    ["I can come today.", "no-absence"],
    ["I can't wait to come today.", "no-absence"],
  ])("does not accept: %s", (reply, verdict) => expect(sickCallVerdict(reply)).toBe(verdict));
});

import { describe, expect, it } from "vitest";
import { MARIA_TEXT, TEXT_CORRECTIONS, TEXT_STEPS, textReplyVerdict } from "@/lib/tasks/swap-request/manager-text";

/** Wave 4, communication beyond email: Day 2's reply to Maria's text. */
describe("Day 2 manager text reply", () => {
  it.each([
    "Yes, Thursday 2 to 10 works.",
    "ok thursday",
    "Yes I can work 2 PM",
    "Thank you Maria. See you Thursday.",
    "yes thu 2-10",
    "Sí, el jueves de 2 a 10 está bien.",
    "si puedo el jueves",
    "Gracias, nos vemos el jueves a las 2",
  ])("passes a short yes with the day or time: %s", (reply) => {
    expect(textReplyVerdict(reply)).toBe("ok");
  });

  it("asks for the day or time when the reply is only a yes", () => {
    expect(textReplyVerdict("ok thanks")).toBe("no-detail");
    expect(textReplyVerdict("Sí, gracias")).toBe("no-detail");
  });

  it("asks for a yes when the reply only repeats the time", () => {
    expect(textReplyVerdict("Thursday 2 PM")).toBe("no-yes");
  });

  it("does not pass a refusal or an empty reply", () => {
    expect(textReplyVerdict("I can't work Thursday")).toBe("declines");
    expect(textReplyVerdict("No puedo el jueves")).toBe("declines");
    expect(textReplyVerdict("   ")).toBe("empty");
  });

  it("has every line in both languages", () => {
    for (const line of [MARIA_TEXT, TEXT_STEPS.read, TEXT_STEPS.reply, ...Object.values(TEXT_CORRECTIONS)]) {
      expect(line.en).not.toBe(line.es);
      expect(line.es.trim()).not.toBe("");
    }
  });
});

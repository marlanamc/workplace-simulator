import { describe, expect, it } from "vitest";
import { readDraft } from "@/lib/task-draft";

const stored = (value: unknown) => JSON.stringify({ value });

describe("readDraft", () => {
  it("returns the saved text for a text field", () => {
    expect(readDraft(stored("- Saturday close\n- Delivery"), "")).toBe("- Saturday close\n- Delivery");
  });

  it("keeps saved list and record drafts (résumé bullets, interview answers)", () => {
    expect(readDraft(stored(["Opened the cafe", "Closed out"]), [] as string[])).toEqual(["Opened the cafe", "Closed out"]);
    expect(readDraft(stored({ q1: "I like people." }), {} as Record<string, string>)).toEqual({ q1: "I like people." });
  });

  it("accepts null or a plain value for a nullable field", () => {
    expect(readDraft(stored(null), null as string | null)).toBeNull();
    expect(readDraft(stored("tue-2pm"), null as string | null)).toBe("tue-2pm");
    expect(readDraft(stored({ x: 1 }), null as string | null)).toBeNull();
  });

  it("falls back to the seed for a draft of the wrong shape", () => {
    expect(readDraft(stored(3), "")).toBe("");
    expect(readDraft(stored("text"), [] as string[])).toEqual([]);
    expect(readDraft(stored(["a"]), {} as Record<string, string>)).toEqual({});
    expect(readDraft(stored(null), false)).toBe(false);
  });

  it("falls back to the seed when nothing usable is stored", () => {
    expect(readDraft(null, "seed")).toBe("seed");
    expect(readDraft("{not json", "seed")).toBe("seed");
    expect(readDraft(JSON.stringify({ other: 1 }), 0)).toBe(0);
    expect(readDraft("null", 0)).toBe(0);
  });
});

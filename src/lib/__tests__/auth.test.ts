import { beforeAll, describe, expect, it } from "vitest";
import { normalizeLearnerName } from "@/lib/db/queries";

/**
 * The session cookie and PIN hashing are hand-rolled (no auth library), so the
 * guarantees they make are only as good as these tests. Nothing here touches
 * next/headers - the cookie wrappers are thin, and the crypto below them is
 * what actually protects a learner's account on a shared classroom device.
 */

// sign() reads SESSION_SECRET at call time, so set it before importing.
process.env.SESSION_SECRET ??= "test-secret-not-the-real-one";

let encodeSession: (id: string) => string;
let decodeSession: (token: string) => string | null;
let hashPin: (pin: string) => Promise<string>;
let verifyPin: (pin: string, stored: string) => Promise<boolean>;

beforeAll(async () => {
  ({ encodeSession, decodeSession, hashPin, verifyPin } = await import("@/lib/auth"));
});

describe("session tokens", () => {
  it("round-trips a learner id", () => {
    expect(decodeSession(encodeSession("learner-123"))).toBe("learner-123");
  });

  it("round-trips ids containing a dot (the token's own separator)", () => {
    // decodeSession splits on the LAST dot; an id with dots must survive.
    const id = "learner.with.dots";
    expect(decodeSession(encodeSession(id))).toBe(id);
  });

  it("rejects a token whose learner id was swapped", () => {
    const stolen = encodeSession("learner-123");
    const tampered = `learner-999.${stolen.split(".").pop()}`;
    expect(decodeSession(tampered)).toBeNull();
  });

  it("rejects a token whose signature was altered", () => {
    const token = encodeSession("learner-123");
    const dot = token.lastIndexOf(".");
    const sig = token.slice(dot + 1);
    // Flip one character of the signature, keeping the length identical.
    const flipped = (sig[0] === "a" ? "b" : "a") + sig.slice(1);
    expect(decodeSession(`${token.slice(0, dot)}.${flipped}`)).toBeNull();
  });

  it("rejects malformed tokens instead of throwing", () => {
    for (const token of ["", "no-dot-here", ".", "learner-123."]) {
      expect(decodeSession(token), token).toBeNull();
    }
  });

  it("does not accept an unsigned id", () => {
    expect(decodeSession("learner-123")).toBeNull();
  });
});

describe("PIN hashing", () => {
  it("verifies the right PIN", async () => {
    expect(await verifyPin("1234", await hashPin("1234"))).toBe(true);
  });

  it("rejects the wrong PIN", async () => {
    const stored = await hashPin("1234");
    expect(await verifyPin("1235", stored)).toBe(false);
    expect(await verifyPin("", stored)).toBe(false);
  });

  it("salts, so the same PIN hashes differently every time", async () => {
    // Two learners picking 1234 must not share a stored value.
    expect(await hashPin("1234")).not.toBe(await hashPin("1234"));
  });

  it("rejects a malformed stored value instead of throwing", async () => {
    for (const stored of ["", "nosalt", "only.one.extra"]) {
      expect(await verifyPin("1234", stored), stored).toBe(false);
    }
  });
});

describe("matching a learner to their existing account", () => {
  it("treats a differently-cased or padded name as the same person", () => {
    // The whole point: signing up as "Ana" and later typing "ana" used to
    // create a second, empty account instead of unlocking the first.
    for (const typed of ["Ana", "ana", "ANA", " Ana ", "\tana\n"]) {
      expect(normalizeLearnerName(typed), typed).toBe("ana");
    }
  });

  it("still keeps genuinely different names apart", () => {
    expect(normalizeLearnerName("Ana")).not.toBe(normalizeLearnerName("Anna"));
    expect(normalizeLearnerName("Jo")).not.toBe(normalizeLearnerName("Joe"));
    // Two words stay two words — SQL `trim()` does not collapse the middle,
    // so neither may this, or the two sides of the comparison would disagree.
    expect(normalizeLearnerName("Ana Maria")).toBe("ana maria");
    expect(normalizeLearnerName("Ana  Maria")).not.toBe("ana maria");
  });
});

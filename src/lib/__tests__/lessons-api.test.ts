import { beforeEach, describe, it, expect, vi } from "vitest";
const m = vi.hoisted(() => ({
  session: vi.fn(),
  select: vi.fn(),
  from: vi.fn(),
  where: vi.fn(),
  insert: vi.fn(),
  values: vi.fn(),
  upsert: vi.fn(),
}));
vi.mock("@/lib/auth", () => ({ getSessionLearnerId: m.session }));
vi.mock("@/lib/db/client", () => ({ getDb: () => ({ select: m.select, insert: m.insert }) }));
import { GET, PUT } from "@/app/api/lessons/route";
import { mergeAttempts, parseAttempt, recordFinish, type LessonAttempt } from "../lessons/attempts";
import { safeReturn } from "../lessons/return";

beforeEach(() => {
  vi.resetAllMocks();
  m.session.mockResolvedValue("owner");
  m.select.mockReturnValue({ from: m.from });
  m.from.mockReturnValue({ where: m.where });
  m.where.mockResolvedValue([]);
  m.insert.mockReturnValue({ values: m.values });
  m.values.mockReturnValue({ onConflictDoUpdate: m.upsert });
  m.upsert.mockResolvedValue(undefined);
});

const done = recordFinish(null, "guided", "2026-09-25T10:00:00.000Z");
const put = (body: unknown, { origin = "https://l.test", lesson = "account-recovery" } = {}) =>
  new Request(`https://l.test/api/lessons?lesson=${lesson}`, {
    method: "PUT",
    headers: { origin, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

describe("/api/lessons", () => {
  it("serves guests without touching the database", async () => {
    m.session.mockResolvedValue(null);
    expect(await (await GET(new Request("https://l.test/api/lessons?lesson=account-recovery"))).json()).toEqual({ signedIn: false });
    expect(m.select).not.toHaveBeenCalled();
  });
  it("lists the learner's finished lessons without ?lesson=", async () => {
    m.where.mockResolvedValue([
      { activityId: "account-recovery", state: done },
      { activityId: "w4-form", state: { ...done, attempts: 0 } },
      { activityId: "not-a-lesson", state: done },
    ]);
    expect(await (await GET(new Request("https://l.test/api/lessons"))).json()).toEqual({ signedIn: true, owner: "owner", done: ["account-recovery"] });
    m.session.mockResolvedValue(null);
    expect(await (await GET(new Request("https://l.test/api/lessons"))).json()).toEqual({ signedIn: false });
  });
  it("rejects unknown lessons, cross-origin, and signed-out writes", async () => {
    expect((await PUT(put(done, { lesson: "tour" }))).status).toBe(400);
    expect((await PUT(put(done, { origin: "https://evil.test" }))).status).toBe(403);
    m.session.mockResolvedValue(null);
    expect((await PUT(put(done))).status).toBe(401);
    expect(m.insert).not.toHaveBeenCalled();
  });
  it("rejects a malformed attempt", async () => {
    expect((await PUT(put({ ...done, attempts: -1 }))).status).toBe(400);
    expect((await PUT(put({ ...done, mode: "cheat" }))).status).toBe(400);
  });
  it("saves the attempt under the task key for the session owner", async () => {
    expect((await PUT(put(done))).status).toBe(200);
    expect(m.values).toHaveBeenCalledWith({ learnerId: "owner", activityId: "account-recovery", version: 1, state: done });
  });
  it("reports a database failure as 503, not success", async () => {
    m.upsert.mockRejectedValue(new Error("down"));
    expect((await PUT(put(done))).status).toBe(503);
  });
});

describe("lesson attempts", () => {
  it("counts finishes and keeps the support used", () => {
    const two = recordFinish(done, "independent", "2026-09-25T11:00:00.000Z");
    expect(two).toMatchObject({ attempts: 2, mode: "independent", modes: ["guided", "independent"] });
    expect(parseAttempt(two)).toEqual(two);
  });
  it("adds a guest's finishes to the account's on sign-in", () => {
    const guest: LessonAttempt = recordFinish(null, "independent", "2026-09-25T12:00:00.000Z");
    expect(mergeAttempts(done, guest)).toMatchObject({ attempts: 2, mode: "independent", completedAt: guest.completedAt });
    expect(mergeAttempts(null, guest)).toEqual(guest);
    expect(mergeAttempts(done, null)).toEqual(done);
  });
});

describe("safeReturn", () => {
  it("allows our own pages and lessons with known params", () => {
    expect(safeReturn("/teacher")).toBe("/teacher");
    expect(safeReturn("/lessons?skill=email&lang=es")).toBe("/lessons?lang=es&skill=email");
    expect(safeReturn("/lessons/account-recovery?mode=independent&lang=es&transfer=1&x=1")).toBe(
      "/lessons/account-recovery?mode=independent&lang=es&transfer=1",
    );
  });
  it.each(["https://evil.test/lessons", "//evil.test/lessons", "/lessons/tour", "/lessons/../admin", "/practice/password", "", null])(
    "sends %s home",
    (raw) => {
      expect(safeReturn(raw)).toBe("/");
    },
  );
});

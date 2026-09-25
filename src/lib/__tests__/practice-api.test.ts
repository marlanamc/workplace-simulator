import { beforeEach, it, expect, vi } from "vitest";
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
vi.mock("@/lib/db/client", () => ({
  getDb: () => ({ select: m.select, insert: m.insert }),
}));
import { GET, PUT } from "@/app/api/practice/route";
import { blank } from "../practice/content";
beforeEach(() => {
  vi.resetAllMocks();
  m.session.mockResolvedValue("authenticated-owner");
  m.select.mockReturnValue({ from: m.from });
  m.from.mockReturnValue({ where: m.where });
  m.where.mockResolvedValue([]);
  m.insert.mockReturnValue({ values: m.values });
  m.values.mockReturnValue({ onConflictDoUpdate: m.upsert });
  m.upsert.mockResolvedValue(undefined);
});
const req = (body: unknown, origin = "https://practice.test") =>
  new Request("https://practice.test/api/practice", {
    method: "PUT",
    headers: { origin, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
it("serves guests without querying the database", async () => {
  m.session.mockResolvedValue(null);
  expect(await (await GET()).json()).toEqual({ signedIn: false });
  expect(m.select).not.toHaveBeenCalled();
});
it("rejects unsigned writes and cross-origin requests", async () => {
  m.session.mockResolvedValue(null);
  expect((await PUT(req(blank()))).status).toBe(401);
  expect((await PUT(req(blank(), "https://other.test"))).status).toBe(403);
  expect(m.insert).not.toHaveBeenCalled();
});
it("uses authenticated ownership and only the practice table", async () => {
  expect((await PUT(req({ ...blank(), learnerId: "victim" }))).status).toBe(
    200,
  );
  expect(m.values).toHaveBeenCalledWith(
    expect.objectContaining({
      learnerId: "authenticated-owner",
      activityId: "workshop",
      version: 1,
      state: blank(),
    }),
  );
});
it("rejects invalid completion", async () => {
  expect((await PUT(req({ ...blank(), stage: "complete" }))).status).toBe(400);
  expect(m.insert).not.toHaveBeenCalled();
});
it("reports database errors rather than false success", async () => {
  m.upsert.mockRejectedValue(new Error("offline"));
  expect((await PUT(req(blank()))).status).toBe(503);
  m.where.mockRejectedValue(new Error("offline"));
  expect((await GET()).status).toBe(503);
});

import { afterEach, expect, it, vi } from "vitest";
const m = vi.hoisted(() => ({
  find: vi.fn(),
  create: vi.fn(),
  cookie: vi.fn(),
}));
vi.mock("@/lib/db/queries", () => ({
  findLearner: m.find,
  createLearner: m.create,
}));
vi.mock("@/lib/auth", () => ({
  setSessionCookie: m.cookie,
  hashPin: vi.fn(),
  verifyPin: vi.fn(),
}));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
import { loginOrSignup } from "@/app/login/actions";
const form = () => {
  const f = new FormData();
  f.set("displayName", "Ana");
  f.set("pin", "1234");
  f.set("classCode", "HARBOR-1");
  return f;
};
afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});
it("refuses every sign-in while LOGINS_PAUSED is true, before touching the database", async () => {
  vi.stubEnv("LOGINS_PAUSED", "true");
  expect(await loginOrSignup({ error: null }, form())).toEqual({ error: "paused" });
  expect(m.find).not.toHaveBeenCalled();
  expect(m.create).not.toHaveBeenCalled();
  expect(m.cookie).not.toHaveBeenCalled();
});
it("signs in normally when the flag is not set", async () => {
  m.find.mockResolvedValue(null);
  m.create.mockResolvedValue({ id: "new" });
  await loginOrSignup({ error: null }, form());
  expect(m.cookie).toHaveBeenCalledWith("new");
});

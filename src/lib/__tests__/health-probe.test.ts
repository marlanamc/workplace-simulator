import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * `/api/health` is the only thing watching production between deploys
 * (`.github/workflows/production-health.yml` pings it every 30 minutes), so
 * what it *fails* on is the whole point.
 *
 * It used to run `SELECT 1`, which passes against a database missing every
 * application table. That blind spot was real, not theoretical: the `role`
 * column was added to `schema.ts` on 2026-09-05 and never pushed to the e2e
 * database, so every sign-in threw `column "role" does not exist` while the
 * probe stayed green — until the first full CI run of the browser suite
 * surfaced it months later.
 *
 * These cases pin the two failures the probe has to catch and the one it must
 * not invent. The database-shaped cases stub the driver; the real schema
 * comparison is exercised against Postgres in the e2e run.
 */

const execute = vi.fn();
vi.mock("@/lib/db/client", () => ({ getDb: () => ({ execute }) }));

/** Every column the app's schema declares, as information_schema would report it. */
async function fullSchemaRows() {
  const { getTableColumns, getTableName } = await import("drizzle-orm");
  const schema = await import("@/lib/db/schema");
  const tables = [
    schema.learners,
    schema.taskCompletions,
    schema.skillRungs,
    schema.badges,
    schema.submissions,
  ];
  return tables.flatMap((table) =>
    Object.values(getTableColumns(table)).map((column) => ({
      table_name: getTableName(table),
      column_name: column.name,
    })),
  );
}

async function probe() {
  const { GET } = await import("@/app/api/health/route");
  const response = await GET();
  return { status: response.status, body: await response.json() };
}

let savedSecret: string | undefined;

beforeEach(() => {
  vi.resetModules();
  execute.mockReset();
  savedSecret = process.env.SESSION_SECRET;
  process.env.SESSION_SECRET = "test-secret-not-the-real-one";
});

afterEach(() => {
  if (savedSecret === undefined) delete process.env.SESSION_SECRET;
  else process.env.SESSION_SECRET = savedSecret;
});

describe("the health probe", () => {
  it("is green when the database matches the schema", async () => {
    execute.mockResolvedValue({ rows: await fullSchemaRows() });
    const { status, body } = await probe();
    expect(status).toBe(200);
    expect(body).toMatchObject({ ok: true, db: "ok", auth: "ok" });
  });

  it("fails and names the column when one is missing", async () => {
    // Exactly the CI failure: `learners.role` absent, everything else present.
    const rows = (await fullSchemaRows()).filter(
      (r) => !(r.table_name === "learners" && r.column_name === "role"),
    );
    execute.mockResolvedValue({ rows });
    const { status, body } = await probe();
    expect(status).toBe(503);
    expect(body.db).toBe("schema-drift");
    expect(body.missing).toEqual(["learners.role"]);
  });

  it("fails and names a table that does not exist at all", async () => {
    const rows = (await fullSchemaRows()).filter((r) => r.table_name !== "submissions");
    execute.mockResolvedValue({ rows });
    const { status, body } = await probe();
    expect(status).toBe(503);
    expect(body.missing).toContain("submissions (table missing)");
  });

  it("fails when SESSION_SECRET is missing, without touching the database", async () => {
    // Nobody can sign in without it, but the database looks perfectly healthy,
    // so a db-only probe reports green while the app is unusable.
    delete process.env.SESSION_SECRET;
    const { status, body } = await probe();
    expect(status).toBe(503);
    expect(body.auth).toBe("no-session-secret");
    expect(execute).not.toHaveBeenCalled();
  });

  it("reports a plain failure when the database is unreachable", async () => {
    execute.mockRejectedValue(new Error("connection refused"));
    const { status, body } = await probe();
    expect(status).toBe(503);
    expect(body.db).toBe("fail");
  });
});

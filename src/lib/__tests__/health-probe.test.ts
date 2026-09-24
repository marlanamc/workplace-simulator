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

/** Every table `schema.ts` declares — enumerated, never hand-listed (see below). */
async function schemaTables() {
  const { is } = await import("drizzle-orm");
  const { PgTable } = await import("drizzle-orm/pg-core");
  const schema = await import("@/lib/db/schema");
  return (Object.values(schema) as unknown[]).filter(
    (value): value is InstanceType<typeof PgTable> => is(value, PgTable),
  );
}

/** Every column the app's schema declares, as information_schema would report it. */
async function fullSchemaRows() {
  const { getTableColumns, getTableName } = await import("drizzle-orm");
  const tables = await schemaTables();
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

  it("covers every table in the schema, including ones added after it was written", async () => {
    // The outage this pins: `opening_replies` was declared in schema.ts and
    // left out of the probe's hand-written table list, so a production
    // database missing that table answered `db: ok` while every signed-in
    // learner got a 500. Both the probe and this test's fixture now enumerate
    // schema.ts, so a new table cannot be omitted from either.
    const { getTableName } = await import("drizzle-orm");
    const declared = (await schemaTables()).map(getTableName);
    expect(declared).toContain("opening_replies");

    for (const table of declared) {
      execute.mockResolvedValue({
        rows: (await fullSchemaRows()).filter((r) => r.table_name !== table),
      });
      const { status, body } = await probe();
      expect(status, `a missing ${table} table must fail the probe`).toBe(503);
      expect(body.missing).toContain(`${table} (table missing)`);
      vi.resetModules();
    }
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

import { getTableColumns, getTableName, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { badges, learners, skillRungs, submissions, taskCompletions } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

/**
 * Tables whose shape the app depends on. Derived from the Drizzle schema
 * rather than hand-listed, so adding a column to `schema.ts` automatically
 * makes this probe require it.
 */
const TABLES = [learners, taskCompletions, skillRungs, badges, submissions];

/** `{ learners: ["id", "display_name", …], … }` straight from the schema. */
function expectedShape(): Map<string, Set<string>> {
  return new Map(
    TABLES.map((table) => [
      getTableName(table),
      new Set(Object.values(getTableColumns(table)).map((column) => column.name)),
    ]),
  );
}

/**
 * Names every column the app expects that the database does not have, as
 * `table.column`. Empty means the database matches `schema.ts`.
 *
 * This exists because `SELECT 1` cannot see schema drift, and drift is a real
 * failure mode here: there are no migration artifacts, so the schema is
 * whatever someone last ran `drizzle-kit push` against. The `role` column sat
 * missing from the e2e database from 2026-09-05 until the first full CI run
 * caught it — every sign-in threw, while this endpoint stayed green.
 */
async function missingColumns(): Promise<string[]> {
  const expected = expectedShape();
  // `any(current_schemas(false))` rather than a hardcoded 'public': it is
  // exactly the set an unqualified table name resolves against, so this asks
  // the same question the app's own queries ask. Hardcoding the schema would
  // report every table missing — and fail the probe — on a connection whose
  // search_path points elsewhere.
  const rows = await getDb().execute<{ table_name: string; column_name: string }>(sql`
    select table_name, column_name
    from information_schema.columns
    where table_schema = any(current_schemas(false))
      and table_name in (${sql.join([...expected.keys()].map((t) => sql`${t}`), sql`, `)})
  `);

  const actual = new Map<string, Set<string>>();
  for (const row of rows.rows ?? []) {
    const cols = actual.get(row.table_name) ?? new Set<string>();
    cols.add(row.column_name);
    actual.set(row.table_name, cols);
  }

  const missing: string[] = [];
  for (const [table, columns] of expected) {
    const present = actual.get(table);
    if (!present) {
      missing.push(`${table} (table missing)`);
      continue;
    }
    for (const column of columns) {
      if (!present.has(column)) missing.push(`${table}.${column}`);
    }
  }
  return missing;
}

/**
 * GET /api/health
 * Public liveness probe: the app responds, the database matches `schema.ts`,
 * and sign-in is actually possible. Payload stays minimal — it names missing
 * columns (already public knowledge from the repo) but never dumps env values
 * or connection details.
 */
export async function GET() {
  const started = Date.now();
  const headers = {
    "Cache-Control": "no-store",
    // Allow command-center / uptime monitors to probe cross-origin.
    "Access-Control-Allow-Origin": "*",
  };

  // Without this, every sign-in throws while the database looks perfectly
  // healthy — the probe has to fail for the reason a learner would.
  if (!process.env.SESSION_SECRET) {
    return NextResponse.json(
      { ok: false, db: "unknown", auth: "no-session-secret", latencyMs: Date.now() - started },
      { status: 503, headers },
    );
  }

  try {
    const missing = await missingColumns();
    const latencyMs = Date.now() - started;
    if (missing.length) {
      return NextResponse.json(
        { ok: false, db: "schema-drift", missing, latencyMs },
        { status: 503, headers },
      );
    }
    return NextResponse.json({ ok: true, db: "ok", auth: "ok", latencyMs }, { status: 200, headers });
  } catch {
    return NextResponse.json(
      { ok: false, db: "fail", latencyMs: Date.now() - started },
      { status: 503, headers },
    );
  }
}

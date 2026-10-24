/**
 * Apply every additive migration in src/lib/db/migrations, in filename order.
 *
 * This runs as part of `npm run build`, which on Vercel means it runs before
 * each deploy with that environment's DATABASE_URL. It exists because the
 * alternative — remembering to apply the SQL by hand — failed: the
 * opening_replies migration was written on 2026-09-23 with a comment saying
 * "apply before deploying code that reads opening_replies", the code shipped
 * without it, and every signed-in learner got a 500 until someone ran it.
 *
 * Migrations must be additive and idempotent (CREATE TABLE IF NOT EXISTS,
 * ADD COLUMN IF NOT EXISTS). They re-run on every build, so anything
 * destructive here would be destructive repeatedly. Nothing in this script
 * drops or rewrites data.
 *
 * A failure fails the build on purpose: shipping code whose tables do not
 * exist is the outage this is here to prevent.
 */
import nextEnv from "@next/env";
import { neon } from "@neondatabase/serverless";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Inject only the SQL client for offline regression tests; use Next's env precedence. */
export async function runMigrations({ root = PROJECT_ROOT, createSql = neon } = {}) {
  nextEnv.loadEnvConfig(root, false);
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.log("migrate: no DATABASE_URL, skipping (set one to apply migrations)");
    return;
  }

  const migrations = join(root, "src", "lib", "db", "migrations");
  const files = readdirSync(migrations).filter((f) => f.endsWith(".sql")).sort();
  if (!files.length) {
    console.log("migrate: no migrations to apply");
    return;
  }

  const sql = createSql(url);
  for (const file of files) {
    process.stdout.write(`migrate: applying ${file} … `);
    await sql.query(readFileSync(join(migrations, file), "utf8"));
    console.log("ok");
  }
  console.log(`migrate: ${files.length} migration(s) applied`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await runMigrations();
}

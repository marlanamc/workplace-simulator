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
import { neon } from "@neondatabase/serverless";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MIGRATIONS = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "lib", "db", "migrations");

const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
if (!url) {
  // Local `next build` without a database configured is a normal thing to do,
  // and failing it would help nobody. Vercel always has DATABASE_URL set, so
  // a real deploy never takes this branch.
  console.log("migrate: no DATABASE_URL, skipping (set one to apply migrations)");
  process.exit(0);
}

const files = readdirSync(MIGRATIONS).filter((f) => f.endsWith(".sql")).sort();
if (!files.length) {
  console.log("migrate: no migrations to apply");
  process.exit(0);
}

const sql = neon(url);
for (const file of files) {
  process.stdout.write(`migrate: applying ${file} … `);
  await sql.query(readFileSync(join(MIGRATIONS, file), "utf8"));
  console.log("ok");
}
console.log(`migrate: ${files.length} migration(s) applied`);

import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";

export const dynamic = "force-dynamic";

/**
 * GET /api/health
 * Public liveness probe: app responds + database accepts a trivial query.
 * Payload stays minimal (no env dumps, no connection details).
 */
export async function GET() {
  const started = Date.now();
  try {
    await getDb().execute(sql`SELECT 1`);
    const latencyMs = Date.now() - started;
    return NextResponse.json(
      { ok: true, db: "ok", latencyMs },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
          // Allow command-center / uptime monitors to probe cross-origin.
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch {
    const latencyMs = Date.now() - started;
    return NextResponse.json(
      { ok: false, db: "fail", latencyMs },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}

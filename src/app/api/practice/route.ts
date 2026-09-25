import { getSessionLearnerId } from "@/lib/auth";
import { getDb } from "@/lib/db/client";
import { practiceAttempts } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { activityById } from "@/lib/practice/activities";
const activityOf = (request: Request) =>
  activityById(new URL(request.url).searchParams.get("activity"));
export async function GET(request: Request) {
  const activity = activityOf(request);
  if (!activity) return new Response(null, { status: 400 });
  const id = await getSessionLearnerId();
  if (!id)
    return Response.json(
      { signedIn: false },
      { headers: { "Cache-Control": "no-store" } },
    );
  try {
    const rows = await getDb()
      .select()
      .from(practiceAttempts)
      .where(
        and(
          eq(practiceAttempts.learnerId, id),
          eq(practiceAttempts.activityId, activity.id),
          eq(practiceAttempts.version, activity.version),
        ),
      );
    return Response.json(
      { signedIn: true, owner: id, state: rows[0]?.state ?? null },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json({ signedIn: true, error: true }, { status: 503 });
  }
}
export async function PUT(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return new Response(null, { status: 403 });
  const activity = activityOf(request);
  if (!activity) return new Response(null, { status: 400 });
  const id = await getSessionLearnerId();
  if (!id) return new Response(null, { status: 401 });
  let state;
  try {
    state = activity.parseDraft(await request.json());
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!state) return new Response(null, { status: 400 });
  try {
    await getDb()
      .insert(practiceAttempts)
      .values({
        learnerId: id,
        activityId: activity.id,
        version: activity.version,
        state,
      })
      .onConflictDoUpdate({
        target: [
          practiceAttempts.learnerId,
          practiceAttempts.activityId,
          practiceAttempts.version,
        ],
        set: { state, updatedAt: new Date() },
      });
    return Response.json({ saved: true });
  } catch {
    return new Response(null, { status: 503 });
  }
}

import { and, eq } from "drizzle-orm";
import { getSessionLearnerId } from "@/lib/auth";
import { getDb } from "@/lib/db/client";
import { practiceAttempts } from "@/lib/db/schema";
import { lessonByKey } from "@/lib/lessons/catalog";
import { LESSON_ATTEMPT_VERSION, parseAttempt } from "@/lib/lessons/attempts";

/** One lesson's attempt for the signed-in learner. Separate from game credit (`task_completions`). */
const lessonOf = (request: Request) => lessonByKey(new URL(request.url).searchParams.get("lesson") ?? "");
const noStore = { "Cache-Control": "no-store" };

/** Without `?lesson=`: the lessons the signed-in learner has finished, for the library's done badges. */
async function finishedLessons() {
  const id = await getSessionLearnerId();
  if (!id) return Response.json({ signedIn: false }, { headers: noStore });
  try {
    const rows = await getDb()
      .select()
      .from(practiceAttempts)
      .where(and(eq(practiceAttempts.learnerId, id), eq(practiceAttempts.version, LESSON_ATTEMPT_VERSION)));
    const done = rows
      .filter((r) => lessonByKey(r.activityId) && (parseAttempt(r.state)?.attempts ?? 0) > 0)
      .map((r) => r.activityId);
    return Response.json({ signedIn: true, owner: id, done }, { headers: noStore });
  } catch {
    return Response.json({ signedIn: true, error: true }, { status: 503, headers: noStore });
  }
}

export async function GET(request: Request) {
  if (!new URL(request.url).searchParams.has("lesson")) return finishedLessons();
  const lesson = lessonOf(request);
  if (!lesson) return new Response(null, { status: 400 });
  const id = await getSessionLearnerId();
  if (!id) return Response.json({ signedIn: false }, { headers: noStore });
  try {
    const rows = await getDb()
      .select()
      .from(practiceAttempts)
      .where(
        and(
          eq(practiceAttempts.learnerId, id),
          eq(practiceAttempts.activityId, lesson.taskKey),
          eq(practiceAttempts.version, LESSON_ATTEMPT_VERSION),
        ),
      );
    return Response.json({ signedIn: true, owner: id, state: rows[0]?.state ?? null }, { headers: noStore });
  } catch {
    return Response.json({ signedIn: true, error: true }, { status: 503, headers: noStore });
  }
}

export async function PUT(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) return new Response(null, { status: 403 });
  const lesson = lessonOf(request);
  if (!lesson) return new Response(null, { status: 400 });
  const id = await getSessionLearnerId();
  if (!id) return new Response(null, { status: 401 });
  let state;
  try {
    state = parseAttempt(await request.json());
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!state) return new Response(null, { status: 400 });
  try {
    await getDb()
      .insert(practiceAttempts)
      .values({ learnerId: id, activityId: lesson.taskKey, version: LESSON_ATTEMPT_VERSION, state })
      .onConflictDoUpdate({
        target: [practiceAttempts.learnerId, practiceAttempts.activityId, practiceAttempts.version],
        set: { state, updatedAt: new Date() },
      });
    return Response.json({ saved: true });
  } catch {
    return new Response(null, { status: 503 });
  }
}

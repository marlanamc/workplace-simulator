import { notFound } from "next/navigation";
import type { TaskKey } from "@/lib/desktop-content";
import { draftLessonFor, lessonByKey } from "@/lib/lessons/catalog";
import LessonRunner from "../LessonRunner";

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export async function generateMetadata({ params }: { params: Promise<{ taskKey: string }> }) {
  const lesson = lessonByKey((await params).taskKey);
  return { title: lesson ? `${lesson.title.en} · Lessons` : "Lessons" };
}

/** Public: a lesson needs no account. Unknown keys and tasks without a lesson block 404. */
export default async function LessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ taskKey: string }>;
  searchParams: Promise<{ mode?: string | string[]; lang?: string | string[]; smoke?: string | string[] }>;
}) {
  const { taskKey } = await params;
  const query = await searchParams;
  // The smoke sweep opens tasks that are not lessons yet. Never in production.
  const draft = process.env.NODE_ENV !== "production" && first(query.smoke) === "1";
  if (!lessonByKey(taskKey) && !(draft && draftLessonFor(taskKey))) notFound();
  return (
    <LessonRunner
      key={taskKey}
      taskKey={taskKey as TaskKey}
      draft={draft}
      initialMode={first(query.mode) === "independent" ? "independent" : "guided"}
      initialLang={first(query.lang) === "es" ? "es" : "en"}
    />
  );
}

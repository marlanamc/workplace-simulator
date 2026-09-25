import { notFound } from "next/navigation";
import type { TaskKey } from "@/lib/desktop-content";
import { lessonByKey } from "@/lib/lessons/catalog";
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
  searchParams: Promise<{ mode?: string | string[]; lang?: string | string[] }>;
}) {
  const { taskKey } = await params;
  if (!lessonByKey(taskKey)) notFound();
  const query = await searchParams;
  return (
    <LessonRunner
      key={taskKey}
      taskKey={taskKey as TaskKey}
      initialMode={first(query.mode) === "independent" ? "independent" : "guided"}
      initialLang={first(query.lang) === "es" ? "es" : "en"}
    />
  );
}

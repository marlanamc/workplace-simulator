import Link from "next/link";
import { LESSONS } from "@/lib/lessons/catalog";
import { LESSON_COPY } from "@/lib/lessons/copy";

export const metadata = {
  title: "Lessons",
  description: "Short practice with real computer tasks, on the same practice computer as the game.",
};

/** The public lesson library. Skill filters and teacher guides arrive with the full catalog. */
export default async function LessonsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string | string[] }>;
}) {
  const raw = (await searchParams).lang;
  const lang = (Array.isArray(raw) ? raw[0] : raw) === "es" ? "es" : "en";
  const q = lang === "es" ? "?lang=es" : "";
  return (
    <main lang={lang} className="mx-auto w-full max-w-[960px] px-4 py-8 text-[#202124] sm:px-10">
      <header className="flex items-center justify-between gap-4 border-b border-[#dadce0] pb-5">
        <h1 className="m-0 text-[28px] font-medium">{LESSON_COPY.library[lang]}</h1>
        <Link href={lang === "es" ? "/lessons" : "/lessons?lang=es"} className="text-[16px] text-[#0b57d0]">
          {lang === "es" ? "English" : "Español"}
        </Link>
      </header>
      <p className="mt-5 max-w-[640px] text-[18px] leading-relaxed text-[#3c4043]">{LESSON_COPY.libraryIntro[lang]}</p>
      <ul className="mt-6 flex list-none flex-col gap-4 p-0">
        {LESSONS.map((l) => (
          <li key={l.taskKey} className="flex flex-col gap-3 rounded-2xl border border-[#dadce0] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="m-0 text-[20px] font-medium">{l.title[lang]}</h2>
              <p className="mt-1 mb-0 text-[16px] text-[#3c4043]">{l.summary[lang]}</p>
              <p className="mt-1 mb-0 text-[14px] text-[#5f6368]">{LESSON_COPY.minutes[lang].replace("{n}", String(l.minutes))}</p>
            </div>
            <Link
              href={`/lessons/${l.taskKey}${q}`}
              className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-[#0b57d0] px-6 text-[16px] font-medium text-white"
            >
              {LESSON_COPY.start[lang]}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { lessonByKey } from "@/lib/lessons/catalog";
import { PRACTICE_PACKS } from "@/lib/lessons/materials";
import { MATERIAL_COPY as C } from "@/lib/lessons/materials-links";
import PrintMaterials from "./PrintMaterials";

const first = (v: string | string[] | undefined) => Array.isArray(v) ? v[0] : v;
type Props = { params: Promise<{ taskKey: string }>; searchParams: Promise<{ lang?: string | string[] }> };

export async function generateMetadata({ params, searchParams }: Props) {
  const [{ taskKey }, query] = await Promise.all([params, searchParams]);
  const lesson = lessonByKey(taskKey);
  const lang = first(query.lang) === "es" ? "es" : "en";
  return { title: `${C.open[lang]}${lesson ? ` · ${lesson.title[lang]}` : ""}` };
}

/** Teacher-facing extension. Source documents alone print; no simulator state or writes. */
export default async function MaterialsPage({ params, searchParams }: Props) {
  const [{ taskKey }, query] = await Promise.all([params, searchParams]);
  const lesson = lessonByKey(taskKey);
  const pack = lesson && PRACTICE_PACKS[lesson.taskKey];
  if (!lesson || !pack) notFound();
  const lang = first(query.lang) === "es" ? "es" : "en";
  const otherLang = lang === "en" ? "es" : "en";
  return (
    <main lang={lang} className="mx-auto min-h-screen w-full min-w-0 max-w-4xl px-5 py-8 text-[#202124] sm:px-8 print:max-w-none print:p-0">
      <nav aria-label={C.open[lang]} className="mb-8 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link className="py-2 text-[#0b57d0] underline" href={`/lessons/${taskKey}?preview=1&lang=${lang}`}>{C.back[lang]}</Link>
        <Link className="py-2 text-[#0b57d0] underline" href={`?lang=${otherLang}`} hrefLang={otherLang} lang={otherLang}>{otherLang === "es" ? "Español" : "English"}</Link>
        <PrintMaterials lang={lang} />
      </nav>
      <header className="mb-8 border-b border-[#dadce0] pb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#5f6368]">{C.label[lang]}</p>
        <h1 className="mt-2 text-[30px] font-semibold leading-tight">{pack.title[lang]}</h1>
        <p className="mt-3 text-lg leading-relaxed">{pack.context[lang]}</p>
        <p className="mt-3 text-sm leading-relaxed text-[#5f6368] print:hidden">{C.note[lang]}</p>
      </header>
      <section aria-label={C.sources[lang]} data-testid="practice-documents" className="space-y-6">
        {pack.documents.map((doc, i) => (
          <article key={doc.title.en} className="break-inside-avoid overflow-hidden rounded-lg border border-[#dadce0] bg-white print:rounded-none">
            <header className="border-b border-[#dadce0] bg-[#f8f9fa] px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#5f6368]">{i + 1} · {C.fictional[lang]}</p>
              <h2 className="mt-1 text-xl font-semibold">{doc.title[lang]}</h2>
              <p className="mt-2 text-sm text-[#5f6368]">{doc.source[lang]}</p>
            </header>
            <div className="space-y-3 p-5 text-base leading-relaxed">
              {doc.paragraphs?.map(p => <p key={p.en}>{p[lang]}</p>)}
              {doc.table && (
                <div className="overflow-x-auto" role="region" aria-label={doc.title[lang]} tabIndex={0}>
                  <table className="w-full border-collapse text-left text-sm">
                    <caption className="sr-only">{doc.title[lang]}</caption>
                    <thead><tr>{doc.table.columns.map(c => <th key={c.en} scope="col" className="border-b-2 border-[#dadce0] p-2 align-top font-semibold">{c[lang]}</th>)}</tr></thead>
                    <tbody>{doc.table.rows.map((row, r) => <tr key={r}>{row.map((cell, c) => <td key={c} className="max-w-64 break-words border-b border-[#dadce0] p-2 align-top [overflow-wrap:anywhere]">{cell[lang]}</td>)}</tr>)}</tbody>
                  </table>
                </div>
              )}
            </div>
          </article>
        ))}
      </section>
      <section data-testid="practice-teacher-notes" className="mt-10 border-t border-[#dadce0] pt-6 print:hidden" aria-labelledby="teacher-notes-title">
        <h2 id="teacher-notes-title" className="text-xl font-semibold">{C.teacher[lang]}</h2>
        <p className="mt-3 leading-relaxed text-[#5f6368]">{C.support[lang]}</p>
        {(["discuss", "evidence"] as const).map(key => (
          <div key={key} className="mt-5">
            <h3 className="font-semibold">{C[key][lang]}</h3>
            <ul className="mt-2 list-disc space-y-2 pl-5 leading-relaxed">{pack[key].map(p => <li key={p.en}>{p[lang]}</li>)}</ul>
          </div>
        ))}
        <h3 className="mt-5 font-semibold">{C.change[lang]}</h3>
        <p className="mt-2 leading-relaxed">{pack.change[lang]}</p>
      </section>
    </main>
  );
}

"use client";

import { useMemo, useState } from "react";
import { HANDBOOK_ARTICLES } from "@/lib/handbook-content";

const SECTIONS = [...new Set(HANDBOOK_ARTICLES.map((a) => a.section))];

export default function HandbookPage() {
  const [query, setQuery] = useState("");
  const [activeSlug, setActiveSlug] = useState(HANDBOOK_ARTICLES[0].slug);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return HANDBOOK_ARTICLES;
    return HANDBOOK_ARTICLES.filter(
      (a) => a.title.toLowerCase().includes(q) || a.body.some((p) => p.toLowerCase().includes(q))
    );
  }, [query]);

  const goTo = (slug: string) => {
    setActiveSlug(slug);
    document.getElementById(`hb-${slug}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex h-full min-h-0" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div className="flex w-[200px] shrink-0 flex-col border-r border-[#e8eaed] bg-white">
        <div className="px-3 py-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find in document"
            className="w-full border-0 border-b border-[#e0e0e0] bg-transparent py-1.5 text-[13px] outline-none focus:border-[#1a73e8]"
          />
        </div>
        <div className="px-3 pb-2 text-[12px] text-[#5f6368]">Document outline</div>
        <div className="flex-1 overflow-y-auto pb-3">
          {filtered.length === 0 && (
            <p className="px-3 py-2 text-[13px] text-[#5f6368]">No matches.</p>
          )}
          {SECTIONS.map((section) => {
            const items = filtered.filter((a) => a.section === section);
            if (items.length === 0) return null;
            return (
              <div key={section} className="mb-2">
                <div className="px-3 py-1 text-[11px] text-[#80868b]">{section}</div>
                {items.map((a) => (
                  <button
                    key={a.slug}
                    onClick={() => goTo(a.slug)}
                    className={`flex w-full px-3 py-1.5 text-left text-[13px] leading-snug cursor-pointer ${
                      activeSlug === a.slug ? "bg-[#e8f0fe] text-[#1967d2]" : "text-[#3c4043] hover:bg-[#f1f3f4]"
                    }`}
                  >
                    {a.title}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="min-w-0 flex-1 overflow-y-auto bg-[#f9fbfd] px-4 py-6">
        <article
          className="mx-auto flex min-h-[11in] w-full max-w-[816px] flex-col bg-white px-[1in] py-[0.9in] text-[#202124] shadow-[0_1px_3px_rgba(60,64,67,.15)]"
          style={{ fontSize: "11pt", lineHeight: 1.5 }}
        >
          <header className="mb-8">
            <p className="m-0 text-[10pt] tracking-[0.04em] text-[#5f6368]">Harborside Cafe</p>
            <h1 className="mt-1 mb-0 text-[22pt] font-normal leading-tight">Employee Handbook</h1>
            <p className="mt-3 mb-0 text-[10pt] text-[#5f6368]">
              Staff policies · Effective August 1, 2026
            </p>
            <p className="mt-2 mb-0 max-w-[58ch] text-[11pt] text-[#3c4043]">
              If a coworker tells you something different, this document is the rule. Ask your shift lead if a policy is unclear.
            </p>
            <hr className="mt-5 mb-0 border-0 border-t border-[#202124]" />
          </header>

          {SECTIONS.map((section) => {
            const items = HANDBOOK_ARTICLES.filter((a) => a.section === section);
            return (
              <section key={section} className="mb-8">
                <h2 className="mb-4 mt-0 text-[11pt] font-bold tracking-[0.02em] text-[#202124]">
                  {section}
                </h2>
                {items.map((a) => {
                  const n = HANDBOOK_ARTICLES.indexOf(a) + 1;
                  return (
                    <div
                      key={a.slug}
                      id={`hb-${a.slug}`}
                      className="mb-6 scroll-mt-4"
                    >
                      <h3 className="mb-2 mt-0 text-[13pt] font-normal text-[#202124]">
                        <span className="mr-2 tabular-nums text-[#5f6368]">{n}.</span>
                        {a.title}
                      </h3>
                      <ol className="m-0 list-decimal space-y-2 pl-8">
                        {a.body.map((p, pi) => (
                          <li key={pi} className="pl-1 text-[11pt] leading-[1.5]">
                            {p}
                          </li>
                        ))}
                      </ol>
                    </div>
                  );
                })}
              </section>
            );
          })}

          <footer className="mt-auto border-t border-[#dadce0] pt-3 text-[9pt] text-[#5f6368]">
            Harborside Cafe · Employee Handbook · Internal use
          </footer>
        </article>
      </div>
    </div>
  );
}

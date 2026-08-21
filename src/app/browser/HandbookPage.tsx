"use client";

import { useMemo, useState } from "react";
import { HANDBOOK_ARTICLES } from "@/lib/handbook-content";
import { TAB_ICONS, CircleGlyph } from "@/lib/icons";

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

  const active = HANDBOOK_ARTICLES.find((a) => a.slug === activeSlug) ?? filtered[0] ?? null;

  return (
    <div className="flex h-full min-h-0 flex-col bg-white text-[15px] text-[var(--text-primary)]">
      <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3">
        <CircleGlyph icon={TAB_ICONS.handbook} color="#3c4043" size={28} />
        <span className="text-[15px] font-medium">Employee Handbook</span>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="flex w-[260px] shrink-0 flex-col border-r border-[var(--border)]">
          <div className="p-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the handbook…"
              className="w-full rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2 text-[14px] outline-none focus:border-[var(--accent)]"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 && (
              <p className="px-4 py-3 text-[13px] text-[var(--text-tertiary)]">No articles match.</p>
            )}
            {filtered.map((a) => (
              <button
                key={a.slug}
                onClick={() => setActiveSlug(a.slug)}
                className={`flex w-full flex-col gap-0.5 border-b border-[var(--surface-muted)] px-4 py-3 text-left cursor-pointer ${
                  active?.slug === a.slug ? "bg-[var(--accent-tint)]" : "hover:bg-[var(--surface-muted)]"
                }`}
              >
                <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-tertiary)]">
                  {a.section}
                </span>
                <span className="text-[14px] font-medium text-[var(--text-primary)]">{a.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="min-w-0 flex-1 overflow-y-auto p-6">
          {active ? (
            <>
              <div className="mb-1 text-[12px] font-medium uppercase tracking-wide text-[var(--text-tertiary)]">
                {active.section}
              </div>
              <h2 className="mb-4 text-[21px] font-medium">{active.title}</h2>
              <div className="flex flex-col gap-2.5">
                {active.body.map((p, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg bg-[var(--surface-muted)] px-4 py-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-[var(--text-tertiary)]">
                      {i + 1}
                    </span>
                    <span className="text-[15px] leading-relaxed">{p}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-[14px] text-[var(--text-tertiary)]">Select an article on the left.</p>
          )}
        </div>
      </div>
    </div>
  );
}

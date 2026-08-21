"use client";

import { useState } from "react";
import Link from "next/link";
import { PDF_DOCUMENTS } from "@/lib/pdf-content";
import Shelf, { SHELF_HEIGHT } from "@/components/Shelf";

export default function PdfReaderClient({ displayName }: { displayName: string }) {
  const [activeId, setActiveId] = useState(PDF_DOCUMENTS[0].id);
  const active = PDF_DOCUMENTS.find((d) => d.id === activeId)!;

  return (
    <div className="flex flex-col bg-[var(--surface-muted)]" style={{ height: `calc(100vh - ${SHELF_HEIGHT}px)` }}>
      <div className="flex items-center gap-3 border-b border-[var(--border)] bg-white px-4 py-3">
        <Link
          href="/"
          aria-label="Back to desktop"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[15px] text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
        >
          ⌂
        </Link>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--danger)] text-[13px] text-white">
          ▤
        </span>
        <span className="text-[15px] font-medium">PDF Reader</span>
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="flex w-[260px] shrink-0 flex-col border-r border-[var(--border)] bg-white">
          <div className="px-4 py-3 text-[13px] font-medium text-[var(--text-secondary)]">Downloads</div>
          <div className="flex-1 overflow-y-auto">
            {PDF_DOCUMENTS.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveId(d.id)}
                className={`flex w-full items-center gap-3 border-b border-[var(--surface-muted)] px-4 py-3 text-left cursor-pointer ${
                  d.id === activeId ? "bg-[var(--accent-tint)]" : "hover:bg-[var(--surface-muted)]"
                }`}
              >
                <span className="shrink-0 rounded bg-[var(--danger)] px-1.5 py-0.5 text-[10px] font-bold text-white">
                  PDF
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] text-[var(--text-primary)]">{d.name}</div>
                  <div className="text-[12px] text-[var(--text-tertiary)]">{d.size} · {d.date}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="min-w-0 flex-1 overflow-y-auto bg-[#525659] p-8">
          <div className="mx-auto max-w-[560px] rounded-sm bg-white p-10 shadow-xl">
            {active.pages[0].map((line, i) => (
              <p
                key={i}
                className={`m-0 whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-[#1f2a30] ${
                  line === "" ? "h-4" : ""
                } ${i === 0 ? "mb-4 text-[15px] font-bold" : ""}`}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>

      <Shelf displayName={displayName} />
    </div>
  );
}

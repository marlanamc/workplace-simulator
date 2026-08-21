"use client";

import { useState } from "react";
import { PDF_DOCUMENTS, type PdfDocument } from "@/lib/pdf-content";
import { SHELF_HEIGHT } from "@/components/Shelf";
import WindowControls from "@/components/WindowControls";
import { useNudge } from "@/lib/use-nudge";
import NudgeToast from "@/components/task/NudgeToast";
import { useWindowManager } from "@/lib/window-manager";

function Letterhead() {
  return (
    <div className="mb-6 flex items-center gap-3 border-b border-[#dfe3e6] pb-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#123a5c] text-[13px] font-bold text-white">
        HC
      </span>
      <div>
        <div className="text-[14px] font-semibold tracking-wide text-[#123a5c]">HARBORSIDE CAFE</div>
        <div className="text-[11px] text-[#7e8d9a]">142 Main Street · Harborside</div>
      </div>
    </div>
  );
}

function ReportPage({ doc }: { doc: Extract<PdfDocument, { kind: "report" }> }) {
  return (
    <>
      <Letterhead />
      <h1 className="mb-4 text-[22px] font-bold text-[#1f2a30]">{doc.title}</h1>
      <div className="mb-6 flex gap-8">
        {doc.meta.map((m) => (
          <div key={m.label}>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-[#9aa5ad]">{m.label}</div>
            <div className="text-[14px] text-[#1f2a30]">{m.value}</div>
          </div>
        ))}
      </div>
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#123a5c]">
        {doc.sectionHeading}
      </div>
      <div className="mb-8 flex flex-col gap-2">
        {doc.items.map((item, i) => (
          <div key={i} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-[#1f2a30]">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7e8d9a]" />
            {item}
          </div>
        ))}
      </div>
      <div className="border-t border-[#dfe3e6] pt-4 text-[13px] italic text-[#5f6b74]">
        Prepared by: {doc.signedBy}
      </div>
    </>
  );
}

function PayStubPage({ doc }: { doc: Extract<PdfDocument, { kind: "paystub" }> }) {
  return (
    <>
      <Letterhead />
      <h1 className="mb-4 text-[20px] font-bold tracking-wide text-[#1f2a30]">EARNINGS STATEMENT</h1>
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-[#9aa5ad]">Employee</div>
          <div className="text-[14px] text-[#1f2a30]">{doc.employee}</div>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-[#9aa5ad]">Pay period</div>
          <div className="text-[14px] text-[#1f2a30]">{doc.payPeriod}</div>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-[#9aa5ad]">Pay date</div>
          <div className="text-[14px] text-[#1f2a30]">{doc.payDate}</div>
        </div>
      </div>

      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[#123a5c]">Earnings</div>
      <div className="mb-1 overflow-hidden rounded border border-[#dfe3e6]">
        <div className="grid grid-cols-[1fr_1fr_auto] gap-2 bg-[#f2f4f5] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#7e8d9a]">
          <span>Description</span>
          <span>Detail</span>
          <span className="text-right">Amount</span>
        </div>
        {doc.earnings.map((e, i) => (
          <div
            key={e.label}
            className={`grid grid-cols-[1fr_1fr_auto] gap-2 px-3 py-2 text-[13px] text-[#1f2a30] ${i !== 0 ? "border-t border-[#eceff0]" : ""}`}
          >
            <span>{e.label}</span>
            <span className="text-[#5f6b74]">{e.detail}</span>
            <span className="text-right tabular-nums">{e.amount}</span>
          </div>
        ))}
        <div className="grid grid-cols-[1fr_1fr_auto] gap-2 border-t border-[#dfe3e6] bg-[#f9fafb] px-3 py-2 text-[13px] font-semibold text-[#1f2a30]">
          <span className="col-span-2">Gross pay</span>
          <span className="text-right tabular-nums">{doc.grossPay}</span>
        </div>
      </div>

      <div className="mb-4 mt-5 text-[11px] font-semibold uppercase tracking-wide text-[#123a5c]">Deductions</div>
      <div className="mb-6 overflow-hidden rounded border border-[#dfe3e6]">
        {doc.deductions.map((d, i) => (
          <div
            key={d.label}
            className={`flex items-center justify-between px-3 py-2 text-[13px] text-[#1f2a30] ${i !== 0 ? "border-t border-[#eceff0]" : ""}`}
          >
            <span>{d.label}</span>
            <span className="tabular-nums text-[#b5342b]">{d.amount}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-lg bg-[#e4f1ec] px-4 py-3">
        <span className="text-[13px] font-semibold uppercase tracking-wide text-[#1e5a4c]">Net pay</span>
        <span className="text-[19px] font-bold tabular-nums text-[#1e5a4c]">{doc.netPay}</span>
      </div>
    </>
  );
}

export default function PdfReaderClient() {
  const { pdfDocId, pdfDocToken } = useWindowManager();
  const [activeId, setActiveId] = useState(
    pdfDocId && PDF_DOCUMENTS.some((d) => d.id === pdfDocId) ? pdfDocId : PDF_DOCUMENTS[0].id
  );
  const [zoom, setZoom] = useState(100);
  const { nudge, say } = useNudge();

  // A deep link (e.g. "open this pay stub" from the Portal) requests a doc —
  // jump to it even if the reader is already open on a different file.
  // Adjusted during render (React's recommended pattern), not in an effect.
  const [lastToken, setLastToken] = useState(pdfDocToken);
  if (pdfDocToken !== lastToken) {
    setLastToken(pdfDocToken);
    if (pdfDocId && PDF_DOCUMENTS.some((d) => d.id === pdfDocId)) {
      setActiveId(pdfDocId);
    }
  }

  const active = PDF_DOCUMENTS.find((d) => d.id === activeId)!;

  const notAvailable = () => say("That's not available in this practice space — just look and read here.");

  return (
    <div className="flex flex-col bg-[var(--surface-muted)]" style={{ height: `calc(100vh - ${SHELF_HEIGHT}px)` }}>
      <div className="flex items-center gap-3 border-b border-[var(--border)] bg-white px-4 py-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--danger)] text-[13px] text-white">
          ▤
        </span>
        <span className="text-[15px] font-medium">PDF Reader</span>
        <div className="flex-1" />
        <WindowControls appKey="pdf" />
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

        <div className="flex min-w-0 flex-1 flex-col">
          {/* viewer toolbar */}
          <div className="flex items-center justify-center gap-1 border-b border-[#3a3d40] bg-[#323639] px-3 py-1.5">
            <span className="mr-3 truncate text-[13px] text-white/80">{active.name}</span>
            <button
              onClick={() => setZoom((z) => Math.max(60, z - 10))}
              className="flex h-7 w-7 items-center justify-center rounded text-[15px] text-white/85 hover:bg-white/10 cursor-pointer"
              aria-label="Zoom out"
            >
              −
            </button>
            <span className="w-11 text-center text-[12px] text-white/85">{zoom}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(150, z + 10))}
              className="flex h-7 w-7 items-center justify-center rounded text-[15px] text-white/85 hover:bg-white/10 cursor-pointer"
              aria-label="Zoom in"
            >
              +
            </button>
            <span className="mx-2 h-4 w-px bg-white/20" />
            <span className="text-[12px] text-white/70">Page 1 / 1</span>
            <span className="mx-2 h-4 w-px bg-white/20" />
            <button
              onClick={notAvailable}
              className="flex h-7 w-7 items-center justify-center rounded text-[14px] text-white/85 hover:bg-white/10 cursor-pointer"
              aria-label="Print"
              title="Print"
            >
              ⎙
            </button>
            <button
              onClick={notAvailable}
              className="flex h-7 w-7 items-center justify-center rounded text-[14px] text-white/85 hover:bg-white/10 cursor-pointer"
              aria-label="Download"
              title="Download"
            >
              ⬇
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-auto bg-[#525659] p-8">
            <div className="flex justify-center" style={{ minWidth: 560 * (zoom / 100) }}>
              <div
                className="w-[560px] shrink-0 rounded-sm bg-white p-10 shadow-xl transition-transform"
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
              >
                {active.kind === "report" ? <ReportPage doc={active} /> : <PayStubPage doc={active} />}
              </div>
            </div>
          </div>
        </div>
      </div>

      <NudgeToast text={nudge} bottom={SHELF_HEIGHT + 20} />
    </div>
  );
}

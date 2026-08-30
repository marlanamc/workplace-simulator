"use client";

import { useState, type ReactNode } from "react";
import { PDF_DOCUMENTS, type PdfDocument } from "@/lib/pdf-content";
import { SHELF_RESERVE } from "@/components/Shelf";
import WindowControls from "@/components/WindowControls";
import { useNudge } from "@/lib/use-nudge";
import NudgeToast from "@/components/task/NudgeToast";
import { useWindowManager } from "@/lib/window-manager";
import { PdfIcon } from "@/lib/icons";

/** A real US Letter sheet: 8.5in × 11in, ~1in margins, 12pt Times. Zoom scales the whole page. */
const LETTER = { widthIn: 8.5, heightIn: 11 } as const;

function PdfPage({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative box-border h-full w-full"
      style={{
        padding: "1in 1in 1.15in",
        fontFamily: '"Times New Roman", Times, Georgia, serif',
        fontSize: "12pt",
        lineHeight: 1.35,
        color: "#1a1a1a",
      }}
    >
      {children}
      <div
        className="absolute flex items-center justify-between border-t border-[#1a1a1a]/30 text-[9pt] text-[#444]"
        style={{ left: "1in", right: "1in", bottom: "0.55in", paddingTop: "0.2in" }}
      >
        <span>Harborside Cafe · Internal</span>
        <span>Page 1 of 1</span>
      </div>
    </div>
  );
}

function Letterhead() {
  return (
    <div className="mb-[14pt] border-b-[1.5pt] border-[#1a1a1a] pb-[8pt]">
      <div className="text-[16pt] font-bold tracking-[0.14em]">HARBORSIDE CAFE</div>
      <div className="mt-[2pt] text-[10pt] tracking-wide text-[#333]">142 Main Street · Harborside</div>
    </div>
  );
}

function ReportPage({ doc }: { doc: Extract<PdfDocument, { kind: "report" }> }) {
  return (
    <>
      <Letterhead />
      <h1 className="mb-[16pt] text-center text-[16pt] font-bold tracking-wide">{doc.title}</h1>
      <table className="mb-[16pt] w-full border-collapse text-[12pt]">
        <tbody>
          <tr>
            {doc.meta.map((m) => (
              <td key={m.label} className="border border-[#1a1a1a] px-[8pt] py-[6pt] align-top">
                <div className="text-[9pt] font-bold">{m.label}</div>
                <div className="mt-[0.1em]">{m.value}</div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <h2 className="mb-[6pt] text-[12pt] font-bold">{doc.sectionHeading}</h2>
      <ol className="m-0 flex list-decimal flex-col gap-[8pt] pl-[18pt] text-[12pt] leading-[1.35]">
        {doc.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
      <p className="mt-[28pt] text-[12pt] leading-relaxed">
        Prepared by
        <br />
        <span className="italic">{doc.signedBy}</span>
      </p>
    </>
  );
}

function PayStubPage({ doc }: { doc: Extract<PdfDocument, { kind: "paystub" }> }) {
  return (
    <>
      <Letterhead />
      <h1 className="mb-[0.7em] text-center text-[1.35em] font-bold tracking-[0.08em]">EARNINGS STATEMENT</h1>
      <table className="mb-[0.85em] w-full border-collapse text-[1em]">
        <tbody>
          <tr>
            <td className="border border-[#1a1a1a] px-[0.7em] py-[0.4em]">
              <div className="text-[0.78em] font-bold">Employee</div>
              <div className="mt-[0.1em]">{doc.employee}</div>
            </td>
            <td className="border border-[#1a1a1a] px-[0.7em] py-[0.4em]">
              <div className="text-[0.78em] font-bold">Pay period</div>
              <div className="mt-[0.1em]">{doc.payPeriod}</div>
            </td>
            <td className="border border-[#1a1a1a] px-[0.7em] py-[0.4em]">
              <div className="text-[0.78em] font-bold">Pay date</div>
              <div className="mt-[0.1em]">{doc.payDate}</div>
            </td>
          </tr>
        </tbody>
      </table>

      <h2 className="mb-[0.2em] text-[1em] font-bold">Earnings</h2>
      <table className="mb-[0.75em] w-full border-collapse text-[0.95em]">
        <thead>
          <tr className="bg-[#f3f3f3]">
            <th className="border border-[#1a1a1a] px-[0.7em] py-[0.3em] text-left font-bold">Description</th>
            <th className="border border-[#1a1a1a] px-[0.7em] py-[0.3em] text-left font-bold">Detail</th>
            <th className="border border-[#1a1a1a] px-[0.7em] py-[0.3em] text-right font-bold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {doc.earnings.map((e) => (
            <tr key={e.label}>
              <td className="border border-[#1a1a1a] px-[0.7em] py-[0.3em]">{e.label}</td>
              <td className="border border-[#1a1a1a] px-[0.7em] py-[0.3em]">{e.detail}</td>
              <td className="border border-[#1a1a1a] px-[0.7em] py-[0.3em] text-right tabular-nums">{e.amount}</td>
            </tr>
          ))}
          <tr>
            <td className="border border-[#1a1a1a] px-[0.7em] py-[0.3em] font-bold" colSpan={2}>
              Gross pay
            </td>
            <td className="border border-[#1a1a1a] px-[0.7em] py-[0.3em] text-right font-bold tabular-nums">{doc.grossPay}</td>
          </tr>
        </tbody>
      </table>

      <h2 className="mb-[0.2em] text-[1em] font-bold">Deductions</h2>
      <table className="mb-[0.75em] w-full border-collapse text-[0.95em]">
        <tbody>
          {doc.deductions.map((d) => (
            <tr key={d.label}>
              <td className="border border-[#1a1a1a] px-[0.7em] py-[0.3em]">{d.label}</td>
              <td className="border border-[#1a1a1a] px-[0.7em] py-[0.3em] text-right tabular-nums">{d.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="w-full border-collapse text-[1em]">
        <tbody>
          <tr>
            <td className="border-[2px] border-[#1a1a1a] px-[0.7em] py-[0.45em] font-bold">Net pay</td>
            <td className="border-[2px] border-[#1a1a1a] px-[0.7em] py-[0.45em] text-right text-[1.25em] font-bold tabular-nums">
              {doc.netPay}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default function PdfReaderClient() {
  const { pdfDocId, pdfDocToken } = useWindowManager();
  const [activeId, setActiveId] = useState(
    pdfDocId && PDF_DOCUMENTS.some((d) => d.id === pdfDocId) ? pdfDocId : PDF_DOCUMENTS[0].id
  );
  const [zoom, setZoom] = useState(100);
  const { nudge, say, dismiss } = useNudge();

  // A deep link (e.g. "open this pay stub" from the Portal) requests a doc -
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
  const scale = zoom / 100;
  const notAvailable = () => say("That's not available in this practice space. Just look and read here.");

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-surface-muted">
      <div className="flex items-center gap-3 border-b border-border bg-white px-4 py-2">
        <PdfIcon size={28} />
        <span className="text-[15px] font-medium">PDF Reader</span>
        <div className="flex-1" />
        <WindowControls appKey="pdf" />
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="flex w-[260px] shrink-0 flex-col border-r border-border bg-white">
          <div className="px-4 py-3 text-[13px] font-medium text-text-secondary">Downloads</div>
          <div className="flex-1 overflow-y-auto">
            {PDF_DOCUMENTS.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveId(d.id)}
                className={`flex w-full items-center gap-3 border-b border-surface-muted px-4 py-3 text-left cursor-pointer ${
                  d.id === activeId ? "bg-accent-tint" : "hover:bg-surface-muted"
                }`}
              >
                <span className="shrink-0 rounded bg-danger px-1.5 py-0.5 text-[10px] font-bold text-white">
                  PDF
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] text-text-primary">{d.name}</div>
                  <div className="text-[12px] text-text-tertiary">{d.size} · {d.date}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
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

          <div className="relative min-h-0 flex-1 bg-[#525659]">
            <div className="absolute inset-0 overflow-auto">
              <div
                className="flex justify-center"
                style={{ padding: 28, minWidth: "min-content" }}
              >
                <div
                  className="shrink-0"
                  style={{
                    width: `${LETTER.widthIn * scale}in`,
                    height: `${LETTER.heightIn * scale}in`,
                  }}
                >
                  <div
                    className="origin-top-left overflow-hidden bg-white"
                    style={{
                      width: `${LETTER.widthIn}in`,
                      height: `${LETTER.heightIn}in`,
                      transform: `scale(${scale})`,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.28), 0 8px 24px rgba(0,0,0,0.22)",
                    }}
                  >
                    <PdfPage>
                      {active.kind === "report" ? <ReportPage doc={active} /> : <PayStubPage doc={active} />}
                    </PdfPage>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NudgeToast text={nudge} bottom={SHELF_RESERVE + 16} onDismiss={dismiss} />
    </div>
  );
}

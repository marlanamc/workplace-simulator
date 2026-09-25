"use client";

import { useState } from "react";
import { PDF_DOCUMENTS } from "@/lib/pdf-content";
import { APP_COPY } from "@/lib/desktop-content";
import { SHELF_RESERVE } from "@/components/Shelf";
import WindowControls from "@/components/WindowControls";
import { useNudge } from "@/lib/use-nudge";
import NudgeToast from "@/components/task/NudgeToast";
import { useWindowManager } from "@/lib/window-manager";
import { useProgress } from "@/lib/progress-context";
import { PdfIcon } from "@/lib/icons";
import { PdfSheet } from "@/components/task/PdfSheet";

export default function PdfReaderClient() {
  const { pdfDocId, pdfDocToken } = useWindowManager();
  const { displayName, lang } = useProgress();
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
  const notAvailable = () =>
    say(
      lang === "en"
        ? "That's not available in this practice space. Just look and read here."
        : "Eso no está disponible en este espacio de práctica. Solo mira y lee aquí.",
    );

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-surface-muted">
      <div className="flex items-center gap-3 border-b border-border bg-white px-4 py-2">
        <PdfIcon size={28} />
        <span className="text-[15px] font-medium">
          {APP_COPY[lang].pdf.name}
        </span>
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
                <PdfSheet
                  doc={active}
                  scale={scale}
                  employeeName={active.id === "paystub-first" ? displayName : undefined}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <NudgeToast text={nudge} bottom={SHELF_RESERVE + 16} onDismiss={dismiss} />
    </div>
  );
}

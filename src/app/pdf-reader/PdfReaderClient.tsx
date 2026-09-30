"use client";

import { useEffect, useRef, useState } from "react";
import { PDF_ARRIVES_WITH, PDF_DOCUMENTS as ALL_PDF_DOCUMENTS } from "@/lib/pdf-content";
import { useLesson } from "@/lib/lesson-context";
import { levelReached } from "@/lib/story-calendar";
import { fileDateLabel } from "@/lib/story-dates";
import { levelForTrack } from "@/lib/tracks-content";
import { APP_COPY, PDF_READER_CHROME } from "@/lib/desktop-content";
import { SHELF_RESERVE } from "@/components/Shelf";
import WindowControls from "@/components/WindowControls";
import { useNudge } from "@/lib/use-nudge";
import NudgeToast from "@/components/task/NudgeToast";
import { useWindowManager } from "@/lib/window-manager";
import { useProgress } from "@/lib/progress-context";
import { PdfIcon } from "@/lib/icons";
import { PdfSheet } from "@/components/task/PdfSheet";
import { fitZoom, stepZoom } from "@/lib/pdf-zoom";
import { SCHEDULE_DOWNLOADED_FLAG, NEXT_SCHEDULE_DOC, THIS_SCHEDULE_DOC } from "@/lib/tasks/upload-schedule/content";

export default function PdfReaderClient() {
  const { pdfDocId, pdfDocToken } = useWindowManager();
  const { displayName, lang, courseRoute, currentTrack, completedTaskKeys, storyFlags } = useProgress();
  const lesson = useLesson();
  // Only the files that have arrived by this sitting. A lesson has no story, so it shows them all.
  const here = levelForTrack(currentTrack.key).key;
  // Day 10's schedules: this week's was already here; next week's arrives
  // when the learner downloads it from Renata's email.
  const nextScheduleHere = storyFlags[SCHEDULE_DOWNLOADED_FLAG] === "true" || completedTaskKeys.includes("upload-schedule");
  const PDF_DOCUMENTS = lesson
    ? ALL_PDF_DOCUMENTS
    : [
        ...ALL_PDF_DOCUMENTS.filter((d) => !PDF_ARRIVES_WITH[d.id] || levelReached(courseRoute, here, PDF_ARRIVES_WITH[d.id])),
        ...(levelReached(courseRoute, here, "level5") ? [THIS_SCHEDULE_DOC] : []),
        ...(nextScheduleHere ? [NEXT_SCHEDULE_DOC] : []),
      ];
  const [activeId, setActiveId] = useState(
    pdfDocId && PDF_DOCUMENTS.some((d) => d.id === pdfDocId) ? pdfDocId : PDF_DOCUMENTS[0].id
  );
  // The learner's own zoom, once they press + or −. Until then the page opens
  // at the width the pane has (100% when it fits), so a narrow Reader beside
  // the docked Job Card does not cut the page off at the side (Phase 3 N-9).
  const [zoom, setZoom] = useState<number | null>(null);
  const [fit, setFit] = useState(100);
  const pane = useRef<HTMLDivElement>(null);
  const sheetRoom = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = pane.current;
    const room = sheetRoom.current;
    if (!el || !room) return;
    const measure = () => {
      const pad = parseFloat(getComputedStyle(room).paddingLeft) + parseFloat(getComputedStyle(room).paddingRight);
      if (el.clientWidth > 0) setFit(fitZoom(el.clientWidth, pad));
    };
    const size = new ResizeObserver(measure);
    size.observe(el);
    return () => size.disconnect();
  }, []);
  const shownZoom = zoom ?? fit;
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

  const t = PDF_READER_CHROME[lang];
  const active = PDF_DOCUMENTS.find((d) => d.id === activeId)!;
  const scale = shownZoom / 100;
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

      {/* A narrow Reader (beside the docked Job Card at 150%) puts Downloads in
          a strip above the page, so the page gets the whole width. */}
      <div className="@container flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col @[720px]:flex-row">
        <div data-pdf-downloads className="flex shrink-0 flex-col border-b border-border bg-white @[720px]:w-[260px] @[720px]:border-r @[720px]:border-b-0">
          <div className="px-4 pt-2 text-[13px] font-medium text-text-secondary @[720px]:py-3">{t.downloads}</div>
          <div className="flex overflow-x-auto @[720px]:block @[720px]:flex-1 @[720px]:overflow-y-auto">
            {PDF_DOCUMENTS.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveId(d.id)}
                className={`flex w-auto shrink-0 items-center gap-3 border-surface-muted px-4 py-2 text-left cursor-pointer @[720px]:w-full @[720px]:border-b @[720px]:py-3 ${
                  d.id === activeId ? "bg-accent-tint" : "hover:bg-surface-muted"
                }`}
              >
                <span className="shrink-0 rounded bg-danger px-1.5 py-0.5 text-[10px] font-bold text-white">
                  PDF
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] text-text-primary">{d.name}</div>
                  <div className="text-[12px] text-text-tertiary">{d.size} · {fileDateLabel(d.date, lang)}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-center gap-1 border-b border-[#3a3d40] bg-[#323639] px-3 py-1.5">
            <span className="mr-3 truncate text-[13px] text-white/80">{active.name}</span>
            <button
              onClick={() => setZoom(stepZoom(shownZoom, -1))}
              className="flex h-7 w-7 items-center justify-center rounded text-[15px] text-white/85 hover:bg-white/10 cursor-pointer"
              aria-label={t.zoomOut}
            >
              −
            </button>
            <span data-pdf-zoom className="w-11 text-center text-[12px] text-white/85">{shownZoom}%</span>
            <button
              onClick={() => setZoom(stepZoom(shownZoom, 1))}
              className="flex h-7 w-7 items-center justify-center rounded text-[15px] text-white/85 hover:bg-white/10 cursor-pointer"
              aria-label={t.zoomIn}
            >
              +
            </button>
            <span className="mx-2 h-4 w-px bg-white/20" />
            <span className="whitespace-nowrap text-[12px] text-white/70">{t.page} 1 / 1</span>
            <span className="mx-2 h-4 w-px bg-white/20" />
            <button
              onClick={notAvailable}
              className="flex h-7 w-7 items-center justify-center rounded text-[14px] text-white/85 hover:bg-white/10 cursor-pointer"
              aria-label={t.print}
              title={t.print}
            >
              ⎙
            </button>
            <button
              onClick={notAvailable}
              className="flex h-7 w-7 items-center justify-center rounded text-[14px] text-white/85 hover:bg-white/10 cursor-pointer"
              aria-label={t.download}
              title={t.download}
            >
              ⬇
            </button>
          </div>

          <div className="relative min-h-0 flex-1 bg-[#525659]">
            <div ref={pane} data-pdf-pane className="absolute inset-0 overflow-auto">
              <div
                ref={sheetRoom}
                className="flex justify-center p-4 @[720px]:p-7"
                style={{ minWidth: "min-content" }}
              >
                <PdfSheet
                  doc={active}
                  scale={scale}
                  employeeName={displayName}
                />
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

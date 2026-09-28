"use client";

import { useRef, useState } from "react";
import type { Lang } from "@/lib/task-types";

/** The real Sheets path for sending a message about a shared spreadsheet. */
export default function SheetEmailMenu({ lang, onEmail, showMeId }: {
  lang: Lang;
  onEmail: () => void;
  showMeId?: string;
}) {
  const [open, setOpen] = useState<"closed" | "file" | "email">("closed");
  const file = useRef<HTMLButtonElement>(null);
  return (
    <div className="relative z-10 shrink-0 border-b border-[#dadce0] bg-[#f9fbfd] px-3"
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen("closed"); }}
      onKeyDown={event => {
        if (event.key === "Escape") { setOpen("closed"); file.current?.focus(); }
      }}>
      <button ref={file} type="button" data-showme={showMeId} aria-expanded={open !== "closed"}
        onClick={() => setOpen(open === "closed" ? "file" : "closed")}
        className="min-h-10 rounded px-3 text-sm hover:bg-[#e8eaed]">
        {lang === "en" ? "File" : "Archivo"}
      </button>
      {open !== "closed" && <div className="absolute left-3 top-full min-w-60 rounded-b border border-[#dadce0] bg-white p-1 shadow-lg">
        <button type="button" aria-expanded={open === "email"} onClick={() => setOpen(open === "email" ? "file" : "email")}
          className="min-h-11 w-full px-3 text-left text-sm hover:bg-[#e8eaed]">
          {lang === "en" ? "Email" : "Correo electrónico"} <span aria-hidden="true">▸</span>
        </button>
        {open === "email" && <button type="button" onClick={() => { setOpen("closed"); onEmail(); }}
          className="min-h-11 w-full pl-6 pr-3 text-left text-sm hover:bg-[#e8eaed]">
          {lang === "en" ? "Email collaborators" : "Enviar correo a colaboradores"}
        </button>}
      </div>}
    </div>
  );
}

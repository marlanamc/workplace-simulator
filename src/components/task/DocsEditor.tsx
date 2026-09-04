"use client";

import type { ReactNode } from "react";

/**
 * A minimal Google Docs *editor* — the blue Docs mark, a File/Edit/View menu
 * row, a font/B/I/U toolbar, and a white US-Letter-ish page on a grey ground
 * with a title line and a body area. `HandbookTask` is a Docs *reader*; this is
 * the write side, for tasks that ask the learner to draft a document
 * (`ops-report-packet`'s weekly summary).
 *
 * The body is a `<textarea>` styled to sit on the page like document text, not
 * a boxed form field. State stays with the caller.
 */

const MENU = ["File", "Edit", "View", "Insert", "Format", "Tools"];
const MENU_ES = ["Archivo", "Editar", "Ver", "Insertar", "Formato", "Herramientas"];

export default function DocsEditor({
  docTitle,
  body,
  onBody,
  placeholder,
  lang = "en",
  children,
}: {
  /** The document's own title, shown as the page heading (not editable here). */
  docTitle: string;
  body: string;
  onBody: (value: string) => void;
  placeholder: string;
  lang?: "en" | "es";
  /** Extra controls under the page (e.g. sentence starters, a Save button). */
  children?: ReactNode;
}) {
  const menu = lang === "es" ? MENU_ES : MENU;
  return (
    <div
      className="flex h-full min-h-0 flex-col bg-[#f9fbfd] text-[14px] text-[#202124]"
      style={{ fontFamily: "Roboto, Arial, sans-serif" }}
    >
      <div className="flex items-center gap-2 border-b border-[#e0e0e0] bg-white px-2 pt-1">
        <span className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#1a73e8] text-white">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" fill="#aecbfa" />
            <path d="M8 13h8v1.4H8zm0 3h8v1.4H8zm0-6h5v1.4H8z" />
          </svg>
        </span>
        <div className="min-w-0 flex-1 pb-1">
          <div className="text-[17px] leading-tight text-[#202124]">{docTitle}</div>
          <div className="-ml-1 flex flex-wrap items-center text-[13px] text-[#444746]">
            {menu.map((item) => (
              <span key={item} className="rounded px-2 py-0.5">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-2 my-1 flex h-9 items-center gap-1 rounded-full bg-[#edf2fa] px-3 text-[13px] text-[#444746]">
        <span className="rounded px-2 py-0.5">Arial</span>
        <span className="h-5 w-px bg-[#dadce0]" />
        <span className="px-1">11</span>
        <span className="h-5 w-px bg-[#dadce0]" />
        <span className="px-1.5 font-bold">B</span>
        <span className="px-1.5 italic">I</span>
        <span className="px-1.5 underline">U</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto py-6">
        <div className="mx-auto w-[min(720px,92%)] rounded-sm bg-white px-[72px] py-16 shadow-[0_1px_3px_rgba(60,64,67,.25)]">
          <h1 className="text-[26px] font-normal leading-tight text-[#202124]">{docTitle}</h1>
          <textarea
            value={body}
            onChange={(e) => onBody(e.target.value)}
            placeholder={placeholder}
            className="mt-4 min-h-[180px] w-full resize-y border-none bg-transparent text-[15px] leading-[1.7] outline-none placeholder:text-[#9aa0a6]"
          />
          {children && <div className="mt-4">{children}</div>}
        </div>
      </div>
    </div>
  );
}

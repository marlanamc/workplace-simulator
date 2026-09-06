"use client";

import type { Lang } from "@/lib/desktop-content";
import type { DeskIdentity } from "@/lib/desk-identity";

/**
 * Name, title, and company under the lock-screen clock — a quiet sticky note
 * of who they are in the story, not a second instruction voice.
 */
export default function DesktopIdentity({
  name,
  identity,
  lang,
}: {
  name: string;
  identity: DeskIdentity;
  lang: Lang;
}) {
  const display = name.trim();
  if (!display) return null;

  return (
    <aside
      data-testid="desktop-identity"
      aria-label={`${display}, ${identity.title[lang]}, ${identity.company}`}
      className="relative mt-6 w-[min(100%,220px)] -rotate-[1.25deg] rounded-[2px] px-4 pb-4 pt-5"
      style={{
        background:
          "linear-gradient(165deg, #fff8e8 0%, #f6edd4 55%, #efe4c8 100%)",
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.55) inset, 0 10px 22px rgba(28,16,10,0.22), 0 2px 4px rgba(28,16,10,0.12)",
      }}
    >
      {/* Soft tape strip — holds the note to the desktop */}
      <span
        aria-hidden
        className="absolute -top-2 left-1/2 h-3 w-14 -translate-x-1/2 rounded-[1px]"
        style={{
          background: "rgba(255, 248, 220, 0.55)",
          boxShadow: "0 1px 2px rgba(28,16,10,0.12)",
        }}
      />
      <p className="m-0 text-[15px] font-semibold leading-snug tracking-[-0.01em] text-[#2a2118]">
        {display}
      </p>
      <p className="m-0 mt-1.5 text-[13px] font-medium leading-snug text-[#5a4a38]">
        {identity.title[lang]}
      </p>
      <p className="m-0 mt-0.5 text-[12px] font-normal leading-snug text-[#7a6a56]">
        {identity.company}
      </p>
    </aside>
  );
}
